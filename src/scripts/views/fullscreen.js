define([], function() {

  var isFullscreen = false;
  var fullscreenBtn = document.getElementById('fullscreenBtn');

  var toggleFullscreen = function() {
    var container = document.getElementById('content');

    if (!container.fullscreenElement && !container.mozFullScreenElement && !container.webkitFullscreenElement && !container.msFullscreenElement && !document.webkitIsFullScreen) {

      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }

      this.textContent = 'Exit fullscreen';

    } else {

      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }

      this.textContent = 'Fullscreen';

    }
  };

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen, false);
  }

});
