"""
Review and label unknown faces
"""
import cv2
import os
import shutil

def review_unknown_faces():
    unknown_dir = "unknown_faces"
    
    if not os.path.exists(unknown_dir):
        print("No unknown faces found!")
        return
    
    files = [f for f in os.listdir(unknown_dir) if f.endswith('.jpg')]
    if not files:
        print("No unknown faces to review!")
        return
    
    print(f"Found {len(files)} unknown faces to review")
    print("Controls: A=Add to dataset, D=Delete, S=Skip, Q=Quit\n")
    
    for i, filename in enumerate(files, 1):
        filepath = os.path.join(unknown_dir, filename)
        img = cv2.imread(filepath)
        
        if img is None:
            continue
        
        cv2.putText(img, f"Face {i}/{len(files)}", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
        cv2.putText(img, "A:Add | D:Delete | S:Skip | Q:Quit", (10, 60),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1)
        
        cv2.imshow("Review Unknown Face", img)
        
        while True:
            key = cv2.waitKey(0) & 0xFF
            if key == ord('a'):
                name = input("Enter name for this face: ").strip().lower()
                if name:
                    dataset_path = f"dataset/{name}"
                    os.makedirs(dataset_path, exist_ok=True)
                    shutil.copy(filepath, f"{dataset_path}/{name}_{filename}")
                    os.remove(filepath)
                    print(f"✅ Added to {name}'s dataset")
                break
            elif key == ord('d'):
                os.remove(filepath)
                print("🗑️ Deleted")
                break
            elif key == ord('s'):
                print("⏭️ Skipped")
                break
            elif key == ord('q'):
                cv2.destroyAllWindows()
                return
    
    cv2.destroyAllWindows()
    print("\n✅ Review complete!")

if __name__ == "__main__":
    review_unknown_faces()