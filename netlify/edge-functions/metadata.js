function decodePrettyComponent(s) {
  let replacements = {'---': ' - ', '--': '-','-' : ' '}
  return decodeURIComponent(s.replace(/-+/g, e => replacements[e] ?? '-'))
}

function decodeURL(s) {
  if (s.startsWith("http")) return s;
  return atob(s.replace(/=/g,''));
}

function atou(b64) { return decodeURIComponent(escape(atob(b64))); }
function utoa(data) { return btoa(unescape(encodeURIComponent(data))); }

// Shared SVG->PNG renderer: https://github.com/arfct/og-svg
const RENDER_ORIGIN = "https://og-svg.arfct.workers.dev";

// Builds a render URL from SVG markup.
//
// This replaces "/.netlify/functions/rasterize/" + svg, which never worked:
// rasterize.js read the query string, not the path, so every call 502'd. It
// also put unescaped markup straight into a URL path.
//
// base64url keeps the payload URL-safe with no percent-encoding, which matters
// because Cloudflare caps URLs at 16KB.
function renderUrl(svg) {
  const payload = utoa(svg)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${RENDER_ORIGIN}/png?s=${payload}`;
}

function pathToMetadata(path) {
  let components = path.substring(1).split("/");
  let info = {title: decodePrettyComponent(components.shift())}
  for (let i = 0; i < components.length; i+=2) {
    let key = components[i];
    let value = components[i+1];
    if (!value) continue;
    if (key == "d") { value = decodePrettyComponent(value); }
    else if (value.includes("%")) { value = decodeURIComponent(value); }
    if (key.length && value.length) info[key] = value;
  }
  return info;
}

function mProp(prop, content) { return `<meta property="${prop}" content="${content}"/>` }
function mName(name, content) { return `<meta name="${name}" content="${content}"/>` }

// Valid URL Chars A-Za-z0-9-._~:?@!$&()*;=+/
export default async (request, context) => {
  try {
    const ua = request.headers.get("user-agent");
    let url = new URL(request.url);
    let path = url.pathname;
    let geo = context?.geo?.city + ", " + context?.geo?.subdivision?.code + ", " + context?.geo?.country?.code

    let uaArray = Deno.env.get("UA_ARRAY")?.split(",") || [];
    let uaMatch = uaArray.some(a => ua?.indexOf(a) != -1);
    if (uaMatch) { return new Response('', { status: 401 }); }
    
    if (path != "/" ) {
      let metadataBots = [ "Twitterbot", "curl", "facebookexternalhit", "Slackbot-LinkExpanding", "Discordbot", "snapchat", "Googlebot"]
      let isMetadataBot = metadataBots.some(bot => ua?.indexOf(bot) != -1);

      if (isMetadataBot && path.endsWith("/")) {
        let info = pathToMetadata(path)

        let content = ['<meta charset="UTF-8">'];
        if (info.title) { content.push(`<title>${info.title}</title>`,mProp("og:title", info.title)) }
        if (info.s) { content.push(mProp("og:site_name", info.s)) }
        if (info.t) { content.push(mProp("og:type", info.t)) }
        if (info.d) { content.push(mProp("og:description", info.d),mName("description",info.d)) }
        if (info.c) { content.push(mName("theme-color","#" + info.c)) }

        if (info.i) {
          info.i = decodeURL(info.i)
          if (!info.i.startsWith("http")) info.i = renderUrl(info.i)
          content.push(mProp("og:image", info.i)); 
          if (info.iw) content.push(mProp("og:image:width", info.iw)); 
          if (info.ih) content.push(mProp("og:image:width", info.ih)); 
          content.push(mName("twitter:card", "summary_large_image"));
        } 
        if (info.v) {
          content.push(mProp("og:video", decodeURL(info.v))); 
          if (info.vw) content.push(mProp("og:image:width", info.vw)); 
          if (info.vh) content.push(mProp("og:image:width", info.vh)); 
        } 
        if (info.f) { // Favicon: URL Encoded
          if (info.f.length > 9){
            info.f = decodeURL(info.f);
            content.push(`<link rel="icon" type="image/png" href="${info.f}">`);
          } else {
            let codepoints = Array.from(info.f).map(c => c.codePointAt(0).toString(16));
            content.push(`<link rel="icon" type="image/png" href="https://fonts.gstatic.com/s/e/notoemoji/14.0/${codepoints.join("_")}/128.png">`);
          }
        }
        // content.push(mProp("og:url", request.url)`);
        
        console.log(["Metadata Request", JSON.stringify(info), geo, ua].join('\t')); 
        return new Response(content.join("\n"), {
          headers: { "content-type": "text/html" },
        });
      } 
    } else {
      console.log(["Request", path, geo, request.headers.get("referer"), ua].join('\t'));
    }
  } catch (e) {
    console.log("Error:", request.url, e)
  }
}
