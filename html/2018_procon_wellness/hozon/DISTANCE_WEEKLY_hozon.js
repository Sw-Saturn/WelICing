// //他js読み込み
// document.write("<script type='text/javascript' src='CSV_READER.js'></script>");
// document.write("<script type='text/javascript' src='DATE_GET.js'></script>");
// document.write("<script type='text/javascript' src='chart/GRAGH_BAR.js'></script>");
//
// var result = getCSV("data.csv"); //csv読み込み
// // document.write(result);
// var Distance_Weekly = function() { //日付読み込み
//   //1日歩行距離計算
//   // var now_date = getDate_hifun();
//   // var now_date = new date();
//   // now_date= (now_date.getFullYear(),now_date.getMonth(),now_date.getDate());
//   // alert(now_date);
//   var deb = '2018-09-21'; //デバッグ距離加算用
//   // document.write(result);//デバッグ日付取得確認
//   var distance_weekly_array = [0,0,0,0,0,0,0];//0で初期化 日～土曜
//   var distance_weekly_sum=0;//1週間歩行距離計算
//
// //本日から日曜びまでさかのぼる
// //本日の曜日割り出して、０になるまで引き算していく　もし、日曜ならその日の距離足し算する　1回だけ行うがいいかな
// // var now_day= getDay();
// var control_day = 4;
// var now_date =getDate_hifun_control_day(control_day);
// var now_day= getDay_control_day(control_day);
// var start_day= getDay_control_day(control_day);
// alert("now_day"+now_date);
// // var start_day= getDay(now_date.getFullYear,now_date.getMonth(),now_date.getDate()-control_day);
// // var now_day= getDay(now_date.getFullYear,now_date.getMonth(),now_date.getDate()-control_day);
// // alert(start_day);
// // alert(now_day);
//
// var j = 1;
// for(var i=start_day;i>=0;i--){
//   //1日計算スクリプト
//   var distance_1day_sum = 0;
//   var date_chage_flag = false;
//   while (!date_chage_flag) {
//     if (result.length <= 2) { //比較データがないとき（はじめて記録したとき）+（例外時にも対応）
//       distance_1day_sum = result[j][3];
//       date_chage_flag = true;
//       document.write("はじめて歩いたよ");
//     } else if (String(result[j][2]) == now_date) { //今日の日付と同じなら　//now_day（deb）の日付を1日前に設定する
//       distance_1day_sum += Number(result[j][3]);
//       // Math.round(distance_weekly_sum * 10) / 10; //小数点1位を基準に切りあげ
//       // document.write("日付同じ!!距離加算<BR>");
//       document.write("累計距離：" + distance_1day_sum.toFixed(1) + "<BR><BR>");
//       j++;
//     }else if(String(result[j][2]) ==null ){//記録の終了条件はないか？　//配列の範囲こえて、取得できないと思う　自分でresultに終了条件付けた至徳とか
//       //for文抜け出す
//     }
//
//     else { //日付が変わったら
//       date_chage_flag = true;
//       document.write('日付変わった<BR>');
//       document.write('記録日' + result[j][2] + '<BR>');
//       // document.write('今日の日付' + now_date + '\n');
//     }
//   }
// 　//1日まとめスクリプト
// 　//配列に各曜日ごとに格納する　添え字は一番大きなかっこのやつ使える
//   distance_weekly_array[i]=distance_1day_sum;
//   alert("distance_weekly_array"+distance_weekly_array);
// 　//1週間の総距離もみやすくグラフでいいかも
// 　//
//
// 　//1週間歩行距離計算
//   distance_weekly_sum+=distance_1day_sum;
//   alert("distance_weekly_sum"+distance_weekly_sum);
//
//   //日付を1日前にする
//   now_date =getDate_hifun_control_day(control_day+(start_day-i)+1);
//   now_day = getDay((start_day-i)-1);
//   alert("nowdate"+now_date+" i"+i);
//   alert("nowday"+now_day+" i"+i);
// }
// // GRAGH_BARに渡せるようにする
// // getDistance_array(distance_weekly_array);
// }
