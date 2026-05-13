const CONTACT_INBOX = "hello@buildwebsites.pt";

export async function handler(event) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Method not allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Invalid JSON" }),
    };
  }

  const nome = String(body.nome ?? "").trim();
  const email = String(body.email ?? "").trim();
  const tipo = String(body.tipo ?? "").trim();
  const mensagem = String(body.mensagem ?? "").trim();

  if (!nome || !email || !mensagem) {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Campos em falta." }),
    };
  }

  const subject = `[BuildWeb] Pedido de orçamento — ${tipo || "geral"}`;
  const lines = [`Nome: ${nome}`, `Email: ${email}`];
  if (tipo) lines.push(`Tipo de projeto: ${tipo}`);
  lines.push("", mensagem);
  const messageBody = lines.join("\n");

  const params = new URLSearchParams();
  params.set("name", nome);
  params.set("email", email);
  params.set("message", messageBody);
  params.set("_subject", subject);

  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };
  if (siteUrl) {
    headers.Origin = siteUrl;
    headers.Referer = `${siteUrl.replace(/\/$/, "")}/`;
  }

  const r = await fetch(`https://formsubmit.co/ajax/${CONTACT_INBOX}`, {
    method: "POST",
    headers,
    body: params.toString(),
  });

  const text = await r.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { success: false, message: "Resposta inválida do FormSubmit." };
  }

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
}
