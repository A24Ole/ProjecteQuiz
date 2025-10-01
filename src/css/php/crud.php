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
    echo json_encode(["error" => $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    $stmt = $pdo->query("SELECT * FROM questions ORDER BY id ASC");
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($questions);

} elseif ($method === "POST") {
    // Detectar JSON o FormData
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) { // si no era JSON, usar POST clásico
        $data = $_POST;
    }

    $methodOverride = $data['_method'] ?? null;

    if ($methodOverride === "PUT") {
        if (!isset($data['id'], $data['imagen'], $data['answer1'], $data['answer2'], $data['answer3'], $data['answer4'], $data['correct_answer'])) {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos para actualizar"]);
            exit;
        }
        $stmt = $pdo->prepare("UPDATE questions SET imagen=?, answer1=?, answer2=?, answer3=?, answer4=?, correct_answer=? WHERE id=?");
        $stmt->execute([$data['imagen'], $data['answer1'], $data['answer2'], $data['answer3'], $data['answer4'], $data['correct_answer'], $data['id']]);
        echo json_encode(["ok" => true]);

    } elseif ($methodOverride === "DELETE") {
        $id = intval($data['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "ID inválido para borrar"]);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM questions WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["ok" => true]);

    } else {
        // Imagen ahora es opcional
        if (!isset($data['answer1'], $data['answer2'], $data['answer3'], $data['answer4'], $data['correct_answer'])) {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos para crear"]);
            exit;
        }

        $imagen = $data['imagen'] ?? null;

        $stmt = $pdo->prepare("INSERT INTO questions (imagen, answer1, answer2, answer3, answer4, correct_answer) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$imagen, $data['answer1'], $data['answer2'], $data['answer3'], $data['answer4'], $data['correct_answer']]);

        echo json_encode(["ok" => true, "id" => $pdo->lastInsertId()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no soportado"]);
}
