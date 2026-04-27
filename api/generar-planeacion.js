// api/generar-planeacion.js

// System Instruction: define la "personalidad pedagógica" de Gemini.
// Va separado del prompt del usuario para seguir las mejores prácticas
// de la API: el system instruction es estático y se reutiliza en cada llamada.
const SYSTEM_INSTRUCTION = `
Eres un experto en didáctica y diseño curricular del sistema educativo mexicano,
especializado en el Plan de Estudios 2022 de la Nueva Escuela Mexicana (NEM).
Genera planeaciones didácticas pedagógicamente sólidas, alineadas a los campos
formativos NEM, con lenguaje profesional en español.
REGLA CRÍTICA: Responde ÚNICAMENTE con el JSON solicitado. Sin texto adicional,
sin bloques markdown, sin explicaciones fuera del JSON.
`.trim();

// Esta función es la que Vercel ejecuta cuando alguien llama al endpoint.
// req = lo que manda el navegador | res = lo que devuelves tú
export default async function handler(req, res) {
  // 1. Solo aceptar POST (si alguien entra directo al URL desde el browser, lo bloqueamos)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // 2. Extraer los datos que mandó el formulario
  const { nivel, materia, payload } = req.body;
  if (!nivel || !materia || !payload) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  // 3. Construir el prompt dinámico con los datos del docente
  const userPrompt = buildPrompt(nivel, materia, payload);

  try {
    // 4. Llamar a Gemini — la API Key viene de las variables de entorno de Vercel
    //    process.env.GEMINI_API_KEY nunca llega al navegador
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.75, // 0 = muy literal | 1 = muy creativo
            maxOutputTokens: 2000, // suficiente para una planeación completa
          },
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini respondió con error:", errText);
      return res.status(502).json({ error: "Error al contactar Gemini" });
    }

    // 5. Extraer el texto de la respuesta de Gemini
    const data = await response.json();
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // 6. Limpiar: Gemini a veces envuelve el JSON en bloques ```json ... ```
    raw = raw
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    // 7. Extraer solo el objeto JSON aunque venga con texto alrededor
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("La respuesta no contiene JSON válido");

    const plan = JSON.parse(match[0]);

    // 8. Devolver el plan al navegador
    return res.status(200).json({ ok: true, plan });
  } catch (err) {
    console.error("Error interno:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// buildPrompt: construye el mensaje específico del docente para esta sesión.
// Separarlo del system instruction permite reutilizar la "personalidad" del
// modelo sin repetirla en cada llamada.
// ─────────────────────────────────────────────────────────────────────────────
function buildPrompt(nivel, materia, p) {
  const acts =
    (p.actividades || [])
      .map(
        (a, i) =>
          `  ${i + 1}. [${a.momento}] (${a.tiempo || "—"}): ${a.descripcion || "sin descripción"} — Recursos: ${a.recursos || "no especificados"}`,
      )
      .join("\n") ||
    "  (Genera una secuencia completa apropiada al nivel y campo)";

  return `
Genera una planeación didáctica con estos datos:

- Nivel educativo: ${nivel}
- Campo formativo / Materia: ${materia}
- Docente: ${p.docente || "No especificado"}
- Grado / Grupo: ${p.grado || "No especificado"}
- Ciclo escolar: ${p.ciclo || "2025-2026"}
- Período: ${p.periodo || "No especificado"}

PROPÓSITO DEL DOCENTE:
${p.proposito || "Desarrollar aprendizajes pertinentes al campo formativo."}

ACTIVIDADES QUE YA PLANEÓ EL DOCENTE:
${acts}

EVALUACIÓN: ${p.evalTipo || "Observación directa"} / ${p.evalInst || "Por definir"}
ADECUACIONES: ${p.adecuaciones || "Sugiere adecuaciones inclusivas generales"}
NOTAS DEL DOCENTE: ${p.notas || "Ninguna"}

Responde ÚNICAMENTE con este JSON:
{
  "proposito_enriquecido": "string",
  "ejes_articuladores": ["string", "string"],
  "secuencia": [
    {"momento":"Inicio",     "tiempo":"20 min","actividad":"string","recursos":"string"},
    {"momento":"Desarrollo", "tiempo":"40 min","actividad":"string","recursos":"string"},
    {"momento":"Cierre",     "tiempo":"20 min","actividad":"string","recursos":"string"}
  ],
  "evaluacion": {
    "tipo": "string",
    "instrumento": "string",
    "indicadores": ["string","string","string"]
  },
  "adecuaciones_sugeridas": "string",
  "reflexion_docente": "string"
}`.trim();
}
