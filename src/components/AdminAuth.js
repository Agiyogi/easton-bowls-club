"use client";

import { useState, useEffect } from "react";
import { COLORS as C } from "../data/constants";

const STORAGE_KEY = "ebc_admin_pw";

export function getAdminPassword() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(STORAGE_KEY) || "";
}

export default function AdminAuth({ children }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAuthed(true);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setBusy(true);
    setError("");
    try {
      // Probe with a no-op write attempt: try DELETE with a non-existent key.
      // Easier: try POST manifest with no body — server checks password before body.
      // We'll just check via the get-upload-url with a dummy payload.
      const res = await fetch("/api/r2/get-upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": password,
        },
        body: JSON.stringify({
          filename: "probe.jpg",
          contentType: "image/jpeg",
          gallery: "photos",
        }),
      });
      if (res.status === 401) {
        setError("Wrong password");
      } else if (!res.ok) {
        setError("Server error — try again");
      } else {
        sessionStorage.setItem(STORAGE_KEY, password);
        setAuthed(true);
      }
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setPassword("");
  };

  if (!mounted) return null;

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: C.cream,
        }}
      >
        <form
          onSubmit={submit}
          style={{
            background: C.white,
            padding: 40,
            borderRadius: 16,
            border: "1px solid rgba(197,213,192,0.3)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            width: "100%",
            maxWidth: 380,
          }}
        >
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
              fontSize: 24,
              fontWeight: 700,
              color: C.charcoal,
              margin: "0 0 24px 0",
            }}
          >
            Sign in
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 8,
              border: `1px solid ${C.sage}`,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              marginBottom: 12,
              background: C.cream,
            }}
          />
          {error && (
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "#A85555",
                marginBottom: 12,
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={busy || !password}
            style={{
              width: "100%",
              padding: "12px 24px",
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
              opacity: busy || !password ? 0.6 : 1,
            }}
          >
            {busy ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 90,
        }}
      >
        <button
          onClick={logout}
          style={{
            background: C.white,
            border: `1px solid ${C.sage}`,
            borderRadius: 50,
            padding: "8px 16px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: C.warmGray,
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          Sign out
        </button>
      </div>
    </>
  );
}
