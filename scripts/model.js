// export class Model {
//     constructor() { }

//     // Holt eine Frage aus dem Array, zufällig ausgewählt oder vom Server
//     getTask(nr) {
//         return "21 + 21";  // Aufgabe + Lösungen
//     }
//     checkAnswer() {
//         // TODO
//     }
// }

/**
 * Represents a question with text, answers, and a correct answer.
 */
class Question {
    constructor(text, answers, correctAnswer) {
        this.text = text;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }
    /**
     * Retrieves the question text.
     * @returns {string} The question text.
     */
    getQuestion() {
        return this.text;
    }
    /**
     * Retrieves the answers.
     * @returns {Array} The answers.
     */
    getAnswers() {
        return this.answers;
    }
    getCorrectAnswer() {
        return this.correctAnswer;
    }
    
    isCorrectAnswer(answer) {
        return this.correctAnswer === answer;
    }
}

/**
 * Represents a category of questions.
 * @class
 */
class Category {
    /**
     * Represents a model object.
     * @constructor
     * @param {string} name - The name of the model.
     * @param {string} description - The description of the model.
     */
    constructor(name, description) {
        /**
         * @type {string} The name of the category.
         */
        this.name = name;
        /**
         * @type {string} The description of the category.
         */
        this.description = description;
        /**
         * @type {Array<Question>} The questions in the category.
         */
        this.questions = [];
    }

    addQuestion(text, answers, correctAnswer) {
        const question = new Question(text, answers, correctAnswer);
        this.questions.push(question);
    }
}

/**
 * Represents a model that manages categories and questions.
 */
export class Model {
    constructor() {
        this.categories = [];
    }

    /**
     * Fetches questions for a given category name from an API.
     * @param {string} categoryName - The name of the category.
     * @returns {Promise<void>} A promise that resolves when the questions are fetched and added to the category.
     */
    async fetchQuestions(categoryName) {
        const response = await fetch(`https://api.example.com/questions?category=${categoryName}`);
        const questions = await response.json();

        const category = this.categories.find(category => category.name === categoryName);
        if (category) {
            questions.forEach(question => {
                category.addQuestion(question.text, question.answers, question.correctAnswer);
            });
        }
    }

    /**
     * Adds a new category to the model.
     * @param {string} name - The name of the category.
     * @param {string} description - The description of the category.
     */
    addCategory(name, description) {
        const category = new Category(name, description);
        this.categories.push(category);
    }

    /**
     * Removes a category from the model.
     * @param {string} name - The name of the category to remove.
     */
    removeCategory(name) {
        delete this.categories.find(category => category.name === name)
    }

    /**
     * Retrieves all categories in the model.
     * @returns {Array<Category>} An array of Category objects.
     */
    getCategories() {
        return this.categories;
    }
}