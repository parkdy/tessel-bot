const http = require('http');

const ImageProcessingClient = function ({ host, port }) {
  this.host = host;
  this.port = port;
};

// Submit a request to the image processing server, see:
// https://github.com/parkdy/ImageProcessingServer
ImageProcessingClient.prototype.submitImageProcessingRequest = function ({ imageData, commandString }) {
  const options = {
    host: this.host,
    port: this.port,
    path: '/image_processing_requests.json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({
    image_processing_request: {
      original_image_attributes: {
        image: 'data:image/jpeg;base64,'+imageData.toString('base64')
      },
      command_string: commandString
    }
  });

  http.request(options, function(res) {
    res.on('data', function(data) {
      console.log('Image processing request successful');
    });

    res.on('error', function(error) {
      console.log('Image processing request failed');
    })
  }).end(body);
}

ImageProcessingClient.prototype.takeAndProcessPhoto = function ({ camera, commandString }) {
  const capture = camera.capture();

  capture.on("data", (imageData) => {
    this.submitImageProcessingRequest({ imageData, commandString });
  });
};

module.exports = ImageProcessingClient;
