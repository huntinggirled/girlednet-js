(function($){
	'use strict';
	var items = [];
	var artistTitles = [];
	var settings;
	var page = 0;
	var timer;
	var locationHostArrayReverse = location.host.split('.').reverse();
	var locationHost = locationHostArrayReverse[1]+"."+locationHostArrayReverse[0];
	$.fn.lastfm = function(options) {
		var defaults = {
			username: 'huntinggirled'
			,apikey: '1b5830677a2a62d47c10b6916034a4b0'
			,interval: 1000
			,reload: 600000
			,limit: 50
			,default_count: 5
			,page_count: 5
			,onComplete: function(){}
		};
		settings = $.extend({}, defaults, options);
		if(settings.default_count>settings.page_count) settings.page_count = settings.default_count;
		if(settings.page_count>settings.limit) settings.limit = settings.page_count;
		var thisElem = $(this);
		thisElem.after('<div id="more_track" />');
		thisElem.getRecentTracks();
	}
	$.fn.getRecentTracks = function() {
		var eachfuncs = {
			relativeTime: function(ust) {
				var parsed_date = ust;
				var relative_to = (new Date().getTime()/1000);
				var delta = relative_to-parsed_date;
				if(delta<60) {
				//	return delta.toString()+'秒前';
					return "<img src=\"http://"+locationHost+"/js/lastfm/eq.gif\" alt=\"再生中\" width=\"12\" height=\"12\" /> 再生中";
				} else if(delta<(60*3)) {
					return "<img src=\"http://"+locationHost+"/js/lastfm/eq.gif\" alt=\"再生中\" width=\"12\" height=\"12\" /> 再生中";
				} else if(delta<(60*60)) {
					return (parseInt(delta/60)).toString() + '分前';
				} else if(delta<(24*60*60)) {
					return (parseInt(delta/3600)).toString() + '時間前';
				} else {
					return (parseInt(delta/86400)).toString() + '日前';
				}
			}
			,stripSlashes: function(str) {
				return (str+'').replace(/\0/g, '0').replace(/\\([\\'"])/g, '$1');
			}
			,elapsedTime: function(elem) {
				return elem.find('.ctime').each(function() {
					var ptime = $(this).html();
					var etime = eachfuncs.relativeTime($(this).data('datetime'));
					if(ptime!=etime) $(this).css('opacity', 0.0).html(etime).fadeTo('normal', 1.0);
				});
			}
			,printContent: function(elem, item) {
				var thisElem = elem;
				if(item==null) return false;
				var art = (item.image!=null && item.image[0]['#text']!=null && item.image[0]['#text']!='')?eachfuncs.stripSlashes(item.image[0]['#text']):'http://'+locationHost+'/js/lastfm/noimg_lfm.gif'
				,url = (eachfuncs.stripSlashes(item.url)!=null)?eachfuncs.stripSlashes(item.url):"http://"+locationHost+"/"
				,song = (item.name!=null)?item.name:"unknown title"
				,artist = (item.artist!=null && item.artist['#text']!=null)?item.artist['#text']:"unknown artist"
				,album = (item.album!=null && item.album['#text']!=null)?item.album['#text']:"unknown album"
				,date = (item.date!=null)?item.date['#text']:""
				,utsstr = (item.date!=null && item.date.uts!=null)?eachfuncs.relativeTime(item.date.uts):""
				,nowplaying = (item['@attr']!=null && item['@attr'].nowplaying!=null)?"<img src=\"http://"+locationHost+"/js/lastfm/eq.gif\" alt=\"再生中\" width=\"12\" height=\"12\" /> 再生中":""
				,datetime = (item.date!=null && item.date.uts!=null)?item.date.uts:parseInt(new Date().getTime()/1000)
				;
				var thisIndex = artistTitles.length;
				artistTitles[thisIndex] = new Array(artist, song);
				thisElem.append(
					'<div id="atrack-'+thisIndex+'" style="clear:both;">'
					+'<div class="ctime" data-datetime="'+datetime+'">'+nowplaying+utsstr+'</div>'
					+'<a href="'+url+'" title="'+artist+' - '+song+'" target="_blank"><img src="'+art+'" class="widget-img-thumb" alt="'+artist+' - '+song+'" onerror="this.src=(\'http://'+locationHost+'/js/lastfm/noartwork.gif\')" /></a>'
					+'<a href="'+url+'" title="'+artist+' - '+song+'" target="_blank">'+((song.length>32)?song.slice(0, 32)+'...':song)+'</a><br />'
					+'<a href="'+url+'" title="'+artist+' - '+song+'" target="_blank">'+((artist.length>32)?artist.slice(0, 32)+'...':artist)+'</a>'
					//+album
					+'<div class="alist" style="clear:both;"></div>'
					+'<div class="ainfo" style="text-align:right;clear:both;opacity:0.2;"><a href="" onclick="$(this).closest(\'#atrack-'+thisIndex+'\').productSearch('+thisIndex+', 1);return false;">[Amazonで検索]</a></div>'
					+'</div>'
				);
				thisElem.children('#atrack-'+thisIndex).hover(
					function() {$(this).children('.ainfo').fadeTo('normal', 1.0);}
					,function() {$(this).children('.ainfo').fadeTo('normal', 0.2);}
				);
				thisElem.fadeTo('normal', 1.0);
			}
			,shiftItems: function(elem) {
				for(var i=0; i<settings.page_count; i++) {
					eachfuncs.printContent(elem, items.shift());
					if(items.length<=0) break;
				}
				eachfuncs.elapsedTime(thisElem);
				$('#more_track').empty().append('<div style="text-align:right;"><a href="" onmouseover="$(\'#lastfm\').getRecentTracks();return false;">[さらに読み込む]</a></div>');
			}
			,eachThis: function(elem) {
				var thisElem = elem;
				$('#more_track').empty().append('<div style="text-align:right;"><img src="http://'+locationHost+'/indi.gif" alt="読み込み中..." width="10" height="10" /> 読み込み中...</div>');
				var thisPage = page;
				if(thisPage>=1 && items.length>=settings.page_count) {
					thisElem.append('<div class="track" style="opacity:0.0;" />');
					var trackElem = thisElem.children('.track:last');
					eachfuncs.shiftItems(trackElem);
				} else {
					var params = {
						method: 'user.getrecenttracks'
						,user: settings.username
						,api_key: settings.apikey
						,limit: (page==0)?settings.default_count:settings.limit
						,page: (page==0)?1:thisPage
						,format: 'json'
					};
					return $.ajax({
						url: 'http://ws.audioscrobbler.com/2.0/',
						data: params,
						dataType: 'jsonp',
						callback: 'callback',
						timeout: 5000,
					})
					.done(function(data, status) {
						if(data==null || data.recenttracks==null) {
							$('#more_track').empty();
							return false;
						}
						if(thisPage==0 || thisPage==1) items = [];
						items = items.concat(data.recenttracks.track);
						if(thisPage==1) items.splice(0, settings.default_count);
						if(thisPage==0) thisElem.empty();
						thisElem.append('<div class="track" style="opacity:0.0;" />');
						var trackElem = thisElem.children('.track:last');
						eachfuncs.shiftItems(trackElem);
						page++;
					})
					.fail(function(XMLHttpRequest, textStatus, errorThrown) {
						eachfuncs.elapsedTime(thisElem);
						$('#more_track').empty();
					})
					.always(function(XMLHttpRequest, textStatus) {
					})
					;
				}
			}
		}
		;
		var thisElem = $(this);
		eachfuncs.eachThis(thisElem);
		var dTime = new Date().getTime();
		if(timer!=null) clearInterval(timer);
		timer = setInterval(function() {
			if(dTime+settings.reload < (new Date().getTime())) {
				page = 0;
				eachfuncs.eachThis(thisElem);
				dTime = new Date().getTime();
			}
		}, settings.interval);
	}
	$.fn.productSearch = function(trackNum, pageNum) {
		var amazon = {
			productSearchComplete: function(data, elem, pageNum) {
				var thisElem = elem;
				var total_results = (data.result.TotalResults>=100)?100:data.result.TotalResults;
				if(total_results-(pageNum*10)>0) thisElem.children('.ainfo').empty().append('<a href="" onclick="$(this).closest(\'#atrack-'+trackNum+'\').productSearch('+trackNum+', '+(pageNum+1)+');return false;">[検索結果あと'+(total_results-(pageNum*10))+'件]</a>');
				else thisElem.children('.ainfo').empty();
				thisElem.children('.alist').append('<div class="apage" />');
				var thisPage = thisElem.children('.alist').children('.apage:last');
				thisPage.css('opacity', 0.0).fadeTo('normal', 1.0);
				var resultArtistTitles = [];
				if(data.result.Item==null) return false;
				if(data.result.Item.length!=null) resultArtistTitles = data.result.Item;
				else resultArtistTitles[0] = data.result.Item;
				return $.each(resultArtistTitles, function(i, item){
					var name = item.ItemAttributes.Title
					,artist = item.ItemAttributes.Artist
					,url = item.DetailPageURL
					,image = item.SmallImage ? item.SmallImage.URL : ''
					,artistName = (artist!=null)?artist+" - "+name:name
					;
					if(image==null || image=="") image = "http://"+locationHost+"/js/lastfm/noimg_ama.gif";
					thisPage.append(
						'<a href="'+decodeURIComponent(url)+'" title="'+artistName+'" target="_blank">'
						+'<img src="'+image+'" class="widget-img-thumb" alt="'+artistName+'" />'
						+'</a>'
					);	
				});
			}
		}
		var thisElem = $(this);
		thisElem.children('.ainfo').empty().append('<img src="http://'+locationHost+'/indi.gif" alt="商品検索中..." width="10" height="10" /> 商品検索中...');
		var params = {
			'search_index': 'Music'
			,'artist': artistTitles[trackNum][0]
			,'title': artistTitles[trackNum][1]
			,'item_page': pageNum
		};
		$.ajax({
			url: 'http://'+locationHost+'/js/lastfm/amazon/request.php'
			,data: params
			,dataType: 'jsonp'
			,callback: 'callback'
			,timeout: 5000
		})
		.done(function(data, status) {
			amazon.productSearchComplete(data, thisElem, pageNum);
		})
		.fail(function(XMLHttpRequest, textStatus, errorThrown) {
			thisElem.children('.ainfo').empty();
		})
		.always(function(XMLHttpRequest, textStatus) {
		})
		;
		return thisElem;
	}
})(jQuery);
