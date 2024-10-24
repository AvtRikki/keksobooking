import {FormValidator} from '../validation/form-validator.js';
import {MessageManager} from './message-manager.js';

export class FormManager {
  #COORDINATE_ACCURACY = 5;

  #SUBMIT_SUFFIX = '__submit';
  #RESET_SUFFIX = '__reset';
  #TIME_LINE_SUFFIX = '__element--time'

  #TIME_IN_SELECTOR = '#timein'
  #TIME_OUT_SELECTOR = '#timeout'
  #ADDRESS_SELECTOR = '#address'

  #UPLOADING_MESSAGE = 'Загрузка...';

  constructor(formName, dataLoader) {
    this.callbacks = new Map();
    this.submitButton = document.querySelector(`.${formName}${this.#SUBMIT_SUFFIX}`);
    this.resetButton = document.querySelector(`.${formName}${this.#RESET_SUFFIX}`);
    this.submitButtonDefaultName = this.submitButton.textContent;
    this.uploadForm = document.querySelector(`.${formName}`);
    this.address = this.uploadForm.querySelector (this.#ADDRESS_SELECTOR);
    this.timeInSelect = this.uploadForm.querySelector(this.#TIME_IN_SELECTOR);
    this.timeOutSelect = this.uploadForm.querySelector(this.#TIME_OUT_SELECTOR);
    this.timeLineGroup = this.uploadForm.querySelector(`.${formName}${this.#TIME_LINE_SUFFIX}`);
    this.messageManager = new MessageManager();
    this.validator = new FormValidator(this.uploadForm);
    this.dataLoader = dataLoader;

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

  #resetForm(evt) {
    evt?.preventDefault();

    this.uploadForm.reset();
    if (this.callbacks.has('reset')) {
      this.callbacks.get('reset')();
    }
  }

  async #trySubmitFormIfValid(target) {
    if (this.validator.validate()) {
      this.#beginUploading();

      try {
        const formData = new FormData(target)
        const result = await this.dataLoader.saveData(formData);
        if (result) {
          this.messageManager.showSuccessMessage();
          this.#resetForm();
        } else {
          this.messageManager.showErrorMessage();
        }
      }
      catch (error) {
        this.messageManager.showErrorMessage();
      } finally {
        this.#endUploading();
      }
    }
  }

  on(messageKind, callback) {
    if (this.callbacks.has(messageKind)) {
      this.callbacks.delete(messageKind);
    }

    this.callbacks.set(messageKind, callback);
  }

  subscribe() {
    this.uploadForm.addEventListener('submit', this.onFormSubmit);
    this.resetButton.addEventListener('click', this.#resetForm.bind(this))
  }

  unsubscribe() {
    this.uploadForm.removeEventListener('submit', this.onFormSubmit);
    this.resetButton.removeEventListener('click', this.#resetForm.bind(this))
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
