var TREE_HTML = (function (module,$,videojs,TREE) { 
    module.isFullscreenChange = false;
    module.isErrorReload = false;
    videojs.options.flash.swf = "/js/video-js.swf";
    videojs.BackButton = videojs.Button.extend({
        init : function(player, options) {
            videojs.Button.call(this, player, options);
            this.on('click', this.onClick);
        }
    });
    videojs.BackButton.prototype.onClick = function() {
        if(!$(this.el()).hasClass('disable')){
            var params = TREE.options.filmParams;
            // if(isActive != '1'){
                // if(VIDEOPLAYER.isFullscreen()){
                    // module.isFullscreenChange = true;
                    // VIDEOPLAYER.exitFullscreen();
                // }
                // setTimeout(function(){
                    // window.VIDEOPLAYER.prev();
                    // var params = TREE.options.filmParams;
                    // TREE.changefilmParams(params[0],params[1],VIDEOPLAYER.playList('getIndex'));
                    // module.InitHTMLPlayer();
                // },50)
            // }else {

               window.VIDEOPLAYER.prev();
               TREE.changefilmParams(params[0],params[1],VIDEOPLAYER.playList('getIndex'));
           // }

        }
    };
    var createBackButtonButton = function() {
        var props = {
            className : 'vjs-backButton-button vjs-control',
            innerHTML : '<div class="vjs-control-content"><span class="vjs-control-text">' + ('Tweet') + '</span></div>',
            role : 'button',
            'aria-live' : 'polite',
            tabIndex : 0
        };
        return videojs.Component.prototype.createEl(null, props);
    };

    var backButton;
    videojs.plugin('backButton', function() {
        var options = {
            'el' : createBackButtonButton()
        };
        backButton = new videojs.BackButton(this, options);
        this.controlBar.el().appendChild(backButton.el());
    });

    videojs.ForvardButton = videojs.Button.extend({
        init : function(player, options) {
            videojs.Button.call(this, player, options);
            this.on('click', this.onClick);
        }
    });
    videojs.ForvardButton.prototype.onClick = function() {
       if(!$(this.el()).hasClass('disable')){
           var params = TREE.options.filmParams;
           // if(isActive != '1'){
               // if(VIDEOPLAYER.isFullscreen()){
                    // module.isFullscreenChange = true;
                    // VIDEOPLAYER.exitFullscreen();
               // }
               // setTimeout(function(){
                   // window.VIDEOPLAYER.next();
                   // var params = TREE.options.filmParams;
                   // TREE.changefilmParams(params[0],params[1],VIDEOPLAYER.playList('getIndex'));
                   // module.InitHTMLPlayer();
               // },50);
           // }else {

               console.log('window.VIDEOPLAYER.next()')
               window.VIDEOPLAYER.next();
               TREE.changefilmParams(params[0],params[1],VIDEOPLAYER.playList('getIndex'));
           // }
       }
    };
    var createForvardButtonButton = function() {
        var props = {
            className : 'vjs-forvardButton-button vjs-control',
            innerHTML : '<div class="vjs-control-content"><span class="vjs-control-text">' + ('Tweet') + '</span></div>',
            role : 'button',
            'aria-live' : 'polite',
            tabIndex : 0
        };
        return videojs.Component.prototype.createEl(null, props);
    };

    var forvardButton;
    videojs.plugin('forvardButton', function() {
        var options = {
            'el' : createForvardButtonButton()
        };
        forvardButton = new videojs.ForvardButton(this, options);
        this.controlBar.el().appendChild(forvardButton.el());
    });

    videojs.QualityButton = videojs.Button.extend({
        init : function(player, options) {
            videojs.Button.call(this, player, options);
            this.on('click', this.onClick);
        }
    });
    videojs.QualityButton.prototype.onClick = function() {
        $('#vjs-menu').toggle(100);
    };
    var getQmenu = function() {
        var temp = '';
        var params = TREE.options.filmParams;
        var source = TREE.options.source[params[0]];
        var tempq = [];
        $.each(source, function(k,v) {
            tempq.push({
                'value' : k,
                'selected' : k == params[1] ? true : false
            });
        });
        tempq = tempq.reverse();
        for (var i = 0; i < tempq.length; i++) {
            var isSelected = tempq[i].selected ? 'vjs-selected' : '';
            temp += '<li class="vjs-menu-item ' + isSelected + '"><font>' + tempq[i].value + '</font></li>';
        };
        return temp;
    };
    var createQualityButton = function() {
        var props = {
            className : 'vjs-resolutions-button vjs-menu-button vjs-control',
            innerHTML : '<div class="vjs-control-content"><span class="vjs-control-text"><font><font>Резолюции</font></font></span></div>' + '<div class="vjs-menu" id="vjs-menu"><ul class="vjs-menu-content">' + getQmenu() + '</ul></div>',
            role : 'button',
            'aria-live' : 'polite',
            tabIndex : 0
        };
        return videojs.Component.prototype.createEl(null, props);
    };
    var qualityButton;
    videojs.plugin('qualityButton', function() {
        var options = {
            'el' : createQualityButton()
        };
        qualityButton = new videojs.QualityButton(this, options);
        this.controlBar.el().appendChild(qualityButton.el());
    }); 
    module.isChangeQuality = false;
    module.isChangeQualityTime = null;
    module.prepear = function (add) {
        if(!add){
            try{
                VIDEOPLAYER.dispose();
            }catch(e){
                log(e);
            }
        }
        if(!$('#VIDEOPLAYER').length){
            $('#VIDEOPLAYER_WRAP').append('<video id="VIDEOPLAYER" class="video-js vjs-default-skin" controls autoplay preload="auto" width="680" height="360" ><p>Video Playback Not Supported</p></video>');
        }
    };
    module.InitHTMLPlayer = function () { 
        // if(!swfobject.hasFlashPlayerVersion("1")){

            module.UpdateHTMLPlayer();
            // return;
        // }
// 
        // module.prepear();
        // TREE.initFLASH();

        return;




        
        if(videojs.options.techOrder[0] != 'html5' && $('#VIDEOPLAYER').is('div')){
            module.prepear();
        }

        
        window.VIDEOPLAYER = videojs('VIDEOPLAYER', {
            "techOrder" : ["html5"]
        }).ready(function() {
            this.hotkeys({
                volumeStep : 0.1,
                seekStep : 5,
                enableMute : true,
                enableFullscreen : true
            });
            TREE.isCanChange = false;
            var videoPlayer = this;
            videoPlayer.volume(0.2);
            // videojs.options.techOrder = ['flash', 'html5'];

            var params = TREE.options.filmParams;
            videoPlayer.src('http://stream-ru2.3tv.im/play2/151855/24/0/D5044L40zXdBd4DYpEDGTg,1455976994/films/8/22500/26760/720p_Attenborough.and.the.Giant.Dinosaur.mp4'); 

            console.log(this.ads)
            // this.errors();
            // this.ads({
                // debug : true
            // });
            // this.vast({
                // url: 'http://inv-nets.admixer.net/dsp.aspx?rct=3&zone=2728d5f9-5a41-4fe2-b4ab-4fc30dc38a32&zoneInt=242&sect=194&site=194&rnd=882012176'
            // });

        });
        console.log(VIDEOPLAYER.ads)
        VIDEOPLAYER.errors();
        VIDEOPLAYER.ads({
            debug : true
        });


        // if(isActive == '1'){
            // vastURLs = [];
        // }
        
        // vastURLs = [];
// 
        VIDEOPLAYER.vast({
            url: [
                'http://inv-nets.admixer.net/dsp.aspx?rct=3&zone=2728d5f9-5a41-4fe2-b4ab-4fc30dc38a32&zoneInt=242&sect=194&site=194&rnd=882012176',
                'http://n161adserv.com/vast.xml?key=1fe108bad5dfe9ac67cd146a49516806&no_imp_overlay=true&vastv=3.0',
                'http://n130adserv.com/vast.xml?key=fafd431bfdc7d2101e5f4a190640c801&zone=PRE_ROLL'
            ]
        });



        VIDEOPLAYER.on('contentupdate', function() {
            console.log('contentupdate');
            VIDEOPLAYER.volume(0.2);
            //player.trigger('adsready');
        });

        VIDEOPLAYER.on('readyforpreroll', function() {
            VIDEOPLAYER.ads.startLinearAdMode();
            console.log('readyforpreroll');

            VIDEOPLAYER.one('adclick', function() {
                console.log('adclick');
            });
            VIDEOPLAYER.one('durationchange', function() {
                console.log('durationchange');
                // VIDEOPLAYER.play();

            });
            VIDEOPLAYER.one('adscanceled', function() {
                console.log('adscanceled');
            });
            VIDEOPLAYER.one('ended', function() {
                console.log('ended');
                // module.UpdateHTMLPlayer();

            });
            VIDEOPLAYER.one('adend', function(event) {
                console.log('adend');
                // module.UpdateHTMLPlayer();

            });
        });
        VIDEOPLAYER.on('adstart', function(event) {
            console.log('adstart2');
        });
        VIDEOPLAYER.on('gofilm', function(event) {
            // module.UpdateHTMLPlayer();

        });
        VIDEOPLAYER.on('adsready', function(event) {
            console.log('adsready');
        });
        VIDEOPLAYER.on('adtimeout', function(event) {
            console.log('adtimeout');
            // module.UpdateHTMLPlayer();

            //VIDEOPLAYER.play();
        }); 

    };
    
    module.UpdateHTMLPlayer = function () { 
        var vastURLs = [
            'http://inv-nets.admixer.net/dsp.aspx?rct=3&zone=2728d5f9-5a41-4fe2-b4ab-4fc30dc38a32&zoneInt=242&sect=194&site=194&rnd=882012176',
            'http://n161adserv.com/vast.xml?key=1fe108bad5dfe9ac67cd146a49516806&no_imp_overlay=true&vastv=3.0',
            'http://n130adserv.com/vast.xml?key=fafd431bfdc7d2101e5f4a190640c801&no_imp_overlay=true&zone=PRE_ROLL&vastv=3.0'
        ];
            
        if(videojs.options.techOrder[0] != 'html5' && $('#VIDEOPLAYER').is('div')){
            module.prepear();
        }

        videojs.options.techOrder = ['html5'];
        module.prepear(true);
        window.VIDEOPLAYER = videojs('VIDEOPLAYER',{ plugins : { backButton : {},forvardButton : {},qualityButton : {}}}).ready(function() {
          var videoPlayer = this;
              this.progressTips();
              this.htmlerrors();
              this.hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableMute: true,
                enableFullscreen: true
              });
              // videoPlayer.play();
        });
        
        if(VIDEOPLAYER.ads) {
            VIDEOPLAYER.ads({
                debug : true
            });
        }

        if(isActive == '1'){
            vastURLs = [];
        }
        
        VIDEOPLAYER.vast({
            url: vastURLs
        });




        VIDEOPLAYER.playList(module.getPlaylist(), {
            getVideoSource: function(vid, cb) {
              cb(vid.src, vid.poster);
            }
        });
        VIDEOPLAYER.playList(TREE.options.filmParams[2]);


        VIDEOPLAYER.on('contentupdate', function() {
            console.log('contentupdate');
            //player.trigger('adsready');
        });

        VIDEOPLAYER.on('readyforpreroll', function() {
            // VIDEOPLAYER.ads.startLinearAdMode();
            VIDEOPLAYER.volume(0.1);
            console.log('readyforpreroll');
            TREE.isCanChange = false;
            VIDEOPLAYER.one('adclick', function() {
                console.log('adclick');
                VIDEOPLAYER.vast.tearDown();
                setTimeout(function() {
                    VIDEOPLAYER.pause();
                },1000);
            });
            VIDEOPLAYER.one('durationchange', function() {
                console.log('durationchange');
            });
            VIDEOPLAYER.one('adscanceled', function() {
                console.log('adscanceled');
                VIDEOPLAYER.volume(1);
                TREE.isCanChange = true;
            });
            VIDEOPLAYER.one('ended', function() {
                console.log('ended');
                VIDEOPLAYER.volume(1);
                TREE.isCanChange = true;
            });
            VIDEOPLAYER.one('adend', function(event) {
                VIDEOPLAYER.playList(TREE.options.filmParams[2]);
                console.log('adend');              
                console.log(VIDEOPLAYER.playList('getIndex') , TREE.options.filmParams[2]);
                
                if(VIDEOPLAYER.vast.getCountAds() < 2) {
                        //alert('getCountAds < 2')
                        VIDEOPLAYER.volume(0.1);
                        VIDEOPLAYER.vast.addCountAds();
                        VIDEOPLAYER.vast.getContent(true);
                } else {
                    VIDEOPLAYER.vast.resetCountAds();
                    VIDEOPLAYER.volume(1);
                }
                TREE.isCanChange = true;
            });
        });

        VIDEOPLAYER.on('adstart', function(event) {
            console.log('adstart2');
            TREE.isCanChange = false;
        });
        VIDEOPLAYER.on('gofilm', function(event) {
            console.log('gofilm');
            VIDEOPLAYER.volume(1);
            TREE.isCanChange = true;
        });
        VIDEOPLAYER.on('adsready', function(event) {
            console.log('adsready');
            TREE.isCanChange = false;
        });
        VIDEOPLAYER.on('adtimeout', function(event) {
            console.log('adtimeout');
            TREE.isCanChange = true;
            VIDEOPLAYER.play();
        }); 
        
        VIDEOPLAYER.on('durationchange', function() {
            console.log('durationchange-----------------');
        });
        
        VIDEOPLAYER.on('ended', function() {
            console.log('ended-----------------');
             

            // TREE.options.filmParams[2] = VIDEOPLAYER.playList('getIndex') + 1;
            // if(isActive != '1'){
                // if(VIDEOPLAYER.isFullscreen()){
                    // module.isFullscreenChange = true;
                    // VIDEOPLAYER.exitFullscreen();
                // }
                // if(VIDEOPLAYER.playList('getCount') > 1 && VIDEOPLAYER.playList('getIndex')+1 < VIDEOPLAYER.playList('getCount')){
                    // setTimeout(function(){
                         // module.InitHTMLPlayer();
                    // },100);
                // }else {
            
                // }
            // }
        });
        
        VIDEOPLAYER.on('firstplay', function() {
            console.log('firstplay-----------------');
            console.log(VIDEOPLAYER.playList('getIndex') , TREE.options.filmParams[2]);
            if(VIDEOPLAYER.playList('getCount') == 1){
                $('.vjs-backButton-button').addClass('disable');
                $('.vjs-forvardButton-button').addClass('disable');
            }else if(VIDEOPLAYER.playList('getCount') == VIDEOPLAYER.playList('getIndex')+1){
                $('.vjs-backButton-button').removeClass('disable');
                $('.vjs-forvardButton-button').addClass('disable');
            }else if(VIDEOPLAYER.playList('getIndex')==0){
                $('.vjs-backButton-button').addClass('disable');
                $('.vjs-forvardButton-button').removeClass('disable');
            }else {
                $('.vjs-backButton-button').removeClass('disable');
                $('.vjs-forvardButton-button').removeClass('disable');
            }
            TREE.setActiveLink();
            TREE.scrollTo();
            
            
            var params = TREE.options.filmParams,
                playIndex = VIDEOPLAYER.playList('getIndex'),
                playQuality = $('#quality_wrap > a.active').data() || {quality: 480},
                fileData = $('#accordion_wrap .accordion_content_item[data-folder="'+params[0]+'"][data-quality="'+playQuality.quality+'"][data-index="'+playIndex+'"]').data();
                TREE.changefilmParams(params[0], playQuality.quality, playIndex);

            $.get('/film/index/usersprosmotrfiles',{'files_id': fileData.file_id,'quality': fileData.quality},function(data){});
        });
        VIDEOPLAYER.on('fullscreenchange', function() {
            console.log('fullscreenchange-----------------');
            $('#VIDEOPLAYER_html5_api').focus();
            $('.vjs-fullscreen-control').blur();
            $('#vjs-tip').css('left','0px');
        });
        VIDEOPLAYER.on('loadedalldata', function() {
            console.log('loadedalldata-----------------');
        });
        VIDEOPLAYER.on('loadeddata', function() {
            console.log('loadeddata-----------------');
        });
        VIDEOPLAYER.on('loadedmetadata', function() {
            console.log('loadedmetadata-----------------');
            // TREE.isCanChange = true;
            if(TREE_HTML.isChangeQuality){
                VIDEOPLAYER.currentTime(TREE_HTML.isChangeQualityTime);
                TREE_HTML.isChangeQuality = false;
                TREE_HTML.isChangeQualityTime = null;
            }
            if(TREE.confirm.timer && TREE.confirm.isFirst){
                TREE.confirm.isFirst = false;
                VIDEOPLAYER.currentTime(TREE.confirm.timer);
            }
            if(module.isFullscreenChange == true){
                module.isFullscreenChange = false;
                VIDEOPLAYER.requestFullscreen();
            }
            if(module.isErrorReload){
                module.isErrorReload = false;
                VIDEOPLAYER.currentTime(module.isErrorReloadTime);
            }
        });
        VIDEOPLAYER.on('loadstart', function() {
            console.log('loadstart-----------------');
        });
        VIDEOPLAYER.on('pause', function() {
            console.log('pause-----------------');
        });
        VIDEOPLAYER.on('play', function() {
            console.log('play-----------------');
            if(!TREE.options.filmInfo){
                TREE.options.filmInfo = {};
            }
             TREE.options.filmInfo.isHalfLoad = false;
            // console.log(TREE.options.filmInfo.isHalfLoad + ' isHalfLoad = false');

        });
        VIDEOPLAYER.on('progress', function() {
            // console.log('progress-----------------');           
        });
        VIDEOPLAYER.on('seeked', function() {
            console.log('seeked-----------------');
        });
        VIDEOPLAYER.on('lastVideoEnded', function() {
            console.log('lastVideoEnded-----------------');
        });
        
        
        
        $('#VIDEOPLAYER_html5_api').bind('dblclick',function(e) {
            e.preventDefault();
                if (VIDEOPLAYER.isFullscreen()) {
                  VIDEOPLAYER.exitFullscreen();
                } else {
                  VIDEOPLAYER.requestFullscreen();
                }
        });
        
        $( "#VIDEOPLAYER" ).contextmenu(function() {
          console.log( "Handler for .contextmenu() called." );
          return false;
        });
    };
    
    
    // module.UpdateHTMLPlayer = function () { 
