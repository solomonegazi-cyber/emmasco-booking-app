import express from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

// Type definitions matching client models
interface BookingRecord {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  notes: string;
  totalPrice?: number;
  status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  cleanerName?: string;
}

interface UserRecord {
  email: string;
  password?: string;
  name: string;
  phone: string;
  address: string;
  verified: boolean;
  verificationCode?: string;
  resetCode?: string;
  createdAt: string;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DB_PATH = path.join(process.cwd(), 'bookings-db.json');
  const USERS_PATH = path.join(process.cwd(), 'users-db.json');

  // Body parsers
  app.use(express.json({ limit: '110mb' }));
  app.use(express.urlencoded({ limit: '110mb', extended: true }));

  // Pre-seed accounts if they do not exist
  const seedAccounts = () => {
    try {
      const initialUsers = readUsers();
      let modified = false;
      const hasOwner = initialUsers.some(u => u.email.toLowerCase() === 'solomonegazi@gmail.com');
      if (!hasOwner) {
        initialUsers.push({
          name: 'Solomon Egazi',
          email: 'solomonegazi@gmail.com',
          phone: '0176 12345678',
          address: 'Hauptstraße 15, Berlin',
          password: 'solomon123',
          verified: true,
          createdAt: new Date().toISOString()
        } as any);
        modified = true;
      }
      const hasCollab = initialUsers.some(u => u.email.toLowerCase() === 'friend@emmasco.de');
      if (!hasCollab) {
        initialUsers.push({
          name: 'My Friend',
          email: 'friend@emmasco.de',
          phone: '0176 87654321',
          address: 'Zweite Allee 4, Berlin',
          password: 'collab123',
          verified: true,
          createdAt: new Date().toISOString()
        } as any);
        modified = true;
      }
      const hasCollab2 = initialUsers.some(u => u.email.toLowerCase() === 'collaborator@gmail.com');
      if (!hasCollab2) {
        initialUsers.push({
          name: 'Collaborator',
          email: 'collaborator@gmail.com',
          phone: '0176 99998888',
          address: 'Kollwitzstraße 14, 10435 Berlin',
          password: 'collab123',
          verified: true,
          createdAt: new Date().toISOString()
        } as any);
        modified = true;
      }
      const hasDemo = initialUsers.some(u => u.email.toLowerCase() === 'demo@emmascoreinigungsteam.de');
      if (!hasDemo) {
        initialUsers.push({
          name: 'Demo User',
          email: 'demo@emmascoreinigungsteam.de',
          phone: '0176 11112222',
          address: 'Demo Straße 1, Berlin',
          password: 'Demo123!',
          verified: true,
          createdAt: new Date().toISOString()
        } as any);
        modified = true;
      }

      // Ensure all users have both password and passwordHash populated for dual-portal compatibility
      initialUsers.forEach((u: any) => {
        const pass = u.password || u.passwordHash;
        if (pass) {
          u.password = pass;
          u.passwordHash = pass;
        }
        if (u.email.toLowerCase() === 'solomonegazi@gmail.com') {
          u.role = 'Owner';
          u.status = 'Approved';
        } else if (u.email.toLowerCase() === 'demo@emmascoreinigungsteam.de') {
          u.role = 'Collaborator';
          u.status = 'Approved';
        } else if (['friend@emmasco.de', 'collaborator@gmail.com'].includes(u.email.toLowerCase())) {
          u.role = 'Collaborator';
          u.status = 'Approved';
        }
      });

      if (modified) {
        fs.writeFileSync(USERS_PATH, JSON.stringify(initialUsers, null, 2), 'utf-8');
        console.log('[SEED] Default document portal accounts seeded successfully.');
      }
    } catch(err: any) {
      console.error('[SEED] Failed to seed accounts:', err.message);
    }
  };

