/**
 * Native Browser & Mobile PWA Push Notification Dispatcher
 */

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('✅ Native Push Notification permission granted.');
      }
    });
  }
}

export function sendAppNotification(title, body) {
  requestNotificationPermission();

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body: body,
            icon: '/app-icon.png',
            badge: '/app-icon.png',
            vibrate: [200, 100, 200],
            tag: 'jsa-finance-notification'
          });
        });
      } else {
        new Notification(title, {
          body: body,
          icon: '/app-icon.png'
        });
      }
    } catch (e) {
      console.error('Push notification trigger error:', e);
    }
  }
}

// ---------------------------------------------------------
// WEB PUSH SUBSCRIPTION LOGIC (For Background Notifications)
// ---------------------------------------------------------
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToWebPush(memberId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const publicVapidKey = 'BA9-0ZQlBcziK6UjV34VgI9Kh-jf2Cl0aFSjLA56ABaBOfFwy1Lfx_6n0ErTrudjh5NHu7wiENXD8mWxwOALc4E';
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    
    const API_BASE = window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:5000/api';
    await fetch(`${API_BASE}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, subscription })
    });
    
    console.log('✅ Web Push Subscription successful for member:', memberId);
  } catch (err) {
    console.error('Web Push Subscription failed:', err);
  }
}
