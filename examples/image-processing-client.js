const five = require("johnny-five");
const Tessel = require("tessel-io");
const board = new five.Board({
  io: new Tessel()
});

const av = require("tessel-av");
const camera = new av.Camera({ port: 1234 });

const ImageProcessingClient = require('../lib/image-processing-client');

board.on('ready', () => {
  // Make sure https://github.com/parkdy/ImageProcessingServer is running locally
  const localClient = new ImageProcessingClient({
    host: '192.168.1.4', // (check ifconfig)
    port: '3000',
  });

  localClient.takeAndProcessPhoto({
    camera,
    commandString: '-negate output.png'
  });
});
