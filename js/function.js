/*!
 *
 * Evgeniy Ivanov - 2018
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var app = {
    pageScroll: '',
    pageFs: 16,
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= app.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= app.mdWidth && $(window).width() < app.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= app.smWidth && $(window).width() < app.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < app.smWidth; } // < 768
function isIOS() { return app.iOS(); } // for iPhone iPad iPod
function isTouch() { return app.touchDevice(); } // for touch device


$(document).ready(function() {
    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	// Запрет "отскока" страницы при клике по пустой ссылке с href="#"
	$('[href="#"]').click(function(event) {
		event.preventDefault();
	});

    // Inputmask.js
    // $('[name=tel]').inputmask("+9(999)999 99 99",{ showMaskOnHover: false });
    // formSubmit();

    // checkOnResize();

    $('.heroes__slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: '<button class="slick-next slick-arrow"></button>',
        prevArrow: '<button class="slick-prev slick-arrow"></button>',
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    // arrows: false,
                    // dotts: true
                }
            }
        ]
    });

    $('.preparation__slider').slick({
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        // speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
    });

    parallax();
    playVideo('#rezultat');
    mouseMoveParallax()

});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (app.resized == windowWidth) { return; }
    app.resized = windowWidth;

    parallax();

	// checkOnResize();
});

function checkOnResize() {
    // fontResize();
}

function playVideo(box) {
    let section = $(box),
        fullscr = $('.rezultat__full'),
        preview = {
            id: 427315595,
            title: false,
        },
        player = new Vimeo.Player('video', preview),
        played = false,
        top = $(window).scrollTop(),
        start = section.offset().top - 100;

    $(window).scroll(function(){
        top = $(window).scrollTop();
        start = section.offset().top - 100;

        if (top > start && top < (start + section.height())) {
            if (played === false) {
                played = true;
                player.play();
                player.setVolume(0);
            }
        } else {
            played = false;
            player.pause();
            // console.log('pause');
        }
    });


    fullscr.on('click', function(e) {
        player.requestFullscreen();
        player.play();
    });


    player.on('fullscreenchange', function(e) {
        // console.log(e.fullscreen);
        // console.log(e);
        if (e.fullscreen) {
            player.setVolume(1);
        } else {
            player.setVolume(0);
        }
    });

}

function parallax() {
    if (isXsWidth()) return false;
    let item = $('.parallaxItem');
    var el = document.querySelector('body');
    app.pageFs = window.getComputedStyle(el, null).getPropertyValue('font-size').replace('px', '')*1;
    let top = $(window).scrollTop()/app.pageFs;
    let speed;

    // console.log(app.pageFs);
    item.each(function(index, el) {
        top = $(window).scrollTop()/app.pageFs;
        speed = $(this).data('speed');
        $(el).attr('style', 'transform: translateY(-'+(top*speed/10)+'em)');
    });
}


function mouseMoveParallax() {
    let wrapper = $('.scenario');
    let item = $('.scenario__paper img');
    let speed = 0;
    let offsetX;
    let offsetY;

    if (isXsWidth()) return false;

    wrapper.on('mousemove', function(even) {
        // console.log(even.screenX);
        console.log(even.clientX - $(window).width() / 2);
        offsetX = -(even.clientX - $(window).width() / 2);
        offsetY = -(even.clientY - $(window).width() / 2);

        item.each(function(index, el) {
            speed = $(el).data('speed');
            $(el).attr('style', 'transform: translate3d('+(offsetX*speed/1000)+'em, '+(offsetY*speed/1000)+'em , 0)');
        });
    });

    wrapper.on('mouseleave', function(even) {
        item.each(function(index, el) {
            speed = $(el).data('speed');
            $(el).attr('style', 'transform: translate3d(0, 0 , 0)');
        });
    });
}


// Проверка направления прокрутки вверх/вниз
function checkDirectionScroll() {
    var tempScrollTop, currentScrollTop = 0;

    $(window).scroll(function(){
        currentScrollTop = $(window).scrollTop();

        if (tempScrollTop < currentScrollTop ) {
            app.pageScroll = "down";
        } else if (tempScrollTop > currentScrollTop ) {
            app.pageScroll = "up";
        }
        tempScrollTop = currentScrollTop;

        parallax();
        // playVideo('#rezultat');

    });
}
checkDirectionScroll();
