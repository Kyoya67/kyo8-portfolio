import type { Skill } from "@/types";

export const skills: Skill[] = [
  { id: "s01", name: "TypeScript", category: "frontend", order: 1, keywords: ["React", "Next.js"] },

  { id: "s04", name: "Go", category: "backend", order: 1, keywords: ["net/http", "gorilla/mux"] },
  { id: "s05", name: "TypeScript", category: "backend", order: 2, keywords: ["Node.js", "Hono"] },

  {
    id: "s08",
    name: "AWS",
    category: "infrastructure",
    order: 1,
    keywords: ["Lambda", "API Gateway", "DynamoDB", "Amplify", "CloudFront", "Route53", "IAM", "Cognito"],
  },
  { id: "s09", name: "Terraform", category: "infrastructure", order: 2, keywords: [] },
  { id: "s10", name: "Docker", category: "infrastructure", order: 3, keywords: [] },
  { id: "s11", name: "GitHub Actions", category: "infrastructure", order: 4, keywords: [] },
  { id: "s12", name: "Linux", category: "infrastructure", order: 5, keywords: [] },

  { id: "s13", name: "PostgreSQL", category: "database", order: 1, keywords: [] },
  { id: "s14", name: "DynamoDB", category: "database", order: 2, keywords: [] },
  { id: "s15", name: "BigQuery", category: "database", order: 3, keywords: [] },

  { id: "s16", name: "Solidity", category: "blockchain", order: 1, keywords: [] },
  { id: "s17", name: "Ethereum / EVM", category: "blockchain", order: 2, keywords: [] },
];
