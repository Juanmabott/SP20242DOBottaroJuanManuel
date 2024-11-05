<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

sleep(3);

if($method == "GET") {
    $apiUrl = 'https://examenesutn.vercel.app/api/VehiculoAutoCamion';
    $response = file_get_contents($apiUrl);
    if ($response === FALSE) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener datos de la API"]);
        die();
    }
    echo $response;
    die();
}

if($method == "DELETE") {
    $objeto = json_decode(file_get_contents('php://input'), true);

    if (!isset($objeto['id']) || $objeto['id'] == 666 || $objeto['id'] == "666") {
        http_response_code(400);
        echo json_encode(["error" => "Error No se pudo procesar"]);
        die();
    }

    // Simulate deletion success
    echo json_encode(["message" => "Exito"]);
    die();
}

if($method == "POST") {
    $objeto = json_decode(file_get_contents('php://input'), true);

    $esVehiculo = 1;
    $esAuto = 1;
    $esCamion = 1;

    if (!isset($objeto['modelo']) || !isset($objeto['anoFabricacion']) || !isset($objeto['velMax'])) {
        $esVehiculo = 0;
    }

    if ($esVehiculo && (!isset($objeto['cantidadPuertas']) || !isset($objeto['asientos']))) {
        $esAuto = 0;
    }

    if ($esVehiculo && (!isset($objeto['capacidadCarga']) || !isset($objeto['autonomia']))) {
        $esCamion = 0;
    }

    if ($esVehiculo == 0 || ($esAuto == 0 && $esCamion == 0 && (isset($objeto['cantidadPuertas']) || isset($objeto['asientos']) || isset($objeto['capacidadCarga']) || isset($objeto['autonomia'])))) {
        http_response_code(400);
        echo json_encode(["error" => "Estructura Incorrecta"]);
        die();
    }
    
    if ($objeto['id'] == 666) {
        http_response_code(400);
        echo json_encode(["error" => "Error No se pudo procesar"]);
        die();
    }

    // Generate a new ID if not provided
    if (!isset($objeto['id']) || $objeto['id'] == null) {
        $apiUrl = 'https://examenesutn.vercel.app/api/VehiculoAutoCamion';
        $response = file_get_contents($apiUrl);
        if ($response === FALSE) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener datos de la API"]);
            die();
        }
        $vehiculos = json_decode($response, true);
        $maxId = max(array_column($vehiculos, 'id'));
        $objeto['id'] = $maxId + 1;
    }
    
    echo json_encode(["id" => $objeto['id']]);
    die();
}

if($method == "PUT") {
    $objeto = json_decode(file_get_contents('php://input'), true);

    $esVehiculo = 1;
    $esAuto = 1;
    $esCamion = 1;

    if (isset($objeto['modelo'])==false || isset($objeto['anoFabricacion'])==false || isset($objeto['velMax'])==false) {
        $esVehiculo = 0;
    }

    if ($esVehiculo && (isset($objeto['cantidadPuertas'])==false || isset($objeto['asientos'])==false)) {
        $esAuto = 0;
    }

    if ($esVehiculo && (isset($objeto['capacidadCarga'])==false || isset($objeto['autonomia'])==false)) {
        $esCamion = 0;
    }

    if ($esVehiculo == 0 || ($esAuto == 0 && $esCamion == 0 && (isset($objeto['cantidadPuertas']) || isset($objeto['asientos']) || isset($objeto['capacidadCarga']) || isset($objeto['autonomia'])))) {
        http_response_code(400);
        echo "Estructura Incorrecta";
        die();
    }

    $s = (string)time();
    echo json_encode(["id" => $s]);
    die();
}

?>