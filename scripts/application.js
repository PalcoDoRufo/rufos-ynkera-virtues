import { pontosVirtudes, SEGMENT_COUNT } from "./rings.js";
import { lerPontos, salvarPonto, VIRTUDES } from "./settings.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class VirtudesApplication extends HandlebarsApplicationMixin(ApplicationV2) {

    static DEFAULT_OPTIONS = {
        id: "rufos-ynkera-virtues",
        classes: ["rufos-ynkera-virtues"],
        position: { width: 900, height: "auto" },
        window: {
            title: "Rufo's Ynkera Virtues"
        }
    }

    static PARTS = {
        body: {
            template: "modules/rufos-ynkera-virtues/templates/virtues.hbs"
        }
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        const pontos = lerPontos();

        context.isGM = game.user.isGM;
        context.max = SEGMENT_COUNT;
        context.pontos = pontos;
        context.virtudes = VIRTUDES.map(v => ({ ...v, value: pontos[v.id] }));

        return context;
    }

    async _onRender(context, options) {
        await super._onRender(context, options);

        const svg = this.element.querySelector(".ryv-overlay");
        pontosVirtudes(svg, context.pontos);

        if (!game.user.isGM) return;

        for (const input of this.element.querySelectorAll("input[data-virtude]")) {
            input.addEventListener("change", (event) => this._aoMudarPonto(event));
        }
    }

    async _aoMudarPonto(event) {
        const input = event.currentTarget;
        await salvarPonto(input.dataset.virtude, Number(input.value));
        this.render();
    }
}