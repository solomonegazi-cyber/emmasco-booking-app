<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// -------------------------------------------------------------
// EMMASCO REINIGUNGSTEAM - TERMINBUCHUNG ONLINE (PDO + HOSTINGER COMPATIBLE)
// -------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Ungültige Anfragemethode.']);
    exit;
}

// 1. DATENBANKVERBINDUNG (Werte anpassen für Hostinger cPanel)
$db_host = 'localhost';             // Meistens localhost bei Hostinger
$db_name = 'emmasco_db';            // Name Ihrer Hostinger MySQL Datenbank
$db_user = 'emmasco_u';             // Ihr Hostinger Datenbank-Benutzer
$db_pass = 'MEIN_GEHEIMES_PW';       // Das gesetzte MySQL-Passwort

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Verbindung zur Hostinger-MySQL-Datenbank fehlgeschlagen. Bitte korrigieren Sie die Zugangsdaten.',
        'debug' => $e->getMessage()
    ]);
    exit;
}

// 2. FORMULAR-DATEN EINLESEN & DESINFIZIEREN
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8') : '';
$address = isset($_POST['address']) ? htmlspecialchars(trim($_POST['address']), ENT_QUOTES, 'UTF-8') : '';
$service_id = isset($_POST['service_id']) ? htmlspecialchars(trim($_POST['service_id']), ENT_QUOTES, 'UTF-8') : '';
$date = isset($_POST['date']) ? trim($_POST['date']) : '';
$time = isset($_POST['time']) ? trim($_POST['time']) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8') : '';
$has_pflegegrad = isset($_POST['has_pflegegrad']) ? 1 : 0;
$frequency = isset($_POST['frequency']) ? htmlspecialchars(trim($_POST['frequency']), ENT_QUOTES, 'UTF-8') : 'einmalig';

// Validierung
$errors = [];
if (empty($name)) $errors['name'] = 'Name ist erforderlich.';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Gültige E-Mail erforderlich.';
if (empty($phone)) $errors['phone'] = 'Telefonnummer ist erforderlich.';
if (empty($address)) $errors['address'] = 'Einsatzanschrift ist erforderlich.';
if (empty($date)) $errors['date'] = 'Datum ist erforderlich.';

if (!empty($errors)) {
    echo json_encode(['status' => 'error', 'errors' => $errors]);
    exit;
}

// Service Namen & Preise ermitteln
$service_names = [
    'haushaltshilfe' => 'Haushaltshilfe (§45a)',
    'reinigung' => 'Unterhaltsreinigung',
    'einkaufshilfe' => 'Einkaufshilfe',
    'alltagsbegleitung' => 'Alltagsbegleitung',
    'angehoerige' => 'Entlastung für Angehörige',
    'fenster' => 'Fensterreinigung',
    'buero' => 'Büroreinigung',
    'deepclean' => 'Deep Cleaning (Frühjahrsputz)'
];

$service_name = isset($service_names[$service_id]) ? $service_names[$service_id] : 'Sonderreinigung';
$booking_code = 'EM-' . rand(1000, 9999);

// 3. EINTRAGEN IN DIE MYSQL DATENBANK
try {
    $stmt = $pdo->prepare("
        INSERT INTO `bookings` (
            `booking_code`, `customer_name`, `email`, `phone`, `address`, 
            `service_id`, `service_name`, `booking_date`, `booking_time`, 
            `has_pflegegrad`, `frequency`, `message`, `status`
        ) VALUES (
            :code, :name, :email, :phone, :address, 
            :service_id, :service_name, :b_date, :b_time, 
            :pflegegrad, :freq, :msg, 'pending'
        )
    ");

    $stmt->execute([
        'code' => $booking_code,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'address' => $address,
        'service_id' => $service_id,
        'service_name' => $service_name,
        'b_date' => $date,
        'b_time' => $time,
        'pflegegrad' => $has_pflegegrad,
        'freq' => $frequency,
        'msg' => $message
    ]);

} catch (PDOException $ex) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Fehler beim Speichern der Buchung in der Datenbank.',
        'details' => $ex->getMessage()
    ]);
    exit;
}

