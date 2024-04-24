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