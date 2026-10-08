/* Onuri — shared site behaviour (mobile menu). */
(function () {
  'use strict';
  var header = document.querySelector('.on-header');
  if (!header) return;
  var btn = header.querySelector('.on-menu');
  var nav = header.querySelector('.on-nav');
  if (!btn || !nav) return;

  function setOpen(open) {
    header.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.querySelector('.on-sr').textContent = open ? (btn.getAttribute('data-close') || 'Close menu') : (btn.getAttribute('data-open') || 'Open menu');
  }

  btn.addEventListener('click', function () {
    setOpen(!header.classList.contains('is-open'));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      btn.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
  });

  var mq = window.matchMedia('(min-width: 901px)');
  var onChange = function () { if (mq.matches) setOpen(false); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
})();
