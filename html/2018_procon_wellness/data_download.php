<?php
header('Access-Control-Allow-Origin: *');
$dsn1 = 'mysql:dbname=ikiiki;host=153.126.191.37';
$dsn2 = 'mysql:dbname=ikiiki_game;host=153.126.191.37';
$user = 'user1';
$password = 'Sotuken17-Feli';

$export_csv_title = ["ID", "CardNum", "time","Distance", "cal","TotalTime","TotalDist","TotalCal","Device","count","height","weight","age","gender"];

foreach( $export_csv_title as $key => $val ){
            /*コピペしたからダサいコードです。
             *        *この処理は全く意味ないです
             *               *変数名変えるの面倒だったのでこのままにしてます
             *                       *日本語が好きな方はここで文字コードを指定すると日本語が使えます
             *                               */
    $export_header1[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }

try{
	/* データベースの指定 */
    $data_pdo = new PDO($dsn1, $user, $password);
	$game_pdo=new PDO($dsn2, $user, $password);

	/*　テキストファイルからIDを読み取る　*/
	$text= file_get_contents('/home/pi/procon29/FelicaReader/idm.txt');
    var_dump($text);
	//$text = mb_strimwidth($text, 1, 17);
    
	var_dump($text);




/***************************************************************************/


/*ikiikiから歩行のデータをikiiki.csvに保存 
 *タッチした人の全てのデータを新しい順に保存する
 *記録するデータは ID,CardNum,タッチした時間,距離,消費カロリー,
 *総運動時間,総移動距離,総消費カロリー,端末番号,累計タッチ回数,
 *身長,体重,年齢,性別の順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "data.csv";
    $export_sql = "SELECT *  FROM ikiiki where ID= ".$text." order by 時間 desc ";


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header1);
        // データベース検索
        $stmt = $data_pdo->query($export_sql);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){

            $file->fputcsv($row);
        }

    }

/***************************************************************************/





}catch (PDOException $e){
    print('Error:'.$e->getMessage());
    die();
}
header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');

?>
