$(function () {
    //инициализация lightgallery
    $(".gallery").lightGallery({
        selector: '.light-gallery-item',
        download: false,
    });
});

//раскрытие вакансий
$(function () {
    $(".vakancie-item__more").on('click', function () {
        var item = $(this),
            text = item.text();
        item.text(text === 'Подробнее' ? 'Скрыть' : 'Подробнее')
            .next('.vakancie-item__description-container')
            .find(">.vakancie-item__description")
            .slideToggle();
    });
});

//init yandex map
$(function () {
    if (window.ymaps) {
        ymaps.ready(init);
    }
    var myMap,
        addressToCoordsMap = {},
        contactMapElement = document.getElementById('contacts-map'),
        geographyMapElement = document.getElementById('map');

    function init() {
        if (contactMapElement) {
            initContactsMap();
            initHandlerSwitcher();
        } else if (geographyMapElement) {
            initGeographyMap();
        }
    }

    function initContactsMap() {
        myMap = new ymaps.Map("contacts-map", {
            center: [55.815085, 49.137880],
            zoom: 16
        });

        myMap.behaviors.disable(['scrollZoom', 'multiTouch']);

        if (addressOnMap) {
            addressOnMap.forEach(function (city, index) {
                codeYandexAddressToContacts(city, index === 0);
            });
        }
    }

    function initHandlerSwitcher() {
        $('.center').on('click', function () {
            var address = $(this).data('address');
            if (address) {
                myMap.setCenter(addressToCoordsMap[address]);
            }
        });
    }

    function codeYandexAddressToContacts(address, isFirst) {
        ymaps.geocode(address, {
            results: 1
        }).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0),
                coords = firstGeoObject.geometry.getCoordinates();

            addressToCoordsMap[address] = coords;

            if (isFirst) {
                myMap.setCenter(coords);
            }

            firstGeoObject.options.set('iconColor', '#4ca49e');
            myMap.geoObjects.add(firstGeoObject);
        });
    }

    function initGeographyMap() {
        var defaultCoords = [55.727510, 60.410448];

        myMap = new ymaps.Map("map", {
            center: defaultCoords,
            zoom: 4.4,
            controls: ['zoomControl']
        });

        myMap.behaviors.disable(['scrollZoom']);

        if (cities) {
            Object.keys(cities).forEach(function (city) {
                codeYandexAddressToGeography(city);
            });
        }
    }

    function codeYandexAddressToGeography(address) {
        ymaps.geocode(address, {
            results: 1
        }).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            console.log(firstGeoObject);
            firstGeoObject.options.set('preset', 'islands#icon');
            firstGeoObject.options.set('iconColor', '#f79550');
            myMap.geoObjects.add(firstGeoObject);
        });
    }
});


//проверка валидации
function checkValidate(containerClass) {
    var container = containerClass || ".modal.active:visible";

    try {
        var inputs = $(container).find("select[required]:visible,input[required]:visible,textarea[required]:visible");
        var isValidForm = true;
        var isFocus = false;
        inputs.each(function () {
            var current = $(this),
                pattern = current.attr('pattern'),
                value = current.val();

            if (!pattern) pattern = "^.+$";
            if (!value.match(pattern)) {
                if (!isFocus) {
                    current.focus();
                    isFocus = true;
                }
                current.addClass("invalidInput");
                isValidForm = false;
            } else {
                current.removeClass("invalidInput");
            }
        });
    }
    catch (e) {
        console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
        return true;
    }

    return isValidForm;
}

//добавление масок
$(function () {
    $('.phone').mask("+9 (999) 999-99-99");
});

function sendAjax(btn, dataForm) {
    var currentBtnText = btn.html();
    btn.attr("disabled", true);
    $.ajax({
        url: window.ajaxPath,
        type: "POST",
        data: {
            data: dataForm,
            action: 'send_form'
        },
        beforeSend: function () {
            btn.html('<img src="' + loaderBase64 + '" height=90%/>');
            $(".main-form").nextAll(".w-form-done.success").eq(0).hide();
            $(".main-form").nextAll(".w-form-fail.error").eq(0).hide();
        },
        success: function () {
            btn.html(currentBtnText).attr("disabled", false);
            $(".main-form").nextAll(".w-form-done.success").eq(0).show();
        },
        error: function () {
            btn.html(currentBtnText).attr("disabled", false);
            $(".main-form").nextAll(".w-form-fail.error").eq(0).show();
        }
    });
}

//отправка форм
$(function () {
    $('.main-form .formbutton').on('click', function () {
        var isValid = checkValidate('.main-form'),
            btn = $(this);
        if (!isValid) {
            return;
        }
        var dataForm = {
            msg: $.trim($(".main-form .msg").val()),
            email: $.trim($(".main-form .email").val()),
            name: $.trim($(".main-form .name").val()),
            theme: $.trim($(".main-form input[name=theme]").val())
        };
        sendAjax(btn, dataForm);
        event.preventDefault();
    });
});

//copyright
$(function () {
    document.oncopy = function () {
        var bodyElement = document.body;
        var selection = getSelection();
        var href = document.location.href;
        var copyright = "<br><br>Источник: <a href='" + href + "'>" + href + "</a><br>";
        var text = selection + copyright;
        var divElement = document.createElement('div');
        divElement.style.position = 'absolute';
        divElement.style.left = '-99999px';
        divElement.innerHTML = text;
        bodyElement.appendChild(divElement);
        selection.selectAllChildren(divElement);
        setTimeout(function () {
            bodyElement.removeChild(divElement);
        }, 0);
    };
});
