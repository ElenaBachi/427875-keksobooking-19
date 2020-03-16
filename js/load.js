'use strict';

window.load(function (response) {
  console.log(response);
}, function (error) {
  console.log(error);
});

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var StatusCode = {
    OK: 200
  };

  var send = function (options, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = options.responseType || 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('GET', options.url);
    xhr.send();
  };

  window.load = function (onSuccess, onError) {
    send({method: 'GET', url: URL}, onSuccess, onError);
  };
})();
