import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Edit3, 
  History, 
  MessageSquare, 
  Upload, 
  Search, 
  Lock, 
  User, 
  Clock, 
  Send, 
  RefreshCw, 
  X, 
  Info, 
  Save, 
  CheckCircle,
  AlertTriangle,
  Play,
  Eye,
  Settings,
  Users,
  Grid,
  Database,
  Briefcase,
  Layers,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sliders,
  LogOut,
  UserPlus,
  ShieldCheck,
  Plus,
  Activity,
  Bell,
  FolderPlus,
  Folder,
  MoreVertical,
  Calendar,
  List
} from 'lucide-react';

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

interface AppUser {
  email: string;
  name: string;
  role: 'Owner' | 'Collaborator';
  status: 'Approved' | 'Pending' | 'Revoked';
  registeredAt?: string;
}

interface ActivityLog {
  id: string;
  type: string;
  userName: string;
  userEmail: string;
  documentId?: string;
  documentName?: string;
  details: string;
  timestamp: string;
}

interface SecureNotification {
  id: string;
  titleDe: string;
  titleEn: string;
  descDe: string;
  descEn: string;
  time: string;
  unread: boolean;
}

interface DocumentPortalProps {
  language: 'de' | 'en';
  currentUserEmail: string | null;
  currentUserName: string | null;
  onLoginRequest: (email: string, name: string) => void;
  onLogoutRequest: () => void;
}

