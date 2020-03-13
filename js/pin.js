'use strict';

(function () {
  var activatePageButton = document.querySelector('.map__pin--main');
  var pinInsertArea = document.querySelector('.map__pins');

  var OFFSET_X = window.data.MarkerSize.ACTIVE_PIN_WIDTH / 2;
  var OFFSET_Y = window.data.MarkerSize.ACTIVE_PIN_HEIGTH;

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

  var createPinList = function () {
    var pinFragment = document.createDocumentFragment();
    for (var a = 0; a < window.data.advertArray.length; a++) {
      pinFragment.appendChild(renderPin(window.data.advertArray[a], pinTemplate));
    }
    return pinFragment;
  };

  var openAdvertCard = function () {
    var advertCardTemplate = document.querySelector('#card')
      .content
      .querySelector('.popup');

    var createAdvertCard = function (item) {
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

    var openPopup = function () {
      var pins = pinInsertArea.querySelectorAll('.map__pin:not(.map__pin--main)');

      pins.forEach(function (it, i) {
        it.addEventListener('click', function () {
          var article = document.querySelector('article');
          if (article) {
            article.remove();
          }
          createAdvertCard(window.data.advertArray[i]);
        });
      });
    };

    // Обработчик события mousedown
    activatePageButton.addEventListener('mousedown', function (evt) {
      if (evt.button !== 0) {
        return;
      } else {
        window.map.activate();
        pinInsertArea.appendChild(createPinList());
        openPopup();
      }
    });

    // Обработчик события keydown для взаимодействия с клавиатуры
    activatePageButton.addEventListener('keydown', function (evt) {
      if (evt.key === window.util.ENTER_KEY) {
        window.map.activate();
        pinInsertArea.appendChild(createPinList());
        openPopup();
      }
    });
  };

  openAdvertCard();
})();
