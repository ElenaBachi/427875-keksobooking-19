'use strict';

(function () {
  var advertForm = document.querySelector('.ad-form');

  var roomNumber = advertForm.querySelector('#room_number');
  var guestAmount = advertForm.querySelector('#capacity');
  var checkin = advertForm.querySelector('#timein');
  var checkout = advertForm.querySelector('#timeout');
  var priceInput = advertForm.querySelector('#price');
  var accomodationType = advertForm.querySelector('#type');
  var advertTitleInput = advertForm.querySelector('#title');

  var prices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };

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
})();
