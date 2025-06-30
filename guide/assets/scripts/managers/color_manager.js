/**
 * Color Manager Tool
 * 컬러 값을 관리하고 자동으로 _variables.scss 및 color.html에 추가하는 도구
 */

// 컬러 타입 정의
const COLOR_TYPES = {
  FONT: 'font',
  BG: 'bg',
  LINE: 'line'
};

// 파일 경로 정의
const FILE_PATHS = {
  VARIABLES: '/src/assets/styles/abstracts/_variables.scss',
  COLOR_HTML: '/src/guide/pages/components/color.html'
};

class ColorManager {
  constructor() {
    this.init();
    this.visible = false; // 관리 도구 표시 상태
    this.container = null; // 컨테이너 참조 저장
  }

  /**
   * 초기화 함수
   */
  init() {
    // 현재 페이지가 color.html 또는 font.html인 경우에 자동으로 UI 생성
    const isColorPage = window.location.pathname.includes('/components/color.html');
    const isFontPage = window.location.pathname.includes('/components/font.html');

    if (isColorPage || isFontPage) {
      this.createUI();
      this.bindEvents();
      this.visible = true;

      // 페이지에 따라 탭 설정
      if (isFontPage) {
        this.showTabContent('tab2'); // 폰트 탭 활성화
      } else {
        this.showTabContent('tab1'); // 컴포넌트 탭 활성화
      }
    }

    // 모든 페이지에 버튼 추가
    this.addColorManagerButton();

    // 전역 참조 설정
    window.colorManager = this;
  }

  /**
   * 관리 도구 버튼 추가
   */
  addColorManagerButton() {
    // 이미 있는 버튼 제거 (중복 방지)
    const existingButtons = document.querySelectorAll('.btn-uid-color-manager');
    existingButtons.forEach(function(btn) {
      btn.remove();
    });

    // 새 버튼 생성
    const colorButton = document.createElement('button');
    colorButton.type = 'button';
    colorButton.className = 'btn-uid-color-manager';
    colorButton.innerHTML = '도구';
    colorButton.style.position = 'fixed';
    colorButton.style.right = '10px';
    colorButton.style.bottom = '105px';
    colorButton.style.width = '50px';
    colorButton.style.height = '50px';
    colorButton.style.backgroundColor = '#4051b8';
    colorButton.style.borderRadius = '50%';
    colorButton.style.display = 'flex';
    colorButton.style.justifyContent = 'center';
    colorButton.style.alignItems = 'center';
    colorButton.style.color = 'white';
    colorButton.style.border = 'none';
    colorButton.style.fontSize = '14px';
    colorButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    colorButton.style.zIndex = '999';
    colorButton.style.cursor = 'pointer';

    // 버튼 클릭 이벤트 추가
    const self = this; // this 참조 저장
    colorButton.onclick = function() {
      self.toggleColorManager();
    };

    // body에 버튼 추가
    document.body.appendChild(colorButton);
  }

  /**
   * 컬러 관리자 토글 함수
   */
  toggleColorManager() {
    const existingUI = document.getElementById('color-manager-ui');

    if (!existingUI || existingUI.style.display === 'none') {
      // UI가 없거나 숨겨져 있으면 표시
      if (!existingUI) {
        this.createUI();
        this.bindEvents();
      } else {
        existingUI.style.display = 'block';
      }
      this.visible = true;
      console.log('컬러 관리자 표시');
    } else {
      // 표시되어 있으면 숨김
      existingUI.style.display = 'none';
      this.visible = false;
      console.log('컬러 관리자 숨김');
    }
  }

