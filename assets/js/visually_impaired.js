//версия для слабовидящих
$(function () {
  $('.impaired-btn').on('click', function () {
    var isImpaired = getCookie('impaired');
    if (!!isImpaired) {
      deleteCookie('impaired');
      $('body').removeClass('impaired');
      $(this).text('Перейти на версию для слабовидящих');
    } else {
      var yearExpires = 31536000;
      setCookie('impaired', '1', {
        path: '/',
        expires: yearExpires
      });
      $('body').addClass('impaired');
      $(this).text('Перейти на стандартную версию');
    }

    window.location.reload();
  });
});

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    path: '/',
    expires: -1
  });
}

