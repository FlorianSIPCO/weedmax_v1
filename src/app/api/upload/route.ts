import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (error, result) => {
          if (error) reject(error);
          else resolve({
            secure_url: result?.secure_url,
            public_id: result?.public_id
          });
        })
        .end(buffer);
    });

    return NextResponse.json({
      secure_url: (result as any).secure_url,
      public_id: (result as any).public_id
    });
  } catch (error) {
    console.error("Erreur Cloudinary :", error);
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }
}
