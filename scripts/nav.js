/**
 * Represents a collection of navigation buttons.
 * @type {HTMLCollectionOf<Element>}
 */
const nav = document.getElementsByClassName("nav-button");
for (let i = 0; i < nav.length; i++) {
    const element = nav[i];
    element.addEventListener("click", async () => {
        await setActivePage(element.id);
    });
}

/**
 * The default page ID.
 * @type {number}
 */
const defaultPage = nav[3].id
setActivePage(defaultPage);

/**
 * Sets the active page to the one with the given id
 * @param {String} id
 */
async function setActivePage(id) {
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
    const page = await fetch(`/partials/${id}.html`)
    page.text().then(text => document.getElementById("main").innerHTML = text);
}