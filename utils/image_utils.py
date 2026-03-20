"""
Image processing utilities for face recognition
"""
import cv2
import numpy as np
from PIL import Image, ImageEnhance

class ImageAugmentor:
    """Apply data augmentation to improve model generalization"""
    
    @staticmethod
    def flip_image(image):
        """Flip image horizontally"""
        return cv2.flip(image, 1)
    
    @staticmethod
    def adjust_brightness(image, factor=0.5):
        """Adjust image brightness"""
        pil_img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        enhancer = ImageEnhance.Brightness(pil_img)
        bright_img = enhancer.enhance(factor)
        return cv2.cvtColor(np.array(bright_img), cv2.COLOR_RGB2BGR)
    
    @staticmethod
    def adjust_contrast(image, factor=1.5):
        """Adjust image contrast"""
        pil_img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        enhancer = ImageEnhance.Contrast(pil_img)
        contrast_img = enhancer.enhance(factor)
        return cv2.cvtColor(np.array(contrast_img), cv2.COLOR_RGB2BGR)
    
    @staticmethod
    def add_blur(image, kernel_size=(5,5)):
        """Add Gaussian blur to image"""
        return cv2.GaussianBlur(image, kernel_size, 0)
    
    @staticmethod
    def rotate_image(image, angle=10):
        """Rotate image by small angle"""
        h, w = image.shape[:2]
        center = (w // 2, h // 2)
        matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(image, matrix, (w, h))
        return rotated
    
    @staticmethod
    def augment_face(image, num_augmentations=3):
        """
        Generate augmented versions of a face image
        Returns list of augmented images
        """
        augmented_images = [image]  # Original image
        
        # Apply different augmentations
        augmented_images.append(ImageAugmentor.flip_image(image))
        augmented_images.append(ImageAugmentor.adjust_brightness(image, 0.7))
        augmented_images.append(ImageAugmentor.adjust_brightness(image, 1.3))
        augmented_images.append(ImageAugmentor.adjust_contrast(image, 1.3))
        augmented_images.append(ImageAugmentor.rotate_image(image, 5))
        augmented_images.append(ImageAugmentor.rotate_image(image, -5))
        
        # Remove duplicates by comparing arrays
        unique_images = []
        for img in augmented_images:
            is_duplicate = False
            for unique_img in unique_images:
                if np.array_equal(img, unique_img):
                    is_duplicate = True
                    break
            if not is_duplicate:
                unique_images.append(img)
        
        # Return only up to num_augmentations
        return unique_images[:num_augmentations+1]

class FaceValidator:
    """Check face quality before encoding"""
    
    @staticmethod
    def check_face_quality(face_image):
        """
        Check if face meets quality standards
        Returns (is_good, reason)
        """
        # Convert to grayscale for quality checks
        if len(face_image.shape) == 3:
            gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
        else:
            gray = face_image
        
        # Check if image is too dark
        brightness = np.mean(gray)
        if brightness < 50:
            return False, "Too dark"
        
        # Check if image is too bright
        if brightness > 200:
            return False, "Too bright"
        
        # Check contrast
        if np.std(gray) < 30:
            return False, "Low contrast"
        
        return True, "Good quality"