/**
 * @typedef {import('../model.js').Category} Category
 */

import { CategoryController } from './controller.js';

/**
 * Represents the view for categories
 */
export class CategoryView {
    constructor() {
        this.controller = null;
    }

    /**
     * Sets the controller for the category view
     * @param {CategoryController} controller - The controller to set
     */
    setController(controller) {
        this.controller = controller;
    }

    /**
     * Updates the categories in the view
     * @param {Category[]} [categories] - An array of category objects
     * @returns {void}
     */
    updateCategories(categories) {
        this.emptyCategories();
        categories.forEach(category => {
            this.renderCategory(category.name, category.description, category.image);
        });
    }

    /**
     * Clears the categories element by removing all its child elements
     */
    emptyCategories() {
        document.getElementById("content").innerHTML = "";
    }

    /**
     * Adds a new category to the DOM
     * @param {string} categoryName - The name of the category
     * @param {string} categoryDescription - The description of the category
     * @param {string} categoryImage - The image URL of the category
     * @returns {Promise<void>} - A promise that resolves when the category is added to the DOM
     */
    async renderCategory(categoryName, categoryDescription, categoryImage) {
        if (!this.categoryHTMLText) {
            const categoryElement = await fetch('../partials/categoryElement.html');
            this.categoryHTMLText = await categoryElement.text();
        }
        let thisCategoryText = this.categoryHTMLText;
        thisCategoryText = thisCategoryText.replace("{{categoryName}}", categoryName);
        thisCategoryText = thisCategoryText.replace("{{categoryDescription}}", categoryDescription);
        thisCategoryText = thisCategoryText.replace("{{categoryImage}}", categoryImage);
        const categoryElementHTML = document.createElement("div");
        categoryElementHTML.classList.add("categoryElement");
        categoryElementHTML.innerHTML = thisCategoryText;
        const child = document.getElementById("content").appendChild(categoryElementHTML);
        child.getElementsByClassName("start")[0].addEventListener("click", () => this.selectCategory(categoryName));
    }

    /**
     * Selects a category
     * @param {string} categoryName - The name of the category to select
     */
    selectCategory(categoryName) {
        this.controller.selectCategory(categoryName);
    }

    /**
     * The text representing the category
     * @type {string}
     */
    categoryHTMLText;

    /**
     * The presenter for the category view
     * @type {CategoryController}
     */
    controller;
}
