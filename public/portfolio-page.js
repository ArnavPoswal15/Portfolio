(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (sessionStorage.getItem('portfolio:scrollTarget') === 'work') {
    document.documentElement.classList.add('land-on-work');
  }

  var queue = [];
  var revealDone = false;

  function flushRevealQueue() {
    if (revealDone) return;
    revealDone = true;
    queue.splice(0).forEach(function (fn) {
      fn();
    });
  }

  window.__portfolioOnPageReveal = function (fn) {
    if (revealDone) fn();
    else queue.push(fn);
  };

  if ('onpagereveal' in window) {
    window.addEventListener('pagereveal', function (e) {
      flushRevealQueue();
      var vt = e.viewTransition;
      if (vt && vt.finished) {
        vt.finished.catch(function () {});
      }
    });
    requestAnimationFrame(flushRevealQueue);
  } else {
    flushRevealQueue();
  }
})();
