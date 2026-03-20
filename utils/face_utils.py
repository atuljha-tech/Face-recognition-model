"""
Face recognition utilities
"""
import face_recognition
import numpy as np
from .image_utils import ImageAugmentor, FaceValidator

class FaceEncoder:
    """Enhanced face encoding with augmentation"""
    
    def __init__(self, use_augmentation=True):
        self.use_augmentation = use_augmentation
        self.validator = FaceValidator()
        self.augmentor = ImageAugmentor()
    
    def encode_from_image(self, image_path):
        """
        Encode face from image with augmentation
        Returns list of encodings
        """
        # Load image
        image = face_recognition.load_image_file(image_path)
        
        # Detect face locations
        face_locations = face_recognition.face_locations(image)
        
        if not face_locations:
            return [], False
        
        # Get encodings for original image
        original_encodings = face_recognition.face_encodings(image, face_locations)
        
        if not original_encodings:
            return [], False
        
        # Check face quality
        top, right, bottom, left = face_locations[0]
        face_region = image[top:bottom, left:right]
        is_good, reason = self.validator.check_face_quality(face_region)
        
        encodings = [original_encodings[0]]
        
        # Add augmented encodings for robustness
        if self.use_augmentation:
            try:
                augmented_images = self.augmentor.augment_face(image, num_augmentations=3)
                
                for aug_img in augmented_images[1:]:  # Skip original
                    # Find face in augmented image
                    aug_locations = face_recognition.face_locations(aug_img)
                    if aug_locations:
                        aug_encodings = face_recognition.face_encodings(aug_img, aug_locations)
                        if aug_encodings:
                            encodings.append(aug_encodings[0])
            except Exception as e:
                print(f"    ⚠️ Augmentation error: {e}")
        
        return encodings, is_good