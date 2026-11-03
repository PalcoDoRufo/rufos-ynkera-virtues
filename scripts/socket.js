import { MODULE_ID } from "./settings.js";

const SOCKET_NAME = `module.${MODULE_ID}`;

export function registrarSocket(aoReceberRevelacao) {
  game.socket.on(SOCKET_NAME, (dados) => {
    if (dados?.tipo !== "revelar") return;
    aoReceberRevelacao(dados);
  });
}

export function avisarJogadores(antes, depois) {
  game.socket.emit(SOCKET_NAME, { tipo: "revelar", antes, depois });
}