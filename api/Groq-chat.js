// api/groq-chat.js — Proxy seguro para Groq en Vercel
// La GROQ_API_KEY vive en Variables de Entorno de Vercel, nunca en el código

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "GROQ_API_KEY no configurada en Vercel" });
  }

  try {
    const { messages, model, max_tokens, temperature, system } = req.body;

    // Armar mensajes: si viene system, lo ponemos como primer mensaje
    const finalMessages = system
      ? [{ role: "system", content: system }, ...messages]
      : messages;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || "llama-3.3-70b-versatile",
          max_tokens: max_tokens || 1024,
          temperature: temperature || 0.7,
          messages: finalMessages,
        }),
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res
        .status(response.status)
        .json({ error: err.error?.message || "Error de Groq" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
