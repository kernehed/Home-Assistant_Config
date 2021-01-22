import requests

response = requests.post("http://192.168.1.203:80/v1/vision/face/delete",
data={"userid":"Erik"}).json()

print(response)