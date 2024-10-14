export class MapManager {
  #MAIN_MARKER_URL = './img/main-pin.svg';
  #MAIN_MARKER_SIZE = [52, 52];
  #MAIN_MAEKER_ANCHOR = [26, 52];

  #SECONDARY_MARKER_URL = './img/pin.svg';
  #SECONDARY_MARKER_SIZE = [40, 40];
  #SECONDARY_MARKER_ANCHOR = [20, 40];


  constructor(initPosition, initZoomLevel) {
    this.initPosition = initPosition;
    this.initZoomLevel = initZoomLevel;
  }

  #createMainMarker(map) {
    const mainMarkerIcon = L.icon({
      iconUrl: this.#MAIN_MARKER_URL,
      iconSize: this.#MAIN_MARKER_SIZE,
      iconAnchor: this.#MAIN_MAEKER_ANCHOR
    });

    const mainMarker = L.marker(
      this.initPosition, {
        draggable: true,
        icon: mainMarkerIcon
      }
    );

    mainMarker.addTo(map)

    return mainMarker;
  }

  #createSecondaryMarkers(map, offerInfos, offerRenderer) {
    const markerGroup = L.layerGroup().addTo(map);

    const secondaryMarkerIcon = L.icon({
      iconUrl: this.#SECONDARY_MARKER_URL,
      iconSize: this.#SECONDARY_MARKER_SIZE,
      iconAnchor: this.#SECONDARY_MARKER_ANCHOR
    })

    offerInfos.forEach(info => {
      const marker = L.marker({
          lat: info.location.lat,
          lng: info.location.lng
        }, {
          icon: secondaryMarkerIcon,
        },
      );

      marker
        .addTo(markerGroup)
        .bindPopup(offerRenderer.renderOffer(info));
    })
  }

  render(mapId) {
    return new Promise((resolve) => {
      const map = L.map(mapId);
      map.on('load', () => {
        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>',
          },
        ).addTo(map);

        const mainMarker = this.#createMainMarker(map);
        resolve({
          map,
          marker: mainMarker
        });
      });
      map.setView(this.initPosition, this.initZoomLevel);
    });
  }

  renderOffers(map, offerInfos, offerRenderer) {
    this.#createSecondaryMarkers(map, offerInfos, offerRenderer);
  }
}
