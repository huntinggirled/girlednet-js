(function($){
	'use strict';
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
	var params = {
		'search_index': 'Blended'
		,'Keywords': 'test'
	};
	$.ajax({
		url: 'http://'+locationHost+'/amazon/request.php'
		,data: params
		,dataType: 'jsonp'
		,callback: 'callback'
		,timeout: 5000
	})
	.done(function(data, status) {
		//amazon.productSearchComplete(data, thisElem, pageNum);
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
			if(image==null || image=="") image = "http://"+locationHost+"/js/amazon/noimg_ama.gif";
			thisPage.append(
				'<a href="'+decodeURIComponent(url)+'" title="'+artistName+'" target="_blank">'
				+'<img src="'+image+'" class="widget-img-thumb" alt="'+artistName+'" />'
				+'</a>'
			);	
		});
	})
	.fail(function(XMLHttpRequest, textStatus, errorThrown) {
		thisElem.children('.ainfo').empty();
	})
	.always(function(XMLHttpRequest, textStatus) {
	})
	;


})(jQuery);