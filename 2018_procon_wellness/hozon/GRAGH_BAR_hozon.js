// //他js読み込み
// // document.write("<script type='text/javascript' src='../CSV_READER.js'></script>");
// // document.write("<script type='text/javascript' src='../DATE_GET.js'></script>");
//
// // var result = getCSV("../../data.csv"); //csv読み込み
// //本日から1週間取得
// // var now_date = getDate_slash();//dateはつかわない　now_dayだけ強調　赤
// // alert(now_date);
//
// // var now_day = getDay();
//
//
// //グラフの日にち（横軸）取得
// var this_week = getDate_this_Week();
// // var distance_weekly_array = [0,0,0,0,0,0,0];//0で初期化 日～土曜
// var distance_weekly_array;//0で初期化 日～土曜
// function getDistance_array(distance_array){//1週間の各曜日の運動距離格納
//   distance_weekly_array=distance_array;
//   alert("distance_weekly_array"+distance_weekly_array);
// }
//
// //ドーナツグラフ用スクリプト
// // var achievement_distance = 4.9;//0.7km*7日
// // var difference_distance;
// // if(distance_weekly_array>=achievement_distance){//目標距離超えてたら、変数の値変える　棒グラフ
// //   difference_distance=0;
// // }
// // else if(distance_weekly_array<achievement_distance){
// //   difference_distance=achievement_distance-distance_weekly_array;//差を入れる
// // }
//
// var Gragh_Bar=function(){
// //ドーナツグラフ
// var ctx1 = document.getElementById("myDoughnutChart");
// var myDoughnutChart  = new Chart(ctx1, {
//
//   type: 'doughnut',
//   data: {
//     labels: ["1週間の歩き","目標距離まで"],
//     datasets: [{
//       backgroundColor: [
//         "#f1c40f",
//         // "#3498db
//         "#eeeeee",
//       ],
//       // borderWidth:[//失敗
//       //   7
//       // ],
//       data: [12, 19],
//       // data: [a, b],
//       // borderWidth: 1,//動かない
//     }]
//   },
//   options:{
//     title: {
//         display: true,
//         text: '1週間の歩行距離',
//         fontSize:40,
//     },
//     legend: {//凡例
//       display:true,
//       labels:{
//         fontSize:15,
//         // paddingBottom:50,
//
//       }
//      },
//      // ticks:{
//      //   paddingBottom:50,
//      // }
//   }
// });
// //棒グラフ
// var ctx2 = document.getElementById("myBarChart");
// var myBarChart = new Chart(ctx2, {
//   //グラフの種類
//   type: 'bar',
//   //データの設定
//   data: {
//       //データ項目のラベル
//       // labels: ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"],
//       // labels: ["日曜"+this_week[0],"月曜\n"+this_week[1], "火曜\n"+this_week[2], "水曜\n"+this_week[3], "木曜\n"+this_week[4], "金曜\n"+this_week[5], "土曜\n"+this_week[6]],
//       // labels: [this_week[0]+"日曜\n",this_week[1]+"月曜\n", this_week[2]+"火曜\n",this_week[3]+ "水曜\n", this_week[4]+"木曜\n",this_week[5]+ "金曜\n",this_week[6]+ "土曜\n"],
//       labels: [this_week[0]+" 日",this_week[1]+" 月", this_week[2]+" 火",this_week[3]+ " 水", this_week[4]+" 木",this_week[5]+ " 金",this_week[6]+ " 土"],
//       //データセット
//       datasets: [{
//           //凡例
//           label: "1日運動した距離",
//           // fontSize:25,
//           //背景色
//           backgroundColor: "rgba(75,192,192,0.4)",
//           //枠線の色
//           borderColor: "rgba(75,192,192,1)",
//           //グラフのデータ
//           // data: [12, 19, 3, 5, 2, 3]
//           // data: [Number(distance_weekly_array[0]),Number(distance_weekly_array[1]),Number(distance_weekly_array[2]),Number(distance_weekly_array[3]),Number(distance_weekly_array[4]),Number(distance_weekly_array[5]),Number(distance_weekly_array[6])]
//           data: [(distance_weekly_array[0]),(distance_weekly_array[1]),(distance_weekly_array[2]),(distance_weekly_array[3]),(distance_weekly_array[4]),(distance_weekly_array[5]),(distance_weekly_array[6])]
//       }]
//   },
//   //オプションの設定
//   options: {
//     title: {
//         display: true,
//         text: '1週間歩行グラフ',
//         fontSize:40,
//     },
//     legend: {//凡例
//       display:true,
//       labels:{
//         fontSize:15,
//       }
//      },
//     scaleOverride : true,//縦軸の目盛りの上書き許可。これ設定しないとscale関連の設定が有効にならないので注意。
//       //軸の設定
//       scales: {
//           //縦軸の設定
//           yAxes: [{
//              display: true,
//
//             scaleLabel: {              //軸ラベル設定
//                        display: true,          //表示設定
//                        labelString: 'km',  //ラベル
//                        // "<%=value%>km",
//                        fontSize: 25,               //フォントサイズ
//
//                     },
// 　　　　　　　　　//目盛りの設定
//               ticks: {
//                   //開始値を0にする
//                   beginAtZero:true,
//                   autoSkip: true,
//                   maxTicksLimit: 20, //値の最大表示数
//                   fontSize: 25,               //フォントサイズ
//               },
//               lables:{
//                 allowDecimals: true,
//               },
//           }],
//           // x
//           xAxes:[{
//             display: true,
//
//            scaleLabel: {              //軸ラベル設定
//                   fontSize: 25,               //フォントサイズ
//                    },
// 　　　　　　　　　//目盛りの設定
//              ticks: {
//                  //開始値を0にする
//                  beginAtZero:true,
//                  autoSkip: true,
//                  maxTicksLimit: 20, //値の最大表示数
//                  fontSize: 25,               //フォントサイズ
//              },
//              lables:{
//                allowDecimals: true,
//              }
//           }]
//       }
//   }
// });
// // var ctx = document.getElementById("myChart").getContext('2d');
//
// // Define a plugin to provide data labels
// Chart.plugins.register({
//     afterDatasetsDraw: function (chart, easing) {
//         // To only draw at the end of animation, check for easing === 1
//         var ctx = chart.ctx;
//
//         chart.data.datasets.forEach(function (dataset, i) {
//             var meta = chart.getDatasetMeta(i);
//             if (!meta.hidden) {
//                 meta.data.forEach(function (element, index) {
//                     // Draw the text in black, with the specified font
//                     ctx.fillStyle = 'rgb(0, 150, 100)';
//
//                     var fontSize = 25;
//                     var fontStyle = 'normal';
//                     var fontFamily = 'Helvetica Neue';
//                     ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
//
//                     // Just naively convert to string for now
//                     var dataString = dataset.data[index].toString();
//
//                     // Make sure alignment settings are correct
//                     ctx.textAlign = 'center';
//                     ctx.textBaseline = 'middle';
//
//                     var padding = 5;
//                     var position = element.tooltipPosition();
//                     ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
//                 });
//             }
//         });
//     }
// });
//
//
//
// }
