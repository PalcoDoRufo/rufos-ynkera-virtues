import { VirtudesApplication } from "./application.js";

export function ascenderVirtudes() {
    const existente = foundry.applications.instances.get("rufos-ynkera-virtues");
    if (existente) existente.close();
    else new VirtudesApplication().render({ force: true });
}