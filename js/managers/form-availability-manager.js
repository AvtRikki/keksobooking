export class FormAvailabilityManager {
  #DISABLED_STATE_NAME = 'disabled';

  constructor(adClassName, filterClassName) {
    this.adClassName = adClassName;
    this.filterClassName = filterClassName;
  }

  #setBlockInactiveState(className) {
    const block = document.querySelector(`.${className}`);
    if (block) {
      block.classList.add(`${className}--${this.#DISABLED_STATE_NAME}`);
      for (let i = 0; i < block.children.length; i++) {
        const child = block.children[i];
        child.setAttribute(this.#DISABLED_STATE_NAME, 'true');
      }
    }
  }

  #setBlockActiveState(className) {
    const block = document.querySelector(`.${className}`);
    if (block) {
      block.classList.remove(`${className}--${this.#DISABLED_STATE_NAME}`);
      for (let i = 0; i < block.children.length; i++) {
        const child = block.children[i];
        child.removeAttribute(this.#DISABLED_STATE_NAME);
      }
    }
  }

  setInactive() {
    this.#setBlockInactiveState(this.adClassName);
    this.#setBlockInactiveState(this.filterClassName);
  }

  setActive() {
    this.#setBlockActiveState(this.adClassName);
    this.#setBlockActiveState(this.filterClassName);
  }
}
