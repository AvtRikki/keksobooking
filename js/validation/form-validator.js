import {Consts} from '../consts.js';

export class FormValidator {
  constructor(form) {
    this.form = form;

    this.pristine = new Pristine(form, {
      classTo: 'ad-form__element',
      errorTextParent: 'ad-form__element',
    });

    this.roomNumbers = form.querySelector('[name="rooms"]');
    this.capacity = form.querySelector('[name="capacity"]');
    this.typeHousing = form.querySelector('[name="type"]');
    this.price = form.querySelector('[name="price"]');

    this.pristine.addValidator(this.roomNumbers, this.#validateRoomNumbers.bind(this), this.#getRoomNumbersValidationMessage.bind(this));
    this.pristine.addValidator(this.price, this.#validatePrice.bind(this), this.#getPriceValidationMessage.bind(this));

    this.typeHousing.addEventListener('change', () => {
      this.price.placeholder = Consts.TYPE_HOUSING_OPTIONS[this.typeHousing.value];
      this.pristine.validate(this.price);
    });

    this.capacity.addEventListener('change', () => {
      this.pristine.validate(this.roomNumbers)
    });
  }

  #validateRoomNumbers() {
    return Consts.ROOM_TO_GUEST_MAPPING[this.roomNumbers.value].includes(this.capacity.value);
  }

  #getRoomNumbersValidationMessage() {
    if (this.roomNumbers.value === '100') {
      return '100 комнат не для гостей';
    } if (this.capacity.value === '0') {
      return `В ${this.roomNumbers.value} ${this.roomNumbers.value === '1' ? 'комнате' : 'комнатах'} должен кто то проживать`;
    } else {
      return `В
        ${this.roomNumbers.value} ${this.roomNumbers.value === '1' ? 'комнате' : 'комнатах'} нельзя разместить
        ${this.capacity.value.toLowerCase()} гостей`;
    }
  }

  #validatePrice(value) {
    const cost = parseInt(value, 10);
    const minPrice = Number(Consts.TYPE_HOUSING_OPTIONS[this.typeHousing.value] || 0);

    return cost && (cost >= minPrice);
  }

  #getPriceValidationMessage () {
    const type = this.form.querySelector('[name="type"]');
    return `Выберете цену от ${Consts.TYPE_HOUSING_OPTIONS[type.value]} до 100000`;
  }

  reset() {
    this.pristine.reset();
    this.pristine.destroy();
  }

  validate() {
    return this.pristine.validate();
  }
}
