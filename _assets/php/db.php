<?php 
/*
 * database connection and calls
 */
class DB {
  
  // privates
  private $server   = "localhost";
  private $dbname   = "canvas-letters-visualiser";
  private $dbtable  = "canvas-letters-visualiser";
  private $user     = "root";
  private $pass     = "root";
  private $conn;
  
  /**
   * The constructor
   */
  function __construct() {
    $this->conn = @mysql_connect($this->server,$this->user,$this->pass);
    @mysql_select_db($this->dbname, $this->conn);
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
    if (count($result) < 1) {
      $return = $this->getOneRand();
    } else {
      $return = $result[0];
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
    
    require_once('Moderation.php');
    
    // sanitise
    foreach($post as $key => $postitem) {
      $post[$key] = $this->sanitise($postitem);
    }
    
    // profanity check
    $moderation = Moderation::moderate($post['name']);
    if (!$moderation) { $moderation = Moderation::moderate($post['message']); }
    
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
}