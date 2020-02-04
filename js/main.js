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

var locationX = getRandomNumber(0, mapWidth);
var locationY = getRandomNumber(MIN_COORDINATE_Y, MAX_COORDINATE_Y);
var OFFSET_X = 70;
var OFFSET_Y = 70;

var MAX_ARRAY_LENGTH = 8;

var adverts = [];

// Генерирует случайное число между min и max включительно для нахождения locationX, locationY
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

// Создает один объект - описание объявления
var advertDescription = {
  author: {
    avatar: 'img/avatars/user0' + getRandomNumber(1, 8) + '.png'
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

  location: {
    x: locationX,
    y: locationY
  }
};

// Создает массив из 8 объектов
var findAdverts = function () {
  for (var i = 0; i < MAX_ARRAY_LENGTH; i++) {
    adverts += adverts.push(advertDescription);
  }
  return adverts;
};

var map = document.querySelectorAll('.map');
map.classList.remove('map--faded');

var similarListElement = document.querySelector('.map_pins');// Элемент для вставки похожих меток
var similarPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__overlay'); // Шаблон метки

// Функция для внесения изменений в i-ую метку
var renderPins = function () {
  var pinElement = similarPinTemplate.cloneNode(true);
  pinElement.style.left = locationX + OFFSET_X;
  pinElement.style.top = locationY + OFFSET_Y;
  pinElement.querySelectorAll('img').src = adverts[i].author.avatar;
  pinElement.querySelectorAll('img').alt = adverts[i].offer.title;

  return pinElement;
};

// Фрагмент для записи метки - объявления
var fragment = document.createDocumentFragment();
// На каждой итерации цикла складываем метку во фрагмент
for (var i = 0; i < 8; i++) {
  fragment.appendChild(renderPins(adverts[i]));
}
// Отрисовывает все метки на странице
similarListElement.appendChild(fragment);
