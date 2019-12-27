<?php
/**
 *
 * Define our Room class
 *
 */
class classRooms
{
  // public $room; // object
// public $booked; //object
}

/**
 *
 * Checks if a specific room number exists in classroom array
 *
 * @param $classRooms  		Array of all classrooms
 * @param $newRoomNumber  The room number we wish to compare to each Room object in the array. Formatted as 1111
 * @return Room 					If the room exists, return the existing room object from the classroom array
 * @return false 					If the room does not exist, return false
 */
// function doesRoomExist($classRooms, $newRoomNumber) {
// 	for ($i = 0; $i < count($classRooms); $i++) {
// // var_dump($classRooms);
// // echo $classRooms[$i]->roomNumber . " == " . $newRoomNumber;
// // echo "<br>";
// 		if ($classRooms[$i]->roomNumber == $newRoomNumber) {
// 			return $classRooms[$i];
// 		}
// 	}
// 	return false;
// } // end of doesRoomExist

/**
 *
 * adds booked times (as 'kvartar' in properties)
 *
 * @param $room  			Object to add times to
 * @param $startTime  A bookings starting time formatted as HH:MM
 * @param $endTime  	A bookings ending time formatted as HH:MM
 * @return Room 			$room is of type Room
 */
function addBooking(
  $classRooms,
  $roomNumber,
  $startTime,
  $endTime,
  $newRoomNumber
) {
  $i = 0;

  $currHour = intval(substr($startTime, 1, 2));
  $currMinute = intval(substr($startTime, 4));
  $endHour = intval(substr($endTime, 1, 2));
  $endMinute = intval(substr($endTime, 4));

  if ($newRoomNumber == true) {
    $classRooms->$roomNumber = new StdClass();
  }

  if ($currMinute == 0) {
    $currMinute = "00";
  }

  while ($currHour != $endTime && $i < 999) {
    $objProp = intval($currHour . $currMinute);

    $classRooms->$roomNumber->$objProp = 1;

    if ($currMinute == 45) {
      $currMinute = "00";
      $currHour = $currHour + 1;
    } else {
      $currMinute = $currMinute + 15;
    }

    $i++; // no infinite loop plz
  }

  // error handling
  if ($i > 998) {
    echo "Error: addBooking loop infinite.";
    exit();
  }

  return $classRooms;
}

/**
 *
 * checks if a specific room number exists in classroom array
 *
 * @param $classRooms  		Array of all classrooms
 * @param $line 					A line from the csv file
 * @return array 					Return $classRooms array
 */
function createRooms($classRooms, $line)
{
  $roomNumber = preg_replace("/[^0-9]/", "", $line[8]);

  while (strlen($roomNumber) > 1) {
    $aRoomNumber = substr($roomNumber, 0, 4);

    if (isset($classRooms->$aRoomNumber)) {
      addBooking($classRooms, $aRoomNumber, $line[1], $line[3], false);
    } else {
      addBooking($classRooms, $aRoomNumber, $line[1], $line[3], true);
    }

    $roomNumber = substr($roomNumber, 4, strlen($roomNumber));
  }

  return $classRooms;
} // end of createRooms

$i = 0; // used to iterate over junk rows
$classRooms = new classRooms();
$file = fopen(
  "https://se.timeedit.net/web/uu/db1/schema/ri.csv?h=t&sid=3&p=0.d%2C0.d&objects=250742.211%2C250770.211%2C250771.211%2C250772.211%2C250773.211%2C250774.211%2C250775.211%2C250776.211%2C250777.211%2C250778.211%2C250709.211%2C250710.211%2C250833.211%2C250716.211%2C250715.211%2C250707.211&ox=0",
  'r'
);
// old with classrooms in house 2
//$file = fopen("https://se.timeedit.net/web/uu/db1/schema/ri1m0XYX65ZZ69Qm6Y0X2560y5Y59566206Q052Q9Y72Y6285590X05X99Y2226605Y968X206665262Y055Y7525Y692590XX2266152266955XY05296064X5Y6Y250X9552962X2906506503X50Y62560Y6537952X605Y6929Y9535862X56Y56X6503X02663059Y5XY90Z3766551Q72ofQc.csv", 'r');
while (($line = fgetcsv($file)) !== false) {
  if ($i >= 4) {
    createRooms($classRooms, $line);
  } // end of if $i >= 5

  $i++;

  if ($i > 999) {
    // if csv file is for some reason infinite
    echo json_encode("Error: fgetcsv infinite");
    exit();
  }
} // end of while

fclose($file);

// echo "<pre>"; print_r($classRooms); echo "</pre>";

echo json_encode($classRooms);

?>
