'use strict';
(function () {
  var map = document.querySelector('.map');

  var mapComputedStyle = getComputedStyle(map);

  var mapWidth = mapComputedStyle.width;
  var mapHeight = mapComputedStyle.height;

  var advertForm = document.querySelector('.ad-form');

  var advertFormInputs = advertForm.querySelectorAll('input');
  var advertFormSelects = advertForm.querySelectorAll('select');
  var advertFormTextarea = advertForm.querySelector('textarea');
  var advertFormButtons = advertForm.querySelectorAll('button');

  var activatePageButton = document.querySelector('.map__pin--main');
  var addressInput = advertForm.querySelector('#address');

  var pinInsertArea = document.querySelector('.map__pins');

  var advertCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.popup');

  var cardFragment = document.createDocumentFragment();

  var mapFiltersContainer = document.querySelector('.map__filters-container');

  var MarkerCoordinate = {
    INACTIVE_PIN_LEFT: parseInt(mapWidth, 10) / 2 - (window.data.MarkerSize.INACTIVE_PIN_WIDTH / 2),
    INACTIVE_PIN_TOP: parseInt(mapHeight, 10) / 2 - (window.data.MarkerSize.INACTIVE_PIN_HEIGTH / 2),
    ACTIVE_PIN_LEFT: parseInt(mapWidth, 10) / 2 + (window.data.MarkerSize.ACTIVE_PIN_WIDTH / 2),
    ACTIVE_PIN_TOP: parseInt(mapHeight, 10) / 2 + (window.data.MarkerSize.ACTIVE_PIN_HEIGTH),
  };

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
  };

  var createAdvertCard = function (item) {
    var cardElement = window.card.renderAdvert(item, advertCardTemplate);
    cardFragment.appendChild(cardElement);

    map.insertBefore(cardFragment, mapFiltersContainer);

    var cards = map.querySelectorAll('article');

    cards.forEach(function (it) {
      it.querySelector('.popup__close').addEventListener('click', function () {
        it.remove();
      });

      it.addEventListener('keydown', function (evt) {
        if (evt.key === window.util.ESC_KEY) {
          it.remove();
        }
      });
    });
  };

  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  var createPinList = function () {
    var pinFragment = document.createDocumentFragment();
    for (var a = 0; a < window.data.advertArray.length; a++) {
      pinFragment.appendChild(window.pin.renderPin(window.data.advertArray[a], pinTemplate));
    }
    return pinFragment;
  };


  var openPopup = function () {
    var pins = pinInsertArea.querySelectorAll('.map__pin:not(.map__pin--main)');

    pins.forEach(function (it, i) {
      it.addEventListener('click', function () {
        createAdvertCard(window.data.advertArray[i]);
      });
    });
  };

  // Обработчик события mousedown
  activatePageButton.addEventListener('mousedown', function (evt) {
    if (evt.button !== 0) {
      return;
    } else {
      activateMap();
      pinInsertArea.appendChild(createPinList());
      openPopup();
    }
  });

  // Обработчик события keydown для взаимодействия с клавиатуры
  activatePageButton.addEventListener('keydown', function (evt) {
    if (evt.key === window.util.ENTER_KEY) {
      activateMap();
      pinInsertArea.appendChild(createPinList());
      openPopup();
    }
  });
})();
