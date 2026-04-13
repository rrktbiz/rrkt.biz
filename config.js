// =====================================================
//  config.js — 민감한 주소 모음
//  ⚠️  이 파일은 공유하지 마세요
// =====================================================

var CONFIG = {

  // --------------------------------------------------
  //  Google Apps Script API (시트 탭 전체 공통)
  //
  //  연결된 시트 탭:
  //    - votes       : 인기 투표 득표수
  //    - characters  : 캐릭터 기본 정보
  //    - APPEARANCES : 등장 기록 아카이브
  //
  //  사용법 예시:
  //    fetch(API + '?action=getCharacters')
  //    fetch(API + '?action=getAppearances&code=BIZOC2026001')
  //    fetch(API + '?action=like&code=BIZOC2026001')
  //    fetch(API + '?action=getVotes')
  //    fetch(API + '?action=vote&ids=[1,2,3]')
  //    fetch(API + '?action=cancelVote&ids=[1,2,3]')
  // --------------------------------------------------
  API: 'https://script.google.com/macros/s/AKfycbyQ9DiU6MuIZQGue3o12fEKd38HBTFVvSn1KVDpz7Nsqzu7KJDzQCBeRJGZ3vHRwZMg0Q/exec',

  // --------------------------------------------------
  //  Google Sheets ID (공개 CSV 방식 — API 키 불필요)
  //
  //  설정 방법:
  //  1. 구글시트 → 공유 → "링크가 있는 모든 사용자 → 뷰어"로 설정
  //  2. 시트 URL에서 /d/ 뒤의 ID를 복사해서 아래에 붙여넣기
  //     예: https://docs.google.com/spreadsheets/d/【여기】/edit
  // --------------------------------------------------
  SHEETS_ID: '19UUoMegsFTR3jeAo-dml6DSZEmWsqv6zM6EaiJPGbfk',

  // --------------------------------------------------
  //  DeepL 번역 프록시 (Cloudflare Workers)
  //
  //  사용법:
  //  1. https://dash.cloudflare.com → Workers → 새 Worker 생성
  //  2. 아래 Worker 코드를 붙여넣고 배포
  //  3. 배포된 URL을 proxyUrl에 입력
  //
  //  Worker 코드 (복사해서 사용):
  //  ────────────────────────────────────────────────
  //  export default {
  //    async fetch(request) {
  //      if (request.method === 'OPTIONS') {
  //        return new Response(null, { headers: {
  //          'Access-Control-Allow-Origin': '*',
  //          'Access-Control-Allow-Methods': 'POST',
  //          'Access-Control-Allow-Headers': 'Content-Type'
  //        }});
  //      }
  //      const { text, target_lang } = await request.json();
  //      const res = await fetch('https://api-free.deepl.com/v2/translate', {
  //        method: 'POST',
  //        headers: {
  //          'Authorization': 'DeepL-Auth-Key DeepL-Auth-Key 99a02a07-9049-4a56-b3f9-03f4eda8987a:fx',
  //          'Content-Type': 'application/json'
  //        },
  //        body: JSON.stringify({ text, target_lang })
  //      });
  //      const data = await res.json();
  //      return new Response(JSON.stringify(data), {
  //        headers: {
  //          'Content-Type': 'application/json',
  //          'Access-Control-Allow-Origin': '*'
  //        },
  //        status: res.status
  //      });
  //    }
  //  }
  //  ────────────────────────────────────────────────
  //
  //  proxyUrl: Workers 배포 후 아래에 URL 입력
  //  enabled:  false 로 바꾸면 DeepL 건너뛰고 Google만 사용
  // --------------------------------------------------
  DEEPL: {
    proxyUrl: 'https://rrktbiz-translate.biz202099.workers.dev',
    timeout:  5000,
    enabled:  true
  },

  // --------------------------------------------------
  //  투표 인증 시트 GAS (별도 스크립트 · 별도 시트)
  //
  //  연결된 시트: vote_public_view (인증 코드 기록용)
  //
  //  설정 방법:
  //  1. 해당 GAS 프로젝트 → 배포 → 새 배포 → 웹앱
  //  2. 배포 URL을 아래 CERT_GAS_URL 에 붙여넣기
  //  3. CERT_TOKEN 은 GAS 코드의 SECRET 값과 반드시 일치
  // --------------------------------------------------
  CERT_GAS_URL: 'https://script.google.com/macros/s/AKfycbyU5j-miycRxKxOV4a5eNYe-ARB0GcQw6yaUOgIY0cVW2WB48MIDM0IqTiqvGD8ad4txg/exec',
  CERT_TOKEN:   'bzd2026vote',

};

// =====================================================
//  단축 변수 (HTML에서 API 바로 사용 가능)
// =====================================================
var API         = CONFIG.API;
var VOTE_URL    = CONFIG.API;       // vote.html 기존 코드 호환용
var CERT_GAS_URL = CONFIG.CERT_GAS_URL;
var CERT_TOKEN   = CONFIG.CERT_TOKEN;
// SHEETS_ID 는 각 HTML에서 const 로 선언하므로 여기서 var 선언 안 함

// =====================================================
//  구글시트 CSV URL 생성 헬퍼
//  사용법: SHEET_CSV('OC-characters')
// =====================================================
function SHEET_CSV(tabName){
  return 'https://docs.google.com/spreadsheets/d/' + CONFIG.SHEETS_ID
       + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(tabName);
}

