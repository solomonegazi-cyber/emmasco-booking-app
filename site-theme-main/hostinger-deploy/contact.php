<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// -------------------------------------------------------------
// EMMASCO REINIGUNGSTEAM - KONTAKTFORMULAR VERARBEITUNG (HOSTINGER COMPATIBLE)
// -------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');

// Nur POST-Anfragen zulassen
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Ungültige Anfragemethode.']);
    exit;
}

// Session starten (für eventuellen CSRF-Schutz)
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Eingabedaten abfangen und desinfizieren (Schutz vor XSS)
$name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8') : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8') : '';
$spam_answer = isset($_POST['spam_answer']) ? trim($_POST['spam_answer']) : '';

// Validierung
$errors = [];

if (empty($name)) {
    $errors['name'] = 'Name ist erforderlich.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
}

if (empty($phone)) {
    $errors['phone'] = 'Telefonnummer ist erforderlich.';
}

if (empty($message)) {
    $errors['message'] = 'Nachricht darf nicht leer sein.';
}

// Spam Schutz Validierung (5 + 3 = 8)
if ($spam_answer !== '8') {
    $errors['spam'] = 'Die Spam-Schutz-Frage wurde falsch beantwortet.';
}

if (!empty($errors)) {
    echo json_encode(['status' => 'error', 'errors' => $errors]);
    exit;
}

// -------------------------------------------------------------
// E-MAIL VERSAND ÜBER HOSTINGER MAILSERVER (mail() oder SMTP)
// -------------------------------------------------------------

$to = "info@emmascoreinigungsteam.de";
$subject = "=?UTF-8?B?" . base64_encode("Neue Kontaktanfrage: Emmasco Website - $name") . "?=";

// Schöner HTML E-Mail Header
$boundary = uniqid('np');
$headers = "MIME-Version: 1.0\r\n";
$headers .= "From: Website Kontaktformular <noreply@emmascoreinigungsteam.de>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/html; charset=utf-8\r\n";

$body = "
<html>
<head>
    <title>Neue Anfrage über die Emmasco Reinigungsteam Website</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fafafa;'>
        <h2 style='color: #0056D6; border-bottom: 2px solid #0056D6; padding-bottom: 10px;'>Neue E-Mail-Inquiry</h2>
        <p>Hallo Team,</p>
        <p>Es wurde eine neue Kontaktanfrage über das Online-Formular an Sie übermittelt:</p>
        
        <table style='width: 100%; border-collapse: collapse; margin-top: 15px;'>
            <tr>
                <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;'>Name:</td>
                <td style='padding: 8px; border-bottom: 1px solid #ddd;'>$name</td>
            </tr>
            <tr>
                <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;'>E-Mail-Adresse:</td>
                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><a href='mailto:$email'>$email</a></td>
            </tr>
            <tr>
                <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;'>Telefonnummer:</td>
                <td style='padding: 8px; border-bottom: 1px solid #ddd;'><a href='tel:$phone'>$phone</a></td>
            </tr>
            <tr>
                <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;'>Mitteilung / Wünsche:</td>
                <td style='padding: 8px; border-bottom: 1px solid #ddd; white-space: pre-line;'>$message</td>
            </tr>
        </table>
        
        <p style='margin-top: 25px; font-size: 11px; color: #a0a0a0; border-top: 1px solid #eaeaea; padding-top: 10px;'>
            Diese Nachricht wurde automatisch über die Hostinger Server auf emmascoreinigungsteam.de generiert.
        </p>
    </div>
</body>
</html>
";

// Senden des Mails
if (mail($to, $subject, $body, $headers)) {
    // Optional: Hier können Sie auch die Nachricht in der MySQL Datenbank speichern
    echo json_encode([
        'status' => 'success',
        'message' => 'Ihre Nachricht wurde erfolgreich gesendet! Wir setzen uns schnellstmöglich mit Ihnen in Verbindung.'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Der E-Mail-Versand auf dem Hostinger Server schlug fehl. Bitte prüfen Sie Ihre php.ini Konfiguration.'
    ]);
}
?>
