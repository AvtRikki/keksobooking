export class SimilarOfferRenderer {
  #OFFER_TITLE_SUFFIX = '__title';
  #OFFER_ADDRESS_SUFFIX = '__text--address';
  #OFFER_PRICE_SUFFIX = '__text--price';
  #OFFER_TYPE_SUFFIX = '__type';
  #OFFER_CAPACITY_SUFFIX = '__text--capacity';
  #OFFER_TIME_SUFFIX = '__text--time';
  #OFFER_FEATURES_SUFFIX = '__features';
  #OFFER_FEATURE_SUFFIX = '__feature';
  #OFFER_DESCRIPTION_SUFFIX = '__description';
  #OFFER_AVATAR_SUFFIX = '__avatar';
  #OFFER_PHOTOS_SUFFIX = '__photos';
  #OFFER_PHOTO_SUFFIX = '__photo';

  constructor(templateId, templatePartName) {
    this.templateId = templateId;
    this.templatePartName = templatePartName;
  }

  #getTemplate() {
    const template = document.getElementById(this.templateId);
    if (!template) {
      return null;
    }

    const templateContent = template.content;
    return templateContent.querySelector(`.${this.templatePartName}`);
  }

  #getTemplatePart(templateInstance, partSuffix) {
    return templateInstance.querySelector(`.${this.templatePartName}${partSuffix}`);
  }

  #trySetTextContent(part, content) {
    if (content) {
      part.textContent = content;
    } else {
      part.classList.add('visually-hidden');
    }
  }

  #convertOfferTypeToDescription(type) {
    switch (type) {
      case 'flat':
        return 'Квартира';
      case 'bungalow':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      case 'palace':
        return 'Дворец';
      case 'hotel':
        return 'Отель';
      default:
        return '';
    }
  }

  #fillTemplateWithData(templateInstance, offerInfo) {
    const offer = offerInfo.offer;
    const titlePart = this.#getTemplatePart(templateInstance, this.#OFFER_TITLE_SUFFIX);
    this.#trySetTextContent(titlePart, offer.title);

    const addressPart = this.#getTemplatePart(templateInstance, this.#OFFER_ADDRESS_SUFFIX);
    this.#trySetTextContent(addressPart, offer.address);

    const pricePart = this.#getTemplatePart(templateInstance, this.#OFFER_PRICE_SUFFIX);
    if (offer.price) {
      this.#trySetTextContent(pricePart, `${offer.price} ₽/ночь`);
    } else {
      pricePart.classList.add('visually-hidden');
    }

    const typePart = this.#getTemplatePart(templateInstance, this.#OFFER_TYPE_SUFFIX);
    this.#trySetTextContent(typePart, this.#convertOfferTypeToDescription(offer.type));

    const roomsPart = this.#getTemplatePart(templateInstance, this.#OFFER_CAPACITY_SUFFIX);
    if (offer.rooms || offer.guests) {
      let content = '';
      if (offer.rooms) {
        content += `${offer.rooms ?? 0} комнаты`
      }

      if (offer.guests) {
        content += ` для ${offer.guests ?? 0} гостей`;
      }

      this.#trySetTextContent(roomsPart, content.trim());
    } else {
      pricePart.classList.add('visually-hidden');
    }

    const checkPart = this.#getTemplatePart(templateInstance, this.#OFFER_TIME_SUFFIX);
    if (offer.checkin || offer.checkout) {

      let content =  '';
      if (offer.checkin) {
        content += `Заезд после ${offer.checkin},`;
      }

      if (offer.checkout) {
        content += ` выезд до ${offer.checkout}`;
      }
      this.#trySetTextContent(checkPart, content);
    } else {
      checkPart.classList.add('visually-hidden');
    }

    const featuresPart = this.#getTemplatePart(templateInstance, this.#OFFER_FEATURES_SUFFIX);
    if (offer.features.length > 0) {
      for (let feature of featuresPart.children) {
        feature.classList.add('visually-hidden');
      }

      for (let feature of offer.features) {
        const selector = `${this.templatePartName}${this.#OFFER_FEATURE_SUFFIX}--${feature}`;
        const element = featuresPart.querySelector(`.${selector}`);
        if (element) {
          element.classList.remove('visually-hidden');
        }
      }
    } else {
      featuresPart.classList.add('visually-hidden');
    }

    const descriptionPart = this.#getTemplatePart(templateInstance, this.#OFFER_DESCRIPTION_SUFFIX);
    this.#trySetTextContent(descriptionPart, offer.description);

    const avatarPart = this.#getTemplatePart(templateInstance, this.#OFFER_AVATAR_SUFFIX);
    if (offerInfo.author.avatar) {
      avatarPart.scr = offerInfo.author.avatar;
    } else {
      avatarPart.classList.add('visually-hidden');
    }

    const photosPart = this.#getTemplatePart(templateInstance, this.#OFFER_PHOTOS_SUFFIX);
    const photoPart =  this.#getTemplatePart(templateInstance, this.#OFFER_PHOTO_SUFFIX);
    while (photosPart.firstChild) {
      photosPart.removeChild(photosPart.firstChild);
    }

    for (let i = 0; i < offer.photos.length; i++) {
      const photoNode = photoPart.cloneNode(true);
      photoNode.src = offer.photos[i];
      photosPart.appendChild(photoNode);
    }
  }

  render(offersInfo) {
    const template = this.#getTemplate();
    const offersFragments = [];
    for (let i = 0; i < offersInfo.length; i++) {
      const templateInstance = template.cloneNode(true);
      this.#fillTemplateWithData(templateInstance, offersInfo[i])
      offersFragments.push(templateInstance);
    }

    return offersFragments;
  }
}
