//他js読み込み
document.write("<script type='text/javascript' src='CSV_READER.js'></script>");

  //お名前表示
var UserID = function(){
  var result = getCSV("ThisWeek.csv"); //csv読み込み
    // var result = getCSV("data.csv"); //csv読み込み
 //    while(result[1][0]==null){
 // result= getCSV("data.csv");
 //    }
  document.getElementById("UserID").innerHTML = 'ID: '+String(result[2][1]) + ' 様'; //ID表示　1回目でも大丈夫
}
