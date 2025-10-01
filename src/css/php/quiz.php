    <?php
    session_start();

    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET');

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

    if ($_SERVER['REQUEST_METHOD'] === "GET" && ($_GET['action'] ?? '') === "load") {
        $count = 10;  // número fijo de preguntas a obtener

        $stmt = $pdo->prepare("SELECT id, imagen AS imageUrl, answer1, answer2, answer3, answer4, correct_answer 
                            FROM questions ORDER BY RAND() LIMIT :count");
        $stmt->bindValue(':count', $count, PDO::PARAM_INT);
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $quizState = [
            "questions" => array_map(function($q) {
                return [
                    "id" => (int)$q["id"],
                    "imageUrl" => $q["imageUrl"], // usamos el alias definido en el SELECT
                    "answers" => [$q["answer1"], $q["answer2"], $q["answer3"], $q["answer4"]],
                    "correctIndex" => (int)$q["correct_answer"],
                ];
            }, $questions),
            "userAnswers" => array_fill(0, count($questions), -1),
            "currentIndex" => 0,
            "finished" => false,
        ];

        echo json_encode($quizState);
        exit;
    }

    // Acción no soportada
    http_response_code(400);
    echo json_encode(["error" => "Acción no soportada."]);
    ?>
