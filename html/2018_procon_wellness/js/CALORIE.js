//他js読み込み

document.write("<script type='text/javascript' src='CSV_READER.js'></script>");
document.write("<script type='text/javascript' src='DATE_GET.js'></script>");

var Calorie_Calc = function() {
  var result = getCSV("ThisWeek.csv"); //csv読み込み
// var result = getCSV("data.csv"); //csv読み込み

  var now_date = new Date();
  //1週間のカロリーは足していく
  var now_date_hifun = getDate_hifun_oneday(now_date);
  var now_day = getDay_oneday(now_date);
  var start_day = getDay_oneday(now_date);
  var calorie_today_sum = 0; //1日歩行距離初期化
  var calorie_weekly_sum_thisWeek = 0;
  var array_calorie_index=4;
  var j = 1;
  // alert(a+1+"回目\n"+"now_date_hifun: "+now_date_hifun+"\n"+"now_day: "+now_day+"\n"+"start_day: "+start_day);
  //1週間計算
  for (var i = start_day; i >= 0; i--) {
    //1日計算スクリプト

    var date_chage_flag = false;
    while (!date_chage_flag) {
      if (result.length <= 2) { //比較データがないとき（はじめて記録したとき）+（例外時にも対応）
        calorie_today_sum = result[j][4];
        date_chage_flag = true;
      } else if (String(result[j][2]) == now_date_hifun) { //今日の日付と同じなら　//now_day（deb）の日付を1日前に設定する
        calorie_today_sum += Number(result[j][4]);
        j++;
      } else if (String(result[j][2]) == null) { //記録の終了条件はないか？　//配列の範囲こえて、取得できないと思う　自分でresultに終了条件付けた至徳とか
        //for文抜け出す
      } else { //日付が変わったら
        date_chage_flag = true;
      }
    } //1日終わり　while
    //1週間歩行距離計算
    calorie_weekly_sum_thisWeek += calorie_today_sum;

    //日付を1日前にする
    now_date.setDate(now_date.getDate() - 1);
    now_date_hifun = getDate_hifun_oneday(now_date); //i--,numは大きくなる

  } //1週間終わり

  //出力
  //累計カロリーはトータルとるだけ:result[j][7]
  // document.getElementById("calorie-total-text").innerHTML = "<span style='font-size: 50px;'>累計:</span>"+ "<span style='font-size: 65px;'>"+String(Math.round(result[1][7]))+"</span>"+"<span style='font-size:30px;'> KCAL</span>"; //ID表示　1回目でも大丈夫
  //1週間のカロリー
  // document.getElementById("calorie-weekly_sum_thisWeek-text").innerHTML = "<span style='font-size: 50px;'>1週間:</span>"+"<span style='font-size: 65px;'>"+String(Math.round(calorie_weekly_sum_thisWeek))+"</span>"+"<span style='font-size:30px;'> KCAL</span>";
  //本日のカロリーはcalorie_today_sum
  // document.getElementById("calorie-today_sum_thisWeek-text").innerHTML = "<span style='font-size: 80px;'>" + String(Math.round(calorie_today_sum)) + "</span>" + "<span style='font-size:30px;'> KCAL</span>";
  // document.getElementById("calorie-today_sum_thisWeek-text").innerHTML = "<span style='font-size: 50px;'>本日:</span>"+"<span style='font-size: 65px;'>"+String(Math.round(calorie_today_sum))+"</span>"+"<span style='font-size:30px;'> KCAL</span>";
  //Math.round(calorie_weekly_sum_thisWeek*10)/10;
  // document.getElementById("calorie-today_example-text").innerHTML = "<span style='font-size: 50px;'>本日:</span>"+"<span style='font-size: 65px;'>"+String(Math.round(calorie_today_sum))+"</span>"+"<span style='font-size:30px;'> KCAL</span>";
  //本日のカロリーはcalorie_today_sum
  // var a =Math.round(calorie_today_sum);
  // alert("a:"+a);
  document.getElementById("calorie-today_sum_thisWeek-text").innerHTML = "<span style='font-size: 80px;'>" + String(Math.round(calorie_today_sum)) + "</span>" + "<span style='font-size:30px;'> KCAL</span>";
    var food_example = getCSV("food_example_tenuki.csv");
    var food_example_num = food_example.length-1;
    var num_array=Array(16);
    for(var i=1;i<=food_example_num;i++){
      num_array[i]=i;
      // num_array[i]=Math.floor(Math.random() * (16 - 0 + 1) + 1);
      // alert("num_array[]"+i+num_array[i]);
    }

    shuffle(num_array);
    num_array=rangeRandom(0,12);
    document.getElementById("calorie-today_example-text1").innerHTML = food_example[num_array[0]][0]+" "+"<span style='font-size:45px;'>"+food_example[num_array[0]][1]+"</span>"+" KCAL";
    document.getElementById("calorie-today_example-text2").innerHTML = food_example[num_array[1]][0]+" "+"<span style='font-size:45px;'>"+food_example[num_array[1]][1]+"</span>"+" KCAL";
    document.getElementById("calorie-today_example-text3").innerHTML = food_example[num_array[2]][0]+" "+"<span style='font-size:45px;'>"+food_example[num_array[2]][1]+"</span>"+" KCAL";
    document.getElementById("calorie-today_example-text4").innerHTML = food_example[num_array[3]][0]+" "+"<span style='font-size:45px;'>"+food_example[num_array[3]][1]+"</span>"+" KCAL";
    // document.getElementById("calorie-today_example-text5").innerHTML = food_example[num_array[4]][0]+" "+food_example[num_array[4]][1]+" KCAL";

  // document.getElementById("calorie-today_sum_thisWeek-text").innerHTML = "<span style='font-size: 80px;'>" + String(a) + "</span>" + "<span style='font-size:30px;'> KCAL</span>";
//   var food_example = getCSV("csv/food_example.csv");
// alert(food_example);
// alert(food_example[2][1]);
// Food_Example_Calc(Math.round(calorie_today_sum));
// var food_example = getCSV("csv/food_example.csv");
// alert("food_example"+food_example[10][1]);
}
function rangeRandom(min, max) {
    // 範囲の最小値
    var rangeMin = min;
    // 範囲の最大値
    var rangeMax = max;
    // 範囲内の数値の個数
    var rangeLength = rangeMax - rangeMin + 1;
    // 並び替え前の数値を管理する配列
    var countArr = [];
    // 並び替え後の数値を格納する配列
    var randomArr = [];

    // 範囲内の数値をcountArrに格納
    for(var i = 0; i < rangeLength; i++) {
        countArr[i] = i + rangeMin;
    }

    for(var i = 0; i < rangeLength; i++) {
        // 0～countArrの個数 の範囲から、数値をランダムに抽出
        var randomTarget = Math.floor(Math.random() * countArr.length);
        // randomArrに数値を格納(randomTargetの数値を格納するのではなく、countArrのrandomTarget番目の配列の数値を格納)
        randomArr[i] = countArr[randomTarget];
        // 同じ数値を再度使わないように、今回使った数値をcountArrから削除しておく。
        countArr.splice(randomTarget, 1);
    }
    return randomArr;
}

