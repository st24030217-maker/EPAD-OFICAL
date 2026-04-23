export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Falta el prompt" });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();
    raw = raw.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/, "$1").trim();

    const plan = JSON.parse(raw);
    return res.status(200).json({ plan });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
