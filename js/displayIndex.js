// File: js/displayIndex.js

import { loadStringIndex, str, pagestr } from "./js/stringLoader.js";
import { loadThumbnailPaths, imageGrid } from "./js/imageContent.js";
import { viewImage } from "./js/viewer.js";

function renderPageString(key) {
    let html = pagestr(key) ?? "";

    html = html.replace(/\[\[igrid:([^\]]+)\]\]/g, (_, value) => {
        const galleryPath = value.trim();
        return imageGrid(galleryPath);
    });

    return html;
}

export async function displayIndex() {
    await loadStringIndex();
    await loadThumbnailPaths();

    loadPage("homepage");
}

export function loadPage(pageName) {
    const el = document.getElementById("element-content");

    const key = `site.pages.${pageName}`;
    const html = renderPageString(key);

    el.innerHTML = html || renderPageString("site.pages.404");
}

window.loadPage = loadPage;
window.viewImage = viewImage;
