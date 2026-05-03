// File: /js/stringLoader.js

window.pageStrings = {};
window.pageRawStrings = {};

export async function loadStringIndex(indexPath = "/res/pages/index.json") {
    const indexRes = await fetch(indexPath, { cache: "no-store" });

    if (!indexRes.ok) {
        throw new Error(`Failed to load string index: ${indexPath}`);
    }

    const index = await indexRes.json();

    for (const filePath of index.files) {
        const res = await fetch(filePath, { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`Failed to load string file: ${filePath}`);
        }

        const data = await res.json();

        for (const [key, value] of Object.entries(data)) {
            window.pageRawStrings[key] = value;

            window.pageStrings[key] = Array.isArray(value)
            ? value.join("")
            : String(value);
        }
    }

    return window.pageStrings;
}

export function str(key) {
    return window.pageStrings[key] ?? "";
}

export function pagestr(key, seen = new Set()) {
    const value = window.pageRawStrings[key];

    if (value === undefined) {
        return str(key);
    }

    if (!Array.isArray(value)) {
        return str(key);
    }

    if (seen.has(key)) {
        console.warn("[pagestr] circular reference:", key);
        return "";
    }

    seen.add(key);

    const result = value.map(part => {
        const raw = window.pageRawStrings[part];

        if (Array.isArray(raw)) {
            return pagestr(part, seen);
        }

        if (window.pageStrings[part] !== undefined) {
            return str(part);
        }

        return part;
    }).join("");

    seen.delete(key);

    return result;
}
