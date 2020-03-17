'use strict';

(function () {
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

  var accomodation = {
    bungalo: 'бунгало',
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
  };

  var deleteItemFromList = function (list, item) {
    var collection = list.querySelectorAll(item);

    collection.forEach(function (it, y) {
      list.removeChild(collection[y]);
    });
  };

  var addItemToList = function (selector, array, parent) {
    var item = document.createElement(selector);
    for (var p = 0; p < array.length; p++) {
      item.textContent = array[p];
      item.className = 'popup__feature popup__feature--' + array[p];
      parent.appendChild(item);
    }
  };

  var deleteElement = function (element, selector) {
    var elementDelete = element.querySelector(selector);

    elementDelete.classList.add('visually-hidden');
  };

  var createAdvertGallery = function (element, array, parentSelector, childSelector) {
    var imgGallery = element.querySelector(parentSelector);
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
      TITLE: popup.querySelector('.popup__title'),
      PRICE: popup.querySelector('.popup__text--price'),
      TYPE: popup.querySelector('.popup__type'),
      CAPACITY: popup.querySelector('.popup__text--capacity'),
      TIME: popup.querySelector('.popup__text--time'),
      DESCRIPTION: popup.querySelector('.popup__description')
    };

    var textContentList = Object.values(textContentItem);

    textContentList.forEach(function (item, j) {
      if (textContentList[j].textContent === undefined) {
        item[j].classList.add('visually-hidden');
      }
    });

    return popup;
  };

  window.card = {
    renderAdvert: function (adsItem, cardTemplate) {
      var cardElement = cardTemplate.cloneNode(true);

      var popupFeatures = cardElement.querySelector('.popup__features');

      cardElement.querySelector(POPUP_CLASS.TITLE).textContent = adsItem.offer.title;
      cardElement.querySelector(POPUP_CLASS.PRICE).textContent = toString(adsItem.offer.price) + '₽/ночь';
      cardElement.querySelector(POPUP_CLASS.TYPE).textContent = accomodation[adsItem.offer.type];
      cardElement.querySelector(POPUP_CLASS.CAPACITY).textContent = toString(adsItem.offer.rooms) + ' комнаты для ' + toString(adsItem.offer.guests) + 'гостей';
      cardElement.querySelector(POPUP_CLASS.TIME).textContent = 'Заезд после ' + toString(adsItem.offer.checkin) + ', выезд до' + toString(adsItem.offer.checkout);

      deleteItemFromList(popupFeatures, 'li'); addItemToList('li', adsItem.offer.features, popupFeatures);

      cardElement.querySelector(POPUP_CLASS.DESCRIPTION).textContent = adsItem.offer.description;

      deleteElement(cardElement, POPUP_CLASS.PHOTO);
      createAdvertGallery(cardElement, adsItem.offer.photos, POPUP_CLASS.PHOTOS, POPUP_CLASS.PHOTO);

      cardElement.querySelector(POPUP_CLASS.AVATAR).src = adsItem.author.avatar;

      removeUndefinedTextContent(cardElement);

      return cardElement;
    },
  };
})();
