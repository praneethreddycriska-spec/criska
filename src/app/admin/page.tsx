import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/dashboard";
import { supabaseAdminConfigured } from "@/lib/supabase";

export const metadata: Metadata = { title: "Criska Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      {!supabaseAdminConfigured && (
        <div className="bg-[#fff7ed] px-6 py-3 text-center text-[13.5px] text-[#9a3412]">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> and restart the server to enable saving.
          Reads work; writes are disabled until then.
        </div>
      )}
      <AdminDashboard />
    </>
  );
}
