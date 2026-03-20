"""
Enhanced face encoding with data augmentation
Stores multiple encodings per person for better accuracy
"""
import face_recognition
import os
import numpy as np
from database import Session, Face
from utils.face_utils import FaceEncoder

print("🔍 Enhanced Face Encoding with Data Augmentation")
print("=" * 50)

# Initialize encoder with augmentation
encoder = FaceEncoder(use_augmentation=True)

session = Session()

# Clear old data
old_count = session.query(Face).count()
session.query(Face).delete()
session.commit()
print(f"✅ Cleared {old_count} old encodings")

# Check if dataset exists
if not os.path.exists("dataset"):
    print("❌ dataset folder not found!")
    print("Please run capture_selfies.py first")
    exit()

# Statistics
total_encodings = 0
total_faces = 0
quality_issues = 0

# Process each person
for person_name in os.listdir("dataset"):
    person_path = f"dataset/{person_name}"
    if not os.path.isdir(person_path):
        continue
    
    print(f"\n👤 Processing: {person_name}")
    person_encodings = 0
    
    for image_name in os.listdir(person_path):
        if not image_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        
        image_path = f"{person_path}/{image_name}"
        print(f"  📷 {image_name}")
        
        # Get encodings with augmentation
        encodings, is_good = encoder.encode_from_image(image_path)
        
        if not encodings:
            print(f"    ⚠️ No face detected!")
            continue
        
        if not is_good:
            quality_issues += 1
        
        # Store each encoding in database
        for encoding in encodings:
            encoding_bytes = encoding.tobytes()
            face = Face(name=person_name, encoding=encoding_bytes)
            session.add(face)
            person_encodings += 1
        
        print(f"    ✅ Generated {len(encodings)} encodings")
    
    total_faces += 1
    total_encodings += person_encodings
    print(f"  📊 Total encodings: {person_encodings}")

session.commit()

print("\n" + "=" * 50)
print("📊 Encoding Summary:")
print(f"  ✅ People processed: {total_faces}")
print(f"  ✅ Total encodings stored: {total_encodings}")
print(f"  ⚠️ Quality issues: {quality_issues}")
print(f"  📈 Avg encodings per person: {total_encodings/total_faces:.1f}")
print("=" * 50)
print("Next: Run python recognize_enhanced.py")