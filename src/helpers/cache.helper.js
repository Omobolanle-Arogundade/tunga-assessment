import redis from 'redis';
import config from '../config';

export default class CacheHelper {
 constructor() {
  this.client = redis.createClient({
   port: config.redis.port,
   host: config.redis.host,
  });
 }

 get(key) {
  return new Promise((resolve, reject) => {
   this.client.get(key, (err, result) => {
    if (err) {
     reject(err);
     return;
    }
    resolve(result ? JSON.parse(result) : null);
   });
  });
 }

 set(key, value, expiration) {
  return new Promise((resolve, reject) => {
   const serializedValue = JSON.stringify(value);
   this.client.set(key, serializedValue, 'EX', expiration, (err) => {
    if (err) {
     reject(err);
     return;
    }
    resolve();
   });
  });
 }

 delete(key) {
  return new Promise((resolve, reject) => {
   this.client.del(key, (err, count) => {
    if (err) {
     reject(err);
     return;
    }
    resolve(count > 0);
   });
  });
 }
}
