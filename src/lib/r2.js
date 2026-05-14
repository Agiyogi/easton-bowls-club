import "server-only";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_ENDPOINT,
  R2_PUBLIC_BASE,
  ADMIN_UPLOAD_PASSWORD,
} = process.env;

export const PUBLIC_BASE = R2_PUBLIC_BASE;
export const BUCKET = R2_BUCKET;

let _client = null;
export function r2() {
  if (_client) return _client;
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error("R2 env vars missing");
  }
  _client = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    forcePathStyle: true,
    // Disable the default flexible-checksums behaviour that the AWS SDK v3
    // adds automatically. R2 doesn't support the x-amz-checksum-* /
    // x-amz-sdk-checksum-algorithm headers, and when those are signed into a
    // pre-signed PUT URL the browser CORS preflight fails ("Failed to fetch").
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  return _client;
}

export function sanitiseFilename(name) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const cleanBase = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "file";
  const cleanExt = ext.replace(/[^a-z0-9.]/g, "");
  return `${cleanBase}${cleanExt}`;
}

export function buildKey(gallery, filename) {
  if (gallery !== "photos" && gallery !== "scores") {
    throw new Error("invalid gallery");
  }
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const ts = Math.floor(now.getTime() / 1000);
  const safe = sanitiseFilename(filename);
  return `${gallery}/${yyyy}/${mm}/${dd}/${ts}_${safe}`;
}

export async function getSignedPutUrl(key, contentType) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  // Force content-type into SignedHeaders so the browser PUT's Content-Type
  // is covered by the signature (otherwise the URL only signs `host`, and the
  // client header is unenforced — and on some R2 paths the upload 403s).
  return getSignedUrl(r2(), cmd, {
    expiresIn: 60 * 15,
    signableHeaders: new Set(["content-type"]),
  });
}

export function publicUrlFor(key) {
  return `${PUBLIC_BASE.replace(/\/$/, "")}/${key}`;
}

function manifestKey(gallery) {
  if (gallery !== "photos" && gallery !== "scores") {
    throw new Error("invalid gallery");
  }
  return `${gallery}/manifest.json`;
}

async function bodyToString(body) {
  if (!body) return "";
  // AWS SDK v3 attaches transformToString to the response stream — use it
  // rather than hand-rolling a Node Readable iterator, which silently returns
  // "" when the body is a web ReadableStream (Vercel edge / some runtimes).
  if (typeof body.transformToString === "function") {
    return body.transformToString("utf-8");
  }
  if (typeof body.text === "function") {
    return body.text();
  }
  const chunks = [];
  for await (const chunk of body) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export async function readManifest(gallery) {
  const key = manifestKey(gallery);
  try {
    const res = await r2().send(
      new GetObjectCommand({ Bucket: BUCKET, Key: key })
    );
    const text = await bodyToString(res.Body);
    if (!text) {
      console.error(
        `readManifest: empty body for bucket=${BUCKET} key=${key}`
      );
      return [];
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error(
        `readManifest: JSON parse failed for bucket=${BUCKET} key=${key}`,
        { textPreview: text.slice(0, 200), parseErr: parseErr.message }
      );
      return [];
    }
    if (!Array.isArray(data)) {
      console.error(
        `readManifest: manifest is not an array for bucket=${BUCKET} key=${key}`,
        { type: typeof data }
      );
      return [];
    }
    return data;
  } catch (err) {
    const status = err?.$metadata?.httpStatusCode;
    const name = err?.name;
    if (status === 404 || name === "NoSuchKey") {
      console.warn(
        `readManifest: manifest not found bucket=${BUCKET} key=${key} (404). ` +
          `Verify R2_BUCKET env var matches the bucket where uploads land.`
      );
      return [];
    }
    console.error(
      `readManifest: failed bucket=${BUCKET} key=${key}`,
      { name, status, message: err?.message }
    );
    throw err;
  }
}

export async function writeManifest(gallery, entries) {
  await r2().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: manifestKey(gallery),
      Body: JSON.stringify(entries, null, 2),
      ContentType: "application/json",
      CacheControl: "public, max-age=60",
    })
  );
}

export async function deleteObject(key) {
  await r2().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export function verifyAdmin(req) {
  const provided = req.headers.get("x-admin-password") || "";
  const expected = ADMIN_UPLOAD_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    crypto.timingSafeEqual(b, b);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}
