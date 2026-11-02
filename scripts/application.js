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
}