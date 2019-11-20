import $ from 'jquery';

// Setup activeTip in ribbon
$('header nav div.activeTip').css({
  left: $('header nav a')[0].offsetLeft - 1,
  width: $('header nav a')[0].offsetWidth + 2
});

// Animate activeTib when tab changes and change main
$('header nav a').click(e => {
  $('header nav div.activeTip').css({
    left: e.target.offsetLeft - 1,
    width: e.target.offsetWidth + 2
  });

  $('main').removeClass('active').addClass('nonactive');
  $('*[data-name="' + e.target.dataset.name + '"]').addClass('active').removeClass('nonactive');

  /*$('main').css({
    left: -$(window)[0].innerWidth,
    'z-index': 1
  });

  $('*[data-name="' + e.target.dataset.name + '"]').css({
    left: 0
  });*/
});

// Set main pages to correct place
/*$('main').css({
  left: -$(window)[0].innerWidth,
  'z-index': 1
});

$(window).resize(e => {
  $('main').css({
    left: -$(window)[0].innerWidth,
    'z-index': 1
  });
});*/