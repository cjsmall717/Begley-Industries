// File: /js/utils.js
import { loadThumbnailPaths } from "/js/imageContent.js";
import { loadCSS } from "/js/stylesheets.js";
const ENABLE_LOG = true;

export function consoleLog(...args) {
    if (!ENABLE_LOG) return;
    console.log(...args);
}

export function consoleLogDisabled(...args) {
    console.log(...args);
}
async function loadAssetList(path, { blocking = true } = {}) {
    try {
        const res = await fetch(path, { cache: 'no-store' });
        if (!res.ok) throw new Error(`failed to load ${path}`);

        const text = await res.text();

        const assets = text
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#'));

        const loaders = assets.map(src => {
            return new Promise(resolve => {
                const ext = src.split('.').pop().toLowerCase();

                function success() {
                    consoleLog(`[Preload] ${src}`);
                    resolve();
                }

                function fail() {
                    consoleLog(`preload failed, file missing ${src}`);
                    resolve(); // don't block
                }

                if (['png','jpg','jpeg','gif','webp','svg'].includes(ext)) {
                    const img = new Image();
                    img.onload = success;
                    img.onerror = fail;
                    img.src = src;

                } else if (['mp3','wav','ogg'].includes(ext)) {
                    const audio = new Audio();
                    audio.onloadeddata = success;
                    audio.onerror = fail;
                    audio.src = src;

                } else {
                    fetch(src, { cache: 'force-cache' })
                    .then(r => r.ok ? success() : fail())
                    .catch(fail);
                }
            });
        });

        if (blocking) {
            await Promise.all(loaders);
        } else {
            Promise.all(loaders);
        }

    } catch (err) {
        consoleLog(`[Assets] ${path} failed:`, err);
    }
}

export async function preloadAssets() {
    await loadCSS("/css/main.css");
    await loadCSS("/css/colours.css");
    await loadCSS("/css/text.css");
    await loadCSS("/css/gallery.css");
    consoleLog("[Initialize Preload Onload]");
    await loadAssetList('/res/onload.txt', { blocking: true });
    consoleLog("[Initialize Preload Background]");
    loadAssetList('/res/background.txt', { blocking: false });
    await loadThumbnailPaths();
}
