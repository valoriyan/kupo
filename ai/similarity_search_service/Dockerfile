# https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service

# FROM python:3.9.7
# FROM --platform=linux/amd64 ubuntu:18.04 
FROM --platform=linux/amd64 continuumio/anaconda3


##################################################
# SETUP Python
##################################################




# FROM continuumio/anaconda3


# RUN pip install --upgrade pip


##################################################
# SETUP FAISS
##################################################
# RUN pip install numpy

# RUN apt-get update
# RUN apt-get install -y build-essential
# RUN apt-get install -y wget
# RUN apt-get install -y curl
# RUN apt-get clean


# RUN wget https://repo.anaconda.com/archive/Anaconda3-2022.10-Linux-x86_64.sh -O ~/anaconda.sh
# RUN /bin/bash ~/anaconda.sh -b -p /opt/conda

# RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh && /bin/bash ~/miniconda.sh -b -p /opt/conda


# RUN \
#   curl -O https://repo.continuum.io/archive/Anaconda3-4.2.0-Linux-x86_64.sh && \
#   yes "yes" | bash Anaconda3-4.2.0-Linux-x86_64.sh && \
#   sudo -s source ~/.bashrc


##################################################
# STANDARD SETUP
##################################################

# WORKDIR "/"
# COPY . .

# RUN pip install --no-cache-dir -r requirements.txt


# CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
