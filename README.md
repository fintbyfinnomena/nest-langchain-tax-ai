# Charlie

FINNOMENA Tax Saving Fund Assistant

### How to run on development

1. `npm install`
2. `docker-compose up -d redis`
3. `npm run start:dev`

### Send the request with cURL

```
curl -X POST http://localhost:8080/api/v1/langchain-chat/question \
     -H "Content-Type: application/json" \
     -H "session-id: 1" \
     -d '{"question" : "SSF คืออะไร?"}' \
     --no-buffer
```

## Deployment Node

### Investment View

- apart from .env, need service account that can connect to https://docs.google.com/spreadsheets/d/1FPmEVD2B8JYl1HKmxx9jCe_6fkfXMa-AcWhxGGYiB5I/edit?gid=1316310497#gid=1316310497
