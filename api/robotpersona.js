export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { traits } = req.body;

  const apiKey = process.env.VITE_GEM;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key missing' });
  }

const prompt = `You are a robotic identity generator designed for a professional setting like LinkedIn.

Create a short, quirk, and technical introduction for a robot based on these traits: ${traits.join(', ')}.

Include a creative robot name that subtly nods to the user's name (username is included in the traits).

The intro should feel like a  professional bot with scientific quirks. It should blend humor with relevance — like:
-Users traits should be reflected in a robot persona.
-Use a friendly, yet slightly robotic tone.
-Use technical jargon where appropriate, but keep it accessible.

End with a clever, geeky farewell line that leaves a lasting impression.

Only return the final intro paragraph — no bullet points, options, or explanations. Keep it under 70 words. Make it feel like a personal brand in robot form.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const data = await response.json();
    const robotIntro = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response from Gemini';

    res.status(200).json({ isRobot: true, robotIntro });
  } catch (error) {
    console.error(error);
    res.status(500).json({ isRobot: false, robotIntro: 'Gemini failed to respond.' });
  }
};
