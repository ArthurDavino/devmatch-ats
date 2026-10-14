import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Check, Copy, Download, FileUp, Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { RULE_TEXT, SiteFooter } from "@/components/RuleNotice";
import { analyze, type AnalysisResult, type KeywordHit } from "@/lib/ats/analyze";
import { CATEGORIES, type Category } from "@/lib/ats/dictionary";
import { exportResumePdf } from "@/lib/ats/pdf";

export const Route = createFileRoute("/analisar")({
  head: () => ({
    meta: [
      { title: "Analisar currículo — DevMatch ATS" },
      { name: "description", content: "Cole a vaga e seu currículo para ver o percentual de match e as palavras-chave técnicas que faltam." },
      { property: "og:title", content: "Analisar currículo — DevMatch ATS" },
      { property: "og:description", content: "Match entre currículo e vaga de tecnologia, agrupado por categoria." },
    ],
  }),
  component: AnalyzePage,
});

const MIN = 80;
const MAX = 20000;

function AnalyzePage() {
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const run = async () => {
    setLoading(true);
    // Async boundary: future versions can swap `analyze` for a server/AI call.
    await new Promise((r) => setTimeout(r, 600));
    setResult(analyze(job, resume));
    setLoading(false);
    window.scrollTo({ top: 0 });
  };

  const reset = () => {
    setJob("");
    setResume("");
    setResult(null);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster />
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-semibold text-primary">DevMatch ATS</Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {loading ? (
          <LoadingState />
        ) : result ? (
          <Results result={result} onReset={reset} />
        ) : (
          <>
            <h1 className="text-3xl text-foreground">Analisar compatibilidade</h1>
            <p className="mt-2 text-muted-foreground">Cole a vaga e o seu currículo. Tudo fica só nesta sessão.</p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <Field label="Descrição da vaga" value={job} onChange={setJob}
                placeholder="Cole aqui o texto completo do anúncio da vaga: responsabilidades, requisitos, diferenciais…" />
              <Field label="Seu currículo" value={resume} onChange={setResume}
                action={<PdfImportButton onText={setResume} />}
                placeholder="Cole aqui o texto do seu currículo. Não precisa formatar — copie direto do PDF ou do documento." />
            </div>
            <div className="mt-6 flex flex-col items-start gap-2">
              <Button size="lg" disabled={job.trim().length < MIN || resume.trim().length < MIN} onClick={run}>
                Analisar compatibilidade
              </Button>
              <p className="text-xs text-muted-foreground">Mínimo de {MIN} caracteres em cada campo.</p>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function PdfImportButton({ onText }: { onText: (t: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Escolha um arquivo .pdf");
      return;
    }
    setBusy(true);
    try {
      const { extractPdfText } = await import("@/lib/ats/pdf-import");
      const text = await extractPdfText(file);
      if (text.replace(/\s/g, "").length < 20) {
        toast.error("Não encontramos texto nesse PDF", {
          description: "Parece ser uma imagem escaneada. Cole o texto do currículo manualmente no campo.",
        });
        return;
      }
      if (text.length > MAX) {
        onText(text.slice(0, MAX));
        toast.warning("Currículo importado parcialmente", {
          description: `O PDF tinha ${text.length.toLocaleString("pt-BR")} caracteres; mantivemos os primeiros ${MAX.toLocaleString("pt-BR")}.`,
        });
      } else {
        onText(text);
        toast.success("Currículo importado. Revise o texto antes de analisar.");
      }
    } catch (err) {
      console.error("PDF import failed", err);
      toast.error("Não foi possível ler esse PDF", { description: "Tente outro arquivo ou cole o texto manualmente." });
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={onFile} aria-label="Arquivo PDF do currículo" />
      <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? <Loader2 className="animate-spin" /> : <FileUp />} {busy ? "Lendo PDF…" : "Importar PDF"}
      </Button>
    </>
  );
}

function Field({ label, value, onChange, placeholder, action }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; action?: React.ReactNode }) {
  const id = label.replace(/\s/g, "-");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex min-h-9 items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-foreground">{label}</label>
        {action}
      </div>
      <Textarea id={id} value={value} maxLength={MAX} onChange={(e) => onChange(e.target.value.slice(0, MAX))} placeholder={placeholder}
        className="min-h-[320px] resize-y bg-card text-[15px] leading-relaxed lg:min-h-[420px]" />
      <span className={`self-end text-xs ${value.length >= MAX ? "text-warning" : "text-muted-foreground"}`}>
        {value.length.toLocaleString("pt-BR")} / {MAX.toLocaleString("pt-BR")} caracteres
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Analisando palavras-chave…</div>
      <Skeleton className="h-40 w-full" />
      <div className="grid gap-6 md:grid-cols-2"><Skeleton className="h-48" /><Skeleton className="h-48" /></div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

function interpret(score: number, missing: number) {
  if (score >= 80) return missing ? "Ótimo match! Faltam poucos termos da vaga." : "Excelente match com a vaga.";
  if (score >= 55) return "Bom match, mas faltam algumas palavras-chave importantes.";
  if (score > 0) return "Match baixo: muitas palavras-chave da vaga não aparecem no seu currículo.";
  return "Não encontramos termos técnicos da vaga no seu currículo.";
}

function ScoreRing({ score }: { score: number }) {
  const r = 52, c = 2 * Math.PI * r;
  const color = score >= 70 ? "stroke-success" : "stroke-warning";
  return (
    <div className="relative size-36 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} className="fill-none stroke-muted" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} className={`fill-none ${color} transition-all duration-700`} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-foreground">{score}%</span>
    </div>
  );
}

function Groups({ groups, variant, empty }: { groups: Record<Category, KeywordHit[]>; variant: "success" | "warning"; empty: string }) {
  const cats = CATEGORIES.filter((c) => groups[c].length);
  if (!cats.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="space-y-4">
      {cats.map((c) => (
        <div key={c}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c}</p>
          <div className="flex flex-wrap gap-2">
            {groups[c].map((k) => <Badge key={k.name} variant={variant}>{k.name}</Badge>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Results({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(result.adjustedResume);
    setCopied(true);
    toast.success("Texto copiado");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-6">
      <Alert variant="info">
        <ShieldCheck className="size-4" />
        <AlertTitle>Nosso compromisso</AlertTitle>
        <AlertDescription>{RULE_TEXT}</AlertDescription>
      </Alert>

      <Card className="shadow-card">
        <CardContent className="flex flex-col items-center gap-6 pt-6 text-center sm:flex-row sm:text-left">
          <ScoreRing score={result.score} />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Match com a vaga</p>
            <h2 className="mt-1 text-2xl text-foreground">{interpret(result.score, result.missingCount)}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.foundCount} palavras-chave encontradas · {result.missingCount} faltando
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Palavras-chave encontradas</CardTitle></CardHeader>
          <CardContent><Groups groups={result.found} variant="success" empty="Nenhuma palavra-chave da vaga foi encontrada." /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Palavras-chave que faltam</CardTitle>
            <CardDescription>
              Sugestões apenas. Inclua no currículo somente se você realmente tiver essa experiência.
            </CardDescription>
          </CardHeader>
          <CardContent><Groups groups={result.missing} variant="warning" empty="Nenhuma lacuna — seu currículo cobre os termos da vaga." /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Currículo ajustado para ATS</CardTitle>
            <CardDescription>Revise antes de enviar. Nada novo foi adicionado além do que já estava no original.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copy}>{copied ? <Check /> : <Copy />} Copiar texto</Button>
            <Button onClick={() => exportResumePdf(result.adjustedResume)}><Download /> Exportar em PDF</Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap break-words font-sans text-[15px] leading-relaxed text-foreground">
            {result.adjustedResume}
          </pre>
        </CardContent>
      </Card>

      <Button variant="secondary" onClick={onReset}><RotateCcw /> Analisar outra vaga</Button>
    </div>
  );
}
