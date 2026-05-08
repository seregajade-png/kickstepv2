/* SNEAKER MOSCOW support chat widget — vanilla JS */
(function () {
  if (window.__kcChatLoaded) return;
  window.__kcChatLoaded = true;

  var API = '/chat/api';
  var POLL_MS = 3000;
  var SID_KEY = 'kc_chat_sid';
  var sid = localStorage.getItem(SID_KEY);
  if (!sid) {
    sid = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
    localStorage.setItem(SID_KEY, sid);
  }
  var lastId = 0;
  var open = false;
  var pollTimer = null;
  var pollInFlight = false;
  var seenIds = {};
  var msgs = [];
  var rendered = 0;
  var isFirstPoll = true;
  var sysHint = null;
  var unread = 0;

  var css = ''
    + '.kc-chat-btn{position:fixed;right:20px;bottom:90px;width:60px;height:60px;border-radius:50%;background:#ff5a00;border:none;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.25);z-index:99998;display:flex;align-items:center;justify-content:center;transition:transform .2s}'
    + '.kc-chat-btn:hover{transform:scale(1.05)}'
    + '.kc-chat-btn svg{width:28px;height:28px;fill:#fff}'
    + '.kc-chat-badge{position:absolute;top:-2px;right:-2px;min-width:20px;height:20px;border-radius:10px;background:#fff;color:#ff5a00;font:600 12px/20px Roboto,sans-serif;text-align:center;padding:0 6px;box-shadow:0 2px 6px rgba(0,0,0,.2)}'
    + '.kc-chat-panel{position:fixed;right:20px;bottom:160px;width:340px;max-width:calc(100vw - 24px);height:480px;max-height:calc(100vh - 200px);background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.25);z-index:99999;display:flex;flex-direction:column;overflow:hidden;font-family:Roboto,sans-serif;opacity:0;pointer-events:none;transition:opacity .25s;touch-action:manipulation;-webkit-text-size-adjust:none}'
    + '.kc-chat-panel.kc-open{opacity:1;pointer-events:auto}'
    + '.kc-chat-head{background:#ff5a00;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}'
    + '.kc-chat-head-title{font:600 15px/1.2 Roboto,sans-serif}'
    + '.kc-chat-head-sub{font:400 11px/1.3 Roboto,sans-serif;opacity:.85;margin-top:2px}'
    + '.kc-chat-close{background:none;border:none;color:#fff;cursor:pointer;padding:4px;display:flex}'
    + '.kc-chat-close svg{width:20px;height:20px;stroke:#fff}'
    + '.kc-chat-body{flex:1;overflow-y:auto;padding:14px;background:#f6f6f6;display:flex;flex-direction:column;gap:8px;-webkit-overflow-scrolling:touch}'
    + '.kc-msg{max-width:80%;padding:8px 12px;border-radius:14px;font:400 13px/1.4 Roboto,sans-serif;word-wrap:break-word;white-space:pre-wrap}'
    + '.kc-msg.in{align-self:flex-end;background:#ff5a00;color:#fff;border-bottom-right-radius:4px}'
    + '.kc-msg.out{align-self:flex-start;background:#fff;color:#121212;border-bottom-left-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,.06)}'
    + '.kc-msg.sys{align-self:center;background:none;color:#888;font-size:12px;text-align:center;max-width:100%}'
    + '.kc-chat-foot{padding:10px;background:#fff;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0}'
    + '.kc-chat-foot input{flex:1;border:1px solid #d1d1d1;border-radius:20px;padding:9px 14px;font:400 16px Roboto,sans-serif;outline:none}'
    + '.kc-chat-foot input:focus{border-color:#ff5a00}'
    + '.kc-chat-foot button{background:#ff5a00;color:#fff;border:none;border-radius:50%;width:38px;height:38px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}'
    + '.kc-chat-foot button:disabled{opacity:.5;cursor:not-allowed}'
    + '.kc-chat-foot button svg{width:18px;height:18px;fill:#fff}'
    + '.kc-chat-attach{width:36px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:50%}'
    + '.kc-chat-attach:hover{background:#f5f5f5}'
    + '.kc-chat-attach svg{width:20px;height:20px}'
    + '.kc-msg img{max-width:100%;border-radius:10px;display:block;margin-top:4px;cursor:zoom-in}'
    + '.kc-msg-edited{opacity:.6;font-size:10px;margin-left:6px}'
    + '@media (max-width:480px){.kc-chat-panel{right:10px;left:10px;width:auto;bottom:160px;height:60vh;max-height:calc(100vh - 200px)}.kc-chat-btn{right:14px;bottom:90px;width:54px;height:54px}}'
    + '.kc-chat-panel *{touch-action:manipulation}'
    + '.kc-chat-tooltip{position:fixed;right:86px;bottom:100px;background:#fff;color:#121212;font:500 13px/1.3 Roboto,sans-serif;padding:10px 14px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.18);z-index:99997;max-width:200px;opacity:0;transform:translateX(10px);transition:opacity .5s ease, transform .5s ease;pointer-events:none}'
    + '.kc-chat-tooltip::after{content:"";position:absolute;right:-6px;top:50%;margin-top:-6px;border:6px solid transparent;border-left-color:#fff}'
    + '@media (max-width:480px){.kc-chat-tooltip{right:76px;bottom:90px;max-width:180px;font-size:12px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // Prevent zoom on chat input (iOS double-tap / focus zoom) — ensure font-size >= 16px
  var metaVP = document.querySelector('meta[name="viewport"]');
  if (metaVP && metaVP.content && metaVP.content.indexOf('maximum-scale') === -1) {
    metaVP.content += ', maximum-scale=1';
  }

  var btn = document.createElement('button');
  btn.className = 'kc-chat-btn';
  btn.setAttribute('aria-label', 'Открыть чат');
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span class="kc-chat-badge" style="display:none">0</span>';
  document.body.appendChild(btn);

  // CTA tooltip — appears 10s after page load, stays 10s (once per 24h)
  var tooltipKey = 'sm_chat_cta_last';
  var DAY = 24 * 3600 * 1000;
  var lastShown = parseInt(localStorage.getItem(tooltipKey) || '0', 10);
  if (Date.now() - lastShown > DAY) {
    setTimeout(function () {
      if (open) return;
      localStorage.setItem(tooltipKey, String(Date.now()));
      var tooltip = document.createElement('div');
      tooltip.className = 'kc-chat-tooltip';
      tooltip.textContent = 'Задайте вопрос! Ответим прямо сейчас\uD83D\uDE09';
      document.body.appendChild(tooltip);
      // trigger reflow so animation plays
      void tooltip.offsetWidth;
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateX(0)';
      setTimeout(function () {
        if (tooltip.parentNode) {
          tooltip.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          tooltip.style.opacity = '0';
          tooltip.style.transform = 'translateX(10px)';
          setTimeout(function () { if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip); }, 500);
        }
      }, 10000);
    }, 10000);
  }

  var panel = document.createElement('div');
  panel.className = 'kc-chat-panel';
  panel.innerHTML = ''
    + '<div class="kc-chat-head">'
    + '<div><div class="kc-chat-head-title">Поддержка SNEAKER MOSCOW</div><div class="kc-chat-head-sub">Обычно отвечаем в течение 5 минут</div></div>'
    + '<button class="kc-chat-close" aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>'
    + '</div>'
    + '<div class="kc-chat-body" id="kcChatBody"></div>'
    + '<form class="kc-chat-foot" id="kcChatForm">'
    + '<label class="kc-chat-attach" aria-label="Прикрепить фото"><input type="file" id="kcChatFile" accept="image/*" style="display:none"/><svg viewBox="0 0 24 24" fill="none" stroke="#6E6E6E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg></label>'
    + '<input id="kcChatInput" type="text" placeholder="Напишите сообщение..." autocomplete="off" maxlength="1000" />'
    + '<button type="submit" aria-label="Отправить"><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg></button>'
    + '</form>';
  document.body.appendChild(panel);

  var body = panel.querySelector('#kcChatBody');
  var form = panel.querySelector('#kcChatForm');
  var input = panel.querySelector('#kcChatInput');
  var badge = btn.querySelector('.kc-chat-badge');

  function setUnread(n) {
    unread = n;
    badge.textContent = n > 0 ? String(n) : '0';
    badge.style.display = n > 0 ? 'block' : 'none';
  }

  function renderOne(m) {
    var d = document.createElement('div');
    d.className = 'kc-msg ' + m.dir;
    d.dataset.mid = m.id || '';
    if (m.photo) {
      var img = document.createElement('img');
      img.src = m.photo;
      img.alt = 'photo';
      img.onclick = function(){ window.open(m.photo, '_blank'); };
      d.appendChild(img);
    }
    if (m.text) {
      var sp = document.createElement('span');
      sp.textContent = m.text;
      d.appendChild(sp);
    }
    if (m.edited) {
      var ed = document.createElement('span');
      ed.className = 'kc-msg-edited';
      ed.textContent = '(изменено)';
      d.appendChild(ed);
    }
    return d;
  }
  function render() {
    if (rendered === 0 && msgs.length === 0 && !sysHint) {
      sysHint = document.createElement('div');
      sysHint.className = 'kc-msg sys';
      sysHint.textContent = 'Здравствуйте! Напишите свой вопрос — мы ответим в ближайшее время.';
      body.appendChild(sysHint);
      return;
    }
    if (sysHint && msgs.length > 0) { sysHint.remove(); sysHint = null; }
    var atBottom = (body.scrollHeight - body.scrollTop - body.clientHeight) < 40;
    // Full re-render to support edits on existing messages
    body.querySelectorAll('.kc-msg:not(.sys)').forEach(function(el){ el.remove(); });
    for (var i = 0; i < msgs.length; i++) {
      body.appendChild(renderOne(msgs[i]));
    }
    rendered = msgs.length;
    if (atBottom) body.scrollTop = body.scrollHeight;
  }

  function poll() {
    if (pollInFlight) return;
    pollInFlight = true;
    fetch(API + '/poll?sid=' + encodeURIComponent(sid) + '&since=' + lastId, { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.messages) return;
        var newOut = 0;
        var added = 0;
        // Read last seen 'out' msg id from localStorage — any new out msg above that counts as unread
        var lastSeenOutKey = 'kc_last_seen_out:' + sid;
        var lastSeenOutId = parseInt(localStorage.getItem(lastSeenOutKey) || '0', 10);
        var maxOutIdThisPoll = lastSeenOutId;
        for (var i = 0; i < data.messages.length; i++) {
          var m = data.messages[i];
          if (seenIds[m.id]) continue;
          seenIds[m.id] = 1;
          if (m.id > lastId) lastId = m.id;
          // After first poll (page load restore), skip 'in' — they are already local
          if (!isFirstPoll && m.dir === 'in') continue;
          msgs.push({ id: m.id, dir: m.dir, text: m.text, photo: m.photo, edited: m.edited, ts: m.ts });
          added++;
          if (m.dir === 'out') {
            if (m.id > maxOutIdThisPoll) maxOutIdThisPoll = m.id;
            // Count as unread only if not previously seen by user AND widget closed
            if (!open && m.id > lastSeenOutId) newOut++;
          }
        }
        isFirstPoll = false;
        if (added) render();
        if (newOut > 0) setUnread(unread + newOut);
        // If widget open, mark all current out msgs as seen
        if (open && maxOutIdThisPoll > lastSeenOutId) {
          localStorage.setItem(lastSeenOutKey, String(maxOutIdThisPoll));
        }
      })
      .catch(function () {})
      .then(function () { pollInFlight = false; });
  }

  function startPoll() { if (!pollTimer) { poll(); pollTimer = setInterval(poll, POLL_MS); } }
  function stopPoll() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

  function openPanel() {
    open = true;
    panel.classList.add('kc-open');
    setUnread(0);
    // Mark all known out messages as seen
    var maxOutId = 0;
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].dir === 'out' && Object.keys(seenIds).length) {
        for (var id in seenIds) { var n = parseInt(id,10); if (n > maxOutId) maxOutId = n; }
      }
    }
    if (maxOutId > 0) localStorage.setItem('kc_last_seen_out:' + sid, String(maxOutId));
    setTimeout(function () { input.focus(); }, 200);
    startPoll();
  }
  function closePanel() {
    open = false;
    panel.classList.remove('kc-open');
  }

  btn.addEventListener('click', function () { open ? closePanel() : openPanel(); });
  panel.querySelector('.kc-chat-close').addEventListener('click', closePanel);

  function sendPayload(payload) {
    return fetch(API + '/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ sid: sid, page: location.href }, payload)),
      credentials: 'omit',
    }).then(function (r) {
      if (!r.ok) throw new Error('send fail');
      return r.json();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var txt = input.value.trim();
    if (!txt) return;
    input.value = '';
    // Optimistic local render — user sees message immediately
    msgs.push({ dir: 'in', text: txt, ts: Date.now() });
    render();
    sendPayload({ text: txt })
      .then(function () { poll(); })
      .catch(function () {
        msgs.push({ dir: 'sys', text: 'Не удалось отправить. Проверьте интернет.', ts: Date.now() });
        render();
      });
  });

  // Photo attach — reads file as data URL and sends
  var fileInput = panel.querySelector('#kcChatFile');
  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      msgs.push({ dir: 'sys', text: 'Файл больше 4МБ — уменьшите размер.', ts: Date.now() });
      render(); fileInput.value = ''; return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var txt = input.value.trim();
      // Optimistic local render
      msgs.push({ dir: 'in', text: txt, photo: reader.result, ts: Date.now() });
      render();
      sendPayload({ photo: reader.result, text: txt })
        .then(function () { input.value = ''; poll(); })
        .catch(function () {
          msgs.push({ dir: 'sys', text: 'Не удалось отправить фото.', ts: Date.now() });
          render();
        });
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
  });

  setInterval(function () { if (!open) poll(); }, 15000);
  setTimeout(poll, 500);
})();
