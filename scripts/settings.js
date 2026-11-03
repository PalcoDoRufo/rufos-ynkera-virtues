export const MODULE_ID = "rufos-ynkera-virtues";
const SETTING_KEY = "pontos";

export function registrarSettings() {
  const { NumberField, SchemaField } = foundry.data.fields;

  const campoVirtude = () => new NumberField({
    required: true,
    nullable: false,
    integer: true,
    min: 0,
    max: 20,
    initial: 0
  });

  game.settings.register(MODULE_ID, SETTING_KEY, {
    name: "Pontos de Virtude",
    scope: "world",
    config: false,
    type: new SchemaField({
      coragem: campoVirtude(),
      compaixao: campoVirtude(),
      verdade: campoVirtude()
    }),
    default: { coragem: 0, compaixao: 0, verdade: 0 }
  });
}

export function lerPontos() {
  return game.settings.get(MODULE_ID, SETTING_KEY);
}