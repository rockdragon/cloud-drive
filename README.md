# cloud-drive [云盘]

#### Prerequisite
linux:
    export cloud_home=/xx/xxx/repo/cloud-drive

windows:
    set system environment variable `cloud_home`
    d:\repo\cloud-drive

#### configuration(config.cfg)

```JSON
{
    "session_key": "session_id",
    "SECRET": "cloud-drive_on_your_behalf",
    "nodes":
    [
       {"address": "127.0.0.1", "port": "6379"}
    ],
    "SITE_ROOT": "http://localhost:3000/",
    "GOOGLE_CLIENT_ID" : "xxxx.apps.googleusercontent.com",
    "GOOGLE_CLIENT_SECRET" : "wdsfas3_-safdsafasf",
    "GOOGLE_RETURN_URL" : "http://www.xxx.com/auth/google/return",
    "FACEBOOK_APP_ID" : "2423465456457804",
    "FACEBOOK_APP_SECRET": "sf323424g8254c0d9725eae454g5b5d",
    "FACEBOOK_RETURN_URL" : "http://www.xxx.com/auth/facebook/return",
    "DOUBAN_APP_ID" : "005245655202223342",
    "DOUBAN_APP_SECRET": "005245655202223342",
    "DOUBAN_RETURN_URL" : "http://www.xxx.com/auth/douban/return",
    "GIT_APP_ID" : "005245655202223342",
    "GIT_APP_SECRET": "005245655202223342",
    "GIT_RETURN_URL" : "http://www.xxx.com/auth/git/return",
    "node_env" : "development",
    "upload_setting":{
        "win32" : "D:\files",
        "linux": "/var/files"
    },
    "certs":{
            "key":  "/Users/certs/server.key",
            "cert": "/Users/certs/server.crt"
         },
    "SERVER_TYPE": "https"
}
```
#### License

The MIT License (MIT)