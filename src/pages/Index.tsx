import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight, Check, MessageCircle, Instagram, Linkedin, Mail, MapPin, Sparkles, Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
const WHATSAPP_NUMBER = "351934484781"; // placeholder — troca pelo número real
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vi o vosso site e queria pedir um orçamento para o meu negócio."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */
const Nav = () => (
  <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <a href="#top" className="flex items-center gap-2.5 font-display font-semibold text-lg">
        <span className="relative inline-flex w-8 h-8 rounded-md bg-azulejo items-center justify-center">
          <span className="absolute inset-1 rounded-sm border border-mustard/70" />
          <span className="relative text-mustard font-mono text-sm">B</span>
        </span>
        <span>BuildWeb <span className="text-muted-foreground font-normal">Studio</span></span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm">
        <a href="#como" className="hover:text-azulejo transition-colors">Como funciona</a>
        <a href="#portfolio" className="hover:text-azulejo transition-colors">Portfólio</a>
        <a href="#precos" className="hover:text-azulejo transition-colors">Preços</a>
      </div>
      <Button asChild size="sm" className="btn-whatsapp gap-2 h-10 px-4">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </Button>
    </div>
  </nav>
);

/* ------------------------------------------------------------------ */
/* Build-log terminal → browser mockup                                 */
/* ------------------------------------------------------------------ */
type LogLine = { t: string; tone?: "dim" | "ok" | "accent" | "cmd" };

const BUILD_LOG: LogLine[] = [
  { t: "$ buildweb init --client=cafe-do-porto", tone: "cmd" },
  { t: "→ Briefing recebido (12 min)", tone: "dim" },
  { t: "✓ Estrutura de páginas definida", tone: "ok" },
  { t: "$ buildweb design --style=azulejo", tone: "cmd" },
  { t: "→ A escolher paleta e tipografia à mão", tone: "dim" },
  { t: "✓ Design aprovado pelo cliente", tone: "ok" },
  { t: "$ buildweb build", tone: "cmd" },
  { t: "→ A codificar secções uma a uma", tone: "dim" },
  { t: "→ Revisão manual de responsividade", tone: "dim" },
  { t: "✓ a11y check ........... pass", tone: "ok" },
  { t: "✓ lighthouse ............ 98", tone: "accent" },
  { t: "✓ Site pronto em 4 dias", tone: "ok" },
  { t: "$ buildweb deploy --live", tone: "cmd" },
  { t: "→ https://cafedoporto.pt", tone: "accent" },
];

function useTypedLog(lines: LogLine[]) {
  const [visible, setVisible] = useState<{ idx: number; text: string }[]>([]);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    let j = 0;
    let cancelled = false;

    function tick() {
      if (cancelled) return;
      if (i >= lines.length) {
        setDone(true);
        return;
      }
      const current = lines[i];
      if (j <= current.t.length) {
        setVisible((v) => {
          const copy = [...v];
          copy[i] = { idx: i, text: current.t.slice(0, j) };
          return copy;
        });
        j += Math.max(1, Math.floor(current.t.length / 22));
        setTimeout(tick, current.tone === "cmd" ? 22 : 14);
      } else {
        i += 1;
        j = 0;
        setTimeout(tick, current.tone === "ok" ? 220 : 90);
      }
    }
    const start = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [lines]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [visible]);

  return { visible, done, ref };
}

const toneClass = (tone?: LogLine["tone"]) =>
  tone === "cmd" ? "text-porcelana"
    : tone === "ok" ? "text-emerald-400"
    : tone === "accent" ? "text-mustard"
    : "text-porcelana/60";

