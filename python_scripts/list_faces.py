import requests
faces = requests.post("http://192.168.1.203:80/v1/vision/face/list").json()

print(faces)