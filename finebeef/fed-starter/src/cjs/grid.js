window.addEventListener('load', () => {
  // Dev Only For Grid Check
  let gridElmnt = document.createElement('div');
  gridElmnt.id = 'grid-check';
  let body = document.getElementsByTagName('body')[0];
  body.appendChild(gridElmnt);
  gridElmnt.innerHTML = `<div class="container grid-check-wrap">
    <ul class="grid-check-row xl"></ul>
    <ul class="grid-check-row md"></ul>
    <ul class="grid-check-row sm"></ul>
    <ul class="grid-check-row xs"></ul>
  </div>`;
  let gridCheck = document.getElementById('grid-check');
  let grid = gridCheck.getElementsByTagName('ul');

  // 그리드 수에 맞춰서 append
  for (let i = 0; i < grid.length; i++) {
    let gridNum = window.getComputedStyle(grid[i], '::before').content.replaceAll('"', '');

    for (let j = 0; j < gridNum; j++) {
      let col = document.createElement('li');
      col.classList.add('col');
      grid[i].appendChild(col);
    }
  }
  // 키보드 ` 클릭시 grid show and hide
  document.addEventListener('keydown', function (e) {
    if (e.code.toLocaleLowerCase() == 'backquote') {
      goGridCheck();
    }
  });
  function goGridCheck() {
    let isActive = gridCheck.classList.contains('active');

    if (isActive) {
      gridCheck.classList.remove('active');
    } else {
      gridCheck.classList.add('active');
    }
  }
});
