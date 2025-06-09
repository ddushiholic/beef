window.addEventListener('load', () => {
  Utils.init();
  // setHeaderEvent();
});

/**
 * 공통함수
 */
const Utils = {
  /**
   * Set default event
   */
  init: () => {
    Utils.setDatepicker();
    Utils.setDropdown();
    // Utils.setDataTable();
    Utils.setTableCheckbox();
    Utils.setTextarea();
    Utils.tabEvent();
  },
  /**
   * 읽기만 가능한 textarea 높이 조절
   */
  setTextarea() {
    let $textarea = $('textarea[readonly="true"]');
    for(let i=0; i<$textarea.length; i++) {
      //$($textarea[i]).css('height', 'auto');
      $($textarea[i]).height( $textarea[i].scrollHeight );
      $($textarea[i]).css("overflow", "hidden");
    }
  },
  /**
   * Set Search Dropdown
   */
  setDropdown() {
    $(document).on('click', '.dropdown .dropdown-item', function () {
      let $parent = $(this).closest('.dropdown');
      let $searchTitle = $parent.find('.dropdown-toggle');
      let $dropInput = $parent.find('input');
      $searchTitle.html($(this).html());
      $dropInput.val($(this).data('value'));
      //$searchTitle.data('value', $(this).data('value'));
    });
    //$(document).on('click', '#searchForm .dropdown .dropdown-item', function () {
    //  let $parent = $(this).closest('.dropdown');
    //  let $searchTitle = $parent.find('#searchTitle');
    //  $searchTitle.text($(this).text());
    //});
  },
  /**
   * Set Datepicker
   */
  setDatepicker() {
    let $datepicker = $('.datepicker');
    $datepicker.datepicker({ dateFormat: 'yy-mm-dd' });
    $datepicker.datepicker().datepicker('setDate', '');

    $("#add_deadline_start").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var startDate = $(this).datepicker('getDate');
        $('#add_deadline').datepicker('option', 'minDate', startDate);
      }
    }).datepicker('setDate', 'today');
    $("#add_deadline").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var endDate = $(this).datepicker('getDate');
        $('#add_deadline_start').datepicker('option', 'maxDate', endDate);
      }
    }).datepicker('setDate', 'today+7');
    $("#edit_deadline_start").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var startDate = $(this).datepicker('getDate');
        $('#edit_deadline').datepicker('option', 'minDate', startDate);
      }
    });
    $("#edit_deadline").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var endDate = $(this).datepicker('getDate');
        $('#edit_deadline_start').datepicker('option', 'maxDate', endDate);
      }
    });


    $("#searchStartDt").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var startDate = $(this).datepicker('getDate');
        $('#searchEndDt').datepicker('option', 'minDate', startDate);
      }
    });
    $("#searchEndDt").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var endDate = $(this).datepicker('getDate');
        $('#searchStartDt').datepicker('option', 'maxDate', endDate);
      }
    });

    $("#add_start_date").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var startDate = $(this).datepicker('getDate');
        $('#add_end_date').datepicker('option', 'minDate', startDate);
      }
    }).datepicker('setDate', 'today');
    $("#add_end_date").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var endDate = $(this).datepicker('getDate');
        $('#add_start_date').datepicker('option', 'maxDate', endDate);
      }
    }).datepicker('setDate', 'today+30');
    $("#edit_start_date").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var startDate = $(this).datepicker('getDate');
        $('#edit_end_date').datepicker('option', 'minDate', startDate);
      }
    });
    $("#edit_end_date").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var endDate = $(this).datepicker('getDate');
        $('#edit_start_date').datepicker('option', 'maxDate', endDate);
      }
    });
    $("#add_student_start_date").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var startDate = $(this).datepicker('getDate');
        $('#add_student_end_date').datepicker('option', 'minDate', startDate);
      }
    });
    $("#add_student_end_date").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var endDate = $(this).datepicker('getDate');
        $('#add_student_start_date').datepicker('option', 'maxDate', endDate);
      }
    });
    $("#edit_student_start_date").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var startDate = $(this).datepicker('getDate');
        $('#edit_student_end_date').datepicker('option', 'minDate', startDate);
      }
    });
    $("#edit_student_end_date").datepicker({
      dateFormat: "yy-mm-dd", // 날짜의 형식
      onSelect: function (date) {
        var endDate = $(this).datepicker('getDate');
        $('#edit_student_start_date').datepicker('option', 'maxDate', endDate);
      }
    });

  },
  /**
   * Set Tooltip
   */
  setTooltip() {
    $('[data-toggle="tooltip"]').tooltip({
      content: function () {
        return $(this).prop('title');
      },
    });
    $('.detail-custom-tab [data-toggle="tab"]').tooltip({
      content: function () {
        return $(this).prop('title');
      },
    });

    $('[data-placement="top"]').tooltip({
      position: {
        my: 'center bottom',
        at: 'center top-8',
      },
    });
    $('[data-placement="right"]').tooltip({
      position: {
        my: 'left center',
        at: 'right+8 center',
      },
    });
    $('[data-placement="bottom"]').tooltip({
      position: {
        my: 'center top',
        at: 'center bottom+8',
      },
    });
    $('[data-placement="left"]').tooltip({
      position: {
        my: 'right center',
        at: 'left-8 center',
      },
    });
  },
  /**
   * Set Table Checkbox
   */
  setTableCheckbox() {
    $(document).on('change', '.ta-table-wrap input.all', (e) => {
      let $tableWrap = $(e.target).parents('.ta-table-wrap');
      let $eachCheckboxList = $tableWrap.find('input.each');
      $eachCheckboxList.prop('checked', $(e.target).prop('checked'));
      $eachCheckboxList.closest('tr').removeClass('active');
      $eachCheckboxList.filter(':checked').closest('tr').addClass('active');
    });
    $(document).on('change', '.ta-table-wrap input.each', (e) => {
      let $tableWrap = $(e.target).parents('.ta-table-wrap');
      let $allCheckbox = $tableWrap.find('input.all');
      let $eachLength = $tableWrap.find('input.each').length;
      let $eachCheckedLength = $tableWrap.find('input.each:checked').length;
      if ($eachLength == $eachCheckedLength) {
        $allCheckbox.prop('checked', true);
      } else {
        $allCheckbox.prop('checked', false);
      }
      if ($(e.target).prop('checked')) {
        $(e.target).closest('tr').addClass('active');
      } else {
        $(e.target).closest('tr').removeClass('active');
      }
    });
  },
  /**
   * Set Validation
   */
  setValidation() {
    let elements = document.querySelectorAll('input, textarea');
    for (let i = 0; i < elements.length; i++) {
      elements[i].oninvalid = function (e) {
        e.target.setCustomValidity(' ');
        if (!e.target.validity.valid) {
          elements[i].classList.add('is-invalid');
          if (e.target.type == 'file') {
            // label.classList.remove('btn-primary');
            // label.classList.add('btn-danger');
          }
        } else {
          if (e.target.type != 'file') {
            elements[i].classList.remove('is-invalid');
          } else {
            // label.classList.add('btn-primary');
            // label.classList.remove('btn-danger');
          }
        }
      };
      elements[i].oninput = function (e) {
        e.target.setCustomValidity(' ');
      };
      if ($(elements[i]).attr('required')) {
        elements[i].focusout = () => {
          // elements[i].classList.remove('is-valid');
          elements[i].classList.remove('is-invalid');
          if (elements[i].value == null || elements[i].value == '') {
            elements[i].classList.add('is-invalid');
          } else {
            // elements[i].classList.add('is-valid');
          }
        };
      }
    }
  },
  /**
   * Set Custom Select
   * if Change Select Call setCustomDropdownSelect(id);
   * @param {String} tagId
   */
  /**
   * Start Loading
   */
  startLoading() {
    let wrapElmnt = document.querySelector('.spinner-wrap');

    if (wrapElmnt) {
      wrapElmnt.dataset.task = Number(wrapElmnt.dataset.task) + 1;
    } else {
      wrapElmnt = document.createElement('div');
      wrapElmnt.classList.add('spinner-wrap');
      wrapElmnt.dataset.task = 1;
      let loadingElmnt = document.createElement('div');
      loadingElmnt.classList.add('spinner-border');
      let span = document.createElement('span');
      span.classList.add('sr-only');
      span.innerHTML = 'Loading...';
      loadingElmnt.appendChild(span);
      wrapElmnt.appendChild(loadingElmnt);

      let body = document.getElementsByTagName('body')[0];
      body.style.overflow = 'hidden';
      body.appendChild(wrapElmnt);
    }
  },
  /**
   * End Loading
   */
  endLoading() {
    let wrapElmnt = document.querySelector('.spinner-wrap');
    let taskCount = wrapElmnt.dataset.task;

    if (taskCount > 1) {
      wrapElmnt.dataset.task = Number(wrapElmnt.dataset.task) - 1;
    } else {
      wrapElmnt.style.opacity = 0;
      setTimeout(function () {
        wrapElmnt.remove();
      }, 300);
      let body = document.getElementsByTagName('body')[0];
      body.style.overflow = 'auto';
    }
  },
  /**
   * Ajax
   * ex) Utils.request('GET', 'test.json', null, (data) => { console.log(data) });
   * @param {String} type
   * @param {String} url
   * @param data
   * @param {Function} func
   */
  request(type, url, data, func) {
    $.ajax({
      type,
      url,
      data,
      success: (data) => {
        func(data);
      },
      error: (xhr, status, error) => {
        console.log(`status: ${status}\nmessage: ${error}`);
      },
    });
  },
  /**
   * Number to KRW format
   * ex) 1000000 -> 1,000,000
   * @param {Number} value
   * @returns {String}
   */
  numberFormatter(value) {
    if (value != '' && value != null && typeof value == 'number') {
      value = String(value)
        .replace(/[^\d]+/g, '')
        .replace(/(^0+)/, '')
        .replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    } else {
      value = 0;
    }
    return value === '' ? 'NaN' : value;
  },
  /**
   * Get input[type=file] detail
   * @param {Element} elmnt
   * @returns {Object}
   */
  getFileDetail(elmnt) {
    //파일 경로.
    let filePath = elmnt.value;
    //전체경로를 \ 나눔.
    let filePathSplit = filePath.split('\\');
    // 파일 전체명
    let originalFileName = filePathSplit[filePathSplit.length - 1];
    //파일확장자 앞 .의 index
    let lastDot = originalFileName.lastIndexOf('.');
    //파일명 : .으로 나눈 앞부분
    let fileName = originalFileName.substring(0, lastDot);
    //파일 확장자 : .으로 나눈 뒷부분
    let fileExt = originalFileName.substring(lastDot + 1, originalFileName.length).toLowerCase();
    //파일 크기
    let fileSize = elmnt.files[0].size;

    let object = {
      originalName: originalFileName,
      name: fileName,
      ext: fileExt,
      size: fileSize,
    };

    return object;
  },
  /**
   * Byte to size
   * return ex) 5 GB
   * @param {Number} byte
   * @returns {String}
   */
  byteFormatter(byte) {
    let sizes = ['Byte', 'KB', 'MB', 'GB', 'TB'];
    if (byte == 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(byte) / Math.log(1024)));
    return Math.round(byte / Math.pow(1024, i), 2) + ' ' + sizes[i];
  },
  /**
   * Set date format
   * @param {String} date
   * @returns {Object}
   */
  dateFormatter(date) {
    if ((date == '' || date == null) && typeof date == 'string') {
      return '';
    }
    const addZero = (num, digits) => {
      var zero = '';
      num = num.toString();

      if (num.length < digits) {
        for (var i = 0; i < digits - num.length; i++) {
          zero += '0';
        }
      }
      return zero + num;
    };
    // Safari Invalid Date 로 인한 replace
    date = date.substring(0, date.lastIndexOf('.')).replace(/-/g, '/').replace('T', ' ');
    let newDate = new Date(date);

    let yyyy = newDate.getFullYear();
    let mm = addZero(newDate.getMonth() + 1, 2);
    let m = newDate.getMonth() + 1;
    let dd = addZero(newDate.getDate(), 2);
    let d = newDate.getDate();

    let object = {
      slash: yyyy + '/' + mm + '/' + dd,
      dot: yyyy + '.' + mm + '.' + dd,
      dash: yyyy + '-' + mm + '-' + dd,
      word: yyyy + '년 ' + m + '월 ' + d + '일',
    };

    return object;
  },

  /**
    * Set DataTable
  */
  setDataTable(table, orderTarget, columns, orderWay) {
    // 정렬 기준 정하기
    let order = false;
    let order_standard = 0;
    if (orderTarget.length > 0) {
      order = true;
      order_standard = orderTarget[0]
    }
    let mytable = $(`table.dataTable-wrap${table}`).DataTable({
      dom: "<'text-right' i>" + "<tr>" + "<'text-center' p>",
      // 기준
      //order: [[order_standard, orderWay != null ? orderWay : 'desc']],
      order: [[0, 'desc']],
      ordering: order,
      columns: columns,
      columnDefs: [
        { orderable: true, targets: orderTarget },
        { orderable: false, targets: '_all' }
      ],
      //columnDefs: [{ defaultContent: '-', targets: '_all' }],
      searching: false,
      //scrollY: 500,
      scrollX: true,
      pageLength: 10,
      language: {
        //lengthMenu:
        //  '<select name="dataTable_length" aria-controls="dataTable" class="form-control">' +
        //  '<option value="10">10개씩 보기</option>' +
        //  '<option value="25">25개씩 보기</option>' +
        //  '<option value="50">50개씩 보기</option>' +
        //  '<option value="100">100개씩 보기</option>' +
        //  '</select>',
        info: '<span>총 사진</span> _TOTAL_<span>장 ' + '• 현재 페이지</span> _PAGE_/_PAGES_',
        loadingRecords: '로드 중 ...',
        processing: '처리 중 ...',
        zeroRecords: '검색 결과가 없습니다.',
        paginate: {
          previous: '<i class="icon arrow-left"></i><span class="sr-only">이전 페이지</span>',
          next: '<i class="icon arrow-right"></i><span class="sr-only">다음 페이지</span>',
        },
      },
      // 맨 앞, 뒤로 이동 버튼 만들기
      "fnDrawCallback": function() {
        $('.dataTables_paginate .pagination').prepend(`
          <li class="paginate_button page-item first"><a href="javascript:void(0)" class="page-link"><i class="icon arrow-first"></i><span class="sr-only">처음 페이지</span></a></li>
        `);
        $('.dataTables_paginate .pagination').append(`
          <li class="paginate_button page-item last"><a href="javascript:void(0)" class="page-link"><i class="icon arrow-last"></i><span class="sr-only">마지막 페이지</span></a></li>
        `);
        $('.dataTables_paginate .pagination .page-item.first').on('click', function() {
          mytable.page( 'first' ).draw( 'page' );
        });
        $('.dataTables_paginate .pagination .page-item.last').on('click', function() {
          mytable.page( 'last' ).draw( 'page' );
        });

      },
    }).on('draw.dt', function () {
      let info = mytable.page.info();
      if(info.page+1 === 1) {
        $('.dataTables_paginate .pagination .page-item.first').addClass('disabled');
        $('.dataTables_paginate .pagination .page-item.first .page-link').attr('disabled', true);
      } else if(info.page+1 === info.pages) {
        $('.dataTables_paginate .pagination .page-item.last').addClass('disabled');
        $('.dataTables_paginate .pagination .page-item.last .page-link').attr('disabled', true);
      }
    });

    $('.dataTables_paginate .pagination .page-item.first').addClass('disabled');
    $('.dataTables_paginate .pagination .page-item.first .page-link').attr('disabled', true);
    // 마지막 버튼 disabled 
    let lastDisabled = $('.dataTables_paginate .pagination .page-item.next').hasClass('disabled');
    if(lastDisabled) {
      $('.dataTables_paginate .pagination .page-item.last').addClass('disabled');
      $('.dataTables_paginate .pagination .page-item.last .page-link').attr('disabled', true);
    }

    $(table).on('click', 'tbody tr', function () {
      let url = $(this).find('.url').attr('data-url');
      window.location.pathname = url;
    });
  },

  /**
   * tab btn click Event
   */
  tabEvent() {
    $(document).on('click', '.tab-btn', function() {
      // 클릭한 요소의 target과 tab을 찾고
      let target = $(this).parents('.tab-button-wrap').attr('data-target');
      let tab = $(this).attr('data-tab');
      //tab 버튼 활성화 변경
      $(this).parents('.tab-button-wrap').find('.tab-btn').removeClass('active');
      $(this).addClass('active');
      //tab content 활성화 변경
      $(`.tab-container[data-target="${target}"] .tab-area`).removeClass('active');
      $(`.tab-container[data-target="${target}"] .tab-area[data-tab="${tab}"]`).addClass('active');
    });
  },
};

