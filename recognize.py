import cv2
import face_recognition
import numpy as np
from database import Session, Face

print("🎥 Face Recognition System")
print("-" * 30)

# Load faces from database
session = Session()
faces = session.query(Face).all()

if not faces:
    print("❌ No faces found in database!")
    print("Please run: python encode_faces.py first")
    exit()

known_encodings = []
known_names = []

for face in faces:
    encoding = np.frombuffer(face.encoding, dtype=np.float64)
    known_encodings.append(encoding)
    known_names.append(face.name)

print(f"✅ Loaded {len(known_encodings)} face encodings")
unique_names = list(set(known_names))
print(f"👥 People: {', '.join(unique_names)}")
print("\n📸 Starting camera... Press 'q' to quit\n")

# Start camera
cap = cv2.VideoCapture(0)

# Check if camera opened successfully
if not cap.isOpened():
    print("❌ Could not open camera!")
    print("Please check camera permissions in System Settings > Privacy & Security > Camera")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to grab frame")
        break
    
    # Convert to RGB (face_recognition uses RGB)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Find faces
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
    
    # Process each face
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # Compare with known faces
        matches = face_recognition.compare_faces(known_encodings, face_encoding)
        distances = face_recognition.face_distance(known_encodings, face_encoding)
        
        name = "Unknown"
        confidence = 0
        
        if len(distances) > 0:
            best_index = np.argmin(distances)
            if matches[best_index] and distances[best_index] < 0.5:
                name = known_names[best_index]
                confidence = 1 - distances[best_index]
        
        # Draw box and label
        color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        
        label = f"{name}"
        if name != "Unknown":
            label += f" ({confidence:.2f})"
        
        cv2.putText(frame, label, (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    
    # Show instructions
    cv2.putText(frame, "Press 'q' to quit", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    
    # Show frame
    cv2.imshow("Face Recognition System", frame)
    
    # Quit on 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("\n👋 Recognition stopped!")