  /**
   * UI 생성 함수
   */
  createUI() {
    // 기존 UI가 있으면 제거
    const existingUI = document.getElementById('color-manager-ui');
    if (existingUI) {
      existingUI.remove();
    }

    // UI 컨테이너 생성
    const container = document.createElement('div');
    container.id = 'color-manager-ui';
    this.container = container; // 컨테이너 참조 저장
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 15px;
      width: 300px;
      z-index: 9999;
    `;

    // 드래그 가능한 헤더 추가
    const header = document.createElement('div');
    header.className = 'color-manager-header';
    header.style.cssText = `
      cursor: move;
      padding: 5px 0 15px;
      margin: -15px -15px 10px -15px;
      background-color: #f5f5f5;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      border-bottom: 1px solid #ddd;
      text-align: center;
      position: relative;
    `;

    // 헤더 제목
    const headerTitle = document.createElement('h3');
    headerTitle.textContent = '컴포넌트 관리 도구';
    headerTitle.style.cssText = `
      margin: 0;
      padding: 5px 0;
      font-size: 16px;
      font-weight: bold;
    `;

    header.appendChild(headerTitle);
    container.appendChild(header);

    // 탭 컴포넌트 생성
    const tabContainer = document.createElement('div');
    tabContainer.className = 'component-tab';
    tabContainer.setAttribute('data-active', 'tab1'); // 기본적으로 첫 번째 탭 활성화

    // 탭 헤더 생성
    const tabHead = document.createElement('div');
    tabHead.className = 'tab-head';
    tabHead.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      border-bottom: 1px solid #ddd;
    `;

    // 컬러 탭 버튼
    const colorTabBtn = document.createElement('button');
    colorTabBtn.type = 'button';
    colorTabBtn.className = 'tab-label';
    colorTabBtn.setAttribute('data-tab-value', 'tab1');
    colorTabBtn.textContent = '컬러';
    colorTabBtn.style.cssText = `
      flex: 1;
      padding: 8px 0;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      font-size: 14px;
      text-align: center;
    `;
    colorTabBtn.setAttribute('aria-selected', 'true');

    // 폰트 탭 버튼
    const fontTabBtn = document.createElement('button');
    fontTabBtn.type = 'button';
    fontTabBtn.className = 'tab-label';
    fontTabBtn.setAttribute('data-tab-value', 'tab2');
    fontTabBtn.textContent = '폰트';
    fontTabBtn.style.cssText = `
      flex: 1;
      padding: 8px 0;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      font-size: 14px;
      text-align: center;
    `;

    tabHead.appendChild(colorTabBtn);
    tabHead.appendChild(fontTabBtn);
    tabContainer.appendChild(tabHead);

    // 탭 컨텐츠 영역
    const tabBody = document.createElement('div');
    tabBody.className = 'tab-body';
    tabBody.style.minHeight = '286px';

    // 컬러 탭 컨텐츠
    const colorTabContent = document.createElement('div');
    colorTabContent.className = 'tab-content show';
    colorTabContent.setAttribute('data-tab-value', 'tab1');

    // 컬러 입력 필드
    const colorInputGroup = document.createElement('div');
    colorInputGroup.style.marginBottom = '15px';

    const colorInputLabel = document.createElement('label');
    colorInputLabel.textContent = '컬러 코드 (예: #000000 또는 000000):';
    colorInputLabel.style.display = 'block';
    colorInputLabel.style.marginBottom = '5px';
    colorInputLabel.style.fontSize = '14px';
    colorInputGroup.appendChild(colorInputLabel);

    const colorInput = document.createElement('input');
    colorInput.type = 'text';
    colorInput.id = 'color-input';
    colorInput.placeholder = '#000000 또는 000000';
    colorInput.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      margin-bottom: 5px;
    `;
    colorInputGroup.appendChild(colorInput);

    // 컬러 미리보기
    const colorPreview = document.createElement('div');
    colorPreview.id = 'color-preview';
    colorPreview.style.cssText = `
      width: 100%;
      height: 30px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 10px;
    `;
    colorInputGroup.appendChild(colorPreview);

    colorTabContent.appendChild(colorInputGroup);

    // 타입 선택 라디오 버튼
    const typeGroup = document.createElement('div');
    typeGroup.style.marginBottom = '15px';

    const typeLabel = document.createElement('label');
    typeLabel.textContent = '변수 타입:';
    typeLabel.style.display = 'block';
    typeLabel.style.marginBottom = '5px';
    typeLabel.style.fontSize = '14px';
    typeGroup.appendChild(typeLabel);

    const types = [
      { value: COLOR_TYPES.FONT, label: '폰트 컬러 ($font-)' },
      { value: COLOR_TYPES.BG, label: '배경 컬러 ($bg-)' },
      { value: COLOR_TYPES.LINE, label: '라인 컬러 ($line-)' }
    ];

    types.forEach((type, index) => {
      const typeOption = document.createElement('div');
      typeOption.style.marginBottom = '5px';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'color-type';
      radio.id = `type-${type.value}`;
      radio.value = type.value;
      radio.checked = index === 0; // 첫 번째 옵션이 기본 선택

      const radioLabel = document.createElement('label');
      radioLabel.htmlFor = `type-${type.value}`;
      radioLabel.textContent = type.label;
      radioLabel.style.marginLeft = '5px';
      radioLabel.style.fontSize = '14px';

      typeOption.appendChild(radio);
      typeOption.appendChild(radioLabel);
      typeGroup.appendChild(typeOption);
    });

    colorTabContent.appendChild(typeGroup);

    // HTML 업데이트 체크박스
    const htmlUpdateGroup = document.createElement('div');
    htmlUpdateGroup.style.marginBottom = '15px';

    const htmlUpdateCheckbox = document.createElement('input');
    htmlUpdateCheckbox.type = 'checkbox';
    htmlUpdateCheckbox.id = 'html-update';
    htmlUpdateCheckbox.checked = false; // 기본값을 체크 해제 상태로 변경

    const htmlUpdateLabel = document.createElement('label');
    htmlUpdateLabel.htmlFor = 'html-update';
    htmlUpdateLabel.textContent = 'color 가이드 추가';
    htmlUpdateLabel.style.marginLeft = '5px';
    htmlUpdateLabel.style.fontSize = '14px';

    htmlUpdateGroup.appendChild(htmlUpdateCheckbox);
    htmlUpdateGroup.appendChild(htmlUpdateLabel);
    colorTabContent.appendChild(htmlUpdateGroup);

    // 컬러 탭 버튼 그룹
    const colorButtonGroup = document.createElement('div');
    colorButtonGroup.style.display = 'flex';
    colorButtonGroup.style.justifyContent = 'space-between';

    const generateButton = document.createElement('button');
    generateButton.id = 'generate-code-btn';
    generateButton.textContent = '컬러 추가하기';
    generateButton.style.cssText = `
      padding: 8px 15px;
      background-color: #4051b8;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      flex: 1;
      margin-right: 5px;
    `;
    colorButtonGroup.appendChild(generateButton);

    colorTabContent.appendChild(colorButtonGroup);

    // 폰트 탭 컨텐츠
    const fontTabContent = document.createElement('div');
    fontTabContent.className = 'tab-content';
    fontTabContent.setAttribute('data-tab-value', 'tab2');

    // 폰트 사이즈 입력 필드
    const fontSizeGroup = document.createElement('div');
    fontSizeGroup.style.marginBottom = '15px';

    const fontSizeLabel = document.createElement('label');
    fontSizeLabel.textContent = 'Font-Size(px):';
    fontSizeLabel.style.display = 'block';
    fontSizeLabel.style.marginBottom = '5px';
    fontSizeLabel.style.fontSize = '14px';
    fontSizeGroup.appendChild(fontSizeLabel);

    const fontSizeInput = document.createElement('input');
    fontSizeInput.type = 'number';
    fontSizeInput.id = 'font-size-input';
    fontSizeInput.placeholder = '예: 16';
    fontSizeInput.min = '8';
    fontSizeInput.max = '100';
    fontSizeInput.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      margin-bottom: 5px;
    `;
    fontSizeGroup.appendChild(fontSizeInput);
    fontTabContent.appendChild(fontSizeGroup);

    // 라인 하이트 입력 필드
    const lineHeightGroup = document.createElement('div');
    lineHeightGroup.style.marginBottom = '15px';

    const lineHeightLabel = document.createElement('label');
    lineHeightLabel.textContent = 'Line-Height:';
    lineHeightLabel.style.display = 'block';
    lineHeightLabel.style.marginBottom = '5px';
    lineHeightLabel.style.fontSize = '14px';
    lineHeightGroup.appendChild(lineHeightLabel);

    const lineHeightInput = document.createElement('input');
    lineHeightInput.type = 'text';
    lineHeightInput.id = 'line-height-input';
    lineHeightInput.placeholder = '예: 1.5 또는 150%';
    lineHeightInput.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      margin-bottom: 5px;
    `;
    lineHeightGroup.appendChild(lineHeightInput);
    fontTabContent.appendChild(lineHeightGroup);

    // 폰트 가중치 체크박스
    const fontWeightGroup = document.createElement('div');
    fontWeightGroup.style.marginBottom = '15px';

    const fontWeightLabel = document.createElement('label');
    fontWeightLabel.textContent = 'Font-Weight';
    fontWeightLabel.style.display = 'block';
    fontWeightLabel.style.marginBottom = '5px';
    fontWeightLabel.style.fontSize = '14px';
    fontWeightGroup.appendChild(fontWeightLabel);

    const fontWeights = [
      { value: 'regular', label: 'Regular (400)' },
      { value: 'medium', label: 'Medium (500)' },
      { value: 'semibold', label: 'Semi Bold (600)' },
      { value: 'bold', label: 'Bold (700)' }
    ];

    fontWeights.forEach((weight) => {
      const weightOption = document.createElement('div');
      weightOption.style.marginBottom = '5px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'font-weight';
      checkbox.id = `weight-${weight.value}`;
      checkbox.value = weight.value;

      const checkboxLabel = document.createElement('label');
      checkboxLabel.htmlFor = `weight-${weight.value}`;
      checkboxLabel.textContent = weight.label;
      checkboxLabel.style.marginLeft = '5px';
      checkboxLabel.style.fontSize = '14px';

      weightOption.appendChild(checkbox);
      weightOption.appendChild(checkboxLabel);
      fontWeightGroup.appendChild(weightOption);
    });

    fontTabContent.appendChild(fontWeightGroup);

    // 폰트 추가 버튼
    const fontButtonGroup = document.createElement('div');
    fontButtonGroup.style.display = 'flex';
    fontButtonGroup.style.justifyContent = 'space-between';

    const addFontButton = document.createElement('button');
    addFontButton.id = 'add-font-btn';
    addFontButton.textContent = '폰트 추가하기';
    addFontButton.style.cssText = `
      padding: 8px 15px;
      background-color: #4051b8;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      flex: 1;
      margin-right: 5px;
    `;
    fontButtonGroup.appendChild(addFontButton);

    fontTabContent.appendChild(fontButtonGroup);

    // 탭 컨텐츠를 탭 바디에 추가
    tabBody.appendChild(colorTabContent);
    tabBody.appendChild(fontTabContent);
    tabContainer.appendChild(tabBody);

    // 컨테이너에 탭 추가
    container.appendChild(tabContainer);

    // 닫기 버튼 그룹
    const buttonGroup = document.createElement('div');
    buttonGroup.style.position = 'absolute';
    buttonGroup.style.top = '0';
    buttonGroup.style.right = '0';

    const closeButton = document.createElement('button');
    closeButton.id = 'close-ui-btn';
    closeButton.textContent = 'X';
    closeButton.style.cssText = `
      padding: 8px 15px;
      color: #333;
      font-size: 18px;
      cursor: pointer;
    `;
    buttonGroup.appendChild(closeButton);

    container.appendChild(buttonGroup);

    // 결과 표시 영역
    const resultArea = document.createElement('div');
    resultArea.id = 'result-area';
    resultArea.style.cssText = `
      margin-top: 15px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 4px;
      background-color: #f9f9f9;
      font-size: 13px;
      display: none;
    `;
    container.appendChild(resultArea);

    // 문서에 추가
    document.body.appendChild(container);
  }

  /**
   * 이벤트 바인딩 함수
   */
  bindEvents() {
    // 컬러 입력 이벤트
    const colorInput = document.getElementById('color-input');
    const colorPreview = document.getElementById('color-preview');

    colorInput.addEventListener('input', () => {
      let color = colorInput.value.trim();
      if (color && !color.startsWith('#') && color.length === 6) {
        color = '#' + color;
      }
      colorPreview.style.backgroundColor = color;
    });

    // 코드 생성 버튼 클릭 이벤트
    const generateButton = document.getElementById('generate-code-btn');
    generateButton.addEventListener('click', () => {
      this.generateCode();
    });

    // 폰트 추가 버튼 클릭 이벤트
    const addFontButton = document.getElementById('add-font-btn');
    if (addFontButton) {
      addFontButton.addEventListener('click', () => {
        this.addFontToTable();
      });
    }

    // 닫기 버튼 클릭 이벤트
    const closeButton = document.getElementById('close-ui-btn');
    closeButton.addEventListener('click', () => {
      document.getElementById('color-manager-ui').remove();
    });

    // 탭 전환 이벤트
    const tabLabels = document.querySelectorAll('.tab-label');
    tabLabels.forEach(label => {
      label.addEventListener('click', () => {
        const tabValue = label.getAttribute('data-tab-value');
        this.showTabContent(tabValue);
      });
    });

    // 현재 페이지에 따라 초기 탭 설정
    const isFontPage = window.location.pathname.includes('/components/font.html');
    if (isFontPage) {
      this.showTabContent('tab2'); // 폰트 탭 활성화
    } else {
      this.showTabContent('tab1'); // 컴포넌트 탭 활성화
    }

    // 드래그 기능 추가
    this.makeDraggable(document.getElementById('color-manager-ui'));
  }

  /**
   * 탭 컨텐츠 표시 함수
   */
  showTabContent(tabValue) {
    // 탭 버튼이 아직 생성되지 않은 경우 실행하지 않음
    const tabLabels = document.querySelectorAll('.tab-label');
    if (tabLabels.length === 0) {
      return;
    }

    // 모든 탭 라벨의 선택 상태 제거
    tabLabels.forEach(tab => {
      tab.setAttribute('aria-selected', 'false');
      tab.style.borderBottom = '2px solid transparent';
      tab.style.color = '#333';
    });

    // 해당 탭 라벨 활성화
    const activeTab = document.querySelector(`.tab-label[data-tab-value="${tabValue}"]`);
    if (activeTab) {
      activeTab.setAttribute('aria-selected', 'true');
      activeTab.style.borderBottom = '2px solid #4051b8';
      activeTab.style.color = '#4051b8';
    }

    // 모든 탭 컨텐츠 숨기기
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      content.classList.remove('show');
    });

    // 선택한 탭 컨텐츠 표시
    const selectedContent = document.querySelector(`.tab-content[data-tab-value="${tabValue}"]`);
    if (selectedContent) {
      selectedContent.classList.add('show');
    }
  }

  /**
   * 드래그 가능하게 만드는 함수
   */
  makeDraggable(element) {
    if (!element) return;

    const header = element.querySelector('.color-manager-header');
    if (!header) return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // 드래그 시작 시 클래스 추가
      element.classList.add('dragging');
      // 마우스 위치 가져오기
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // 마우스 이동 시 호출될 함수
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // 새 위치 계산
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // 요소의 새 위치 설정
      const top = (element.offsetTop - pos2);
      const left = (element.offsetLeft - pos1);

      // 화면 경계 확인
      const maxX = window.innerWidth - element.offsetWidth;
      const maxY = window.innerHeight - element.offsetHeight;

      element.style.top = Math.min(Math.max(0, top), maxY) + 'px';
      element.style.left = Math.min(Math.max(0, left), maxX) + 'px';

      // 위치가 변경되면 right, bottom 속성 제거
      element.style.right = 'auto';
      element.style.bottom = 'auto';
    }

    function closeDragElement() {
      // 드래그 종료 시 클래스 제거
      element.classList.remove('dragging');
      // 마우스 이벤트 중지
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  /**
   * 코드 생성 함수
   */
  async generateCode() {
    const colorInput = document.getElementById('color-input');
    let colorValue = colorInput.value.trim();

    // 컬러 값 검증
    if (!colorValue) {
      this.showResult('컬러 코드를 입력해주세요.', true);
      return;
    }

    // # 제거하고 소문자로 변환
    if (colorValue.startsWith('#')) {
      colorValue = colorValue.substring(1);
    }
    colorValue = colorValue.toLowerCase();

    // 6자리 16진수 검증
    if (!/^[0-9a-f]{6}$/.test(colorValue)) {
      this.showResult('유효한 6자리 16진수 컬러 코드를 입력해주세요.', true);
      return;
    }

    // 선택된 타입 가져오기
    const selectedType = document.querySelector('input[name="color-type"]:checked').value;

    // 변수 이름 생성
    const variableName = `$${selectedType}-${colorValue}`;

    // SCSS 변수 코드 생성
    const scssCode = `${variableName}: #${colorValue};`;

    // HTML 코드 생성
    let htmlCode = '';
    switch (selectedType) {
      case COLOR_TYPES.BG:
        htmlCode = this.generateBgColorHTML(colorValue);
        break;
      case COLOR_TYPES.FONT:
        htmlCode = this.generateFontColorHTML(colorValue);
        break;
      case COLOR_TYPES.LINE:
        htmlCode = this.generateLineColorHTML(colorValue);
        break;
    }

    // HTML 업데이트 여부 확인
    const updateHtml = document.getElementById('html-update').checked;

    // 서버에 요청 보내기 (HTML 업데이트 여부와 상관없이)
    const result = await this.sendUpdateRequest(selectedType, colorValue, updateHtml);

    // 결과 처리
    if (result.success) {
      // 결과 메시지 생성
      let resultMessage = `
        <p>✅ 파일이 성공적으로 업데이트되었습니다!</p>
        <ul>
          <li><strong>_variables.scss</strong>: ${selectedType}-${colorValue} 변수가 추가되었습니다.</li>
      `;

      if (updateHtml) {
        resultMessage += `
          <li><strong>color.html</strong>: 컬러 항목이 추가되었습니다.</li>
          <li><strong>_component_guide.scss</strong>: 컬러 스타일이 추가되었습니다.</li>
        `;
        resultMessage += `
        </ul>
        <p>잠시 후 자동으로 페이지가 새로고침됩니다...</p>
      `;
      } else {
        resultMessage += `
        </ul>
        <p>페이지를 새로고침하면 변경 사항을 확인할 수 있습니다.</p>
        <button id="refresh-page" style="padding: 5px 10px; background-color: #4051b8; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">페이지 새로고침</button>
      `;
      }

      this.showResult(resultMessage);

      // HTML 업데이트가 선택되지 않은 경우에만 새로고침 버튼 이벤트 추가
      if (!updateHtml) {
        document.getElementById('refresh-page').addEventListener('click', () => {
          window.location.reload();
        });
      }
    } else {
      // 오류 처리
      if (result.isDuplicate) {
        this.showResult(result.error, true);
      } else {
        this.showResult(`오류: ${result.error || result.message}`, true);
      }
    }
  }

