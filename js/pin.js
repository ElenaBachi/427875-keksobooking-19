'use strict';

(function () {
  var OFFSET_X = window.data.MarkerSize.ACTIVE_PIN_WIDTH / 2;
  var OFFSET_Y = window.data.MarkerSize.ACTIVE_PIN_HEIGTH;

  var pinInsertArea = document.querySelector('.map__pins');

  var createAdvertCard = function (item) {
    var advertCardTemplate = document.querySelector('#card')
      .content
      .querySelector('.popup');

    var cardFragment = document.createDocumentFragment();

    var mapFiltersContainer = document.querySelector('.map__filters-container');
    var cardElement = window.card.renderAdvert(item, advertCardTemplate);
    cardFragment.appendChild(cardElement);

    window.data.map.insertBefore(cardFragment, mapFiltersContainer);

    var cards = window.data.map.querySelectorAll('article');

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

  var renderPin = function (advert, template) {
    var pin = advert;
    var pinElement = template.cloneNode(true);

    pinElement.style.left = pin.location.x + OFFSET_X + 'px';
    pinElement.style.top = pin.location.y + OFFSET_Y + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;

    return pinElement;
  };

  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  var deletePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (pin) {
      if (pin) {
        pin.remove();
      }
    });
  };

  var paintPins = function (pins) {
    var pinFragment = document.createDocumentFragment();
    for (var a = 0; a < pins.length; a++) {
      pinFragment.appendChild(renderPin(pins[a], pinTemplate));
      pinInsertArea.appendChild(pinFragment);
    }

    var pinList = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    var openPopup = function (data) {
      var article = document.querySelector('article');
      if (article) {
        article.remove();
      }
      createAdvertCard(data);
    };

    pinList.forEach(function (it, i) {
      it.addEventListener('click', function () {
        openPopup(pins[i]);
      });
      it.addEventListener('keydown', function (evt) {
        if (evt.key === window.util.ENTER_KEY) {
          openPopup(pins[i]);
        }
      });
    });
  };

  window.pin = {
    delete: deletePins,
    paint: paintPins,
  };
})();
