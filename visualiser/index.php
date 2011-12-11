<?php $url = $_SERVER['SERVER_NAME'] . dirname($_SERVER['REQUEST_URI']); ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>Wrrds Visualiser</title>
  <style>
    * { margin:0;padding:0; }
    body { background:#000; color:#333; }
    html, body { width:100%; height:100%; }
    #header { width:100%; height:10%; }
    #visualiser { width:100%; height:90%; position:absolute; left:0; bottom:0; z-index:1; }
  </style>
  <script src="../_assets/js/ajax.js"></script>
  <script src="../_assets/js/json.js"></script>
  <script src="../_assets/js/canvas-letters.js"></script>
  <script>
    window.onload = function(){
      var canvasHeader = new canvasLetters();
      canvasHeader.init({
        inline: true,
        blockSize: 3,
        clearance: 4,
        loop:false,
        animate:false,
        canvasId: "header",
        textString: "Add a message: http://<?php echo $url; ?>"
      });
      
      var canvasPage = new canvasLetters();
      canvasPage.init({
        inline: true,
        blockSize: 10,
        clearance: 10,
        ajaxUrl: "../_assets/php/ajax.php",
        canvasId: "visualiser",
        textString: "Add a message!"
      });     
    };
  </script>
</head>
<body>
  <canvas id="header"></canvas>
  <canvas id="visualiser"></canvas>
</body>
</html>