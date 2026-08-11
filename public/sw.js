self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Spirit & Life";
  const options = {
    body: data.body || "You have a new Spirit & Life update.",
    icon: "/images/brand/spirit-and-life-logo-transparent.png.png",
    badge: "/images/social-image/social-image-logo.jpg",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(clients.openWindow(targetUrl));
});