function setHeaderEvent() {
  const $btnMobileMenu = $('.navbar-nav.mobile a');
  const $mobileMenu = $('.navbar.mobile');
  const $navItem = $('.layout-header .navbar-nav .nav-item');
  const $navLink = $('.navbar-brand, .layout-header .navbar-nav li > a');

  // #region mobile menu event
  $btnMobileMenu.on('click', () => {
    $('.layout-header').append('<div class="header-backdrop modal-backdrop fade"></div>');
    $mobileMenu.addClass('active');
    $mobileMenu.addClass('visible');
    setTimeout(() => {
      $('.header-backdrop').addClass('show');
    }, 100);
  });
  $(document).on('click', '.header-backdrop, .btn-navbar-close', () => {
    $('.header-backdrop').removeClass('show');
    $mobileMenu.removeClass('active');
    setTimeout(() => {
      $('.header-backdrop').remove();
      $mobileMenu.removeClass('visible');
    }, 300);
  });
  // #endregion mobile menu event
  // #region tab event
  $navItem.on('focusin', function () {
    removeMenuActive();
    $(this).addClass('active');
  });
  $navItem.on('click', function () {
    $navItem.removeClass('active-only');
    $(this).addClass('active-only');
    $(this).removeClass('active');
  });
  $navLink.on('focusin', function () {
    removeMenuActive();
  });
  $(document).on('mousedown', function () {
    removeMenuActive();
  });
  $('.layout-main, .layout-footer').on('focusin', function () {
    removeMenuActive();
  });
  function removeMenuActive() {
    $('.layout-header .navbar-nav .nav-item').removeClass('active');
  }
  // #endregion tab event
}

