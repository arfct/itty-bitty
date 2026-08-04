let script = window.script;

let fieldIcons = {
  bday: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M4 22a.967.967 0 0 1-.712-.288A.968.968 0 0 1 3 21v-5c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 5 14v-4c0-.55.196-1.02.588-1.412A1.926 1.926 0 0 1 7 8h4V6.55c-.3-.2-.542-.442-.725-.725C10.092 5.542 10 5.2 10 4.8c0-.25.05-.496.15-.737.1-.242.25-.463.45-.663L12 2l1.4 1.4c.2.2.35.42.45.663.1.241.15.487.15.737 0 .4-.092.742-.275 1.025A2.503 2.503 0 0 1 13 6.55V8h4c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v4c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v5c0 .283-.096.52-.288.712A.968.968 0 0 1 20 22H4Zm3-8h10v-4H7v4Zm-2 6h14v-4H5v4Z"/></g></svg>',
  call: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M19.95 21c-2.15 0-4.246-.48-6.287-1.438a19.066 19.066 0 0 1-5.425-3.8 19.067 19.067 0 0 1-3.8-5.425C3.478 8.296 3 6.2 3 4.05c0-.3.1-.55.3-.75.2-.2.45-.3.75-.3H8.1a.96.96 0 0 1 .625.225.88.88 0 0 1 .325.575l.65 3.5c.033.233.03.446-.012.638a1.023 1.023 0 0 1-.288.512L6.975 10.9a16.4 16.4 0 0 0 2.638 3.375A18.64 18.64 0 0 0 13.1 17l2.35-2.35a1.4 1.4 0 0 1 .588-.338 1.61 1.61 0 0 1 .712-.062l3.45.7c.233.05.425.163.575.338.15.175.225.379.225.612v4.05c0 .3-.1.55-.3.75-.2.2-.45.3-.75.3ZM6.025 9l1.65-1.65L7.25 5H5.025c.083.683.2 1.358.35 2.025.15.667.367 1.325.65 1.975Zm8.95 8.95c.65.283 1.313.508 1.987.675.675.167 1.355.275 2.038.325v-2.2l-2.35-.475-1.675 1.675Z"/></g></svg>',
  tel: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M2 22V4c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 4 2h16c.55 0 1.02.196 1.413.587.39.393.587.863.587 1.413v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 20 18H6l-4 4Zm3.15-6H20V4H4v13.125L5.15 16Z"/></g></svg>',
  url: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M12 22a9.676 9.676 0 0 1-3.875-.788 10.144 10.144 0 0 1-3.188-2.15 10.142 10.142 0 0 1-2.15-3.187A9.676 9.676 0 0 1 2 12c0-1.383.263-2.68.788-3.887a10.183 10.183 0 0 1 2.15-3.175 10.143 10.143 0 0 1 3.187-2.15A9.676 9.676 0 0 1 12 2c1.383 0 2.68.263 3.887.788a10.183 10.183 0 0 1 3.175 2.15 10.184 10.184 0 0 1 2.15 3.175A9.649 9.649 0 0 1 22 12a9.676 9.676 0 0 1-.788 3.875 10.143 10.143 0 0 1-2.15 3.188 10.184 10.184 0 0 1-3.175 2.15A9.649 9.649 0 0 1 12 22Zm0-2.05c.433-.6.808-1.225 1.125-1.875.317-.65.575-1.342.775-2.075h-3.8c.2.733.458 1.425.775 2.075.317.65.692 1.275 1.125 1.875Zm-2.6-.4c-.3-.55-.563-1.12-.787-1.713A14.688 14.688 0 0 1 8.05 16H5.1a8.3 8.3 0 0 0 1.813 2.175A7.195 7.195 0 0 0 9.4 19.55Zm5.2 0a7.195 7.195 0 0 0 2.487-1.375A8.299 8.299 0 0 0 18.9 16h-2.95c-.15.633-.337 1.246-.563 1.837a13.857 13.857 0 0 1-.787 1.713ZM4.25 14h3.4a13.208 13.208 0 0 1-.15-2 13.208 13.208 0 0 1 .15-2h-3.4A7.959 7.959 0 0 0 4 12a7.959 7.959 0 0 0 .25 2Zm5.4 0h4.7a13.208 13.208 0 0 0 .15-2 13.208 13.208 0 0 0-.15-2h-4.7a13.208 13.208 0 0 0-.15 2 13.208 13.208 0 0 0 .15 2Zm6.7 0h3.4a7.953 7.953 0 0 0 .25-2 7.953 7.953 0 0 0-.25-2h-3.4a13.208 13.208 0 0 1 .15 2 13.208 13.208 0 0 1-.15 2Zm-.4-6h2.95a8.298 8.298 0 0 0-1.813-2.175A7.196 7.196 0 0 0 14.6 4.45c.3.55.563 1.12.787 1.712.226.592.413 1.205.563 1.838ZM10.1 8h3.8a11.82 11.82 0 0 0-.775-2.075A12.701 12.701 0 0 0 12 4.05c-.433.6-.808 1.225-1.125 1.875A11.82 11.82 0 0 0 10.1 8Zm-5 0h2.95c.15-.633.337-1.246.563-1.838C8.838 5.571 9.1 5 9.4 4.45c-.933.3-1.763.758-2.488 1.375A8.298 8.298 0 0 0 5.1 8Z"/></g></svg>',
  adr: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M12 12c.55 0 1.02-.196 1.412-.588.392-.391.588-.862.588-1.412 0-.55-.196-1.02-.588-1.412A1.926 1.926 0 0 0 12 8c-.55 0-1.02.196-1.412.588A1.926 1.926 0 0 0 10 10c0 .55.196 1.02.588 1.412.391.392.862.588 1.412.588Zm0 7.35c2.033-1.867 3.542-3.563 4.525-5.088C17.508 12.738 18 11.383 18 10.2c0-1.817-.58-3.304-1.738-4.462C15.104 4.579 13.683 4 12 4c-1.683 0-3.104.58-4.263 1.737C6.58 6.896 6 8.383 6 10.2c0 1.183.492 2.538 1.475 4.063.983 1.524 2.492 3.22 4.525 5.087ZM12 22c-2.683-2.283-4.688-4.404-6.013-6.363C4.662 13.68 4 11.867 4 10.2c0-2.5.804-4.492 2.412-5.975C8.021 2.742 9.883 2 12 2s3.98.742 5.587 2.225C19.197 5.708 20 7.7 20 10.2c0 1.667-.663 3.48-1.988 5.438C16.688 17.595 14.683 19.716 12 22Z"/></g></svg>',
  email: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M4 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 2 18V6c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 4 4h16c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 20 20H4Zm8-7L4 8v10h16V8l-8 5Zm0-2 8-5H4l8 5ZM4 8V6v12V8Z"/></g></svg>',
  note: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M6 22c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 4 20V4c0-.55.196-1.02.588-1.413A1.926 1.926 0 0 1 6 2h8l6 6v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 18 22H6Zm7-13V4H6v16h12V9h-5Z"/></g></svg>',
  add: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M18 14v-3h-3V9h3V6h2v3h3v2h-3v3h-2Zm-9-2c-1.1 0-2.042-.392-2.825-1.175C5.392 10.042 5 9.1 5 8s.392-2.042 1.175-2.825C6.958 4.392 7.9 4 9 4s2.042.392 2.825 1.175C12.608 5.958 13 6.9 13 8s-.392 2.042-1.175 2.825C11.042 11.608 10.1 12 9 12Zm-8 8v-2.8c0-.567.146-1.087.438-1.563A2.911 2.911 0 0 1 2.6 14.55a14.843 14.843 0 0 1 3.15-1.163A13.76 13.76 0 0 1 9 13c1.1 0 2.183.13 3.25.387 1.067.259 2.117.646 3.15 1.163.483.25.87.612 1.162 1.087.292.476.438.996.438 1.563V20H1Zm2-2h12v-.8a.973.973 0 0 0-.5-.85c-.9-.45-1.808-.787-2.725-1.012a11.6 11.6 0 0 0-5.55 0c-.917.225-1.825.562-2.725 1.012a.973.973 0 0 0-.5.85v.8Zm6-8c.55 0 1.02-.196 1.412-.588C10.804 9.021 11 8.55 11 8c0-.55-.196-1.02-.588-1.412A1.926 1.926 0 0 0 9 6c-.55 0-1.02.196-1.412.588A1.926 1.926 0 0 0 7 8c0 .55.196 1.02.588 1.412C7.979 9.804 8.45 10 9 10Z"/></g></svg>',
  vid: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M4 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 2 18V6c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 4 4h12c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v4.5l4-4v11l-4-4V18c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 16 20H4Zm0-2h12V6H4v12Z"/></g></svg>',
}

