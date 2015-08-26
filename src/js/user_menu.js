(function() {

	var notification = document.querySelector('.notification > a');
	var menu = document.querySelector('.user-menu');

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
		console.log('closing..!');
		if (menu.getAttribute('class') === 'user-menu') {
			menu.setAttribute('class', 'user-menu is-hide');
		}
		document.removeEventListener('click', closeMenu);
	}

	notification.onclick = toggleMenu;

})();