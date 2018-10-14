
// var today = new Date(2018, 10-1, 30); //デバッグ用
// var another_day = new Date(2018,10-1,2);//デバッグ用
var another_day = new Date();//デバッグ用
var today = new Date();
var today_getDate_this_Week = new Date();

function getDate_slash() {

  // var h = new Date(2018,11-1,30);//日付0埋めデバッグ


  console.log(today);

  console.log("年=" + today.getFullYear());
  console.log("月=" + (today.getMonth() + 1));
  console.log("日=" + today.getDate());
  console.log("時=" + today.getHours());
  console.log("分=" + today.getMinutes());
  console.log("秒=" + today.getSeconds());

  var now_date = ('0' + String(today.getMonth() + 1).slice(-2) + '/' + String(today.getDate()));
  return now_date;

}

function getDate_hifun() {
  // alert("today_DATEGET1"+today);

  var now_date = String(today.getFullYear()) + '-' + ('0' + String(today.getMonth() + 1)).slice(-2) + '-' +('0' + String(today.getDate())).slice(-2);
  // alert("today_DATEGET2"+today);

  return now_date;
}
function getDate_hifun_oneday(oneday) {
  // alert("today_DATEGET1"+today);

  var now_date = String(oneday.getFullYear()) + '-' + ('0' + String(oneday.getMonth() + 1)).slice(-2) + '-' +('0' + String(oneday.getDate())).slice(-2);
  // var now_date = String(oneday.getFullYear()) + '-' + ('0' + String(oneday.getMonth() + 1)).slice(-2) + '-' + ('0' + String(today.getDate())).slice(-2));
  // alert("today_DATEGET2"+today);

  return now_date;
}
function getDate_hifun_control_day(control_day) {
  var now_date = String(today.getFullYear()) + '-' + ('0' + String(today.getMonth() + 1)).slice(-2) + '-' +('0' + String(today.getDate()-control_day)).slice(-2);
  // var now_date = String(today.getFullYear()) + '-' + ('0' + String(today.getMonth() + 1)).slice(-2) + '-' + String(today.getDate() - control_day);
  // var now_date = String(today.getFullYear()) + '-' + ('0' + String(today.getMonth() + 1)).slice(-2) + '-' + String(today.getDate() - control_day);
  return now_date;
}

function getDate_this_Week() {
  //配列に09/25の形式で格納する
  var this_Week = ['0', '0', '0', '0', '0', '0', '0'];
  // var today_getDate_this_Week = today;
  // alert("today_getDate_this_Week"+today_getDate_this_Week);
  // var now_day = today.getDay();
  // this_Week[now_day]=String(today.getMonth()+1)+'/'+String(today.getDate());
  // for(var i=now_day,j=1;i>0;i--,j++){
  //   this_Week[i-1]=String(today.getMonth()+1)+'/'+String(today.getDate()-j);
  // }
  // for(var i=now_day,j=1;i<6;i++,j++){
  //   this_Week[i+1]=String(today.getMonth()+1)+'/'+String(today.getDate()+j);
  // }

  var now_day = today_getDate_this_Week.getDay();//本日の曜日取得
  if(now_day==0)now_day=7;
  another_day.setMonth(today_getDate_this_Week.getMonth()+1);
  another_day.setDate(1);//月初め取得
  another_day = new Date(today_getDate_this_Week.getFullYear(), today_getDate_this_Week.getMonth(),0);//月末取得
  this_Week[now_day-1] = String(today_getDate_this_Week.getMonth() + 1) + '/' + String(today_getDate_this_Week.getDate());
  // alert("now_day" + now_day);
  //本日よりも前の日
  for (var i = now_day, j = 1; i > 1; i--, j++) {//月初→月末判定
    today_getDate_this_Week.setDate(today_getDate_this_Week.getDate() - 1);//前の日取得
    // alert("today_getDate_this_Week"+today_getDate_this_Week);
    // alert("String(today_getDate_this_Week.getMonth() + 1)"+(today_getDate_this_Week.getMonth() + 1));
    // alert("String(today_getDate_this_Week.getDate())"+(today_getDate_this_Week.getDate()));
    this_Week[i - 2] = String(today_getDate_this_Week.getMonth() + 1) + '/' + String(today_getDate_this_Week.getDate());
    // if (another_day.getMonth() == today_getDate_this_Week.getMonth() && another_day.getDate() == today_getDate_this_Week.getDate()) {
    //   // alert("同じ日");
    // } else {
    //   // alert("別の日");
    // }
  }
  //本日よりも次の日
  today_getDate_this_Week = new Date();
  for (var i = now_day, j = 1; i < 7; i++, j++) {
    today_getDate_this_Week.setDate(today_getDate_this_Week.getDate() + 1);//setDateだと1日加算すると、翌月の月に勝手に移動してくれるのがみそ　getDateに+していくと翌月にくりかえさない
    // alert("today_getDate_this_Week"+today_getDate_this_Week);
    // if (another_day.getMonth() == today_getDate_this_Week.getMonth() && another_day.getDate() == today_getDate_this_Week.getDate()) {// 月末→月初判定
    //   alert("同じ日");
    //   // this_Week[i + 1] = String(today_getDate_this_Week.getMonth() + 1) + '/' + String(today_getDate_this_Week.getDate() + j);
    //
    // } else {
    //   alert("別の日");
    //   this_Week[i + 1] = String(today_getDate_this_Week.getMonth() + 1) + '/' + String(today_getDate_this_Week.getDate() + j);
    // }
      this_Week[i] = String(today_getDate_this_Week.getMonth() + 1) + '/' + String(today_getDate_this_Week.getDate());

      // if(i!=6){
      //   this_Week[i] = String(today_getDate_this_Week.getMonth() + 1) + '/' + String(today_getDate_this_Week.getDate());
      // }
      // else if(i==6){
      //
      // }
  }
  // alert(this_Week);
  return this_Week;
}

function getDay_normal() { //日付から曜日判定
  return today.getDay();
}

function getDay_oneday(oneday) { //日付から曜日判定
  // var day = new Date(oneday)
  // return day.getDay();
  return oneday.getDay();
}

function getDay_control_day(control_day) {
  var day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - control_day);
  // alert("date"+day);
  return day.getDay();
}

// // //ページロード時に実行
// window.onload=function () {
//   var data = getDate_this_Week();
//     // var data = getDate_this_Week();
//     alert(data);
//     // document.write(data);
// };

// alert("Hello");
