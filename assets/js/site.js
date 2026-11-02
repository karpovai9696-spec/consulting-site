/* Статическая версия сайта ГК «Клиники диализа»: формы без backend. */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function validEmail(value) {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/i.test(value);
  }

  ready(function () {
    var $ = window.jQuery;
    if (!$) return;

    // Оригинальный custom.js отправляет AJAX в WordPress — заменяем на mailto.
    $('.main-form .formbutton').off('click').on('click', function (event) {
      event.preventDefault();
      var form = $(this).closest('.main-form');
      var msg = $.trim(form.find('.msg').val() || '');
      var emailField = form.find('.email');
      var email = emailField.length ? $.trim(emailField.val() || '') : '';
      var name = $.trim(form.find('.name').val() || '');
      var theme = $.trim(form.find('input[name="theme"]').val() || 'Обращение с сайта');

      if (!msg || (emailField.length && !validEmail(email))) {
        form.find('.msg,.email').addClass('error-input');
        return;
      }
      form.find('.msg,.email').removeClass('error-input');

      var body = 'Сообщение: ' + msg +
        (email ? '\nE-mail: ' + email : '') +
        (name ? '\nИмя: ' + name : '');
      var mailto = 'mailto:uk.klinika@mail.ru?subject=' +
        encodeURIComponent(theme) + '&body=' + encodeURIComponent(body);
      var link = document.createElement('a');
      link.href = mailto;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();

      var done = form.nextAll('.w-form-done').eq(0);
      done.find('p').text('Открываем почтовый клиент для отправки обращения. Если он не открылся — напишите на uk.klinika@mail.ru или позвоните +7 (843) 204-19-61.');
      form.nextAll('.w-form-fail').eq(0).hide();
      done.show();
    });

    $('.main-form').on('submit', function (event) {
      event.preventDefault();
      $(this).find('.formbutton').trigger('click');
    });
  });
})();
