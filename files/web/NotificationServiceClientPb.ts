/**
 * @fileoverview gRPC-Web generated client stub for notifications
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.1
// 	protoc              v0.0.0
// source: notification.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as notification_pb from './notification_pb';


export class PushNotificationClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorGetAccess = new grpcWeb.MethodDescriptor(
    '/notifications.PushNotification/GetAccess',
    grpcWeb.MethodType.UNARY,
    notification_pb.EmptyParams,
    notification_pb.Subscription,
    (request: notification_pb.EmptyParams) => {
      return request.serializeBinary();
    },
    notification_pb.Subscription.deserializeBinary
  );

  getAccess(
    request: notification_pb.EmptyParams,
    metadata: grpcWeb.Metadata | null): Promise<notification_pb.Subscription>;

  getAccess(
    request: notification_pb.EmptyParams,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: notification_pb.Subscription) => void): grpcWeb.ClientReadableStream<notification_pb.Subscription>;

  getAccess(
    request: notification_pb.EmptyParams,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: notification_pb.Subscription) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/notifications.PushNotification/GetAccess',
        request,
        metadata || {},
        this.methodDescriptorGetAccess,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/notifications.PushNotification/GetAccess',
    request,
    metadata || {},
    this.methodDescriptorGetAccess);
  }

  methodDescriptorSendNotification = new grpcWeb.MethodDescriptor(
    '/notifications.PushNotification/SendNotification',
    grpcWeb.MethodType.UNARY,
    notification_pb.Notification,
    notification_pb.Response,
    (request: notification_pb.Notification) => {
      return request.serializeBinary();
    },
    notification_pb.Response.deserializeBinary
  );

  sendNotification(
    request: notification_pb.Notification,
    metadata: grpcWeb.Metadata | null): Promise<notification_pb.Response>;

  sendNotification(
    request: notification_pb.Notification,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: notification_pb.Response) => void): grpcWeb.ClientReadableStream<notification_pb.Response>;

  sendNotification(
    request: notification_pb.Notification,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: notification_pb.Response) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/notifications.PushNotification/SendNotification',
        request,
        metadata || {},
        this.methodDescriptorSendNotification,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/notifications.PushNotification/SendNotification',
    request,
    metadata || {},
    this.methodDescriptorSendNotification);
  }

}