let siteIcons = {
  "twitter.com": {icon: "twitter", reformat:(a) => a.replace(/twitter.com\/(.*)/, "@$1")},
  "facebook.com": {icon: "facebook"},
  "instagram.com": {icon: "instagram", reformat:(a) => a.replace(/instagram.com\/(.*)/, "@$1")},
  "linkedin.com": {icon: "linkedin",  reformat:(a) => a.replace(/linkedin.com\/in\/(.*)/, "@$1")},
  "read.cv": {icon: "readcv"},
  "youtube.com": {icon: "youtube"},
  "tiktok.com": {icon: "tiktok"},
  "snapchat.com": {icon: "snapchat"},
  "pinterest.com": {icon: "pinterest"},
  "tumblr.com": {icon: "tumblr"},
  "reddit.com": {icon: "reddit"},
  "github.com": {icon: "github", reformat:(a) => a.replace(/github.com\/(.*)/, "@$1")},
  "medium.com": {icon: "medium"},
  "twitch.tv": {icon: "twitch"},
  "discordapp.com": {icon: "discord", reformat:(a) => "Discord"},
}

let spriteString = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="24" fill="none" viewBox="0 0 192 24">
  <g class="Symbols">
    <g class="linkedin">
      <path fill="#000" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14Zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79ZM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68Zm1.39 9.94v-8.37H5.5v8.37h2.77Z" class="Vector"/>
    </g>
    <g class="github">
      <path fill="#000" d="M36 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C43.14 20.16 46 16.42 46 12A10 10 0 0 0 36 2Z" class="Vector"/>
    </g>
    <g class="twitter">
      <path fill="#000" d="M70.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C66.37 4.5 65.26 4 64 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06 1.9 1.22 4.16 1.93 6.58 1.93C64 21 68.33 14.46 68.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23Z" class="Vector"/>
    </g>
    <g class="facebook">
      <path fill="#000" d="M84 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H79.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z" class="Vector"/>
    </g>
    <g class="youtube">
      <path fill="#000" d="m106 15 5.19-3L106 9v6Zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09l.06.84c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L108 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L98 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L108 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73Z" class="Vector"/>
    </g>
    <g class="pinterest">
      <path fill="#000" d="M129.04 21.54c.96.29 1.93.46 2.96.46a10 10 0 1 0-10-10c0 4.25 2.67 7.9 6.44 9.34-.09-.78-.18-2.07 0-2.96l1.15-4.94s-.29-.58-.29-1.5c0-1.38.86-2.41 1.84-2.41.86 0 1.26.63 1.26 1.44 0 .86-.57 2.09-.86 3.27-.17.98.52 1.84 1.52 1.84 1.78 0 3.16-1.9 3.16-4.58 0-2.4-1.72-4.04-4.19-4.04-2.82 0-4.48 2.1-4.48 4.31 0 .86.28 1.73.74 2.3.09.06.09.14.06.29l-.29 1.09c0 .17-.11.23-.28.11-1.28-.56-2.02-2.38-2.02-3.85 0-3.16 2.24-6.03 6.56-6.03 3.44 0 6.12 2.47 6.12 5.75 0 3.44-2.13 6.2-5.18 6.2-.97 0-1.92-.52-2.26-1.13l-.67 2.37c-.23.86-.86 2.01-1.29 2.7v-.03Z" class="Vector"/>
    </g>
    <g class="snapchat">
      <path fill="#000" d="M165.93 16.56c-.14-.38-.43-.56-.71-.75-.05-.03-.11-.06-.15-.08-.07-.05-.18-.09-.27-.14-.94-.5-1.68-1.13-2.19-1.87a6.15 6.15 0 0 1-.37-.66c-.04-.13-.04-.2-.01-.26.03-.05.07-.1.12-.13.15-.11.33-.21.44-.29.21-.13.36-.23.46-.3.39-.27.66-.58.83-.88.24-.45.27-.98.08-1.45-.25-.67-.89-1.09-1.66-1.09-.16 0-.32.02-.5.05 0 .01-.06.02-.1.03 0-.46-.01-.94-.05-1.42-.14-1.68-.73-2.56-1.35-3.26-.39-.44-.85-.82-1.36-1.11-.93-.53-1.99-.8-3.14-.8-1.15 0-2.2.27-3.13.8-.52.29-.98.67-1.37 1.11-.62.7-1.2 1.58-1.35 3.26-.04.48-.05.96-.04 1.42-.05-.01-.11-.02-.11-.03-.18-.03-.34-.05-.5-.05-.77 0-1.41.42-1.66 1.09-.19.47-.16 1 .08 1.45.17.3.44.61.83.88.1.07.25.17.46.31l.42.27c.06.04.1.09.14.14.03.07.03.14-.02.27-.1.23-.22.43-.36.65-.5.73-1.21 1.35-2.12 1.84-.49.26-.99.44-1.2 1-.16.44-.07.94.35 1.35.15.15.32.28.51.38.4.21.82.39 1.25.5.09.03.18.06.25.12.15.12.13.32.33.59.1.16.24.29.37.39.41.29.87.3 1.37.32.44.02.94.04 1.5.23.26.06.5.23.79.41.71.42 1.63 1 3.21 1 1.57 0 2.5-.58 3.22-1.01.28-.17.53-.34.78-.4.55-.19 1.06-.21 1.5-.23.5-.01.96-.03 1.37-.32.17-.12.31-.28.42-.46.14-.24.14-.43.27-.52.07-.05.15-.09.24-.11.44-.12.86-.3 1.26-.51.21-.11.39-.25.54-.42h.01c.39-.41.47-.87.32-1.31Zm-1.4.75c-.86.47-1.43.42-1.87.69-.16.12-.21.28-.24.44l-.03.2c-.02.14-.05.26-.15.33-.34.23-1.33-.02-2.61.4-1.06.35-1.73 1.36-3.63 1.36s-2.55-1-3.63-1.36c-1.27-.42-2.27-.17-2.6-.4-.27-.19-.05-.71-.43-.97-.44-.27-1.01-.22-1.84-.69-.31-.16-.36-.31-.32-.38.04-.09.16-.16.24-.2 1.65-.79 2.58-1.82 3.05-2.63.44-.72.53-1.27.56-1.35.03-.21.06-.37-.17-.58-.22-.21-1.2-.81-1.47-1-.46-.32-.65-.63-.51-1.02.12-.27.35-.37.62-.37.08 0 .16.01.24.03.5.1.98.35 1.26.42.03.01.06.01.1.01.09 0 .14-.03.17-.09.01-.04.02-.09.02-.15-.04-.54-.11-1.59-.03-2.58.04-.42.11-.78.2-1.09.2-.68.54-1.13.88-1.54.25-.29 1.41-1.52 3.66-1.52 1.85 0 2.96.84 3.44 1.29.1.1.18.18.22.23.38.44.72.92.92 1.68.07.27.13.59.16.95.08.98.01 2.04-.03 2.58 0 .04 0 .08.01.11.01.09.07.13.18.13.04 0 .07 0 .1-.01.28-.07.76-.32 1.26-.43.08-.01.16-.02.24-.02.25 0 .5.09.6.32l.01.04h.01v.01c.15.38-.05.7-.5 1.01-.27.19-1.26.8-1.48 1-.23.22-.2.38-.17.59.03.1.21 1.05 1.11 2.11.55.64 1.34 1.31 2.5 1.87.07.03.16.08.21.14.03.05.05.09.04.13-.01.1-.1.2-.3.31Z" class="Vector"/>
    </g>
    <g class="instagram">
      <path fill="#000" d="M175.8 2h8.4c3.2 0 5.8 2.6 5.8 5.8v8.4a5.799 5.799 0 0 1-5.8 5.8h-8.4c-3.2 0-5.8-2.6-5.8-5.8V7.8a5.799 5.799 0 0 1 5.8-5.8Zm-.2 2a3.602 3.602 0 0 0-3.6 3.6v8.8c0 1.99 1.61 3.6 3.6 3.6h8.8a3.602 3.602 0 0 0 3.6-3.6V7.6c0-1.99-1.61-3.6-3.6-3.6h-8.8Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM180 7a5.002 5.002 0 0 1 3.536 8.536A5.002 5.002 0 0 1 175 12a5.002 5.002 0 0 1 5-5Zm0 2a2.998 2.998 0 0 0-3 3 2.999 2.999 0 0 0 5.121 2.121A2.999 2.999 0 0 0 180 9Z" class="Vector"/>
    </g>
  </g>
