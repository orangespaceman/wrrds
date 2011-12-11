<?php 
/*
 * database connection and calls
 */
class DB {
  
  // privates
  protected $conf;
  protected $server;
  protected $dbname;
  protected $dbtable;
  protected $username;
  protected $password;
  protected $conn;
  
  /**
   * The constructor
   */
  function __construct() {

    // parse configuration file
    $path = dirname(__FILE__);
  	$this->conf = parse_ini_file($path."/../../config.ini.php", true);
  	foreach ($this->conf['db'] as $key => $value) {
  	 $this->$key = $value;
  	}
    
    $this->conn = mysql_connect($this->server, $this->username, $this->password);
    mysql_select_db($this->dbname, $this->conn);
  }

  
  /**
   * Generic MySQL select query 
   */
  function selectQuery($sql) {
    
    //run the initial query
    $result = @mysql_query($sql);
    
    //condition : if it is a single value, return it
    if (@mysql_num_fields($result) === 1 && @mysql_num_rows($result) === 1) {
      list($return) = @mysql_fetch_row($result);
    
    // it is more than a single row, start an array to contain each object...
    } else {
      
      //start the var to return
      $return = array();
    
      //for each row in the result, start a new object
      while ($row = @mysql_fetch_object($result)) {
        $return[] = $row;
      }
    }
    
    return $return;
  }


  /**
   * Generic MySQL update query 
   */
  function updateQuery($sql) {
    
    //run the initial query
    $result = mysql_query($sql);
    
    if ($result) {
      $return = true;
    } else {
      $return = false;
    }
    
    return $return;
  }
  
  
  /**
   * Generic MySQL add query 
   */
  function addQuery($sql) {
    
    //run the initial query
    $result = mysql_query($sql);
    
    if ($result) {
      $return = mysql_insert_id();
    } else {
      $return = false;
    }
    
    return $return;
  }
  
  /*
   *
   */
  function sanitise($val) {
    return strip_tags(mysql_real_escape_string($val));
  }
  
  
  
  
  /*
   *
   * Site-specific calls
   *
   */
  
  /*
   * get one at random
   */
  function getOneRand() {
    $sql = "SELECT *, date_format(dateadded, '%W %D %M %Y, %k:%i') as date_added, date_format(dateadded, '%k:%i') as time_added from `".$this->dbtable."` WHERE `isbanned` = 0 order by RAND() limit 0,1";
    $result = $this->selectQuery($sql);
    return $result[0];
  }
  
  /*
   * get next
   * get oldest message that hasn't been displayed yet
   * if none are returned, get a random post
   */
  function getNext() {
    $sql = "SELECT *, date_format(dateadded, '%W %D %M %Y, %k:%i') as date_added, date_format(dateadded, '%k:%i') as time_added from `".$this->dbtable."` WHERE isbanned = 0 AND plays = 0 order by dateadded asc limit 0,1";
    $result = $this->selectQuery($sql);
    if (count($result) > 0) {
      $return = $result[0];
    } else if ($this->conf['options']['repeatMessages']) {
      $return = $this->getOneRand();
    } else {
      return false;
    }
    $this->increaseViewCount($return->id);
    return $return;
  }
  
  /*
   * get all (admin)
   */
  function getAll() {
    $sql = "SELECT *, date_format(dateadded, '%W %D %M %Y, %k:%i') as date_added from `".$this->dbtable."` order by dateadded desc";
    return $this->selectQuery($sql);
  }
  
  /*
   * get all statuses (admin)
   */
  function getAllStatuses() {
    $sql = "SELECT id, isbanned from `".$this->dbtable."` order by dateadded desc";
    return $this->selectQuery($sql);
  }
  
  /*
   * get all since an ID (admin)
   */
  function getAllSinceId($id) {
    $sql = "SELECT *, date_format(dateadded, '%W %D %M %Y, %k:%i') as date_added from `".$this->dbtable."` WHERE id > ".$id." order by dateadded asc";
    return $this->selectQuery($sql);
  }
  
  
  /*
   * increase view count
   */
  function increaseViewCount($id) {
    $sql = "UPDATE `".$this->dbtable."` set plays = plays + 1 WHERE id = '".$id."'";
    return $this->updateQuery($sql);
  }
  
