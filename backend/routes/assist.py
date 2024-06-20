from fastapi import FastAPI, APIRouter, Depends, status, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import requests
import json
import shutil
import re
import os
from pathlib import Path
from dotenv import load_dotenv
from models.text_to_desc import textDescModel
from g4f.client import Client 
from g4f.Provider.GeminiPro import GeminiPro 
from g4f.Provider.GeminiProChat import GeminiProChat
from database.dbconnect import get_db,Base
from sqlalchemy.orm import Session
from models.user import Users
from authUtils.JWTBearer import JWTBearer
from PIL import Image
import io
from fastapi.encoders import jsonable_encoder
import time
from g4f.Provider.FreeChatgpt import FreeChatgpt

router = APIRouter()
load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
huggingface_api_key = os.getenv("HUGGINGFACE_API_KEY")

# Initialize the client with the GeminiPro provider
client = Client(provider=GeminiProChat,api_key=gemini_api_key)
clientimage = Client(provider=GeminiPro, api_key=gemini_api_key)

# Prompts
set_lang_english = "Reply only in English; "
text_prompt_instructions = "; identify the products described here and generate keywords related to the product which will help in searching the product on Amazon (return the result as JSON in the format product:{keywords}) (if no products are found then return response as product:{-1}) ONLY RETURN THE JSON DO NOT WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON"
image_identify_prompt_instructions = "; identify the products present here and generate keywords related to the product which will help in searching the product on Amazon like build, color, style, design. DO NOT DESCRIBE THE IMAGE JUST WRITE THE KEYWORDS FOR THE DIFFERENT ITEMS PRESENT IN THE IMAGE (return the result as JSON in the format product:{keywords}) (if no products are found then return response as product:{-1}) ONLY RETURN THE JSON DO NOT WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON ONLY WRITE KEYWORDS"
image_identify_prompt_instructions2 = "; (return the result as JSON where the actual name of each item is the key and the keywords decribing its characteristics are the value) (discard any product for which proper keywords are not found) (if no products are found then return response as message:{-1}) ONLY RETURN THE JSON DO NOT WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON ONLY WRITE KEYWORDS"



HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
headers = {"Authorization": f"Bearer {huggingface_api_key}"}

def query(payload, max_retries=3, retry_delay=1000):
    retries = 0
    while retries < max_retries:
        response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload)
        if response.status_code == 503:
            # Model is currently loading, wait and retry
            wait_time = retry_delay * (2 ** retries)
            print(f"Model is currently loading. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
            retries += 1
        elif response.status_code == 200:
            return response.content
        else:
            print(f"Error: {response.status_code}, {response.text}")
            return None
    
    print(f"Failed after {max_retries} retries.")
    return None

def save_image(image_bytes, item_name):
    image_path = f"images/{item_name.replace(' ', '_')}.png"
    os.makedirs(os.path.dirname(image_path), exist_ok=True)
    with open(image_path, 'wb') as f:
        f.write(image_bytes)
    return image_path

def convert_to_dict(json_data):
    # Convert json_data from string-value format to dict format
    dict_data = []
    for item_name, tags_str in json_data.items():
        tags = [tag.strip() for tag in tags_str.split(',')]
        dict_data.append({item_name: tags})
    return dict_data

def generate_images_from_json(json_data):
    new_json = {}
    for item in json_data:
        if item: 
            # item_name = next(iter(item))  # Get the key (item name) from the dictionary
            tags = json_data[item]  # Get the value (list of tags) from the dictionary
            
            prompt = f"{item}: {', '.join(tags)}"
            # prompt = "generate cat image"
            print(prompt)
            image_bytes = query({"inputs": prompt})
            
            if image_bytes:
                try:
                    image = Image.open(io.BytesIO(image_bytes))
                    image_link = save_image(image_bytes, item)
                    
                    new_json[item] = {
                        "tags": ', '.join(tags),
                        "image_link": image_link
                    }

                except IOError:
                    print(f"Error: Could not generate image for {item}")
                    new_json[item] = {
                        "tags": ', '.join(tags),
                        "image_link": "Error: Image could not be generated"
                    }
        else:
            print(f"Error: Invalid item format in json_data: {item}")
    
    return new_json


def extract_json(input_string):
    try:
        parsed_json = json.loads(input_string)
        return parsed_json
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        return None

# 
#after testing comment out below line
# def textToDesc(request: textDescModel,db: Session = Depends(get_db),user: Users = Depends(JWTBearer())):

@router.post("/text")
def textToDesc(request: textDescModel):
    if request.text:
        ntpi= '; extract keywords related to each object described here and list them like this: {"Product name 1": ["feature 1","Feature 2","feature 3"],"Product name 2": ["feature 1","Feature 2","feature 3"],"Product name 3": ["feature 1","Feature 2","feature 3"],}'
        prompt = request.text + ntpi
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )

        if response.choices[0].message.content:
            response_json = response.choices[0].message.content
            print(response_json)
            response_json = extract_json(response_json)
            if response_json:
                newjson = generate_images_from_json(response_json)
                print(newjson)
                return newjson  # Using the default Status code i.e. Status 200
            else:
                msg = [{"message": "Incorrect data/missing data"}]
                return JSONResponse(content=jsonable_encoder(msg), status_code=status.HTTP_404_NOT_FOUND)
        else:
            return f"Error: {response.status_code}, {response.text}"
    else:
        msg = [{"message": "Incorrect data/missing data"}]
        return JSONResponse(content=jsonable_encoder(msg), status_code=status.HTTP_404_NOT_FOUND)
    




