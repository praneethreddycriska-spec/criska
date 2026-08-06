import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import { SESSION_COOKIE } from "@/lib/auth";
import { verifyFreshSession } from "@/lib/session";

const configured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== "REPLACE_ME_cloud_name";

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function POST(req: Request) {
  // Only logged-in admins can upload.
  const jar = await cookies();
  if (!(await verifyFreshSession(jar.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!configured) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Add CLOUDINARY_* keys to .env.local, or paste an image URL instead." },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "criska", resource_type: "image" }, (err, res) => {
          if (err || !res) return reject(err || new Error("Upload failed"));
          resolve(res as { secure_url: string });
        })
        .end(bytes);
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Upload failed" }, { status: 500 });
  }
}
