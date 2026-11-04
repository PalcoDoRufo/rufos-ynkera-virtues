import { VirtudesApplication } from "./application.js";

export function ascenderVirtudes() {
    const existente = foundry.applications.instances.get("rufos-ynkera-virtues");
    if (existente) existente.close();
    else new VirtudesApplication().render({ force: true });
}

export function abrirVirtudes(dados) {
    const existente = foundry.applications.instances.get("rufos-ynkera-virtues");
    const app = existente ?? new VirtudesApplication();

    if (dados) {
        app.revelacao = { antes: dados.antes, depois: dados.depois, comFade: !existente };
    }

    app.render({ force: true });
}