from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Literal

BASE_DIR = Path(__file__).resolve().parent
model = joblib.load(BASE_DIR/ "Predicting Student Mental Health Score.pkl")

top_countries = [
    'Other',
    'India',
    'USA',
    'Canada',
    'Australia',
    'UK',
    'Germany',
    'Mexico',
    'Turkey',
    'France'
    ]

app = FastAPI()

class StudentData(BaseModel):
    Age:                     int = Field(..., ge=10, le=100)
    Gender :                 Literal["Male", "Female", "Other"]
    Country :                str
    Academic_Level:          Literal["Undergraduate", "Graduate", "High School"]
    Most_Used_Platform:      Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter',
       'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp',
       'WeChat']
    Purpose_Of_Use :         Literal['Networking', 'Education', 'Entertainment', 'News']
    Avg_Daily_Usage_Hours :  float = Field(..., ge=0, le=24)
    Daily_Unlocks:           int  = Field(..., ge=0)
    Study_Hours:             float = Field(..., ge=0, le=24)
    Physical_Activity_Hours: float = Field(..., ge=0, le=24)
    Sleep_Hours_Per_Night:   float = Field(..., ge=0, le=24)
    Stress_Level:            Literal['Medium', 'Low', 'Very High', 'High']

class PredictionResponse(BaseModel):
    predicted_mental_health_score:float
    label: str

@app.post("/predict", response_model= PredictionResponse)
def predict(data: StudentData):

    country_group = data.Country if data.Country in top_countries else "Other"
    input_row = pd.DataFrame([{
        "Age": data.Age,
        "Gender": data.Gender,
        "Country": data.Country,
        "Academic_Level": data.Academic_Level,
        "Most_Used_Platform": data.Most_Used_Platform,
        "Purpose_Of_Use": data.Purpose_Of_Use,
        "Avg_Daily_Usage_Hours": data.Avg_Daily_Usage_Hours,
        "Daily_Unlocks":data.Daily_Unlocks ,
        "Study_Hours": data.Study_Hours,
        "Physical_Activity_Hours": data.Physical_Activity_Hours,
        "Sleep_Hours_Per_Night": data.Sleep_Hours_Per_Night,
        "Stress_Level": data.Stress_Level,
        "Grouped_Country": country_group
    }])

    prediction = model.predict(input_row)[0]
    score = round(float(prediction), 2)

    if score < 6:
     label = "Bad"
    elif score < 8:
     label = "Good"
    else:
     label = "Excellent"

    return PredictionResponse(
    predicted_mental_health_score=score,
    label=label
) 


# Frontend (served from the same service, so no CORS setup is needed)
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
 
 
@app.get("/", include_in_schema=False)
def index():
    return FileResponse(BASE_DIR / "static" / "index.html")