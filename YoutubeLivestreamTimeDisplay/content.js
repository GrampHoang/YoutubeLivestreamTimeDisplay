(function () {
  const TIMER_ID = 'yt-live-timestamp-native';
  let controlBar = null;
  let video = null;
  let timerDiv = null;
  let running = false;

  const formatTime = seconds => {
    if (isNaN(seconds)) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":");
  };

  function init() {
    controlBar = document.querySelector('.ytp-left-controls');
    video = document.querySelector('video');
    if (!controlBar || !video) return false;

    timerDiv = document.getElementById(TIMER_ID);
    if (!timerDiv) {
      timerDiv = document.createElement('span');
      timerDiv.id = TIMER_ID;
      controlBar.appendChild(timerDiv);
    }
    return true;
  }

  function loop() {
    if (!controlBar || !video || !document.body.contains(video)) {
      running = false;
      return;
    }

    const t = video.currentTime;
    if (!isNaN(t)) {
      timerDiv.textContent = formatTime(t);
      timerDiv.style.display = 'inline-block';
    }

    if (running) requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    if (!init()) return;

    running = true;
    requestAnimationFrame(loop);
  }

  // handle youtube page navigation changes
  const obs = new MutationObserver(() => start());
  obs.observe(document.body, { childList: true, subtree: true });

  start();
})();
