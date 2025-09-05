export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { appid, ip } = req.body;

  try {
    await fetch(process.env.DOWNLOAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "blackbay-logger",
        embeds: [{
          title: "📥 Download Log",
          color: 5814783,
          fields: [
            { name: "AppID", value: appid, inline: true },
            { name: "IP Address", value: ip, inline: true },
            { name: "Timestamp", value: new Date().toLocaleString(), inline: false }
          ]
        }]
      })
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to log to Discord" });
  }
}