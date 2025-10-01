<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

$servername = "localhost";
$username = "a24oleproyat_admin";
$password = "FwLjRt9]d*RZ+$/*";
$dbname = "a24oleproyat_pro0";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    // Preflight CORS request
    http_response_code(204);
    exit;
}

if ($method === "GET") {
    $stmt = $pdo->query("SELECT * FROM questions ORDER BY id ASC");
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($questions);
    exit;
}

// Para POST, PUT, DELETE leemos JSON raw
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["error" => "JSON inválido o no enviado"]);
    exit;
}

$methodOverride = $data['_method'] ?? 'POST';

if ($method === "POST" && $methodOverride === "POST") {
    // Crear nuevo registro
    if (!isset($data['answer1'], $data['answer2'], $data['answer3'], $data['answer4'], $data['correct_answer'])) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos para crear"]);
        exit;
    }

    $imagen = $data['imagen'] ?? null;

    try {
        $stmt = $pdo->prepare("INSERT INTO questions (imagen, answer1, answer2, answer3, answer4, correct_answer) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$imagen, $data['answer1'], $data['answer2'], $data['answer3'], $data['answer4'], $data['correct_answer']]);
        echo json_encode(["ok" => true, "id" => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al insertar: " . $e->getMessage()]);
    }
    exit;

} elseif ($method === "POST" && $methodOverride === "PUT") {
    // Actualizar registro existente
    if (!isset($data['id'], $data['answer1'], $data['answer2'], $data['answer3'], $data['answer4'], $data['correct_answer'])) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos para actualizar"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE questions SET imagen=?, answer1=?, answer2=?, answer3=?, answer4=?, correct_answer=? WHERE id=?");
        $stmt->execute([$data['imagen'] ?? null, $data['answer1'], $data['answer2'], $data['answer3'], $data['answer4'], $data['correct_answer'], $data['id']]);
        echo json_encode(["ok" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar: " . $e->getMessage()]);
    }
    exit;

} elseif ($method === "POST" && $methodOverride === "DELETE") {
    // Borrar registro existente
    $id = intval($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "ID inválido para borrar"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM questions WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["ok" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al borrar: " . $e->getMessage()]);
    }
    exit;

} else {
    http_response_code(405);
    echo json_encode(["error" => "Método HTTP no soportado"]);
}
?>
