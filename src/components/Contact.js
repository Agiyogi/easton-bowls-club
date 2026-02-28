"use client";

import { useState } from "react";
import { COLORS as C, WEB3FORMS_KEY } from "../data/constants";
import { Section, SectionTitle } from "./Shared";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "sent" | "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Easton Bowls Club — New Website Enquiry",
          from_name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginBottom: 16,
    fontFamily: "'DM Sans'",
    fontSize: 14,
    border: "1px solid rgba(197,213,192,0.4)",
    borderRadius: 10,
    background: C.cream,
    color: C.charcoal,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <Section id="contact" bg={C.cream}>
      <SectionTitle
        label="Get in Touch"
        title="Contact Us"
        subtitle="Interested in joining or just want to find out more? Send us a message and we'll get back to you."
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}
        className="contact-grid"
      >
        {/* Left column */}
        <div>
          <div
            style={{
              background: C.white,
              borderRadius: 16,
              padding: 32,
              border: "1px solid rgba(197,213,192,0.2)",
              marginBottom: 24,
            }}
          >
            <h3
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: 18,
                fontWeight: 700,
                color: C.charcoal,
                marginBottom: 20,
              }}
            >
              Get in Touch
            </h3>

            {/* Contact name */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 14,
                fontFamily: "'DM Sans'",
                fontSize: 15,
                color: C.charcoal,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.sageDeep}
                strokeWidth="1.5"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
              <span>Mike Cattermole</span>
            </div>

            {/* Phone */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 14,
                fontFamily: "'DM Sans'",
                fontSize: 15,
                color: C.charcoal,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.sageDeep}
                strokeWidth="1.5"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.68 2.34a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0122 16.92z" />
              </svg>
              <a
                href="tel:07970450251"
                style={{ color: C.charcoal, textDecoration: "none" }}
              >
                07970 450251
              </a>
            </div>

            {/* Facebook */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 14,
                fontFamily: "'DM Sans'",
                fontSize: 15,
                color: C.charcoal,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={C.sageDeep}>
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
              <a
                href="https://www.facebook.com/EastonBowlsClub"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: C.sageDeep,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                @EastonBowlsClub
              </a>
            </div>

            {/* Address */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                fontFamily: "'DM Sans'",
                fontSize: 15,
                color: C.charcoal,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.sageDeep}
                strokeWidth="1.5"
                style={{ flexShrink: 0, marginTop: 2 }}
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span>
                Easton Bowls Club, School Lane, Easton, Suffolk IP13 0ED
              </span>
            </div>
          </div>

          <div
            style={{
              background: C.white,
              borderRadius: 16,
              padding: 32,
              border: "1px solid rgba(197,213,192,0.2)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: 18,
                fontWeight: 700,
                color: C.charcoal,
                marginBottom: 16,
              }}
            >
              How to Find Us
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans'",
                fontSize: 14,
                color: C.warmGray,
                lineHeight: 1.7,
                marginBottom: 16,
              }}
            >
              We&rsquo;re located on the plateau above the village, just off
              School Lane next to the cricket ground. Look for the sign to the
              Cemetery &amp; Bowls Club. Three miles south of Framlingham on the
              B1078.
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4893.099109562193!2d1.33553164863528!3d52.178882766810936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d99b514cc4ab71%3A0x1afc31d802ae70a0!2sEaston%20Bowls%20Club!5e0!3m2!1sen!2suk!4v1772291420929!5m2!1sen!2suk"
              width="100%"
              height="200"
              style={{ border: "none", borderRadius: 12 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Easton Bowls Club location"
            />
          </div>
        </div>

        {/* Right column — form */}
        <div>
          <div
            style={{
              background: C.white,
              borderRadius: 16,
              padding: 32,
              border: "1px solid rgba(197,213,192,0.2)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: 18,
                fontWeight: 700,
                color: C.charcoal,
                marginBottom: 24,
              }}
            >
              Send Us a Message
            </h3>

            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  style={{ marginBottom: 16 }}
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    stroke={C.sageDeep}
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  <path
                    d="M15 24l6 6 12-12"
                    stroke={C.sageDeep}
                    strokeWidth="2.5"
                    fill="none"
                  />
                </svg>
                <div
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.charcoal,
                    marginBottom: 8,
                  }}
                >
                  Message Sent
                </div>
                <p
                  style={{
                    fontFamily: "'DM Sans'",
                    fontSize: 14,
                    color: C.warmGray,
                    lineHeight: 1.6,
                  }}
                >
                  Thank you for your enquiry. We&rsquo;ll get back to you as
                  soon as we can.
                </p>
                <button
                  onClick={() => setStatus(null)}
                  style={{
                    marginTop: 20,
                    fontFamily: "'DM Sans'",
                    fontSize: 13,
                    fontWeight: 500,
                    color: C.sageDeep,
                    background: "none",
                    border: `1px solid ${C.sage}`,
                    padding: "10px 24px",
                    borderRadius: 50,
                    cursor: "pointer",
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  style={inputStyle}
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                  style={inputStyle}
                />
                <textarea
                  required
                  placeholder="Your message..."
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, message: e.target.value }))
                  }
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    marginBottom: 20,
                  }}
                />

                {status === "error" && (
                  <div
                    style={{
                      fontFamily: "'DM Sans'",
                      fontSize: 13,
                      color: "#8A4A4A",
                      background: "rgba(240,180,180,0.15)",
                      padding: "10px 16px",
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  >
                    Something went wrong. Please try again or contact us via the
                    parish council website.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    fontFamily: "'DM Sans'",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    background: status === "sending" ? C.sageDark : C.sageDeep,
                    color: C.cream,
                    border: "none",
                    borderRadius: 50,
                    cursor: status === "sending" ? "wait" : "pointer",
                    opacity: status === "sending" ? 0.7 : 1,
                    transition: "all 0.3s",
                  }}
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </Section>
  );
}
