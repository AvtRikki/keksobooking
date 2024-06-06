import {  Utils } from '../utils.js';

export class AuthorMockGenerator {
  #MINIMUM_AUTHOR_IDENTITY = 1;
  #authorStore = new Map();

  constructor(maxAuthor) {
    this.maxAuthor = maxAuthor;
  }

  #generateAuthor(identity) {
    const number = identity.toString().padStart(2, '0');
    return {
      avatar: `img/avatars/user${number}.png`
    };
  }

  generateUnique() {
    const identity = Utils.generateUniqueIdentity(this.#MINIMUM_AUTHOR_IDENTITY, this.maxAuthor, this.#authorStore);
    const author = this.#generateAuthor(identity);
    return author;
  }
}
