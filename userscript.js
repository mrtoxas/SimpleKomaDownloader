// ==UserScript==
// @name         SimpleKomaDownloader
// @version      0.1
// @description  Simplified download from *.koma.tv
// @author       mrtoxas, mrtoxas@gmail.com
// @match        *://*.koma.tv/*
// @run-at       document-idle
// ==/UserScript==

(function() {
  "use strict";
  dlg_container.remove();
  window.addEventListener("click", (event) => {
    let target = event.target;
    if (target.classList.contains("url_down") || target.classList.contains("btn_down")) {
      event.preventDefault();
      let urlContainer = target.closest("a") || target.closest("div");
      let urlData = urlContainer.getAttribute("onclick") || urlContainer.getAttribute("href");
      let ContentId = urlData.match(/\/\d+/)[0].slice(1);
      CONTENT.addViewed(ContentId);
      location.href = `/getUrl/1/${ContentId}/0`;
    };
  })
})();
