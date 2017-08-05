// Import dependencies
const five = require("johnny-five");
const Tessel = require("tessel-io");
const board = new five.Board({
  io: new Tessel()
});

const av = require("tessel-av");
const camera = new av.Camera({ port: 1234 });
const http = require('http');
const os = require('os');
const port = 8000;

const fs = require('fs');
const path = require('path');
const queryString = require('query-string');
const urlParse = require('url-parse');

// initialize a server that can access the camera or control the wheels at http://<tesselname>.local:8000
const initCaptureServer = (moveParams) => {
  const server = new http.Server((request, response) => {

    const url = request.url;
    const qs = urlParse(url).query;
    const params = queryString.parse(qs);

    if (params.snap) { // http://<tesselname>.local:8080?snap=true
      response.writeHead(200, { "Content-Type": "image/jpg" });
      camera.capture().pipe(response);
    } else { // http://<tesselname>.local:8080?forward=true
       response.writeHead(200, {"Content-Type": "text/plain"});
       response.end(qs+"\n");
       moveParams(params);
    }
  }).listen(port, () => console.log(`http://${os.hostname()}.local:${port}`));

  process.on("SIGINT", _ => server.close());
}

board.on("ready", () => {

  const rightMotor = new five.Motor(["a5", "a3", "a4"]);
  const leftMotor = new five.Motor(["b5", "b3", "b4"]);

  const fullStop = () => {
    rightMotor.forward(0);
    leftMotor.forward(0);
  };

  const turnLeft = () => {
    rightMotor.forward(64);
    leftMotor.reverse(64);
    setTimeout(() => {
      fullStop();
    }, 1500);
  };

  const turnRight = () => {
    rightMotor.reverse(64);
    leftMotor.forward(64);
    setTimeout(() => {
      fullStop();
    }, 1500);
  };

  const driveForward = () => {
    rightMotor.forward(128);
    leftMotor.forward(128);
    setTimeout(() => {
      fullStop();
    }, 3000);
  };

  const driveReverse = () => {
    rightMotor.reverse(128);
    leftMotor.reverse(128);
    setTimeout(() => {
      fullStop();
    }, 3000);
  };

  const moveParams = (params) => {
    if (params.left) {
      turnLeft();
    } else if (params.right) {
      turnRight();
    } else if (params.forward) {
      driveForward();
    } else if (params.reverse) {
      driveReverse();
    }
  };

  initCaptureServer(moveParams);
});
