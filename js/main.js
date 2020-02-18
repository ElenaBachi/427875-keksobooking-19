'use strict';

var map = document.querySelector('.map');

var advertForm = document.querySelector('.ad-form');
var advertFormInputs = advertForm.querySelectorAll('input');
var advertFormSelects = advertForm.querySelectorAll('select');
var advertFormTextarea = advertForm.querySelector('textarea');
var advertFormButtons = advertForm.querySelectorAll('button');

var activatePageButton = document.querySelector('.map__pin--main');

// Validation
var roomNumber = advertForm.querySelector('#room_number');
var guestAmount = advertForm.querySelector('#capacity');
var checkin = advertForm.querySelector('#timein');
var checkout = advertForm.querySelector('#timeout');
var priceInput = advertForm.querySelector('#price');
var accomodationType = advertForm.querySelector('#type');
var advertTitleInput = advertForm.querySelector('#title');

// Находит ширину карты
var mapComputedStyle = getComputedStyle(map);

var mapWidth = mapComputedStyle.width;
var mapHeight = mapComputedStyle.height;

var ENTER_KEY = 'Enter';

var MarkerSize = {
  INACTIVE_PIN_WIDTH: 65,
  INACTIVE_PIN_HEIGTH: 65,
  ACTIVE_PIN_WIDTH: 50,
  ACTIVE_PIN_HEIGTH: 70,
};

var MarkerCoordinate = {
  INACTIVE_PIN_LEFT: parseInt(mapWidth / 2 - MarkerSize.INACTIVE_PIN_WIDTH / 2, 10),
  INACTIVE_PIN_TOP: parseInt(mapHeight / 2 - MarkerSize.INACTIVE_PIN_HEIGTH / 2, 10),
  // ACTIVE_PIN_LEFT: ???,
  // ACTIVE_PIN_TOP: ???,
};

var options = {
  MIN_PRICE_PER_NIGHT: 0,
  MAX_PRICE_PER_NIGHT: 10000,
  MIN_ROOM_QUANTITY: 1,
  MAX_ROOM_QUANTITY: 3,
  MIN_GUEST_QUANTITY: 1,
  MAX_GUEST_QUANTITY: 3,
  MIN_COORDINATE_Y: 130,
  MAX_COORDINATE_Y: 630,
  OFFSET_X: MarkerSize.ACTIVE_PIN_WIDTH / 2,
  OFFSET_Y: MarkerSize.ACTIVE_PIN_HEIGTH,

  MAX_ARRAY_LENGTH: 8
};

var houseTypes = ['palace', 'flat', 'house', 'bungalo'];

var prices = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

var checkinTimes = ['12:00', '13:00', '14:00'];
var checkoutTimes = ['12:00', '13:00', '14:00'];

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
      price: getRandomNumber(options.MIN_PRICE_PER_NIGHT, options.MAX_PRICE_PER_NIGHT),
      type: getRandomArrayElement(houseTypes),
      rooms: getRandomNumber(options.MIN_ROOM_QUANTITY, options.MAX_ROOM_QUANTITY),
      guests: getRandomNumber(options.MIN_GUEST_QUANTITY, options.MAX_GUEST_QUANTITY),
      checkin: getRandomArrayElement(checkinTimes),
      checkout: getRandomArrayElement(checkoutTimes),
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

