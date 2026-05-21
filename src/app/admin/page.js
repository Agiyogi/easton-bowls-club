"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { COLORS as C } from "@/data/constants";
import AdminAuth, { getAdminPassword } from "@/components/AdminAuth";
import UploadForm from "@/components/UploadForm";

const TABS = [
  { id: "photo", label: "Upload photo" },
  { id: "score", label: "Upload scorecard" },
  { id: "manage", label: "Manage" },
];

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function monthLabel(iso) {
  if (!iso) return "";
  const [y, m] = iso.slice(0, 7).split("-").map(Number);
  if (!y || !m) return "";
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

function ManageList({ gallery, entries, onChange }) {
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const [editingDate, setEditingDate] = useState(null);
  const [dateDraft, setDateDraft] = useState("");
  const [busy, setBusy] = useState(null);

  const saveDate = async (entry) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateDraft)) return;
    setBusy(entry.key);
    try {
      const res = await fetch(`/api/r2/manifest?gallery=${gallery}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": getAdminPassword(),
        },
        body: JSON.stringify({ key: entry.key, takenAt: dateDraft }),
      });
      if (res.ok) {
        onChange(
          entries.map((e) => (e.key === entry.key ? { ...e, takenAt: dateDraft } : e))
        );
        setEditingDate(null);
      }
    } finally {
      setBusy(null);
    }
  };

  const saveCaption = async (entry) => {
    setBusy(entry.key);
    try {
      const res = await fetch(`/api/r2/manifest?gallery=${gallery}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": getAdminPassword(),
        },
        body: JSON.stringify({ key: entry.key, caption: draft }),
      });
      if (res.ok) {
        onChange(entries.map((e) => (e.key === entry.key ? { ...e, caption: draft } : e)));
        setEditing(null);
      }
    } finally {
      setBusy(null);
    }
  };

  const remove = async (entry) => {
    if (!confirm("Delete this entry?")) return;
    setBusy(entry.key);
    try {
      const res = await fetch(`/api/r2/manifest?gallery=${gallery}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": getAdminPassword(),
        },
        body: JSON.stringify({ key: entry.key }),
      });
      if (res.ok) {
        onChange(entries.filter((e) => e.key !== entry.key));
      }
    } finally {
      setBusy(null);
    }
  };

  if (entries.length === 0) {
    return (
      <div style={{ color: C.warmGray, padding: 20, fontSize: 14 }}>Nothing yet.</div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {entries.map((entry) => (
        <div
          key={entry.key}
          style={{
            background: C.white,
            border: "1px solid rgba(197,213,192,0.3)",
            borderRadius: 12,
            padding: 14,
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div style={{ width: 60, height: 60, position: "relative", borderRadius: 6, overflow: "hidden", flexShrink: 0, background: C.sage }}>
            <Image src={entry.url} alt="" fill sizes="60px" style={{ objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {gallery === "scores" && (
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: 14, color: C.charcoal, marginBottom: 2 }}>
                {entry.opponent || "Match"} {entry.result && `· ${entry.result}`}
              </div>
            )}
            {editing === entry.key ? (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: `1px solid ${C.sage}`,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                  }}
                />
                <button
                  onClick={() => saveCaption(entry)}
                  disabled={busy === entry.key}
                  style={{
                    background: C.sageDeep,
                    color: C.cream,
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  style={{
                    background: "none",
                    border: `1px solid ${C.sage}`,
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                    color: C.warmGray,
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.warmGray, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {entry.caption || <em style={{ color: C.sage }}>no caption</em>}
              </div>
            )}
            {gallery === "photos" &&
              (editingDate === entry.key ? (
                <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                  <input
                    type="date"
                    value={dateDraft}
                    max={todayISO()}
                    onChange={(e) => setDateDraft(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: `1px solid ${C.sage}`,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                    }}
                  />
                  <button
                    onClick={() => saveDate(entry)}
                    disabled={busy === entry.key}
                    style={{
                      background: C.sageDeep,
                      color: C.cream,
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingDate(null)}
                    style={{
                      background: "none",
                      border: `1px solid ${C.sage}`,
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontSize: 12,
                      cursor: "pointer",
                      color: C.warmGray,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: C.warmGray, marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                  <span>
                    {entry.takenAt ? (
                      <>
                        {monthLabel(entry.takenAt)}{" "}
                        <span style={{ opacity: 0.6 }}>· {entry.takenAt}</span>
                      </>
                    ) : (
                      <em style={{ color: C.sage }}>no date</em>
                    )}
                  </span>
                  <button
                    onClick={() => {
                      setEditingDate(entry.key);
                      setDateDraft(entry.takenAt || todayISO());
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: 12,
                      cursor: "pointer",
                      color: C.sageDeep,
                      textDecoration: "underline",
                    }}
                  >
                    Edit date
                  </button>
                </div>
              ))}
            <div style={{ fontSize: 11, color: C.warmGray, opacity: 0.7, marginTop: 4 }}>
              {entry.key}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => {
                setEditing(entry.key);
                setDraft(entry.caption || "");
              }}
              style={{
                background: "none",
                border: `1px solid ${C.sage}`,
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer",
                color: C.sageDeep,
              }}
            >
              Edit
            </button>
            <button
              onClick={() => remove(entry)}
              disabled={busy === entry.key}
              style={{
                background: "rgba(208,109,109,0.1)",
                color: "#A85555",
                border: "1px solid rgba(208,109,109,0.3)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminContent() {
  const [tab, setTab] = useState("photo");
  const [photos, setPhotos] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([
        fetch("/api/r2/manifest?gallery=photos", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/r2/manifest?gallery=scores", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setPhotos(p.entries || []);
      setScores(s.entries || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <main style={{ background: C.cream, minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 24px 80px" }}>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: C.sageDeep,
            marginBottom: 8,
          }}
        >
          Admin
        </div>
        <h1
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 32,
            fontWeight: 700,
            color: C.charcoal,
            margin: "0 0 28px 0",
          }}
        >
          Galleries & scorecards
        </h1>

        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            borderBottom: `1px solid ${C.sage}`,
          }}
          className="admin-tabs"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px 16px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: tab === t.id ? C.sageDeep : C.warmGray,
                borderBottom: tab === t.id ? `2px solid ${C.sageDeep}` : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "photo" && (
          <UploadForm gallery="photos" onUploaded={(e) => setPhotos((cur) => [e, ...cur.filter((x) => x.key !== e.key)])} />
        )}
        {tab === "score" && (
          <UploadForm gallery="scores" onUploaded={(e) => setScores((cur) => [e, ...cur.filter((x) => x.key !== e.key)])} />
        )}
        {tab === "manage" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 20, color: C.charcoal, margin: "0 0 12px" }}>
                Photos {!loading && <span style={{ fontSize: 13, color: C.warmGray, fontWeight: 400 }}>({photos.length})</span>}
              </h2>
              <ManageList gallery="photos" entries={photos} onChange={setPhotos} />
            </div>
            <div>
              <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 20, color: C.charcoal, margin: "0 0 12px" }}>
                Scorecards {!loading && <span style={{ fontSize: 13, color: C.warmGray, fontWeight: 400 }}>({scores.length})</span>}
              </h2>
              <ManageList gallery="scores" entries={scores} onChange={setScores} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <AdminAuth>
      <AdminContent />
    </AdminAuth>
  );
}
