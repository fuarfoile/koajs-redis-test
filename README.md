koajs-redis-test
===============================
Для подключения к redis использовался [node-redis](https://github.com/NodeRedis/node-redis):
```sh
$ npm install redis
```

Старт:
```sh
$ node ./index.js
```

Для прохождения тестов через 'npm test':
```sh
curl -XPOST   "127.0.0.1:8081/users" -d '{"id":0, "name": "test0" }' -H 'Content-Type: application/json'
curl -XPOST   "127.0.0.1:8081/users" -d '{"id":1, "name": "test1" }' -H 'Content-Type: application/json'
curl -XPOST   "127.0.0.1:8081/users" -d '{"id":2, "name": "test2" }' -H 'Content-Type: application/json'
```

[redisDBManager.js](https://github.com/fuarfoile/koajs-redis-test/blob/main/app/managers/redisDBManager.js)

Структура хранения в redis:  
'users' - сет с ключами всех пользователей.  
'user:{id}' - ключ пользователя с заданным id. Значения хранятся в формате JSON.stringify({'id':id, 'name':name}).  
'id:users' - итератор id для добавления нового пользователя.  

Заметки:

```js
//Уменьшает значение 'id:users' на единицу при удалении последнего созданного пользователя.
//Писался по аналогии с 'testDbManager.js' и по большей части служит для возможности повторного прогона тестов без внесения дополнительных изменений.
removeId: function removeIdInDb(id) {
   ...
            client.get('id:users', function(err, reply) {
                if (id + 1 === parseInt(reply)) {
                    client.DECR('id:users');
                }
            });
   ...
}
```

```js
//Таймер оставлен исключительно для тестовых целей, аналогично 'testDbManager.js'.
setTimeout(() => {
    ...
}, fakeDelay);
```
