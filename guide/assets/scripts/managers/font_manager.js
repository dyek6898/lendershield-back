/**
 * Font Manager Tool
 * 폰트 관리 도구 - 폰트 테이블에 새로운 폰트 정보를 추가하는 기능
 */

class FontManager {
  constructor() {
    this.init();
  }

  /**
   * 초기화 함수
   */
  init() {
    // 현재 페이지가 font.html인 경우에만 이벤트 바인딩
    const isFontPage = window.location.pathname.includes('/components/font.html');
    if (isFontPage) {
      this.bindEvents();
      // 저장된 폰트 데이터 불러오기
      this.loadFontsFromStorage();
    }
  }

  /**
   * 이벤트 바인딩 함수
   */
  bindEvents() {
    // 폰트 탭 버튼 클릭 이벤트 처리
    const fontTabBtn = document.querySelector('.tab-label[data-tab-value="tab2"]');
    if (fontTabBtn) {
      fontTabBtn.addEventListener('click', () => {
        // 폰트 탭이 선택되었을 때 처리할 내용이 있다면 여기에 추가
      });
    }

    // 폰트 추가 버튼 클릭 이벤트 처리
    const addFontBtn = document.getElementById('add-font-btn');
    if (addFontBtn) {
      addFontBtn.addEventListener('click', () => {
        this.addFontToTable();
      });
    }
  }

  /**
   * 폰트 테이블 초기화 함수 [전체 삭제]
   */
  clearFontsFromTable() {
    try {

      // 로컬 스토리지에서 폰트 데이터 가져오기
      const fonts = JSON.parse(localStorage.getItem('fontData') || '[]');

      if (fonts.length === 0) {
        this.showResult('삭제할 폰트가 없습니다.');
        return;
      }

      // 추가된 폰트의 fontSize만 추출
      const fontSizesToRemove = fonts.map(font => font.fontSize);
      console.log(`삭제할 폰트 사이즈: ${fontSizesToRemove.join(', ')}`);

      // API를 통해 선택된 폰트 mixin들만 삭제
      this.removeAllFontMixinsFromScss(fontSizesToRemove);

      // 로컬 스토리지에서 폰트 데이터 삭제
      localStorage.removeItem('fontData');

      // 테이블에서 사용자 추가 행만 제거 (user-added-font 클래스로 식별)
      const table = document.querySelector('.component-table table tbody');
      if (table) {
        const userAddedRows = table.querySelectorAll('tr.user-added-font');
        console.log(`Found ${userAddedRows.length} user-added rows to remove`);
        userAddedRows.forEach(row => {
          row.remove();
        });
      } else {
        console.error('Table not found');
      }

      this.showResult('폰트 테이블이 초기화되었습니다.');
    } catch (error) {
      console.error('폰트 테이블 초기화 중 오류 발생:', error);
      this.showResult('폰트 테이블 초기화 중 오류가 발생했습니다.', true);
    }
  }

  /**
   * 특정 폰트 크기만 삭제하는 함수
   * @param {string|number} fontSize - 삭제할 폰트 크기
   */
  removeFontBySize(fontSize) {
    try {
      const fontSizeStr = String(fontSize);
      console.log(`Removing font with size: ${fontSizeStr}px`);

      // 로컬 스토리지에서 폰트 데이터 가져오기
      let fonts = JSON.parse(localStorage.getItem('fontData') || '[]');

      // 디버깅용 출력
      console.log('현재 저장된 폰트 데이터:', fonts);

      // 해당 폰트 크기를 제외한 데이터만 필터링 (문자열로 비교)
      const originalLength = fonts.length;
      fonts = fonts.filter(font => String(font.fontSize) !== fontSizeStr);

      // 변경된 데이터가 없으면 (해당 폰트가 없으면) 알림
      if (fonts.length === originalLength) {
        console.log(`폰트 사이즈 ${fontSizeStr}px를 찾을 수 없습니다.`);
        this.showResult(`폰트 사이즈 ${fontSizeStr}px를 찾을 수 없습니다.`, true);
        return;
      }

      // 업데이트된 데이터 저장
      localStorage.setItem('fontData', JSON.stringify(fonts));

      // 테이블에서 해당 폰트 크기의 행 제거
      const table = document.querySelector('.component-table table tbody');
      if (table) {
        const userAddedRows = table.querySelectorAll('tr.user-added-font');
        userAddedRows.forEach(row => {
          const rowFontSize = row.querySelector('td:first-child').textContent;
          if (rowFontSize === fontSizeStr) {
            row.remove();
          }
        });
      }

      // API를 통해 scss mixin 삭제
      this.removeFontMixinFromScss(fontSizeStr);

      this.showResult(`폰트 사이즈 ${fontSizeStr}px가 삭제되었습니다.`);
    } catch (error) {
      console.error('폰트 삭제 중 오류 발생:', error);
      this.showResult('폰트 삭제 중 오류가 발생했습니다.', true);
    }
  }

