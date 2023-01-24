import { access } from 'fs';
import * as grpcWeb from 'grpc-web';
import {PushNotificationClient} from '../files/web/NotificationServiceClientPb';
import {EmptyParam, Notification, Subscription, Response, Access} from '../files/web/notification_pb';

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
  const swRegistration = await navigator.serviceWorker.register("sw.js"); //notice the file name
  return swRegistration;
};

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
  return true
};

const sayHello = async  () => {
  const notificationService = new PushNotificationClient('http://localhost:50052', null, null);
  const request = new Notification();
  const access = new Access();


  const sub = notificationService.getAccess(access, null,
    async (err: grpcWeb.RpcError, subscription: Subscription) => {
      check();
      const swRegistration = await registerServiceWorker();
      const permission = await requestNotificationPermission();
      if (err) {
        console.log(err)
        return
      }
      subscription.setAccess(permission);
  });

  const call = notificationService.sendNotification(request, null,
    (err: grpcWeb.RpcError, response: Response) => {
      if (err) {
        console.log(err)
        return
      }

      var reply = document.getElementById("reply");
      reply.textContent = response.getMessage();
        
      console.log(response);
  });

  call.on('status', (status: grpcWeb.Status) => {
    console.log("status:", status);
  });

  sub.on('status', (status: grpcWeb.Status) => {
    console.log("status:", status);
  });

};

htmlInputElement("sendBtn").addEventListener("click", sayHello);