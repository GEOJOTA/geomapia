#!/bin/bash
set -e

echo "Usando Node.js preinstalado en Render..."
node --version
npm --version

echo "Instalando dependencias de Node.js..."
npm install

echo "Construyendo frontend con Vite..."
npm run build

echo "Instalando dependencias de Python..."
pip install --upgrade pip
pip install -r requirements.txt

