self.addEventListener("push", function (event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
  });
});

self.addEventListener(
  "notificationclick",
  function (event) {
    console.log("sakfnabf");
    event.notification.close();
    clients.openWindow(event.notification.data);
  },
  false
);
