/* ============================================
   VERCEL SERVERLESS PROXY — IFRAME BYPASS
   ============================================
   
   Contorna headers X-Frame-Options e CSP que impedem
   carregamento de sites externos em <iframe>.
   
   Uso: /api/proxy?url=https://www.minhanaturgy.com.br/hc/pt-br
   
   Restrição de domínio: Apenas domínios Naturgy são permitidos.
   ============================================ */

export default async function handler(req, res) {
  const targetUrl = req.query.url;

  // ── Validar parâmetro ───
  if (!targetUrl) {
    return res.status(400).json({ error: 'Parâmetro "url" é obrigatório' });
  }

  // ── Validar e restringir domínio (proteção contra SSRF) ───
  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return res.status(400).json({ error: 'URL inválida' });
  }

  const allowedDomains = [
    'minhanaturgy.com.br',
    'www.minhanaturgy.com.br',
    'naturgy.com.br',
    'www.naturgy.com.br',
  ];

  const isAllowed = allowedDomains.some(
    d => parsedUrl.hostname === d || parsedUrl.hostname.endsWith('.' + d)
  );

  if (!isAllowed) {
    return res.status(403).json({
      error: 'Domínio não permitido',
      allowed: allowedDomains,
    });
  }

  // ── Fazer requisição ao site alvo ───
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || 'text/html';
    let body = await response.text();

    // ── Injetar <base> tag para resolver URLs relativos ───
    if (contentType.includes('text/html')) {
      body = body.replace(
        /<head([^>]*)>/i,
        `<head$1><base href="${parsedUrl.origin}/">`
      );
    }

    // ── Definir headers de resposta SEM bloqueio de iframe ───
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300');
    // Nota: NÃO setamos X-Frame-Options nem CSP — é o objetivo do proxy

    return res.status(response.status).send(body);
  } catch (error) {
    console.error('[Proxy] Erro:', error.message);
    return res.status(502).json({
      error: 'Falha ao carregar página',
      details: error.message,
    });
  }
}
