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
        embeds: [{
          title: "📥 Download Log",
          color: 0x5865F2,
          fields: [
            { name: "AppID", value: appid, inline: true },
            { name: "IP Address", value: ip, inline: true }
          ],
          timestamp: new Date().toISOString()
        }]
      })
    });
  } catch (err) {

  }
  res.status(200).json({ success: true });
}