const BuildLogHero = () => {
  const { visible, done, ref } = useTypedLog(BUILD_LOG);
  const activeIdx = visible.length - 1;

  return (
    <div className="relative">
      {/* Terminal */}
      <div className="browser-frame bg-azulejo-deep border-azulejo-deep">
        <div className="browser-chrome bg-azulejo border-b border-azulejo-deep">
          <span className="browser-dot bg-red-400/80" />
          <span className="browser-dot bg-amber-400/80" />
          <span className="browser-dot bg-emerald-400/80" />
          <span className="mono ml-3 text-[11px] text-porcelana/60">buildweb — zsh</span>
        </div>
        <div
          ref={ref}
          className="mono text-[12.5px] md:text-sm leading-relaxed p-5 h-[320px] md:h-[360px] overflow-hidden bg-azulejo-deep"
        >
          {visible.map((line, i) => {
            const spec = BUILD_LOG[line.idx];
            const isTyping = i === activeIdx && !done;
            return (
              <div key={i} className={`${toneClass(spec.tone)} whitespace-pre`}>
                {line.text}
                {isTyping && <span className="animate-caret" aria-hidden />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Site reveal — simple shadowed card, no browser chrome */}
      <div
        className={`mt-4 md:mt-5 rounded-lg overflow-hidden shadow-tile border border-border transition-all duration-700 ${
          done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-card border-b border-border">
          <span className="mono text-[11px] text-muted-foreground">cafedoporto.pt</span>
          <span className="inline-flex items-center gap-1.5 mono text-[10px] text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> live
          </span>
        </div>
        <div className="relative aspect-[16/9] bg-porcelana overflow-hidden">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-sm bg-azulejo" />
                <span className="font-display text-xs font-semibold">Café do Porto</span>
              </div>
              <div className="hidden sm:flex gap-3 text-[10px] text-muted-foreground">
                <span>Menu</span><span>Reservas</span><span>Contactos</span>
              </div>
              <span className="text-[10px] mono bg-mustard text-azulejo px-2 py-0.5 rounded">Reservar</span>
            </div>
            <div className="flex-1 grid grid-cols-5 gap-3 p-5">
              <div className="col-span-3 flex flex-col justify-center gap-2">
                <div className="h-2.5 w-24 rounded bg-mustard" />
                <div className="h-4 w-full rounded bg-azulejo/90" />
                <div className="h-4 w-3/4 rounded bg-azulejo/70" />
                <div className="h-2 w-full rounded bg-muted mt-1" />
                <div className="h-2 w-5/6 rounded bg-muted" />
                <div className="mt-2 flex gap-2">
                  <span className="h-5 w-20 rounded bg-azulejo" />
                  <span className="h-5 w-16 rounded border border-azulejo/40" />
                </div>
              </div>
              <div className="col-span-2 rounded-md bg-azulejo relative overflow-hidden">
                <div className="absolute inset-0 opacity-40" style={{
                  backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--mustard)/0.3) 0 6px, transparent 6px 12px)"
                }} />
                <div className="absolute bottom-2 left-2 text-[9px] mono text-mustard">98/100</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating status badge */}
      <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-mustard text-azulejo mono text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-tile">
        {done ? "● live" : "● building"}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Portfolio mockups (inline SVG-like divs, no external images)        */
/* ------------------------------------------------------------------ */
type Project = { title: string; url: string; href: string; palette: [string, string]; kind: string };

const PROJECTS: Project[] = [
  {
    title: "Endpoint Digital",
    url: "endpoint.digital",
    href: "https://endpoint.digital",
    palette: ["#0B0F1A", "#00D4FF"],
    kind: "SaaS · Landing",
  },
  {
    title: "Restaurante Template",
    url: "restaurante.buildwebsites.pt",
    href: "https://restaurante.buildwebsites.pt",
    palette: ["#F4E7D3", "#C0392B"],
    kind: "Restaurante · Menu",
  },
];

const ProjectCard = ({ p }: { p: Project }) => (
  <a
    href={p.href}
    target="_blank"
    rel="noopener noreferrer"
    className="group block hover:-translate-y-1 transition-all duration-500"
  >
    <div className="flex items-baseline justify-between mb-3">
      <h3 className="font-display font-semibold text-lg text-azulejo">{p.title}</h3>
      <span className="mono text-[11px] text-muted-foreground">{p.url}</span>
    </div>
    <div
      className="aspect-[4/3] relative overflow-hidden rounded-lg border border-border shadow-card group-hover:shadow-tile transition-shadow"
      style={{ backgroundColor: p.palette[0] }}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, ${p.palette[1]}55, transparent 55%), radial-gradient(circle at 80% 80%, ${p.palette[1]}33, transparent 60%)`,
        }}
      />
      <div className="absolute inset-x-6 top-8 space-y-2">
        <div className="h-2 w-14 rounded" style={{ backgroundColor: p.palette[1] }} />
        <div className="h-5 w-4/5 rounded" style={{ backgroundColor: `${p.palette[1]}bb` }} />
        <div className="h-5 w-3/5 rounded" style={{ backgroundColor: `${p.palette[1]}77` }} />
      </div>
      <div className="absolute inset-x-6 bottom-6 flex gap-2">
        <span className="h-6 w-20 rounded" style={{ backgroundColor: p.palette[1] }} />
        <span className="h-6 w-16 rounded border" style={{ borderColor: `${p.palette[1]}88` }} />
      </div>
    </div>
    <div className="pt-4 flex items-center justify-between">
      <p className="mono text-[11px] uppercase tracking-widest text-muted-foreground">{p.kind}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-azulejo group-hover:text-mustard transition-colors">
        ver site <ArrowRight className="w-4 h-4" />
      </span>
    </div>
  </a>
);

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    n: "01",
    title: "Briefing rápido",
    desc: "Uma chamada de 20 minutos para perceber o teu negócio, objetivos e estilo. Sem formulários intermináveis.",
  },
  {
    n: "02",
    title: "Build assistido por IA",
    desc: "Construímos o site em dias, não em meses. Ferramentas modernas + revisão humana em cada detalhe.",
  },
  {
    n: "03",
    title: "Entrega + revisão",
    desc: "Recebes o site pronto, fazemos ajustes contigo e colocamos online. Formação incluída.",
  },
];

const PRICING = [
  {
    tag: "Landing Page",
    price: "250€",
    tagline: "1 página, tudo que precisas para converter.",
    features: [
      "1 página com todas as secções",
      "Formulário + WhatsApp",
      "SEO base + Analytics",
      "Entrega em 3 dias",
    ],
  },
  {
    tag: "Site Institucional",
    price: "500€",
    tagline: "Para negócios que querem uma presença completa.",
    features: [
      "Até 5 páginas",
      "Design à medida",
      "Blog / notícias (opcional)",
      "SEO técnico + Analytics",
      "Entrega em 5-7 dias",
    ],
    featured: true,
  },
  {
    tag: "Loja Online",
    price: "desde 900€",
    tagline: "Vende os teus produtos online, sem complicações.",
    features: [
      "Catálogo + carrinho",
      "Pagamentos Stripe/MB Way",
      "Gestão de encomendas",
      "Formação incluída",
    ],
  },
];

const MAINTENANCE = [
  {
    tag: "Básico",
    price: "15€",
    features: [
      "Alojamento e domínio geridos",
      "Backups semanais",
      "Atualizações de segurança",
      "Suporte por WhatsApp (resposta em 48h)",
    ],
  },
  {
    tag: "Growth",
    price: "45€",
    featured: true,
    features: [
      "Tudo do Básico",
      "Até 2 alterações de conteúdo/mês",
      "Relatório mensal de performance (Analytics)",
      "Suporte prioritário (resposta em 24h)",
    ],
  },
  {
    tag: "Ads & Growth",
    price: "95€",
    features: [
      "Tudo do Growth",
      "Gestão de campanhas Google/Meta Ads (orçamento à parte)",
      "SEO contínuo",
      "Reunião mensal de resultados",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Profissionalismo do início ao fim. Site entregue no prazo, exatamente como imaginei, e já começou a trazer contactos novos. Recomendo sem hesitar.",
    name: "Cliente Satisfeito",
    role: "Google Review",
    href: "https://www.google.com/search?q=BuildWeb+Studio+Porto",
  },
];

const FAQ = [
  {
    q: "O domínio e alojamento estão incluídos?",
    a: "Não. Tratamos do site, tu ficas com o domínio e alojamento em teu nome — assim o site é sempre 100% teu. Ajudamos a configurar tudo, sem custo extra de gestão.",
  },
  {
    q: "E se eu quiser alterações depois de entregue?",
    a: "Pequenos ajustes nos primeiros 7 dias após entrega estão incluídos. Depois disso, tens o plano de manutenção mensal opcional, ou pedes alterações pontuais avulso.",
  },
  {
    q: "Quem fica com o conteúdo e o código?",
    a: "Tu. O site é teu, o código é teu, as imagens e textos são teus. Não há vendor lock-in.",
  },
  {
    q: "Quanto tempo demora mesmo?",
    a: "Landing page: 3 dias úteis. Site institucional: 5-7 dias úteis. Loja online: varia com o catálogo, normalmente 7-10 dias. Os prazos começam a contar depois do briefing.",
  },
  {
    q: "Preciso de ter os textos e imagens prontos?",
    a: "Não é obrigatório. Ajudamos a estruturar o conteúdo no briefing inicial, e se precisares de imagens podemos sugerir stock ou gerar com IA.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "50% no início do projeto, 50% na entrega. Aceitamos transferência ou MB Way.",
  },
  {
    q: "O site funciona bem em telemóvel?",
    a: "Sim, todos os sites são 100% responsivos por defeito — testado em mobile, tablet e desktop antes de entregar.",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const Index = () => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div id="top" className="min-h-screen bg-background">
      <Nav />

      {/* HERO */}
      <header className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 tile-grid opacity-60 -z-10" />
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-mustard/10 blur-3xl rounded-full -z-10" />

        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-widest text-azulejo bg-mustard/20 border border-mustard/40 px-3 py-1.5 rounded-full mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-mustard" />
                BuildWeb Studio · Porto, PT
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-azulejo mb-6">
                O teu site,{" "}
                <span className="accent-underline">esta semana</span>.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-8">
                Sites profissionais para pequenos negócios, entregues em dias e a preço justo.
                Rápidos, responsivos, feitos para trazer clientes — não para ficar bonitos na gaveta.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="btn-whatsapp h-14 px-7 text-base gap-2 shadow-tile">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-7 text-base border-azulejo/30 text-azulejo hover:bg-azulejo hover:text-porcelana">
                  <a href="#portfolio">Ver trabalhos</a>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                {["Entrega em 3–7 dias", "Preços fixos, sem surpresas", "100% responsivo"].map((k) => (
                  <div key={k} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-mustard" /> {k}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <BuildLogHero />
            </div>
          </div>
        </div>
      </header>

      {/* COMO FUNCIONA */}
      <section id="como" className="py-20 md:py-28 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Como funciona</p>
            <h2 className="font-display text-4xl md:text-5xl text-azulejo">
              Três passos. Sem tretas.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="relative bg-card border border-border rounded-lg p-7 hover:border-mustard transition-colors"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="mono text-sm text-mustard">{s.n}</span>
                  <span className="mono text-[10px] text-muted-foreground">step_{i + 1}</span>
                </div>
                <h3 className="font-display text-2xl text-azulejo mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div className="max-w-2xl">
              <p className="mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Portfólio</p>
              <h2 className="font-display text-4xl md:text-5xl text-azulejo">
                Trabalhos recentes.
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PROJECTS.map((p) => <ProjectCard key={p.url} p={p} />)}
            {/* CTA card */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-lg border-2 border-dashed border-azulejo/30 hover:border-mustard bg-secondary/30 hover:bg-mustard/10 transition-all p-8 flex flex-col justify-between min-h-[380px]"
            >
              <div>
                <Sparkles className="w-8 h-8 text-mustard mb-4" />
                <h3 className="font-display text-2xl text-azulejo mb-2 leading-tight">
                  Sê o próximo caso de sucesso.
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  O próximo projeto pode ser o teu.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-medium text-azulejo group-hover:text-mustard transition-colors">
                Começar projeto <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* TESTEMUNHOS */}
      <section id="testemunhos" className="py-20 md:py-28 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="mono text-xs uppercase tracking-[0.2em] text-mustard mb-3">Testemunhos</p>
            <h2 className="font-display text-4xl md:text-5xl text-azulejo">
              Quem já trabalhou connosco.
            </h2>
          </div>
          <div className={`grid gap-6 ${TESTIMONIALS.length === 1 ? "max-w-2xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={i}
                className="relative bg-card border border-border rounded-lg p-8 flex flex-col shadow-card"
              >
                <div className="flex gap-1 mb-5" aria-label="5 estrelas">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-mustard text-mustard" />
                  ))}
                </div>
                <blockquote className="font-display text-xl md:text-2xl text-azulejo leading-snug mb-6">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-auto flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-semibold text-azulejo">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </div>
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs mono border border-border hover:border-mustard rounded-full px-3 py-1.5 transition-colors"
                    aria-label="Ver review no Google"
                  >
                    <svg viewBox="0 0 48 48" className="w-3.5 h-3.5" aria-hidden>
                      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.3 17.7 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.5z"/>
                      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 16.7 0 20.2 0 24s1 7.3 2.6 10.8l7.9-6.1z"/>
                      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.3 0-11.6-3.8-13.5-9.3l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
                    </svg>
                    Google Review
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section id="precos" className="py-20 md:py-28 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div className="max-w-2xl">
              <p className="mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Preços</p>
              <h2 className="font-display text-4xl md:text-5xl text-azulejo">
                Preços fixos. Sem letras pequenas.
              </h2>
            </div>
            <div className="mono text-xs bg-mustard text-azulejo px-3 py-1.5 rounded-full self-start md:self-end">
              ● preços de lançamento
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PRICING.map((p) => (
              <div
                key={p.tag}
                className={`relative rounded-lg p-7 border transition-all ${
                  p.featured
                    ? "bg-azulejo text-porcelana border-azulejo shadow-tile md:-translate-y-3"
                    : "bg-card border-border hover:border-azulejo/40"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-7 mono text-[10px] uppercase tracking-widest bg-mustard text-azulejo px-2 py-1 rounded">
                    mais popular
                  </span>
                )}
                <div className={`mono text-xs uppercase tracking-widest mb-4 ${p.featured ? "text-mustard" : "text-muted-foreground"}`}>
                  {p.tag}
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="font-display text-5xl">{p.price}</span>
                </div>
                <p className={`text-sm mb-6 ${p.featured ? "text-porcelana/70" : "text-muted-foreground"}`}>
                  {p.tagline}
                </p>
                <ul className="space-y-2.5 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${p.featured ? "text-mustard" : "text-azulejo"}`} />
                      <span className={p.featured ? "text-porcelana/90" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full h-12 gap-2 ${
                    p.featured ? "bg-mustard text-azulejo hover:bg-mustard/90" : "btn-whatsapp"
                  }`}
                >
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> Pedir orçamento
                  </a>
                </Button>
              </div>
            ))}
          </div>
          <p className="mono text-xs text-center text-muted-foreground mt-10">
            valores + IVA · alojamento e domínio não incluídos · manutenção opcional
          </p>
        </div>
      </section>

      {/* MANUTENÇÃO */}
      <section id="manutencao" className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="mono text-xs uppercase tracking-[0.2em] text-mustard mb-3">Após o lançamento</p>
            <h2 className="font-display text-4xl md:text-5xl text-azulejo mb-4">
              O site não para no dia da entrega.
            </h2>
            <p className="text-lg text-muted-foreground">
              Planos mensais para manter tudo a funcionar, atualizado e seguro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {MAINTENANCE.map((p) => (
              <div
                key={p.tag}
                className={`relative rounded-lg p-7 border transition-all ${
                  p.featured
                    ? "bg-azulejo text-porcelana border-azulejo shadow-tile md:-translate-y-3"
                    : "bg-card border-border hover:border-azulejo/40"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-7 mono text-[10px] uppercase tracking-widest bg-mustard text-azulejo px-2 py-1 rounded">
                    mais popular
                  </span>
                )}
                <div className={`mono text-xs uppercase tracking-widest mb-4 ${p.featured ? "text-mustard" : "text-muted-foreground"}`}>
                  {p.tag}
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display text-5xl">{p.price}</span>
                  <span className={`text-sm ${p.featured ? "text-porcelana/70" : "text-muted-foreground"}`}>/mês</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${p.featured ? "text-mustard" : "text-azulejo"}`} />
                      <span className={p.featured ? "text-porcelana/90" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full h-12 gap-2 ${
                    p.featured ? "bg-mustard text-azulejo hover:bg-mustard/90" : "btn-whatsapp"
                  }`}
                >
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
                  </a>
                </Button>
              </div>
            ))}
          </div>
          <p className="mono text-xs text-center text-muted-foreground mt-10">
            sem fidelização · cancela quando quiseres
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-secondary/40 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="mono text-xs uppercase tracking-[0.2em] text-mustard mb-3">FAQ</p>
            <h2 className="font-display text-4xl md:text-5xl text-azulejo">
              Perguntas frequentes.
            </h2>
          </div>
          <div className="max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-mustard/60 transition-colors"
                >
                  <AccordionTrigger className="text-left font-display text-lg text-azulejo hover:no-underline py-5 [&>svg]:hidden group">
                    <span className="flex-1 pr-4">{item.q}</span>
                    <span
                      aria-hidden
                      className="relative w-6 h-6 shrink-0 text-mustard"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
                      <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-current transition-transform duration-200 group-data-[state=open]:scale-y-0" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5 pr-10">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="relative azulejo-pattern rounded-2xl overflow-hidden p-10 md:p-16 lg:p-20 text-center">
            <div className="absolute inset-0 border-2 border-mustard/20 rounded-2xl pointer-events-none" />
            <p className="mono text-xs uppercase tracking-[0.25em] text-mustard mb-5">
              &gt; próximo passo
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-porcelana max-w-3xl mx-auto mb-6 leading-[1.05]">
              Um site que trabalha por ti, em <span className="text-mustard">dias</span>.
            </h2>
            <p className="text-porcelana/70 max-w-xl mx-auto mb-10 text-lg">
              Sem formulários. Sem espera. Fala connosco no WhatsApp e recebes uma proposta em 24h.
            </p>
            <Button asChild size="lg" className="btn-whatsapp h-16 px-10 text-lg gap-3 shadow-tile">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-6 h-6" /> Falar no WhatsApp
              </a>
            </Button>
            <p className="mono text-xs text-porcelana/50 mt-6">resposta média: &lt; 2h em dias úteis</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-6 md:items-center md:justify-between text-sm">
          <div className="flex items-center gap-2.5 font-display font-semibold">
            <span className="relative inline-flex w-7 h-7 rounded-md bg-azulejo items-center justify-center">
              <span className="text-mustard mono text-xs">B</span>
            </span>
            BuildWeb Studio
            <span className="mono text-xs text-muted-foreground ml-2">Porto, PT</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-azulejo transition-colors">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a href="mailto:hello@buildwebsites.pt" className="flex items-center gap-1.5 hover:text-azulejo transition-colors">
              <Mail className="w-4 h-4" /> hello@buildwebsites.pt
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Porto
            </span>
            <a href="https://instagram.com/buildwebsites.pt" target="_blank" rel="noopener noreferrer" className="hover:text-azulejo transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <div className="mono text-xs text-muted-foreground">
      © {year} BuildWeb Studio
        </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
