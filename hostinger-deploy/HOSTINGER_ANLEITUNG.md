# Hostinger Deployment-Anleitung: EMMASCO REINIGUNGSTEAM

Herzlichen Glückwunsch zur Fertigstellung Ihrer erstklassigen Reinigungs- und Alltagsbegleitungs-Website! Diese Anleitung führt Sie Schritt für Schritt durch die Installation Ihrer fertig kompilierten Website auf Ihrem **Hostinger Business Webspace**.

---

## 📋 VORBEREITUNGEN (ADMINISTRATOR-CREDENTIALS)

Ihr System wurde mit folgendem Standard-Administrator-Konto ausgestattet. Sie können dieses Konto nach dem ersten Einloggen in phpMyAdmin verändern.

- **Admin-Benutzername:** `admin_emmasco`
- **Admin-E-Mail:** `admin@emmascoreinigungsteam.de`
- **Standard-Passwort:** `admin123`

---

## 📦 SCHRITT-FÜR-SCHRITT BEREITSTELLUNG

### Schritt 1: Lokales Kompilieren des React/Vite-Frontends
Öffnen Sie Ihr VS Code / Terminal im Projekt-Hauptordner und führen Sie das Build-Skript aus:
```bash
npm run build
```
Dieser Befehl erzeugt einen Ordner namens `/dist` in Ihrem Projektverzeichnis. Dieser Ordner enthält die hochoptimierten, extrem schnellen statischen Seiten (`index.html`, komprimierte JS- und CSS-Dateien).

### Schritt 2: MySQL-Datenbank auf Hostinger erstellen
1. Loggen Sie sich in Ihr **Hostinger hPanel** ein.
2. Navigieren Sie zu **Datenbanken** ➜ **MySQL-Datenbanken**.
3. Erstellen Sie eine neue Datenbank:
   - **Datenbankname:** z.B. `u123456789_emmasco`
   - **Benutzername:** z.B. `u123456789_admin`
   - **Passwort:** *Wählen Sie ein sicheres Passwort*
4. Notieren Sie sich diese 3 Werte für Schritt 4.

### Schritt 3: SQL-Schema importieren
1. Klicken Sie im Hostinger hPanel neben Ihrer neuen Datenbank auf **phpMyAdmin aufrufen**.
2. Wählen Sie Ihre Datenbank aus und klicken Sie in der oberen Leiste auf **Importieren**.
3. Wählen Sie die Datei `/hostinger-deploy/db-schema.sql` aus und klicken Sie auf **Ausführen (Go)**.
4. Alle benötigten Tabellen (`bookings`, `contact_messages`, etc.) werden vollautomatisch angelegt.

### Schritt 4: Verbindungsdaten in den PHP-Skripten anpassen
Öffnen Sie die Datei `/hostinger-deploy/booking.php` auf Ihrem Rechner und passen Sie die Zeilen 20–23 an Ihre Hostinger-Werte an:
```php
$db_host = 'localhost';             // In der Regel 'localhost'
$db_name = 'u123456789_emmasco';    // Ihr gesetzter Datenbankname bei Hostinger
$db_user = 'u123456789_admin';      // Ihr gesetzter DB-User
$db_pass = 'IHR_MYSQL_PASSWORT';    // Ihr Passwort
```

### Schritt 5: Dateien per FTP hochladen
Schließen Sie Ihr bevorzugtes FTP-Programm (z.B. FileZilla) an oder nutzen Sie den integrierten **Hostinger File Manager**:

1. Laden Sie den gesamten Inhalt Ihres lokalen `/dist` Ordners direkt in das Verzeichnis `/public_html` auf Ihrem Hostinger-Server hoch.
2. Laden Sie die folgenden Dateien aus dem Ordner `/hostinger-deploy/` ebenfalls direkt in `/public_html` hoch:
   - `booking.php`
   - `contact.php`
   - `.htaccess`
   - `robots.txt`
   - `sitemap.xml`

### Schritt 6: Testen der Formulare
Besuchen Sie Ihre Domain (z.B. `https://emmascoreinigungsteam.de`) und füllen Sie das **Online-Buchungsformular** oder das **Kontaktformular** aus. 
- Die Anfragen werden nun direkt in Ihrer Hostinger MySQL-Datenbank eingetragen.
- Benachrichtigungs-E-Mails werden automatisch über die Hostinger-Mailserver an Sieversand!

---

## 🛠️ CMS EXPANSION & FEHLERSUCHE

- **Fehler 500 (Internal Server Error):** Dies liegt meist an einer unvollständigen `.htaccess` Regel. Sollte Hostinger ein Modul nicht geladen haben, kommentieren Sie dieses testweise aus.
- **E-Mails landen im Spam-Ordner:** Richten Sie im hPanel einen gültigen **DKIM- und SPF-Record** für Ihre Domain ein, um eine exzellente E-Mail-Zustellrate zu gewährleisten.
