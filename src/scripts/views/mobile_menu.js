define([], function() {

  var mobileMenuLink = document.querySelector(".js--header-open-menu");

  if (mobileMenuLink) {
    mobileMenuLink.onclick = function() {
      var headerEl = document.querySelector('.header-container');

      if (headerEl.classList.contains("header-mobile")) {
        mobileMenuLink.innerHTML = "Menu";
        headerEl.classList.remove('header-mobile');
      } else {
        mobileMenuLink.innerHTML = "Close";
        headerEl.classList.add('header-mobile');
      }
    };
  }

});
