import {Utils} from '../utils.js';

export class FilterManager {
  #MAX_RESULTS_COUNT = 10;
  #PRICE_RANGE = {
    MIDDLE : 10000,
    HIGH : 50000
  };

  #EMPTY_VALUE = 'any';

  #FEATURES_SELECTOR = 'map__checkbox';
  #TYPE_SELECTOR = '#housing-type';
  #PRICE_SELECTOR = '#housing-price';
  #ROOMS_SELECTOR = '#housing-rooms';
  #GUESTS_SELECTOR = '#housing-guests';

  constructor(className) {
    this.filterForm = document.querySelector(`.${className}`);
    this.housingType = this.filterForm.querySelector(this.#TYPE_SELECTOR);
    this.housingPrice = this.filterForm.querySelector(this.#PRICE_SELECTOR);
    this.housingRooms = this.filterForm.querySelector(this.#ROOMS_SELECTOR);
    this.housingGuests = this.filterForm.querySelector(this.#GUESTS_SELECTOR);
    this.features = this.filterForm.querySelectorAll(`.${this.#FEATURES_SELECTOR}`);
  }

  applyFilter(offerInfos, rendererCallback) {
    this.filterForm.addEventListener('change', Utils.debounce(() => {
      const filteredOffers = this.#getFilteredOffers(offerInfos.slice())
      rendererCallback(filteredOffers)
    }));

    rendererCallback(offerInfos.slice(0, 10));
  }

  resetState() {
    this.filterForm.reset();
  }

  #filterType(offerInfo, type) {
    return type === this.#EMPTY_VALUE || offerInfo.offer.type === type;
  }

  #filterPrice (offerInfo, price) {
    switch (price) {
      case this.#EMPTY_VALUE:
        return true;
      case 'low':
        return offerInfo.offer.price < this.#PRICE_RANGE.MIDDLE;
      case 'middle':
        return offerInfo.offer.price < this.#PRICE_RANGE.HIGH && offerInfo.offer.price > this.#PRICE_RANGE.MIDDLE;
      case 'high':
        return offerInfo.offer.price > this.#PRICE_RANGE.HIGH;
    }
  }

  #filterRooms(offerInfo, rooms) {
    return rooms === this.#EMPTY_VALUE || offerInfo.offer.rooms === Number(rooms);
  }

  #filterGuests (offerInfo, guests) {
    return guests === this.#EMPTY_VALUE || offerInfo.offer.guests === +guests;
  }

  #filterFeatures (offerInfo, features) {
    if (!features.length) {
      return true;
    }

    if (!offerInfo.offer.features) {
      return false;
    }

    return features.every((feature) => offerInfo.offer.features.includes(feature));
  }

  #getFilteredOffers(offerInfos) {
    const selectedType = this.housingType.value;
    const selectedPrice = this.housingPrice.value;
    const selectedRooms = this.housingRooms.value;
    const selectedGuests = this.housingGuests.value;

    const selectedFeatures = [];
    this.features.forEach((featureEl) => {
      if (featureEl.checked) {
        selectedFeatures.push(featureEl.value);
      }
    });

    const result = [];
    for (const offerInfo of offerInfos) {
      if(result.length >= this.#MAX_RESULTS_COUNT) {
        break;
      }

      if (
        this.#filterType(offerInfo, selectedType) &&
        this.#filterPrice(offerInfo, selectedPrice) &&
        this.#filterRooms(offerInfo, selectedRooms) &&
        this.#filterGuests(offerInfo, selectedGuests) &&
        this.#filterFeatures(offerInfo, selectedFeatures)
      ) {
        result.push(offerInfo);
      }
    }

    return result;
  }
}
