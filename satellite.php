<?php

  $lat = $_POST['lat'];
  $lng = $_POST['lng'];

  $jsonurl = "https://api.astrodigital.com/v2.0/search/?contains=".$lat.",".$lng;
  // $jsonurl = "https://api.astrodigital.com/v2.0/search/?contains=10,10";

  $str = file_get_contents($jsonurl);


  $json = json_decode($str, true);


  // echo '<pre>' . print_r($json, true) . '</pre>';
  // echo $json[results][0][thumbnail];

  $imageurl = $json[results][0][thumbnail];

  $i = imagecreatefromjpeg($imageurl);


  // echo "hi";

  for ($x=0;$x<imagesx($i);$x++) {
      for ($y=0;$y<imagesy($i);$y++) {
          $rgb = imagecolorat($i,$x,$y);
          $r   = ($rgb >> 16) & 0xFF;
          $g   = ($rgb >> 8) & 0xFF;
          $b   = $rgb & 0xFF;
          $rTotal += $r;
          $gTotal += $g;
          $bTotal += $b;
          $total++;
      }
  }
  $rAverage = round($rTotal/$total);
  $gAverage = round($gTotal/$total);
  $bAverage = round($bTotal/$total);

  echo $rAverage." ".$gAverage." ".$bAverage;

?>
