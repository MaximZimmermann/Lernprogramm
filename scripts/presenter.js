import { View } from './view.js';

export class Presenter {
    constructor() {
        this.anr = 0;
    }

    setModelAndView(model, view) {
        this.model = model;
        this.view = view;
    }

    // Holt eine neue Frage aus dem Model und setzt die View
    setTask() {
        let frag = this.model.getTask(this.anr);
        View.renderText(frag);
        for (let i = 0; i < 4; i++) {
            let wert = "42";
            let pos = i;
            View.inscribeButtons(i, wert, pos); // Tasten beschriften -> View -> Antworten
        }
    }

    // Prüft die Antwort, aktualisiert Statistik und setzt die View
    checkAnswer(answer) {
        console.log("Antwort: ", answer);
    }
}