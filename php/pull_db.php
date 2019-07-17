<?php
$id = $_REQUEST["id"];
$column = $_REQUEST["c"];
// $input = $_REQUEST["in"];

class MyDB extends SQLite3 {
	function __construct() {
		$this->open('../db/channels.db');
	}
}

$db = new MyDB();
if(!$db) {
	// echo $db->lastErrorMsg();
} else {
	// echo "Opened database successfully\n";
}
$sql =<<<EOF
SELECT * FROM Channels WHERE ChannelID=$id;
EOF;

$ret = $db->query($sql);
while($row = $ret->fetchArray(SQLITE3_ASSOC) ) {
	$myObj->id = $row['ChannelID'];
	$myObj->name = $row['Name'];
	$myObj->gain = $row['Gain'];
	$myObj->interval = $row['Interval'];
	$myObj->shunt = $row['Shunt'];
	$myObj->unit = $row['Unit'];
	$myObj->var = $row['Var'];
	$myObj->pid = $row['PID'];
}
$myJSON = json_encode($myObj);
echo $myJSON;
   // echo "Operation done successfully\n";
$db->close();
?>