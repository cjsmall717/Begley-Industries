// File: /js/viewer.js

const galleryCache = {};

function escapeHtml(value) {
    return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getImageNumberFromSrc(src) {
    const file = String(src).split("/").pop() || "";
    const match = file.match(/^(\d+)/);

    return match ? match[1] : "";
}

async function loadGalleryText(galleryFolder, imageNumber) {
    if (!galleryFolder) return "";

    const projectFolder = String(galleryFolder).split("/").filter(Boolean)[0];
    const number = imageNumber || "";

    if (!projectFolder || !number) return "";

    if (!galleryCache[projectFolder]) {
        const res = await fetch(`./res/img/content/projects/${projectFolder}/gallery.json`, {
            cache: "no-store"
        });

        if (!res.ok) {
            galleryCache[projectFolder] = {};
            return "";
        }

        galleryCache[projectFolder] = await res.json();
    }

    const key = `gallery.text.${number}`;
    const value = galleryCache[projectFolder][key];

    if (Array.isArray(value)) {
        return value.join("");
    }

    return value ?? "";
}

export async function viewImage(thumbSrc, galleryFolder = "", imageNumber = 0) {
    const imgSrc = thumbSrc.replace("/thumbnails/", "/projects/");
    const actualImageNumber = imageNumber || getImageNumberFromSrc(thumbSrc);
    const description = await loadGalleryText(galleryFolder, actualImageNumber);

    let popup = document.getElementById("image-viewer-popup");

    if (popup) {
        popup.remove();
    }

    popup = document.createElement("div");
    popup.id = "image-viewer-popup";
    popup.className = "image-viewer-popup";

    popup.innerHTML = `
    <div class="image-viewer-box">
    <button class="image-viewer-close" type="button" aria-label="Close image viewer">×</button>
    <img src="${imgSrc}" alt="">
    ${description ? `
        <div class="image-viewer-description">
        ${escapeHtml(description)}
        </div>
        ` : ""}
        </div>
        `;

        popup.querySelector(".image-viewer-close").addEventListener("click", () => {
            popup.remove();
        });

        popup.addEventListener("click", (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });

        document.body.appendChild(popup);
}

window.viewImage = viewImage;
