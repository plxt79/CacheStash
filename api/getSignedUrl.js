import crypto from "crypto";

const ALLOWED_DOMAINS = ["https://blackbay.vercel.app", "https://beta-blackbay.vercel.app"];

export default function handler(req, res) {
  const { appid } = req.query;
  if (!appid) return res.status(400).json({ error: "Missing parameters" });

  const origin = req.headers.origin || req.headers.referer || "";
  const isAllowed = ALLOWED_DOMAINS.some((domain) => origin.startsWith(domain));

  if (!isAllowed) {
    return res.status(403).json({ error: "Unauthorized domain" });
  }

  const secret = process.env.SIGNING_SECRET;
  const expiry = Date.now() + 30 * 1000;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${appid}:${expiry}`);
  const token = hmac.digest("hex");

  const signedUrl = `https://cdn.farhad-0ed.workers.dev/?appid=${appid}&expiry=${expiry}&token=${token}`;

  res.status(200).json({ url: signedUrl });
}