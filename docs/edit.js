import * as bitty from './bitty.js';
import * as bitty_menu from '/bitty-menu.js';

window.bitty = bitty;
window.el = bitty.el;

var QS = document.querySelector.bind(document);
var QSS = document.querySelectorAll.bind(document);

var DATA_PREFIX = "data:text/html;base64,";
var DATA_PREFIX_8 = "data:text/html;charset=utf-8;base64,";
var DATA_PREFIX_BXZE = "data:text/html;charset=utf-8;bxze64,";
var DATA_PREFIX_GZIP = "data:text/html;charset=utf-8;gzip64,";


var b = document.documentElement.setAttribute(
  "data-useragent",
  navigator.userAgent
);

var bindings = {}
var quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    syntax: true,
    keyboard: { bindings },
    toolbar: "#formatbar"
  }
});

quill.on('text-change', function(delta, oldDelta, source) {
  if (source == 'api') {
    console.debug("An API call triggered this change.");
  } else if (source == 'user') {
    console.debug("A user action triggered this change.", source);
  }
  handleContentChange();
});
quill.setSelection(0, Infinity);

var editor = quill.root;
editor.autocomplete="off";
var importedFileData = undefined;

var content = editor;
window.onload = async function() {
  window.onpopstate = function(e) {
    setContent(e.state);
  };
  window.onhashchange = function(e) {
    console.log("hash", e);
    location.reload();
  };
  document.body.onclick = function(e) {
    if (e.target == document.body) editor.focus();
  };
  content = document.getElementById("content");

  let lastTarget;
  window.addEventListener("dragenter", function(e){ // drag start
    console.log("enter", e.target)
    document.body.classList.toggle("dragging", true);
    lastTarget = e.target; // cache the last target here
  });

  window.addEventListener("dragleave", function (e) { // user canceled
    console.log("exit ", e.target)
    if(e.target === lastTarget || e.target === document) {
      document.body.classList.toggle("dragging", false);
    }
  });


  if (localStorage.getItem("preview")) {
    togglePreview(true)
  }
  // content.addEventListener("keydown", handleKey);
  // content.addEventListener("keyup", handleInput);
  QS("#doc-title").addEventListener("keyup", handleInput);
  Array.from(document.getElementsByTagName("input")).forEach(i => i.addEventListener("keydown", handleInput))
  document.getElementById("md-include").addEventListener("change", handleMetadataCheckbox);

  document.getElementById("drop-zone").addEventListener("drop", handleDrop);
  document.getElementById("drop-zone").addEventListener("dragover", e => e.preventDefault());
  editor.addEventListener("paste", handlePaste);
  // content.contentEditable = "true";
  editor.focus();
  // document.execCommand("selectAll", false, null);
  QS("#qrcode").onclick = makeQRCode;
  QS("#upload").onclick = upload;
  QS("#share").onclick = share;
  QS("#url-preview").onclick = () => {document.execCommand('selectAll',false,null)};
  
  // if (!navigator.share) QS("#share").style.display = "none"
  QS("#twitter").onclick = tweetLink;
  QS("#copy").onclick = copyLink;
  QS("#preview").onclick = togglePreview;
  QS("#format-toggle").onclick = toggleFormat;
  
  QS("#mainmenu").onclick = () => { toggleMenu(QS("#mainmenu"))};

  QS("#doc-title").onclick = toggleMetadata;
  QS("#doc-title").onclick = toggleMetadata;


  var hash = window.location.hash.substring(1);

  if (hash.length) {
    var slashIndex = hash.indexOf("/");
    var title = hash.substring(0, slashIndex);
    if (title.length)
      QS("#doc-title").innerText = document.title = decodeURIComponent(
        title.replace(/_/g, " ")
      );
    hash = hash.substring(slashIndex + 1);
    updateLink(hash, {title});
    if (hash.startsWith("?")) {
      hash = hash.substring(1);
      let durl = new bitty.DataURL(hash);
      durl = await durl.decompress();
      let htmlContent = durl.data;
      setContent(htmlContent);
    }
  } else {
    updateBodyClass();
    setContent(sessionStorage.getItem("editor-content"))

  }
};

function setContent(html) {
  editor.innerHTML = html;
  updateBodyClass();
}

function setFileName(name) {
  QS("#doc-file").innerText = name;
  if (name.length) {
    setContent("");
    document.body.classList.add("edited");
  }
}

function updateBodyClass(hasContent) {
  if (hasContent || importedFileData) {
    document.body.classList.add("edited");
  } else {
    document.body.classList.remove("edited");
  }
  
  document.body.classList.toggle("filecontent",  importedFileData != undefined);
  document.body.classList.add("loaded");
}

