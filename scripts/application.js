import { lerPontos, salvarPonto, adicionarPontos, VIRTUDES } from "./settings.js";
import { avisarJogadores } from "./socket.js";
import { pontosVirtudes, animarSegmentos, SEGMENT_COUNT } from "./rings.js";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;

const SOM_REVELACAO = "modules/rufos-ynkera-virtues/assets/oohh.mp3";
const DURACAO_FADE = 4000; // ms que a janela leva para aparecer

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function tocarSom() {
    foundry.audio.AudioHelper.play({
        src: SOM_REVELACAO,
        channel: "interface",
        volume: 0.8,
        autoplay: true,
        loop: false
    });
}

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

    revelacao = null;
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
        const pontos = this.revelacao?.antes ?? lerPontos();

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

        if (this.revelacao) this._iniciarRevelacao(svg);

        if (!game.user.isGM) return;

        for (const input of this.element.querySelectorAll("input[data-virtude]")) {
            input.addEventListener("change", (event) => this._aoMudarPonto(event));
        }
    }

    async _iniciarRevelacao(svg) {
        const revelacao = this.revelacao;
        const aindaValida = () => this.revelacao === revelacao && this.rendered;

        this.element.querySelector(".ryv-root").classList.add("ryv-revelando");

        tocarSom();
        if (revelacao.comFade) await esperar(DURACAO_FADE);
        if (!aindaValida()) return;

        await animarSegmentos(svg, revelacao.antes, revelacao.depois);
        if (!aindaValida()) return;

        this.revelacao = null;
        this.render();
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
        avisarJogadores(antes, depois);

        this.revelacao = { antes, depois, comFade: false };
        this.render();
    }

    async _onFirstRender(context, options) {
        await super._onFirstRender(context, options);

        if (this.revelacao?.comFade) {
            this.element.style.setProperty("--ryv-fade", `${DURACAO_FADE}ms`);
            this.element.classList.add("ryv-fade-in");
        }
    }
}

