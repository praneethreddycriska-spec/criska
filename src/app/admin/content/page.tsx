import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminPasswordReset } from "@/components/admin/password-reset";
import { supabaseAdminConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Site Content — Criska Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function ContentAdminPage() {
  return (
    <>
      {!supabaseAdminConfigured && (
        <div className="bg-[#fff7ed] px-6 py-3 text-center text-[13.5px] text-[#9a3412]">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> to enable saving.
        </div>
      )}
      <AdminDashboard />
      <AdminPasswordReset />
    </>
  );
}
