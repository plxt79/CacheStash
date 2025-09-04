const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/plxt79/database/git/trees/main?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const data = await response.json();

    if (!data.tree) {
      return res.status(500).send('<h1>Error: Invalid tree response</h1>');
    }

    const files = data.tree.filter(
      (item) => item.path.startsWith('Game ZIPs/') && item.type === 'blob'
    );

    const count = files.length;
    const readable = count >= 1000 ? `${(count / 1000).toFixed(1)}K` : `${count}`;

    const wantsJson = req.query.json === '1' || req.headers.accept?.includes('application/json');

    if (wantsJson) {
      return res.status(200).json({ count: readable, truecount: count });
    }

    res.setHeader('Content-Type', 'text/html');
    return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="author" content="plxt79">
<title>File Count</title>
<link rel="shortcut icon" href="/icon.png" type="image/x-icon">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
  :root {
    --sidebar-width: 250px;
    --primary-color: #435dd8;
    --bg-color: #000000;
    --sidebar-bg: #121212;
    --content-bg: #20202040;
    --border-color: #404040DD;
    --text-color: #FFFFFF;
    --link-color: #0085C5;
    --hover-color: #435dd8;
    --signup-badge: #ffcc00;
  }
  * { font-family: 'Poppins', sans-serif; color: var(--text-color); margin:0; padding:0; box-sizing:border-box; }
  body { background-color: var(--bg-color); min-height:100vh; }
  .main-content { margin-left: 0; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
  .file-count-box { display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: var(--content-bg); border:1px solid var(--border-color); padding:40px; border-radius:10px; }
  .file-count { font-size:4rem; font-weight:700; background:linear-gradient(45deg, var(--primary-color), #00ca4e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:10px; }
  .file-count::selection { background: none; -webkit-text-fill-color: #fff; }
  .file-label { font-size:1.2rem; color:#ccc; }
</style>
</head>
<body>
  <div class="main-content">
    <div class="file-count-box">
      <div class="file-count" id="file-count">📂 ${readable}</div>
      <div class="file-label" id="file-label">Exact count: ${count}</div>
    </div>
  </div>

  <script>
    async function getFileCount() {
      try {
        const res = await fetch('/api/filecount?json=1');
        const data = await res.json();
        document.getElementById('file-count').textContent = '📂 ' + data.count;
        document.getElementById('file-label').textContent = 'Exact count: ' + data.truecount;
      } catch {
        document.getElementById('file-count').textContent = 'Error';
        document.getElementById('file-label').textContent = '';
      }
    }
    getFileCount();
    setInterval(getFileCount, 5000);
  </script>
</body>
</html>
`);
  } catch (error) {
    console.error(error);
    return res.status(500).send('<h1>Server error</h1>');
  }
}