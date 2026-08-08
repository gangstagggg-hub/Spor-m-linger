const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const store = getStore({
    name: "gedo-tralle",
    siteID: process.env.BLOBS_SITE_ID,
    token: process.env.BLOBS_TOKEN
  });
  const NOKKEL = "malinger";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod === "GET") {
    try {
      const data = await store.get(NOKKEL, { type: "json" });
      return { statusCode: 200, headers, body: JSON.stringify(data || {}) };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Kunne ikke hente data" }) };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");
      await store.setJSON(NOKKEL, body);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Kunne ikke lagre data" }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Metode ikke tillatt" }) };
};