  /*
   * get count
   */
  function getMessageCount() {
    $sql = "SELECT count('id') as dbcount FROM `".$this->dbtable."`";
    return $this->selectQuery($sql);
  }
  
  /*
   * get count
   */
  function getApprovedCount() {
    $sql = "SELECT count('id') as dbcount FROM `".$this->dbtable."` WHERE isbanned = 0";
    return $this->selectQuery($sql);
  }
  
  
  /*
   * block
   */
  function blockUnblock($post) {
    
    // sanitise
    if (isset($post['block']) && $post['block'] == 0) {
      $isbanned = 0;
    } else {
      $isbanned = 1;
    }
    
    $id = $this->sanitise($post['id']);
    
    //insert 
    $sql = "
      UPDATE `".$this->dbtable."` 
      SET isbanned = '".$isbanned."'
      WHERE `id` = '".$id."'
    ";

    return array(
      "success" => $this->updateQuery($sql),
      "isbanned" => $isbanned,
      "id" => $id
    );
  }
  
  
  /*
   * save
   */
  function save($post) {
    
    // sanitise
    foreach($post as $key => $postitem) {
      $post[$key] = $this->sanitise($postitem);
    }
    
    // profanity check
    $moderation = 0;
    if ($this->conf['options']['moderate']) {
      require_once('Moderation.php');
      $moderation = Moderation::moderate($post['name']);
      if (!$moderation) { $moderation = Moderation::moderate($post['message']); }
    }
    
    //insert 
    $sql = "INSERT into `".$this->dbtable."` 
      (
        name,
        message,
        isflagged,
        isbanned,
        plays,
        ip,
        dateadded
      ) values (
        '".$post['name']."', 
        '".$post['message']."', 
        '".$moderation."',
        '".$moderation."',
        '0',
        '".$_SERVER['REMOTE_ADDR']."',  
         NOW()
      )";

    $id = $this->addQuery($sql);
    
    $return = array( 
      'success' => true,
      'details' => $post
    );
    
    return $return;
  } 
  
  
  /*
   * Archive
   * munged from http://davidwalsh.name/backup-mysql-database-php
   */
   function archive() {

     $tables = array();
     $result = mysql_query('SHOW TABLES');
     while($row = mysql_fetch_row($result)) {
       $tables[] = $row[0];
     }

     //cycle through
     foreach($tables as $table) {
       $result = mysql_query('SELECT * FROM '.$table);
       $num_fields = mysql_num_fields($result);

       $return.= 'DROP TABLE '.$table.';';
       $row2 = mysql_fetch_row(mysql_query('SHOW CREATE TABLE '.$table));
       $return.= "\n\n".$row2[1].";\n\n";

       for ($i = 0; $i < $num_fields; $i++) {
         while($row = mysql_fetch_row($result)) {
           $return.= 'INSERT INTO '.$table.' VALUES(';
           for($j=0; $j<$num_fields; $j++) {
             $row[$j] = addslashes($row[$j]);
             $row[$j] = preg_replace("/\n/","\\n",$row[$j]);
             if (isset($row[$j])) { $return.= '"'.$row[$j].'"' ; } else { $return.= '""'; }
               if ($j<($num_fields-1)) { $return.= ','; }
             }
             $return.= ");\n";
           }
         }
         $return.="\n\n\n";
       }

       //save file
       $path = dirname(__FILE__);
       $handle = fopen($path.'/../sql/archive/db-'.date("d-m-y-H-i-s").'.sql','w+');
       fwrite($handle,$return);
       fclose($handle);
       
       // drop current contents and reset to default
       $sql = file_get_contents($path."/../sql/wrrds.sql");
       $queries = preg_split("/;+(?=([^'|^\\\']*['|\\\'][^'|^\\\']*['|\\\'])*[^'|^\\\']*[^'|^\\\']$)/", $sql); 
       foreach ($queries as $query){ 
         if (strlen(trim($query)) > 0) {
           $result = mysql_query($query);
            if (!$result) {
                die('Invalid query: ' . mysql_error());
            }
        }
       }
   }   
}