/* ------------------ module3-task3 ------------------ */
/*
// Шаблон карточки объявления
var advertCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

// Функция создания карточки объявления на основе шаблона
var renderAdvertCard = function (arrayElement) {
  var cardElement = advertCardTemplate.cloneNode(true);

  var firstAdvert = advertArray[0];

  // Функция проверяет значение объекта размещения, заменяя его на значения на рус. яз.
  var translateHouseType = function (type) {
    var accomodation = {
      bungalo: 'бунгало',
      palace: 'Дворец',
      flat: 'Квартира',
      house: 'Дом',
    };

    return accomodation[type];
  };

  // Функция добавления предоставляемых удобств
  var showFeatures = function () {
    var popupFeatures = advertCardTemplate.querySelector('.popup__features');
    var feature = {
      wifi: popupFeatures.querySelector('.popup__feature--wifi'),
      dishwasher: popupFeatures.querySelector('.popup__feature--dishwasher'),
      parking: popupFeatures.querySelector('.popup__feature--parking'),
      washer: popupFeatures.querySelector('.popup__feature--washer'),
      elevator: popupFeatures.querySelector('.popup__feature--elevator'),
      conditioner: popupFeatures.querySelector('.popup__feature--conditioner'),
    };

    for (var b = 0; b < firstAdvert.offer.features.length; b++) {
      if (firstAdvert.offer.features.includes(firstAdvert.offer.features[b]) && firstAdvert.offer.features[b] === 'wifi') {
        feature.wifi.innerHTML = firstAdvert.offer.features[b];
      } else if (firstAdvert.offer.features.includes(firstAdvert.offer.features[b]) && firstAdvert.offer.features[b] === 'dishwasher') {
        feature.dishwasher.innerHTML = firstAdvert.offer.features[b];
      } else if (firstAdvert.offer.features.includes(firstAdvert.offer.features[b]) && firstAdvert.offer.features[b] === 'parking') {
        feature.parking.innerHTML = firstAdvert.offer.features[b];
      } else if (firstAdvert.offer.features.includes(firstAdvert.offer.features[b]) && firstAdvert.offer.features[b] === 'washer') {
        feature.washer.innerHTML = firstAdvert.offer.features[b];
      } else if (firstAdvert.offer.features.includes(firstAdvert.offer.features[b]) && firstAdvert.offer.features[b] === 'elevator') {
        feature.elevator.innerHTML = firstAdvert.offer.features[b];
      } else if (firstAdvert.offer.features.includes(firstAdvert.offer.features[b]) && firstAdvert.offer.features[b] === 'conditioner') {
        feature.conditioner.innerHTML = firstAdvert.offer.features[b];
      } else if (firstAdvert.offer.features.includes(firstAdvert.offer.features[b]) === false) {
        feature.firstAdvert.offer.features[b].style.display = 'none';
      }
    }
  };

  // Функция создания галереи изображений
  var createAdvertGallery = function () {
    var imgGallery = advertCardTemplate.querySelector('.popup__photos');
    var imgTemplate = imgGallery.querySelector('img');
    var advertImg = imgTemplate.cloneNode(true);

    for (var c = 0; c < firstAdvert.offer.photos.length; c++) {
      advertImg.src = firstAdvert.offer.photos[c];
      imgGallery.appendChild(advertImg);
    }
  };

  cardElement.querySelector('.popup__title').textContent = arrayElement.offer.title;
  cardElement.querySelector('.popup__text--price').textContent = toString(arrayElement.offer.price) + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = translateHouseType(arrayElement.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = toString(arrayElement.offer.rooms) + ' комнаты для ' + toString(arrayElement.offer.guests) + 'гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + toString(arrayElement.offer.checkin) + ', выезд до' + toString(arrayElement.offer.checkout);


  cardElement.querySelector('.popup__features').innerHTML = showFeatures();

  cardElement.querySelector('.popup__description').textContent = arrayElement.offer.description;

  cardElement.querySelector('.popup__photos').innerHTML = createAdvertGallery();

  cardElement.querySelectorAll('.popup__avatar').src = arrayElement.author.avatar;

  return cardElement;
};

var cardFragment = document.createDocumentFragment();

cardFragment.appendChild(renderAdvertCard(advertArray[0]));

var mapFiltersContainer = document.querySelector('.map__filters-container');

mapFiltersContainer.insertAdjacentHTML('beforebegin', cardFragment); */

/* ------------------ module4-task2 ------------------ */

var deactivateMap = function () {
  advertFormInputs.forEach(function (item) {
    item.setAttribute('disabled', 'disabled');
  });
  advertFormSelects.forEach(function (item) {
    item.setAttribute('disabled', 'disabled');
  });
  advertFormButtons.forEach(function (item) {
    item.setAttribute('disabled', 'disabled');
  });
  advertFormTextarea.setAttribute('disabled', 'disabled');

  activatePageButton.style.left = MarkerCoordinate.INACTIVE_PIN_LEFT + 'px';
  activatePageButton.style.top = MarkerCoordinate.INACTIVE_PIN_TOP + 'px';
};

