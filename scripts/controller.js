import { View } from './view.js';

class CategoryController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.categorySelected.addListener((category) => {
            this.model.fetchQuestions(category.name);
        });
    }

    // Other methods to handle category selection
}

class QuestionController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.answerSelected.addListener((answer) => {
            // Check if the answer is correct and show the next question or results
        });
    }

    // Other methods to handle question answering
}