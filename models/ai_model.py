import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class MealRecommender:
    def __init__(self, data_path):
        # Load and preprocess meal data
        self.data = pd.read_csv(data_path)
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.data['description'])

    def recommend(self, meal_type):
        # Find similar meals based on meal type
        query_tfidf = self.vectorizer.transform([meal_type])
        similarity_scores = cosine_similarity(query_tfidf, self.tfidf_matrix)
        top_indices = similarity_scores[0].argsort()[-5:][::-1]
        recommendations = self.data.iloc[top_indices]['meal'].tolist()
        return recommendations
