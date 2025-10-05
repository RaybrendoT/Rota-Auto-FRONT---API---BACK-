# Imagem base com Python 3.11
FROM python:3.11-slim

# Evita buffers, etc.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia e instala as dependências primeiro (melhor para cache do Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Agora copia a pasta backend para dentro da imagem
COPY backend ./backend

# Expõe a porta do Flask
EXPOSE 5000

ENV FLASK_APP=app.py
# Comando padrão para rodar a aplicação Flask
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
