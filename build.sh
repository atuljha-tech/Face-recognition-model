#!/bin/bash
# Install pre-compiled dlib wheel to avoid compilation
pip install dlib-bin --no-cache-dir
# Install other dependencies
pip install -r requirements.txt
