# ScoutDB

## Development


### Prerequisite Installation Steps
1. NodeJS v20 or newer
2. Docker
3. JDK 21 or newer

### Development Build

1. Build the common package sources:
    ```sh
    cd pkg/common/ && npm i && npx tsc && cd ../../
    ```
2. Build the GUI package sources:
    ```sh
    cd pkg/gui/ && npm i && npm run build && cd ../../
    ```
3. Build the server package sources:
    ```sh
    cd pkg/srv/ && npm i && npx tsc && cd ../../
    ```
4. Start the local server and then visit http://localhost:3000/
    ```sh
    cd pkg/srv/ && npm start
    ```

### Container Image Build + Testing

Build the container image:
```sh
docker build . --tag scoutdb
```

Run the image you've just built and then visit: http://localhost:3000/

```sh
docker run -it --env SCOUTDB_HTTP_HOST=0.0.0.0 -v "$(pwd)":/data/scoutdb/ -p 3000:3000 scoutdb
```