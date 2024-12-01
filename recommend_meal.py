import sys
import json

def get_recommendations(meal_type):
    if meal_type == "breakfast":
        return ["Pancakes", "Omelette", "Fruit Salad"]
    elif meal_type == "lunch":
        return ["Grilled Chicken", "Caesar Salad", "Soup"]
    elif meal_type == "dinner":
        return ["Steak", "Pasta", "Vegetables"]
    else:
        return ["No recommendations available"]

if __name__ == "__main__":
    meal_type = sys.argv[1]
    recommendations = get_recommendations(meal_type)
    print(json.dumps(recommendations))

