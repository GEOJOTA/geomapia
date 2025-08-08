#!/bin/bash
set -e  # Salir si hay errores
echo "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
echo "Node.js version:"
node --version
echo "npm version:"
npm --version
echo "Instalando dependencias de Node.js..."
npm install
echo "Construyendo frontend con Vite..."
npm run build
echo "Instalando dependencias de Python..."
pip install -r requirements.txt
