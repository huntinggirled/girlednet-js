(function($){
	'use strict';
	$.ajax({
		url: 'get.php'
		,data: {}
		,dataType: 'html'
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
		eachfuncs.elapsedTime(thisElem);
		$('#more_tweet').empty();
	})
	.always(function(XMLHttpRequest, textStatus) {
	})
	;
})(jQuery);