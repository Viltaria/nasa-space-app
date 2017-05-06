<?php

  $MY_API_KEY = "AIzaSyC7V2jMEie47xdvMYR3QmBTccqw1E_b4r8";
  $lat = $_POST['lat'];
  $lng = $_POST['lng'];

  $jsonurl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=".$lat.",".$lng."&radius=10000&key=".$MY_API_KEY;
  $json = file_get_contents($jsonurl);


  echo $json;
?>
