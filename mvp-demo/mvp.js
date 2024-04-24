import { Model } from '/scripts/model.js';
import { Presenter } from '/scripts/presenter.js';
import { View } from '/scripts/view.js';
import '/scripts/nav.js';

document.addEventListener('DOMContentLoaded', function () {
    let model = new Model();
    let presenter = new Presenter();
    let view = new View(presenter);
    presenter.setModelAndView(model, view);
});