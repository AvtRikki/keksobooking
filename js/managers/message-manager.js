export class MessageManager {
  #ALERT_SHOW_TIME = 3000;
  #SHOW_ANIMATION_TIME = 10;

  #SUCCESS_ELEMENT_ID = 'success';
  #SUCCESS_PART_ID = 'success';
  #ERROR_ELEMENT_ID = 'error';
  #ERROR_PART_ID = 'error';
  #BUTTON_PART = 'button';

  showAlert (message) {
    const alertContainer = document.createElement('div');
    alertContainer.style.zIndex = '1000';
    alertContainer.style.position = 'fixed';
    alertContainer.style.left = '50%';
    alertContainer.style.top = '50%';
    alertContainer.style.transform = 'translate(-50%, -50%)';
    alertContainer.style.padding = '20px 40px';
    alertContainer.style.fontSize = '20px';
    alertContainer.style.textAlign = 'center';
    alertContainer.style.backgroundColor = '#ff4d4d';
    alertContainer.style.color = 'white';
    alertContainer.style.borderRadius = '10px';
    alertContainer.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
    alertContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    alertContainer.style.opacity = '0';
    alertContainer.textContent = 'Ошибка: ' + message;
    document.body.appendChild(alertContainer);

    setTimeout(() => {
      alertContainer.style.opacity = '1';
      alertContainer.style.transform = 'translate(-50%, -50%) scale(1)';
    }, this.#SHOW_ANIMATION_TIME);

    setTimeout(() => {
      alertContainer.style.opacity = '0';
      alertContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => document.body.removeChild(alertContainer), 500);
    }, this.#ALERT_SHOW_TIME);
  }

  showSuccessMessage() {
    const template = this.#getTemplate(this.#SUCCESS_ELEMENT_ID, this.#SUCCESS_PART_ID)
    const templateInstance = template.cloneNode(true);
    document.body.appendChild(templateInstance);

    document.addEventListener('keydown', this.#onEscKeydown.bind(templateInstance));
    templateInstance.addEventListener('click', this.#removeOnClick.bind(templateInstance));
  }

  showErrorMessage() {
    const template = this.#getTemplate(this.#ERROR_ELEMENT_ID, this.#ERROR_PART_ID)
    const templateInstance = template.cloneNode(true);
    const errorButton = templateInstance.querySelector(`.${this.#ERROR_PART_ID}__${this.#BUTTON_PART}`);

    document.body.appendChild(templateInstance);

    document.addEventListener('keydown', this.#onEscKeydown.bind(templateInstance));
    templateInstance.addEventListener('click', this.#removeOnClick.bind(templateInstance));
    errorButton.addEventListener('click', this.#removeOnClick.bind(templateInstance));
  }

  #removeOnClick(evt) {
    evt.preventDefault();
    this.remove();
  }

  #onEscKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.remove();
    }
  }

  #getTemplate(templateId, templatePartName) {
    const template = document.getElementById(templateId);
    if (!template) {
      return null;
    }

    const templateContent = template.content;
    return templateContent.querySelector(`.${templatePartName}`);
  }
}
