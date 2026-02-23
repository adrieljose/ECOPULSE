<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get sensor data from the POST request
if (isset($_POST['data'])) {
    $sensorData = $_POST['data'];

    // Assuming sensor data is separated by '&'
    parse_str(str_replace(":", "&", $sensorData), $data);
    print_r($data);  // Debugging

    // Prepare database connection
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "ecopulse";

    // Create a connection to the database
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Insert data into the readings table
    $sql = "INSERT INTO readings (pm1, pm25, pm10, recorded_at) 
            VALUES ('".$data['pm1']."', '".$data['pm25']."', '".$data['pm10']."', NOW())";

    // Check if query is successful
    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Close the connection
    $conn->close();
}
?>
