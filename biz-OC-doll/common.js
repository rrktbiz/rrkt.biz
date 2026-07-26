/* ══════════════════════════════════════════════════
   common.js — 전 페이지 공용 UI 컴포넌트
   · 상단바 우측 (번역 뱃지 · 문의 버튼 · 언어 드롭다운 · 번역 안내문)
   · 제작자 소개 / 비즈니스 문의 오버레이
   · 푸터 (저작권 · 공식 백업 안내)

   ── 쓰는 법 ──
     <div class="tb-right" style="position:relative"></div>   ← 비워두면 자동으로 채웁니다
     <link rel="stylesheet" href="common.css">
     script src="common.js"   ← 본문 마크업 뒤에 로드
     script src="tl.js"       ← 반드시 common.js 다음

   ── 바꿀 일이 생기면 여기만 ──
     BIZ.MAIL / BIZ.PROFILE_IMG / BIZ.BACKUP_LINKS / BIZ.TL_NOTE
   ══════════════════════════════════════════════════ */

var BIZ = window.BIZ = {

  MAIL:        'rrkt.biz@proton.me',
  PROFILE_IMG: '../profile.png',
  WHO_NAME:    'BIZ',
  WHO_TAG:     '스토리 / 캐릭터를 기반으로 IP로 확장 가능한 원작을 만듭니다.',

  BACKUP_LINKS: [
    'https://www.postype.com/@biz202099',
    'https://www.postype.com/@rrkt2022'
  ],

  /* 언어 드롭다운 하단 안내문 — 한 곳만 고치면 전 페이지 반영 */
  TL_NOTE:
    '<b>DeepL 우선</b> · 한도 초과 시 <b>Google 번역</b> 자동 전환<br>' +
    '정식 번역은 <b>한 &rarr; 영 &rarr; 일 &rarr; 중</b> 순서로 제공될 예정입니다.',

  /* ── 푸터 ── */
  footerHtml: function(){
    var links = BIZ.BACKUP_LINKS.map(function(u){
      return '<a href="' + u + '" target="_blank" rel="noopener">' +
             u.replace(/^https?:\/\/(www\.)?/, '') + '</a>';
    }).join('');
    return '<div class="site-footer"><div class="site-footer-inner">' +
      '<span class="sf-copy">&copy; BIZ. All rights reserved.</span>' +
      '<span class="sf-sep"></span>' +
      '<span class="sf-note">본 콘텐츠는 작가 본인이 아래 주소에 백업 업로드합니다. 불펌이 아닌 공식 업로드입니다.</span>' +
      '<span class="sf-links">' + links + '</span>' +
      '</div></div>';
  },
  mountFooter: function(target){
    var el = (typeof target === 'string') ? document.querySelector(target) : target;
    if(el) el.insertAdjacentHTML('beforeend', BIZ.footerHtml());
  },

  /* ── 상단바 우측 ── */
  topbarRightHtml: function(){
    return `      <span id="tl-badge"></span>
      <button id="tb-contact-btn" onclick="openContactOverlay()" title="제작자 소개 · 비즈니스 문의" aria-label="제작자 소개 · 비즈니스 문의">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
      </button>
      <button id="tb-lang-drop-btn" onclick="tbLangToggle()">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" style="flex-shrink:0"><circle cx="8" cy="8" r="6.5"/><ellipse cx="8" cy="8" rx="2.6" ry="6.5"/><path d="M1.5 6h13M1.5 10h13"/></svg>
        <span id="tb-lang-label" class="tb-btn-txt">Language</span>
        <span id="tb-lang-caret" class="tb-btn-txt" style="font-size:8px;transition:transform .15s;display:inline-block">&#9660;</span>
      </button>
      <div id="tb-lang-dropdown">
        <div style="padding:12px 14px 10px;border-bottom:1px solid var(--bd)">
          <div style="font-size:13px;font-weight:600;color:var(--tx);margin-bottom:8px">Language</div>
          <input id="tb-lang-search" type="text" placeholder="Search language..." oninput="tbLangFilter()" style="width:100%;padding:6px 10px;border:1px solid var(--bd);border-radius:6px;font-size:12px;background:var(--bg);color:var(--tx);outline:none;font-family:var(--fn)">
        </div>
        <div id="tb-lang-list" style="max-height:260px;overflow-y:auto"></div>
        <div class="tb-lang-note">${BIZ.TL_NOTE}</div>
      </div>`;
  },

  /* ── 문의 오버레이 ── */
  contactHtml: function(){
    return `<!-- ===== 제작자 소개 · 비즈니스 문의 ===== -->
<div id="contact-overlay" class="hidden" onclick="if(event.target===this)closeContactOverlay()">
  <div class="contact-card">
    <button class="contact-close" onclick="closeContactOverlay()" aria-label="닫기">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 1.5l11 11M12.5 1.5l-11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
    <div class="contact-who">
      <div class="contact-who-thumb"><img src="../profile.png" alt="BIZ" onerror="this.style.display='none'"></div>
      <div>
        <div class="contact-who-name">BIZ</div>
        <div class="contact-who-tag">스토리 / 캐릭터를 기반으로 IP로 확장 가능한 원작을 만듭니다.</div>
      </div>
    </div>
    <div class="contact-eyebrow">Contact</div>
    <div class="contact-title">비즈니스 문의</div>
    <div class="contact-desc">제안서 또는 구체적인 협업 내용이 포함된 메일만 검토합니다.<br>응답까지 시간이 걸릴 수 있으며, 모든 문의에 회신하기 어려울 수 있습니다.</div>
    <div class="contact-mailrow">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a0a0a0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
      <span class="mail">rrkt.biz@proton.me</span>
      <button class="biq-copy-btn" onclick="biqCopyEmail(this)" title="복사">
        <svg class="biq-copy-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        <span class="biq-copy-txt">복사</span>
      </button>
    </div>
  </div>
</div>`;
  },

  openContact:  function(){ var o = document.getElementById('contact-overlay'); if(o) o.classList.remove('hidden'); },
  closeContact: function(){ var o = document.getElementById('contact-overlay'); if(o) o.classList.add('hidden'); },

  copyEmail: function(btn){
    navigator.clipboard.writeText(BIZ.MAIL).then(function(){
      var svg = btn.querySelector('.biq-copy-svg'), txt = btn.querySelector('.biq-copy-txt');
      if(svg) svg.outerHTML = '<svg class="biq-copy-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      if(txt) txt.textContent = '완료';
      btn.style.borderColor = '#bbf7d0'; btn.style.background = '#f0fdf4'; btn.style.color = '#22c55e';
      setTimeout(function(){
        var s2 = btn.querySelector('.biq-copy-svg');
        if(s2) s2.outerHTML = '<svg class="biq-copy-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
        var t2 = btn.querySelector('.biq-copy-txt');
        if(t2) t2.textContent = '복사';
        btn.style.borderColor = ''; btn.style.background = ''; btn.style.color = '';
      }, 1800);
    });
  },

  /* ── 초기 주입 ── */
  mount: function(){
    var tbr = document.querySelector('.tb-right');
    if(tbr && !tbr.children.length) tbr.innerHTML = BIZ.topbarRightHtml();
    if(!document.getElementById('contact-overlay'))
      document.body.insertAdjacentHTML('beforeend', BIZ.contactHtml());
  }
};

/* 기존 onclick / 기존 코드 호환 */
window.openContactOverlay  = BIZ.openContact;
window.closeContactOverlay = BIZ.closeContact;
window.biqCopyEmail        = BIZ.copyEmail;
var SITE_FOOTER_HTML       = BIZ.footerHtml();

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') BIZ.closeContact();
});

BIZ.mount();
