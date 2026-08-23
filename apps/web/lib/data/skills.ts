import type { Skill } from "@/types";

export const skills: Skill[] = [
  {
    id: "s01",
    name: "TypeScript",
    category: "frontend",
    order: 1,
    capabilities: [],
    children: [
      { id: "s01c01", name: "React", capabilities: [] },
      { id: "s01c02", name: "Next.js", capabilities: [] },
    ],
  },

  {
    id: "s04",
    name: "Go",
    category: "backend",
    order: 1,
    capabilities: [],
    children: [
      { id: "s04c01", name: "net/http", capabilities: [] },
      { id: "s04c02", name: "gorilla/mux", capabilities: [] },
    ],
  },
  {
    id: "s05",
    name: "TypeScript",
    category: "backend",
    order: 2,
    capabilities: [],
    children: [
      { id: "s05c01", name: "Node.js", capabilities: [] },
      { id: "s05c02", name: "Hono", capabilities: [] },
    ],
  },

  {
    id: "s08",
    name: "AWS",
    category: "infrastructure",
    order: 1,
    capabilities: [],
    children: [
      { id: "s08c01", name: "Lambda", capabilities: [] },
      { id: "s08c02", name: "API Gateway", capabilities: [] },
      { id: "s08c03", name: "DynamoDB", capabilities: [] },
      { id: "s08c04", name: "Amplify", capabilities: [] },
      { id: "s08c05", name: "CloudFront", capabilities: [] },
      { id: "s08c06", name: "Route53", capabilities: [] },
      { id: "s08c07", name: "IAM", capabilities: [] },
      { id: "s08c08", name: "Cognito", capabilities: [] },
    ],
  },
  { id: "s09", name: "Terraform", category: "infrastructure", order: 2, capabilities: [], children: [] },
  { id: "s10", name: "Docker", category: "infrastructure", order: 3, capabilities: [], children: [] },
  { id: "s11", name: "GitHub Actions", category: "infrastructure", order: 4, capabilities: [], children: [] },
  { id: "s12", name: "Linux", category: "infrastructure", order: 5, capabilities: [], children: [] },

  { id: "s13", name: "PostgreSQL", category: "database", order: 1, capabilities: [], children: [] },
  { id: "s14", name: "DynamoDB", category: "database", order: 2, capabilities: [], children: [] },
  { id: "s15", name: "BigQuery", category: "database", order: 3, capabilities: [], children: [] },

  { id: "s16", name: "Solidity", category: "blockchain", order: 1, capabilities: [], children: [] },
  { id: "s17", name: "Ethereum / EVM", category: "blockchain", order: 2, capabilities: [], children: [] },
];
