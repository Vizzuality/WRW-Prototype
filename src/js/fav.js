(function() {

	var stars = document.querySelector('.hero-info-stars');
	var insightStar = document.querySelector('.insights--featured-info-stars');
	var starsCard = document.getElementsByClassName('card-info-stars');
	var mapStar = document.querySelector('.story--metadata-stars');

	var doFav = function() {
		var fav = this.querySelector('svg'),
			selectorClass = this.className,
			totalFavsContainer = this.querySelector('span'),
			totalFavs = Number(totalFavsContainer.innerText.replace(',', ''));

		if (fav.getAttribute('class') === 'icon icon-star') {

			fav.setAttribute('class', 'icon icon-star--active');
			this.setAttribute('class', this.className + ' active');
			totalFavs += 1;			

		} else {

			fav.setAttribute('class', 'icon icon-star');

			if (selectorClass === 'card-info-stars' || selectorClass === 'card-info-stars active') {
				this.setAttribute('class', 'card-info-stars');
			}

			if (selectorClass === 'insights--featured-info-stars' || selectorClass === 'insights--featured-info-stars active') {
				this.setAttribute('class', 'insights--featured-info-stars');
			}

			if (selectorClass === 'hero-info-stars' || selectorClass === 'hero-info-stars active') {
				this.setAttribute('class', 'hero-info-stars');
			}

			totalFavs -= 1;
		}

		if (totalFavs / 1000 > 0) {
			totalFavs = String(totalFavs / 1000).replace('.', ',');
		}
	
		totalFavsContainer.innerText = totalFavs;
	};

	// Add events
	if (stars) {
		stars.onclick = doFav;
	}

	if (insightStar) {
		insightStar.onclick = doFav;
	}

	if (mapStar) {
		mapStar.onclick = doFav;
	};
	

	if (starsCard.length > 0) {
		for (var i = 0; i < starsCard.length; i++) {
			starsCard[i].onclick = doFav;
		}
	}

})();