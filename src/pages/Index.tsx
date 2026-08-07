import { useEffect, useRef, useState } from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import heroPlate from "@/assets/editorial-hero.jpg";
import workEndpoint from "@/assets/work-endpoint.jpg";
import workRestaurante from "@/assets/work-restaurante.jpg";
import studioHumans from "@/assets/studio-humans.jpg";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
const WHATSAPP_NUMBER = "351934484781";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vi o vosso site e queria pedir um orçamento para o meu negócio."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
const COORDS = "41.1579° N / 8.6291° W";

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useViewport() {
  const [vp, setVp] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
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
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        timeZone: "Europe/Lisbon", hour12: false,
      }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ------------------------------------------------------------------ */
/* Small graphic primitives                                            */
/* ------------------------------------------------------------------ */
const Meta = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`meta text-muted-foreground ${className}`}>{children}</span>
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

/* Fixed frame: crop marks, coordinates, live readouts */
const Frame = () => {
  const vp = useViewport();
  const pct = useScrollPct();
  const clock = useClock();
  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden lg:block">
      {/* corner crop marks */}
      {[
        "top-5 left-5 border-t border-l",
        "top-5 right-5 border-t border-r",
        "bottom-5 left-5 border-b border-l",
        "bottom-5 right-5 border-b border-r",
      ].map((c) => (
        <span key={c} className={`absolute w-4 h-4 border-ink/40 ${c}`} />
      ))}
      {/* left rail */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
        <span className="vert meta text-muted-foreground">{COORDS}</span>
        <span className="w-px h-16 bg-rule" />
        <span className="vert meta text-muted-foreground">PORTO · PT</span>
      </div>
      {/* right rail */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
        <span className="vert meta text-muted-foreground tabular-nums">
          {vp.w} × {vp.h} PX
        </span>
        <span className="w-px h-16 bg-rule relative">
          <span
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-signal"
            style={{ top: `${pct}%` }}
          />
        </span>
        <span className="vert meta text-muted-foreground tabular-nums">{pct}% · {clock}</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */
const Nav = () => (
  <header className="fixed top-0 inset-x-0 z-50 mix-blend-normal">
    <div className="bg-paper/85 backdrop-blur-sm rule-b">
      <div className="px-5 lg:px-14 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-[15px] tracking-tight">BUILDWEB</span>
          <span className="meta text-muted-foreground">STUDIO™ / EST. 2024</span>
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {[
            ["01", "TRABALHO", "#trabalho"],
            ["02", "SERVIÇOS", "#servicos"],
            ["03", "PROCESSO", "#processo"],
            ["04", "PREÇOS", "#precos"],
          ].map(([n, l, h]) => (
            <a key={h} href={h} className="group flex items-baseline gap-1.5">
              <span className="meta-sm meta text-muted-foreground">{n}</span>
              <span className="meta link-underline">{l}</span>
            </a>
          ))}
        </nav>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="meta bg-ink text-paper px-3.5 py-2 hover:bg-signal transition-colors"
        >
          COMEÇAR PROJETO ↗
        </a>
      </div>
    </div>
  </header>
);

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
const Hero = () => (
  <section id="top" className="relative pt-24 lg:pt-28 plan-grid">
    <div className="px-5 lg:px-14">
      {/* top annotation strip */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 rule-b pb-3">
        <Meta>FIG. 001 — ESTÚDIO DE CONSTRUÇÃO WEB</Meta>
        <Meta>SITES PROFISSIONAIS / ENTREGA 3–7 DIAS</Meta>
        <Meta>REV. 2.6 — BUILD {new Date().getFullYear()}.08</Meta>
      </div>

      {/* headline */}
      <div className="grid grid-cols-12 gap-y-6 pt-8 lg:pt-10">
        <h1 className="col-span-12 lg:col-span-11 font-display text-[16.5vw] lg:text-[12.2vw] leading-[0.82] tracking-[-0.045em]">
          <span className="block">CONSTRUÍMOS</span>
          <span className="block">A INTERNET</span>
          <span className="block pl-[8vw] lg:pl-[14vw]">UM SITE</span>
          <span className="block serif-em lowercase text-[15vw] lg:text-[11vw] pl-[2vw]">
            de cada vez.
          </span>
        </h1>
      </div>

      {/* hero body: annotation + first project pinned already */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-12 pt-12 lg:pt-16 pb-16">
        <div className="col-span-12 md:col-span-5 lg:col-span-3">
          <div className="rule-t pt-3">
            <Meta className="block mb-4">NOTA DO ESTÚDIO</Meta>
            <p className="text-[15px] leading-relaxed text-foreground/80 max-w-xs">
              Fábrica de websites com gosto humano. Desenhamos e codificamos à mão,
              em dias — não em meses — para pequenos negócios do Porto e não só.
            </p>
            <div className="mt-6 flex flex-col gap-1.5">
              <MetaRow k="ENTREGA" v="3–7 DIAS" />
              <MetaRow k="PREÇO" v="FIXO, DESDE 250€" />
              <MetaRow k="CÓDIGO" v="100% TEU" />
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 meta bg-ink text-paper px-4 py-3 hover:bg-signal transition-colors"
            >
              FALAR NO WHATSAPP ↗
            </a>
          </div>
        </div>

        {/* pinned plate — portfolio starts before the fold */}
        <figure className="col-span-12 md:col-span-7 lg:col-span-8 lg:col-start-5 relative crop">
          <span className="crop-b" aria-hidden />
          <div className="flex items-baseline justify-between rule-b pb-2 mb-3">
            <Meta>PLACA 01 / EM PRODUÇÃO</Meta>
            <Meta>CROP 3:2 — 100%</Meta>
          </div>
          <div className="overflow-hidden bg-paper-2">
            <img
              src={heroPlate}
              alt="Site de restaurante construído pela BuildWeb Studio, num portátil sobre papel texturado"
              width={1200}
              height={1504}
              className="w-full h-[46vh] md:h-[58vh] object-cover object-[58%_38%] grayscale-hover"
            />
          </div>
          <figcaption className="flex flex-wrap items-baseline justify-between gap-2 pt-2">
            <Meta>CLIENTE: CAFÉ DO PORTO — RESTAURAÇÃO</Meta>
            <Meta>LIGHTHOUSE 98 / LIVE</Meta>
          </figcaption>
        </figure>
      </div>
    </div>

    {/* marquee band */}
    <div className="bg-ink text-paper overflow-hidden py-3">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <span key={k} className="meta flex items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center">
                <span className="px-6">DESIGN</span><span className="text-signal">●</span>
                <span className="px-6">DESENVOLVIMENTO</span><span className="text-signal">●</span>
                <span className="px-6">E-COMMERCE</span><span className="text-signal">●</span>
                <span className="px-6">LANDING PAGES</span><span className="text-signal">●</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Work                                                                */
/* ------------------------------------------------------------------ */
const WORK = [
  {
    n: "02",
    title: "ENDPOINT DIGITAL",
    img: workEndpoint,
    alt: "Landing page SaaS em azul escuro com acentos ciano, num portátil",
    client: "ENDPOINT DIGITAL",
    year: "2025",
    type: "SAAS · LANDING",
    build: "4 DIAS",
    url: "endpoint.digital",
    href: "https://endpoint.digital",
    note: "Uma página, um objetivo: pedidos de demo. Estrutura reduzida ao osso, carregamento abaixo de 1s.",
  },
  {
    n: "03",
    title: "TERRACOTTA",
    img: workRestaurante,
    alt: "Site de restaurante em tons creme e terracota, num tablet",
    client: "RESTAURANTE · TEMPLATE",
    year: "2025",
    type: "RESTAURAÇÃO · MENU",
    build: "3 DIAS",
    url: "restaurante.buildwebsites.pt",
    href: "https://restaurante.buildwebsites.pt",
    note: "Menu, reservas e mapa. Feito para ser lido de telemóvel, à porta do restaurante.",
  },
];

const Work = () => (
  <section id="trabalho" className="px-5 lg:px-14 pt-24 lg:pt-36">
    <div className="flex flex-wrap items-baseline justify-between gap-3 rule-b pb-3">
      <Meta>ÍNDICE DE TRABALHO — SELECÇÃO</Meta>
      <Meta>03 PEÇAS AFIXADAS</Meta>
    </div>

    {/* piece 1 — wide, offset left */}
    <article className="reveal grid grid-cols-12 gap-x-6 gap-y-8 pt-16 lg:pt-24">
      <div className="col-span-12 lg:col-span-3 order-2 lg:order-1">
        <div className="lg:sticky lg:top-24">
          <h3 className="font-display text-4xl lg:text-5xl mb-6">{WORK[0].title}</h3>
          <p className="text-sm leading-relaxed text-foreground/75 max-w-xs mb-8">{WORK[0].note}</p>
          <div className="flex flex-col gap-1.5">
            <MetaRow k="CLIENTE" v={WORK[0].client} />
            <MetaRow k="ANO" v={WORK[0].year} />
            <MetaRow k="TIPO" v={WORK[0].type} />
            <MetaRow k="BUILD" v={WORK[0].build} />
            <MetaRow k="URL" v={WORK[0].url} href={WORK[0].href} />
          </div>
        </div>
      </div>
      <figure className="col-span-12 lg:col-span-8 lg:col-start-5 order-1 lg:order-2 relative crop">
        <span className="crop-b" aria-hidden />
        <span className="absolute -top-8 left-0 font-display text-6xl lg:text-8xl text-ink/10 leading-none select-none" aria-hidden>
          {WORK[0].n}
        </span>
        <a href={WORK[0].href} target="_blank" rel="noopener noreferrer" className="block overflow-hidden bg-paper-2">
          <img
            src={WORK[0].img}
            alt={WORK[0].alt}
            loading="lazy"
            width={1408}
            height={1008}
            className="w-full h-[42vh] lg:h-[70vh] object-cover object-[50%_30%] grayscale-hover"
          />
        </a>
        <div className="tick-strip mt-2 opacity-40" aria-hidden />
      </figure>
    </article>

    {/* piece 2 — narrow, offset right, different scale */}
    <article className="reveal grid grid-cols-12 gap-x-6 gap-y-8 pt-24 lg:pt-40">
      <figure className="col-span-12 md:col-span-7 lg:col-span-5 lg:col-start-2 relative crop">
        <span className="crop-b" aria-hidden />
        <a href={WORK[1].href} target="_blank" rel="noopener noreferrer" className="block overflow-hidden bg-paper-2">
          <img
            src={WORK[1].img}
            alt={WORK[1].alt}
            loading="lazy"
            width={1408}
            height={1008}
            className="w-full h-[52vh] object-cover object-[35%_50%] grayscale-hover"
          />
        </a>
        <div className="flex items-baseline justify-between pt-2">
          <Meta>CROP DESLOCADO — 135%</Meta>
          <Meta>PEÇA {WORK[1].n}</Meta>
        </div>
      </figure>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-8 self-end">
        <h3 className="font-display text-4xl lg:text-6xl mb-6">{WORK[1].title}</h3>
        <p className="text-sm leading-relaxed text-foreground/75 max-w-xs mb-8">{WORK[1].note}</p>
        <div className="flex flex-col gap-1.5">
          <MetaRow k="CLIENTE" v={WORK[1].client} />
          <MetaRow k="ANO" v={WORK[1].year} />
          <MetaRow k="TIPO" v={WORK[1].type} />
          <MetaRow k="BUILD" v={WORK[1].build} />
          <MetaRow k="URL" v={WORK[1].url} href={WORK[1].href} />
        </div>
      </div>
    </article>

    {/* piece 3 — empty plate, invitation */}
    <article className="reveal grid grid-cols-12 gap-x-6 pt-24 lg:pt-40">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="col-span-12 lg:col-span-10 lg:col-start-2 relative crop group"
      >
        <span className="crop-b" aria-hidden />
        <div className="border border-dashed border-ink/25 group-hover:border-signal transition-colors px-6 py-16 lg:py-28 flex flex-col items-center text-center">
          <Meta className="mb-6">PLACA 04 — POR PREENCHER</Meta>
          <h3 className="font-display text-[9vw] lg:text-[5.6vw] leading-[0.9]">
            O PRÓXIMO PROJETO<br />
            <span className="serif-em lowercase">pode ser o teu.</span>
          </h3>
          <span className="meta mt-8 group-hover:text-signal transition-colors">RESERVAR SLOT ↗</span>
        </div>
      </a>
    </article>
  </section>
);

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
const SERVICES = [
  { n: "A", t: "DESIGN", m: "IDENTIDADE / UI" },
  { n: "B", t: "DESENVOLVIMENTO", m: "REACT / PERFORMANCE" },
  { n: "C", t: "E-COMMERCE", m: "STRIPE / MB WAY" },
  { n: "D", t: "LANDING PAGES", m: "CONVERSÃO" },
];

const Services = () => (
  <section id="servicos" className="px-5 lg:px-14 pt-28 lg:pt-44">
    <div className="flex items-baseline justify-between rule-b pb-3">
      <Meta>O QUE CONSTRUÍMOS</Meta>
      <Meta>04 DISCIPLINAS</Meta>
    </div>
    <ul>
      {SERVICES.map((s) => (
        <li key={s.t} className="reveal group rule-b">
          <div className="flex items-baseline gap-4 lg:gap-10 py-6 lg:py-9">
            <Meta className="w-6 shrink-0">{s.n}</Meta>
            <h3 className="font-display text-[10vw] lg:text-[6.4vw] leading-[0.85] flex-1 group-hover:translate-x-2 lg:group-hover:translate-x-6 transition-transform duration-500">
              {s.t}
            </h3>
            <Meta className="hidden md:block shrink-0">{s.m}</Meta>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

/* ------------------------------------------------------------------ */
/* Process — each stage takes the viewport                              */
/* ------------------------------------------------------------------ */
const STAGES = [
  { n: "01", t: "TALK", pt: "Briefing de 20 minutos. Percebemos o negócio, o objetivo e o estilo. Sem formulários intermináveis." },
  { n: "02", t: "DESIGN", pt: "Escolhemos paleta, tipografia e estrutura à mão. Vês o desenho antes de existir código." },
  { n: "03", t: "BUILD", pt: "Codificamos secção a secção, revemos responsividade e performance em cada passo." },
  { n: "04", t: "SHIP", pt: "Colocamos online, ajustamos contigo e ensinamos-te a mexer. O site fica em teu nome." },
];

const Process = () => (
  <section id="processo" className="relative pt-28 lg:pt-44 bg-ink text-paper on-ink mt-24 lg:mt-40">
    <div className="px-5 lg:px-14">
      <div className="flex items-baseline justify-between border-b border-paper/20 pb-3">
        <span className="meta text-paper/60">SEQUÊNCIA DE PRODUÇÃO</span>
        <span className="meta text-paper/60">04 ETAPAS</span>
      </div>
    </div>
    {STAGES.map((s) => (
      <div key={s.n} className="sticky top-0 min-h-[86vh] flex items-center bg-ink border-b border-paper/15">
        <div className="px-5 lg:px-14 w-full grid grid-cols-12 gap-6 items-center lg:items-end py-16">
          <span className="col-span-12 lg:col-span-2 meta text-signal">ETAPA {s.n}</span>
          <h3 className="col-span-12 lg:col-span-7 font-display text-[22vw] lg:text-[14vw] leading-[0.8]">
            {s.t}
          </h3>
          <p className="col-span-12 lg:col-span-3 text-sm leading-relaxed text-paper/70 max-w-sm">
            {s.pt}
          </p>
        </div>
      </div>
    ))}
  </section>
);

/* ------------------------------------------------------------------ */
/* Testimonial                                                         */
/* ------------------------------------------------------------------ */
const Testimonial = () => (
  <section className="px-5 lg:px-14 pt-28 lg:pt-44">
    <div className="flex items-baseline justify-between rule-b pb-3">
      <Meta>PROVA — REVIEW VERIFICADA</Meta>
      <Meta>GOOGLE / 5.0</Meta>
    </div>
    <figure className="reveal grid grid-cols-12 gap-6 pt-12 lg:pt-20">
      <blockquote className="col-span-12 lg:col-span-9 lg:col-start-2 font-display text-[6vw] lg:text-[3.4vw] leading-[1.06] tracking-tight">
        <span className="serif-em">“</span>
        O resultado final superou as minhas expectativas — o site tem um aspeto moderno,
        limpo e visualmente apelativo, exatamente o que procurava. Todo o processo foi
        profissional e sem complicações.
        <span className="serif-em">”</span>
      </blockquote>
      <figcaption className="col-span-12 lg:col-span-9 lg:col-start-2 flex flex-wrap items-baseline gap-x-8 gap-y-2 pt-8">
        <Meta className="!text-foreground">LUCAS BRODMANN</Meta>
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
  </section>
);

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */
const About = () => (
  <section id="sobre" className="px-5 lg:px-14 pt-28 lg:pt-44">
    <div className="flex items-baseline justify-between rule-b pb-3">
      <Meta>OS HUMANOS</Meta>
      <Meta>FIG. 009 — 35MM, PORTO</Meta>
    </div>
    <div className="reveal grid grid-cols-12 gap-x-6 gap-y-10 pt-12 lg:pt-20">
      <figure className="col-span-12 md:col-span-7 relative crop">
        <span className="crop-b" aria-hidden />
        <img
          src={studioHumans}
          alt="Dois designers da BuildWeb Studio a rever wireframes impressos num estúdio no Porto"
          loading="lazy"
          width={1408}
          height={1008}
          className="w-full h-[50vh] lg:h-[68vh] object-cover object-[45%_40%]"
        />
      </figure>
      <div className="col-span-12 md:col-span-4 md:col-start-9 self-center">
        <p className="font-display text-3xl lg:text-[2.6vw] leading-[1.05] mb-8">
          Somos duas pessoas, uma mesa grande e muitos rascunhos impressos.
        </p>
        <p className="text-sm leading-relaxed text-foreground/75 max-w-xs">
          Não há departamentos, nem gestores de projeto, nem reuniões a mais.
          Falas com quem desenha e com quem escreve o código — normalmente ao mesmo tempo.
        </p>
        <div className="mt-8 flex flex-col gap-1.5">
          <MetaRow k="BASE" v="PORTO, PT" />
          <MetaRow k="DESDE" v="2024" />
          <MetaRow k="SITES ENTREGUES" v="12+" />
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Pricing + maintenance — spec sheet                                  */
/* ------------------------------------------------------------------ */
const PRICING = [
  {
    tag: "LANDING PAGE", price: "250€", spec: "1 PÁGINA / 3 DIAS",
    features: ["1 página com todas as secções", "Formulário + WhatsApp", "SEO base + Analytics"],
  },
  {
    tag: "SITE INSTITUCIONAL", price: "500€", spec: "ATÉ 5 PÁGINAS / 5–7 DIAS",
    features: ["Design à medida", "Blog / notícias (opcional)", "SEO técnico + Analytics"],
  },
  {
    tag: "LOJA ONLINE", price: "desde 900€", spec: "CATÁLOGO / 7–10 DIAS",
    features: ["Catálogo + carrinho", "Pagamentos Stripe / MB Way", "Gestão de encomendas + formação"],
  },
];

const MAINTENANCE = [
  { tag: "BÁSICO", price: "15€/mês", spec: "Alojamento gerido, backups semanais, atualizações de segurança, suporte em 48h." },
  { tag: "GROWTH", price: "45€/mês", spec: "Tudo do Básico + 2 alterações de conteúdo/mês, relatório mensal, suporte em 24h." },
  { tag: "ADS & GROWTH", price: "95€/mês", spec: "Tudo do Growth + gestão de campanhas Google/Meta, SEO contínuo, reunião mensal." },
];

const Pricing = () => (
  <section id="precos" className="px-5 lg:px-14 pt-28 lg:pt-44">
    <div className="flex flex-wrap items-baseline justify-between gap-3 rule-b pb-3">
      <Meta>FOLHA DE ESPECIFICAÇÕES — PREÇOS FIXOS</Meta>
      <Meta className="!text-signal">● PREÇOS DE LANÇAMENTO</Meta>
    </div>

    {PRICING.map((p, i) => (
      <div key={p.tag} className="reveal grid grid-cols-12 gap-x-6 gap-y-4 py-9 lg:py-12 rule-b items-start">
        <Meta className="col-span-12 lg:col-span-1">{`0${i + 1}`}</Meta>
        <h3 className="col-span-12 lg:col-span-5 font-display text-[8vw] lg:text-[3.6vw] leading-[0.9]">
          {p.tag}
        </h3>
        <ul className="col-span-12 md:col-span-7 lg:col-span-4 flex flex-col gap-2">
          {p.features.map((f) => (
            <li key={f} className="text-sm text-foreground/75 pl-4 border-l border-ink/25 leading-snug">
              {f}
            </li>
          ))}
          <li className="pt-2"><Meta>{p.spec}</Meta></li>
        </ul>
        <div className="col-span-12 md:col-span-5 lg:col-span-2 lg:text-right">
          <span className="font-display text-4xl lg:text-5xl">{p.price}</span>
        </div>
      </div>
    ))}

    {/* maintenance */}
    <div className="pt-20 lg:pt-28">
      <div className="flex items-baseline justify-between rule-b pb-3">
        <Meta>MANUTENÇÃO — OPCIONAL, MENSAL</Meta>
        <Meta>SEM FIDELIZAÇÃO</Meta>
      </div>
      {MAINTENANCE.map((m) => (
        <div key={m.tag} className="grid grid-cols-12 gap-x-6 gap-y-2 py-6 rule-b items-baseline">
          <span className="col-span-12 md:col-span-3 font-display text-xl">{m.tag}</span>
          <p className="col-span-12 md:col-span-7 text-sm text-foreground/75 leading-relaxed">{m.spec}</p>
          <span className="col-span-12 md:col-span-2 md:text-right mono text-sm">{m.price}</span>
        </div>
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */
const FAQ = [
  { q: "O domínio e alojamento estão incluídos?", a: "Não. Tratamos do site, tu ficas com o domínio e alojamento em teu nome — assim o site é sempre 100% teu. Ajudamos a configurar tudo, sem custo extra de gestão." },
  { q: "E se eu quiser alterações depois de entregue?", a: "Pequenos ajustes nos primeiros 7 dias após entrega estão incluídos. Depois disso, tens o plano de manutenção mensal opcional, ou pedes alterações pontuais avulso." },
  { q: "Quem fica com o conteúdo e o código?", a: "Tu. O site é teu, o código é teu, as imagens e textos são teus. Não há vendor lock-in." },
  { q: "Quanto tempo demora mesmo?", a: "Landing page: 3 dias úteis. Site institucional: 5-7 dias úteis. Loja online: varia com o catálogo, normalmente 7-10 dias. Os prazos começam a contar depois do briefing." },
  { q: "Preciso de ter os textos e imagens prontos?", a: "Não é obrigatório. Ajudamos a estruturar o conteúdo no briefing inicial, e se precisares de imagens podemos sugerir stock ou gerar à medida." },
  { q: "Como funciona o pagamento?", a: "50% no início do projeto, 50% na entrega. Aceitamos transferência ou MB Way." },
  { q: "O site funciona bem em telemóvel?", a: "Sim, todos os sites são 100% responsivos por defeito — testado em mobile, tablet e desktop antes de entregar." },
];

const Faq = () => (
  <section id="faq" className="px-5 lg:px-14 pt-28 lg:pt-44">
    <div className="flex items-baseline justify-between rule-b pb-3">
      <Meta>NOTAS DE RODAPÉ — PERGUNTAS FREQUENTES</Meta>
      <Meta>{FAQ.length} ENTRADAS</Meta>
    </div>
    <Accordion type="single" collapsible className="w-full">
      {FAQ.map((f, i) => (
        <AccordionItem key={f.q} value={`i${i}`} className="rule-b border-b-0">
          <AccordionTrigger className="py-6 hover:no-underline group">
            <span className="flex items-baseline gap-5 text-left">
              <span className="meta text-muted-foreground">{`F.${String(i + 1).padStart(2, "0")}`}</span>
              <span className="font-display text-xl lg:text-3xl leading-tight">{f.q}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-8 pl-0 lg:pl-16">
            <p className="text-sm lg:text-base leading-relaxed text-foreground/75 max-w-2xl">{f.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

/* ------------------------------------------------------------------ */
/* Final CTA — poster                                                  */
/* ------------------------------------------------------------------ */
const FinalCta = () => (
  <section className="mt-28 lg:mt-44 bg-ink text-paper on-ink">
    <div className="px-5 lg:px-14 py-20 lg:py-32">
      <div className="flex items-baseline justify-between border-b border-paper/20 pb-3">
        <span className="meta text-paper/60">CARTAZ FINAL</span>
        <span className="meta text-paper/60">RESPOSTA MÉDIA &lt; 2H</span>
      </div>
      <h2 className="font-display text-[17vw] lg:text-[12.5vw] leading-[0.82] pt-12 lg:pt-16">
        TENS UM SITE<br />
        PARA <span className="serif-em lowercase">construir?</span>
      </h2>
      <div className="grid grid-cols-12 gap-6 pt-12 lg:pt-20 items-end">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-12 lg:col-span-8 group flex items-baseline gap-5 border-t border-paper/25 pt-6"
        >
          <span className="font-display text-[9vw] lg:text-[4.6vw] leading-none group-hover:text-signal transition-colors">
            COMEÇAR PROJETO
          </span>
          <span className="font-display text-[9vw] lg:text-[4.6vw] leading-none group-hover:translate-x-4 transition-transform duration-500">
            →
          </span>
        </a>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-2 lg:text-right">
          <span className="meta text-paper/60">SEM FORMULÁRIOS · SEM ESPERA</span>
          <span className="meta text-paper/60">PROPOSTA EM 24H</span>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="px-5 lg:px-14 py-10 grid grid-cols-12 gap-x-6 gap-y-6 rule-t">
      <div className="col-span-12 md:col-span-4 flex items-baseline gap-2">
        <span className="font-display text-sm">BUILDWEB STUDIO™</span>
        <Meta>{COORDS}</Meta>
      </div>
      <div className="col-span-12 md:col-span-4 flex flex-wrap gap-x-6 gap-y-2">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="meta link-underline">WHATSAPP ↗</a>
        <a href="mailto:hello@buildwebsites.pt" className="meta link-underline">HELLO@BUILDWEBSITES.PT</a>
        <a href="https://instagram.com/buildwebsites.pt" target="_blank" rel="noopener noreferrer" className="meta link-underline">INSTAGRAM ↗</a>
      </div>
      <div className="col-span-12 md:col-span-4 md:text-right">
        <Meta>© {year} — REV. 2.6 / PORTO, PT</Meta>
      </div>
    </footer>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const Index = () => {
  useReveal();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="min-h-screen bg-paper text-ink overflow-x-hidden">
      <Frame />
      <Nav />
      <main>
        <Hero />
        <Work />
        <Services />
        <Process />
        <Testimonial />
        <About />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
