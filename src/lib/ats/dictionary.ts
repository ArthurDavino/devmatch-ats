/**
 * Technical keyword dictionary for DevMatch ATS (v1, local matching).
 * Each entry has a canonical name, a category and the aliases/variations that
 * should count as the same keyword (avoids false negatives like JS vs JavaScript).
 */
export type Category =
  | "Linguagens"
  | "Frameworks e bibliotecas"
  | "Bancos de dados"
  | "Cloud e DevOps"
  | "Metodologias"
  | "Outras habilidades"
  | "Suporte e Infraestrutura"
  | "Produtividade e colaboração"
  | "Gestão de dispositivos"
  | "Segurança da Informação"
  | "Dados e BI"
  | "Automação"
  | "Certificações de TI";

export const CATEGORIES: Category[] = [
  "Linguagens",
  "Frameworks e bibliotecas",
  "Bancos de dados",
  "Cloud e DevOps",
  "Metodologias",
  "Outras habilidades",
  "Suporte e Infraestrutura",
  "Produtividade e colaboração",
  "Gestão de dispositivos",
  "Segurança da Informação",
  "Dados e BI",
  "Automação",
  "Certificações de TI",
];

export interface KeywordDef {
  name: string;
  category: Category;
  aliases: string[];
  /** Match aliases case-sensitively (for ambiguous short words like "Go"). */
  caseSensitive?: boolean;
}

const L: Category = "Linguagens";
const F: Category = "Frameworks e bibliotecas";
const D: Category = "Bancos de dados";
const C: Category = "Cloud e DevOps";
const M: Category = "Metodologias";
const O: Category = "Outras habilidades";
const I: Category = "Suporte e Infraestrutura";
const P: Category = "Produtividade e colaboração";
const G: Category = "Gestão de dispositivos";
const S: Category = "Segurança da Informação";
const B: Category = "Dados e BI";
const A: Category = "Automação";
const T: Category = "Certificações de TI";

