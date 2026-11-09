---
title: Itty Bitty
date: 2018-07
category: product
tags:
  - web
  - open-source
url: https://itty.bitty.site
links:
  source: https://github.com/arfct/itty-bitty
media:
  - src: shared-page.png
    caption: A short note, opened from nothing but the fragment of its link
    alt: A white card reading "Meet me at the park at 9:30. Bring a coat.—Pistachio" over soft red, blue and mint shapes
  - src: editor.png
    caption: The editor in its empty state, with a menu at the top right
    alt: A mostly blank white page with a few lines of grey italic text and a blue link, and "menu" in the corner
icon_shape: none
unconfirmed:
  - date
---

The link is the site. itty.bitty compresses a page's HTML into the URL fragment itself—no server, no storage, no account—and the receiver's browser inflates the content back out of the address. A whole website reduced to a string you can paste anywhere: a pastebin, a publishing tool, a self-contained interactive demo that lives nowhere but in the link that carries it.

Compression runs in the browser (gzip, LZMA, Brotli), and a link can be turned into a QR code. Pages render in their own styles, such as a recipe or a contact card.

JavaScript, static pages. 2018.
