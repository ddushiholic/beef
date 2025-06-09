import config from './config';

export let tagList = [];
export let errorElList = {};

export function setHtml() {
  tagList = [];

  $('.btn-accessibility').remove();
  $('.accessibility-wrap').remove();
  let btnAccessibility = document.createElement('button');
  btnAccessibility.type = 'button';
  btnAccessibility.classList.add('btn', 'btn-primary', 'btn-accessibility');
  btnAccessibility.textContent = '웹 접근성 검사';

  let accessibilityWrap = document.createElement('div');
  accessibilityWrap.classList.add('accessibility-wrap');

  let innerHTML = `
  <h5 class="accessibility-title">
  웹 접근성 검사 <span class="accessibility-error">(0)</span>
  <a href="javascript:void(0);" class="btn accessibility-help"
  data-toggle="popover"
  data-html="true"
  data-placement="bottom"
  data-original-title="참고 사이트"
  data-content="
  <p>1. WebWatch : <a href='http://www.webwatch.or.kr' target='_blank' title='웹 와치 새창열기'>www.webwatch.or.kr</a></p>
  <p>2. NULI : <a href='https://nuli.navercorp.com/' target='_blank' title='널리 새창열기'>nuli.navercorp.com/</a></p>
  ">
  <i class="xi-help text-primary"><span class="sr-only">상세 설명</span></i>
  </a>
  </h5>
  <div class="accordion"></div>
  `;

  accessibilityWrap.innerHTML = innerHTML;

  let html = document.querySelector('html');
  let body = document.querySelector('body');

  let isAccessibility = localStorage.getItem('accessibility-active');
  body.appendChild(btnAccessibility);
  body.appendChild(accessibilityWrap);

  if (isAccessibility === 'true') {
    html.classList.add('accessibility-active');
  }
}
export function searchAllTag(el) {
  if (
    el.tagName != undefined &&
    el.tagName != 'META' &&
    el.tagName != 'HEAD' &&
    el.tagName != 'SCRIPT' &&
    !el.classList.contains('accessibility-wrap') &&
    !el.classList.contains('btn-accessibility')
  ) {
    if (!tagList) {
      tagList = [el];
    } else {
      tagList = [...tagList, el];
    }
    for (let i = 0; i < el.childNodes.length; i++) {
      searchAllTag(el.childNodes[i]);
    }
  }
}
export function setContents(id, errorList) {
  let el = `
  <div class= "card
  ${errorList != null && errorList.length == 0 ? 'none' : ''}
  ">
  <div class="card-header">
  <h2 class="d-flex mb-0">
  <button class="btn btn-link btn-block text-left collapsed ${errorList != null && errorList.length > 0 ? 'error' : ''}"
  type="button" data-toggle="collapse" data-target="#${id}" aria-expanded="true" aria-controls="${id}">
  ${config[id]['title']}${errorList != null ? '<span>(' + errorList.length + ')</span>' : ''}
  </button>
  <a href="javascript:void(0);" class="btn accessibility-help"
  data-toggle="popover"
  data-placement="bottom"
  title="${config[id]['title']}"
  data-content="${config[id]['desc']}">
  <i class="xi-help"><span class="sr-only">상세 설명</span></i></a>
  </h2>
  </div>
  <div id="${id}" class="collapse">
  <div class="card-body">
  `;
  if (errorList != null && errorList.length > 0) {
    el += `
    <div class="accessibility-table-wrap">
    <table class="table accessibility-table">
    <caption class="sr-only">오류 항목 리스트</caption>
    <colgroup>
    <col style="width: 50px;">
    <col style="width: 100px;">
    </colgroup>
    <thead>
    <tr>
    <th class="text-center">No</th>
    ${id == 'bcotc' ? '<th class="text-center">명도대비</th>' : '<th class="text-center">미리보기</th>'}
    <th>요소</th>
    </tr>
    </thead>
    <tbody>
    `;
    for (let i = 0; i < errorList.length; i++) {
      let clone = errorList[i][1];
      let isEl = typeof clone == 'object';
      el += `
      <tr>
      <td class="text-center">${i + 1}</td>
      <td>${errorList[i][0]}</td>
      `;
      if (isEl) {
        clone = errorList[i][1].cloneNode();
        clone.innerHTML = '...';
        let outerHtml = clone.outerHTML.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;').replaceAll('/', '&#x2F;').replaceAll('>', '&gt;').replaceAll('<', '&lt;');
        el += `
        <td><a href="javascript:void(0);" id="${id}-${i}">${outerHtml}</a></td>
        </tr>
        `;
      } else {
        el += `
        <td>${clone}</td>
        </tr>
        `;
      }
      errorElList[id + '-' + i] = errorList[i][1];
    }
    el += `
    </tbody>
    </table>
    </div>
    `;
  } else {
    if (errorList == null) {
      if (id == 'ccr') {
        el += '<button type="button" class="btn btn-gray btn-toggle-gray">흑백 토글 버튼</button>';
      } else {
        el += '<p>직접 확인 필요</p>';
      }
    } else {
      el += '<p>해당없음</p>';
    }
  }
  el += `
  </div>
  </div>
  </div>
  `;
  document.querySelector('.accessibility-wrap .accordion').innerHTML += el;
  setTimeout(function () {
    let elList = document.querySelectorAll('[id^="' + id + '-"]');
    for (let i = 0; i < elList.length; i++) {
      elList[i].addEventListener('click', (e) => {
        let data = e.target.id;
        let el = errorElList[data];
        let html = document.querySelector('html');
        let scrollTop = el.offsetTop;
        setErrorFocus(el);
        el.focus();
        html.scrollTop = scrollTop;
      });
    }
  }, 300);
}
export function setHelp() {
  $('.accessibility-help').popover();
}
export function setErrorFocus(el) {
  if (el.classList.contains('accessibility-focus')) {
    el.classList.remove('accessibility-focus');
    // el.removeEventListener('click', errorEvent);
  } else {
    el.classList.add('accessibility-focus');
    // el.addEventListener('click', errorEvent);
  }
}
export function getStyle(el, style) {
  return window.getComputedStyle(el)[style];
}
function getColorRGBA(el) {
  let color = window.getComputedStyle(el).color;
  !color.includes('rgba') ? (color = color.replace('rgb', 'rgba').replace(')', ', 1)')) : '';
  let rgba = color.replace('rgba(', '').replace(')', '').split(', ');
  return rgba;
}
function getBgRGBA(el) {
  let bg = window.getComputedStyle(el).backgroundColor;
  !bg.includes('rgba') ? (bg = bg.replace('rgb', 'rgba').replace(')', ', 1)')) : '';
  let rgba = bg.replace('rgba(', '').replace(')', '').split(', ');
  return rgba;
}
export function isAppointedBg(el) {
  let rgba = getBgRGBA(el);
  if (rgba.length > 3) {
    let r = Number(rgba[0]);
    let g = Number(rgba[1]);
    let b = Number(rgba[2]);
    let a = Number(rgba[3]);

    let total = r + g + b + a;

    if (total > 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}
export function luminance(rgba, rgb) {
  let r, g, b;

  if (rgba[3] == 0) {
    r = 0;
    g = 0;
    b = 0;
  } else if (rgba[3] == 1) {
    r = Number(rgba[0]);
    g = Number(rgba[1]);
    b = Number(rgba[2]);
  } else {
    r = Number(rgb[0]) + (Number(rgba[0]) - Number(rgb[0])) * rgba[3];
    g = Number(rgb[1]) + (Number(rgba[1]) - Number(rgb[1])) * rgba[3];
    b = Number(rgb[2]) + (Number(rgba[2]) - Number(rgb[2])) * rgba[3];
    // console.log('rgba = ' + rgba + ', c = ' + r + ',' + g + ',' + b);
  }

  let l = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return l[0] * 0.2126 + l[1] * 0.7152 + l[2] * 0.0722;
}
export function getContrastRatio(colorEl, bgEl) {
  let color = getColorRGBA(colorEl);
  let bg = getBgRGBA(bgEl);
  let l1 = Math.max(luminance(color, bg), luminance(bg, color));
  let l2 = Math.min(luminance(color, bg), luminance(bg, color));
  let ratio = Math.floor(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;

  return ratio;
}
export function startingLoading(colorEl, bgEl) {
  let color = getColorRGBA(colorEl);
  let bg = getBgRGBA(bgEl);
  let l1 = Math.max(luminance(color, bg), luminance(bg, color));
  let l2 = Math.min(luminance(color, bg), luminance(bg, color));
  let ratio = Math.floor(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;

  return ratio;
}
export function startLoading() {
  let wrapElmnt = document.createElement('div');
  wrapElmnt.classList.add('accessibility-spinner-wrap');
  let loadingElmnt = document.createElement('div');
  loadingElmnt.classList.add('spinner-border');
  let span = document.createElement('span');
  span.classList.add('sr-only');
  span.innerHTML = 'Loading...';
  loadingElmnt.appendChild(span);
  wrapElmnt.appendChild(loadingElmnt);

  let accessibilityWrap = document.getElementsByClassName('accessibility-wrap')[0];
  accessibilityWrap.style.overflow = 'hidden';
  accessibilityWrap.appendChild(wrapElmnt);
}
export function endLoading() {
  let wrapElmnt = document.getElementsByClassName('accessibility-spinner-wrap')[0];
  wrapElmnt.style.opacity = 0;
  let accessibilityWrap = document.getElementsByClassName('accessibility-wrap')[0];
  accessibilityWrap.style.overflow = 'auto';
  setTimeout(function () {
    wrapElmnt.remove();
  }, 300);
}
