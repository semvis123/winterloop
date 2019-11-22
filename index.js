import $ from 'jquery';

// Setup activeTip in ribbon
$('header nav div.activeTip').css({
  left: $('header nav a')[0].offsetLeft - 1,
  width: $('header nav a')[0].offsetWidth + 2
});

$($('header nav a')[0]).addClass('active');

// When click on pivot
$('header nav a').click(e => {
  // Move activeTib
  $('header nav div.activeTip').css({
    left: e.target.offsetLeft - 1,
    width: e.target.offsetWidth + 2
  });

  // Make active bold
  $('header nav a.active').removeClass('active');
  $(e.target).addClass('active');

  // Add change to history
  history.pushState(
    {},
    e.target.dataset.page,
    "#" + e.target.dataset.page
  );
});

// When you change pages
$(window).on('popstate', e => {
  console.log(e);
});