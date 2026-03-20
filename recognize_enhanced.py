"""
Enhanced real-time face recognition with:
- Multiple encodings per person
- Confidence threshold tuning
- Unknown face saving
- Performance optimization
"""
import cv2
import face_recognition
import numpy as np
from database import Session, Face
import os
from datetime import datetime

# Configuration
THRESHOLD = 0.5
SAVE_UNKNOWN = True
UNKNOWN_FACES_DIR = "unknown_faces"

# Create unknown faces directory
if SAVE_UNKNOWN:
    os.makedirs(UNKNOWN_FACES_DIR, exist_ok=True)

print("🎥 Enhanced Face Recognition System")
print("=" * 50)

# Load faces from database
session = Session()
faces = session.query(Face).all()

if not faces:
    print("❌ No faces found in database!")
    print("Please run: python encode_faces_enhanced.py first")
    exit()

# Group encodings by person
person_encodings = {}
for face in faces:
    encoding = np.frombuffer(face.encoding, dtype=np.float64)
    if face.name not in person_encodings:
        person_encodings[face.name] = []
    person_encodings[face.name].append(encoding)

print(f"✅ Loaded {len(faces)} face encodings for {len(person_encodings)} people:")
for name, encodings in person_encodings.items():
    print(f"  👤 {name}: {len(encodings)} encodings")

print(f"\n⚙️ Settings:")
print(f"  Threshold: {THRESHOLD}")
print(f"  Save unknown faces: {SAVE_UNKNOWN}")
print(f"\n📸 Starting camera...")
print("   'q' - quit | 't' - tune threshold | 's' - save frame\n")

# Initialize camera
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("❌ Could not open camera!")
    exit()

process_this_frame = True
unknown_counter = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    if process_this_frame:
        # Resize for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        
        # Find faces
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        
        # Scale back locations
        face_locations = [(top*2, right*2, bottom*2, left*2) 
                         for (top, right, bottom, left) in face_locations]
        
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            # Find best match
            best_name = "Unknown"
            best_confidence = 0
            
            for name, encodings in person_encodings.items():
                distances = face_recognition.face_distance(encodings, face_encoding)
                min_distance = np.min(distances)
                
                if min_distance < THRESHOLD and min_distance < (1 - best_confidence):
                    best_name = name
                    best_confidence = 1 - min_distance
            
            # Save unknown face
            if best_name == "Unknown" and SAVE_UNKNOWN and best_confidence > 0.3:
                unknown_counter += 1
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{UNKNOWN_FACES_DIR}/unknown_{timestamp}_{unknown_counter}.jpg"
                face_region = frame[top:bottom, left:right]
                if face_region.size > 0:
                    cv2.imwrite(filename, face_region)
            
            # Draw box
            color = (0, 255, 0) if best_name != "Unknown" else (0, 0, 255)
            label = f"{best_name} ({best_confidence:.2f})" if best_name != "Unknown" else f"Unknown ({best_confidence:.2f})"
            
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
            cv2.putText(frame, label, (left, top - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    
    process_this_frame = not process_this_frame
    
    # Display info
    cv2.putText(frame, f"Threshold: {THRESHOLD}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    cv2.putText(frame, "q:quit | t:threshold | s:save", (10, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    cv2.imshow("Enhanced Face Recognition", frame)
    
    # Handle keys
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == ord('t'):
        try:
            new_thresh = float(input(f"New threshold (current {THRESHOLD}): "))
            THRESHOLD = new_thresh
            print(f"✅ Threshold updated to {THRESHOLD}")
        except:
            print("❌ Invalid input")
    elif key == ord('s'):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        cv2.imwrite(f"frame_{timestamp}.jpg", frame)
        print(f"💾 Saved frame")

cap.release()
cv2.destroyAllWindows()
print(f"\n👋 Done! Unknown faces saved: {unknown_counter}")