  /**
   * 파일 업데이트 함수
   */
  async updateFiles(type, colorValue, scssCode, htmlCode) {
    this.showResult(`<p>파일 업데이트 중...</p>`);

    // HTML 업데이트 여부 확인
    const updateHtml = document.getElementById('html-update').checked;

    // 서버에 업데이트 요청 보내기 (sendUpdateRequest 함수 사용)
    const result = await this.sendUpdateRequest(type, colorValue, updateHtml);

    if (result.success) {
      let resultMessage = `
        <p>✅ 파일이 성공적으로 업데이트되었습니다!</p>
        <ul>
          <li><strong>_variables.scss</strong>: ${type}-${colorValue} 변수가 추가되었습니다.</li>
      `;

      if (updateHtml) {
        resultMessage += `
          <li><strong>color.html</strong>: 컬러 항목이 추가되었습니다.</li>
          <li><strong>_component_guide.scss</strong>: 컬러 스타일이 추가되었습니다.</li>
        `;
        resultMessage += `
        </ul>
        <p>잠시 후 자동으로 페이지가 새로고침됩니다...</p>
      `;
      } else {
        resultMessage += `
        </ul>
        <p>페이지를 새로고침하면 변경 사항을 확인할 수 있습니다.</p>
        <button id="refresh-page" style="padding: 5px 10px; background-color: #4051b8; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">페이지 새로고침</button>
      `;
      }

      this.showResult(resultMessage);

      // HTML 업데이트가 선택되지 않은 경우에만 새로고침 버튼 이벤트 추가
      if (!updateHtml) {
        document.getElementById('refresh-page').addEventListener('click', () => {
          window.location.reload();
        });
      }
    } else {
      // 오류 처리
      if (result.isDuplicate) {
        this.showResult(result.error, true);
      } else {
        this.showResult(`오류: ${result.error || result.message}`, true);
      }
    }
  }

