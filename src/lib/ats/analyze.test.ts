import { describe, it, expect } from "vitest";
import { analyze } from "./analyze";
import { DICTIONARY } from "./dictionary";

describe("analyze", () => {
  it("treats JS/JavaScript, Postgres/PostgreSQL, ReactJS/React as the same keyword", () => {
    const r = analyze("Requisitos: JavaScript, PostgreSQL e React", "Experiência com JS, Postgres e ReactJS");
    expect(r.score).toBe(100);
    expect(r.missingCount).toBe(0);
  });

  it("never inserts missing keywords into the adjusted resume", () => {
    const r = analyze("Requisitos: Python, Kubernetes", "Dev Python com 3 anos de experiência");
    expect(r.missing["Cloud e DevOps"].map((k) => k.name)).toContain("Kubernetes");
    expect(r.adjustedResume).not.toMatch(/kubernetes/i);
  });

  it("preserves development matching and required-section weights", () => {
    const r = analyze("Requisitos: React, TypeScript, Node.js, PostgreSQL. Diferenciais: Docker, AWS", "ReactJS, TS, Node, Postgres e Docker");
    expect(r.score).toBe(90);
    expect(r.foundCount).toBe(5);
    expect(r.missingCount).toBe(1);
  });

  it("matches support and infrastructure aliases without adding missing skills", () => {
    const r = analyze("Requisitos: Windows, Active Directory, VPN, Microsoft 365, Intune, PowerShell", "Suporte Windows com AD, VPN, Office 365 e pwsh");
    expect(r.score).toBe(83);
    expect(r.foundCount).toBe(5);
    expect(r.missing["Gestão de dispositivos"].map((k) => k.name)).toEqual(["Intune"]);
    expect(r.adjustedResume).not.toMatch(/intune/i);
  });

  it.each([
    ["Suporte e Infraestrutura", "macOS, Helpdesk, suporte a usuários, troubleshooting, Active Directory, Entra ID, VPN, DNS, TCP/IP, DHCP, firewall, VLAN, pfSense, OpenVPN, Windows Server, SSH"],
    ["Produtividade e colaboração", "Microsoft 365, Exchange Online, Teams, SharePoint, Google Workspace"],
    ["Gestão de dispositivos", "Intune, MDM, AnyDesk, TeamViewer, RDP, acesso remoto"],
    ["Segurança da Informação", "MFA, LGPD, ISO 27001, SIEM, pentest, controle de acesso"],
    ["Dados e BI", "Power BI, DAX, Excel avançado, ETL, Data Warehouse"],
    ["Automação", "PowerShell, Bash, scripts de automação"],
    ["Certificações de TI", "CompTIA, ITIL"],
  ])("recognizes requested terms in %s", (category, terms) => {
    const r = analyze(terms, terms);
    const names = Object.values(r.found).flat().map((k) => k.name.toLowerCase());
    expect(names).toEqual(expect.arrayContaining(terms.split(", ").map((name) => name === "Teams" ? "microsoft teams" : name.toLowerCase())));
    expect(Object.entries(r.found).find(([name]) => name === category)?.[1].length).toBeGreaterThan(0);
    expect(r.score).toBe(100);
  });

  it("retains expanded cloud terms and unique canonical entries", () => {
    expect(analyze("Azure, GCP, Kubernetes, Terraform", "Azure, Google Cloud, k8s, Terraform").foundCount).toBe(4);
    expect(new Set(DICTIONARY.map((k) => k.name)).size).toBe(DICTIONARY.length);
  });
});
