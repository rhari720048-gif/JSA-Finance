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
            icon: '/logo.png',
            badge: '/logo.png',
            vibrate: [200, 100, 200],
            tag: 'jsa-finance-notification'
          });
        });
      } else {
        new Notification(title, {
          body: body,
          icon: '/logo.png'
        });
      }
    } catch (e) {
      console.error('Push notification trigger error:', e);
    }
  }
}
