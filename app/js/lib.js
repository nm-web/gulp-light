function showSearch() {
  var search = document.querySelector('.header__search');
  search.classList.toggle('search--mobile');
}


document.querySelector('.mobile-menu').addEventListener('click', function (e) {
  this.classList.toggle('is-active');
  var menu = document.querySelector('.header__menu');
  menu.classList.toggle('menu--mobile');
  showSearch();
});
