import * as nav from "../nav.js";

/**
 * Controller for managing categories
 * @class
 */
export class QuizController {
    /**
     * Creates a new instance of CategoryController
     * @param {import("../model.js").Model} model - The model instance
     * @param {import("./view.js").QuizView} view - The view instance
     */
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.setController(this);

        this.nextQuestion();
    }

    model;
    view;


    /**
     * Moves to the next question in the quiz
     * @param {number} [answerNr] - The answer number selected by the user
     * @returns {Promise<void>} - A promise that resolves when the next question is rendered
     */
    async nextQuestion(answerNr) {
        if (answerNr !== undefined) {
            this.model.activeCategory.getCurrentQuestion().wasAnswered = true;
            this.model.activeCategory.getCurrentQuestion().wasCorrect = this.model.activeCategory.getCurrentQuestion().isCorrectAnswerNr(answerNr);
        }
        const question = this.model.activeCategory?.getNextQuestion();
        if (!question) {
            await nav.setActivePage("category");
            return;
        }
        this.view.renderQuiz(question);
    }

    /**
     * Checks if the provided answer number is correct for the current question.
     * 
     * @param {number} answerNr - The answer number to check.
     * @returns {boolean} - Returns true if the answer is correct, false otherwise.
     */
    checkAnswer(answerNr) {
        return this.model.activeCategory.getCurrentQuestion().isCorrectAnswerNr(answerNr);
    }

    /**
     * Retrieves the correct answer for the current question.
     * @returns {number} The correct answer for the current question.
     */
    getCorrectAnswer() {
        return this.model.activeCategory.getCurrentQuestion().correctAnswer;
    }

    /**
     * Submits the answer for the current question.
     * @param {number} answerNr - The number representing the selected answer.
     */
    submitAnswer(answerNr) {
        // FIXME: This is a temporary solution, the model should be updated by the model itself
        this.model.activeCategory.submitAnswer(answerNr);
        this.model.activeCategory.getCurrentQuestion().wasAnswered = true;
        this.model.activeCategory.getCurrentQuestion().wasCorrect = this.model.activeCategory.getCurrentQuestion().isCorrectAnswerNr(answerNr);
    }
}