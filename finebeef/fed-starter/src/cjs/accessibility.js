// variable
import { tagList, errorElList } from './helpers';
// function
import { setHtml, searchAllTag, setHelp, setContents, getStyle, isAppointedBg, getContrastRatio, startLoading, endLoading } from './helpers';

window.addEventListener('load', () => {
  init();

  function init() {
    setHtml();
    setBtnAccessibility();

    startLoading();

    setTimeout(() => {
      searchAllTag(document.querySelector('html'));
      checkALL();
      setHelp();
      endLoading();
    }, 300);
  }

  function setBtnAccessibility() {
    document.querySelector('.btn-accessibility').addEventListener('click', () => {
      let html = document.querySelector('html');
      if (html.classList.contains('accessibility-active')) {
        html.classList.remove('accessibility-active');
        localStorage.setItem('accessibility-active', false);
      } else {
        html.classList.add('accessibility-active');
        localStorage.setItem('accessibility-active', true);
        init();
      }
    });
  }

  function checkALL() {
    checkPAAT();
    checkSP();
    checkCCR();
    checkPCI();
    checkBCOTC();
    checkNA();
    checkSBC();
    checkGUOTK();
    checkSFTG();
    checkFS();
    checkO();
    checkRTA();
    checkSFP();
    checkLTUOBAF();
    checkSRR();
    checkPT();
    checkALT();
    checkSAL();
    checkLEATUN();
    checkLLOC();
    checkTS();
    checkLP();
    checkEC();
    checkLAME();
    checkLWAAC();

    let errorCountTitle = document.querySelector('.accessibility-error');
    let errorListLength = Object.keys(errorElList).length;
    if (errorListLength > 0) {
      $('.btn-accessibility').addClass('btn-danger');
    }
    errorCountTitle.innerHTML = `(${errorListLength})`;
  }

  // 1. 적절한 대체 텍스트 제공
  function checkPAAT() {
    let errorList = [];

    for (let i = 0; i < tagList.length; i++) {
      let alt = '';
      // img 태그 alt 확인
      if (tagList[i].tagName == 'IMG' || tagList[i].tagName == 'AREA') {
        alt = tagList[i].alt;

        if (alt == null || alt.trim() == '') {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
      if (tagList[i].tagName == 'INPUT' && tagList[i].type == 'image') {
        alt = tagList[i].alt;

        if (alt == null || alt.trim() == '') {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
      // background-image 대체 텍스트 확인
      if (getStyle(tagList[i], 'background-image') != 'none') {
        alt = tagList[i].innerHTML;
        if (alt == null || alt == '') {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
      // 아이콘 대체 텍스트 확인
      if (tagList[i].tagName == 'I') {
        alt = tagList[i].innerHTML;

        if (alt == null || alt == '') {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
      // object 대체 텍스트 확인
      if (tagList[i].tagName == 'OBJECT') {
        alt = tagList[i].innerHTML;

        if (alt == null || alt == '') {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
      // svg 대체 텍스트 확인
      if (tagList[i].tagName == 'SVG') {
        alt = tagList[i].innerHTML;

        if (alt == null || alt == '') {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
    }

    setContents('paat', errorList);
  }

  // 2. 자막제공
  function checkSP() {
    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tagName == 'VIDEO') {
        setContents('sp', null);
        return;
      } else if (tagList[i].tagName == 'IFRAME') {
        if (tagList[i].src.includes('youtube')) {
          setContents('sp', null);
          return;
        }
      }
    }

    setContents('sp', []);
  }

  // 3. 색에 무관한 콘텐츠 인식
  function checkCCR() {
    setContents('ccr', null);
    setTimeout(() => {
      document.querySelector('.btn-toggle-gray').addEventListener('click', () => {
        let html = document.querySelector('html');
        if (html.classList.contains('accessibility-gray')) {
          document.querySelector('html').classList.remove('accessibility-gray');
        } else {
          document.querySelector('html').classList.add('accessibility-gray');
        }
      });
    }, 300);
  }

  // 4. 명확한 지시사항 제공
  function checkPCI() {
    setContents('pci', null);
  }

  // 5. 텍스트 콘텐츠의 명도 대비
  function checkBCOTC() {
    let errorList = [];
    for (let i = 0; i < tagList.length; i++) {
      let rect = tagList[i].getBoundingClientRect();
      let isViewd = rect.width > 1 && rect.height > 1 && !tagList[i].classList.contains('sr-only') > 0 ? true : false;
      if (isViewd) {
        for (let j = 0; j < tagList[i].childNodes.length; j++) {
          let el = tagList[i].childNodes[j].parentNode;
          let text = tagList[i].childNodes[j].wholeText;
          if (text && text.trim() != '') {
            let _isAppointedBg = false;
            while (!_isAppointedBg) {
              if (isAppointedBg(el)) {
                let ratio = getContrastRatio(tagList[i], el);
                if (ratio < 4.5) {
                  errorList.push([ratio, tagList[i]]);
                }
                _isAppointedBg = true;
              } else {
                el = el.parentNode;
                if (el == document) {
                  _isAppointedBg = true;
                }
              }
            }
          }
        }
      }
    }
    setContents('bcotc', errorList);
  }

  // 6. 자동 재생 금지
  function checkNA() {
    let errorList = [];

    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tagName == 'VIDEO') {
        if (tagList[i].autoplay && !tagList[i].muted) {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
      if (tagList[i].tagName == 'IFRAME') {
        let src = tagList[i].src;
        if (src.includes('autoplay=1') && !src.includes('mute=1')) {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
    }

    setContents('na', errorList);
  }

  // 7. 콘텐츠 간의 구분
  function checkSBC() {
    setContents('sbc', null);
  }

  // 8-1. 키보드 사용 보장
  function checkGUOTK() {
    setContents('guotk', null);
  }

  // 8-2. 누르기 동작 지원
  function checkSFTG() {
    setContents('sftg', null);
  }

  // 9. 초점이동
  function checkFS() {
    setContents('fs', null);
  }

  // 10. 조작가능
  function checkO() {
    let errorList = [];
    for (let i = 0; i < tagList.length; i++) {
      let rect = tagList[i].getBoundingClientRect();
      let isViewd = rect.x + rect.width > 0 && rect.y + rect.height > 0 ? true : false;
      if (isViewd) {
        if (tagList[i].tagName == 'A' || tagList[i].tagName == 'BUTTON') {
          let widthMm = tagList[i].offsetWidth * 0.2645;
          let heightMm = tagList[i].offsetHeight * 0.2645;
          let diagonal = Math.sqrt(Math.pow(widthMm, 2) + Math.pow(heightMm, 2));
          if (diagonal < 6) {
            errorList.push([tagList[i].outerHTML, tagList[i]]);
          }
        }
      }
    }
    setContents('o', errorList);
  }

  // 11. 응답시간 조절
  function checkRTA() {
    setContents('rta', null);
  }

  // 12. 정지 기능 제공
  function checkSFP() {
    setContents('sfp', null);
  }

  // 13. 깜빡임과 번쩍임 사용 제한
  function checkLTUOBAF() {
    setContents('ltuobaf', null);
  }

  // 14. 반복 영역 건너뛰기
  function checkSRR() {
    let errorList = [];

    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tagName == 'BODY') {
        let skipEl = tagList[i].querySelector('.contents-skip');
        if (!skipEl) {
          errorList.push(['없음', '없음']);
        }
        break;
      }
    }
    setContents('srr', errorList);
  }

  // 15. 제목 제공
  function checkPT() {
    let errorList = [];

    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tagName == 'IFRAME' || tagList[i].target == '_blank') {
        if (tagList[i].title == null || tagList[i].title == '') {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
    }

    setContents('pt', errorList);
  }

  // 16. 적절한 링크 텍스트
  function checkALT() {
    let errorList = [];

    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tagName == 'A') {
        if (tagList[i].text == null || tagList[i].text.trim() == '') {
          let imgLink = tagList[i].querySelector('img');
          if (imgLink) {
            continue;
          } else {
            errorList.push([tagList[i].outerHTML, tagList[i]]);
          }
        }
      }
    }

    setContents('alt', errorList);
  }

  // 17. 기본 언어 표시
  function checkSAL() {
    let errorList = [];

    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tagName == 'HTML') {
        if (tagList[i].lang == null || tagList[i].lang.trim() == '') {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
    }

    setContents('sal', errorList);
  }

  // 18. 사용자 요구에 따른 실행
  function checkLEATUN() {
    setContents('eatun', null);
  }

  // 19. 콘텐츠의 선형화
  function checkLLOC() {
    setContents('loc', null);
  }

  // 20. 표의 구성
  function checkTS() {
    let errorList = [];

    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tagName == 'TABLE') {
        let caption = tagList[i].querySelector('caption');
        let thead = tagList[i].querySelector('thead');
        let th = thead.querySelector('th');
        if (!caption || !thead || !th) {
          errorList.push(['없음', tagList[i]]);
        } else {
          if (caption.innerHTML == null || caption.innerHTML.trim() == '') {
            errorList.push(['없음', tagList[i]]);
          }
        }
      }
    }

    setContents('ts', errorList);
  }

  // 21. 레이블 제공
  function checkLP() {
    let errorList = [];

    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tagName == 'INPUT' || tagList[i].tagName == 'TEXTAREA' || tagList[i].tagName == 'SELECT') {
        let label = document.querySelector(`label[for='${tagList[i].id}']`);
        if (!label || tagList[i].id.trim() == '') {
          if (tagList[i].title == null || tagList[i].title.trim() == '') {
            errorList.push([tagList[i].outerHTML, tagList[i]]);
          }
        }
      }
    }

    setContents('lp', errorList);
  }

  // 22. 오류 정정
  function checkEC() {
    setContents('ec', null);
  }

  // 23. 마크업 오류 방지
  function checkLAME() {
    let errorList = [];

    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].id != null && tagList[i].id.trim() != '') {
        let selectList = document.querySelectorAll(`.layout-wrap #${tagList[i].id}`);
        if (selectList.length > 1) {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
      if (tagList[i].tagName == 'INPUT' || tagList[i].tagName == 'SELECT' || tagList[i].tagName == 'TEXTAREA') {
        if (tagList[i].id == null || tagList[i].id.trim() == '' || tagList[i].name == null || tagList[i].name.trim() == '') {
          errorList.push([tagList[i].outerHTML, tagList[i]]);
        }
      }
    }

    setContents('ame', errorList);
  }

  // 24. 웹 애플리케이션 접근성 준수
  function checkLWAAC() {
    setContents('waac', null);
  }
});
