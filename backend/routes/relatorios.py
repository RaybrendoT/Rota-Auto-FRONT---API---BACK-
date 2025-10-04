from flask import Blueprint, jsonify
from backend.extensions import db
from backend.models import Usuario, Rota

relatorios_bp = Blueprint("relatorios", __name__)

@relatorios_bp.route("/usuarios_rotas", methods=["GET"])
def relatorio_usuarios_rotas():
    # Realizando o JOIN entre Usuario e Rota com base no campo rota_id
    usuarios_rotas = db.session.query(Usuario, Rota).join(Rota, Usuario.rota_id == Rota.id).all()

    # Montando a resposta com as informações dos usuários e suas respectivas rotas
    resultado = []
    for usuario, rota in usuarios_rotas:
        resultado.append({
            "usuario": usuario.to_dict(),
            "rota": rota.to_dict()
        })

    return jsonify(resultado)

@relatorios_bp.route("/motoristas_rotas", methods=["GET"])
def relatorio_motoristas_rotas():
    # Realizando o JOIN entre Motorista e Rota com base no campo rota_id
    from backend.models import Motorista

    motoristas_rotas = db.session.query(Motorista, Rota).join(Rota, Motorista.rota_id == Rota.id).all()

    # Montando a resposta com as informações dos motoristas e suas respectivas rotas
    resultado = []
    for motorista, rota in motoristas_rotas:
        resultado.append({
            "motorista": motorista.to_dict(),
            "rota": rota.to_dict()
        })

    return jsonify(resultado)