  /**
   * 서버에 업데이트 요청 보내기
   */
  async sendUpdateRequest(type, colorValue, updateHtml) {
    // 서버 API 호출
    const response = await fetch('http://localhost:3000/api/add-color', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: type,
        color: colorValue,
        updateHtml: updateHtml
      })
    });

    const result = await response.json();

    // 오류가 있는 경우 콘솔에 로그만 남기고 결과 그대로 반환
    if (!result.success) {
      console.error('컬러 변수 추가 오류:', result.error || result.message);
    } else if (result.success && updateHtml) {
      // 성공적으로 추가되고 HTML 업데이트가 선택된 경우 자동 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1초 후 새로고침 (결과 메시지를 잠시 볼 수 있도록)
    }

    // 결과 그대로 반환 (성공/실패 여부와 관계없이)
    return result;
  }

  /**
   * 배경 컬러 HTML 코드 생성
   */
  generateBgColorHTML(colorValue) {
    return `<li>
  <div class="component_color bg-${colorValue}">
    <div class="hide-txt">bg-${colorValue}</div>
  </div>
  <div class="component_prototype_tit">$bg-${colorValue}</div>
  <p>#${colorValue}</p>
</li>`;
  }

  /**
   * 폰트 컬러 HTML 코드 생성
   */
  generateFontColorHTML(colorValue) {
    return `<li>
  <div class="component_color font-${colorValue}">
    <div class="hide-txt">font-${colorValue}</div>
  </div>
  <div class="component_prototype_tit">$font-${colorValue}</div>
  <p>#${colorValue}</p>
</li>`;
  }

  /**
   * 라인 컬러 HTML 코드 생성
   */
  generateLineColorHTML(colorValue) {
    return `<li>
  <div class="component_color line-${colorValue}">
    <div class="hide-txt">line-${colorValue}</div>
  </div>
  <div class="component_prototype_tit">$line-${colorValue}</div>
  <p>#${colorValue}</p>
</li>`;
  }

  /**
   * 결과 표시 함수
   */
  showResult(message, isError = false) {
    const resultArea = document.getElementById('result-area');
    resultArea.style.display = 'block';
    resultArea.innerHTML = message;

    if (isError) {
      resultArea.style.color = '#e1002a';

      // 에러 메시지는 3초 후에 자동으로 사라지게 함
      setTimeout(() => {
        resultArea.style.display = 'none';
      }, 3000);
    } else {
      resultArea.style.color = '#333';

      // HTML 업데이트 체크박스를 선택하지 않았을 때도 3초 후에 결과 영역이 사라지도록 처리
      const updateHtml = document.getElementById('html-update').checked;
      if (!updateHtml) {
        setTimeout(() => {
          resultArea.style.display = 'none';
        }, 3000);
      }
    }
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

    // font.html 페이지에서만 작동
    const isTypographyPage = window.location.pathname.includes('/components/font.html');
    if (!isTypographyPage) {
      this.showResult('폰트 페이지에서만 폰트를 추가할 수 있습니다.', true);
      return;
    }

    // 테이블 참조 가져오기
    const table = document.querySelector('.component-table table tbody');
    if (!table) {
      this.showResult('폰트 테이블을 찾을 수 없습니다.', true);
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
   * 폰트 테이블 초기화 함수
   */
  clearFontsFromTable() {
    try {
      console.log('Clearing fonts from table');
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
   * 클립보드에 복사 함수
   */
  copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      this.showResult(`코드가 생성되었으며 클립보드에 복사되었습니다.<br><br>${text.replace(/\n/g, '<br>')}<br><br>
      <strong>Node.js 스크립트 실행 명령어:</strong><br>
      <pre>node src/guide/assets/scripts/color_variables_generator.js ${document.querySelector('input[name="color-type"]:checked').value} ${document.getElementById('color-input').value.replace('#', '')}</pre>
      <p>위 명령어를 터미널에서 실행하면 자동으로 파일에 코드가 추가됩니다.</p>`);
    } catch (err) {
      this.showResult('클립보드 복사에 실패했습니다. 수동으로 복사해주세요.', true);
    }

    document.body.removeChild(textarea);
  }

  /**
   * 메시지 표시 함수
   */
  showMessage(message, type = 'info') {
    if (!this.messageElement) {
      this.messageElement = document.createElement('div');
      this.messageElement.className = 'color-manager-message';
      this.container.appendChild(this.messageElement);
    }

    // 메시지 타입에 따른 클래스 설정
    this.messageElement.className = `color-manager-message ${type}`;
    this.messageElement.textContent = message;
    this.messageElement.style.display = 'block';

    // 3초 후 메시지 숨기기
    clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => {
      this.messageElement.style.display = 'none';
    }, 3000);
  }
}

// 페이지가 로드되면 ColorManager 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
  window.colorManager = new ColorManager();
});

// 이미 페이지가 로드된 상태라면 즉시 실행
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  window.colorManager = new ColorManager();
}
