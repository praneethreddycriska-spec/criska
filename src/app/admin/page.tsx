import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminPasswordReset } from "@/components/admin/password-reset";
import { supabaseAdminConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Admin Control Portal — Criska ATS",
  description: "Enterprise ATS candidate management, ATS scoring analysis, and job posting control panel.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      {!supabaseAdminConfigured && (
        <div className="bg-[#fff7ed] px-6 py-3 text-center text-[13.5px] text-[#9a3412]">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> to enable database write sync.
        </div>
      )}
      <AdminDashboard />
      <a
        href="/admin/content"
        className="fixed bottom-5 left-5 z-40 rounded-full border border-border bg-surface px-4 py-2.5 text-[13px] font-medium text-foreground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] hover:bg-panel"
      >
        🖼️ Manage Site Content
      </a>
      <AdminPasswordReset />
    </>
  );
}
