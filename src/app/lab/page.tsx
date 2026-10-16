import Link from "next/link";

const designs = [
  { n: 1, name: "Blueprint", line: "Engineering precision on paper: the page compiles itself as you scroll." },
  { n: 2, name: "Kinetic Editorial", line: "Type is the interface: oversize headlines, colour wipes, scroll-lit words." },
  { n: 3, name: "Device Theatre", line: "Dark product-launch stage: a 3D phone turns through the apps as you scroll." },
  { n: 4, name: "Living Signal", line: "The real commit history becomes a particle field that reshapes with the story." },
  { n: 5, name: "Bento Studio", line: "Product-grade showcase: a bento grid assembles, case cards stack, devices play." },
];

export default function LabIndex() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-20 font-sans text-neutral-900">
      <h1 className="text-4xl font-semibold tracking-tight">Five directions</h1>
      <p className="mt-3 text-neutral-500">Working prototypes of the home page. Same content, different design and motion.</p>
      <ol className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
        {designs.map((d) => (
          <li key={d.n}>
            <Link href={`/lab/${d.n}`} className="flex items-baseline gap-6 py-6 transition-colors hover:bg-neutral-50">
              <span className="w-6 text-sm tabular-nums text-neutral-400">{d.n}</span>
              <span>
                <span className="block text-xl font-medium">{d.name}</span>
                <span className="mt-1 block text-neutral-500">{d.line}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
