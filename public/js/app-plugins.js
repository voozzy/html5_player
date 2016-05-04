var Plugins = (function ($) {
    var videoJsButtonClass = videojs.getComponent('Button');
    var videoJsMenuClass = videojs.getComponent('MenuButton');
    var MenuItem = videojs.getComponent('MenuItem');
    var videoJsBigPlayButtonClass = videojs.getComponent('BigPlayButton');
    var folder = 0;
    var firstFolder = null;

    function backButton(playerInstance) {
        var backButtonClass = videojs.extend(videoJsButtonClass, {
            constructor: function (player, options, onClickListener, label) {
                videoJsButtonClass.call(this, player);
                this.controlText('Back');
            },
            handleClick: function () {
                console.log('backButton')
                playerInstance.prev();
            },
            text: "Press me"
        });

        var _backButton = new backButtonClass(playerInstance);
        videojs.addClass(_backButton.el(), 'vjs-back-button');
        playerInstance.controlBar.backButton = playerInstance.controlBar.el_.insertBefore(_backButton.el_, playerInstance.controlBar.getChild('volumeMenuButton').el_);
        playerInstance.controlBar.backButton.dispose = function () {
            this.parentNode.removeChild(this);
        };
    };

    function forvardButton(playerInstance) {
        var forvardButtonClass = videojs.extend(videoJsButtonClass, {
            constructor: function (player, options, onClickListener, label) {
                videoJsButtonClass.call(this, player);
                this.controlText('Forvard');
            },
            handleClick: function () {
                console.log('forvardButton')
                playerInstance.next();
            },
        });

        var _forvardButton = new forvardButtonClass(playerInstance);
        videojs.addClass(_forvardButton.el(), 'vjs-forvard-button');
        playerInstance.controlBar.forvardButton = playerInstance.controlBar.el_.insertBefore(_forvardButton.el_, playerInstance.controlBar.getChild('volumeMenuButton').el_);
        playerInstance.controlBar.forvardButton.dispose = function () {
            this.parentNode.removeChild(this);
        };
    };

    function playlist(playerInstance, allSources, currentIndex, currentFolder, alreadyShow) {
        folder = currentFolder;
        if (!alreadyShow) {
            firstFolder = currentFolder;
        }
        var currentSources = allSources[folder];
        var getValue = function (label) {
            var item = $.map(currentSources.sources, function (v, k) {
                if (v.label === label) {
                    return k;
                }
            })[0];
            return item;
        };
        var getAllList = $.map(currentSources.sources, function (v, k) {
            return v.label;
        });
        var mainSources = getAllList || [];
        var choosen = mainSources[currentIndex];


        var label = document.createElement('span');
        videojs.addClass(label, 'vjs-playlist-button-label');

        var PlayListMenuItem = videojs.extend(MenuItem, {
            constructor: function (player, options, onClickListener, label) {
                this.onClickListener = onClickListener;
                this.label = label;
                MenuItem.call(this, player, options);
                this.src = options.src;
                this.on('click', this.onClick);
                this.on('touchstart', this.onClick);

                if (options.initialySelected) {
                    this.showAsLabel();
                    this.selected(true);
                    this.addClass('vjs-selected');
                }
            },
            showAsLabel: function () {
                if (this.label) {
                    this.label.innerHTML = this.options_.label;
                }
            },
            onClick: function (customSourcePicker) {
                this.onClickListener(this);
                var currentTime = this.player_.currentTime();
                var isPaused = this.player_.paused();
                this.showAsLabel();
                this.addClass('vjs-selected');
                if (!isPaused) {
                    this.player_.bigPlayButton.hide();
                }
                if (typeof this.options_.customSourcePicker === 'function') {
                    customSourcePicker = this.options_.customSourcePicker;
                }
                var handleSeekEvent = 'loadeddata';
                if (this.player_.techName_ !== 'Youtube' && this.player_.preload() === 'none' && this.player_.techName_ !== 'Flash') {
                    handleSeekEvent = 'timeupdate';
                }
                customSourcePicker(this.player_, this.src, this.options_.label);
            }
        });

        var PlayListMenuButton = videojs.extend(videoJsMenuClass, {
            constructor: function (player, options, settings, label) {
                this.sources = options.sources;
                this.label = label;
                this.label.innerHTML = options.initialySelectedLabel;
                videoJsMenuClass.call(this, player, options, settings);
                this.controlText('Seasons');

                var staticLabel = document.createElement('span');
                videojs.addClass(staticLabel, 'vjs-playlist-button');
                this.el().appendChild(staticLabel);
            },
            createItems: function () {
                var menuItems = [];
                var labels = this.options_.sources || [];
                var onClickUnselectOthers = function (clickedItem) {
                    menuItems.map(function (item) {
                        item.selected(item === clickedItem);
                        item.removeClass('vjs-selected');
                    });
                };
                for (var i = 0; i < labels.length; i++) {
                    menuItems.push(new PlayListMenuItem(
                        this.player_,
                        {
                            label: labels[i],
                            src: labels[i],
                            initialySelected: labels[i] === this.options_.initialySelectedLabel,
                            customSourcePicker: this.options_.customSourcePicker
                        },
                        onClickUnselectOthers,
                        this.label));
                }
                return menuItems;
            }
        });

        var PlayList = new PlayListMenuButton(playerInstance, {
            sources: mainSources,
            initialySelectedLabel: choosen,
            customSourcePicker: function (player, sources, label) {
                var value = getValue(label);
                playerMain.playIndex(value, folder);
                return player;
            }
        }, {}, label);

        videojs.addClass(PlayList.el(), 'vjs-playlist-menu');
        videojs.addClass(PlayList.el(), 'vjs-icon-chapters');

        $(PlayList.el()).click(function () {
            var $wrap = $('#playlistMenuWrap');
            $('.playlistMenuWrap').not($wrap).removeClass('active');
            $wrap.toggleClass('active');
        });
        playerInstance.controlBar.playList = playerInstance.controlBar.el_.insertBefore(PlayList.el_, playerInstance.controlBar.getChild('fullscreenToggle').el_);
        playerInstance.controlBar.playList.dispose = function () {
            this.parentNode.removeChild(this);
        };

        var _target = $(PlayList.el_).clone();
        _target.find('li').each(function() {
            if(firstFolder === folder && $(this).index() === currentIndex) {
                $(this).addClass('vjs-selected');
            } else {
                $(this).removeClass('vjs-selected');
            }
        }).click(function () {
            var _index = $(this).index();
            $(playerInstance.controlBar.el_).find('.vjs-playlist-menu li').eq(_index).click();
        });



        var playlistMenuWrap = $('<div>', {
            'id': 'playlistMenuWrap',
            'class': 'playlistMenuWrap playlist ' + (alreadyShow ? 'active' : '')
        });
        var _nameLink = $('<a>', {
            'class': 'active',
            'href': '#',
            'html': currentSources.name + ' <span class="playlist-menu-arrow"></span>'
        }).click(function () {
            renderFoldersList(playerInstance, allSources, currentIndex, folder);
        });
        var _name = $('<div>', {
            'class': 'playlistMenuTitle'
        }).append(_nameLink).append(_target.find('.vjs-menu-content').addClass('scroll-pane'));

        var _title = $('<div>', {
            'class': 'playlistMenuName',
            'html': '<span class="playlist-series-ico"></span> Сезоны <span class="playlist-menu-close" onclick="$(this).closest(\'\.playlistMenuWrap\'\).removeClass(\'\active\'\);"></span>'
        });
        var resultHtml = playlistMenuWrap.prepend(_name).prepend(_title);
        $('#playlistMenuWrap').remove();
        $(playerInstance.el_).append(resultHtml);
        playerMain.updateScrolls();
        //$('.scroll-pane', playerInstance.el_).jScrollPane();
    };


    function renderFoldersList(playerInstance, allSources, currentIndex, currentFolder) {
        $('#playlistMenuWrap').find('.playlistMenuTitle').hide();
        var _name = $('<div>', {
            'class': 'playlistMenuTitle playlistMenuFolders',
            'id': 'playlistMenuFolders',
            'html': '<ul class="scroll-pane"></ul>'
        });
        $.each(allSources, function(k, v) {
            var _nameLink = $('<a>', {
                'class': currentFolder === k ? 'active' : '',
                'href': '#',
                'html': v.name + ' <span class="playlist-menu-arrow enter"></span>'
            }).attr('data-folder', k).click(function () {
                $('#playlistMenuFolders').remove();
                playlist(playerInstance, allSources, currentIndex, $(this).data('folder'), true);
            });
            _name.find('ul').append(_nameLink);
        });

        //$('#playlistMenuWrap').append(_name).find('.scroll-pane').jScrollPane();
        $('#playlistMenuWrap').append(_name);
        playerMain.updateScrolls();
    };


    function playerSettings(playerInstance, currentSources, currentIndex) {
        var _target = $(playerInstance.controlBar.el_).find('.vjs-resolution-button').clone();
        _target.find('li').click(function () {
            var _index = $(this).index();
            $(this).parent().find('li').removeClass('vjs-selected');
            $(this).addClass('vjs-selected');
            $(playerInstance.controlBar.el_).find('.vjs-resolution-button li').eq(_index).click();
        });
        var _target2 = $(playerInstance.controlBar.el_).find('.vjs-audiotrack-button').clone();
        _target2.find('li').click(function () {
            var _index = $(this).index();
            $(this).parent().find('li').removeClass('vjs-selected');
            $(this).addClass('vjs-selected');
            $(playerInstance.controlBar.el_).find('.vjs-audiotrack-button li').eq(_index).click();
        });
        var settingsMenuWrap = $('<div>', {
            'id': 'settingsMenuWrap',
            'class': 'playlistMenuWrap'
        });

        var _targetContent = _target.find('.vjs-menu-content').find('li').each(function () {
            var text = $(this).text();
            if (text.indexOf('360') !== -1) {
                $(this).text('LQ (360)');
            } else if (text.indexOf('480') !== -1) {
                $(this).text('SD (480)');
            } else if (text.indexOf('720') !== -1) {
                $(this).text('HD (720)');
            } else if (text.indexOf('1080') !== -1) {
                $(this).text('Full HD (1080)');
            }
        }).parent();
        var _nameLink = $('<a>', {
            'class': 'active',
            'href': '#',
            'html': 'Качество: <span class="playlist-menu-arrow"></span>'
        }).click(function () {
            $(this).toggleClass('active').next().slideToggle();
        });
        var _name = $('<div>', {
            'class': 'playlistMenuTitle'
        }).append(_nameLink).append(_targetContent);

        var _title = $('<div>', {
            'class': 'playlistMenuName',
            'html': '<span class="playlist-settings-ico"></span> Настройки <span class="playlist-menu-close" onclick="$(this).closest(\'\.playlistMenuWrap\'\).removeClass(\'\active\'\);"></span>'
        });

        var _nameLink2 = $('<a>', {
            'class': 'active',
            'href': '#',
            'html': 'Дорожки: <span class="playlist-menu-arrow"></span>'
        }).click(function () {
            $(this).toggleClass('active').next().slideToggle();
        });
        var _name2 = $('<div>', {
            'class': 'playlistMenuTitle'
        }).append(_nameLink2).append(_target2.find('.vjs-menu-content'));


        var resultHtml = settingsMenuWrap.prepend(_name2).prepend(_name).prepend(_title);
        $(playerInstance.el_).append(resultHtml);
    };

    return {
        backButton: backButton,
        forvardButton: forvardButton,
        playlist: playlist,
        playerSettings: playerSettings
    };

})($);