//         
        // if(videojs.options.techOrder[0] != 'html5' && $('#VIDEOPLAYER').is('div')){
            // module.prepear();
        // }
// 
        // videojs.options.techOrder = ['html5'];
        // module.prepear(true);
        // window.VIDEOPLAYER = videojs('VIDEOPLAYER',{ plugins : { backButton : {},forvardButton : {},qualityButton : {}}}).ready(function() {
          // var videoPlayer = this;
              // this.progressTips();
              // //this.errors();
              // this.htmlerrors();
              // this.hotkeys({
                // volumeStep: 0.1,
                // seekStep: 5,
                // enableMute: true,
                // enableFullscreen: true
              // });
//               
              // videoPlayer.play();
        // });
        // VIDEOPLAYER.on('durationchange', function() {
            // console.log('durationchange-----------------');
        // });
        // VIDEOPLAYER.on('ended', function() {
            // console.log('ended-----------------');
            // TREE.options.filmParams[2] = VIDEOPLAYER.playList('getIndex')+1;
            // if(isActive != '1'){
                // if(VIDEOPLAYER.isFullscreen()){
                    // module.isFullscreenChange = true;
                    // VIDEOPLAYER.exitFullscreen();
                // }
                // if(VIDEOPLAYER.playList('getCount') > 1 && VIDEOPLAYER.playList('getIndex')+1 < VIDEOPLAYER.playList('getCount')){
                    // setTimeout(function(){
                         // module.InitHTMLPlayer();
                    // },100);
                // }else {
