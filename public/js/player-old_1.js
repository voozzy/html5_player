
var TREE = (function (module,$) { 
	
	var $cashe = null;
	module.cashe = function(obj,type) {
	  return function tempCashe(obj,type) {
	  		if(type == 'set'){
	  			$cashe = obj.source;
	  		}else if(type == 'get') {
	  			return $cashe || {};
	  		}
	  }.call(this,obj,type);
	};
	module.getPrerollLink = function () {
        return [
        'http://ad.admixer.net/AdVideoXml.aspx?zone=2728d5f9-5a41-4fe2-b4ab-4fc30dc38a32&creativeExt=flv',
        'http://ads.adfox.ru/175105/getCode?p1=bliki&p2=emxn&pfc=a&pfb=a&plp=a&pli=a&pop=a&puid1=&puid2=&puid3=&puid22=&puid25=&puid27=&puid31=&puid51=&puid52=',
        'http://www.mxttrf.com/vast.xml?key=e0dc11506033552921fd9322b6203b89'
        ];
	}
	module.options = {};
	module.html = (function () {
	  var temp = true;
	  if($.browser.safari){
	      temp = false;
	  }
	  if($.browser.msie && $.browser.version <= 9){
	      temp = false;
	  }
	  if(!(Modernizr.video && Modernizr.video.h264)){
	      temp = false;
	  }
      return temp;
	})();
	module.isTrailer = false;
	module.isCanChange = false;
    module.init = function (o) { 
        var params = o || {};
        module.cashe(params,'set');
        module.options = params;
    }; 
    module.resetParams = function () { 
	 	module.options.source = module.cashe({},'get');
    };
    module.changefilmParams = function (a,b,c) {
    	module.options.filmParams[0] = parseInt(a);
    	module.options.filmParams[1] = parseInt(b);
    	module.options.filmParams[2] = parseInt(c);
    };
    module.getfilmParams = function () { 
     	var arr = [];
     	arr[0] = module.options.filmParams[0];
     	arr[1] = module.options.filmParams[1];
     	arr[2] = module.options.filmParams[2];
     	return arr;
    };
    module.setActiveLink = function () {
    	var params = module.options.filmParams;
		var active_a = $('#scroll_pane_wrap [data-folder='+params[0]+'][data-quality='+params[1]+']').find("a[data-rel="+params[2]+"]"),
        text = module.isTrailer ? 'Трейлер: '+$('#film_object_name').text() : active_a.text().substring(0,55);
   		$('#video_popup .player_list_item').removeClass('active');
    	$('#drop_popup').text(text);
   		active_a.closest('.player_list_item').addClass('active');
    };
    module.scrollTo = function () { 
    	scroll();
    	var params = module.options.filmParams;
        var scrollTarget = $('#video_popup .scroll-pane[data-folder='+params[0]+'][data-quality='+params[1]+']'),
		api = scrollTarget.data('jsp'),
		active_a = scrollTarget.find("a[data-rel="+params[2]+"]");
		if (api){ api.scrollToElement(active_a,true,true);}	
    };
    module.endTop = function () {
    	var Popup = $('#popup');
		if ($(window).height() < Popup.height()+150){
			return $(window).scrollTop()+30;
		}else {
			return ($(window).height() - Popup.height())/2 + $(window).scrollTop();
		}
	};
	module.initFLASH = function (trailer) {
		var playerUrl = "/js/treeTV_new20.swf";
		if(trailer){
			playerUrl = "/js/treeTV29.swf";
		}
	     $('#FLASH_WRAP').empty().show();
	     if(!$('#obj').length){
	         $('#FLASH_WRAP').append('<div id="obj" class="obj_div" style="height: 360px;width: 680px;"></div>');
	     }
         $('#VIDEOPLAYER_WRAP').hide();
         var flashvars = {"uid" : "obj",   "m" : "video", "auto":"none"};
         var parametrs = { id : "myplayer",  allowFullScreen : "true", wmode: 'direct',  allowScriptAccess : "always",   bgcolor: "#000000" };
         var player = new swfobject.embedSWF(playerUrl, "obj", "680", "360", "9.0.115", false, flashvars, parametrs);
    };


    module.changePlayer = function () {
		  var playerType = $.session.get('player');
		  if(playerType == '0') {
			  try{
				  TREE_HTML.InitHTMLPlayer();
			  }
			  catch(e){
				  log(e);
				  message('Внимание!','Произошла ошибка плеера html5. обратитесь к администратору!','error');
				  TREE_HTML.prepear();
				  $.session.set('player','1');
				  module.toggleBlocks();
				  module.initFLASH();
			  }
		  }else if(playerType == '1') {
			  TREE_HTML.prepear();
			  module.initFLASH();
		  }
		  module.isCanChange = false;
    };
    module.toggleBlocks = function(playerType) {
        var type = playerType || $.session.get('player');
        if(!type){
            type = '0';
            $.session.set('player','0');
        }
        if(module.html){
           $('#change_player_wrap').show().find('a').removeClass('active').filter(function(){
                return $(this).data('player') == type;
           }).addClass('active');
           if(type == '0') {
                $('#FLASH_WRAP').empty().hide();
                $('#VIDEOPLAYER_WRAP').show();
           }else if(type == '1') {
                $('#FLASH_WRAP').empty().show().append('<div id="obj" class="obj_div" style="height: 360px;width: 680px;"></div>');
                $('#VIDEOPLAYER_WRAP').hide();
           }
        }else {
            $('#FLASH_WRAP').empty().show().append('<div id="obj" class="obj_div" style="height: 360px;width: 680px;"></div>');
            $('#VIDEOPLAYER_WRAP').hide();
        }
        return this;
    };
    module.playerInit = function() {
    		$('#center_preload').attr('id','center_load');
			var playerType = $.session.get('player');

			if(module.isFrame) {
				$('#VIDEOPLAYER_WRAP').hide();
				$('#FLASH_WRAP').hide();
				$('#drop_popup').text(TREE.isFrameName);
				$('<iframe>', { src: TREE.isFrameUrl, width: 680, height: 360, allowFullScreen: true, border:0}).appendTo('#IFRAME_WRAP');
			}else if(!module.html || module.isTrailer){
                module.initFLASH(module.isTrailer);
            }else if(playerType == '0' || isMobile.any()) {
                try{
                    TREE_HTML.InitHTMLPlayer();
                }
                catch(e){
                    log(e);
                    message('Внимание!','Произошла ошибка плеера html5. обратитесь к администратору!','error');
                    TREE_HTML.prepear();
                    $.session.set('player','1');
                    module.toggleBlocks();
                    module.initFLASH();
                }
            }else if(playerType == '1') {
                    module.initFLASH();
            }
  		    if(window.socket){
			  	socket.send(JSON.stringify({'idSocket':localStorage.getItem('idSocket'),'type':'mobile','player':'true'}));
			}
			if(module.isFrame) {
				$('#change_player_wrap').hide();
				$('.player_menu').hide();
				$("#seti_wrap_popup").css({"padding-top":"20px", "padding-left":"25px"});
			} else {
				module.buttons();
			}

    };
    module.setUserTime = function(type) {
	  	if(window.isLogin){
	  		if(type){
				window.TREEtimer = setInterval(function(){
					module.confirm.inter('add');
				},1000);
			}else {
				if(window.TREEtimer){
					clearInterval(window.TREEtimer);
					delete window.TREEtimer;
				}
			}
	  	}
	  }
	  
	  
    module.confirm = {
	  	timer : null,
	  	isFirst : true,
	  	inter : function (type) {
	  	    var isPreroll = module.html == true ? ($('#VIDEOPLAYER_flash_api').length ? 'true' : 'false') : TreePlayerGet('obj','getAdvertisement');
	  		if(!module.confirm.isFirst && isPreroll == "false"){
	  		    // console.log(module.options.filmParams);
				var data = {};
				var params = module.options.filmParams,
				filmInfo = module.options.filmInfo,
				fileData = $('#accordion_wrap .accordion_content_item[data-folder="'+params[0]+'"][data-quality="'+params[1]+'"][data-index="'+params[2]+'"]').data();
				if(type == 'add'){
					data.type = 'insert';
					data.film_id = module.options.filmID;
					data.file_id = fileData.file_id;
					data.time = (module.html && $('#VIDEOPLAYER').is('div')) ? VIDEOPLAYER.currentTime() : TreePlayerGet('obj','getCurrentTime');
					data.alltime = (module.html && $('#VIDEOPLAYER').is('div')) ? VIDEOPLAYER.duration() : TreePlayerGet('obj','getAllTime');
				}else if(type == 'del'){
					data.type = 'del';
					data.row_id = module.options.filmInfo.id;
				}
					if(type == 'add'){
						if(!module.options.filmInfo){
							module.options.filmInfo = {};
						}
						module.options.filmInfo.time_view = data.time;
						module.options.filmInfo.file_id = fileData.file_id;
						module.confirm.timer = data.time;
						module.options.filmInfo.isHalf = true;
						// console.log(data.time);
						// if(data.time == 0.001 || data.time == 0){
							// module.options.filmInfo.isHalfLoad = false;
						// }
						
						if(data.time){
						    var storage = {};
                            storage.file_id = fileData.file_id;
                            storage.time_view = data.time;
                            storage.timer = data.time;
                            localStorage.setItem(TREE.options.filmID, JSON.stringify(storage));
                             // console.log(JSON.stringify(storage));
                             // console.log(module.options.filmInfo.isHalf + ' isHalf');
                             // console.log(module.options.filmInfo.isHalfLoad+ ' isHalfLoad');
                             
                            
                             
                            if(module.options.filmInfo.isHalf && !module.options.filmInfo.isHalfLoad){
                                $.get('/film/index/timeprosmotr', data, function(response){
                                    try {
                                        if($.parseJSON(response) == 'ok'){
                                            module.options.filmInfo.isHalfLoad = true;
                                            $('#accordion_wrap .accordion_content_item[data-file_id="'+fileData.file_id+'"]')
                                        .find('.view_eye').addClass('active').attr('title','Смотрел');
                                        }
                                    } catch(e){}
                                });
                            }
                            
                            
                            
                            
                            
						}
						
					}

			}
		}
	  };
 	module.openFilm = function(link) {
 		if(load_flag){
 			return;
 		}
 		load_flag = true;
 			var Popup = $('#popup');
			if(window.socket){
			  	socket.send(JSON.stringify({
			  		'idSocket':localStorage.getItem('idSocket'),
			  		'type':'mobile',
			  		'filmIndex':module.options.filmParams[2],
			  		'folder':module.options.filmParams[0],
			  		'quality':module.options.filmParams[1],
			  		'preview':$('#preview_img').attr('src'),
			  		'filmName' : module.options.filmParams[3].fileName
			  	}));
			}
			$('#popup_wrap').fadeIn(150);
			$.get(module.options.filmParams[3].url,{},function(data){
				Popup.show(100,function(){
					 $('#popup_content').empty().html(data);
					 module.toggleBlocks();
					 if(module.isTrailer){$('#FLASH_WRAP').empty().show().append('<div id="obj" class="obj_div" style="height: 360px;width: 680px;"></div>');}
					 Popup.css({'marginLeft': '-'+Popup.width()/2+'px','top':$(window).height()*2+'px'});
					 Popup.animate({'opacity':1,'top':module.endTop()+'px'},400,function(){
							module.playerInit(); 
							setTimeout(function(){trn();},60000);
							if(isLogin && !module.isTrailer){
								module.setUserTime(true);
							}
							load_flag = false;
					 });
					$('#popup_wrap').addClass('film');
					$('#popup select').styled();
						
				});
			});
		
		  		
  	};
 	module.buttons = function() {
 	    $(document).unbind('keydown').bind('keydown', function(event) {
          if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
               event.which = event.charCode != null ? event.charCode : event.keyCode;
            }
            if (event.which === 32 && typeof VIDEOPLAYER != 'undefined') {
                event.preventDefault();
                if(TREE.html == true && !$('#obj').length){
                    if (VIDEOPLAYER.paused()) {
                      VIDEOPLAYER.play();
                    } else {
                      VIDEOPLAYER.pause();
                    }
                }else {
                    if(TreePlayerGet('obj','getAdvertisement') != 'true'){
                        TreePlayerSend('obj',{'setVideoTogglePause' : 'true'});
                    }
                }
              }
        });
  		$('#quality_wrap > a').bind('click', function(event) {
				if(!$(this).hasClass('active')){
				    if(TREE.html == true){
                        if(!$('#VIDEOPLAYER_html5_api').length && !$('#obj').length || !TREE.isCanChange){
                           return false;
                        }
                    }
					var params = module.options.filmParams;
					var index = params[2],
					target = $(this).data(),
					folder = params[0];
					$('#quality_wrap > a').removeClass('active');
					$(this).addClass('active');
					$('#scroll_pane_wrap .scroll-pane').hide();
					$('#scroll_pane_wrap .scroll-pane.'+folder+'_'+target.quality).show();
					module.changefilmParams(folder,target.quality,index);
					if(TREE.html == true && !$('#obj').length){
					    TREE_HTML.changePlayQuality(target.quality);
					}else {
					    TreePlayerSend('obj',{'setVideoQuality':target.quality});
					}
					
				}
			return false;
		
		});
		$('#video_popup .player_menu .select_menu select').bind('change', function(event) {
			var folder = $(this).find('option:selected').val(),
			quality = $('#quality_wrap a.active').data(),
			index = $('#scroll_pane_wrap .player_list_item.active').index(),
			show = $('#scroll_pane_wrap [data-folder='+folder+'][data-quality='+quality.quality+']');
			$("#scroll_pane_wrap .scroll-pane").hide();
			show.show();
			scroll();
		});
		$('#video_popup .player_list_name_main a').bind('click', function(event) {
			if (!$(this).closest('.player_list_item').hasClass('active'))
			{	
			    if(TREE.html == true){
			        if(!$('#VIDEOPLAYER_html5_api').length && !$('#obj').length){
                       return false;
                    }
			    }
			    var params = module.options.filmParams;
				var folder = $(this).closest('.scroll-pane').data('folder'),
				quality = $(this).closest('.scroll-pane').data('quality'),
				index = parseInt($(this).attr('data-rel'));
				var isChange = params[0] != folder;
				module.changefilmParams(folder,quality,index);
				try{
				   if(TREE.html == true && $.session.get('player') == '0'){
                        TREE_HTML.changePlayIndex(index,isChange);
                        TREE_HTML.InitHTMLPlayer();
                    }else {
                        TreePlayerSend('obj',{'playInfo':[folder,quality,index]});
                    } 
				}catch(e){
				    log(e);
				}
			}
			
			return false;
		});
		
		$('#change_player_wrap a').bind('click', function(event) {
		      var type = $(this).data('player');
		      if(!$(this).hasClass('active') && TREE.isCanChange){
		          $.session.set('player',type);
		          $('#change_player_wrap a').removeClass('active');
		          $(this).addClass('active');
		          TREE.toggleBlocks(type);
		          TREE.changePlayer();
		      }
		      return false;
        });
	}
    return module; 
}(TREE || {},jQuery));


