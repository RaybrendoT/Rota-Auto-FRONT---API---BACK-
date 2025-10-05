import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:12345@postgresdb:5432/n8n"  # mesmo que docker-compose.yml
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
