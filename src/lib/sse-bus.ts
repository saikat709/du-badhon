import { EventEmitter } from "events";

// Global singleton event emitter for server-side SSE notifications
declare global {
  var __lockEventEmitter: EventEmitter | undefined;
}

export const lockEventEmitter: EventEmitter =
  global.__lockEventEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  global.__lockEventEmitter = lockEventEmitter;
}

export const LOCK_EVENTS = {
  UPDATED: "LOCK_UPDATED",
};
