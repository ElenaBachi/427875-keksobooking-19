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

  var addressInput = advertForm.querySelector('#address');

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

  window.map = {
    activate: function () {
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
    },
  };

  var pinHadnle = map.querySelector('.map__pin--main');

  pinHadnle.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      pinHadnle.style.top = (pinHadnle.offsetTop - shift.y) + 'px';
      pinHadnle.style.left = (pinHadnle.offsetLeft - shift.x) + 'px';

      addressInput.value = (parseInt(pinHadnle.style.top, 10) + window.data.MarkerSize.ACTIVE_PIN_HEIGTH) + ', ' + (parseInt(pinHadnle.style.left, 10) + window.data.MarkerSize.ACTIVE_PIN_WIDTH / 2);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
