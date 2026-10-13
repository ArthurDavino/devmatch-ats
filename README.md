# DevMatch ATS

Crie uma aplicação web chamada DevMatch ATS.

## 1. Problema que resolve

Candidatos a vagas de tecnologia têm currículos bons que nunca chegam ao RH porque o ATS (Applicant Tracking System) — o software que ranqueia e filtra candidaturas automaticamente antes de qualquer humano ler — descarta o currículo por falta de palavras-chave técnicas que aparecem na descrição da vaga (linguagens, frameworks, ferramentas, metodologias). O DevMatch ATS compara o currículo da pessoa com a vaga, mostra exatamente o que está faltando e gera uma versão ajustada, otimizada para passar pelo ATS.

## 2. Regra inegociável

A aplicação melhora a forma como a pessoa se apresenta e nunca inventa experiência, tecnologia ou tempo de atuação que a pessoa não tem. O currículo ajustado só pode:
- Reorganizar, reescrever e destacar o que já está no currículo original;
- Usar sinônimos e termos técnicos equivalentes aos que a pessoa já mencionou (ex: se a pessoa escreveu "bancos de dados relacionais" e a vaga pede "SQL", pode aproximar os termos, mas não pode inventar "5 anos de PostgreSQL" do nada);
- Sugerir, como texto separado e claramente marcado como sugestão, palavras-chave que faltam — nunca inserir essas sugestões silenciosamente dentro do currículo gerado como se fossem experiência real.

Exiba esse compromisso de forma visível na interface (ex: um aviso fixo ou um bloco de texto na tela de resultados), com um texto como:
"O DevMatch ATS reorganiza e destaca o que você já tem. Ele nunca inventa experiência, tecnologia ou tempo de atuação que não estejam no seu currículo original."

## 3. Especialização: vagas de tecnologia

Diferente de um comparador genérico, o DevMatch ATS é otimizado para currículos e vagas da área de tecnologia (desenvolvimento, dados, produto, infraestrutura, QA etc). Isso significa:
- O extrator de palavras-chave deve priorizar termos técnicos: linguagens de programação, frameworks, bibliotecas, bancos de dados, ferramentas de cloud/DevOps, metodologias (Scrum, CI/CD, TDD), certificações e níveis de senioridade;
- Reconhecer variações comuns do mesmo termo técnico (ex: "JS" / "JavaScript"; "Postgres" / "PostgreSQL"; "React.js" / "ReactJS" / "React") como a mesma palavra-chave, para não gerar falsos negativos no match;
- Na tela de resultados, agrupar as palavras-chave por categoria técnica (ex: "Linguagens", "Frameworks e bibliotecas", "Bancos de dados", "Cloud e DevOps", "Metodologias", "Outras habilidades") em vez de uma lista única.

## 4. Fluxo principal (núcleo da v1)

1. A pessoa cola a descrição da vaga em um campo de texto;
2. A pessoa cola o próprio currículo em outro campo de texto;
3. A pessoa clica em Analisar;
4. A aplicação mostra:
   - Um percentual de match entre o currículo e a vaga, com destaque visual (ex: círculo ou barra de progresso, em verde quando o match é alto e em tons mais neutros/amarelos quando é baixo);
   - As palavras-chave técnicas encontradas no currículo que também aparecem na vaga, agrupadas por categoria;
   - As palavras-chave técnicas que faltam no currículo mas aparecem na vaga, agrupadas por categoria, com indicação visual de que são uma lacuna (ex: badge em tom de alerta, nunca vermelho de erro agressivo);
   - A versão ajustada do currículo, reescrita para incorporar de forma natural as palavras-chave que a pessoa já tem direito a usar (porque a experiência existe no original), em formato de texto limpo e pronto para revisão;
5. A pessoa pode exportar o currículo ajustado em PDF, com formatação limpa, pronta para envio.

Não implemente login, dashboard, histórico ou integrações nesta primeira versão — isso fica para depois.

## 5. Telas e componentes (usar shadcn/ui)

### Tela 1 — Home
- Hero simples: nome da aplicação, uma frase explicando o problema (currículo bom que o ATS barra antes do RH ver) e um botão "Analisar meu currículo" que leva à Tela 2;
- Um bloco curto explicando como funciona em 3 passos (cole a vaga → cole o currículo → veja o match e baixe a versão ajustada);
- Rodapé simples com o aviso da regra da seção 2.

### Tela 2 — Analisar
- Dois campos Textarea grandes, lado a lado em telas largas e empilhados em mobile:
  - "Descrição da vaga" (placeholder explicando que pode colar o texto completo do anúncio);
  - "Seu currículo" (placeholder explicando que pode colar o texto do currículo, sem precisar formatar);
