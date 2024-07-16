from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import unidecode

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('../prices.db')
    conn.row_factory = sqlite3.Row
    return conn

def read_brisage_values(file_path):
    brisage_values = {}
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            item, value = line.split(':')
            brisage_values[unidecode.unidecode(item.strip())] = value.strip()
    return brisage_values

@app.route('/api/items', methods=['GET'])
def get_items():
    conn = get_db_connection()
    max_ts_minute = conn.execute('SELECT strftime("%Y-%m-%dT%H:%M", MAX(timestamp)) AS max_ts_minute FROM prices').fetchone()['max_ts_minute']
    items = conn.execute('SELECT * FROM prices WHERE strftime("%Y-%m-%dT%H:%M", timestamp) = ?', (max_ts_minute,)).fetchall()
    conn.close()
    
    # Lire les valeurs de brisage
    brisage_values = read_brisage_values('../brisage.txt')
    
    items_with_brisage = []
    for item in items:
        item_dict = dict(item)
        item_name_unidecoded = unidecode.unidecode(item_dict['item'])
        item_dict['brisage_value'] = brisage_values.get(item_name_unidecoded, 'N/A')
        items_with_brisage.append(item_dict)
    
    return jsonify(items_with_brisage)

@app.route('/')
def index():
    return send_from_directory('', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('', path)

if __name__ == '__main__':
    app.run(debug=True)
