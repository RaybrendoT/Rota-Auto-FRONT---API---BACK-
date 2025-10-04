from flask import Blueprint, jsonify, request
from backend.extensions import db
from backend.models import Usuario

usuarios_bp = Blueprint("usuarios", __name__)

@usuarios_bp.route("/", methods=["GET"])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([u.to_dict() for u in usuarios])

@usuarios_bp.route("/<telefone>", methods=["GET"])
def get_usuario(telefone):
    usuario = Usuario.query.get(telefone)
    if not usuario:
        return jsonify({"error": "Usuário não encontrado"}), 404
    return jsonify(usuario.to_dict())

@usuarios_bp.route("/", methods=["POST"])
def create_usuario():
    data = request.get_json()
    usuario = Usuario(**data)
    db.session.add(usuario)
    db.session.commit()
    return jsonify(usuario.to_dict()), 201

@usuarios_bp.route("/<telefone>", methods=["PUT"])
def update_usuario(telefone):
    usuario = Usuario.query.get(telefone)
    if not usuario:
        return jsonify({"error": "Usuário não encontrado"}), 404
    data = request.get_json()
    for k, v in data.items():
        setattr(usuario, k, v)
    db.session.commit()
    return jsonify(usuario.to_dict())

@usuarios_bp.route("/<telefone>", methods=["DELETE"])
def delete_usuario(telefone):
    usuario = Usuario.query.get(telefone)
    if not usuario:
        return jsonify({"error": "Usuário não encontrado"}), 404
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"message": f"Usuário {telefone} removido"})
