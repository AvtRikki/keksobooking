import { AdvertisementMockGenerator } from './generators/advertisement-mock-generator.js';
import { SimilarOfferRenderer } from './renderer/similar-offer-renderer.js';
import { FormAvailabilityManager } from './managers/form-availability-manager.js';
import {FormManager} from './managers/form-manager.js';
import {MapManager} from './managers/map-manager.js';
import {SliderRenderer} from './renderer/slider-renderer.js';

const formManager = new FormManager('ad-form');
formManager.subscribe();

const INIT_MAP_POSITION = {
  lat: 35.6895,
  lng: 139.692,
};

const INIT_MAP_ZOOM = 12;

const mapManager = new MapManager(INIT_MAP_POSITION, INIT_MAP_ZOOM);

mapManager.render('map-canvas').then((data) => {
  const mockDataGenerator = new AdvertisementMockGenerator();
  const offerInfos = mockDataGenerator.generate();

  const renderer = new SimilarOfferRenderer('card', 'popup');
  mapManager.renderOffers(data.map, offerInfos, renderer);

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


