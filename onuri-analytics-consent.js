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
      '#onuri-consent[hidden]{display:none!important}#onuri-consent:focus{outline:none}#onuri-consent p{margin:0 0 12px}#onuri-consent a{color:#a73767;text-decoration:underline;text-underline-offset:2px}' +
      '#onuri-consent-actions{display:flex;gap:9px;flex-wrap:wrap}' +
      '#onuri-consent button,#onuri-privacy-choices{appearance:none;border:1px solid rgba(167,55,103,.30);border-radius:999px;padding:9px 13px;font:600 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;background:#fff;color:#a73767}' +
      '#onuri-consent button:focus-visible,#onuri-privacy-choices:focus-visible{outline:3px solid rgba(167,55,103,.25);outline-offset:2px}' +
      '#onuri-consent-actions button{background:#a73767;color:#fff;border-color:#a73767;min-width:150px}' +
      '#onuri-privacy-choices{position:fixed;left:12px;bottom:12px;z-index:2147483646;padding:7px 10px;background:rgba(255,255,255,.96);box-shadow:0 4px 14px rgba(51,42,48,.1);font-size:11px}' +
      '@media(max-width:600px){#onuri-consent{left:10px;right:10px;bottom:10px;padding:14px}#onuri-consent-actions button{flex:1 1 auto}}';
    document.head.appendChild(style);
  }

  function copy() {
    var lang = (document.documentElement.lang || 'en').toLowerCase();
    if (lang.indexOf('ja') === 0) return {
      choices: 'プライバシー設定',
      choicesAria: 'ウェブサイト分析のプライバシー設定を変更',
      dialogAria: '分析Cookieの選択',
      title: '分析Cookieを使用してもよいですか？',
      body: '同意すると、このウェブサイトはGoogle Analyticsを使用して訪問数や役立つページを確認します。端末にCookieが設定され、閲覧ページや端末の種類などの情報がGoogleと共有されます。拒否した場合、Google Analyticsは読み込まれず、分析Cookieも設定されません。ページ下部の「プライバシー設定」からいつでも変更できます。この設定はウェブサイトのみに適用され、Onuriアプリは分析機能を使用しません。',
      privacy: 'ウェブサイトのプライバシー通知', reject: '分析を拒否', accept: '分析を許可', privacyHref: '/ja/privacy.html'
    };
    if (lang.indexOf('ko') === 0) return {
      choices: '개인정보 설정',
      choicesAria: '웹사이트 분석 개인정보 설정 변경',
      dialogAria: '분석 쿠키 선택',
      title: '분석 쿠키를 사용해도 될까요?',
      body: '동의하면 이 웹사이트는 Google Analytics를 사용해 방문 수와 유용한 페이지를 확인합니다. 기기에 쿠키가 설정되고, 조회한 페이지와 기기 유형 같은 정보가 Google과 공유됩니다. 거부하면 Google Analytics가 로드되지 않고 분석 쿠키도 설정되지 않습니다. 페이지 아래의 “개인정보 설정”에서 언제든 선택을 변경할 수 있습니다. 이 설정은 웹사이트에만 적용되며 Onuri 앱은 분석 기능을 사용하지 않습니다.',
      privacy: '웹사이트 개인정보 보호 안내', reject: '분석 거부', accept: '분석 허용', privacyHref: '/ko/privacy.html'
    };
    return {
      choices: 'Privacy choices', choicesAria: 'Change website analytics privacy choice', dialogAria: 'Analytics cookie choice',
      title: 'Can we use analytics cookies?',
      body: 'If you accept, this website uses Google Analytics to count visits and see which pages are useful. This sets cookies on your device and shares information such as the pages you view and your device type with Google. If you reject, Google Analytics is not loaded and no analytics cookies are set. You can change your choice at any time using “Privacy choices” at the bottom of the page. This applies to the website only; the Onuri app does not use analytics.',
      privacy: 'Website privacy notice', reject: 'Reject analytics', accept: 'Accept analytics', privacyHref: '/privacy.html'
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
      '<p><strong>' + t.title + '</strong><br>' + t.body + ' ' +
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
