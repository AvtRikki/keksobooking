import {SimilarOfferRenderer} from './renderer/similar-offer-renderer.js';
import {FormAvailabilityManager} from './managers/form-availability-manager.js';
import {FormManager} from './managers/form-manager.js';
import {MapManager} from './managers/map-manager.js';
import {SliderRenderer} from './renderer/slider-renderer.js';
import {DataLoader} from './loaders/data-loader.js';
import {MessageManager} from './managers/message-manager.js';

const dataLoader = new DataLoader('https://25.javascript.htmlacademy.pro/keksobooking');
const formManager = new FormManager('ad-form', dataLoader);
formManager.subscribe();

const INIT_MAP_POSITION = {
  lat: 35.6895,
  lng: 139.692,
};

const INIT_MAP_ZOOM = 12;

const mapManager = new MapManager(INIT_MAP_POSITION, INIT_MAP_ZOOM);
const messageManager = new MessageManager();

mapManager.render('map-canvas').then(async (data) => {
  let offerInfos = null;
  try {
    offerInfos = await dataLoader.loadData();

    if (!offerInfos) {
      messageManager.showAlert('Не удалось загрузить данные с сервера');
    }
  } catch (error) {
    messageManager.showAlert(error);
  }

  if (offerInfos) {
    const renderer = new SimilarOfferRenderer('card', 'popup');
    mapManager.renderOffers(data.map, offerInfos, renderer);
  }

  formManager.on('reset', () => {
    formManager.updateAddress(INIT_MAP_POSITION);
    mapManager.resetState(data);
  });

  formManager.updateAddress(INIT_MAP_POSITION);
  data.marker.on('move', (evt) => {
    const position = evt.target.getLatLng();
    formManager.updateAddress(position);
  });

  const formAvailabilityManager = new FormAvailabilityManager('ad-form', 'map__filters');
  formAvailabilityManager.setActive();

  const slider = new SliderRenderer('ad-form');
  slider.render(formManager.validator);
});


