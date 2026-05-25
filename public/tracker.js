/**
 * Metrix tracker — lightweight, async, fails silently.
 * See metrix_app_architecture.md §7.
 *
 * Usage:
 *   <script async src="https://cdn.metrix.app/tracker.js"
 *           data-site-id="mx_abc123"></script>
 */
(function () {
  "use strict";

  if (window.__metrixLoaded) return;
  window.__metrixLoaded = true;

  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf("tracker.js") !== -1) return scripts[i];
    }
    return null;
  })();

  if (!script) return;

  var siteId = script.getAttribute("data-site-id");
  if (!siteId) return;

  var apiBase = script.getAttribute("data-api") || deriveApiBase(script.src);
  var endpoint = apiBase.replace(/\/$/, "") + "/api/track";
  var consentMode = script.getAttribute("data-consent") || "basic"; // "basic" | "cookieless" | "required"
  var cookieDomain = script.getAttribute("data-cookie-domain") || "";
  var sessionTimeoutMs = 30 * 60 * 1000;
  var consentGranted = consentMode !== "required";

  function deriveApiBase(src) {
    try {
      var u = new URL(src);
      return u.origin;
    } catch (e) {
      return "";
    }
  }

  // Respect Do Not Track
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;

  function randId(prefix) {
    var arr = new Uint8Array(8);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    var hex = "";
    for (var i = 0; i < arr.length; i++) hex += arr[i].toString(16).padStart(2, "0");
    return prefix + "_" + hex;
  }

  function readCookie(name) {
    var match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function writeCookie(name, value, days) {
    if (consentMode === "cookieless") return;
    var maxAge = days * 24 * 60 * 60;
    var parts = [name + "=" + encodeURIComponent(value), "path=/", "max-age=" + maxAge, "samesite=lax"];
    if (cookieDomain) parts.push("domain=" + cookieDomain);
    if (location.protocol === "https:") parts.push("secure");
    document.cookie = parts.join("; ");
  }

  function readStorage(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }

  function writeStorage(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) {}
  }

  function getVisitorId() {
    if (consentMode === "cookieless") return randId("v"); // ephemeral per page
    var existing = readCookie("metrix_visitor_id");
    if (existing) return existing;
    var fresh = randId("v");
    writeCookie("metrix_visitor_id", fresh, 365);
    return fresh;
  }

  function getSessionId() {
    var now = Date.now();
    var lastTouchKey = "metrix_session_last";
    var idKey = "metrix_session_id";
    var existingId = readStorage(idKey);
    var lastTouch = parseInt(readStorage(lastTouchKey) || "0", 10);
    if (existingId && now - lastTouch < sessionTimeoutMs) {
      writeStorage(lastTouchKey, String(now));
      return existingId;
    }
    var fresh = randId("s");
    writeStorage(idKey, fresh);
    writeStorage(lastTouchKey, String(now));
    return fresh;
  }

  function parseUtm() {
    var utm = {};
    try {
      var p = new URLSearchParams(location.search);
      ["source", "medium", "campaign", "term", "content"].forEach(function (k) {
        var v = p.get("utm_" + k);
        if (v) utm[k] = v;
      });
    } catch (e) {}
    return utm;
  }

  function basePayload() {
    return {
      siteId: siteId,
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      pageUrl: location.href,
      pagePath: location.pathname,
      title: document.title,
      referrer: document.referrer || null,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      utm: parseUtm(),
      occurredAt: new Date().toISOString(),
    };
  }

  function send(payload) {
    if (!consentGranted) {
      queued.push(payload);
      return;
    }
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: "application/json" });
        var ok = navigator.sendBeacon(endpoint, blob);
        if (ok) return;
      }
      fetch(endpoint, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: body,
      }).catch(function () {});
    } catch (e) {}
  }

  var queued = [];

  function flushQueue() {
    while (queued.length) send(queued.shift());
  }

  function track(eventType, eventName, metadata) {
    var p = basePayload();
    p.eventType = eventType;
    p.eventName = eventName || null;
    p.metadata = metadata || {};
    send(p);
  }

  function trackPageview() {
    var p = basePayload();
    p.eventType = "page_view";
    p.eventName = null;
    p.metadata = {};
    send(p);
  }

  // Auto-track clicks on elements with data-metrix-event
  function attachClickListener() {
    document.addEventListener(
      "click",
      function (e) {
        var target = e.target;
        while (target && target !== document.body) {
          if (target.getAttribute && target.getAttribute("data-metrix-event")) {
            var name = target.getAttribute("data-metrix-event");
            var meta = {};
            for (var i = 0; i < target.attributes.length; i++) {
              var a = target.attributes[i];
              if (a.name.indexOf("data-metrix-meta-") === 0) {
                meta[a.name.slice("data-metrix-meta-".length)] = a.value;
              }
            }
            track("button_click", name, meta);
            return;
          }
          target = target.parentNode;
        }
      },
      true,
    );
  }

  // Support pushState/replaceState for SPAs
  function attachHistoryListener() {
    var lastPath = location.pathname + location.search;
    function maybeFire() {
      var current = location.pathname + location.search;
      if (current !== lastPath) {
        lastPath = current;
        trackPageview();
      }
    }
    var origPush = history.pushState;
    var origReplace = history.replaceState;
    history.pushState = function () {
      origPush.apply(this, arguments);
      maybeFire();
    };
    history.replaceState = function () {
      origReplace.apply(this, arguments);
      maybeFire();
    };
    window.addEventListener("popstate", maybeFire);
  }

  // Public API
  window.metrix = {
    track: track,
    pageview: trackPageview,
    consent: function (granted) {
      consentGranted = !!granted;
      if (consentGranted) flushQueue();
    },
  };

  // Initial pageview
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      trackPageview();
      attachClickListener();
      attachHistoryListener();
    });
  } else {
    trackPageview();
    attachClickListener();
    attachHistoryListener();
  }
})();
