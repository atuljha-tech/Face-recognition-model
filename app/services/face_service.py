"""
Face recognition service using face_recognition library
"""
import face_recognition
import numpy as np
from PIL import Image
import io
import time
from typing import List, Tuple, Optional
import cv2

class FaceService:
    """
    Handles face detection, encoding, and recognition
    """
    
    def __init__(self, threshold=0.5):
        self.threshold = threshold
    
    def decode_image(self, image_bytes: bytes) -> np.ndarray:
        """Convert image bytes to numpy array (RGB format)"""
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        return np.array(image)
    
    def detect_faces(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """Detect face locations in image"""
        return face_recognition.face_locations(image)
    
    def encode_face(self, image: np.ndarray, face_location: Tuple[int, int, int, int] = None) -> Optional[np.ndarray]:
        """Generate face encoding for a detected face"""
        if face_location:
            encodings = face_recognition.face_encodings(image, [face_location])
        else:
            encodings = face_recognition.face_encodings(image)
        
        if encodings:
            return encodings[0]
        return None
    
    def get_best_match(self, query_encoding: np.ndarray, known_encodings: List[np.ndarray], 
                       known_names: List[str]) -> Tuple[str, float]:
        """Find best match using distance comparison"""
        if not known_encodings:
            return "Unknown", 0.0
        
        distances = face_recognition.face_distance(known_encodings, query_encoding)
        best_index = np.argmin(distances)
        best_distance = distances[best_index]
        confidence = max(0, min(1, 1 - best_distance))
        
        if best_distance < self.threshold:
            return known_names[best_index], confidence
        else:
            return "Unknown", confidence