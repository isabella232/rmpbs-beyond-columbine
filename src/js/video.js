// thanks to https://github.com/dinony/videojs-youtube-issue0/blob/master/src/main.js for getting this to work
// got there from https://github.com/videojs/videojs-youtube/issues/473
const videojs = require("video.js");
require("videojs-youtube");
require("videojs-overlay");

const player = videojs( 'video', {
  preload: 'auto',
  controls: true,
  autoplay: true,
  fluid: true,
  techOrder: ['html5', 'youtube']
});
player.src({
  "type": "video/youtube",
  "src": document.getElementById('video').dataset.youtube,
  "youtube": {
    "rel": "0",
    "modestbranding": "1"
  }
});
player.overlay({
  debug: true,
  overlays: window.annotations,
  attachToControlBar: true,
  align: "top-right",
  showBackground: true
});
