/* ══════════════════════════════════════════════════
   tl.js — 페이지 공용 번역 엔진
   · 상단바 언어 드롭다운 (Google Translate)
   · 같은 출처 iframe 에 언어 전파
   · 페이지별 추가 동작은  TL.onChange(fn)  으로 등록
   ── 쓰는 DOM (없으면 조용히 무시) ──
     #tl-badge  #tb-lang-drop-btn  #tb-lang-dropdown
     #tb-lang-label  #tb-lang-caret  #tb-lang-search  #tb-lang-list
   ── 로드 위치 ──
     상단바 HTML 뒤 · 페이지 인라인 스크립트 앞
   ══════════════════════════════════════════════════ */

var TL = window.TL = {
  lang:  'ko',
  hooks: [],
  onChange:   function(fn){ if(typeof fn === 'function') TL.hooks.push(fn); },
  badge:      function(engine){ _tlBadge(engine); },
  badgeReset: function(){ _tlBadgeReset(); },
  set:        function(lang){ setLang(lang); }
};

/* ── 번역 뱃지 ── */
function _tlBadge(engine){
  var el = document.getElementById('tl-badge'); if(!el) return;
  el.className = engine + ' show';
  el.textContent = (engine === 'deepl') ? 'DeepL' : 'Google';
}
function _tlBadgeReset(){
  var el = document.getElementById('tl-badge'); if(!el) return;
  el.className = ''; el.textContent = '';
}

/* ── Google Translate ── */
function googleTranslateElementInit(){
  new google.translate.TranslateElement({pageLanguage:'ko', autoDisplay:false}, 'google_translate_element');
}
function _tlGoogle(lang){
  _tlBadge('google');
  var sel = document.querySelector('.goog-te-combo');
  if(sel){ sel.value = lang; sel.dispatchEvent(new Event('change')); return; }
  /* 위젯 미로드 시 쿠키 방식 */
  document.cookie = 'googtrans=/ko/' + lang + ';path=/';
  document.cookie = 'googtrans=/ko/' + lang + ';path=/;domain=.' + location.hostname;
  location.reload();
}

/* ── iframe 탭에도 번역 적용 (같은 출처일 때만) ── */
function _injectGT(fr){
  try{
    var d = fr.contentDocument, w = fr.contentWindow;
    if(!d || !w || w.__gtInjected) return;
    w.__gtInjected = true;
    var slot = d.createElement('div');
    slot.id = 'google_translate_element';
    slot.style.display = 'none';
    d.body.appendChild(slot);
    w.googleTranslateElementInit = function(){
      new w.google.translate.TranslateElement({pageLanguage:'ko', autoDisplay:false}, 'google_translate_element');
    };
    var sc = d.createElement('script');
    sc.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    d.body.appendChild(sc);
  }catch(e){}
}
function _setIframeLang(fr, lang, tries){
  tries = tries || 0;
  try{
    var d = fr.contentDocument; if(!d) return;
    var sel = d.querySelector('.goog-te-combo');
    if(sel){ sel.value = lang; sel.dispatchEvent(new Event('change')); return; }
  }catch(e){ return; }
  if(tries < 20) setTimeout(function(){ _setIframeLang(fr, lang, tries + 1); }, 350);
}
function _applyLangToIframes(lang){
  document.querySelectorAll('.panel iframe').forEach(function(fr){
    if(lang === 'ko') return;
    _injectGT(fr);
    _setIframeLang(fr, lang);
    /* 자체 tl.js 를 가진 하위 페이지(story.html 등)에 언어를 알려줌 */
    try{ fr.contentWindow.postMessage({type:'biz-tl-lang', lang:lang}, '*'); }catch(e){}
  });
}
window._applyLangToIframes = _applyLangToIframes;

/* 부모 프레임이 언어를 바꿨을 때 — 구글 위젯은 부모가 이미 주입하므로 상태만 맞춘다 */
window.addEventListener('message', function(ev){
  var d = ev.data;
  if(!d || d.type !== 'biz-tl-lang' || d.lang === TL.lang) return;
  TL.lang = d.lang;
  TL.hooks.forEach(function(fn){ try{ fn(d.lang); }catch(e){ console.warn('[TL hook]', e); } });
  _tlBadge('google');
});

