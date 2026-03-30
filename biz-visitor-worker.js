/**
 * biz-visitor-worker.js
 * Cloudflare Workers — 나라별 방문자 집계
 *
 * [설정 방법]
 * 1. Cloudflare Dashboard → Workers & Pages → Create Worker
 * 2. 이 코드를 붙여넣기
 * 3. Settings → Variables → KV Namespace Bindings
 *    Variable name: VIS_KV
 *    KV Namespace: 새로 만들기 (이름 예: biz-visitor-kv)
 * 4. Deploy 후 Workers URL 복사 → biz_main_final.html 의
 *    VIS_WORKER_URL = 'https://biz-visitor.YOUR_SUBDOMAIN.workers.dev' 에 붙여넣기
 */

export default {
  async fetch(request, env) {

    /* CORS — GitHub Pages 도메인 허용 */
    const ALLOWED_ORIGINS = [
      'https://YOUR_GITHUB_USERNAME.github.io',  // ← 본인 GitHub Pages 도메인으로 수정
      'http://localhost',
      'http://127.0.0.1',
    ];
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json;charset=UTF-8',
    };

    /* Preflight */
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    /* POST /hit — 방문 기록 + 현황 반환 */
    if (request.method === 'POST' && url.pathname === '/hit') {
      const cc = (request.cf?.country || 'XX').toUpperCase();

      /* KV에 원자적으로 +1 */
      const [prevTotal, prevCC] = await Promise.all([
        env.VIS_KV.get('total'),
        env.VIS_KV.get(`cc:${cc}`),
      ]);
      const newTotal = (parseInt(prevTotal || '0') + 1);
      const newCC    = (parseInt(prevCC    || '0') + 1);
      await Promise.all([
        env.VIS_KW.put('total', String(newTotal)),
        env.VIS_KW.put(`cc:${cc}`, String(newCC)),
      ]);

      /* 전체 나라 목록 읽어서 내려주기 */
      const data = await _getStats(env, newTotal);
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    /* GET /stats — 집계만 조회 (방문수 증가 없음) */
    if (request.method === 'GET' && url.pathname === '/stats') {
      const total = parseInt(await env.VIS_KV.get('total') || '0');
      const data  = await _getStats(env, total);
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};

async function _getStats(env, total) {
  /* KV list로 cc:* 키 전체 읽기 */
  const listed = await env.VIS_KV.list({ prefix: 'cc:' });
  const countries = await Promise.all(
    listed.keys.map(async k => {
      const code  = k.name.replace('cc:', '');
      const count = parseInt(await env.VIS_KV.get(k.name) || '0');
      return { code, count };
    })
  );
  countries.sort((a, b) => b.count - a.count);
  return { total, countries };
}
