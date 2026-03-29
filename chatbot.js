// =====================================================
//  chatbot.js — biz.rrkt 챗봇
//  config.js 보다 나중에 로드해야 해요
//  <script src="config.js"></script>
//  <script src="chatbot.js"></script>
// =====================================================

/* ── 챗봇 커스텀 설정 — 여기를 수정하세요 ── */
const BIZ_BOT_CONFIG = {

  /* ── Gemini 키는 config.js의 GEMINI_KEY 에서 자동으로 읽어요 ── */

  /* ── 작가 연락처 ── */
  contactUrl:   "https://twitter.com/your_handle",
  contactLabel: "Twitter/X @your_handle",

  /* ── 이벤트 (없으면 null 그대로) ── */
  currentEvent: null,
  // 이벤트 생기면 아래처럼:
  // currentEvent: { name:"캐스팅 인기 투표", opens:"2025-06-01", detail:"홈피 내 투표 버튼 클릭" },

};

/* ── 스타일 자동 주입 ── */
(function(){
  const style = document.createElement('style');
  style.textContent = `/* ── CHATBOT FAB ── */
#biz-fab {
  position:fixed; bottom:24px; right:24px; z-index:9000;
  width:52px; height:52px;
  border-radius:50%;
  background:#fff;
  border:1.5px solid #e2e2e2;
  box-shadow:0 4px 20px #0000001a, 0 1px 4px #0000000d;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease, background .18s;
  outline:none;
  -webkit-tap-highlight-color:transparent;
}
#biz-fab:hover { transform:scale(1.1); box-shadow:0 6px 24px #0000002a; }
#biz-fab:active { transform:scale(.95); }
#biz-fab.is-open { background:#111; border-color:#111; }
#biz-fab.is-open .biz-fab-icon { display:none; }
#biz-fab.is-open .biz-fab-close { display:flex; }
.biz-fab-icon {
  display:flex; align-items:center; justify-content:center;
  animation:bizFabWiggle 3.6s ease-in-out infinite;
}
@keyframes bizFabWiggle {
  0%,90%,100%{transform:rotate(0deg)}
  92%{transform:rotate(-12deg)}
  96%{transform:rotate(10deg)}
  98%{transform:rotate(-6deg)}
}
.biz-fab-icon svg { width:22px; height:22px; }
.biz-fab-close {
  display:none; align-items:center; justify-content:center;
  color:#fff; font-size:16px; line-height:1;
}
#biz-fab-badge {
  position:absolute; top:-3px; right:-3px;
  width:17px; height:17px; border-radius:50%;
  background:#c0392b; color:#fff;
  font-size:9px; font-weight:700;
  display:flex; align-items:center; justify-content:center;
  border:2px solid #fff;
  transition:transform .2s cubic-bezier(.34,1.56,.64,1), opacity .2s;
}
#biz-fab-badge.hidden { transform:scale(0); opacity:0; }

/* ── CHAT PANEL ── */
#biz-chat {
  position:fixed; bottom:84px; right:24px; z-index:8999;
  width:320px;
  background:#fff; border:1px solid #e2e2e2;
  border-radius:16px;
  box-shadow:0 12px 40px #0000001a, 0 2px 8px #0000000d;
  display:flex; flex-direction:column;
  overflow:hidden;
  opacity:0; transform:translateY(16px) scale(.96);
  pointer-events:none;
  transition:opacity .22s cubic-bezier(.4,0,.2,1), transform .22s cubic-bezier(.4,0,.2,1);
  max-height:calc(100dvh - 120px);
}
#biz-chat.open {
  opacity:1; transform:translateY(0) scale(1);
  pointer-events:all;
}
@media(max-width:480px){
  #biz-chat { width:calc(100vw - 24px); right:12px; bottom:80px; }
  #biz-fab  { right:16px; bottom:16px; }
}

/* ── CHAT HEADER ── */
.biz-chat-hd {
  padding:12px 14px;
  border-bottom:1px solid #f0f0f0;
  display:flex; align-items:center; gap:10px;
  flex-shrink:0; background:#fff;
}
.biz-chat-hd-dot {
  width:7px; height:7px; border-radius:50%; background:#22c55e; flex-shrink:0;
  animation:bizPulse 2.4s ease-in-out infinite;
}
@keyframes bizPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
.biz-chat-hd-info { flex:1; min-width:0; }
.biz-chat-hd-name { font-size:13px; font-weight:700; color:#111; }
.biz-chat-hd-sub  { font-size:10px; color:#aaa; margin-top:1px; }

/* ── MESSAGES ── */
.biz-chat-msgs {
  flex:1; overflow-y:auto; padding:14px 12px;
  display:flex; flex-direction:column; gap:10px;
  scroll-behavior:smooth;
}
.biz-chat-msgs::-webkit-scrollbar{width:3px}
.biz-chat-msgs::-webkit-scrollbar-thumb{background:#e2e2e2;border-radius:3px}
.biz-msg {
  max-width:82%; font-size:12px; line-height:1.6;
  border-radius:12px; padding:9px 12px;
  word-break:break-word; white-space:pre-wrap;
}
.biz-msg.bot {
  background:#f5f5f5; color:#1a1a1a;
  align-self:flex-start; border-bottom-left-radius:4px;
}
.biz-msg.user {
  background:#111; color:#fff;
  align-self:flex-end; border-bottom-right-radius:4px;
}
.biz-msg.typing {
  background:#f5f5f5; align-self:flex-start;
  border-bottom-left-radius:4px; padding:10px 14px;
}
.biz-typing-dots { display:flex; gap:4px; align-items:center; }
.biz-typing-dots span {
  width:5px; height:5px; border-radius:50%; background:#aaa; display:block;
  animation:bizDot 1.2s ease-in-out infinite;
}
.biz-typing-dots span:nth-child(2){animation-delay:.2s}
.biz-typing-dots span:nth-child(3){animation-delay:.4s}
@keyframes bizDot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}

/* ── QUICK CHIPS ── */
.biz-chips { display:flex; flex-wrap:wrap; gap:5px; padding:0 12px 10px; flex-shrink:0; }
.biz-chip {
  font-size:10px; padding:4px 10px;
  border:1px solid #e2e2e2; border-radius:20px;
  color:#5f5f5f; background:#fff; cursor:pointer;
  transition:all .12s; white-space:nowrap;
  font-family:'Inter','Noto Sans KR',sans-serif;
}
.biz-chip:hover { background:#111; color:#fff; border-color:#111; }

/* ── INPUT ── */
.biz-chat-input-row {
  padding:10px 12px; border-top:1px solid #f0f0f0;
  display:flex; align-items:center; gap:7px; flex-shrink:0; background:#fff;
}
#biz-input {
  flex:1; border:1px solid #e2e2e2; border-radius:20px;
  padding:8px 14px; font-size:12px; color:#1a1a1a;
  font-family:'Inter','Noto Sans KR',sans-serif;
  outline:none; background:#fafafa;
  transition:border-color .14s, background .14s;
  resize:none;
}
#biz-input:focus { border-color:#aaa; background:#fff; }
#biz-send {
  width:32px; height:32px; border-radius:50%;
  background:#111; color:#fff; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  font-size:13px; flex-shrink:0;
  transition:background .12s, transform .12s;
}
#biz-send:hover { background:#333; }
#biz-send:active { transform:scale(.9); }
#biz-send svg { width:13px; height:13px; }`;
  document.head.appendChild(style);
})();

