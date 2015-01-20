(function($){
    'use strict';
    $.fn.hondalady = function() {
        var thisElem = $(this);
        $.ajax({
            url: 'http://girled.net/js/hondalady/get.php'
            ,data: {}
            ,dataType: 'jsonp'
            ,callback: 'callback'
            ,timeout: 5000
        })
        .done(function(data, status) {
            var html = '';
            if(data.Html==null) return false;
            if(data.Html.length!=null) html = data.Html;
            thisElem.empty();
            thisElem.css('opacity', 0.0).html(html).fadeTo('normal', 1.0);
        })
        .fail(function(XMLHttpRequest, textStatus, errorThrown) {
        })
        .always(function(XMLHttpRequest, textStatus) {
        })
        ;
    }
})(jQuery);