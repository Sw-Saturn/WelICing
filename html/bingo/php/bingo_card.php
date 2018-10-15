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

    $jjjj = $post[1][11];
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

    // 情報だけ
    $sql = "UPDATE card SET a=$aaaa,b=$bbbb,c=$cccc,d=$dddd,f=$ffff,g=$gggg,h=$hhhh,i=$iiii where ID=".$text;
    // SQL実行
	$res = $dbh->query($sql);

    // 日付だけ
    $sql = "UPDATE card SET date='$jjjj' where ID=".$text;

    // SQL実行
    $res = $dbh->query($sql);

} catch(PDOException $e) {	echo $e->getMessage();	die();}
// 接続を閉じる
header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');
?>