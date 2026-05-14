"use client";

import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { COLORS as C } from "../data/constants";
import { getAdminPassword } from "./AdminAuth";

const COMPRESS_OPTS = {
  maxSizeMB: 0.25,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
  fileType: "image/jpeg",
};

async function uploadOne({ file, gallery, caption, scoreFields }) {
  const password = getAdminPassword();
  const compressed = await imageCompression(file, COMPRESS_OPTS);
  const contentType = compressed.type || "image/jpeg";

  const signRes = await fetch("/api/r2/get-upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": password,
    },
    body: JSON.stringify({
      filename: file.name,
      contentType,
      gallery,
    }),
  });
  if (!signRes.ok) {
    throw new Error(`sign failed (${signRes.status})`);
  }
  const { uploadUrl, publicUrl, key } = await signRes.json();

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: compressed,
  });
  if (!putRes.ok) {
    throw new Error(`upload failed (${putRes.status})`);
  }

  const entry = {
    key,
    url: publicUrl,
    caption: caption || "",
    ...(gallery === "scores" ? scoreFields : {}),
  };

  const manifestRes = await fetch(`/api/r2/manifest?gallery=${gallery}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": password,
    },
    body: JSON.stringify(entry),
  });
  if (!manifestRes.ok) {
    throw new Error(`manifest write failed (${manifestRes.status})`);
  }
  const { entry: saved } = await manifestRes.json();
  return saved;
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: `1px solid ${C.sage}`,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  background: C.cream,
};

const labelStyle = {
  display: "block",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: C.warmGray,
  marginBottom: 6,
};

export default function UploadForm({ gallery, onUploaded }) {
  const fileRef = useRef(null);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [homeAway, setHomeAway] = useState("home");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");

  const reset = () => {
    if (fileRef.current) fileRef.current.value = "";
    setCaption("");
    setDate("");
    setOpponent("");
    setHomeAway("home");
    setResult("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const files = fileRef.current?.files;
    if (!files || files.length === 0) {
      setError("Pick at least one file");
      return;
    }
    setBusy(true);
    setProgress({ done: 0, total: files.length });

    const scoreFields =
      gallery === "scores"
        ? { date, opponent, homeAway, result }
        : {};

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const saved = await uploadOne({
          file,
          gallery,
          caption: files.length === 1 ? caption : caption ? `${caption} (${i + 1})` : "",
          scoreFields,
        });
        if (onUploaded) onUploaded(saved);
        setProgress({ done: i + 1, total: files.length });
      }
      reset();
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const isScores = gallery === "scores";

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: C.white,
        padding: 28,
        borderRadius: 14,
        border: "1px solid rgba(197,213,192,0.3)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div>
        <label style={labelStyle}>Image{isScores ? "" : "s"}</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={!isScores}
          style={{ ...inputStyle, padding: 8 }}
        />
        <div style={{ fontSize: 11, color: C.warmGray, marginTop: 6 }}>
          {isScores
            ? "One scorecard per upload."
            : "Pick multiple photos to upload in one batch. Images are compressed to ~200 KB."}
        </div>
      </div>

      {isScores && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Match date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Home / Away</label>
              <select
                value={homeAway}
                onChange={(e) => setHomeAway(e.target.value)}
                style={inputStyle}
              >
                <option value="home">Home</option>
                <option value="away">Away</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Opponent</label>
            <input
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="e.g. Framlingham"
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Result</label>
            <input
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="e.g. W 98–72"
              style={inputStyle}
            />
            <div style={{ fontSize: 11, color: C.warmGray, marginTop: 6 }}>
              Start with W, L, or D for the colour chip.
            </div>
          </div>
        </>
      )}

      <div>
        <label style={labelStyle}>Caption {isScores ? "(optional notes)" : ""}</label>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={isScores ? "e.g. Suffolk County League" : "e.g. Open Day 2026"}
          style={inputStyle}
        />
      </div>

      {error && (
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            color: "#A85555",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        style={{
          alignSelf: "flex-start",
          padding: "12px 28px",
          borderRadius: 50,
          border: "none",
          background: C.gold,
          color: C.charcoal,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: "uppercase",
          cursor: busy ? "wait" : "pointer",
          opacity: busy ? 0.6 : 1,
        }}
      >
        {busy
          ? progress.total > 1
            ? `Uploading ${progress.done}/${progress.total}…`
            : "Uploading…"
          : isScores
            ? "Upload scorecard"
            : "Upload photo(s)"}
      </button>
    </form>
  );
}
