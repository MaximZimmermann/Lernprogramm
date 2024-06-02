import { model } from "../model.js";
import { quizView } from "./view.js";
import { QuizController } from "./controller.js";

/**
 * Initializes the quiz application by creating the necessary objects and starting the controller.
 */
export function init() {
        const modelObject = model;
        const view = quizView;
        const controller = new QuizController(modelObject, view);
}
