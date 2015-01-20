<?php
header("Content-Type: application/javascript; charset=UTF-8");
$callback = ($_GET['callback'])?$_GET['callback']:"callback";
$url = $_GET['url'];
require_once 'simple_html_dom.php';
$ret = "";
//後で戻せるように設定を取得しておく
$org_timeout = ini_get('default_socket_timeout');
//2秒以上かかったらタイムアウトする設定に変更
$timeout_second = 2;
ini_set('default_socket_timeout', $timeout_second);
if($html = @file_get_html('http://www.hondalady.net/')) {
  foreach( $html->find( '#contentleft' ) as $contentleft ){
    foreach( $contentleft->find( 'ul' ) as $ul ){
      $ret .= $ul;
    }
  }
  $ret = str_replace("<a href=","<a target=\"_blank\" href=",$ret);
  foreach( $html->find( '#contentright' ) as $contentright ){
    foreach( $contentright->find( 'ul' ) as $ul ){
      $ret .= $ul;
    }
  }
  $ret = str_replace("<script type='text/javascript' src='http://www.hondalady.net/freestyler.js'></script>","<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\"codebase=\"http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0\" width=\"157\" height=\"210\"><param name=\"movie\" value=\"http://www.hondalady.net/bp/freestyler.swf\" /><param name=\"quality\" value=\"high\" /><param name=\"wmode\" value=\"transparent\" /><param name=\"menu\" value=\"false\" /><param name=\"allowScriptAccess\" value=\"always\" /><embed src=\"http://www.hondalady.net/bp/freestyler.swf\" wmode=\"transparent\" quality=\"high\" menu=\"false\" allowScriptAccess=\"always\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.adobe.com/go/getflashplayer\" width=\"157\" height=\"210\"></object>",$ret);
//  $ret = str_replace("<script type='text/javascript' src='http://www.hondalady.net/freestyler.js'></script>","<script type=\"text/javascript\" src=\"http://www.hondalady.net/freestyler.js\"></script>",$ret);
  $ret = str_replace("<li>","<li style=\"list-style-type:none;\">",$ret);
  $ret = str_replace("<li class=\"date\">","<li style=\"list-style-type:none;font-weight:bold;\" class=\"date\">",$ret);
  $ret = str_replace("<li class=\"place\">","<li style=\"list-style-type:none;font-weight:bold;\" class=\"place\">",$ret);
  $ret = str_replace("<li class=","<li style=\"list-style-type:none;\" class=",$ret);
}else{
  $ret = '<ul id="banner">  <li style="list-style-type:none;"><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="157" height="210"><param name="movie" value="http://www.hondalady.net/bp/freestyler.swf" /><param name="quality" value="high" /><param name="wmode" value="transparent" /><param name="menu" value="false" /><param name="allowScriptAccess" value="always" /><embed src="http://www.hondalady.net/bp/freestyler.swf" wmode="transparent" quality="high" menu="false" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer" width="157" height="210"></object></li>  <li style="list-style-type:none;"><a href="http://www.facebook.com/pages/HONDALADY/357197340346" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_facebook.gif" alt="twitter" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://soundcloud.com/hondalady/" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_soundcloud.gif" alt="twitter" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://twitter.com/hondalady_news/" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_twitter.gif" alt="twitter" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://www.myspace.com/hondaladyjapan" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_myspace.gif" alt="myspace music" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://www.hearjapan.com/ja/artist/hondalady/" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_hearjapan.gif" alt="HEAR JAPAN" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://mixi.jp/view_community.pl?id=35862" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_mixi.gif" alt="MIXI" width="157" height="33"></a></li>  <li style="list-style-type:none;"><a href="http://www.ketchuparts.com/" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_ketchuparts.gif" alt="Ketchuup Arts" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://www.ketchuparts.com/dietrax/" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_dietrax.gif" alt="DieTRAX" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://www.myspace.com/seiroganx" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_seiroganx.gif" alt="征露丸X" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://soundcloud.com/nynysofficial/" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_nyannyans.gif" alt="ニャンニャンズ" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://www.beatsurfer.com/" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_citron.gif" alt="CITRON RECORDINGS" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><a href="http://www.myspace.com/kimonotokyo" target="_blank" ><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_kimono.gif" alt="KIMONO" width="157" height="32" /></a></li>  <li style="list-style-type:none;"><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_qr.gif" alt="QR CODE" width="102" height="102" /></li>  <li style="list-style-type:none;"><img src="http://pwei.backdrop.jp/wordpress/wp-content/themes/HondaLady2012/images/b_HL.gif" alt="HL RECORDINGS" width="56" height="38" /></li>  </ul>';
}
echo $callback."({'Html':'".$ret."'});";
?>