deactivateMap();

// Функция активирует карту
var activateMap = function () {
  map.classList.remove('map--faded');
  advertForm.classList.remove('ad-form--disabled');

  advertFormInputs.forEach(function (item) {
    item.removeAttribute('disabled', 'disabled');
  });

  advertFormSelects.forEach(function (item) {
    item.removeAttribute('disabled', 'disabled');
  });

  advertFormButtons.forEach(function (item) {
    item.removeAttribute('disabled', 'disabled');
  });

  advertFormTextarea.removeAttribute('disabled', 'disabled');

  // activatePageButton.style.left = ???;
  // activatePageButton.style.top = ???;
};

// Обработчик события mousedown
activatePageButton.addEventListener('mousedown', function (evt) {
  if (typeof evt === 'object') {
    switch (evt.activatePageButton) {
      case 0:
        activateMap();
        break;
    }
  }
});

// Обработчик события keydown для взаимодействия с клавиатуры
activatePageButton.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    activateMap();
  }
});

// Устанавливает соответствие между временем заезда и отъезда
var roomAmountChangeHandler = function (evt) {
  checkin.value = evt.target.value;
  checkout.value = evt.target.value;
};

advertForm.addEventListener('change', roomAmountChangeHandler);

// Проверка соответствия количества гостей и количества комнат
var checkRoomCapacity = function () {
  if (roomNumber.value !== guestAmount.value) {

    if (roomNumber.value === '1') {
      guestAmount.setCustomValidity('Выбранный вариант размещения доступен только для 1 гостя');
    } else if (roomNumber.value === '2' && guestAmount.value > '2') {
      guestAmount.setCustomValidity('Выбранный вариант размещения доступен только для 2 гостей или для 1 гостя');
    } else if (roomNumber.value === '100') {
      guestAmount.setCustomValidity('К сожалению, объектов с выбранными условиями на данный момент нет. Просим рассмотреть доступные варианты размещения.');
    }

  }
};

roomNumber.addEventListener('change', checkRoomCapacity);

// Валидация заголовка объявления
var advertTitleValidation = function () {
  if (advertTitleInput.validity.tooShort) {
    advertTitleInput.setCustomValidity('Заголовок объявления должен состоять минимум из 30-ти символов');
  } else if (advertTitleInput.validity.tooLong) {
    advertTitleInput.setCustomValidity('Заголовок объявления не должен превышать 100 символов');
  } else if (advertTitleInput.validity.valueMissing) {
    advertTitleInput.setCustomValidity('Обязательное поле');
  } else {
    advertTitleInput.setCustomValidity('');
  }
};

advertTitleInput.addEventListener('invalid', advertTitleValidation);

// Валидация стоимости
var priceValidation = function () {
  if (priceInput.validity.rangeOverflow) {
    priceInput.setCustomValidity('Максимально допустимое значение 1 000 000');
  } else if (priceInput.validity.typeMismatch) {
    priceInput.setCustomValidity('Введите числовое значение');
  } else if (priceInput.validity.valueMissing) {
    priceInput.setCustomValidity('Обязательное поле');
  } else {
    priceInput.setCustomValidity('');
  }
};

priceInput.addEventListener('invalid', priceValidation);

// Соответствие типа жилья и стоимости за ночь
var syncRoomPrice = function () {
  if (accomodationType.value === 'bungalo') {
    priceInput.min = prices.bungalo;
    priceInput.placeholder = prices.bungalo;
  } else if (accomodationType.value === 'flat') {
    priceInput.min = prices.flat;
    priceInput.placeholder = prices.flat;
  } else if (accomodationType.value === 'house') {
    priceInput.min = prices.house;
    priceInput.placeholder = prices.house;
  } else {
    priceInput.min = prices.palace;
    priceInput.placeholder = prices.palace;
  }
};

accomodationType.addEventListener('change', syncRoomPrice);
