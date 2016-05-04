var Player = (function ($, Plugins) {

    var playModule = null;
    var currentSources = [];
    var allSources = [];
    var playerDiv = null;
    var defaultAudio = Cookies.get('hls_aud_lang') || 'Russian';
    var currentIndex = 0;
    var currentFolder = 0;
    var textSource = {
        'Pause' : 'Пауза',
        'Play' : 'Играть',
        'Back' : 'Назад',
        'Forvard' : 'Вперед',
        'Mute' : '',
        'Current Time' : 'Текущее время',
        'Duration Time' : 'Общее время',
        'Seasons' : 'Список серий/сезонов',
        'Settings' : 'Настройки',
        'Fullscreen' : 'Во весь экран',
        'Non-Fullscreen' : 'Выйти из полно-го режима'
    };
    var vastUrl = '';
    var pluginList = {
        backButton: Plugins.backButton,
        forvardButton: Plugins.forvardButton,
        playlist: Plugins.playlist
    };

    function initPlugins(playerInstance) {
        for (var plugin in pluginList) {
            if (pluginList.hasOwnProperty(plugin)) {
                pluginList[plugin](playerInstance, allSources, currentIndex, currentFolder);
            }
        }
    }

    function playerModule() {
    };

    function getInstance() {
        return playModule;
    }

    function initChangeQuality(src) {
        if (!playModule) {
            return;
        }
        var qualityList = $.map(src, function (v, k) {
            return v.name;
        });
        var getValue = function (label) {
            var item = $.map(src, function (v, k) {
                if (v.name === label) {
                    return v;
                }
            })[0];
            return item.value;
        };
        playModule.videoJsResolutionSwitcher({
            defaultValue: qualityList[hls.autoLevelCapping + 1],
            qualityList: qualityList,
            customSourcePicker: function (player, sources, label) {
                var value = getValue(label);
                hls.currentLevel = value;
                return player;
            }
        });
        setTimeout(function () {
            Plugins.playerSettings(playModule, currentSources, currentIndex);
        }, 200);

    }

    function initChangeAudio(src) {
        if (!playModule) {
            return;
        }
        playModule.videoJsAudioSwitcher({
            defaultValue: defaultAudio,
            audioList: src,
            customSourcePicker: function (player, sources, label) {
                hls.currentAudioLang = label;
                defaultAudio = label;
                Cookies.set('hls_aud_lang', label);
                return player;
            }
        });
    }

    function anotherTarget(event) {
        var $target = $(event.target);
        if (!$target.hasParent('.playlistMenuWrap') &&
            !$target.hasParent('.vjs-playlist-menu') &&
            !$target.hasParent('.vjs-resolution-button') &&
            !$target.hasParent('.vjs-fullscreen-control') &&
            !$target.closest('div').hasClass('jspPane')) {
            var $menu = playerDiv.parent().find('.playlistMenuWrap');
            if ($target.is('video') && $menu.hasClass('active')) {
                if (playModule.paused()) {
                    playModule.play();
                } else {
                    playModule.pause();
                }
            }
            $menu.removeClass('active');
        }
    }

    function videoDBLclick(e) {
        e.preventDefault();
        if (playModule.isFullscreen()) {
            playModule.exitFullscreen();
        } else {
            playModule.requestFullscreen();
        }
    }

    function getPlaylist(source) {
        var videos = [];
        for (var i = 0; i < source.length; i++) {
            videos.push({
                src: [source[i].src],
                poster: ''
            });
        }
        ;
        return videos;
    }

    function disposeVideo(isHlsPlay) {
        var videoDIV = {};
        playModule.pause();
        if (playModule && playModule.dispose) {
            playModule.dispose();
        }

        if (hls) {
            hls.destroy();
            if (hls.bufferTimer) {
                clearInterval(hls.bufferTimer);
                hls.bufferTimer = undefined;
            }
            hls = null;
        }

        videoDIV = $('#VIDEOPLAYER_WRAP video').parent();
        videoDIV.children().not('video').remove();
        videoDIV
            .attr('id', '')
            .attr('src', '')
            .attr('class', videoDIV.hasClass('video-js') ? 'video-js' : '')
            .find('video')
            .attr('id', 'video')
            .attr('controls', 'true');

        playModule = null;
        $(document).off('dblclick', 'video', videoDBLclick);
        $(document).off('click', playerDiv, anotherTarget);
    }

    function checkButtonStatus() {
        var currentSourcesLength = currentSources.sources.length;
        if (currentSourcesLength == 1) {
            $('.vjs-back-button').addClass('vjs-disable');
            $('.vjs-forvard-button').addClass('vjs-disable');
        } else if (currentSourcesLength == currentIndex + 1) {
            $('.vjs-back-button').removeClass('vjs-disable');
            $('.vjs-forvard-button').addClass('vjs-disable');
        } else if (currentIndex == 0) {
            $('.vjs-back-button').addClass('vjs-disable');
            $('.vjs-forvard-button').removeClass('vjs-disable');
        } else {
            $('.vjs-back-button').removeClass('vjs-disable');
            $('.vjs-forvard-button').removeClass('vjs-disable');
        }
    }

    function updateScrolls() {
        var scrolls = $('.scroll-pane:visible');
        var api = scrolls.data('jsp');
        if (api) {
            api.reinitialise();
        } else {
            scrolls.jScrollPane();
        }
    }

    function initMainModule() {
        playModule = videojs('video', {
            inactivityTimeout: 5000
        }).ready(function () {
            this.hotkeys({
                volumeStep: 0.1,
                seekStep: 60,
                enableMute: true,
                enableFullscreen: true
            });
            playModule.on('fullscreenchange', function () {
                console.log('fullscreenchange-----------------');
                $(this.el_).focus();
                $(this.el_).find('.vjs-fullscreen-control').blur();
                updateScrolls();
            });
            $('.vjs-volume-level').css('width', (this.volume() * 100) + '%');
        });
        initPlugins(playModule);
        playModule.playList(getPlaylist(currentSources.sources), {}, currentIndex);
        checkButtonStatus();
    }

    function adEnd() {
        disposeVideo();
        //$('#first-loader').remove();
        loadStream(currentSources.sources[currentIndex].src);
        //setTimeout(function () {
        initMainModule();
        //}, 10);
    }

    function init(playerId, sources) {
        //var vastUrl = 'http://n161adserv.com/vast.xml?key=1fe108bad5dfe9ac67cd146a49516806&no_imp_overlay=true&vastv=3.0';
        var vastUrl = 'http://inv-nets.admixer.net/dsp.aspx?rct=3&zone=66c10b4c-7fca-4eab-b8ab-474846619acb&zoneInt=9257&sect=2536&site=2287&rnd=2101545120';

        playerDiv = $('#' + playerId).attr('controls', true);
        playModule = videojs(playerId);
        allSources = sources;
        currentSources = sources[currentFolder];




        if (currentSources.sources.length === 0) {
            return alert('No sources added');
        }
        if (vastUrl) {
            playModule.ready(function () {
                $('#first-loader').remove();
                playModule.ads();
                playModule.vast({
                    url: vastUrl
                });

                playModule.play();
                playModule.on('contentupdate', function () {
                    console.log('contentupdate');
                });
                playModule.on('fullscreenchange', function () {
                });
                playModule.on('adstart', function (event) {
                    console.log('adstart');
                });
                playModule.on('gofilm', function (event) {
                    console.log('gofilm');
                });
                playModule.on('adsready', function (event) {
                    console.log('adsready');
                });
                playModule.on('adtimeout', function (event) {
                    adEnd();
                    console.log('adtimeout');
                });
                playModule.on('firstplay', function () {
                    playModule.requestFullscreen();
                    console.log('firstplay-----------------');
                });
                playModule.on('fullscreenchange', function () {
                    console.log('fullscreenchange-----------------');
                });
                playModule.on('loadedalldata', function () {
                    console.log('loadedalldata-----------------');
                });
                playModule.on('loadeddata', function () {
                    console.log('loadeddata-----------------');
                });
                playModule.on('loadedmetadata', function () {
                    console.log('loadedmetadata-----------------');
                });
                playModule.on('loadstart', function () {
                    console.log('loadstart-----------------');
                });
                playModule.on('pause', function () {
                    console.log('pause-----------------');
                    playModule.bigPlayButton.show();
                });
                playModule.on('play', function () {
                    console.log('play-----------------');
                    playModule.bigPlayButton.hide();
                });
                playModule.on('readyforpreroll', function () {
                    playModule.one('adended', function () {
                        playModule.ads.endLinearAdMode();
                    });
                    playModule.one('adclick', function () {
                        console.log('adclick');
                        playModule.vast.tearDown();
                        setTimeout(function () {
                            playModule.pause();
                        }, 1000);
                    });
                    playModule.one('durationchange', function () {
                        console.log('durationchange');
                    });
                    playModule.one('adscanceled', function () {
                        console.log('adscanceled');
                    });
                    playModule.one('ended', function () {
                        console.log('ended');
                    });
                    playModule.one('adend', function (event) {
                        console.log('adend');
                        adEnd();
                    });
                });

                $(document).on('click', playerDiv, anotherTarget);
                $(document).on('dblclick', 'video', videoDBLclick);

                 $( "#VIDEOPLAYER_WRAP" ).contextmenu(function() {
                       return false;
                 }).on('mouseover click', '.vjs-menu-button, .vjs-control', function(e) {
                     //var span = $(this).find('.vjs-control-text');
                     //setTimeout(function(){
                     //    span.text(textSource[span.text()]);
                     //}, 10);
                 });
            });
        } else {
            adEnd();
        }
    };

    function setPlaylist(path) {
        return $.when($.getJSON(path));
    };

    function playIndex(index, folder) {
        if (typeof index === 'undefined') {
            index = 0;
        }

        currentFolder = typeof folder !== 'undefined' ? folder : currentFolder;
        currentIndex = index;
        setTimeout(function () {
            disposeVideo(true);
            init(playerWrap, allSources);
        }, 10);
    };

    function getCurrentFolder() {
        return currentFolder;
    };

    playerModule.prototype.init = init;
    playerModule.prototype.setPlaylist = setPlaylist;
    playerModule.prototype.getInstance = getInstance;
    playerModule.prototype.initChangeQuality = initChangeQuality;
    playerModule.prototype.initChangeAudio = initChangeAudio;
    playerModule.prototype.playIndex = playIndex;
    playerModule.prototype.getCurrentFolder = getCurrentFolder;
    playerModule.prototype.disposeVideo = disposeVideo;
    playerModule.prototype.updateScrolls = updateScrolls;
    return playerModule;

})($, Plugins);


var playerWrap = 'video';
var playerMain = new Player();
//playerMain.setPlaylist('http://testcdn.3tv.im/gen.php?file=' + FileListId).then(function(data){
//playerMain.setPlaylist('http://test.tree.tv/test/index/test1?file=12240').then(function(data){
 playerMain.setPlaylist('http://test.tree.tv/test/index/test1?file='+ FileListId).then(function(data){
//playerMain.setPlaylist('source.json').then(function (data) {
    playerMain.init(playerWrap, data);
}, function () {
    alert('no source, error');
});

$.fn.hasParent = function (objs) {
    objs = $(objs);
    var found = false;
    $(this[0]).parents().andSelf().each(function () {
        if ($.inArray(this, objs) != -1) {
            found = true;
            return false;
        }
    });
    return found;
};

$(function () {
    $('#prev').click(function () {
        playerMain.getInstance().prev();
    });
    $('#next').click(function () {
        playerMain.getInstance().next();
    });
})










