<?php
  require_once("../_assets/php/db.php");
  
  // condition : logged in?
  $db = new DB;
  
  // condition : process post?
  if (isset($_POST) && count($_POST) > 0) {
    if (isset($_POST['block'])) {
      $result = $db->blockUnblock($_POST);
    }
  }
  
  $messages = $db->getAll();
  $messageCount = $db->getMessageCount();
  $approvedCount = $db->getApprovedCount();

?>
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta name="viewport" content="width=device-width,minimum-scale=1,maximum-scale=1">
  <title>Admin</title> 
  <link rel="stylesheet" href="../_assets/css/admin.css">
</head> 
<body> 

  <header>
    <a href="#messages">
      <h1>Admin</h1>
      <p><span id="approved"><?php echo $approvedCount; ?></span> approved messages (from <span id="total"><?php echo $messageCount; ?></span>)</p>
    </a>
  </header>
  
  <div id="messages">
<?php
      foreach ($messages as $key => $message) {
        echo '
    <form method="post" action="" id="form-'.$message->id.'">
      <fieldset>
        <legend>Messages!</legend>      
        <div class="message-block'.(($message->isbanned) ? " banned" : "").'">
          <h2>'.$message->message.'</h2>
          <p>'.$message->name.' <span class="ip meta">('.$message->ip.')</span></p>
          <time>'.$message->date_added.'</time>
          <!--<p class="views meta">Viewed '.$message->plays.' times</p>-->
          <p class="counter meta">'.$message->id.(($message->isflagged) ? ' <span class="flagged">(Flagged)</span>' : '').'</p>
          <input type="hidden" name="id" value="'.$message->id.'" />
          <input type="hidden" name="block" value="'.(($message->isbanned) ? "0" : "1").'" />
          <input type="submit" class="button" value="'.(($message->isbanned) ? "unblock" : "block").'" />       
        </div>
      </fieldset>
    </form>   
        ';
      }
?>
  </div>
  
  <script src="../_assets/js/ajax.js"></script>
  <script src="../_assets/js/json.js"></script>
  <script src="../_assets/js/cookies.js"></script>
  <script src="../_assets/js/ios-scale-fix.js"></script>
  <script src="../_assets/js/admin.js"></script>
</body> 
</html>