async function handleDrop(e) {
  console.log("drop", e)
  e.preventDefault();
  if (e.dataTransfer.files) {
    let file = e.dataTransfer.files[0];
    let extension = file.name.split(".").pop();
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      async function() {
        var url = reader.result;
        let durl = new bitty.DataURL(url);
        if (durl.mediatype == "application/octet-stream") {
          durl.mediatype = "application/" + extension;
        }
        console.log(durl.mediatype)
        durl = await durl.compress(bitty.GZIP_MARKER);
        let ratio = durl.href.length / url.length;
        console.log(`Compressed from ${url.length} to ${durl.href.length} bytes (${Math.round(ratio * 100)}%)`);

        if (ratio <= 0.95) url = durl.href;
        importedFileData = url;
        updateLink(url, {title:file.name}, true);
        setFileName(file.name);

      },
      false
    );
    reader.readAsDataURL(file);
  }
  document.body.classList.remove("dragging");
}

// TODO Command+Shift+T for title (H1), Command+Shift+H for headline (H2), Command+Shift+B for body text (remove any of the above)
function handleKey(e) {
  var code = e.which;
  var handled = false;
  if (e.metaKey && e.altKey) {
    handled = true;
    if (code == "1".charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h1>");
    } else if (code == "2".charCodeAt(0)) {
      document.execCommand("formatBlock", true, "<h2>");
    } else if (code == 220) {
      // \
      document.execCommand("removeFormat");
    } else if (code == "0".charCodeAt(0)) {
      document.execCommand("formatBlock", true, "");
    } else {
      handled = false;
    }
  } else if (e.metaKey) {
    if (code == "K".charCodeAt(0)) {
      handled = true;
      var url = prompt("Add a link", "");
      if (url) {
        document.execCommand("createLink", true, url);
      }
    }
  } else if (code == 9 ) {
      console.log("tab");
      e.preventDefault();
  }
  if (handled) e.preventDefault();
}

var codepenRE = /(https:\/\/codepen\.io\/[\w]+\/(\w+)\/(\w+))/;
function handlePaste(e) {
  var clipboard = window.clipboardData || e.clipboardData;
  var text = clipboard.getData("Text") || clipboard.getData("text/plain");
  if (!text) return;
  let match =  text.match(codepenRE);
  if (match) {
    fetchCodepen(match[0]);
  }
}

var TEMPLATE_MARKER = "/*use-itty-bitty-template*/";
function fetchCodepen(url) {

  Promise.all([
    fetch(url + ".html"),
    fetch(url + ".css"),
    fetch(url + ".js"),
  ]).then(async function(responses) {
    console.log("responses", responses);
    let h = await responses[0].text();
    let c = await responses[1].text();
    let j = await responses[2].text();

    console.log({h,c,j})

    var useTemplate = c.indexOf(TEMPLATE_MARKER) >= 0;
    var string =
      '<style type="text/css">' + c + "</style>" +
      h +
      '<script type="text/javascript">' + j + "</script>";
      console.log("string", string);

    let url = `data:text/html;charset=utf-8,${encodeURIComponent(string)}`;

    let durl = new bitty.DataURL(url);
    durl = await durl.compress(bitty.GZIP_MARKER);

    let ratio = durl.href.length / url.length;
    console.log(`Compressed from ${url.length} to ${durl.href.length} bytes (${Math.round(ratio * 100)}%)`);

    // setFileName("✒️" + "codepen");
    var title = QS("#doc-title").innerText;
    setTimeout(function() {
      // var data = (useTemplate ? "" : DATA_PREFIX_BXZE) + zip;
      // importedFileData = url;
      updateLink(durl.href, {title:"CODEPEN"});
    }, 300);

  });
}

function handleInput(e) {
  handleContentChange(e);
}

function handleMetadataCheckbox(e) {
  document.body.classList.toggle("no-metadata", !e.target.checked)
  handleContentChange(e);
}
function getMetadata() {
  let formData = new FormData(document.forms[0]);
  var object = {};
  formData.forEach((value, key) => object[key] = value);

  return object;
}

