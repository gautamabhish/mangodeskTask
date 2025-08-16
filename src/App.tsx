// @ts-nocheck
import React, { useState } from "react";

const MeetingNotesPage = () => {
  const [transcript, setTranscript] = useState("");
  const [instruction, setInstruction] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  // --- Call Summarize API ---
  const generateSummary = async () => {
    if (!transcript.trim()) {
      setStatus("⚠️ Please provide a transcript first.");
      return;
    }
    setLoading(true);
    setStatus("Generating summary...");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, instruction }),
      });

      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setStatus("✅ Summary generated!");
      } else {
        setStatus("❌ Failed to generate summary.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error generating summary.");
    } finally {
      setLoading(false);
    }
  };

  // --- Call Email API ---
  const sendEmail = async () => {
    if (!email.trim() || !summary.trim()) {
      setStatus("⚠️ Provide email and summary before sending.");
      return;
    }

    setLoading(true);
    setStatus("Sending email...");

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: [email],
          subject: "Meeting Notes Summary",
          body: summary,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("📧 Email sent successfully!");
      } else {
        setStatus("❌ Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">AI Meeting Notes Summarizer</h1>

      {/* Transcript input */}
      <textarea
        placeholder="Paste transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={8}
        className="w-full max-w-2xl p-2 border rounded mb-3"
      />

      {/* Instruction input */}
      <input
        placeholder="Custom instruction (e.g., Summarize in bullet points)"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        className="w-full max-w-2xl p-2 border rounded mb-3"
      />

      <button
        onClick={generateSummary}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        {loading ? "Working..." : "Generate Summary"}
      </button>

      {/* Editable Summary */}
      {summary && (
        <>
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={8}
            className="w-full max-w-2xl p-2 border rounded mb-3"
          />
        </>
      )}

      {/* Email input */}
      {summary && (
        <div className="w-full max-w-2xl">
          <input
            type="email"
            placeholder="Recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <button
            onClick={sendEmail}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Sending..." : "Send via Email"}
          </button>
        </div>
      )}

      {/* Status messages */}
      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </div>
  );
};

export default MeetingNotesPage;
