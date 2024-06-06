export class Utils {
  static getRandomValueFromArray(array) {
    if (!Array.isArray(array)) {
      throw new Error('Значение должно быть массивом');
    }

    return array[Math.floor(Math.random() * array.length)];
  }

  static generateUniqueIdentity(minIdentity, maxIdentity, dataStore) {
    let result;
    do {
      result = this.generateRandomNumber(minIdentity, maxIdentity);
    } while(dataStore.has(result));
    return result;
  }

  static generateRandomNumber(min, max) {
    if (min > max) {
      [min, max] = [max, min];
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateRandomFloatingNumber(min, max, precision) {
    if (min > max) {
      [min, max] = [max, min];
    }

    const random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(precision));
  }
}
