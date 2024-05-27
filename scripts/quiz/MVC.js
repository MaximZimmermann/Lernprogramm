import { model } from "../model.js";
import { quizView } from "./view.js";
import { QuizController } from "./controller.js";

// /**
//  * Initializes the category MVC components
//  */
export function init() {
        const modelObject = model;
        const view = quizView;
        const controller = new QuizController(modelObject, view);
}

// /**
//  * Removes the category controller and view from the window object
//  */
// export function exit() {
//     // TODO: Implement exit function
//     // delete window.categoryController;
//     // delete window.categoryView;
// }