'use strict';

var PIN_WIDTH = 50;
var PIN_HEIGTH = 70;

// Находит ширину карты
var map = document.querySelector('.map');
var mapComputedStyle = getComputedStyle(map);
var mapWidth = mapComputedStyle.width;

var options = {
  MIN_PRICE_PER_NIGHT: 0,
  MAX_PRICE_PER_NIGHT: 10000,
  MIN_ROOM_QUANTITY: 1,
  MAX_ROOM_QUANTITY: 3,
  MIN_GUEST_QUANTITY: 1,
  MAX_GUEST_QUANTITY: 3,
  MIN_COORDINATE_Y: 130,
  MAX_COORDINATE_Y: 630,
  OFFSET_X: PIN_WIDTH / 2,
  OFFSET_Y: PIN_HEIGTH,

  MAX_ARRAY_LENGTH: 8
};

var houseType = ['palace', 'flat', 'house', 'bungalo'];

var checkinTime = ['12:00', '13:00', '14:00'];
var checkoutTime = ['12:00', '13:00', '14:00'];

var facilities = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

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
    x: getRandomNumber((0 - options.OFFSET_X), (parseInt(mapWidth, 10) - options.OFFSET_X)),
    y: getRandomNumber(options.MIN_COORDINATE_Y, options.MAX_COORDINATE_Y - options.OFFSET_Y)
  };

  var avatarImgAddress;
  var numOrder = parseInt(i + 1, 10);
  if (numOrder < 10) {
    avatarImgAddress = 'img/avatars/user0' + numOrder + '.png';
  } else if (numOrder >= 10 && numOrder < 100) {
    avatarImgAddress = 'img/avatars/user' + numOrder + '.png';
  }

  return {
    author: {
      avatar: avatarImgAddress
    },

    offer: {
      title: 'строка, заголовок предложения',
      address: location.x + ', ' + location.y,
      price: getRandomNumber(options.MIN_PRICE_PER_NIGHT, options.MAX_PRICE_PER_NIGHT),
      type: getRandomArrayElement(houseType),
      rooms: getRandomNumber(options.MIN_ROOM_QUANTITY, options.MAX_ROOM_QUANTITY),
      guests: getRandomNumber(options.MIN_GUEST_QUANTITY, options.MAX_GUEST_QUANTITY),
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

var createAdvertArray = function () {
  var advertArray = [];
  for (var i = 0; i < options.MAX_ARRAY_LENGTH; i++) {
    var advert = createAdvert(i);
    advertArray.push(advert);
  }
  return advertArray;
};
var advertArray = createAdvertArray();


document.querySelector('.map').classList.remove('map--faded');

// Находит элемент, в который вставляются метки
var pinInsertArea = document.querySelector('.map__pins');
// Шаблог метки
var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

// Функция создает 1 метку на основе шаблона
var renderPin = function (option) {
  var pin = option.pin;
  var template = option.pinTemplate;
  var pinElement = template.cloneNode(true);

  pinElement.style.left = pin.location.x + options.OFFSET_X + 'px';
  pinElement.style.top = pin.location.y + options.OFFSET_Y + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

// Фрагмент для записи метки - объявления
var fragment = document.createDocumentFragment();
// На каждой итерации цикла складываем метку во фрагмент
for (var a = 0; a < advertArray.length; a++) {
  fragment.appendChild(renderPin({
    pin: advertArray[a],
    pinTemplate: pinTemplate,
  }));
}
pinInsertArea.appendChild(fragment);
