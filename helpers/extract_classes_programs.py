import sys
import os
import json
from collections import defaultdict


def extract_programs(source_dir):
  res = defaultdict(lambda: [])
  for file in os.listdir(source_dir):
    with open(os.path.join(source_dir, file), "r") as f:
      courses = json.load(f)
      program = file[:-5]
      for course_info in courses:
        is_core = "coreCourse" in course_info and course_info["coreCourse"] == True
        res[course_info["courseName"].lower()].append((program, "core" if is_core else "opt"))

  return res

if __name__ == "__main__":
  source_dir = sys.argv[1]
    
  target_file = sys.argv[2]

  with open(target_file, "w") as f:
    json.dump(extract_programs(source_dir), f, indent=2)
