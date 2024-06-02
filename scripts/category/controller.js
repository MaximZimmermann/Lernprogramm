import * as nav from "../nav.js";

/**
 * Controller for managing categories
 * @class
 */
export class CategoryController {
    /**
     * Creates a new instance of CategoryController
     * @param {import("../model.js").Model} model - The model instance
     * @param {import("./view.js").CategoryView} view - The view instance
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.setController(this);

        this.updateCategories();
    }

    /**
     * Selects a category.
     * @param {string} categoryName - The name of the category to select
     */
    async selectCategory(categoryName) {
        await this.model.selectCategory(categoryName);
        nav.setActivePage("quiz");
    }

    /**
     * Updates the categories by calling the model's updateCategories method
     * and then updates the view with the updated categories
     * @returns {Promise<void>} A promise that resolves when the categories are updated
     */
    async updateCategories() {
        await this.model.updateCategories();
        this.view.updateCategories(this.model.getCategories());
    }
}