#after testing comment out below line
# def upload_image(file: UploadFile = File(...),db: Session = Depends(get_db),user: Users = Depends(JWTBearer())): 
@router.post("/image")
def upload_image(file: UploadFile = File(...)):
    try:
        tempdict = {}
        tempdict["Modern lamps"] = {"tags": "minimalist, contemporary, stylish, elegant, inviting, cozy", "image_link": "images/Modern_lamps.png"}
        tempdict["Table lamps with multiple bulbs"] = {"tags": "reading, working, bed, light, stylish, romantic",    "image_link": "images/Table_lamps_with_multiple_bulbs.png"}
        return JSONResponse(content=(tempdict), status_code=status.HTTP_200_OK)
        # Save the uploaded file locally
        upload_folder = Path("uploaded_images")
        upload_folder.mkdir(exist_ok=True)
        file_path = upload_folder / file.filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
       
        # Use the image with g4f.client
        with file_path.open("rb") as img:
            ntpi= "; extract keywords related to each object described here and list them according to the object (only get inanimate objects that people can buy)"
            prompt = set_lang_english+ntpi+"convert all text in response in English"
            
            response = clientimage.chat.completions.create(
                model="gemini-pro-vision",
                messages=[{"role": "user", "content": prompt}],
                image=img
            )
     
        # Extract the response content
        response_content = response.choices[0].message.content
        print("##################")
        print(response_content)
        # Delete the locally saved image
        file_path.unlink()
        
       
        ntpi= "; extract keywords related to each object described here and list them according to the object (only get inanimate objects that poeple can buy like chair table desk etc)"
        prompt = set_lang_english+ response_content+image_identify_prompt_instructions2
        print("^^^^^^^^^^^^^^^^^^^")
        print(response_content)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )

        if response.choices[0].message.content:
            response_json = response.choices[0].message.content
            print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            print(response_json)
            response_json = extract_json(response_json)
            if response_json:
                new_json = generate_images_from_json(response_json)
                return new_json  # Using the default Status code i.e. Status 200
            else:
                msg = [{"message": "Incorrect data/missing data"}]
                return JSONResponse(content=jsonable_encoder(msg), status_code=status.HTTP_400_BAD_REQUEST)
        else:
            return f"Error: {response.status_code}, {response.text}"

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

