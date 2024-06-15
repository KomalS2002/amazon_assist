from fastapi import FastAPI,APIRouter,Depends, status, File, UploadFile
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
load_dotenv()
from g4f.client import Client
from g4f.Provider.GeminiPro import GeminiPro

client = Client()
gemini_api_key = os.getenv("GEMINI_API_KEY")
clientimage = Client(provider=GeminiPro, api_key=gemini_api_key)




router = APIRouter()

set_lang_english = "Reply in English; "
text_prompt_instructions = ";   identify the products described here and generated keywords related to the product which will help in searching the product on amazon (return the result as json in the format product:{keywords}) (if no products are found then return response as product:{-1}) ONLY RETURN THE JSON DO NO WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON"
image_identify_prompt_instructions = ";   identify the products present here and generated keywords related to the product which will help in searching the product on amazon like build color style design DO NOT DECRIBE THE IMAGE JUST WRITE THE KEYWORDS FOR THE DIFFERENT ITEMS PRESENT IN THE IMAGE (return the result as json in the format product:{keywords}) (if no products are found then return response as product:{-1}) ONLY RETURN THE JSON DO NO WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON ONLY WRITE KEYWORDS"
image_identify_prompt_instructions2 = ";   (return the result as json where each product is the key and its keywrds are the value) (discard any prduct for which proper keywords are not found) (if no products are found then return response as product:{-1}) ONLY RETURN THE JSON DO NO WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON ONLY WRITE KEYWORDS"


def extract_json(input_string):
    # Regex to find JSON inside markdown
    json_pattern = re.compile(r'```json\n(.*?)\n```', re.DOTALL)
    match = json_pattern.search(input_string)
    
    if match:
        json_string = match.group(1)
    else:
        # Fallback: find dictionary-like JSON directly in the input string
        dict_pattern = re.compile(r'\{\s*"(.*?)\s*"\}')
        match = dict_pattern.search(input_string)
        if match:
            json_string = input_string.strip()
        else:
            return None

    try:
        # Parsing the JSON string
        parsed_json = json.loads(json_string)
        return parsed_json
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        return None

@router.post("/text")
async def textToDesc(request : textDescModel):
    """
    request format:
    {
    "text":"text_to_be_processed"
    }
    """
    if (request.text):
        ntpi= "; extract keywords related to each object described here and list them according to the object (only get inanimate objects that poeple can buy like chair table desk etc)"
        prompt = set_lang_english+request.text+ntpi
        print(prompt)
        response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": {prompt}}],
    )

        if (response.choices[0].message.content):
            response_json = response.choices[0].message.content
            print("#####################")
            print(response_json)
            response_json = extract_json(response_json)
            if (response_json):
                return response_json # Using the default Status code i.e. Status 200
            else:
                msg = [
                        {"message": "Incorrect data/missing data"}
                       ]
                return JSONResponse(content=jsonable_encoder(msg), status_code = status.HTTP_400_BAD_REQUEST )


        else:
            return f"Error: {response.status_code}, {response.text}"
    else:
        msg = [
        {"message": "Incorrect data/missing data"}
        ]
        return JSONResponse(content=jsonable_encoder(msg), status_code = status.HTTP_400_BAD_REQUEST )
    

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Save the uploaded file locally
        upload_folder = Path("uploaded_images")
        upload_folder.mkdir(exist_ok=True)
        file_path = upload_folder / file.filename
        
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Use the image with g4f.client
        with file_path.open("rb") as img:
            prompt = set_lang_english+image_identify_prompt_instructions
            response = clientimage.chat.completions.create(
                model="gemini-pro-vision",
                messages=[{"role": "user", "content": "{prompt}"}],
                image=img
            )
        
        # Extract the response content
        response_content = response.choices[0].message.content
        
        # Delete the locally saved image
        file_path.unlink()
        
       
        ntpi= "; extract keywords related to each object described here and list them according to the object (only get inanimate objects that poeple can buy like chair table desk etc)"
        prompt = set_lang_english+ response_content+ntpi+image_identify_prompt_instructions2
        
        response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": {prompt}}],
    )

        if (response.choices[0].message.content):
            response_json = response.choices[0].message.content
            print(response_json)
            response_json = extract_json(response_json)
            if (response_json):
                return response_json # Using the default Status code i.e. Status 200
            else:
                msg = [
                        {"message": "Incorrect data/missing data"}
                       ]
                return JSONResponse(content=jsonable_encoder(msg), status_code = status.HTTP_400_BAD_REQUEST )


        else:
            return f"Error: {response.status_code}, {response.text}"
        

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
      
