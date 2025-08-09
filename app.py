from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine, text
import os
import json

app = Flask(__name__, static_folder='dist')
CORS(app)

# Configuración conexión DB (usa variables de entorno para seguridad)
DB_USER = os.environ.get('DB_USER', 'postgres')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Lescano0806.')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = os.environ.get('DB_PORT', '5432')
DB_NAME = os.environ.get('DB_NAME', 'geomapia')

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

# Ruta para servir el frontend
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

# Ruta para servir archivos estáticos
@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# Ruta de estado de la API
@app.route('/api/status')
def api_status():
    return jsonify({"status": "ok", "message": "GeoMapia backend running!"})

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy"})

# Solo operamos con tabla fija points para evitar SQL Injection
TABLE_NAME = "points"

@app.route('/api/geodata', methods=['GET'])
def get_geodata():
    srid = request.args.get("srid", default="4326")
    try:
        query = text(f"""
            SELECT id, name, description, ST_AsGeoJSON(ST_Transform(geom, :srid)) AS geometry
            FROM {TABLE_NAME}
        """)
        with engine.connect() as conn:
            result = conn.execute(query, {"srid": int(srid)})
            features = []
            for row in result:
                geometry = json.loads(row['geometry'])  # seguro vs eval
                features.append({
                    "id": row['id'],
                    "name": row['name'],
                    "description": row['description'],
                    "geometry": geometry
                })
        return jsonify(features)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/geodata', methods=['POST'])
def create_point():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    geometry = data.get("geometry")

    if not geometry or not name:
        return jsonify({"error": "Missing geometry or name"}), 400

    try:
        query = text(f"""
            INSERT INTO {TABLE_NAME} (name, description, geom)
            VALUES (:name, :description, ST_SetSRID(ST_GeomFromGeoJSON(:geom), 4326))
        """)
        with engine.connect() as conn:
            conn.execute(query, {"name": name, "description": description, "geom": json.dumps(geometry)})
            conn.commit()
        return jsonify({"status": "success"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/geodata/<int:id>', methods=['DELETE'])
def delete_point(id):
    try:
        query = text(f"DELETE FROM {TABLE_NAME} WHERE id = :id")
        with engine.connect() as conn:
            result = conn.execute(query, {"id": id})
            conn.commit()
        if result.rowcount == 0:
            return jsonify({"error": "ID not found"}), 404
        return jsonify({"status": "deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)

