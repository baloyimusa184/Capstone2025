import sys
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load the model
model = joblib.load('./ai_model/diabetes_meal_model.pkl')

# Symptoms passed from the app
symptoms = sys.argv[1].split(',')

# Encode symptoms (adjust encoding as per your training setup)
# Example: {'tired': 1, 'thirsty': 0}
symptom_encoding = {'tired': 0, 'thirsty': 1}  # Replace with actual mappings
encoded_symptoms = [symptom_encoding.get(s.strip(), 0) for s in symptoms]

# Predict meal plan
recommended_meal = model.predict([encoded_symptoms])[0]

# Output result
print(recommended_meal)
