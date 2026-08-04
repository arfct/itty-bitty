  import * as bitty from '/bitty.js';
  import * as bitty_menu from '/bitty-menu.js';

  window.bitty = bitty;

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker
  //     .register('/worker.js')
  //     .then(function() { console.debug("Service Worker Registered"); });
  // }

  const isFramed = window.self !== window.top;
        
  function addToast() {
    // `<div id="toast">
    // itty.bitty is experimental technology that renders linked content from outside sources.
    // <a href="http://toast.bitty.site" target="_blank">Learn&nbsp;more</a>.
    // <br><br>This content is only as trustworthy as its source, and it should be treated with the caution you would show any insecure web page.
    // <br><br><button onclick="dismiss()">I understand</button> <input id="never" type="checkbox"><label for="never">Never show this</label>
    // </div>`
  }
  // function dismiss() {
  //   if (document.getElementById("never").checked) window.localStorage.setItem('toasted', true);
  //   document.body.classList.remove("toasting")
  // }

  function getIframe() {
    if (!document.iframe) {  
      let iframe = document.createElement('iframe');
      iframe.id = "iframe";
      iframe.sandbox = "allow-same-origin allow-scripts allow-forms allow-top-navigation allow-popups allow-modals allow-popups-to-escape-sandbox";
      if (iframe.sandbox.supports('allow-downloads')) iframe.sandbox.add('allow-downloads');
      document.body.appendChild(iframe);
      document.iframe = iframe;
    }
    return document.iframe;
  }

  async function getMenu() {
    if (!document.menuButton) {  
      let menuButton = document.createElement('div');
      menuButton.id = "menu";
      menuButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><g fill-rule="evenodd" class="logo" clip-rule="evenodd"><path fill="#fff" d="M6.5 19.5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h8a5 5 0 0 1 4.33 7.5 5 5 0 0 1-4.33 7.5h-8Z" class="outer"/><path fill="#16161D" d="M6.5 5.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2v-13h-2Zm8 3h-2v2h2a1 1 0 1 0 0-2Zm-5 0v10h5a4 4 0 0 0 3.123-6.5A4 4 0 0 0 14.5 5.5h-5v3Zm3 5h2a1 1 0 1 1 0 2h-2v-2Z" class="inner"/></g></svg>`
      menuButton.onclick = () => {
        let menu = new bitty_menu.Menu(menuButton);
        console.log("men", menu)
        menu.show()
      }
      document.body.appendChild(menuButton);
      document.menuButton = menuButton;
    }
    return document.menuButton;
  }
  getMenu()
  let autohideTimeout;
  function showLoader(state) {
    let loader = document.getElementById("loader");
    if (autohideTimeout) {
      clearTimeout(autohideTimeout);
      autohideTimeout = undefined;
    }
    if (state) {
      if (!loader) {
        loader = document.createElement("div");
        loader.id = "loader";
        document.body.appendChild(loader);
      }
      autohideTimeout = setTimeout(() => {showLoader(false)}, 3000)
    } else if (loader) {
      setTimeout(() => loader?.parentElement?.removeChild(loader), 1000)
    }
    setTimeout(() => document.body.classList.toggle("loading", state), 500)
  }
  window.showLoader = showLoader;

  // Document Attribute Setters

  function setThemeColor(color) {
    let el = document.getElementById("themeColor");
    if (!el) {
      el = document.createElement("meta");
      el.name = "theme-color";
      el.id = "themeColor";
      document.head.appendChild(el);
    }
    el.content = color;
  }

  function setFavicon(favicon) {
    document.getElementById("favicon").href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><text y=".9em">'+ favicon + '</text></svg>'
  }

  window.el = bitty.el;

  const renderers = {
    "application/ld+json": {script:"/render/recipe.html"},
    "text/canvas+javascript": {script:"canvas"},
    "text/javascript": {script:"script"},
    // "text/vcard": {script:"/render/contact.html"},
    "mecard": {script:"/render/contact.html"},
    "application/bitsy": {script:"/render/bitsy.html", sandbox:"bitsy"},
    "c": {script:"color"},
    "e": {rewrite: "data:text/html;cipher=aes;format=gz;base64,"},
    "text/rawhtml": {script:"parse"},
    "javascript": {script:"bookmarklet"},
    "ipfs": {script:"ipfs", sandbox:"ipfs"},
    "web3": {script:"web3"},
    "text/directory": {script:"download", args: {extension:"vcf", filename:"contact"}},
    "text/calendar": {script:"download", args: {extension:"ics", filename:"calendar"}}
  }


  function share(info) { // {title, text, url}

    let menu = new bitty_menu.Menu();
    console.log("men", menu)
    menu.show(info)
    return;
  }
  function systemShare(info) {
    if (!info.url) info = {title:document.title, text:document.title, url:location.href};
    
    if (navigator.share) {
      navigator.share(info)
        .then(() => { console.log('Shared!');})
        .catch(console.error);
    } else {
      copyLink(info)
    }
  }

  function copyLink(info) {
    var text = info.url;
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  
    document.body.classList.add("copied");
    setTimeout(function() {
      document.body.classList.remove("copied");
    }, 2000);
  }

  let wakeLock;
  const getWakeLock = async () => {
    try {
      if (navigator.wakeLock) {
        wakeLock = await navigator.wakeLock.request();
        wakeLock.addEventListener('release', () => {});
        console.log('💡 Keeping Screen Awake:', !wakeLock.released);
      } else {
        // keepAwake();
      }
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  function keepAwake() {
    let ctx = new AudioContext();
  
    let bufferSize = 2 * ctx.sampleRate, 
        emptyBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate), 
        output = emptyBuffer.getChannelData(0);
  
    for(let i = 0; i < bufferSize; i++) output[i] = 0;
  
    let source = ctx.createBufferSource();
    source.buffer = emptyBuffer;
    source.loop = true;
  
    let node = ctx.createMediaStreamDestination();
    source.connect(node);
  
    let audio = document.createElement("audio");
    audio.style.display = "none";
    document.body.appendChild(audio);
  
    audio.srcObject = node.stream;
    audio.play();
  }
  

  const handleVisibilityChange = async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      await getWakeLock();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

 

  window.addEventListener("message", function(e) {
    console.debug("Message:", e.origin, e.data, e)
    showLoader(false);
      if (e.data.loading != undefined) showLoader(e.data.loading);

      if (e.data.title) document.title = e.data.title;
      if (e.data.favicon) setFavicon(e.data.favicon);
      if (e.data.themeColor) setThemeColor(e.data.themeColor);
      if (e.data.updateURL) {
        let path = bitty.metadataToPath(e.data) + window.location.hash;
        window.history.replaceState(null, null, path);
      }

      if (e.data.share) {
        share(e.data.share);
      }
      if (e.data.wakeLock) {
        getWakeLock();
      }
      if (e.data.updateHash) {
        window.history.replaceState(null, null, e.data.updateHash);
      }
      if (e.data.replaceURL) {
        if (e.data.compressURL) {
          let durl = new bitty.DataURL(e.data.replaceURL);

          durl.compress().then(arg => {
            window.history.replaceState(null, null, "/#/" + arg.href);
            renderContent();
          })

        } else {
          window.history.replaceState(null, null, e.data.replaceURL);
          renderContent();
        }
      }
      if (e.data.error) {
        showError(e.data.error)
      }
      if (e.data.setStorage) document.localStorage.setItem(contentHash, e.data.set);
      if (e.data.getStorage) document.getElementById("iframe").postMessage(document.localStorage.getItem(contentHash), e.origin)
  }, false);  
  

  function showError(error) {
    console.warn("🛑", error)
    let dialog = el("dialog.dialog",
      el("div", {}, error),
      el("form", {method: "dialog"}, 

        el("button", {onclick:() => location.href = "https://parse.bitty.site"}, "Learn More"),
        el("button", {onclick:history.back.bind(history)}, "Go Back")));
    document.body.appendChild(dialog)
    dialog.showModal();
  }
  
  async function renderContent() {
    
    showLoader(true)    

    var fragment = window.location.hash.substring(1);

    let content = null //sessionStorage.getItem("editor-content");
    if (content || (fragment.length < 3 && !isFramed)) {
      return location.href = "/edit";
    }

    if (window.location.search) { // Redirect search to path (coming out of server opengraph forwarding)
      window.history.replaceState(null, null, window.location.search.substring(1) + "#" + fragment);
    }

    var isIE = navigator.userAgent.match(/rv:11/);
    var isEdge = navigator.userAgent.match(/Edge\//);
    var isWatch = (window.outerWidth < 220);

    let bittyInfo = bitty.parseBittyURL(location);
    let durl = new bitty.DataURL(bittyInfo.hashData);

    if (durl.params.compress) {
      console.log("Compressing URL", durl);
      delete durl.params.compress;
      durl.compress(bitty.GZIP_MARKER).then(arg => {
        window.history.replaceState(null, null, "/#/" + arg.href);
        renderContent();
      })
      return;
    }

    // if (!window.localStorage.getItem('toasted')) document.body.classList.add("toasting");

    var iframe = getIframe();
    var dataPrefix = undefined;
    var renderMode = "data";
    var renderer;

    let components = window.location.pathname.substring(1).split("/");
    let info = {}
    info.title = decodeURIComponent(components.shift()).replace(/-/g, " ").replace(/–/g, "-");
    let i;
    for (i = 0; i < components.length; i+=2) {
      let key = components[i];
      let value = decodeURIComponent(components[i+1]);
      if (key.length && value.length) info[key] = value;
    }
    info.d = info.d?.replace(/-/g, " ").replace(/–/g, "-");

    if (info.f) setFavicon(info.f);

    var slashIndex = fragment.indexOf("/");
    var title = fragment.substring(0, slashIndex) || info.title;
    if (title) title = decodeURIComponent(title.replace(/_/g, " "))
    var type = undefined;
    var description = undefined;

    document.title = title ?? location.hostname;

    fragment = fragment.substring(slashIndex + 1);
    var editable = fragment.charAt(0) == "?";
    var link = document.getElementById("edit");
    if (editable) {
      fragment = fragment.substring(1);
      document.body.appendChild(el("a", {id: "edit", onclick: function() { location.href = "/edit" + location.hash}}))
      // link.href = "/edit" + location.hash;
    }

    if (fragment.startsWith("data:")) {
      
      renderer = durl.params?.render ? {script:durl.params.render, sandbox:"hash"} : renderers[durl.mediatype];

      //if (render.script == "parse") renderer.sandbox = "none"
      type = "data:" + durl.mediaype;
      if (durl.mediatype == "text/html") {
        dataPrefix = bitty.HEAD_TAGS(durl.params?.prefix);
      } else if (durl.mediatype == "text/plain" || durl.mediatype == undefined) {

        dataPrefix = bitty.HEAD_TAGS_EXTENDED();
        durl.mediatype = "text/html";
        // fragment = fragment.replace("text/plain,", "text/html").replace(",", "text/html");
       
        renderMode = "data";
      } else if (durl.mediatype == "multipart/related") {
      } else if (durl.type == "text") {
      } else if (durl.type == "image") {
      } else if (durl.type == undefined) {
      } else if (!renderer) {
        console.log("unknown type, rendering as download")
        renderer = {script:"download"}
      }

      if (durl.params.style == "default") {
        dataPrefix = bitty.HEAD_TAGS_EXTENDED();
      }

      if (renderer) {
        var script = renderer.script;
        if (script.indexOf("/") == -1)  script = location.origin + '/render/' + script + '.js'
        renderMode = "script";
      }

    } else {
      var colon = fragment.indexOf(":");
      if ( colon > 0 && colon < 15) {
        document.body.classList.remove("toasting");
        let scheme = fragment.substring(0,colon);
        type = scheme;
      
        let renderer = renderers[scheme.toLowerCase()];
        
        if (renderer) {
          return renderContentWithScript({renderer, title, info, body:fragment, url:fragment});
        }
        return window.location.replace(fragment);
      }

      var compressed = true;
      dataPrefix = bitty.HEAD_TAGS_EXTENDED();
      let encoding = !compressed ? "base64," : (fragment.startsWith("XQA") ? bitty.LZMA_MARKER : bitty.GZIP_MARKER);
      durl = new bitty.DataURL(`data:text/html;charset=utf-8;format=${encoding};base64,${fragment}`);
    }


    if ((isEdge || isIE) && location.href.length == 2083) {
      let element = document.getElementById("warning") || document.body.appendChild(el("div", {id: "warning"}))
      element.innerHTML =
        'Edge only supports shorter URLs (maximum 2083 bytes).<br>Larger sites may require a different browser.<br><a href="http://reference.bitty.site">Learn more</a>';
    }

    await durl.decompress()

    if (durl.error) {
      writeDocContent(iframe.contentWindow.document, atob(bitty.HEAD_TAGS_EXTENDED()) + `<style>.error{color:red; background:pink; max-width:320px; margin:auto; padding:1em;}</style><div class="error">${durl.error}</div>`)
      showLoader(false)
      return
    }

    durl.dataPrefix = dataPrefix;
    let dataURL = durl.href;
    let dataContent = durl.rawData;

    if (!dataURL) return;

    if (isIE && renderMode == "data") renderMode = "frame";
    let overwriteSelf = isWatch && !params.script.endsWith(".html");

    console.log("🖋 Rendering mode: " + "\x1B[1m" + renderMode, {url:durl})
    
    if (renderMode == "data") {
      iframe.src = dataURL;
      showLoader(false)   
    } else {
      bitty.dataToString(dataURL, function(content) {
        if (renderMode == "frame") {
          writeDocContent(overwriteSelf ? document : iframe.contentWindow.document, content)
        } else if (renderMode == "script") {
          renderContentWithScript({renderer, title, info, body:content, url:dataURL, overwrite:overwriteSelf});
        }
      });
    }
    
    let recordHistory = true
    if (!isFramed && recordHistory) recordToHistory(durl);

  };

  window.addEventListener('DOMContentLoaded',renderContent);
  window.addEventListener('hashchange',renderContent);

  
  const SCRIPT_LOADER = `<!doctype html><meta charset=utf-8><script src="${location.origin}/render.js"></script>`
  async function renderContentWithScript(params) {

    params.script = params.renderer.script;
    params.originalURL = location.href;
    if (params.script.indexOf("/") == -1)  params.script = location.origin + '/render/' + params.script + '.js'
    
    if (params.overwrite) { 
      
        if (params.script.endsWith(".html")) {
          fetch(params.script, /*, options */)
          .then((response) => response.text())
          .then((html) => {
            console.log("html", html)
              document.documentElement.innerHTML = html;
          })
          .catch((error) => {
              console.warn(error);
          });
        } else {
          // Overwrite the current page with the script. Dangerous, but required for browsers on apple watch to scroll.
          let scriptEl = document.createElement("script")
          scriptEl.src = "/render.js"
          scriptEl.addEventListener('load', function(e) {
            console.log("Loaded script", scriptEl.src);
            renderScriptContent(params, "*");
          });
          document.head.appendChild(scriptEl);
        } 
    } else { 
      // Render in an iframe, either via sandboxed subdomain or a data url (disables storage APIs)
      iframe.onload = (() => {
        iframe.contentWindow.postMessage(params, "*");
        delete iframe.onload
        iframe.contentWindow.focus();
        // showLoader(false)
      });
      // writeDocContent(iframe.contentWindow.document, SCRIPT_LOADER)
      // iframe.srcdoc = SCRIPT_LOADER;

      let src = window.scriptDomain ?? location.origin;
      src += "/render";

      let sandbox = params.renderer?.sandbox;

      if (params.script.endsWith(".html")) {
        src = params.script;
        if (!sandbox) sandbox = "none";
      }

      if (sandbox == "none") { // passthrough
      } else if (sandbox == "hash") { // Generate sandbox based off of body hash
        let hash = await bitty.hashString(params.body);
        src = src.replace("https://", "https://script-" + hash + ".");
      } else if (sandbox) { // Use named sandbox
        src = src.replace("https://", "https://" + sandbox + ".");
      } else { // Render using data url (storage disabled)
        src = "data:text/html," + SCRIPT_LOADER;
      }
      console.log(" Loading script with source:", src)
      iframe.src = src;
    }
  }

function writeDocContent(doc, content) {
  return doc.documentElement.innerHTML = content;
  doc.open();
  doc.write(content);
  doc.close();
}

function extractTerms(...args) {
  let wordSet = {}
  args.forEach((string) => {
    if (string) string.split(/\s/).forEach((word) => { if (word.length > 2) wordSet[word.toLowerCase()] = true });
  })
  return Object.keys(wordSet);
}

async function recordToHistory(durl) {
  let type = durl.mediatype;
  let hash = await bitty.hashString(durl.href);
  
  let metadata = bitty.pathToMetadata(location.pathname);
  if (!metadata.title && !metadata.title.length) {
    if (!durl.rawData) durl = await durl.decompress();
    let dom = await durl.parseDom();

    if (dom) {
      for (let el of dom.getElementsByTagName('script')) { el.parentNode.removeChild(el) }
      metadata.title = dom.title;
      metadata.description = dom.body?.innerText.trim();
      if (!metadata.title.length) {
        metadata.title = (dom.body?.children[0]?.innerText.trim())?.split("\n").pop();
      }
      metadata.description = metadata.description?.replace(metadata.title, "").trim();
    }

    console.debug("Extracting metadata from content", metadata);
  }



  if (navigator.storage && navigator.storage.persist)
    navigator.storage.persist().then(granted => {
    if (granted)
      console.debug("Storage will not be cleared except by explicit user action");
    else
      console.debug("Storage may be cleared by the UA under storage pressure.");
  });

  let openRequest = indexedDB.open("history", 3);

  openRequest.onupgradeneeded = function(event) {
    console.log("Upgrading Database", event)

    const db = event.target.result;
    const transaction = event.target.transaction;
    let objectStore;
    if (!db.objectStoreNames.contains('urls')) { 
      objectStore = db.createObjectStore('urls', {keyPath: 'id'});
    } else {
      objectStore = transaction.objectStore('urls');
    }

    objectStore.createIndex("created", "created");
    objectStore.createIndex("type", "type");
    objectStore.createIndex("terms", "terms", { multiEntry: true });

  };

  openRequest.onerror = function() {
    console.error("Error", openRequest.error);
  };

  openRequest.onsuccess = () => {
    let db = openRequest.result;

    let transaction = db.transaction("urls", "readwrite"); // (1)

    let history = transaction.objectStore("urls"); // (2)

    let hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
  
    let terms = extractTerms(metadata.title, metadata.description);
    let entry = {
      id: hash,
      url: location.href,
      title: metadata.title || '',
      text: metadata.description?.substring(0,256),
      type: type,
      terms: terms,
      created: new Date()
    };

    console.log("🕙 Adding history", {entry})

    let request = history.put(entry); // (3)

    request.onsuccess = function() { // (4)
      console.debug("entry added to the history", request.result);
    };

    request.onerror = function() {
      console.log("Error", request.error);
    };

    // continue working with database using db object
  };
}