function makeModal(content) {
  let modal_button = '';
  for(let i=0; i<content.button.length; i++) {
    if (content.button[i].close != null && content.button[i].close) {
      modal_button += `<a href="${content.button[i].link}" class="btn ${content.button[i].style} btn-alone" data-dismiss="modal">${content.button[i].text}</a>`;
    } else {
      modal_button += `<a href="${content.button[i].link}" class="btn ${content.button[i].style} btn-alone">${content.button[i].text}</a>`;
    }
  }

  let icon = content.style == 'alert' ? '<div class="modal-icon"><i class="material-icons">warning</i></div>' : '';
  let body = content.style == 'alert' ? '<h3>' + content.body + '</h3>' : '<div class="modal-body">' + content.body + '</div>';

  let modal = `
  <div class="modal fade" id="${content.id}" tabindex="-1" role="dialog">
    <div class="modal-dialog ${content.style}" role="document">
      <div class="modal-content">
        <!-- modal-body -->
        ${icon}
        ${body}
        <div class="modal-btn">
          ${modal_button}
        </div>
      </div>
    </div>
  </div>`;

  $('.modal-container').append(modal);
}

// file 등록
$(document).on('change', '.file-wrap input[type=file]', function (e) {
  if ($(this).val() != '' && $(this).val() != null) {
    setFileApply(e, this);
  } else {
    let $inputP = $(this).parent().find('.form-control');
    $inputP.html($inputP.data('placeholder'));
  }
});

// 파일 이름 세팅하기
function setFileApply(event, el) {
  let $inputP = $(el).parent().find('.form-control');
  let files = event.target.files;
  let fileInfo = Utils.getFileDetail(el);
  if (files) {
    $inputP.html(fileInfo.name+"."+fileInfo.ext);
  }
}