function shuffle(array) {
  var n = array.length, t, i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }

  return array;
}
// var Food_Example_Calc= function(today_calorie) {
//   alert("today_calorie"+today_calorie);
//   var food_example = getCSV("csv/food_example.csv");
//   // var food_kind_num = 17; //17品目
//   var food_all_num = food_example.length-1; //17品目
//   // alert("food_kind_num"+food_kind_num);
//   var food_kind_name_array=Array(2); //品目名を格納する　品目名も自動で取得する
//   var food_kind_name_array_count = 0;
//   var range = 40;
//   var food_kind_num=2;
//   var start_index = Array(2);
//   start_index.fill(-1);
//   var end_index = Array(2);
//   end_index.fill(-1);
//   var j=0;//昇順
// //複数品類
// for(var k=0;k<food_kind_num;k++){
//   var range_in_flag = false; //flag1:Today_kalorie+rangeに到達したら
//   var range_out_flag = false; //flag2:Today_kalorie-rangeに到達したら
//   var food_kind_end_flag = false; //flag3:Today_kalorie-rangeの間に品類の最後まで到達
//   while ((!range_in_flag && !range_out_flag) || !food_kind_end_flag) { //品類をこえるまで
//     //スタート添え字探し
//     // alert("j:"+j);
//     if (food_example[j][1] <= today_calorie - range) { //頂点が今日のカロリー
//       if (start_index[j] == -1) {
//         start_index[j] = j; //始端取得（頂点）//始めのやつ
//         range_in_flag = true;
//       }
//     } else if (food_example[j][1] >= today_calorie - range) {//更新
//       if (!range_in_flag){
//         start_index[j] = j; //始端取得//!range_in_flagの間更新し続ける
//       }
//       if (food_example[j+1][1] <= today_calorie + range) {
//         range_in_flag = true;
//       }
//     }
//     //エンド添え字探し
//     if (food_example[j][1] >= today_calorie + range) {//頂点が今日のカロリー
//       if (end_index[j] == -1) {
//         end_index[j] = j; //終端//始めのやつ
//         range_out_flag = true;
//       }
//     } else if (food_example[j][1] <= today_calorie + range) {//更新
//       if (!range_out_flag) {
//         if(food_example[j+1][1]==0)
//         {
//           food_kind_end_flag=true;
//           food_kind_name_array[food_kind_name_array_count]=food_example[j+1][0];//品類を自動で取得　順に記録
//           food_kind_name_array_count++;//カウント増やす
//         }
//         else end_index = j; //終端取得//!range_out_flagの間更新し続ける　//tkから下にtk＋Kの間
//       }
//       if (food_example[j+1][1] >= today_calorie - range) {
//         range_out_flag = true;
//       }
//     }
//     j++;//whileへ戻る　//indexを使っていく
//   } //while終わり　//カロリーに近い1つの品類完了!!
//   alert("while_fin:"+j);
// }//for終了　//カロリーに近い17つの品類完了!!
// //random作業していく
// for(var i=0;i<food_kind_num;i++){
//   var min = start_index[i];
//   var max = end_index[i];
//   var index=Math.random() * (max - min + 1) + min;
//   alert("index"+index+":"+food_example[index][1]);
// }
//
// }//Food_Example_Calc終了
