// グローバルに展開
phina.globalize();

// 画面サイズ FHD
var SCREEN_WIDTH  = 1280;
var SCREEN_HEIGHT = 720;

// アセット
var ASSETS = {
    image:{

    },
    sound:{
        "hanko": "assets/sounds/hanko3.mp3"
    },
    font:{

    }
}

// ファイルパス
// PHP
// データダウンロード
var PHP_DOWNLOAD_PATH = "http://ras1.local/bingo/php/data_download_all.php";
// 週間記録データ
var PHP_DOWNLOAD_WEEKLY_TEST = "http://ras1.local/bingo/php/weekly_test.php";
// 自分の分のウィークリーポイント 更新日を設定
var PHP_UPDATE_POINTMY_PATH = "http://ras1.local/bingo/php/mypoint.php";

// 全員分のウィークリーポイント 更新日を設定
var PHP_UPDATE_POINTALL_PATH = "http://ras1.local/bingo/php/point_all.php";
// ビンゴカードの更新
var PHP_UPDATE_BINGOCARD_PATH = "http://ras1.local/bingo/php/bingo_card.php";
// ビンゴカードのクリア状況の更新
var PHP_UPDATE_BINGOCLEAR_PATH = "http://ras1.local/bingo/php/bingo_clear.php";
// 全員分のビンゴカードの真ん中マスを更新する
var PHP_UPDATE_BINGOALL_PATH = "http://ras1.local/bingo/php/card_all.php";

// HTML
var CHANGE_PAGE_URL = "http://ras1.local/screensaver/index.html";

// ビンゴデータのCSVファイル
// ユーザID
var USER_ID = 0;
// ビンゴカード 構成
var DATA_BINGOCARD_CSV_PATH = "php/card.csv";
var BINGOCARD_DATA = [];
// ビンゴカード クリア状況
var DATA_BINGOCLEAR_CSV_PATH = "php/clear.csv";
var BINGOCLEAR_DATA = [];
// 個人ポイントデータ
var DATA_PERSONAL_POINT_CSV_PATH = "php/PersonalPoint.csv";
var PERSONALPOINT_DATA = [];
// 個人週間歩行データ
var DATA_WEEKLY_PERSONAL_WALK_CSV_PATH = "php/WeeklyPersonalData.csv";
var WEEKLY_PERSONAL_WALK_DATA = [];
// 参加日数計算用
var DATA_WEEKLY_PERSONAL_WALK_CSV_PATH1 = "php/demidu.csv";
var WEEKLY_PERSONAL_COUNT_DATA = [];
// 全員分の週間運動データ
var DATA_WEEKLY_EVERYONE_WALK_DATA_PATH = "php/WeeklyTotalData.csv";
var WEEKLY_EVERYONE_WALK_DATA = [];
// ビンゴ ポイント ウィークリーランキング
var DATA_WEEKLYRANK_CSV_PATH = "php/WeeklyRanking.csv";
var WEEKLYRANK_DATA = [];
// ビンゴ ポイント トータルランキング
var DATA_TOTALRANK_CSV_PATH = "php/TotalRanking.csv";
var TOTALRANK_DATA = [];

// 今週取得したポイント
var PointCount = 0;

// 参加日数
var pday = 0;
// 連続参加日数
var cday = 0;
// チェックイン回数
var cc = 0;

// 本番用
// var DATA_BINGO_CSV_PATH = "";

// イベント列挙体
// イベント数取得方法
// Object.keys(EVENTS).length
var EVENTS = {
    GOTOSPOT     : 0,
    WALKKM       : 1,
    WALKHOUR     : 2,
    KCAL         : 3,
    PARTIDAY1    : 4,
    PARTIDAY2    : 5,
    PARTIDAY3    : 6,
    CHECKIN      : 7,
    EVERYONEKM   : 8,
    EVERYONEHOUR : 9,
    CONTINUE     : 10,
}

// ビンゴポイント
var ITEMPOINT  = 10;
var BINGOPOINT = 30;

