const SVG_NS = "http://www.w3.org/2000/svg";

export const SEGMENT_COUNT = 20;      // quantos segmentos por anel
const SEGMENT_WIDTH = 27;             // espessura do anel
const EMPTY_COLOR = "#1D1916";      // cor do segmento vazio
const BORDER_COLOR = "#000000";
const BORDER_WIDTH = 2;

export const RINGS = [
  { id: "compaixao", cx: 765, cy: 354, r: 225, start: 190, end: 350, color: "#1FD540" },
  { id: "coragem",   cx: 592, cy: 607, r: 215, start: 60,  end: 240, color: "#FFFFFF" },
  { id: "verdade",   cx: 930, cy: 605, r: 220, start: -60, end: 120, color: "#9B30FF" }
];

function point(cx, cy, r, angleDeg) {
  const a = angleDeg * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function segmentPath(ring, startAngle, endAngle) {
  const outer = ring.r + SEGMENT_WIDTH / 2;
  const inner = ring.r - SEGMENT_WIDTH / 2;

  const oStart = point(ring.cx, ring.cy, outer, startAngle);
  const oEnd   = point(ring.cx, ring.cy, outer, endAngle);
  const iEnd   = point(ring.cx, ring.cy, inner, endAngle);
  const iStart = point(ring.cx, ring.cy, inner, startAngle);

  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${outer} ${outer} 0 0 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${inner} ${inner} 0 0 0 ${iStart.x} ${iStart.y}`,
    "Z"
  ].join(" ");
}

export function pontosVirtudes(svg, values) {
  svg.replaceChildren();

  for (const ring of RINGS) {
    const value = values[ring.id] ?? 0;
    const step = (ring.end - ring.start) / SEGMENT_COUNT;

    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const filled = i < value;
      const path = document.createElementNS(SVG_NS, "path");

      path.setAttribute("d", segmentPath(ring, ring.start + i * step, ring.start + (i + 1) * step));
      path.setAttribute("fill", filled ? ring.color : EMPTY_COLOR);
      path.setAttribute("fill-opacity", filled ? "0.74" : "0.76");
      path.setAttribute("stroke", BORDER_COLOR);
      path.setAttribute("stroke-width", String(BORDER_WIDTH));
      path.setAttribute("stroke-linejoin", "round");

      path.dataset.ring = ring.id;
      path.dataset.index = i;

      svg.appendChild(path);
    }
  }
}