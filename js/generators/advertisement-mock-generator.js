import { AuthorMockGenerator } from "./author-mock-generator.js";
import { OfferMockGenerator } from "./offer-mock-generator.js";
import { LocationMockGenerator } from "./location-mock-generator.js";

export class AdvertisementMockGenerator {
  #DEFAULT_ADVERTISEMENT_AMMOUNT = 10;

  generate(amount = this.#DEFAULT_ADVERTISEMENT_AMMOUNT) {
    const result = [];
    const authorGenerator = new AuthorMockGenerator(amount);
    const offerGenerator = new OfferMockGenerator()
    const locationGenerator = new LocationMockGenerator();

    for (let i = 0; i < amount; i++) {
      const author = authorGenerator.generateUnique();
      const location = locationGenerator.generate();
      const offer = offerGenerator.generate();

      result.push( {
        author,
        offer,
        location
      })
    }

    console.log(result);
    return result;
  }
}
