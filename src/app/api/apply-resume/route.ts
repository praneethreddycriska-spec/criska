import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabase } from "@/lib/supabase";
import { clientIp, limit } from "@/lib/rate-limit";

// Public resume upload for job applicants (no admin session). Validates type +
// size, rate-limits by IP, and stores the file in the public `resumes` bucket.
// Returns a public URL that the apply form submits with the application.

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Map<string, string>([
  ["application/pdf", "pdf"],
  ["application/msword", "doc"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
]);
const ALLOWED_EXT = new Set(["pdf", "doc", "docx"]);

export async function POST(req: Request) {
  const { limited, retryAfter } = await limit(`resume:${clientIp(req)}`, 10, 60 * 60 * 1000);
  if (limited) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  // Service role preferred (bypasses RLS); fall back to anon (bucket allows public insert).
  const sb = getSupabaseAdmin() ?? getSupabase();
  if (!sb) {
    return NextResponse.json({ error: "Uploads are not configured." }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size === 0) return NextResponse.json({ error: "The file is empty." }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 5 MB)." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const typeExt = ALLOWED.get(file.type);
  if (!typeExt && !ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: "Only PDF, DOC, or DOCX files are allowed." }, { status: 400 });
  }
  const safeExt = typeExt || (ALLOWED_EXT.has(ext) ? ext : "pdf");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const rand = Math.random().toString(36).slice(2, 10);
  const path = `applications/${Date.now()}-${rand}.${safeExt}`;

  try {
    const { error } = await sb.storage.from("resumes").upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ error: error.message || "Upload failed." }, { status: 502 });
    }
    const { data } = sb.storage.from("resumes").getPublicUrl(path);
    if (!data?.publicUrl) {
      return NextResponse.json({ error: "Could not get file URL." }, { status: 502 });
    }
    return NextResponse.json({ url: data.publicUrl, name: file.name });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Upload failed." }, { status: 500 });
  }
}
