const express = require("express");
const fetch = require("node-fetch");
const app = express();

const JSON_URL = "https://pez8.up.railway.app/";

function extractStations(groups, parentGroup = "") {
  let entries = [];
  groups.forEach(group => {
    if (group.stations) {
      group.stations.forEach(station => {
        entries.push({
          name: station.name,
          url: station.url,
          logo: station.image,
          group: parentGroup || group.name
        });
      });
    }
    if (group.groups) {
      entries = entries.concat(extractStations(group.groups, group.name));
    }
    if (group.url) {
      entries.push({
        name: group.name,
        url: group.url,
        logo: group.image,
        group: parentGroup || group.name
      });
    }
  });
  return entries;
}

app.get("/", (req, res) => {
  res.send("Ciao! Vai su /playlist.w3u per ottenere la playlist aggiornata.");
});

app.get("/playlist.w3u", async (req, res) => {
  try {
    const response = await fetch(JSON_URL);
    const data = await response.json();
    let m3u = "#EXTM3U\n";
    const entries = extractStations(data.groups);

    entries.forEach(entry => {
      m3u += `#EXTINF:-1 tvg-logo="${entry.logo}" group-title="${entry.group}",${entry.name}\n${entry.url}\n`;
    });

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=playlist.w3u");
    res.send(m3u);
  } catch (err) {
    res.status(500).send("Errore nella generazione della playlist");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server avviato sulla porta " + PORT);
});