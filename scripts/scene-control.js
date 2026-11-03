import { VirtudesApplication } from "./application.js";

export function ascenderVirtudes() {
    const existente = foundry.applications.instances.get("rufos-ynkera-virtues");
    if (existente) existente.close();
    else new VirtudesApplication().render({ force: true });
}

export function abrirVirtudes() {
    const existente = foundry.applications.instances.get("rufos-ynkera-virtues");
    if (existente) existente.render({ force: true });
    else new VirtudesApplication().render({ force: true });
}