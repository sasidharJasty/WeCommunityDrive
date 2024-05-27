import cv2
from pyzbar.pyzbar import decode

# Make one method to decode the barcode
def BarcodeReader(frame):
    # Decode the barcode image
    detectedBarcodes = decode(frame)
    
    # If detected then continue
    if detectedBarcodes:
        # Traverse through all the detected barcodes in image
        for barcode in detectedBarcodes:
            # Locate the barcode position in image
            (x, y, w, h) = barcode.rect
            
            # Put the rectangle in image using cv2 to highlight the barcode
            cv2.rectangle(frame, (x-10, y-10), (x + w+10, y + h+10), (255, 0, 0), 2)
            
            if barcode.data != "":
                # font 
                font = cv2.FONT_HERSHEY_SIMPLEX 
                org = (50, 50) 
                fontScale = 1
                color = (255, 0, 0) 
                thickness = 2
   
                frame = cv2.putText(frame, barcode.data.decode('utf-8'), org, font,  
                   fontScale, color, thickness, cv2.LINE_AA)  
                print("Data:", barcode.data.decode('utf-8'))

    return frame

if __name__ == "__main__":
    # Open the camera
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open video stream from camera")
        exit()
    
    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()
        
        if not ret:
            print("Failed to grab frame")
            break
        
        # Pass the frame to the BarcodeReader function
        frame = BarcodeReader(frame)
        
        # Display the resulting frame
        cv2.imshow('Barcode Reader', frame)
        
        # Press 'q' on keyboard to exit the loop
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()
"""
import numpy as np
import cv2
import imutils
def detect(image):
	# convert the image to grayscale
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	# compute the Scharr gradient magnitude representation of the images
	# in both the x and y direction using OpenCV 2.4
	ddepth = cv2.cv.CV_32F if imutils.is_cv2() else cv2.CV_32F
	gradX = cv2.Sobel(gray, ddepth=ddepth, dx=1, dy=0, ksize=-1)
	gradY = cv2.Sobel(gray, ddepth=ddepth, dx=0, dy=1, ksize=-1)
	# subtract the y-gradient from the x-gradient
	gradient = cv2.subtract(gradX, gradY)
	gradient = cv2.convertScaleAbs(gradient)
	# blur and threshold the image
	blurred = cv2.blur(gradient, (9, 9))
	(_, thresh) = cv2.threshold(blurred, 225, 255, cv2.THRESH_BINARY)
	# construct a closing kernel and apply it to the thresholded image
	kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (21, 7))
	closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
	# perform a series of erosions and dilations
	closed = cv2.erode(closed, None, iterations=4)
	closed = cv2.dilate(closed, None, iterations=4)
	# find the contours in the thresholded image
	cnts = cv2.findContours(closed.copy(), cv2.RETR_EXTERNAL,
		cv2.CHAIN_APPROX_SIMPLE)
	cnts = imutils.grab_contours(cnts)
	# if no contours were found, return None
	if len(cnts) == 0:
		return None
	# otherwise, sort the contours by area and compute the rotated
	# bounding box of the largest contour
	c = sorted(cnts, key=cv2.contourArea, reverse=True)[0]
	rect = cv2.minAreaRect(c)
	box = cv2.cv.BoxPoints(rect) if imutils.is_cv2() else cv2.boxPoints(rect)
	box = np.int0(box)
	# return the bounding box of the barcode
	return box
"""