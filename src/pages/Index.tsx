import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  ArrowRight, Zap, Target, Sparkles, Search, Code2, Layout,
  RefreshCw, Gauge, TrendingUp, Check, Mail, Phone, MapPin,
  Github, Linkedin, Twitter, Star, Loader2,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

/** Inbox for contact form deliveries. */
const CONTACT_INBOX = "hello@buildwebsites.pt";
/** FormSubmit expects the raw address in the path (not %40-encoded). */
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_INBOX}`;

/** FormSubmit / Web3Forms return `success` as boolean or string. */
function isFormSuccess(data: { success?: unknown }): boolean {
  return data.success === true || data.success === "true";
}

const pillars = [
  { icon: Zap, title: "Sites Rápidos", desc: "Performance otimizada. Cada milissegundo conta para SEO e conversão." },
  { icon: Sparkles, title: "Design Premium", desc: "Estética sofisticada que transmite confiança e autoridade." },
  { icon: Target, title: "Foco em Conversão", desc: "Cada secção pensada para transformar visitantes em clientes." },
  { icon: Search, title: "SEO de Base", desc: "Estrutura técnica preparada para o Google encontrar o seu negócio." },
];

const services = [
  { icon: Code2, title: "Criação de Websites", desc: "Sites institucionais e e-commerce desenhados à medida do seu negócio." },
  { icon: Layout, title: "Landing Pages", desc: "Páginas de alta conversão para campanhas e lançamentos." },
  { icon: RefreshCw, title: "Redesign de Sites", desc: "Modernizamos o seu site para refletir a qualidade da sua marca." },
  { icon: Gauge, title: "Otimização de Performance", desc: "Aceleramos sites lentos para Core Web Vitals de topo." },
  { icon: Search, title: "SEO Técnico", desc: "Otimização on-page para subir nos resultados de pesquisa." },
  { icon: TrendingUp, title: "CRO & Análise", desc: "Análise de funil e melhorias contínuas para mais leads." },
];

const projects = [
  { img: project1, title: "Plataforma de Software", category: "Web App", href: "https://phase.uno" },
  { img: project2, title: "Dashboard SaaS", category: "Plataforma Digital", href: "https://endpoint.digital" },
  { img: project3, title: "Restaurante Boutique", category: "Website", href: "https://restaurante.buildwebsites.pt/" },
];

const steps = [
  { n: "01", title: "Briefing", desc: "Mergulhamos no seu negócio, objetivos e público." },
  { n: "02", title: "Design", desc: "Protótipos visuais alinhados com a sua marca." },
  { n: "03", title: "Desenvolvimento", desc: "Código limpo, rápido e otimizado para conversão." },
  { n: "04", title: "Entrega & Crescimento", desc: "Lançamento, formação e suporte contínuo." },
];

const testimonials = [
  { name: "Inês Marques", role: "CEO, Studio Norte", quote: "Triplicámos o número de pedidos de orçamento no primeiro mês após o lançamento. Profissionalismo absoluto." },
  { name: "Tiago Almeida", role: "Founder, Lumen SaaS", quote: "O melhor investimento do ano. Site rápido, lindo e que finalmente converte como devia." },
  { name: "Sara Oliveira", role: "Diretora, Boutique Sara", quote: "Perceberam o nosso negócio melhor do que qualquer outra agência. Resultados reais, não promessas." },
];

const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <a href="#top" className="flex items-center gap-2 font-bold text-lg">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary shadow-glow" />
        <span className="glow-text">BuildWeb</span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#servicos" className="hover:text-foreground transition-colors">Serviços</a>
        <a href="#portfolio" className="hover:text-foreground transition-colors">Portfólio</a>
        <a href="#processo" className="hover:text-foreground transition-colors">Processo</a>
        <a href="#contacto" className="hover:text-foreground transition-colors">Contacto</a>
      </div>
      <Button asChild variant="default" size="sm" className="bg-gradient-primary hover:opacity-90 shadow-glow border-0">
        <a href="#contacto">Pedir Orçamento</a>
      </Button>
    </div>
  </nav>
);

const Index = () => {
  const [form, setForm] = useState({ nome: "", email: "", tipo: "", mensagem: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.mensagem.trim()) {
      toast({ title: "Campos em falta", description: "Preencha nome, email e mensagem.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const subject = `[BuildWeb] Pedido de orçamento — ${form.tipo.trim() || "geral"}`;
      const lines: string[] = [
        `Nome: ${form.nome.trim()}`,
        `Email: ${form.email.trim()}`,
      ];
      if (form.tipo.trim()) lines.push(`Tipo de projeto: ${form.tipo.trim()}`);
      lines.push("", form.mensagem.trim());
      const messageBody = lines.join("\n");

      const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
      let data: { success?: unknown; message?: string };
      let res: Response;

      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        tipo: form.tipo.trim(),
        mensagem: form.mensagem.trim(),
      };

      if (web3Key) {
        res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3Key,
            subject,
            from_name: payload.nome,
            email: payload.email,
            message: messageBody,
          }),
        });
        data = await res.json().catch(() => ({}));
      } else {
        let usedNetlifyProxy = false;
        try {
          const fnRes = await fetch("/.netlify/functions/contact-form", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          });
          if (fnRes.status !== 404) {
            usedNetlifyProxy = true;
            res = fnRes;
            data = await fnRes.json().catch(() => ({}));
          }
        } catch {
          // Dev / non-Netlify host: fall through to direct FormSubmit
        }

        if (!usedNetlifyProxy) {
          const fd = new FormData();
          fd.append("name", payload.nome);
          fd.append("email", payload.email);
          fd.append("message", messageBody);
          fd.append("_subject", subject);

          res = await fetch(FORMSUBMIT_ENDPOINT, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: fd,
          });
          const raw = await res.text();
          try {
            data = JSON.parse(raw) as { success?: unknown; message?: string };
          } catch {
            data = {};
          }
          if (Object.keys(data).length === 0 && raw.trim().length > 0) {
            throw new Error("O serviço de email devolveu uma resposta inesperada. Tente de novo daqui a pouco.");
          }
        }
      }

      if (!res.ok || !isFormSuccess(data)) {
        const msg =
          typeof data.message === "string" && data.message.length > 0
            ? data.message
            : "Não foi possível enviar o pedido.";
        throw new Error(msg);
      }
      toast({ title: "Pedido enviado ✓", description: "Entraremos em contacto em menos de 24h." });
      setForm({ nome: "", email: "", tipo: "", mensagem: "" });
    } catch (err) {
      toast({
        title: "Erro ao enviar",
        description:
          err instanceof Error
            ? err.message
            : `Tente novamente ou escreva para ${CONTACT_INBOX}.`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="top" className="min-h-screen">
      <Nav />

      {/* HERO */}
      <header className="relative pt-32 pb-24 md:pt-44 md:pb-36 overflow-hidden">
        <img src={heroBg} alt="" width={1920} height={1080}
             className="absolute inset-0 w-full h-full object-cover opacity-40 -z-10" />
        <div className="absolute inset-0 grid-pattern opacity-20 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background -z-10" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              Agência de websites de alta performance
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8">
              Websites que <span className="glow-text">convertem</span> visitantes em clientes.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Não criamos sites bonitos. Criamos máquinas de vendas — rápidas, otimizadas e pensadas
              para gerar resultados reais para o seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow border-0 h-14 px-8 text-base">
                <a href="#contacto">Pedir Orçamento <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base glass border-white/10">
                <a href="#portfolio">Ver Projetos</a>
              </Button>
            </div>

            <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto text-left">
              {[
                { k: "120+", v: "Projetos entregues" },
                { k: "98%", v: "PageSpeed médio" },
                { k: "3.4×", v: "Aumento médio de leads" },
              ].map((s) => (
                <div key={s.v} className="glass rounded-xl p-5">
                  <div className="text-3xl md:text-4xl font-bold glow-text">{s.k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* PILARES */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">Proposta de valor</p>
            <h2 className="text-4xl md:text-5xl font-bold">O que torna os nossos sites diferentes.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <Card key={p.title} className="glass border-white/5 p-8 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 group"
                    style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-transform">
                  <p.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-widest text-primary mb-4">Serviços</p>
              <h2 className="text-4xl md:text-5xl font-bold">Tudo o que o seu negócio precisa online.</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Soluções completas para presença digital — do primeiro pixel ao primeiro cliente.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden">
            {services.map((s) => (
              <div key={s.title} className="bg-background p-8 md:p-10 hover:bg-secondary/40 transition-colors group">
                <s.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFÓLIO */}
      <section id="portfolio" className="py-24 md:py-32">
  <div className="container mx-auto px-6">
    <div className="max-w-2xl mb-16">
      <p className="text-sm uppercase tracking-widest text-primary mb-4">Portfólio</p>
      <h2 className="text-4xl md:text-5xl font-bold">Resultados que falam por nós.</h2>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((p) => (
        <div key={p.title} className="relative group">
          <Card className="glass border-white/5 overflow-hidden hover:shadow-elegant transition-all duration-500">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={p.img} alt={p.title} loading="lazy" width={1024} height={768}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-wider text-primary mb-2">{p.category}</p>
              <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                Ver template <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Card>
          <a href={p.href} target="_blank" rel="noopener noreferrer"
             className="absolute inset-0 z-10" aria-label={p.title} />
        </div>
      ))}
    </div>
  </div>
</section>

      {/* PROCESSO */}
      <section id="processo" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">Processo</p>
            <h2 className="text-4xl md:text-5xl font-bold">Simples. Transparente. Eficaz.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <Card className="glass border-white/5 p-8 h-full hover:border-primary/40 transition-all">
                  <div className="text-5xl font-bold glow-text mb-6">{s.n}</div>
                  <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </Card>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-5 w-6 h-6 text-primary/40 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTEMUNHOS */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">Testemunhos</p>
            <h2 className="text-4xl md:text-5xl font-bold">Clientes que crescem connosco.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="glass border-white/5 p-8">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/90 mb-6 leading-relaxed">"{t.quote}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <Card className="relative overflow-hidden border-white/5 p-12 md:p-20 text-center glass">
            <div className="absolute inset-0 bg-gradient-primary opacity-10" />
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl animate-glow-pulse" />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
                Pronto para ter um site que <span className="glow-text">realmente gera clientes?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                Marcamos uma conversa de 20 minutos. Sem compromisso, sem fluff.
              </p>
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow border-0 h-14 px-10 text-base">
                <a href="#contacto">Pedir Orçamento <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary mb-4">Contacto</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Vamos falar do seu projeto.</h2>
              <p className="text-muted-foreground mb-10">
                Resposta em menos de 24h. Orçamento personalizado e gratuito.
              </p>
              <div className="space-y-5">
                {[
                  { icon: Mail, text: CONTACT_INBOX, href: `mailto:${CONTACT_INBOX}` },
                  { icon: Phone, text: "+351 931 407 986" },
                  { icon: MapPin, text: "Porto, Portugal" },
                ].map((c) => (
                  <div key={c.text} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                      <c.icon className="w-4 h-4 text-primary" />
                    </div>
                    {"href" in c && c.href ? (
                      <a href={c.href} className="text-foreground/90 hover:text-primary transition-colors">
                        {c.text}
                      </a>
                    ) : (
                      <span className="text-foreground/90">{c.text}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-10 space-y-3">
                {["Sem custos escondidos", "Entrega no prazo combinado", "Suporte pós-lançamento"].map((b) => (
                  <div key={b} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" /> {b}
                  </div>
                ))}
              </div>
            </div>

            <Card className="glass border-white/5 p-8 md:p-10">
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label className="text-sm mb-2 block text-muted-foreground">Nome</label>
                  <Input value={form.nome} maxLength={100}
                         onChange={(e) => setForm({ ...form, nome: e.target.value })}
                         className="bg-secondary/50 border-white/10 h-12" placeholder="O seu nome" />
                </div>
                <div>
                  <label className="text-sm mb-2 block text-muted-foreground">Email</label>
                  <Input type="email" value={form.email} maxLength={255}
                         onChange={(e) => setForm({ ...form, email: e.target.value })}
                         className="bg-secondary/50 border-white/10 h-12" placeholder="email@empresa.com" />
                </div>
                <div>
                  <label className="text-sm mb-2 block text-muted-foreground">Tipo de projeto</label>
                  <select value={form.tipo}
                          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                          className="w-full bg-secondary/50 border border-white/10 rounded-md h-12 px-3 text-sm">
                    <option value="">Selecione…</option>
                    <option>Website institucional</option>
                    <option>E-commerce</option>
                    <option>Landing page</option>
                    <option>Redesign</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm mb-2 block text-muted-foreground">Mensagem</label>
                  <Textarea value={form.mensagem} maxLength={1000} rows={4}
                            onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                            className="bg-secondary/50 border-white/10" placeholder="Conte-nos sobre o seu projeto…" />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-glow border-0 h-12"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A enviar…
                    </>
                  ) : (
                    <>
                      Enviar pedido <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-bold">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary shadow-glow" />
              <span className="glow-text">BuildWeb</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 BuildWeb. Websites que vendem.</p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Github].map((I, i) => (
                <a key={i} href="#" aria-label="social"
                   className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:border-primary/40 transition-colors">
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
