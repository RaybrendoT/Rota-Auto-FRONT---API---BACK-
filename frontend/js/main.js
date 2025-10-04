const API_URL = "http://127.0.0.1:5000/api";

/* ====== MODAIS E FORMULÁRIOS ====== */
const modalUsuario = new bootstrap.Modal(document.getElementById("modalUsuario"));
const formUsuario = document.getElementById("formUsuario");
const mensagemDiv = document.getElementById("mensagem");
const formRota = document.getElementById("formRota");
const btnToggleDark = document.getElementById('btnToggleDark');

let usuarioAtual = null;

/* ====== TOGGLE DARK MODE ====== */
btnToggleDark?.addEventListener('click', () => {
  const html = document.documentElement;
  const atual = html.getAttribute('data-bs-theme');
  html.setAttribute('data-bs-theme', atual === 'dark' ? 'light' : 'dark');
});

/* ====== MAPA (Leaflet + OSRM) ====== */
let map, markerOrigem, markerDestino, routingControl;

function inicializarMapa() {
  map = L.map('map').setView([-15.8, -47.9], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  markerOrigem = L.marker([0,0], {draggable:true}).addTo(map).bindPopup('Origem').openPopup();
  markerDestino = L.marker([0,0], {draggable:true}).addTo(map).bindPopup('Destino').openPopup();

  markerOrigem.remove();
  markerDestino.remove();

  markerOrigem.on('dragend', e => {
    const pos = e.target.getLatLng();
    document.getElementById('origem_lat').value = pos.lat.toFixed(6);
    document.getElementById('origem_lon').value = pos.lng.toFixed(6);
    atualizarRota();
    validarInputCoords();
  });

  markerDestino.on('dragend', e => {
    const pos = e.target.getLatLng();
    document.getElementById('destino_lat').value = pos.lat.toFixed(6);
    document.getElementById('destino_lon').value = pos.lng.toFixed(6);
    atualizarRota();
    validarInputCoords();
  });

  routingControl = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: () => null
  }).addTo(map);
}

function coordenadasValidas(lat, lon) {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

function atualizarRota() {
  const latO = parseFloat(document.getElementById('origem_lat').value);
  const lonO = parseFloat(document.getElementById('origem_lon').value);
  const latD = parseFloat(document.getElementById('destino_lat').value);
  const lonD = parseFloat(document.getElementById('destino_lon').value);

  if(
    isNaN(latO) || isNaN(lonO) || isNaN(latD) || isNaN(lonD) ||
    !coordenadasValidas(latO, lonO) || !coordenadasValidas(latD, lonD)
  ) {
    routingControl.setWaypoints([]);
    if(markerOrigem) markerOrigem.remove();
    if(markerDestino) markerDestino.remove();
    return;
  }

  const origem = L.latLng(latO, lonO);
  const destino = L.latLng(latD, lonD);

  markerOrigem.setLatLng(origem).addTo(map);
  markerDestino.setLatLng(destino).addTo(map);

  routingControl.setWaypoints([origem, destino]);

  const group = new L.featureGroup([markerOrigem, markerDestino]);
  map.fitBounds(group.getBounds().pad(0.5));
}

function validarInput(input) {
  if(input.checkValidity()){
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  }
}

function validarInputCoords(){
  ['origem_lat', 'origem_lon', 'destino_lat', 'destino_lon'].forEach(id => {
    const input = document.getElementById(id);
    validarInput(input);
  });
}

function animarCards() {
  const cards = document.querySelectorAll("#cardsEstatisticas .card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("animate-in");
    }, index * 150);
  });
}

function limparValidacoes(form){
  form.querySelectorAll(".is-valid, .is-invalid").forEach(el => {
    el.classList.remove("is-valid", "is-invalid");
  });
}

