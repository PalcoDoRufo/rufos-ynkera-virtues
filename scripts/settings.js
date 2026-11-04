export const MODULE_ID = "rufos-ynkera-virtues";
const SETTING_KEY = "pontos";

export const VIRTUDES = [
  { id: "coragem",   label: "Coragem" },
  { id: "compaixao", label: "Compaixão" },
  { id: "verdade",   label: "Verdade" }
];

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

export async function salvarPonto(id, valor) {
  if (!game.user.isGM) return lerPontos();

  const novos = { ...lerPontos(), [id]: valor };
  await game.settings.set(MODULE_ID, SETTING_KEY, novos);
  return lerPontos();
}

export async function adicionarPontos(deltas) {
  const antes = { ...lerPontos() };
  if (!game.user.isGM) return { antes, depois: antes };

  const depois = {};
  for (const v of VIRTUDES) {
    const soma = antes[v.id] + Math.round(deltas[v.id] || 0);
    depois[v.id] = Math.max(0, Math.min(20, soma));
  }

  await game.settings.set(MODULE_ID, SETTING_KEY, depois);
  return { antes, depois };
}

export function normalizarPontos(obj) {
  const limpo = {};
  for (const v of VIRTUDES) {
    limpo[v.id] = Math.max(0, Math.min(20, Math.round(Number(obj?.[v.id]) || 0)));
  }
  return limpo;
}