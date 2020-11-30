$('.btn-feedback').on('click', function () {

  $('.modal').toggleClass('active');
});

$('.modal').on('click', function () {

  $(this).removeClass('active');
});

$('.modal__form').on('click', function () {

  event.stopPropagation();
});
