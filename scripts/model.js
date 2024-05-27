/**
 * Represents a question with text, answers, and a correct answer
 */
export class Question {
    constructor(text, answers, correctAnswer, wasAnswered = false, wasCorrect = null) {
        this.text = text;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
        this.wasAnswered = wasAnswered;
        this.wasCorrect = wasCorrect;
    }

    /**
     * Retrieves the question text
     * @returns {string} The question text
     */
    getQuestion() {
        return this.text;
    }

    /**
     * Retrieves the answers
     * @returns {Array} The answers
     */
    getAnswers() {
        return this.answers;
    }

    /**
     * Retrieves the correct answer
     * @returns {number} The correct answer
     */
    getCorrectAnswer() {
        return this.correctAnswer;
    }

    /**
     * Checks if the provided answer is correct
     * @param {string} answer - The answer to check
     * @returns {boolean} - True if the answer is correct, false otherwise
     */
    isCorrectAnswer(answer) {
        return this.answers[this.correctAnswer] === answer;
    }

    /**
     * Checks if the given answer number is the correct answer
     * @param {number} answerNr - The answer number to check
     * @returns {boolean} - Returns true if the given answer number is the correct answer, otherwise false
     */
    isCorrectAnswerNr(answerNr) {
        return this.correctAnswer === answerNr;
    }

    /**
     * @type {string} The text of the question
     */
    text;
    /**
     * @type {Array<string>} The possible answers for the question
     */
    answers;
    /**
     * @type {number} The index of the correct answer in the answers array
     */
    correctAnswer;
}

/**
 * Represents a category of questions
 * @class
 */
export class Category {
    /**
     * Creates a new Category
     * @constructor
     * @param {string} name - The name of the Category
     * @param {string} description - The description of the Category
     * @param {string} image - The image of the Category
     * @param {string} source - The source of the Category
     */
    constructor(name, description, image, source) {
        this.name = name;
        this.description = description;
        this.questions = [];
        this.image = image;
        this.source = source;
    }

    /**
     * @type {string} The name of the category
     */
    name;
    /**
     * @type {string} The description of the category
     */
    description;
    /**
     * @type {Array<Question>} The questions in the category
     */
    questions;
    /**
     * @type {string} The image URL of the category
     */
    image;
    /**
     * @type {string} The source of the category
     */
    source;

    /**
     * Adds a new question to the list of questions and randomizes the order of the answers
     * @param {string} text - The text of the question
     * @param {string[]} answers - An array of possible answers for the question
     * @param {number} correctAnswer - The index of the correct answer in the answers array
     */
    addQuestion(text, answers, correctAnswer) {
        // randomize the order of the answers
        const correctAnswerText = answers[correctAnswer];
        answers = answers.sort(() => Math.random() - 0.5);
        correctAnswer = answers.indexOf(correctAnswerText);

        const question = new Question(text, answers, correctAnswer);
        this.questions.push(question);
    }

    /**
     * Retrieves and removes the next question from the list of questions
     * @returns {Question} The next question
     */
    getNextQuestion() {
        if (this.allQuestionsAnswered()) {
            return null;
        }
        // Skip questions that have already been answered
        let selectedQuestion = this.questions.shift();
        this.questions.push(selectedQuestion);
        selectedQuestion = this.getCurrentQuestion();
        while (this.getCurrentQuestion().wasAnswered === true) {
            selectedQuestion = this.questions.shift();
            this.questions.push(selectedQuestion);
        }
        return selectedQuestion;
    }

    /**
     * Returns the current question
     * @returns {Question} The current question
     */
    getCurrentQuestion() {
        return this.questions[0];
    }

    /**
     * Shuffles the questions array in random order
     */
    shuffleQuestions() {
        this.questions = this.questions.sort(() => Math.random() - 0.5);
    }

    /**
     * Checks if all questions have been answered
     * @returns {boolean} True if all questions have been answered, false otherwise
     */
    allQuestionsAnswered() {
        return this.questions.every(question => question.wasAnswered);
    }

