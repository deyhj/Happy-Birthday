const flame = document.getElementById("flame");
const wishBtn = document.getElementById("wishBtn");
const giftCard = document.getElementById("giftCard");
let blownOut = false;

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const context = new AudioContext();
    const mic = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    const dataArray = new Uint8Array(analyser.fftSize);
    mic.connect(analyser);

    function checkBlow() {
      analyser.getByteTimeDomainData(dataArray);
      let total = 0;
      for (let i = 0; i < dataArray.length; i++) {
        total += Math.abs(dataArray[i] - 128);
      }

      const volume = total / dataArray.length;

      if (volume > 15 && !blownOut) {
        blownOut = true;
        flame.style.display = "none";
        wishBtn.style.display = "inline-block";
      }

      requestAnimationFrame(checkBlow);
    }

    checkBlow();
  })
  .catch(err => {
    document.querySelector(".message").textContent = "🎤 Please allow microphone access!";
    console.error("Mic access denied:", err);
  });

function showMessage() {
  wishBtn.style.display = "none";
  giftCard.style.display = "block";
}