async function handleContentChange() {

  sessionStorage.setItem("editor-content", editor.innerHTML);
  var text = editor.innerText;
  let hasContent = text.trim().length > 0;

  updateBodyClass(hasContent);
  if (!hasContent) return;

  var metadata = getMetadata();
  var rawHTML = text.indexOf("</") > 0;
  if (rawHTML) {
    text = text.replace(/[ |\t]+/g, " ").replace(/> +</g, "> <");
  } else {
    text = editor.innerHTML;
  }

  console.log("text", text, rawHTML);
  if (text.trim().length) {
    let url = `data:text/html;charset=utf-8,${encodeURIComponent(text)}`;
    let durl = new bitty.DataURL(url)

    if (metadata.params) {
      console.log("parameters", metadata.params)
      metadata.params.split(";").forEach(p => {
        let ps = p.split('=');
        durl.params[ps.shift()] = ps.pop()
      })
    }
    if (metadata.password) {
      durl.params.cipher = "aes-gcm"
      durl.params.style = "default"
      durl.params._password = metadata.password;
    }

    
    durl = await durl.compress(bitty.GZIP_MARKER);
    let ratio = durl.href.length / url.length;
    console.debug(`Compressed from ${url.length} to ${durl.href.length} bytes (${Math.round(ratio * 100)}%)`);

    
    if (ratio >= 1.0) url = durl.href;
    if (rawHTML) {
      updateLink(url, metadata);
    } else if (metadata.password || metadata.params) {
      updateLink(durl.href, metadata);
    } else {
      updateLink("?" + durl.data, metadata);
    }
    setFileName("");
  } else if (importedFileData) {
    updateLink(importedFileData, {title});
  } else {
    updateLink("");
  }
  
}

var maxLengths = {
  // "#twitter": 4088,
  // "#bitly": 2048,
  "#qrcode": 2953
};

let bittyLink = undefined;
function updateLink(url, metadata, push) {
  
  let title = metadata.title;
  
  let includeMetadata = !metadata.includeMetadata;
  let path = includeMetadata ? "/" : bitty.metadataToPath(metadata) ?? "/";
  let prefix = includeMetadata ? bitty.encodePrettyComponent(title) : "";

  if (url.length) {
    url = path + "#" + prefix + "/" + url;
  } else {
    url = "/edit";
  }

  document.getElementById("doc-title-text").innerText = title.length ? title : "";

  bittyLink = new URL(url, document.location).href;

  document.getElementById("canonical").href = bittyLink;

  if(previewContent) {
    console.log("previewing", bittyLink);
    QS("#preview-frame").src = bittyLink;
  }

  var hash = location.hash;
  if (false) {
    if (push || !hash || !hash.length) {
      window.history.pushState(null, null, bittyLink);
    } else {
      window.history.replaceState(null, null, bittyLink);
    }
  } else {
    document.getElementById("url-preview").innerText = bittyLink
  }

  var length = bittyLink.length;

  QS("#length").innerText = length + " bytes";
  QS("#length").onclick = () => {
    window.open(bittyLink, "_blank");
  }
  for (var key in maxLengths) {
    var maxLength = maxLengths[key];
    if (length > maxLength) {
      QS(key).classList.add("invalid");
    } else {
      QS(key).classList.remove("invalid");
    }
  }
}

function share(e) {
  let menu = new bitty_menu.Menu(e.target);
  console.log("men", menu)
  menu.show();
  // navigator.share({
  //   title: 'itty.bitty',
  //   url: bittyLink
  // }).then(() => {
  //   console.log('Shared!');
  // })
  // .catch(console.error);
}
function makeQRCode() {
  var url =
    "https://chart.googleapis.com/chart?cht=qr&chs=512x512&chld=L|1&choe=UTF-8&chl=" +
    encodeURIComponent(location.href);
  this.href = url;
}
function upload() {
  document.getElementById('file-input').click();
}

function toggleMenu(el) {
  el.classList.toggle("menu-visible");
}

function toggleMetadata(e) {
  if (e.target.closest(".menu")) return;

  QS("#md-contents").classList.toggle("menu-visible");
  QS("#doc-title").classList.toggle("open");
  QS("#md-title").focus();
}


let previewContent = false;
function togglePreview(flag) {
  previewContent = !previewContent;
  document.body.classList.toggle("preview", previewContent);
}
let formatContent = false;
function toggleFormat(flag) {
  formatContent = !formatContent;
  document.body.classList.toggle("format", formatContent);
}


function copyThenLink() {
  copyLink();
  return confirm("Copied your link to the clipboard. Paste it to share.");
}
function copyLink() {
  var text = bittyLink;
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

function saveLink() {
  var url = "/" + location.hash;
  window.history.pushState(null, null, url);
  location.reload();
}

function tweetLink() {
  var url =
    "https://twitter.com/intent/tweet?url=" + encodeURIComponent(location.href);
  window.open(url, "_blank");
  return false;
}
