import * as bitty from '/bitty.js';

class ShareForm {
  constructor() {
    
    // element created
  }

  parse(form) { 

    let formData = new FormData(form);
    let formObj = Object.fromEntries(formData);
    console.log("DATA", formObj)

    console.log("object", formObj);
    let url = formData.get("url");
    formData.delete("url")
    let title = formData.get("t");
    formData.delete("t")

    if (!title.length) return;
    let path = `/${dashspaces(title)}/`
    let encodedFields = ["i", "v"];
    formData.forEach((value, key) => {
      if (!value.length) return;
      if (encodedFields.includes(key)) value = btoa(key)
      path += `/${key}/${value}`
    });
    formData.forEach((value, key) => {if (value.length) object[key] = value});
    
    path += "#" + url;
    console.log(path);
    document.getElementById("rurl").value = `https://redirect.app${path}`;
    // history.replaceState(null, path, path);
  }

  render() {
    return el("form#share-form.flex-column",
        el("input", {type: "image", target: "i", class: "thumbnail", onclick: "getURL(this)", src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'%3E%%3C/svg%3E%0A"}),
        el("div.flex-row",
          el("div.flex-column",
            el("input", {name: "t", oninput: this.parse, placeholder: "Title"}),
            el("input", {name: "d", oninput: this.parse, placeholder: "Description"}),
            el("input", {id: "i", name: "i", type: "hidden", oninput: this.parse}),
            el("input", {id: "f", name: "i", type: "hidden", oninput: this.parse}),
            el("input", {name: "url", oninput: this.parse, placeholder: "example.com"}),
            el("button", {type: "sumbit", style: "display:none"}, "submit")
          ),
          el("input", {type: "image", src: "", id: "favicon", target: "f", onclick: "getURL(this)", oninput: this.parse, placeholder: "icon"})
        )
    )
  }
}

class Menu {
  /**
   * @constructor
   */
  constructor(button) {
    this.button = button;
  }

  makeTinyurl() {
    console.log("url", location.href)
    location.href='https://tinyurl.com/create.php?url=' + encodeURIComponent(location.href)  
  }

  makeText() {
    console.log("url", location.href)
    location.href='imessage:&body=' + encodeURIComponent(location.href)  
  }  

  makeQR() {
    bitty.loadScript('/js/qrious.min.js', null, "").then(() => {
      console.log("qrious loaded", location.href);
      let qrDialog = el("dialog#qr-dialog.dialog",
        el("canvas", {id: "qr"}),
        el("div", document.title)
        );
        qrDialog.onclick = () => {
          qrDialog.close();
          qrDialog.parentNode.removeChild(qrDialog)
        }
      document.body.append(qrDialog);
      qrDialog.showModal();
      var qr = new QRious({
        element: document.getElementById("qr"),
        background: 'transparent',
        foreground: 'currentColor',
        size: 500,
        value: location.href,
      });
    })
  }  
  sendEmail() {
    console.log("url", location.href)
    location.href='mailto:info@example.com?body=' + encodeURIComponent(location.href)  
  }

  makeToot() {
    return false;
  }

  makeTweet() {
    var url =
      "https://twitter.com/intent/tweet?url=" + encodeURIComponent(location.href);
    window.open(url, "_blank");
    return false;
  }

  showAbout() {
    var url = "https://about.bitty.site";
    window.open(url, "_blank");
    return false;
  }
   copyLink() {
    var text = location.href;
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
  
  
  systemShare( info) {
    if (!info.url) info = {title:document.title, text:document.title, url:location.href};
    
    if (navigator.share) {
      navigator.share(info)
        .then(() => { console.log('Shared!');})
        .catch(console.error);
    } else {
      copyLink(info)
    }
  }

   icons = {
    "qr": `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><g id="qr_code"><mask id="mask0_1400_318" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path id="Bounding box" d="M0 0h24v24H0z"/></mask><g mask="url(#mask0_1400_318)"><path id="qr_code_2" d="M3 11V3h8v8H3Zm2-2h4V5H5v4ZM3 21v-8h8v8H3Zm2-2h4v-4H5v4Zm8-8V3h8v8h-8Zm2-2h4V5h-4v4Zm4 12v-2h2v2h-2Zm-6-6v-2h2v2h-2Zm2 2v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm2 2v-2h2v2h-2Zm2-2v-2h2v2h-2Zm0-4v-2h2v2h-2Zm2 2v-2h2v2h-2Z"/></g></g></svg>`,
    "text": `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><g id="chat_bubble"><mask id="mask0_1406_423" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path id="Bounding box" d="M0 0h24v24H0z"/></mask><g mask="url(#mask0_1406_423)"><path id="chat_bubble_2" d="M1.2 23.05V3.55c0-.733.259-1.358.775-1.875A2.554 2.554 0 0 1 3.85.9h16.3a2.55 2.55 0 0 1 1.875.775c.517.517.775 1.142.775 1.875v12.2c0 .733-.258 1.358-.775 1.875a2.554 2.554 0 0 1-1.875.775H5.85L1.2 23.05Zm2.65-6.4.9-.9h15.4V3.55H3.85v13.1Z"/></g></g></svg>`,
    "email": `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><g id="mail"><mask id="mask0_1406_417" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path id="Bounding box" d="M0 0h24v24H0z"/></mask><g mask="url(#mask0_1406_417)"><path id="mail_2" d="M3.85 20.75a2.554 2.554 0 0 1-1.875-.775A2.554 2.554 0 0 1 1.2 18.1V5.9c0-.733.259-1.358.775-1.875A2.554 2.554 0 0 1 3.85 3.25h16.3a2.55 2.55 0 0 1 1.875.775c.517.517.775 1.142.775 1.875v12.2c0 .733-.258 1.358-.775 1.875a2.554 2.554 0 0 1-1.875.775H3.85ZM12 13.575 3.85 8.6v9.5h16.3V8.6L12 13.575ZM12 11l8.35-5.1H3.65L12 11Z"/></g></g></svg>`,
    "mastodon": `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><g id="mastodon 1"><path id="Vector" d="M20.606 13.912c-.281 1.35-2.419 2.813-4.781 3.15-4.837.62-7.706-.337-7.706-.337.168.731-.225 3.037 3.937 2.925 1.744 0 3.263-.394 3.263-.394l.112 1.519c-2.868 1.35-6.018.844-7.875.338C3.788 20.155 3.112 16.05 3 12V8.681c0-4.162 2.756-5.4 2.756-5.4 2.813-1.35 10.125-1.237 12.488 0 0 0 2.756 1.238 2.756 5.4 0 0 .056 3.094-.394 5.232Z"/><path id="Vector_2" d="M17.738 8.962v5.12h-1.97v-4.95c0-1.013-.45-1.52-1.293-1.52-1.012 0-1.519.62-1.519 1.857v2.644h-1.912V9.469c0-1.238-.506-1.857-1.519-1.857-.844 0-1.294.507-1.294 1.52v4.95H6.263v-5.12c0-1.012.28-3.375 2.925-3.375C11.38 5.587 12 7.67 12 7.67s.563-2.082 2.813-2.082c2.53 0 2.925 2.363 2.925 3.375Z"/></g></svg>`,
    "twitter": `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><g id="twitter 1"><path id="Vector" d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23Z"/></g></svg>`,
  }

  selectField(target) {
    target.select();
    target.scrollLeft = 0;
  }

  close(dialog) {
    dialog.close();
    dialog.parentNode.removeChild(dialog);
    this.button?.classList.remove("open")
  }

  show(info) {
    let url = location.href;
    let fullMenu = !info;
    this.button?.classList.add("open")
    let urlField = el("input.url", {value:url, readonly:true});
    urlField.onclick = (e) => this.selectField(urlField);
    let menu = el("dialog.menu", {onclick: (e) => {
      if (e.target.tagName == 'DIALOG') { this.close(menu); }
    }}, el("div.menu-container", {},
      urlField,
      el("div.menu-icons",
        el("div.menu-item", {id: "qrcode", onclick:this.makeQR, innerHTML:this.icons.qr} ),  
        el("div.menu-item", {id: "text", onclick:this.makeText, innerHTML:this.icons.text} ),
        el("div.menu-item", {id: "email", onclick:this.sendEmail, innerHTML:this.icons.email} ),
        // el("div.menu-item", {id: "mastodon", onclick:this.tootLink, innerHTML:this.icons.mastodon} ),
        el("div.menu-item", {id: "twitter", onclick:this.makeTweet, innerHTML:this.icons.twitter} ),
      ),
      el("div.menu-item", {onclick:this.copyLink}, "copy"),
      el("div.menu-item", {onclick:this.systemShare}, "share…"),
      // el("div.menu-item", {onclick:this.makeTinyurl}, "shorten"),
      // el("div.menu-item", {onclick:this.makeTinyurl}, "edit…"),
      fullMenu ? el("hr") : null,
      fullMenu ? el("div.menu-item", {onclick:this.showAbout}, "itty bitty") : null,
      )
    )

    document.body.appendChild(menu)

    if (info) {
      menu.style.display = "block";
      
      let x = info.offset.left;
      let y = info.offset.top;
      let w = menu.offsetWidth;
      let h = menu.offsetHeight
      x -= w / 2;
      y -= h / 2;

      let overflowX = x + w - window.innerWidth + 8;
      let overflowY = y + h - window.innerHeight + 8;


      if (overflowX > 0) x -= overflowX;
      if (overflowY > 0) y -= overflowY;

      x = Math.round(Math.max(8, x));
      y = Math.round(Math.max(8, y));

      menu.style.left = x + "px";
      menu.style.top = y + "px";
      

      menu.style.removeProperty("display") 
    }
    menu.showModal()
    this.selectField(urlField)

  }

}
    
export {
  Menu
};
