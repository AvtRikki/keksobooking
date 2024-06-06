import { Utils } from '../utils.js';

export class LocationMockGenerator {
  generate() {
    return {
      lat: Utils.generateRandomFloatingNumber(35.65000, 35.70000, 5),
      lng: Utils.generateRandomFloatingNumber(139.70000, 139.80000, 5)
    };
  }
}
