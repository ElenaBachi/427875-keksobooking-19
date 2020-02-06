'use strict';

var MIN_PRICE_PER_NIGHT = 0;
var MAX_PRICE_PER_NIGHT = 10000;

var houseType = ['palace', 'flat', 'house', 'bungalo'];

var MIN_ROOM_QUANTITY = 1;
var MAX_ROOM_QUANTITY = 3;

var MIN_GUEST_QUANTITY = 1;
var MAX_GUEST_QUANTITY = 3;

var checkinTime = ['12:00', '13:00', '14:00'];
var checkoutTime = ['12:00', '13:00', '14:00'];

var facilities = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var MIN_COORDINATE_Y = 130;
var MAX_COORDINATE_Y = 630;

var mapWidth = document.querySelector('.map').style.width;

var OFFSET_X = 50;
var OFFSET_Y = 70;

var MAX_ARRAY_LENGTH = 8;

// Генерирует случайное число между min и max включительно
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция поиска случайного элемента массива
var getRandomArrayElement = function (array) {
  var j = getRandomNumber(0, array.length - 1);
  return array[j];
};

// Функция создания массива случайной длинны
var getArrayRandomLength = function (array) {
  var newLength = getRandomNumber(1, array.length);
  var newArrayRandomLength = array.slice(0, newLength);
  return newArrayRandomLength;
};

// Функция генерации случайных данных (создание 1 объявления)
var createAdvert = function (i) {
  var location = {
    x: getRandomNumber(0, (mapWidth - OFFSET_X / 2)),
    y: getRandomNumber(MIN_COORDINATE_Y, MAX_COORDINATE_Y - OFFSET_Y)
  };

  return {
    author: {
      avatar: 'img/avatars/user0' + parseInt(i + 1, 10) + '.png'
    },

    offer: {
      title: 'строка, заголовок предложения',
      address: 'location.x' + ',' + ' location.y',
      price: getRandomNumber(MIN_PRICE_PER_NIGHT, MAX_PRICE_PER_NIGHT),
      type: getRandomArrayElement(houseType),
      rooms: getRandomNumber(MIN_ROOM_QUANTITY, MAX_ROOM_QUANTITY),
      guests: getRandomNumber(MIN_GUEST_QUANTITY, MAX_GUEST_QUANTITY),
      checkin: getRandomArrayElement(checkinTime),
      checkout: getRandomArrayElement(checkoutTime),
      features: getArrayRandomLength(facilities),
      description: 'строка с описанием',
      photos: getArrayRandomLength(photos)
    },

    location: location
  };
};

// Массив из 8 объектов
var advertArray = [];
var createAdvertArray = function (array) {
  for (var i = 0; i < MAX_ARRAY_LENGTH; i++) {
    var advert = createAdvert(i);
    array.push(advert);
  }
};
createAdvertArray(advertArray);


document.querySelector('.map').classList.remove('map--faded');

// Находит элемент, в который вставляются метки
var pinInsertArea = document.querySelector('.map_pins');
// Шаблог метки
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

// Функция создает 1 метку на основе шаблона
var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = pin.location.x + OFFSET_X / 2;
  pinElement.style.top = pin.location.y + OFFSET_Y;
  pinElement.querySelectorAll('img').src = pin.avatar;
  pinElement.querySelectorAll('img').alt = pin.title;

  return pinElement;
};

var drawPins = function () {
  var fragment = document.createDocumentFragment(); // Фрагмент для записи метки - объявления

  // На каждой итерации цикла складываем метку во фрагмент
  for (var a = 0; a < advertArray.length; a++) {
    var pin = renderPin(advertArray[a]);
    fragment.appendChild(pin);
  }
  pinInsertArea.appendChild(fragment);
};

drawPins();
