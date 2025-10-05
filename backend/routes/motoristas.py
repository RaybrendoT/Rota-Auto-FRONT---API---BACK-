from flask import Blueprint, jsonify, request
from backend.extensions import db
from backend.models import Motorista

motoristas_bp = Blueprint("motoristas", __name__)


# Listar todos os motoristas
@motoristas_bp.route("/", methods=["GET"])
def listar_motoristas():
    motoristas = Motorista.query.all()
    return jsonify([m.to_dict() for m in motoristas])


# Obter um motorista específico pelo telefone
@motoristas_bp.route("/<telefone>", methods=["GET"])
def get_motorista(telefone):
    motorista = Motorista.query.get(telefone)
    if not motorista:
        return jsonify({"error": "Motorista não encontrado"}), 404
    return jsonify(motorista.to_dict())


# Criar um novo motorista
@motoristas_bp.route("/", methods=["POST"])
def create_motorista():
    data = request.get_json()

    # Permite definir rota_id se for passado
    motorista = Motorista(**data)

    db.session.add(motorista)
    db.session.commit()
    return jsonify(motorista.to_dict()), 201


# Atualizar os dados de um motorista
@motoristas_bp.route("/<telefone>", methods=["PUT"])
def update_motorista(telefone):
    motorista = Motorista.query.get(telefone)
    if not motorista:
        return jsonify({"error": "Motorista não encontrado"}), 404

    data = request.get_json()
    for k, v in data.items():
        setattr(motorista, k, v)

    db.session.commit()
    return jsonify(motorista.to_dict())


# Excluir um motorista
@motoristas_bp.route("/<telefone>", methods=["DELETE"])
def delete_motorista(telefone):
    motorista = Motorista.query.get(telefone)
    if not motorista:
        return jsonify({"error": "Motorista não encontrado"}), 404

    db.session.delete(motorista)
    db.session.commit()
    return jsonify({"message": f"Motorista {telefone} removido"})
