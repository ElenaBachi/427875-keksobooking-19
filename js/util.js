'use strict';

(function () {

  window.util = {
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomArrayElement: function (array) {
      var j = this.getRandomNumber(0, array.length - 1);
      return array[j];
    },
    getArrayRandomLength: function (array) {
      var newLength = this.getRandomNumber(1, array.length);
      var newArrayRandomLength = array.slice(0, newLength);
      return newArrayRandomLength;
    },

    ENTER_KEY: 'Enter',
    ESC_KEY: 'Escape',

    isEscEvent: function (evt, action) {
      if (evt.key === this.ESC_KEY) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.key === this.ENTER_KEY) {
        action();
      }
    }
  };
})();
