import {FormValidator} from '../validation/form-validator.js';
import {MessageManager} from './message-manager.js';

export class FormManager {
  #SUPPORTED_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  #COORDINATE_ACCURACY = 5;

  #AVATAR_SUFFIX = '-header__preview';
  #SUBMIT_SUFFIX = '__submit';
  #RESET_SUFFIX = '__reset';
  #PHOTO_SUFFIX = '__photo';
  #TIME_LINE_SUFFIX = '__element--time'

  #AVATAR_SELECTOR = '#avatar'
  #PHOTO_SELECTOR = '#images'
  #TIME_IN_SELECTOR = '#timein'
  #TIME_OUT_SELECTOR = '#timeout'
  #ADDRESS_SELECTOR = '#address'

  #UPLOADING_MESSAGE = 'Загрузка...';

  constructor(formName, dataLoader) {
    this.callbacks = new Map();
    this.avatarChooser = document.querySelector(this.#AVATAR_SELECTOR);
    const avatarHeader = document.querySelector(`.${formName}${this.#AVATAR_SUFFIX}`);
    this.avatarPreview = avatarHeader.querySelector('img');
    this.photoBox = document.querySelector(`.${formName}${this.#PHOTO_SUFFIX}`);
    this.photoChooser =  document.querySelector(this.#PHOTO_SELECTOR);
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
    this.photoBox.innerHTML = '';
    this.avatarPreview.src = 'img/muffin-grey.svg';
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
    this.resetButton.addEventListener('click', this.#resetForm.bind(this));
    this.avatarChooser.addEventListener('change', this.#onChangeAvatar.bind(this));
    this.photoChooser.addEventListener('change', this.#onPhotoAdd.bind(this));
  }

  unsubscribe() {
    this.uploadForm.removeEventListener('submit', this.onFormSubmit);
    this.resetButton.removeEventListener('click', this.#resetForm);
    this.avatarChooser.removeEventListener('change', this.#onChangeAvatar);
    this.photoChooser.removeEventListener('change', this.#onPhotoAdd);
  }

  updateAddress(position) {
    this.address.value = `${(position.lat).toFixed(this.#COORDINATE_ACCURACY)},${(position.lng).toFixed(this.#COORDINATE_ACCURACY)}`;
  }

  #onPhotoAdd() {
    const file = this.photoChooser.files[0];
    const fileName = file.name.toLowerCase();
    const matches = this.#SUPPORTED_FILE_TYPES.some((it) => fileName.endsWith(it));
    if (matches) {
      const image = document.createElement('img');
      image.src = URL.createObjectURL(file);
      image.style.maxWidth = '100%';
      image.style.height = 'auto';
      this.photoBox.appendChild(image);
    }
  }

  #onChangeAvatar() {
    const file = this.avatarChooser.files[0];
    const fileName = file.name.toLowerCase();
    const matches = this.#SUPPORTED_FILE_TYPES.some((it) => fileName.endsWith(it));
    if (matches) {
      this.avatarPreview.src = URL.createObjectURL(file);
    }
  }

  #beginUploading() {
    this.submitButton.disabled = true;
    this.resetButton.disabled = true;
    this.submitButton.textContent = this.#UPLOADING_MESSAGE;
  }

  #endUploading() {
    this.submitButton.disabled = false;
    this.resetButton.disabled = false;
    this.submitButton.textContent = this.submitButtonDefaultName;
  }
}
