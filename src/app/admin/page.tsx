import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Control Portal — Criska ATS",
  description: "Enterprise ATS candidate management, ATS scoring analysis, and job posting control panel.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
