<!DOCTYPE html>
<html lang="de">
<head>
	<meta charset="utf-8" />
	<title>Abi 2020</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="harry.css">
</head>
<body>
	<?php
	session_start();
	$db = mysqli_connect('localhost','root','','abi_neu') or die ("Keine verbindung moeglich");
	mysqli_select_db($db, 'abi_neu') or die ("Die DB ist nicht vorhanden");

	$eingabeNutzername = $_POST['nutzername'];
	$eingabePasswort = $_POST['passwort'];

	$_SESSION['nutzername'] = $eingabeNutzername;

	$dbNutzername = "SELECT passwort FROM nutzer WHERE nutzername = '$eingabeNutzername'";

	$abfrageNutzer = mysqli_query($db, $dbNutzername) or die ("Abfrage konnte nicht ausgeführt werden.");
	$res = mysqli_num_rows($abfrageNutzer);

	$zeile = mysqli_fetch_row($abfrageNutzer);
	$passwortDB = $zeile[$res-1];

	if ($passwortDB==$eingabePasswort) {
		echo'<script>
			location.replace("Seite3.php")
		</script>';
	}else{
		echo'<script>
			location.replace("index.php")
		</script>';
	}

	mysqli_close($db);
	?>
</body>
</html>