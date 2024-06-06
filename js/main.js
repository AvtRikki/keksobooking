import { AdvertisementMockGenerator } from './generators/advertisement-mock-generator.js';

const mockDataGenerator = new AdvertisementMockGenerator();
// eslint-disable-next-line no-console
console.log(mockDataGenerator.generate());
