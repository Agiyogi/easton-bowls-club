import { NextResponse } from "next/server";
import {
  readManifest,
  writeManifest,
  deleteObject,
  verifyAdmin,
} from "@/lib/r2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseGallery(req) {
  const url = new URL(req.url);
  const gallery = url.searchParams.get("gallery");
  if (gallery !== "photos" && gallery !== "scores") return null;
  return gallery;
}

export async function GET(req) {
  const gallery = parseGallery(req);
  if (!gallery) {
    return NextResponse.json({ error: "invalid gallery" }, { status: 400 });
  }
  try {
    const entries = await readManifest(gallery);
    console.log(
      `[manifest GET] gallery=${gallery} bucket=${process.env.R2_BUCKET} ` +
        `entries=${entries.length}`
    );
    return NextResponse.json(
      { entries },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error(
      `[manifest GET] gallery=${gallery} bucket=${process.env.R2_BUCKET} failed`,
      { name: err?.name, status: err?.$metadata?.httpStatusCode, message: err?.message }
    );
    return NextResponse.json({ error: "read failed" }, { status: 500 });
  }
}

export async function POST(req) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const gallery = parseGallery(req);
  if (!gallery) {
    return NextResponse.json({ error: "invalid gallery" }, { status: 400 });
  }

  let entry;
  try {
    entry = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!entry || !entry.key || !entry.url) {
    return NextResponse.json(
      { error: "entry must have key and url" },
      { status: 400 }
    );
  }

  const clean = {
    key: String(entry.key),
    url: String(entry.url),
    caption: entry.caption ? String(entry.caption).slice(0, 240) : "",
    uploadedAt: new Date().toISOString(),
  };

  if (gallery === "scores") {
    clean.date = entry.date ? String(entry.date) : "";
    clean.opponent = entry.opponent ? String(entry.opponent).slice(0, 120) : "";
    clean.homeAway =
      entry.homeAway === "away" ? "away" : entry.homeAway === "home" ? "home" : "";
    clean.result = entry.result ? String(entry.result).slice(0, 80) : "";
  }

  try {
    const existing = await readManifest(gallery);
    const next = [clean, ...existing.filter((e) => e.key !== clean.key)];
    await writeManifest(gallery, next);
    return NextResponse.json({ entry: clean });
  } catch (err) {
    console.error("manifest POST error", err);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const gallery = parseGallery(req);
  if (!gallery) {
    return NextResponse.json({ error: "invalid gallery" }, { status: 400 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body || !body.key) {
    return NextResponse.json({ error: "key required" }, { status: 400 });
  }

  try {
    const existing = await readManifest(gallery);
    const next = existing.map((e) => {
      if (e.key !== body.key) return e;
      const updated = { ...e };
      if (typeof body.caption === "string") {
        updated.caption = body.caption.slice(0, 240);
      }
      if (gallery === "scores") {
        if (typeof body.date === "string") updated.date = body.date;
        if (typeof body.opponent === "string")
          updated.opponent = body.opponent.slice(0, 120);
        if (body.homeAway === "home" || body.homeAway === "away")
          updated.homeAway = body.homeAway;
        if (typeof body.result === "string")
          updated.result = body.result.slice(0, 80);
      }
      return updated;
    });
    await writeManifest(gallery, next);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("manifest PATCH error", err);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const gallery = parseGallery(req);
  if (!gallery) {
    return NextResponse.json({ error: "invalid gallery" }, { status: 400 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body || !body.key) {
    return NextResponse.json({ error: "key required" }, { status: 400 });
  }

  try {
    const existing = await readManifest(gallery);
    const next = existing.filter((e) => e.key !== body.key);
    await writeManifest(gallery, next);
    try {
      await deleteObject(body.key);
    } catch (err) {
      console.warn("deleteObject failed (manifest already updated)", err);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("manifest DELETE error", err);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}
