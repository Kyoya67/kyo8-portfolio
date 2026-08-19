import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About — KYO8",
  description: "Backend / Infrastructure Engineer based in Tokyo, Japan.",
};

export default function AboutPage() {
  return <AboutContent />;
}
