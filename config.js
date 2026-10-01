// =====================================================
//  config.js — shared site settings
//
//  Used by (check before deleting anything):
//    · index.html (hub)          — SHEETS_ID: projects, OC-characters tabs
//    · biz-OC-doll/index.html    — SHEETS_ID: OC-characters, title record tabs · API: likes
//    · biz-OC-doll/doll_pd.html  — SHEETS_ID: OC-characters tab
//    · stock_index.html          — SHEETS_ID: stock tab · DEEPL
//    · bhs_index.html            — DEEPL (reads its sheet with its own BHS_SHEETS_ID)
//
//  This file is public: every visitor's browser downloads it,
//  comments included. Never put passwords, API keys or tokens here,
//  not even as examples in a comment.
//    OK here     : public sheet ID, web app address, proxy address
//    Not OK here : anything that works as a key
// =====================================================

var CONFIG = {

  // --------------------------------------------------
  //  Google Apps Script web app — receives likes (write only)
  //
  //  Like totals can't be read through this address;
  //  there is intentionally no read route.
  //  Totals are checked by running the script in the Apps Script editor.
  // --------------------------------------------------
  API: 'https://script.google.com/macros/s/AKfycbyQ9DiU6MuIZQGue3o12fEKd38HBTFVvSn1KVDpz7Nsqzu7KJDzQCBeRJGZ3vHRwZMg0Q/exec',


  // --------------------------------------------------
  //  Shared Google Sheet (read as public CSV, no API key)
  //
  //  Must be shared as "Anyone with the link → Viewer",
  //  because the sites read it directly.
  //
  //  Sharing works per file — a single tab can't be hidden.
  //  Put only things that are fine to be public in this sheet.
  //  (Like logs are kept in a separate private spreadsheet.)
  //
  //  bhs_index.html has the same ID written separately (BHS_SHEETS_ID).
  //  If the sheet ever moves, change it there too.
  // --------------------------------------------------
  SHEETS_ID: '19UUoMegsFTR3jeAo-dml6DSZEmWsqv6zM6EaiJPGbfk',


  // --------------------------------------------------
  //  DeepL translation proxy (Cloudflare Workers)
  //
  //  The DeepL key lives only inside the Cloudflare Worker.
  //  Only the proxy address goes here. To change the key,
  //  edit the Worker in the Cloudflare dashboard.
  //
  //  enabled: false → skip DeepL and use Google Translate only.
  // --------------------------------------------------
  DEEPL: {
    proxyUrl: 'https://rrktbiz-translate.biz202099.workers.dev',
    timeout:  5000,
    enabled:  true
  },

};


// =====================================================
//  Shortcut
// =====================================================
var API = CONFIG.API;


// =====================================================
//  Build a Google Sheet CSV address
//  Usage: SHEET_CSV('OC-characters')
// =====================================================
function SHEET_CSV(tabName){
  return 'https://docs.google.com/spreadsheets/d/' + CONFIG.SHEETS_ID
       + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(tabName);
}
