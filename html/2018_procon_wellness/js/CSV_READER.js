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

// //ページロード時に実行
// window.onload=function () {
//     var data = getCSV("data.csv");
//     // alert(data);
//     document.write(data);
// };
//
// console.log('hoge');
// alert("Hello");
