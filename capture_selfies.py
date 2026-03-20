import cv2
import os
from datetime import datetime

name = input("Enter your name: ").strip().lower()
path = f"dataset/{name}"
os.makedirs(path, exist_ok=True)

print(f"Saving photos to: {path}")
print("Press SPACE to take photo")
print("Press 'q' to quit")

cap = cv2.VideoCapture(0)
count = 0

while count < 5:
    ret, frame = cap.read()
    if not ret:
        break
    
    frame = cv2.flip(frame, 1)
    cv2.putText(frame, f"Photos: {count}/5", (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
    cv2.imshow("Capture", frame)
    
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == ord(' '):
        count += 1
        filename = f"{path}/{name}_{count}.jpg"
        cv2.imwrite(filename, frame)
        print(f"Saved: {filename}")

cap.release()
cv2.destroyAllWindows()
print(f"Done! Captured {count} photos")