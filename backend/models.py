from datetime import datetime
from backend.extensions import db

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    telefone = db.Column(db.String(20), primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    checkin = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default='Normal')

    # Relacionamento com rota
    rota_id = db.Column(db.Integer, db.ForeignKey('rotas.id'), nullable=True)
    rota = db.relationship("Rota", backref="usuarios")

    data_atualizacao = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "telefone": self.telefone,
            "nome": self.nome,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "status": self.status,
            "checkin": self.checkin,
            "rota_id": self.rota_id,
            "rota_nome": self.rota.nome_rota if self.rota else None,
            "data_atualizacao": self.data_atualizacao.isoformat() if self.data_atualizacao else None,
        }


class Rota(db.Model):
    __tablename__ = 'rotas'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_rota = db.Column(db.String(50), nullable=False)
    origem_lat = db.Column(db.Float, nullable=False)
    origem_lon = db.Column(db.Float, nullable=False)
    destino_lat = db.Column(db.Float, nullable=False)
    destino_lon = db.Column(db.Float, nullable=False)
    data = db.Column(db.Date, nullable=False)
    hora = db.Column(db.Time, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nome_rota": self.nome_rota,
            "origem_lat": self.origem_lat,
            "origem_lon": self.origem_lon,
            "destino_lat": self.destino_lat,
            "destino_lon": self.destino_lon,
            "data": self.data.isoformat(),
            "hora": self.hora.strftime("%H:%M"),
        }


class Motorista(db.Model):
    __tablename__ = 'motoristas'
    telefone = db.Column(db.String(20), primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(20), default='Normal')
    checkin = db.Column(db.Boolean, default=False)

    rota_id = db.Column(db.Integer, db.ForeignKey('rotas.id'), nullable=True)
    rota = db.relationship("Rota", backref="motoristas")

    data_atualizacao = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "telefone": self.telefone,
            "nome": self.nome,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "status": self.status,
            "checkin": self.checkin,
            "rota_id": self.rota_id,
            "rota_nome": self.rota.nome_rota if self.rota else None,
            "data_atualizacao": self.data_atualizacao.isoformat() if self.data_atualizacao else None,
        }
