from flask import Blueprint, jsonify, request
from backend.extensions import db
from backend.models import Rota
from datetime import datetime

rotas_bp = Blueprint("rotas", __name__)

@rotas_bp.route("/", methods=["GET"])
def listar_rotas():
    rotas = Rota.query.all()
    return jsonify([r.to_dict() for r in rotas])

@rotas_bp.route("/<int:rota_id>", methods=["GET"])
def get_rota(rota_id):
    rota = Rota.query.get(rota_id)
    if not rota:
        return jsonify({"error": "Rota não encontrada"}), 404
    return jsonify(rota.to_dict())

@rotas_bp.route("/", methods=["POST"])
def create_rota():
    data = request.get_json()
    rota = Rota(
        nome_rota=data["nome_rota"],
        origem_lat=data["origem_lat"],
        origem_lon=data["origem_lon"],
        destino_lat=data["destino_lat"],
        destino_lon=data["destino_lon"],
        data=datetime.fromisoformat(data["data"]).date(),
        hora=datetime.strptime(data["hora"], "%H:%M").time()
    )
    db.session.add(rota)
    db.session.commit()
    return jsonify(rota.to_dict()), 201
