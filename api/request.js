export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { appid } = req.body;
    if (!appid) return res.status(400).json({ error: 'Missing appid' });

    const filename = `${appid}.zip`;
    const githubUrl = `https://raw.githubusercontent.com/plxt79/database/main/Game%20ZIPs/${filename}`;

    try {
        const headRes = await fetch(githubUrl, { method: 'HEAD' });
        if (headRes.status === 200) {
            return res.status(200).json({ message: 'Game already available.' });
        }
    } catch (e) {
        console.error("Failed to check GitHub file:", e);
        return res.status(500).json({ error: 'File check failed' });
    }

    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown";

    const payload = {
        content: '<@790459219215646720>',
        embeds: [
            {
                title: `📦 New Game Request`,
                color: 0x5865F2,
                fields: [
                    { name: "AppID", value: `\`${appid}\``, inline: true },
                    { name: "🌐 IP", value: `\`${ip}\`` }
                ],
                timestamp: new Date().toISOString()
            }
        ]
    };

    const webhookURL = process.env[req.url.includes('update') ? 'UPDATE_WEBHOOK_URL' : 'REQUEST_WEBHOOK_URL'];

    try {
        const discordRes = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!discordRes.ok) throw new Error("Discord webhook failed");

        return res.status(200).json({ message: `Game Request sent!` });
    } catch (e) {
        console.error("Webhook error:", e);
        return res.status(500).json({ error: 'Webhook failed' });
    }
}
