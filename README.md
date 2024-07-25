# ScoutDB

## Development


### Prerequisite Installation Steps
1. NodeJS v20 or newer
2. Docker
3. JDK 21 or newer

### Development Build


1. Install all dependencies: `yarn install`
2. Build the common package sources:
    ```sh
    cd pkg/common/ && yarn build && cd ../../
    ```
3. Build the GUI package sources:
    ```sh
    cd pkg/gui/ && yarn build && cd ../../
    ```
4. Build the server package sources:
    ```sh
    cd pkg/srv/ && yarn build && cd ../../
    ```
5. Start the local server and then visit http://localhost:3000/
    ```sh
    cd pkg/srv/ && yarn start
    ```

The steps above will launch the HTTP server serving the build of the GUI package
without hot-reloading.

If you are mainly working on the front-end and want to have hot-reloading then run
these commands in addition to the steps performed:

```sh
cd pkg/gui/ && yarn start
```

After that, the browser should automatically open with the up to date version of the
GUI and if you make any source code changes it should reload the webpage automatically
as well.

### Container Image Build + Testing

Build the container image:
```sh
docker build . --tag scoutdb
```

Run the image you've just built and then visit: http://localhost:3000/

```sh
docker run -it --restart=always --env SCOUTDB_HTTP_HOST=0.0.0.0 -v "$(pwd)":/data/scoutdb/ -p 3000:3000 scoutdb
```

### Building Image for Production

```sh
docker build . --tag "ghcr.io/scout-db/scout-db:main-$(git rev-parse --short HEAD)"
```

### Running the image in production

```sh
docker run --detach \
    --restart=always \
    --env SCOUTDB_HTTP_HOST=0.0.0.0 \
    --volume "$(pwd)":/data/scoutdb/ \
    --publish 3000:3000 \
    scoutdb
```

### OpenTelemetry Local Setup

```sh
git clone https://github.com/SigNoz/signoz.git
cd signoz/deploy
```

```sh
docker-compose -f docker/clickhouse-setup/docker-compose.yaml up \
    frontend \
    logspout \
    otel-collector \
    otel-collector-migrator \
    alertmanager \
    query-service \
    clickhouse \
    zookeeper-1 
```

Now execute start the server as explained in sections above and then send in a few
test requests both good ones and a couple of them which logs errors or crashes the
HTTP handler entirely:

```sh
curl http://localhost:3000/api/hello
```

```sh
curl http://localhost:3000/api/simulate-error-throw?theCode=12345
```

```sh
curl http://localhost:3000/api/simulate-error-log?theCode=12345
```

Then visit: http://localhost:3301/ to explore the traces and the associated logs.

> If this is the first time you are setting up SigNoz on your machine then you'll
need to create a user first.
> If You forgot the user you've created earlier, you'll need to wipe the data directory: `sudo rm -rf deploy/docker/clickhouse-setup/data`

Once logged in successfully, you should see on the exceptions tab that the 
`simulate-error-throw` endpoint crashed the handler as expected and it was
captured in SigNoz by the OpenTelemetry instrumentation automatically.