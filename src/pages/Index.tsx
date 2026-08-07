import { useEffect, useRef, useState } from "react";
import workEndpoint from "@/assets/work-endpoint.jpg";
import workRestaurante from "@/assets/work-restaurante.jpg";
import workArquivo from "@/assets/work-arquivo.jpg";
import studioHumans from "@/assets/studio-humans.jpg";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
const WHATSAPP_NUMBER = "351934484781";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vi o site da BuildWeb e queria falar sobre um projeto."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
const COORDS = "41.1579 N / 8.6291 W";

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .clip-up"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrollPct() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return pct;
}

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("pt-PT", {
        hour: "2-digit", minute: "2-digit",
        timeZone: "Europe/Lisbon", hour12: false,
      }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 20000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ------------------------------------------------------------------ */
/* Motif primitives — registration mark, section sign, mono metadata   */
/* ------------------------------------------------------------------ */
const Reg = ({ className = "" }: { className?: string }) => (
  <span className={`reg ${className}`} aria-hidden />
);

const Meta = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`meta text-muted-foreground ${className}`}>{children}</span>
);

const SectionMark = ({
  n, label, right,
}: { n: string; label: string; right?: string }) => (
  <div className="flex items-center gap-3 rule-b pb-3">
    <Reg />
    <span className="meta text-foreground">§{n}</span>
    <span className="meta text-muted-foreground">{label}</span>
    <span className="leader" aria-hidden />
    {right && <span className="meta text-muted-foreground">{right}</span>}
  </div>
);

const MetaRow = ({ k, v, href }: { k: string; v: string; href?: string }) => (
  <div className="flex items-end w-full">
    <span className="meta text-muted-foreground shrink-0">{k}</span>
    <span className="leader" aria-hidden />
    {href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="meta link-underline shrink-0">
        {v} ↗
      </a>
    ) : (
      <span className="meta shrink-0">{v}</span>
    )}
  </div>
);

/* Cursor label that follows the pointer inside a container */
function useCursorLabel<T extends HTMLElement>() {
  const wrap = useRef<T | null>(null);
  const dot = useRef<HTMLSpanElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
      }
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);
  return { wrap, dot, on, setOn };
}

