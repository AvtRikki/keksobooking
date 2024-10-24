import {Consts} from '../consts.js';

export class SliderRenderer {
  #SLIDER_SUFFIX = '__slider';
  #RESET_SUFFIX = '__reset';

  constructor(formName) {
    this.sliderClassName = `.${formName}${this.#SLIDER_SUFFIX}`;
    this.resetButtonClassName = `.${formName}${this.#RESET_SUFFIX}`;

    this.slider = document.querySelector(this.sliderClassName);
    this.resetButton = document.querySelector(this.resetButtonClassName);
    this.uploadForm = document.querySelector(`.${formName}`);
    this.typeHousing = this.uploadForm.querySelector('[name="type"]');
    this.price = this.uploadForm.querySelector('[name="price"]');
  }

  render(validator) {
    if (this.slider) {
      noUiSlider.create(this.slider, {
        range: {
          min: 0,
          max: Consts.MAX_RENT_PRICE
        },
        start: Consts.TYPE_HOUSING_OPTIONS[this.typeHousing.value],
        step: Consts.RENT_PRICE_STEP,
        connect: 'lower',
        format: {
          to: function (value) {
            return value.toFixed(0);
          },
          from: function (value) {
            return parseFloat(value);
          },
        },
      });

      this.slider.noUiSlider.on('slide', () => {
        this.price.value = this.slider.noUiSlider.get();
        validator.validate(this.price);
      })

      this.price.addEventListener('change', (evt) => {
        this.slider.noUiSlider.set(this.price.value)
      })

      this.typeHousing.addEventListener('change', (evt) => {
        const type = evt.target.value;
        if (Consts.TYPE_HOUSING_OPTIONS[type]) {
          this.slider.noUiSlider.updateOptions({
            range: {
              min: Number(Consts.TYPE_HOUSING_OPTIONS[type]),
              max:  Consts.MAX_RENT_PRICE,
            },
            step: Consts.RENT_PRICE_STEP,
          })
        }
      });

      this.resetButton.addEventListener('click', this.reset.bind(this));
    }
  }

  reset() {
    this.slider.noUiSlider.reset();
  }
}
