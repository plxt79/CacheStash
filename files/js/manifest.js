function showToast(message, backgroundColor = "#333", duration = 1500, textColor = "#000") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.backgroundColor = backgroundColor;
    toast.style.color = textColor;

    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), duration);
}

async function generate() {
    const inputEl = document.getElementById("AppIDInput");
    const input = inputEl.value.trim();

    const urlMatch = input.match(/^https?:\/\/store\.steampowered\.com\/app\/(\d+)/);
    const isNumeric = /^\d+$/.test(input);
    const AppID = urlMatch ? urlMatch[1] : (isNumeric ? input : null);

    if (!AppID) {
        showToast("Please enter a valid AppID or Steam URL.", "#FF0000", 1500, "#fff");
        inputEl.style.borderColor = "#FF0000";
        setTimeout(() => { inputEl.style.borderColor = ""; }, 1500);
        return;
    }

    const btn = document.getElementById('genAppID');
    btn.disabled = true;
    btn.textContent = "Generating...";

    try {
        const apiRes = await fetch(`/api/getSignedUrl?appid=${encodeURIComponent(AppID)}`);
        const data = await apiRes.json();
        if (!data.url) throw new Error("Failed to get signed URL");

        const response = await fetch(data.url);
        if (!response.ok) {
            if (response.status === 404) return showToast("AppID unavailable", "#FF0000", 1500, "#fff");
            if (response.status === 403) return showToast("Download link expired or invalid", "#FF0000", 1500, "#fff");
            throw new Error(`HTTP error ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('zip')) {
            return showToast("AppID unavailable", "#FF0000", 1500, "#fff");
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${AppID}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        showToast(`Generated App: ${AppID}`, "#00ca4e");

        try {
            await fetch("/api/logDownload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appid: AppID, ip: userIP })
            });
        } catch (e) {

        }

    } catch (err) {
        showToast(err.message, "#FF0000", 1500, "#fff");
    } finally {
        btn.disabled = false;
        btn.textContent = "Submit";
    }
}

function home() { window.location.href = "/"; }
function requestpage() { window.location.href = "/manifest/request"; }

async function getFileCount() {
    try {
        const res = await fetch('/api/filecount?json=1');
        const data = await res.json();
        document.getElementById("file-count").textContent = data.count;
    } catch {
        document.getElementById("file-count").textContent = "Error";
    }
}
getFileCount();
setInterval(getFileCount, 5000);

document.getElementById("AppIDInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !document.getElementById('genAppID').disabled) {
        generate();
    }
});

document.addEventListener('keydown', e => {
    const key = e.key.toUpperCase();
    if (key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(key))) {
        e.preventDefault();
        showToast("Action blocked", "#FF0000", 1500, "#fff");
    }
});

document.addEventListener('contextmenu', e => {
    e.preventDefault();
    showToast("Right-click disabled", "#FF0000", 1500, "#fff");
});

if ((/android|iphone|ipad|iPod|blackberry|iemobile|opera mini/i.test(navigator.userAgent)) ||
    (navigator.maxTouchPoints > 1 || Math.max(window.innerWidth, window.innerHeight) <= 800)) {
    document.querySelector('.mobile-block').style.display = 'flex';
}