import { model } from "../model.js";
import { CategoryView } from "./view.js";
import { CategoryController } from "./controller.js";

/**
 * Initializes the category MVC components
 */
export function init() {
    const modelObject = model;
    const view = new CategoryView();
    const controller = new CategoryController(modelObject, view);
}

/**
 * Removes the category controller and view from the window object
 */
export function exit() {
    // TODO: Implement exit function
    // delete window.categoryController;
    // delete window.categoryView;
}