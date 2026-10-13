import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardPaste, FileText, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RULE_TEXT } from "@/components/RuleNotice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevMatch ATS — Seu currículo de tech aprovado pelo ATS" },
      { name: "description", content: "Compare seu currículo com a vaga de tecnologia, veja as palavras-chave que faltam e baixe uma versão ajustada para o ATS." },
      { property: "og:title", content: "DevMatch ATS — Seu currículo de tech aprovado pelo ATS" },
      { property: "og:description", content: "Veja o match com a vaga e gere um currículo otimizado, sem inventar experiência." },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: ClipboardPaste, title: "Cole a vaga", text: "O texto completo do anúncio." },
  { icon: FileText, title: "Cole o currículo", text: "Sem precisar formatar nada." },
  { icon: Gauge, title: "Veja o match", text: "E baixe a versão ajustada em PDF." },
];

function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="bg-hero px-6 pb-16 pt-20 text-center sm:pt-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">DevMatch ATS</p>
          <h1 className="mx-auto max-w-3xl text-4xl text-foreground sm:text-5xl">
            Seu currículo é bom. O ATS só não está vendo isso.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Robôs de recrutamento barram currículos de tecnologia por falta de palavras-chave antes do RH ler.
            Descubra o que falta e ajuste em minutos.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/analisar" data-testid="cta-analisar">
              Analisar meu currículo <ArrowRight />
            </Link>
          </Button>
        </section>
        <section className="mx-auto grid max-w-4xl gap-4 px-6 pb-20 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <s.icon className="size-5 text-primary" />
              </div>
              <h3 className="text-lg text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </section>
      </main>
      <footer className="border-t border-border bg-card py-8" data-testid="home-rule-footer">
        <p className="mx-auto max-w-3xl px-6 text-center text-sm text-muted-foreground">{RULE_TEXT}</p>
      </footer>
    </div>
  );
}
