<?php
$id = $_REQUEST["id"];
$column = $_REQUEST["c"];
$input = $_REQUEST["in"];

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
UPDATE Channels SET $column='$input' WHERE ChannelID=$id;
EOF;
$ret = $db->query($sql);
// echo "Operation done successfully\n";
$db->close();
?>