/* ── HTML 자동 주입 ── */
(function(){
  const wrap = document.createElement('div');
  wrap.innerHTML = `<button id="biz-fab" onclick="bizToggleChat()" aria-label="챗봇 열기">
  <span class="biz-fab-icon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.7 1.22 5.12 3.16 6.8L4 22l4.62-2.08C9.7 20.28 10.83 20.5 12 20.5c5.52 0 10-4.03 10-9s-4.48-9-10-9z" fill="#111" opacity=".12"/>
      <path d="M12 3C6.93 3 3 6.69 3 11c0 2.5 1.17 4.76 3.03 6.32L5 21l4.14-1.87C10.03 19.37 11 19.5 12 19.5c5.07 0 9-3.69 9-8.5S17.07 3 12 3z" stroke="#111" stroke-width="1.4" fill="none"/>
      <circle cx="8.5" cy="11" r="1.2" fill="#111"/>
      <circle cx="12" cy="11" r="1.2" fill="#111"/>
      <circle cx="15.5" cy="11" r="1.2" fill="#111"/>
    </svg>
  </span>
  <span class="biz-fab-close">✕</span>
  <div id="biz-fab-badge">1</div>
</button>

<div id="biz-chat">
  <div class="biz-chat-hd">
    <div class="biz-chat-hd-dot"></div>
    <div class="biz-chat-hd-info">
      <div class="biz-chat-hd-name">biz.rrkt 안내봇</div>
      <div class="biz-chat-hd-sub">캐릭터·작품 검색 · 작가 연락 안내</div>
    </div>
  </div>
  <div class="biz-chat-msgs" id="biz-msgs"></div>
  <div class="biz-chips" id="biz-chips">
    <button class="biz-chip" onclick="bizAsk('캐릭터 검색하고 싶어요')">🔍 캐릭터 검색</button>
    <button class="biz-chip" onclick="bizAsk('작가님이랑 대화하고 싶어요')">✉️ 작가 연락</button>
    <button class="biz-chip" onclick="bizAsk('이벤트 일정 알려줘')">⭐ 이벤트</button>
    <button class="biz-chip" onclick="bizAsk('어떤 프로젝트가 있어?')">📂 프로젝트 목록</button>
  </div>
  <div class="biz-chat-input-row">
    <input id="biz-input" placeholder="질문을 입력하세요..." autocomplete="off"
      onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();bizSend();}">
    <button id="biz-send" onclick="bizSend()">
      <svg viewBox="0 0 24 24" fill="none"><path d="M5 12l14-8-5 8 5 8-14-8z" fill="#fff"/></svg>
    </button>
  </div>
</div>`;
  document.body.appendChild(wrap);
})();

