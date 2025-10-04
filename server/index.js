const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const sharp = require('sharp');

const PORT = process.env.PORT || 8080;
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const METADATA_BOTS = [
  'Twitterbot',
  'curl',
  'facebookexternalhit',
  'Slackbot-LinkExpanding',
  'Discordbot',
  'snapchat',
  'Googlebot',
];
const blockedAgents = (process.env.UA_ARRAY || '')
  .split(',')
  .map((ua) => ua.trim())
  .filter(Boolean);

const app = express();
app.disable('x-powered-by');

if (process.env.REQUEST_LOG !== 'silent') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use(compression());

app.use((req, res, next) => {
  const ua = req.get('user-agent') || '';
  if (blockedAgents.some((blocked) => ua.includes(blocked))) {
    res.status(401).end();
    return;
  }
  next();
});

app.use((req, res, next) => {
  if (req.path.startsWith('/render/') || req.path.startsWith('/js/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  next();
});

app.get('/.netlify/functions/rasterize*', async (req, res, next) => {
  try {
    const payload = extractRasterizePayload(req.originalUrl);
    if (!payload) {
      res.status(400).json({ error: 'Missing payload' });
      return;
    }

    let svg = fromBase64(payload) ?? safeDecodeURIComponent(payload);
    if (!svg.startsWith('<svg')) {
      svg = `<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`;
    }

    const jpegBuffer = await sharp(Buffer.from(svg))
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg()
      .toBuffer();

    res.setHeader('Cache-Control', 'public, max-age=300');
    res.type('image/jpeg');
    res.send(jpegBuffer);
  } catch (error) {
    next(error);
  }
});

app.get('*', (req, res, next) => {
  if (req.path === '/' || !req.path.endsWith('/')) {
    next();
    return;
  }

  const userAgent = req.get('user-agent') || '';
  const isMetadataBot = METADATA_BOTS.some((bot) => userAgent.includes(bot));
  if (!isMetadataBot) {
    next();
    return;
  }

  try {
    const info = pathToMetadata(req.path);
    const html = renderMetadataDocument(info);
    res.type('html').send(html);
  } catch (error) {
    next(error);
  }
});

app.use(express.static(DOCS_DIR, {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(DOCS_DIR, 'index.html'));
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`itty.bitty self-host listening on port ${PORT}`);
});

function extractRasterizePayload(originalUrl) {
  const basePath = '/.netlify/functions/rasterize';
  if (!originalUrl.startsWith(basePath)) {
    return '';
  }

  const [pathPart, queryPart] = originalUrl.split('?');
  if (queryPart) {
    return queryPart.replace(/=/g, '');
  }

  const suffix = pathPart.slice(basePath.length);
  if (!suffix) {
    return '';
  }

  return suffix.replace(/^\//, '').replace(/=/g, '');
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

function fromBase64(value) {
  try {
    return Buffer.from(value, 'base64').toString('utf8');
  } catch (error) {
    return null;
  }
}

function decodePrettyComponent(component) {
  if (!component) {
    return '';
  }

  const replacements = {
    '---': ' - ',
    '--': '-',
    '-': ' ',
  };

  return safeDecodeURIComponent(
    component.replace(/-+/g, (match) => replacements[match] ?? '-')
  );
}

function decodeURL(value) {
  if (!value || value.startsWith('http')) {
    return value;
  }
  const cleaned = value.replace(/=/g, '');
  return fromBase64(cleaned) ?? safeDecodeURIComponent(value);
}

function pathToMetadata(pathname) {
  const segments = pathname.substring(1).split('/');
  const info = { title: decodePrettyComponent(segments.shift()) };

  for (let i = 0; i < segments.length; i += 2) {
    const key = segments[i];
    const value = segments[i + 1];
    if (!key || !value) {
      continue;
    }
    if (key === 'd') {
      info[key] = decodePrettyComponent(value);
    } else if (value.includes('%')) {
      info[key] = safeDecodeURIComponent(value);
    } else {
      info[key] = value;
    }
  }

  return info;
}

function renderMetadataDocument(info) {
  const content = ['<meta charset="UTF-8">'];

  if (info.title) {
    content.push(`<title>${info.title}</title>`);
    content.push(mProp('og:title', info.title));
  }
  if (info.s) {
    content.push(mProp('og:site_name', info.s));
  }
  if (info.t) {
    content.push(mProp('og:type', info.t));
  }
  if (info.d) {
    content.push(mProp('og:description', info.d));
    content.push(mName('description', info.d));
  }
  if (info.c) {
    content.push(mName('theme-color', `#${info.c}`));
  }
  if (info.i) {
    let image = decodeURL(info.i);
    if (image && !image.startsWith('http')) {
      image = `/.netlify/functions/rasterize/${image}`;
    }
    if (image) {
      content.push(mProp('og:image', image));
      if (info.iw) {
        content.push(mProp('og:image:width', info.iw));
      }
      if (info.ih) {
        content.push(mProp('og:image:height', info.ih));
      }
      content.push(mName('twitter:card', 'summary_large_image'));
    }
  }
  if (info.v) {
    const video = decodeURL(info.v);
    if (video) {
      content.push(mProp('og:video', video));
      if (info.vw) {
        content.push(mProp('og:video:width', info.vw));
      }
      if (info.vh) {
        content.push(mProp('og:video:height', info.vh));
      }
    }
  }
  if (info.f) {
    if (info.f.length > 9) {
      const favicon = decodeURL(info.f);
      if (favicon) {
        content.push(`<link rel="icon" type="image/png" href="${favicon}">`);
      }
    } else {
      const codepoints = Array.from(info.f).map((char) => char.codePointAt(0).toString(16));
      content.push(`<link rel="icon" type="image/png" href="https://fonts.gstatic.com/s/e/notoemoji/14.0/${codepoints.join('_')}/128.png">`);
    }
  }

  return content.join('\n');
}

function mProp(property, content) {
  return `<meta property="${property}" content="${content}"/>`;
}

function mName(name, content) {
  return `<meta name="${name}" content="${content}"/>`;
}
