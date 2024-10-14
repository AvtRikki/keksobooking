import {FormValidator} from '../validation/form-validator.js';

export class FormManager {
  #COORDINATE_ACCURACY = 5;

  #SUBMIT_SUFFIX = '__submit';
  #TIME_LINE_SUFFIX = '__element--time'

  #TIME_IN_SELECTOR = '#timein'
  #TIME_OUT_SELECTOR = '#timeout'
  #ADDRESS_SELECTOR = '#address'

  #UPLOADING_MESSAGE = 'Загрузка...';

  constructor(formName) {

    this.submitButton = document.querySelector(`.${formName}${this.#SUBMIT_SUFFIX}`);
    this.submitButtonDefaultName = this.submitButton.textContent;
    this.uploadForm = document.querySelector(`.${formName}`);
    this.address = this.uploadForm.querySelector (this.#ADDRESS_SELECTOR);
    this.timeInSelect = this.uploadForm.querySelector(this.#TIME_IN_SELECTOR);
    this.timeOutSelect = this.uploadForm.querySelector(this.#TIME_OUT_SELECTOR);
    this.timeLineGroup = this.uploadForm.querySelector(`.${formName}${this.#TIME_LINE_SUFFIX}`);
    this.validator = new FormValidator(this.uploadForm);

    this.onFormSubmit = async (evt) => {
      evt.preventDefault();
      await this.#trySubmitFormIfValid(evt.target);
    };

    this.timeLineGroup.addEventListener('change', (evt) => {
      if (evt.target.value) {
        this.timeOutSelect.value = this.timeInSelect.value = evt.target.value;
      }
    });
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

  updateAddress(position) {
    this.address.value = `${(position.lat).toFixed(this.#COORDINATE_ACCURACY)},${(position.lng).toFixed(this.#COORDINATE_ACCURACY)}`;
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
