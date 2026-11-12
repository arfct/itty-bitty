---
title: itty.bitty
date: 2018-07
status: released
category: product
tags:
  - web
url: https://itty.bitty.site
links:
  source: https://github.com/arfct/itty-bitty
media:
  - src: shared-page.png
    caption: A page of notes opened from an itty.bitty link
    alt: A white page headed Notes on the Analytical Engine, with a subheading and four short paragraphs of text, one with a blue link
  - src: editor.png
    caption: The same notes in the editor, where the bar at the top gives the link and its length, 601 bytes
    alt: A white editor page titled Analytical Engine notes, with a heading, a subheading and four short paragraphs, one containing a blue link, under a bar showing the link, a byte count of 601, and share and menu buttons
icon_shape: none
unconfirmed: [date, status]
---

A page made with itty.bitty exists only as its link. The site compresses the page's HTML with deflate and writes the result into the fragment, the part of an address after the #, and when the link is opened it decompresses the fragment in the browser and displays the page. Browsers do not send a fragment to a server, so the page is stored nowhere else.

The editor shows the link beside its length in bytes, 601 for the notes in the images, and its menu strikes through the entry for making a QR code once a link passes 2,953. Links from the first version, which compressed with LZMA, still open, as do links compressed with Brotli. A link can hold data other than HTML, and a recipe written in JSON-LD is displayed as a recipe page.

The site is static files on Netlify. A link may repeat its title and description in its path, and when a chat app or a crawler requests a preview, an edge function answers from the path, since the fragment has not reached it.

JavaScript. 2018.
