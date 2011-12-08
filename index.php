<?php 
  // process form submission
  if (!empty($_POST)) {
    require_once('./_assets/php/db.php');
    $db = new DB;
    $result = $db->save($_POST);
  }
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta name="viewport" content="width=device-width">
  <title>Add some wrrds</title>
  <link rel="stylesheet" href="./_assets/css/form.css">
</head>
<body>
  <h1>Add some wrrds</h1>

  <form method="post" action="">
    <fieldset>
      <legend>Add some wrrds</legend>
      
      <div class="input-container">
        <label for="name"><strong>Your name</strong></label>
        <input type="text" class="text" name="name" id="name" value="" maxlength="20" required />
      </div>
      
      <div class="input-container">
        <label for="message"><strong>Your message</strong></label>
        <textarea name="message" id="message" cols="20" rows="3" maxlength="60" required></textarea>
      </div>

      <div class="input-container">
        <input type="submit" class="button" name="submit" id="submit" value="Submit" />
        <?php if (isset($result) && $result['success']) { echo '<p id="message-saved">Message saved</p>'; }; ?>        
      </div>
    </fieldset>
  </form>
  
  <script src="./_assets/js/ajax.js"></script>
  <script src="./_assets/js/json.js"></script>
  <script src="./_assets/js/cookies.js"></script>
  <script src="./_assets/js/ios-scale-fix.js"></script>
  <script src="./_assets/js/form.js"></script>
</body>
</html>