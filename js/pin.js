'use strict';

(function () {
  var OFFSET_X = window.data.MarkerSize.ACTIVE_PIN_WIDTH / 2;
  var OFFSET_Y = window.data.MarkerSize.ACTIVE_PIN_HEIGTH;

  window.pin = {
    renderPin: function (advert, template) {
      var pin = advert;
      var pinElement = template.cloneNode(true);

      pinElement.style.left = pin.location.x + OFFSET_X + 'px';
      pinElement.style.top = pin.location.y + OFFSET_Y + 'px';
      pinElement.querySelector('img').src = pin.author.avatar;
      pinElement.querySelector('img').alt = pin.offer.title;

      return pinElement;
    },
  };
})();
