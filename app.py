# ===============================================================
# 📦 DEPENDENCIAS REQUERIDAS
# Asegúrate de tener instaladas: flask, flask-cors, psycopg2, sqlalchemy
# ===============================================================
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, text
import os

# ===============================================================
# ⚙️ CONFIGURACIÓN DE LA APLICACIÓN FLASK
# Puedes cambiar estos valores para escalar o portar
# ===============================================================
app = Flask(__name__)
CORS(app)  # Permite conexión desde clientes externos como QGIS o navegador

# ===============================================================
# 🔐 CONFIGURACIÓN DE CONEXIÓN A LA BASE DE DATOS POSTGIS
# 📌 MODIFICABLE PARA USUARIOS, CONTRASEÑAS Y HOST DIFERENTES
# ===============================================================
# Parámetros escalables — Puedes setearlos como variables de entorno en Render
DB_CONFIG = {
    'DB_USER': os.environ.get('DB_USER', 'geojota'),
    'DB_PASSWORD': os.environ.get('DB_PASSWORD', 'Lescano0806'),
    'DB_HOST': os.environ.get('DB_HOST', 'localhost'),  # Cambiar en Render
    'DB_PORT': os.environ.get('DB_PORT', '5432'),
    'DB_NAME': os.environ.get('DB_NAME', 'geomapia')
}

# 🔌 Construcción dinámica del string de conexión
DATABASE_URL = f"postgresql://{DB_CONFIG['DB_USER']}:{DB_CONFIG['DB_PASSWORD']}@" \
               f"{DB_CONFIG['DB_HOST']}:{DB_CONFIG['DB_PORT']}/{DB_CONFIG['DB_NAME']}"

# 🌐 Motor SQLAlchemy
engine = create_engine(DATABASE_URL)


# ===============================================================
# 🛰️ RUTA DE PRUEBA DE CONEXIÓN
# Útil para saber si la base está operativa
# ===============================================================
@app.route('/')
def index():
    return jsonify({"status": "ok", "message": "GeoMapia backend running!"})


# ===============================================================
# 🌍 API: OBTENER TODAS LAS GEOMETRÍAS DE UNA TABLA
# Parámetros:
#   - tabla (str): nombre de la tabla a consultar (debe tener columna geom)
#   - srid (opcional): sistema de referencia (default: 4326)
# ===============================================================
@app.route('/api/geometries/<tabla>')
def get_geometries(tabla):
    srid = request.args.get("srid", default="4326")
    try:
        query = text(f"""
            SELECT 
                id, 
                ST_AsGeoJSON(ST_Transform(geom, :srid)) AS geometry 
            FROM {tabla}
        """)
        with engine.connect() as conn:
            result = conn.execute(query, {"srid": int(srid)})
            features = []
            for row in result:
                features.append({
                    "type": "Feature",
                    "geometry": eval(row['geometry']),
                    "properties": {"id": row['id']}
                })
        return jsonify({"type": "FeatureCollection", "features": features})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===============================================================
# 🗺️ API: INSERTAR NUEVA GEOMETRÍA
# Cuerpo JSON:
#   {
#     "geometry": {GeoJSON},
#     "tabla": "nombre_tabla"
#   }
# ===============================================================
@app.route('/api/geometries', methods=['POST'])
def insert_geometry():
    data = request.get_json()
    geometry = data.get("geometry")
    tabla = data.get("tabla")
    
    if not geometry or not tabla:
        return jsonify({"error": "Missing geometry or table"}), 400

    try:
        query = text(f"""
            INSERT INTO {tabla} (geom)
            VALUES (ST_SetSRID(ST_GeomFromGeoJSON(:geom), 4326))
        """)
        with engine.connect() as conn:
            conn.execute(query, {"geom": str(geometry)})
            conn.commit()
        return jsonify({"status": "success"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===============================================================
# 🔧 PUNTO DE ENTRADA PRINCIPAL
# Render configura esto automáticamente, pero útil localmente
# ===============================================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)

