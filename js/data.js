'use strict';

(function () {
  // Находит ширину карты
  var map = document.querySelector('.map');

  var mapComputedStyle = getComputedStyle(map);

  var mapWidth = parseInt(mapComputedStyle.width, 10);
  // var mapHeight = parseInt(mapComputedStyle.height, 10);

  var houseTypes = ['palace', 'flat', 'house', 'bungalo'];

  var checkinTimes = ['12:00', '13:00', '14:00'];
  var checkoutTimes = ['12:00', '13:00', '14:00'];

  var facilities = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var photos = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var options = {
    MIN_PRICE_PER_NIGHT: 0,
    MAX_PRICE_PER_NIGHT: 10000,
    MIN_ROOM_QUANTITY: 1,
    MAX_ROOM_QUANTITY: 3,
    MIN_GUEST_QUANTITY: 1,
    MAX_GUEST_QUANTITY: 3,
    MIN_COORDINATE_Y: 130,
    MAX_COORDINATE_Y: 630,
    MAX_ARRAY_LENGTH: 8
  };

  var createAdvertArray = function (offsetX, offsetY) {
    var advertArray = [];

    // Функция генерации случайных данных (создание 1 объявления)
    var createAdvert = function (i) {
      var location = {
        x: window.util.getRandomNumber(0, mapWidth),
        y: window.util.getRandomNumber(options.MIN_COORDINATE_Y, options.MAX_COORDINATE_Y)
      };

      var avatarImgAddress;
      var numOrder = parseInt(i + 1, 10);
      if (numOrder < 10) {
        avatarImgAddress = 'img/avatars/user0' + numOrder + '.png';
      } else {
        avatarImgAddress = 'img/avatars/user' + numOrder + '.png';
      }

      return {
        author: {
          avatar: avatarImgAddress
        },

        offer: {
          title: 'строка, заголовок предложения',
          address: location.x + ', ' + location.y,
          price: window.util.getRandomNumber(options.MIN_PRICE_PER_NIGHT, options.MAX_PRICE_PER_NIGHT),
          type: window.util.getRandomArrayElement(houseTypes),
          rooms: window.util.getRandomNumber(options.MIN_ROOM_QUANTITY, options.MAX_ROOM_QUANTITY),
          guests: window.util.getRandomNumber(options.MIN_GUEST_QUANTITY, options.MAX_GUEST_QUANTITY),
          checkin: window.util.getRandomArrayElement(checkinTimes),
          checkout: window.util.getRandomArrayElement(checkoutTimes),
          features: window.util.getArrayRandomLength(facilities),
          description: 'строка с описанием',
          photos: window.util.getArrayRandomLength(photos)
        },

        location: location
      };
    };

    for (var i = 0; i < options.MAX_ARRAY_LENGTH; i++) {
      var advert = createAdvert(i, offsetX, offsetY);
      advertArray.push(advert);
    }
    return advertArray;
  };

  window.data = {
    advertArray: createAdvertArray(),

    MarkerSize: {
      INACTIVE_PIN_WIDTH: 65,
      INACTIVE_PIN_HEIGTH: 65,
      ACTIVE_PIN_WIDTH: 50,
      ACTIVE_PIN_HEIGTH: 70,
    }
  };
})();
