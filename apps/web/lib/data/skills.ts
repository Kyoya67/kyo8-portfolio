import type { Skill } from "@/types";

export const skills: Skill[] = [
  { id: "s01", name: "TypeScript", category: "frontend", order: 1 },
  { id: "s02", name: "React", category: "frontend", order: 2 },
  { id: "s03", name: "Next.js", category: "frontend", order: 3 },

  { id: "s04", name: "Go", category: "backend", order: 1 },
  { id: "s05", name: "TypeScript", category: "backend", order: 2 },
  { id: "s06", name: "Node.js", category: "backend", order: 3 },
  { id: "s07", name: "Hono", category: "backend", order: 4 },

  { id: "s08", name: "AWS", category: "infrastructure", order: 1 },
  { id: "s09", name: "Terraform", category: "infrastructure", order: 2 },
  { id: "s10", name: "Docker", category: "infrastructure", order: 3 },
  { id: "s11", name: "GitHub Actions", category: "infrastructure", order: 4 },
  { id: "s12", name: "Linux", category: "infrastructure", order: 5 },

  { id: "s13", name: "PostgreSQL", category: "database", order: 1 },
  { id: "s14", name: "DynamoDB", category: "database", order: 2 },
  { id: "s15", name: "BigQuery", category: "database", order: 3 },

  { id: "s16", name: "Solidity", category: "blockchain", order: 1 },
  { id: "s17", name: "Ethereum / EVM", category: "blockchain", order: 2 },
];
