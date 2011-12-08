<?php
/*
 * Moderation
 */
class Moderation {

  /*
   *
   */
  private static $moderationDir = "/../txt/moderation/";
  
  
  /*
   *
   */
  private function _moderate($string) {
    $final = array();
    $moderationList = self::createModerationList();
    $words = self::_getWordSubstitutes($string);

    foreach ($moderationList as $curse_word) {
      $curse_word = self::escapeCurseWord($curse_word);

      foreach ($words as $key => $word)
      {
//        echo 'checking ' . $word . ' against . '.$curse_word . '<br/>';
        $value = preg_match("/\b$curse_word\b/i", $word);

        if ($value) {
          return true;
        }
      }
    }
    return false;
  }


  /*
   *
   */
  static function moderate($string) {
    $result = self::_moderate($string);

    if ($result === true){
      $message = "bad language found";
    }else{
      $message = "language ok";
    }
    //return self::_formatReturn($result, 0, $message);
    return $result;
  }


  /*
   *
   */
  private function escapeCurseWord($word) {
    
    // replace dodgy characters
    $word = trim($word);
    $word = preg_quote($word);
    $word = str_replace("/", "\/", $word);
    
    return $word;
  }
  


  /*
   *
   */
  private function _formatReturn($data, $error_code=0, $message="") {
    $return = array();

    if ($error_code !== 0) {
      $message = "ERROR: ".$message;
    }
    $return["data"] = $data;
    $return["error_code"] = $error_code;
    $return["message"] = $message;

    return $return;
  }
  

  /*
   *
   */
  private function _getWordSubstitutes($string) {
    $words = array();
    $words[] = $string;

    $characters[] = '1';
    $replacements[] = 'i';
    $characters[] = '@';
    $replacements[] = 'a';
    $characters[] = '3';
    $replacements[] = 'e';
    $characters[] = '!';
    $replacements[] = 'i';
    $characters[] = '$';
    $replacements[] = 's';
    $characters[] = '5';
    $replacements[] = 's';
    $characters[] = '0';
    $replacements[] = 'o';

    // swap number for letters (regex or functions)
    $substitute = str_replace($characters, $replacements, $string);
    $words[] = $substitute;

    // drop "spaces" and other masking characters?
    $words[] = str_replace(" ", "", $string);
    $words[] = str_replace("_", "", $string);
    $words[] = str_replace("*", "", $string);
    $words[] = str_replace(".", "", $string);
    $words[] = str_replace("-", "", $string);

    // drop numbers (and anything not in alphabetic)
    $words[] = ereg_replace("[^A-Za-z]", "", $string);

    // drop duplicates from the array
    $words = array_unique($words);
    
    //echo "<pre>";
    //print_r($words);
    //echo "</pre>";

    return $words;
  }
  
  
  /*
   *
   */
  private function createModerationList() {
    
    $words = array();
    
    // Automatically pull in every file within the 'BadWords' directory
    $currentDir = dirname(__FILE__);
    $files = scandir($currentDir.self::$moderationDir);
    foreach($files as $currentFile) {
      if (!is_dir($currentFile) && substr($currentFile, 0, 1) != ".") {
        $words = array_merge($words, file($currentDir.self::$moderationDir.$currentFile));
      }
    }
    
    //echo "<pre>";
    //print_r($words);
    //echo "</pre>";
    
    return $words;
  }
}