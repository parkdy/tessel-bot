// Import dependencies
const five = require("johnny-five");
const Tessel = require("tessel-io");
const board = new five.Board({
  io: new Tessel()
});

const av = require("tessel-av");
const camera = new av.Camera({ port: 1234 });

const Driveable = require('./lib/driveable');
const RobotControlServer = require('./lib/robot-control-server');

board.on("ready", () => {
  const rightMotor = new five.Motor(["a5", "a3", "a4"]);
  const leftMotor = new five.Motor(["b5", "b3", "b4"]);

  const driveable = new Driveable({ leftMotor, rightMotor });

  const port = 8000;
  const robotControlServer = new RobotControlServer({ port, camera, driveable });
  robotControlServer.start();
});