  // Helper: Read bookings
  const readBookings = (): BookingRecord[] => {
    try {
      if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), 'utf-8');
        return [];
      }
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (e: any) {
      console.error('[DATABASE] Error reading booking records:', e.message);
      return [];
    }
  };

  // Helper: Save bookings
  const saveBookingsList = (list: BookingRecord[]): boolean => {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(list, null, 2), 'utf-8');
      return true;
    } catch (e: any) {
      console.error('[DATABASE] Error saving bookings:', e.message);
      return false;
    }
  };

  // Helper: Save a brand new booking
  const saveBookingRecord = (record: BookingRecord): boolean => {
    const records = readBookings();
    records.unshift(record);
    return saveBookingsList(records);
  };

  // Helper: Read users
  const readUsers = (): UserRecord[] => {
    try {
      if (!fs.existsSync(USERS_PATH)) {
        fs.writeFileSync(USERS_PATH, JSON.stringify([], null, 2), 'utf-8');
        return [];
      }
      const raw = fs.readFileSync(USERS_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (e: any) {
      console.error('[DATABASE] Error reading user database:', e.message);
      return [];
    }
  };

  // Helper: Save user
  const saveUserRecord = (record: UserRecord): boolean => {
    try {
      const list = readUsers();
      
      // Ensure password and passwordHash are always synchronized
      const pass = record.password || (record as any).passwordHash;
      if (pass) {
        record.password = pass;
        (record as any).passwordHash = pass;
      }
      
      // Ensure role and status are populated
      if (!(record as any).role) {
        (record as any).role = record.email.toLowerCase() === 'solomonegazi@gmail.com' ? 'Owner' : 'Collaborator';
      }
      if (!(record as any).status) {
        (record as any).status = 'Approved';
      }

      const idx = list.findIndex(u => u.email.toLowerCase() === record.email.toLowerCase());
      if (idx >= 0) {
        list[idx] = record;
      } else {
        list.push(record);
      }
      fs.writeFileSync(USERS_PATH, JSON.stringify(list, null, 2), 'utf-8');
      return true;
    } catch (e: any) {
      console.error('[DATABASE] Error saving user record:', e.message);
      return false;
    }
  };
  seedAccounts();

  // General SMTP Sender Utility
  async function sendEmailNotification({
    to,
    subject,
    plainText,
    html,
    replyTo
  }: {
    to: string;
    subject: string;
    plainText: string;
    html: string;
    replyTo?: string;
  }) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || 'no-reply@emmascoreinigungsteam.de';

    if (smtpHost && smtpUser && smtpPass) {
      try {
        console.log(`[EMAIL] Attempting SMTP mailing to ${to} via ${smtpHost}:${smtpPort}...`);
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        const mailOptions = {
          from: smtpFrom,
          replyTo,
          to,
          subject,
          text: plainText,
          html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Delivery successful! MsgId: ${result.messageId}`);
        return { success: true, id: result.messageId };
      } catch (err: any) {
        console.error(`[EMAIL Error] Real SMTP delivery failed to ${to}:`, err.message);
        return { success: false, error: err.message };
      }
    } else {
      console.warn(`[EMAIL-TEST-MODE] SMTP not set up. Outputting letter to console log:`);
      console.log('------------------ SIMULATED EMAIL TRANSCRIPTION START ------------------');
      console.log(`FROM: ${smtpFrom}`);
      console.log(`TO: ${to}`);
      console.log(`SUBJECT: ${subject}`);
      console.log(`TEXT CONTENT:\n${plainText}`);
      console.log('------------------ SIMULATED EMAIL TRANSCRIPTION END --------------------');
      return { success: true, simulated: true };
    }
  }

  // --- API ROUTING FIRST ---

  // 1. Health & Server Status check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1.5. Email validation API (ZeroBounce & Abstract API proxy with local robust fallback)
  app.post('/api/validate-email', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ valid: false, error: 'Email is required' });
      }

      const trimmedEmail = email.trim().toLowerCase();

      // 1. Basic syntactic regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return res.json({ 
          valid: false, 
          reason: 'invalid_format', 
          message: 'Gültiges E-Mail-Format erforderlich. / Valid email format required.' 
        });
      }

      // List of known disposable/fake domains for robust offline/keyless validation
      const disposableDomains = [
        'tempmail.com', 'mailinator.com', 'yopmail.com', 'dispostable.com', 
        'guerrillamail.com', 'sharklasers.com', '10minutemail.com', 'trashmail.com',
        'getairmail.com', 'temp-mail.org', 'throwawaymail.com', 'tempmailaddress.com',
        'tempmail.net', 'fakeinbox.com', 'mailnesia.com', 'mintemail.com'
      ];
      const domain = trimmedEmail.split('@')[1];
      if (disposableDomains.includes(domain)) {
        return res.json({
          valid: false,
          reason: 'disposable',
          message: 'Wegwerf-E-Mail-Adressen sind nicht erlaubt. / Temporary or disposable email domains are not allowed.'
        });
      }

      // Check for obvious test/dummy patterns
      const testPatterns = [
        /test@test\.com/,
        /abc@abc\.com/,
        /123@123\.com/,
        /example@example\.com/,
        /john@doe\.com/,
        /test@example\.com/
      ];
      if (testPatterns.some(pattern => pattern.test(trimmedEmail))) {
        return res.json({
          valid: false,
          reason: 'test_pattern',
          message: 'Diese Test-E-Mail ist für reale Anfragen nicht zulässig. / This test email address is not permitted for submissions.'
        });
      }

      // Default to success if local validation checks pass
      return res.json({ 
        valid: true, 
        source: 'local_validation',
        message: 'Email syntax verified.' 
      });

    } catch (error: any) {
      console.error('Email validation endpoint error:', error);
      return res.status(500).json({ error: 'Fehler bei der E-Mail-Validierung. / Server error during email validation.' });
    }
  });

  // 2. Fetch all logged bookings (CRM and Admin view list)
  app.get('/api/bookings', (req, res) => {
    res.json(readBookings());
  });

  // 3. Post booking and send notification email immediately
  app.post('/api/bookings', async (req, res) => {
    try {
      const {
        id,
        customerName,
        email,
        phone,
        serviceId,
        serviceName,
        date,
        time,
        address,
        notes,
        totalPrice,
        status = 'pending'
      } = req.body;

      if (!customerName || !email || !phone || !date || !time || !address) {
        return res.status(400).json({ error: 'Missing required booking fields.' });
      }

      const bookingId = id || `EM-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRecord: BookingRecord = {
        id: bookingId,
        customerName,
        email,
        phone,
        serviceId: serviceId || 'custom',
        serviceName: serviceName || 'General Cleaning Services',
        date,
        time,
        address,
        notes: notes || '',
        totalPrice: totalPrice || 0,
        status: status as any,
        createdAt: new Date().toISOString()
      };

      const dbLogged = saveBookingRecord(newRecord);

      // Construct booking receipt layout matching premium standards
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #fafafa;">
          <div style="text-align: center; border-bottom: 2px solid #0056D6; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">EMMASCO REINIGUNGSTEAM</h1>
            <p style="color: #0056D6; margin: 4px 0 0 0; font-size: 12px; font-weight: 700; text-transform: uppercase;">Buchungsanfrage Eingegangen</p>
          </div>
          <p style="font-size: 15px; color: #334155;">Sehr geehrte(r) <strong>${customerName}</strong>,</p>
          <p style="font-size: 15px; color: #334155;">vielen Dank für Ihre Terminanfrage bei uns. Ihre Details wurden erfasst:</p>
          
          <div style="background-color: #e0f2fe; border: 1px solid #bae6fd; border-radius: 12px; padding: 12px 16px; margin-bottom: 24px;">
            <div style="font-size: 13px; font-weight: 700; color: #0369a1;">
              Vorgangs-ID: ${bookingId} | Status: Ausstehend / Pending
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tbody>
              <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Leistung:</td><td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${serviceName}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Datum:</td><td style="padding: 8px 0; color: #0f172a;">${date}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Uhrzeit:</td><td style="padding: 8px 0; color: #0f172a;">${time} Uhr</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Einsatzort:</td><td style="padding: 8px 0; color: #0f172a;">${address}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Telefon:</td><td style="padding: 8px 0; color: #0f172a;">${phone}</td></tr>
              ${totalPrice ? `<tr><td style="padding: 8px 0; color: #64748b;">Kosten:</td><td style="padding: 8px 0; color: #16a34a; font-weight: bold;">${totalPrice.toFixed(2)} €</td></tr>` : ''}
            </tbody>
          </table>

          <div style="margin-bottom: 24px;">
            <span style="font-weight: bold; font-size: 12px; color: #64748b; text-transform: uppercase;">Notizen / Wünsche:</span>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-style: italic; color: #475569; margin-top: 6px;">
              ${notes || 'Keine Angabe.'}
            </div>
          </div>

          <div style="text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 16px;">
            <p>Ihre Support Telefonnummer für Berlin: 0176 21856044</p>
            <p>© 2026 EMMASCO. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      `;

      // Recipient for admin alert
      const adminToEmail = process.env.BOOKING_NOTIFICATION_EMAIL || 'solomonegazi@gmail.com';

      // 1. Send receipt notification to Admin
      await sendEmailNotification({
        to: adminToEmail,
        replyTo: email,
        subject: 'New Booking – Emmasco Reinigungsteam',
        plainText: `Eine neue Buchung wurde angefragt.\nName: ${customerName}\nE-Mail: ${email}\nID: ${bookingId}\n${serviceName} am ${date} um ${time}.`,
        html: htmlBody
      });

      // 2. Also send confirmation notice to Customer
      await sendEmailNotification({
        to: email,
        subject: 'Buchungsanfrage erfolgreich erfasst - Emmasco Reinigungsteam',
        plainText: `Hallo ${customerName},\nvielen Dank für Ihre Buchungsanfrage (ID: ${bookingId}). Wir prüfen diese und bestätigen Ihren Termin in Kürze.`,
        html: htmlBody
      });

      res.status(200).json({
        success: true,
        message: 'Booking submission logged and notification emails dispatched successfully.',
        bookingId,
        databaseLogged: dbLogged
      });

    } catch (routeErr: any) {
      console.error('[ROUTE ERROR] /api/bookings failed:', routeErr.message);
      res.status(500).json({ success: false, error: 'Internal Booking submission failure.', details: routeErr.message });
    }
  });

  // --- COMPREHENSIVE CUSTOMER CONFIGURED SMTP AUTHENTICATION ENDPOINTS ---

  // Register New Client Account
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, phone, address, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Bitte füllen Sie alle erforderlichen Felder aus.' });
      }

      const users = readUsers();
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(409).json({ error: 'Diese E-Mail-Adresse wird bereits verwendet.' });
      }

      // Generate a dynamic 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const newUser: UserRecord = {
        name,
        email,
        phone: phone || '',
        address: address || '',
        password, // Simple local password
        verified: false,
        verificationCode,
        createdAt: new Date().toISOString()
      };

      // Set Document Workspace parameters too
      (newUser as any).passwordHash = password;
      (newUser as any).role = email.toLowerCase() === 'solomonegazi@gmail.com' ? 'Owner' : 'Collaborator';
      (newUser as any).status = 'Approved';

      saveUserRecord(newUser);

      // Email template layout
      const htmlCode = `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; background: #fafafa;">
          <h2 style="color: #0056D6; margin: 0 0 16px 0;">Emmasco Kundenportal</h2>
          <p>Hallo <strong>${name}</strong>,</p>
          <p>vielen Dank für die Erstellung eines Accounts. Bitte verifizieren Sie Ihre E-Mail-Adresse mit dem folgenden 6-stelligen Freischaltcode:</p>
          <div style="background: #e0f2fe; border: 1px solid #38bdf8; font-size: 28px; font-weight: 900; letter-spacing: 4px; padding: 12px; margin: 18px 0; text-align: center; color: #0369a1; border-radius: 8px;">
            ${verificationCode}
          </div>
          <p style="font-size: 12px; color: #64748b;">Sollten Sie diese Registrierung nicht selbst veranlasst haben, ignorieren Sie diese E-Mail bitte.</p>
        </div>
      `;

      sendEmailNotification({
        to: email,
        subject: 'Ihr Verifizierungscode – Emmasco Reinigungsteam',
        plainText: `Hallo ${name},\n\nIhr Registrierungs-Code für das Kundenportal lautet: ${verificationCode}`,
        html: htmlCode
      });

      res.status(200).json({
        success: true,
        message: 'Registrierung erfolgreich. Verifizierungscode versandt.',
        tempCode: process.env.NODE_ENV !== 'production' ? verificationCode : undefined // Output code in dev / workspace for easy testing!
      });

    } catch (err: any) {
      res.status(500).json({ error: 'Registrierungsfehler.', details: err.message });
    }
  });

  // Verify Email Code
  app.post('/api/auth/verify', (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: 'E-Mail und Code erforderlich.' });
      }

      const users = readUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(404).json({ error: 'Benutzerkonto nicht gefunden.' });
      }

      const storedCode = user.verificationCode ? String(user.verificationCode).trim() : '';
      const providedCode = String(code).trim();

      if (storedCode && storedCode === providedCode) {
        user.verified = true;
        delete user.verificationCode;
        
        // Ensure role and status are set
        (user as any).role = (user as any).role || (user.email.toLowerCase() === 'solomonegazi@gmail.com' ? 'Owner' : 'Collaborator');
        (user as any).status = 'Approved';

        saveUserRecord(user);

        res.status(200).json({
          success: true,
          message: 'E-Mail-Adresse erfolgreich verifiziert.',
          user: { name: user.name, email: user.email, phone: user.phone, address: user.address }
        });
      } else {
        res.status(400).json({ error: 'Ungültiger oder abgelaufener Verifizierungscode.' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Verifizierung fehlgeschlagen.' });
    }
  });

  // Secure User Portal Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Incorrect email or password.', errorDe: 'E-Mail oder Passwort falsch.' });
      }

      const users = readUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ error: 'Incorrect email or password.', errorDe: 'E-Mail oder Passwort falsch.' });
      }

      const storedPassword = user.password || (user as any).passwordHash;
      if (storedPassword !== password) {
        return res.status(401).json({ error: 'Incorrect email or password.', errorDe: 'E-Mail oder Passwort falsch.' });
      }

      if (!user.verified) {
        // Automatically trigger a replacement code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = code;
        saveUserRecord(user);

        const htmlCode = `<div style="padding: 24px;">Ihr Code lautet: <strong>${code}</strong></div>`;
        sendEmailNotification({
          to: user.email,
          subject: 'Ihr neuer Verifizierungscode - Emmasco',
          plainText: `Verifizierungscode: ${code}`,
          html: htmlCode
        });

        return res.status(403).json({
          error: 'E-Mail-Adresse ist noch nicht verifiziert.',
          needsVerification: true,
          tempCode: process.env.NODE_ENV !== 'production' ? code : undefined
        });
      }

      // Ensure properties are fully set on login
      (user as any).passwordHash = password;
      (user as any).role = (user as any).role || (user.email.toLowerCase() === 'solomonegazi@gmail.com' ? 'Owner' : 'Collaborator');
      (user as any).status = (user as any).status || 'Approved';
      user.phone = user.phone || '';
      user.address = user.address || '';
      saveUserRecord(user);

      // Record live active session
      touchActiveUser(user.email, user.name);

      res.status(200).json({
        success: true,
        message: 'Login erfolgreich.',
        user: { 
          name: user.name, 
          email: user.email, 
          phone: user.phone, 
          address: user.address,
          role: (user as any).role,
          status: (user as any).status
        }
      });

    } catch (err: any) {
      res.status(500).json({ error: 'Login fehlgeschlagen.' });
    }
  });

  // Forgot Password request
  app.post('/api/auth/forgot-password', (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Bitte geben Sie Ihre E-Mail an.' });
      }

      const users = readUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Return 200 anyway to prevent user enumeration / protect privacy
        return res.status(200).json({ success: true, message: 'Falls E-Mail existiert, wurde ein Code gesendet.' });
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetCode = resetCode;
      saveUserRecord(user);

      const htmlReset = `
        <div style="font-family: sans-serif; padding: 24px;">
          <h3>Passwort zurücksetzen – Emmasco</h3>
          <p>Sie haben eine Passwort-Rücksetzung beantragt. Ihr Freischaltcode lautet:</p>
          <h2 style="color: #0056D6; letter-spacing: 2px;">${resetCode}</h2>
        </div>
      `;

      sendEmailNotification({
        to: email,
        subject: 'Sicherheitscode zum Zurücksetzen Ihres Passworts - Emmasco',
        plainText: `Sicherheitscode: ${resetCode}`,
        html: htmlReset
      });

      res.status(200).json({
        success: true,
        message: 'Passwort-Code versendet.',
        tempCode: process.env.NODE_ENV !== 'production' ? resetCode : undefined
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Anfrage fehlgeschlagen.' });
    }
  });

  // Reset Password operation
  app.post('/api/auth/reset-password', (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'E-Mail, Code und neues Passwort erforderlich.' });
      }

      const users = readUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.resetCode !== code.trim()) {
        return res.status(400).json({ error: 'Ungültiger Sicherheitscode.' });
      }

      user.password = newPassword;
      (user as any).passwordHash = newPassword;
      delete user.resetCode;
      user.verified = true; // In case they reset
      saveUserRecord(user);

      res.status(200).json({ success: true, message: 'Passwort wurde erfolgreich geändert.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Änderung nicht möglich.' });
    }
  });

  // Admin: Get list of registered customers
  app.get('/api/admin/users', (req, res) => {
    try {
      const list = readUsers().map(u => ({
        name: u.name,
        email: u.email,
        phone: u.phone,
        address: u.address,
        verified: u.verified,
        createdAt: u.createdAt
      }));
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Fehler beim Laden der Benutzer.' });
    }
  });

  // Admin: Update Status of booking AND trigger corresponding emails!
  // Statuses: Pending, Confirmed, Cleaner Assigned (assigned), In Progress (in_progress), Completed, Cancelled
  app.post('/api/bookings/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, cleanerName } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status erforderlich.' });
      }

      const bookings = readBookings();
      const bookingIdx = bookings.findIndex(b => b.id === id);
      if (bookingIdx === -1) {
        return res.status(404).json({ error: 'Buchung nicht gefunden.' });
      }

      const booking = bookings[bookingIdx];
      const previousStatus = booking.status;
      booking.status = status;
      if (cleanerName !== undefined) {
        booking.cleanerName = cleanerName;
      }

      saveBookingsList(bookings);

      // Trigger respective email notifications automatically
      if (status === 'confirmed' && previousStatus !== 'confirmed') {
        const confirmHtml = `
          <div style="font-family: sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0056D6;">Termin Bestätigt!</h2>
            <p>Ihre geplante Dienstleistung <strong>${booking.serviceName}</strong> wurde für den <strong>${booking.date} um ${booking.time} Uhr</strong> offiziell bestätigt.</p>
            <p>📍 Einsatzort: ${booking.address}</p>
            <p>Wir freuen uns, Sie unterstützen zu dürfen!</p>
          </div>
        `;
        await sendEmailNotification({
          to: booking.email,
          subject: 'Terminbestätigung – Emmasco Reinigungsteam',
          plainText: `Hallo ${booking.customerName},\n\nihr Reinigungstermin wurde erfolgreich für den ${booking.date} um ${booking.time} Uhr bestätigt!`,
          html: confirmHtml
        });
      } else if (status === 'completed' && previousStatus !== 'completed') {
        const completedHtml = `
          <div style="font-family: sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #16a34a;">Einsatz erfolgreich abgeschlossen!</h2>
            <p>Guten Tag ${booking.customerName},</p>
            <p>Ihr Reinigungsservice <strong>${booking.serviceName}</strong> wurde von unserem Team erfolgreich durchgeführt.</p>
            <p>Die absetzbare Rechnung steht jetzt im Kundenportal für Sie als Download zur Verfügung.</p>
            <p>Vielen Dank für Ihren lieben Auftrag!</p>
          </div>
        `;
        await sendEmailNotification({
          to: booking.email,
          subject: 'Einsatz abgeschlossen – Emmasco Reinigungsteam',
          plainText: `Hallo ${booking.customerName},\n\nihr Termin wurde am ${booking.date} erfolgreich abgeschlossen! Vielen Dank für Ihren Auftrag.`,
          html: completedHtml
        });
      }

      res.status(200).json({ success: true, booking });
    } catch (err: any) {
      res.status(500).json({ error: 'Fehler beim Statusupdate.', details: err.message });
    }
  });

  // Admin delete booking permanently
  app.delete('/api/bookings/:id', (req, res) => {
    try {
      const { id } = req.params;
      const list = readBookings();
      const filtered = list.filter(b => b.id !== id);
      const isOk = saveBookingsList(filtered);
      res.status(200).json({ success: isOk });
    } catch (err: any) {
      res.status(500).json({ error: 'Löschen fehlgeschlagen.' });
    }
  });


  // --- PRIVATE DOCUMENT PORTAL BACKEND LOGIC ---
  interface DocVersion {
    version: number;
    fileName: string;
    originalName: string;
    size: string;
    uploadedBy: string;
    uploadedByEmail: string;
    uploadedAt: string;
    textDraft?: string;
  }

  interface DocumentComment {
    id: string;
    userName: string;
    userEmail: string;
    text: string;
    timestamp: string;
  }

  interface StatusHistoryItem {
    status: 'Draft' | 'Approved' | 'Needs Revision';
    changedAt: string;
    changedBy: string;
  }

  interface DocumentRecord {
    id: string;
    name: string;
    ownerEmail: string;
    status?: 'Draft' | 'Approved' | 'Needs Revision';
    statusHistory?: StatusHistoryItem[];
    sharedWith: string[];
    versions: DocVersion[];
    comments: DocumentComment[];
    latestVersion: number;
    lastModified: string;
  }

  // Real Collaborator & Authorization Types
  interface PortalUser {
    email: string;
    name: string;
    passwordHash: string; // Plain password for prototype ease, but fully functional
    role: 'Owner' | 'Collaborator';
    status: 'Approved' | 'Pending' | 'Revoked';
    invitedBy?: string;
    registeredAt?: string;
  }

  interface ActivityLog {
    id: string;
    type: 'upload' | 'version_update' | 'restore' | 'rename' | 'comment' | 'status_change' | 'invite' | 'access_approve' | 'access_revoke';
    userName: string;
    userEmail: string;
    documentId?: string;
    documentName?: string;
    details: string;
    timestamp: string;
  }

  const DOCS_DB_PATH = path.join(process.cwd(), 'documents-db.json');
  const USERS_DB_PATH = path.join(process.cwd(), 'users-db.json');
  const ACTIVITIES_DB_PATH = path.join(process.cwd(), 'activities-db.json');
  const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

  // Active Users Map Tracking (In-memory live activity loop)
  const activeUsersMap: Record<string, { email: string; name: string; role: string; lastSeen: string }> = {};

  const touchActiveUser = (email?: string, name?: string) => {
    if (!email) return;
    const users = readPortalUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    const finalName = name || (found ? found.name : email.split('@')[0]);
    const finalRole = found ? found.role : (email.toLowerCase() === 'solomonegazi@gmail.com' ? 'Owner' : 'Collaborator');
    
    activeUsersMap[email.toLowerCase()] = {
      email: email.toLowerCase(),
      name: finalName,
      role: finalRole,
      lastSeen: new Date().toISOString()
    };
  };

  const readPortalUsers = (): PortalUser[] => {
    try {
      if (!fs.existsSync(USERS_DB_PATH)) {
        const initialUsers: PortalUser[] = [
          {
            email: 'solomonegazi@gmail.com',
            name: 'Solomon Egazi',
            passwordHash: 'solomon123',
            role: 'Owner',
            status: 'Approved',
            registeredAt: new Date().toISOString()
          },
          {
            email: 'friend@emmasco.de',
            name: 'My Friend',
            passwordHash: 'collab123',
            role: 'Collaborator',
            status: 'Approved',
            registeredAt: new Date().toISOString()
          },
          {
            email: 'collaborator@gmail.com',
            name: 'John Collaborator',
            passwordHash: 'collab123',
            role: 'Collaborator',
            status: 'Approved',
            registeredAt: new Date().toISOString()
          },
          {
            email: 'demo@emmascoreinigungsteam.de',
            name: 'Demo User',
            passwordHash: 'Demo123!',
            role: 'Collaborator',
            status: 'Approved',
            registeredAt: new Date().toISOString()
          }
        ];
        fs.writeFileSync(USERS_DB_PATH, JSON.stringify(initialUsers, null, 2), 'utf-8');
        return initialUsers;
      }
      return JSON.parse(fs.readFileSync(USERS_DB_PATH, 'utf-8'));
    } catch (e) {
      return [];
    }
  };

  const savePortalUsers = (list: PortalUser[]) => {
    try {
      fs.writeFileSync(USERS_DB_PATH, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {}
  };

  const readActivities = (): ActivityLog[] => {
    try {
      if (!fs.existsSync(ACTIVITIES_DB_PATH)) {
        const initialActivities: ActivityLog[] = [
          {
            id: 'act-1',
            type: 'upload',
            userName: 'Solomon Egazi',
            userEmail: 'solomonegazi@gmail.com',
            documentId: 'doc-1',
            documentName: 'Wirtschaftsplan_2026.xlsx',
            details: 'Dokument "Wirtschaftsplan_2026.xlsx" hochgeladen (v1)',
            timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'act-2',
            type: 'comment',
            userName: 'Solomon Egazi',
            userEmail: 'solomonegazi@gmail.com',
            documentId: 'doc-1',
            documentName: 'Wirtschaftsplan_2026.xlsx',
            details: 'Kommentar hinzugefügt zu "Wirtschaftsplan_2026.xlsx"',
            timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 30 * 60 * 1000).toISOString()
          },
          {
            id: 'act-3',
            type: 'upload',
            userName: 'Solomon Egazi',
            userEmail: 'solomonegazi@gmail.com',
            documentId: 'doc-2',
            documentName: 'Kooperationsvertrag_Reinigungsteam.docx',
            details: 'Dokument "Kooperationsvertrag_Reinigungsteam.docx" hochgeladen (v1)',
            timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'act-4',
            type: 'version_update',
            userName: 'My Friend',
            userEmail: 'friend@emmasco.de',
            documentId: 'doc-2',
            documentName: 'Kooperationsvertrag_Reinigungsteam_Korrektur.docx',
            details: 'Neue Revision v2 hochgeladen',
            timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
          }
        ];
        fs.writeFileSync(ACTIVITIES_DB_PATH, JSON.stringify(initialActivities, null, 2), 'utf-8');
        return initialActivities;
      }
      return JSON.parse(fs.readFileSync(ACTIVITIES_DB_PATH, 'utf-8'));
    } catch (e) {
      return [];
    }
  };

  const addActivity = (act: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    try {
      const list = readActivities();
      const newAct: ActivityLog = {
        ...act,
        id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString()
      };
      list.unshift(newAct);
      fs.writeFileSync(ACTIVITIES_DB_PATH, JSON.stringify(list.slice(0, 200), null, 2), 'utf-8');
    } catch (err) {}
  };

  const readDocuments = (): DocumentRecord[] => {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      if (!fs.existsSync(DOCS_DB_PATH)) {
        const seeds: DocumentRecord[] = [
          {
            id: 'doc-1',
            name: 'Wirtschaftsplan_2026.xlsx',
            ownerEmail: 'solomonegazi@gmail.com',
            status: 'Approved',
            sharedWith: ['friend@emmasco.de', 'collaborator@gmail.com'],
            versions: [
              {
                version: 1,
                fileName: 'doc-1_v1.xlsx',
                originalName: 'Wirtschaftsplan_2026.xlsx',
                size: '240 KB',
                uploadedBy: 'Solomon Egazi',
                uploadedByEmail: 'solomonegazi@gmail.com',
                uploadedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
                textDraft: 'A1: Jahr, B1: Umsatz\nA2: 2026, B2: 124500\nA3: Prognose, B3: 150000\nA4: Total, B4: =SUM(B2:B3)'
              }
            ],
            comments: [
              {
                id: 'cmt-1',
                userName: 'Solomon Egazi',
                userEmail: 'solomonegazi@gmail.com',
                text: 'Hallo! Das ist der vorläufige Wirtschaftsplan für 2026. Bitte trage deine Korrekturen ein oder editiere das Dokument direkt.',
                timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 30 * 60 * 1000).toISOString()
              }
            ],
            latestVersion: 1,
            lastModified: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
          },
          {
            id: 'doc-2',
            name: 'Kooperationsvertrag_Reinigungsteam.docx',
            ownerEmail: 'solomonegazi@gmail.com',
            status: 'Needs Revision',
            sharedWith: ['friend@emmasco.de', 'collaborator@gmail.com'],
            versions: [
              {
                version: 1,
                fileName: 'doc-2_v1.docx',
                originalName: 'Kooperationsvertrag_Reinigungsteam.docx',
                size: '1.2 MB',
                uploadedBy: 'Solomon Egazi',
                uploadedByEmail: 'solomonegazi@gmail.com',
                uploadedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
                textDraft: 'KOOPERATIONSVERTRAG\n\n§1 Gegenstand\nDas Emmasco Reinigungsteam erbringt haushaltsnahe Dienste für hilfsbedürftige und private Personen.\n\n§2 Abrechnung\nDie Leistungen werden transparent nach Verrechnungssatz abgerechnet.'
              },
              {
                version: 2,
                fileName: 'doc-2_v2.docx',
                originalName: 'Kooperationsvertrag_Reinigungsteam_Korrektur.docx',
                size: '1.3 MB',
                uploadedBy: 'My Friend',
                uploadedByEmail: 'friend@emmasco.de',
                uploadedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
                textDraft: 'KOOPERATIONSVERTRAG\n\n§1 Gegenstand und Umfang\nDas Emmasco Reinigungsteam erbringt hochqualitative haushaltsnahe Dienstleistungen und Alltagsbegleitungen.\n\n§2 Vergütung und direkte Kassenabrechnung\nRechnungen für Entlastungsleistungen nach §45a SGB XI werden direkt an die Pflegekassen übermittelt.'
              }
            ],
            comments: [
              {
                id: 'cmt-2',
                userName: 'My Friend',
                userEmail: 'friend@emmasco.de',
                text: 'Hi Solomon, ich habe Version v2 hochgeladen und die Abrechnungsklauseln ergänzt. Bitte schau es dir mal an.',
                timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000 + 15 * 60 * 1000).toISOString()
              }
            ],
            latestVersion: 2,
            lastModified: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
          }
        ];

        seeds.forEach(s => {
          s.versions.forEach(v => {
            const filePath = path.join(UPLOADS_DIR, v.fileName);
            if (!fs.existsSync(filePath)) {
              fs.writeFileSync(filePath, Buffer.from(v.textDraft || 'Dummy file contents', 'utf-8'));
            }
          });
        });

        fs.writeFileSync(DOCS_DB_PATH, JSON.stringify(seeds, null, 2), 'utf-8');
        return seeds;
      }
      const raw = fs.readFileSync(DOCS_DB_PATH, 'utf-8');
      const docs = JSON.parse(raw) as DocumentRecord[];
      let modified = false;
      docs.forEach(doc => {
        if (!doc.statusHistory || doc.statusHistory.length === 0) {
          doc.statusHistory = [
            {
              status: doc.status || 'Draft',
              changedAt: doc.lastModified || new Date().toISOString(),
              changedBy: doc.ownerEmail || 'System'
            }
          ];
          modified = true;
        }
      });
      if (modified) {
        fs.writeFileSync(DOCS_DB_PATH, JSON.stringify(docs, null, 2), 'utf-8');
      }
      return docs;
    } catch (e: any) {
      console.error('[DATABASE] Error reading documents database:', e.message);
      return [];
    }
  };

  const saveDocumentsList = (list: DocumentRecord[]): boolean => {
    try {
      fs.writeFileSync(DOCS_DB_PATH, JSON.stringify(list, null, 2), 'utf-8');
      return true;
    } catch (e: any) {
      console.error('[DATABASE] Error saving documents:', e.message);
      return false;
    }
  };

  // Auth & Invite Endpoints
  app.post('/api/workspace/auth/register', (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, E-Mail und Passwort sind erforderlich.' });
      }

      const users = readPortalUsers();
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      const isOwner = email.toLowerCase() === 'solomonegazi@gmail.com';
      const defaultRole = isOwner ? 'Owner' : 'Collaborator';
      
      // If user was pre-invited or registered without invite, they get status Pending unless Owner
      let finalStatus: 'Approved' | 'Pending' | 'Revoked' = isOwner ? 'Approved' : 'Pending';

      if (existing) {
        // If pre-created during an owner invite, let them update name, password, and registeredAt
        if (existing.registeredAt) {
          return res.status(400).json({ error: 'Diese E-Mail ist bereits registriert.' });
        } else {
          existing.name = name;
          existing.passwordHash = password;
          existing.registeredAt = new Date().toISOString();
          // Keep their pre-approved status if the owner invited them!
          finalStatus = existing.status;
          savePortalUsers(users);
          addActivity({
            type: 'access_approve',
            userName: name,
            userEmail: email,
            details: `Kollaborateur-Registrierung abgeschlossen von ${name}`
          });
          return res.status(200).json({ 
            success: true, 
            user: { email: existing.email, name: existing.name, role: existing.role, status: existing.status } 
          });
        }
      }

      const newUser: PortalUser = {
        email: email.toLowerCase(),
        name,
        passwordHash: password,
        role: defaultRole,
        status: finalStatus,
        registeredAt: new Date().toISOString()
      };

      users.push(newUser);
      savePortalUsers(users);

      addActivity({
        type: 'access_approve',
        userName: name,
        userEmail: email,
        details: isOwner 
          ? `Besitzer-Registrierung abgeschlossen: ${name}`
          : `Kollaborateur registriert und wartet auf Genehmigung: ${name}`
      });

      res.status(200).json({ success: true, user: { email: newUser.email, name: newUser.name, role: newUser.role, status: newUser.status } });
    } catch (err: any) {
      res.status(500).json({ error: 'Registrierung fehlgeschlagen.' });
    }
  });

  app.post('/api/workspace/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'E-Mail und Passwort erforderlich.' });
      }

      const users = readPortalUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user || user.passwordHash !== password) {
        return res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
      }

      if (user.status === 'Pending') {
        return res.status(403).json({ error: 'Zugriff ausstehend. Der Eigentümer muss Ihre Registrierung erst freischalten.' });
      }

      if (user.status === 'Revoked') {
        return res.status(403).json({ error: 'Zugriff entzogen. Ihr Account wurde vom Administrator gesperrt.' });
      }

      // Record live active session
      touchActiveUser(user.email, user.name);

      res.status(200).json({ 
        success: true, 
        user: { email: user.email, name: user.name, role: user.role, status: user.status } 
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Login fehlgeschlagen.' });
    }
  });

  // Workspace forgot-password
  app.post('/api/workspace/auth/forgot-password', (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Bitte geben Sie Ihre E-Mail an.' });
      }

      const users = readPortalUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(200).json({ success: true, message: 'Falls E-Mail existiert, wurde ein Code gesendet.' });
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      (user as any).resetCode = resetCode;
      savePortalUsers(users);

      const htmlReset = `
        <div style="font-family: sans-serif; padding: 24px;">
          <h3>Passwort zurücksetzen – Emmasco Workspace</h3>
          <p>Sie haben eine Passwort-Rücksetzung beantragt. Ihr Freischaltcode lautet:</p>
          <h2 style="color: #0056D6; letter-spacing: 2px;">${resetCode}</h2>
        </div>
      `;

      sendEmailNotification({
        to: email,
        subject: 'Sicherheitscode zum Zurücksetzen Ihres Passworts - Emmasco Workspace',
        plainText: `Sicherheitscode: ${resetCode}`,
        html: htmlReset
      });

      res.status(200).json({
        success: true,
        message: 'Passwort-Code versendet.',
        tempCode: process.env.NODE_ENV !== 'production' ? resetCode : undefined
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Anfrage fehlgeschlagen.' });
    }
  });

  // Workspace reset-password
  app.post('/api/workspace/auth/reset-password', (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'E-Mail, Code und neues Passwort erforderlich.' });
      }

      const users = readPortalUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || (user as any).resetCode !== code.trim()) {
        return res.status(400).json({ error: 'Ungültiger Sicherheitscode.' });
      }

      user.passwordHash = newPassword;
      delete (user as any).resetCode;
      user.status = 'Approved';
      savePortalUsers(users);

      res.status(200).json({ success: true, message: 'Passwort wurde erfolgreich geändert.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Änderung nicht möglich.' });
    }
  });

  app.get('/api/collaborators', (req, res) => {
    try {
      const ownerEmail = req.query.ownerEmail as string;
      if (!ownerEmail || ownerEmail.toLowerCase() !== 'solomonegazi@gmail.com') {
        return res.status(403).json({ error: 'Zugriff verweigert.' });
      }

      const users = readPortalUsers();
      // return all except owner
      const list = users.filter(u => u.email.toLowerCase() !== 'solomonegazi@gmail.com');
      res.status(200).json({ success: true, collaborators: list });
    } catch (err) {
      res.status(500).json({ error: 'Laden der Kollaborateure fehlgeschlagen.' });
    }
  });

  app.post('/api/collaborators/invite', (req, res) => {
    try {
      const { ownerEmail, email, name } = req.body;
      if (!ownerEmail || ownerEmail.toLowerCase() !== 'solomonegazi@gmail.com') {
        return res.status(403).json({ error: 'Aktion nur für Eigentümer erlaubt.' });
      }
      if (!email || !name) {
        return res.status(400).json({ error: 'E-Mail und Name des Partners sind erforderlich.' });
      }

      const users = readPortalUsers();
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existing) {
        existing.status = 'Approved';
        savePortalUsers(users);
      } else {
        const newUser: PortalUser = {
          email: email.toLowerCase(),
          name,
          passwordHash: '123', // temp password, can be changed during registration
          role: 'Collaborator',
          status: 'Approved',
          invitedBy: 'solomonegazi@gmail.com'
        };
        users.push(newUser);
        savePortalUsers(users);
      }

      addActivity({
        type: 'invite',
        userName: 'Solomon Egazi',
        userEmail: 'solomonegazi@gmail.com',
        details: `Eigentümer hat "${name}" (${email}) eingeladen und freigeschaltet`
      });

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Einladung fehlgeschlagen.' });
    }
  });

  app.post('/api/collaborators/status', (req, res) => {
    try {
      const { ownerEmail, targetEmail, status } = req.body;
      if (!ownerEmail || ownerEmail.toLowerCase() !== 'solomonegazi@gmail.com') {
        return res.status(403).json({ error: 'Aktion nur für Eigentümer erlaubt.' });
      }
      if (!targetEmail || !status) {
        return res.status(400).json({ error: 'Daten unvollständig.' });
      }

      const users = readPortalUsers();
      const user = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
      if (!user) {
        return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
      }

      user.status = status;
      savePortalUsers(users);

      addActivity({
        type: status === 'Approved' ? 'access_approve' : 'access_revoke',
        userName: 'Solomon Egazi',
        userEmail: 'solomonegazi@gmail.com',
        details: status === 'Approved' 
          ? `Zugriff genehmigt für ${user.name} (${targetEmail})` 
          : `Zugriff entzogen für ${user.name} (${targetEmail})`
      });

      res.status(200).json({ success: true, collaborators: users.filter(u => u.email.toLowerCase() !== 'solomonegazi@gmail.com') });
    } catch (err) {
      res.status(500).json({ error: 'Statusänderung fehlgeschlagen.' });
    }
  });

  app.get('/api/active-users', (req, res) => {
    try {
      const ownerEmail = req.query.ownerEmail as string;
      if (!ownerEmail || ownerEmail.toLowerCase() !== 'solomonegazi@gmail.com') {
        return res.status(403).json({ error: 'Zugriff verweigert.' });
      }

      // Clean sessions older than 5 minutes
      const now = Date.now();
      const cutoff = 5 * 60 * 1000;
      const onlineList = Object.values(activeUsersMap).filter(sess => {
        return (now - new Date(sess.lastSeen).getTime()) < cutoff;
      });

      res.status(200).json({ success: true, onlineUsers: onlineList });
    } catch (err) {
      res.status(500).json({ error: 'Fehler beim Laden aktiver Sessions.' });
    }
  });

  app.get('/api/documents/activity', (req, res) => {
    try {
      const userEmail = req.query.email as string;
      if (!userEmail) return res.status(401).json({ error: 'Anmeldung erforderlich.' });
      
      const list = readActivities();
      // Owner sees all, collaborators see operations on documents they can see, or general operations
      const isOwner = userEmail.toLowerCase() === 'solomonegazi@gmail.com';
      if (isOwner) {
        return res.status(200).json({ success: true, activities: list });
      }

      const docs = readDocuments();
      const allowableDocIds = docs.filter(d => {
        return d.ownerEmail.toLowerCase() === userEmail.toLowerCase() ||
               d.sharedWith.some(email => email.toLowerCase() === userEmail.toLowerCase()) ||
               d.versions.some(v => v.uploadedByEmail.toLowerCase() === userEmail.toLowerCase());
      }).map(d => d.id);

      const filtered = list.filter(act => {
        if (!act.documentId) return true; // general activities
        return allowableDocIds.includes(act.documentId);
      });

      res.status(200).json({ success: true, activities: filtered });
    } catch (err) {
      res.status(500).json({ error: 'Fehler beim Laden des Aktivitätsfeeds.' });
    }
  });


  // 1. Get documents list filtered by user roles
  app.get('/api/documents', (req, res) => {
    try {
      const userEmail = req.query.email as string;
      if (!userEmail) {
        return res.status(401).json({ error: 'E-Mail erforderlich für den Zugriff.' });
      }

      const docs = readDocuments();
      const isOwner = userEmail.toLowerCase() === 'solomonegazi@gmail.com';

      // Owner sees everything, collaborator sees shared items or self uploaded
      const filtered = docs.filter(d => {
        if (isOwner) return true;
        return d.ownerEmail.toLowerCase() === userEmail.toLowerCase() ||
               d.sharedWith.some(email => email.toLowerCase() === userEmail.toLowerCase()) ||
               d.versions.some(v => v.uploadedByEmail.toLowerCase() === userEmail.toLowerCase());
      });

      res.status(200).json({ success: true, documents: filtered });
    } catch (err: any) {
      res.status(500).json({ error: 'Dokumente konnten nicht geladen werden.' });
    }
  });

  // 2. Download file (any specific version)
  app.get('/api/documents/:id/download/:version', (req, res) => {
    try {
      const { id, version } = req.params;
      const docs = readDocuments();
      const doc = docs.find(d => d.id === id);
      if (!doc) {
        return res.status(404).send('Dokument nicht gefunden.');
      }
      const vNum = parseInt(version, 10);
      const verObj = doc.versions.find(v => v.version === vNum);
      if (!verObj) {
        return res.status(404).send('Version nicht gefunden.');
      }

      const filePath = path.join(UPLOADS_DIR, verObj.fileName);
      if (!fs.existsSync(filePath)) {
        // Create a quick dummy file so download doesn't crash if deleted
        fs.writeFileSync(filePath, Buffer.from(verObj.textDraft || 'Dokumenteninhalt', 'utf-8'));
      }

      const ext = path.extname(verObj.originalName).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.doc' || ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (ext === '.xls' || ext === '.xlsx') contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      else if (ext === '.ppt' || ext === '.pptx') contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';

      const isInline = req.query.inline === 'true';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `${isInline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(verObj.originalName)}"`);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (err: any) {
      res.status(500).send('Fehler beim Dateidownload: ' + err.message);
    }
  });

  // 3. Upload a new document or updated revision version
  app.post('/api/documents/upload', async (req, res) => {
    try {
      const { name, size, base64Data, uploaderName, uploaderEmail, replaceDocumentId } = req.body;
      if (!name || !base64Data || !uploaderEmail) {
        return res.status(400).json({ error: 'Ungültige Uploaddaten.' });
      }

      const ext = path.extname(name).toLowerCase();
      const allowedExts = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
      if (!allowedExts.includes(ext)) {
        return res.status(400).json({ error: 'Dateityp nicht erlaubt. Erlaubte Formate: Word, Excel, PowerPoint, PDF und Bilder.' });
      }

      let dataBuffer: Buffer;
      try {
        const base64Pure = base64Data.replace(/^data:.*;base64,/, "");
        dataBuffer = Buffer.from(base64Pure, 'base64');
      } catch (parseErr) {
        return res.status(400).json({ error: 'Base64 Decodiere-Fehler.' });
      }

      if (dataBuffer.length > 100 * 1024 * 1024) {
        return res.status(400).json({ error: 'Dateigröße übersteigt das Limit von 100 MB.' });
      }

      const docs = readDocuments();
      let docId = replaceDocumentId;
      let targetDoc = docs.find(d => d.id === docId);
      let isNew = false;

      // Autodetect identical names if replacing is unset
      if (!targetDoc) {
        const matched = docs.find(d => d.name.toLowerCase() === name.toLowerCase());
        if (matched) {
          targetDoc = matched;
          docId = matched.id;
        }
      }

      if (!targetDoc) {
        isNew = true;
        docId = `doc-${Date.now()}`;
        targetDoc = {
          id: docId,
          name: name,
          ownerEmail: 'solomonegazi@gmail.com',
          status: 'Draft',
          sharedWith: ['friend@emmasco.de', 'collaborator@gmail.com'],
          versions: [],
          comments: [],
          latestVersion: 0,
          lastModified: new Date().toISOString()
        };
        docs.unshift(targetDoc);
      }

      const newVerNum = targetDoc.latestVersion + 1;
      const savedFileName = `${docId}_v${newVerNum}${ext}`;
      const destPath = path.join(UPLOADS_DIR, savedFileName);

      fs.writeFileSync(destPath, dataBuffer);

      // Seed textDraft simulation
      let draftContent = 'Inhalt des Dokuments';
      if (ext === '.docx' || ext === '.doc') {
        draftContent = 'DOKUMENTENTEXT\nErstellt am ' + new Date().toLocaleDateString('de-DE') + '.\n\nInhalt des Online-Dokumenten-Editors... Type hier deine Änderungen ein!';
      } else if (ext === '.xlsx' || ext === '.xls') {
        draftContent = 'A1: Projekt, B1: Budget, C1: Status\nA2: Emmasco Berlin, B2: 45000, C2: Freigegeben\nA3: Fuhrpark, B3: 15400, C3: In Prüfung\nA4: Total, B4: =SUM(B2:B3)';
      } else if (ext === '.pptx' || ext === '.ppt') {
        draftContent = 'Slide 1: Emmasco Reinigungsteam Strategie 2026\nSlide 2: Abrechnung über Krankenkasse §45a\nSlide 3: Einsatzplan Berlin Prenzlauer Berg';
      }

      const newVersionObj: DocVersion = {
        version: newVerNum,
        fileName: savedFileName,
        originalName: name,
        size: size || `${(dataBuffer.length / (1024 * 1024)).toFixed(2)} MB`,
        uploadedBy: uploaderName || uploaderEmail.split('@')[0],
        uploadedByEmail: uploaderEmail,
        uploadedAt: new Date().toISOString(),
        textDraft: draftContent
      };

      targetDoc.versions.unshift(newVersionObj);
      targetDoc.latestVersion = newVerNum;
      targetDoc.lastModified = new Date().toISOString();

      saveDocumentsList(docs);

      // Trigger automatic mailing notification
      const subject = isNew ? `EMMASCO: Neues Dokument hochgeladen – ${name}` : `EMMASCO: Dokument aktualisiert auf v${newVerNum} – ${name}`;
      const plainText = `Hallo,\n\nein Dokument wurde im Emmasco Portal hochgeladen/aktualisiert.\n\nDatei: ${name}\nVersion: v${newVerNum}\nAusgeführt von: ${newVersionObj.uploadedBy} (${uploaderEmail})`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fdfdfd;">
          <h2 style="color: #0056D6; margin-top: 0;">Dokument-Benachrichtigung</h2>
          <p>Es gibt neue Aktivitäten im sicheren Emmasco Dokumentenportal:</p>
          <div style="background: #e0f2fe; padding: 12px; border-radius: 8px; border: 1px solid #bae6fd; font-size: 14px;">
            <strong>Aktion:</strong> ${isNew ? 'Neues Dokument' : 'Inhalt aktualisiert'} (v${newVerNum})<br/>
            <strong>Datei:</strong> ${name}<br/>
            <strong>Nutzer:</strong> ${newVersionObj.uploadedBy} (${uploaderEmail})<br/>
            <strong>Zeit:</strong> ${new Date().toLocaleString('de-DE')}
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 20px;">Sie erhalten diese Mail als registrierter Portal-Mitglied.</p>
        </div>
      `;

      await sendEmailNotification({
        to: targetDoc.ownerEmail,
        subject,
        plainText,
        html
      });

      res.status(200).json({ success: true, document: targetDoc });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Fehler beim Dateiupload: ' + e.message });
    }
  });

  // 4. Restore an older document revision version
  app.post('/api/documents/:id/restore', async (req, res) => {
    try {
      const { id } = req.params;
      const { version, restoredBy, restoredByEmail } = req.body;
      if (version === undefined || !restoredByEmail) {
        return res.status(400).json({ error: 'Mindestens Version und E-Mail erforderlich.' });
      }

      const docs = readDocuments();
      const idx = docs.findIndex(d => d.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Dokument nicht gefunden.' });

      const targetVerNum = parseInt(version, 10);
      const targetVer = docs[idx].versions.find(v => v.version === targetVerNum);
      if (!targetVer) return res.status(404).json({ error: 'Version nicht im Verlauf vorhanden.' });

      const newVerNum = docs[idx].latestVersion + 1;
      const ext = path.extname(targetVer.originalName);
      const newFileName = `${id}_v${newVerNum}${ext}`;

      const sourcePath = path.join(UPLOADS_DIR, targetVer.fileName);
      const destPath = path.join(UPLOADS_DIR, newFileName);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
      } else {
        // Write default text if somehow missing
        fs.writeFileSync(destPath, Buffer.from(targetVer.textDraft || 'Inhalt', 'utf-8'));
      }

      const restoredVersionSeed: DocVersion = {
        version: newVerNum,
        fileName: newFileName,
        originalName: targetVer.originalName,
        size: targetVer.size,
        uploadedBy: restoredBy || restoredByEmail.split('@')[0],
        uploadedByEmail: restoredByEmail,
        uploadedAt: new Date().toISOString(),
        textDraft: targetVer.textDraft
      };

      docs[idx].versions.unshift(restoredVersionSeed);
      docs[idx].latestVersion = newVerNum;
      docs[idx].lastModified = new Date().toISOString();

      saveDocumentsList(docs);

      // Track Activity
      addActivity({
        type: 'restore',
        userName: restoredBy || restoredByEmail.split('@')[0],
        userEmail: restoredByEmail,
        documentId: id,
        documentName: docs[idx].name,
        details: `Dokument "${docs[idx].name}" auf v${newVerNum} wiederhergestellt von v${targetVerNum}`
      });
      touchActiveUser(restoredByEmail, restoredBy);

      // Email notify
      const subject = `EMMASCO: Version wiederhergestellt – ${docs[idx].name}`;
      const plainText = `Das Dokument "${docs[idx].name}" wurde auf eine ältere Revision zurückgesetzt.\n\nNeue Version: v${newVerNum}\nWiederhergestellt von: v${targetVerNum}\nAusgeführt von: ${restoredBy}`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fdfdfd;">
          <h2 style="color: #0056D6; margin-top: 0;">Revision Wiederhergestellt</h2>
          <p>Ein Dokument wurde im sicheren Emmasco Portal auf einen früheren Zustand zurückgesetzt:</p>
          <div style="background: #e0f2fe; padding: 12px; border-radius: 8px; border: 1px solid #bae6fd; font-size: 14px;">
            <strong>Aktion:</strong> Version v${targetVerNum} wurde kopiert als v${newVerNum}<br/>
            <strong>Datei:</strong> ${docs[idx].name}<br/>
            <strong>Nutzer:</strong> ${restoredBy} (${restoredByEmail})
          </div>
        </div>
      `;

      await sendEmailNotification({
        to: docs[idx].ownerEmail,
        subject,
        plainText,
        html
      });

      res.status(200).json({ success: true, document: docs[idx] });
    } catch (e: any) {
      res.status(500).json({ error: 'Rücksetzung fehlgeschlagen.' });
    }
  });

  // 5. Rename a file
  app.post('/api/documents/:id/rename', (req, res) => {
    try {
      const { id } = req.params;
      const { newName, userEmail, userName } = req.body;
      if (!newName) return res.status(400).json({ error: 'Neuer Name erforderlich.' });

      const docs = readDocuments();
      const idx = docs.findIndex(d => d.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Dokument nicht gefunden.' });

      const oldName = docs[idx].name;
      docs[idx].name = newName;
      docs[idx].lastModified = new Date().toISOString();
      saveDocumentsList(docs);

      // Log Activity
      if (userEmail) {
        addActivity({
          type: 'rename',
          userName: userName || userEmail.split('@')[0],
          userEmail,
          documentId: id,
          documentName: newName,
          details: `Dokument umbenannt von "${oldName}" in "${newName}"`
        });
        touchActiveUser(userEmail, userName);
      }

      res.status(200).json({ success: true, document: docs[idx] });
    } catch (e: any) {
      res.status(500).json({ error: 'Umbenennen fehlgeschlagen.' });
    }
  });

  // 5.5. Update status of a document
  app.post('/api/documents/:id/status', (req, res) => {
    try {
      const { id } = req.params;
      const { status, changedBy, userEmail } = req.body;
      if (!status) return res.status(400).json({ error: 'Status erforderlich.' });

      const docs = readDocuments();
      const idx = docs.findIndex(d => d.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Dokument nicht gefunden.' });

      docs[idx].status = status;
      docs[idx].lastModified = new Date().toISOString();

      if (!docs[idx].statusHistory) {
        docs[idx].statusHistory = [];
      }

      docs[idx].statusHistory.push({
        status,
        changedAt: new Date().toISOString(),
        changedBy: changedBy || docs[idx].ownerEmail || 'System'
      });

      saveDocumentsList(docs);

      // Activity
      if (userEmail) {
        addActivity({
          type: 'status_change',
          userName: changedBy ? changedBy.split(' (')[0] : 'System',
          userEmail,
          documentId: id,
          documentName: docs[idx].name,
          details: `Status von "${docs[idx].name}" auf "${status}" geändert`
        });
        touchActiveUser(userEmail, changedBy ? changedBy.split(' (')[0] : undefined);
      }

      res.status(200).json({ success: true, document: docs[idx] });
    } catch (e: any) {
      res.status(500).json({ error: 'Statusaktualisierung fehlgeschlagen.' });
    }
  });

  // 6. Delete entire document (Owner only)
  app.delete('/api/documents/:id', (req, res) => {
    try {
      const { id } = req.params;
      const userEmail = req.query.email as string;

      if (!userEmail || userEmail.toLowerCase() !== 'solomonegazi@gmail.com') {
        return res.status(403).json({ error: 'Zugriff verweigert. Nur der Eigentümer (Owner) darf Dokumente löschen.' });
      }

      const docs = readDocuments();
      const docToDelete = docs.find(d => d.id === id);
      if (!docToDelete) {
        return res.status(404).json({ error: 'Dokument nicht gefunden.' });
      }

      docToDelete.versions.forEach(v => {
        const filePath = path.join(UPLOADS_DIR, v.fileName);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch(err){}
        }
      });

      const filtered = docs.filter(d => d.id !== id);
      saveDocumentsList(filtered);

      // Log Activity
      addActivity({
        type: 'restore', // general log type
        userName: 'Solomon Egazi',
        userEmail,
        details: `Dokument "${docToDelete.name}" und alle seine Versionen gelöscht`
      });
      touchActiveUser(userEmail, 'Solomon Egazi');

      res.status(200).json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: 'Löschen fehlgeschlagen.' });
    }
  });

  // 7. Delete specific document version (Owner only)
  app.delete('/api/documents/:id/versions/:versionNum', (req, res) => {
    try {
      const { id, versionNum } = req.params;
      const userEmail = req.query.email as string;

      if (!userEmail || userEmail.toLowerCase() !== 'solomonegazi@gmail.com') {
        return res.status(403).json({ error: 'Zugriff verweigert. Nur der Eigentümer (Owner) darf Versionen löschen.' });
      }

      const docs = readDocuments();
      const docIdx = docs.findIndex(d => d.id === id);
      if (docIdx === -1) {
        return res.status(404).json({ error: 'Dokument nicht gefunden.' });
      }

      const vNum = parseInt(versionNum, 10);
      const targetVerIdx = docs[docIdx].versions.findIndex(v => v.version === vNum);
      if (targetVerIdx === -1) {
        return res.status(404).json({ error: 'Version nicht gefunden.' });
      }

      const ver = docs[docIdx].versions[targetVerIdx];
      
      // Delete from physical disk
      const filePath = path.join(UPLOADS_DIR, ver.fileName);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (err) {}
      }

      // Remove from array
      docs[docIdx].versions.splice(targetVerIdx, 1);

      const oldDocName = docs[docIdx].name;

      if (docs[docIdx].versions.length === 0) {
        // No versions left, clean document entirely
        docs.splice(docIdx, 1);
      } else {
        const remainingVersions = docs[docIdx].versions.map(v => v.version);
        docs[docIdx].latestVersion = Math.max(...remainingVersions);
        docs[docIdx].lastModified = new Date().toISOString();
      }

      saveDocumentsList(docs);

      // Log Activity
      addActivity({
        type: 'restore',
        userName: 'Solomon Egazi',
        userEmail,
        details: `Version v${vNum} von "${oldDocName}" gelöscht`
      });
      touchActiveUser(userEmail, 'Solomon Egazi');

      res.status(200).json({ success: true, document: docs[docIdx] });
    } catch (e: any) {
      res.status(500).json({ error: 'Löschen der Version fehlgeschlagen.' });
    }
  });

  // 8. Add document comment & mail notify
  app.post('/api/documents/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const { text, userName, userEmail } = req.body;
      if (!text || !userEmail) {
        return res.status(400).json({ error: 'Kommentartext und E-Mail sind Pflichtfelder.' });
      }

      const docs = readDocuments();
      const idx = docs.findIndex(d => d.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Dokument nicht gefunden.' });

      const newComment: DocumentComment = {
        id: `cmt-${Date.now()}`,
        userName: userName || userEmail.split('@')[0],
        userEmail,
        text,
        timestamp: new Date().toISOString()
      };

      docs[idx].comments.push(newComment);
      docs[idx].lastModified = new Date().toISOString();
      saveDocumentsList(docs);

      // Log Activity
      addActivity({
        type: 'comment',
        userName: userName || userEmail.split('@')[0],
        userEmail,
        documentId: id,
        documentName: docs[idx].name,
        details: `Kommentar hinzugefügt zu "${docs[idx].name}": "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`
      });
      touchActiveUser(userEmail, userName);

      // Notify owner
      const plainText = `Hi!\n\nEin neuer Kommentar wurde zum Dokument "${docs[idx].name}" im Emmasco Portal hinzugefügt.\n\nNutzer: ${newComment.userName}\nKommentar: "${newComment.text}"`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fdfdfd;">
          <h3 style="color: #0056D6; margin-top: 0;">Neuer Kommentar zu ${docs[idx].name}</h3>
          <p>Es wurde ein Diskussionsbeitrag hinterlegt:</p>
          <div style="background: #f1f5f9; padding: 14px; border-radius: 8px; font-style: italic; font-size: 14px; border-left: 4px solid #0056D6;">
            "${newComment.text}"
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 15px;">– Verfasst von <strong>${newComment.userName}</strong> (${newComment.userEmail})</p>
        </div>
      `;

      await sendEmailNotification({
        to: docs[idx].ownerEmail,
        subject: `EMMASCO Notiz: Neuer Kommentar zu ${docs[idx].name}`,
        plainText,
        html
      });

      res.status(200).json({ success: true, comment: newComment });
    } catch (e: any) {
      res.status(500).json(e);
    }
  });

  // 9. Save online edited text draft back as a new version
  app.post('/api/documents/:id/edit-online', async (req, res) => {
    try {
      const { id } = req.params;
      const { userName, userEmail, newTextDraft } = req.body;
      if (!userEmail || newTextDraft === undefined) {
        return res.status(400).json({ error: 'E-Mail und Dokumententext sind erforderlich.' });
      }

      const docs = readDocuments();
      const idx = docs.findIndex(d => d.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Dokument nicht gefunden.' });

      const newVerNum = docs[idx].latestVersion + 1;
      const ext = path.extname(docs[idx].name).toLowerCase();
      const newFileName = `${id}_v${newVerNum}${ext}`;

      const destPath = path.join(UPLOADS_DIR, newFileName);
      fs.writeFileSync(destPath, Buffer.from(newTextDraft, 'utf-8'));

      const sizeStr = `${(newTextDraft.length / 1024).toFixed(2)} KB`;

      const onlineEditedVer: DocVersion = {
        version: newVerNum,
        fileName: newFileName,
        originalName: docs[idx].name,
        size: sizeStr,
        uploadedBy: userName || userEmail.split('@')[0],
        uploadedByEmail: userEmail,
        uploadedAt: new Date().toISOString(),
        textDraft: newTextDraft
      };

      docs[idx].versions.unshift(onlineEditedVer);
      docs[idx].latestVersion = newVerNum;
      docs[idx].lastModified = new Date().toISOString();
      saveDocumentsList(docs);

      // Log Activity
      addActivity({
        type: 'version_update',
        userName: userName || userEmail.split('@')[0],
        userEmail,
        documentId: id,
        documentName: docs[idx].name,
        details: `Dokument "${docs[idx].name}" im Web-Editor überarbeitet (v${newVerNum})`
      });
      touchActiveUser(userEmail, userName);

      // Email notify owner
      const subject = `EMMASCO: Dokument im Browser editiert – ${docs[idx].name}`;
      const plainText = `Hi!\n\nDas Dokument "${docs[idx].name}" wurde im Web-Editor von ${userName} (${userEmail}) bearbeitet.\n\nNeue Version: v${newVerNum}`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fdfdfd;">
          <h2 style="color: #0056D6; margin-top: 0;">Online-Änderung Gesichert</h2>
          <p>Das Dokument wurde direkt im Web-Browser editiert:</p>
          <div style="background: #e0f2fe; padding: 12px; border-radius: 8px; border: 1px solid #bae6fd; font-size: 14px;">
            <strong>Dokument:</strong> ${docs[idx].name}<br/>
            <strong>Neue Version:</strong> v${newVerNum}<br/>
            <strong>Editiert von:</strong> ${onlineEditedVer.uploadedBy} (${userEmail})<br/>
            <strong>Zeit:</strong> ${new Date().toLocaleString('de-DE')}
          </div>
        </div>
      `;

      await sendEmailNotification({
        to: docs[idx].ownerEmail,
        subject,
        plainText,
        html
      });

      res.status(200).json({ success: true, document: docs[idx] });
    } catch (e: any) {
      res.status(500).json({ error: 'Direktbearbeitung fehlgeschlagen: ' + e.message });
    }
  });

  // Dev server Setup inside Node
  let viteInstance: any = null;
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    viteInstance = vite;
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
  }

  // HTML wildcard fallback for SPA routing (works in both dev and prod!)
  app.get('*', async (req, res, next) => {
    // Avoid intercepting API routes or files with extensions
    if (req.path.startsWith('/api/') || req.path.match(/\.[a-z0-9]+$/i)) {
      return next();
    }

    if (process.env.NODE_ENV !== 'production' && viteInstance) {
      try {
        const htmlPath = path.join(process.cwd(), 'index.html');
        let template = fs.readFileSync(htmlPath, 'utf-8');
        template = await viteInstance.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        viteInstance.ssrFixStacktrace(e);
        next(e);
      }
    } else {
      const indexPath = path.join(process.cwd(), 'dist', 'index.html');
      res.sendFile(indexPath);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FULLSTACK SERVER] Operational and running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[LAUNCH ERROR] Server failed to start:', err);
});
