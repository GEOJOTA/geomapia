#!/bin/bash
# Instalar Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
# Instalar dependencias de Node.js
npm install
# Construir el frontend
npm run build
# Instalar dependencias de Python
pip install -r requirements.txt
