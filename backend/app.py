from flask import Flask
from backend.extensions import db
from backend.routes.usuarios import usuarios_bp
from backend.routes.motoristas import motoristas_bp
from backend.routes.rotas import rotas_bp
from backend.routes.relatorios import relatorios_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object("backend.config")

    db.init_app(app)

    app.register_blueprint(usuarios_bp, url_prefix="/api/usuarios")
    app.register_blueprint(motoristas_bp, url_prefix="/api/motoristas")
    app.register_blueprint(rotas_bp, url_prefix="/api/rotas")
    app.register_blueprint(relatorios_bp, url_prefix="/api/relatorios")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