    /**
     * Fetches questions from an internal source and adds them to the model
     * Only works if the source is set to "internal"
     * @returns {Promise<void>} A promise that resolves when the questions are fetched and added
     */
    async fetchQuestions() {
        if (this.source === "internal") {
            const response = await fetch(`/questions/${this.name}.json`);
            const questionsJson = await response.json();
            questionsJson.forEach(question => {
                this.addQuestion(question.text, question.answers, question.correctAnswer);
            });
        } else if (this.source === "external") {
            
        }
    }

    /**
     * Submits the answer for the current question
     * @param {number} answerNr - The answer number to submit
     */
    submitAnswer(answerNr) {
        this.getCurrentQuestion().wasAnswered = true;
        this.getCurrentQuestion().wasCorrect = this.getCurrentQuestion().isCorrectAnswerNr(answerNr);
    }
}

/**
 * Represents a model that manages categories and questions
 */
export class Model {
    constructor() {
    }

    /**
     * @type {Category} The name of the active category
     */
    activeCategory;

    /**
     * Represents the categories for the model.
     * @type {Array<Category>}
     */
    categories = [];

    /**
     * Sets the active category to the specified category name
     * @param {string} categoryName - The name of the category to select
     * @returns {Promise<void>} A promise that resolves when the category is selected
     */
    async selectCategory(categoryName) {
        const category = this.findCategory(categoryName);
        if (!category) {
            console.error(`Category "${categoryName}" not found`);
            return;
        }
        this.activeCategory = category;
        if (category.questions.length === 0) {
            await category.fetchQuestions();
        }
    }

    // /**
    //  * Fetches questions for a given category name from an API
    //  * @param {string} categoryName - The name of the category
    //  * @returns {Promise<void>} A promise that resolves when the questions are fetched and added to the category
    //  */
    // async fetchQuestions(categoryName) {
    //     const response = await fetch(`https://api.example.com/questions?category=${categoryName}`);
    //     const questions = await response.json();

    //     const category = this.categories.find(category => category.name === categoryName);
    //     if (category) {
    //         questions.forEach(question => {
    //             category.addQuestion(question.text, question.answers, question.correctAnswer);
    //         });
    //     }
    // }

    /**
     * Fetches categories from a JSON file and populates the categories array.
     * @returns {Promise<void>} A promise that resolves when the categories are fetched and populated.
     */
    async updateCategories() {
        if (!this.categories.length) {
            await this.forceUpdateCategories();
        }
    }

    /**
     * Fetches the categories data from the server and updates the categories in the model
     * @returns {Promise<void>} A promise that resolves when the categories are updated
     */
    async forceUpdateCategories() {
        const response = await fetch(`/categories.json`);
        const categoriesJson = await response.json();
        this.emptyCategories();
        categoriesJson.forEach(category => {
            this.addCategory(category.name, category.description, category.image, category.source);
        });
    }

    /**
     * Adds a new category to the model
     * @param {string} name - The name of the category
     * @param {string} description - The description of the category
     * @param {string} [image = "./images/placeholder.png"] - The image URL of the category
     * @param {string} [source = "internal"] - The source of the category
     */
    // addCategory(name, description, image = "/images/placeholder.png", source = "internal") {
    addCategory(name, description, image = "https://placehold.co/400", source = "internal") {
        const category = new Category(name, description, image, source);
        this.categories.push(category);
    }

    /**
     * Removes a category from the model
     * @param {string} name - The name of the category to remove
     */
    removeCategory(name) {
        const index = this.categories.findIndex(category => category.name === name);
        if (index !== -1) {
            this.categories.splice(index, 1);
        }
    }

    /**
     * Empties the categories array.
     */
    emptyCategories() {
        this.categories = [];
    }

    /**
     * Finds a category by name
     * @param {string} name - The name of the category to find
     * @returns {Category} The category object if found, otherwise null
     */
    findCategory(name) {
        return this.categories.find(category => category.name === name);
    }

    /**
     * Retrieves all categories in the model
     * @returns {Array<Category>} An array of Category objects
     */
    getCategories() {
        return this.categories;
    }
}

/**
 * The model variable represents the data model used in the application
 * It stores and manages the application's data and provides methods for accessing and manipulating it
 * @type {Model}
 */
export let model;

if (!model) {
    model = new Model();
    model.updateCategories();

    // setInterval(() => {
    //     console.log(model.activeCategory.questions);
    // }, 5000);
}