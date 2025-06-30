/**
 * Color Variables Generator
 * 컬러 변수 생성 및 파일 업데이트를 위한 Node.js 스크립트
 * 
 * 사용법:
 * node color_variables_generator.js [type] [color]
 * 
 * 예시:
 * node color_variables_generator.js bg 000000
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 컬러 타입 정의
const COLOR_TYPES = {
  FONT: 'font',
  BG: 'bg',
  LINE: 'line'
};

// 파일 경로 설정
const PROJECT_ROOT = path.join(__dirname, '../../../..');
const VARIABLES_PATH = path.join(PROJECT_ROOT, 'src/assets/styles/abstracts/_variables.scss');
const COLOR_HTML_PATH = path.join(PROJECT_ROOT, 'src/guide/pages/components/color.html');

/**
 * 메인 함수
 */
function main() {
  // 명령줄 인수 파싱
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('사용법: node color_variables_generator.js [type] [color]');
    console.error('예시: node color_variables_generator.js bg 000000');
    process.exit(1);
  }
  
  const [type, color] = args;
  
  // 타입 검증
  if (![COLOR_TYPES.FONT, COLOR_TYPES.BG, COLOR_TYPES.LINE].includes(type)) {
    console.error('유효하지 않은 타입입니다. font, bg, 또는 line 중 하나를 사용하세요.');
    process.exit(1);
  }
  
  // 컬러 값 검증
  let colorValue = color;
  if (colorValue.startsWith('#')) {
    colorValue = colorValue.substring(1);
  }
  
  if (!/^[0-9a-f]{6}$/.test(colorValue)) {
    console.error('유효하지 않은 컬러 코드입니다. 6자리 16진수 형식이어야 합니다 (예: 000000).');
    process.exit(1);
  }
  
  try {
    // SCSS 변수 추가
    addScssVariable(type, colorValue);
    
    // HTML 코드 추가
    addHtmlCode(type, colorValue);
    
    console.log('파일이 성공적으로 업데이트되었습니다.');
  } catch (error) {
    console.error('오류가 발생했습니다:', error.message);
    process.exit(1);
  }
}

/**
 * SCSS 변수 추가 함수
 */
function addScssVariable(type, color) {
  try {
    let scssContent = fs.readFileSync(VARIABLES_PATH, 'utf8');
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
      
      fs.writeFileSync(VARIABLES_PATH, updatedContent);
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
 * HTML 코드 추가 함수
 */
function addHtmlCode(type, color) {
  try {
    let htmlContent = fs.readFileSync(COLOR_HTML_PATH, 'utf8');
    
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
      
      fs.writeFileSync(COLOR_HTML_PATH, updatedContent);
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
                <div class="component_color color-${color}">
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
                <div class="component_color border-${color}">
                  <div class="hide-txt">line-${color}</div>
                </div>
                <div class="component_prototype_tit">$line-${color}</div>
                <p>#${color}</p>
              </li>`;
}

// 메인 함수 실행
main();
