// Import dependencies
const five = require("johnny-five");
const Tessel = require("tessel-io");
const board = new five.Board({
  io: new Tessel()
});

const av = require("tessel-av");
const camera = new av.Camera({ port: 1234 });
const http = require('http');

// Submit a request to process image data
// Make sure https://github.com/parkdy/ImageProcessingServer is running locally
const submitImageToProcessingServer = (imageData) => {
  var options = {
    host: '192.168.1.4', // Edit me (check ifconfig)
    port: '3000', // Edit me
    path: '/image_processing_requests.json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  var body = JSON.stringify({
    image_processing_request: {
      original_image_attributes: {
        image: 'data:image/jpeg;base64,'+imageData.toString('base64')
      },
      command_string: '-negate output.jpg' // Edit me
    }
  });

  http.request(options, function(res) {
    res.on('data', function(d) {
      console.log('success request');
    });

    res.on('error', function(e) {
      console.log('error request');
    })
  }).end(body);
}

const takeAndProcessSnapshot = () => {
  const capture = camera.capture();

  capture.on("data", function(data) {
    submitImageToProcessingServer(data);
  });
};

board.on('ready', () => {
  takeAndProcessSnapshot();
})