- Contador de caracteres discreto em cada campo;
- Botão primário "Analisar compatibilidade", desabilitado até os dois campos terem conteúdo mínimo;
- Estado de carregamento (skeleton ou spinner) enquanto a análise roda.

### Tela 3 — Resultado
- Card de destaque no topo com o percentual de match (Progress ou indicador circular) e uma frase curta de interpretação (ex: "Bom match, mas faltam algumas palavras-chave importantes");
- Seção "Palavras-chave encontradas", com Badge verdes agrupados por categoria;
- Seção "Palavras-chave que faltam", com Badge em tom de alerta (âmbar), agrupados por categoria;
- Seção "Currículo ajustado para ATS", em um Card com o texto final, botão "Copiar texto" e botão "Exportar em PDF";
- Aviso fixo (componente Alert) reafirmando a regra da seção 2, visível nesta tela;
- Botão secundário "Analisar outra vaga", que limpa o estado e volta para a Tela 2.

## 6. Paleta de cores e design system

Usar shadcn/ui como base de componentes (Button, Textarea, Card, Badge, Progress, Alert, Tabs, Separator). Definir os tokens de tema (CSS variables / Tailwind) com esta paleta, pensada para transmitir profissionalismo (azul petróleo) e aprovação (verde):

- --primary: azul petróleo #0B4F6C — ações principais, cabeçalhos, elementos de destaque;
- --primary-foreground: #F8FAFC — texto sobre o azul petróleo;
- --secondary / cor de sucesso: verde #10B981 — usado no indicador de match alto e nos badges de palavras-chave encontradas;
- --accent: azul claro #E0F2FE — fundos suaves, hover states;
- --warning (uso customizado para badges de palavras-chave faltantes): âmbar #F59E0B, nunca o vermelho de erro padrão do shadcn, para não parecer que a aplicação está acusando um erro grave;
- --background: #F8FAFC (modo claro) com suporte a dark mode usando os mesmos tons em versão escura (#0B1420 de fundo, mantendo o azul petróleo e o verde como destaque);
- --muted: cinza-azulado #E2E8F0 para bordas e separadores;
- Tipografia: fonte sans-serif padrão do shadcn (Inter ou equivalente), títulos em peso semibold, corpo de texto em peso regular, boa legibilidade em blocos longos de texto (currículo e vaga colados).

Manter contraste AA em todos os textos sobre as cores de fundo.

## 7. Lógica da análise

Implementar a análise comparando o texto da vaga com o texto do currículo:
- Extrair candidatos a palavras-chave técnicas da descrição da vaga (termos de tecnologia, ferramentas, metodologias, seguindo a seção 3);
- Verificar quais desses termos aparecem (considerando variações/sinônimos comuns) no currículo;
- Calcular o percentual de match como a proporção de palavras-chave da vaga encontradas no currículo (pode usar peso maior para termos que aparecem múltiplas vezes ou em seções como "requisitos obrigatórios", se a vaga tiver esse tipo de estrutura);
- Gerar a versão ajustada do currículo reescrevendo o texto original para incorporar, nos pontos certos (resumo, experiências, habilidades), as palavras-chave que a pessoa já tem direito a reivindicar, sem adicionar afirmações novas de experiência.

Se a aplicação usar um modelo de linguagem para a extração de palavras-chave e a reescrita do currículo (recomendado para melhor qualidade), implementar isso via backend (edge function) do próprio Lovable, nunca expondo chaves de API no código do frontend. Se optar por uma abordagem sem IA generativa na v1 (correspondência de texto/sinônimos local), deixar claro no código que essa é uma versão inicial e estruturar para que a extração de palavras-chave e a reescrita do currículo possam ser trocadas por chamadas a um modelo de linguagem depois, sem redesenhar as telas.

## 8. Requisitos técnicos

- Aplicação React com Tailwind e shadcn/ui, responsiva (funciona bem em mobile e desktop);
- Estado da análise (vaga, currículo, resultado) gerenciado no cliente, sem necessidade de login nesta versão;
- Exportação do currículo ajustado em PDF a partir do texto gerado, com formatação legível (fonte, espaçamento, sem cortar conteúdo);
- Sem bancos de dados ou autenticação nesta v1 — tudo roda na sessão atual da pessoa;
- Nenhuma chave de API, token ou segredo hardcoded no frontend.

## 9. Fora de escopo nesta v1 (não implementar agora)

Exportar em .docx, histórico de análises em banco de dados, login com confirmação por e-mail, dashboard de evolução entre versões e otimização de SEO/GEO ficam para uma fase posterior de evolução do projeto — não implementar nesta primeira geração.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://devmatch-ats.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8baccc3a-541c-4c96-b122-c7f3c0063632).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
