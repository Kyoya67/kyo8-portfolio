import type { Metadata } from "next";
import CareerContent from "@/components/career/CareerContent";

export const metadata: Metadata = {
  title: "Career — KYO8",
  description: "Work, internship, and education history.",
};

export default function CareerPage() {
  return <CareerContent />;
}
