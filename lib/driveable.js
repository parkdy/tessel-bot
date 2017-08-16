const Driveable = function ({ leftMotor, rightMotor }) {
  this.leftMotor = leftMotor;
  this.rightMotor = rightMotor;
}

Driveable.prototype.fullStop = function () {
  this.rightMotor.forward(0);
  this.leftMotor.forward(0);
};

Driveable.prototype.turnLeft = function () {
  this.rightMotor.forward(64);
  this.leftMotor.reverse(64);
  setTimeout(() => {
    this.fullStop();
  }, 1500);
};

Driveable.prototype.turnRight = function () {
  this.rightMotor.reverse(64);
  this.leftMotor.forward(64);
  setTimeout(() => {
    this.fullStop();
  }, 1500);
};

Driveable.prototype.driveForward = function () {
  this.rightMotor.forward(128);
  this.leftMotor.forward(128);
  setTimeout(() => {
    this.fullStop();
  }, 3000);
};

Driveable.prototype.driveReverse = function () {
  this.rightMotor.reverse(128);
  this.leftMotor.reverse(128);
  setTimeout(() => {
    this.fullStop();
  }, 3000);
};

module.exports = Driveable;
