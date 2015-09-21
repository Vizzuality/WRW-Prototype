define([], function() {

  var emptyLinks = document.querySelectorAll('[href="#"]');
  for(var i = 0, j = emptyLinks.length; i < j; i++) {
    emptyLinks[i].removeAttribute('href');
    emptyLinks[i].classList.add('is-link'); /* We restore the cursor so it still looks like a link */
  }

});
