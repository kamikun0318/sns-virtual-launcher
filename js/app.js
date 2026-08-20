// ========== Predefined Apps ==========
const PREDEFINED_APPS = [
  {
    id: "tiktok",
    name: "TikTok",
    url: "https://www.tiktok.com",
    emoji: "🎵",
    color: "#000000",
    badge: "公式"
  },
  {
    id: "tiktok-proxi",
    name: "TikTok (Proxi)",
    url: "https://proxitok.pabloferreiro.es",
    emoji: "🔒",
    color: "#1a1a1a",
    badge: "Privacy"
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com",
    emoji: "📸",
    color: "#E1306C"
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com",
    emoji: "▶️",
    color: "#FF0000"
  },
  {
    id: "x",
    name: "X (Twitter)",
    url: "https://x.com",
    emoji: "𝕏",
    color: "#000000"
  },
  {
    id: "threads",
    name: "Threads",
    url: "https://www.threads.net",
    emoji: "🧵",
    color: "#000000"
  },
  {
    id: "reddit",
    name: "Reddit",
    url: "https://www.reddit.com",
    emoji: "🤖",
    color: "#FF4500"
  },
  {
    id: "bluesky",
    name: "Bluesky",
    url: "https://bsky.app",
    emoji: "🦋",
    color: "#0085FF"
  },
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com",
    emoji: "📘",
    color: "#1877F2"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    emoji: "💼",
    color: "#0A66C2"
  },
  {
    id: "pinterest",
    name: "Pinterest",
    url: "https://www.pinterest.com",
    emoji: "📌",
    color: "#E60023"
  },
  {
    id: "twitch",
    name: "Twitch",
    url: "https://www.twitch.tv",
    emoji: "🎮",
    color: "#9146FF"
  }
];

// ========== State ==========
let bookmarks = JSON.parse(localStorage.getItem("sns-bookmarks") || "[]");
let editingId = null;
let contextTarget = null;
let deferredPrompt = null;

// ========== DOM ==========
const appsGrid = document.getElementById("apps-grid");
const bookmarksGrid = document.getElementById("bookmarks-grid");
const emptyMsg = document.getElementById("empty-bookmarks");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const form = document.getElementById("bookmark-form");
const bmName = document.getElementById("bm-name");
const bmUrl = document.getElementById("bm-url");
const bmColor = document.getElementById("bm-color");
const bmEmoji = document.getElementById("bm-emoji");
const cancelBtn = document.getElementById("cancel-btn");
const addBtn = document.getElementById("add-bookmark-btn");
const themeToggle = document.getElementById("theme-toggle");
const installBtn = document.getElementById("install-btn");
const contextMenu = document.getElementById("context-menu");

// ========== Render ==========
function createCard(item, isBookmark = false) {
  const card = document.createElement("div");
  card.className = "app-card";
  card.dataset.id = item.id;
  card.dataset.url = item.url;
  if (isBookmark) card.dataset.bookmark = "true";

  const iconStyle = item.color
    ? `background: ${item.color}22; color: ${item.color}`
    : "";

  card.innerHTML = `
    <div class="icon" style="${iconStyle}">${item.emoji || "🔗"}</div>
    <div class="name">${item.name}</div>
    ${item.badge ? `<span class="badge">${item.badge}</span>` : ""}
  `;

  card.addEventListener("click", (e) => {
    if (e.target.closest(".context-menu")) return;
    openUrl(item.url);
  });

  if (isBookmark) {
    let pressTimer;
    card.addEventListener("touchstart", (e) => {
      pressTimer = setTimeout(() => {
        showContextMenu(e, item);
      }, 550);
    }, { passive: true });
    card.addEventListener("touchend", () => clearTimeout(pressTimer));
    card.addEventListener("touchmove", () => clearTimeout(pressTimer));
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenu(e, item);
    });
  }

  return card;
}

function renderApps(filter = "") {
  appsGrid.innerHTML = "";
  const q = filter.toLowerCase();
  PREDEFINED_APPS.filter(a => a.name.toLowerCase().includes(q))
    .forEach(app => appsGrid.appendChild(createCard(app)));
}

function renderBookmarks(filter = "") {
  bookmarksGrid.innerHTML = "";
  const q = filter.toLowerCase();
  const filtered = bookmarks.filter(b => b.name.toLowerCase().includes(q) || b.url.toLowerCase().includes(q));

  if (filtered.length === 0) {
    emptyMsg.classList.remove("hidden");
    emptyMsg.textContent = filter
      ? "一致するブックマークがありません"
      : "まだブックマークがありません。＋追加から好きなURLを登録できます。";
  } else {
    emptyMsg.classList.add("hidden");
    filtered.forEach(bm => bookmarksGrid.appendChild(createCard(bm, true)));
  }
}

function renderAll(filter = "") {
  renderApps(filter);
  renderBookmarks(filter);
}

// ========== Actions ==========
function openUrl(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function saveBookmarks() {
  localStorage.setItem("sns-bookmarks", JSON.stringify(bookmarks));
}

function openModal(editItem = null) {
  editingId = editItem ? editItem.id : null;
  modalTitle.textContent = editItem ? "ブックマークを編集" : "ブックマークを追加";
  bmName.value = editItem ? editItem.name : "";
  bmUrl.value = editItem ? editItem.url : "";
  bmColor.value = editItem ? editItem.color || "#6366f1" : "#6366f1";
  bmEmoji.value = editItem ? editItem.emoji || "" : "";
  modal.classList.remove("hidden");
  bmName.focus();
}

function closeModal() {
  modal.classList.add("hidden");
  form.reset();
  editingId = null;
}

function showContextMenu(e, item) {
  contextTarget = item;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  contextMenu.style.left = `${Math.min(x, window.innerWidth - 160)}px`;
  contextMenu.style.top = `${Math.min(y, window.innerHeight - 140)}px`;
  contextMenu.classList.remove("hidden");
}

function hideContextMenu() {
  contextMenu.classList.add("hidden");
  contextTarget = null;
}

// ========== Event Listeners ==========
addBtn.addEventListener("click", () => openModal());

cancelBtn.addEventListener("click", closeModal);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = bmName.value.trim();
  const url = bmUrl.value.trim();
  const color = bmColor.value;
  const emoji = bmEmoji.value.trim() || "🔗";

  if (!name || !url) return;

  if (editingId) {
    const idx = bookmarks.findIndex(b => b.id === editingId);
    if (idx !== -1) {
      bookmarks[idx] = { ...bookmarks[idx], name, url, color, emoji };
    }
  } else {
    bookmarks.push({
      id: "bm-" + Date.now(),
      name,
      url,
      color,
      emoji
    });
  }
  saveBookmarks();
  renderBookmarks(searchInput.value);
  closeModal();
});

contextMenu.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  if (!contextTarget || !action) return;

  if (action === "open") {
    openUrl(contextTarget.url);
  } else if (action === "edit") {
    openModal(contextTarget);
  } else if (action === "delete") {
    if (confirm(`「${contextTarget.name}」を削除しますか？`)) {
      bookmarks = bookmarks.filter(b => b.id !== contextTarget.id);
      saveBookmarks();
      renderBookmarks(searchInput.value);
    }
  }
  hideContextMenu();
});

document.addEventListener("click", (e) => {
  if (!contextMenu.contains(e.target)) hideContextMenu();
});

searchInput.addEventListener("input", () => {
  renderAll(searchInput.value);
});

// Theme
const savedTheme = localStorage.getItem("sns-theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("sns-theme", next);
});

// PWA Install
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    installBtn.classList.add("hidden");
  }
  deferredPrompt = null;
});

// Initial render
renderAll();
