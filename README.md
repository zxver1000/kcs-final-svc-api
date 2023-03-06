# .env File

```
[Service]
PORT=3081

[Mongo]
MONGODB_HOST=mongodb-user-service.mongodb.svc.cluster.local
MONGODB_PORT=27081
MONGODB_DB=User

[Redis]
REDIS_HOST=redis-community-service.redis.svc.cluster.local
REDIS_PORT=6379
REDIS_PASSWORD=redis_pw

[UserAuth]
JWT_SECRET=jwt_secret_test

[CORS]
CORS_ORIGIN_LIST=localhost
```
