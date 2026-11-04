import { MODULE_ID, normalizarPontos } from "./settings.js";

const SOCKET_NAME = `module.${MODULE_ID}`;

export function avisarJogadores(antes, depois) {
  game.socket.emit(SOCKET_NAME, { tipo: "revelar", antes, depois });
}

export function registrarSocket(aoReceberRevelacao) {
  game.socket.on(SOCKET_NAME, (dados) => {
    if (dados?.tipo !== "revelar") return;

    aoReceberRevelacao({
      antes: normalizarPontos(dados.antes),
      depois: normalizarPontos(dados.depois)
    });
  });
}