const http = require('http');
const os = require('os');
const queryString = require('query-string');
const urlParse = require('url-parse');

const RobotControlServer = function({ port, camera, driveable }) {
  this.port = port;
  this.camera = camera;
  this.driveable = driveable;
}

// Start a server that can control the robot at http://<tesselname>.local:<port>
RobotControlServer.prototype.start = function () {
  const server = new http.Server((request, response) => {
    this.handleRequest(request, response);
  }).listen(this.port, () => console.log(`http://${os.hostname()}.local:${this.port}`));

  process.on("SIGINT", _ => server.close());
};

RobotControlServer.prototype.handleRequest = function(request, response) {
  const url = request.url;
  const qs = urlParse(url).query;
  const params = queryString.parse(qs);

  if (params.snap) {
    // http://<tesselname>.local:8080?snap=true
    this.takePhoto(response);
  } else {
    // http://<tesselname>.local:8080?forward=true
    this.driveFromParams(params);
  }
};

RobotControlServer.prototype.driveFromParams = function (params) {
  if (params.left) {
    this.driveable.turnLeft();
  } else if (params.right) {
    this.driveable.turnRight();
  } else if (params.forward) {
    this.driveable.driveForward();
  } else if (params.reverse) {
    this.driveable.driveReverse();
  }
};

RobotControlServer.prototype.takePhoto = function(response) {
  response.writeHead(200, { "Content-Type": "image/jpg" });
  this.camera.capture().pipe(response).on('finish', () => { response.end() });
};

module.exports = RobotControlServer;