/* ── 언어 전환 진입점 ── */
function setLang(lang){
  TL.lang = lang;

  if(lang === 'ko'){
    document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=;path=/;domain=.' + location.hostname + ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
    location.reload();
    return;
  }

  /* 페이지별 훅 — 스토리 본문 DeepL 등 (TL.onChange 로 등록) */
  TL.hooks.forEach(function(fn){
    try{ fn(lang); }catch(e){ console.warn('[TL hook]', e); }
  });

  _tlGoogle(lang);
  _applyLangToIframes(lang);
}
window.setLang = setLang;
window.googleTranslateElementInit = googleTranslateElementInit;

/* ══ 상단바 언어 드롭다운 ══ */
(function(){
  var ALL_LANGS=[
    ['Afrikaans','af'],['Albanian','sq'],['Amharic','am'],['Arabic','ar'],['Armenian','hy'],
    ['Azerbaijani','az'],['Basque','eu'],['Belarusian','be'],['Bengali','bn'],['Bosnian','bs'],
    ['Bulgarian','bg'],['Catalan','ca'],['Cebuano','ceb'],['Chinese (Simplified)','zh-CN'],
    ['Chinese (Traditional)','zh-TW'],['Corsican','co'],['Croatian','hr'],['Czech','cs'],
    ['Danish','da'],['Dutch','nl'],['English','en'],['Esperanto','eo'],['Estonian','et'],
    ['Finnish','fi'],['French','fr'],['Frisian','fy'],['Galician','gl'],['Georgian','ka'],
    ['German','de'],['Greek','el'],['Gujarati','gu'],['Haitian Creole','ht'],['Hausa','ha'],
    ['Hawaiian','haw'],['Hebrew','iw'],['Hindi','hi'],['Hmong','hmn'],['Hungarian','hu'],
    ['Icelandic','is'],['Igbo','ig'],['Indonesian','id'],['Irish','ga'],['Italian','it'],
    ['Japanese','ja'],['Javanese','jv'],['Kannada','kn'],['Kazakh','kk'],['Khmer','km'],
    ['Korean','ko'],['Kurdish','ku'],['Kyrgyz','ky'],['Lao','lo'],['Latin','la'],
    ['Latvian','lv'],['Lithuanian','lt'],['Luxembourgish','lb'],['Macedonian','mk'],
    ['Malagasy','mg'],['Malay','ms'],['Malayalam','ml'],['Maltese','mt'],['Maori','mi'],
    ['Marathi','mr'],['Mongolian','mn'],['Myanmar (Burmese)','my'],['Nepali','ne'],
    ['Norwegian','no'],['Nyanja (Chichewa)','ny'],['Pashto','ps'],['Persian','fa'],
    ['Polish','pl'],['Portuguese','pt'],['Punjabi','pa'],['Romanian','ro'],['Russian','ru'],
    ['Samoan','sm'],['Scots Gaelic','gd'],['Serbian','sr'],['Sesotho','st'],['Shona','sn'],
    ['Sindhi','sd'],['Sinhala','si'],['Slovak','sk'],['Slovenian','sl'],['Somali','so'],
    ['Spanish','es'],['Sundanese','su'],['Swahili','sw'],['Swedish','sv'],['Tagalog (Filipino)','tl'],
    ['Tajik','tg'],['Tamil','ta'],['Telugu','te'],['Thai','th'],['Turkish','tr'],
    ['Ukrainian','uk'],['Urdu','ur'],['Uzbek','uz'],['Vietnamese','vi'],['Welsh','cy'],
    ['Xhosa','xh'],['Yiddish','yi'],['Yoruba','yo'],['Zulu','zu']
  ];
  var _sel = null, _open = false;
  var PRIORITY = ['ko','en','zh-CN','ja'];

  function item(l){
    var name = l[0], code = l[1], isS = (_sel === code);
    var d = document.createElement('div');
    d.style.cssText = 'display:flex;align-items:center;padding:8px 14px;cursor:pointer;gap:10px;background:' + (isS ? 'var(--sm)' : 'transparent');
    d.onmouseover = function(){ this.style.background = 'var(--sm)'; };
    d.onmouseout  = function(){ this.style.background = isS ? 'var(--sm)' : 'transparent'; };
    d.onclick = function(){ tbLangSelect(code, name); };
    var n = document.createElement('span');
    n.style.cssText = 'font-size:13px;color:var(--tx);flex:1'; n.textContent = name;
    var c = document.createElement('span');
    c.style.cssText = 'font-size:11px;color:var(--tx3);font-family:monospace'; c.textContent = code;
    d.appendChild(n); d.appendChild(c);
    if(isS){ var ck = document.createElement('span'); ck.style.cssText = 'font-size:12px;color:#3558c0'; ck.textContent = '✓'; d.appendChild(ck); }
    return d;
  }
  function render(q){
    var list = document.getElementById('tb-lang-list'); if(!list) return;
    var f = (q || '').toLowerCase().trim();
    var filtered = f ? ALL_LANGS.filter(function(l){
      return l[0].toLowerCase().indexOf(f) > -1 || l[1].toLowerCase().indexOf(f) > -1;
    }) : ALL_LANGS;
    list.innerHTML = '';
    if(!filtered.length){
      list.innerHTML = '<div style="padding:20px;text-align:center;font-size:12px;color:var(--tx3)">No results</div>';
      return;
    }
    if(!f){
      PRIORITY.map(function(c){
        return ALL_LANGS.filter(function(l){ return l[1] === c; })[0];
      }).filter(Boolean).forEach(function(l){ list.appendChild(item(l)); });
      var div = document.createElement('div');
      div.style.cssText = 'height:1px;background:var(--bd);margin:4px 0';
      list.appendChild(div);
      filtered.filter(function(l){ return PRIORITY.indexOf(l[1]) === -1; }).forEach(function(l){ list.appendChild(item(l)); });
    }else{
      filtered.forEach(function(l){ list.appendChild(item(l)); });
    }
  }
  function close(){
    _open = false;
    var dd = document.getElementById('tb-lang-dropdown');
    var btn = document.getElementById('tb-lang-drop-btn');
    var caret = document.getElementById('tb-lang-caret');
    if(dd) dd.style.display = 'none';
    if(btn){ btn.style.background = 'transparent'; btn.style.color = 'var(--tx2)'; btn.style.borderColor = 'var(--bd)'; }
    if(caret) caret.style.transform = '';
  }
  window.tbLangToggle = function(){
    _open = !_open;
    var dd = document.getElementById('tb-lang-dropdown');
    var btn = document.getElementById('tb-lang-drop-btn');
    var caret = document.getElementById('tb-lang-caret');
    if(!dd) return;
    dd.style.display = _open ? 'block' : 'none';
    if(btn){
      btn.style.background = _open ? 'var(--sm)' : 'transparent';
      btn.style.color = _open ? 'var(--tx)' : 'var(--tx2)';
      btn.style.borderColor = _open ? 'var(--bd2)' : 'var(--bd)';
    }
    if(caret) caret.style.transform = _open ? 'rotate(180deg)' : '';
    if(_open){ render(''); setTimeout(function(){ var s = document.getElementById('tb-lang-search'); if(s) s.focus(); }, 80); }
  };
  window.tbLangFilter = function(){
    var s = document.getElementById('tb-lang-search');
    render(s ? s.value : '');
  };
  window.tbLangSelect = function(code, name){
    _sel = code;
    var lbl = document.getElementById('tb-lang-label');
    if(lbl) lbl.textContent = name;
    close();
    setLang(code);
  };
  document.addEventListener('click', function(e){
    if(_open && !e.target.closest('#tb-lang-drop-btn') && !e.target.closest('#tb-lang-dropdown')) close();
  });

  /* 새로고침 후에도 선택 언어 라벨 유지 (googtrans 쿠키 기준) */
  var m = document.cookie.match(/googtrans=\/[^\/]+\/([^;]+)/);
  if(m && m[1] && m[1] !== 'ko'){
    TL.lang = m[1];
    _sel = m[1];
    var found = ALL_LANGS.filter(function(l){ return l[1] === m[1]; })[0];
    var lbl0 = document.getElementById('tb-lang-label');
    if(lbl0 && found) lbl0.textContent = found[0];
    _tlBadge('google');
  }
})();
