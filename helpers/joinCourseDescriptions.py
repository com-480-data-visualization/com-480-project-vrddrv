import json
import os
import random
from tqdm import tqdm

INPUT_FOLDER = 'website/src/scraped_data'
OUTPUT_PATH = 'website/src/processed_data/course_descriptions.json'

if __name__ == "__main__":
    files = []
    for (dirpath, dirnames, filenames) in os.walk(INPUT_FOLDER):
        files += [os.path.join(dirpath, file)
                  for file in filenames if file[-5:] == '.json']

    classes = {}
    for file_path in tqdm(files):
        with open(file_path, 'r') as json_data:
            for course in json.load(json_data):

                # Generate fake data:
                course["grades_histogram"] = [
                    random.randint(0, 100) for i in range(9)]
                course["avg_gpa_year"] = [
                    random.random() * 2 + 4 for i in range(3)]

                classes[course["courseName"].lower()] = course

    with open(OUTPUT_PATH, 'w') as outfile:
        json.dump(classes, outfile, indent=2)