// 4. BENACHRICHTIGUNGS-EMAILS VERSENDEN
$admin_to = "info@emmascoreinigungsteam.de";
$admin_subject = "=?UTF-8?B?" . base64_encode("Neue Termin-Anfrage $booking_code: $service_name") . "?=";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "From: EMMASCO Onlinebuchung <noreply@emmascoreinigungsteam.de>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/html; charset=utf-8\r\n";

// HTML E-Mail Body
$body = "
<html>
<body style='font-family: Arial, sans-serif; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 12px; background-color: #fafafa;'>
        <h2 style='color: #0056D6;'>Neue Buchungsanfrage (ID: $booking_code)</h2>
        <p>Hallo Admin,</p>
        <p>Ein Kunde hat eine neue Unterstützung angefordert. Das Ticket liegt im CRM-Speicher vor:</p>
        <hr style='border: 0; border-top: 1px solid #ddd;' />
        <ul style='list-style: none; padding-left: 0; line-height: 1.8;'>
            <li><strong>Leistung:</strong> $service_name</li>
            <li><strong>Kunde:</strong> $name</li>
            <li><strong>E-Mail:</strong> $email</li>
            <li><strong>Telefon:</strong> $phone</li>
            <li><strong>Einsatzort:</strong> $address</li>
            <li><strong>Termin:</strong> $date um $time Uhr</li>
            <li><strong>Intervall:</strong> $frequency</li>
            <li><strong>Pflegegrad?</strong> " . ($has_pflegegrad ? 'Ja (Abrechnung über SGB XI)' : 'Nein / Privat') . "</li>
            <li><strong>Mitteilung:</strong> \"$message\"</li>
        </ul>
        <hr style='border: 0; border-top: 1px solid #ddd;' />
        <p style='font-size: 11px; color: #a0a0a0;'>Loggen Sie sich im Admin-Portal ein, um diesen Einsatz mit einem Klick zu bestätigen.</p>
    </div>
</body>
</html>
";

@mail($admin_to, $admin_subject, $body, $headers);

// Bestätigung an den Einsender
$customer_subject = "=?UTF-8?B?" . base64_encode("Ihre Anfrage beim Emmasco Reinigungsteam (ID: $booking_code)") . "?=";
$customer_body = "
<html>
<body style='font-family: Arial, sans-serif; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 12px;'>
        <h2 style='color: #0056D6;'>Anfrage eingegangen! (Code: $booking_code)</h2>
        <p>Sehr geehrte(r) $name,</p>
        <p>vielen Dank für Ihr Vertrauen. Wir haben Ihre Buchungsanfrage für das EMMASCO Reinigungsteam erhalten:</p>
        <div style='background-color: #f6faff; padding: 15px; border-radius: 8px;'>
            <strong>Ihre gewählte Hilfe:</strong> $service_name<br />
            <strong>Termin:</strong> $date um $time Uhr ($frequency)<br />
            <strong>Einsatzort:</strong> $address<br />
        </div>
        <p>Unsere Mitarbeiter prüfen die Kapazitäten für diesen Tag. Wir rufen Sie in Kürze zurück, um die Zuweisung Ihrer Wunsch-Hilfskraft abzuschließen.</p>
        <p>Mit herzlichen Grüßen,<br /><strong>Ihre Emma Osei</strong><br />Inhaberin des Emmasco Reinigungsteams</p>
    </div>
</body>
</html>
";

@mail($email, $customer_subject, $customer_body, $headers);

echo json_encode([
    'status' => 'success',
    'booking_code' => $booking_code,
    'message' => 'Buchungsanfrage erfolgreich in der Hostinger-Datenbank registriert!'
]);
?>
