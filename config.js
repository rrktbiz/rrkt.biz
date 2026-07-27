// =====================================================
//  config.js — 사이트 공통 설정
//
//  이 파일을 쓰는 곳 (지우기 전에 반드시 확인)
//    · biz-OC-doll  — bizocdoll_index.html / doll_charlist.html / story.html
//    · Blood High School — bhs_index.html
//
//  ⚠️ 두 프로젝트가 같이 씁니다.
//     "안 쓰는 것 같은데" 하고 지우면 다른 쪽이 멈춥니다.
//
//  ⚠️  이 파일은 '공개' 파일입니다.
//      사이트를 여는 모든 사람의 브라우저가 이 파일을 받아갑니다.
//      주소창에 .../config.js 만 쳐도 내용이 그대로 보입니다.
//      주석도 똑같이 보입니다.
//
//      → 비밀번호, API 키, 토큰을 절대 여기 두지 마세요.
//        (주석 안에 예시로 적어두는 것도 안 됩니다)
//
//      여기 있어도 되는 것 : 공개 시트 주소, 웹앱 주소, 프록시 주소
//      여기 있으면 안 되는 것 : 열쇠 역할을 하는 모든 값
// =====================================================

var CONFIG = {

  // --------------------------------------------------
  //  Google Apps Script 웹앱
  //
  //  연결된 시트 탭:
  //    - OC-characters : 캐릭터 기본 정보
  //
  //  쓰는 곳:
  //    doll_charlist.html — 좋아요 기록 (POST)
  //
  //  ※ Blood High School 은 이 값을 쓰지 않습니다.
  //
  //  ※ 좋아요 집계 결과는 이 주소로 읽을 수 없습니다.
  //     읽는 통로를 아예 만들지 않았습니다. (의도된 설계)
  //     집계는 Apps Script 에디터에서 직접 실행해서 봅니다.
  // --------------------------------------------------
  API: 'https://script.google.com/macros/s/AKfycbyQ9DiU6MuIZQGue3o12fEKd38HBTFVvSn1KVDpz7Nsqzu7KJDzQCBeRJGZ3vHRwZMg0Q/exec',


  // --------------------------------------------------
  //  공용 시트 (공개 CSV 방식 · API 키 불필요)
  //
  //  이 시트를 두 프로젝트가 나눠 씁니다:
  //    - OC-characters 탭 → biz-OC-doll  (SHEET_CSV 로 읽음)
  //    - episodes      탭 → Blood High School
  //                         (bhs_index.html 안 BHS_SHEETS_ID 에 같은 값이
  //                          따로 적혀 있습니다. 시트를 옮기면 그쪽도 같이 고치세요)
  //
  //  ※ 이 시트는 '링크가 있는 모든 사용자 → 뷰어' 여야 합니다.
  //     두 사이트가 직접 읽어가기 때문입니다.
  //
  //  ※ 구글시트 공유는 '문서 단위'입니다. 탭 하나만 숨길 수 없습니다.
  //     그래서 좋아요 집계(like_log)는 별도 스프레드시트로 뺐습니다.
  //     이 시트에는 공개돼도 괜찮은 것만 두세요.
  // --------------------------------------------------
  SHEETS_ID: '19UUoMegsFTR3jeAo-dml6DSZEmWsqv6zM6EaiJPGbfk',


  // --------------------------------------------------
  //  DeepL 번역 프록시 (Cloudflare Workers)
  //
  //  쓰는 곳: story.html · bhs_index.html (둘 다 씁니다)
  //
  //  ※ DeepL API 키는 Cloudflare Worker 안에만 있습니다.
  //     여기에는 프록시 주소만 둡니다. 키를 다시 적지 마세요.
  //     키를 바꿔야 하면 Cloudflare 대시보드에서 Worker 를 고치세요.
  //
  //  enabled: false 로 바꾸면 DeepL 을 건너뛰고 Google 번역만 씁니다.
  // --------------------------------------------------
  DEEPL: {
    proxyUrl: 'https://rrktbiz-translate.biz202099.workers.dev',
    timeout:  5000,
    enabled:  true
  },

};


// =====================================================
//  단축 변수
// =====================================================
var API = CONFIG.API;


// =====================================================
//  구글시트 CSV 주소 만들기
//  사용법: SHEET_CSV('OC-characters')
// =====================================================
function SHEET_CSV(tabName){
  return 'https://docs.google.com/spreadsheets/d/' + CONFIG.SHEETS_ID
       + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(tabName);
}
