// api/generar-planeacion.js
// Usa Groq (Llama 3.3) en lugar de Gemini — la API key vive en Vercel env vars

const SYSTEM_INSTRUCTION = `
Eres un experto en didáctica y diseño curricular del sistema educativo mexicano,
especializado en el Plan de Estudios 2022 de la Nueva Escuela Mexicana (NEM).
Genera planeaciones didácticas pedagógicamente sólidas, alineadas a los campos
formativos NEM, con lenguaje profesional en español.
REGLA CRÍTICA: Responde ÚNICAMENTE con el JSON solicitado. Sin texto adicional,
sin bloques markdown, sin explicaciones fuera del JSON.
`.trim();

export default async function handler(req, res) {
  // 1. Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // 2. Extraer el prompt
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  // 3. Validar Token de Firebase
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado. Token requerido." });
  }
  const idToken = authHeader.split("Bearer ")[1];

  try {
    // 4. Verificar el token con Firebase Auth REST API
    const FIREBASE_API_KEY = "AIzaSyBn_s9pZ2hiKvcldj370DwUxtQdZFDQsUM";
    const PROJECT_ID = "epad-10bea";

    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.users?.length) {
      return res.status(401).json({ error: "Token inválido o expirado." });
    }
    const uid = verifyData.users[0].localId;

    // 5. Verificar suscripción en Firestore
    const firestoreRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/suscripciones/${uid}`,
      { headers: { Authorization: `Bearer ${idToken}` } },
    );
    const firestoreData = await firestoreRes.json();

    if (!firestoreRes.ok || !firestoreData.fields) {
      return res
        .status(403)
        .json({ error: "No se encontró una suscripción válida." });
    }

    const estado = firestoreData.fields.estado?.stringValue;
    if (estado !== "activa" && estado !== "trial") {
      return res
        .status(403)
        .json({ error: "Suscripción inactiva o expirada." });
    }

    if (estado === "trial") {
      const trialFinStr = firestoreData.fields.trial_fin?.timestampValue;
      if (!trialFinStr || new Date(trialFinStr) < new Date()) {
        return res
          .status(403)
          .json({ error: "Tu periodo de prueba ha finalizado." });
      }
    }
  } catch (err) {
    console.error("Error validando token o suscripción:", err.message);
    return res
      .status(500)
      .json({ error: "Error interno al validar autorización." });
  }

  try {
    // 6. Llamar a Groq — la API key viene de las variables de entorno de Vercel
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 2000,
          temperature: 0.7,
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: prompt },
          ],
        }),
      },
    );

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      console.error("Groq error:", errData);
      return res.status(502).json({ error: "Error al contactar Groq" });
    }

    // 7. Extraer el texto de la respuesta
    const data = await groqRes.json();
    let raw = data.choices?.[0]?.message?.content || "{}";

    // 8. Limpiar posibles bloques markdown
    raw = raw
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    // 9. Extraer el JSON aunque venga con texto alrededor
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("La respuesta no contiene JSON válido");

    const plan = JSON.parse(match[0]);

    // 10. Devolver al navegador
    return res.status(200).json({ ok: true, plan });
  } catch (err) {
    console.error("Error interno:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
