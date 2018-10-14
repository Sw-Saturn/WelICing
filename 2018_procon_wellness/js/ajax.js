// setIntervalを使う方法
function sleep(waitSec, callbackFunc) {
    // 経過時間（秒）
    var spanedSec = 0;
    // 1秒間隔で無名関数を実行
    var id = setInterval(function () {
        spanedSec++;
        // 経過時間 >= 待機時間の場合、待機終了。
        if (spanedSec >= waitSec) {
            // タイマー停止
            clearInterval(id);
            // 完了時、コールバック関数を実行
            if (callbackFunc) callbackFunc();
        }
    }, 1000);
}

function getCSV(path) {
  var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.open("get", path, false); // アクセスするファイルを指定
  req.send(null); // HTTPリクエストの発行

  // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
  var csvData = req.responseText;
  var result = []; // 最終的な二次元配列を入れるための配列
  var tmp = csvData.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
  // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
  for (var i = 0; i < tmp.length; ++i) {

    result[i] = tmp[i].split(',');
    if (i != 0) {
      result[i][2] = String(result[i][2]).slice(1, 11); //日付だけ取得（時間はきりすてる）
    }
  }
  // document.write(result);//デバッグ
  return result;
}

var aryJSON = JSON.stringify([1,2]);↲
	$.ajax({↲
	async: true,↲
	type: "POST",↲
	url: "http://ras1.local/rpg/php_fin/data_download_S.php",↲
	data: { Ary : aryJSON }↲
}).done(function( msg ) {});↲

sleep(3);

var a1,num1,a2,num2;
a1=getCSV("data.csv");
num1=a1[0][1];
while(true){
	a2=getCSV("data.csv");
	num2=a2[0][1];
	if(num1!=num2){
		break;
	num1=num2;
}
