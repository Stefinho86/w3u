const express = require("express");
const fetch = require("node-fetch");
const app = express();

const JSON_URL = "https://pez8.up.railway.app/";

app.get("/", (req, res) => {
  res.send("Vai su /playlist.w3u per scaricare il file originale in formato JSON.");
});

app.get("/playlist.w3u", async (req, res) => {
  try {
    const response = await fetch(JSON_URL);
    const json = await response.json();

    // Header per scaricare come file .w3u (ma formato JSON puro!)
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=playlist.w3u");
    res.send(JSON.stringify(json, null, 2)); // Formattazione leggibile, opzionale
  } catch (err) {
    res.status(500).send("Errore nel recupero del JSON");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});