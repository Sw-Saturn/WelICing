<?php
header('Access-Control-Allow-Origin: *');
$dsn1 = 'mysql:dbname=ikiiki;host=153.126.191.37';
$dsn3 = 'mysql:dbname=bingo;host=153.126.191.37';
$user = 'user1';
$password = 'Sotuken17-Feli';

try{
	/* データベースの指定 */
	$data_pdo = new PDO($dsn1, $user, $password);
	$bingo_pdo=new PDO($dsn3, $user, $password);

	/*　テキストファイルからIDを読み取る　*/
	$text= file_get_contents('/home/pi/procon29/FelicaReader/idm.txt');
	var_dump($text);
//	$text = mb_strimwidth($text, 1, 17);
	var_dump($text);
	
//	var_dump($text);



/*ikiikiから歩行のデータをikiiki.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,タッチした時間,距離,消費カロリー,
 *総運動時間,総移動距離,総消費カロリー,端末番号,累計タッチ回数,
 *身長,体重,年齢,性別の順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "ikiiki.csv";
    $export_csv_title = ["ID", "CardNum", "time","Distance", "cal","TotalTime","TotalDist","TotalCal","Device","count","height","weight","age","gender"];
    $export_sql = "SELECT *  FROM ikiiki where ID= ".$text." order by 時間 desc limit 1";


 foreach( $export_csv_title as $key => $val ){
		/*コピペしたからダサいコードです。
		 *この処理は全く意味ないです
		 *変数名変えるの面倒だったのでこのままにしてます
		 *日本語が好きな方はここで文字コードを指定すると日本語が使えます
		 */
        $export_header1[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


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


/*ikiikiから歩行のデータをikiiki.csvに保存 
 *タッチした人の全てのデータを新しい順に保存する
 *記録するデータは ID,CardNum,タッチした時間,距離,消費カロリー,
 *総運動時間,総移動距離,総消費カロリー,端末番号,累計タッチ回数,
 *身長,体重,年齢,性別の順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "ThisWeek.csv";
    $export_sql1 = "SELECT *  FROM ikiiki where ID= ".$text." and yearweek(CURRENT_DATE,1)=yearweek(時間,1) order by 時間 desc ";
    $export_sql2 = "SELECT *  FROM ikiiki where ID= ".$text." and DAYOFYEAR(CURRENT_DATE)=DAYOFYEAR(時間) order by 時間 desc ";

    $temp2 =array("ID"=>0, "CardNum"=>0, "time"=>date("Y-m-d H:i:s"),"Distance"=>0, "cal"=>0,"TotalTime"=>0,"TotalDist"=>0,"TotalCal"=>0,"Device"=>0,"count"=>0,"height"=>0,"weight"=>0,"age"=>0,"gender"=>0);
	$i=True;

if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header1);
        // データベース検索
        $stmt = $data_pdo->query($export_sql2);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
		if($row["距離"]==0){
			$i=False;
		}
		if($i){
			$temp2["Distance"]+=$row["距離"];
			$temp2["cal"]+=$row["消費カロリー"];
		}
        }
            $file->fputcsv($temp2);

        $stmt = $data_pdo->query($export_sql1);
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $file->fputcsv($row);
        }

    }

/***************************************************************************/
    $file_path = "LastWeek.csv";
    $export_sql = "SELECT *  FROM ikiiki where ID= ".$text." and (yearweek(CURRENT_DATE,1)-1)=yearweek(時間,1) order by 時間 desc ";


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





/*bingoからcardのデータをcard.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,1,2,3,4,5,6,7,8,9の順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "card.csv";
    $export_csv_title = ["ID", "CardNum","1","2","3","4","5","6","7","8","9","date"];
    $export_sql = "SELECT *  FROM card where ID=".$text;


 foreach( $export_csv_title as $key => $val ){
        $export_header6[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header6);
        // データベース検索
        $stmt = $bingo_pdo->query($export_sql);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $file->fputcsv($row);
        }

    }
/***************************************************************************/



/*bingoからclearのデータをclear.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,1,2,3,4,5,6,7,8,9の順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "clear.csv";
    $export_csv_title = ["ID", "CardNum","1","2","3","4","5","6","7","8","9"];
    $export_sql = "SELECT *  FROM clear where ID=".$text;


 foreach( $export_csv_title as $key => $val ){
        $export_header7[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header7);
        // データベース検索
        $stmt = $bingo_pdo->query($export_sql);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $file->fputcsv($row);
        }

    }
/***************************************************************************/

/*bingoからpointのデータをPersonalPoint.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,weekly,total,dateの順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "PersonalPoint.csv";
    $export_csv_title = ["ID", "CardNum","weekly","total","date"];
    $export_sql = "SELECT *  FROM point where ID=".$text;


 foreach( $export_csv_title as $key => $val ){
        $export_header8[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header8);
        // データベース検索
        $stmt = $bingo_pdo->query($export_sql);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $file->fputcsv($row);
        }

    }
/***************************************************************************/


/*bingoからpointのデータをWeeklyRanking.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,point,dateの順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "WeeklyRanking.csv";
    $export_csv_title = ["ID", "CardNum","point","date"];
    $export_sql = "SELECT ID, CardNum, weekly, date  FROM point order by weekly desc";


 foreach( $export_csv_title as $key => $val ){
        $export_header9[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header9);
        // データベース検索
        $stmt = $bingo_pdo->query($export_sql);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $file->fputcsv($row);
        }

    }
/***************************************************************************/


/*bingoからpointのデータをTotalRanking.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,pointの順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "TotalRanking.csv";
    $export_csv_title = ["ID", "CardNum","point"];
    $export_sql = "SELECT ID,CardNum,total  FROM point order by total desc";


 foreach( $export_csv_title as $key => $val ){
        $export_header10[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header10);
        // データベース検索
        $stmt = $bingo_pdo->query($export_sql);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $file->fputcsv($row);
        }

    }
/***************************************************************************/

/*ikiikiからみんなの運動のデータをWeeklyTotalData.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,pointの順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */


    $file_path = "WeeklyTotalData.csv";
    $export_csv_title = ["CardNum","time","dist","cal","count"];
    $export_sql = "SELECT CardNum,時間,距離,消費カロリー,回数  FROM ikiiki WHERE yearweek(CURRENT_DATE,1) = yearweek(時間,1) ORDER BY 時間 DESC";

 foreach( $export_csv_title as $key => $val ){
        $export_header11[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header11);
        // データベース検索
        $stmt = $data_pdo->query($export_sql);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $file->fputcsv($row);
        }

    }
/***************************************************************************/



/*ikiikiから個人の運動のデータをWeeklyPersonalData.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,pointの順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "WeeklyPersonalData.csv";
    $export_csv_title = ["ID","time","dist","cal","count"];
    $export_sql = "SELECT ID,時間,距離,消費カロリー,回数  FROM ikiiki where yearweek(時間,1)=yearweek(CURRENT_DATE,1) and ID=".$text." ORDER BY 時間 DESC";


 foreach( $export_csv_title as $key => $val ){
        $export_header12[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header12);
        // データベース検索
        $stmt = $data_pdo->query($export_sql);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
//            if($row["ID"]==$text){
		$file->fputcsv($row);
//		}
        }

    }
/***************************************************************************/



/*ikiikiからみんなの運動のデータをWeeklyTotalData.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,pointの順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */


    $file_path = "WeeklyTotalData.csv";
    $export_csv_title = ["CardNum","time","dist","cal","count"];
    $export_sql1 = "SELECT CardNum,総運動時間,距離,消費カロリー,回数  FROM ikiiki WHERE yearweek(CURRENT_DATE,1) = yearweek(時間,1) ORDER BY 時間 DESC";
    $export_sql2 = "SELECT CardNum,総運動時間,距離,消費カロリー,回数  FROM ikiiki WHERE yearweek(CURRENT_DATE,1) = yearweek(時間,1) ORDER BY 時間 ASC";
    $sum=array("ID"=>0,"time"=>0,"dist"=>0,"cal"=>0,"count"=>0);
    $time_temp1=array(	 "1"=>0, "2"=>0, "3"=>0, "4"=>0, "5"=>0, "6"=>0, "7"=>0, "8"=>0, "9"=>0,"10"=>0,
			"11"=>0,"12"=>0,"13"=>0,"14"=>0,"15"=>0,"16"=>0,"17"=>0,"18"=>0,"19"=>0,"20"=>0,
			"21"=>0,"22"=>0,"23"=>0,"24"=>0,"25"=>0,"26"=>0,"27"=>0,"28"=>0,"29"=>0,"30"=>0,
			"31"=>0,"32"=>0,"33"=>0,"34"=>0,"35"=>0,"36"=>0,"37"=>0,"38"=>0,"39"=>0,"40"=>0,
			"41"=>0,"42"=>0,"43"=>0,"44"=>0,"45"=>0,"46"=>0,"47"=>0,"48"=>0,"49"=>0,"50"=>0,
			"51"=>0,"52"=>0,"53"=>0,"54"=>0,"55"=>0,"56"=>0,"57"=>0,"58"=>0,"59"=>0,"60"=>0,
			"61"=>0,"62"=>0,"63"=>0,"64"=>0,"65"=>0,"66"=>0);

    $time_temp2=array(	 "1"=>0, "2"=>0, "3"=>0, "4"=>0, "5"=>0, "6"=>0, "7"=>0, "8"=>0, "9"=>0,"10"=>0,
			"11"=>0,"12"=>0,"13"=>0,"14"=>0,"15"=>0,"16"=>0,"17"=>0,"18"=>0,"19"=>0,"20"=>0,
			"21"=>0,"22"=>0,"23"=>0,"24"=>0,"25"=>0,"26"=>0,"27"=>0,"28"=>0,"29"=>0,"30"=>0,
			"31"=>0,"32"=>0,"33"=>0,"34"=>0,"35"=>0,"36"=>0,"37"=>0,"38"=>0,"39"=>0,"40"=>0,
			"41"=>0,"42"=>0,"43"=>0,"44"=>0,"45"=>0,"46"=>0,"47"=>0,"48"=>0,"49"=>0,"50"=>0,
			"51"=>0,"52"=>0,"53"=>0,"54"=>0,"55"=>0,"56"=>0,"57"=>0,"58"=>0,"59"=>0,"60"=>0,
			"61"=>0,"62"=>0,"63"=>0,"64"=>0,"65"=>0,"66"=>0,);

    $count_temp1=array(	 "1"=>0, "2"=>0, "3"=>0, "4"=>0, "5"=>0, "6"=>0, "7"=>0, "8"=>0, "9"=>0,"10"=>0,
			"11"=>0,"12"=>0,"13"=>0,"14"=>0,"15"=>0,"16"=>0,"17"=>0,"18"=>0,"19"=>0,"20"=>0,
			"21"=>0,"22"=>0,"23"=>0,"24"=>0,"25"=>0,"26"=>0,"27"=>0,"28"=>0,"29"=>0,"30"=>0,
			"31"=>0,"32"=>0,"33"=>0,"34"=>0,"35"=>0,"36"=>0,"37"=>0,"38"=>0,"39"=>0,"40"=>0,
			"41"=>0,"42"=>0,"43"=>0,"44"=>0,"45"=>0,"46"=>0,"47"=>0,"48"=>0,"49"=>0,"50"=>0,
			"51"=>0,"52"=>0,"53"=>0,"54"=>0,"55"=>0,"56"=>0,"57"=>0,"58"=>0,"59"=>0,"60"=>0,
			"61"=>0,"62"=>0,"63"=>0,"64"=>0,"65"=>0,"66"=>0,);

    $count_temp2=array(	 "1"=>0, "2"=>0, "3"=>0, "4"=>0, "5"=>0, "6"=>0, "7"=>0, "8"=>0, "9"=>0,"10"=>0,
			"11"=>0,"12"=>0,"13"=>0,"14"=>0,"15"=>0,"16"=>0,"17"=>0,"18"=>0,"19"=>0,"20"=>0,
			"21"=>0,"22"=>0,"23"=>0,"24"=>0,"25"=>0,"26"=>0,"27"=>0,"28"=>0,"29"=>0,"30"=>0,
			"31"=>0,"32"=>0,"33"=>0,"34"=>0,"35"=>0,"36"=>0,"37"=>0,"38"=>0,"39"=>0,"40"=>0,
			"41"=>0,"42"=>0,"43"=>0,"44"=>0,"45"=>0,"46"=>0,"47"=>0,"48"=>0,"49"=>0,"50"=>0,
			"51"=>0,"52"=>0,"53"=>0,"54"=>0,"55"=>0,"56"=>0,"57"=>0,"58"=>0,"59"=>0,"60"=>0,
			"61"=>0,"62"=>0,"63"=>0,"64"=>0,"65"=>0,"66"=>0,);

    $i=0;
    $str="1";

 foreach( $export_csv_title as $key => $val ){
        $export_header11[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header11);
        // データベース検索
        $stmt = $data_pdo->query($export_sql1);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
		$sum["dist"]+=$row["距離"];
		$sum["cal"]+=$row["消費カロリー"];
		$time_temp1[$row["CardNum"]]=$row["総運動時間"];
		$count_temp1[$row["CardNum"]]=$row["回数"];

        }
        $stmt = $data_pdo->query($export_sql2);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
		$time_temp2[$row["CardNum"]]=$row["総運動時間"];
		$count_temp2[$row["CardNum"]]=$row["回数"];

        }
	for($i=1;$i<=66;$i++){
		$str=(string)$i;
		$sum["time"]+=($time_temp2[$str]-$time_temp1[$str]);
		$sum["count"]+=($count_temp2[$str]-$count_temp1[$str]);
	}
	
	$file->fputcsv($sum);

    }
