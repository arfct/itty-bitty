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
    caption: A short note, decompressed from the fragment of its link
    alt: A white page headed Notes on the Analytical Engine, with a subheading and four short paragraphs of text, one with a blue link
  - src: editor.png
    caption: The editor with a draft, and its link and byte count along the top
    alt: A white editor page titled Analytical Engine notes, with a heading, a subheading and four short paragraphs, one containing a blue link, under a bar showing the link, a byte count of 601, and share and menu buttons
icon_shape: none
unconfirmed:
  - date
---

itty.bitty stores a whole page in its link. The page's HTML is compressed into the URL fragment, and the receiving browser decompresses it from the address. There is no server, no storage and no account; the link carries the page.

Compression runs in the browser with gzip, LZMA or Brotli, and a link can be turned into a QR code. Pages can use their own styles, such as a recipe or a contact card.

JavaScript, static pages. 2018.
