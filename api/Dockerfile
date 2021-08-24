# syntax=docker/dockerfile:1

# Base build
FROM python:3.9.6-slim-buster AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y netcat

# Install Python dependencies
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENTRYPOINT ["./entrypoint.sh"]


# Development target
FROM base AS development

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1

CMD ["python", "manage.py", "run"]