  /**
   * API를 통해 모든 폰트 mixin 삭제
   */
  removeAllFontMixinsFromScss(fontSizes) {
    // 삭제할 폰트가 없으면 리턴
    if (!fontSizes || fontSizes.length === 0) {
      return;
    }

    // API 엔드포인트 URL
    const apiUrl = 'http://localhost:3000/api/remove-all-font-mixins';

    // 요청 데이터 - fontSizes 배열 전달
    const data = {
      fontSizes: fontSizes
    };

    // API 호출
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log(`${result.deletedCount}개의 폰트 mixin이 _mixins.scss 파일에서 삭제되었습니다.`);
        } else {
          console.error('선택된 mixin 삭제 실패:', result.error);
        }
      })
      .catch(error => {
        console.error('API 호출 중 오류 발생:', error);
      });
  }

  /**
   * API를 통해 _mixins.scss 파일에서 폰트 mixin 삭제
   * @param {string} fontSize - 삭제할 폰트 크기
   */
  removeFontMixinFromScss(fontSize) {
    // API 엔드포인트 URL
    const apiUrl = 'http://localhost:3000/api/remove-font-mixin';

    // 요청 데이터
    const data = {
      fontSize
    };

    // API 호출
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log(`f${fontSize} mixin이 _mixins.scss 파일에서 삭제되었습니다.`);
        } else {
          console.error('mixin 삭제 실패:', result.error);
          // 사용자에게 보여주지 않고 콘솔에만 로그
        }
      })
      .catch(error => {
        console.error('API 호출 중 오류 발생:', error);
        // 사용자에게 보여주지 않고 콘솔에만 로그
      });
  }

  /**
   * 폰트 테이블에 추가하는 함수
   */
  addFontToTable() {
    // 입력값 가져오기
    const fontSize = document.getElementById('font-size-input').value;
    const lineHeight = document.getElementById('line-height-input').value;

    // 선택된 폰트 가중치 가져오기
    const selectedWeights = [];
    document.querySelectorAll('input[name="font-weight"]:checked').forEach(checkbox => {
      selectedWeights.push(checkbox.value);
    });

    // 유효성 검사
    if (!fontSize) {
      this.showResult('폰트 사이즈를 입력해주세요.', true);
      return;
    }

    if (!lineHeight) {
      this.showResult('라인 하이트를 입력해주세요.', true);
      return;
    }

    if (selectedWeights.length === 0) {
      this.showResult('하나 이상의 폰트 가중치를 선택해주세요.', true);
      return;
    }

    // 테이블 참조 가져오기
    const table = document.querySelector('.component-table table tbody');
    if (!table) {
      this.showResult('폰트 테이블을 찾을 수 없습니다.', true);
      return;
    }

    // 중복 체크 - 기존 테이블에 동일한 폰트 사이즈가 있는지 확인
    const existingRows = table.querySelectorAll('tr');
    for (let i = 0; i < existingRows.length; i++) {
      const existingFontSize = existingRows[i].querySelector('td:first-child')?.textContent;
      if (existingFontSize === fontSize) {
        this.showResult(`폰트 사이즈 ${fontSize}px는 이미 테이블에 존재합니다.`, true);
        return;
      }
    }

    // 중복 체크 - localStorage에서도 확인
    const fonts = JSON.parse(localStorage.getItem('fontData') || '[]');
    if (fonts.some(font => String(font.fontSize) === String(fontSize))) {
      this.showResult(`폰트 사이즈 ${fontSize}px는 이미 저장되어 있습니다.`, true);
      return;
    }

    // 가중치 텍스트 생성
    let weightText = '';
    if (selectedWeights.includes('regular')) {
      weightText += 'Regular';
    }
    if (selectedWeights.includes('medium')) {
      weightText += weightText ? ', Medium' : 'Medium';
    }
    if (selectedWeights.includes('semibold')) {
      weightText += weightText ? ', Semi Bold' : 'Semi Bold';
    }
    if (selectedWeights.includes('bold')) {
      weightText += weightText ? ', Bold' : 'Bold';
    }

    // 샘플 텍스트 생성
    let sampleHTML = '';
    if (selectedWeights.includes('bold')) {
      sampleHTML += '<p class="fw_b">가나다라마바사아자차카파타하</p>';
    }
    if (selectedWeights.includes('semibold')) {
      sampleHTML += '<p class="fw_sb">가나다라마바사아자차카파타하</p>';
    }
    if (selectedWeights.includes('medium')) {
      sampleHTML += '<p class="fw_m">가나다라마바사아자차카파타하</p>';
    }
    if (selectedWeights.includes('regular')) {
      sampleHTML += '<p class="">가나다라마바사아자차카파타하</p>';
    }

    // 새 행 생성
    const newRow = document.createElement('tr');
    newRow.classList.add('user-added-font'); // 사용자 추가 행 표시

    // 행 내용 추가
    newRow.innerHTML = `
      <td>${fontSize}</td>
      <td>
        <p class="">${weightText}</p>
      </td>
      <td>${lineHeight}</td>
      <td>
        ${sampleHTML}
      </td>
    `;

    // 새 행을 정렬된 위치에 삽입
    let inserted = false;
    const rows = table.querySelectorAll('tr');

    // 폰트 크기에 따라 내림차순으로 정렬
    for (let i = 0; i < rows.length; i++) {
      const currentSize = parseInt(rows[i].querySelector('td:first-child').textContent);
      const newSize = parseInt(fontSize);

      if (newSize > currentSize) {
        table.insertBefore(newRow, rows[i]);
        inserted = true;
        break;
      }
    }

    // 마지막에 추가
    if (!inserted) {
      table.appendChild(newRow);
    }

    // 폰트 데이터 저장
    this.saveFontToStorage({
      fontSize,
      lineHeight,
      weightText,
      sampleHTML,
      selectedWeights
    });

    // API를 통해 _mixins.scss 파일에 mixin 추가
    this.addFontMixinToScss(fontSize, lineHeight);

    // 결과 표시
    this.showResult(`폰트 사이즈 ${fontSize}px가 테이블에 추가되었습니다.`);

    // 입력 필드 초기화
    document.getElementById('font-size-input').value = '';
    document.getElementById('line-height-input').value = '';
    document.querySelectorAll('input[name="font-weight"]:checked').forEach(checkbox => {
      checkbox.checked = false;
    });
  }

  /**
   * API를 통해 _mixins.scss 파일에 폰트 mixin 추가
   */
  addFontMixinToScss(fontSize, lineHeight) {
    // API 엔드포인트 URL
    const apiUrl = 'http://localhost:3000/api/add-font-mixin';

    // 요청 데이터
    const data = {
      fontSize,
      lineHeight
    };

    // API 호출
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log(`f${fontSize} mixin이 _mixins.scss 파일에 추가되었습니다.`);
        } else {
          // 중복 mixin인 경우 무시
          if (result.isDuplicate) {
            console.log(`f${fontSize} mixin이 이미 존재합니다.`);
          } else {
            console.error('mixin 추가 실패:', result.error);
            this.showResult(`mixin 추가 실패: ${result.error}`, true);
          }
        }
      })
      .catch(error => {
        console.error('API 호출 중 오류 발생:', error);
        this.showResult('서버 연결 오류가 발생했습니다. 서버가 실행 중인지 확인하세요.', true);
      });
  }

  /**
   * 결과 표시 함수
   */
  showResult(message, isError = false) {
    const resultArea = document.getElementById('result-area');
    if (resultArea) {
      resultArea.style.display = 'block';
      resultArea.innerHTML = message;
      resultArea.style.color = isError ? '#e1002a' : '#333';

      // 3초 후에 결과 영역이 사라지도록 처리
      setTimeout(() => {
        resultArea.style.display = 'none';
      }, 3000);
    } else {
      // 결과 영역이 없으면 alert로 표시
      alert(message);
    }
  }

  /**
   * 폰트 데이터를 localStorage에 저장
   */
  saveFontToStorage(fontData) {
    try {
      // 기존 데이터 불러오기
      let fonts = JSON.parse(localStorage.getItem('fontData') || '[]');

      // 새 데이터 추가
      fonts.push(fontData);

      // 폰트 크기에 따라 내림차순 정렬
      fonts.sort((a, b) => parseInt(b.fontSize) - parseInt(a.fontSize));

      // 저장
      localStorage.setItem('fontData', JSON.stringify(fonts));
    } catch (error) {
      console.error('폰트 데이터 저장 중 오류 발생:', error);
    }
  }

  /**
   * localStorage에서 폰트 데이터 불러오기
   */
  loadFontsFromStorage() {
    try {
      // 저장된 데이터 불러오기
      const fonts = JSON.parse(localStorage.getItem('fontData') || '[]');

      // 테이블 참조 가져오기
      const table = document.querySelector('.component-table table tbody');
      if (!table || fonts.length === 0) {
        return;
      }

      // 기존 테이블의 기본 행들을 저장
      const defaultRows = [];
      const existingRows = table.querySelectorAll('tr');

      // 기본 테이블 행들을 배열에 저장
      existingRows.forEach(row => {
        defaultRows.push(row);
      });

      // 테이블 내용 지우기
      table.innerHTML = '';

      // 기본 행들 다시 추가
      defaultRows.forEach(row => {
        table.appendChild(row);
      });

      // 폰트 크기에 따라 내림차순 정렬
      fonts.sort((a, b) => parseInt(b.fontSize) - parseInt(a.fontSize));

      // 각 폰트 데이터를 테이블에 추가
      fonts.forEach(font => {
        // 새 행 생성
        const newRow = document.createElement('tr');
        newRow.classList.add('user-added-font'); // 사용자 추가 행 표시

        // 행 내용 추가
        newRow.innerHTML = `
          <td>${font.fontSize}</td>
          <td>
            <p class="">${font.weightText}</p>
          </td>
          <td>${font.lineHeight}</td>
          <td>
            ${font.sampleHTML}
          </td>
        `;

        // 테이블에 정렬된 위치에 삽입
        let inserted = false;
        const rows = table.querySelectorAll('tr');

        for (let i = 0; i < rows.length; i++) {
          const currentSize = parseInt(rows[i].querySelector('td:first-child').textContent);
          const newSize = parseInt(font.fontSize);

          if (newSize > currentSize) {
            table.insertBefore(newRow, rows[i]);
            inserted = true;
            break;
          }
        }

        // 마지막에 추가
        if (!inserted) {
          table.appendChild(newRow);
        }
      });

      console.log(`${fonts.length}개의 폰트 데이터가 로드되었습니다.`);
    } catch (error) {
      console.error('폰트 데이터 불러오기 중 오류 발생:', error);
    }
  }
}

// 페이지 로드 시 폰트 관리자 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 전역 변수로 폰트 관리자 초기화
  window.fontManager = new FontManager();
});

// 전역 함수로 추가
window.addFontToTable = function() {
  if (window.fontManager) {
    window.fontManager.addFontToTable();
  } else {
    alert('폰트 관리자가 초기화되지 않았습니다. 페이지를 새로고침해 주세요.');
  }
};

// 전역 함수로 폰트 테이블 초기화 추가
window.clearFontsFromTable = function(fontSize) {
  if (window.fontManager) {
    // fontSize 매개변수가 있으면 특정 폰트만 삭제
    if (fontSize !== undefined) {
      if (confirm(`폰트 사이즈 ${fontSize}px를 삭제하시겠습니까?`)) {
        window.fontManager.removeFontBySize(fontSize);
      }
    }
    // fontSize 매개변수가 없으면 전체 삭제 (기존 기능)
    else {
      if (confirm('저장된 모든 폰트 데이터를 삭제하시겠습니까?')) {
        window.fontManager.clearFontsFromTable();
      }
    }
  } else {
    alert('폰트 관리자가 초기화되지 않았습니다. 페이지를 새로고침해 주세요.');
  }
};