"use client";

interface Node {
  title: string;
  lines: string[];
}

/** The movement-analysis app's data path, drawn from its real stack. An illustration, not a screenshot. */
export function SystemDiagram({ stack }: { stack: string[] }) {
  const has = (s: string) => stack.find((x) => x.toLowerCase().includes(s.toLowerCase()));
  const nodes: Node[] = [
    { title: "PHONE CAMERA", lines: [has("React Native") ?? "", has("Vision Camera") ?? ""].filter(Boolean) },
    { title: "ON-DEVICE ANALYSIS", lines: ["Pose analysis", has("Skia") ?? ""].filter(Boolean) },
    { title: "API", lines: [has("NestJS") ?? "", has("PostgreSQL") ?? ""].filter(Boolean) },
    { title: "STAFF WEB PANEL", lines: [has("Next.js") ?? ""].filter(Boolean) },
  ];

  const render = (vertical: boolean) => {
    const vw = vertical ? 360 : 960;
    const vh = vertical ? 696 : 330;
    const bw = vertical ? 300 : 210;
    const bh = vertical ? 126 : 142;
    const gap = vertical ? 60 : 36;
    const x0 = vertical ? (vw - bw) / 2 : 6;
    const y0 = vertical ? 6 : (vh - bh) / 2;
    const boxes = nodes.map((nd, i) => ({
      nd,
      x: vertical ? x0 : x0 + i * (bw + gap),
      y: vertical ? y0 + i * (bh + gap) : y0,
    }));
    return (
      <svg className={`sd ${vertical ? "sd-v" : "sd-h"}`} viewBox={`0 0 ${vw} ${vh}`} aria-hidden="true">
        {boxes.map(({ nd, x, y }, i) => (
          <g key={nd.title}>
            <rect className="sd-box" x={x} y={y} width={bw} height={bh} rx="4" />
            <text className="sd-txt sd-ix" x={x + 14} y={y + 28}>{`0${i + 1}`}</text>
            <text className="sd-txt sd-ti" x={x + 14} y={y + 58}>{nd.title}</text>
            {nd.lines.map((l, k) => (
              <text key={l} className="sd-txt sd-st" x={x + 14} y={y + 86 + k * 22}>
                {l}
              </text>
            ))}
          </g>
        ))}
        {boxes.slice(0, -1).map(({ x, y }, i) => {
          const a: [number, number] = vertical ? [x + bw / 2, y + bh] : [x + bw, y + bh / 2];
          const b: [number, number] = vertical ? [x + bw / 2, y + bh + gap] : [x + bw + gap, y + bh / 2];
          return (
            <g key={i}>
              <line className="sd-path" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
              <polyline
                className="sd-arrow sd-txt"
                points={vertical ? `${b[0] - 5},${b[1] - 9} ${b[0]},${b[1]} ${b[0] + 5},${b[1] - 9}` : `${b[0] - 9},${b[1] - 5} ${b[0]},${b[1]} ${b[0] - 9},${b[1] + 5}`}
              />
              <polyline className="sd-route" points="0,0" data-a={`${a[0]},${a[1]}`} data-b={`${b[0]},${b[1]}`} fill="none" />
            </g>
          );
        })}
        <circle className="sd-dot" r="5" cx="0" cy="0" />
      </svg>
    );
  };

  return (
    <div className="sd-wrap">
      {render(false)}
      {render(true)}
    </div>
  );
}
