function showToast(message, backgroundColor = "#333", duration = 1500, textColor = "#000") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.backgroundColor = backgroundColor;
    toast.style.color = textColor;

    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), duration);
}

function extractAppID(input) {
    const urlMatch = input.match(/^https?:\/\/store\.steampowered\.com\/app\/(\d+)/);
    const isNumeric = /^\d+$/.test(input);
    return urlMatch ? urlMatch[1] : (isNumeric ? input : null);
}

async function request() {
    const inputEl = document.getElementById("AppIDInput");
    const input = inputEl.value.trim();

    const appid = extractAppID(input);

    if (!appid) {
        showToast('Please enter a valid AppID or Steam URL.', '#FF0000', 1500, "#fff");
        inputEl.style.borderColor = '#FF0000';
        setTimeout(() => inputEl.style.borderColor = "", 1500);
        return;
    }

    const btn = document.getElementById('submitRequest');
    btn.disabled = true;
    btn.textContent = "Submitting...";

    try {
        const res = await fetch('/api/request', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appid })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || 'An error occurred.', '#FF0000', 1500, "#fff");
            btn.style.borderColor = '#FF0000';
            setTimeout(() => btn.style.borderColor = "", 1500);
            return;
        }

        if (data.message === "Game already available.") {
            showToast("Game already available.", "#ffbd44", 1500, "#000");
            inputEl.style.borderColor = '#ffbd44';
            setTimeout(() => inputEl.style.borderColor = "", 1500);
        } else {
            showToast("Request sent!", '#00ca4e', 1500, "#000");
            inputEl.style.borderColor = '#00ca4e';
            setTimeout(() => inputEl.style.borderColor = "", 1500);
            inputEl.value = "";
        }

    } catch (err) {
        showToast('Something went wrong.', '#FF0000', 1500, "#fff");
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.textContent = "Submit";
    }
}

function back() {
    window.location.href = "/manifest";
}

function home() {
    window.location.href = "/";
}

document.getElementById("AppIDInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        request();
    }
});