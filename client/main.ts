import * as grpcWeb from "grpc-web";
import { PushNotificationClient } from "../files/web/NotificationServiceClientPb";
import { Response, SubscribeRequest } from "../files/web/notification_pb";

const htmlInputElement = (id: string) => {
  return <HTMLInputElement>document.getElementById(id);
};

const check = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
};

const registerServiceWorker = async () => {
  navigator.serviceWorker
    .register("/service.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((err) => console.log("Service Worker not registered", err));
  const swRegistration = await navigator.serviceWorker.ready;
  return swRegistration;
};

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
  return true;
};

const subscribe = async () => {
  check();
  const swRegistration = await registerServiceWorker();
  const permission = await requestNotificationPermission();

  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array("YOUR_PUBLIC_VAPID_KEY"),
  });

  const notificationService = new PushNotificationClient("http://localhost:50052", null, null);
  const request = new SubscribeRequest();
  request.setAccessToken("YOUR_ACCESS_TOKEN");
  request.setSubscription(JSON.stringify(subscription));

  const call = notificationService.subscribe(request, null, (err: grpcWeb.RpcError, response: Response) => {
    if (err) {
      console.log(err)
      return
    }
    var reply = document.getElementById("reply");
    reply.textContent = response.getMessage();
    console.log(response);
  });

  // request.setAccess(permission);

  call.on("status", (status: grpcWeb.Status) => {
    console.log("status:", status);
  });
};

// urlBase64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

htmlInputElement("subscribeBtn").addEventListener("click", subscribe);

// htmlInputElement("sendBtn").addEventListener("click", sayHello);