function test(text) {
  console.log(text);
}

$(document).ready(function() {
	
	$('#accordion_wrap a.watch_link').bind('click',function(e){

		$('#likes,#commercial_link').hide();
		if(isActive != '1'){
           $('#left_up').nextAll().remove();
           $('#bannerscomment_wrap').empty();
        }
		
		TREE.resetParams();
		var data = $(this).closest('.accordion_content_item').data(),
		text = $(this).closest('.accordion_content_item').find('.file_title').text(),
		url = $(this).data('href'),
		isFrame = $(this).data('frame');


		if(isMobile.any()){
			if(isLogin){
				var dataProsmotr = {};
			 dataProsmotr.type = 'insert';
			 dataProsmotr.time = 0.001;
			 dataProsmotr.alltime = 10;
			 dataProsmotr.film_id = TREE.options.filmID;
			 dataProsmotr.file_id = data.file_id;

            $.get('/film/index/timeprosmotr', dataProsmotr, function(response){
                try{
                    if($.parseJSON(response) == 'ok'){
                        window.location.assign(TREE.options.source[data.folder][data.quality][data.index]);
                    }
                }catch(e){}
            });
			}else{
				window.location.assign(TREE.options.source[data.folder][data.quality][data.index]);
			}
			return false;
		}

        var fileLocalInfo = $.parseJSON(localStorage.getItem(TREE.options.filmID));

		if(isLogin &&
		   fileLocalInfo && 
		   fileLocalInfo.file_id == data.file_id.toString() && 
		   parseInt(fileLocalInfo.time_view) > 0 && !window.socket){
			
			var filmInfo = fileLocalInfo;
			var newData = $('#accordion_wrap .accordion_content_item[data-file_id="'+filmInfo.file_id+'"][data-quality="'+data.quality+'"]').data();

			Load({'type':'confirm',
			'text':'Возобновить воспроизведение с последнего места остановки?',
			'input_id':'confirm_play_time',
			'success':function(){
				$('#popup input').bind('click',function() {
					var $that = $(this);
					popupEmpty(function(){
					   var tempData = null,timer = filmInfo.time_view;
					   if($that.attr('id') != 'confirm'){
					   		tempData = data;
					   		timer = null;
					   }else {
					   		tempData = newData;
					   }
					   TREE.options.filmParams = [parseInt(tempData.folder),parseInt(tempData.quality),parseInt(tempData.index), {
					   		'fileId' : tempData.file_id,
					   		'url': url,
					   		'fileName' : text
					   }];
					   TREE.confirm.inter('del');
					   TREE.confirm.timer = timer;
					   TREE_HTML.isChangeQuality = true;
                       TREE_HTML.isChangeQualityTime = timer;
					   TREE.openFilm();
					});
				});
			}});
		}else {
			var requestUrl = url;
			if(isFrame) {
				TREE.isFrame = true;
				TREE.isFrameUrl = url;
				TREE.isFrameName = text;
				requestUrl = '/film/index/film';
			}
			TREE.options.filmParams = [parseInt(data.folder),parseInt(data.quality),parseInt(data.index),{
		   		'fileId' : data.file_id,
		   		'url': requestUrl,
		   		'fileName' : text
		   	}];
		   	TREE.confirm.isFirst = false;
			TREE.openFilm();
		}
		return false;
	});
	
	
	
	$('#popup_close').live('click', function(event) {
		$('#popup_wrap').removeClass('film');
		try{
		   if(typeof VIDEOPLAYER != 'undefined' && !$(VIDEOPLAYER).is('video')){
              VIDEOPLAYER.dispose();
           }  
		}catch(e){log(e);}
		  
		popupEmpty(function(){
			$('#center_load').attr('id','center_preload');
			TREE.setUserTime(false);
			TREE.confirm.isFirst = true;
			TREE.isTrailer = false;
			// if(isActive != '1'){
			    // $('#left_up').after('<iframe width="250" height="900" scrolling="no" src="/film/index/banners"></iframe>');
			    // $('#bannerscomment_wrap').append('<iframe src="/film/index/bannerscomment" frameborder="0" width="720" height="320"></iframe>');
			// }
			
			delete VIDEOPLAYER;
		});
		return false;
	});

	$('#video_wrap').live('mousewheel DOMMouseScroll', function(e) {
	 	var scrollTo = null;

	    if (e.type == 'mousewheel') {
	        scrollTo = (e.originalEvent.wheelDelta * -1);
	    }
	    else if (e.type == 'DOMMouseScroll') {
	        scrollTo = 40 * e.originalEvent.detail;
	    }
	
	    if (scrollTo) {
	        e.preventDefault();
	        $(this).scrollTop(scrollTo + $(this).scrollTop());
	    }
	});
	$('#VIDEOPLAYER').live('mousewheel DOMMouseScroll', function(e) {
        var scrollTo = null;

        if (e.type == 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -1);
        }
        else if (e.type == 'DOMMouseScroll') {
            scrollTo = 40 * e.originalEvent.detail;
        }
        try{
            var v = Math.floor(VIDEOPLAYER.volume()*100);
            if(!isNaN(scrollTo)){
                if(scrollTo > 0){
                    v -= 10;
                }else {
                    v += 10;
                }
            }
            VIDEOPLAYER.volume(v/100);
        }catch(e){
            log(e);
        }
        
        if (scrollTo) {
            e.preventDefault();
            $(this).scrollTop(scrollTo + $(this).scrollTop());
        }
    });
	$('#trailer_link').live('click', function(event) {
		var url = $(this).attr('href');
		if(isActive != '1'){
               $('#left_up').nextAll().remove();
               $('#bannerscomment_wrap').empty();
        }
		TREE.options.source = {'1':[[$(this).attr('data-rel')]]};
		TREE.options.filmParams = [1,0,0,{
	   		'fileId' : null,
	   		'url': url,
	   		'fileName' : null
	   	}];
	   	TREE.isTrailer = true;
		TREE.openFilm();
		
		return false;
	});


});
function trn()

