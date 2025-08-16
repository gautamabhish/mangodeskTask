export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST requests allowed" });
    }
  
    const { transcript, instruction } = req.body;
    const apiKey = process.env.VITE_GEM; // Gemini API key
  
    if (!apiKey) {
      return res.status(500).json({ error: "API key missing" });
    }
    if (!transcript?.trim()) {
      return res.status(400).json({ error: "Transcript required" });
    }
  
    const prompt = `
  You are a precise meeting-notes summarizer.
  
  Instruction: ${instruction || "Summarize the transcript clearly and concisely."}
  
  Transcript:
  ${transcript}
  
  Return a structured summary in markdown format.
  Always include an "Action Items" section if applicable.
  Keep it professional and under 200 words.
    `;
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
  
      const data = await response.json();
      const summary =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response from Gemini";
  
      res.status(200).json({ summary });
    } catch (error) {
      console.error("Summarize API error:", error);
      res.status(500).json({ error: "Summarization failed" });
    }
  }
  