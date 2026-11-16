/**
 * Cloudflare Pages Functions - Image delivery proxy
 * Padrão Venoy Studio
 */
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const targetUrl = imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, url.origin).toString();
    const imageResponse = await fetch(targetUrl);
    return new Response(imageResponse.body, {
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (err) {
    return new Response('Failed to load image', { status: 500 });
  }
}
