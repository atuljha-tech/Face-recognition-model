"""
Simple data augmentation wrapper
"""
from utils.image_utils import ImageAugmentor

class DataAugmentor:
    """Wrapper for image augmentation"""
    
    @staticmethod
    def augment(image):
        """Apply basic augmentation to image"""
        aug = ImageAugmentor()
        return aug.augment_face(image)