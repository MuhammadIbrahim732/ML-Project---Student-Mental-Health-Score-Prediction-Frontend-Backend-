<div align="center">

# Student Mental Health Score Predictor

**A full-stack machine learning web app that estimates a student's mental health score from social media habits, daily routine and stress level.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-2ea44f?style=for-the-badge&logo=render&logoColor=white)](https://ml-project-student-mental-health-score-dcoe.onrender.com)

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6.1-F7931E?logo=scikitlearn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)

[Live Demo](https://ml-project-student-mental-health-score-dcoe.onrender.com) · [API Docs](https://ml-project-student-mental-health-score-dcoe.onrender.com/docs) · [Features](#features) · [Run Locally](#run-locally) · [API Reference](#api-reference)

</div>

---

## Live Demo

**App:** https://ml-project-student-mental-health-score-dcoe.onrender.com

**Interactive API docs (Swagger UI):** https://ml-project-student-mental-health-score-dcoe.onrender.com/docs

> The app runs on Render's free tier, which sleeps after a period of inactivity. If the page does not respond immediately, wait 30–60 seconds for the service to wake up.

<!-- Add a screenshot or GIF of the app here: -->
<!-- ![App screenshot](docs/screenshot.png) -->

## Overview

This project turns a trained regression model into a usable product. A user fills in a short form about a student's background, social media use and daily routine, and the app returns a predicted **mental health score from 0 to 10** with a rating of **Bad**, **Good** or **Excellent**.

It ships as a single service. A **FastAPI** backend validates input, runs the model and serves a **HTML / CSS / JavaScript** frontend, so there is only one thing to deploy and no CORS configuration to manage.

> **Disclaimer:** This is a statistical estimate based on survey-style data. It is a learning and portfolio project and is not a medical or diagnostic tool.

## Features

- **ML-powered predictions** from a trained scikit-learn pipeline loaded with `joblib`
- **Strict input validation** with Pydantic: typed fields, allowed categories and numeric bounds
- **Clean, responsive interface** with sliders, segmented controls, an animated score gauge and clear error messages
- **Single-service deployment** where the API and the frontend are served together
- **Auto-generated API docs** with Swagger UI at `/docs`
- **Health check endpoint** at `/health` for uptime monitoring
- **Accessible by default** with visible keyboard focus, labelled controls and reduced-motion support

## How It Works

```
┌──────────────┐   JSON    ┌───────────────────┐   DataFrame   ┌──────────────┐
│  Browser UI  │ ────────► │  FastAPI /predict │ ────────────► │  ML pipeline │
│ HTML/CSS/JS  │ ◄──────── │  Pydantic checks  │ ◄──────────── │   (.pkl)     │
└──────────────┘  score +  └───────────────────┘   prediction  └──────────────┘
                   label
```

1. The user submits the form and the browser sends the data as JSON to `POST /predict`.
2. Pydantic validates every field. Invalid input returns a descriptive `422` response.
3. Countries outside the main list are grouped into `Other` (`Grouped_Country`), matching how the model was trained.
4. The data is converted into a one-row DataFrame and passed to the pipeline.
5. The predicted score is rounded and mapped to a rating, then returned to the UI.

### Score ratings

| Score | Rating |
|---|---|
| Below 6 | **Bad** |
| 6 to below 8 | **Good** |
| 8 and above | **Excellent** |

## Input Features

| Feature | Type | Allowed values |
|---|---|---|
| `Age` | integer | 10 – 100 |
| `Gender` | category | Male, Female, Other |
| `Country` | text | Any country (uncommon ones are grouped as `Other`) |
| `Academic_Level` | category | High School, Undergraduate, Graduate |
| `Most_Used_Platform` | category | Facebook, LinkedIn, Instagram, Snapchat, Twitter, YouTube, TikTok, LINE, KakaoTalk, VKontakte, WhatsApp, WeChat |
| `Purpose_Of_Use` | category | Networking, Education, Entertainment, News |
| `Avg_Daily_Usage_Hours` | float | 0 – 24 |
| `Daily_Unlocks` | integer | 0 or more |
| `Study_Hours` | float | 0 – 24 |
| `Physical_Activity_Hours` | float | 0 – 24 |
| `Sleep_Hours_Per_Night` | float | 0 – 24 |
| `Stress_Level` | category | Low, Medium, High, Very High |

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12, FastAPI, Uvicorn |
| Validation | Pydantic |
| Machine learning | scikit-learn 1.6.1, Pandas, NumPy, Joblib |
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Deployment | Render |

## Project Structure

```
mental-health-app/
├── main.py                                       # FastAPI app: validation, prediction, static hosting
├── requirements.txt                              # Python dependencies (pinned scikit-learn)
├── render.yaml                                   # Render deployment blueprint
├── Predicting Student Mental Health Score.pkl    # Trained model pipeline
├── README.md
└── static/
    ├── index.html                                # Page structure
    ├── style.css                                 # Styling
    └── script.js                                 # Form handling and API calls
```

## Run Locally

**Prerequisites:** Python 3.12 (scikit-learn 1.6.1 does not support Python 3.14).

```bash
# 1. Clone the repository
git clone https://github.com/MuhammadIbrahim732/<your-repo>.git
cd <your-repo>

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the server
uvicorn main:app --reload
```

Then open:

- App: http://127.0.0.1:8000
- API docs: http://127.0.0.1:8000/docs

## API Reference

### `POST /predict`

**Request body**

```json
{
  "Age": 21,
  "Gender": "Female",
  "Country": "India",
  "Academic_Level": "Undergraduate",
  "Most_Used_Platform": "Instagram",
  "Purpose_Of_Use": "Entertainment",
  "Avg_Daily_Usage_Hours": 5.5,
  "Daily_Unlocks": 70,
  "Study_Hours": 3,
  "Physical_Activity_Hours": 1,
  "Sleep_Hours_Per_Night": 6.5,
  "Stress_Level": "Medium"
}
```

**Response `200 OK`**

```json
{
  "predicted_mental_health_score": 6.8,
  "label": "Good"
}
```

**Response `422 Unprocessable Entity`** is returned when a field is missing, out of range or not an allowed value.

### `GET /health`

Returns `{"status": "ok"}`. Render uses it as a health check.

### cURL example

```bash
curl -X POST https://ml-project-student-mental-health-score-dcoe.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{"Age":21,"Gender":"Female","Country":"India","Academic_Level":"Undergraduate","Most_Used_Platform":"Instagram","Purpose_Of_Use":"Entertainment","Avg_Daily_Usage_Hours":5.5,"Daily_Unlocks":70,"Study_Hours":3,"Physical_Activity_Hours":1,"Sleep_Hours_Per_Night":6.5,"Stress_Level":"Medium"}'
```

## Deployment

The app is deployed on [Render](https://render.com) as a web service.

| Setting | Value |
|---|---|
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Environment variable | `PYTHON_VERSION` = `3.12.8` |
| Health check path | `/health` |

**Important:** the model was trained with scikit-learn **1.6.1**, so that version is pinned in `requirements.txt`. Loading a pickled model with a different scikit-learn version can fail or produce invalid results.

## Model Details

| | |
|---|---|
| Task | Regression (predict a mental health score) |
| Model | _Add your algorithm, e.g. Random Forest or XGBoost_ |
| Preprocessing | _Add details, e.g. ordinal and one-hot encoding, scaling, country grouping_ |
| Evaluation | _Add your metrics, e.g. R², MAE, RMSE_ |
| Dataset | _Add the dataset name and source_ |

## Limitations

- The model learns from survey-style data and reflects correlations, not causes.
- Predictions may not generalise to groups or regions that are poorly represented in the training data.
- The output is an estimate for educational purposes and must not be used for clinical decisions.

## Roadmap

- [ ] Explain each prediction with feature importance
- [ ] Docker support
- [ ] Unit tests for the API
- [ ] Model versioning and a retraining pipeline

## Contributing

Contributions are welcome. Fork the repository, create a feature branch, commit your changes and open a pull request.

## License

Distributed under the MIT License. Add a `LICENSE` file to the repository root to make this official.

## Author

**Muhammad Ibrahim**
Software Engineering graduate, National Textile University, Faisalabad, Pakistan.
Aspiring AI Engineer building deployable machine learning projects.

- GitHub: [MuhammadIbrahim732](https://github.com/MuhammadIbrahim732)
- LinkedIn: [muhammad-ibrahim-python](https://www.linkedin.com/in/muhammad-ibrahim-python)

---

<div align="center">

If you found this project useful, consider giving it a star.

</div>
