// thanks to https://github.com/dinony/videojs-youtube-issue0/blob/master/src/main.js for getting this to work
// got there from https://github.com/videojs/videojs-youtube/issues/473
const videojs = require("video.js");
require("videojs-youtube");
require("videojs-overlay");

window.player = videojs( 'video', {
  preload: 'auto',
  controls: true,
  autoplay: true,
  fluid: true,
  techOrder: ['html5', 'youtube']
});
var options = {
  "type": "video/youtube",
  "src": document.getElementById('video').dataset.youtube,
  "youtube": {
    "rel": "0",
    "modestbranding": "1"
  }
}
player.src(options);
player.overlay({
  debug: true,
  overlays: window.annotations,
  attachToControlBar: true,
  align: "top-right",
  showBackground: true
});

player.on('ready', function() {
  if ( window.location.hash.match(/^#t=/) ) {
    var hashes = window.location.hash.split('=');
    var time = Number(hashes[1]);
    var p = this;

    if ( time > 0 ) {
      this.one('playing', function() {
        p.currentTime(time);
      });
    }
  }
});

