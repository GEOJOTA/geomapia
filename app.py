from flask import Flask, render_template, send_file
import folium
import os

app = Flask(__name__)

@app.route('/')
def index():
    m = folium.Map(location=[-33.45, -70.6667], zoom_start=10)
    folium.Marker([-33.45, -70.6667], tooltip="Santiago de Chile").add_to(m)
    map_path = os.path.join("templates", "map.html")
    m.save(map_path)
    return render_template('index.html')

@app.route('/descargar')
def descargar():
    path = os.path.join("data", "muestra.geojson")
    return send_file(path, as_attachment=True)
