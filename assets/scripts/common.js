etUI.utils.ready(function () {
  console.log('document ready');
  etUI.initUI();

  // [공통] 클릭 이벤트
  etUI.pages.clickEvent = function () {
    const alarm = document.querySelector('.btn-alarm');
    const userSelect = document.querySelector('.btn-select');

    alarm.addEventListener('click', function (e) {
      const target = e.target.closest('.btn-area').querySelector('.alarm-info');
      this.classList.toggle('on');

      if(this.classList.contains('on')){
        target.style.display = "block";
      } else target.style.display = "none";
    });

    userSelect.addEventListener('click', function (e) {
      const target = e.target.closest('.info-area').querySelector('.select-list');
      this.classList.toggle('on');

      if(this.classList.contains('on')){
        target.style.display = "block";
      } else target.style.display = "none";
    });
  };

  // [공통] 클릭 이벤트
  etUI.pages.showMoreBtn = function () {
    const sectionContents = document.querySelectorAll('.section-content');

    sectionContents.forEach((content) => {
      const tableWraps = content.querySelectorAll('.component-table');
      const listWrap = content.querySelector('.new-list');

      // component-table 여러개 케이스
      if (tableWraps.length > 1) {
        tableWraps.forEach((tableWrap) => {
          const table = tableWrap.querySelector('table');
          const tbody = table ? table.querySelector('tbody') : null;
          const rows = tbody ? tbody.querySelectorAll('tr') : [];

          const column = tableWrap.closest('.section-column');
          const btnArea = column ? column.querySelector('.btn-area') : null;

          if (btnArea) {
            btnArea.style.display = rows.length < 5 ? 'none' : 'flex';
          }
        });
      }

      // 단일 케이스
      else if (tableWraps.length === 1) {
        const table = tableWraps[0].querySelector('table');
        const tbody = table ? table.querySelector('tbody') : null;
        const rows = tbody ? tbody.querySelectorAll('tr') : [];

        const btnArea = content.querySelector('.btn-area');
        if (btnArea) {
          btnArea.style.display = rows.length < 5 ? 'none' : 'flex';
        }
      }

      // 최신 뉴스(list) 케이스
      else if (listWrap) {
        const items = listWrap.querySelectorAll('li');
        const column = listWrap.closest('.section-column');
        const btnArea = column
          ? column.querySelector('.btn-area')
          : content.querySelector('.btn-area');

        if (btnArea) {
          btnArea.style.display = items.length < 5 ? 'none' : 'flex';
        }
      }
    });
  };

  document.fonts.ready.then(() => {
    etUI.pages.clickEvent();
    etUI.pages.showMoreBtn();
  });
});
