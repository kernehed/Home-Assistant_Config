import requests
Evenice = open("/usr/share/hassio/homeassistant/deepstack_face_faces/evenice8.jpg","rb").read()
requests.post("http://192.168.1.203:80/v1/vision/face/register",files={"image":Evenice}, data={"userid":"Evenice"})