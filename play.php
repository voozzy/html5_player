<?php
//phpinfo();

$FileListId = $_GET['file'];

$html ='<link href="css/reset.css" rel="stylesheet">
<------><link href="css/video-js-5.7.1.css" rel="stylesheet">
<------><link href="http://videojs.github.io/font/css/videojs-icons.css" rel="stylesheet">
<------><link href="css/videojs-resolution-switcher.css" rel="stylesheet">
<------><link href="css/videojs-audiotrack-switcher.css" rel="stylesheet">
<------><link href="css/videojs.ads.css" rel="stylesheet" type="text/css">
<------><link href="css/videojs.vast.css" rel="stylesheet" type="text/css">
<------><link href="css/videojs.errors.css" rel="stylesheet">
<------><link href="css/video-js-resolutions.css" rel="stylesheet">
<------><link href="css/videojs.progressTips.css" rel="stylesheet">
<------><script type="text/javascript" src="http://bt.3tv.im/dash/js/swfobject.js"></script>
<------><script type="text/javascript" src="http://bt.3tv.im/dash/js/ParsedQueryString.js"></script>
<------><script src="http://bt.3tv.im/dash/js/jquery_1.8.3.js"></script>
<------><script src="http://bt.3tv.im/dash/js/jquery.contextmenu.js"></script>
    <div id="VIDEOPLAYER_WRAP">
<------>    <video id="video" class="video-js vjs-default-skin" controls autoplay preload="auto" width="100%" height="100%"></video>
    </div>

    <script>
    var FileListId = "'.$FileListId.'";
    </script>
  <script src="http://bt.3tv.im/dash/js/video.js"></script>
  <script src="http://bt.3tv.im/dash/js/hls.js"></script>
  <script src="http://bt.3tv.im/dash/js/videojs-hlsjs.js"></script>
  <script src="http://bt.3tv.im/dash/js/videojs-resolution-switcher.js"></script>
  <script src="http://bt.3tv.im/dash/js/videojs-audio-switcher.js"></script>
  <script src="http://bt.3tv.im/dash/js/vast-client.js"></script>
  <script src="http://bt.3tv.im/dash/js/vast/video.ads.js"></script>
  <script src="http://bt.3tv.im/dash/js/vast/videojs.vast.js"></script>
  <script src="http://bt.3tv.im/dash/js/videojs-playlists-old.js"></script>
  <script src="http://bt.3tv.im/dash/js/videojs.hotkeys.js"></script>
  <script src="http://bt.3tv.im/dash/js/canvas.js"></script>
  <script src="http://bt.3tv.im/dash/js/metrics.js"></script>
  <script src="http://bt.3tv.im/dash/js/jsonpack.js"></script>
  <script src="http://bt.3tv.im/dash/js/js.cookie.js"></script>
  <script src="http://bt.3tv.im/dash/js/app_old.js"></script>
  <script src="http://bt.3tv.im/dash/js/app-plugins.js"></script>
  <script src="http://bt.3tv.im/dash/js/app.js"></script>

';
header("Access-Control-Allow-Origin: http://bt.3tv.im ");
echo $html;
