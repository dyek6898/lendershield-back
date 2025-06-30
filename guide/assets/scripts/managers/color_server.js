/**
 * 컬러 서버
 * 컬러 변수 생성 및 파일 업데이트를 위한 Express 서버
 *
 * 사용법:
 * 1. 터미널에서 프로젝트 루트 디렉토리로 이동
 * 2. node src/guide/assets/scripts/managers/color_server.js 실행
 * 3. 브라우저에서 관리 도구 사용
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 컬러 타입 정의
const COLOR_TYPES = {
  FONT: 'font',
  BG: 'bg',
  LINE: 'line'
};

// 파일 경로 설정
const PROJECT_ROOT = path.resolve(__dirname, '../../../../..');
const VARIABLES_PATH = path.resolve(PROJECT_ROOT, 'src/assets/styles/abstracts/_variables.scss');
const COLOR_HTML_PATH = path.resolve(PROJECT_ROOT, 'src/guide/pages/components/color.html');
const COMPONENT_GUIDE_PATH = path.resolve(PROJECT_ROOT, 'src/assets/styles/pages/_component_guide.scss');
const MIXINS_PATH = path.resolve(PROJECT_ROOT, 'src/assets/styles/abstracts/_mixins.scss');

// console.log('PROJECT_ROOT:', PROJECT_ROOT);
// console.log('VARIABLES_PATH:', VARIABLES_PATH);
// console.log('COLOR_HTML_PATH:', COLOR_HTML_PATH);
// console.log('COMPONENT_GUIDE_PATH:', COMPONENT_GUIDE_PATH);
// console.log('MIXINS_PATH:', MIXINS_PATH);

/**
 * 컬러 변수 추가 API
 */
app.post('/api/add-color', async (req, res) => {
  try {
    const { type, color, updateHtml } = req.body;

    if (!type || !color) {
      return res.status(400).json({ success: false, message: '타입과 컬러 값이 필요합니다.' });
    }

    // 타입 검증
    if (![COLOR_TYPES.FONT, COLOR_TYPES.BG, COLOR_TYPES.LINE].includes(type)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 타입입니다. font, bg, 또는 line 중 하나를 사용하세요.'
      });
    }

    // 컬러 값 검증
    let colorValue = color;
    if (colorValue.startsWith('#')) {
      colorValue = colorValue.substring(1);
    }

    if (!/^[0-9a-f]{6}$/.test(colorValue)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 컬러 코드입니다. 6자리 16진수 형식이어야 합니다 (예: 000000).'
      });
    }

    // 중복 변수 체크 - HTML 업데이트 여부와 상관없이 항상 SCSS와 HTML 모두 체크
    const isDuplicate = await checkDuplicateVariable(type, colorValue, true);

    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        error: `$${type}-${colorValue} 변수가 이미 존재합니다.`,
        isDuplicate: true
      });
    }

    // SCSS 파일 업데이트
    await updateScssFile(type, colorValue);

    // component_guide.scss 파일에 스타일 추가 (항상)
    await addColorStyleToComponentGuide(type, colorValue);

    // HTML 파일 업데이트 (옵션에 따라)
    if (updateHtml) {
      // HTML 파일 업데이트
      await updateHtmlFile(type, colorValue);
    }

    res.json({
      success: true,
      message: '컬러 변수가 성공적으로 추가되었습니다.',
      updatedHtml: updateHtml
    });
  } catch (error) {
    console.error('컬러 변수 추가 오류:', error);
    res.status(500).json({ success: false, message: `오류 발생: ${error.message}` });
  }
});

/**
 * SCSS 파일 업데이트
 */
async function updateScssFile(type, color) {
  try {
    let scssContent = await fs.readFile(VARIABLES_PATH, 'utf8');
    const variableName = `$${type}-${color}`;
    const scssLine = `${variableName}: #${color};`;

    // 이미 변수가 존재하는지 확인
    if (scssContent.includes(scssLine)) {
      console.log(`변수 ${variableName}이(가) 이미 존재합니다.`);
      return;
    }

    // 타입별 마지막 변수 찾기
    const regex = new RegExp(`\\$${type}-[0-9a-f]{6}: #[0-9a-f]{6};`, 'g');
    const matches = [...scssContent.matchAll(regex)];

    if (matches.length > 0) {
      // 마지막 변수 위치 찾기
      const lastMatch = matches[matches.length - 1][0];
      const lastMatchIndex = scssContent.lastIndexOf(lastMatch);

      // 마지막 변수 다음에 새 변수 추가
      const updatedContent =
        scssContent.substring(0, lastMatchIndex + lastMatch.length) +
        '\n' + scssLine +
        scssContent.substring(lastMatchIndex + lastMatch.length);

      await fs.writeFile(VARIABLES_PATH, updatedContent, 'utf8');
      console.log(`변수 ${variableName}이(가) _variables.scss에 추가되었습니다.`);
    } else {
      console.error(`${type} 타입의 변수를 찾을 수 없습니다.`);
      throw new Error(`${type} 타입의 변수를 찾을 수 없습니다.`);
    }
  } catch (error) {
    console.error('SCSS 파일 업데이트 중 오류가 발생했습니다:', error);
    throw error;
  }
}

