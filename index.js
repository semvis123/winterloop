import $ from 'jquery';

// Setup activeTip in ribbon
$('header nav div.activeTip').css({
  left: $('header nav a')[0].offsetLeft - 1,
  width: $('header nav a')[0].offsetWidth + 2
});

// Animate activeTib when tab changes
$('header nav a').click(e => {
  $('header nav div.activeTip').css({
    left: e.target.offsetLeft - 1,
    width: e.target.offsetWidth + 2
  });
});