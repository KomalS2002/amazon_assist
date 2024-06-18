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

# Load environment variables
load_dotenv()

# Initialize the client with the GeminiPro provider
client = Client()
gemini_api_key = os.getenv("GEMINI_API_KEY")
clientimage = Client(provider=GeminiPro, api_key=gemini_api_key)

# Initialize FastAPI and APIRouter
app = FastAPI()
router = APIRouter()

# Prompts
set_lang_english = "Reply in English; "
text_prompt_instructions = "; identify the products described here and generate keywords related to the product which will help in searching the product on Amazon (return the result as JSON in the format product:{keywords}) (if no products are found then return response as product:{-1}) ONLY RETURN THE JSON DO NOT WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON"
image_identify_prompt_instructions = "; identify the products present here and generate keywords related to the product which will help in searching the product on Amazon like build, color, style, design. DO NOT DESCRIBE THE IMAGE JUST WRITE THE KEYWORDS FOR THE DIFFERENT ITEMS PRESENT IN THE IMAGE (return the result as JSON in the format product:{keywords}) (if no products are found then return response as product:{-1}) ONLY RETURN THE JSON DO NOT WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON ONLY WRITE KEYWORDS"
image_identify_prompt_instructions2 = "; (return the result as JSON where each product name is the key and the keywords decribing its characteristics are the value) (discard any product for which proper keywords are not found) (if no products are found then return response as product:{-1}) ONLY RETURN THE JSON DO NOT WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON ONLY WRITE KEYWORDS"

def extract_json(input_string):
    try:
        parsed_json = json.loads(input_string)
        return parsed_json
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        return None

@router.post("/text")
def textToDesc(request: textDescModel):
    """
    Request format:
    {
        "text": "text_to_be_processed"
    }
    """
    if (request.text):
        ntpi= "; extract keywords related to each object described here and list them according to the object (only get inanimate objects that people can buy)"
        prompt = set_lang_english+request.text+image_identify_prompt_instructions2
        print(prompt)
        response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": {prompt}}],
    )
        print(response.choices[0].message.content)
        if (response.choices[0].message.content):
            response_json = response.choices[0].message.content
            response_json = extract_json(response_json)
            if response_json:
                return response_json  # Using the default Status code i.e. Status 200
            else:
                msg = [{"message": "Incorrect data/missing data"}]
                return JSONResponse(content=jsonable_encoder(msg), status_code=status.HTTP_400_BAD_REQUEST)
        else:
            return f"Error: {response.status_code}, {response.text}"
    else:
        msg = [{"message": "Incorrect data/missing data"}]
        return JSONResponse(content=jsonable_encoder(msg), status_code=status.HTTP_400_BAD_REQUEST)

@router.post("/image")
def upload_image(file: UploadFile = File(...)):
    try:
        # Save the uploaded file locally
        upload_folder = Path("uploaded_images")
        upload_folder.mkdir(exist_ok=True)
        file_path = upload_folder / file.filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Use the image with g4f.client
        with file_path.open("rb") as img:
            prompt = set_lang_english+image_identify_prompt_instructions2
            response = clientimage.chat.completions.create(
                model="gemini-pro-vision",
                messages=[{"role": "user", "content": prompt}],
                image=img
            )

        # Extract the response content
        response_content = response.choices[0].message.content

        # Delete the locally saved image
        file_path.unlink()
        
        print(response_content)
        ntpi= "; extract keywords related to each object described here and list them according to the object (only get inanimate objects that poeple can buy like chair table desk etc)"
        prompt = set_lang_english+ response_content+ntpi+image_identify_prompt_instructions2
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )

        if response.choices[0].message.content:
            response_json = response.choices[0].message.content
           
            response_json = extract_json(response_json)
            if response_json:
                return response_json  # Using the default Status code i.e. Status 200
            else:
                msg = [{"message": "Incorrect data/missing data"}]
                return JSONResponse(content=jsonable_encoder(msg), status_code=status.HTTP_400_BAD_REQUEST)
        else:
            return f"Error: {response.status_code}, {response.text}"

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

app.include_router(router)