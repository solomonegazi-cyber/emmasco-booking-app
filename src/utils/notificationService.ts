/**
 * Browser-based Push Notification Service for Emmasco Reinigungsteam
 */

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (!isNotificationSupported()) {
    console.warn('Push Notifications are not supported in this browser.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
}

export function getNotificationPermissionState(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
}

export function triggerBrowserNotification(payload: NotificationPayload) {
  if (!isNotificationSupported()) return;

  if (Notification.permission === 'granted') {
    try {
      const options: NotificationOptions = {
        body: payload.body,
        icon: payload.icon || 'https://emmascoreinigungsteam.de/wp-content/uploads/2026/07/favicon-512.png',
        tag: payload.tag || 'emmasco-status',
        badge: 'https://emmascoreinigungsteam.de/wp-content/uploads/2026/07/favicon-512.png',
        requireInteraction: false,
        silent: false,
        data: payload.data
      };

      const notification = new Notification(payload.title, options);

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        if (payload.data?.url) {
          window.location.href = payload.data.url;
        }
        notification.close();
      };
    } catch (error) {
      console.error('Failed to trigger Notification:', error);
    }
  } else {
    console.log('Notification permission is not granted. Current state:', Notification.permission);
  }
}

/**
 * Specifically triggers booking status notifications
 */
export function sendBookingStatusNotification(
  serviceName: string,
  status: 'assigned' | 'completed',
  cleanerName?: string,
  lang: 'de' | 'en' = 'de'
) {
  let title = '';
  let body = '';

  const isDe = lang === 'de';

  if (status === 'assigned') {
    title = isDe 
      ? 'Buchung zugewiesen! 🎉' 
      : 'Booking Assigned! 🎉';
    
    body = isDe
      ? `Ihre Reinigung für "${serviceName}" wurde zugewiesen.${cleanerName ? ` Reiniger/in: ${cleanerName}.` : ''}`
      : `Your cleaning for "${serviceName}" has been assigned.${cleanerName ? ` Cleaner: ${cleanerName}.` : ''}`;
  } else if (status === 'completed') {
    title = isDe 
      ? 'Reinigung abgeschlossen! ✨' 
      : 'Cleaning Completed! ✨';
    
    body = isDe
      ? `Ihre Reinigung für "${serviceName}" wurde erfolgreich abgeschlossen. Vielen Dank für Ihr Vertrauen!`
      : `Your cleaning for "${serviceName}" has been successfully completed. Thank you for your trust!`;
  } else {
    return; // We only notify for assigned or completed as requested
  }

  triggerBrowserNotification({
    title,
    body,
    icon: 'https://emmascoreinigungsteam.de/wp-content/uploads/2026/07/favicon-512.png',
    tag: `booking-status-${status}`,
    data: {
      url: window.location.origin + '/customer-dashboard'
    }
  });
}
