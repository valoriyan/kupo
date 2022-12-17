

import torch
import clip
from PIL import Image
import requests
from io import BytesIO
from flask import Flask
import os
from flask import request
import numpy as np

device = "cuda" if torch.cuda.is_available() else "cpu"

model, preprocess = clip.load("ViT-B/32", device=device)


def _get_512features_from_text(
    text: str,
):
    tokens = clip.tokenize(text).to(device)
    with torch.no_grad():
        return model.encode_text(tokens).numpy()[0]


def _get_512features_from_image(
    pil_image: str,
):
    preprocessed_image = preprocess(pil_image).unsqueeze(0).to(device)

    with torch.no_grad():
        return model.encode_image(preprocessed_image)[0]


def _read_pil_image_from_url(
    url: str,
):
    response = requests.get(url)
    return Image.open(BytesIO(response.content))


def _get_512features_from_image_url(url):
    pil_image = _read_pil_image_from_url(url)
    return _get_512features_from_image(pil_image=pil_image)

##################################################
# FLASK SERVER
##################################################


app = Flask(__name__)


@app.route("/")
def home():
    return "hello world!"


@app.route("/get_embedding", methods=['POST'])
def get_embedding():
    text_segments = request.json['text_segments']
    image_urls = request.json['image_urls']

    list_of_features = []

    for text_segment in text_segments:
        features = _get_512features_from_text(text=text_segment)
        list_of_features.append(features)

    for image_url in image_urls:
        features = _get_512features_from_image_url(url=image_url)
        list_of_features.append(features)

    averaged_features = np.mean(list_of_features, axis=0)
    return averaged_features.tolist()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
