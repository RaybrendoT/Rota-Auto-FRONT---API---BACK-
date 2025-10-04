-- Criar tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    telefone VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    status VARCHAR(20) DEFAULT 'ativo',
    checkin BOOLEAN DEFAULT false,
    data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de Rotas
CREATE TABLE IF NOT EXISTS rotas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    origem_lat NUMERIC(9,6),
    origem_lon NUMERIC(9,6),
    destino_lat NUMERIC(9,6),
    destino_lon NUMERIC(9,6),
    data DATE NOT NULL,
    hora TIME NOT NULL
);
-- Criar tabela de Motoristas
CREATE TABLE IF NOT EXISTS motoristas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) UNIQUE NOT NULL,
    cnh VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo',
    rota_id INT REFERENCES rotas(id) ON DELETE SET NULL,
    data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Inserir motoristas de teste
INSERT INTO motoristas (nome, telefone, cnh, status, rota_id)
VALUES
    ('Pedro Alves', '11911112222', '1234567890', 'ativo', 1),
    ('Fernanda Costa', '21933334444', '9876543210', 'ativo', 2)
ON CONFLICT (telefone) DO NOTHING;

-- Inserir usuários de teste
INSERT INTO usuarios (telefone, nome, latitude, longitude, checkin, status)
VALUES
    ('11999999999', 'João Silva', -23.550520, -46.633308, true, 'ativo'),
    ('21988888888', 'Maria Souza', -22.906847, -43.172896, false, 'ausente'),
    ('31977777777', 'Carlos Lima', -19.916681, -43.934493, false, 'desligado')
ON CONFLICT (telefone) DO NOTHING;

-- Inserir rotas de teste
INSERT INTO rotas (nome, origem_lat, origem_lon, destino_lat, destino_lon, data, hora)
VALUES
    ('Rota SP-RJ', -23.550520, -46.633308, -22.906847, -43.172896, '2025-10-10', '08:00'),
    ('Rota BH-SP', -19.916681, -43.934493, -23.550520, -46.633308, '2025-10-12', '14:30')
ON CONFLICT DO NOTHING;
