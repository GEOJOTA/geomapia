#!/bin/bash
echo "Usando Node.js preinstalado en Render..."
echo "Instalando dependencias de Node.js..."
npm install
echo "Construyendo frontend con Vite..."
npm run build
echo "Instalando dependencias de Python..."
pip install -r requirements.txt
echo "Iniciando servidor Flask..."
python app.py


