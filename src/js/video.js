const videojs = require("video.js");
require("videojs-overlay");
require("videojs-youtube");

const player = videojs( 'video', {
  preload: 'auto',
  controls: true,
  autoplay: true,
  techOrder: ['html5', 'youtube']
});
player.src({
  "type": "video/youtube",
  "src": document.getElementById('video').dataset.youtube
});
