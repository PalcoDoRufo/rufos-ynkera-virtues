import { ascenderVirtudes, abrirVirtudes } from "./scene-control.js";
import { registrarSettings } from "./settings.js";
import { registrarSocket } from "./socket.js";

export function hooksIntro() {

    Hooks.once("init", () => {
        console.log("Rufo's Ynkera Virtues | As virtudes foram criadas.")
        registrarSettings();
    })

    Hooks.once("setup", () => {
        console.log("Rufo's Ynkera Virtues | As virtudes estão à postos.")
    })

    Hooks.once("ready", () => {
        console.log("Rufo's Ynkera Virtues | As virtudes foram ascendidas.")
        ui.notifications.info("Virtudes ascendidas.")
        registrarSocket(abrirVirtudes);
    })

}

export function hookVirtudes() {

    Hooks.on("getSceneControlButtons", controls => {
        controls.notes.tools.rufos_ynkera_virtues = {
            name: "rufos_ynkera_virtues",
            title: "Rufo's Ynkera Virtues",
            icon: "fa-solid fa-shield-heart",
            order: Object.keys(controls.notes.tools).length,
            button: true,
            visible: true,
            onChange: ascenderVirtudes
        }
    })
}