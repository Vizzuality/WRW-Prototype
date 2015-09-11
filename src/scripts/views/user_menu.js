define([], function() {

  var notification = document.querySelector('.notification > a');
  var menu = document.querySelector('.user-menu');

  var languageBtn = document.querySelector('#language');
  var languageMenu = document.querySelector('.language-menu');


  var toggleLanguageMenu = function(e) {
    e && e.preventDefault();

    var languageClass = languageMenu.getAttribute('class');

    if (languageClass === 'language-menu is-hide') {
      languageMenu.setAttribute('class', 'language-menu');

      languageMenu.onclick = function(e) {
        e.stopPropagation();
      };
      window.setTimeout(function(){
        document.addEventListener('click', closeMenu);
      }, 0);

    } else {
      languageMenu.setAttribute('class', 'language-menu is-hide');
    }
  }

  var toggleMenu = function(e) {
    e && e.preventDefault();

    var menuClass = menu.getAttribute('class');

    if (menuClass === 'user-menu is-hide') {
      menu.setAttribute('class', 'user-menu');

      menu.onclick = function(e) {
        e.stopPropagation();
      };
      window.setTimeout(function(){
        document.addEventListener('click', closeMenu);
      }, 0);

    } else {
      menu.setAttribute('class', 'user-menu is-hide');
    }
  };

  var closeMenu = function() {
    if (menu.getAttribute('class') === 'user-menu') {
      menu.setAttribute('class', 'user-menu is-hide');
    } else {

    }

    if(languageMenu.getAttribute('class') === 'language-menu') {
      languageMenu.setAttribute('class', 'language-menu is-hide');
    }

    document.removeEventListener('click', closeMenu);
  }

  if (notification) {
    notification.onclick = toggleMenu;
  }

  if (languageBtn) {
    languageBtn.onclick = toggleLanguageMenu;
  }

});
