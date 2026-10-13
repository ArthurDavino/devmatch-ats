export const RULE_TEXT =
  "O DevMatch ATS reorganiza e destaca o que você já tem. Ele nunca inventa experiência, tecnologia ou tempo de atuação que não estejam no seu currículo original.";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8">
      <p className="mx-auto max-w-3xl px-6 text-center text-sm text-muted-foreground">{RULE_TEXT}</p>
    </footer>
  );
}
