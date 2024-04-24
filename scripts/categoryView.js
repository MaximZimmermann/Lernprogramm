import * as categoryPresenter from './categoryController.js';

export class CategoryView {
    constructor(presenter) {
        this.presenter = presenter;
        this.setHandler();
    }

    setHandler() {
        document.getElementById("start").addEventListener("click", this.start.bind(this), false);
    }

    /**
     * Adds a new category to the DOM.
     * @param {string} categoryName - The name of the category.
     * @param {string} categoryDescription - The description of the category.
     * @returns {Promise<void>} - A promise that resolves when the category is added to the DOM.
     */
    async renderCategory(categoryName, categoryDescription) {
        if (!this.categoryElement) {
            const categoryElement = await fetch(`/partials/categoryElement.html`);
            categoryText = categoryElement.text();
        }
        let thisCategoryText = categoryText;
        thisCategoryText = thisCategoryText.replace("{{categoryName}}", categoryName);
        thisCategoryText = thisCategoryText.replace("{{categoryDescription}}", categoryDescription);
        const categoryElementHTML = document.createElement("div");
        categoryElementHTML.classList.add("categoryElement");
        categoryElementHTML.innerHTML = thisCategoryText;
        document.getElementById("categories").appendChild(categoryElementHTML);
    }

    /**
     * The text representing the category.
     * @type {string}
     */
    categoryHTMLText;
}