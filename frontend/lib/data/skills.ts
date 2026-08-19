import type { Skill } from "@/types";

export const skills: Skill[] = [
  { id: "s01", name: "Go", category: "languages", order: 1 },
  { id: "s02", name: "TypeScript", category: "languages", order: 2 },
  { id: "s03", name: "Python", category: "languages", order: 3 },
  { id: "s04", name: "SQL", category: "languages", order: 4 },
  { id: "s05", name: "Solidity", category: "languages", order: 5 },

  { id: "s06", name: "Go", category: "backend", order: 1 },
  { id: "s07", name: "gRPC", category: "backend", order: 2 },
  { id: "s08", name: "REST API", category: "backend", order: 3 },
  { id: "s09", name: "GraphQL", category: "backend", order: 4 },

  { id: "s10", name: "AWS", category: "infrastructure", order: 1 },
  { id: "s11", name: "Terraform", category: "infrastructure", order: 2 },
  { id: "s12", name: "Docker", category: "infrastructure", order: 3 },
  { id: "s13", name: "GitHub Actions", category: "infrastructure", order: 4 },

  { id: "s14", name: "DynamoDB", category: "database", order: 1 },
  { id: "s15", name: "PostgreSQL", category: "database", order: 2 },
  { id: "s16", name: "Redis", category: "database", order: 3 },
  { id: "s17", name: "S3", category: "database", order: 4 },

  { id: "s18", name: "Ethereum", category: "blockchain", order: 1 },
  { id: "s19", name: "Solidity", category: "blockchain", order: 2 },
  { id: "s20", name: "IPFS", category: "blockchain", order: 3 },

  { id: "s21", name: "Git", category: "tools", order: 1 },
  { id: "s22", name: "VS Code", category: "tools", order: 2 },
  { id: "s23", name: "Linux", category: "tools", order: 3 },
  { id: "s24", name: "Notion", category: "tools", order: 4 },
];
