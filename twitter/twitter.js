(function($){
	'use strict';
	var items = [];
	var settings;
	var page = 0;
	var timer;
	var locationHostArrayReverse = location.host.split('.').reverse();
	var locationHost = locationHostArrayReverse[1]+"."+locationHostArrayReverse[0];
	$.fn.twitter = function(options) {
		var defaults = {
			screen_name: 'huntinggirled'
			,default_count: 1
			,page_count: 5
			,read_count: 50
			,interval: 1000
			,reload: 600000
		};
		settings = $.extend({}, defaults, options);
		if(settings.default_count>settings.page_count) settings.page_count = settings.default_count;
		if(settings.page_count>settings.read_count) settings.read_count = settings.page_count;
		var thisElem = $(this);
		thisElem.after('<div id="more_tweet" />');
		thisElem.getTimeline();
	}

	$.fn.getTimeline = function() {
		var eachfuncs = {
			printTweet: function(elem, item) {
				var utils = {
					stripSlashes: function(str) {
						return (str+'').replace(/\0/g, '0').replace(/\\([\\'"])/g, '$1');
					}
					,replaceLink: function(str, urls) {
						var substr;
						var match = str.match(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=~#]*)?/ig);
						for(var i = 0; match && i < match.length; ++i) {
							substr = '<a href="' + match[i] + '" target="_blank">' + match[i] + '</a>';
							for(var j = 0; urls && j < urls.length; ++j) {
								if(match[i]==urls[j].url) {
									substr = '<a href="' + match[i] + '" target="_blank" title="' + urls[j].expanded_url + '">' + urls[j].display_url + '</a>';
								}
							};
							str = str.replace(match[i], substr);
						}
						str = str.replace(/[#＃]([^\b\s]+)/gi, function(str, p1) {
							return '<a href="https://twitter.com/search?q=%23'+encodeURI(p1)+'" target="_blank">#'+p1+'</a>';
						});
						str = str.replace(/[@＠]([0-9a-zA-Z_]{1,15})/gi, function(str, p1) {
							return '<a href="https://twitter.com/#!/'+encodeURI(p1)+'" target="_blank">@'+p1+'</a>';
						});
						return str;
					}
					,relativeTime: function(str) {
						return eachfuncs.relativeTime(utils.getDatetime(str));
					}
					,getDatetime: function(str) {
						var time_values = str.split(" ");
						var time_value = time_values[1]+" "+time_values[2]+", "+time_values[5]+" "+time_values[3];
						return Date.parse(time_value);
					}
				}
				if(item==null || item.user==null) return false;
				var id_str = item.id_str
				,utc_offset = item.utc_offset
				,screen_name = (item.user.screen_name!=null)?item.user.screen_name:'screen_name'
				,name = (item.user.name!=null)?item.user.name:'name'
				,profile_image = (item.user.profile_image_url_https!=null)?utils.stripSlashes(item.user.profile_image_url_https):"https://"+locationHost+"/js/twitter/noimg.png"
				,created_at = utils.relativeTime(item.created_at)
				,tweet_text = utils.replaceLink(item.text, item.entities.urls)
				,datetime = utils.getDatetime(item.created_at)
				;
				if(item.retweeted_status!=null) {
					screen_name = item.retweeted_status.user.screen_name
					,name = item.retweeted_status.user.name
					,profile_image = (item.retweeted_status.user.profile_image_url_https!=null)?utils.stripSlashes(item.retweeted_status.user.profile_image_url_https):"https://"+locationHost+"/js/twitter/noimg.png"
					,created_at = utils.relativeTime(item.retweeted_status.created_at)
					,tweet_text = utils.replaceLink(item.retweeted_status.text, item.entities.urls)
					,datetime = utils.getDatetime(item.retweeted_status.created_at)
					;
				}
				elem.append(
					'<div class="one_tweet" style="clear:both;">'
					+'<a href="https://twitter.com/#!/'+screen_name+'" target="_blank" title="@'+screen_name+'">'+name+'</a><br />'
					+'<a href="https://twitter.com/#!/'+screen_name+'" target="_blank" title="@'+screen_name+'"><img src="'+profile_image+'" alt="'+name+'" class="widget-img-thumb" /></a>'
					//+'<a href="https://twitter.com/#!/'+screen_name+'" target="_blank" title="@'+screen_name+'">'+name+'</a><br />'
					//+'@'+screen_name+'<br /> '
					+tweet_text
					+' '
					+'<a href="https://twitter.com/huntinggirled/status/'+id_str+'" target="_blank" class="ctime" data-datetime="'+datetime+'">'+created_at+'</a>'
					//+' '
					+'<br />'
					+'<div class="reply" style="text-align:right;opacity:0.2;">'
					+'<a href="https://twitter.com/intent/tweet?in_reply_to='+id_str+'" target="_blank">返信</a> '
					+'<a href="https://twitter.com/intent/retweet?tweet_id='+id_str+'" target="_blank">リツイート</a> '
					+'<a href="https://twitter.com/intent/favorite?tweet_id='+id_str+'" target="_blank">お気に入り</a>'
					+'</div>'
					+'</div>'
				);
				elem.children('.one_tweet:last').hover(
					function() {$(this).children('.reply').fadeTo('normal', 1.0);}
					,function() {$(this).children('.reply').fadeTo('normal', 0.2);}
				);
			}
			,relativeTime: function(str) {
				var parsed_date = str/1000;
				var relative_to = (new Date().getTime()/1000);
				var delta = parseInt(relative_to-parsed_date);
				delta = delta + (new Date().getTimezoneOffset()*60);
				if(delta<60) {
					return parseInt(delta).toString()+'秒前';
				} else if(delta<(60*60)) {
					return (parseInt(delta/60)).toString() + '分前';
				} else if(delta<(24*60*60)) {
					return (parseInt(delta/3600)).toString() + '時間前';
				} else {
					return (parseInt(delta/86400)).toString() + '日前';
				}
			}
			,elapsedTime: function(elem) {
				return elem.find('.ctime').each(function() {
					var ptime = $(this).html();
					var etime = eachfuncs.relativeTime($(this).data('datetime'));
					if(ptime!=etime) $(this).css('opacity', 0.0).html(etime).fadeTo('normal', 1.0);
				});
			}
			,shiftItems: function(elem) {
				elem.append('<div class="tweet" style="opacity:0.0;" />');
				var tweetElem = elem.children('.tweet:last');
				tweetElem.fadeTo('normal', 1.0);
				for(var i=0; i<settings.page_count; i++) {
					eachfuncs.printTweet(tweetElem, items.shift());
					if(items.length<=0) break;
				}
				eachfuncs.elapsedTime(thisElem);
				$('#more_tweet').empty().append('<div style="text-align:right;"><a href="" onmouseover="$(\'#twitter\').getTimeline();return false;">[さらに読み込む]</a></div>');
			}
			,eachThis: function(elem) {
				var thisElem = elem;
				$('#more_tweet').empty().append('<div style="text-align:right;"><img src="https://'+locationHost+'/js/twitter/indi.gif" alt="読み込み中..." width="10" height="10" /> 読み込み中...</div>');
				if(page>=1 && items.length>=settings.page_count) eachfuncs.shiftItems(thisElem);
				else {
					var params = {
						screen_name: settings.screen_name
						,count: (page==0)?settings.default_count:settings.read_count
						,page: (page==0)?++page:page++
						,exclude_replies: false
						,include_rts: true
					}
					$.ajax({
					//	url: 'https://api.twitter.com/1/statuses/user_timeline.json'
						url: 'https://'+locationHost+'/js/twitter/twittergw.php'
						,data: params
						,dataType: 'jsonp'
						,callback: 'twitterCallback'
						,timeout: 5000
					})
					.done(function(data, status) {
						if((page-1)==0 || (page-1)==1) items = [];
						items = items.concat(data);
						if((page-1)==1) items.splice(0, settings.default_count);
						if((page-1)==0) thisElem.empty();
						eachfuncs.shiftItems(thisElem);
					})
					.fail(function(XMLHttpRequest, textStatus, errorThrown) {
						console.log("NG:" + textStatus.status);
						eachfuncs.elapsedTime(thisElem);
						$('#more_tweet').empty();
					})
					.always(function(XMLHttpRequest, textStatus) {
					})
					;
				}
			}
		}
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
		return thisElem;
	}
})(jQuery);