const CursorPlate = ({
  href, src, alt, imgClass = "", label = "ABRIR", w, h, priority = false,
}: {
  href: string; src: string; alt: string; imgClass?: string; label?: string;
  w: number; h: number; priority?: boolean;
}) => {
  const { wrap, dot, on, setOn } = useCursorLabel<HTMLAnchorElement>();
  return (
    <a
      ref={wrap}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden bg-paper-2 cursor-none"
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
    >
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? "eager" : "lazy"}
        className={`w-full grayscale-hover group-hover:scale-[1.015] ${imgClass}`}
      />
      <span
        ref={dot}
        className={`pointer-events-none absolute left-0 top-0 z-20 hidden lg:block transition-opacity duration-200 ${
          on ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-signal px-3 py-2">
          <span className="meta !text-paper whitespace-nowrap">{label} ↗</span>
        </span>
      </span>
    </a>
  );
};

/* ------------------------------------------------------------------ */
/* Fixed frame                                                         */
/* ------------------------------------------------------------------ */
const Frame = () => {
  const pct = useScrollPct();
  const clock = useClock();
  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden lg:block">
      {[
        "top-4 left-4 border-t border-l",
        "top-4 right-4 border-t border-r",
        "bottom-4 left-4 border-b border-l",
        "bottom-4 right-4 border-b border-r",
      ].map((c) => (
        <span key={c} className={`absolute w-3.5 h-3.5 border-signal/70 ${c}`} />
      ))}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5">
        <span className="meta-sm vert text-muted-foreground tracking-[0.3em]">{COORDS}</span>
        <Reg />
        <span className="meta-sm vert text-muted-foreground tracking-[0.3em]">PORTO {clock}</span>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <span className="meta-sm mono text-muted-foreground">{String(pct).padStart(3, "0")}</span>
        <span className="w-px h-24 bg-rule relative">
          <span className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-signal" style={{ top: `${pct}%` }} />
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */
const Nav = () => (
  <header className="sticky top-0 z-50 bg-paper/85 backdrop-blur-[2px] rule-b">
    <div className="flex items-center justify-between px-5 lg:px-14 h-14">
      <a href="#top" className="flex items-baseline gap-2">
        <span className="cond text-xl">BUILDWEB</span>
        <span className="meta text-muted-foreground hidden sm:inline">ESTÚDIO / PORTO</span>
      </a>
      <nav className="flex items-center gap-5 lg:gap-8">
        {[
          ["01", "TRABALHO", "#trabalho"],
          ["03", "SERVIÇOS", "#servicos"],
          ["05", "ESTÚDIO", "#estudio"],
        ].map(([n, t, h]) => (
          <a key={t} href={h} className="hidden md:flex items-baseline gap-1.5 group">
            <span className="meta text-signal">{n}</span>
            <span className="meta text-foreground link-underline">{t}</span>
          </a>
        ))}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="meta bg-ink text-paper px-3 py-2 hover:bg-signal transition-colors">
          WHATSAPP ↗
        </a>
      </nav>
    </div>
  </header>
);

/* ------------------------------------------------------------------ */
/* §00 — Opening                                                       */
/* ------------------------------------------------------------------ */
const Hero = () => (
  <section id="top" className="relative px-5 lg:px-14 pt-10 lg:pt-16 pb-0">
    <div className="grid grid-cols-12 gap-x-6">
      {/* statement */}
      <div className="col-span-12 lg:col-span-9">
        <div className="flex items-center gap-3 mb-6 lg:mb-10">
          <Reg />
          <Meta>§00 — ABERTURA</Meta>
          <span className="leader hidden sm:block" aria-hidden />
          <Meta className="hidden sm:inline">ED. 2026</Meta>
        </div>
        <h1 className="cond text-[19vw] lg:text-[13.5vw] -ml-1">
          <span className="block animate-fade-in-up">SITES QUE</span>
          <span className="block animate-fade-in-up [animation-delay:120ms]">
            NÃO PEDEM{" "}
            <span className="serif-em text-[0.72em] tracking-tight text-signal normal-case align-baseline">licença</span>
          </span>
          <span className="block animate-fade-in-up [animation-delay:240ms]">PARA EXISTIR.</span>
        </h1>
      </div>

      {/* quiet supporting column, pushed to the edge */}
      <div className="col-span-12 lg:col-span-3 flex flex-col justify-end pt-8 lg:pt-0 lg:pb-4">
        <p className="text-sm leading-relaxed text-foreground/75 max-w-xs mb-6">
          Estúdio de dois. Desenhamos e escrevemos o código do teu site.
          Uma semana, não três meses.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-between gap-4 bg-ink text-paper px-4 py-4 hover:bg-signal transition-colors w-full max-w-xs"
        >
          <span className="cond text-2xl">COMEÇAR AGORA</span>
          <span className="meta !text-paper">↗</span>
        </a>
      </div>
    </div>

    {/* real work, immediately — cropped and bleeding off the right edge */}
    <div className="grid grid-cols-12 gap-x-6 mt-10 lg:mt-14 items-end">
      <div className="col-span-12 lg:col-span-4 order-2 lg:order-1 pb-2">
        <div className="flex flex-col gap-1.5 max-w-sm mt-8 lg:mt-0">
          <MetaRow k="EM DESTAQUE" v="ENDPOINT DIGITAL" />
          <MetaRow k="BUILD" v="4 DIAS" />
          <MetaRow k="URL" v="endpoint.digital" href="https://endpoint.digital" />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-8 order-1 lg:order-2 -mr-5 lg:-mr-14">
        <CursorPlate
          href="https://endpoint.digital"
          src={workEndpoint}
          alt="Landing page da Endpoint Digital em azul escuro, vista num portátil"
          imgClass="h-[46vh] lg:h-[58vh] object-cover object-[42%_28%]"
          label="ENDPOINT.DIGITAL"
          w={1408}
          h={1008}
          priority
        />
      </div>
    </div>

    {/* marquee ticker as a rule */}
    <div className="mt-8 lg:mt-12 rule-t rule-b py-2.5 overflow-hidden -mx-5 lg:-mx-14">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <span key={k} className="flex items-center">
            {["DESENHO", "CÓDIGO", "PERFORMANCE", "PORTO", "SEM REUNIÕES A MAIS", "ENTREGA EM DIAS"].map((w) => (
              <span key={w} className="flex items-center">
                <span className="meta text-foreground px-5">{w}</span>
                <Reg />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* §01 — Selected work                                                 */
/* ------------------------------------------------------------------ */
const Work = () => (
  <section id="trabalho" className="pt-20 lg:pt-32">
    <div className="px-5 lg:px-14">
      <SectionMark n="01" label="TRABALHO SELECIONADO" right="03 PEÇAS" />
    </div>

    {/* — peça 01: full-bleed, typography sitting over the image */}
    <article className="reveal relative mt-14 lg:mt-24">
      <div className="px-5 lg:px-14">
        <div className="relative">
          <h3 className="cond text-[16vw] lg:text-[11vw] relative z-10 mix-blend-difference text-paper pointer-events-none select-none">
            TERRACOTTA
          </h3>
          <div className="-mt-[6vw] lg:-mt-[7vw] lg:pl-[18%]">
            <CursorPlate
              href="https://restaurante.buildwebsites.pt"
              src={workRestaurante}
              alt="Site de restaurante em tons creme e terracota apresentado num tablet"
              imgClass="h-[52vh] lg:h-[78vh] object-cover object-[50%_35%]"
              label="VER SITE"
              w={1408}
              h={1008}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 mt-6">
          <p className="col-span-12 lg:col-span-4 lg:col-start-3 text-sm leading-relaxed text-foreground/75 max-w-sm">
            Menu, reservas e mapa. Feito para ser lido de telemóvel, à porta do restaurante,
            com uma mão a segurar o casaco.
          </p>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col gap-1.5">
            <MetaRow k="CLIENTE" v="RESTAURAÇÃO" />
            <MetaRow k="ANO" v="2025" />
            <MetaRow k="BUILD" v="3 DIAS" />
            <MetaRow k="URL" v="restaurante.buildwebsites.pt" href="https://restaurante.buildwebsites.pt" />
          </div>
        </div>
      </div>
    </article>

    {/* — peça 02: horizontal scrolling strip, sticky vertical title */}
    <article className="reveal mt-24 lg:mt-40 rule-t rule-b">
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-3 px-5 lg:px-14 py-10 lg:py-14 lg:rule-l">
          <h3 className="cond text-6xl lg:text-[5.5vw] mb-6">
            ARQUIVO<br />DE PROVAS
          </h3>
          <p className="text-sm leading-relaxed text-foreground/75 max-w-xs mb-8">
            Estudos, versões descartadas e ecrãs que nunca chegaram a ser publicados.
            Arrasta para o lado.
          </p>
          <div className="flex flex-col gap-1.5">
            <MetaRow k="TIPO" v="ESTUDOS INTERNOS" />
            <MetaRow k="ESTADO" v="WORK IN PROGRESS" />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-9 rule-l">
          <div className="hscroll gap-0">
            {[
              { src: workArquivo, alt: "Ecrã com portefólio tipográfico a preto e branco num monitor de estúdio", n: "A" },
              { src: workEndpoint, alt: "Detalhe de uma landing page escura num portátil", n: "B" },
              { src: workRestaurante, alt: "Detalhe de um site de restaurante em tons de terracota", n: "C" },
            ].map((p) => (
              <figure key={p.n} className="relative shrink-0 w-[78vw] lg:w-[34vw] rule-l">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  width={1408}
                  height={1008}
                  className="w-full h-[40vh] lg:h-[56vh] object-cover grayscale-hover"
                />
                <figcaption className="absolute top-3 left-3 flex items-center gap-2">
                  <Reg />
                  <span className="meta text-paper mix-blend-difference">FIG. {p.n}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </article>

    {/* — peça 03: small plate far left, oversized type crossing the columns */}
    <article className="reveal px-5 lg:px-14 mt-24 lg:mt-40">
      <div className="grid grid-cols-12 gap-x-6 items-center">
        <div className="col-span-8 lg:col-span-4 order-1">
          <CursorPlate
            href="https://endpoint.digital"
            src={workEndpoint}
            alt="Página de conversão da Endpoint Digital numa vista aproximada"
            imgClass="h-[38vh] lg:h-[52vh] object-cover object-[30%_40%]"
            label="ENDPOINT"
            w={1408}
            h={1008}
          />
        </div>
        <div className="col-span-12 lg:col-span-9 lg:col-start-4 order-2 lg:-ml-[8%] relative z-10 mt-8 lg:mt-0">
          <h3 className="cond text-[15vw] lg:text-[9.5vw]">
            UMA PÁGINA.<br />
            UM <span className="serif-em normal-case text-signal">objetivo</span>.
          </h3>
          <div className="grid grid-cols-12 gap-x-6 mt-6 lg:mt-10">
            <p className="col-span-12 lg:col-span-5 text-sm leading-relaxed text-foreground/75">
              Estrutura reduzida ao osso para pedidos de demo. Carrega abaixo de um segundo,
              lê-se em quinze.
            </p>
            <div className="col-span-12 lg:col-span-4 lg:col-start-8 flex flex-col gap-1.5 mt-6 lg:mt-0">
              <MetaRow k="CLIENTE" v="ENDPOINT DIGITAL" />
              <MetaRow k="TIPO" v="SAAS / LANDING" />
              <MetaRow k="BUILD" v="4 DIAS" />
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
);

/* ------------------------------------------------------------------ */
/* §02 — Statement                                                     */
/* ------------------------------------------------------------------ */
const Statement = () => (
  <section className="mt-24 lg:mt-40 bg-ink text-paper py-20 lg:py-32">
    <div className="px-5 lg:px-14">
      <div className="flex items-center gap-3 border-b border-paper/20 pb-3">
        <Reg />
        <span className="meta text-paper">§02</span>
        <span className="meta text-paper/60">POSIÇÃO</span>
      </div>
      <div className="reveal grid grid-cols-12 gap-x-6 pt-12 lg:pt-20">
        <p className="col-span-12 lg:col-span-10 lg:col-start-2 font-display text-[7vw] lg:text-[4.2vw] leading-[1.02]">
          A maior parte dos negócios não precisa de um site grande.
          Precisa de um site <span className="serif-em text-signal">bem feito</span>,
          rápido, e que já exista esta semana.
          <br />
          Nós fazemos exactamente isso — e mais nada.
        </p>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* §03 — Services (typographic list, prices inline)                    */
/* ------------------------------------------------------------------ */
const SERVICES = [
  { n: "01", t: "LANDING PAGE", m: "1 PÁGINA / 3 DIAS", p: "250€" },
  { n: "02", t: "SITE INSTITUCIONAL", m: "ATÉ 5 PÁGINAS / 5–7 DIAS", p: "500€" },
  { n: "03", t: "LOJA ONLINE", m: "CATÁLOGO / 7–10 DIAS", p: "900€" },
  { n: "04", t: "MANUTENÇÃO", m: "ALOJAMENTO + ALTERAÇÕES", p: "15€/MÊS" },
];

const Services = () => (
  <section id="servicos" className="px-5 lg:px-14 pt-20 lg:pt-32">
    <SectionMark n="03" label="O QUE FAZEMOS E QUANTO CUSTA" right="SEM ORÇAMENTOS SURPRESA" />
    <ul>
      {SERVICES.map((s) => (
        <li key={s.t} className="reveal group rule-b">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-wrap items-baseline gap-x-5 gap-y-2 py-6 lg:py-8"
          >
            <span className="meta text-signal w-6 shrink-0">{s.n}</span>
            <h3 className="cond text-[11vw] lg:text-[6.2vw] flex-1 group-hover:translate-x-2 lg:group-hover:translate-x-8 transition-transform duration-500">
              {s.t}
            </h3>
            <Meta className="hidden md:block shrink-0">{s.m}</Meta>
            <span className="cond text-3xl lg:text-4xl shrink-0 group-hover:text-signal transition-colors">{s.p}</span>
          </a>
        </li>
      ))}
    </ul>
    <p className="meta text-muted-foreground pt-4">
      VALORES DE PARTIDA · IVA NÃO INCLUÍDO · O SITE FICA EM TEU NOME
    </p>
  </section>
);

/* ------------------------------------------------------------------ */
/* §04 — Process                                                       */
/* ------------------------------------------------------------------ */
const STAGES = [
  { n: "1", t: "FALAMOS", p: "Vinte minutos no WhatsApp. Sem briefings de dez páginas." },
  { n: "2", t: "DESENHAMOS", p: "Tipografia, cor e estrutura à mão. Vês antes de existir código." },
  { n: "3", t: "CONSTRUÍMOS", p: "Secção a secção, testado em telemóvel a cada passo." },
  { n: "4", t: "ENTREGAMOS", p: "Online, no teu domínio, com quinze minutos a ensinar-te a mexer." },
];

const Process = () => (
  <section id="processo" className="px-5 lg:px-14 pt-20 lg:pt-32">
    <SectionMark n="04" label="COMO ACONTECE" right="5 A 10 DIAS, DO INÍCIO AO FIM" />
    <div className="grid grid-cols-12 gap-x-6 gap-y-10 pt-12 lg:pt-16">
      {STAGES.map((s, i) => (
        <div
          key={s.n}
          className={`reveal col-span-12 md:col-span-6 lg:col-span-3 ${i % 2 === 1 ? "lg:pt-16" : ""}`}
        >
          <div className="flex items-start gap-3">
            <span className="cond text-[22vw] lg:text-[10vw] leading-[0.72] text-signal">{s.n}</span>
            <div className="pt-2">
              <h3 className="cond text-3xl lg:text-[2.4vw] mb-3">{s.t}</h3>
              <p className="text-sm leading-relaxed text-foreground/75 max-w-[16rem]">{s.p}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Proof                                                               */
/* ------------------------------------------------------------------ */
const Proof = () => (
  <section className="px-5 lg:px-14 pt-20 lg:pt-32">
    <div className="reveal grid grid-cols-12 gap-x-6">
      <figure className="col-span-12 lg:col-span-11 lg:col-start-2">
        <blockquote className="font-display text-[6.5vw] lg:text-[3.6vw] leading-[1.06]">
          <span className="serif-em text-signal">“</span>
          O resultado superou as minhas expectativas — moderno, limpo, exactamente o que
          procurava. Todo o processo foi profissional e sem complicações.
          <span className="serif-em text-signal">”</span>
        </blockquote>
        <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-8">
          <Reg />
          <span className="meta text-foreground">LUCAS BRODMANN</span>
          <Meta>CLIENTE / PORTO</Meta>
          <a
            href="https://www.google.com/maps/contrib/101064439451030884340/reviews?hl=en-GB"
            target="_blank"
            rel="noopener noreferrer"
            className="meta link-underline"
          >
            VER REVIEW ↗
          </a>
        </figcaption>
      </figure>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* §05 — Studio                                                        */
/* ------------------------------------------------------------------ */
const Studio = () => (
  <section id="estudio" className="px-5 lg:px-14 pt-20 lg:pt-32">
    <SectionMark n="05" label="O ESTÚDIO" right="FIG. 009 — 35MM, PORTO" />
    <div className="reveal grid grid-cols-12 gap-x-6 gap-y-10 pt-12 lg:pt-20">
      <div className="col-span-12 lg:col-span-5 self-end order-2 lg:order-1">
        <h3 className="cond text-[13vw] lg:text-[6vw] mb-8">
          DUAS PESSOAS,<br />UMA MESA<br />GRANDE.
        </h3>
        <p className="text-sm leading-relaxed text-foreground/75 max-w-sm mb-6">
          Não há departamentos, nem gestores de projeto, nem apresentações de cinquenta slides.
          Falas com quem desenha e com quem escreve o código — normalmente ao mesmo tempo,
          normalmente com café a mais.
        </p>
        <div className="flex flex-col gap-1.5 max-w-sm">
          <MetaRow k="BASE" v="PORTO, PT" />
          <MetaRow k="DESDE" v="2024" />
          <MetaRow k="SITES ENTREGUES" v="12+" />
        </div>
      </div>
      <figure className="col-span-12 lg:col-span-6 lg:col-start-7 order-1 lg:order-2 -mr-5 lg:-mr-14">
        <img
          src={studioHumans}
          alt="Duas pessoas da BuildWeb a rever wireframes impressos num estúdio no Porto"
          loading="lazy"
          width={1408}
          height={1008}
          className="w-full h-[52vh] lg:h-[76vh] object-cover object-[45%_40%] grayscale-hover"
        />
      </figure>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* §06 — Final CTA                                                     */
/* ------------------------------------------------------------------ */
const FinalCta = () => (
  <section className="mt-24 lg:mt-40 bg-ink text-paper">
    <div className="px-5 lg:px-14 pt-16 lg:pt-24 pb-16 lg:pb-24">
      <div className="flex items-center gap-3 border-b border-paper/20 pb-3">
        <Reg />
        <span className="meta text-paper">§06</span>
        <span className="meta text-paper/60">FIM DA EDIÇÃO</span>
        <span className="leader !border-paper/25" aria-hidden />
        <span className="meta text-paper/60">{COORDS}</span>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block group pt-10 lg:pt-16"
      >
        <span className="cond block text-[21vw] lg:text-[15vw] leading-[0.78] group-hover:text-signal transition-colors duration-500">
          FALA
        </span>
        <span className="cond block text-[21vw] lg:text-[15vw] leading-[0.78] lg:pl-[18%] group-hover:text-signal transition-colors duration-500">
          CONNOSCO
        </span>
        <span className="flex flex-wrap items-baseline gap-x-6 gap-y-3 pt-8 lg:pt-12">
          <span className="meta bg-signal text-paper px-3 py-2">WHATSAPP ↗</span>
          <span className="meta text-paper/60">RESPOSTA NO MESMO DIA</span>
          <span className="meta text-paper/60">+351 934 484 781</span>
        </span>
      </a>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
const Footer = () => (
  <footer className="bg-ink text-paper border-t border-paper/15">
    <div className="px-5 lg:px-14 py-8 flex flex-wrap items-center gap-x-8 gap-y-3">
      <span className="cond text-xl">BUILDWEB</span>
      <span className="meta text-paper/50">© {new Date().getFullYear()} PORTO, PORTUGAL</span>
      <span className="leader !border-paper/20 hidden lg:block" aria-hidden />
      <a href="#trabalho" className="meta text-paper/70 link-underline">TRABALHO</a>
      <a href="#servicos" className="meta text-paper/70 link-underline">SERVIÇOS</a>
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="meta text-paper/70 link-underline">
        WHATSAPP ↗
      </a>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
const Index = () => {
  useReveal();
  return (
    <div className="min-h-screen bg-paper">
      <Frame />
      <Nav />
      <main>
        <Hero />
        <Work />
        <Statement />
        <Services />
        <Process />
        <Proof />
        <Studio />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