{
var img = new Image();
img.src = 'http://luxup.ru/tr/27177/&r=' + escape(document.referrer)+ '&t=' + (new Date()).getTime()+ '&tref=' + escape(document.location.href + "&action=download");
}


function TreePlayer(event) {
	test(event);
	switch(event){

			case 'init': 
					var params = TREE.options.filmParams;
					TreePlayerSend('obj',{'playInfo':params});
			break;
			case 'start': 
					var params = TREE.options.filmParams,
					playIndex = TreePlayerGet('obj','getIndex'),
					playQuality = TreePlayerGet('obj','getQuality'),
					fileData = $('#accordion_wrap .accordion_content_item[data-folder="'+params[0]+'"][data-quality="'+playQuality+'"][data-index="'+playIndex+'"]').data();
                    // if(!playQuality || playIndex){
                        // return;
                    // }
					TREE.changefilmParams(params[0],playQuality,playIndex);
					TREE.setActiveLink();
					TREE.scrollTo();
					console.log(TreePlayerGet('obj','getAdvertisement'));
					if(TreePlayerGet('obj','getAdvertisement') == 'true' && $.session.get('player')=='0' && TREE.html){
					    TREE.isAddHtml = true;
					}
					//if(isLogin != ''){
					    $.get('/film/index/usersprosmotrfiles',{'files_id':fileData.file_id,'quality':fileData.quality},function(data){
                            // if($.parseJSON(data) != 'no'){
                                // $('#accordion_wrap .accordion_content_item[data-folder="'+params[0]+'"][data-index="'+playIndex+'"]').find('.view_eye').addClass('active').attr('title','Смотрел');                      }
                        });
					//}
				break;
			case 'play': 

			        TREE.isCanChange = true;
			        if(!TREE.options.filmInfo){
                        TREE.options.filmInfo = {};
                    }
                    
					TREE.options.filmInfo.isHalfLoad = false;
			        if(TREE.isAddHtml && !TREE.isTrailer){
			            TREE.isAddHtml = false;
			            TREE.toggleBlocks('0');
			            TREE_HTML.UpdateHTMLPlayer();
			        }
					setTimeout(function () {
						var isLoaded = TreePlayerGet('obj','getprocent');
						if(isLoaded !== '0'){
						    clearInterval(window.mobileTime);
							intervalSend();
						}
					},30);
					
				break;
			case 'pause': 
					if(window.mobileTime){
				      	clearInterval(mobileTime);
				    }
				    if(window.socket){
					  	socket.send(JSON.stringify({
					  		'idSocket':localStorage.getItem('idSocket'),
					  		'type':'mobile',
					  		'isPaused': 'true'
					  	}));
					}
				break;
			case 'theend':
				var params = TREE.options.filmParams;
				TREE.options.filmParams[2] = parseInt(params[2])+1;
				if(window.socket){
				  	socket.send(JSON.stringify({
				  		'idSocket':localStorage.getItem('idSocket'),
				  		'type':'mobile',
				  		'theEnd': 'true'
				  	}));
				}
				if(window.mobileTime){
				   clearInterval(mobileTime);
				   popupEmpty();
				}
				break;
			case 'updateMetaData':
					if(window.socket){
					  	socket.send(JSON.stringify({
					  		'idSocket':localStorage.getItem('idSocket'),
					  		'type':'mobile',
					  		'currentTime': TreePlayerGet('obj','getCurrentTime'),
					  		'allTime': TreePlayerGet('obj','getAllTime')
					  	}));
					  	setTimeout(function () {
						  	if(window.mobileTime){
						      	clearInterval(window.mobileTime);
						    }
						  	intervalSend();
					  	},30);
					}
					if(TREE.confirm.timer && TREE.confirm.isFirst){
						setTimeout(function(){
						    TREE.confirm.isFirst = false;
							TreePlayerSend('obj',{'setRewind':parseInt(TREE.confirm.timer)-5});
						},50);
					}
				break;
			case 'volume':
					
				break;
			case 'quality':
					var params = TREE.options.filmParams,
					playQuality = TreePlayerGet('obj','getQuality'),
					index = params[2],
					folder = params[0];
					$('#quality_wrap > a').removeClass('active');
					$('#quality_wrap > a[data-quality="'+playQuality+'"][data-folder="'+folder+'"]').addClass('active');
					$('#scroll_pane_wrap .scroll-pane').hide();
					$('#scroll_pane_wrap .scroll-pane.'+folder+'_'+playQuality).show();
					scroll();

				break;	
	}
}

