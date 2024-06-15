from fastapi import FastAPI,APIRouter,Depends, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import requests
import json
import re
import os
from dotenv import load_dotenv
from models.text_to_desc import textDescModel
load_dotenv()
from g4f.client import Client

client = Client()






router = APIRouter()
api_key = os.getenv('OPENAI_API_KEY')
text_url = "https://api.openai.com/v1/completions"
headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
set_lang_english = "Reply in English; "
text_prompt_instructions = ";   identify the products described here and generated keywords related to the product which will help in searching the  product on amazon (return the result as json in the format product:{keywords}) (if no products are found then return response as product:{-1}) ONLY RETURN THE JSON DO NO WRITE ANYTHING ELSE NOT A SINGLE WORD EXTRA JUST THE JSON"


def extract_json(input_string):
    # Using regex to extract the JSON part
    json_pattern = re.compile(r'```json\n(.*?)\n```', re.DOTALL)
    match = json_pattern.search(input_string)
    if match:
        json_string = match.group(1)
        try:
            # Parsing the extracted JSON string
            parsed_json = json.loads(json_string)
            return parsed_json
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return None
    else:
        # print("No JSON part found in the input string.")
        return None

@router.post("/text")
def textToDesc(request : textDescModel):
    """
    request format:
    {
    "text":"text_to_be_processed"
    }
    """
    if (request.text):
        prompt = set_lang_english+request.text+text_prompt_instructions
        
        response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": {prompt}}],
    )

        if (response.choices[0].message.content):
            response_json = response.choices[0].message.content
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
