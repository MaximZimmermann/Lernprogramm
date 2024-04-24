class CategoryView {
    constructor() {
        this.categorySelected = new Event();
    }

    selectCategory(category) {
        this.categorySelected.trigger(category);
    }

    // Other methods to display the categories
}