</svg>`

// <svg class="icon"><use href="img/icons.svg#folder"></svg>

var template = document.createElement('template');
template.innerHTML = spriteString;
console.log(template.content.firstChild);
let groups = Array.from(template.content.querySelector("svg .Symbols").children);

let sprite = el("svg", {xmlns:"http://www.w3.org/2000/svg"},
  el("defs", {},groups.map(
    (group,i) => el("symbol", {viewBox: 24 * i + " 0 24 24", id:"icon-" + group.getAttribute("class")}, group)
    )
  ))

console.log("sprite", sprite);
// document.body.appendChild(sprite);
  

function share() {
  parent.postMessage({share:{}}, "*");
}

function vcardVersion(data) {
  if (data.vcard) return data.vcard;

  return `BEGIN:VCARD
VERSION:3.0
N:NAME
END:VCARD`
}

function formatBday(date) {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6) - 1; // months are zero-indexed in JavaScript
  const day = date.slice(6, 8);
  const options = { month: 'long', day: 'numeric' };
  return new Date(year, month, day).toLocaleDateString(undefined, options)
}

function render() {
  document.head.appendChild(el("base", {target:"_top"}))
  document.head.appendChild(el("meta", {name:"viewport", content:"width=device-width, initial-scale=1.0"}))
  let vcard = params.body.match(/BEGIN:VCARD/);
  if (vcard) {
    let data = parse(params.body)
    console.log(data, params.body.split("\n"));
    document.body.appendChild(
      el("div.contact", {}, 
        el("h1.header", {}, data.fn),
        data.email.forEach(email => el("div.email", {}, email.value.pop())),
        data.tel.forEach(tel => el("div.tel", {}, tel.value.pop())),
        // array.map(line => el("div.line", {}, line)),
      )
    )
  } else if (params.body.match(/MECARD:/)){
    document.body.appendChild(el("#arc-theme"));
    let queryString = params.body.substring(7);
    queryString = queryString.split(";").map(line => line.replace(/\:/, "=")).join("&");

    let searchParams = new URLSearchParams(queryString);
    
    let headingElements = [];
    let contentElements = [];
    let imgElement = undefined;

    searchParams.forEach((value, key) => {
      key = key.toLowerCase();
      value = decodeURIComponent(value);
      console.log(value, key);
      if (key == 'color') {
        document.body.style.backgroundColor = value;
      } else if (key == 'n') {
        value = value.split(",").reverse().join(" ");
        headingElements.push(el("h1", {}, value))
      } else if (key == 'img') {
        imgElement = (el("img.profile", {src:value}));
      } else {
        let href = undefined;
        if (key == "email") {
          href = "mailto:" + value;    
        }
        if (key == "url") {
          href = value;  
          value = value.replace(/https?:\/\/(www.)?/, "") 
        }

        if (key == "bday") {
          value = formatBday(value)
        }

        if (key == "tel") {
          let actionrow = el("div.row." + key, {target:"top", href}, 
            el("a.icon", {href:"facetime:" + value},  el.trust(fieldIcons["vid"])),
            el("a.icon", {href:"tel:" + value},  el.trust(fieldIcons["call"])),  

            el("a.icon", {href:"add:" + value},  el.trust(fieldIcons["add"])),  
          )
          headingElements.push(actionrow)
        }
        if (key == "nickname") { return; }

        if (!fieldIcons[key]) {
          headingElements.push(el("div", value));
        } else {
          let icon = el("div.icon",  el.trust(fieldIcons[key]))
          
          if (key == "url") {
            let override = siteIcons[new URL(href).hostname];
            
            if (override) {
              let site = "#icon-" + override.icon;
              if (override.reformat) value = override.reformat(value);
              console.log(override.reformat, value)
              icon.innerHTML = `<svg><use href="${site}"/></svg`  
            }
            // let createSVGSprite = function(id) {
            //   let ns = "http://www.w3.org/2000/svg";
            //   let svg = document.createElementNS(ns, "svg");
            //   let use = document.createElementNS(ns, "use")
            //   use.setAttributeNS(null, "href", id);
            //   svg.appendChild(use);
            //   return svg
            // }
  

            // img = createSVGSprite("#icon-linkedin")
            // console.log("img", img)
            
            // img = el("img", {src:"https://www.google.com/s2/favicons?sz=48&domain=" + href});
          
          } 
          contentElements.push(
            el("a.row." + key, {target:"top", href}, 
              icon, 
              el("div.field", value.replace("  ", "\n"))
            )
          )
        }
      }

    });
    document.body.appendChild(
      el("div.contact", {}, 
        el("div.primaryGroup",
          imgElement, 
          el("div.header", {}, headingElements),
        ),
        el("div.content", {}, contentElements)
      )
    )
  }
}



// var path = script.substring(0, script.lastIndexOf("."));
// var cssURL = path + ".css";
// Promise.all([ 
//   loadSyle(cssURL)
// ]).then(render);

function parse(input) {
  var Re1 = /^(version|fn|title|org):(.+)$/i;
  var Re2 = /^([^:;]+);([^:]+):(.+)$/;
  var ReKey = /item\d{1,2}\./;
  var fields = {};

  input.split(/\r\n|\r|\n/).forEach(function (line) {
      var results, key;

      if (Re1.test(line)) {
          results = line.match(Re1);
          key = results[1].toLowerCase();
          fields[key] = results[2];
      } else if (Re2.test(line)) {
          results = line.match(Re2);
          key = results[1].replace(ReKey, '').toLowerCase();

          var meta = {};
          results[2].split(';')
              .map(function (p, i) {
              var match = p.match(/([a-z]+)=(.*)/i);
              if (match) {
                  return [match[1], match[2]];
              } else {
                  return ["TYPE" + (i === 0 ? "" : i), p];
              }
          })
              .forEach(function (p) {
              meta[p[0]] = p[1];
          });

          if (!fields[key]) fields[key] = [];

          fields[key].push({
              meta: meta,
              value: results[3].split(';')
          })
      }
  });

  return fields;
};


  window.addEventListener("message", function(e) {
    let data = e.data;
    window.script = data.script
    window.params = data;
    window.params.origin = e.origin;
    console.log("🖊 Rendering with", {script:data.script, params:data})
    render()
  }, false);
