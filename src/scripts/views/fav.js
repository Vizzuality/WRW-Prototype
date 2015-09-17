define([], function() {

  var stars = document.querySelector('.hero-info-stars');
  var insightStar = document.querySelector('.insights--featured-info-stars');
  var starsCard = document.getElementsByClassName('card-info-stars');
  var mapStar = document.querySelector('.story--metadata-stars');
  var insights = document.querySelector('.insights--star');
  var explore = document.querySelector('.explore-detail--stars');

  var doFav = function() {
    //regex to remove commas at thousands
    var totalFavsContainer = this.querySelector('span'),
        totalFavs = parseInt(totalFavsContainer.innerText.replace(/,/g, ""))

    if(this.classList.contains('active')) {
      totalFavs--;
    } else {
      totalFavs++;
    }

    this.classList.toggle('active');

    //regex to insert commas at thousands
    totalFavs = totalFavs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    totalFavsContainer.innerText = totalFavs;
  };

  // Add events
  if (stars) {
    stars.onclick = doFav;
  }

  if (insights) {
    insights.onclick = doFav;
  }

  if (explore) {
    explore.onclick = doFav;
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

});
