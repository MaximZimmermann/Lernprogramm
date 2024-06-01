/**
 * @typedef {{
 *  sorted: boolean,
 *  unsorted: boolean,
 *  empty: boolean
 * }} QuizEngineSort
 * 
 * @typedef {{
 *  id: number,
 *  title: string,
 *  text: string,
 *  options: string[],
 * }} QuizEngineQuestion
 * 
 * @typedef {{
 *  totalPages: number,
 *  totalElements: number,
 *  last: boolean,
 *  first: boolean,
 *  size: number,
 *  number: number,
 *  numberOfElements: number,
 *  empty: boolean,
 *  sort: QuizEngineSort,
 *  pageable: {
 *      sort: QuizEngineSort,
 *      pageNumber: number,
 *      pageSize: number,
 *      offset: number,
 *      paged: boolean,
 *      unpaged: boolean
 *  },
 *  content: QuizEngineQuestion[]
 * }} QuizEngineResponse
 * 
 * @typedef {{
 *  success: boolean,
 *  feedback: string,
 *  }} QuizEngineSolveResponse
 */

import { Question } from "./model.js";

class QuizEngine {
    /**
     * @param {string} url
     * @param {number} port
     * @param {string} email
     * @param {string} password
     */
    constructor(url, port, email, password) {
        this.url = url;
        this.port = port;
        this.email = email;
        this.password = password;
    }

    /**
     * Url for the quiz engine
     * @type {string}
     */
    url;

    /**
     * Port for the quiz engine
     * @type {number}
     */
    port;

    /**
     * Email for the quiz engine login
     * @type {string}
     */
    email;

    /**
     * Password for the quiz engine login
     * @type {string}
     */
    password;

    async testConnection() {
        try {
            const response = await fetch(`${this.url}:${this.port}/api/quizzes?page=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${this.email}:${this.password}`)}`
                }
            });
            if (!response.ok) {
                console.error('Error connecting to the quiz engine:', response.statusText);
                console.error("Make sure you are connected to the HTW VPN.");
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error connecting to the quiz engine:', error);
            return false;
        }
    }

    /**
     * Reads quizzes from the server.
     * @param {number} [page=0] - The page number of quizzes to retrieve.
     * @returns {Promise<Question[]|null>} - A promise that resolves to the response data or null if there was an error.
     */
    async getQuestionsFromPage(page = 0) {
        try {
            const response = await this.getQuizEnginePage(page);

            if (!response) {
                return null;
            }
            // TODO: remove performance measurement
            performance.mark('start');
            const correctAnswers = response.content.map(question => this.getCorrectAnswer(question));
            const results = await Promise.all(correctAnswers);
            performance.mark('end');
            performance.measure('getCorrectAnswers', 'start', 'end');
            const measure = performance.getEntriesByName('getCorrectAnswers')[0];
            const duration = measure.duration;
            performance.clearMarks();
            performance.clearMeasures();

            /**
             * @type {Question[]}
             */
            let questions = [];

            for (let i = 0; i < response.content.length; i++) {
                const quizEngineQuestion = response.content[i];
                const quizEngineCorrectAnswer = results[i];
                if (quizEngineCorrectAnswer === null || quizEngineQuestion.options.length !== 4) {
                    continue;
                }
                const question = new Question(quizEngineQuestion.text, quizEngineQuestion.options, quizEngineCorrectAnswer);
                questions.push(question);
            }
            // console.log(`getting answers took ${Math.round(duration)}ms, page: ${page}/${response.totalPages}, question: ${response.content[response.content.length - 1]?.id}/${response.totalElements}, questions on page: ${questions.length}/${response.content.length}`);
            return questions;
        } catch (error) {
            console.error('Error reading quizzes:', error);
            return null;
        }
    }

    /**
     * Retrieves the index of the correct answer for a given question.
     *
     * @param {QuizEngineQuestion} question - The question object.
     * @returns {Promise<number>} The index of the correct answer.
     */
    async getCorrectAnswer(question) {
        const waitingFor = question.options.map((option, index) => this.solveQuestion(question, index));
        const results = await Promise.all(waitingFor);
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result?.success === true) {
                // console.log("question ID: ", question.id, i);
                return i;
            }
        }
        return null;
    }

    /**
     * Solves a question by sending a POST request to the server.
     * @param {QuizEngineQuestion} question - The question object.
     * @param {number} anserNr - The answer to the question.
     * @returns {Promise<QuizEngineSolveResponse|null>} - A promise that resolves to the response JSON object if successful, or null if there was an error.
     */
    async solveQuestion(question, anserNr) {
        try {
            const response = await fetch(`${this.url}:${this.port}/api/quizzes/${question.id}/solve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${this.email}:${this.password}`)}`
                },
                body: JSON.stringify([anserNr])
            });

            if (!response.ok) {
                console.error('Error solving question:', response.statusText);
                return null;
            }
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error('Error solving question:', error);
            return null;
        }
    }

    /**
     * Retrieves all questions from the quiz engine
     * @returns {Promise<Question[]>} An array of questions
     */
    async getAllQuestions() {
        /**
         * @type {Question[]}
         */
        let questions = [];
        let page = 0;
        const quizEngineResponse = await this.getQuizEnginePage(page);
        this.getQuizEnginePage(page);
        let response;
        for (let i = 0; i <= quizEngineResponse.totalPages; i++) {
            response = await this.getQuestionsFromPage(page);
            if (!response) {
                continue;
            }
            questions = questions.concat(response);
            page++;
        }
        return questions;
    }

    /**
     * Appends questions to the existing list of questions continuously, returns when done
     * @param {Question[]} questions - The current list of questions
     * @returns {Promise<Question[]>} - The updated list of questions
     */
    async appendQuestions(questions) {
        let page = 0;
        const quizEngineResponse = await this.getQuizEnginePage(page);
        if (!quizEngineResponse) {
            console.error("Unable to reach quiz engine, make sure you are connected to the HTW VPN");
            return null;
        }
        let response;
        for (let i = 0; i <= quizEngineResponse.totalPages; i++) {
            response = await this.getQuestionsFromPage(page);
            if (!response) {
                continue;
            }
            // questions = questions.concat(response);
            questions.push(...response);
            page++;
        }
        return questions;
    }

    /**
     * Retrieves a page of quizzes from the Quiz Engine API
     * @param {number} page - The page number to retrieve
     * @returns {Promise<QuizEngineResponse|null>} A promise that resolves to the quiz engine response object, or null if an error occurs
     */
    async getQuizEnginePage(page = 0) {
        try {
            const response = await fetch(`${this.url}:${this.port}/api/quizzes?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${this.email}:${this.password}`)}`
                }
            });

            if (!response.ok) {
                console.error('Error reading quizzes:', response.statusText);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Error reading quizzes:', error);
            return null;
        }
    }
}

/**
 * @type {QuizEngine}
 */
export let quizEngine;
if (!quizEngine) {
    quizEngine = new QuizEngine('https://idefix.informatik.htw-dresden.de', 8888, 'test@gmail.com', 'secret');
}