export class DataLoader {
  #GET_SUFFIX = 'data';

  constructor(sourceUrl) {
    this.sourceUrl = sourceUrl;
    this.getDataUrl = `${this.sourceUrl}/${this.#GET_SUFFIX}`;
    this.sendDataUrl = this.sourceUrl;
  }

  async loadData() {
    const response = await fetch(this.getDataUrl);
    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  }

  async saveData(formData) {
    const result = await fetch(this.sendDataUrl, {
      method: 'POST',
      body: formData,
    });

    return result.ok;
  }
}
