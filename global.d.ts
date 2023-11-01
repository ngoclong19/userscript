import EventEmitter from './eventemitter3';

declare global {
  var EventEmitter3: typeof EventEmitter;
}