function carregarUsuarios() {
  fetch(`${API_URL}/usuarios`)
    .then(res => res.json())
    .then(usuarios => {
      const tabela = document.getElementById('tabelaUsuarios');
      tabela.innerHTML = '';

      usuarios.forEach(usuario => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <td>${usuario.telefone}</td>
          <td>${usuario.nome}</td>
          <td>${usuario.latitude || '-'}</td>
          <td>${usuario.longitude || '-'}</td>
          <td>${usuario.status}</td>
          <td>${usuario.checkin ? 'Sim' : 'Não'}</td>
          <td>
            <button class="btn btn-sm btn-danger btn-deletar" 
              data-telefone="${usuario.telefone}" 
              onclick="deletarUsuario('${usuario.telefone}', '${usuario.nome}')">
              Excluir
            </button>
          </td>
        `;
        tabela.appendChild(linha);
      });
    })
    .catch(error => console.error('Erro ao carregar usuários:', error));
}


function abrirModalEditarUsuario(u){
  usuarioAtual = u.telefone;
  const modalUsuarioLabel = document.getElementById("modalUsuarioLabel");
  modalUsuarioLabel.textContent = "Editar Usuário";
  formUsuario.telefone.value = u.telefone;
  formUsuario.telefone.disabled = true;
  formUsuario.nome.value = u.nome;
  formUsuario.latitude.value = u.latitude ?? '';
  formUsuario.longitude.value = u.longitude ?? '';
  formUsuario.status.value = u.status;
  formUsuario.checkin.checked = u.checkin;
  limparValidacoes(formUsuario);
  modalUsuario.show();
}
async function carregarRotas() {
  try {
    const res = await fetch(`${API_URL}/rotas`);
    if (!res.ok) throw new Error("Erro ao buscar rotas");

    const rotas = await res.json();
    const select = document.getElementById("rota_id");

    // Limpa opções antigas (menos a opção vazia)
    select.innerHTML = `<option value="">-- Nenhuma rota --</option>`;

    rotas.forEach(rota => {
      const option = document.createElement("option");
      option.value = rota.id;
      option.textContent = `${rota.nome_rota} (${rota.data} ${rota.hora})`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar rotas:", error);
  }
}

async function deletarUsuario(telefone, nome){
  if(!confirm(`Deseja deletar o usuário ${nome}?`)) return;

  let btnDeletar = document.querySelector(`button.btn-deletar[data-telefone="${telefone}"]`);

  try {
    if(btnDeletar) btnDeletar.disabled = true;

    const res = await fetch(`${API_URL}/usuarios/${telefone}`, { method: "DELETE" });
    if(!res.ok) throw new Error("Erro ao deletar usuário.");

    await carregarUsuarios();
  } catch (err) {
    console.error(err);
    alert("Erro ao deletar usuário.");
  } finally {
    if(btnDeletar) btnDeletar.disabled = false;
  }
}

/* ====== EVENTOS ====== */
window.addEventListener("DOMContentLoaded", () => {
  if(document.getElementById('map')) inicializarMapa();

  if(document.querySelectorAll("#cardsEstatisticas .card").length > 0){
    animarCards();
  }

  if(formRota){
    const inputs = formRota.querySelectorAll('input, select');

    inputs.forEach(input => {
      input.addEventListener('input', e => {
        validarInput(e.target);
        if(['origem_lat','origem_lon','destino_lat','destino_lon'].includes(e.target.id)){
          atualizarRota();
          validarInputCoords();
        }
      });
    });

    formRota.addEventListener('submit', async e => {
      e.preventDefault();

      if(!formRota.checkValidity()) {
        inputs.forEach(i => validarInput(i));
        mensagemDiv.innerHTML = `<div class="alert alert-danger">Corrija os erros antes de enviar.</div>`;
        return;
      }

      mensagemDiv.innerHTML = "";
      const btnEnviar = formRota.querySelector('button[type="submit"]');
      btnEnviar.disabled = true;

      const data = {
        nome: document.getElementById("nome").value,
        origem_lat: parseFloat(document.getElementById("origem_lat").value),
        origem_lon: parseFloat(document.getElementById("origem_lon").value),
        destino_lat: parseFloat(document.getElementById("destino_lat").value),
        destino_lon: parseFloat(document.getElementById("destino_lon").value),
      };

      try {
        const res = await fetch(`${API_URL}/rotas`, {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify(data)
        });

        if(!res.ok) throw new Error("Erro ao enviar rota.");
        mensagemDiv.innerHTML = `<div class="alert alert-success">Rota enviada com sucesso!</div>`;
        formRota.reset();
        limparValidacoes(formRota);
        if(markerOrigem) markerOrigem.remove();
        if(markerDestino) markerDestino.remove();
        routingControl.setWaypoints([]);

      } catch (err) {
        console.error(err);
        mensagemDiv.innerHTML = `<div class="alert alert-danger">Erro ao enviar rota.</div>`;
      } finally {
        btnEnviar.disabled = false;
      }
    });
  }

  if(formUsuario){
    formUsuario.addEventListener("submit", async e => {
      e.preventDefault();
      limparValidacoes(formUsuario);

      if(!formUsuario.checkValidity()) {
        [...formUsuario.elements].forEach(i => {
          if(i.tagName === "INPUT" || i.tagName === "SELECT") validarInput(i);
        });
        mostrarMensagemUsuario("Corrija os erros antes de enviar.", "danger");
        return;
      }

      const btnSalvar = formUsuario.querySelector('button[type="submit"]');
      btnSalvar.disabled = true;

      const data = {
        telefone: formUsuario.telefone.value,
        nome: formUsuario.nome.value,
        latitude: formUsuario.latitude.value || null,
        longitude: formUsuario.longitude.value || null,
        status: formUsuario.status.value,
        checkin: formUsuario.checkin.checked,
        rota_id: formUsuario.rota_id.value = usuario.rota_id|| ""
      };

      try {
        let res;
        if(usuarioAtual) {
          res = await fetch(`${API_URL}/usuarios/${usuarioAtual}`, {
            method: "PUT",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
          });
        } else {
          res = await fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
          });
        }

        if(!res.ok) {
          const erroMsg = await res.text();
          throw new Error(erroMsg || "Erro ao salvar usuário");
        }

        mostrarMensagemUsuario("Usuário salvo com sucesso!", "success");
        modalUsuario.hide();
        await carregarUsuarios();
        usuarioAtual = null;
        formUsuario.reset();
        limparValidacoes(formUsuario);

      } catch (err) {
        console.error(err);
        mostrarMensagemUsuario(`Erro: ${err.message}`, "danger");
      } finally {
        btnSalvar.disabled = false;
      }
    });

    document.getElementById("modalUsuario").addEventListener("hidden.bs.modal", () => {
      usuarioAtual = null;
      formUsuario.reset();
      formUsuario.telefone.disabled = false;
      formUsuario.rota_id.value = "";
      limparValidacoes(formUsuario);
      limparMensagemUsuario();
      document.getElementById("modalUsuarioLabel").textContent = "Novo Usuário";
    });
  }

  carregarUsuarios();
});

/* ====== MENSAGENS USUÁRIO ====== */
function mostrarMensagemUsuario(texto, tipo="info"){
  const msgArea = document.getElementById("mensagemUsuarios");
  if(msgArea) {
    msgArea.innerHTML = `<div class="alert alert-${tipo}" role="alert">${texto}</div>`;
  } else {
    alert(texto);
  }
}

function limparMensagemUsuario(){
  const msgArea = document.getElementById("mensagemUsuarios");
  if(msgArea) msgArea.innerHTML = "";
}
