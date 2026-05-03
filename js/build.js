// File: /js/build.js
import { consoleLog }     from './js/utils.js';
//import { readJson }     from './js/readJson.js';
import { displayIndex }     from './js/displayIndex.js';
import { loadStringIndex, str } from "./js/stringLoader.js";
import { headerContent, footerContent }     from './js/site.js';
//this script sets up the page structure, by injecting elements into the DOM
const body = document.body;

export function injectHeader(){
    //create header container
    consoleLog("[Build DOM] [Inject Header]");
    const header = document.createElement('div');
    header.id = 'element-header';
    header.classList.add('element-header');
    body.appendChild(header);
    //inject content into the header container
    header.innerHTML = headerContent();
}

export async function injectContent(){
    consoleLog("[Build DOM] [Inject Content]");

    const content = document.createElement('div');
    content.id = 'element-content';
    content.classList.add('element-content');
    body.appendChild(content);
    await displayIndex();
    await loadStringIndex();
    consoleLog(window.pageStrings);
    consoleLog(pageStrings["subtopic.title"]);

   // content.innerHTML = str("site.popen") + str("tools01") + str("site.pclose");

}

export function injectFooter(){
    //create footer container
    consoleLog("[Build DOM] [Inject Footer]");
    const footer = document.createElement('div');
    footer.id = 'element-footer';
    footer.classList.add('element-footer');
    body.appendChild(footer);
    //inject content into the footer container
    footer.innerHTML = footerContent();
}
export async function buildDOM(){
    consoleLog("[Build DOM]");

    injectHeader();
    await injectContent();
    injectFooter();
}
