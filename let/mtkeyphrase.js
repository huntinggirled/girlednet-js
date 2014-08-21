(function($){
	'use strict';
	var titlemaxlength = 48;
	var locationHostArrayReverse = location.host.split('.').reverse();
	var locationHost = locationHostArrayReverse[1]+"."+locationHostArrayReverse[0];
	var sentence = $('#editor-input-content').text().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'').replace(/girled/g, '');
	sentence = $('<div>').html(sentence).text();
	var title = $('#title').val().replace(/\s+(\([0-9]+\))$/g,'');
	var params = {
		'sentence': sentence
		,'output': 'json'
	};
	$.ajax({
		url: 'http://'+locationHost+'/yahoo/putkeyphrase.php'
		,type: 'POST'
		,data: params
		,dataType: 'jsonp'
		,timeout: 5000
	})
	.done(function(data, status) {
		$.each(data, function(key, val){
			if(title.length<titlemaxlength) {
				if(!key.match(/^[0-9a-z]{8,9}$/i) || confirm(key+"を適用しますか？")){
					title = title+" "+key.replace(/\\(\'|\"|\\)/g,'$1');
				}
			}
		});
		$('#title').val(title);
		$('.publish').trigger("click");
	})
	.fail(function(XMLHttpRequest, textStatus, errorThrown) {
	})
	.always(function(XMLHttpRequest, textStatus) {
	})
	;
})(jQuery);