// ビンゴカードシーン
phina.define("Bingo_Scene",{
    // 継承
    superClass: "DisplayScene",
    // コンストラクタ
    init: function(option){
        // 親クラス初期化
        this.superInit(option);

        // 自分自身
        var self = this;

        // グループ
        this.baseLayer = DisplayElement()
            .addChildTo(this)
            .setPosition(0,0);
        
        // 背景を設定
        console.log("背景を設定します");
        this.settingbackground();

        // データをダウンロード
        console.log("データベースからデータをダウンロードします");
        DB_download();
        console.log("4秒待機");
        // ダウンロードが終わるまで3秒待つ
        setTimeout(function(){
            // CSVファイル読み込み
            console.log("全てのCSVファイルを読み込みます");
            LoadAllCSV();

            // ポイント表示エリアを描画する
            console.log("ポイント表示エリアを描画します");
            self.showPointArea();

            // マス目を描画する
            console.log("マス目を描画します");
            self.showCells();

            // ランキングを表示する
            console.log("ランキングを表示します");
            self.showRanking();

            // クリアしたマスにラベルを貼っていくアニメ
            console.log("クリア表示を行います");
            self.clearAnim();
        },3000);

    },
    // 背景色 背景イメージを作成
    settingbackground: function(){
        // 背景色
        this.backgroundColor = "black";

        // 背景の丸
        for(var i=0; i<100; i++){
            var circle = CircleShape({
                radius: (function(){
                    return Random.randint(1,20);
                })(),
                fill: (function(){
                    // 背景色をランダムに設定
                    var hue = Random.randint(0, 360);
                    return 'hsl({0}, 75%, 50%)'.format(hue);
                })(),
                stroke: "gainsboro",
                x:(function(){
                    // 画面内でランダムに表示
                    return Random.randint(0,SCREEN_WIDTH);
                })(),
                y: (function(){
                    // 画面内でランダムに表示
                    return Random.randint(0,SCREEN_HEIGHT);
                })(),
            })
            .addChildTo(this.baseLayer);
        }
        // 背景の星
        for(var i=0; i<20; i++){
            var star = StarShape({
                radius: (function(){
                    return Random.randint(10,200);
                })(),
                fill: (function(){
                    // 背景色をランダムに設定
                    var hue = Random.randint(0, 360);
                    return 'hsl({0}, 75%, 50%)'.format(hue);
                })(),
                stroke: "gainsboro",
                x: (function(){
                    // 画面内でランダムに表示
                    return Random.randint(0,SCREEN_WIDTH);
                })(),
                y: (function(){
                    // 画面内でランダムに表示
                    return Random.randint(0,SCREEN_HEIGHT);
                })(),
            })
            .addChildTo(this.baseLayer);
        }

        // ラベル表示 BINGO
        var BINGO_label = Label({
            text: "B I N G O",
            fill: "gold",
            stroke: "white",
            strokeWidth: "20",
            fontSize: 170,
        })
        .addChildTo(this.baseLayer)
        .setPosition(this.width*0.4, 80);

        // 点滅アニメ
        var chg = false;
        var BINGO_FLASH = setInterval(function(){
            chg = !chg;
            chg ? BINGO_label.fill = "orangered" : BINGO_label.fill = "gold";
        },1000);
        
    },
    // ポイント表示エリアを描画
    showPointArea: function(){
        // ポイント表示エリア
        var PointArea = RectangleShape({
            width: 260,
            height: 670,
            stroke: "white",
            strokeWidth: 8,
            cornerRadius: 10,
            fill: "lightskyblue",
        })
        .addChildTo(this.baseLayer)
        .setPosition(1130,this.gridY.center());

        var Rank1st = RectangleShape({
            width: 260,
            height: 84,
            stroke: "white",
            strokeWidth: 8,
            cornerRadius: 5,
            fill: "gold",
        })            
        .addChildTo(PointArea)
        .setPosition(0,-168);

        var Rank2nd = RectangleShape({
            width: 260,
            height: 84,
            stroke: "white",
            strokeWidth: 8,
            cornerRadius: 5,
            fill: "silver",
        })            
        .addChildTo(PointArea)
        .setPosition(0,-79);

        var Rank3rd = RectangleShape({
            width: 260,
            height: 84,
            stroke: "white",
            strokeWidth: 8,
            cornerRadius: 5,
            fill: "brown",
        })            
        .addChildTo(PointArea)
        .setPosition(0,10);

        // ポイント表示
        this.MyPoint = {
            Label1: Label({
                text: "ID:" + USER_ID +"様のポイントは",
                fill: "black",
                stroke: "white",
                strokeWidth: "5",
                fontSize: 25,
            })
            .addChildTo(PointArea)
            .setPosition(0,200),

            MyPoint: Label({
                text: "0",
                fill: "black",
                stroke: "white",
                strokeWidth: "5",
                fontSize: 120,
            })        
            .addChildTo(PointArea)
            .setPosition(0,280)
        }

        // ポイントカウントは0にリセット
        PointCount = 0;

        // ランキング表示
        this.Ranking = {
            Label1: Label({
                text: "ランキング",
                fill: "black",
                stroke: "white",
                strokeWidth: "5",
                fontSize: 40,
            })        
            .addChildTo(PointArea)
            .setPosition(0,-300),

            Label2: Label({
                text: "今週",
                fill: "black",
                stroke: "white",
                strokeWidth: "5",
                fontSize: 25,
            })        
            .addChildTo(PointArea)
            .setPosition(-30,-240),

            Label3: Label({
                text: "通算",
                fill: "black",
                stroke: "white",
                strokeWidth: "5",
                fontSize: 25,
            })        
            .addChildTo(PointArea)
            .setPosition(70,-240),

            Label4: Label({
                text: "1位\n\n\n2位\n\n\n3位\n\n\n4位",
                fill: "black",
                stroke: "white",
                strokeWidth: "5",
                fontSize: 25,
            })        
            .addChildTo(PointArea)
            .setPosition(-100,-50),

            Label5: Label({
                text: "ID\nポイント",
                fill: "black",
                stroke: "white",
                strokeWidth: "2",
                fontSize: 15,
            })        
            .addChildTo(PointArea)
            .setPosition(-90,-240),

            Weekly: [
                // 1位
                Label({
                    text: "様",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(-30,-186),
                
                // 2位
                Label({
                    text: "様",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(-30,-96),

                // 3位
                Label({
                    text: "様",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(-30,-6),

                // 4位
                Label({
                    text: "様",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(-30,84),
            ],
            Total: [
                // 1位
                Label({
                    text: "様",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(70,-186),

                // 2位
                Label({
                    text: "様",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(70,-96),

                // 3位
                Label({
                    text: "様",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(70,-6),

                // 4位
                Label({
                    text: "様",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(70,84)
            ],
            WeeklyP: [
                // 1位
                Label({
                    text: "",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(-30,-146),
                
                // 2位
                Label({
                    text: "",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(-30,-56),

                // 3位
                Label({
                    text: "",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(-30,34),

                // 4位
                Label({
                    text: "",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(-30,124),
            ],
            TotalP: [
                // 1位
                Label({
                    text: "",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(70,-146),

                // 2位
                Label({
                    text: "",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(70,-56),

                // 3位
                Label({
                    text: "",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(70,34),

                // 4位
                Label({
                    text: "",
                    fill: "black",
                    stroke: "white",
                    strokeWidth: "5",
                    fontSize: 25,
                })        
                .addChildTo(PointArea)
                .setPosition(70,124)
            ]

        }
    },
    // マス目を描画
    showCells: function(){
        // マス目グループ
        this.CellsGroup = DisplayElement()
        .addChildTo(this.baseLayer)
        .setPosition(50,160);

        // 2次元配列
        this.Cells = [];

        var self = this;
        var Cellsself = this.Cells;
        
        // 3×3のビンゴカードを作成する
        // 縦
        for(var i=0; i<3; i++){
            var array = [];
            // 横
            for(var j=0; j<3; j++){
                // マス目のプロパティ
                var WIDTH  = 300;   // 幅
                var HEIGHT = 170;   // 高さ
                var CORNER = 10;    // 角の丸さ　半径
                var BORDER = 5;     // 縁取り
                var PADDING = 12;   // マス間距離

                // 1マスグループ　マス目と影を格納
                var Cell = DisplayElement()
                .addChildTo(this.CellsGroup)
                .setPosition(WIDTH/2 + (WIDTH + PADDING) * j,HEIGHT/2 + (HEIGHT + PADDING) * i);

                // マスの描画
                var s1 = RectangleShape({
                    width: WIDTH,
                    height: HEIGHT,
                    strokeWidth: 0,
                    cornerRadius: CORNER,
                    fill: "white",
                })
                .addChildTo(Cell)
                .setPosition(0,0);

                // 位置を記録
                s1.i = i;
                s1.j = j;

                // マスの影を描画
                var s1s = RectangleShape({
                    width: WIDTH + BORDER,
                    height: HEIGHT + BORDER,
                    strokeWidth: 0,
                    cornerRadius: CORNER,
                    fill: "gray",
                })
                .addChildTo(Cell)
                .setPosition(BORDER/2, BORDER/2);

                // 表示順を変更する
                Cell.children.swap(0, 1);

                // イベント内容を表示する
                // ラベルを作成
                var EVENT_Label = Label({
                    text: "",
                    fill: "black",
                    stroke: "gray",
                    fontSize: 35,
                })
                .addChildTo(Cell);

                // イベント状況を表示する
                // ラベルを作成
                var EVENT_Label1 = Label({
                    text: "",
                    fill: "black",
                    stroke: "gray",
                    fontSize: 20,
                })
                .addChildTo(Cell)
                .setPosition(0,60);

                //console.log(BINGOCARD_DATA);
                // card.csvに従ってビンゴカードを生成
                var event = BINGOCARD_DATA[1][2 + i*3 + j] - 0;
                // イベントに応じてラベルテキストを変更
                switch(event){
                    case EVENTS.GOTOSPOT:
                        EVENT_Label.text = "舞鶴高専\nへ行く";
                        break;
                    case EVENTS.WALKKM:
                        EVENT_Label.text = "5km\n歩く";
                        EVENT_Label1.text = Math.floor(WEEKLY_PERSONAL_WALK_DATA[1][2]-0) + "km/5km";
                        break;
                    case EVENTS.WALKHOUR:
                        EVENT_Label.text = "3時間\n歩く";
                        EVENT_Label1.text = Math.floor(WEEKLY_PERSONAL_WALK_DATA[1][1]-0) + "時間/3時間";
                        break;
                    case EVENTS.KCAL:
                        EVENT_Label.text = "500kcal\n消費する";
                        EVENT_Label1.text = Math.floor(WEEKLY_PERSONAL_WALK_DATA[1][3]-0) + "kcal/500kcal";
                        break;
                    case EVENTS.PARTIDAY1:
                        EVENT_Label.text = "1日\n参加する";
                        EVENT_Label1.text = pday + "日/1日";
                        break;
                    case EVENTS.PARTIDAY2:
                        EVENT_Label.text = "2日\n参加する";
                        EVENT_Label1.text = pday + "日/2日";
                        break;
                    case EVENTS.PARTIDAY3:
                        EVENT_Label.text = "3日\n参加する";
                        EVENT_Label1.text = pday + "日/3日";
                        break;
                    case EVENTS.CHECKIN:
                        EVENT_Label.text = "10回\nチェックインする";
                        EVENT_Label1.text = cc + "回/10回";
                        break;
                    case EVENTS.EVERYONEKM:
                        EVENT_Label.text = "みんなで\n50km歩く";
                        EVENT_Label1.text = Math.floor(WEEKLY_EVERYONE_WALK_DATA[1][2]-0) + "km/50km";
                        break;
                    case EVENTS.EVERYONEHOUR:
                        EVENT_Label.text = "みんなで\n30時間歩く";
                        EVENT_Label1.text = Math.floor(WEEKLY_EVERYONE_WALK_DATA[1][1]-0) + "時間/30時間";
                        break;
                    case EVENTS.CONTINUE:
                        EVENT_Label.text = "連続\n3日参加";
                        EVENT_Label1.text = cday + "日/3日";
                        break;
                    default:
                        EVENT_Label.text = "FREE";
                        break;                
                }
                // 配列の要素を作成
                array[j] = {
                    group: Cell,
                    shape: s1,
                    shadow: s1s,
                    event: event,
                    label: EVENT_Label,
                    open: false,
                };

                // タッチを有効化
                array[j].shape.setInteractive(true);
                // タッチイベントを追加する
                array[j].shape.onpointstart = function(){
                    //var me = this;
                    //showClearLabel(me);

                    if(Cellsself[this.i][this.j].open == false){
                        // クリアフラグ
                        Cellsself[this.i][this.j].open = true;
                        // クリア表示をする
                        var CLEAR_Label = Label({
                            text: "クリア",
                            fill: "red",
                            stroke: "orange",
                            fontSize: 70,
                        })
                        .addChildTo(Cellsself[this.i][this.j].group);

                        // ポイントを数える
                        PointCounter( Cellsself );
                        // ポイント表示を変更する
                        self.MyPoint.MyPoint.text = PointCount;

                        this.remove();
                        console.log(this.i,this.j);
                    }
                }
            }
            this.Cells[i] = array;
        }
        console.log("全てのマス目にイベントが設定されました");
        console.log(this.Cells);
    },
    showRanking: function(){
        // 週間と通算 それぞれ4位まで表示
        for(var i=0; i<4; i++){
            // 週間ランキング i位
            // ユーザID
            this.Ranking.Weekly[i].text = WEEKLYRANK_DATA[1+i][1] + "様";
            // ポイント
            this.Ranking.WeeklyP[i].text = WEEKLYRANK_DATA[1+i][2];

            // 通算ランキング i位
            // ユーザID
            this.Ranking.Total[i].text = TOTALRANK_DATA[1+i][1] + "様";
            // ポイント
            this.Ranking.TotalP[i].text = TOTALRANK_DATA[1+i][2];
        }
    },
    // 順番にクリアラベルを貼っていくアニメ
    clearAnim: function(){
        var i = 0;
        var j = 0;
        var self = this;
        var timer = setInterval(function(){
            // クリアしているマスだったら
            if(BINGOCLEAR_DATA[1][2+i*3+j] == 1){
                // フラグを立てる
                self.Cells[i][j].open = true;

                // 音を再生する
                SoundManager.setVolume(4);
                SoundManager.play("hanko");

                // クリア表示をする
                var CLEAR_Label = Label({
                    text: "クリア",
                    fill: "red",
                    stroke: "orange",
                    fontSize: 70,
                })
                .addChildTo(self.Cells[i][j].group);

                // ポイントを数える
                PointCounter( self.Cells );
                // ポイント表示を変更する
                self.MyPoint.MyPoint.text = PointCount;

                // 白い部分を削除する
                self.Cells[i][j].shape.remove();
                console.log(self.Cells[i][j].shape.i,self.Cells[i][j].shape.j);
            }

            j += 1;
            if(j == 3){
                j = 0;
                i += 1; 
            }
            if(i == 3){
                stoptimer();
            }
        },300);

        function stoptimer(){
            // アニメをストップする
            clearInterval(timer);    
            
            setTimeout(function(){
                ChangeCurrentPage();
            },3000);
            
        }
    },
})

// データ初期化シーン
phina.define("Initialize_Scene",{
    // 継承
    superClass: "DisplayScene",
    // コンストラクタ
    init: function(option){
        // 親クラス初期化
        this.superInit(option);

        var self = this;

        // 背景色
        this.backgroundColor = "black";

        // とりあえずラベル表示
        this.LoadingLabel = Label({
            text: "読み込み中です",
            fill: "white",
            stroke: "white",
            strikeWidth: "5",
            fontSize: 100,
        })
        .addChildTo(this)
        .setPosition(this.gridX.center(),this.gridY.center());

        // データベースからデータをダウンロードする
        console.log("データベースからデータをダウンロードします");
        DB_download();

        console.log("データベースからデータがダウンロードできるまで待機");
        console.log("3秒待機");

        setTimeout(function(){
            // 全データを読み込む
            console.log("全てのCSVファイルを読み込みます");
            LoadAllCSV();

            // ユーザIDを記録
            USER_ID = self.getUSERID();
            console.log("ユーザIDを読み込みました: " + USER_ID);
            
            // 更新チェック
            console.log("更新をチェックします");
            self.chkUpdate();

            // クリア判定チェック
            console.log("クリア条件を達しているかチェックします");
            self.chkClear();

            // データの更新を行います
            // 個人ビンゴ ポイント 週間 通算
            update_mypoint();
            console.log("ポイント " + PERSONALPOINT_DATA);   
            // 個人ビンゴカード
            update_bingocard();
            console.log("ビンゴカード " + BINGOCARD_DATA);
            // 個人ビンゴカード クリア状況
            update_bingoclear();
            console.log("クリア状況 " + BINGOCLEAR_DATA);
        

            // シーン切り替え
            console.log("初期化が完了しました。シーンを切り替えます");
            setTimeout(function(){
                self.exit("ビンゴカード");
            },1000);

        },3000);
    },
    // ユーザIDを取得
    getUSERID: function(){
        var num = 0;
        if(PERSONALPOINT_DATA != null){
            num = PERSONALPOINT_DATA[1][1];
        }else{
            console.error("個人ポイントデータが取得できません");
            num = 0;
        }
        return num;
    },
    // 更新の判断
    chkUpdate: function(){
        if(WEEKLYRANK_DATA != null){
            // 全員分の更新が必要かどうか判断する
            // 週間ランキングの初期化日から計算
            // 前に更新した日を取得
            var day1 = new Date(WEEKLYRANK_DATA[1][3]);
            // 今日の日付を取得
            var day2 = new Date(getNowYMD());
            //差日を求める（86,400,000ミリ秒＝１日）
            var termDay = Math.ceil((day2 - day1) / 86400000);
            console.log(day1,day2,termDay);
            // 更新は7日目以降
            if(termDay >= 7){
            //if(true){
                console.log("ウィークリーランキングの更新が必要です");
                console.log("全員分のポイントを初期化します");
                // ウィークリーポイントを0に戻す
                // ポイントは全員分チェックする
                this.updweeklypoint();
            }else{
                console.log("ウィークリーランキングの更新は必要ありません");
            }
        }else{
            console.error("ウィークリーランキングデータが取得できません");
        }
        
        // ビンゴカードの更新をチェックする
        if(BINGOCARD_DATA != null){
            // ビンゴカードの更新が必要かどうか判断する
            // ビンゴカードの初期化日から計算する
            // 前に更新した日を取得
            var day1 = new Date(BINGOCARD_DATA[1][11]);
            // 今日の日付を取得
            var day2 = new Date(getNowYMD());
            //差日を求める（86,400,000ミリ秒＝１日）
            var termDay = Math.ceil((day2 - day1) / 86400000);
            console.log(day1,day2,termDay);
            // 更新は7日目以降
            if(termDay >= 7){
            //if(true){
                console.log("ビンゴカードの更新が必要です");
                // ビンゴカードを生成する
                this.cardUpdate();
            }else{
                console.log("ビンゴカードの更新は必要ありません");
            }
        }
    },
    cardUpdate: function(){
        // 全員でやるイベント以外
        // イベントナンバー
        var arr = [0,1,2,3,4,5,6,7,10];
        var ECOUNT = arr.length;
        // 配列arrをシャッフル
        for(var i=0; i<ECOUNT; i++){
            swap(arr,(Random.randint(0,100)%(ECOUNT-1) + (i+1))%ECOUNT);
        }
        console.log("イベントをシャッフルしました:" + arr);

        // 真ん中のイベントはみんなでやるやつ
        // var CEVENT = Random.randint(0,1) == 0 ? EVENT.EVERYONEHOUR : EVENT.EVERYONEKM;
        // 後で全員分一気に変更するので仮の値を設定しておく
        //var CEVENT = 100;

        // 真ん中のイベントは全員の週間ポイントを更新するタイミングで一緒に更新する

        // ビンゴカードに設定
        // 同じタイミングでクリア状況も初期化する
        for(var i=0; i<9; i++){
            // クリア状況をリセットする
            BINGOCLEAR_DATA[1][2+i] = 0;

            // ビンゴカード生成
            // 真ん中はみんなでやるやつ なのでcountinueでスキップ
            if(i==4) 
                //BINGOCARD_DATA[1][6] = CEVENT;
                continue;
            else
                BINGOCARD_DATA[1][2+i] = arr[i];
        }
        // 更新日をセット
        // 更新日は週間ポイントを初期化した日
        BINGOCARD_DATA[1][11] = WEEKLYRANK_DATA[1][3];

        console.log("ビンゴカード更新完了:" + BINGOCARD_DATA);
        // ビンゴカードを更新する
        console.log("ビンゴカードデータをアップデートします");
//        update_bingocard();
        console.log("ビンゴクリアデータをアップデートします");
//        update_bingoclear();

        // スワップ関数
        function swap(v,value){
            var temp = v[value];
            v[value] = v[0];
            v[0] = temp;
        }
    },
    updweeklypoint: function(){
        // 自分のウィークリーポイントを0にする
        PERSONALPOINT_DATA[1][2] = 0;
        // 更新日を今日の日付に設定する
        PERSONALPOINT_DATA[1][4] = getNowYMD();
        // ランキング初期化の日も今日の日付を設定
        for(var i=1; i<WEEKLYRANK_DATA.length; i++){
            WEEKLYRANK_DATA[i][3] = PERSONALPOINT_DATA[1][4];
        }

        // このタイミングでビンゴカードの真ん中を更新する
        // 真ん中のイベントを決定 2択
        var CEVENT = Random.randint(0,1) == 0 ? EVENTS.EVERYONEHOUR : EVENTS.EVERYONEKM;
        // イベントを登録
        BINGOCARD_DATA[1][6] = CEVENT;
        console.log(BINGOCARD_DATA);

        // 自分のポイントデータを更新する
        console.log("Personal Pointデータをアップデートします");
        update_mypoint();
        // 全ユーザに対して更新を行う
        console.log("全員の週間ポイントを0にアップデートします");
        update_allpoint();
        //update_allpoint1();
        
        // ビンゴカードの真ん中マスの変更を更新する
        // 残り8マスは各自チェックインしたタイミングで更新の必要を判断し更新する
        console.log("ビンゴカードの真ん中マスを全員分更新します");
        update_bingocard();
        //update_bingoall();
    },
    chkClear: function(){
        // 配列を作成
        var CHKPOINT = [];
        for(var i=0; i<3; i++){
            var TEMP = [];
            for(var j=0; j<3; j++){
                TEMP[j] = {
                    open: false,
                };
            }
            CHKPOINT[i] = TEMP;
        }
        // 全部のマスを見る
        for(var i=0; i<3; i++){
            for(var j=0; j<3; j++){
                // マスのイベントを取得
                //var event = self.Cells[i][j].event;
                console.log("ビンゴカード" + BINGOCARD_DATA);
                var event = BINGOCARD_DATA[1][2+i*3+j] - 0;
                // 達成しているかチェック イベントに応じて分岐
                switch(event){
                    case EVENTS.GOTOSPOT:
                        chkgotospot(i,j);
                        break;
                    case EVENTS.WALKKM:
                        chkwalkkm(i,j);
                        break;
                    case EVENTS.WALKHOUR:
                        chkwalkhour(i,j);
                        break;
                    case EVENTS.KCAL:
                        chkkcal(i,j);
                        break;
                    case EVENTS.PARTIDAY1:
                        chkpartiday1(i,j);
                        break;
                    case EVENTS.PARTIDAY2:
                        chkpartiday2(i,j);
                        break;
                    case EVENTS.PARTIDAY3:
                        chkpartiday3(i,j);
                        break;
                    case EVENTS.CHECKIN:
                        chkcheckin(i,j);
                        break;
                    case EVENTS.EVERYONEKM:
                        chkeveryonekm(i,j);
                        break;
                    case EVENTS.EVERYONEHOUR:
                        chkeveryonehour(i,j);
                        break;
                    case EVENTS.CONTINUE:
                        chkcontinue(i,j);
                        break;
                    default:
                        //EVENT_Label.text = "FREE";
                        break;                
                }
            }
        }

        // 全てチェックが終わればポイントを計算する
        PointCounter(CHKPOINT);

        // ポイントデータ
        // 週間ポイント
        var weeklyp = PERSONALPOINT_DATA[1][2] - 0;
        // 通算ポイント
        var totalp = PERSONALPOINT_DATA[1][3] - 0; 
        //console.log("個人通算ポイント:" + totalp);
        // 前回からの差分を通算ポイントの追加量
        var dif = PointCount - weeklyp;
        // 加算
        totalp += dif;
        console.log("個人通算ポイント:" + totalp);

        // ポイントを格納する
        // 週間
        PERSONALPOINT_DATA[1][2] = PointCount;
        // 通算ポイント
        PERSONALPOINT_DATA[1][3] = totalp;

        // クリアデータの更新
        console.log("クリアデータの更新を行います");
        console.log(BINGOCLEAR_DATA);
//        update_bingoclear();

        // ポイントの更新
        console.log("個人ポイントデータの更新を行います");
        console.log(PERSONALPOINT_DATA);
//        update_mypoint();

        // 舞鶴高専にチェックイン
        // 必ずクリアにする
        function chkgotospot(i,j){
            console.log("舞鶴高専チェックインしました");
            console.log("舞鶴高専チェックイン i,j" + i + " " + j);
            // クリアデータをセット
            BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
            // ポイント計算用配列にもセット
            CHKPOINT[i][j].open = true;
        }

        // 指定距離歩く
        function chkwalkkm(i,j){
            // 5km
            // 距離を格納
            var dist = WEEKLY_PERSONAL_WALK_DATA[1][2];
            console.log(dist + "km歩きました");
            if( dist > 5 ){
                console.log("指定距離を歩く i,j" + i + " " + j);
                // クリアデータをセット
                BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                // ポイント計算用配列にもセット
                CHKPOINT[i][j].open = true;
            }
        }

        // 指定時間歩く
        function chkwalkhour(i,j){
            // 3時間
            // 時間を格納
            var time = WEEKLY_PERSONAL_WALK_DATA[1][1];
            console.log(time + "時間歩きました");
            if( time > 3 ){
                console.log("指定時間を歩く i,j" + i + " " + j);
                // クリアデータをセット
                BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                // ポイント計算用配列にもセット
                CHKPOINT[i][j].open = true;
            }
        }

        // 指定カロリーを消費する
        function chkkcal(i,j){
            // 500kcal
            // 消費カロリーを格納
            var kcal = WEEKLY_PERSONAL_WALK_DATA[1][3];
            console.log(kcal + "kcal消費しました");
            if( kcal > 500 ){
                console.log("指定カロリーを消費する i,j" + i + " " + j);
                // クリアデータをセット
                BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                // ポイント計算用配列にもセット
                CHKPOINT[i][j].open = true;
            }
        }

        // 指定日参加する 1
        function chkpartiday1(i,j){
            // 参加日数を数える
            var daycount = countpartiday();
            if(daycount >= 1){
                console.log("1日参加する i,j" + i + " " + j);
                // クリアデータをセット
                BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                // ポイント計算用配列にもセット
                CHKPOINT[i][j].open = true;
            }
        }
        
        // 指定日参加する 2
        function chkpartiday2(i,j){
            // 参加日数を数える
            var daycount = countpartiday();
            if(daycount >= 2){
                console.log("2日参加する i,j" + i + " " + j);
                // クリアデータをセット
                BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                // ポイント計算用配列にもセット
                CHKPOINT[i][j].open = true;
            }
        }
        
        // 指定日参加する 3
        function chkpartiday3(i,j){
            // 参加日数を数える
            var daycount = countpartiday();
            if(daycount >= 3){
                console.log("3日参加する i,j" + i + " " + j);
                // クリアデータをセット
                BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                // ポイント計算用配列にもセット
                CHKPOINT[i][j].open = true;
            }
        }
        
        // 指定回数チェックインする
        function chkcheckin(i,j){
            var count = 0;
            // そもそも歩いてきたか
            if(WEEKLY_PERSONAL_COUNT_DATA[1][1] != undefined){
                // 配列の長さ
                var ArrLength = WEEKLY_PERSONAL_COUNT_DATA.length;
                console.log("arrlength = "+ ArrLength);
                // 最初と最後のデータがほしい
                var newday = WEEKLY_PERSONAL_COUNT_DATA[1][3] - 0;
                var oldday = WEEKLY_PERSONAL_COUNT_DATA[ArrLength -2][3] - 0;
                console.log(newday, "-" ,oldday);
                count = newday - oldday;
                console.log(count + "回チェックインしました");
                cc = count;
                if( count > 10 ){
                    console.log("10回チェックインする i,j" + i + " " + j);
                    // クリアデータをセット
                    BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                    // ポイント計算用配列にもセット
                    CHKPOINT[i][j].open = true;
                }
            }else{
                console.log("チェックイン回数:まだ歩いてないよ");
            }
        }
        
        // みんなで指定距離歩く
        function chkeveryonekm(i,j){
            // 50km
            var dist = WEEKLY_EVERYONE_WALK_DATA[1][2];
            console.log("みんなで " + dist + "km歩きました");
            if( dist > 50 ){
                console.log("みんなで50km歩く i,j" + i + " " + j);
                // クリアデータをセット
                BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                // ポイント計算用配列にもセット
                CHKPOINT[i][j].open = true;
            }
        }

        // みんなで指定時間歩く
        function chkeveryonehour(i,j){
            // 30時間
            var time = WEEKLY_EVERYONE_WALK_DATA[1][1];
            console.log("みんなで " + time + "時間歩きました");
            if( time > 50 ){
                console.log("みんなで30時間歩く i,j" + i + " " + j);
                // クリアデータをセット
                BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                // ポイント計算用配列にもセット
                CHKPOINT[i][j].open = true;
            }
        }
        
        // 指定日連続で参加する
        function chkcontinue(i,j){
            var DATE_DATA = [];
            // 1日参加する
            // そもそも歩いてきたか
            if(WEEKLY_PERSONAL_COUNT_DATA[1][0] != undefined){
                // 配列の長さ
                var ArrLength = WEEKLY_PERSONAL_COUNT_DATA.length;
                // だけループ
                for(var k=1; k<ArrLength-1; k++){
                    // 配列の中身のデータ
                    var str = WEEKLY_PERSONAL_COUNT_DATA[k][0];
                    //「 」で区切って分割する
                    var result = str.split(' ');
                    console.log("日付" + result[0]);
                    DATE_DATA[k-1] = result[0];
                }
                console.log("日付データ\n" + DATE_DATA);
                // 日付のデータの長さ
                var count = 1;
                var ArrLength = DATE_DATA.length;
                for(var k=ArrLength-1; 0<k; k--){
                    // 差日を求める（86,400,000ミリ秒＝１日）
                    var day1 = new Date(DATE_DATA[k]);
                    var day2 = new Date(DATE_DATA[k-1]);
                    // 差日を求める（86,400,000ミリ秒＝１日）
                    var termDay = Math.ceil((day2 - day1) / 86400000);
                    if(count >= 3){
                        // ループを抜け出す
                        k = -1;
                    }
                    // 日付をまたいでいたら
                    else if(termDay == 1){
                        // 連続参加日をカウントする
                        count += 1;
                    }
                    // 日付をまたいでいたが、2日以上あいていたら
                    else if(termDay > 1){
                        // 1日目に戻す
                        count = 1;
                    }
                }
                console.log("連続参加 " + count + "日目");
                cday = count;
    
                // 3日連続参加していたら
                if(count >= 3){
                    console.log("3日連続で参加する i,j" + i + " " + j);
                    // クリアデータをセット
                    BINGOCLEAR_DATA[1][2+i*3 + j] = 1;
                    // ポイント計算用配列にもセット
                    CHKPOINT[i][j].open = true;
                }    
            }else{
                console.error("日付計算: 歩行データがありません");
            }
        }

        // 日付を計算して返す
        function countpartiday(){
            var DATE_DATA = [];
            // 1日参加する
            // そもそも歩いてきたか
            if(WEEKLY_PERSONAL_COUNT_DATA[1][0] != undefined){
                // 配列の長さ
                var ArrLength = WEEKLY_PERSONAL_COUNT_DATA.length;
                // だけループ
                for(var i=1; i<ArrLength-1; i++){
                    // 配列の中身のデータ
                    var str = WEEKLY_PERSONAL_COUNT_DATA[i][0];
                    //「 」で区切って分割する
                    var result = str.split(' ');
                    //console.log("日付" + result[0]);
                    DATE_DATA[i-1] = result[0];
                }
                console.log("日付データ\n" + DATE_DATA);
                // 日付のデータの長さ
                var count = 1;
                var ArrLength = DATE_DATA.length;
                for(var i=ArrLength-1; 0<i; i--){
                    console.log("日付比較: " + DATE_DATA[i-1], DATE_DATA[i]);
                    var day1 = new Date(DATE_DATA[i]);
                    var day2 = new Date(DATE_DATA[i-1]);
                    console.log("new Date: " + day1,day2);
                    // 差日を求める（86,400,000ミリ秒＝１日）
                    var termDay = Math.ceil((day2 - day1) / 86400000);
                    console.log("日付差分: " + termDay);
                    count += termDay;
                }
                console.log("日数カウント: " + count);
                pday = count;
                return count;    
            }else{
                console.error("日付計算: 歩行データがありません");
            }
        }
    }
})

/* メイン処理 */
phina.main(function(){
    // アプリケーションを生成
    var app = GameApp({
        // MainSceneから開始
        startLabel: "ロード画面",
        // スクリーンサイズの変更
        width: SCREEN_WIDTH, 
        height: SCREEN_HEIGHT,
        // FPSは8で固定させたい
        fps: 8,

        // アセット読み込み
        assets: ASSETS,

        // シーン
        scenes: [
            // 初期化シーン
            {
                label: "ロード画面",
                className: "Initialize_Scene",
            },
            // ビンゴカード
            {
                label: "ビンゴカード", // ラベル。参照用
                className: "Bingo_Scene", // クラス名
            },
        ]
    });
    // fps表示
    // app.enableStats();

    // 実行
    app.run();
})

//CSVファイルを読み込む関数getCSV()の定義
function getCSV(path){
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", path, false); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行

    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
    var csvData = req.responseText;
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = csvData.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }
    return result;
}

// 全データを読み込む
function LoadAllCSV(){
    // ビンゴカードデータを読み込む
    BINGOCARD_DATA = getCSV(DATA_BINGOCARD_CSV_PATH);
    // ビンゴカードクリア状況を読み込む
    BINGOCLEAR_DATA = getCSV(DATA_BINGOCLEAR_CSV_PATH);
    // 個人ポイントデータを読み込む
    PERSONALPOINT_DATA = getCSV(DATA_PERSONAL_POINT_CSV_PATH);
    // 個人週間歩行データ
    WEEKLY_PERSONAL_WALK_DATA = getCSV(DATA_WEEKLY_PERSONAL_WALK_CSV_PATH);
    // 参加日数計算用
    WEEKLY_PERSONAL_COUNT_DATA = getCSV(DATA_WEEKLY_PERSONAL_WALK_CSV_PATH1);

    // 全員分の週間歩行データ
    WEEKLY_EVERYONE_WALK_DATA = getCSV(DATA_WEEKLY_EVERYONE_WALK_DATA_PATH);
    // 全員分のウィークリーのポイントデータを読み込む
    WEEKLYRANK_DATA = getCSV(DATA_WEEKLYRANK_CSV_PATH);
    // ビンゴポイント 週間ランキング
    WEEKLYRANK_DATA = getCSV(DATA_WEEKLYRANK_CSV_PATH);
    // ビンゴポイント トータルランキング
    TOTALRANK_DATA = getCSV(DATA_TOTALRANK_CSV_PATH);
}

// 日付を取得し、整形する
function getNowYMD(){
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth()+1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + "-" + m + "-" + d;
    return result;
}

function PointCounter(Cells){
    PointCount = 0;
    // クリアしている数を数える
    for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
            if(Cells[i][j].open){
                // ポイント加算
                PointCount += ITEMPOINT;
            }
        }
    }

    // ビンゴを確認する
    // 行
    for(var i=0; i<3; i++){
        if(Cells[i][0].open && Cells[i][1].open && Cells[i][2].open){
            // ビンゴ
            PointCount += BINGOPOINT;
        }
    }
    // 列
    for(var i=0; i<3; i++){
        if(Cells[0][i].open && Cells[1][i].open && Cells[2][i].open){
            // ビンゴ
            PointCount += BINGOPOINT;
        }
    }
    // 右下がり斜め
    if(Cells[0][0].open && Cells[1][1].open && Cells[2][2].open){
        // ビンゴ
        PointCount += BINGOPOINT;
    }
    //右上がり斜め
    if(Cells[2][0].open && Cells[1][1].open && Cells[0][2].open){
        // ビンゴ
        PointCount += BINGOPOINT;
    }
    //this.MyPoint.MyPoint.text = PointCount;
}

// データベースからダウンロードする
function DB_download(){
    // XMLHttpRequestによるアップロード処理
    var xhttpreq = new XMLHttpRequest();
    xhttpreq.onreadystatechange = function() {
        if (xhttpreq.readyState == 4 && xhttpreq.status == 200) {
            //alert(xhttpreq.responseText);
        }
    };
    xhttpreq.open("POST", PHP_DOWNLOAD_PATH, false);
    xhttpreq.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhttpreq.send("");
}

// PHP 自分の分のウィークリーポイント 更新日を設定する
function update_mypoint(){
    console.log(PERSONALPOINT_DATA);
    var data = PERSONALPOINT_DATA;
    var json = JSON.stringify(data);

    // XMLHttpRequestによるアップロード処理
    var xhttpreq = new XMLHttpRequest();
    xhttpreq.onreadystatechange = function() {
        if (xhttpreq.readyState == 4 && xhttpreq.status == 200) {
            //alert(xhttpreq.responseText);
        }
    };
    xhttpreq.open("POST", PHP_UPDATE_POINTMY_PATH, false);
    xhttpreq.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhttpreq.send(json);
}

// PHP 全員分のウィークリーポイント 更新日を設定する
function update_allpoint(){
    var data = PERSONALPOINT_DATA;
    var json = JSON.stringify(data);

    // XMLHttpRequestによるアップロード処理
    var xhttpreq = new XMLHttpRequest();
    xhttpreq.onreadystatechange = function() {
        if (xhttpreq.readyState == 4 && xhttpreq.status == 200) {
            ////(xhttpreq.responseText);
        }
    };
    xhttpreq.open("POST", PHP_UPDATE_POINTALL_PATH, false);
    xhttpreq.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhttpreq.send(json);
}

// PHP 自分のビンゴカードを更新する
function update_bingocard(){
    var data = BINGOCARD_DATA;
    var json = JSON.stringify(data);

    // XMLHttpRequestによるアップロード処理
    var xhttpreq = new XMLHttpRequest();
    xhttpreq.onreadystatechange = function() {
        if (xhttpreq.readyState == 4 && xhttpreq.status == 200) {
            //alert(xhttpreq.responseText);
        }
    };
    xhttpreq.open("POST", PHP_UPDATE_BINGOCARD_PATH, false);
    xhttpreq.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhttpreq.send(json);
}

// PHP 自分のビンゴカードのクリア状況を更新する
function update_bingoclear(){
    var data = BINGOCLEAR_DATA;
    var json = JSON.stringify(data);

    // XMLHttpRequestによるアップロード処理
    var xhttpreq = new XMLHttpRequest();
    xhttpreq.onreadystatechange = function() {
        if (xhttpreq.readyState == 4 && xhttpreq.status == 200) {
            //alert(xhttpreq.responseText);
        }
    };
    xhttpreq.open("POST", PHP_UPDATE_BINGOCLEAR_PATH, false);
    xhttpreq.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhttpreq.send(json);
}

// PHP 全員分のビンゴカードの真ん中マスを更新する
function update_bingoall(){
    var data = BINGOCARD_DATA;
    var json = JSON.stringify(data);

    // XMLHttpRequestによるアップロード処理
    var xhttpreq = new XMLHttpRequest();
    xhttpreq.onreadystatechange = function() {
        if (xhttpreq.readyState == 4 && xhttpreq.status == 200) {
            //alert(xhttpreq.responseText);
        }
    };
    xhttpreq.open("POST", PHP_UPDATE_BINGOALL_PATH, false);
    xhttpreq.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhttpreq.send(json);
}

function ChangeCurrentPage(){
    /* 切り替えるページ */
    setTimeout(function(){
        document.location.href = CHANGE_PAGE_URL;
    },8000);
} 
