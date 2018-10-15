//グラフの日にち（横軸）取得
var this_week = getDate_this_Week();
var distance_weekly_sum_thisWeek = 0;
var distance_weekly_array_thisWeek = [0, 0, 0, 0, 0, 0, 0]; //0で初期化 日～土曜
var distance_weekly_sum_lastWeek = 0;
var distance_weekly_array_lastWeek = [0, 0, 0, 0, 0, 0, 0]; //0で初期化 日～土曜
//ドーナツ型グラフで必要　今週のだけで十分
var achievement_distance = 4.9; //0.7km*7日
var difference_distance = -10;

// function getDistance_weekly(distance_sum, distance_array) { //1週間の各曜日の運動距離格納
function getDistance_weekly(distance_sum_thisWeek, distance_array_thisWeek,distance_sum_lastWeek, distance_array_lastWeek) { //1週間の各曜日の運動距離格納
  //今週
  distance_weekly_sum_thisWeek = Number(distance_sum_thisWeek);
  distance_weekly_array_thisWeek = distance_array_thisWeek;
  //先週
  distance_weekly_sum_lastWeek = Number(distance_sum_lastWeek);
  distance_weekly_array_lastWeek = distance_array_lastWeek;
  // alert("GRAGH_BAR_distance_weekly_sum_thisWeek"+distance_weekly_sum_thisWeek);
  // alert("GRAGH_BAR_distance_weekly_array_thisWeek"+distance_weekly_array_thisWeek);

  //ドーナツグラフ_距離差計算
  // distance_weekly_sum_thisWeek=1.2;
  if (distance_weekly_sum_thisWeek < achievement_distance) {
    difference_distance = achievement_distance - distance_weekly_sum_thisWeek; //差を入れる
    // alert("difference_distance"+difference_distance);
  }
  //先週は棒グラフだけだから、ドーナツ型グラフ用の処理はいらない
  // if (distance_weekly_sum_lastWeek < achievement_distance) {
  //   difference_distance = achievement_distance - distance_weekly_sum_lastWeek; //差を入れる
  //   // alert("difference_distance"+difference_distance);
  // }
}

