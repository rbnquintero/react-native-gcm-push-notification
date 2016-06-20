'use strict';

var {
  NativeModules,
  DeviceEventEmitter,
} = require('react-native');

var GcmModule = NativeModules.GcmModule;

var _notifHandlers = new Map();
var _initialNotification = GcmModule && GcmModule.initialNotification;

var DEVICE_NOTIF_EVENT = 'GCMRemoteNotificationReceived';
var NOTIF_REGISTER_EVENT = 'GCMRemoteNotificationRegistered';

class GCMClass {
  static addEventListener(type: string, handler: Function) {
    var listener;
    if (type === 'notification') {
      listener =  DeviceEventEmitter.addListener(
        DEVICE_NOTIF_EVENT,
        (notifData) => {
          GCMClass.isInForeground = notifData.isInForeground;
          var data = JSON.parse(notifData.dataJSON);
          handler(new GCMClass(data));
        }
      );
    } else if (type === 'register') {
      listener = DeviceEventEmitter.addListener(
        NOTIF_REGISTER_EVENT,
        (registrationInfo) => {
          handler(registrationInfo);
        }
      );
    }
    _notifHandlers.set(handler, listener);
  }

  static removeEventListener(type: string, handler: Function) {
    var listener = _notifHandlers.get(handler);
    if (!listener) {
      return;
    }
    listener.remove();
    _notifHandlers.delete(handler);
  }

  static requestPermissions() {
    GcmModule.requestPermissions();
  }

  static stopService() {
    GcmModule.stopService();
  }
  static createNotification(infos) {
    GcmModule.createNotification(infos);
  }

  static popInitialNotification() {
    var initialNotification = _initialNotification &&
      new GCMClass(JSON.parse(_initialNotification));
    _initialNotification = null;
    return initialNotification;
  }

  static subscribeTopic(topic, callback){
    GcmModule.subscribeTopic(topic, callback)
  }

  static subscribeTopicSimple(topic){
    GcmModule.subscribeTopicSimple(topic)
  }

  static unsubscribeTopic(topic, callback){
    GcmModule.unsubscribeTopic(topic, callback)
  }

  static unsubscribeTopicSimple(topic){
    GcmModule.unsubscribeTopic(topic)
  }

  constructor(data) {
    this.data = data;
  }
}

GCMClass.isInForeground = true;

module.exports = GCMClass;
