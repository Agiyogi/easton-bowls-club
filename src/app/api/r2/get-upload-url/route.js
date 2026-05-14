import { NextResponse } from "next/server";
import {
  buildKey,
  getSignedPutUrl,
  publicUrlFor,
  verifyAdmin,
} from "@/lib/r2";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export async function POST(req) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { filename, contentType, gallery } = body || {};

  if (!filename || typeof filename !== "string") {
    return NextResponse.json({ error: "filename required" }, { status: 400 });
  }
  if (!contentType || !ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: "unsupported contentType" },
      { status: 400 }
    );
  }
  if (gallery !== "photos" && gallery !== "scores") {
    return NextResponse.json({ error: "invalid gallery" }, { status: 400 });
  }

  try {
    const key = buildKey(gallery, filename);
    const uploadUrl = await getSignedPutUrl(key, contentType);
    const publicUrl = publicUrlFor(key);
    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("get-upload-url error", err);
    return NextResponse.json({ error: "sign failed" }, { status: 500 });
  }
}