var Gragh_Bar = function() {
  Chart.defaults.global.defaultFontFamily = 'Arial';
  //plugins
  var PercentagePlugin = {
    afterDatasetsDraw: function(chart, easing) {
      // To only draw at the end of animation, check for easing === 1
      var ctx = chart.ctx;

      chart.data.datasets.forEach(function(dataset, i) {
        var dataSum = 0;
        dataset.data.forEach(function(element) {
          dataSum += parseInt(element);
        });
        //alert(dataSum);
        var meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          meta.data.forEach(function(element, index) {
            // Draw the text in black, with the specified font
            ctx.fillStyle = '#655f5f'; //文字色：白
            // ctx.fillStyle = '#818181';  //文字色：白
            // ctx.fillStyle = '#858585';  //文字色：白

            var fontSize = 65;
            var fontStyle = 'bold';
            var fontFamily = 'Arial';
            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

            // Just naively convert to string for now
            // var labelString = chart.data.labels[index];
            var labelString = "";
            var dataString = " " + (Math.round(parseInt(dataset.data[index]) / dataSum * 1000) / 10).toString() + "%";

            // Make sure alignment settings are correct
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            var padding = 155;
            var position = element.tooltipPosition();
            ctx.fillText(labelString, position.x, position.y - (fontSize / 2) - padding);
            if (index == 0)
              ctx.fillText(dataString, position.x - 10, position.y + (fontSize / 2) - padding);
          });
        }
      });
    }
  };


  var DataLabelPluginB = {
    afterDatasetsDraw: function(chart, easing) {
      var ctx = chart.ctx;
      chart.data.datasets.forEach(function(dataset, i) {
        var meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          meta.data.forEach(function(element, index) {
            ctx.fillStyle = '#655f5f'; //文字色：黒
            var fontSize = 25;
            var fontStyle = 'bold';
            var fontFamily = 'Arial';
            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
            var dataString = dataset.data[index].toString(); // データラベル（項目の値）の場合
            //var dataString = chart.data.labels[index];      // ラベル（項目名）の場合
            //var dataString=chart.data.labels[index];
            //var dataString=chart.data.data[index];
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var padding = -3;
            var position = element.tooltipPosition();
            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
          });
        }
      });
    }
  };


  document.getElementById("myDoughnut-distance_weekly_sum_thisWeek").innerHTML = String(distance_weekly_sum_thisWeek); //ID表示　1回目でも大丈夫
  //割合計算
  var difference_distance_rate = (difference_distance / (achievement_distance) * 100);
  var distance_weekly_sum_thisWeek_rate = (distance_weekly_sum_thisWeek / (achievement_distance) * 100);
  distance_weekly_sum_thisWeek_rate=Math.round(distance_weekly_sum_thisWeek_rate*10)/10;
  if (distance_weekly_sum_thisWeek_rate >= 100) {
    distance_weekly_sum_thisWeek_rate = 100;
    difference_distance_rate = 0;
    document.getElementById("myDoughnut-cheer-text").innerHTML = "今週達成！！";//
    document.getElementById("myDoughnut-distance_rate-text").innerHTML = String(distance_weekly_sum_thisWeek_rate)+"%";
    // alert("達成");
  }
  else if(distance_weekly_sum_thisWeek_rate > 80){
    document.getElementById("myDoughnut-cheer-text").innerHTML = "もう少し！！";
    document.getElementById("myDoughnut-distance_rate-text").innerHTML = String(distance_weekly_sum_thisWeek_rate)+"%";

  }
  else if(distance_weekly_sum_thisWeek_rate > 50){
    document.getElementById("myDoughnut-cheer-text").innerHTML = "半分きった！";
    document.getElementById("myDoughnut-distance_rate-text").innerHTML = String(distance_weekly_sum_thisWeek_rate)+"%";
  }
  else if(distance_weekly_sum_thisWeek_rate > 0){
    document.getElementById("myDoughnut-cheer-text").innerHTML = "もっと歩こう";
    document.getElementById("myDoughnut-distance_rate-text").innerHTML = String(distance_weekly_sum_thisWeek_rate)+"%";
  }
  //ドーナツグラフ
  Chart.defaults.global.elements.arc = {
    borderWidth: 5,       // 枠線の太さ
    borderColor:"rgba(252,230,16,0.7)",
    // borderColor:"#777777",
};
  var ctx1 = document.getElementById("myDoughnutChart");
  var myDoughnutChart = new Chart(ctx1, {

    type: 'doughnut',
    data: {
      labels: ["1週間の歩き", "1週間の推奨歩行距離 " + String(achievement_distance) + "KM まで"],
      datasets: [{
        backgroundColor: [
          // "#f1c40f",
          // "#3498db
          // "#fce610",
          //,
          "rgba(252,230,16,0.7)",
          "#555555",
          // "#eeeeee",
        ],
        // borderWidth:[//失敗
        //   7
        // ],
        data: [distance_weekly_sum_thisWeek_rate, difference_distance_rate],
        // data: [distance_weekly_sum_thisWeek_string,difference_distance_string],
        // data: [12, 2],
        // borderWidth: 1,//動かない
      }]
    },
    options: {
      // title: {
      //   display: true,
      //   fontFamily:'Arial',
      //   fontSize: 40,
      //   text: '1週間の歩行距離',
      //   // padding:-10,
      // },
      legend: { //凡例
        display: true,
        labels: {
          fontSize: 20,
          fontFamily: 'Arial',
          fontStyle:'bold',

          // padding: 100,
          // paddingBottom:50,

        },
        fontFamily: 'Arial',
      },
      dataString: "",
      // ticks:{
      //   // paddingBottom:50,
      //   callback:function(value,index,values){
      //     return value+'%';
      //   }
    },
    // plugins: [dataLabelPlugin],
    // plugins: [PercentagePlugin],
  });


  //棒グラフ
  Chart.defaults.global.elements.rectangle = {
    borderWidth: 5,       // 枠線の太さ
    borderColor:"#eeeeee",
};
//棒グラフ
  var ctx2 = document.getElementById("myBarChart");
  // alert(distance_weekly_array_lastWeek);
  var myBarChart = new Chart(ctx2, {
    //グラフの種類
    type: 'bar',
    //データの設定
    data: {
      //データ項目のラベル
      // labels: ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"],
      // labels: ["日曜"+this_week[0],"月曜\n"+this_week[1], "火曜\n"+this_week[2], "水曜\n"+this_week[3], "木曜\n"+this_week[4], "金曜\n"+this_week[5], "土曜\n"+this_week[6]],
      // labels: [this_week[0]+"日曜\n",this_week[1]+"月曜\n", this_week[2]+"火曜\n",this_week[3]+ "水曜\n", this_week[4]+"木曜\n",this_week[5]+ "金曜\n",this_week[6]+ "土曜\n"],
      labels: [this_week[0] + "月", this_week[1] + "火", this_week[2] + "水", this_week[3] + "木", this_week[4] + "金", this_week[5] + "土", this_week[6] + "日"],
      // labels: [this_week[0] + " 日", this_week[1] + " 月", this_week[2] + " 火", this_week[3] + " 水", this_week[4] + " 木", this_week[5] + " 金", this_week[6] + " 土"],
      //データセット
      datasets: [{
        //凡例
        label: "先週:1日歩行した距離",
        fontFamily: 'Arial',
        // fontSize:25,
        //背景色
        // backgroundColor: "rgba(31, 79, 231, 0.89)",
        // backgroundColor: "rgba(31, 103, 231, 0.4)",
        // backgroundColor: "rgba(90, 154, 223, 0.4)",//blue
        // backgroundColor: "rgba(75,192,192,0.4)", //greens
        backgroundColor: "rgba(193, 75, 92, 0.4)", //greens

        // backgroundColor: "rgba(75, 147, 193, 0.4)",//green
        //枠線の色
        // borderColor: "rgba(75, 159, 193, 1)",
        borderColor: "rgba(193, 75, 124, 1)",
        //グラフのデータ
        // data: [12, 19, 3, 5, 2, 3]
        // data: [Number(distance_weekly_array_thisWeek[0]),Number(distance_weekly_array_thisWeek[1]),Number(distance_weekly_array_thisWeek[2]),Number(distance_weekly_array_thisWeek[3]),Number(distance_weekly_array_thisWeek[4]),Number(distance_weekly_array_thisWeek[5]),Number(distance_weekly_array_thisWeek[6])]
        data: [(distance_weekly_array_lastWeek[0]), (distance_weekly_array_lastWeek[1]), (distance_weekly_array_lastWeek[2]), (distance_weekly_array_lastWeek[3]), (distance_weekly_array_lastWeek[4]), (distance_weekly_array_lastWeek[5]), (distance_weekly_array_lastWeek[6])]
      },
      {
        //凡例
        label: "今週:1日歩行した距離",
        fontFamily: 'Arial',
        // fontSize:25,
        //背景色
        // backgroundColor: "rgba(31, 79, 231, 0.89)",
        // backgroundColor: "rgba(31, 103, 231, 0.4)",
        // backgroundColor: "rgba(90, 154, 223, 0.4)",//blue
        backgroundColor: "rgba(75,192,192,0.4)", //greens
        // backgroundColor: "rgba(75, 117, 193, 0.4)", //greens
        // backgroundColor: "rgba(75, 147, 193, 0.4)",//green
        //枠線の色
        // borderColor: "rgba(75, 159, 193, 1)",
        borderColor: "rgba(75,192,192,1)",
        //グラフのデータ
        // data: [12, 19, 3, 5, 2, 3]
        // data: [Number(distance_weekly_array_thisWeek[0]),Number(distance_weekly_array_thisWeek[1]),Number(distance_weekly_array_thisWeek[2]),Number(distance_weekly_array_thisWeek[3]),Number(distance_weekly_array_thisWeek[4]),Number(distance_weekly_array_thisWeek[5]),Number(distance_weekly_array_thisWeek[6])]
        data: [(distance_weekly_array_thisWeek[0]), (distance_weekly_array_thisWeek[1]), (distance_weekly_array_thisWeek[2]), (distance_weekly_array_thisWeek[3]), (distance_weekly_array_thisWeek[4]), (distance_weekly_array_thisWeek[5]), (distance_weekly_array_thisWeek[6])]
      }
    ]
    },
    //オプションの設定
    options: {
      // title: {
      //   display: true,
      //   fontFamily:'Arial',
      //   text: '1週間歩行グラフ',
      //   fontSize: 40,
      // },
      legend: { //凡例
        display: true,
        labels: {
          fontSize: 20,
          fontFamily: 'Arial',
          fontStyle:'bold',
        },
        fontFamily: 'Arial',
      },
      scaleOverride: true, //縦軸の目盛りの上書き許可。これ設定しないとscale関連の設定が有効にならないので注意。
      //軸の設定
      scales: {
        //縦軸の設定
        yAxes: [{
          display: true,

          scaleLabel: { //軸ラベル設定
            display: true, //表示設定
            // labelString: 'km', //ラベル
            // "<%=value%>km",
            fontSize: 20, //フォントサイズ
            fontFamily: 'Arial',
          },
          //目盛りの設定
          ticks: {
            //開始値を0にする
            beginAtZero: true,
            autoSkip: true,
            maxTicksLimit: 20, //値の最大表示数
            fontSize: 23, //フォントサイズ
            fontFamily: 'Arial',
            callback: function(value, index, values) {
              return value + 'KM';
            }
          },
          lables: {
            allowDecimals: true,
          },
        }],
        // x
        xAxes: [{
          display: true,

          scaleLabel: { //軸ラベル設定

          },
          //目盛りの設定
          ticks: {
            //開始値を0にする
            beginAtZero: true,
            autoSkip: true,
            maxTicksLimit: 20, //値の最大表示数
            fontSize: 23, //フォントサイズ //本当
            fontFamily: 'Arial',
            // fontColor:"#666",
          },
          lables: {
            allowDecimals: true,
          },
          // legend:{
          //   labels:{
          //     fontColor:"#FFFFFF",
          //   },
          // },
        }]
      }
    },
    plugins: [DataLabelPluginB],
  });
  // var ctx = document.getElementById("myChart").getContext('2d');


  // Define a plugin to provide data labels
  // Chart.plugins.register({
  //   afterDatasetsDraw: function(chart, easing) {
  //     // To only draw at the end of animation, check for easing === 1
  //     var ctx = chart.ctx;
  //
  //     chart.data.datasets.forEach(function(dataset, i) {
  //       var meta = chart.getDatasetMeta(i);
  //       if (!meta.hidden) {
  //         meta.data.forEach(function(element, index) {
  //           // Draw the text in black, with the specified font
  //           ctx.fillStyle = 'rgb(0, 150, 100)';
  //
  //           var fontSize = 25;
  //           var fontStyle = 'normal';
  //           var fontFamily = 'Helvetica Neue';
  //           ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
  //
  //           // Just naively convert to string for now
  //           var dataString = dataset.data[index].toString();
  //
  //           // Make sure alignment settings are correct
  //           ctx.textAlign = 'center';
  //           ctx.textBaseline = 'middle';
  //
  //           var padding = 5;
  //           var position = element.tooltipPosition();
  //           ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
  //         });
  //       }
  //     });
  //   }
  // });



}
