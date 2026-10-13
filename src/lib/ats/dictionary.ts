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
  | "Outras habilidades";

export const CATEGORIES: Category[] = [
  "Linguagens",
  "Frameworks e bibliotecas",
  "Bancos de dados",
  "Cloud e DevOps",
  "Metodologias",
  "Outras habilidades",
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
  { name: "Bash", category: L, aliases: ["bash", "shell script", "shell scripting"] },

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
  { name: "Linux", category: C, aliases: ["linux", "ubuntu", "debian"] },
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
  { name: "Power BI", category: O, aliases: ["power bi", "powerbi"] },
  { name: "Figma", category: O, aliases: ["figma"] },
  { name: "Jira", category: O, aliases: ["jira"] },
  { name: "Inglês", category: O, aliases: ["inglês", "ingles", "english"] },
  { name: "Júnior", category: O, aliases: ["júnior", "junior", "jr"] },
  { name: "Pleno", category: O, aliases: ["pleno", "mid-level", "mid level"] },
  { name: "Sênior", category: O, aliases: ["sênior", "senior", "sr"] },
  { name: "AWS Certified", category: O, aliases: ["aws certified", "certificação aws", "certificacao aws"] },
];