//                     
                // }
//                 
            // }
        // });
        // VIDEOPLAYER.on('firstplay', function() {
            // console.log('firstplay-----------------');
            // if(VIDEOPLAYER.playList('getCount') == 1){
                // $('.vjs-backButton-button').addClass('disable');
                // $('.vjs-forvardButton-button').addClass('disable');
            // }else if(VIDEOPLAYER.playList('getCount') == VIDEOPLAYER.playList('getIndex')+1){
                // $('.vjs-backButton-button').removeClass('disable');
                // $('.vjs-forvardButton-button').addClass('disable');
            // }else if(VIDEOPLAYER.playList('getIndex')==0){
                // $('.vjs-backButton-button').addClass('disable');
                // $('.vjs-forvardButton-button').removeClass('disable');
            // }else {
                // $('.vjs-backButton-button').removeClass('disable');
                // $('.vjs-forvardButton-button').removeClass('disable');
            // }
            // TREE.setActiveLink();
            // TREE.scrollTo();
        // });
        // VIDEOPLAYER.on('fullscreenchange', function() {
            // console.log('fullscreenchange-----------------');
            // $('#VIDEOPLAYER_html5_api').focus();
            // $('.vjs-fullscreen-control').blur();
            // $('#vjs-tip').css('left','0px');
        // });
        // VIDEOPLAYER.on('loadedalldata', function() {
            // console.log('loadedalldata-----------------');
        // });
        // VIDEOPLAYER.on('loadeddata', function() {
            // console.log('loadeddata-----------------');
        // });
        // VIDEOPLAYER.on('loadedmetadata', function() {
            // console.log('loadedmetadata-----------------');
            // TREE.isCanChange = true;
            // if(TREE_HTML.isChangeQuality){
                // VIDEOPLAYER.currentTime(TREE_HTML.isChangeQualityTime);
                // TREE_HTML.isChangeQuality = false;
                // TREE_HTML.isChangeQualityTime = null;
            // }
            // if(TREE.confirm.timer && TREE.confirm.isFirst){
                // TREE.confirm.isFirst = false;
                // VIDEOPLAYER.currentTime(TREE.confirm.timer);
            // }
            // if(module.isFullscreenChange == true){
                // module.isFullscreenChange = false;
                // VIDEOPLAYER.requestFullscreen();
            // }
            // if(module.isErrorReload){
                // module.isErrorReload = false;
                // VIDEOPLAYER.currentTime(module.isErrorReloadTime);
            // }
        // });
        // VIDEOPLAYER.on('loadstart', function() {
            // console.log('loadstart-----------------');
        // });
        // VIDEOPLAYER.on('pause', function() {
            // console.log('pause-----------------');
        // });
        // VIDEOPLAYER.on('play', function() {
            // console.log('play-----------------');
            // if(!TREE.options.filmInfo){
                // TREE.options.filmInfo = {};
            // }
             // TREE.options.filmInfo.isHalfLoad = false;
            // console.log(TREE.options.filmInfo.isHalfLoad + ' isHalfLoad = false');
        // });
        // VIDEOPLAYER.on('progress', function() {
            // // console.log('progress-----------------');
