export class FilterManager {
  constructor(className) {
    this.filterForm = document.querySelector(`.${className}`);
  }

  resetState() {
    this.filterForm.reset();
  }
}
