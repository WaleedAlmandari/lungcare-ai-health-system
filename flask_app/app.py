from flask import Flask, request, render_template
import numpy as np
import tensorflow as tf
import cv2
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from flask import Flask, request, jsonify , send_from_directory
import openai
import joblib
import pickle
import pandas as pd
import requests
from PIL import Image
import io
import librosa
import traceback
from pydub import AudioSegment
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import librosa.display
import uuid
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)  # هذا مهم جداً لحل خطأ fetch من React
xray_model = tf.keras.models.load_model("xray_model.keras")
xray_filter_model = tf.keras.models.load_model("xray_filter_model.h5")

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def preprocess_xray(path):
    img = cv2.imread(path)
    img = cv2.resize(img, (150, 150))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def is_xray_image(path):
    img = cv2.imread(path)
    img = cv2.resize(img, (64, 64))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)
    pred = xray_filter_model.predict(img)
    return np.argmax(pred) == 1  # 1 = X-ray

@app.route("/xray", methods=["POST"])
def upload_predict_xray():
    file = request.files.get("file")
    if not file:
        return {"error": "No file uploaded"}, 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    if not is_xray_image(filepath):
        return {"error": "Please upload a valid chest X-ray image."}, 400

    img = preprocess_xray(filepath)
    prediction = xray_model.predict(img)[0][0]
    result = "Pneumonia" if prediction > 0.5 else "Normal"
    confidence = round(float(prediction) * 100, 2) if result == "Pneumonia" else round((1 - float(prediction)) * 100, 2)

    return jsonify({
        "prediction": result,
        "probability": f"{confidence}%",
        "image_url": filepath
    })


# ==========================
# تحميل موديل سرطان الرئة
# ==========================
pathology_filter_model = tf.keras.models.load_model("pathology_filter_model.h5")

# موديل تصنيف سرطان الرئة
lung_model = tf.keras.models.load_model("lung_model_cancer.keras")
CLASS_NAMES = ["Lung_squamous_cell_carcinoma", "Lung_adenocarcinoma", "Lung_benign_tissue"]


# ==========================
# دوال تجهيز الصور
# ==========================
def preprocess_pathology_image(image_bytes, target_size=(224, 224)):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, 0)  # (1, 128, 128, 3)
    return img_array

def preprocess_lung_image(image_bytes, target_size=(224, 224)):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, 0)  # (1, 224, 224, 3)
    return img_array


