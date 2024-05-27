import { Model } from "./model.js";

/**
 * Represents a collection of navigation buttons
 * @type {HTMLCollectionOf<Element>}
 */
let nav;

/**
 * The default page to load
 * @type {string}
 */
const defaultPage = "category";

if (!nav) {
    nav = document.getElementsByClassName("nav-button");
    for (let i = 0; i < nav.length; i++) {
        const element = nav[i];
        element.addEventListener("click", async () => {
            await setActivePage(element.id);
        });
    }
    setActivePage(defaultPage);
}


/**
 * Sets the active page to the one with the given id
 * @param {String} id
 */
export async function setActivePage(id) {
    setActiveElement(id);
    await loadPage(id);
}

/**
 * Sets all elements to inactive except the one with the given id
 * @param {String} id 
 */
function setActiveElement(id) {
    const a = document.getElementsByClassName("nav-button");
    for (let i = 0; i < a.length; i++) {
        const element = a[i];
        element.classList.remove("active");
    }
    document.getElementById(id).classList.add("active");
}

/**
 * Loads the page with the given id
 * @param {String} id 
 */
async function loadPage(id) {
    const page = await fetch(`/partials/${id}.html`);
    page.text().then(text => document.getElementById("main").innerHTML = text);
    // loading the page and running scripts at the same time can cause issues because the script might run before the page is loaded
    let observer = new MutationObserver(async (mutations, observer) => {
        let div_to_observe = document.querySelector(".content");
        if (div_to_observe) {
            observer.disconnect();
            const { init, exit } = await import(`/scripts/${id}/MVC.js`);
            init();
        }
    });
    observer.observe(document.getElementById("main"), { childList: true, subtree: true });

    // window.exit = exit;
}