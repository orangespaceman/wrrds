<?php

  if (isset($_POST) && count($_POST) > 0) {
    
    // check what to do
    require_once("db.php");
    $model = new DB;
    $method = $_POST['method'];
    unset($_POST['method']);

    // 
    switch ($method) {

      // save post
      case "save":
        $result = $model->save($_POST);
        echo json_encode($result);
      break;
      
      // blockUnblock
      case "blockUnblock":
        $result = $model->blockUnblock($_POST);
        echo json_encode($result);
      break;
      
      // get next message
      case "getNext":
        $result = $model->getNext();
        echo json_encode($result);
      break;
      
      // get all since the latest ID
      case "getAllSinceId":
        $result = $model->getAllSinceId($_POST['id']);
        echo json_encode($result);
      break;
      
      // get all statuses
      case "getAllStatuses":
        $result = $model->getAllStatuses();
        echo json_encode($result);
      break;
    }
  }
