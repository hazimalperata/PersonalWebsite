import type { Metadata } from "next";
import { labFacts } from "@/lab/facts";
import "@/lab/d5/d5.css";
import { geistMono, inter } from "@/lab/d5/fonts";
import { Bento } from "@/lab/d5/Bento";
import { Cases } from "@/lab/d5/Cases";
import { Hero } from "@/lab/d5/Hero";
import { Nav } from "@/lab/d5/Nav";
import { AiSection } from "@/lab/d5/Ai";
import { Capabilities, ContactCard, Experience, MoreWork } from "@/lab/d5/Sections";

export const metadata: Metadata = {
  title: "Lab 5 · Bento Studio · Hazim Alper Ata",
};

export default function Page() {
  return (
    <div className={`d5 ${inter.variable} ${geistMono.variable}`}>
      <Nav />
      <main>
        <Hero />

        <section id="proof" className="proof" aria-label="Proof">
          <div className="wrap">
            <h2 className="sr-only">Numbers and studio overview</h2>
            <Bento />
          </div>
        </section>

        <div className="band dark">
          <section id="work" className="wrap" aria-labelledby="work-h">
            <div className="sec-head">
              <span className="label">Selected work</span>
              <h2 id="work-h" className="display">
                Products people use, built end to end.
              </h2>
              <p>Five projects, from store releases to platforms in production.</p>
            </div>
            <Cases />
          </section>
        </div>

        <section id="more" className="more wrap" aria-labelledby="more-h">
          <div className="sec-head">
            <span className="label">More work</span>
            <h2 id="more-h" className="display">
              And a few more.
            </h2>
          </div>
          <MoreWork />
        </section>

        <section id="capabilities" className="caps wrap" aria-labelledby="cap-h">
          <div className="sec-head">
            <span className="label">Capabilities</span>
            <h2 id="cap-h" className="display">
              The whole path from pixel to production.
            </h2>
          </div>
          <Capabilities />
        </section>

        <section id="ai" className="ai wrap" aria-labelledby="ai-h">
          <AiSection />
        </section>

        <section id="experience" className="exp wrap" aria-labelledby="exp-h">
          <div className="sec-head">
            <span className="label">Experience</span>
            <h2 id="exp-h" className="display">
              Where I have shipped.
            </h2>
          </div>
          <Experience />
        </section>

        <section id="contact" className="contact wrap" aria-labelledby="contact-h">
          <h2 id="contact-h" className="sr-only">
            Contact
          </h2>
          <ContactCard />
        </section>
      </main>

      <footer>
        <div className="wrap">
          <span>
            &copy; {new Date().getFullYear()} {labFacts.name}
          </span>
          <span className="mono" style={{ fontSize: 13 }}>
            Built with Next.js 16, React 19, GSAP, Motion
          </span>
        </div>
      </footer>
    </div>
  );
}