/* ── 챗봇 로직 ── */
(function(){
  let _bizOpen = false;
  let _bizHistory = [];
  let _bizGreeted = false;
  let _bizLoading = false;

  /* ── 열기/닫기 ── */
  window.bizToggleChat = function(){
    _bizOpen = !_bizOpen;
    const chat = document.getElementById('biz-chat');
    const fab  = document.getElementById('biz-fab');
    const badge= document.getElementById('biz-fab-badge');
    chat.classList.toggle('open', _bizOpen);
    fab.classList.toggle('is-open', _bizOpen);
    badge.classList.add('hidden');
    if(_bizOpen){
      if(!_bizGreeted){ _bizGreet(); _bizGreeted=true; }
      setTimeout(()=>document.getElementById('biz-input').focus(), 200);
    }
  };

  /* ── 인사 메시지 ── */
  function _bizGreet(){
    _bizAddMsg('bot', '안녕하세요! 👋 biz.rrkt 안내봇이에요.\n캐릭터나 작품 찾는 것도 도와드리고, 작가 연락처나 이벤트 정보도 알려드려요 🌸');
  }

  /* ── 메시지 추가 ── */
  function _bizAddMsg(role, text){
    const box = document.getElementById('biz-msgs');
    const div = document.createElement('div');
    div.className = 'biz-msg ' + role;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
  }

  /* ── 타이핑 인디케이터 ── */
  function _bizShowTyping(){
    const box = document.getElementById('biz-msgs');
    const div = document.createElement('div');
    div.className = 'biz-msg typing';
    div.id = 'biz-typing';
    div.innerHTML = '<div class="biz-typing-dots"><span></span><span></span><span></span></div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
  function _bizHideTyping(){
    const el = document.getElementById('biz-typing');
    if(el) el.remove();
  }

  /* ── 전송 ── */
  window.bizSend = function(){
    const inp = document.getElementById('biz-input');
    const text = inp.value.trim();
    if(!text || _bizLoading) return;
    inp.value = '';
    window.bizAsk(text);
  };

  /* ── 홈피 데이터 자동 수집 ── */
  function _bizBuildContext(){
    try {
      // const/let 선언 변수는 window에 안 붙으므로 typeof로 안전하게 접근
      const _P = (typeof PROJECTS !== 'undefined') ? PROJECTS : [];
      const _V = (typeof VOLUMES  !== 'undefined') ? VOLUMES  : {};
      const _N = (typeof AUTHOR_NOTE !== 'undefined') ? AUTHOR_NOTE : {};

      // 데이터가 아예 없는 페이지면 빈 문자열 반환 (서브페이지 대응)
      if(!_P.length && !Object.keys(_V).length){
        return '【사이트 데이터 없음 — 서브페이지】\n메인 홈피 기준 정보로 안내해주세요.';
      }

      const projs = _P.map(p=>
        `[${p.label}] 상태:${p.status||'active'} / 태그:${(p.tags||[]).join(',')} / 소개:${p.intro||''}`
      ).join('\n');

      const vols = Object.entries(_V).map(([pid, vdata])=>{
        const proj = _P.find(p=>p.id===pid);
        const name = proj ? proj.label : pid;
        if(Array.isArray(vdata)){
          return vdata.map(v=>{
            const eps = (v.episodes||[]).map(e=>`  ${e.title}(${e.status})`).join('\n');
            return `[${name}] ${v.label}\n${eps}`;
          }).join('\n');
        }
        // biz-oc-doll 구조 (categories + episodes 객체)
        if(vdata && vdata.categories){
          const cats = vdata.categories.map(c=>`  카테고리: ${c.label} (${c.count}개)`).join('\n');
          return `[${name}]\n${cats}`;
        }
        return '';
      }).filter(Boolean).join('\n');

      const note = _N.text || '';
      return `【프로젝트】\n${projs}\n\n【에피소드 목록】\n${vols}\n\n【작가 노트】${note}`;
    } catch(e){ return '(데이터 로드 오류)'; }
  }

  window.bizAsk = function(text){
    if(_bizLoading) return;
    if(!_bizGreeted){ _bizGreet(); _bizGreeted=true; }
    _bizAddMsg('user', text);
    _bizHistory.push({ role:'user', parts:[{text}] });
    _bizLoading = true;
    _bizShowTyping();

    const cfg = window.BIZ_BOT_CONFIG || {};
    const key = (typeof GEMINI_KEY !== 'undefined' ? GEMINI_KEY : '') || cfg.geminiKey || '';
    if(!key || key === '여기에_Gemini_API_키_붙여넣기' || key === '여기에_API_키_붙여넣기'){
      _bizHideTyping(); _bizLoading = false;
      _bizAddMsg('bot', 'API 키가 아직 설정되지 않았어요 🔧\nbiz_main 파일에서 BIZ_BOT_CONFIG.geminiKey 를 입력해줘요!');
      return;
    }

    const eventInfo = cfg.currentEvent
      ? `이벤트: ${cfg.currentEvent.name} (오픈: ${cfg.currentEvent.opens}) — ${cfg.currentEvent.detail}`
      : '현재 예정된 이벤트 없음';
    const contact = cfg.contactLabel || cfg.contactUrl || '';
    const siteData = _bizBuildContext();

    const systemInstruction = `당신은 biz.rrkt 팬사이트 안내봇이에요. ${cfg.botPersonality||'친절하고 귀엽게 이모지를 써서 답변하세요.'}

아래는 이 사이트의 실제 데이터예요. 이걸 바탕으로 정확하게 안내하세요.

${siteData}

【이벤트】${eventInfo}
【작가 연락처】${contact}

【답변 규칙】
- 사이트 탐색은 "네비게이션 메뉴(☰)를 이용해보세요" 안내
- 에피소드 직접 링크 불가, 사이트 내 탐색 유도
- 모르는 건 솔직하게 모른다고 하고 작가 연락처 안내
- 사용자 언어에 맞춰 답변 (한국어 기본)
- 3문장 이내로 짧게`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        system_instruction:{ parts:[{text: systemInstruction}] },
        contents: _bizHistory.slice(-12)
      })
    })
    .then(r=>r.json())
    .then(data=>{
      _bizHideTyping(); _bizLoading = false;
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        || '죄송해요, 잠시 오류가 생겼어요 😢 다시 시도해줘요!';
      _bizAddMsg('bot', reply);
      _bizHistory.push({ role:'model', parts:[{text:reply}] });
    })
    .catch(()=>{
      _bizHideTyping(); _bizLoading = false;
      _bizAddMsg('bot', '네트워크 오류가 생겼어요 😢 잠시 후 다시 시도해줘요!');
    });
  };

  /* Escape 키로 닫기 */
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && _bizOpen) bizToggleChat();
  });
})();
