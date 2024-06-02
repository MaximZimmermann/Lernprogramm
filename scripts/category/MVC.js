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