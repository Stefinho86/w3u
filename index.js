const express = require("express");
const fetch = require("node-fetch");
const app = express();

const JSON_URL = "https://pez8.up.railway.app/";

app.get("/", (req, res) => {
  res.send("Ciao! Vai su /playlist.w3u per ottenere la playlist in JSON identica all’originale.");
});

app.get("/playlist.w3u", async (req, res) => {
  try {
    const response = await fetch(JSON_URL);
    const json = await response.json();

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=playlist.w3u");
    res.send(JSON.stringify(json, null, 2)); // Indenta per leggibilità (opzionale)
  } catch (err) {
    res.status(500).send("Errore nel recupero del JSON");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});