
GET()

query : pagenum
- pagenum에 맞는 post data return





GET("/:postid")

param : postid
- postid에 맞는 post data 1개 가져오기



POST()

: body{

PostDate: {
  "from": 2022-01-10-15-30,
  "to": 2022-01-10-20-30
            },
            "Outlay": {
                "data": null,
                "location": 5,
                "amount": 10,
                "memo": "hihsi",
                "title": "안녕안녕"
            },
            "Weather": {
                "weather": 200,
                "temperature": 200
            },
    "file_id":["file-id1"],
     "file_path":["text.png"]
    }

}

- post data created






PATCH()

: body{

postid:"expostid",

"data":{
PostDate: {
  "from": 2022-01-10-15-30,
  "to": 2022-01-10-20-30
            },
            "Outlay": {
                "data": null,
                "location": 5,
                "amount": 10,
                "memo": "hihsi",
                "title": "안녕안녕"
            },
            "Weather": {
                "weather": 200,
                "temperature": 200
            },
    "file_id":["file-id1"],
     "file_path":["text.png"]
    }

}

- Post 업데이트












DETET()

:body{
   postid:"postid"


}








# .env File

```
[Service]
HEALTH_PORT=3184
PORT=3084

[DB]
MONGODB_URI="mongodb://loalhost:27017/"

[Redis]
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

[UserAuth]
JWT_SECRET=jwt_secret_test

[Email]
MAILER_EMAIL=mail_id
MAILER_PASSWORD=mail_password

[AES]
AES_SECRET=aes_secret

[CORS]
CORS_ORIGIN_LIST=localhost
```