/**
 * component_guide.scss 파일에 컬러 스타일 추가
 */
async function addColorStyleToComponentGuide(type, color) {
  try {
    // 파일 경로 사용
    const componentGuidePath = COMPONENT_GUIDE_PATH;

    // 파일 읽기
    let content = await fs.readFile(componentGuidePath, 'utf8');

    // 클래스 이름 생성
    const className = `${type}-${color}`;

    // 모든 기존 색상 클래스 수집
    const colorClassRegex = /&\.([a-z]+-[0-9a-f]{6})\s*\{\s*background-color:\s*(#[0-9a-f]{6});\s*\}/g;
    const colorClasses = [];
    let match;

    // 모든 색상 클래스 추출
    while ((match = colorClassRegex.exec(content)) !== null) {
      colorClasses.push({
        className: match[1],
        color: match[2]
      });
    }

    // 새 클래스 추가 (중복 체크)
    const isDuplicate = colorClasses.some(item => item.className === `${type}-${color}`);
    if (!isDuplicate) {
      colorClasses.push({
        className: `${type}-${color}`,
        color: `#${color}`
      });
    } else {
      console.log(`스타일 &.${className}는 이미 존재합니다.`);
      return;
    }

    // 기존 스타일 블록 전체 제거
    const selectorRegex = /\.component_ul\s*\.component_color\s*\{[\s\S]*?\n\}/g;
    content = content.replace(selectorRegex, '');

    // 새 스타일 블록 생성
    let newStyleBlock = `.component_ul .component_color {
  width: 100px;
  height: 100px;
  border: 1px solid #0000001a;
`;

    // 모든 색상 클래스 추가
    colorClasses.forEach(item => {
      newStyleBlock += `
  &.${item.className} {
    background-color: ${item.color};
  }
`;
    });

    // 닫는 괄호 추가
    newStyleBlock += `}`;

    // 파일에 새 블록 추가
    content += `\n\n${newStyleBlock}`;

    // 연속된 빈 줄 제거
    content = content.replace(/\n{3,}/g, '\n\n');

    // 파일 저장
    await fs.writeFile(componentGuidePath, content, 'utf8');
    console.log(`_component_guide.scss 파일이 업데이트되었습니다.`);
  } catch (error) {
    console.error('component_guide.scss 파일 업데이트 오류:', error);
    throw error;
  }
}

/**
 * HTML 파일 업데이트
 */
async function updateHtmlFile(type, color) {
  try {
    let htmlContent = await fs.readFile(COLOR_HTML_PATH, 'utf8');

    // HTML 코드 생성
    let htmlCode = '';
    switch (type) {
      case COLOR_TYPES.BG:
        htmlCode = generateBgColorHTML(color);
        break;
      case COLOR_TYPES.FONT:
        htmlCode = generateFontColorHTML(color);
        break;
      case COLOR_TYPES.LINE:
        htmlCode = generateLineColorHTML(color);
        break;
    }

    // 타입에 맞는 섹션 찾기
    let sectionTitle = '';
    switch (type) {
      case COLOR_TYPES.BG:
        sectionTitle = 'Bg Color 클래스 변수 및 컬러값';
        break;
      case COLOR_TYPES.FONT:
        sectionTitle = 'Text Color 클래스 변수 및 컬러값';
        break;
      case COLOR_TYPES.LINE:
        sectionTitle = 'Line Color 클래스 변수 및 컬러값';
        break;
    }

    // 섹션 찾기
    const sectionRegex = new RegExp(`<h2 class="uid-title02">${sectionTitle}<\\/h2>[\\s\\S]*?<ul class="component_ul">([\\s\\S]*?)<\\/ul>`, 'i');
    const sectionMatch = htmlContent.match(sectionRegex);

    if (sectionMatch) {
      // 기존 리스트에 새 항목 추가
      const updatedSection = sectionMatch[0].replace('</ul>', `${htmlCode}\n            </ul>`);
      const updatedContent = htmlContent.replace(sectionMatch[0], updatedSection);

      await fs.writeFile(COLOR_HTML_PATH, updatedContent, 'utf8');
      console.log(`HTML 코드가 color.html에 추가되었습니다.`);
    } else {
      console.error(`${sectionTitle} 섹션을 찾을 수 없습니다.`);
      throw new Error(`${sectionTitle} 섹션을 찾을 수 없습니다.`);
    }
  } catch (error) {
    console.error('HTML 파일 업데이트 중 오류가 발생했습니다:', error);
    throw error;
  }
}

/**
 * 배경 컬러 HTML 코드 생성
 */
function generateBgColorHTML(color) {
  return `              <li>
                <div class="component_color bg-${color}">
                  <div class="hide-txt">bg-${color}</div>
                </div>
                <div class="component_prototype_tit">$bg-${color}</div>
                <p>#${color}</p>
              </li>`;
}

/**
 * 폰트 컬러 HTML 코드 생성
 */
function generateFontColorHTML(color) {
  return `              <li>
                <div class="component_color font-${color}">
                  <div class="hide-txt">font-${color}</div>
                </div>
                <div class="component_prototype_tit">$font-${color}</div>
                <p>#${color}</p>
              </li>`;
}

/**
 * 라인 컬러 HTML 코드 생성
 */
function generateLineColorHTML(color) {
  return `              <li>
                <div class="component_color line-${color}">
                  <div class="hide-txt">line-${color}</div>
                </div>
                <div class="component_prototype_tit">$line-${color}</div>
                <p>#${color}</p>
              </li>`;
}

/**
 * SCSS 파일에서만 중복 변수 체크
 */
async function checkScssVariableDuplicate(type, color) {
  try {
    // SCSS 파일에서 중복 체크
    const scssContent = await fs.readFile(VARIABLES_PATH, 'utf8');
    const variableName = `$${type}-${color}`;

    // 정확한 변수명 일치 여부 확인 (주석이나 다른 변수의 일부가 아닌지 확인)
    const scssRegex = new RegExp(`${variableName}\\s*:`, 'i');
    const isDuplicate = scssRegex.test(scssContent);

    console.log(`SCSS 중복 체크 결과: ${isDuplicate ? '중복됨' : '중복 없음'}`);
    return isDuplicate;
  } catch (error) {
    console.error('SCSS 중복 변수 체크 오류:', error);
    throw error;
  }
}

/**
 * 중복 변수 체크 함수
 */
async function checkDuplicateVariable(type, color, checkHtml = true) {
  try {
    // SCSS 파일에서 중복 체크
    const scssContent = await fs.readFile(VARIABLES_PATH, 'utf8');
    const variableName = `$${type}-${color}`;

    // 정확한 변수명 일치 여부 확인 (주석이나 다른 변수의 일부가 아닌지 확인)
    const scssRegex = new RegExp(`${variableName}\\s*:`, 'i');
    const scssDuplicate = scssRegex.test(scssContent);

    if (scssDuplicate) {
      console.log(`SCSS 파일에서 중복된 컬러 변수 발견: ${type}-${color}`);
      return true;
    }

    // HTML 파일에서도 중복 체크 (checkHtml이 true일 때만)
    if (checkHtml && (type === COLOR_TYPES.FONT || type === COLOR_TYPES.BG || type === COLOR_TYPES.LINE)) {
      const htmlContent = await fs.readFile(COLOR_HTML_PATH, 'utf8');
      const className = `${type}-${color}`;

      // 더 정확한 HTML 요소 매칭을 위한 정규식
      const htmlRegex = new RegExp(`<div class="component_color ${className}">`, 'i');

      // 추가로 변수명도 확인
      const variableRegex = new RegExp(`<div class="component_prototype_tit">\\$${type}-${color}</div>`, 'i');

      const htmlDuplicate = htmlRegex.test(htmlContent) || variableRegex.test(htmlContent);

      if (htmlDuplicate) {
        console.log(`HTML 파일에서 중복된 컬러 변수 발견: ${type}-${color}`);
        return true;
      }
    }

    console.log(`중복 체크 결과: 중복 없음`);
    return false;
  } catch (error) {
    console.error('중복 변수 체크 오류:', error);
    throw error;
  }
}

/**
 * 폰트 mixin 추가 API
 */
app.post('/api/add-font-mixin', async (req, res) => {
  try {
    const { fontSize, lineHeight } = req.body;

    if (!fontSize || !lineHeight) {
      return res.status(400).json({ success: false, message: '폰트 사이즈와 라인 하이트가 필요합니다.' });
    }

    // 숫자 검증
    if (isNaN(parseInt(fontSize)) || isNaN(parseFloat(lineHeight))) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 값입니다. 폰트 사이즈는 정수, 라인 하이트는 숫자여야 합니다.'
      });
    }

    // 중복 mixin 체크
    const isDuplicate = await checkDuplicateMixin(fontSize);

    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        error: `f${fontSize} mixin이 이미 존재합니다.`,
        isDuplicate: true
      });
    }

    // _mixins.scss 파일 업데이트
    await addFontMixinToFile(fontSize, lineHeight);

    res.json({
      success: true,
      message: `f${fontSize} mixin이 성공적으로 추가되었습니다.`,
      data: {
        fontSize,
        lineHeight
      }
    });
  } catch (error) {
    console.error('폰트 mixin 추가 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
});

