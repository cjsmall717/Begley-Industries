// File: /js/imageContent.js

import { consoleLog } from "/js/utils.js";

let thumbnailPaths = [];

export async function loadThumbnailPaths() {
    if (thumbnailPaths.length > 0) return thumbnailPaths;

    const res = await fetch("/res/img/content/thumbnail_paths.txt", {
        cache: "no-store"
    });

    if (!res.ok) {
        consoleLog("[Images] failed to load thumbnail paths");
        return [];
    }

    const text = await res.text();

    thumbnailPaths = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));

    consoleLog("[Images] loaded thumbnails", thumbnailPaths.length);

    return thumbnailPaths;
}

function sortImages(paths) {
    return paths.sort((a, b) => a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base"
    }));
}

export function getProjectImages(folder, subfolder = "") {
    const base = subfolder
    ? `/thumbnails/${folder}/${subfolder}/`
    : `/thumbnails/${folder}/`;

    return sortImages(
        thumbnailPaths.filter(path => path.includes(base))
    );
}

export function imageGrid(galleryPath) {
    const parts = galleryPath.split("/").map(v => v.trim()).filter(Boolean);

    const folder = parts[0] ?? "";
    const subfolder = parts.slice(1).join("/");

    const images = getProjectImages(folder, subfolder);
    const projectImages = getProjectImages(folder);

    const cards = images.map((src) => {
        const imageNumber = projectImages.indexOf(src) + 1;
        return imageCard(src, galleryPath, imageNumber);
    }).join("");

    return `
    <div class="projects-grid">
    ${cards}
    </div>
    `;
}

export function imageCard(path, galleryFolder = "", imageNumber = 0) {
    const safePath = JSON.stringify(path);
    const safeFolder = JSON.stringify(galleryFolder);

    return `
    <div class="element-project">
    <a href="#" onclick='viewImage(${safePath}, ${safeFolder}, ${imageNumber}); return false;'>
    <img src="${path}" alt="">
    </a>
    </div>
    `;
}
