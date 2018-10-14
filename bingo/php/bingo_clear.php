<?php
$sql = null;

$dbh = null;
try {

$json = file_get_contents('php://input');
$post = json_decode($json,true);

$text= file_get_contents('/home/pi/procon29/FelicaReader/idm.txt');
//$text = mb_strimwidth($text, 1, 17);

	// DBへ接続	
	$dbh = new PDO("mysql:host=153.126.194.52; dbname=bingo; charset=utf8", 'user1', 'Sotuken17-Feli');

    $aaaa = $post[1][2];
    $bbbb = $post[1][3];
    $cccc = $post[1][4];
    $dddd = $post[1][5];
    $eeee = $post[1][6];
    $ffff = $post[1][7];
    $gggg = $post[1][8];
    $hhhh = $post[1][9];
    $iiii = $post[1][10];

	// ステータスを更新するSQLを作成
	//$sql = "UPDATE clear SET a=".$records3[1][2].",b=".$records3[1][3].",c=".$records3[1][4].",d=".$records3[1][5].",f=".$records3[1][7].",g=".$records3[1][8].",h=".$records3[1][9].",i=".$records3[1][10]." where ID=".$text;
    // 情報だけ
    $sql = "UPDATE clear SET a=$aaaa,b=$bbbb,c=$cccc,d=$dddd,f=$ffff,g=$gggg,h=$hhhh,i=$iiii where ID=".$text;

    //$sql = "UPDATE clear SET a=1,b=1,c=1,d=1,f=1,g=1,h=1,i=1 where ID=".$text;
	// SQL実行
	$res = $dbh->query($sql);
} catch(PDOException $e) {	echo $e->getMessage();	die();}
// 接続を閉じる
header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');
?>
    </body>
</html>