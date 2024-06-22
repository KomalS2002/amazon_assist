# amazon_assist
  This repository contains a web application and a Chrome extension. This project was developed for **Amazon Hackon Season 4** by our team  **to Infinity and Beyond**.
 To konw about the features and usage of complete project  - [click here](./Intoduction.md)

 > ## Installation
 clone this repository 
 - `git clone https://github.com/KomalS2002/amazon_assist.git`

- open in any text editor 
-  `cd amazon_assist`
> ## 1. Web application

### a. backend
1. `cd backend`

2. create a virtual environment
- `python -m venv env`

for linux / MacOS
- `source env/bin/activate`
for windows
- `.\env\Scripts\activate`

- `pip install -r requirements.txt`
3. make a .env file in /backend
> ### Database Configuration

This project utilizes a PostgreSQL database. Below are the necessary credentials and configuration details provided by Render:

- *Database Host*: dbhost
- *Database Username*: dbusername
- *Database Password*: dbpassword
- *Database Name*: dbname

### AWS Configuration

The project also requires AWS credentials for accessing various AWS services. Below are the necessary details provided by the AWS website:

- *AWS Access Key*: your_aws_access_key
- *AWS Secret Key*: your_aws_secret_key
- *S3 Bucket Name*: your_bucket_name
- *Region*: your_aws_region

### Google Cloud Configuration

The project also requires Google Cloud credentials for accessing Google Cloud services. Below are the necessary details provided by the Google Cloud Console:

- *Google Cloud Client ID*: your_google_cloud_client_id
- *Google Cloud Client Secret*: your_google_cloud_client_secret

- add all these keys into .env file.



4. `uvicorn main:app --reload`


### b. frontend
- `cd frontend`
- `npm install`
- `npm start`



> ## 2. Chrome extension
1. Open Chrome and navigate to the Extensions page.
2. Toggle the "Developer mode" switch in the top-right corner of the Extensions page.
3. Click the "Load unpacked" button and select the directory containing the cloned repository.

# Thank You !!! 

### Home page
![Home](/frontend/public/home.png)
### Text Search
![Text Search](/frontend/public/text.png)
### Image Search
![Image Search](/frontend/public/image.png)
### Video Search
![Video Search](/frontend/public/video.png)
### webpage text search
![Webpage text search](/frontend/public/webpage.jpeg)
### Youtube video search
![Youtube video search](/frontend/public/youtube.jpeg)
