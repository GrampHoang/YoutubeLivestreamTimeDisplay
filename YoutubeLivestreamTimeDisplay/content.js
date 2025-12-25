(function () {
  const TIMER_ID = 'yt-live-timestamp-native';
  let video = null;
  let timerDiv = null;
  let scheduled = false;
  let active = false;

  const isLive = () => {
    const badge = document.querySelector('.ytp-live-badge');
    const player = document.querySelector('.html5-video-player');

    return (
      (badge && badge.offsetParent !== null) ||          // visible LIVE badge
      (player && player.classList.contains('ytp-live')) || // YouTube marks live players
      (video && video.duration === Infinity)               // fallback
    );
  };

  const formatTime = s => {
    if (isNaN(s)) return "00:00:00";
    const h = (s / 3600) | 0;
    const m = ((s % 3600) / 60) | 0;
    const t = (s % 60) | 0;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(t).padStart(2,'0')}`;
  };

  const updateTime = () => {
    if (!video || !timerDiv || !isLive()) return;
    const t = video.currentTime;
    if (isNaN(t)) return;
    const txt = formatTime(t);
    if (timerDiv.textContent !== txt) timerDiv.textContent = txt;
  };

  function enable() {
    if (active) return;
    const controlBar = document.querySelector(".ytp-left-controls");
    const v = document.querySelector("video");
    if (!controlBar || !v) return;

    video = v;
    video.addEventListener("timeupdate", updateTime, { passive: true });
    video.addEventListener("loadedmetadata", updateTime, { passive: true });

    timerDiv = document.createElement("span");
    timerDiv.id = TIMER_ID;
    timerDiv.className = "ytp-time-display";
    timerDiv.style.cssText = "margin-left:10px;vertical-align:middle;display:inline-block;";
    controlBar.appendChild(timerDiv);

    active = true;
    updateTime();
  }

  function disable() {
    if (!active) return;
    if (video) {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateTime);
      video = null;
    }
    if (timerDiv) {
      timerDiv.remove();
      timerDiv = null;
    }
    active = false;
  }

  function tick() {
    if (isLive()) enable();
    else disable();
  }

  const obs = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      tick();
    });
  });

  obs.observe(document.body, { childList: true, subtree: true });
  tick();
})();
