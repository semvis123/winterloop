import $ from 'jquery';

function updateActiveTip(left, width, object) {
  // Update normal vars
  $('header nav div.activeTip').get(0).style.setProperty("--left", left + 5 + 'px');
  $('header nav div.activeTip').get(0).style.setProperty("--width", width - 10 + 'px');

  // Update hover vars
  $('header nav div.activeTip').get(0).style.setProperty("--hoverLeft", left + 'px');
  $('header nav div.activeTip').get(0).style.setProperty("--hoverWidth", width + 'px');

  // Update hover event
  $('header nav a').off('mouseenter mouseleave');
  $(object).on('mouseenter', e => {
    $('div.activeTip').addClass('hover')
  }).on('mouseleave', e => {
    $('div.activeTip').removeClass('hover')
  });
}

// Setup activeTip in ribbon
updateActiveTip(
  $('header nav a')[0].offsetLeft,
  $('header nav a')[0].offsetWidth,
  $('header nav a')[0]
);

// Load correct page
$('main').removeClass('active').addClass('nonactive');
$('main[data-name="' + $('header nav a')[0].dataset.name + '"]').addClass('active');

// Animate activeTib when tab changes and change main
$('header nav a').click(e => {
  // Update css vars
  updateActiveTip(e.target.offsetLeft, e.target.offsetWidth, $('header nav a[data-name="' + e.target.dataset.name + '"]'));

  // Update main
  $('main').removeClass('active').addClass('nonactive');
  $('main[data-name="' + e.target.dataset.name + '"]').addClass('active').removeClass('nonactive');
  
  // Add change to history
  history.pushState(
    {},
    e.target.dataset.name,
    "#" + e.target.dataset.name
  );
});

// When you change pages
$(window).on('popstate', e => {
  console.log(e);
});