const video = document.getElementById("video")

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startCamera());

function startCamera() {
    // return false;
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => (video.srcObject = stream),
    err => console.log(err)
  );
}

video.addEventListener("play", () => {
  
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const boxSize = {
    width: video.width,
    height: video.height
  };
faceapi.matchDimensions(canvas, boxSize)

  setInterval( async()=> {
    // async olacak 
    // await
    const detections = await faceapi.detectAllFaces(
      video, new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks()
      .withFaceExpressions()
      canvas.getContext("2d").clearRect(0,0, canvas.width, canvas.height);
      const resizeDetections = faceapi.resizeResults(detections, boxSize );
      faceapi.draw.drawDetections(canvas, resizeDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizeDetections);

  },100)
});

