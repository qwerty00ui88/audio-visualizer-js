export function startAudioContext(audioContext, target, type) {
  if (!audioContext) {
    audioContext = new AudioContext();
    initAudioVisualizer();
  }

  audioContext
    .resume()
    .then(() => {
      console.log('AudioContext resumed');
    })
    .catch((error) => {
      console.error('Failed to resume AudioContext:', error);
    });

  target.removeEventListener(type, startAudioContext);
}

export function initAudioVisualizer(visualize) {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const source = audioContext.createMediaStreamSource(stream);

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 200;
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');

      visualize();
    })
    .catch((error) => console.error('Error accessing microphone:', error));
}

export function visualize() {
  requestAnimationFrame(visualize);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}