export const DICTIONARY: KeywordDef[] = [
  // Linguagens
  { name: "JavaScript", category: L, aliases: ["javascript", "js", "ecmascript", "es6"] },
  { name: "TypeScript", category: L, aliases: ["typescript", "ts"] },
  { name: "Python", category: L, aliases: ["python", "python3"] },
  { name: "Java", category: L, aliases: ["java"] },
  { name: "Kotlin", category: L, aliases: ["kotlin"] },
  { name: "C#", category: L, aliases: ["c#", "csharp", "c sharp"] },
  { name: "C++", category: L, aliases: ["c++", "cpp"] },
  { name: "Go", category: L, aliases: ["Go", "Golang", "golang", "GoLang"], caseSensitive: true },
  { name: "Rust", category: L, aliases: ["rust"] },
  { name: "PHP", category: L, aliases: ["php"] },
  { name: "Ruby", category: L, aliases: ["ruby"] },
  { name: "Swift", category: L, aliases: ["swift"] },
  { name: "Dart", category: L, aliases: ["dart"] },
  { name: "Scala", category: L, aliases: ["scala"] },
  { name: "Elixir", category: L, aliases: ["elixir"] },
  { name: "SQL", category: L, aliases: ["sql", "bancos de dados relacionais", "banco de dados relacional"] },
  { name: "HTML", category: L, aliases: ["html", "html5"] },
  { name: "CSS", category: L, aliases: ["css", "css3"] },
  { name: "Bash", category: A, aliases: ["bash", "shell script", "shell scripting"] },

  // Frameworks e bibliotecas
  { name: "React", category: F, aliases: ["react", "react.js", "reactjs"] },
  { name: "React Native", category: F, aliases: ["react native", "react-native"] },
  { name: "Next.js", category: F, aliases: ["next.js", "nextjs", "next js"] },
  { name: "Vue.js", category: F, aliases: ["vue", "vue.js", "vuejs"] },
  { name: "Angular", category: F, aliases: ["angular", "angularjs", "angular.js"] },
  { name: "Svelte", category: F, aliases: ["svelte", "sveltekit"] },
  { name: "Node.js", category: F, aliases: ["node", "node.js", "nodejs"] },
  { name: "Express", category: F, aliases: ["express", "express.js", "expressjs"] },
  { name: "NestJS", category: F, aliases: ["nestjs", "nest.js"] },
  { name: "Django", category: F, aliases: ["django"] },
  { name: "Flask", category: F, aliases: ["flask"] },
  { name: "FastAPI", category: F, aliases: ["fastapi"] },
  { name: "Spring Boot", category: F, aliases: ["spring boot", "springboot", "spring"] },
  { name: ".NET", category: F, aliases: [".net", "dotnet", "asp.net", ".net core"] },
  { name: "Laravel", category: F, aliases: ["laravel"] },
  { name: "Ruby on Rails", category: F, aliases: ["rails", "ruby on rails", "ror"] },
  { name: "Flutter", category: F, aliases: ["flutter"] },
  { name: "Redux", category: F, aliases: ["redux", "redux toolkit"] },
  { name: "Tailwind CSS", category: F, aliases: ["tailwind", "tailwindcss", "tailwind css"] },
  { name: "GraphQL", category: F, aliases: ["graphql"] },
  { name: "Jest", category: F, aliases: ["jest"] },
  { name: "Cypress", category: F, aliases: ["cypress"] },
  { name: "Selenium", category: F, aliases: ["selenium"] },
  { name: "Playwright", category: F, aliases: ["playwright"] },
  { name: "Pandas", category: F, aliases: ["pandas"] },
  { name: "NumPy", category: F, aliases: ["numpy"] },
  { name: "TensorFlow", category: F, aliases: ["tensorflow"] },
  { name: "PyTorch", category: F, aliases: ["pytorch"] },
  { name: "Scikit-learn", category: F, aliases: ["scikit-learn", "sklearn", "scikit learn"] },
  { name: "Spark", category: F, aliases: ["spark", "apache spark", "pyspark"] },

  // Bancos de dados
  { name: "PostgreSQL", category: D, aliases: ["postgresql", "postgres", "psql"] },
  { name: "MySQL", category: D, aliases: ["mysql", "mariadb"] },
  { name: "SQL Server", category: D, aliases: ["sql server", "mssql"] },
  { name: "Oracle", category: D, aliases: ["oracle", "oracle db", "pl/sql"] },
  { name: "MongoDB", category: D, aliases: ["mongodb", "mongo"] },
  { name: "Redis", category: D, aliases: ["redis"] },
  { name: "Elasticsearch", category: D, aliases: ["elasticsearch", "elastic search", "opensearch"] },
  { name: "DynamoDB", category: D, aliases: ["dynamodb", "dynamo db"] },
  { name: "Cassandra", category: D, aliases: ["cassandra"] },
  { name: "SQLite", category: D, aliases: ["sqlite"] },
  { name: "Firebase", category: D, aliases: ["firebase", "firestore"] },
  { name: "NoSQL", category: D, aliases: ["nosql", "não relacional", "nao relacional"] },

  // Cloud e DevOps
  { name: "AWS", category: C, aliases: ["aws", "amazon web services"] },
  { name: "Azure", category: C, aliases: ["azure", "microsoft azure"] },
  { name: "Google Cloud", category: C, aliases: ["gcp", "google cloud", "google cloud platform"] },
  { name: "Docker", category: C, aliases: ["docker", "containers", "contêineres", "conteineres"] },
  { name: "Kubernetes", category: C, aliases: ["kubernetes", "k8s", "eks", "gke", "aks"] },
  { name: "Terraform", category: C, aliases: ["terraform"] },
  { name: "Ansible", category: C, aliases: ["ansible"] },
  { name: "CI/CD", category: C, aliases: ["ci/cd", "ci cd", "cicd", "integração contínua", "integracao continua", "entrega contínua", "deploy contínuo"] },
  { name: "GitHub Actions", category: C, aliases: ["github actions"] },
  { name: "GitLab CI", category: C, aliases: ["gitlab ci", "gitlab-ci"] },
  { name: "Jenkins", category: C, aliases: ["jenkins"] },
  { name: "Git", category: C, aliases: ["git", "github", "gitlab", "bitbucket"] },
  { name: "Linux", category: I, aliases: ["linux", "ubuntu", "debian", "servidores linux", "linux server"] },
  { name: "Microsserviços", category: C, aliases: ["microsserviços", "microsservicos", "microservices", "microserviços", "micro serviços"] },
  { name: "Serverless", category: C, aliases: ["serverless", "lambda", "aws lambda", "cloud functions"] },
  { name: "Kafka", category: C, aliases: ["kafka", "apache kafka"] },
  { name: "RabbitMQ", category: C, aliases: ["rabbitmq"] },
  { name: "Observabilidade", category: C, aliases: ["observabilidade", "observability", "monitoramento", "datadog", "prometheus", "grafana", "new relic"] },

  // Metodologias
  { name: "Scrum", category: M, aliases: ["scrum"] },
  { name: "Kanban", category: M, aliases: ["kanban"] },
  { name: "Metodologias ágeis", category: M, aliases: ["ágil", "agil", "agile", "metodologias ágeis", "metodologias ageis"] },
  { name: "TDD", category: M, aliases: ["tdd", "test driven development", "desenvolvimento orientado a testes"] },
  { name: "BDD", category: M, aliases: ["bdd"] },
  { name: "DDD", category: M, aliases: ["ddd", "domain driven design"] },
  { name: "Clean Code", category: M, aliases: ["clean code", "código limpo", "codigo limpo"] },
  { name: "SOLID", category: M, aliases: ["solid"] },
  { name: "Clean Architecture", category: M, aliases: ["clean architecture", "arquitetura limpa", "arquitetura hexagonal"] },
  { name: "Code Review", category: M, aliases: ["code review", "revisão de código", "revisao de codigo"] },
  { name: "DevOps", category: M, aliases: ["devops"] },

  // Outras habilidades
  { name: "APIs REST", category: O, aliases: ["rest", "restful", "api rest", "apis rest", "rest api", "rest apis"] },
  { name: "Testes automatizados", category: O, aliases: ["testes automatizados", "automação de testes", "automacao de testes", "testes unitários", "testes unitarios", "unit tests", "testes de integração"] },
  { name: "Machine Learning", category: O, aliases: ["machine learning", "aprendizado de máquina", "ml"] },
  { name: "Power BI", category: B, aliases: ["power bi", "powerbi"] },
  { name: "Figma", category: O, aliases: ["figma"] },
  { name: "Jira", category: O, aliases: ["jira"] },
  { name: "Inglês", category: O, aliases: ["inglês", "ingles", "english"] },
  { name: "Júnior", category: O, aliases: ["júnior", "junior", "jr"] },
  { name: "Pleno", category: O, aliases: ["pleno", "mid-level", "mid level"] },
  { name: "Sênior", category: O, aliases: ["sênior", "senior", "sr"] },
  { name: "AWS Certified", category: T, aliases: ["aws certified", "certificação aws", "certificacao aws"] },

  // Suporte, sistemas operacionais e redes
  { name: "Windows", category: I, aliases: ["windows", "win10", "win11", "windows 10", "windows 11"] },
  { name: "Windows Server", category: I, aliases: ["windows server", "servidor windows", "servidores windows"] },
  { name: "macOS", category: I, aliases: ["macos", "mac os", "os x"] },
  { name: "Suporte técnico", category: I, aliases: ["suporte técnico", "suporte tecnico", "technical support", "suporte de ti"] },
  { name: "Helpdesk", category: I, aliases: ["helpdesk", "help desk", "service desk", "servicedesk"] },
  { name: "Suporte a usuários", category: I, aliases: ["suporte a usuários", "suporte a usuarios", "suporte ao usuário", "suporte ao usuario", "atendimento a usuários", "atendimento a usuarios", "end user support"] },
  { name: "Troubleshooting", category: I, aliases: ["troubleshooting", "troubleshoot", "resolução de problemas", "resolucao de problemas", "diagnóstico de problemas", "diagnostico de problemas"] },
  { name: "Active Directory", category: I, aliases: ["active directory", "AD", "AD DS", "ADDS"] },
  { name: "Entra ID", category: I, aliases: ["entra id", "microsoft entra", "azure ad", "azure active directory", "AAD"] },
  { name: "VPN", category: I, aliases: ["vpn", "virtual private network", "rede privada virtual"] },
  { name: "DNS", category: I, aliases: ["dns", "domain name system"] },
  { name: "TCP/IP", category: I, aliases: ["tcp/ip", "tcp ip", "tcpip", "tcp-ip"] },
  { name: "DHCP", category: I, aliases: ["dhcp", "dynamic host configuration protocol"] },
  { name: "Firewall", category: I, aliases: ["firewall", "firewalls"] },
  { name: "VLAN", category: I, aliases: ["vlan", "vlans", "virtual lan"] },
  { name: "pfSense", category: I, aliases: ["pfsense", "pf sense"] },
  { name: "OpenVPN", category: I, aliases: ["openvpn", "open vpn"] },
  { name: "SSH", category: I, aliases: ["ssh", "secure shell"] },
  { name: "Redes de computadores", category: I, aliases: ["redes de computadores", "redes de computador", "computer networking", "infraestrutura de redes"] },
  { name: "Virtualização", category: I, aliases: ["virtualização", "virtualizacao", "virtualization"] },
  { name: "VMware", category: I, aliases: ["vmware", "vsphere", "esxi"] },
  { name: "Hyper-V", category: I, aliases: ["hyper-v", "hyper v", "hyperv"] },
  { name: "Backup", category: I, aliases: ["backup", "backups", "cópia de segurança", "copia de seguranca"] },
  { name: "GPO", category: I, aliases: ["gpo", "group policy", "políticas de grupo", "politicas de grupo"] },

  // Produtividade e colaboração
  { name: "Microsoft 365", category: P, aliases: ["microsoft 365", "microsoft365", "office 365", "office365", "m365", "o365"] },
  { name: "Exchange Online", category: P, aliases: ["exchange online", "microsoft exchange"] },
  { name: "Microsoft Teams", category: P, aliases: ["microsoft teams", "ms teams", "teams"] },
  { name: "SharePoint", category: P, aliases: ["sharepoint", "share point", "sharepoint online"] },
  { name: "Google Workspace", category: P, aliases: ["google workspace", "g suite", "gsuite", "google apps"] },

  // Dispositivos e acesso remoto
  { name: "Intune", category: G, aliases: ["intune", "microsoft intune", "endpoint manager"] },
  { name: "MDM", category: G, aliases: ["mdm", "mobile device management", "gerenciamento de dispositivos móveis", "gerenciamento de dispositivos moveis", "gestão de dispositivos móveis", "gestao de dispositivos moveis"] },
  { name: "AnyDesk", category: G, aliases: ["anydesk", "any desk"] },
  { name: "TeamViewer", category: G, aliases: ["teamviewer", "team viewer"] },
  { name: "RDP", category: G, aliases: ["rdp", "remote desktop", "área de trabalho remota", "area de trabalho remota"] },
  { name: "Acesso remoto", category: G, aliases: ["acesso remoto", "remote access", "assistência remota", "assistencia remota"] },
  { name: "SCCM", category: G, aliases: ["sccm", "mecm", "configuration manager"] },

  // Segurança da informação
  { name: "MFA", category: S, aliases: ["mfa", "2fa", "multi-factor authentication", "multifactor authentication", "autenticação multifator", "autenticacao multifator", "autenticação de dois fatores", "autenticacao de dois fatores"] },
  { name: "LGPD", category: S, aliases: ["lgpd", "lei geral de proteção de dados", "lei geral de protecao de dados"] },
  { name: "ISO 27001", category: S, aliases: ["iso 27001", "iso27001", "iso/iec 27001", "iso 27.001"] },
  { name: "SIEM", category: S, aliases: ["siem", "security information and event management"] },
  { name: "Pentest", category: S, aliases: ["pentest", "pen test", "penetration testing", "teste de penetração", "teste de penetracao", "testes de invasão", "testes de invasao"] },
  { name: "Controle de acesso", category: S, aliases: ["controle de acesso", "controle de acessos", "access control", "rbac"] },
  { name: "IAM", category: S, aliases: ["iam", "identity and access management", "gestão de identidades", "gestao de identidades"] },
  { name: "EDR", category: S, aliases: ["edr", "endpoint detection and response"] },
  { name: "Gestão de vulnerabilidades", category: S, aliases: ["gestão de vulnerabilidades", "gestao de vulnerabilidades", "vulnerability management"] },
  { name: "Segurança da informação", category: S, aliases: ["segurança da informação", "seguranca da informacao", "information security", "cibersegurança", "ciberseguranca", "cybersecurity"] },

  // Dados e inteligência de negócios
  { name: "DAX", category: B, aliases: ["dax", "data analysis expressions"] },
  { name: "Excel avançado", category: B, aliases: ["excel avançado", "excel avancado", "advanced excel"] },
  { name: "ETL", category: B, aliases: ["etl", "extract transform load", "extração transformação e carga", "extracao transformacao e carga"] },
  { name: "Data Warehouse", category: B, aliases: ["data warehouse", "datawarehouse", "data warehousing", "armazém de dados", "armazem de dados"] },
  { name: "Power Query", category: B, aliases: ["power query", "powerquery"] },
  { name: "Data Lake", category: B, aliases: ["data lake", "datalake"] },
  { name: "Business Intelligence", category: B, aliases: ["business intelligence", "BI", "inteligência de negócios", "inteligencia de negocios"] },
  { name: "Tableau", category: B, aliases: ["tableau"] },

  // Automação e certificações
  { name: "PowerShell", category: A, aliases: ["powershell", "power shell", "pwsh"] },
  { name: "Scripts de automação", category: A, aliases: ["scripts de automação", "scripts de automacao", "scripts de automatização", "scripts de automatizacao", "automation scripts", "scripting"] },
  { name: "CompTIA", category: T, aliases: ["comptia", "comp tia", "comptia a+", "comptia network+", "comptia security+"] },
  { name: "ITIL", category: T, aliases: ["itil", "itil foundation", "information technology infrastructure library"] },
  { name: "CCNA", category: T, aliases: ["ccna", "cisco certified network associate"] },
  { name: "Microsoft Certified", category: T, aliases: ["microsoft certified", "certificação microsoft", "certificacao microsoft", "az-900", "az 900", "ms-900", "sc-900"] },
];
