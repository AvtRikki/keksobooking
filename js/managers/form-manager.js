import {FormValidator} from '../validation/form-validator.js';

export class FormManager {
  #SUBMIT_SUFFIX = '__submit';

  #UPLOADING_MESSAGE = 'Загрузка...';

  constructor(formName) {
    this.submitButton = document.querySelector(`.${formName}${this.#SUBMIT_SUFFIX}`);
    this.submitButtonDefaultName = this.submitButton.textContent;
    this.uploadForm = document.querySelector(`.${formName}`);

    this.validator = new FormValidator(this.uploadForm);

    this.onFormSubmit = async (evt) => {
      evt.preventDefault();
      await this.#trySubmitFormIfValid(evt.target);
    };
  }

  async #trySubmitFormIfValid(target) {
    if (this.validator.validate()) {
      this.#beginUploading();
      Promise.resolve().finally(() => this.#endUploading());
    }
  }

  subscribe() {
    this.uploadForm.addEventListener('submit', this.onFormSubmit);
  }

  unsubscribe() {
    this.uploadForm.removeEventListener('submit', this.onFormSubmit);
  }

  #beginUploading() {
    this.submitButton.disabled = true;
    this.submitButton.textContent = this.#UPLOADING_MESSAGE;
  }

  #endUploading() {
    this.submitButton.disabled = false;
    this.submitButton.textContent = this.submitButtonDefaultName;
  }
}
