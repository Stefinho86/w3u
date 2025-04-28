const express = require("express");
const fetch = require("node-fetch");
const app = express();

const JSON_URL = "https://pez8.up.railway.app/";

app.get("/", (req, res) => {
  res.send('Vai su <a href="/playlist.w3u">/playlist.w3u</a> per vedere il JSON.');
});

// Mostra il JSON ben formattato, senza download
app.get("/playlist.w3u", async (req, res) => {
  try {
    const response = await fetch(JSON_URL);
    const json = await response.json();

    // Visualizza in pagina, formattato e colorato
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`
      <html>
        <head>
          <title>playlist.w3u - JSON Viewer</title>
          <style>
            body { background: #222; color: #eee; font-family: monospace; padding: 2em; }
            pre { background: #181818; padding: 1em; border-radius: 8px; overflow-x: auto; font-size: 1.1em; }
            a { color: #66f; }
          </style>
        </head>
        <body>
          <h2>playlist.w3u (JSON)</h2>
          <pre>${escapeHtml(JSON.stringify(json, null, 2))}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Errore nel recupero del JSON");
  }
});

// Funzione per evitare problemi di XSS (escaping HTML)
function escapeHtml(str) {
  return str.replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;"
    })[s];
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});