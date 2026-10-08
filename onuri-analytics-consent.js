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
      '#onuri-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;max-width:660px;margin:0 auto;padding:12px 14px 12px 18px;display:flex;align-items:center;gap:14px;background:#fff;color:#332a30;border:1px solid rgba(199,91,130,.22);border-radius:16px;box-shadow:0 12px 36px rgba(51,42,48,.16);font:13.5px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Hiragino Sans","Apple SD Gothic Neo",Roboto,sans-serif}' +
      '#onuri-consent[hidden]{display:none!important}#onuri-consent:focus{outline:none}#onuri-consent p{margin:0;flex:1 1 auto}#onuri-consent a{color:#a73767;font-weight:600;text-decoration:underline;text-underline-offset:2px}' +
      '#onuri-consent-actions{display:flex;gap:8px;flex:0 0 auto}' +
      '#onuri-consent button,#onuri-privacy-choices{appearance:none;border:1px solid #a73767;border-radius:999px;padding:9px 15px;min-height:40px;font:600 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI","Hiragino Sans","Apple SD Gothic Neo",Roboto,sans-serif;cursor:pointer;background:#fff;color:#a73767;white-space:nowrap}' +
      '#onuri-consent button:hover{background:#fff3f7}' +
      '#onuri-consent button:focus-visible,#onuri-privacy-choices:focus-visible{outline:3px solid rgba(167,55,103,.25);outline-offset:2px}' +
      '#onuri-privacy-choices{position:fixed;left:12px;bottom:12px;z-index:2147483646;padding:7px 10px;min-height:0;border-color:rgba(167,55,103,.30);background:rgba(255,255,255,.96);box-shadow:0 4px 14px rgba(51,42,48,.1);font-size:11px}' +
      '@media(max-width:640px){#onuri-consent{left:10px;right:10px;bottom:10px;flex-wrap:wrap;padding:12px 14px;gap:10px}#onuri-consent-actions{width:100%}#onuri-consent-actions button{flex:1 1 0}}' +
      '@media print{#onuri-consent,#onuri-privacy-choices{display:none!important}}';
    document.head.appendChild(style);
  }

  function copy() {
    var lang = (document.documentElement.lang || 'en').toLowerCase();
    if (lang.indexOf('ja') === 0) return {
      choices: 'プライバシー設定',
      choicesAria: 'ウェブサイト分析のプライバシー設定を変更',
      dialogAria: '分析Cookieの選択',
      title: '分析Cookieについて',
      body: '同意いただいた場合のみ、Google Analyticsで役立つページを確認します。拒否すると何も読み込まれません。Onuriアプリ自体は分析を使用しません。',
      privacy: '詳細', reject: '分析を拒否', accept: '分析を許可', privacyHref: '/ja/privacy.html'
    };
    if (lang.indexOf('ko') === 0) return {
      choices: '개인정보 설정',
      choicesAria: '웹사이트 분석 개인정보 설정 변경',
      dialogAria: '분석 쿠키 선택',
      title: '분석 쿠키 안내',
      body: '동의하시는 경우에만 Google Analytics로 유용한 페이지를 확인합니다. 거부하면 아무것도 로드되지 않습니다. Onuri 앱 자체는 분석을 사용하지 않습니다.',
      privacy: '자세히', reject: '분석 거부', accept: '분석 허용', privacyHref: '/ko/privacy.html'
    };
    return {
      choices: 'Privacy choices', choicesAria: 'Change website analytics privacy choice', dialogAria: 'Analytics cookie choice',
      title: 'Analytics cookies?',
      body: 'With your OK, we use Google Analytics to see which pages are useful. Nothing loads unless you accept. The Onuri app itself uses no analytics.',
      privacy: 'Details', reject: 'Reject analytics', accept: 'Accept analytics', privacyHref: '/privacy.html'
    };
  }

  function showChoicesButton() {
    ensureStyles();
    if (document.getElementById('onuri-privacy-choices')) return;
    var button = document.createElement('button');
    button.id = 'onuri-privacy-choices';
    button.type = 'button';
    var t = copy();
    button.textContent = t.choices;
    button.setAttribute('aria-label', t.choicesAria);
    button.addEventListener('click', showBanner);
    document.body.appendChild(button);
  }

  function showBanner() {
    ensureStyles();
    var existing = document.getElementById('onuri-consent');
    if (existing) {
      existing.hidden = false;
      existing.focus();
      return;
    }

    var banner = document.createElement('div');
    banner.id = 'onuri-consent';
    banner.setAttribute('role', 'dialog');
    var t = copy();
    banner.setAttribute('aria-label', t.dialogAria);
    banner.setAttribute('tabindex', '-1');
    banner.innerHTML =
      '<p><strong>' + t.title + '</strong> ' + t.body + ' ' +
      '<a href="' + t.privacyHref + '">' + t.privacy + '</a></p>' +
      '<div id="onuri-consent-actions"><button type="button" class="onuri-reject">' + t.reject + '</button><button type="button" class="onuri-accept">' + t.accept + '</button></div>';
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

  // Lets the website privacy notice open the choice banner from a button.
  window.OnuriConsent = { open: showBanner };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