/**
 * _mixins.scss 파일에 폰트 mixin 추가
 */
async function addFontMixinToFile(fontSize, lineHeight) {
  try {
    // _mixins.scss 파일 읽기
    let content = await fs.readFile(MIXINS_PATH, 'utf8');

    // 새로운 mixin 코드 생성
    const newMixinCode = `@mixin f${fontSize}($fontWeight: null, $lineHeight: ${lineHeight}) {
  @include rem(font-size, ${fontSize});
  @include font-style($fontWeight, $lineHeight);
}`;

    // 폰트 mixin 패턴
    const fontMixinPattern = /@mixin f(\d+)\(\$fontWeight: null, \$lineHeight: [0-9.]+\) \{[\s\S]+?\}/g;

    // 모든 mixin 추출
    const mixinMatches = [...content.matchAll(fontMixinPattern)];
    const mixins = mixinMatches.map(match => ({
      size: parseInt(match[1]),
      code: match[0]
    }));

    // 중복 체크
    if (mixins.some(m => m.size === parseInt(fontSize))) {
      console.log(`f${fontSize} mixin이 이미 존재합니다.`);
      return false;
    }

    // 새 mixin 추가
    mixins.push({
      size: parseInt(fontSize),
      code: newMixinCode
    });

    // 크기 순으로 정렬 (내림차순)
    mixins.sort((a, b) => a.size - b.size);

    // 모든 기존 mixin을 내용에서 제거
    let newContent = content.replace(fontMixinPattern, '');

    // 폰트 mixin 섹션 시작 위치 찾기
    const sectionStartComment = "// 이제 각 폰트 사이즈 믹스인에 기본 라인 하이트 설정";
    const sectionStartIndex = newContent.indexOf(sectionStartComment);

    if (sectionStartIndex === -1) {
      console.log("폰트 mixin 섹션 시작 주석을 찾을 수 없습니다.");
      return false;
    }

    // 주석 바로 다음에 정렬된 모든 mixin 삽입
    const sortedMixinsCode = mixins.map(m => m.code).join("\n\n");
    const insertPosition = sectionStartIndex + sectionStartComment.length;

    newContent =
      newContent.substring(0, insertPosition) +
      "\n\n" + sortedMixinsCode + "\n\n" +
      // 다음 실제 내용 앞의 공백 줄 제거
      newContent.substring(insertPosition).replace(/^\s*\n+/m, '');

    // 연속된 빈 줄 정리
    newContent = newContent.replace(/\n{3,}/g, '\n\n');

    // 파일 쓰기
    await fs.writeFile(MIXINS_PATH, newContent, 'utf8');
    console.log(`f${fontSize} mixin이 성공적으로 추가되고 크기 순으로 정렬되었습니다.`);
    return true;

  } catch (error) {
    console.error('폰트 mixin 추가 및 정렬 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 중복 mixin 체크 함수
 */
async function checkDuplicateMixin(fontSize) {
  try {
    // _mixins.scss 파일 읽기
    const content = await fs.readFile(MIXINS_PATH, 'utf8');

    // mixin 검색 정규식
    const mixinRegex = new RegExp(`@mixin f${fontSize}\\(\\$fontWeight: null, \\$lineHeight: [0-9.]+\\) \\{`, 'i');

    // 중복 체크
    return mixinRegex.test(content);
  } catch (error) {
    console.error('중복 mixin 체크 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 모든 폰트 mixin 삭제 API
 */
app.post('/api/remove-all-font-mixins', async (req, res) => {
  try {
    // 삭제할 폰트 mixin 목록 가져오기 (선택적)
    const fontSizes = req.body.fontSizes || [];

    let deletedCount = 0;

    if (fontSizes.length > 0) {
      // 특정 폰트 사이즈 목록만 삭제
      for (const fontSize of fontSizes) {
        try {
          await removeFontMixinFromFile(fontSize);
          deletedCount++;
        } catch (error) {
          console.warn(`f${fontSize} mixin 삭제 실패:`, error.message);
        }
      }
    } else {
      // 모든 폰트 mixin 삭제
      deletedCount = await removeAllFontMixins();
    }

    res.json({
      success: true,
      message: `${deletedCount}개의 폰트 mixin이 성공적으로 삭제되었습니다.`,
      deletedCount
    });
  } catch (error) {
    console.error('폰트 mixin 삭제 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
});

/**
 * 모든 폰트 mixin 삭제
 * @returns {Promise<number>} 삭제된 mixin의 수
 */
async function removeAllFontMixins() {
  try {
    // _mixins.scss 파일 읽기
    let content = await fs.readFile(MIXINS_PATH, 'utf8');

    // 폰트 mixin 찾기
    const fontMixinRegex = /@mixin f\d+\(\$fontWeight: null, \$lineHeight: [0-9.]+\) \{[\s\S]+?\}/g;
    const fontMixins = content.match(fontMixinRegex) || [];

    if (fontMixins.length === 0) {
      console.log('삭제할 폰트 mixin이 없습니다.');
      return 0;
    }

    // mixin 삭제
    content = content.replace(fontMixinRegex, '');

    // 연속된 빈 줄 제거 (선택사항)
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    // 파일 쓰기
    await fs.writeFile(MIXINS_PATH, content, 'utf8');
    console.log(`${fontMixins.length}개의 폰트 mixin이 삭제되었습니다.`);
    return fontMixins.length;
  } catch (error) {
    console.error('모든 폰트 mixin 삭제 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 특정 폰트 mixin 삭제 API
 */
app.post('/api/remove-font-mixin', async (req, res) => {
  try {
    const { fontSize } = req.body;

    if (!fontSize) {
      return res.status(400).json({ success: false, message: '폰트 사이즈가 필요합니다.' });
    }

    // 숫자 검증
    if (isNaN(parseInt(fontSize))) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 값입니다. 폰트 사이즈는 정수여야 합니다.'
      });
    }

    // mixin 존재 여부 확인
    const mixinExists = await checkDuplicateMixin(fontSize);

    if (!mixinExists) {
      return res.status(404).json({
        success: false,
        error: `f${fontSize} mixin을 찾을 수 없습니다.`,
        notFound: true
      });
    }

    // _mixins.scss 파일에서 mixin 삭제
    await removeFontMixinFromFile(fontSize);

    res.json({
      success: true,
      message: `f${fontSize} mixin이 성공적으로 삭제되었습니다.`,
      data: {
        fontSize
      }
    });
  } catch (error) {
    console.error('폰트 mixin 삭제 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다.',
      details: error.message
    });
  }
});

/**
 * 특정 폰트 mixin 삭제
 */
async function removeFontMixinFromFile(fontSize) {
  try {
    // _mixins.scss 파일 읽기
    let content = await fs.readFile(MIXINS_PATH, 'utf8');

    // 삭제할 mixin의 정규식 패턴
    const mixinRegex = new RegExp(`@mixin f${fontSize}\\(\\$fontWeight: null, \\$lineHeight: [0-9.]+\\) \\{[\\s\\S]+?\\}`, 'g');

    // mixin 찾기
    const mixinMatch = content.match(mixinRegex);

    if (!mixinMatch) {
      throw new Error(`f${fontSize} mixin을 찾을 수 없습니다.`);
    }

    // mixin 삭제
    content = content.replace(mixinRegex, '');

    // 연속된 빈 줄 제거 (선택사항)
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    // 파일 쓰기
    await fs.writeFile(MIXINS_PATH, content, 'utf8');
    console.log(`f${fontSize} mixin이 _mixins.scss 파일에서 삭제되었습니다.`);
    return true;
  } catch (error) {
    console.error('_mixins.scss 파일 업데이트 중 오류 발생:', error);
    throw error;
  }
}

// 서버 시작
app.listen(PORT, () => {
  console.log(`컬러 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  // console.log(`API 엔드포인트: http://localhost:${PORT}/api/add-color`);
  // console.log(`API 엔드포인트: http://localhost:${PORT}/api/add-font-mixin`);
  // console.log(`API 엔드포인트: http://localhost:${PORT}/api/remove-font-mixin`);
  // console.log(`API 엔드포인트: http://localhost:${PORT}/api/remove-all-font-mixins`);

});
