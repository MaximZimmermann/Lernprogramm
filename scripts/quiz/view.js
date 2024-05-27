/**
 * @typedef {import('../model.js').Category} Category
 * @typedef {import('../model.js').Question} Question
 */

import { QuizController } from './controller.js';

/**
 * Represents the view for categories
 */
export class QuizView {
    constructor() {
        this.controller = null;
    }

    /**
     * Sets the controller for the category view
     * @param {QuizController} controller - The controller to set
     */
    setController(controller) {
        this.controller = controller;
    }

    /**
     * Sets the question text
     * @param {String} questionText - The question to set
     */
    setQuestion(questionText) {
        const questionArea = document.getElementById("question");
        questionArea.textContent = questionText;
    }

    /**
     * Renders the quiz by setting the question and answers
     * @param {Question} question - The question object containing the text and answers
     */
    renderQuiz(question) {
        this.setQuestion(question.text);
        this.setAnswers(question.answers);
        this.setButtonState("skip");
    }

    /**
     * Sets the answers for the quiz
     * @param {string[]} answers - An array of strings representing the answers
     */
    setAnswers(answers) {
        const answerElements = this.getAnswers();
        for (let i = 0; i < answerElements.length; i++) {
            /**
             * @type {HTMLElement} element
             */
            const element = answerElements[i];
            element.getElementsByClassName("answerText")[0].textContent = answers[i];
            this.changeAnswerState(element, "clickable", i);
        }
        // [...document.getElementsByClassName("answer")].forEach(
        //     /**
        //      * @param {HTMLElement} element 
        //      * @param {Number} index 
        //      */
        //     (element, index) => {
        //         element.getElementsByClassName("answerText")[0].textContent = answers[index];
        //         this.changeAnswerState(element, "clickable", index);
        //     });
    }

    /**
     * Retrieves all the answer elements from the document.
     * @returns {HTMLElement[]} An array of answer elements.
     */
    getAnswers() {
        // @ts-ignore
        return [...document.getElementsByClassName("answer")];
    }

    /**
     * Resets the answer element by removing the CSS classes "correct", "incorrect", and "selected"
     * @param {HTMLElement | Element} answer - The answer element to be reset
     * @returns {HTMLElement | Element | Node} - The reset answer element
     */
    resetAnswer(answer) {
        answer.classList.remove("correct", "incorrect", "selected");
        answer.removeEventListener("click", this.answerSelected);
        return answer;
    }

    /**
     * Changes the state of an answer element
     * @param {HTMLElement} answer - The answer element to change the state of
     * @param {string} state - The new state of the answer element. Possible values are "clickable", "correct", "incorrect", and "selected"
     * @param {number} index - The index of the answer element
     */
    changeAnswerState(answer, state, index) {
        // @ts-ignore
        answer = this.resetAnswer(answer);
        if (state === "clickable") {
            answer.dataset.index = index.toString();
            answer.addEventListener("click", this.answerSelected);
        } else {
            answer.removeEventListener("click", this.answerSelected);
            answer.classList.add(state);
        }
    }

    /**
     * 
     * @param {string} state - The state to set the button to. Possible values are "skip", "next" and "finish"
     */
    setButtonState(state) {
        const button = document.getElementById("next");
        button.textContent = state;
        button.removeEventListener("click", this.nextQuestion);

        if (state === "skip") {
            button.textContent = "Skip";
            button.addEventListener("click", this.nextQuestion);
        } else if (state === "next") {
            button.textContent = "Next";
            button.addEventListener("click", this.nextQuestion);
        }
    }

    nextQuestion() {
        quizView.controller.nextQuestion();
    }

    /**
     * Event listener for when an answer is selected
     */
    answerSelected() {
        // @ts-ignore
        const answerIndex = parseInt(this.dataset.index);
        const isCorrect = quizView.controller.checkAnswer(answerIndex);

        const answerElements = quizView.getAnswers();
        for (let i = 0; i < answerElements.length; i++) {
            const element = answerElements[i];
            if (i === answerIndex) {
                quizView.changeAnswerState(element, "incorrect", i);
            } else {
                quizView.resetAnswer(element);
            }
        }
        const correctAnswer = quizView.controller.getCorrectAnswer();
        quizView.changeAnswerState(answerElements[correctAnswer], "correct", correctAnswer);

        quizView.controller.submitAnswer(answerIndex);
        quizView.setButtonState("next");
    }
}

/**
 * Represents the quiz view.
 * @type {QuizView}
 */
export let quizView;
if (!quizView) {
    quizView = new QuizView();
}