/***************************************************************************/



/*ikiikiから個人の運動のデータをWeeklyPersonalData.csvに保存 
 *タッチした人の最新のデータのみ保存する
 *記録するデータは ID,CardNum,pointの順番
 *1行目にはそれぞれのタイトルが記録される
 *2行目にデータが記録される
 */
    $file_path = "WeeklyPersonalData.csv";
    $export_csv_title = ["ID","time","dist","cal","count"];
    $export_sql = "SELECT CardNum,総運動時間,距離,消費カロリー,回数  FROM ikiiki where yearweek(時間,1)=yearweek(CURRENT_DATE,1) and ID=".$text." ORDER BY 時間 DESC";
    $sum=array("ID"=>0,"time"=>0,"dist"=>0,"cal"=>0,"count"=>0);
    $temp=array("ID"=>0,"time"=>0,"dist"=>0,"cal"=>0,"count"=>0);

 foreach( $export_csv_title as $key => $val ){
        $export_header12[] = mb_convert_encoding($val, 'UTF-8', 'UTF-8');
    }


if(touch($file_path)){
        $file = new SplFileObject($file_path, "w");
        // 出力するCSVにヘッダーを書き込む
        $file->fputcsv($export_header12);
        // データベース検索
        $stmt = $data_pdo->query($export_sql);
        // 検索結果をCSVに書き込む
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
//            if($row["ID"]==$text){
		$sum["ID"]=$row["CardNum"];
		$sum["dist"]+=$row["距離"];
		$sum["cal"]+=$row["消費カロリー"];
		$sum["count"]=$row["回数"];
		$sum["time"]=$row["総運動時間"];
		if($row["回数"]>$temp["count"]){
			$temp["count"]=$row["回数"];
			$temp["time"]=$row["総運動時間"];
		}

//		}
        }
	$sum["time"]=$temp["time"]-$sum["time"];
	$sum["count"]=$temp["count"]-$sum["count"];
	
	$file->fputcsv($sum);

    }
/***************************************************************************/




}catch (PDOException $e){
    print('Error:'.$e->getMessage());
    die();
}
header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');

?>
