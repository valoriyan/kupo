# https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service

FROM python:3.9.7

RUN pip install --upgrade pip


RUN pip install torch
RUN pip install torchvision
RUN pip install git+https://github.com/openai/CLIP.git

# Download model in advance
RUN python -c "import torch; import clip; device = 'cuda' if torch.cuda.is_available() else 'cpu'; clip.load('ViT-B/32', device=device)"

COPY . .


RUN pip install --no-cache-dir -r requirements.txt


CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
