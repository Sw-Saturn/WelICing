//他js読み込み
document.write("<script type='text/javascript' src='CSV_READER.js'></script>");
document.write("<script type='text/javascript' src='DATE_GET.js'></script>");
document.write("<script type='text/javascript' src='chart/GRAGH_BAR.js'></script>");

//var result = getCSV("data.csv"); //csv読み込み
var Distance_Weekly = function() { //日付読み込み
  var result= getCSV("ThisWeek.csv");
 // var result_lastWeek= getCSV("LastWeek.csv");
 // var result= getCSV("data.csv");
 //    if(result[1][0]==null)alert("aho");
 //    while(result[1][0]==null){
 // result= getCSV("data.csv");
 //    }
//    alert(result);
    //1日歩行距離計算
  // var now_date = getDate_hifun();
  // var now_day = getDay_normal();
  // var start_day = getDay_normal();
  var now_date = new Date();
  var distance_weekly_array_thisWeek = [0, 0, 0, 0, 0, 0, 0]; //0で初期化 日～土曜
  var distance_weekly_array_lastWeek = [0, 0, 0, 0, 0, 0, 0]; //0で初期化 日～土曜
  var distance_weekly_sum_thisWeek = 0; //1週間歩行距離計算
  var distance_weekly_sum_lastWeek = 0; //1週間歩行距離計算
  var week_count=0;
  var array_distance_index=0;
  var j = 1;
  for(var a=0;a<2;a++){//今週と先週の2回まわす
    var now_date_hifun = getDate_hifun_oneday(now_date);
    // alert("now_date_hifun"+now_date_hifun);
    var now_day = getDay_oneday(now_date);
    // alert("now_day"+now_day);

    var start_day = getDay_oneday(now_date);
    if(now_day==0)now_day=7;
    if(start_day==0)start_day=7;
    now_day-=1;
    start_day-=1;
    var j = 1;
    // alert(a+1+"回目\n"+"now_date_hifun: "+now_date_hifun+"\n"+"now_day: "+now_day+"\n"+"start_day: "+start_day);
  //1週間計算
  for (var i = start_day; i >= 0; i--) {
    // alert("j:"+j);
    //1日計算スクリプト
    var distance_1day_sum = 0;//1日歩行距離初期化
    var date_chage_flag = false;
    while (!date_chage_flag) {
      // alert("result[j][2]"+result[j][2]);
      // alert("now_date_hifun"+now_date_hifun);

      if (result.length <= 2) { //比較データがないとき（はじめて記録したとき）+（例外時にも対応）
        distance_1day_sum = result[j][3];
        date_chage_flag = true;
        console.log("はじめて歩いたよ");
      } else if (String(result[j][2]) == now_date_hifun) { //今日の日付と同じなら　//now_day（deb）の日付を1日前に設定する
        distance_1day_sum += Number(result[j][3]);
        console.log("累計距離：" + distance_1day_sum.toFixed(1) + "<BR><BR>");
        j++;
      } else if (String(result[j][2]) == null) { //記録の終了条件はないか？　//配列の範囲こえて、取得できないと思う　自分でresultに終了条件付けた至徳とか
        //for文抜け出す
      } else { //日付が変わったら
        date_chage_flag = true;
        console.log('日付変わった<BR>');
        console.log('記録日' + result[j][2] + '<BR>');
        // console.log('今日の日付' + now_date_hifun + '\n');
      }
    }
    // j++;//1日加算
    //1日まとめスクリプト 今週と先週に分岐

    if(week_count==0){//今週なら
      // alert("今週に+"+j);
      //配列に各曜日ごとに格納する　添え字は一番大きなかっこのやつ使える
      distance_weekly_array_thisWeek[i] =　Math.floor(distance_1day_sum*10)/10;
      // alert("distance_1day_sum"+distance_1day_sum);
      // alert("distance_weekly_array_thisWeek"+distance_weekly_array_thisWeek);
      //1週間歩行距離計算
      distance_weekly_sum_thisWeek += Math.floor(distance_1day_sum*10)/10;
      // alert("distance_weekly_sum"+distance_weekly_sum);
    }
    else if(week_count==1){//先週なら
      // alert("先週に+"+j);
      //配列に各曜日ごとに格納する　添え字は一番大きなかっこのやつ使える
      distance_weekly_array_lastWeek[i] = Math.floor(distance_1day_sum*10)/10;
      // alert("distance_weekly_array"+distance_weekly_array);
      //1週間歩行距離計算
      distance_weekly_sum_lastWeek += Math.floor(distance_1day_sum*10)/10;
      // alert("distance_weekly_sum"+distance_weekly_sum);
    }


    //日付を1日前にする
    // now_date_hifun = getDate_hifun_control_day(control_day + (start_day - i) + 1);//デバッグ用コントロール
    // now_day = getDay((start_day - i) - 1);
    // now_date_hifun = getDate_hifun((start_day - i) + 1);//i--,numは大きくなる
    // now_day = getDay_normal((start_day - i) - 1);

    // now_date_hifun = getDate_hifun_oneday(now_date.setDate(now_date.getDate()-1));//i--,numは大きくなる
    now_date.setDate(now_date.getDate()-1);
    // alert("now_date+"+now_date);
    now_date_hifun = getDate_hifun_oneday(now_date);//i--,numは大きくなる
    // alert("now_date_hifun"+now_date_hifun);
    // now_day = getDay_oneday(now_date.setDate(now_date.getDate()-1));
    console.log("nowdate" + now_date_hifun + " i" + i);
    console.log("nowday" + now_day + " i" + i);
  }//1日終わり　while
  // now_date.setDate(now_date.getDate()-1);//i--,numは大きくなる
  week_count=1;
  result= getCSV("LastWeek.csv");

  // now_day = getDay_oneday(now_date.setDate(now_date.getDate()-1));
}//1週間終わり

  // alert("distance_weekly_array_thisWeek"+distance_weekly_array_thisWeek+"\n"+"distance_weekly_array_lastWeek"+distance_weekly_array_lastWeek);
  // GRAGH_BARに渡せるようにする
  // getDistance_array(distance_weekly_array);
  getDistance_weekly(distance_weekly_sum_thisWeek,distance_weekly_array_thisWeek,distance_weekly_sum_lastWeek,distance_weekly_array_lastWeek);
    // getDistance_weekly(distance_weekly_sum,distance_weekly_array);

}
