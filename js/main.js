import { AdvertisementMockGenerator } from './generators/advertisement-mock-generator.js';
import { SimilarOfferRenderer } from './generators/similar-offer-renderer.js';
import { FormAvailabilityManager } from './managers/form-availability-manager.js';

const mockDataGenerator = new AdvertisementMockGenerator();
const offerInfos = mockDataGenerator.generate();

const renderer = new SimilarOfferRenderer('card', 'popup');

const fragments = renderer.render(offerInfos);

const map = document.getElementById('map-canvas');
map.appendChild(fragments[0]);

const formAvailabilityManager = new FormAvailabilityManager('ad-form', 'map__filters');
formAvailabilityManager.setInactive();
