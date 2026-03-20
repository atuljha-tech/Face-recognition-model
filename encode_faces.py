import face_recognition
import os
import numpy as np
from database import Session, Face

print("🔍 Encoding faces...")
print("-" * 30)

session = Session()

# Clear old data
session.query(Face).delete()
session.commit()

# Check if dataset exists
if not os.path.exists("dataset"):
    print("❌ dataset folder not found!")
    print("Please run capture_selfies.py first")
    exit()

# Process each person
people_found = False
for person_name in os.listdir("dataset"):
    person_path = f"dataset/{person_name}"
    if not os.path.isdir(person_path):
        continue
    
    people_found = True
    print(f"\n👤 Processing: {person_name}")
    
    images_found = False
    for image_name in os.listdir(person_path):
        if not image_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        
        images_found = True    
        image_path = f"{person_path}/{image_name}"
        print(f"  📷 {image_name}")
        
        # Load and encode face
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)
        
        if not encodings:
            print(f"    ⚠️ No face found in {image_name}")
            continue
        
        # Store in database
        encoding_bytes = encodings[0].tobytes()
        face = Face(name=person_name, encoding=encoding_bytes)
        session.add(face)
        print(f"    ✅ Encoded successfully")
    
    if not images_found:
        print(f"  ⚠️ No images found in {person_name} folder")

if not people_found:
    print("❌ No people folders found in dataset!")
    print("Please run capture_selfies.py first")
    exit()

session.commit()

total = session.query(Face).count()
print(f"\n🎉 Stored {total} face encodings in database!")
print("Next: Run python recognize.py")