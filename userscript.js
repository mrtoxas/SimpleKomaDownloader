// ==UserScript==
// @name         SimpleKomaDownloader
// @version      0.21
// @description  Simplified download from *.koma.tv
// @author       mrtoxas, mrtoxas@gmail.com
// @match        *://*.koma.tv/*
// @run-at       document-idle
// ==/UserScript==
(function() {
    "use strict";
    let style = document.createElement('style');
    document.head.appendChild(style);
    style.appendChild(document.createTextNode('.content .btn33{padding:0} .content .btn33>span{padding:5px 0px 5px 30px}'));
    const getContentId = (data) => data.match(/\/\d+/)[0].slice(1);
    CONTENT.download = (msg, link) => {
        let contentId = getContentId(link);
        if (link.indexOf('/download/') >= 0) {
            CONTENT.addViewed(contentId);
            window.location.replace(`/getUrl/1/${contentId}/0`);
        }
        if (link.indexOf('/view/') >= 0 && CONTENT_TYPE === 'serial') {
            window.location.replace(link);
        } else {
            return false;
        }
    };

    const showPlayer = target => {
        let actualUrl = window.location.href;
        let actualUrlData = actualUrl.substr(actualUrl.lastIndexOf('/') + 1);
        let contentId = getContentId((target.parentElement.hasAttribute("onclick")) ?
            target.parentElement.getAttribute("onclick") :
            target.closest('A').getAttribute("href"));
        if (actualUrl.indexOf('/page/') == -1 && !isNaN(parseFloat(actualUrlData)) && isFinite(actualUrlData)) {
            window.location.replace(`#content/view/${contentId}`);
        } else {
            CONTENT.ajax({
                action: "getPreviewLink",
                data: {
                    'id_file': contentId
                },
                onSuccess: function(response) {
                    let playerElement = document.getElementById('vPlayer');
                    if (playerElement) {
                        playerElement.firstElementChild.src = '';
                        playerElement.remove();
                    }

                    let div = document.createElement('div');
                    div.id = 'vPlayer';
                    div.innerHTML = `<video controls autoplay style="margin-top:10px;" width="100%" src="${response}"></video>
									 <div style="cursor:pointer" onclick="this.previousElementSibling.src='';this.parentElement.remove()">Закрыть плеер</div>`;
                    target.closest('.element').appendChild(div);
                    window.scrollTo(0, div.offsetTop);
                }
            });
        }
    }

    window.addEventListener('click', (event) => {
        let target = event.target;
        if ((target.classList.contains("url_down") || target.classList.contains("btn_down")) && target.closest('A')) {
            event.preventDefault();
            let contentId = getContentId(target.closest('A').href);
            CONTENT.addViewed(contentId);
            window.location.replace(`/getUrl/1/${contentId}/0`);
        }
        if (target.classList.contains('btn-view') && CONTENT_TYPE === 'video') {
            event.preventDefault();
            showPlayer(target);
        }
    });
})();
