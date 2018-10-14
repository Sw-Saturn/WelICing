//現在日時を取得
    var liftoffTime = new Date();

    //目標となる日時を設定
    var baseSec = liftoffTime.getTime();
    var addSec = 7000; // 5秒（ミリ秒単位）

    var targetSec = baseSec + addSec;

    liftoffTime.setTime(targetSec);

    // $(function() {
      $('#timeCount').countdown({ until: liftoffTime, format: 'S', description: ''});
        // $('#timeCount').countdown({ until: liftoffTime, compact: true, format: 'HMS', description: ''});
    // }
