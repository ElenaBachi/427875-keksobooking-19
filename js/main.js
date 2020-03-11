'use strict';

var map = document.querySelector('.map');

var advertForm = document.querySelector('.ad-form');
var advertFormInputs = advertForm.querySelectorAll('input');
var advertFormSelects = advertForm.querySelectorAll('select');
var advertFormTextarea = advertForm.querySelector('textarea');
var advertFormButtons = advertForm.querySelectorAll('button');

var activatePageButton = document.querySelector('.map__pin--main');
var addressInput = advertForm.querySelector('#address');

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
var ESC_KEY = 'Escape';

var MarkerSize = {
  INACTIVE_PIN_WIDTH: 65,
  INACTIVE_PIN_HEIGTH: 65,
  ACTIVE_PIN_WIDTH: 50,
  ACTIVE_PIN_HEIGTH: 70,
};

var MarkerCoordinate = {
  INACTIVE_PIN_LEFT: parseInt(mapWidth, 10) / 2 - (MarkerSize.INACTIVE_PIN_WIDTH / 2),
  INACTIVE_PIN_TOP: parseInt(mapHeight, 10) / 2 - (MarkerSize.INACTIVE_PIN_HEIGTH / 2),
  ACTIVE_PIN_LEFT: parseInt(mapWidth, 10) / 2 + (MarkerSize.ACTIVE_PIN_WIDTH / 2),
  ACTIVE_PIN_TOP: parseInt(mapHeight, 10) / 2 + (MarkerSize.ACTIVE_PIN_HEIGTH),
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

// Для заполнения карточки объявления
var POPUP_CLASS = {
  TITLE: '.popup__title',
  PRICE: '.popup__text--price',
  TYPE: '.popup__type',
  CAPACITY: '.popup__text--capacity',
  TIME: '.popup__text--time',
  FEATURES: '.popup__features',
  DESCRIPTION: '.popup__description',
  PHOTOS: '.popup__photos',
  PHOTO: '.popup__photo',
  AVATAR: '.popup__avatar'
};

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

/* ------------------ module3-task3 ------------------ */

// Шаблон карточки объявления
var advertCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

// Функция создания карточки объявления на основе шаблона
var renderAdvertCard = function (adsItem, cardTemplate) {
  var cardElement = cardTemplate.cloneNode(true);

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

  var popupFeatures = cardElement.querySelector('.popup__features');

  // Функция удаляет элементы списка (нужно для FEATURES)
  var deleteItemFromList = function (list, item) {
    var collection = list.querySelectorAll(item);

    collection.forEach(function (it, y) {
      list.removeChild(collection[y]);
    });
  };

  // Функция добавляет элементы списка
  var addItemToList = function (selector, array, parent) {
    var item = document.createElement(selector);
    for (var p = 0; p < array.length; p++) {
      item.textContent = array[p];
      item.className = 'popup__feature popup__feature--' + array[p];
      parent.appendChild(item);
    }
  };

  // Функция удаляет DOM-элемены со страницы
  var deleteElement = function (selector) {
    var element = cardElement.querySelector(selector);

    element.classList.add('visually-hidden');
  };

  // Функция создания галереи изображений
  var createAdvertGallery = function (array, parentSelector, childSelector) {
    var imgGallery = cardElement.querySelector(parentSelector);
    var imgTemplate = imgGallery.querySelector(childSelector);

    for (var c = 0; c < array.length; c++) {
      var advertImg = imgTemplate.cloneNode(true);
      advertImg.src = array[c];
      advertImg.classList.remove('visually-hidden');
      imgGallery.appendChild(advertImg);
    }
  };

  // Удаляет текстовые поля, если нет значений
  var removeUndefinedTextContent = function (popup) {
    var textContentItem = {
      TITLE: cardElement.querySelector('.popup__title'),
      PRICE: cardElement.querySelector('.popup__text--price'),
      TYPE: cardElement.querySelector('.popup__type'),
      CAPACITY: cardElement.querySelector('.popup__text--capacity'),
      TIME: cardElement.querySelector('.popup__text--time'),
      DESCRIPTION: cardElement.querySelector('.popup__description')
    };

    var textContentList = Object.values(textContentItem);

    textContentList.forEach(function (item, j) {
      if (textContentList[j].textContent === undefined) {
        item[j].classList.add('visually-hidden');
      }
    });

    return popup;
  };

  cardElement.querySelector(POPUP_CLASS.TITLE).textContent = adsItem.offer.title;
  cardElement.querySelector(POPUP_CLASS.PRICE).textContent = toString(adsItem.offer.price) + '₽/ночь';
  cardElement.querySelector(POPUP_CLASS.TYPE).textContent = translateHouseType(adsItem.offer.type);
  cardElement.querySelector(POPUP_CLASS.CAPACITY).textContent = toString(adsItem.offer.rooms) + ' комнаты для ' + toString(adsItem.offer.guests) + 'гостей';
  cardElement.querySelector(POPUP_CLASS.TIME).textContent = 'Заезд после ' + toString(adsItem.offer.checkin) + ', выезд до' + toString(adsItem.offer.checkout);

  deleteItemFromList(popupFeatures, 'li');
  addItemToList('li', adsItem.offer.features, popupFeatures);

  cardElement.querySelector(POPUP_CLASS.DESCRIPTION).textContent = adsItem.offer.description;

  deleteElement(POPUP_CLASS.PHOTO);
  createAdvertGallery(adsItem.offer.photos, POPUP_CLASS.PHOTOS, POPUP_CLASS.PHOTO);

  cardElement.querySelector(POPUP_CLASS.AVATAR).src = adsItem.author.avatar;

  removeUndefinedTextContent(cardElement);

  return cardElement;
};

var cardFragment = document.createDocumentFragment();

var mapFiltersContainer = document.querySelector('.map__filters-container');


var createAdvertCard = function (item) {
  var cardElement = renderAdvertCard(item, advertCardTemplate);
  cardFragment.appendChild(cardElement);

  mapFiltersContainer.appendChild(cardFragment);
};

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

  addressInput.value = Math.floor(MarkerCoordinate.INACTIVE_PIN_LEFT) + ', ' + Math.floor(MarkerCoordinate.INACTIVE_PIN_TOP);
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

  addressInput.value = Math.floor(MarkerCoordinate.ACTIVE_PIN_LEFT) + ', ' + Math.floor(MarkerCoordinate.ACTIVE_PIN_TOP);

  pinInsertArea.appendChild(fragment);
};

// Обработчик события mousedown
activatePageButton.addEventListener('mousedown', function (evt) {
  if (evt.button !== 0) {
    return;
  } else {
    activateMap();
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
  priceInput.setAttribute('placeholder', 'placeholder');

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

/* ------------------ module4-task3 ------------------ */
// pinInsertArea.appendChild(fragment);
// map.classList.remove('map--faded');

var pins = pinInsertArea.querySelectorAll('.map__pin:not(.map__pin--main)');

pins.forEach(function (it, i) {
  it.addEventListener('click', function () {
    createAdvertCard(advertArray[i]);
  });
});

var popup = mapFiltersContainer.querySelector('.popup');

var popupClose = popup.querySelector('.popup__close');

var closePopup = function () {
  popup.classList.add('hidden');
};

popupClose.addEventListener('click', function () {
  closePopup();
});

popupClose.addEventListener('keydown', function (evt) {
  if (evt.key === ESC_KEY) {
    closePopup();
  }
});
