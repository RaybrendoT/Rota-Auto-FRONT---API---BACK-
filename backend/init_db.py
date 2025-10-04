from backend.extensions import db
from backend.app import app

def run_schema_sql():
    with app.app_context():
        with open('database/schema.sql', 'r') as file:
            sql_commands = file.read()
            with db.engine.connect() as connection:
                for command in sql_commands.split(';'):
                    command = command.strip()
                    if command:
                        connection.execute(command + ';')

if __name__ == '__main__':
    run_schema_sql()
    print("✅ Banco de dados inicializado com sucesso.")
