import { pontosVirtudes, SEGMENT_COUNT } from "./rings.js";
import { lerPontos, salvarPonto, adicionarPontos, VIRTUDES } from "./settings.js";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;

async function perguntarPontos() {
    const campos = VIRTUDES.map(v => `
    <div class="form-group">
      <label>${v.label}</label>
      <div class="form-fields">
        <input type="number" name="${v.id}" value="0" min="0" max="20" step="1">
      </div>
    </div>
  `).join("");

    return DialogV2.prompt({
        window: { title: "Adicionar Pontos de Virtude", icon: "fa-solid fa-plus" },
        content: campos,
        ok: {
            label: "OK",
            icon: "fa-solid fa-check",
            callback: (event, button, dialog) => {
                const deltas = {};
                for (const v of VIRTUDES) {
                    deltas[v.id] = button.form.elements[v.id].valueAsNumber || 0;
                }
                return deltas;
            }
        },
        rejectClose: false
    });
}

export class VirtudesApplication extends HandlebarsApplicationMixin(ApplicationV2) {

    static DEFAULT_OPTIONS = {
        id: "rufos-ynkera-virtues",
        classes: ["rufos-ynkera-virtues"],
        position: { width: 900, height: "auto" },
        window: {
            title: "Rufo's Ynkera Virtues"
        },
        actions: {
            adicionar: VirtudesApplication._aoAdicionar
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

    static async _aoAdicionar(event, target) {
        const deltas = await perguntarPontos();
        if (!deltas) return;

        const soma = Object.values(deltas).reduce((a, b) => a + b, 0);
        if (soma <= 0) return;

        const { antes, depois } = await adicionarPontos(deltas);
        console.log("Rufo's Ynkera Virtues | Pontos:", { antes, depois });

        this.render();
    }
}