# ==========================
# API التنبؤ بسرطان الرئة
# ==========================
@app.route("/lung-cancer", methods=["POST"])
def predict_lung_cancer():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        img_bytes = file.read()

        # --- الخطوة 1: التأكد أن الصورة pathology ---
        pathology_input = preprocess_pathology_image(img_bytes)
        pathology_pred = pathology_filter_model.predict(pathology_input)[0][0]
        is_pathology = pathology_pred > 0.5

        if not is_pathology:
            return jsonify({
                "error": "The uploaded image is not a pathology image. Please upload a valid pathology slide.",
                "confidence": f"{pathology_pred*100:.2f}%"
            }), 400

        # --- الخطوة 2: تصنيف الصورة إذا كانت pathology ---
        input_image = preprocess_lung_image(img_bytes)
        preds = lung_model.predict(input_image)
        class_idx = np.argmax(preds[0])
        confidence = float(np.max(preds[0])) * 100
        prediction_label = CLASS_NAMES[class_idx]

        return jsonify({
            "is_pathology": True,
            "pathology_confidence": f"{pathology_pred*100:.2f}%",
            "prediction": prediction_label,
            "probability": f"{confidence:.2f}%"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/contact', methods=['POST'])

def contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    print("📩 New Contact Message:")
    print("Name:", name)
    print("Email:", email)
    print("Message:", message)

    return {'status': 'success', 'message': "✅ Message received! We'll get back to you soon."}, 200

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/diseases/pneumonia')
def pneumonia():
    return render_template('pneumonia.html')

@app.route('/diseases/asthma')
def asthma():
    return render_template('asthma.html')

@app.route('/diseases/copd')
def copd():
    return render_template('copd.html')

@app.route('/diseases/lung-cancer')
def lung_cancer():
    return render_template('lung_cancer.html')

@app.route('/diseases/pulmonary-fibrosis')
def pulmonary_fibrosis():
    return render_template('pulmonary_fibrosis.html')

@app.route('/diseases/covid-19')
def covid19():
    return render_template('covid19.html')

@app.route('/blog/air-pollution')
def blog_air_pollution():
    return render_template('blog_air_pollution.html')

@app.route('/blog/lung-function')
def blog_lung_function():
    return render_template('blog_lung_function.html')

@app.route('/blog/breathing-exercises')
def blog_breathing_exercises():
    return render_template('blog_breathing_exercises.html')

@app.route('/blog/asthma-vs-copd')
def blog_asthma_vs_copd():
    return render_template('blog_asthma_vs_copd.html')

@app.route('/blog/smoking-impact')
def blog_smoking_impact():
    return render_template('blog_smoking_impact.html')

@app.route('/blog/long-covid')
def blog_long_covid():
    return render_template('blog_long_covid.html')

#app = Flask(__name__)
#CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message")

    if not message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful AI health assistant focused on lung-related advice."},
                {"role": "user", "content": message}
            ]
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print("❌ AI Chat Error:", str(e))  # <-- هذا يطبع الخطأ في الطرفية
        return jsonify({"error": str(e)}), 500
    

        
@app.route('/symptom-checker', methods=['POST'])
def symptom_checker():
    data = request.get_json()
    symptoms = data.get("symptoms", "")

    prompt = f"""
You are a medical assistant specialized **only** in lung and respiratory health. A user described their symptoms as: "{symptoms}".

If the symptoms are **related to the lungs or respiratory system**, please respond in a clear and structured format with the following sections:

1. 🩺 Symptom Summary – summarize the symptoms.
2. ❓ Possible Causes – list 2–3 possible lung-related conditions based on the symptoms.
3. ✅ Recommendations – suggest self-care tips or general next steps.
4. 🚨 When to Seek Medical Help – list any warning signs or emergencies to watch for.

If the symptoms are **not** related to the lungs or respiratory system, politely reply:
"I'm a medical assistant specialized only in lung and respiratory health. Please consult a relevant specialist for this matter."

Respond in a professional, human-friendly tone.
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a medical assistant specialized strictly in lung and respiratory health. Never answer questions outside this domain."
                },
                {"role": "user", "content": prompt}
            ]
        )
        reply = response['choices'][0]['message']['content']
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": "❌ An error occurred while contacting the AI."}), 500
    


# تحميل النموذج المدرب مسبقًا
# تحميل النموذج المدرب مسبقًا
cancer_model = joblib.load("lung_cancer_model.pkl")

@app.route("/lung-cancer-predict", methods=["POST"])
def cancer_predict():
    data = request.get_json()
    try:
        input_features = [
            int(data["gender"]),
            int(data["age"]),
            int(data["smoking"]),
            int(data["yellowFingers"]),
            int(data["anxiety"]),
            int(data["peerPressure"]),
            int(data["chronicDisease"]),
            int(data["fatigue"]),
            int(data["allergy"]),
            int(data["wheezing"]),
            int(data["alcohol"]),
            int(data["coughing"]),
            int(data["shortnessOfBreath"]),
            int(data["swallowingDifficulty"]),
            int(data["chestPain"])
        ]

        # احصل على نسبة الخطر (احتمال الإصابة)
        prob = cancer_model.predict_proba([input_features])[0][1]
        result = "High Risk of Lung Cancer" if prob > 0.5 else "Low Risk / Not Likely"

        return jsonify({
            "prediction": result,
            "probability": round(prob * 100, 2)  # كنسبة مئوية
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400



API_KEY = os.getenv("OPEN_WEATHER_KEY")

def analyze_air_quality(pm2_5):
    if pm2_5 <= 12:
        return "Good", "✅ Air quality is good. Enjoy your day!"
    elif pm2_5 <= 35.4:
        return "Moderate", "😐 Air is acceptable. Sensitive people should take caution."
    elif pm2_5 <= 55.4:
        return "Unhealthy (Sensitive)", "⚠️ People with asthma or lung conditions should limit outdoor activity."
    elif pm2_5 <= 150.4:
        return "Unhealthy", "❌ Air is unhealthy. Avoid outdoor activity if possible."
    elif pm2_5 <= 250.4:
        return "Very Unhealthy", "🔴 Serious health risk. Stay indoors."
    else:
        return "Hazardous", "☠️ Air is dangerous. Everyone should avoid going outside."


@app.route("/api/airquality", methods=["POST"])
def get_air_quality():
    data = request.get_json()

    lat = data.get("lat")
    lon = data.get("lon")
    city = data.get("city")

    # إذا تم إرسال اسم المدينة، نحاول نحولها إلى إحداثيات
    if city:
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
        geo_response = requests.get(geo_url).json()
        if not geo_response:
            return jsonify({"error": f"Could not find location for city '{city}'."}), 404
        lat = geo_response[0]["lat"]
        lon = geo_response[0]["lon"]
        city = geo_response[0]["name"]  # توحيد الاسم

    # تحقق من وجود الإحداثيات
    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude not provided."}), 400

    # جلب بيانات جودة الهواء
    aq_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    response = requests.get(aq_url)
    pollution_data = response.json()

    pm2_5 = pollution_data['list'][0]['components']['pm2_5']
    aqi = pollution_data['list'][0]['main']['aqi']
    level, advice = analyze_air_quality(pm2_5)

    return jsonify({
        "city": city,
        "lat": lat,
        "lon": lon,
        "pm2_5": pm2_5,
        "aqi": aqi,
        "risk_level": level,
        "advice": advice
    })

# ================== مفتاح OpenAI ==================
openai.api_key = os.getenv("OPENAI_API_KEY")

# ================== ضبط مسار FFmpeg ==================
AudioSegment.converter = "C:/bin/ffmpeg.exe"

# ================== دالة استخراج الخصائص ==================
def extract_features(audio_path):
    y, sr = librosa.load(audio_path, duration=9, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    features = np.mean(mfccs.T, axis=0)
    return features.tolist(), mfccs  # نعيد أيضاً مصفوفة MFCC

# ================== دالة حفظ MFCC كصورة ==================
def save_mfcc_image(mfcc, save_dir="uploads"):
    os.makedirs(save_dir, exist_ok=True)
    image_filename = f"mfcc_{uuid.uuid4().hex}.png"
    image_path = os.path.join(save_dir, image_filename)
    
    plt.figure(figsize=(10, 4))
    librosa.display.specshow(mfcc, x_axis='time')
    plt.colorbar()
    plt.title("MFCC of Cough Sound")
    plt.tight_layout()
    plt.savefig(image_path)
    plt.close()
    
    return image_filename  # نرسل فقط اسم الملف للفرونت إند

# ================== جعل مجلد uploads متاح للفرونت إند ==================
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

# ================== API: رفع أو تسجيل الصوت وتصنيفه ==================
@app.route("/classify-cough", methods=["POST"])
def classify_cough():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename if file.filename else "recording.webm"
    os.makedirs("uploads", exist_ok=True)
    original_path = os.path.join("uploads", filename)
    file.save(original_path)

    try:
        # --- تحويل الملف إلى WAV ---
        wav_path = os.path.splitext(original_path)[0] + ".wav"
        sound = AudioSegment.from_file(original_path)  # FFmpeg معروف الآن
        sound.export(wav_path, format="wav")

        # --- استخراج الميزات ---
        features, mfcc_matrix = extract_features(wav_path)

        # --- حفظ MFCC كصورة ---
        mfcc_image_filename = save_mfcc_image(mfcc_matrix)

        # --- إرسال البيانات إلى GPT ---
        # --- إرسال البيانات إلى GPT ---
        prompt = f"""
        We are running a demo of a cough sound classifier (not for medical use).
        Here are MFCC audio features extracted from a cough recording: {features}
        Pretend you are an AI model trained to classify coughs as 'Healthy' or 'Unhealthy'.
        Give a simulated classification and a simple explanation (keep it short) do not write (*).
        """

        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        result = response["choices"][0]["message"]["content"]

        return jsonify({
            "classification": result,
            "features": features,
            "mfcc_image": mfcc_image_filename  # نرسل اسم الصورة للفرونت إند
        })

    except Exception as e:
        print("==== ERROR OCCURRED ====")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)