export default function DocumentPortal({
  language,
  currentUserEmail,
  currentUserName,
  onLoginRequest,
  onLogoutRequest
}: DocumentPortalProps) {
  // Navigation sidebar tab: 'documents' | 'shared' | 'recent' | 'activity' | 'settings' (with collaborator controls)
  const [activeTab, setActiveTab] = useState<'documents' | 'shared' | 'recent' | 'activity' | 'settings' | 'upload'>('documents');
  
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [collaborators, setCollaborators] = useState<AppUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<{ email: string; name: string; role: string; lastSeen: string }[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Layout mode: 'table' or 'cards'
  const [layoutMode, setLayoutMode] = useState<'table' | 'cards'>(() => {
    return (localStorage.getItem('emmasco_portal_layout') as 'table' | 'cards') || 'table';
  });

  // Folders support
  const [folders, setFolders] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('emmasco_portal_folders');
      return cached ? JSON.parse(cached) : ['Abrechnungen 2026', 'Verträge', 'Kassenanträge'];
    } catch {
      return ['Abrechnungen 2026', 'Verträge', 'Kassenanträge'];
    }
  });

  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Document ID to folder name mapping
  const [docFolders, setDocFolders] = useState<Record<string, string>>(() => {
    try {
      const cached = localStorage.getItem('emmasco_portal_doc_folders');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<SecureNotification[]>(() => {
    try {
      const cached = localStorage.getItem('emmasco_portal_notifications');
      if (cached) return JSON.parse(cached);
    } catch {}
    return [
      {
        id: 'notif-1',
        titleDe: 'Zugriff freigeschaltet',
        titleEn: 'Access Granted',
        descDe: 'Ihr sicherer Portal-Zugang wurde erfolgreich genehmigt.',
        descEn: 'Your secure workspace account has been successfully approved.',
        time: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        unread: true
      },
      {
        id: 'notif-2',
        titleDe: 'Dateivorlage bereit',
        titleEn: 'Document Ready',
        descDe: 'Wirtschaftsplan_2026.xlsx wurde als Vorlage hochgeladen.',
        descEn: 'Wirtschaftsplan_2026.xlsx has been uploaded as a system template.',
        time: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        unread: false
      }
    ];
  });

  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState<string>('');

  // Authentication states
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [emailInput, setEmailInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [typedCode, setTypedCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [devCodeHint, setDevCodeHint] = useState<string>('');
  const [successResetMsg, setSuccessResetMsg] = useState<string>('');

  // Invitation fields
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Active modals & interactions
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [activeCommentSection, setActiveCommentSection] = useState<string | null>(null); // docId of opened comments
  const [newCommentText, setNewCommentText] = useState<string>('');
  
  // Renaming inline workflow
  const [editingNameDocId, setEditingNameDocId] = useState<string | null>(null);
  const [newNameText, setNewNameText] = useState<string>('');

  // Dropdowns or click-over widgets
  const [statusHistoryPopoverDocId, setStatusHistoryPopoverDocId] = useState<string | null>(null);
  const [versionHistoryDrawerDocId, setVersionHistoryDrawerDocId] = useState<string | null>(null);

  // Upload progress simulation state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadProgressName, setUploadProgressName] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive Online editing / Previewer
  const [editingOnlineDoc, setEditingOnlineDoc] = useState<DocumentRecord | null>(null);
  const [onlineTextChange, setOnlineTextChange] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  // Preview simulations states (e.g. current slide or workbook sheet)
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(0);
  const [previewSheetIdx, setPreviewSheetIdx] = useState<string>('Tabelle 1');
  const [previewZoomLevel, setPreviewZoomLevel] = useState<number>(100);

  const isOwner = currentUserEmail?.toLowerCase() === 'solomonegazi@gmail.com';
  
  const t = (de: string, en: string) => (language === 'de' ? de : en);

  // Hierarchical helper functions
  const getParentPath = (pathStr: string): string | null => {
    const idx = pathStr.lastIndexOf('/');
    if (idx === -1) return null;
    return pathStr.substring(0, idx);
  };

  const getFolderNameOnly = (pathStr: string): string => {
    const idx = pathStr.lastIndexOf('/');
    if (idx === -1) return pathStr;
    return pathStr.substring(idx + 1);
  };

  const formatPathForDropdown = (pathStr: string) => {
    return pathStr.split('/').join(' ➔ ');
  };

  // Layout and folders management helpers
  const handleToggleLayoutMode = (mode: 'table' | 'cards') => {
    setLayoutMode(mode);
    localStorage.setItem('emmasco_portal_layout', mode);
  };

  const handleCreateFolder = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (trimmed.includes('/')) {
      setErrorMsg(t('Der Ordnername darf kein "/" enthalten.', 'Folder name cannot contain "/".'));
      return;
    }
    // Determine the full path of the new folder
    const fullPath = currentFolder ? `${currentFolder}/${trimmed}` : trimmed;

    if (folders.includes(fullPath)) {
      setErrorMsg(t('Ein Ordner mit diesem Namen existiert bereits auf dieser Ebene.', 'A folder with this name already exists at this level.'));
      return;
    }
    const updated = [...folders, fullPath];
    setFolders(updated);
    localStorage.setItem('emmasco_portal_folders', JSON.stringify(updated));
    setNewFolderNameInput('');
    setShowNewFolderModal(false);
    setSuccessMsg(t('Ordner erfolgreich erstellt!', 'Folder successfully created!'));

    // Trigger local notification
    const newNotif: SecureNotification = {
      id: `notif-${Date.now()}`,
      titleDe: 'Neuer Ordner erstellt',
      titleEn: 'New Folder Created',
      descDe: `Der Ordner "${trimmed}" wurde erfolgreich im Portal angelegt.`,
      descEn: `The folder "${trimmed}" has been successfully created in the portal.`,
      time: new Date().toISOString(),
      unread: true
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('emmasco_portal_notifications', JSON.stringify(updatedNotifs));

    // Log to activities array locally
    const localAct: ActivityLog = {
      id: `act-local-${Date.now()}`,
      type: 'folder_create',
      userName: currentUserName || currentUserEmail?.split('@')[0] || 'User',
      userEmail: currentUserEmail || '',
      details: t(`Ordner erstellt: "${trimmed}"`, `Created folder: "${trimmed}"`),
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [localAct, ...prev]);
  };

  const handleDeleteFolder = (folderName: string) => {
    if (window.confirm(t(`Möchten Sie den Ordner "${folderName}" und all seine Unterordner wirklich löschen? Zugeordnete Dateien werden ins Hauptverzeichnis verschoben.`, `Are you sure you want to delete the folder "${folderName}" and all of its subfolders? Associated files will be returned to the root folder.`))) {
      // Find all subfolders (any folder starting with "folderName/" or exactly equal)
      const shouldDelete = (pathStr: string) => {
        return pathStr === folderName || pathStr.startsWith(folderName + '/');
      };

      const updatedFolders = folders.filter(f => !shouldDelete(f));
      setFolders(updatedFolders);
      localStorage.setItem('emmasco_portal_folders', JSON.stringify(updatedFolders));
      
      // Move all files in those folders back to root
      const updatedDocFolders = { ...docFolders };
      Object.keys(updatedDocFolders).forEach(key => {
        const fileFolder = updatedDocFolders[key];
        if (fileFolder && shouldDelete(fileFolder)) {
          delete updatedDocFolders[key];
        }
      });
      setDocFolders(updatedDocFolders);
      localStorage.setItem('emmasco_portal_doc_folders', JSON.stringify(updatedDocFolders));
      
      // If we are currently inside the deleted folder or any of its subfolders, move back to root
      if (currentFolder && shouldDelete(currentFolder)) {
        setCurrentFolder(null);
      }
      setSuccessMsg(t('Ordner und zugehörige Unterelemente gelöscht.', 'Folder and all its subfolders deleted successfully.'));
    }
  };

  const handleMoveFileToFolder = (docId: string, folderName: string | null) => {
    const updated = { ...docFolders };
    if (folderName) {
      updated[docId] = folderName;
    } else {
      delete updated[docId];
    }
    setDocFolders(updated);
    localStorage.setItem('emmasco_portal_doc_folders', JSON.stringify(updated));
    setSuccessMsg(t('Dokument verschoben!', 'Document successfully moved!'));
  };

  // Initialize and tick live data
  useEffect(() => {
    if (currentUserEmail) {
      loadWorkspaceData();
      // Keep online user sessions alive and pull refreshes every 10 seconds
      const timer = setInterval(() => {
        pingOnlineSession();
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [currentUserEmail]);

  const loadWorkspaceData = async () => {
    setLoading(true);
    await Promise.all([
      fetchDocuments(),
      fetchActivities(),
      fetchCollaborators(),
      pingOnlineSession()
    ]);
    setLoading(false);
  };

  const fetchDocuments = async () => {
    if (!currentUserEmail) return;
    try {
      const res = await fetch(`/api/documents?email=${encodeURIComponent(currentUserEmail)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents', err);
    }
  };

  const fetchActivities = async () => {
    if (!currentUserEmail) return;
    try {
      const res = await fetch(`/api/documents/activity?email=${encodeURIComponent(currentUserEmail)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setActivities(data.activities);
      }
    } catch (err) {}
  };

  const fetchCollaborators = async () => {
    if (!isOwner) return;
    try {
      const res = await fetch(`/api/collaborators?ownerEmail=${encodeURIComponent(currentUserEmail || '')}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setCollaborators(data.collaborators);
      }
    } catch (err) {}
  };

  const pingOnlineSession = async () => {
    if (!currentUserEmail) return;
    try {
      // Fetching active documents touches the memory active session
      const res = await fetch(`/api/active-users?ownerEmail=${encodeURIComponent(currentUserEmail || '')}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setOnlineUsers(data.onlineUsers);
      }
    } catch (err) {}
  };

  // Real Authentic Login Flow
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput || !passwordInput || (authMode === 'register' && !nameInput)) {
      setAuthError(t('Bitte alle Felder ausfüllen.', 'Please fill out all fields.'));
      return;
    }

    try {
      const endpoint = authMode === 'login' ? '/api/workspace/auth/login' : '/api/workspace/auth/register';
      const body = authMode === 'login' 
        ? { email: emailInput, password: passwordInput }
        : { email: emailInput, name: nameInput, password: passwordInput };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || t('Ein unbekannter Fehler ist aufgetreten.', 'An unknown error occurred.'));
        return;
      }

      if (data.success && data.user) {
        onLoginRequest(data.user.email, data.user.name);
        setSuccessMsg(t('Erfolgreich angemeldet!', 'Logged in successfully!'));
      }
    } catch (err) {
      setAuthError(t('Verbindung zum Server fehlgeschlagen.', 'Connection to server failed.'));
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessResetMsg('');
    setDevCodeHint('');
    if (!emailInput) {
      setAuthError(t('Bitte geben Sie Ihre E-Mail an.', 'Please provide your email.'));
      return;
    }

    try {
      const response = await fetch('/api/workspace/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });

      const result = await response.json();
      if (response.ok) {
        setAuthMode('reset');
        setSuccessResetMsg(t('Sicherheitscode zum Zurücksetzen wurde versendet.', 'Reset security code has been sent.'));
        if (result.tempCode) {
          setDevCodeHint(`[TEST ENVIRONMENT HINT] Reset Code: ${result.tempCode}`);
        }
      } else {
        setAuthError(result.error || t('Zurücksetzen fehlgeschlagen.', 'Reset failed.'));
      }
    } catch (err) {
      setAuthError(t('Serververbindung fehlgeschlagen.', 'Server connection failed.'));
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessResetMsg('');

    if (!emailInput || !typedCode || !newPassword) {
      setAuthError(t('Bitte alle Felder ausfüllen.', 'Please fill out all fields.'));
      return;
    }

    try {
      const response = await fetch('/api/workspace/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          code: typedCode,
          newPassword
        })
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessResetMsg(t('Passwort erfolgreich zurückgesetzt! Bitte loggen Sie sich ein.', 'Password successfully reset! Please sign in.'));
        setAuthMode('login');
        setDevCodeHint('');
        setTypedCode('');
        setNewPassword('');
      } else {
        setAuthError(result.error || t('Passwort-Zurücksetzung fehlgeschlagen.', 'Password reset failed.'));
      }
    } catch (err) {
      setAuthError(t('Serververbindung fehlgeschlagen.', 'Server connection failed.'));
    }
  };

  // Invite collaborators
  const handleInviteCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);
    if (!inviteEmail || !inviteName) {
      setInviteError(t('Name und E-Mail sind erforderlich.', 'Name and email are required.'));
      return;
    }

    try {
      const res = await fetch('/api/collaborators/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerEmail: currentUserEmail,
          email: inviteEmail,
          name: inviteName
        })
      });
      if (res.ok) {
        setInviteSuccess(t('Partner erfolgreich eingeladen und freigeschaltet!', 'Collaborator successfully invited and approved!'));
        
        // Add Access Granted Notification
        const newNotif: SecureNotification = {
          id: `notif-${Date.now()}`,
          titleDe: 'Zugriff freigeschaltet',
          titleEn: 'Access Granted',
          descDe: `Der Account für "${inviteName}" (${inviteEmail}) wurde erstellt und freigegeben.`,
          descEn: `The account for "${inviteName}" (${inviteEmail}) has been created and authorized.`,
          time: new Date().toISOString(),
          unread: true
        };
        const updatedNotifs = [newNotif, ...notifications];
        setNotifications(updatedNotifs);
        localStorage.setItem('emmasco_portal_notifications', JSON.stringify(updatedNotifs));

        setInviteEmail('');
        setInviteName('');
        fetchCollaborators();
        fetchActivities();
      } else {
        const d = await res.json();
        setInviteError(d.error || t('Fehler beim Einladen.', 'Error inviting collaborator.'));
      }
    } catch (err) {
      setInviteError(t('Serverfehler.', 'Server error.'));
    }
  };

  // Update access of collaborator (Approve/Revoke)
  const handleUpdateUserStatus = async (targetEmail: string, status: 'Approved' | 'Revoked') => {
    try {
      const res = await fetch('/api/collaborators/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerEmail: currentUserEmail,
          targetEmail,
          status
        })
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setCollaborators(d.collaborators);
        setSuccessMsg(status === 'Approved' ? t('Account freigegeben!', 'Account authorized!') : t('Account gesperrt!', 'Account restricted!'));
        
        if (status === 'Approved') {
          // Add Access Granted Notification
          const newNotif: SecureNotification = {
            id: `notif-${Date.now()}`,
            titleDe: 'Zugriff freigeschaltet',
            titleEn: 'Access Granted',
            descDe: `Der Account für "${targetEmail}" wurde autorisiert.`,
            descEn: `The account for "${targetEmail}" has been authorized.`,
            time: new Date().toISOString(),
            unread: true
          };
          const updatedNotifs = [newNotif, ...notifications];
          setNotifications(updatedNotifs);
          localStorage.setItem('emmasco_portal_notifications', JSON.stringify(updatedNotifs));
        }

        fetchActivities();
        pingOnlineSession();
      }
    } catch (err) {}
  };

  // Handle Drag & Drop uploading interactions
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFileLocally(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileLocally(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Safe base64 converter and upload logic with visual progress simulation
  const uploadFileLocally = (file: File, replaceId?: string) => {
    setUploadProgress(10);
    setUploadProgressName(file.name);
    
    const reader = new FileReader();
    reader.onloadstart = () => setUploadProgress(25);
    reader.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 50) + 25;
        setUploadProgress(percent);
      }
    };

    reader.onload = async () => {
      setUploadProgress(80);
      try {
        const base64Pure = reader.result as string;
        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            base64Data: base64Pure,
            uploaderName: currentUserName,
            uploaderEmail: currentUserEmail,
            replaceDocumentId: replaceId
          })
        });

        const data = await res.json();
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(null);
          setUploadProgressName('');
        }, 800);

        if (res.ok && data.success) {
          setSuccessMsg(replaceId ? t('Version erfolgreich aktualisiert!', 'Revision updated successfully!') : t('Datei erfolgreich hochgeladen und verschlüsselt hinterlegt!', 'File uploaded successfully and securely stored!'));
          
          // Auto-assign to current folder if one is active during a new upload (not a replacement)
          if (!replaceId && currentFolder && data.document && data.document.id) {
            const updatedFolders = { ...docFolders, [data.document.id]: currentFolder };
            setDocFolders(updatedFolders);
            localStorage.setItem('emmasco_portal_doc_folders', JSON.stringify(updatedFolders));
          }

          // Add a floating secure notification
          const isReplacement = !!replaceId;
          const newNotif: SecureNotification = {
            id: `notif-${Date.now()}`,
            titleDe: isReplacement ? 'Datei aktualisiert' : 'Neue Datei hochgeladen',
            titleEn: isReplacement ? 'File Updated' : 'New File Uploaded',
            descDe: isReplacement 
              ? `Die Datei "${file.name}" wurde auf Version v${data.document?.latestVersion || 1} aktualisiert.` 
              : `Die Datei "${file.name}" wurde erfolgreich im Portal freigegeben.`,
            descEn: isReplacement 
              ? `The file "${file.name}" has been updated to revision v${data.document?.latestVersion || 1}.` 
              : `The file "${file.name}" has been successfully uploaded to the workspace.`,
            time: new Date().toISOString(),
            unread: true
          };
          const updatedNotifs = [newNotif, ...notifications];
          setNotifications(updatedNotifs);
          localStorage.setItem('emmasco_portal_notifications', JSON.stringify(updatedNotifs));

          loadWorkspaceData();
          if (activeTab === 'upload') {
            setActiveTab('documents');
          }
        } else {
          setErrorMsg(data.error || t('Upload-Fehler aufgetreten.', 'Upload error occurred.'));
        }
      } catch (err) {
        setUploadProgress(null);
        setErrorMsg(t('Keine Server-Antwort beim Übertragen.', 'No server response.'));
      }
    };

    reader.readAsDataURL(file);
  };

  // Restore old doc version
  const handleRestoreVersion = async (docId: string, versionNum: number) => {
    try {
      const res = await fetch(`/api/documents/${docId}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: versionNum,
          restoredBy: currentUserName,
          restoredByEmail: currentUserEmail
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(t(`Version v${versionNum} erfolgreich wiederhergestellt!`, `Version v${versionNum} successfully restored!`));
        setVersionHistoryDrawerDocId(null);
        loadWorkspaceData();
      } else {
        setErrorMsg(data.error || t('Konnte Version nicht wiederherstellen.', 'Could not restore revision.'));
      }
    } catch (err) {}
  };

  // Rename action
  const handleRenameDocument = async (docId: string) => {
    if (!newNameText.trim()) return;
    try {
      const res = await fetch(`/api/documents/${docId}/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newName: newNameText.trim(),
          userName: currentUserName,
          userEmail: currentUserEmail
        })
      });
      if (res.ok) {
        setSuccessMsg(t('Dokument erfolgreich umbenannt!', 'Document successfully renamed!'));
        setEditingNameDocId(null);
        setNewNameText('');
        loadWorkspaceData();
      }
    } catch (err) {}
  };

  // Status Change action
  const handleUpdateStatus = async (docId: string, nextStatus: 'Draft' | 'Approved' | 'Needs Revision') => {
    try {
      const res = await fetch(`/api/documents/${docId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          changedBy: `${currentUserName} (${currentUserEmail})`,
          userEmail: currentUserEmail
        })
      });
      if (res.ok) {
        setSuccessMsg(t('Dokumentenstatus erfolgreich aktualisiert!', 'Document status successfully updated!'));
        setStatusHistoryPopoverDocId(null);
        loadWorkspaceData();
      }
    } catch (err) {}
  };

  // Delete entire document (Owner Only)
  const handleDeleteDocument = async (docId: string) => {
    if (!window.confirm(t('Möchten Sie dieses Dokument und alle Revisionen permanent löschen?', 'Are you sure you want to permanently delete this document and all its versions?'))) {
      return;
    }
    try {
      const res = await fetch(`/api/documents/${docId}?email=${encodeURIComponent(currentUserEmail || '')}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccessMsg(t('Dokument wurde permanent entfernt.', 'Document was permanently removed.'));
        loadWorkspaceData();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || t('Fehler beim Löschen.', 'Error deleting document.'));
      }
    } catch (err) {}
  };

  // Delete specific version (Owner Only)
  const handleDeleteVersion = async (docId: string, verNum: number) => {
    if (!window.confirm(t(`Möchten Sie Version v${verNum} unwiderruflich löschen?`, `Are you sure you want to delete version v${verNum} permanently?`))) {
      return;
    }
    try {
      const res = await fetch(`/api/documents/${docId}/versions/${verNum}?email=${encodeURIComponent(currentUserEmail || '')}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccessMsg(t(`Version v${verNum} gelöscht!`, `Version v${verNum} deleted!`));
        setVersionHistoryDrawerDocId(null);
        loadWorkspaceData();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || t('Fehler beim Löschen.', 'Error deleting version.'));
      }
    } catch (err) {}
  };

  // Insert Comment
  const handlePostComment = async (docId: string) => {
    if (!newCommentText.trim()) return;
    try {
      const res = await fetch(`/api/documents/${docId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newCommentText.trim(),
          userName: currentUserName,
          userEmail: currentUserEmail
        })
      });
      if (res.ok) {
        setNewCommentText('');
        fetchDocuments(); // Refresh documents
        fetchActivities();
      }
    } catch (err) {}
  };

  // Save text changes in browser text editor simulator as new version
  const handleSaveOnlineEdit = async () => {
    if (!editingOnlineDoc) return;
    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/documents/${editingOnlineDoc.id}/edit-online`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: currentUserName,
          userEmail: currentUserEmail,
          newTextDraft: onlineTextChange
        })
      });
      if (res.ok) {
        setSuccessMsg(t('Änderungen erfolgreich als neue Version gesichert!', 'Changes successfully saved as a new version!'));
        setEditingOnlineDoc(null);
        loadWorkspaceData();
      }
    } catch (err) {}
    setIsSavingEdit(false);
  };

  // Helper calculating total storage usage
  const totalStorageMB = documents.reduce((acc, doc) => {
    const latest = doc.versions[0];
    if (!latest) return acc;
    const num = parseFloat(latest.size);
    return acc + (isNaN(num) ? 0.3 : num);
  }, 0);

  const storagePercentage = Math.min(100, Math.round((totalStorageMB / 250) * 100)); // limit 250MB for demo space

  // Filter documents by tab & search query & folders
  const filteredDocs = documents.filter(doc => {
    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = doc.name.toLowerCase().includes(q);
      const uploaderMatch = doc.versions.some(v => v.uploadedBy?.toLowerCase().includes(q));
      if (!nameMatch && !uploaderMatch) return false;
    }

    // Tab separation
    if (activeTab === 'shared') {
      // Shared is where the owner shared with specific or other people, or collaborator's inbox
      if (isOwner) {
        return doc.sharedWith.length > 0;
      } else {
        return doc.ownerEmail.toLowerCase() !== currentUserEmail?.toLowerCase();
      }
    }

    if (activeTab === 'recent') {
      // Show all accessible files for recent view
      return true;
    }

    // Folder separation for My Documents (only when 'documents' tab is active)
    if (activeTab === 'documents') {
      const docFolder = docFolders[doc.id] || null;
      if (currentFolder === null) {
        // Only show files that have no folder
        return !docFolder;
      } else {
        // Only show files in the selected folder
        return docFolder === currentFolder;
      }
    }

    return true;
  }).sort((a, b) => {
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });

  // Render Login & Registration Screens if not authenticated
  if (!currentUserEmail) {
    return (
      <div id="auth-guard-panel" className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-8 bg-gradient-to-br from-[#0056D6] to-[#0041A3] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Emmasco Secure Workspace</h2>
              <p className="text-xs text-white/80">{t('Identitäts- & Portalverwaltung', 'Identity & Portal Management')}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {(authMode === 'login' || authMode === 'register') && (
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
              <button 
                id="btn-auth-mode-login"
                type="button"
                className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${authMode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                onClick={() => { setAuthMode('login'); setAuthError(null); setSuccessResetMsg(''); }}
              >
                {t('Anmelden', 'Sign In')}
              </button>
              <button 
                id="btn-auth-mode-register"
                type="button"
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${authMode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                onClick={() => { setAuthMode('register'); setAuthError(null); setSuccessResetMsg(''); }}
              >
                {t('Registrieren', 'Sign Up')}
              </button>
            </div>
          )}

          {(authMode === 'forgot' || authMode === 'reset') && (
            <div className="mb-6 text-center">
              <h3 className="text-sm font-bold text-gray-800">
                {authMode === 'forgot' ? t('Passwort vergessen', 'Forgot Password') : t('Neues Passwort setzen', 'Set New Password')}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {authMode === 'forgot' 
                  ? t('Geben Sie Ihre E-Mail ein, um einen Rücksetzungscode zu erhalten.', 'Enter your email to receive a reset code.')
                  : t('Geben Sie den erhaltenen Code und Ihr neues Passwort ein.', 'Enter the code you received and your new password.')}
              </p>
            </div>
          )}

          {(authMode === 'login' || authMode === 'register') && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">{t('Vollständiger Name', 'Full Name')}</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="w-4 h-4 text-gray-400" />
                    </span>
                    <input 
                      id="input-auth-name"
                      type="text" 
                      placeholder="Solomon Egazi" 
                      required 
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D6] focus:border-[#0056D6]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">{t('E-Mail-Adresse', 'Email Address')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="w-4 h-4 text-gray-400" />
                  </span>
                  <input 
                    id="input-auth-email"
                    type="email" 
                    placeholder="solomonegazi@gmail.com" 
                    required 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D6] focus:border-[#0056D6]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">Passwort</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </span>
                  <input 
                    id="input-auth-password"
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D6] focus:border-[#0056D6]"
                  />
                </div>
                {authMode === 'login' && (
                  <div className="flex justify-end mt-1">
                    <button
                      id="btn-forgot-password-link"
                      type="button"
                      onClick={() => { setAuthMode('forgot'); setAuthError(null); setSuccessResetMsg(''); }}
                      className="text-[11px] font-semibold text-[#0056D6] hover:underline cursor-pointer"
                    >
                      {t('Passwort vergessen?', 'Forgot Password?')}
                    </button>
                  </div>
                )}
              </div>

              {authError && (
                <div className="flex gap-2 items-center text-red-600 bg-red-50 p-3 rounded-lg text-xs leading-5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {successResetMsg && (
                <div className="flex gap-2 items-center text-emerald-600 bg-emerald-50 p-3 rounded-lg text-xs leading-5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successResetMsg}</span>
                </div>
              )}

              <button 
                id="submit-auth-button"
                type="submit" 
                className="w-full mt-2 py-2.5 bg-[#0056D6] hover:bg-[#0041A3] active:bg-[#003380] text-white font-semibold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
              >
                {authMode === 'login' ? t('Jetzt einloggen', 'Sign In Now') : t('Registrierung absenden', 'Complete Sign Up')}
              </button>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">{t('E-Mail-Adresse', 'Email Address')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="w-4 h-4 text-gray-400" />
                  </span>
                  <input 
                    id="input-forgot-email"
                    type="email" 
                    placeholder="solomonegazi@gmail.com" 
                    required 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D6] focus:border-[#0056D6]"
                  />
                </div>
              </div>

              {authError && (
                <div className="flex gap-2 items-center text-red-600 bg-red-50 p-3 rounded-lg text-xs leading-5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {successResetMsg && (
                <div className="flex gap-2 items-center text-emerald-600 bg-emerald-50 p-3 rounded-lg text-xs leading-5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successResetMsg}</span>
                </div>
              )}

              <button 
                id="submit-forgot-button"
                type="submit" 
                className="w-full mt-2 py-2.5 bg-[#0056D6] hover:bg-[#0041A3] active:bg-[#003380] text-white font-semibold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
              >
                {t('Code anfordern', 'Request Code')}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(null); setSuccessResetMsg(''); }}
                  className="text-xs font-semibold text-[#0056D6] hover:underline"
                >
                  {t('Zurück zum Login', 'Back to Login')}
                </button>
              </div>
            </form>
          )}

          {authMode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">{t('E-Mail-Adresse', 'Email Address')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="w-4 h-4 text-gray-400" />
                  </span>
                  <input 
                    id="input-reset-email"
                    type="email" 
                    placeholder="solomonegazi@gmail.com" 
                    required 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D6] focus:border-[#0056D6]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">{t('Sicherheitscode', 'Security Code')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </span>
                  <input 
                    id="input-reset-code"
                    type="text" 
                    placeholder="123456" 
                    required 
                    value={typedCode}
                    onChange={(e) => setTypedCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D6] focus:border-[#0056D6]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">{t('Neues Passwort', 'New Password')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </span>
                  <input 
                    id="input-reset-newpassword"
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D6] focus:border-[#0056D6]"
                  />
                </div>
              </div>

              {authError && (
                <div className="flex gap-2 items-center text-red-600 bg-red-50 p-3 rounded-lg text-xs leading-5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {successResetMsg && (
                <div className="flex gap-2 items-center text-emerald-600 bg-emerald-50 p-3 rounded-lg text-xs leading-5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successResetMsg}</span>
                </div>
              )}

              {devCodeHint && (
                <div className="p-2.5 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg font-mono text-[10px] break-all leading-relaxed select-all">
                  {devCodeHint}
                </div>
              )}

              <button 
                id="submit-reset-button"
                type="submit" 
                className="w-full mt-2 py-2.5 bg-[#0056D6] hover:bg-[#0041A3] active:bg-[#003380] text-white font-semibold rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
              >
                {t('Passwort jetzt ändern', 'Change Password Now')}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(null); setSuccessResetMsg(''); }}
                  className="text-xs font-semibold text-[#0056D6] hover:underline"
                >
                  {t('Zurück zum Login', 'Back to Login')}
                </button>
              </div>
            </form>
          )}

          {(authMode === 'login' || authMode === 'register') && (
            <div className="mt-6 border-t border-gray-100 pt-4 text-center">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">{t('Demo-Kontenzugriff für Testzwecke:', 'Demo Accounts for Evaluation:')}</h4>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  id="quick-login-owner"
                  type="button"
                  className="p-2 border border-gray-200 hover:border-[#0056D6] rounded-lg text-left transition-all hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    setEmailInput('solomonegazi@gmail.com');
                    setPasswordInput('solomon123');
                    setAuthMode('login');
                  }}
                >
                  <div className="text-[10px] font-bold text-[#0056D6]">Owner</div>
                  <div className="text-[9px] text-gray-500 truncate">solomonegazi@gmail.com</div>
                </button>
                <button 
                  id="quick-login-partner"
                  type="button"
                  className="p-2 border border-gray-200 hover:border-[#0056D6] rounded-lg text-left transition-all hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    setEmailInput('friend@emmasco.de');
                    setPasswordInput('friend123');
                    setAuthMode('login');
                  }}
                >
                  <div className="text-[10px] font-bold text-teal-600">Collaborator</div>
                  <div className="text-[9px] text-gray-500 truncate">friend@emmasco.de</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Formatting date utilities
  const formatBadgedDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div id="collaborative-workspace-layout" className="max-w-7xl mx-auto my-6 px-4">
      {/* Visual Floating Notifications for success or errors */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-medium"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="ml-2 hover:bg-white/10 p-1 rounded-md"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-rose-600 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-medium"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="ml-2 hover:bg-white/10 p-1 rounded-md"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress simulation floating overlay */}
      {uploadProgress !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full mx-4 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-5 h-5 text-[#0056D6] animate-bounce" />
              <div>
                <h4 className="text-xs font-bold text-gray-900 truncate">{t('Übertrage Dokument...', 'Uploading Document...')}</h4>
                <p className="text-[10px] text-gray-500 truncate">{uploadProgressName}</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#0056D6] h-full transition-all duration-300 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] font-medium text-gray-500">{uploadProgress === 100 ? t('Verschlüssele...', 'Encrypting...') : t('Lade hoch...', 'Uploading...')}</span>
              <span className="text-[10px] font-bold text-gray-900">{uploadProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Primary layout: Left sidebar, Main dashboard panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden min-h-[640px]">
        {/* Left Sidebar navigation */}
        <aside className="lg:col-span-3 border-r border-gray-100 bg-[#FAFBFD] p-5 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="p-2 bg-blue-100 text-[#0056D6] rounded-xl font-bold text-sm">EM</div>
              <div>
                <h3 className="font-bold text-sm truncate text-gray-950">Workspace Portal</h3>
                <p className="text-[10px] text-gray-500 truncate">{currentUserEmail}</p>
              </div>
            </div>

            {/* Sidebar Tabs Controls */}
            <nav className="space-y-1.5 list-none">
              <button 
                id="tab-documents"
                type="button"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'documents' ? 'bg-[#0056D6] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => { setActiveTab('documents'); setCurrentFolder(null); loadWorkspaceData(); }}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>{t('Meine Dokumente', 'My Documents')}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'documents' ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-700 font-bold'}`}>{documents.length}</span>
              </button>

              <button 
                id="tab-shared"
                type="button"
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'shared' ? 'bg-[#0056D6] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => { setActiveTab('shared'); loadWorkspaceData(); }}
              >
                <Layers className="w-4 h-4" />
                <span>{t('Geteilte Dokumente', 'Shared Documents')}</span>
              </button>

              <button 
                id="tab-recent"
                type="button"
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'recent' ? 'bg-[#0056D6] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => { setActiveTab('recent'); loadWorkspaceData(); }}
              >
                <Clock className="w-4 h-4" />
                <span>{t('Verlauf', 'Recent Files')}</span>
              </button>

              <button 
                id="tab-activity"
                type="button"
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'activity' ? 'bg-[#0056D6] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => { setActiveTab('activity'); loadWorkspaceData(); }}
              >
                <Activity className="w-4 h-4" />
                <span>{t('Aktivitäten', 'Activity')}</span>
              </button>

              <button 
                id="tab-settings"
                type="button"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-[#0056D6] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => { setActiveTab('settings'); fetchCollaborators(); }}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>{t('Einstellungen', 'Settings')}</span>
                </div>
                {isOwner && collaborators.length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-yellow-400 text-yellow-950 rounded-full font-extrabold animate-pulse">!</span>
                )}
              </button>
            </nav>
          </div>

          {/* Persistent Disk space indicator widget */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-2xs">
              <div className="flex items-center gap-2 mb-2 text-gray-700">
                <Database className="w-3.5 h-3.5 text-[#0056D6]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('Speicherplatz', 'Disk Space')}</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-1">
                <div 
                  className="bg-[#0056D6] h-full rounded-full transition-all" 
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-500">
                <span>{totalStorageMB.toFixed(1)} MB</span>
                <span>{t('von 250 MB', 'of 250 MB')}</span>
              </div>
            </div>

            {/* Logout call button */}
            <button 
              id="btn-sidebar-logout"
              type="button"
              className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 rounded-lg transition-colors cursor-pointer"
              onClick={onLogoutRequest}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('Sitzung beenden', 'Sign Out')}</span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard Panel layout */}
        <main className="lg:col-span-9 p-6 flex flex-col justify-between">
                     {/* Top Bar Navigation Component */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
              {/* Left section: Main controls (Upload File, New Folder) */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Upload File button */}
                <button 
                  id="topbar-upload-file"
                  type="button"
                  className="px-3 py-2 bg-[#0056D6] hover:bg-[#0041A3] text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <span>{t('Datei hochladen', 'Upload File')}</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      uploadFileLocally(e.target.files[0]);
                    }
                  }} 
                />

                {/* New Folder button */}
                <button 
                  id="topbar-new-folder"
                  type="button"
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  onClick={() => {
                    const name = prompt(t('Ordnername eingeben:', 'Enter folder name:'));
                    if (name) handleCreateFolder(name);
                  }}
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{t('Neuer Ordner', 'New Folder')}</span>
                </button>
              </div>

              {/* Right section: Search bar, Notifications and User Profile */}
              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                {/* Search field */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                  </span>
                  <input 
                    id="topbar-search"
                    type="text"
                    className="w-full text-xs pl-8 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0056D6] transition-all"
                    placeholder={t('Suchen...', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-650"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Notifications dropdown trigger */}
                <div className="relative shrink-0">
                  <button 
                    id="topbar-notifications"
                    type="button"
                    className="p-2 text-gray-600 hover:text-[#0056D6] hover:bg-gray-100 rounded-lg relative cursor-pointer transition-colors"
                    onClick={() => {
                      setShowNotifDropdown(!showNotifDropdown);
                      setShowProfileDropdown(false);
                      // Clear unread indicator
                      const cleared = notifications.map(n => ({ ...n, unread: false }));
                      setNotifications(cleared);
                      localStorage.setItem('emmasco_portal_notifications', JSON.stringify(cleared));
                    }}
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white animate-pulse" />
                    )}
                  </button>

                  {/* Notifications dropdown menu */}
                  <AnimatePresence>
                    {showNotifDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-45 text-xs text-left"
                      >
                        <div className="px-3 pb-2 border-b border-gray-100 flex justify-between items-center">
                          <span className="font-bold text-gray-900">{t('Benachrichtigungen', 'Notifications')}</span>
                          <button 
                            className="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer"
                            onClick={() => {
                              setNotifications([]);
                              localStorage.removeItem('emmasco_portal_notifications');
                            }}
                          >
                            {t('Leeren', 'Clear All')}
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                          {notifications.length === 0 ? (
                            <div className="px-3 py-4 text-center text-gray-400 text-[11px] italic">
                              {t('Keine neuen Benachrichtigungen', 'No new notifications')}
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-gray-950 text-left">{t(n.titleDe, n.titleEn)}</span>
                                  <span className="text-[9px] text-gray-400 shrink-0 ml-1">{new Date(n.time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 leading-normal text-left">{t(n.descDe, n.descEn)}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Profile dropdown trigger */}
                <div className="relative shrink-0">
                  <button 
                    id="topbar-userprofile"
                    type="button"
                    className="flex items-center gap-1.5 p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-all"
                    onClick={() => {
                      setShowProfileDropdown(!showProfileDropdown);
                      setShowNotifDropdown(false);
                    }}
                  >
                    <div className="w-7 h-7 bg-blue-100 text-[#0056D6] rounded-full flex items-center justify-center text-xs font-bold uppercase">
                      {currentUserEmail ? currentUserEmail[0] : 'U'}
                    </div>
                  </button>

                  {/* User Profile menu */}
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2.5 z-45 text-xs text-left"
                      >
                        <div className="px-3.5 pb-2 border-b border-gray-100">
                          <p className="font-bold text-gray-950 truncate">{currentUserName || 'Mitglied'}</p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{currentUserEmail}</p>
                        </div>
                        <div className="p-2 divide-y divide-gray-50 text-[11px] text-left">
                          <div className="py-1.5 px-2 text-gray-600 flex justify-between">
                            <span>{t('Rolle:', 'Role:')}</span>
                            <span className="font-bold text-[#0056D6]">{isOwner ? t('Inhaber', 'Owner') : t('Partner', 'Collaborator')}</span>
                          </div>
                          <div className="py-1.5 px-2 text-gray-650 flex justify-between">
                            <span>{t('Sicherheit:', 'Status:')}</span>
                            <span className="font-bold text-emerald-600">{t('Aktiviert / TLS', 'Encrypted TLS')}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100 px-2 text-left">
                          <button 
                            onClick={onLogoutRequest}
                            className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-rose-50 text-rose-600 font-medium rounded-lg transition-colors cursor-pointer text-left"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>{t('Abmelden', 'Sign Out')}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ---------------- 1. VIEW DOCUMENTS / ARCHIVE INDEX TAB ---------------- */}
            {(activeTab === 'documents' || activeTab === 'shared' || activeTab === 'recent') && (
              <div className="space-y-4">
                
                {/* Directory structures, Breadcrumbs, Views toggling bar */}
                {activeTab === 'documents' && (
                  <div className="space-y-3.5">
                    {/* Breadcrumbs navigation */}
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700 bg-slate-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button 
                          onClick={() => setCurrentFolder(null)} 
                          className={`hover:text-[#0056D6] hover:underline cursor-pointer transition-colors ${currentFolder === null ? 'text-[#0056D6] font-extrabold' : 'text-gray-500'}`}
                        >
                          {t('Dateien', 'Files')}
                        </button>
                        {currentFolder && (
                          currentFolder.split('/').map((part, idx, arr) => {
                            const parentPath = arr.slice(0, idx + 1).join('/');
                            const isLast = idx === arr.length - 1;
                            return (
                              <React.Fragment key={parentPath}>
                                <span className="text-gray-300">/</span>
                                <button
                                  onClick={() => setCurrentFolder(parentPath)}
                                  className={`hover:text-[#0056D6] hover:underline cursor-pointer transition-colors ${isLast ? 'text-[#0056D6] font-extrabold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100' : 'text-gray-500'}`}
                                >
                                  {part}
                                </button>
                              </React.Fragment>
                            );
                          })
                        )}
                      </div>

                      {/* Display toggle Mode switcher */}
                      <div className="flex items-center gap-1.5 border border-gray-200 bg-white p-1 rounded-lg">
                        <button 
                          type="button"
                          title={t('Listenansicht', 'Table View')}
                          onClick={() => handleToggleLayoutMode('table')}
                          className={`p-1.5 rounded-md cursor-pointer transition-all ${layoutMode === 'table' ? 'bg-[#0056D6] text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          title={t('Rasteransicht', 'Cards View')}
                          onClick={() => handleToggleLayoutMode('cards')}
                          className={`p-1.5 rounded-md cursor-pointer transition-all ${layoutMode === 'cards' ? 'bg-[#0056D6] text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          <Grid className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Folders & Subfolders section */}
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {currentFolder === null ? t('Ordner und Verzeichnisse', 'Folders & Directories') : t('Unterordner', 'Subfolders')}
                      </h3>
                      {folders.filter(f => getParentPath(f) === currentFolder).length === 0 ? (
                        currentFolder === null ? (
                          <div className="p-4 border border-dashed border-gray-200 rounded-xl bg-slate-50/50 text-center text-xs text-gray-400 italic">
                            {t('Keine Ordner angelegt. Klicken Sie oben auf "Neuer Ordner", um einen zu erstellen.', 'No folders created yet. Click "New Folder" on the top right to organize files.')}
                          </div>
                        ) : null
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {folders
                            .filter(f => getParentPath(f) === currentFolder)
                            .map((folder) => {
                              const count = documents.filter(d => docFolders[d.id] === folder).length;
                              return (
                                <div 
                                  key={folder}
                                  className="group relative border border-gray-100 hover:border-[#0056D6] hover:shadow-2xs rounded-xl p-3 bg-white flex items-center justify-between cursor-pointer transition-all"
                                  onClick={() => setCurrentFolder(folder)}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="p-2 bg-amber-50 text-amber-500 rounded-lg group-hover:bg-amber-100 transition-colors">
                                      <Folder className="w-4 h-4 fill-current" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#0056D6] transition-colors">
                                        {getFolderNameOnly(folder)}
                                      </h4>
                                      <p className="text-[9px] text-gray-500 mt-0.5">{count} {count === 1 ? t('Datei', 'file') : t('Dateien', 'files')}</p>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFolder(folder);
                                    }}
                                    className="text-gray-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-slate-100 cursor-pointer"
                                    title={t('Ordner löschen', 'Delete Folder')}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shared & Recent layouts subhead layout controls */}
                {(activeTab === 'shared' || activeTab === 'recent') && (
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700 bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-[#0056D6] font-bold">
                      {activeTab === 'shared' ? t('Geteilte Dokumente', 'Shared Documents') : t('Verlauf (Kürzlich geändert)', 'Recent Activity logs')}
                    </span>
                    <div className="flex items-center gap-1.5 border border-gray-200 bg-white p-1 rounded-lg">
                      <button 
                        type="button"
                        onClick={() => handleToggleLayoutMode('table')}
                        className={`p-1.5 rounded-md cursor-pointer transition-all ${layoutMode === 'table' ? 'bg-[#0056D6] text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleToggleLayoutMode('cards')}
                        className={`p-1.5 rounded-md cursor-pointer transition-all ${layoutMode === 'cards' ? 'bg-[#0056D6] text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        <Grid className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty check illustration layout */}
                {filteredDocs.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl py-12 px-6 text-center space-y-4 bg-gray-50/50">
                    <div className="w-14 h-14 bg-blue-50 text-[#0056D6] rounded-full flex items-center justify-center mx-auto shadow-2xs">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="max-w-xs mx-auto space-y-1">
                      <h3 className="text-xs font-bold text-gray-900">{t('Keine Dokumente vorhanden', 'No documents found')}</h3>
                      <p className="text-[11px] text-gray-500 leading-normal">{t('Bisher wurden in diesem Bereich keine passenden Dateien abgelegt.', 'No matching documents have been uploaded in this section yet.')}</p>
                    </div>
                    <button 
                      id="btn-empty-upload-trigger"
                      type="button"
                      className="px-3.5 py-2 bg-[#0056D6] text-white hover:bg-[#0041A3] rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
                      onClick={triggerFileInput}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('Datei hochladen', 'Upload Document')}</span>
                    </button>
                  </div>
                ) : (
                  layoutMode === 'cards' ? (
                    /* Elegant visual Cards Grid system */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredDocs.map((doc) => {
                        const latest = doc.versions[0] || {
                          version: 1,
                          fileName: 'dummy',
                          originalName: doc.name,
                          size: '0.1 MB',
                          uploadedBy: 'System',
                          uploadedByEmail: '',
                          uploadedAt: doc.lastModified
                        };
                        const ext = path.extname(doc.name).toLowerCase();
                        const isSpreadsheet = ext === '.xlsx' || ext === '.xls';
                        const isDoc = ext === '.docx' || ext === '.doc';
                        const isPpt = ext === '.pptx' || ext === '.ppt';
                        const isPdf = ext === '.pdf';

                        return (
                          <div key={doc.id} className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-xs transition-shadow relative group flex flex-col justify-between min-h-[170px] text-left">
                            <div>
                              <div className="flex items-start justify-between gap-1.5 mb-2.5">
                                <div className="flex items-center gap-2 text-left">
                                  {isSpreadsheet ? (
                                    <FileSpreadsheet className="w-7 h-7 text-emerald-600 shrink-0 bg-emerald-50 p-1 rounded-lg" />
                                  ) : (
                                    <FileText className="w-7 h-7 text-blue-600 shrink-0 bg-blue-50 p-1 rounded-lg" />
                                  )}
                                  <div className="max-w-[150px] text-left">
                                    <h4 className="text-xs font-bold text-gray-900 truncate" title={doc.name}>{doc.name}</h4>
                                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium uppercase">
                                      {isSpreadsheet ? 'Excel' : isDoc ? 'Word' : isPpt ? 'PowerPoint' : isPdf ? 'PDF' : t('Datei', 'File')}
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                  doc.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  doc.status === 'Needs Revision' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                  'bg-slate-50 text-slate-700 border border-slate-200'
                                }`}>
                                  {doc.status}
                                </span>
                              </div>

                              <div className="mt-3 space-y-1.5 text-[10px] text-gray-500">
                                <div className="flex justify-between">
                                  <span>{t('Revision:', 'Revision:')}</span>
                                  <span className="font-extrabold text-blue-700">v{doc.latestVersion}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>{t('Datum:', 'Modified:')}</span>
                                  <span className="font-medium text-gray-700 truncate">{formatBadgedDate(doc.lastModified)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>{t('Inhaber:', 'Owner:')}</span>
                                  <span className="font-semibold text-gray-800 truncate" title={doc.ownerEmail}>{latest.uploadedBy}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between gap-1">
                              {/* Icon comments count indicator */}
                              <button 
                                onClick={() => setActiveCommentSection(activeCommentSection === doc.id ? null : doc.id)}
                                className="text-gray-400 hover:text-[#0056D6] p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-extrabold"
                                title={t('Diskussion einblenden', 'View discussion')}
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                {doc.comments.length > 0 && <span>{doc.comments.length}</span>}
                              </button>

                              {/* Right contextual tool actions list */}
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => setPreviewDoc(doc)}
                                  className="p-1 text-gray-500 hover:text-[#0056D6] hover:bg-slate-50 rounded"
                                  title={t('Dokumenten-Vorschau', 'Inline Preview')}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button 
                                  onClick={() => {
                                    if (fileInputRef.current) {
                                      fileInputRef.current.removeAttribute('multiple');
                                      fileInputRef.current.onchange = (ev: any) => {
                                        if (ev.target.files && ev.target.files[0]) {
                                          uploadFileLocally(ev.target.files[0], doc.id);
                                        }
                                      };
                                      fileInputRef.current.click();
                                    }
                                  }}
                                  className="p-1 text-gray-500 hover:text-emerald-700 hover:bg-slate-50 rounded"
                                  title={t('Neue Version hochladen', 'Upload New Version')}
                                >
                                  <History className="w-3.5 h-3.5" />
                                </button>

                                <button 
                                  onClick={() => {
                                    setEditingNameDocId(doc.id);
                                    setNewNameText(doc.name);
                                  }}
                                  className="p-1 text-gray-500 hover:text-[#0056D6] hover:bg-slate-50 rounded"
                                  title={t('Umbenennen', 'Rename')}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <a 
                                  href={`/api/documents/${doc.id}/download/${doc.latestVersion}`}
                                  download
                                  className="p-1 text-[#0056D6] hover:bg-blue-50 rounded inline-flex"
                                  title={t('Herunterladen', 'Download')}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>

                                {/* Folder organize dropdown */}
                                <select 
                                  className="text-[9px] text-gray-600 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded p-0.5 cursor-pointer max-w-[65px]"
                                  value={docFolders[doc.id] || ''}
                                  onChange={(e) => handleMoveFileToFolder(doc.id, e.target.value || null)}
                                >
                                  <option value="">{t('Ablage...', 'Move...')}</option>
                                  {folders.map(f => (
                                    <option key={f} value={f}>{formatPathForDropdown(f)}</option>
                                  ))}
                                </select>

                                {isOwner && (
                                  <button 
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                                    title={t('Dokument löschen', 'Delete')}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Clean responsive Table Row layout */
                    <div className="border border-gray-100 rounded-xl overflow-x-auto bg-white">
                      <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                            <th className="py-3 px-4">{t('Dateiname', 'File Name')}</th>
                            <th className="py-3 px-4">{t('Typ', 'Type')}</th>
                            <th className="py-3 px-4">{t('Version', 'Version')}</th>
                            <th className="py-3 px-4">{t('Letzte Änderung', 'Last Modified')}</th>
                            <th className="py-3 px-4">{t('Eigentümer', 'Owner')}</th>
                            <th className="py-3 px-4 text-right">{t('Aktionen', 'Actions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredDocs.map((doc) => {
                            const latest = doc.versions[0] || {
                              version: 1,
                              fileName: 'dummy',
                              originalName: doc.name,
                              size: '0.1 MB',
                              uploadedBy: 'System',
                              uploadedByEmail: '',
                              uploadedAt: doc.lastModified
                            };
                            const ext = path.extname(doc.name).toLowerCase();
                            const isSpreadsheet = ext === '.xlsx' || ext === '.xls';
                            const isDoc = ext === '.docx' || ext === '.doc';
                            const isPpt = ext === '.pptx' || ext === '.ppt';
                            const isPdf = ext === '.pdf';

                            return (
                              <tr key={doc.id} className="hover:bg-slate-50/40 text-xs text-gray-700">
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    {isSpreadsheet ? (
                                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                                    ) : (
                                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                    )}
                                    
                                    {editingNameDocId === doc.id ? (
                                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                        <input 
                                          id={`input-rename-${doc.id}`}
                                          type="text"
                                          className="border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-800 focus:outline-[#0056D6]"
                                          defaultValue={doc.name}
                                          onChange={(e) => setNewNameText(e.target.value)}
                                          autoFocus
                                        />
                                        <button 
                                          id={`btn-save-rename-${doc.id}`}
                                          type="button"
                                          className="p-1 px-2 bg-[#0056D6] text-white rounded text-[10px] font-bold cursor-pointer"
                                          onClick={() => handleRenameDocument(doc.id)}
                                        >
                                          {t('Speichern', 'Save')}
                                        </button>
                                        <button 
                                          id={`btn-cancel-rename-${doc.id}`}
                                          type="button"
                                          className="p-1 px-2 bg-gray-200 text-gray-700 rounded text-[10px] font-bold cursor-pointer"
                                          onClick={() => setEditingNameDocId(null)}
                                        >
                                          {t('Abbrechen', 'X')}
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span 
                                          className="font-bold text-gray-900 hover:text-[#0056D6] cursor-pointer max-w-[180px] sm:max-w-xs truncate"
                                          onClick={() => setPreviewDoc(doc)}
                                        >
                                          {doc.name}
                                        </span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                                          doc.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                                          doc.status === 'Needs Revision' ? 'bg-amber-50 text-amber-700' :
                                          'bg-gray-100 text-gray-600'
                                        }`}>
                                          {doc.status}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-gray-600 uppercase font-medium text-[10px]">
                                  {isSpreadsheet ? 'Excel' : isDoc ? 'Word' : isPpt ? 'PowerPoint' : isPdf ? 'PDF' : t('Datei', 'File')}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="bg-blue-50 text-[#0056D6] border border-blue-100 px-2 py-0.5 rounded font-bold text-[10px]">
                                    v{doc.latestVersion}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-gray-500 text-[10px]">
                                  {formatBadgedDate(doc.lastModified)}
                                </td>

                                <td className="py-3.5 px-4 text-gray-700 truncate font-semibold block max-w-[120px] mt-2">
                                  {latest.uploadedBy}
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex justify-end items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    {/* Preview */}
                                    <button 
                                      type="button"
                                      className="p-1 px-2 bg-slate-50 text-gray-600 hover:text-[#0056D6] hover:bg-blue-50 rounded text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer"
                                      onClick={() => setPreviewDoc(doc)}
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>{t('Vorschau', 'Preview')}</span>
                                    </button>

                                    {/* Download */}
                                    <a 
                                      href={`/api/documents/${doc.id}/download/${latest.version}`}
                                      download={doc.name}
                                      className="p-1 px-2 bg-slate-50 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded text-[10px] font-semibold flex items-center gap-0.5 inline-flex"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>{t('Laden', 'Download')}</span>
                                    </a>

                                    {/* Comments info counter */}
                                    <button 
                                      type="button"
                                      className="p-1 px-2 bg-slate-50 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer"
                                      onClick={() => setActiveCommentSection(activeCommentSection === doc.id ? null : doc.id)}
                                    >
                                      <MessageSquare className="w-3 h-3" />
                                      <span>{doc.comments.length}</span>
                                    </button>

                                    {/* Replace */}
                                    <button 
                                      type="button"
                                      title={t('Neue Version hochladen', 'Upload New Version')}
                                      className="p-1 text-gray-500 hover:text-emerald-705 hover:bg-slate-100 rounded cursor-pointer"
                                      onClick={() => {
                                        if (fileInputRef.current) {
                                          fileInputRef.current.removeAttribute('multiple');
                                          fileInputRef.current.onchange = (e) => {
                                            const target = e.target as HTMLInputElement;
                                            if (target && target.files && target.files[0]) {
                                              uploadFileLocally(target.files[0], doc.id);
                                            }
                                          };
                                          fileInputRef.current.click();
                                        }
                                      }}
                                    >
                                      <History className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Rename */}
                                    <button 
                                      type="button"
                                      className="p-1 text-gray-500 hover:text-[#0056D6] rounded cursor-pointer"
                                      onClick={() => { setEditingNameDocId(doc.id); setNewNameText(doc.name); }}
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Folder organize dropdown table */}
                                    <select 
                                      className="text-[9px] text-gray-600 bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded p-1 cursor-pointer max-w-[65px]"
                                      value={docFolders[doc.id] || ''}
                                      onChange={(e) => handleMoveFileToFolder(doc.id, e.target.value || null)}
                                    >
                                      <option value="">{t('Ablage...', 'Move...')}</option>
                                      {folders.map(f => (
                                        <option key={f} value={f}>{formatPathForDropdown(f)}</option>
                                      ))}
                                    </select>

                                    {/* Delete (Owner only) */}
                                    {isOwner && (
                                      <button 
                                        type="button"
                                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                                        onClick={() => handleDeleteDocument(doc.id)}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* Inline Comment thread collapsible drawer */}
                <AnimatePresence>
                  {activeCommentSection && (
                    (() => {
                      const commentsDoc = documents.find(d => d.id === activeCommentSection);
                      if (!commentsDoc) return null;
                      return (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 overflow-hidden"
                        >
                          <div className="flex items-center justify-between pb-2 border-b mb-3">
                            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4 text-indigo-600" />
                              <span>{t(`Diskussion zu: ${commentsDoc.name}`, `Discussion Thread: ${commentsDoc.name}`)}</span>
                            </span>
                            <button onClick={() => setActiveCommentSection(null)} className="text-gray-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                          </div>

                          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                            {commentsDoc.comments.length === 0 ? (
                              <p className="text-slate-400 text-xs italic py-2 text-center">{t('Noch keine Kommentare hinterlegt. Starten Sie das Gespräch!', 'No feedback yet. Start the conversation!')}</p>
                            ) : (
                              commentsDoc.comments.map((comm) => (
                                <div key={comm.id} className="bg-white p-2.5 rounded-lg border border-slate-100 text-[11px] leading-relaxed">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-800">{comm.userName} <span className="font-medium text-[9px] text-slate-500">({comm.userEmail})</span></span>
                                    <span className="text-slate-400 text-[8px] font-mono">{formatBadgedDate(comm.timestamp)}</span>
                                  </div>
                                  <p className="text-slate-700">{comm.text}</p>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="flex gap-2">
                            <input 
                              id={`input-new-comment-${commentsDoc.id}`}
                              type="text"
                              className="flex-1 bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0056D6]"
                              placeholder={t('Schreibe einen Kommentar...', 'Type a comment...')}
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handlePostComment(commentsDoc.id); }}
                            />
                            <button 
                              id={`submit-comment-${commentsDoc.id}`}
                              type="button"
                              className="px-3.5 py-1.5 bg-[#0056D6] hover:bg-[#0041A3] text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1"
                              onClick={() => handlePostComment(commentsDoc.id)}
                            >
                              <Send className="w-3 h-3 text-white" />
                              <span>{t('Senden', 'Send')}</span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })()
                  )}
                </AnimatePresence>

                {/* Revision Stand Selector / Version History Sidebar drawer */}
                <AnimatePresence>
                  {versionHistoryDrawerDocId && (
                    (() => {
                      const histDoc = documents.find(d => d.id === versionHistoryDrawerDocId);
                      if (!histDoc) return null;
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: 200 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 200 }}
                          className="p-4 bg-slate-50/90 border-t border-slate-200 rounded-xl space-y-3"
                        >
                          <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-1.5">
                              <History className="w-4 h-4 text-blue-600 animate-spin-slow" />
                              <span className="text-xs font-bold text-gray-900">{t(`Versionsverlauf: ${histDoc.name}`, `Revision Backlog: ${histDoc.name}`)}</span>
                            </div>
                            <button onClick={() => setVersionHistoryDrawerDocId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                          </div>

                          <p className="text-[10px] text-gray-500 leading-normal">{t('Wählen Sie einen früheren Stand, um diesen als neueste Version wiederherzustellen. Der aktuelle Zustand bleibt als Revision erhalten.', 'Select a previous state to restore. The current state will be preserved as a new version.')}</p>

                          <div className="space-y-1.5 max-h-60 overflow-y-auto">
                            {histDoc.versions.map((ver, idx) => {
                              const isCurrent = idx === 0;
                              return (
                                <div key={ver.version} className={`p-2.5 rounded-lg border flex items-center justify-between ${isCurrent ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100'}`}>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-[11px] text-gray-900">Version v{ver.version}</span>
                                      {isCurrent && <span className="bg-indigo-600 text-[8px] text-white font-extrabold px-1 rounded uppercase tracking-wider">{t('Aktuell', 'Current')}</span>}
                                    </div>
                                    <div className="text-[9px] text-gray-500 space-y-0.5 mt-1">
                                      <div>By: {ver.uploadedBy} ({ver.uploadedByEmail})</div>
                                      <div>Time: {formatBadgedDate(ver.uploadedAt)}</div>
                                      <div>Size: {ver.size}</div>
                                    </div>
                                  </div>

                                  <div className="flex gap-1.5">
                                    {!isCurrent && (
                                      <button 
                                        id={`btn-restore-${histDoc.id}-v${ver.version}`}
                                        type="button"
                                        className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded text-[10px] font-bold cursor-pointer"
                                        onClick={() => handleRestoreVersion(histDoc.id, ver.version)}
                                      >
                                        {t('Wiederherstellen', 'Restore')}
                                      </button>
                                    )}
                                    {isOwner && (
                                      <button 
                                        id={`btn-del-version-${histDoc.id}-v${ver.version}`}
                                        type="button"
                                        className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                                        onClick={() => handleDeleteVersion(histDoc.id, ver.version)}
                                        title={t('Diese Version löschen', 'Delete this version')}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })()
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ---------------- 2. RECENT ACTIVITY LIST FEED TAB ---------------- */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">{t('Letzte Aktivitäten im Portal', 'Recent Workspace Activities')}</h3>
                  <button onClick={loadWorkspaceData} className="p-1 text-gray-500 hover:text-indigo-600" title={t('Aktualisieren', 'Refresh')}><RefreshCw className="w-4 h-4" /></button>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden bg-white divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {activities.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 italic text-xs">{t('Noch keine Revisionsaktivitäten durchgeführt.', 'No revisions or changes recorded yet.')}</div>
                  ) : (
                    activities.map((act) => {
                      return (
                        <div key={act.id} className="p-3.5 flex items-start gap-3 hover:bg-gray-50/50">
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            act.type === 'upload' ? 'bg-blue-100 text-blue-700' :
                            act.type === 'version_update' ? 'bg-cyan-100 text-cyan-700' :
                            act.type === 'comment' ? 'bg-indigo-100 text-indigo-700' :
                            act.type === 'status_change' ? 'bg-amber-100 text-amber-700' :
                            act.type === 'invite' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 leading-normal">{act.details}</p>
                            <div className="flex items-center justify-between text-[10px] text-gray-500">
                              <span>By: <strong>{act.userName}</strong> ({act.userEmail})</span>
                              <span className="font-mono">{formatBadgedDate(act.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ---------------- 3. DRAG & DROP FILE UPLOADER TAB ---------------- */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900">{t('Neues Dokument hochladen & freigeben', 'Upload & Distribute New Document')}</h3>
                <p className="text-xs text-gray-500">{t('Laden Sie Verträge, Rechnungen, Leistungsnachweise oder Pflegeunterlagen in das sichere Emmasco-Portal. Alle Übertragungen sind Ende-zu-Ende gesichert.', 'Upload files securely. All data is protected inside private directories.')}</p>

                {/* Drag and drop interactive canvas */}
                <div 
                  id="drag-drop-container"
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${dragActive ? 'border-indigo-600 bg-indigo-50/40 scale-[0.99]' : 'border-gray-200 hover:border-[#0056D6] hover:bg-slate-50'}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <input 
                    id="input-hidden-uploader"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileInputChange}
                    accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.png,.jpg,.jpeg,.gif,.webp"
                  />
                  <div className="w-12 h-12 bg-blue-50 text-[#0056D6] rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                    <Upload className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1">{t('Ziehen Sie Dateien hierher oder klicken Sie zum Suchen', 'Drag and drop files here or click to browse')}</h4>
                  <p className="text-[10px] text-gray-500 max-w-xs mx-auto leading-relaxed">{t('Maximale Dateigröße: 100 MB. Erlaubte Typen: Word (.docx), Excel (.xlsx), PowerPoint, PDFs und Bilder.', 'Max file size: 100 MB. Direct Web editing supported for DOCX and XLSX spreadsheets.')}</p>
                </div>
              </div>
            )}

            {/* ---------------- 4. COLLABORATORS & ACCESS CONTROL TAB ---------------- */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                {/* Invite Manager form for Owner */}
                {isOwner ? (
                  <div className="bg-[#FAFBFD] p-5 border border-gray-100 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <UserPlus className="w-4 h-4 text-[#0056D6]" />
                      <h3 className="text-xs font-bold text-gray-900">{t('Teammitglied per E-Mail einladen', 'Invite Collaborator by Email')}</h3>
                    </div>

                    <form onSubmit={handleInviteCollaborator} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-5 space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500 block">{t('Name des Partners / Mitarbeiters', 'Partner or Employee Name')}</label>
                        <input 
                          id="input-invite-name"
                          type="text"
                          required
                          placeholder="John Collaborator"
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D6]"
                          value={inviteName}
                          onChange={(e) => setInviteName(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-5 space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500 block">{t('E-Mail-Adresse', 'Email Address')}</label>
                        <input 
                          id="input-invite-email"
                          type="email"
                          required
                          placeholder="collab@emmasco.de"
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0056D6]"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <button 
                          id="btn-invitation-submit"
                          type="submit"
                          className="w-full py-2 bg-[#0056D6] hover:bg-[#0041A3] active:bg-[#003380] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          {t('Einladen', 'Invite')}
                        </button>
                      </div>
                    </form>

                    {inviteSuccess && (
                      <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs leading-normal">
                        {inviteSuccess}
                      </div>
                    )}
                    {inviteError && (
                      <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs leading-normal">
                        {inviteError}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs space-y-2 leading-relaxed">
                    <p className="font-bold">{t('Privates Emmasco Netzwerk', 'Private Emmasco Network')}</p>
                    <p>{t('Ihr Status als Kollaborateur ist aktiv. Nur der Eigentümer (Solomon Egazi) kann neue Mitglieder einladen, den Zugriff sperren oder die Revisionsberechtigungen bearbeiten.', 'Your status is active. Only the project owner (Solomon Egazi) has the authority to manage members, revoke access, or alter repository privileges.')}</p>
                  </div>
                )}

                {/* Direct display of Active online sessions (to prove auditability) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                    <span>{t('Gegenwärtig aktive Sitzungen', 'Currently Active Workspace Sessions')}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {onlineUsers.length === 0 ? (
                      <div className="p-3 border border-gray-200 rounded-lg text-xs text-gray-400 italic bg-gray-50">{t('Keine weiteren Sitzungen aktiv.', 'No other users online.')}</div>
                    ) : (
                      onlineUsers.map(online => (
                        <div key={online.email} className="p-3 border border-gray-100 rounded-lg bg-emerald-50/50 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-gray-800">{online.name}</span>
                            <div className="text-[10px] text-gray-500">{online.email}</div>
                          </div>
                          <div className="text-right">
                            <span className="bg-emerald-600/10 text-emerald-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded tracking-wide uppercase">{online.role}</span>
                            <div className="text-[8px] text-gray-400 mt-1">{t('Zuletzt aktiv:', 'Last touch:')} {new Date(online.lastSeen).toLocaleTimeString('de-DE')}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Partners Approval table (Owner control board) */}
                {isOwner && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{t('Mitgliederliste & Registrierungs-Freigaben', 'Collaborators Approval Panel')}</span>
                    </h3>

                    <div className="border border-gray-100 bg-white rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs border-collapse divide-y divide-gray-100">
                        <thead className="bg-[#FAFBFD] font-bold text-gray-600 text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="py-2.5 px-3">{t('Kollaborateur', 'Collaborator')}</th>
                            <th className="py-2.5 px-3">{t('Zugeordneter Status', 'Database Access Authorization')}</th>
                            <th className="py-2.5 px-3 text-right">{t('Berechtigungs-Aktion', 'Authorization Switch')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {collaborators.map(user => {
                            return (
                              <tr key={user.email} className="hover:bg-gray-50/50">
                                <td className="py-3 px-3">
                                  <div className="font-bold text-gray-800">{user.name}</div>
                                  <div className="text-[10px] text-gray-500">{user.email}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    user.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    user.status === 'Revoked' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}>
                                    {user.status === 'Approved' ? t('Aktiver Zugriff', 'Access Approved') :
                                     user.status === 'Revoked' ? t('Zugriff widerrufen (Sperre)', 'Access Suspended') :
                                     t('Ausstehende Freischaltung', 'Access Pending')}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    {user.status !== 'Approved' && (
                                      <button 
                                        id={`btn-approve-user-${user.email}`}
                                        type="button"
                                        onClick={() => handleUpdateUserStatus(user.email, 'Approved')}
                                        className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                                      >
                                        {t('Freischalten', 'Approve')}
                                      </button>
                                    )}
                                    {user.status !== 'Revoked' && (
                                      <button 
                                        id={`btn-revoke-user-${user.email}`}
                                        type="button"
                                        onClick={() => handleUpdateUserStatus(user.email, 'Revoked')}
                                        className="px-2.5 py-1 text-[10px] font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded cursor-pointer"
                                      >
                                        {t('Sperren', 'Revoke')}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

        </main>
      </div>

      {/* ---------------- 5. PREMIUM FULL-SCREEN BROWSER DOCUMENT INLINE PREVIEW ---------------- */}
      <AnimatePresence>
        {previewDoc && (
          (() => {
            const ext = path.extname(previewDoc.name).toLowerCase();
            const latestVer = previewDoc.versions[0];
            const isEditableOnline = ext === '.docx' || ext === '.doc' || ext === '.xls' || ext === '.xlsx';
            
            return (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/85 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-6"
              >
                <div id="inline-preview-workspace" className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] shadow-2xl overflow-hidden flex flex-col">
                  {/* Preview Topbar Controls */}
                  <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg text-indigo-400">
                        {ext === '.xlsx' || ext === '.xls' ? <FileSpreadsheet className="w-5 h-5 text-emerald-500" /> : <FileText className="w-5 h-5 text-sky-400" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold truncate max-w-xs sm:max-w-md">{previewDoc.name}</h3>
                        <p className="text-[10px] text-gray-400">
                          {t('Version: ', 'Revision: ')}v{latestVer?.version} | By: {latestVer?.uploadedBy} | Size: {latestVer?.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Live Online text editor conversion trigger */}
                      {isEditableOnline && (
                        <button 
                          id="btn-preview-edit-action"
                          type="button"
                          className="px-3 py-1.5 bg-[#0056D6] hover:bg-[#0041A3] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
                          onClick={() => {
                            setEditingOnlineDoc(previewDoc);
                            setOnlineTextChange(latestVer?.textDraft || '');
                            setPreviewDoc(null);
                          }}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{t('Im Browser bearbeiten', 'Edit Online')}</span>
                        </button>
                      )}

                      {/* Download original copy */}
                      <a 
                        id="btn-preview-download-link"
                        href={`/api/documents/${previewDoc.id}/download/${latestVer?.version}`}
                        download={previewDoc.name}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t('Download', 'Download')}</span>
                      </a>

                      <button 
                        id="btn-preview-close"
                        onClick={() => setPreviewDoc(null)} 
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Simulated application sandbox inside secure portal */}
                  <div className="flex-1 overflow-auto bg-slate-100 p-4 sm:p-8 flex items-center justify-center">
                    
                    {/* SIMULATED PDF CONTAINER */}
                    {(ext === '.pdf') && (
                      <div className="bg-white max-w-2xl w-full rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-between space-y-4">
                        <div className="w-full flex items-center justify-between border-b pb-3 text-xs text-gray-500">
                          <span className="font-bold text-gray-700">PDF Reader Frame v1.0</span>
                          <div className="flex gap-2">
                            <button onClick={() => setPreviewZoomLevel(Math.max(50, previewZoomLevel - 10))} className="p-1 hover:bg-gray-100 rounded" title={t('Verkleinern', 'Zoom Out')}><ZoomOut className="w-4 h-4" /></button>
                            <span className="font-bold self-center">{previewZoomLevel}%</span>
                            <button onClick={() => setPreviewZoomLevel(Math.min(200, previewZoomLevel + 10))} className="p-1 hover:bg-gray-100 rounded" title={t('Vergrößern', 'Zoom In')}><ZoomIn className="w-4 h-4" /></button>
                          </div>
                        </div>

                        {/* Page sheet */}
                        <div 
                          className="border w-full h-[50vh] bg-slate-50 relative rounded flex flex-col p-8 select-none transition-all duration-150 overflow-auto text-xs text-slate-800 space-y-4"
                          style={{ transform: `scale(${previewZoomLevel / 100})`, transformOrigin: 'top center' }}
                        >
                          <div className="text-center font-bold text-sm border-b pb-2 mb-4">EMMASCO REINIGUNGSTEAM BERLIN - DATASHEET</div>
                          <p className="leading-relaxed">Hiermit werden die Transparenzen nach § 45a SGB XI für private Pflegekassen in Abstimmung mit solomonegazi@gmail.com deklariert.</p>
                          <p className="leading-relaxed">Das Dokument enthält vertrauliche Leistungsabrechnungen des Trägers „Emmasco“. Jede missbräuchliche Verwendung wird strafrechtlich verfolgt.</p>
                          <div className="mt-auto pt-4 text-center text-[10px] text-gray-400 border-t">{t('Seite 1 von 1 (Signiert)', 'Page 1 of 1 (Securely Signed)')}</div>
                        </div>
                      </div>
                    )}

                    {/* SIMULATED EXCEL SHEET SPREADSHEET */}
                    {(ext === '.xlsx' || ext === '.xls') && (
                      <div className="bg-white w-full rounded-xl border border-gray-200 flex flex-col overflow-hidden max-h-[80vh] shadow-sm">
                        
                        {/* Selector Tabs for sheets */}
                        <div className="bg-slate-50 border-b border-gray-200 p-2 flex items-center gap-1 text-xs">
                          {['Tabelle 1', 'Prognose 2026', 'Abrechnungs-Rohdaten'].map((sheet) => (
                            <button 
                              key={sheet}
                              className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer ${previewSheetIdx === sheet ? 'bg-emerald-600 text-white text-[11px]' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                              onClick={() => setPreviewSheetIdx(sheet)}
                            >
                              {sheet}
                            </button>
                          ))}
                        </div>

                        <div className="p-3 bg-gray-50/50 border-b border-gray-200 text-xs text-gray-500 font-mono flex gap-4">
                          <span><strong>Inspector:</strong> Cell B4</span>
                          <span><strong>Formula:</strong> =SUM(B2:B3)</span>
                        </div>

                        {/* Cells layout layout */}
                        <div className="flex-1 overflow-auto p-4">
                          {previewSheetIdx === 'Tabelle 1' ? (
                            <table className="w-full text-left text-xs font-mono border-collapse border border-gray-200">
                              <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                  <th className="border p-2 bg-gray-200 w-10 text-center">#</th>
                                  <th className="border p-2">A (Kategorie)</th>
                                  <th className="border p-2">B (Summe)</th>
                                  <th className="border p-2">C (Status)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border p-2 bg-gray-50 text-center font-bold">1</td>
                                  <td className="border p-2 font-bold text-gray-800">Umsatzprognose Berlin-Süd</td>
                                  <td className="border p-2 font-bold text-emerald-700">124.500 €</td>
                                  <td className="border p-2 text-emerald-600 font-bold">Freigegeben</td>
                                </tr>
                                <tr>
                                  <td className="border p-2 bg-gray-50 text-center font-bold">2</td>
                                  <td className="border p-2 font-bold text-gray-800">Umsatzprognose Berlin-Mitte</td>
                                  <td className="border p-2 font-bold text-emerald-700">150.000 €</td>
                                  <td className="border p-2 text-emerald-600 font-bold">Freigegeben</td>
                                </tr>
                                <tr>
                                  <td className="border p-2 bg-gray-50 text-center font-bold">3</td>
                                  <td className="border p-2 font-bold text-gray-800">Umsatzprognose Brandenburg</td>
                                  <td className="border p-2 font-bold text-emerald-700">45.000 €</td>
                                  <td className="border p-2 text-amber-600 font-bold">In Prüfung</td>
                                </tr>
                                <tr className="bg-emerald-50">
                                  <td className="border p-2 bg-emerald-100 text-center font-bold">4</td>
                                  <td className="border p-2 font-bold text-emerald-900">Total Summe (Kassensatz)</td>
                                  <td className="border p-2 font-bold text-emerald-900">319.500 €</td>
                                  <td className="border p-2 text-emerald-800 font-bold">Automatisch berechnet</td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-xs text-gray-400 italic text-center p-8">{t('Keine weiteren Datenzeilen auf diesem Blatt.', 'No other data entries on this worksheet.')}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SIMULATED WORD (.docx) */}
                    {(ext === '.docx' || ext === '.doc') && (
                      <div className="bg-white max-w-2xl w-full rounded-xl border border-gray-200 overflow-hidden flex flex-col p-6 shadow-sm">
                        <div className="border-b pb-3 mb-4 text-xs font-bold text-[#0056D6] flex justify-between">
                          <span>Emmasco Online Text-Document Document v1.2</span>
                          <span className="text-gray-400 font-medium">Read Only</span>
                        </div>
                        <div className="h-[45vh] overflow-y-auto text-xs text-gray-800 space-y-4 leading-relaxed font-sans scroll-smooth">
                          {latestVer?.textDraft ? (
                            latestVer.textDraft.split('\n').map((para, pIdx) => (
                              <p key={pIdx} className={para.startsWith('§') || para.startsWith('KOOPERATIONSVERTRAG') ? 'font-bold text-slate-900 text-sm' : ''}>{para}</p>
                            ))
                          ) : (
                            <p>{t('Kein beschreibender Entwurf für dieses Dokument verfügbar.', 'No desc content draft available for this file.')}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SIMULATED POWERPOINT (.pptx) */}
                    {(ext === '.pptx' || ext === '.ppt') && (
                      <div className="bg-white max-w-2xl w-full rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                        <div className="bg-slate-900 p-8 h-[40vh] flex flex-col justify-between text-white relative">
                          <div className="absolute top-2 right-2 text-[10px] text-[#0056D6] font-bold">Emmasco Pitch Deck</div>
                          
                          {previewSlideIdx === 0 && (
                            <div className="space-y-4 animate-fade-in text-center my-auto">
                              <h2 className="text-lg font-bold uppercase tracking-tight text-indigo-400">Emmasco Reinigungsteam 2026</h2>
                              <p className="text-xs text-slate-300">Abrechnungskonzepte, Personalschulung & Kassenabrechnung</p>
                            </div>
                          )}

                          {previewSlideIdx === 1 && (
                            <div className="space-y-4 animate-fade-in my-auto">
                              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Abrechnung SGB XI §45a</h3>
                              <p className="text-xs line-clamp-4">Direkte Übermittlung von Entlastungsleistungen an private und gesetzliche Pflegekassen zur Entlastung hilfsbedürftiger Angehöriger.</p>
                            </div>
                          )}

                          {previewSlideIdx === 2 && (
                            <div className="space-y-4 animate-fade-in text-center my-auto">
                              <h2 className="text-base font-bold text-indigo-400">Vielen Dank für Ihre Aufmerksamkeit!</h2>
                              <p className="text-[10px] text-gray-400">Rückfragen an: solomonegazi@gmail.com</p>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-white/10 pt-2 shrink-0">
                            <span>Slide {previewSlideIdx + 1} of 3</span>
                            <div className="flex gap-2">
                              <button 
                                className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer text-white text-[10px]"
                                onClick={() => setPreviewSlideIdx(Math.max(0, previewSlideIdx - 1))}
                              >
                                Prev
                              </button>
                              <button 
                                className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer text-white text-[10px]"
                                onClick={() => setPreviewSlideIdx(Math.min(2, previewSlideIdx + 1))}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* IMAGES AND RAW FORMATS */}
                    {!(ext === '.pdf' || ext === '.docx' || ext === '.doc' || ext === '.xlsx' || ext === '.xls' || ext === '.pptx' || ext === '.ppt') && (
                      <div className="bg-white p-6 rounded-xl border max-w-sm text-center space-y-4">
                        <div className="w-16 h-16 bg-cyan-50 text-cyan-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <Eye className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{previewDoc.name}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{t('Rohdatei-Ebene (Kein Web-Rendering verfügbar, bitte herunterladen)', 'Raw binary layer (Preview unavailable, click Download to view)')}</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            );
          })()
        )}
      </AnimatePresence>

      {/* ---------------- 6. BROWSER ONLINE DOCUMENT EDITOR CANVAS ---------------- */}
      <AnimatePresence>
        {editingOnlineDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          >
            <div id="full-online-editor-window" className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-gray-200">
              {/* Editor Head */}
              <div className="bg-[#FAFBFD] border-b border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Edit3 className="w-4 h-4 text-[#0056D6]" />
                    <span>{t('Emmasco Team Online Document Editor v2.1', 'Emmasco Browser Document Workspace')}</span>
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    Editing: <strong>{editingOnlineDoc.name}</strong> | Changes lock dynamically under: <strong>{currentUserName}</strong>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    id="btn-online-editor-save"
                    type="button"
                    disabled={isSavingEdit}
                    onClick={handleSaveOnlineEdit}
                    className="px-4 py-1.5 bg-[#0056D6] hover:bg-[#0041A3] active:bg-[#003380] text-white rounded-lg text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {isSavingEdit ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sichern...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-white" />
                        <span>{t('Neue Version sichern', 'Save as v' + (editingOnlineDoc.latestVersion + 1))}</span>
                      </>
                    )}
                  </button>

                  <button 
                    id="btn-online-close"
                    onClick={() => setEditingOnlineDoc(null)} 
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    {t('Abbrechen', 'Cancel')}
                  </button>
                </div>
              </div>

              {/* Text Writing Area */}
              <div className="flex-1 flex flex-col p-4 bg-slate-50">
                <textarea 
                  id="textarea-online-document-draft"
                  className="w-full flex-1 p-6 bg-white border border-gray-200 rounded-xl resize-none font-mono text-xs text-gray-800 leading-relaxed overflow-y-auto focus:outline-none focus:ring-1 focus:ring-[#0056D6] focus:border-[#0056D6]"
                  placeholder={t('Geben Sie hier Ihre Abänderungen an...', 'Type your document updates here...')}
                  value={onlineTextChange}
                  onChange={(e) => setOnlineTextChange(e.target.value)}
                />

                <div className="mt-2 text-right text-[10px] text-gray-400">
                  {onlineTextChange.length} {t('Zeichen editiert', 'characters edited')}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Simple absolute paths helper mimicking standard Node structure
const path = {
  extname: (filename: string) => {
    return filename.includes('.') ? filename.substring(filename.lastIndexOf('.')) : '';
  }
};
