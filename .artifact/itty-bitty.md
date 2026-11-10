---
title: Itty Bitty
date: 2018-07
category: product
tags:
  - web
url: https://itty.bitty.site
links:
  source: https://github.com/arfct/itty-bitty
media:
  - src: shared-page.png
    caption: A page opened from an itty.bitty link
    alt: A white page headed Notes on the Analytical Engine, with a subheading and four short paragraphs of text, one with a blue link
  - src: editor.png
    caption: The editor, with the link and its size of 601 bytes in the bar at the top
    alt: A white editor page titled Analytical Engine notes, with a heading, a subheading and four short paragraphs, one containing a blue link, under a bar showing the link, a byte count of 601, and share and menu buttons
icon_shape: none
unconfirmed:
  - date
---

itty.bitty is a website that puts a whole page into a link. It compresses the page's HTML into the fragment of a URL. When the link is opened, the site decompresses the fragment in the browser and displays the page. Browsers do not send the fragment to a server, so the content is stored only in the link.

The editor shows the link and its size in bytes, and can turn the link into a QR code. It compresses with deflate. Links compressed with LZMA, which the first version used, or with Brotli also open. A link can hold data other than HTML, and a recipe in JSON-LD is displayed as a recipe page.

The site is static files on Netlify. An edge function there builds link previews from the title in the URL path.

JavaScript. 2018.