// 
//             
        // });
        // VIDEOPLAYER.on('seeked', function() {
            // console.log('seeked-----------------');
        // });
        // VIDEOPLAYER.on('lastVideoEnded', function() {
            // console.log('lastVideoEnded-----------------');
        // });
//         
        // console.log(TREE.options.filmParams[2])
        // console.log(module.getPlaylist())
//         
        // VIDEOPLAYER.playList(module.getPlaylist(), {
            // getVideoSource: function(vid, cb) {
              // cb(vid.src, vid.poster);
            // }
        // });
        // VIDEOPLAYER.playList(TREE.options.filmParams[2]);
//         
        // $('#VIDEOPLAYER_html5_api').bind('dblclick',function(e) {
            // e.preventDefault();
                // if (VIDEOPLAYER.isFullscreen()) {
                  // VIDEOPLAYER.exitFullscreen();
                // } else {
                  // VIDEOPLAYER.requestFullscreen();
                // }
        // });
    // };

    
    
    
    
    module.getPlaylist = function (q) {
        var params = TREE.options.filmParams || [];
        var quality = q ? q : params[1];
        var source = TREE.options.source[params[0]][quality];
        var videos = [];
        for (var i=0; i < source.length; i++) {
            videos.push({
                'src' : [source[i].split('?')[0]],
                'poster' : ''
            });
        };
        return videos;
    };
    module.changePlayQuality = function (q) {
        module.isChangeQuality = true;
        module.isChangeQualityTime = VIDEOPLAYER.currentTime();
        VIDEOPLAYER.playList(module.getPlaylist(q), {
            getVideoSource: function(vid, cb) {
              cb(vid.src, vid.poster);
            }
        });
        VIDEOPLAYER.playList(TREE.options.filmParams[2]);
        $('#quality_wrap > a').removeClass('active').filter(function(index) {
            return $(this).data('quality') == q;
        }).addClass('active');
        $('#vjs-menu').hide();
        $('#vjs-menu .vjs-menu-item').removeClass('vjs-selected').each(function(index) {
          var text = $(this).find('font').text(); 
          if(text == q.toString()){
              $(this).addClass('vjs-selected');
          }
        });
    };
    
    module.changePlayIndex = function (q,isChange) {
        if(isChange){
            VIDEOPLAYER.playList(module.getPlaylist(), {
                getVideoSource: function(vid, cb) {
                  cb(vid.src, vid.poster);
                }
            });
        }
        VIDEOPLAYER.playList(q);
    };
    
    return module; 
}(TREE_HTML || {},jQuery,videojs,TREE,window));



function log(item) {
  console.log(item);
}
$(document).ready(function() {
	$('#vjs-menu .vjs-menu-item').live('click', function(event) {
	    var q = parseInt($(this).find('font').text());
	    var params = TREE.options.filmParams;
        TREE.changefilmParams(params[0], q, VIDEOPLAYER.playList('getIndex'));
	    TREE_HTML.changePlayQuality(q);
		return false;
	});
	
});
