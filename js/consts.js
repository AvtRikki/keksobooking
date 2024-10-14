export class Consts {
  static ROOM_TO_GUEST_MAPPING = {
    '1' : '1',
    '2' : ['2', '1'],
    '3' : ['3', '2', '1'],
    '100' : '0',
  }

  static TYPES_OF_HOUSING = {
    'flat': 'Квартира',
    'bungalow': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец',
    'hotel': 'Отель',
  };

  static TYPE_HOUSING_OPTIONS = {
    'bungalow' : '0',
    'flat' : '1000',
    'hotel' : '3000',
    'house' : '5000',
    'palace' : '10000',
  };


  static MAX_RENT_PRICE = 100000;
  static RENT_PRICE_STEP = 1000;
  static MAX_GUESTS_COUNT = 10;
  static MAX_ROOMS_COUNT = 10;
}
