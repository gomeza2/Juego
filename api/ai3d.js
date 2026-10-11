const { timingSafeEqual } = require("crypto");
const MESHY_API = "https://api.meshy.ai/openapi/v2/text-to-3d";

function isAuthorized(req, expected) {
  const supplied = String(req.headers["x-nexo-access"] || "");
  if (!expected || !supplied) return false;
  const a = Buffer.from(supplied, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 12000) throw new Error("Request body is too large.");
  }
  return raw ? JSON.parse(raw) : {};
}

async function meshyRequest(url, apiKey, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {})
    },
    cache: "no-store"
  });
  const text = await response.text();
  let payload = {};
  try { payload = text ? JSON.parse(text) : {}; }
  catch { payload = { message: "The provider returned an unreadable response." }; }
  if (!response.ok) {
    const status = response.status === 401 ? 502 : response.status;
    const message = response.status === 402
      ? "The 3D provider reports that the account has no available credits."
      : response.status === 429
      ? "The 3D provider is rate-limiting requests. Try again later."
      : "The 3D provider could not complete the request.";
    const error = new Error(message);
    error.status = status;
    throw error;
  }
  return payload;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const apiKey = process.env.MESHY_API_KEY;
  const accessCode = process.env.NEXO_AI_ACCESS_CODE;
  if (!accessCode) {
    return sendJson(res, 503, {
      error: "Falta configurar NEXO_AI_ACCESS_CODE como variable privada del servidor."
    });
  }
  if (!isAuthorized(req, accessCode)) {
    return sendJson(res, 401, { error: "Código de acceso a IA incorrecto." });
  }
  if (!apiKey) {
    return sendJson(res, 503, {
      error: "IA 3D todavía no está configurada en el servidor. Definí la variable privada MESHY_API_KEY."
    });
  }

  try {
    if (req.method === "POST") {
      const body = await readBody(req);
      if (body.action === "generate") {
        const prompt = String(body.prompt || "").trim();
        if (!prompt) return sendJson(res, 400, { error: "Escribí una descripción del modelo." });
        if (prompt.length > 800) return sendJson(res, 400, { error: "La descripción no puede superar los 800 caracteres." });
        const task = await meshyRequest(MESHY_API, apiKey, {
          method: "POST",
          body: JSON.stringify({
            mode: "preview",
            prompt,
            ai_model: "meshy-7.1",
            target_formats: ["glb"],
            target_polycount: 30000,
            should_remesh: true,
            moderation: true
          })
        });
        if (!task.result) return sendJson(res, 502, { error: "El proveedor no devolvió un identificador de tarea." });
        return sendJson(res, 202, { taskId: task.result, stage: "preview" });
      }

      if (body.action === "refine") {
        const previewTaskId = String(body.previewTaskId || "");
        if (!/^[a-zA-Z0-9-]{8,100}$/.test(previewTaskId)) {
          return sendJson(res, 400, { error: "El identificador del modelo preliminar no es válido." });
        }
        const task = await meshyRequest(MESHY_API, apiKey, {
          method: "POST",
          body: JSON.stringify({
            mode: "refine",
            preview_task_id: previewTaskId,
            ai_model: "meshy-7.1",
            enable_pbr: true,
            texture_resolution: "2k",
            target_formats: ["glb"],
            moderation: true
          })
        });
        if (!task.result) return sendJson(res, 502, { error: "El proveedor no devolvió una tarea de texturizado." });
        return sendJson(res, 202, { taskId: task.result, stage: "refine" });
      }

      return sendJson(res, 400, { error: "Acción no reconocida." });
    }

    if (req.method === "GET") {
      const query = req.query || {};
      const taskId = String(query.id || "");
      if (!/^[a-zA-Z0-9-]{8,100}$/.test(taskId)) {
        return sendJson(res, 400, { error: "El identificador de tarea no es válido." });
      }
      const task = await meshyRequest(`${MESHY_API}/${encodeURIComponent(taskId)}`, apiKey);
      const status = String(task.status || "UNKNOWN");
      if (query.download === "1") {
        if (status !== "SUCCEEDED" || !task.model_urls || !task.model_urls.glb) {
          return sendJson(res, 409, { error: "El modelo GLB todavía no está disponible." });
        }
        const modelResponse = await fetch(task.model_urls.glb, { cache: "no-store" });
        if (!modelResponse.ok) return sendJson(res, 502, { error: "No se pudo descargar el modelo generado." });
        const length = Number(modelResponse.headers.get("content-length") || 0);
        if (length > 100 * 1024 * 1024) return sendJson(res, 413, { error: "El modelo supera el límite de 100 MB." });
        const bytes = Buffer.from(await modelResponse.arrayBuffer());
        if (bytes.length > 100 * 1024 * 1024) return sendJson(res, 413, { error: "El modelo supera el límite de 100 MB." });
        res.statusCode = 200;
        res.setHeader("Content-Type", "model/gltf-binary");
        res.setHeader("Content-Disposition", 'attachment; filename="nexo-ai-model.glb"');
        res.setHeader("Content-Length", String(bytes.length));
        return res.end(bytes);
      }
      return sendJson(res, 200, {
        status,
        progress: Number(task.progress || 0),
        error: status === "FAILED" || status === "CANCELED"
          ? "El proveedor no pudo terminar este modelo. Probá otra descripción."
          : null
      });
    }

    res.setHeader("Allow", "GET, POST");
    return sendJson(res, 405, { error: "Método no permitido." });
  } catch (error) {
    console.error("NEXO AI endpoint error:", error && error.message ? error.message : "unknown");
    return sendJson(res, error.status || 502, {
      error: error.message || "No se pudo completar la solicitud de generación 3D."
    });
  }
};
