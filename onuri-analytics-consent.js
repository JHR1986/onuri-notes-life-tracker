(function () {
  'use strict';

  // Site-only analytics. The Onuri iPhone app does not load this script.
  var MEASUREMENT_ID = 'G-DGVLPTVZSL';
  var STORAGE_KEY = 'onuri_analytics_consent';
  var hasLoadedAnalytics = false;

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function saveConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function loadAnalytics() {
    if (hasLoadedAnalytics) return;
    hasLoadedAnalytics = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    document.head.appendChild(script);
  }

  function deleteAnalyticsCookies() {
    var cookies = document.cookie ? document.cookie.split(';') : [];
    cookies.forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (name === '_gid' || name === '_gat' || name.indexOf('_ga') === 0) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
        if (location.hostname && location.hostname.indexOf('.') !== -1) {
          document.cookie = name + '=; Max-Age=0; path=/; domain=.' + location.hostname + '; SameSite=Lax';
        }
      }
    });
  }

  function disableAnalytics() {
    window['ga-disable-' + MEASUREMENT_ID] = true;
    if (window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    deleteAnalyticsCookies();
  }

  function enableAnalytics() {
    window['ga-disable-' + MEASUREMENT_ID] = false;
    loadAnalytics();
  }

  function ensureStyles() {
    if (document.getElementById('onuri-consent-styles')) return;
    var style = document.createElement('style');
    style.id = 'onuri-consent-styles';
    style.textContent =
      '#onuri-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;max-width:720px;margin:0 auto;padding:16px 18px;background:#fff;color:#332a30;border:1px solid rgba(199,91,130,.22);border-radius:18px;box-shadow:0 12px 36px rgba(51,42,48,.16);font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
      '#onuri-consent[hidden]{display:none!important}#onuri-consent p{margin:0 0 12px}#onuri-consent a{color:#a73767;text-decoration:underline;text-underline-offset:2px}' +
      '#onuri-consent-actions{display:flex;gap:9px;flex-wrap:wrap}' +
      '#onuri-consent button,#onuri-privacy-choices{appearance:none;border:1px solid rgba(167,55,103,.30);border-radius:999px;padding:9px 13px;font:600 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;background:#fff;color:#a73767}' +
      '#onuri-consent button:focus-visible,#onuri-privacy-choices:focus-visible{outline:3px solid rgba(167,55,103,.25);outline-offset:2px}' +
      '#onuri-consent .onuri-accept{background:#a73767;color:#fff;border-color:#a73767}' +
      '#onuri-privacy-choices{position:fixed;left:12px;bottom:12px;z-index:2147483646;padding:7px 10px;background:rgba(255,255,255,.96);box-shadow:0 4px 14px rgba(51,42,48,.1);font-size:11px}' +
      '@media(max-width:600px){#onuri-consent{left:10px;right:10px;bottom:10px;padding:14px}#onuri-consent-actions button{flex:1 1 auto}}';
    document.head.appendChild(style);
  }

  function showChoicesButton() {
    ensureStyles();
    if (document.getElementById('onuri-privacy-choices')) return;
    var button = document.createElement('button');
    button.id = 'onuri-privacy-choices';
    button.type = 'button';
    button.textContent = 'Privacy choices';
    button.setAttribute('aria-label', 'Change website analytics privacy choice');
    button.addEventListener('click', showBanner);
    document.body.appendChild(button);
  }

  function showBanner() {
    ensureStyles();
    var existing = document.getElementById('onuri-consent');
    if (existing) {
      existing.hidden = false;
      var acceptExisting = existing.querySelector('.onuri-accept');
      if (acceptExisting) acceptExisting.focus();
      return;
    }

    var banner = document.createElement('div');
    banner.id = 'onuri-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Analytics privacy choices');
    banner.innerHTML =
      '<p><strong>Optional website analytics</strong><br>Onuri uses Google Analytics on this website only if you choose Accept, to understand which pages are useful. Analytics does not load before you choose. This is separate from the Onuri app, which does not use analytics SDKs. <a href="https://jhr1986.github.io/onuri-legal/privacy.html">Privacy</a>.</p>' +
      '<div id="onuri-consent-actions"><button type="button" class="onuri-reject">Reject analytics</button><button type="button" class="onuri-accept">Accept analytics</button></div>';
    document.body.appendChild(banner);

    banner.querySelector('.onuri-accept').addEventListener('click', function () {
      saveConsent('granted');
      enableAnalytics();
      banner.hidden = true;
      showChoicesButton();
    });
    banner.querySelector('.onuri-reject').addEventListener('click', function () {
      saveConsent('denied');
      disableAnalytics();
      banner.hidden = true;
      showChoicesButton();
    });
  }

  function init() {
    var consent = getConsent();
    if (consent === 'granted') {
      enableAnalytics();
      showChoicesButton();
    } else if (consent === 'denied') {
      disableAnalytics();
      showChoicesButton();
    } else {
      disableAnalytics();
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
