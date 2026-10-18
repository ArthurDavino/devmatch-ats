<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- ATS analysis lives in src/lib/ats (local dictionary matching, v1); screens depend only on the AnalysisResult type so the engine can be swapped for an AI server function later.
- PDF extraction uses viewport-positioned fragments and a browser-safe layout helper to order visual lines independently of PDF drawing order; test layout ordering without importing the browser PDF worker.
