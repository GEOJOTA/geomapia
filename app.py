from flask import Flask, render_template, request, send_file
import osmnx as ox
import geopandas as gpd
import os
from shapely.geometry import box
from datetime import datetime

app = Flask(__name__)
DOWNLOAD_DIR = "downloads"

if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

@app.route('/', methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Obtener parámetros del formulario
        north = float(request.form["north"])
        south = float(request.form["south"])
        east = float(request.form["east"])
        west = float(request.form["west"])
        feature = request.form["feature"]
        file_format = request.form["format"]

        # Crear bbox
        bbox = box(west, south, east, north)

        # Descargar datos con OSMnx
        gdf = ox.features_from_bbox(north, south, east, west, tags={feature: True})

        if gdf.empty:
            return render_template("index.html", message="No se encontraron datos.")

        # Filtrar solo geometría principal
        gdf = gdf[gdf.geometry.notnull()]
        gdf = gdf.set_geometry("geometry")

        # Generar nombre de archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{feature}_{timestamp}.{file_format}"
        filepath = os.path.join(DOWNLOAD_DIR, filename)

        # Guardar archivo
        if file_format == "geojson":
            gdf.to_file(filepath, driver="GeoJSON")
        elif file_format == "shp":
            gdf.to_file(filepath, driver="ESRI Shapefile")
        elif file_format == "kml":
            gdf.to_file(filepath, driver="KML")
        else:
            return render_template("index.html", message="Formato no compatible.")

        return send_file(filepath, as_attachment=True)

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
