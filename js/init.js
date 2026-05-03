// File: /js/init.js

import { consoleLogDisabled, consoleLog, preloadAssets }     from './utils.js';
import { buildDOM }     from './build.js';
export async function initApp() {
    consoleLogDisabled("Mia: Logging Disabled in ./utils.js, only errors and warns will be displayed!");
    consoleLog("[Initialize] [Build DOM]");
    await buildDOM();
}

consoleLog("[Initialize]");
preloadAssets();
window.addEventListener('DOMContentLoaded', () => initApp());
