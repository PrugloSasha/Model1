async function setupWebcam() {
    return new Promise((resolve, reject) => {
        const webcamElement = document.getElementById('webcam');
        const navigatorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
                                 navigatorAny.webkitGetUserMedia ||
                                 navigatorAny.mozGetUserMedia ||
                                 navigatorAny.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                { video: {} },
                stream => {
                    webcamElement.srcObject = stream;
                    webcamElement.addEventListener('loadeddata', () => resolve(), false);
                },
                error => reject()
            );
        } else {
            reject();
        }
    });
}

async function app() {
    console.log('Loading mobilenet..');
    
    // Load the model.
    const net = await mobilenet.load();
    console.log('Successfully loaded model');
    
    await setupWebcam();
    
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const predictionElement = document.getElementById('prediction');
    
    while (true) {
        const result = await net.classify(webcamElement);
        
        canvasCtx.drawImage(webcamElement, 0, 0, 640, 480);
        predictionElement.innerText = `Prediction: ${result[0].className}\nProbability: ${(result[0].probability * 100).toFixed(2)}%`;
        
        await tf.nextFrame();
    }
}

app();
