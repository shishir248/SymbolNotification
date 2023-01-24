import * as jspb from 'google-protobuf'



export class Subscription extends jspb.Message {
  getAccess(): boolean;
  setAccess(value: boolean): Subscription;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Subscription.AsObject;
  static toObject(includeInstance: boolean, msg: Subscription): Subscription.AsObject;
  static serializeBinaryToWriter(message: Subscription, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Subscription;
  static deserializeBinaryFromReader(message: Subscription, reader: jspb.BinaryReader): Subscription;
}

export namespace Subscription {
  export type AsObject = {
    access: boolean,
  }
}

export class EmptyParams extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmptyParams.AsObject;
  static toObject(includeInstance: boolean, msg: EmptyParams): EmptyParams.AsObject;
  static serializeBinaryToWriter(message: EmptyParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmptyParams;
  static deserializeBinaryFromReader(message: EmptyParams, reader: jspb.BinaryReader): EmptyParams;
}

export namespace EmptyParams {
  export type AsObject = {
  }
}

export class Notification extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): Notification;

  getMessage(): string;
  setMessage(value: string): Notification;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Notification.AsObject;
  static toObject(includeInstance: boolean, msg: Notification): Notification.AsObject;
  static serializeBinaryToWriter(message: Notification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Notification;
  static deserializeBinaryFromReader(message: Notification, reader: jspb.BinaryReader): Notification;
}

export namespace Notification {
  export type AsObject = {
    title: string,
    message: string,
  }
}

export class Response extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): Response;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response.AsObject;
  static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
  static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response;
  static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
  export type AsObject = {
    message: string,
  }
}

