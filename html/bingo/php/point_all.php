<?php
$sql = null;

$dbh = null;
try {

$json = file_get_contents('php://input');
$post = json_decode($json,true);

$text= file_get_contents('/home/pi/procon29/FelicaReader/idm.txt');
//$text = mb_strimwidth($text, 1, 17);

	$date = $post[1][4];

	// DBへ接続	
	$dbh = new PDO("mysql:host=153.126.194.52; dbname=bingo; charset=utf8", 'user1', 'Sotuken17-Feli');
	$sql = "UPDATE point SET weekly=0";

	// SQL実行
	$res = $dbh->query($sql);

	$sql = "UPDATE point SET date='$date'";

	// SQL実行
	$res = $dbh->query($sql);
	

} catch(PDOException $e) {	echo $e->getMessage();	die();}
// 接続を閉じる
header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');
?>