function initPlayer() {
	return TREE.options.source;
}

function test(value) {
	console.log(value);
}


function uppodSend(playerID,com,callback) {
	var player = testFlash(playerID);
	player.sendToUppod(com);
}
function TreePlayerSend(playerID,com) {
	var player = testFlash(playerID);
	if(player){
		player.TreePlayerSend(com);
	}
}
function TreePlayerGet(playerID,com) {
	var player = testFlash(playerID);
	if(player && player.TreePlayerGet){
		return player.TreePlayerGet(com);
	}else {
		console.log('player Error')
	}
}
function treeSend(playerID,com) {
	var player = testFlash(playerID);
	player.sendTree(com);
}
function uppodGet(playerID,com,callback) {
	var player = testFlash(playerID);
	return player.getUppod(com);
}
function testTree(params) {
	console.log(params);
}

function intervalSend() {
	if(window.socket){
		window.mobileTime = setInterval(function(){
	  		socket.send(JSON.stringify({
		  		'idSocket':localStorage.getItem('idSocket'),
		  		'type':'mobile',
		  		'currentTime': TreePlayerGet('obj','getCurrentTime'),
				'allTime': TreePlayerGet('obj','getAllTime')
		  	}));
	  	},3000);
	}
}
function getPrerollLinks() {
  return TREE.getPrerollLink();
}
function testFlash (playerID) {
  	if (window.document[playerID])
	{	
		return window.document[playerID];
	}
		if (navigator.appName.indexOf("Microsoft Internet")==-1)
	{
		
		if (document.embeds && document.embeds[playerID])
		return document.embeds[playerID];
	}
		else// if (navigator.appName.indexOf("Microsoft Internet")!=-1)
	{		
		return document.getElementById(playerID);
	}
}




