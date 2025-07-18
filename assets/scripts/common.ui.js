"use strict";;(function(){
const etUI = {};
// config
etUI.config = {
  media: {
    names: ['isMobile', 'isDesktop'],
    points: [1023],
  },
  animation: {
    duration: 0.4,
    stagger: 0.1,
    easing: 'Power2.easeOut',
  },
  layer: {
    dimmOpacity: 0.6,
  },
  initDefault() {
    gsap.defaults({
      ease: this.animation.easing,
      duration: this.animation.duration,
    });
  },
  lenis: {
    enable: false,
    options: {},
    speed: 2000,
    lagSmoothing: 0,
  },
  locale: {
    default: 'ko',
  },
  lottie: {
    basePath: location.pathname.startsWith('/p/') ? '/p/assets/images/lottie' : '/assets/images/lottie',
  },
};
etUI.config.initDefault();

// pages
etUI.pages = {};

etUI.locales = {};
etUI.locales.ko = {
  input: {
    password_hide: '비밀번호 숨기기',
    password_show: '비밀번호 표시',
    clear: '내용 지우기',
  },
  swiper: {
    navigation: {
      prev: '이전 슬라이드',
      next: '다음 슬라이드',
    },
    pagination: {
      page: '페이지',
    },
    autoplay: {
      play: '재생',
      pause: '정지',
    },
  },
  dialog: {
    positive: '확인',
    negative: '취소',
  },
};

etUI.$t = function (key, defaultText = '') {
  const locale = etUI.locales[etUI.config.locale.default];
  return etUI.utils.getValueFromNestedObject(locale, key) || defaultText;
};

window.etUI = etUI;
;


/**
 * Check if the value is an array
 * @param value {any}
 * @returns {arg is any[]}
 */
function isArray(value) {
  return Array.isArray(value);
}


/**
 * 설명
 * @param cleanups  {function[]}
 */
function allCleanups(cleanups) {
  cleanups.forEach((cleanup) => cleanup());
}
;


// boolean 관련 기능
;


// 날짜 관련 기능
;


/**
 * set attribute
 * @param { Element } parent
 * @param opts
 */
function setProperty(parent, ...opts) {
  if (opts.length === 2) {
    const [property, value] = opts;

    parent?.setAttribute(property, value);
  } else if (opts.length === 3) {
    const [selector, property, value] = opts;

    parent.querySelector(selector)?.setAttribute(property, value);
  }
}

/**
 * get attribute
 * @param { Element } parent
 * @param { String } selector
 * @param { String } property
 */
function getProperty(parent, selector, property) {
  parent.querySelector(selector)?.getAttribute(property);
}

/**
 * set style
 * @param { Element } parent
 * @param { String } selector
 * @param { String } property
 * @param { any } value
 */
function setStyle(parent, selector, property, value) {
  if (parent.querySelector(selector)) {
    parent.querySelector(selector).style[property] = value;
  }
}

/**
 * gsap의 SplitText를 활용하여 문자를 분리하여 마스크 가능하게 해준다.
 * @param selector  {string}
 * @param type  {'lines'|'words'|'chars'}
 * @returns [HTMLElement[], HTMLElement[]]
 */
function splitTextMask(selector, type = 'lines', isOverflow = true) {
  let $quote;

  function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  if (typeof selector === String) {
    $quote = document.querySelector(selector);
  } else {
    $quote = selector;
  }
  // const $quote = document.querySelector(selector),

  const mySplitText = new SplitText($quote, { type });

  const $splitted = mySplitText[type];
  const $lineWrap = [];
  $splitted.forEach(($el, index) => {
    const $div = document.createElement('div');
    if (isOverflow) {
      $div.style.overflow = 'hidden';
    }
    $div.style.position = 'relative';
    // $div.style.display = 'block';
    $div.style.display = 'inline-block';
    $div.classList.add('split-text-wrap');
    wrap($el, $div);
    $lineWrap.push($div);
  });

  return [$splitted, $lineWrap];
}

function splitTextMaskBlock(selector, type = 'lines', isOverflow = true) {
  let $quote;

  function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  if (typeof selector === 'string') {
    $quote = document.querySelector(selector);
  } else {
    $quote = selector;
  }
  // const $quote = document.querySelector(selector),
  if ([...$quote.children].some((el) => el.classList.contains('split-text-wrap'))) {
    return;
  }

  const mySplitText = new SplitText($quote, { type });

  const $splitted = mySplitText[type];
  const $lineWrap = [];
  $splitted.forEach(($el, index) => {
    const $div = document.createElement('div');
    if (isOverflow) {
      $div.style.overflow = 'hidden';
    }
    $div.style.position = 'relative';
    $div.style.display = 'block';
    $div.classList.add('split-text-wrap');
    wrap($el, $div);
    $lineWrap.push($div);
  });

  return [$splitted, $lineWrap];
}

/**
 *
 * @param el  {string|HTMLElement}
 * @returns {Node}
 */
function wrapMask(el) {
  const $el = etUI.utils.selectorStringToElement(el);
  if ($el.parentNode.classList.contains('ui-mask')) {
    return $el.parentNode;
  }

  function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  const style = window.getComputedStyle($el);
  const $div = document.createElement('div');
  $div.style.overflow = 'hidden';
  $div.style.position = style.position || null;
  if (style.position === 'absolute' || style.position === 'fixed') {
    $div.style.top = style.top;
    $div.style.left = style.left;
    $div.style.right = style.right;
    $div.style.bottom = style.bottom;

    $el.style.top = 0;
    $el.style.left = 0;
    $el.style.right = 0;
    $el.style.bottom = 0;
  }
  $div.style.display = style.display || null;
  $div.classList.add('ui-mask');
  wrap($el, $div);

  return $div;
}

/**
 *
 */
function setDocHeight() {
  document.querySelector('body').style.setProperty('--doc-height', window.innerHeight + 'px');
  document.querySelector('body').dataset.docHeight = window.innerHeight;
}

/**
 *
 * @param arrBreakPointName
 * @param arrBreakPoint
 * @returns {{}}
 */
function getMediaQueryCondition(arrBreakPointName, arrBreakPoint) {
  if (arrBreakPointName.length !== arrBreakPoint.length + 1) {
    console.error('arrBreakPointName.length !== arrBreakPoint.length + 1');
    return;
  }

  const mediaQueryCondition = {};

  const arr = [],
    length = arrBreakPoint.length;
  arr.push(`(max-width: ${arrBreakPoint[0] - 1}px)`);

  new Array(length - 1).fill(0).forEach((_, index) => {
    arr.push(`(min-width: ${arrBreakPoint[index]}px) and (max-width: ${arrBreakPoint[index + 1] - 1}px)`);
  });

  arr.push(`(min-width: ${arrBreakPoint[length - 1]}px)`);

  arrBreakPointName.forEach((name, index) => {
    mediaQueryCondition[name] = arr[index];
  });

  mediaQueryCondition['reduceMotion'] = '(prefers-reduced-motion: reduce)';
  mediaQueryCondition['isDark'] = '(prefers-color-scheme: dark)';
  mediaQueryCondition['isLight'] = '(prefers-color-scheme: light)';

  return mediaQueryCondition;
}

/**
 *
 * @param fn
 */
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/**
 *
 * @param {string | NodeList} target
 * @returns {HTMLElement | null}
 */
function firstNode(target) {
  if (typeof target === 'string') {
    return document.querySelector(target);
  } else if (NodeList.prototype.isPrototypeOf(target)) {
    if (target.length <= 0) {
      return null;
    }
    return target[0];
  } else if (Array.isArray(target)) {
    return target[0];
  }
}

/**
 *
 * @param {string | NodeList} target
 * @returns {HTMLElement | null}
 */
function lastNode(target) {
  if (typeof target === 'string') {
    return document.querySelectorAll(target)[document.querySelectorAll(target).length - 1];
  } else if (NodeList.prototype.isPrototypeOf(target)) {
    if (target.length <= 0) {
      return null;
    }
    return target[target.length - 1];
  } else if (Array.isArray(target)) {
    return target[target.length - 1];
  }
}

/**
 *
 * @param str
 * @returns {*[]}
 */
function parseHTML(str) {
  const tmp = document.implementation.createHTMLDocument('');
  tmp.body.innerHTML = str;
  return [...tmp.body.childNodes];
}

/**
 *
 */
function setupLenis() {
  const lenis = new Lenis(etUI.config.lenis.options || {});

  lenis.on('scroll', (e) => {
    console.log(e);
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * etUI.config.lenis.speed || 1000);
  });

  gsap.ticker.lagSmoothing(etUI.config.lenis.lagSmoothing);

  etUI.lenis = lenis;
}

/**
 *
 * @param selector  {string|HTMLElement}
 * @returns {Element|*}
 */
function selectorStringToElement(selector) {
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  } else {
    return selector;
  }
}

/**
 * 페이지의 모든 요소를 탐색하여 고정된 요소들의 높이를 계산합니다.
 * 속성 값이 fixed, sticky인경유 클래스 추가할지 협의해야합니다.
 * 테스트중
 * @returns {number} 고정된 요소들의 총 높이
 */
function calculateFixedElementsHeight() {
  const fixedElements = document.querySelectorAll('.fixed, .sticky');
  let totalFixedHeight = 0;

  fixedElements.forEach((element) => {
    const style = window.getComputedStyle(element);
    if (style.position === 'fixed' || style.position === 'sticky') {
      const height = parseFloat(style.height) || 0;
      const top = parseFloat(style.top) || 0;
      totalFixedHeight += height + top;
    }
  });

  return totalFixedHeight;
}

/**
 * 특정 요소 또는 위치로 부드럽게 스크롤합니다.
 * @param {HTMLElement|number} target - 스크롤할 목표 요소 또는 위치.
 * @param {Object} options - 스크롤 옵션 객체.
 * @param {number} [options.offset=0] - 추가 오프셋 값.
 */
function scrollToPosition(target, { offset = 0 } = {}) {
  const totalFixedHeight = calculateFixedElementsHeight();
  const totalOffset = totalFixedHeight + offset;

  const targetPosition =
    typeof target === 'number'
      ? target - totalOffset
      : target instanceof HTMLElement
        ? target.offsetTop - totalOffset
        : (() => {
            throw new Error('target must be an HTMLElement or a number');
          })();

  window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}
;


function debounce(callback, delay = 250) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

function throttle(callback, delay = 250) {
  let isThrottled = false;
  let args;
  let context;

  function wrapper(...wrapperArgs) {
    if (isThrottled) {
      args = wrapperArgs;
      context = this;
      return;
    }

    isThrottled = true;
    callback.apply(this, wrapperArgs);
    setTimeout(() => {
      isThrottled = false;
      if (args) {
        wrapper.apply(context, args);
        args = context = null;
      }
    }, delay);
  }

  return wrapper;
}

function isMarkerQS() {
  return location.search.includes('marker121212');
}

function triggerEvent(el, eventType) {
  if (typeof eventType === 'string' && typeof el[eventType] === 'function') {
    el[eventType]();
  } else {
    const event = typeof eventType === 'string' ? new Event(eventType, { bubbles: true }) : eventType;
    el.dispatchEvent(event);
  }
}
;


// 연산 관련 (자료형Number + number)
function getBlendOpacity(opacity, length) {
  if (length === 1) {
    return opacity;
  }

  return 1 - Math.pow(1 - opacity, 1 / length);
}
;


// object 관련 기능

/**
 * compare obj
 * @param { Object } obj1
 * @param { Object } obj2
 * @returns Boolean
 */
function shallowCompare(obj1, obj2) {
  const keys = [...Object.keys(obj1), Object.keys(obj2)];

  for (const key of keys) {
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (!etUI.utils.shallowCompare(obj1[key], obj2[key])) {
        return false;
      }
    } else {
      const role = !obj2[key] || typeof obj1[key] === 'function';
      if (!role && obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }
  return true;
}

function isDeepEqual(object1, object2) {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (var key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if ((isObjects && !isDeepEqual(value1, value2)) || (!isObjects && value1 !== value2)) {
      return false;
    }
  }
  return true;
}

function isObject(object) {
  return object != null && typeof object === 'object';
}

/**
 *
 * @param obj
 * @param key
 * @returns {*}
 */
function getValueFromNestedObject(obj, key) {
  const keys = key.split('.');

  return keys.reduce((acc, currKey) => {
    return acc && acc[currKey] !== undefined ? acc[currKey] : undefined;
  }, obj);
}
;


/**
 * Reverse a string
 * @param str {string}
 * @returns {string}
 */
function reverseString(str) {
  return str.split('').reverse().join('');
}

/**
 * Get a random id
 * @returns {string}
 */
function getRandomId() {
  return Math.random().toString(36).substring(2);
}

/**
 *
 * @param prefix
 * @returns {string}
 */
function getRandomUIID(prefix = 'ui') {
  return `${prefix}-${getRandomId()}`;
}

/**
 * 첫글자만 대문자로 변환
 * @param word
 * @returns {string}
 */
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * 첫글자만 소문자로 변환
 * @param word
 * @returns {string}
 */
function uncapitalize(word) {
  return word.charAt(0).toLowerCase() + word.slice(1)
}

function addPrefixCamelString(str, prefix){
  // dimmClick => propsDimmClick
  return prefix + etUI.utils.capitalize(str)
}

function removePrefixCamelString(str, prefix){
  const regExp = new RegExp(`^${prefix}`, 'g')
  return etUI.utils.uncapitalize(str.replaceAll(regExp, ''))

}

function countCharacters(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    // Check if the character is English
    if (/[a-zA-Z]/.test(str[i])) {
      count += 1;
    }
    // Check if the character is Korean or other 2-byte character
    else if (str.charCodeAt(i) > 127) {
      count += 2;
    }
    // Special characters
    else {
      count += 1;
    }
  }
  return count;
}
;



etUI.utils = {
isArray,
allCleanups,
setProperty,
getProperty,
setStyle,
splitTextMask,
splitTextMaskBlock,
wrapMask,
setDocHeight,
getMediaQueryCondition,
ready,
firstNode,
lastNode,
parseHTML,
setupLenis,
selectorStringToElement,
calculateFixedElementsHeight,
scrollToPosition,
debounce,
throttle,
isMarkerQS,
triggerEvent,
getBlendOpacity,
shallowCompare,
isDeepEqual,
isObject,
getValueFromNestedObject,
reverseString,
getRandomId,
getRandomUIID,
capitalize,
uncapitalize,
addPrefixCamelString,
removePrefixCamelString,
countCharacters
}
              ;


function useA11yKeyEvent() {
  function firstNodeFocusOut(target, handler) {
    return etUI.hooks.useEventListener(target, 'keydown', (e) => {
      if (e.key === 'Tab' && e.shiftKey) {
        handler();
      }
    });
  }

  function lastNodeFocusOut(target, handler) {
    return etUI.hooks.useEventListener(target, 'keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        handler();
      }
    });
  }

  return {
    firstNodeFocusOut,
    lastNodeFocusOut,
  };
}
;


/**
 * target)의 외부를 클릭했을 때 콜백 함수를 실행
 * 예외적으로 클릭을 허용할 요소들의 선택자를 포함하는 배열을 옵션으로 받을 수 있습니다.
 *
 * @param {Element} target - 클릭 이벤트의 외부 클릭 감지를 수행할 대상 DOM 요소입니다.(필수)
 * @param {Function} callback - 외부 클릭이 감지되었을 때 실행할 콜백 함수입니다.(필수)
 * @param {Array<string>} exceptions - 외부 클릭 감지에서 예외 처리할 요소들의 선택자를 포함하는 배열입니다.(옵션)
 */
function useClickOutside(target, callback, exceptions = []) {
  return etUI.hooks.useEventListener(document, 'click', (event) => {
    const isClickInsideException = exceptions.some((selector) => {
      const exceptionElement = document.querySelector(selector);
      return exceptionElement && exceptionElement.contains(event.target);
    });

    if (!target.contains(event.target) && !isClickInsideException) {
      callback(target);
    }
  });
}
;


function useCore(
  initialProps = {},
  initialState = {},
  render,
  options = {
    dataset: true,
  },
) {
  const actions = {};
  let $target;
  const cleanups = [];
  const NO_BUBBLING_EVENTS = ['blur', 'focus', 'focusin', 'focusout', 'pointerleave'];
  const onStateChange = () => {};
  let stateCallback;
  const props = new Proxy(initialProps, {
    set: (target, key, value) => {
      Reflect.set(target, key, value);
      return true;
    },
  });

  const state = new Proxy(initialState, {
    set: (target, key, value) => {
      Reflect.set(target, key, value);
      return true;
    },
  });

  function setTarget(_$target, { stateCallback: _stateCallback } = {}) {
    $target = _$target;
    if (_stateCallback) {
      stateCallback = _stateCallback;
    }

    if (options.dataset) {
      const { getPropsFromDataset, getVarsFromDataset } = etUI.hooks.useDataset($target);
      const datasetProps = getPropsFromDataset();
      const datasetVars = getVarsFromDataset();

      setProps({ ...props, ...datasetProps });
      setState({ ...state, ...datasetVars }, { silent: true, immediate: true });
    }
  }

  function setProps(newProps) {
    Object.keys(newProps).forEach((key) => {
      props[key] = newProps[key];
    });
  }

  function setState(newState, { silent = false, immediate = false } = {}) {
    if (etUI.utils.isDeepEqual(state, newState)) return;

    Object.keys(newState).forEach((key) => {
      state[key] = newState[key];
    });
    if (!silent && render !== undefined && render !== null && typeof render === 'function') {
      render(immediate);
    }

    if (options.dataset) {
      const { setVarsFromDataset } = etUI.hooks.useDataset($target);
      setVarsFromDataset(state);
    }

    stateCallback && stateCallback(state);
  }

  function addEvent(eventType, selector, callback) {
    const $eventTarget = selector ? $target.querySelector(selector) : $target;

    if (NO_BUBBLING_EVENTS.includes(eventType)) {
      const cleanup = etUI.hooks.useEventListener($eventTarget, eventType, callback);
      return cleanups.push(cleanup);
    }

    const eventHandler = (event) => {
      let $eventTarget = event.target.closest(selector);

      if (!selector) {
        $eventTarget = event.target;
      }

      if ($eventTarget) {
        callback(event);
      }
    };

    $target.addEventListener(eventType, eventHandler);
    const cleanup = () => $target.removeEventListener(eventType, eventHandler);
    cleanups.push(cleanup);
  }

  function removeEvent() {
    etUI.utils.allCleanups(cleanups);
  }

  return {
    cleanups,
    setTarget,
    actions,
    state,
    props,
    setState,
    setProps,
    addEvent,
    removeEvent,
  };
}
;


/**
 * useDataset
 * @param $target {HTMLElement}
 */
function useDataset($target) {
  let datasetProps = {},
    datasetVars = {};

  function getDatasetByPrefix(prefix) {
    const dataset = {};
    Object.keys($target.dataset).forEach((key) => {
      let value = $target.dataset[key];
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if(typeof value === 'string' && value.includes('{')){
        value = JSON.parse(value);
      } else if(!isNaN(value)) {
        value = parseFloat(value);
      }

      if(key.startsWith(prefix)){
        dataset[etUI.utils.removePrefixCamelString(key, prefix)] = value;
      }
    });

    return dataset;
  }

  function getDatasetExceptPrefix(prefix) {
    const dataset = {};

    Object.keys($target.dataset).forEach((key) => {
      let value = $target.dataset[key];

      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }

      if(!key.startsWith(prefix)){
        dataset[etUI.utils.removePrefixCamelString(key, prefix)] = value;
      }
    });

    return dataset;
  }

  function setDatasetByPrefix(data, prefix) {
    Object.keys(data).forEach((key) => {
      if(prefix){
        $target.dataset[`${prefix}${etUI.utils.capitalize(key)}`] = data[key];
      }else{
        $target.dataset[key] = data[key];
      }
    });
  }

  function getPropsFromDataset() {
    datasetProps = getDatasetByPrefix('props');
    return datasetProps;
  }

  function getVarsFromDataset() {
    datasetVars = getDatasetExceptPrefix('props');
    return datasetVars;
  }

  function setPropsFromDataset(props) {
    setDatasetByPrefix(props, 'props');
  }

  function setVarsFromDataset(vars) {
    setDatasetByPrefix(vars, '');
  }

  function setStringToObject(props) {
    // dataset에서 객체 형태인 스트링값 타입 객체로 바꿔줌
    for (const key in props) {
      if (!(typeof props[key] === 'boolean') && props[key].includes('{')) {
        props[key] = JSON.parse(props[key]);
      }
    }

    return props;
  }

  return {
    getPropsFromDataset,
    setPropsFromDataset,
    getVarsFromDataset,
    setVarsFromDataset,
    setStringToObject,
  };
}
;


function useDialog() {
  let $layerWrapBox;

  function createLayerWrap() {
    $layerWrapBox = document.createElement('div');
    $layerWrapBox.classList.add('layer-wrap');
    document.body.appendChild($layerWrapBox);
  }

  const alert = (...opts) => {
    let $layerWrap = document.querySelector('.layer-wrap');
    const dialog = new etUI.components.Dialog();

    if (!$layerWrap) {
      createLayerWrap();
      $layerWrap = $layerWrapBox;
    }

    if (typeof opts[0] === 'string') {
      dialog.core.init($layerWrap, { dialogType: 'alert', message: opts[0], callback: opts[1] });
    } else if (typeof opts[0] === 'object') {
      dialog.core.init($layerWrap, { dialogType: 'alert', ...opts[0] });
    }

    dialog.open();
  };

  const confirm = (...opts) => {
    let $layerWrap = document.querySelector('.layer-wrap');
    const dialog = new etUI.components.Dialog();

    if (!$layerWrap) {
      createLayerWrap();
      $layerWrap = $layerWrapBox;
    }

    if (typeof opts[0] === 'string') {
      dialog.core.init($layerWrap, { dialogType: 'confirm', message: opts[0], positiveCallback: opts[1] });
    } else if (typeof opts[0] === 'object') {
      dialog.core.init($layerWrap, { dialogType: 'confirm', ...opts[0] });
    }

    dialog.open();
  };

  const previewImage = (...opts) => {
    let $layerWrap = document.querySelector('.layer-wrap');
    const dialog = new etUI.components.Dialog();

    if (!$layerWrap) {
      createLayerWrap();
      $layerWrap = $layerWrapBox;
    }

    dialog.core.init($layerWrap, { dialogType: 'previewImage', ...opts[0] });

    dialog.open();
  };

  const toastBasic = (...opts) => {
    let $toastWrap = document.querySelector('.toast-wrap')
    const toast = new etUI.components.Toast();

    if (!$toastWrap) return;

    toast.core.init($toastWrap, {type: 'basic', ...opts[0]});
    toast.open();
  }

  const toastCloseBtn = (...opts) => {
    let $toastWrap = document.querySelector('.toast-wrap')
    const toast = new etUI.components.Toast();

    if (!$toastWrap) return;

    toast.core.init($toastWrap, {type: 'close', ...opts[0]});
    toast.open();
  }

  const toastLinkBtn = (...opts) => {
    let $toastWrap = document.querySelector('.toast-wrap')
    const toast = new etUI.components.Toast();

    if (!$toastWrap) return;

    toast.core.init($toastWrap, {type: 'link', ...opts[0]});
    toast.open();
  }

  return {
    alert,
    confirm,
    previewImage,
    toastBasic,
    toastCloseBtn,
    toastLinkBtn,
  };
}
;


function dialogTmpl() {
  const $templateHTML = ({ dialogType, type, title, message, positiveText, negativeText }) => `
      <div class="component-dialog">
        <div class="dialog-dimm"></div>
        <div class="dialog-frame">
          <div class="dialog-container">
            <div class="dialog-header">
              ${title ? `<h3 class="dialog-tit">${title}</h3>` : ''}
            </div>
            <div class="dialog-content">
              ${dialogType === 'alert' ? `<span class="${type}">icon</span>` : ''}

              <p class="dialog-info">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="btn-group">
              ${dialogType === 'confirm' ? `<button type="button" class="btn btn-square btn-white dialog-negative">${negativeText}</button>` : ''}
              ${positiveText ? `<button type="button" class="btn dialog-positive btn-primary">${positiveText}</button>` : ''}
            </div>

            ${dialogType === 'alert' ? `<button type="button" class="dialog-close"><span class="hide-txt">팝업 닫기</span></button>` : ''}

          </div>
        </div>
      </div>
    `;

  const $templatePreviewImageHTML = ({ dialogType, images, title }) => `
      <div class="component-dialog dialog-preview-image">
        <div class="dialog-dimm"></div>
        <div class="dialog-frame">
          <div class="dialog-container">
            <div class="dialog-header">
              ${title ? `<h3 class="dialog-tit">${title}</h3>` : ''}
            </div>
            <div class="dialog-content">
              <div class="component-swiper">
                <!-- Additional required wrapper -->
                <div class="swiper-wrapper">
                  ${images
                    .map(
                      (image) => `
                    <div class="swiper-slide">
                      <img src="${image.src}" alt="${image.alt}" />
                    </div>
                  `,
                    )
                    .join('')}
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-square btn-white dialog-negative">닫기</button>
          </div>
        </div>
      </div>
    `;
  return {
    $templateHTML,
    $templatePreviewImageHTML,
  };
}
;


/**
 * useEventListener
 * @param target  {HTMLElement|HTMLElement[]}
 * @param type  {string}
 * @param listener  {function}
 * @param options {object}
 * @returns {function(): *}
 */
function useEventListener(target, type, listener, options = {}) {
  if (NodeList.prototype.isPrototypeOf(target)) {
    target.forEach((element) => element.addEventListener(type, listener, options));
    return () => target.forEach((element) => element.removeEventListener(type, listener, options));
  }

  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}
;


/**
 * getBoundingClientRect
 * @param { Element } parent
 * @param { String } selector
 * @returns
 */
function useGetClientRect(parent, selector) {
  const rect = parent.querySelector(selector)?.getBoundingClientRect();
  if (!rect) return {};
  else
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
    };
}
;


function useLayer(type = 'modal') {
  function getVisibleLayer() {
    const $layerComponents = Array.from(document.querySelector('.layer-wrap').children).filter(($el) => {
      const isModalComponent = $el.classList.contains('component-modal');
      const isDialogComponent = $el.classList.contains('component-dialog');

      return isModalComponent || isDialogComponent;
    });

    return $layerComponents.filter(($el) => {
      const style = window.getComputedStyle($el);
      return style.display !== 'none';
    });
  }

  function getTopDepth() {
    const $visibleLayerComponents = getVisibleLayer();
    return 100 + $visibleLayerComponents.length;
  }

  function setLayerOpacity(defaultOpacity = 0.5) {
    const $visibleLayerComponents = getVisibleLayer();
    $visibleLayerComponents.forEach(($el, index) => {
      const opacity = etUI.utils.getBlendOpacity(defaultOpacity, $visibleLayerComponents.length);

      if ($el.querySelector('.modal-dimm')) {
        $el.querySelector('.modal-dimm').style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
      }

      if ($el.querySelector('.dialog-dimm')) {
        $el.querySelector('.dialog-dimm').style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
      }
    });
  }

  // modal 떴을때 덜컹거리는 거 없애는 test 중
  function enableScrollLock() {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('header').style.paddingRight = `${scrollBarWidth}px`;
    // const scrollY = window.scrollY;
    // document.documentElement.style.overflowY = 'scroll';
    // document.body.style.position = 'fixed';
    // document.body.style.top = `-${scrollY}px`;
    // document.body.style.width = '100%';
  }

  function disableScrollLock() {
    const $visibleLayerComponents = getVisibleLayer();
    // console.log('$visibleLayerComponents', $visibleLayerComponents);
    // if ($visibleLayerComponents.length === 0) {
    //   document.documentElement.style.overflow = null;
    // }
    document.querySelector('body').style.overflow = null;
    document.querySelector('header').style.paddingRight = '';

    // const scrollY = parseInt(document.body.style.top || '0') * -1;
    // document.documentElement.style.overflowY = '';
    // document.body.style.position = '';
    // document.body.style.top = '';
    // document.body.style.width = '';
    // window.scrollTo(0, scrollY);
  }

  return {
    getVisibleLayer,
    getTopDepth,
    setLayerOpacity,
    enableScrollLock,
    disableScrollLock,
  };
}
;


function useMediaQuery(){
  function mediaQueryAction(...args){
    const gsapMediaQuery = gsap.matchMedia();

    if (gsapMediaQuery) {
      gsapMediaQuery.kill();
    }

    const mediaQueryCondition = etUI.utils.getMediaQueryCondition(etUI.config.media.names, etUI.config.media.points)

    gsapMediaQuery.add(mediaQueryCondition, ...args);

    return gsapMediaQuery;
  }

  return {
    mediaQueryAction,
  }
}
;


function useMutationState(){
  let $target, $ref = {
    $state: {}
  }, mutationObserver, render;

  function initMutationState(_$target, _render){
    $target = _$target
    render = _render;

    setMutationObserver()
    setStateByDataset()
  }

  function setStateByDataset(){
    const filteredDataset = {};
    const dataset = $target.dataset;

    Object.keys(dataset).forEach((key) => {
      if(key.startsWith('vars')){
        filteredDataset[key.replace('vars', '').toLowerCase()] = dataset[key];
      }
    })

    setState(filteredDataset)
    render();
  }

  function setMutationObserver(){
    const config = { attributes: true, childList: false, subtree: false };

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes'
          && mutation.attributeName !== 'style'
          && mutation.attributeName !== 'class'
        ) {
          setStateByDataset()
        }
      }
    };

    mutationObserver = new MutationObserver(callback);
    mutationObserver.observe($target, config);
  }

  function setState(newState){
    $ref.$state = { ...$ref.$state, ...newState };
  }

  function setDataState(newState) {
    const $newState = { ...$ref.$state, ...newState };

    Object.keys($newState).forEach((key) => {
      $target.dataset[`vars${etUI.utils.capitalize(key)}`] = $newState[key];
    })
  }

  return {
    $ref,
    setState,
    setDataState,
    initMutationState
  }
}
;


function useSelectBoxTemp() {
  const $templateCustomHTML = {
    label(text) {
      return `
        <div id="combo1-label" class="combo-label">${text}</div>
      `;
    },
    selectBtn(text) {
      return `
      <button type="button" id="combo1" class="select-box" role="combobox" aria-controls="listbox1" aria-expanded="false" aria-labelledby="combo1-label" aria-activedescendant="">
        <span style="pointer-events: none;">${text}</span>
      </button>
      `;
    },
    itemsWrap(itemsHTML) {
      return `
        <ul id="listbox1" class="select-options" role="listbox" aria-labelledby="combo1-label" tabindex="-1">
          ${itemsHTML}
        </ul>
      `;
    },
    items(item, selected = false) {
      return `
        <li role="option" class="option" aria-selected="${selected}" data-value="${item.value}">
          ${item.text}
        </li>
      `;
    },
  };

  const $templateBasicHTML = {
    label(text) {
      return `
        <div id="combo1-label" class="combo-label">${text}</div>
      `;
    },
    selectBtn(text) {
      return `
        <option value="" selected disabled hidden>${text}</option>
      `;
    },
    itemsWrap(itemsHTML) {
      return `
        <select class="select-list" required>
          ${itemsHTML}
        </select>
      `;
    },
    items(item, selected = false) {
      return `
        <option value="${item.value}">${item.text}</option>
      `;
    },
  };

  return {
    $templateCustomHTML,
    $templateBasicHTML,
  };
}
;


function useState(initialValue = {}, callback) {
  const state = new Proxy(initialValue, {
    set: (target, key, value) => {
      target[key] = value;

      if (callback) {
        callback(target);
      }
    }
  });

  const setState = (newState) => {
    Object.keys(newState).forEach((key) => {
      state[key] = newState[key];
    })
  }

  return [state, setState];
}
;


function useSwiperTmpl() {
  const $templateHTML = {
    navigation() {
      return `
        <button type="button" class="swiper-button-prev">이전</button>
        <button type="button" class="swiper-button-next">다음</button>
      `;
    },
    pagination() {
      return `
        <div class="swiper-pagination"></div>
      `;
    },
    autoplay() {
      return `
      <button type="button" class="swiper-autoplay play"></button>
      `;
    },
  };

  return {
    $templateHTML,
  };
}
;


/**
 * temp timeline
 * @returns
 */
function useTransition() {
  // select
  const useSelectShow = (target, type, option) => {
    if (!target) return;
    const timeline = gsap.timeline({ paused: true });

    const optionList = {
      fast: { duration: 0.15 },
      normal: { duration: 0.3 },
      slow: { duration: 0.7 },
    };
    const gsapOption = { ...optionList[type], ...option };

    timeline.to(target, {
      alpha: 0,
      ease: 'linear',
      onComplete() {
        target.style.display = 'none';
      },
      ...gsapOption,
    });

    return {
      timelineEl: timeline._recent.vars,
      timeline: (state) => {
        state
          ? gsap.to(target, {
              onStart: () => {
                target.style.display = 'block';
              },
              ease: 'linear',
              alpha: 1,
              ...gsapOption,
            })
          : gsap.to(target, {
              alpha: 0,
              ease: 'linear',
              onComplete() {
                target.style.display = 'none';
                target.closest('.component-select').classList.remove('show');
                target.closest('.component-select').classList.add('hide');
              },
              ...gsapOption,
            });
      },
    };
  };

  const selectDimmShow = (target) => {
    if (!target) return;

    gsap.to(target, {
      onStart: () => {
        target.style.display = 'block';
      },
      ease: 'linear',
      alpha: 0.6,
      duration: 0.15,
      overwrite: true
    })
  }

  const selectDimmClose = (target) => {
    if (!target) return;

    gsap.to(target, {
      alpha: 0,
      ease: 'linear',
      duration: 0.15,
      onComplete() {
        target.style.display = 'none';
      },
    });
  }

  return {
    useSelectShow,
    selectDimmShow,
    selectDimmClose
  };
}
;



etUI.hooks = {
useA11yKeyEvent,
useClickOutside,
useCore,
useDataset,
useDialog,
dialogTmpl,
useEventListener,
useGetClientRect,
useLayer,
useMediaQuery,
useMutationState,
useSelectBoxTemp,
useState,
useSwiperTmpl,
useTransition
}
              ;


/**
 * @typedef {Object} PropsConfig
 * @property {boolean} disabled - 요소가 비활성화 상태인지를 나타냅니다.
 * @property {boolean} once - 이벤트나 액션을 한 번만 실행할지 여부를 결정합니다.
 * @property {false | number} duration - 애니메이션 또는 이벤트 지속 시간을 밀리초 단위로 설정합니다. 'false'일 경우 지속 시간을 무시합니다.
 * @property {Object} origin - 원점 또는 시작 지점을 나타내는 객체입니다.
 */

/**
 * @typedef {Object} StateConfig
 * @property {'close' | 'open'} state - 아코디언의 상태값. close, open 둘 중에 하나입니다.
 */

/** @type {PropsConfig} */
/** @type {StateConfig} */

function Accordion() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      //props
      index: -1,
      animation: {
        duration: 0.5,
        easing: 'power4.out',
      },
      type: 'multiple',
    },
    {
      //state
      index: -1,
    },
    render,
  );

  // constant

  // variable
  const name = 'accordion';
  let component = {};
  // element, selector
  let accordionItem;
  let $target, $accordionItem, $accordionItems;

  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }

    setTarget($target, { stateCallback: _props?.stateCallback });
    setProps({ ...props, ..._props });

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();

    $target.setAttribute('data-init', 'true');
  }

  function setup() {
    setupSelector();
    setupElement();
    setupActions();

    // state
    render(true);
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  function setupSelector() {
    // selector
    accordionItem = '.accordion-item';

    // element
    $accordionItem = $target.querySelectorAll(accordionItem);
  }

  function setupElement() {
    $accordionItems = Array.from($accordionItem);
    const items = $accordionItems.map(($collapse, i) => {
      const collapse = etUI.components.Collapse();
      collapse.core.init($collapse, {
        afterOpen: props.afterOpen,
        afterClose: props.afterClose,
      });
      return collapse;
    });

    // 초기 열릴 index 결정
    let initialIndex = -1;
    const dataIndex = $target.getAttribute('data-index');
    if (dataIndex !== null) {
      const targetIndex = parseInt(dataIndex, 10);
      if (targetIndex >= 0 && targetIndex < $accordionItems.length) {
        initialIndex = targetIndex;
      }
    } else {
      if (props.type === 'separate' || props.type === 'single') {
        $accordionItems.forEach(($collapse, i) => {
          if ($collapse.dataset.state === 'open') {
            initialIndex = i;
          }
        });
      }
    }

    // **여기서 한 번만 open**
    if (initialIndex > -1) {
      setState({ index: initialIndex }, { immediate: true });
    }
  }

  function setupActions() {
    actions.open = () => {};

    actions.close = () => {};
  }

  function setEvent() {
    addEvent('click', accordionItem, ({ target }) => {
      if (props.type === 'single') {
        const collapse = target.closest(accordionItem);
        const _state = collapse.ui.core.state.state;

        if (_state === 'open') {
          const index = $accordionItems.indexOf(collapse);
          setState({ index });
        }
      }
    });
  }

  function render(immediate = false) {
    open(state.index, immediate);
  }

  function open(index, immediate) {
    index = +index;
    if (props.type === 'single') {
      $accordionItems.forEach(($item, i) => {
        if (!$item || !$item.ui) return;
        if (i !== index) {
          if ($item.ui.core && $item.ui.core.state && $item.ui.core.state.state === 'open') {
            $item.ui.close(immediate);
          }
        } else {
          // 이미 열려있으면 return
          if ($item.ui.core.state.state === 'open') return;
          $item.ui.open(immediate);
        }
      });
    } else {
      if (index !== -1 && $accordionItems[index] && $accordionItems[index].ui) {
        if ($accordionItems[index].ui.core.state.state === 'open') return;
        $accordionItems[index].ui.open(immediate);
      }
    }
  }

  function close(index, immediate) {
    if (index >= 0 && $accordionItems[index] && $accordionItems[index].ui) {
      $accordionItems[index].ui.close(immediate);
    } else if (index >= 0) {
      console.warn('Cannot close accordion item: UI not initialized for index:', index);
    }
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    update,
    open,
    close,
  };

  return component;
};


/**
 * Collapse
 */
function Collapse() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent, cleanups } = etUI.hooks.useCore(
    {
      // props
      animation: {
        duration: 0.5,
        easing: 'power2.out',
      },

      clickOutside: false,
      a11yTab: false,
    },
    {
      // state
    },
    render,
  );

  // constant

  // variable
  const name = 'collapse';
  let component = {};
  // element, selector
  let collapseTrigger, collapseContent, closeTimeline, clickOutsideCleanup;
  let $target, $collapseTrigger, $collapseContent;

  // hooks
  const { firstNodeFocusOut, lastNodeFocusOut } = etUI.hooks.useA11yKeyEvent();

  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }

    try {
      setTarget($target, { stateCallback: _props?.stateCallback });
      setProps({ ...props, ..._props });

      if ($target.ui) return;
      $target.ui = component;

      setup();
      setEvent();

      $target.setAttribute('data-init', 'true');
    } catch (error) {
      console.error('Error initializing Collapse component:', error);
      // 오류가 발생해도 기본적인 UI 상태는 설정
      if (!$target.ui) {
        $target.ui = component;
      }
    }
  }

  function setup() {
    setupTemplate();
    setupSelector();
    setupElement();
    setupActions();

    // state
    // setState({ setting: 'custom' });
    render(true);
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  function setupTemplate() {}

  function setupSelector() {
    // selector
    collapseTrigger = '.collapse-tit';
    collapseContent = '.collapse-content';

    // element
    $collapseTrigger = $target.querySelector(collapseTrigger);
    $collapseContent = $target.querySelector(collapseContent);
  }

  function setupElement() {
    // id
    const id = etUI.utils.getRandomId();

    const collapseId = `id-collapse-${id}`;
    const collapseTriggerId = `id-collapse-title-${id}`;
    const collapseContentId = `id-collapse-content-${id}`;

    $target.setAttribute('aria-expanded', false);
    $target.setAttribute('id', collapseId);
    $collapseTrigger.setAttribute('controls', collapseContentId);
    $collapseTrigger.setAttribute('id', collapseTriggerId);
    $collapseContent.setAttribute('aria-hidden', true);
    $collapseContent.setAttribute('role', 'region');
    $collapseContent.setAttribute('id', collapseContentId);
    $collapseContent.setAttribute('aria-labelledby', collapseTriggerId);
  }

  function setupActions() {
    const { duration, easing } = props.animation;

    const a11yCleanup = [];

    actions.open = (immediate = false) => {
      $collapseTrigger.setAttribute('aria-expanded', true);
      $collapseContent.setAttribute('aria-hidden', false);

      if (closeTimeline) {
        closeTimeline.kill();
      }

      gsap.set($collapseContent, { height: 'auto', display: 'block', paddingTop: null, paddingBottom: null });
      gsap.timeline().from($collapseContent, {
        duration: immediate ? 0 : duration,
        ease: easing,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        overwrite: true,
        onComplete() {
          if (props.scrollTo) {
            gsap.to(window, {
              scrollTo: {
                y: $target,
                offsetY: 2 * ($collapseContent.offsetTop - $collapseTrigger.offsetTop),
              },
            });
          }

          if (props.a11yTab) {
            a11yCleanup.push(
              lastNodeFocusOut(etUI.utils.lastNode(tabbable.tabbable($collapseContent)), () => {
                setState({ state: 'close' });
              }),
            );
          }
          if (props.afterOpen) {
            props.afterOpen({
              target: $target,
            });
          }
        },
      });

      if (props.clickOutside) {
        clickOutsideCleanup = useClickOutside($target, () => {
          setState({ state: 'close' });
        });
      }
    };

    actions.close = (immediate = false) => {
      if (clickOutsideCleanup) {
        clickOutsideCleanup();
      }

      $collapseTrigger.setAttribute('aria-expanded', false);
      $collapseContent.setAttribute('aria-hidden', true);

      closeTimeline = gsap.timeline().to($collapseContent, {
        duration: immediate ? 0 : duration,
        ease: easing,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        overwrite: true,
        onComplete() {
          $collapseContent.style.display = 'none';
          etUI.utils.allCleanups(a11yCleanup);
          if (props.afterClose) {
            props.afterClose({
              target: $target,
            });
          }
        },
      });
    };
  }

  function setEvent() {
    addEvent('click', collapseTrigger, ({ target }) => {
      try {
        if (state.state === 'open') {
          setState({ state: 'close' });
        } else {
          setState({ state: 'open' });
        }
      } catch (error) {
        console.error('Error handling collapse click event:', error);
      }
    });

    if (props.a11yTab) {
      firstNodeFocusOut($collapseTrigger, () => {
        setState({ state: 'close' });
      });
    }
  }

  function render(immediate = false) {
    const isShow = state.state === 'open';
    isShow ? actions.open(immediate) : actions.close(immediate);
  }

  function open(immediate = false) {
    setState({ state: 'open' }, { immediate });
  }

  function close(immediate = false) {
    setState({ state: 'close' }, { immediate });
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    update,
    open,
    close,
  };

  return component;
}
;


function DatepickerComp() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      // props
      language: 'ko',
      daysOfWeekHighlighted: [0, 6],
      autohide: true,
    },
    {
      // state
    },
    render,
  );

  // constant
  const MARGIN = 20;

  // variable
  const name = 'datepicker';
  // eslint-disable-next-line prefer-const
  let component = {};
  // element, selector
  let $target, $datepicker, $datepickerTrigger, $selectLabel, $rangeStart, $rangeEnd;
  let rangeStart, rangeEnd, datepickerTrigger;

  Datepicker.locales.ko = {
    days: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    daysShort: ['일', '월', '화', '수', '목', '금', '토'],
    daysMin: ['일', '월', '화', '수', '목', '금', '토'],
    months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    today: '오늘',
    clear: '삭제',
    format: 'yyyy-mm-dd',
    titleFormat: 'y년 m월',
    weekStart: 0,
  };

  /**
   * init
   * @param _$target
   * @param _props
   */
  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }

    setTarget($target);
    setProps({ ...props, ..._props });

    if (props.type === 'range') $target = $target.closest('.component-rangepicker');

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();

    $target.setAttribute('data-init', 'true');
  }

  function setup() {
    setupSelector();
    setupTemplate();
    setupElement();
    setupActions();

    // state
    setState({ state: props.state });
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  // frequency
  function setupTemplate() {
  }

  function setupSelector() {
    datepickerTrigger = '.datepicker-btn-trigger';
    rangeStart = 'range-start';
    rangeEnd = 'range-end';
  }

  function setupElement() {
    const { type } = props;
    // id
    const labelId = etUI.utils.getRandomUIID(name);

    // a11y
    etUI.utils.setProperty($target, $selectLabel, 'id', labelId);

    if (props.type === 'range') {
      $rangeStart = $target.querySelector(`[name="${rangeStart}"]`);
      $rangeEnd = $target.querySelector(`[name="${rangeEnd}"]`);
    } else {
      $datepickerTrigger = $target.querySelector(datepickerTrigger);
    }

    // $datepicker 정의
    if (type === 'range') {
      $datepicker = new DateRangePicker($target, { ...props });
    } else {
      $datepicker = new Datepicker($datepickerTrigger, { ...props });
    }
  }

  function setupActions() {
    actions.open = () => {};

    actions.close = () => {};
  }

  function setEvent() {
  }

  function render() {
  }

  function open() {}

  function close() {}

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    // callable
    update,
    open,
    close,
    getDatepickerInstance() {
      return $datepicker;
    },
  };

  return component;
}
;


/**
 *  Modal
 */
function Dialog() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      // props
      dimmClick: true,
      esc: true,
      title: null,
      message: '',
      type: 'alert',
      positiveText: etUI.$t('dialog.positive', '확인'),
      negativeText: etUI.$t('dialog.negative', '취소'),
    },
    {
      state: 'close',
      trigger: null,
    },
    render,
    {
      dataset: false,
    },
  );

  // constant
  const DIMM_OPACITY = etUI.config.layer.dimmOpacity;

  // variable
  const name = 'dialog';
  let component = {};
  let modalDimmSelector, modalCloseBtnSelector, modalBtnPositive, modalBtnNegative;
  let $target, $modal, $modalTitle, $modalContainer, $modalDimm, $modalBtnPositive, $modalBtnNegative, focusTrapInstance, callback;

  /**
   * init
   * @param _$target
   * @param _props
   */
  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('target이 존재하지 않습니다.');
    }

    setTarget($target, { stateCallback: _props?.stateCallback });
    setProps({ ...props, ..._props });

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();

    // $target.setAttribute('data-init', 'true');
  }

  function setup() {
    setupTemplate();
    setupSelector();
    setupElement();
    setupActions();

    // focus trap
    focusTrapInstance = focusTrap.createFocusTrap($modal, {
      escapeDeactivates: props.esc,
      onActivate: actions.focusActivate,
      onDeactivate: actions.focusDeactivate,
    });

    // state
    // setState({ state: props.state });
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
  }

  // frequency
  function setupTemplate() {
    const { $templateHTML, $templatePreviewImageHTML } = etUI.templates.dialogTmpl();

    if (props.dialogType === 'alert' || props.dialogType === 'confirm') {
      $target.insertAdjacentHTML('beforeend', $templateHTML(props));
    } else if (props.dialogType === 'previewImage') {
      $target.insertAdjacentHTML('beforeend', $templatePreviewImageHTML(props));
    }

    $modal = $target.querySelector('.component-dialog');
  }

  function setupSelector() {
    // selector
    modalCloseBtnSelector = '.dialog-close';
    modalDimmSelector = '.dialog-dimm';

    // element
    $modalTitle = $modal.querySelector('.dialog-tit');
    $modalDimm = $modal.querySelector(modalDimmSelector);
    $modalContainer = $modal.querySelector('.dialog-container');

    modalBtnPositive = '.dialog-positive';
    modalBtnNegative = '.dialog-negative';
    $modalBtnPositive = $modal.querySelector('.dialog-positive');
    $modalBtnNegative = $modal.querySelector('.dialog-negative');
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit');
    // // a11y

    if (props.dialogType === 'alert' || props.dialogType === 'confirm') {
      etUI.utils.setProperty($modal, 'role', 'alertdialog');
    } else if (props.dialogType === 'previewImage') {
      etUI.utils.setProperty($modal, 'role', 'dialog');

      const $swiper = $modal.querySelector('.component-swiper');
      const swiper = new etUI.components.SwiperComp();
      swiper.core.init($swiper, {
        navigation: true,
        pagination: true,
      });
    }

    etUI.utils.setProperty($modal, 'aria-modal', 'true');
    etUI.utils.setProperty($modal, 'id', id);
    if ($modalTitle) etUI.utils.setProperty($modalTitle, 'id', titleId);
    etUI.utils.setProperty($modal, 'aria-labelledby', titleId);
    etUI.utils.setProperty($modal, 'tabindex', '-1');
  }

  function setupActions() {
    const { getTopDepth, setLayerOpacity, enableScrollLock, disableScrollLock } = etUI.hooks.useLayer();

    actions.focusActivate = () => {};

    actions.focusDeactivate = () => {
      if (!state.trigger) {
        callback = props.negativeCallback;
      }
      actions.close();
    };

    actions.open = () => {
      const zIndex = getTopDepth();

      $modal.style.display = 'block';
      $modal.style.zIndex = zIndex;

      // if (props.dialogType === 'youtube') {
      // }
      enableScrollLock();

      setLayerOpacity(DIMM_OPACITY);

      gsap.timeline().to($modalDimm, { duration: 0, display: 'block', opacity: 0 }).to($modalDimm, {
        duration: 0.15,
        opacity: 1,
      });

      gsap
        .timeline()
        .to($modalContainer, {
          duration: 0,
          display: 'block',
          opacity: 0,
          scale: 0.95,
          yPercent: 2,
        })
        .to($modalContainer, { duration: 0.15, opacity: 1, scale: 1, yPercent: 0, ease: 'Power2.easeOut' });

      // 스크롤 위치 저장 및 스크롤 잠금
      // component.scrollY = window.scrollY;
      // document.body.classList.add('no-scroll');
      // document.body.style.top = `-${component.scrollY}px`;
    };

    actions.close = () => {
      gsap.timeline().to($modalDimm, {
        duration: 0.15,
        opacity: 0,
        onComplete() {
          $modalDimm.style.display = 'none';
        },
      });

      gsap.timeline().to($modalContainer, {
        duration: 0.15,
        opacity: 0,
        scale: 0.95,
        yPercent: 2,
        ease: 'Power2.easeOut',
        onComplete() {
          $modalContainer.style.display = 'none';
          $modal.style.display = 'none';
          $modal.style.zIndex = null;

          setLayerOpacity(DIMM_OPACITY);

          destroy();

          $target.removeChild($modal);

          // 스크롤 잠금 해제 및 위치 복원
          // document.body.classList.remove('no-scroll');
          // window.scrollTo(0, component.scrollY);
          // document.body.style.top = '';

          if (callback) {
            callback();
          }
        },
      });

      disableScrollLock();


    };
  }

  function setEvent() {
    addEvent('click', modalCloseBtnSelector, () => {
      close();
    });

    if (props.dimmClick) {
      addEvent('click', modalDimmSelector, close);
    }

    addEvent('click', modalBtnPositive, () => {
      if (props.callback) {
        callback = props.callback;
      } else if (props.positiveCallback) {
        callback = props.positiveCallback;
      }

      close('btnPositive');
    });
    addEvent('click', modalBtnNegative, () => {
      callback = props.negativeCallback;

      close('btnNegative');
    });
  }

  function render() {
    const isOpened = state.state === 'open';

    if (isOpened) {
      actions.open();

      focusTrapInstance.activate();
    } else {
      focusTrapInstance.deactivate();
    }
  }

  function open() {
    setState({ state: 'open' });
  }

  function close(trigger) {
    setState({ state: 'close', trigger });
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },
    update,
    open,
    close,
  };

  return component;
}
;


/**
 * Input
 */
function Input() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      // props
    },
    {
      // state
    },
    render,
  );

  // constant
  const MARGIN = 20;

  // variable
  const name = 'input';
  // eslint-disable-next-line prefer-const
  let component = {};
  // element, selector
  let $target, $inputTarget, $checkboxs, $checkboxLength;
  let inputType, checkboxs;

  /**
   * init
   * @param _$target
   * @param _props
   */
  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }

    setTarget($target);
    setProps({ ...props, ..._props });

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();

    $target.setAttribute('data-init', 'true');
  }

  function setup() {
    // template, selector, element, actions
    setupSelector();
    setupElement();
    setupTemplate(); // element에서 요소를 체크해서 템플릿에 들어가므로 순서가 바뀜
    setupActions();

    // state
    setState({ state: props.state });
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  // frequency
  function setupTemplate() {
    const { $templateHTML } = etUI.templates.inputTmpl();
    // $target.innerHTML = ``;
    // etUI.locales[etUI.config.locale.default]
    if (props.clear) {
      $inputTarget.insertAdjacentHTML('afterend', $templateHTML.clearButton());
    }
    if (props.togglePassword) {
      $inputTarget.insertAdjacentHTML('afterend', $templateHTML.togglePassword());
    }
    if (props.loading) {
      $inputTarget.insertAdjacentHTML('afterend', $templateHTML.loading());
    }
    if (props.searchBox) {
      $inputTarget.insertAdjacentHTML('afterend', $templateHTML.searchBox());
    }
  }

  function setupSelector() {
    if ($target.querySelector('input[type="checkbox"]')) {
      checkboxs = 'input[type="checkbox"]';
    }
  }

  function setupElement() {
    // id
    const labelId = etUI.utils.getRandomUIID(name);

    // a11y
    // etUI.utils.setProperty($target, $selectLabel, 'id', labelId);

    $inputTarget = $target.querySelector('input');

    // if (!$inputTarget) return;

    if ($target.querySelector('input[type="file"]')) {
      inputType = 'file';
    } else if ($target.querySelector('input[type="checkbox"]')) {
      inputType = 'checkbox';
    } else if ($target.querySelector('input[type="radio"]')) {
      inputType = 'radio';
    } else if ($target.querySelector('input[type="password"]')) {
      inputType = 'password';
    } else if ($target.querySelector('textarea')) {
      inputType = 'textarea';
      $inputTarget = $target.querySelector('textarea');
    } else {
      inputType = 'text';
    }

    // component custom element
    if (props.count) {
      $target.querySelector('.textarea-count-total').textContent = props.count;
      $target.querySelector('.textarea-count').style.opacity = 1;
    }
    if (props.allCheck) {
      $checkboxLength = $target.querySelectorAll('.agree-area input').length;
      $checkboxs = [...$target.querySelectorAll('input[type="checkbox"]')];
    }
    if ($inputTarget.hasAttribute('disabled')) {
      $target.classList.add('input-disabled')
    }
    if ($inputTarget.hasAttribute('readonly')) {
      $target.classList.add('input-readonly')
    }
  }

  let v = '';

  function setupActions() {
    actions.open = () => {};

    actions.close = () => {};

    actions.checkBytes = (e) => {
      const { target } = e;
      let length = 0;
      if (props.multibyte) {
        length = etUI.utils.countCharacters(target.value);
      } else {
        length = target.value.length;
      }

      if (props.countLimit) {
        if (length > props.count) {
          target.value = v;
        } else {
          v = target.value;
          $target.querySelector('.textarea-count-num').textContent = length;
        }
      } else {
        $target.querySelector('.textarea-count-num').textContent = length;

        if (length > props.count) {
          $target.querySelector('.textarea-count-num').classList.add('over');
        } else {
          $target.querySelector('.textarea-count-num').classList.remove('over');
        }
      }
    };

    actions.showClearButton = (e) => {
      if ($inputTarget.value.length > 0) {
        $target.querySelector('.input-field-btn.clear').style.display = 'block';
      } else {
        $target.querySelector('.input-field-btn.clear').style.display = 'none';
      }
    };

    // 자동검색 영역
    actions.searchBox = (e) => {
      if (!$target.querySelector('.search-bar-box')) return;

      if ($inputTarget.value.length > 0) {
        $target.querySelector('.search-bar-box').style.display = 'block';
      } else {
        $target.querySelector('.search-bar-box').style.display = 'none';
      }
    }

    actions.clearText = ({ target }) => {
      $inputTarget.value = '';
      $inputTarget.focus();
      actions.showClearButton();
      actions.searchBox();
    };

    actions.togglePassword = ({ currentTarget }) => {
      if ($inputTarget.type === 'password') {
        $inputTarget.type = 'text';
        currentTarget.querySelector('.password-state').classList.add('show');
      } else {
        $inputTarget.type = 'password';
        currentTarget.querySelector('.password-state').classList.remove('show');
      }
    };

    // 전체 체크 버튼
    actions.allCheck = ({target}) => {
      const allCheckBtn = $target.querySelectorAll('.all-agree-item input[type="checkbox"]')[0];
      let checkboxEls = target === allCheckBtn ? $target.querySelector('.agree-area') : target.closest('.agree-item').querySelector('.sub-agree-item');
      checkboxEls.querySelectorAll('input[type="checkbox"]').forEach($checkbox => $checkbox.checked = target.checked);
    }

    // 전체 checkbox의 checked 확인
    actions.checkAllAgree = () => {
      const allCheckBtn = $target.querySelector('.all-agree-item input[type="checkbox"]');
      const checkboxList = [...$target.querySelectorAll('.agree-area input')];

      requestAnimationFrame(() => {
        allCheckBtn.checked = checkboxList.every((item) => item.checked);
      });
    };

    // 서브 checkbox의 checked 확인
    actions.checkAllSubAgree = ({ target }) => {
      const agreeItem = target.closest('.agree-item');
      if (!agreeItem) return;

      const subAllCheckBtn = agreeItem.querySelector('.sub-all-agree input[type="checkbox"]');
      const subCheckboxList = [...agreeItem.querySelectorAll('.sub-agree-item input[type="checkbox"]')];

      if (!subAllCheckBtn) return;

      if (target === subAllCheckBtn) {
        subCheckboxList.forEach((checkbox) => {
          checkbox.checked = subAllCheckBtn.checked;
        });
      } else {
        subAllCheckBtn.checked = subCheckboxList.every((checkbox) => checkbox.checked);
      }
    };
  }

  function setEvent() {
    const { allCheck, subCheck } = props;

    if (props.clear) {
      addEvent('input', 'input', actions.showClearButton);
      addEvent('input', 'textarea', actions.showClearButton);
      addEvent('click', '.input-field-btn.clear', actions.clearText);
    }

    if (props.search) {
      addEvent('input', 'input', actions.searchBox);
    }

    if (inputType === 'textarea') {
      if (props.count) addEvent('input', 'textarea', actions.checkBytes);
    } else if (inputType === 'text') {
    } else if (inputType === 'password') {
      if (props.togglePassword) {
        addEvent('click', '.input-field-btn.password-state', actions.togglePassword);
      }
    } else if (inputType === 'checkbox') {
      if (allCheck) {
        addEvent('change', '.all-agree-item input[type="checkbox"]', actions.allCheck);
        addEvent('change', '.agree-area input', actions.checkAllAgree);
      }
      if (subCheck) {
        addEvent('change', '.sub-agree-item input', actions.checkAllSubAgree);
        addEvent('change', '.sub-all-agree input[type="checkbox"]', actions.checkAllSubAgree);
      }
    }
  }

  function render() {
    // render
  }

  function getLength() {
    if (inputType.match(/text|textarea|password/g)) {
      return $inputTarget.value.length;
    }
  }

  function getByteLength() {
    if (inputType.match(/text|textarea|password/g)) {
      return etUI.utils.countCharacters($inputTarget.value);
    }
  }

  function updateClearButton() {
    etUI.utils.triggerEvent($inputTarget, 'input');
  }

  function showLoading(bool = true) {
    if (bool) {
      $target.querySelector('.input-field-ico.spinner').style.display = 'block';
    } else {
      $target.querySelector('.input-field-ico.spinner').style.display = 'none';
    }
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    // callable
    update,
    getLength,
    getByteLength,
    updateClearButton,
    showLoading,
  };

  return component;
}
;


/**
 * lottie
 */
function Lottie() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      loop: true,
      autoplay: true,
      scroll: false,
      // props
    },
    {
      // state
    },
    render,
  );

  // constant
  const MARGIN = 20;

  // variable
  const name = 'lottie';
  // eslint-disable-next-line prefer-const
  let component = {};
  // element, selector
  let $target;
  let lottieInstance;

  /**
   * init
   * @param _$target
   * @param _props
   */
  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }

    setTarget($target);
    setProps({ ...props, ..._props });

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();

    $target.setAttribute('data-init', 'true');
  }

  function setup() {
    // template, selector, element, actions
    setupTemplate();
    setupSelector();
    setupElement();
    setupActions();

    // state
    // setState({ state: props.state });
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector() {}

  function setupElement() {
    lottieInstance = lottie.loadAnimation({
      container: $target, // the dom element that will contain the animation
      renderer: 'svg',
      loop: props.loop,
      autoplay: props.scroll ? false : props.autoplay,
      path: `${etUI.config.lottie.basePath}/${props.name}.json`, // the path to the animation json
    });

    if (props.scroll) {
      ScrollTrigger.create({
        trigger: $target,
        start: 'top bottom',
        end: 'bottom top',
        markers: true,
        onEnter: () => {
          lottieInstance.play();
        },
        onEnterBack: () => {
          lottieInstance.play();
        },
        onLeave: () => {
          lottieInstance.pause();
        },
        onLeaveBack: () => {
          lottieInstance.pause();
        },
      });
    }
  }

  function setupActions() {}

  function setEvent() {}

  function render() {
    // render
  }

  function play() {
    lottieInstance.play();
  }

  function stop() {
    lottieInstance.stop();
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    // callable
    update,
    play,
    stop,
    getLottieInstance: () => lottieInstance,
  };

  return component;
}
;


/**
 *  Modal
 */
function Modal() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      // props
      dimmClick: true,
      clickOutside: false,
      esc: true,
      type: 'default',
    },
    {
      // state
    },
    render,//
  );

  const { mediaQueryAction } = etUI.hooks.useMediaQuery();
  // constant
  const DIMM_OPACITY = etUI.config.layer.dimmOpacity;

  // variable
  const name = 'modal';
  let component = {};

  let focusTrapInstance, modalDimmSelector, modalCloseBtnSelector, clickOutsideCleanup;
  let $target, $modalTitle, $modalContainer, $modalDimm, $modalContent;
  let _callback;

  /**
   * init
   * @param _$target
   * @param _props
   */
  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }

    setTarget($target);
    setProps({ ...props, ..._props });

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();

    $target.setAttribute('data-init', 'true');
  }

  function setup() {
    setupTemplate();
    setupSelector();
    setupElement();
    setupActions();

    // focus trap
    if (!$target.classList.contains('search')) {
      focusTrapInstance = focusTrap.createFocusTrap($target, {
        escapeDeactivates: props.esc,
        onActivate: actions.focusActivate,
        onDeactivate: actions.focusDeactivate,
        allowOutsideClick: props.clickOutside ? true : false,
      });
    } else {
      focusTrapInstance = null;
    }

    // state
    // setState({ state: props.state });

    if (state.state === 'open') {
      actions.open();
    }
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector() {
    // selector
    modalCloseBtnSelector = '.modal-close';
    modalDimmSelector = '.modal-dimm';

    // element
    $modalTitle = $target.querySelector('.modal-tit');
    $modalDimm = $target.querySelector(modalDimmSelector);
    $modalContainer = $target.querySelector('.modal-container');
    $modalContent = $target.querySelector('.modal-content');
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit');

    // a11y
    etUI.utils.setProperty($target, 'role', 'dialog');
    etUI.utils.setProperty($target, 'aria-modal', 'true');
    etUI.utils.setProperty($target, 'id', id);
    if ($modalTitle) etUI.utils.setProperty($modalTitle, 'id', titleId);
    etUI.utils.setProperty($target, 'aria-labelledby', titleId);
    etUI.utils.setProperty($target, 'tabindex', '-1');

  }

  function setupActions() {
    const { getTopDepth, setLayerOpacity, enableScrollLock, disableScrollLock } = etUI.hooks.useLayer();

    actions.focusActivate = () => { };

    actions.focusDeactivate = () => {
      close();
    };

    actions.open = () => {
      $target.style.display = 'block';

      setLayerOpacity(DIMM_OPACITY);
      enableScrollLock();

      if ($modalDimm) gsap.timeline().to($modalDimm, { duration: 0, display: 'block', opacity: 0 }).to($modalDimm, { duration: 0.15, opacity: 1 });

      gsap
        .timeline()
        .to($modalContainer, { duration: 0, display: 'flex' })
        .to($modalContainer, {
          duration: 0.15,
          opacity: 1,
          ease: 'Power2.easeOut',
          onComplete() {
            const clientHeight = $modalContent.clientHeight;
            const scrollHeight = $modalContent.scrollHeight;

            // a11y: 스크롤할 컨텐츠가 있을 경우 tabindex 추가
            if (clientHeight < scrollHeight) {
              $modalContent.setAttribute('tabindex', '0');
            } else {
              $modalContent.removeAttribute('tabindex');
            }
          },
        });

      if (_callback) {
        _callback();
      }

      if (props.clickOutside) {
        clickOutsideCleanup = useClickOutside($target, () => {
          setState({ state: 'close' });
        }, [props.triggerBtn]);
      }
    };

    actions.close = () => {
      if (clickOutsideCleanup) {
        clickOutsideCleanup();
      }

      // input 있을 때 value값 초기화
      if ($target.querySelector('input')) {
        const inputs = $target.querySelectorAll('input');
        inputs.forEach($input => {
          $input.value = '';
        })
      }

      if ($modalDimm) {
        gsap.timeline().to($modalDimm, {
          duration: 0.15,
          opacity: 0,
          onComplete() {
            $modalDimm.style.display = 'none';
          },
        });
      }

      gsap.timeline().to($modalContainer, {
        duration: 0.15,
        opacity: 0,
        ease: 'Power2.easeOut',
        onComplete() {
          $modalContainer.style.display = 'none';
          $target.style.display = 'none';

          setLayerOpacity(DIMM_OPACITY);
          disableScrollLock();
        },
      });
    };
  }

  function setEvent() {
    addEvent('click', modalCloseBtnSelector, close);

    if (props.dimmClick) {
      addEvent('click', modalDimmSelector, close);
    }
  }

  function render() {
    let isOpened = state.state === 'open';
    const { type } = props;

    if (isOpened) {
      actions.open();
      if (focusTrapInstance) focusTrapInstance.activate();
    } else {
      actions.close();
      if (focusTrapInstance) focusTrapInstance.deactivate();
    }
  }

  function open(callback) {
    _callback = callback;
    setState({ state: 'open' });
  }

  function close() {
    setState({ state: 'close' });
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },
    update,
    open,
    close,
  };

  return component;
}
;


function SelectBox() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      type: 'custom',
      label: '',
      default: '',
      items: [],
      selectedIndex: 0,
      transition: 'fast',
      scrollTo: false,
      gsapOption: {},
      state: 'close',
    },
    {},
    render,
  );
  const { $templateCustomHTML, $templateBasicHTML } = etUI.templates.selectBoxTmpl();
  const { useSelectShow, selectDimmShow, selectDimmClose } = etUI.hooks.useTransition();

  // constant
  const MARGIN = 20;

  // variable
  const name = 'select';
  // eslint-disable-next-line prefer-const
  let component = {};
  let $target,
    // 요소관련 변수들
    selectLabel,
    selectComboBox,
    selectListBox,
    selectOption,
    timeline,
    selectClose,
    selectDimm;

  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }


    setTarget($target);
    setProps({ ...props, ..._props });

    if ($target.querySelector('.select-list')) {
      return;
    }
    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();
  }

  function setup() {
    $target.setAttribute('data-init', 'true');
    setupTemplate();

    if (props.type === 'basic') return;

    setupSelector();
    setupElement();
    setupActions();

    // effect
    timeline = useSelectShow($target.querySelector(selectListBox), props.transition, props.gsapOption).timeline;

    // state
    actions[props.state || state.state]?.();
  }

  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;

    destroy();
    $target.ui = component;
    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  // frequency
  function setupTemplate() {
    if (props.type === 'bottomSheet') {
      $target.insertAdjacentHTML('beforeend', `<div class="select-dimm"></div>`)
    }

    // options값 script로 넣을 때
    if (props.items.length < 1) return;
    if (props.type === 'custom') {
      const { selectedIndex } = props;
      const itemListTemp = props.items.map((item) => $templateCustomHTML.items(item)).join('');

      $target.innerHTML = `
        ${props.label && $templateCustomHTML.label(props.label)}
        ${props.default ? $templateCustomHTML.selectBtn(props.default) : $templateCustomHTML.selectBtn(props.items.find((item) => item.value == props.items[selectedIndex].value).text)}
        ${props.items && $templateCustomHTML.itemsWrap(itemListTemp)}
      `;
    }  else {
      const selectBtnTemp = $templateBasicHTML.selectBtn(props.default);
      const itemListTemp = props.items.map((item) => $templateBasicHTML.items(item)).join('');

      $target.innerHTML = `
        ${props.label && $templateBasicHTML.label(props.label)}
        ${props.items && $templateBasicHTML.itemsWrap(selectBtnTemp + itemListTemp)}
      `;
    }
  }
  function setupSelector() {
    selectLabel = '.combo-label';
    selectComboBox = '.select-box';
    selectListBox = '.select-options';
    selectOption = '.option';
    selectDimm = '.select-dimm';
    selectClose = '.select-close';
  }

  function setupElement() {
    // id
    const labelId = etUI.utils.getRandomUIID(name);
    const comboBoxId = etUI.utils.getRandomUIID('combobox');
    const listBoxId = etUI.utils.getRandomUIID('listbox');

    // a11y
    etUI.utils.setProperty($target, selectLabel, 'id', labelId);
    etUI.utils.setProperty($target, selectComboBox, 'id', comboBoxId);
    etUI.utils.setProperty($target, selectComboBox, 'role', 'combobox');
    etUI.utils.setProperty($target, selectComboBox, 'aria-labelledby', labelId);
    etUI.utils.setProperty($target, selectComboBox, 'aria-controls', listBoxId);
    etUI.utils.setProperty($target, selectListBox, 'id', listBoxId);
    etUI.utils.setProperty($target, selectListBox, 'role', 'listbox');
    etUI.utils.setProperty($target, selectListBox, 'aria-labelledby', labelId);
    etUI.utils.setProperty($target, selectListBox, 'tabindex', -1);

    // select property
    const options = $target.querySelectorAll(selectOption);
    options.forEach((el, index) => {
      const optionId = etUI.utils.getRandomUIID('option');

      $target[index] = el;
      el['index'] = index;
      el.setAttribute('id', optionId);
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', false);

      props.items[index]?.disabled && el.setAttribute('disabled', '');

      if (!$target['options']) $target['options'] = [];
      $target['options'][index] = el;
    });

    !props.default && selectItem(options[props.selectedIndex]);
  }

  function setupActions() {
    let selectIndex = isNaN($target.selectedIndex) ? -1 : $target.selectedIndex;

    function updateIndex(state) {
      if (!state) return;
      selectIndex = isNaN($target.selectedIndex) ? -1 : $target.selectedIndex;
      updateCurrentClass($target[selectIndex]);
    }
    function keyEventCallback() {
      updateCurrentClass($target[selectIndex]);
      etUI.utils.setProperty($target, selectComboBox, 'aria-activedescendant', $target[selectIndex].id);
      $target.querySelector(`${selectComboBox} :last-child`).textContent = $target[selectIndex].textContent;
    }
    actions.open = () => {
      $target.querySelector(selectComboBox)?.focus();
      openState();
      updateIndex(true);
    };
    actions.close = () => {
      $target.querySelector(`${selectComboBox} :last-child`).textContent = $target['options'][$target.selectedIndex]?.textContent ?? props.default;
      closeState();
    };
    actions.select = () => {
      const currentEl = $target.querySelector('.current');
      selectItem(currentEl);
      closeState();
    };
    actions.first = () => {
      selectIndex = 0;
      keyEventCallback();
    };
    actions.last = () => {
      selectIndex = $target['options'].length - 1;
      keyEventCallback();
    };
    actions.up = () => {
      selectIndex = Math.max(--selectIndex, 0);
      keyEventCallback();
    };
    actions.down = () => {
      selectIndex = Math.min(++selectIndex, $target['options'].length - 1);
      keyEventCallback();
    };

    component.open = actions.open;
    component.close = actions.close;
  }

  function setEvent() {
    if (props.type === 'basic' || $target.classList.contains('select-disabled')) return;

    // a11y
    const actionList = {
      up: ['ArrowUp'],
      down: ['ArrowDown'],
      first: ['Home', 'PageUp'],
      last: ['End', 'PageDown'],
      close: ['Escape'],
      select: ['Enter', ' '],
    };

    addEvent('blur', selectComboBox, (e) => {
      if (e.relatedTarget?.role === 'listbox') return;
      actions.close();
    });

    addEvent('click', selectComboBox, ({ target }) => {
      const toggleState = state.state === 'open' ? 'close' : 'open';
      actions[toggleState]?.();
    });

    // a11y
    addEvent('keydown', selectComboBox, (e) => {
      if (state.state === 'close') return;

      const { key } = e;
      const action = Object.entries(actionList).find(([_, keys]) => keys.includes(key));

      if (action) {
        e.preventDefault();
        const [actionName] = action;
        actions[actionName]?.();
      }
    });

    addEvent('click', selectListBox, ({ target }) => {
      if (target.role !== 'option') return;
      updateCurrentClass(target);
      actions.select();
    });

    // 바텀 시트 타입일때 dimm, close 버튼 눌렀을 때 닫힘
    if (props.type === 'bottomSheet') {
      addEvent('click', selectDimm, actions.close)
      addEvent('click', selectClose, actions.close)
    }

    etUI.hooks.useEventListener(window, 'resize', () => {
      actions.close();
    })
  }

  function render() {
    const isOpened = state.state === 'open';
    props.transition && timeline(isOpened);
    checkOpenDir(isOpened);

    etUI.utils.setProperty($target, selectComboBox, 'aria-expanded', isOpened);

    const selectedEl = $target.querySelector('[aria-selected="true"]');
    if (isOpened) etUI.utils.setProperty($target, selectComboBox, 'aria-activedescendant', selectedEl?.id ?? '');
    else etUI.utils.setProperty($target, selectComboBox, 'aria-activedescendant', '');
  }

  // custom
  function checkOpenDir(state) {
    if (!state || props.scrollTo) return; // false이거나 scrollTo 기능 있을 때 - 아래로 열림

    const { height: listHeight } = etUI.hooks.useGetClientRect($target, selectListBox);
    const { height: comboHeight, bottom: comboBottom } = etUI.hooks.useGetClientRect($target, selectComboBox);
    const role = window.innerHeight - MARGIN < comboBottom + listHeight;

    etUI.utils.setStyle($target, selectListBox, 'bottom', role ? comboHeight + 'px' : '');
  }

  // update .current class
  function updateCurrentClass(addClassEl) {
    $target.querySelector('.current')?.classList.remove('current');
    addClassEl?.classList.add('current');
  }

  // select item
  function selectItem(target) {
    const targetOption = target?.closest(selectOption);

    if (!targetOption) return;

    $target.selectedIndex = targetOption['index'];
    $target.value = targetOption.getAttribute('data-value');

    etUI.utils.setProperty($target, '[aria-selected="true"]', 'aria-selected', false);
    targetOption.setAttribute('aria-selected', true);

    updateCurrentClass($target.querySelector('[aria-selected="true"]'));
    $target.querySelector(`${selectComboBox} :last-child`).textContent = targetOption.textContent;
  }

  // select state
  function openState() {
    setState({ state: 'open' });
    props.type === 'bottomSheet' && selectDimmShow($target.querySelector(selectDimm));
  }

  function closeState() {
    setState({ state: 'close' });
    document.documentElement.style.overflow = null;
    props.type === 'bottomSheet' && selectDimmClose($target.querySelector(selectDimm));
  }

  component = {
    core: {
      state,
      props,

      init,
      removeEvent,
      destroy,
    },

    update,
    open,
    close,
    selectItem,
  };

  return component;
}
;


/**
 * SwiperComp
 */
function SwiperComp() {
  const { actions, props, state, setState, setProps, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      loop: false,
      observer: true,
      // updateOnWindowResize: false,
      on: {
        slideChangeTransitionEnd() {
          setState({ activeIndex: this.realIndex + 1 });
        },
      },
    },
    {
      state: '',
      running: '',
      activeIndex: 0,
    },
    render,
  );

  /**
   * data-props 리스트
   */

  // constant
  const MARGIN = 20;

  // variable
  const name = 'swiper';
  let component = {},
    className = '';
  // element, selector
  let $target, $swiper, $swiperNavigation, $swieprProgress;
  let swiperButtonPrev, swiperButtonNext, swiperPagination, swiperAutoplay, $swiperSlideToButton;
  let exceptionClassName, swiperLength, swiperPerView;

  /**
   * init
   * @param _$target
   * @param _props
   */
  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }

    setTarget($target);

    setProps({ ...props, ..._props });

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();
    $target.setAttribute('data-init', 'true');
  }

  function setup() {
    // template, selector, element, actions
    setupSelector();
    setupTemplate();
    setupElement();
    setupActions();

    // state
    setState({ state: props.state });
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();
    $target.ui = component;
    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  // frequency
  function setupTemplate() {
    const { navigation, pagination, paginationType, paginationClass, navigationClass ,autoplay, freeMode, indicatorTexts } = props; // Add indicatorTexts here
    const { $templateHTML } = etUI.templates.swiperTmpl();
    let swiperControls;

    const $swiperControls = document.createElement('div');
    $swiperControls.classList.add('swiper-controls');

    if ($target.querySelector('.swiper-controls')) {
      swiperControls = $target.querySelector('.swiper-controls');
    } else {
      swiperControls = $swiperControls;
      $target.appendChild(swiperControls);
    }

    if ($target.querySelectorAll('.swiper-slide').length < 2 && !$target.classList.contains('flow')) {
      swiperControls.style.opacity = 0;
      swiperControls.style.visibility = 'hidden';
      return;
    }

    if (navigation) {
      swiperControls.insertAdjacentHTML('beforeend', $templateHTML.navigation(navigationClass));
      // if (typeof navigation === 'boolean' && !$target.querySelector(swiperButtonPrev) && !$target.querySelector(swiperButtonNext)) {
      //   swiperControls.insertAdjacentHTML('beforeend', $templateHTML.navigation(navigationClass));
      // }

      // if (navigation === 'exception') {
      //   const exceptionControl = document.querySelector(exceptionClassName);
      //   setProps({
      //     navigation: {
      //       prevEl: exceptionControl.querySelector(swiperButtonPrev),
      //       nextEl: exceptionControl.querySelector(swiperButtonNext),
      //     },
      //   });
      // } else {
      //   setProps({
      //     navigation: {
      //       prevEl: $target.querySelector(swiperButtonPrev),
      //       nextEl: $target.querySelector(swiperButtonNext),
      //     },
      //   });
      // }
    }

    if (freeMode) {
      setProps({
        slidesPerView: 'auto',
      });
    }

    if (pagination) {
      !$target.querySelector(swiperPagination) && swiperControls.insertAdjacentHTML('beforeend', $templateHTML.pagination(paginationClass));
      setProps({
        pagination: {
          el: $target.querySelector(swiperPagination),
          type: paginationType ? paginationType : 'fraction',
          clickable: paginationType === 'bullets' ? true : false,
        },
      });
    }

    if (autoplay) {
      !$target.querySelector(swiperAutoplay) && swiperControls.insertAdjacentHTML('beforeend', $templateHTML.autoplay());
    }

    if (indicatorTexts && indicatorTexts.length > 0) {
      // Add indicators setup here
      const indicatorTexts = JSON.parse($target.getAttribute('data-props-indicator-texts') || '[]');
      const indicatorsHTML = `<div class="swiper-indicators"></div>`;
      $target.insertAdjacentHTML('beforeend', indicatorsHTML);
      const indicatorsEl = $target.querySelector('.swiper-indicators');
      setProps({
        pagination: {
          el: indicatorsEl,
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + indicatorTexts[index] + '</span>';
          },
        },
      });
    }

    // breakpoints
    if (props.breakpoints) {
      const $breakpoints = Object.values(props.breakpoints)[0];
      const $key = Object.keys($breakpoints);
      const $value = Object.values($breakpoints);

      const newBreakpoints = {};

      $key.forEach((_key, idx) => {
        if (!isNaN(Number($value[idx]))) {
          newBreakpoints[_key] = Number($value[idx]);
        } else {
          newBreakpoints[_key] = $value[idx];
        }
      });

      setProps({
        breakpoints: {
          1024: { ...newBreakpoints },
        },
      });
    }
  }

  function setupSelector() {
    swiperPagination = '.swiper-pagination';
    swiperButtonPrev = '.swiper-button-prev';
    swiperButtonNext = '.swiper-button-next';
    swiperAutoplay = '.swiper-autoplay';
    exceptionClassName = $target?.dataset?.exceptionClass;
  }

  function setupElement() {
    // id

    // a11y

    // new Swiper 생성
    $swiper = new Swiper($target.querySelector('.swiper-container'), { ...props });

    $swiperNavigation = $target.querySelector('.swiper-navigation');
    $swieprProgress = $target.querySelector('.swiper-progress');

    swiperLength = $swiper.slides.length;
    swiperPerView = $swiper.params.slidesPerView;

    if (swiperLength <= swiperPerView) {
      if ($swiperNavigation) $swiperNavigation.style.display = 'none';
      if ($swieprProgress) $swieprProgress.style.display = 'none';
    }
  }

  function setupActions() {
    // actions.start = () => {
    //   play();
    // };
    //
    // actions.stop = () => {
    //   stop();
    // };
  }

  function setEvent() {
    // autoplay 버튼
    if (props.autoplay) {
      addEvent('click', swiperAutoplay, (event) => {
        const $eventTarget = event.target.closest(swiperAutoplay);
        handleAutoplay($eventTarget);
      });
    }
  }

  function render() {
    // render
  }

  // autoplay 관련 커스텀 함수
  function handleAutoplay($target) {
    $target.classList.toggle('play');
    $target.classList.toggle('stop');

    if ($target.classList.contains('stop')) {
      stop();
    } else if ($target.classList.contains('play')) {
      play();
    }
  }

  function play() {
    $swiper.autoplay.start();
  }

  function stop() {
    $swiper.autoplay.stop();
  }

  // 특정 슬라이드로 이동
  // function moveToSlide(index, speed, runCallbacks) {
  //   if (props.loop) {
  //     $swiper.slideToLoop(index, speed, runCallbacks);
  //   } else {
  //     $swiper.slideTo(index);
  //   }
  // }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },
    // callable
    update,
    play,
    stop,
    handleAutoplay,
    getSwiperInstance() {
      return $swiper; // $swiper 인스턴스 반환
    },
  };

  return component;
}
;


/**
 * Tab
 */
function Tab() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      // props
    },
    {
      // state
    },
    render,
  );

  // variable
  const name = 'tab';
  // eslint-disable-next-line prefer-const
  let component = {};
  // element, selector
  let $target, tabHead, $tabHeadEl, tabBtn, $tabBtnEl, tabContent, $tabContentEl;

  /**
   * init
   * @param _$target
   * @param _props
   */
  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }

    setTarget($target);
    setProps({ ...props, ..._props });

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();

    $target.setAttribute('data-init', 'true');
  }

  function setup() {
    setupTemplate();
    setupSelector();
    setupElement();
    setupActions();

    // effect
    props.sticky && stickyTab();

    // state
    setState({ activeValue: state.active ?? $tabBtnEl[0].getAttribute('data-tab-value') });
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  // frequency
  function setupTemplate() {
    // $target.innerHTML = ``;
  }

  function setupSelector() {
    // selector
    tabHead = '.tab-head';
    tabBtn = '.tab-label';
    tabContent = '.tab-content';

    // element
    $tabHeadEl = $target.querySelector(tabHead);
    $tabBtnEl = $target.querySelectorAll(tabBtn);
    $tabContentEl = $target.querySelectorAll(tabContent);
  }

  function setupElement() {
    // id
    // a11y
    etUI.utils.setProperty($target, tabHead, 'role', 'tablist');

    // component custom element
    $tabHeadEl.style.touchAction = 'none';
    $tabBtnEl.forEach((tab, index) => {
      const tabBtnId = etUI.utils.getRandomUIID(name);
      const tabContentId = etUI.utils.getRandomUIID('tabpanel');

      tab.setAttribute('id', tabBtnId);
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', false);

      if ($tabContentEl[index]) {
        $tabContentEl[index].setAttribute('id', tabContentId);
        $tabContentEl[index].setAttribute('role', 'tabpanel');

        const tabContentValue = $tabContentEl[index].getAttribute('data-tab-value');
        etUI.utils.setProperty($target, `${tabBtn}[data-tab-value="${tabContentValue}"]`, 'aria-controls', $tabContentEl[index].id);
      }

      const tabValue = tab.getAttribute('data-tab-value');
      etUI.utils.setProperty($target, `${tabContent}[data-tab-value="${tabValue}"]`, 'aria-labelledby', tab.id);
    });
  }

  function setupActions() {
    let startX = 0;
    let endX = 0;
    let moveX = 0;
    let scrollLeft = 0;
    let isReadyMove = false;
    let clickable = true;

    actions.select = (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest(tabBtn);
      if (!targetBtn) return;
      if (!clickable) return;
      setState({ activeValue: targetBtn.getAttribute('data-tab-value') });
      gsap.to($tabHeadEl, {
        duration: 0.5,
        scrollLeft: targetBtn.offsetLeft - 24,
        overwrite: true,
      });
    };

    actions.dragStart = (e) => {
      e.stopPropagation();
      if (isReadyMove) return;
      isReadyMove = true;
      startX = e.x;
      scrollLeft = $tabHeadEl.scrollLeft;
    };
    actions.dragMove = (e) => {
      e.stopPropagation();
      if (!isReadyMove) return;
      moveX = e.x;
      $tabHeadEl.scrollLeft = scrollLeft + (startX - moveX);
    };
    actions.dragEnd = (e) => {
      e.stopPropagation();
      if (!isReadyMove) return;
      endX = e.x;
      if (Math.abs(startX - endX) < 10) clickable = true;
      else clickable = false;
      isReadyMove = false;
    };
    actions.dragLeave = (e) => {
      e.stopPropagation();
      if (!isReadyMove) return;

      // gsap.to($tabHeadEl, {
      //   scrollLeft: $target.querySelector('[aria-selected="true"]').offsetLeft,
      //   overwrite: true,
      // });

      clickable = true;
      isReadyMove = false;
    };

    actions.up = (e) => {
      if (!e.target.previousElementSibling) return;
      setState({ activeValue: e.target.previousElementSibling.getAttribute('data-tab-value') });
      focusTargetValue(tabBtn, state.activeValue);
    };
    actions.down = (e) => {
      if (!e.target.nextElementSibling) return;
      setState({ activeValue: e.target.nextElementSibling.getAttribute('data-tab-value') });
      focusTargetValue(tabBtn, state.activeValue);
    };
    actions.first = () => {
      setState({ activeValue: $tabBtnEl[0].getAttribute('data-tab-value') });
      focusTargetValue(tabBtn, state.activeValue);
    };
    actions.last = () => {
      setState({ activeValue: $tabBtnEl[$tabBtnEl.length - 1].getAttribute('data-tab-value') });
      focusTargetValue(tabBtn, state.activeValue);
    };

    function focusTargetValue(el, value) {
      const focusTarget = $target.querySelector(`${el}[data-tab-value="${value}"]`);
      focusTarget?.focus();
    }
  }

  function setEvent() {
    const actionList = {
      up: ['ArrowLeft'],
      down: ['ArrowRight'],
      first: ['Home'],
      last: ['End'],
      select: ['Enter', ' '],
    };

    addEvent('click', tabHead, actions.select);
    addEvent('pointerdown', tabHead, actions.dragStart);
    addEvent('pointermove', tabHead, actions.dragMove);
    addEvent('pointerup', tabHead, actions.dragEnd);
    addEvent('pointerleave', tabHead, actions.dragLeave);

    addEvent('keydown', tabHead, (e) => {
      const { key } = e;
      const action = Object.entries(actionList).find(([_, keys]) => keys.includes(key));

      if (action) {
        e.preventDefault();
        e.stopPropagation();
        const [actionName] = action;
        actions[actionName]?.(e);
      }
    });
  }

  function render() {
    const getId = $target.querySelector(`${tabBtn}[aria-selected="true"]`)?.id;

    etUI.utils.setProperty($target, '[aria-selected="true"]', 'aria-selected', false);
    etUI.utils.setProperty($target, `${tabBtn}[data-tab-value="${state.activeValue}"]`, 'aria-selected', true);

    $target.querySelector(`${tabContent}[aria-labelledby="${getId}"]`)?.classList.remove('show');
    $target.querySelector(`${tabContent}[data-tab-value="${state.activeValue}"]`)?.classList.add('show');
  }

  // custom
  function stickyTab() {
    const { bottom } = etUI.hooks.useGetClientRect(document, props.sticky);

    $target.style.position = 'relative';
    $tabHeadEl.style.position = 'sticky';
    if (!bottom) $tabHeadEl.style.top = 0 + 'px';
    else $tabHeadEl.style.top = bottom + 'px';
  }

  function setOffsetLeft() {
    const targetBtn = $target.querySelector('[aria-selected="true"]');
    if (!targetBtn) return;

    gsap.set($tabHeadEl, {
      scrollLeft: targetBtn.offsetLeft - 24,
      overwrite: true,
    });
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },
    setOffsetLeft,
    update,
  };

  return component;
}
;


function Toast() {
  const {
    actions, props, state, setProps, setState, setTarget, addEvent, removeEvent,
  } = etUI.hooks.useCore({
    // props
    type: 'basic',
    message: '메세지를 지정해 주세요.',
  }, {
    // state

  }, render);

  // variable
  const name = 'toast';
  let component = {};
  // element, selector
  let $target, $toast;
  let toastTriggerBtn, toastCloseBtn;

  /**
   * init
   * @param _$target
   * @param _props
   */
  function init(_$target, _props) {
    if(typeof _$target === 'string'){
      $target = document.querySelector(_$target)
    }else{
      $target = _$target;
    }

    if(!$target){
      throw Error('target이 존재하지 않습니다.');
    }

    setTarget($target );
    setProps({ ...props, ..._props });

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();

    // $target.setAttribute('data-init', 'true');
  }

  function setup() {
    // setupTemplate();
    setupSelector();
    setupElement();
    setupActions();
  }

  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  // frequency
  function setupTemplate() {

  }

  function setupSelector(){
    toastTriggerBtn = '.toast-trigger-btn';
    toastCloseBtn = '.toast-close-btn';
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    // const titleId = etUI.utils.getRandomUIID(name + '-tit');

    etUI.utils.setProperty($toast, 'id', id);
  }

  function setAnimation (newToast, innerToast) {
    // 개별 타임라인 생성
    const tl = gsap.timeline();

    tl.fromTo(newToast, {
      opacity: 0,
      height: 0,
      marginBottom: 0,
    }, {
      opacity: 1,
      duration: 0.5,
      height: innerToast.clientHeight,
      marginBottom: '0.8rem',
    })
    .to(newToast, {
      delay: 3,
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        newToast.remove();
      }
    })
  }

  function setupActions(){
    const { $templateHTML, $templatCloseHTML, $templateLinkHTML } = etUI.templates.toastTmpl();
    actions.open = () => {
      const container = document.createElement('div');
      container.classList.add('component-toast')

      if (props.type === 'basic') {
        container.innerHTML = $templateHTML(props)
      } else if (props.type === 'close') {
        container.innerHTML = $templatCloseHTML(props)
      } else if (props.type === 'link') {
        container.innerHTML = $templateLinkHTML(props)
      }
      $target.appendChild(container);
      $toast = container;

      setAnimation ($toast, $toast.querySelector('.toast-container'));
    }

    actions.close = ({target}) => {
      target.closest('.component-toast').remove();
    }
  }

  function setEvent() {
    addEvent('click', toastCloseBtn, actions.close)
  }

  function render() {
    // render
  }

  function open() {
    setupActions();
    actions.open();
  }

  function close() {
    actions.close();
  }

  component = {
    core: {
      state,
      props,
      init,
      removeEvent,
      destroy,
    },

    // callable
    update,
    open,
    close,
  }

  return component;
}
;


/**
 * Tooltip
 */
function Tooltip() {
  const { actions, props, state, setProps, setState, setTarget, addEvent, removeEvent } = etUI.hooks.useCore(
    {
      type: 'default',
      duration: 0.2,
      height: 'auto',
      transform: {
        scale: {
          x: 1,
          y: 1,
        },
        translate: {
          x: 0,
          y: 0,
        },
        delay: 0,
        easing: 'power4.out',
      },
    },
    {
      state: 'close',
    },
    render,
  );
  const { firstNodeFocusOut, lastNodeFocusOut } = etUI.hooks.useA11yKeyEvent();
  const { mediaQueryAction } = etUI.hooks.useMediaQuery();

  // state 변경 시 랜더 재호출
  const name = 'tooltip';
  let component = {};
  let cleanups = [];

  // 요소관련 변수들
  let $target, $tooltipContainer, $openBtn, $closeBtn, $opendim, $tooltipDim;
  let tooltipCloseBtn, tooltipTriggerBtn, tooltipDim;
  let focusTrapInstance;
  let tooltipContainerX;
  let bodyWidth;

  // 반응형
  let isMobile = window.matchMedia('(max-width: 1024px)').matches;

  /**
   * init
   * @param _$target
   * @param _props
   */
  function init(_$target, _props) {
    if (typeof _$target === 'string') {
      $target = document.querySelector(_$target);
    } else {
      $target = _$target;
    }

    if (!$target) {
      throw Error('Target does not exist.');
    }

    setTarget($target);
    setProps({ ...props, ..._props });

    if ($target.ui) return;
    $target.ui = component;

    setup();
    setEvent();

    $target.setAttribute('data-init', 'true');
  }

  function setup() {
    setupTemplate();
    setupSelector();
    setupElement();
    setupActions();

    // focus trap
    focusTrapInstance = focusTrap.createFocusTrap($target, {
      escapeDeactivates: props.esc,
      onActivate: actions.focusActivate,
      onDeactivate: actions.focusDeactivate,
    });
  }

  /**
   * update
   * @param _props
   */
  function update(_props) {
    if (_props && etUI.utils.shallowCompare(props, _props) && !$target.getAttribute('data-init')) return;
    destroy();

    setProps({ ...props, ..._props });
    setup();
    setEvent();
  }

  function destroy() {
    etUI.utils.allCleanups(cleanups);
    removeEvent();
    $target.ui = null;
    $target.removeAttribute('data-init');
  }

  // frequency
  function setupTemplate() {}

  function setupSelector() {
    // element
    $tooltipContainer = $target.querySelector('.tooltip-container');
    // selecotr
    tooltipTriggerBtn = '.tooltip-btn-trigger';
    tooltipCloseBtn = '.tooltip-btn-close';
    $tooltipDim = '.dim';
    tooltipDim = $target.querySelector('.dim'); // 0616 dim type 추가
    $openBtn = $target.querySelector(tooltipTriggerBtn);
    $closeBtn = $target.querySelector(tooltipCloseBtn);
    $opendim = tooltipDim; // 0616 dim type tooltipDim 변수에 직접 할당
  }

  function setupElement() {
    // set id
    const id = etUI.utils.getRandomUIID(name);
    const titleId = etUI.utils.getRandomUIID(name + '-tit');

    // a11y
    $target.setAttribute('id', id);
    $target.setAttribute('aria-expanded', 'false');
    $target.setAttribute('aria-controls', titleId);
  }

  function setupActions() {
    actions.open = () => {
      if (isMobile && tooltipDim) {
        setTimeout(() => {
          document.body.style.overflow = 'hidden';
        });
      }

      const checkOverflow = () => {
        bodyWidth = $tooltipContainer.getBoundingClientRect().width - 30;
        tooltipContainerX = $tooltipContainer.getBoundingClientRect().x;
        if (tooltipContainerX < 0) {
          $tooltipContainer.classList.add('overflow-left');
        } else if (tooltipContainerX > bodyWidth) {
          $tooltipContainer.classList.add('overflow-right');
        }
      };

      const setAnimation = { duration: 0, display: 'none', opacity: 0 };
      if (props.type === 'default') {
        gsap
          .timeline()
          .to($tooltipContainer, setAnimation)
          .to($tooltipContainer, {
            duration: props.duration,
            display: 'block',
            opacity: 1,
            onUpdate: () => {
              checkOverflow();
            },
          });
      }

      if (props.type === 'custom') {
        gsap
          .timeline()
          .to($tooltipContainer, setAnimation)
          .to($tooltipContainer, {
            duration: props.duration,
            scale: 1,
            display: 'block',
            opacity: 1,
            onUpdate: () => {
              checkOverflow();
            },
          });
      }

      $closeBtn && $closeBtn.setAttribute('aria-expanded', 'true');
      $tooltipContainer.setAttribute('aria-hidden', 'false');

      if ($closeBtn) {
        $closeBtn.focus();
      }
    };

    actions.close = () => {
      const containerClass = $tooltipContainer.classList
      const scale = props.transform.scale.x;
      const { type } = props

      document.body.style.overflow = null;

      gsap.timeline().to($tooltipContainer, {
        duration: props.duration,
        display: 'none',
        opacity: 0,
        onComplete: () => {
          containerClass.contains('overflow-left') && containerClass.remove('overflow-left');
          containerClass.contains('overflow-right') && containerClass.remove('overflow-right');

          setTimeout(() => {
            $closeBtn && $closeBtn.setAttribute('aria-expanded', 'false');
            $tooltipContainer.setAttribute('aria-hidden', 'true');
          })
        },
      });

      type === 'custom' && gsap.timeline().to($tooltipContainer, { duration: props.duration, scale: scale, display: 'none', opacity: 0 });
      type === 'default' && gsap.timeline().to($tooltipContainer, { duration: props.duration, display: 'none', opacity: 0 });
    };

    actions.focusActivate = () => {};

    actions.focusDeactivate = () => {
      if (!state.trigger) {
        callback = props.negativeCallback;
      }
      actions.close();
      focusTrapInstance.deactivate();
    };
  }

  function setEvent() {
    etUI.hooks.useEventListener(window, 'resize', () => {
      isMobile = window.matchMedia('(max-width: 1024px)').matches;
    });

    etUI.hooks.useEventListener(document.body, 'click', (e) => {
      if (state.state === 'open') {
        const { target } = e;

        if (target === $tooltipContainer || target === $openBtn) return;
        if (tooltipDim) tooltipDim.style.display = 'none';
        actions.close();
        $openBtn.classList.remove('on');
      }
    });

    addEvent('touchmove', $tooltipDim, function (e) {
      e.preventDefault();
    });

    addEvent('click', tooltipTriggerBtn, function () {
      actions.open();

      $openBtn.classList.add('on');
      // 0616 dim type 추가
      if (tooltipDim) {
        tooltipDim.style.display = 'block';
      }
    });

    if ($closeBtn) {
      cleanups.push(firstNodeFocusOut($closeBtn, actions.close));
      cleanups.push(lastNodeFocusOut($closeBtn, actions.close));
      addEvent('click', tooltipCloseBtn, function () {
        actions.close();
        if (tooltipDim) {
          tooltipDim.style.display = 'block';
        }
      });
    } else {
      cleanups.push(firstNodeFocusOut($openBtn, actions.open));
      cleanups.push(lastNodeFocusOut($openBtn, actions.close));
    }
  }

  function render() {
    const isShow = state.state === 'open';
    const expanded = $tooltipContainer.getAttribute('aria-expanded') === 'true';
    $tooltipContainer.setAttribute('aria-expanded', !expanded);
    $tooltipContainer.setAttribute('aria-hidden', expanded);

    if (isShow) {
      actions.open();
      focusTrapInstance.activate();
    } else {
      focusTrapInstance.deactivate();
    }

  }

  function open() {
    setState({ state: 'open' });
  }

  function close() {
    setState({ state: 'close' });
  }

  component = {
    core: {
      init,
      destroy,
      removeEvent,
    },

    update,
    open,
    close,
  };

  return component;
}
;



etUI.components = {
Accordion,
Collapse,
DatepickerComp,
Dialog,
Input,
Lottie,
Modal,
SelectBox,
SwiperComp,
Tab,
Toast,
Tooltip
}
              ;


// init js
function initUI() {
  const { mediaQueryAction } = etUI.hooks.useMediaQuery();
  const componentList = [
    {
      selector: '.component-input',
      fn: etUI.components.Input,
    },
    {
      selector: '.component-modal',
      fn: etUI.components.Modal,
    },
    {
      selector: '.component-collapse',
      fn: etUI.components.Collapse,
    },
    {
      selector: '.component-accordion',
      fn: etUI.components.Accordion,
    },
    {
      selector: '.component-tooltip',
      fn: etUI.components.Tooltip,
    },
    {
      selector: '.component-tab',
      fn: etUI.components.Tab,
    },
    {
      selector: '.component-select',
      fn: etUI.components.SelectBox,
    },
    {
      selector: '.component-swiper',
      fn: etUI.components.SwiperComp,
    },
    {
      selector: '.component-datepicker',
      fn: etUI.components.DatepickerComp,
    },
  ];

  mediaQueryAction((context) => {
    const { isDesktop, isMobile } = context.conditions;

    componentList.forEach(({ selector, fn }) => {
      document.querySelectorAll(selector).forEach((el) => {
        const { desktopOnly, mobileOnly } = el.dataset;
        if (mobileOnly || desktopOnly) {
          const shouldInit = (mobileOnly && isMobile) || (desktopOnly && isDesktop);

          if (shouldInit) {
            initSwiper(el, selector, fn);
          } else if (el.ui) {
            destroySwiper(el);
          }

          return;
        }

        if (el.dataset.init) {
          return;
        }

        try {
          const component = fn();
          document.fonts.ready.then(() => {
            try {
              if (component && component.core) {
                component.core.init(el, {}, selector);
              } else {
                console.warn('Component initialization failed: component or component.core is undefined', selector);
              }
            } catch (error) {
              console.error('Error initializing component:', selector, error);
            }
          });
        } catch (error) {
          console.error('Error creating component instance:', selector, error);
        }
      });
    });
  });

  etUI.dialog = etUI.hooks.useDialog();
}

etUI.initUI = initUI;

(function autoInit() {
  const $scriptBlock = document.querySelector("[data-init]");
  if ($scriptBlock) {
    document.addEventListener("DOMContentLoaded", function () {
      initUI();
    });
  }
})();
;


function dialogTmpl() {
  const $templateHTML = ({ dialogType, type, title, message, positiveText, negativeText }) => `
      <div class="component-dialog">
        <div class="dialog-dimm"></div>
        <div class="dialog-frame">
          <div class="dialog-container">
            <div class="dialog-header">
              ${title ? `<h3 class="dialog-tit">${title}</h3>` : ''}
            </div>
            <div class="dialog-content">
              ${dialogType === 'alert' ? `<span class="${type}">icon</span>` : ''}

              <p class="dialog-info">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="btn-group">
              ${dialogType === 'confirm' ? `<button type="button" class="btn btn-square btn-white dialog-negative">${negativeText}</button>` : ''}
              ${positiveText ? `<button type="button" class="btn dialog-positive btn-primary">${positiveText}</button>` : ''}
            </div>

            ${dialogType === 'alert' ? `<button type="button" class="dialog-close"><span class="hide-txt">팝업 닫기</span></button>` : ''}

          </div>
        </div>
      </div>
    `;

  const $templatePreviewImageHTML = ({ dialogType, images, title }) => `
      <div class="component-dialog dialog-preview-image">
        <div class="dialog-dimm"></div>
        <div class="dialog-frame">
          <div class="dialog-container">
            <div class="dialog-header">
              ${title ? `<h3 class="dialog-tit">${title}</h3>` : ''}
            </div>
            <div class="dialog-content">
              <div class="component-swiper" data-component="swiper">
                <!-- Additional required wrapper -->
                <div class="swiper-wrapper">
                  ${images
                    .map(
                      (image) => `
                    <div class="swiper-slide">
                      <img src="${image.src}" alt="${image.alt}" />
                    </div>
                  `,
                    )
                    .join('')}
                </div>
              </div>
            </div>
            <button type="button" class="dialog-close"><span class="hide-txt">팝업 닫기</span></button>
          </div>
        </div>
      </div>
    `;

  return {
    $templateHTML,
    $templatePreviewImageHTML
  };
}
;



etUI.templates = {
dialogTmpl,
inputTmpl,
selectBoxTmpl,
swiperTmpl,
toastTmpl
}
              ;


function inputTmpl() {
  const $templateHTML = {
    togglePassword() {
      return `
        <button type="button" class="input-field-btn password-state">
          <span class="hide-txt hide">${etUI.$t('input.password_hide', '비밀번호 숨기기')}</span>
          <span class="hide-txt show">${etUI.$t('input.password_show', '비밀번호 표시')}</span>
          <i class="ico-password-state ico-normal" aria-hidden="true"></i>
        </button>
      `;
    },
    clearButton() {
      return `
        <button type="button" class="input-field-btn clear">
          <span class="hide-txt">${etUI.$t('input.clear', '내용 지우기')}</span>
          <i class="ico-clear ico-normal" aria-hidden="true"></i>
        </button>
      `;
    },
    loading() {
      return `
        <i class="input-field-ico spinner" aria-hidden="true"></i>
      `;
    },
  };

  return {
    $templateHTML,
  };
}
;


/**
 * 개인정보처리방침 템플릿 관리
 * 단축키:
 * - Alt + P: 팝업 열기
 * - Alt + G: 코드 생성
 * - Alt + C: 항목 삭제
 */
/* global window, document, alert, Event */
(function () {
  'use strict';

  // 모달 HTML 구조 생성
  function createPrivacyPolicyModal() {
    const modalHTML = `
      <style>
        /* 리스트 스타일 */
        .policy-list {
          padding-left: 20px;
        }

        /* 불릿 리스트 */
        ul.policy-list:not(.hyphen-list) li {
          list-style-type: disc;
        }

        /* 번호 리스트 */
        ol.policy-list li {
          list-style-type: decimal;
        }

        /* 하이픈 리스트 */
        .hyphen-list li {
          list-style-type: none !important;
          position: relative;
          padding-left: 15px;
        }

        .hyphen-list li:before {
          content: '-';
          position: absolute;
          left: 0;
        }

        /* 박스 스타일 */
        .box-style {
          background-color: #f8f8f8;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 10px;
          margin-top: 5px;
        }

        /* 서식 툴바 스타일 */
        .formatting-toolbar {
          display: flex;
          gap: 5px;
          margin-bottom: 5px;
          padding: 5px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .formatting-toolbar button {
          padding: 3px 8px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 3px;
          cursor: pointer;
          font-size: 14px;
        }

        .formatting-toolbar button:hover {
          background-color: #f0f0f0;
        }

        .formatting-toolbar button.active {
          background-color: #e0e0e0;
        }

        /* 요소 추가 섹션 스타일 */
        .elements-section {
          margin-bottom : 20px;
          padding: 10px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .elements-section h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: bold;
        }

        .elements-buttons {
          display: flex;
          gap: 10px;
        }

        .element-dialog {
          margin-top: 10px;
          padding: 10px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .element-dialog label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .element-dialog input {
          width: 100%;
          padding: 5px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 3px;
        }
      </style>
      <div class="component-modal privacy-policy-modal" id="privacyPolicyModal">
        <div class="modal-dimm"></div>
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-tit">개인정보처리방침 템플릿</h2>
          </div>
          <div class="modal-content">
            <div class="template-controls">
              <div class="template-type">
                <label>템플릿 유형:</label>
                <div class="component-select">
                  <select id="templateType" class="select-list">
                    <option value="title">타이틀</option>
                    <option value="list">리스트</option>
                    <option value="box">박스</option>
                  </select>
                </div>
              </div>
              <div id="listTypeContainer" style="display: none; margin-bottom: 10px;">
                <div class="template-type">
                  <label>리스트 유형:</label>
                  <div class="component-select">
                    <select id="listType" class="select-list">
                      <option value="ul">불릿 리스트</option>
                      <option value="ol">번호 리스트</option>
                      <option value="hyphen">하이픈 리스트</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="template-input">
                <div class="input-group">
                  <label for="itemTitle">제목:</label>
                  <div class="component-input" data-props-clear="true">
                    <div class="input-field">
                      <input type="text" id="itemTitle" placeholder="제목을 입력하세요">
                    </div>
                  </div>
                </div>
                <div class="input-group">
                  <label for="itemContent">내용:</label>
                  <div class="formatting-toolbar">
                    <button type="button" id="boldBtn" title="굵게"><strong>B</strong></button>
                    <button type="button" id="italicBtn" title="기울임"><em>I</em></button>
                    <button type="button" id="underlineBtn" title="밑줄"><u>U</u></button>
                  </div>
                  <div class="component-input">
                    <div class="input-field">
                      <textarea id="itemContent" placeholder="내용을 입력하세요"></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div class="template-buttons">
                <button id="addItem" class="btn">미리 보기</button>
                <button id="deleteItem" class="btn btn-close">초기화</button>
              </div>
            </div>
            <div class="template-preview">
              <div id="previewContainer"></div>
            </div>
            <div class="elements-section">
              <h4>요소 추가</h4>
              <div class="elements-buttons">
                <button type="button" id="addButtonElement" class="btn btn-sm">버튼 추가</button>
                <button type="button" id="addLinkElement" class="btn btn-sm">링크 추가</button>
              </div>
              <div id="buttonElementDialog" class="element-dialog" style="display: none;">
                <label for="buttonText">버튼 텍스트:</label>
                <input type="text" id="buttonText" placeholder="버튼에 표시할 텍스트">
                <label for="buttonClass">버튼 클래스 (선택사항):</label>
                <input type="text" id="buttonClass" placeholder="예: btn btn-primary">
                <div class="location-checkboxes">
                  <div class="component-input">
                    <label class="checkbox-inner">
                      <input type="checkbox" id="addToList" name="addToList">
                      <span class="checkbox-item">
                        <span class="checkbox-txt">List 요소에 추가</span>
                      </span>
                    </label>
                  </div>
                  <div class="component-input">
                    <label class="checkbox-inner">
                      <input type="checkbox" id="addToContent" name="addToContent">
                      <span class="checkbox-item">
                        <span class="checkbox-txt">Content 요소에 추가</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div class="dialog-buttons">
                  <button type="button" id="insertButtonElement" class="btn btn-sm">추가</button>
                  <button type="button" id="cancelButtonElement" class="btn btn-sm btn-close">취소</button>
                </div>
              </div>
              <div id="linkElementDialog" class="element-dialog" style="display: none;">
                <label for="linkText">링크 텍스트:</label>
                <input type="text" id="linkText" placeholder="링크에 표시할 텍스트">
                <label for="linkUrl">링크 URL:</label>
                <input type="text" id="linkUrl" placeholder="예: https://example.com">
                <div class="dialog-buttons">
                  <button type="button" id="insertLinkElement" class="btn btn-sm">추가</button>
                  <button type="button" id="cancelLinkElement" class="btn btn-sm btn-close">취소</button>
                </div>
              </div>
            </div>
            <div class="template-code">
              <h3>생성된 코드</h3>
              <div class="component-input">
                <div class="input-field">
                  <textarea id="generatedCode" readonly></textarea>
                </div>
              </div>
              <button id="addCode" class="btn">코드 생성</button>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-close modal-close-btn">닫기</button>
            <button class="btn copy-code-btn">코드 복사</button>
          </div>
          <button type="button" class="modal-close"></button>
        </div>
      </div>
    `;

    // 모달 HTML을 body에 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // 모달 초기화 및 이벤트 바인딩
  function initPrivacyPolicyModal() {
    const modal = document.getElementById('privacyPolicyModal');
    if (!modal) {
      createPrivacyPolicyModal();
      bindModalEvents();
    }
  }

  // HTML 태그를 그대로 유지하는 함수 (이전의 마크다운 변환 함수 대체)
  function preserveHTMLTags(text) {
    if (!text) return text;
    return text;
  }

  // 서식 옵션 버튼 이벤트 처리
  function setupFormattingToolbar() {
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');
    const contentTextarea = document.getElementById('itemContent');

    if (!boldBtn || !italicBtn || !underlineBtn || !contentTextarea) return;

    // 굵게 버튼 클릭 이벤트
    boldBtn.addEventListener('click', () => {
      applyFormatting('bold');
    });

    // 기울임 버튼 클릭 이벤트
    italicBtn.addEventListener('click', () => {
      applyFormatting('italic');
    });

    // 밑줄 버튼 클릭 이벤트
    underlineBtn.addEventListener('click', () => {
      applyFormatting('underline');
    });

    // 요소 추가 버튼 이벤트 처리
    setupElementsButtons();

    // 서식 적용 함수
    function applyFormatting(format) {
      const textarea = contentTextarea;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      let formattedText = '';

      if (selectedText) {
        switch(format) {
        case 'bold':
          formattedText = `<strong class="strong">${selectedText}</strong>`;
          break;
        case 'italic':
          formattedText = `<em class="italic">${selectedText}</em>`;
          break;
        case 'underline':
          formattedText = `<u class="underline">${selectedText}</u>`;
          break;
        }

        // 선택한 텍스트를 서식이 적용된 텍스트로 교체
        textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);

        // 커서 위치 재설정
        textarea.focus();
        textarea.selectionStart = start + formattedText.length;
        textarea.selectionEnd = start + formattedText.length;
      }
    }
  }

  // 요소 추가 버튼 이벤트 처리
  function setupElementsButtons() {
    const contentTextarea = document.getElementById('itemContent');
    const addButtonElement = document.getElementById('addButtonElement');
    const addLinkElement = document.getElementById('addLinkElement');
    const buttonElementDialog = document.getElementById('buttonElementDialog');
    const linkElementDialog = document.getElementById('linkElementDialog');
    const insertButtonElement = document.getElementById('insertButtonElement');
    const cancelButtonElement = document.getElementById('cancelButtonElement');
    const insertLinkElement = document.getElementById('insertLinkElement');
    const cancelLinkElement = document.getElementById('cancelLinkElement');

    // 버튼 추가 대화상자 열기
    addButtonElement.addEventListener('click', () => {
      buttonElementDialog.style.display = 'block';
      linkElementDialog.style.display = 'none';
      document.getElementById('buttonText').focus();
    });

    // 링크 추가 대화상자 열기
    addLinkElement.addEventListener('click', () => {
      linkElementDialog.style.display = 'block';
      buttonElementDialog.style.display = 'none';
      document.getElementById('linkText').focus();
    });

    // 버튼 추가 처리
    insertButtonElement.addEventListener('click', () => {
      const buttonText = document.getElementById('buttonText').value.trim();
      const buttonClass = document.getElementById('buttonClass').value.trim();
      const addToList = document.getElementById('addToList').checked;
      const addToContent = document.getElementById('addToContent').checked;

      if (!buttonText) {
        alert('버튼 텍스트를 입력해주세요.');
        return;
      }

      const buttonHTML = buttonClass
        ? `<button class="${buttonClass}">${buttonText}</button>`
        : `<button class="btn">${buttonText}</button>`;

      if (addToList) {
        if(document.querySelector('.policy-list')) {
          // policy-list에 추가하는 로직
          const listElement = document.createElement('li');
          listElement.innerHTML = buttonHTML;
          document.querySelector('.policy-list').appendChild(listElement);
        }
      } else if (addToContent) {
        if(document.querySelector('.policy-content')) {
          // policy-content 자식 요소로 추가하는 로직
          const buttonElement = document.createElement('div');
          buttonElement.innerHTML = buttonHTML;
          document.querySelector('.policy-content').appendChild(buttonElement);
        }
      } else {
        // policy-item 자식 요소로 추가하는 로직
        if(document.querySelector('.policy-item')) {
          const buttonElement = document.createElement('div');
          buttonElement.innerHTML = buttonHTML;
          document.querySelector('.policy-item').appendChild(buttonElement);
        }
      }

      if (templateItems.length > 0) {
        const lastItem = templateItems[templateItems.length - 1];

        if (addToList || addToContent) {
          // 리스트 요소에 추가
          if (lastItem.type === 'list' || lastItem.type === 'box') {
            // 이미 있는 리스트 내용에 새 리스트 아이템 또는 내용에 추가
            lastItem.content += '\n' + buttonHTML;
          }
        } else {
          // 기본 위치에 추가 (체크박스 선택 없을 때)
          if (!lastItem.buttonHTML) {
            lastItem.buttonHTML = buttonHTML;
          } else {
            lastItem.buttonHTML += '\n' + buttonHTML;
          }
        }
      }

      buttonElementDialog.style.display = 'none';
      document.getElementById('buttonText').value = '';
      document.getElementById('buttonClass').value = '';
    });

    // 링크 추가 처리 함수 수정
    insertLinkElement.addEventListener('click', () => {
      const linkText = document.getElementById('linkText').value.trim();
      const linkUrl = document.getElementById('linkUrl').value.trim();

      if (!linkText) {
        alert('링크 텍스트를 입력해주세요.');
        return;
      }

      if (!linkUrl) {
        alert('링크 URL을 입력해주세요.');
        return;
      }

      const linkHTML = `<a href="${linkUrl}">${linkText}</a>`;

      insertAtCursor(contentTextarea, linkHTML);

      // templateItems 배열 업데이트 - textarea의 새 값으로 업데이트
      if (templateItems.length > 0) {
        // 현재 선택된 항목이 없으면 가장 최근 항목 업데이트
        const lastItem = templateItems[templateItems.length - 1];
        lastItem.content = contentTextarea.value;
      }

      linkElementDialog.style.display = 'none';
      document.getElementById('linkText').value = '';
      document.getElementById('linkUrl').value = '';
    });

    // 버튼 추가 취소
    cancelButtonElement.addEventListener('click', () => {
      buttonElementDialog.style.display = 'none';
      document.getElementById('buttonText').value = '';
      document.getElementById('buttonClass').value = '';
    });

    // 링크 추가 처리
    insertLinkElement.addEventListener('click', () => {
      const linkText = document.getElementById('linkText').value.trim();
      const linkUrl = document.getElementById('linkUrl').value.trim();

      if (!linkText) {
        alert('링크 텍스트를 입력해주세요.');
        return;
      }

      if (!linkUrl) {
        alert('링크 URL을 입력해주세요.');
        return;
      }

      const linkHTML = `<a href="${linkUrl}">${linkText}</a>`;

      insertAtCursor(contentTextarea, linkHTML);
      linkElementDialog.style.display = 'none';
      document.getElementById('linkText').value = '';
      document.getElementById('linkUrl').value = '';
    });

    // 링크 추가 취소
    cancelLinkElement.addEventListener('click', () => {
      linkElementDialog.style.display = 'none';
      document.getElementById('linkText').value = '';
      document.getElementById('linkUrl').value = '';
    });

    // 커서 위치에 텍스트 삽입
    function insertAtCursor(textarea, text) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);

      // 커서 위치 재설정
      textarea.focus();
      textarea.selectionStart = start + text.length;
      textarea.selectionEnd = start + text.length;
    }
  }

  // 모달 이벤트 바인딩
  function bindModalEvents() {
    const modal = document.getElementById('privacyPolicyModal');
    const modalDimm = modal.querySelector('.modal-dimm');
    const modalContainer = modal.querySelector('.modal-container');
    const closeBtn = modal.querySelector('.modal-close');
    const closeBtnFooter = modal.querySelector('.modal-close-btn');
    const addItemBtn = document.getElementById('addItem');
    const addCodeBtn = document.getElementById('addCode');
    const deleteItemBtn = document.getElementById('deleteItem');
    const copyCodeBtn = modal.querySelector('.copy-code-btn');
    const templateTypeSelect = document.getElementById('templateType');

    // 템플릿 항목 데이터
    // const templateItems = [];

    // 모달 닫기 함수
    const closeModal = () => {
      modalDimm.style.display = 'none';
      modalContainer.style.display = 'none';
      modal.style.display = 'none';
    };

    // 모달 열기 함수
    const openModal = () => {
      modal.style.display = 'block';
      modalDimm.style.display = 'block';
      modalContainer.style.display = 'flex';
    };

    // 닫기 버튼 이벤트
    closeBtn.addEventListener('click', closeModal);
    closeBtnFooter.addEventListener('click', closeModal);
    modalDimm.addEventListener('click', closeModal);

    // 템플릿 유형 변경 이벤트
    templateTypeSelect.addEventListener('change', () => {
      // 템플릿 유형 변경 시 모든 입력 필드 초기화
      // 1. 입력 필드 초기화
      document.getElementById('itemTitle').value = ''; // 제목 초기화
      document.getElementById('itemContent').value = ''; // 내용 초기화

      // 2. 템플릿 항목 데이터 초기화
      templateItems.length = 0;

      // 3. 미리보기 초기화
      updatePreview();

      // 4. 생성된 코드 초기화
      document.getElementById('generatedCode').value = '';

      // 5. 예시 업데이트 (템플릿 유형에 따라 예시 변경)
      const titleInput = document.getElementById('itemTitle');
      const contentInput = document.getElementById('itemContent');
      const templateType = templateTypeSelect.value;
      const listTypeContainer = document.getElementById('listTypeContainer');

      // 리스트 유형 선택 옵션 표시/숨김
      if(templateType === 'title') {
        document.querySelector('.elements-section').style.display = 'none';
      } else if (templateType === 'list') {
        listTypeContainer.style.display = 'block';
        document.querySelector('.elements-section').style.display = 'block';
        document.getElementById('addToList').parentElement.parentElement.style.display = 'block';
        document.getElementById('addToContent').parentElement.parentElement.style.display = 'none';
      } else {
        listTypeContainer.style.display = 'none';
        document.querySelector('.elements-section').style.display = 'block';
        document.getElementById('addToList').parentElement.parentElement.style.display = 'none';
        document.getElementById('addToContent').parentElement.parentElement.style.display = 'block';
      }

      switch(templateType) {
      case 'title':
        titleInput.placeholder = '타이틀';
        contentInput.placeholder = '내용 없음';
        break;
      case 'list':
        titleInput.placeholder = '타이틀';
        contentInput.placeholder = '내용';
        break;
      case 'box':
        titleInput.placeholder = '타이틀';
        contentInput.placeholder = '내용';
        break;
      }
    });

    // 미리 보기 및 코드 생성 버튼 이벤트
    addItemBtn.addEventListener('click', () => {
      addTemplateItem();
      // generateTemplateCode();
    });

    // 미리 보기 및 코드 생성 버튼 이벤트
    addCodeBtn.addEventListener('click', () => {
      // addTemplateItem();
      generateTemplateCode();
    });

    // 초기화 버튼 이벤트
    deleteItemBtn.addEventListener('click', () => {
      resetTemplateItems();
    });

    // 코드 복사 버튼 이벤트
    copyCodeBtn.addEventListener('click', () => {
      const generatedCode = document.getElementById('generatedCode');
      generatedCode.select();
      document.execCommand('copy');
      alert('코드가 클립보드에 복사되었습니다.');
    });

    // 템플릿 항목 추가 함수
    function addTemplateItem() {
      const titleInput = document.getElementById('itemTitle');
      const contentInput = document.getElementById('itemContent');
      const templateType = document.getElementById('templateType').value;
      const title = titleInput.value.trim();
      let content = contentInput.value.trim();
      let listType = null;

      if (templateType === 'list') {
        // 리스트 유형일 경우 리스트 유형 가져오기
        listType = document.getElementById('listType').value;
      }

      if (templateType === 'title') {
        // 타이틀 유형일 경우 내용 필드 검사 생략
        if (!title) {
          alert('제목을 입력해주세요.');
          return;
        }
        // 타이틀은 내용이 없어도 됨
        content = content || '내용 없음';
      } else {
        // 다른 유형일 경우 제목과 내용 모두 필요
        if (!title || !content) {
          alert('제목과 내용을 모두 입력해주세요.');
          return;
        }
      }

      templateItems.push({
        type: templateType,
        title: title,
        content: content,
        listType: listType,
        buttonHTML: '',
      });
      updatePreview();

      // 입력 필드 초기화
      titleInput.value = '';
      contentInput.value = '';
      titleInput.focus();
    }

    // 템플릿 항목 초기화 함수
    function resetTemplateItems() {
      if (templateItems.length > 0) {
        templateItems.length = 0;
        updatePreview();
        document.getElementById('generatedCode').value = '';
        alert('모든 항목이 초기화되었습니다.');
      } else {
        alert('초기화할 항목이 없습니다.');
      }
    }

    // 미리보기 업데이트 함수
    function updatePreview() {
      const previewContainer = document.getElementById('previewContainer');
      const templateType = document.getElementById('templateType').value;

      let previewHTML = '';

      if (templateItems.length === 0) {
        previewContainer.innerHTML = '<p>미리보기 영역</p>';
        return;
      }

      switch (templateType) {
      case 'title':
        previewHTML = generateFullTitlePreview();
        break;
      case 'list':
        previewHTML = generateListPreview();
        break;
      case 'box':
        previewHTML = generateBoxPreview();
        break;
      }

      previewContainer.innerHTML = previewHTML;
    }

    // 타이틀 미리보기 생성
    function generateFullTitlePreview() {
      let html = '';

      templateItems.forEach(item => {
        html += '<div class="policy-item">';
        html += '<span class="policy-title">' + item.title + '</span>';

        // 내용이 '내용 없음'이 아닌 경우에만 policy-content 추가
        if (item.content && item.content !== '내용 없음') {
          html += '<div class="policy-content">' + item.content + '</div>';
        }
        html += '</div>';
      });

      return html;
    }

    // 미리보기 생성
    function generateListPreview() {
      let html = '';

      templateItems.forEach(item => {
        html += '<div class="policy-item">';
        html += '<span class="policy-title">' + item.title + '</span>';

        // 내용이 있는 경우에만 policy-list 추가
        if (item.content && item.content.trim()) {
          const listType = item.listType || 'ul';

          if (listType === 'hyphen') {
            html += '<ul class="policy-list hyphen-list">';
          } else if (listType === 'ol') {
            html += '<ol class="policy-list">';
          } else {
            html += '<ul class="policy-list">';  // 기본값은 ul
          }

          // 중첩 리스트 처리
          const processNestedList = (content) => {
            let result = '';
            const lines = content.split('\n');

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;

              // 들여쓰기가 있는지 확인 (탭 또는 공백 2개 이상)
              const indentation = lines[i].match(/^(\s+)/);

              if (indentation && (indentation[1].length >= 2 || indentation[1].includes('\t'))) {
                // 이전 줄이 리스트 아이템이면 중첩 리스트 시작
                if (i > 0 && result.endsWith('</li>')) {
                  // 마지막 </li> 제거
                  result = result.substring(0, result.length - 5);
                  result += '<ul class="nested-list">';
                  result += '<li>' + preserveHTMLTags(line) + '</li>';

                  // 다음 줄도 들여쓰기가 있는지 확인
                  let j = i + 1;
                  while (j < lines.length &&
                         lines[j].trim() &&
                         lines[j].match(/^(\s+)/) &&
                         (lines[j].match(/^(\s+)/)[1].length >= 2 || lines[j].match(/^(\s+)/)[1].includes('\t'))) {
                    result += '<li>' + preserveHTMLTags(lines[j].trim()) + '</li>';
                    j++;
                  }

                  result += '</ul></li>';
                  i = j - 1; // 다음 반복에서 처리할 인덱스 조정
                } else {
                  result += '<li>' + preserveHTMLTags(line) + '</li>';
                }
              } else {
                result += '<li>' + line + '</li>';
              }
            }

            return result;
          };

          html += processNestedList(item.content);
          if (listType === 'ol') {
            html += '</ol>';
          } else {
            html += '</ul>';
          }
        }
        html += '</div>';
      });

      return html;
    }

    // 미리보기 생성
    function generateBoxPreview() {
      let html = '';

      templateItems.forEach(item => {
        html += '<div class="policy-item">';
        html += '<span class="policy-title">' + item.title + '</span>';

        // 내용이 있는 경우에만 policy-content 추가
        if (item.content && item.content.trim()) {
          html += '<div class="policy-content box-style">' + item.content + '</div>';
        }
        html += '</div>';
      });

      return html;
    }

    // 코드 생성 함수
    function generateTemplateCode() {
      const templateType = document.getElementById('templateType').value;
      const generatedCodeElem = document.getElementById('generatedCode');

      if (templateItems.length === 0) {
        alert('생성할 항목이 없습니다. 항목을 먼저 추가해주세요.');
        return;
      }

      let generatedHTML = '';

      switch (templateType) {
      case 'title':
        generatedHTML = generateFullTitleHTML();
        break;
      case 'list':
        generatedHTML = generateListHTML();
        break;
      case 'box':
        generatedHTML = generateBoxHTML();
        break;
      }

      generatedCodeElem.value = generatedHTML;
    }

    // 타이틀 HTML 생성
    function generateFullTitleHTML() {
      let html = '';

      templateItems.forEach(item => {
        html += '  <div class="policy-item">\n';
        html += '    <span class="policy-title">' + item.title + '</span>\n';

        // 내용이 '내용 없음'이 아닌 경우에만 policy-content 추가
        if (item.content && item.content !== '내용 없음') {
          html += '    <div class="policy-content">' + item.content + '</div>\n';
        }

        html += '  </div>\n';
      });

      return html;
    }

    // HTML 생성
    function generateListHTML() {
      let html = '';

      templateItems.forEach(item => {
        html += '  <div class="policy-item">\n';
        html += '    <span class="policy-title">' + item.title + '</span>\n';

        // 내용이 있는 경우에만 policy-list 추가
        if (item.content && item.content.trim()) {
          const listType = item.listType || 'ul';

          if (listType === 'hyphen') {
            html += '    <ul class="policy-list hyphen-list">\n';
          } else if (listType === 'ol') {
            html += '    <ol class="policy-list">\n';
          } else {
            html += '    <ul class="policy-list">\n';
          }

          // 중첩 리스트 처리
          const processNestedList = (content) => {
            let result = '';
            const lines = content.split('\n');

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;

              // 들여쓰기가 있는지 확인 (탭 또는 공백 2개 이상)
              const indentation = lines[i].match(/^(\s+)/);

              if (indentation && (indentation[1].length >= 2 || indentation[1].includes('\t'))) {
                // 이전 줄이 리스트 아이템이면 중첩 리스트 시작
                if (i > 0 && result.endsWith('</li>\n')) {
                  // 마지막 </li> 제거
                  result = result.substring(0, result.length - 6);
                  result += '\n        <ul class="nested-list">\n';
                  result += '          <li>' + preserveHTMLTags(line) + '</li>\n';

                  // 다음 줄도 들여쓰기가 있는지 확인
                  let j = i + 1;
                  while (j < lines.length &&
                         lines[j].trim() &&
                         lines[j].match(/^(\s+)/) &&
                         (lines[j].match(/^(\s+)/)[1].length >= 2 || lines[j].match(/^(\s+)/)[1].includes('\t'))) {
                    result += '          <li>' + preserveHTMLTags(lines[j].trim()) + '</li>\n';
                    j++;
                  }

                  result += '        </ul>\n      </li>\n';
                  i = j - 1; // 다음 반복에서 처리할 인덱스 조정
                } else {
                  result += '      <li>' + line + '</li>\n';
                }
              } else {
                result += '      <li>' + line + '</li>\n';
              }
            }

            return result;
          };

          html += processNestedList(item.content);
          if (listType === 'ol') {
            html += '    </ol>\n';
          } else {
            html += '    </ul>\n';
          }
        }

        if (item.buttonHTML) {
          html += '    ' + item.buttonHTML + '\n';
        }

        html += '  </div>\n';
      });

      return html;
    }

    // HTML 생성
    function generateBoxHTML() {
      let html = '';

      templateItems.forEach(item => {
        html += '  <div class="policy-item">\n';
        html += '    <span class="policy-title">' + item.title + '</span>\n';

        // 내용이 있는 경우에만 policy-content 추가
        if (item.content && item.content.trim()) {
          html += '    <div class="policy-content box-style">' + item.content + '</div>\n';
        }

        if (item.buttonHTML) {
          html += '    ' + item.buttonHTML + '\n';
        }

        html += '  </div>\n';
      });

      return html;
    }

    // 타입 변경 이벤트
    document.getElementById('templateType').addEventListener('change', function() {
      const templateType = this.value;
      const contentGroup = document.querySelector('.input-group:nth-child(2)');

      // 타이틀 유형일 경우 내용 입력란 숨기기
      if (templateType === 'title') {
        contentGroup.style.display = 'none';
      } else {
        contentGroup.style.display = 'block';
      }

      updatePreview();
    });

    // 단축키 이벤트 리스너는 전역으로 이동했으니 여기서는 삭제
  }

  // 템플릿 유형별 예시 추가
  function addTemplateExamples() {
    const templateType = document.getElementById('templateType');

    // 초기 예시 설정 (기본 타이틀)
    templateType.dispatchEvent(new Event('change'));
  }

  // 전역 변수로 모달 접근할 수 있도록 설정
  let privacyPolicyModal;
  let templateItems = [];

  // 모달 열기 함수 - 전역 스코프로 이동
  function openPrivacyPolicyModal() {
    if (!privacyPolicyModal) {
      initPrivacyPolicyModal();
      privacyPolicyModal = document.getElementById('privacyPolicyModal');
    }

    const modalDimm = privacyPolicyModal.querySelector('.modal-dimm');
    const modalContainer = privacyPolicyModal.querySelector('.modal-container');

    privacyPolicyModal.style.display = 'block';
    modalDimm.style.display = 'block';
    modalContainer.style.display = 'flex';
  }

  // 단축키 이벤트 리스너 - 전역 스코프로 이동
  document.addEventListener('keydown', (e) => {
    // Alt + P: 팝업 열기
    if (e.altKey && e.key === 'p') {
      e.preventDefault();
      openPrivacyPolicyModal();
    }

    // 모달이 열려있을 때만 다른 단축키 활성화
    if (privacyPolicyModal && privacyPolicyModal.style.display === 'block') {
      // Alt + G: 미리 보기 및 코드 생성
      if (e.altKey && e.key === 'g') {
        e.preventDefault();
        const addItemBtn = document.getElementById('addItem');
        if (addItemBtn) addItemBtn.click();
      }

      // Alt + C: 초기화
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        const deleteItemBtn = document.getElementById('deleteItem');
        if (deleteItemBtn) deleteItemBtn.click();
      }
    }
  });

  // DOM이 로드된 후 초기화
  document.addEventListener('DOMContentLoaded', function() {
    initPrivacyPolicyModal();
    addTemplateExamples();
    privacyPolicyModal = document.getElementById('privacyPolicyModal');
    setupFormattingToolbar(); // 서식 툴바 초기화
  });
})();
;


function selectBoxTmpl() {
  const $templateCustomHTML = {
    label(text) {
      return `
        <div id="combo1-label" class="combo-label">${text}</div>
      `;
    },
    selectBtn(text) {
      return `
      <button type="button" id="combo1" class="select-box" role="combobox" aria-controls="listbox1" aria-expanded="false" aria-labelledby="combo1-label" aria-activedescendant="">
        <span style="pointer-events: none;">${text}</span>
      </button>
      `;
    },
    itemsWrap(itemsHTML) {
      return `
        <ul id="listbox1" class="select-options" role="listbox" aria-labelledby="combo1-label" tabindex="-1">
          ${itemsHTML}
        </ul>
      `;
    },
    items(item, selected = false) {
      return `
        <li role="option" class="option" aria-selected="${selected}" data-value="${item.value}">
          ${item.text}
        </li>
      `;
    },
  };

  const $templateBasicHTML = {
    label(text) {
      return `
        <div id="combo1-label" class="combo-label">${text}</div>
      `;
    },
    selectBtn(text) {
      return `
        <option value="" selected disabled hidden>${text}</option>
      `;
    },
    itemsWrap(itemsHTML) {
      return `
        <select class="select-list" required>
          ${itemsHTML}
        </select>
      `;
    },
    items(item, selected = false) {
      return `
        <option value="${item.value}">${item.text}</option>
      `;
    },
  };

  return {
    $templateCustomHTML,
    $templateBasicHTML,
  };
}
;


function swiperTmpl() {
  const $templateHTML = {
    navigation(className = '') {
      return `
        <div class="swiper-navigation ${className}">
          <button type="button" class="swiper-button-prev"><span class="hide-txt">${etUI.$t('swiper.navigation.prev', '이전 슬라이드')}</span></button>
          <button type="button" class="swiper-button-next"><span class="hide-txt">${etUI.$t('swiper.navigation.next', '다음 슬라이드')}</span></button>
        </div>
      `;
    },
    pagination(className = '') {
      return `
        <div class="swiper-pagination ${className}"></div>
      `;
    },
    autoplay() {
      return `
        <div class="swiper-autoplay-wrap">
          <button type="button" class="swiper-autoplay play"><span class="hide-txt">${etUI.$t('swiper.autoplay.stop', '정지')}</span></button>
        </div>
      `;
    },
    swiperControls() {
      return `
        <div class="swiper-controls"></div>
      `;
    },
    prevEl(className = null) {
      return `
      <div class="swiper-navigation ${className}">
        <button type="button" class="swiper-button-prev"><span class="hide-txt">${etUI.$t('swiper.navigation.prev', '이전 슬라이드')}</span></button>
      </div>
      `;
    },
    nextEl(className = null) {
      return `
      <div class="swiper-navigation ${className}">
        <button type="button" class="swiper-button-next"><span class="hide-txt">${etUI.$t('swiper.navigation.next', '다음 슬라이드')}</span></button>
      </div>
      `;
    },
  };

  return {
    $templateHTML,
  };
}
;


function toastTmpl() {
  const $templateHTML = ({ message }) => `
      <div class="toast-container">
        <div class="toast-content">
          <p class="toast-txt">${message}</p>
        </div>
      </div>
    `;
  const $templatCloseHTML = ({ message, closeText }) => `
      <div class="toast-container">
        <div class="toast-content">
          <p class="toast-txt">${message}</p>
          <button class="toast-close-btn">${closeText}<span class="hide-txt">팝업 닫기</span></button>
        </div>
      </div>
    `;

  const $templateLinkHTML = ({ message, link }) => `
      <div class="toast-container">
        <div class="toast-content">
          <p class="toast-txt">${message}</p>
          <a href="${link}" class="toast-link-btn">링크</a>
        </div>
      </div>
    `;

  return {
    $templateHTML,
    $templatCloseHTML,
    $templateLinkHTML
  };
}
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwidXRpbHMvYXJyYXkuanMiLCJ1dGlscy9ib29sZWFuLmpzIiwidXRpbHMvZGF0ZS5qcyIsInV0aWxzL2RvbS5qcyIsInV0aWxzL2ZuLmpzIiwidXRpbHMvbWF0aC5qcyIsInV0aWxzL29iamVjdC5qcyIsInV0aWxzL3N0cmluZy5qcyIsInV0aWxzL2luZGV4LmNqcyIsImhvb2tzL3VzZUExMXlLZXlFdmVudC5qcyIsImhvb2tzL3VzZUNsaWNrT3V0c2lkZS5qcyIsImhvb2tzL3VzZUNvcmUuanMiLCJob29rcy91c2VEYXRhc2V0LmpzIiwiaG9va3MvdXNlRGlhbG9nLmpzIiwiaG9va3MvdXNlRGlhbG9nVG1wbC5qcyIsImhvb2tzL3VzZUV2ZW50TGlzdGVuZXIuanMiLCJob29rcy91c2VHZXRDbGllbnRSZWN0LmpzIiwiaG9va3MvdXNlTGF5ZXIuanMiLCJob29rcy91c2VNZWRpYVF1ZXJ5LmpzIiwiaG9va3MvdXNlTXV0YXRpb25TdGF0ZS5qcyIsImhvb2tzL3VzZVNlbGVjdEJveFRtcGwuanMiLCJob29rcy91c2VTdGF0ZS5qcyIsImhvb2tzL3VzZVN3aXBlclRtcGwuanMiLCJob29rcy91c2VUcmFuc2l0aW9uLmpzIiwiaG9va3MvaW5kZXguY2pzIiwiY29tcG9uZW50cy9BY2NvcmRpb24uanMiLCJjb21wb25lbnRzL0NvbGxhcHNlLmpzIiwiY29tcG9uZW50cy9EYXRlcGlja2VyQ29tcC5qcyIsImNvbXBvbmVudHMvRGlhbG9nLmpzIiwiY29tcG9uZW50cy9JbnB1dC5qcyIsImNvbXBvbmVudHMvTG90dGllLmpzIiwiY29tcG9uZW50cy9Nb2RhbC5qcyIsImNvbXBvbmVudHMvU2VsZWN0Ym94LmpzIiwiY29tcG9uZW50cy9Td2lwZXIuanMiLCJjb21wb25lbnRzL1RhYi5qcyIsImNvbXBvbmVudHMvVG9hc3QuanMiLCJjb21wb25lbnRzL1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL2luZGV4LmNqcyIsImluaXQuanMiLCJ0ZW1wbGF0ZXMvZGlhbG9nVG1wbC5qcyIsInRlbXBsYXRlcy9pbmRleC5janMiLCJ0ZW1wbGF0ZXMvaW5wdXRUbXBsLmpzIiwidGVtcGxhdGVzL3ByaXZhY3lfcG9saWN5X3RlbXBsYXRlLmpzIiwidGVtcGxhdGVzL3NlbGVjdEJveFRtcGwuanMiLCJ0ZW1wbGF0ZXMvc3dpcGVyVG1wbC5qcyIsInRlbXBsYXRlcy90b2FzdFRtcGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakJBO0FBQ0E7OztBQ0RBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDL1VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDclRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFnQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXNzZXRzL3NjcmlwdHMvY29tbW9uLnVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZXRVSSA9IHt9O1xuLy8gY29uZmlnXG5ldFVJLmNvbmZpZyA9IHtcbiAgbWVkaWE6IHtcbiAgICBuYW1lczogWydpc01vYmlsZScsICdpc0Rlc2t0b3AnXSxcbiAgICBwb2ludHM6IFsxMDIzXSxcbiAgfSxcbiAgYW5pbWF0aW9uOiB7XG4gICAgZHVyYXRpb246IDAuNCxcbiAgICBzdGFnZ2VyOiAwLjEsXG4gICAgZWFzaW5nOiAnUG93ZXIyLmVhc2VPdXQnLFxuICB9LFxuICBsYXllcjoge1xuICAgIGRpbW1PcGFjaXR5OiAwLjYsXG4gIH0sXG4gIGluaXREZWZhdWx0KCkge1xuICAgIGdzYXAuZGVmYXVsdHMoe1xuICAgICAgZWFzZTogdGhpcy5hbmltYXRpb24uZWFzaW5nLFxuICAgICAgZHVyYXRpb246IHRoaXMuYW5pbWF0aW9uLmR1cmF0aW9uLFxuICAgIH0pO1xuICB9LFxuICBsZW5pczoge1xuICAgIGVuYWJsZTogZmFsc2UsXG4gICAgb3B0aW9uczoge30sXG4gICAgc3BlZWQ6IDIwMDAsXG4gICAgbGFnU21vb3RoaW5nOiAwLFxuICB9LFxuICBsb2NhbGU6IHtcbiAgICBkZWZhdWx0OiAna28nLFxuICB9LFxuICBsb3R0aWU6IHtcbiAgICBiYXNlUGF0aDogbG9jYXRpb24ucGF0aG5hbWUuc3RhcnRzV2l0aCgnL3AvJykgPyAnL3AvYXNzZXRzL2ltYWdlcy9sb3R0aWUnIDogJy9hc3NldHMvaW1hZ2VzL2xvdHRpZScsXG4gIH0sXG59O1xuZXRVSS5jb25maWcuaW5pdERlZmF1bHQoKTtcblxuLy8gcGFnZXNcbmV0VUkucGFnZXMgPSB7fTtcblxuZXRVSS5sb2NhbGVzID0ge307XG5ldFVJLmxvY2FsZXMua28gPSB7XG4gIGlucHV0OiB7XG4gICAgcGFzc3dvcmRfaGlkZTogJ+u5hOuwgOuyiO2YuCDsiKjquLDquLAnLFxuICAgIHBhc3N3b3JkX3Nob3c6ICfruYTrsIDrsojtmLgg7ZGc7IucJyxcbiAgICBjbGVhcjogJ+uCtOyaqSDsp4DsmrDquLAnLFxuICB9LFxuICBzd2lwZXI6IHtcbiAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICBwcmV2OiAn7J207KCEIOyKrOudvOydtOuTnCcsXG4gICAgICBuZXh0OiAn64uk7J2MIOyKrOudvOydtOuTnCcsXG4gICAgfSxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICBwYWdlOiAn7Y6Y7J207KeAJyxcbiAgICB9LFxuICAgIGF1dG9wbGF5OiB7XG4gICAgICBwbGF5OiAn7J6s7IOdJyxcbiAgICAgIHBhdXNlOiAn7KCV7KeAJyxcbiAgICB9LFxuICB9LFxuICBkaWFsb2c6IHtcbiAgICBwb3NpdGl2ZTogJ+2ZleyduCcsXG4gICAgbmVnYXRpdmU6ICfst6jshownLFxuICB9LFxufTtcblxuZXRVSS4kdCA9IGZ1bmN0aW9uIChrZXksIGRlZmF1bHRUZXh0ID0gJycpIHtcbiAgY29uc3QgbG9jYWxlID0gZXRVSS5sb2NhbGVzW2V0VUkuY29uZmlnLmxvY2FsZS5kZWZhdWx0XTtcbiAgcmV0dXJuIGV0VUkudXRpbHMuZ2V0VmFsdWVGcm9tTmVzdGVkT2JqZWN0KGxvY2FsZSwga2V5KSB8fCBkZWZhdWx0VGV4dDtcbn07XG5cbndpbmRvdy5ldFVJID0gZXRVSTtcbiIsIi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIGlzIGFuIGFycmF5XG4gKiBAcGFyYW0gdmFsdWUge2FueX1cbiAqIEByZXR1cm5zIHthcmcgaXMgYW55W119XG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxuXG5cbi8qKlxuICog7ISk66qFXG4gKiBAcGFyYW0gY2xlYW51cHMgIHtmdW5jdGlvbltdfVxuICovXG5mdW5jdGlvbiBhbGxDbGVhbnVwcyhjbGVhbnVwcykge1xuICBjbGVhbnVwcy5mb3JFYWNoKChjbGVhbnVwKSA9PiBjbGVhbnVwKCkpO1xufVxuIiwiLy8gYm9vbGVhbiDqtIDroKgg6riw64qlXG4iLCIvLyDrgqDsp5wg6rSA66CoIOq4sOuKpVxuIiwiLyoqXG4gKiBzZXQgYXR0cmlidXRlXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XG4gKiBAcGFyYW0gb3B0c1xuICovXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eShwYXJlbnQsIC4uLm9wdHMpIHtcbiAgaWYgKG9wdHMubGVuZ3RoID09PSAyKSB7XG4gICAgY29uc3QgW3Byb3BlcnR5LCB2YWx1ZV0gPSBvcHRzO1xuXG4gICAgcGFyZW50Py5zZXRBdHRyaWJ1dGUocHJvcGVydHksIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChvcHRzLmxlbmd0aCA9PT0gMykge1xuICAgIGNvbnN0IFtzZWxlY3RvciwgcHJvcGVydHksIHZhbHVlXSA9IG9wdHM7XG5cbiAgICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik/LnNldEF0dHJpYnV0ZShwcm9wZXJ0eSwgdmFsdWUpO1xuICB9XG59XG5cbi8qKlxuICogZ2V0IGF0dHJpYnV0ZVxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxuICogQHBhcmFtIHsgU3RyaW5nIH0gc2VsZWN0b3JcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5KHBhcmVudCwgc2VsZWN0b3IsIHByb3BlcnR5KSB7XG4gIHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKT8uZ2V0QXR0cmlidXRlKHByb3BlcnR5KTtcbn1cblxuLyoqXG4gKiBzZXQgc3R5bGVcbiAqIEBwYXJhbSB7IEVsZW1lbnQgfSBwYXJlbnRcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBwcm9wZXJ0eVxuICogQHBhcmFtIHsgYW55IH0gdmFsdWVcbiAqL1xuZnVuY3Rpb24gc2V0U3R5bGUocGFyZW50LCBzZWxlY3RvciwgcHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpIHtcbiAgICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcikuc3R5bGVbcHJvcGVydHldID0gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBnc2Fw7J2YIFNwbGl0VGV4dOulvCDtmZzsmqntlZjsl6wg66y47J6Q66W8IOu2hOumrO2VmOyXrCDrp4jsiqTtgawg6rCA64ql7ZWY6rKMIO2VtOykgOuLpC5cbiAqIEBwYXJhbSBzZWxlY3RvciAge3N0cmluZ31cbiAqIEBwYXJhbSB0eXBlICB7J2xpbmVzJ3wnd29yZHMnfCdjaGFycyd9XG4gKiBAcmV0dXJucyBbSFRNTEVsZW1lbnRbXSwgSFRNTEVsZW1lbnRbXV1cbiAqL1xuZnVuY3Rpb24gc3BsaXRUZXh0TWFzayhzZWxlY3RvciwgdHlwZSA9ICdsaW5lcycsIGlzT3ZlcmZsb3cgPSB0cnVlKSB7XG4gIGxldCAkcXVvdGU7XG5cbiAgZnVuY3Rpb24gd3JhcChlbCwgd3JhcHBlcikge1xuICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIGVsKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09IFN0cmluZykge1xuICAgICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICB9IGVsc2Uge1xuICAgICRxdW90ZSA9IHNlbGVjdG9yO1xuICB9XG4gIC8vIGNvbnN0ICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLFxuXG4gIGNvbnN0IG15U3BsaXRUZXh0ID0gbmV3IFNwbGl0VGV4dCgkcXVvdGUsIHsgdHlwZSB9KTtcblxuICBjb25zdCAkc3BsaXR0ZWQgPSBteVNwbGl0VGV4dFt0eXBlXTtcbiAgY29uc3QgJGxpbmVXcmFwID0gW107XG4gICRzcGxpdHRlZC5mb3JFYWNoKCgkZWwsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgJGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGlmIChpc092ZXJmbG93KSB7XG4gICAgICAkZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgfVxuICAgICRkaXYuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIC8vICRkaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgJGRpdi5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgJGRpdi5jbGFzc0xpc3QuYWRkKCdzcGxpdC10ZXh0LXdyYXAnKTtcbiAgICB3cmFwKCRlbCwgJGRpdik7XG4gICAgJGxpbmVXcmFwLnB1c2goJGRpdik7XG4gIH0pO1xuXG4gIHJldHVybiBbJHNwbGl0dGVkLCAkbGluZVdyYXBdO1xufVxuXG5mdW5jdGlvbiBzcGxpdFRleHRNYXNrQmxvY2soc2VsZWN0b3IsIHR5cGUgPSAnbGluZXMnLCBpc092ZXJmbG93ID0gdHJ1ZSkge1xuICBsZXQgJHF1b3RlO1xuXG4gIGZ1bmN0aW9uIHdyYXAoZWwsIHdyYXBwZXIpIHtcbiAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBlbCk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XG4gIH1cblxuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICB9IGVsc2Uge1xuICAgICRxdW90ZSA9IHNlbGVjdG9yO1xuICB9XG4gIC8vIGNvbnN0ICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLFxuICBpZiAoWy4uLiRxdW90ZS5jaGlsZHJlbl0uc29tZSgoZWwpID0+IGVsLmNsYXNzTGlzdC5jb250YWlucygnc3BsaXQtdGV4dC13cmFwJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbXlTcGxpdFRleHQgPSBuZXcgU3BsaXRUZXh0KCRxdW90ZSwgeyB0eXBlIH0pO1xuXG4gIGNvbnN0ICRzcGxpdHRlZCA9IG15U3BsaXRUZXh0W3R5cGVdO1xuICBjb25zdCAkbGluZVdyYXAgPSBbXTtcbiAgJHNwbGl0dGVkLmZvckVhY2goKCRlbCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCAkZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaWYgKGlzT3ZlcmZsb3cpIHtcbiAgICAgICRkaXYuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICB9XG4gICAgJGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgJGRpdi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAkZGl2LmNsYXNzTGlzdC5hZGQoJ3NwbGl0LXRleHQtd3JhcCcpO1xuICAgIHdyYXAoJGVsLCAkZGl2KTtcbiAgICAkbGluZVdyYXAucHVzaCgkZGl2KTtcbiAgfSk7XG5cbiAgcmV0dXJuIFskc3BsaXR0ZWQsICRsaW5lV3JhcF07XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBlbCAge3N0cmluZ3xIVE1MRWxlbWVudH1cbiAqIEByZXR1cm5zIHtOb2RlfVxuICovXG5mdW5jdGlvbiB3cmFwTWFzayhlbCkge1xuICBjb25zdCAkZWwgPSBldFVJLnV0aWxzLnNlbGVjdG9yU3RyaW5nVG9FbGVtZW50KGVsKTtcbiAgaWYgKCRlbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndWktbWFzaycpKSB7XG4gICAgcmV0dXJuICRlbC5wYXJlbnROb2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcChlbCwgd3JhcHBlcikge1xuICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIGVsKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuXG4gIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoJGVsKTtcbiAgY29uc3QgJGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAkZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICRkaXYuc3R5bGUucG9zaXRpb24gPSBzdHlsZS5wb3NpdGlvbiB8fCBudWxsO1xuICBpZiAoc3R5bGUucG9zaXRpb24gPT09ICdhYnNvbHV0ZScgfHwgc3R5bGUucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAkZGl2LnN0eWxlLnRvcCA9IHN0eWxlLnRvcDtcbiAgICAkZGl2LnN0eWxlLmxlZnQgPSBzdHlsZS5sZWZ0O1xuICAgICRkaXYuc3R5bGUucmlnaHQgPSBzdHlsZS5yaWdodDtcbiAgICAkZGl2LnN0eWxlLmJvdHRvbSA9IHN0eWxlLmJvdHRvbTtcblxuICAgICRlbC5zdHlsZS50b3AgPSAwO1xuICAgICRlbC5zdHlsZS5sZWZ0ID0gMDtcbiAgICAkZWwuc3R5bGUucmlnaHQgPSAwO1xuICAgICRlbC5zdHlsZS5ib3R0b20gPSAwO1xuICB9XG4gICRkaXYuc3R5bGUuZGlzcGxheSA9IHN0eWxlLmRpc3BsYXkgfHwgbnVsbDtcbiAgJGRpdi5jbGFzc0xpc3QuYWRkKCd1aS1tYXNrJyk7XG4gIHdyYXAoJGVsLCAkZGl2KTtcblxuICByZXR1cm4gJGRpdjtcbn1cblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiBzZXREb2NIZWlnaHQoKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1kb2MtaGVpZ2h0Jywgd2luZG93LmlubmVySGVpZ2h0ICsgJ3B4Jyk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5kYXRhc2V0LmRvY0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGFyckJyZWFrUG9pbnROYW1lXG4gKiBAcGFyYW0gYXJyQnJlYWtQb2ludFxuICogQHJldHVybnMge3t9fVxuICovXG5mdW5jdGlvbiBnZXRNZWRpYVF1ZXJ5Q29uZGl0aW9uKGFyckJyZWFrUG9pbnROYW1lLCBhcnJCcmVha1BvaW50KSB7XG4gIGlmIChhcnJCcmVha1BvaW50TmFtZS5sZW5ndGggIT09IGFyckJyZWFrUG9pbnQubGVuZ3RoICsgMSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2FyckJyZWFrUG9pbnROYW1lLmxlbmd0aCAhPT0gYXJyQnJlYWtQb2ludC5sZW5ndGggKyAxJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbWVkaWFRdWVyeUNvbmRpdGlvbiA9IHt9O1xuXG4gIGNvbnN0IGFyciA9IFtdLFxuICAgIGxlbmd0aCA9IGFyckJyZWFrUG9pbnQubGVuZ3RoO1xuICBhcnIucHVzaChgKG1heC13aWR0aDogJHthcnJCcmVha1BvaW50WzBdIC0gMX1weClgKTtcblxuICBuZXcgQXJyYXkobGVuZ3RoIC0gMSkuZmlsbCgwKS5mb3JFYWNoKChfLCBpbmRleCkgPT4ge1xuICAgIGFyci5wdXNoKGAobWluLXdpZHRoOiAke2FyckJyZWFrUG9pbnRbaW5kZXhdfXB4KSBhbmQgKG1heC13aWR0aDogJHthcnJCcmVha1BvaW50W2luZGV4ICsgMV0gLSAxfXB4KWApO1xuICB9KTtcblxuICBhcnIucHVzaChgKG1pbi13aWR0aDogJHthcnJCcmVha1BvaW50W2xlbmd0aCAtIDFdfXB4KWApO1xuXG4gIGFyckJyZWFrUG9pbnROYW1lLmZvckVhY2goKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgbWVkaWFRdWVyeUNvbmRpdGlvbltuYW1lXSA9IGFycltpbmRleF07XG4gIH0pO1xuXG4gIG1lZGlhUXVlcnlDb25kaXRpb25bJ3JlZHVjZU1vdGlvbiddID0gJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJztcbiAgbWVkaWFRdWVyeUNvbmRpdGlvblsnaXNEYXJrJ10gPSAnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKSc7XG4gIG1lZGlhUXVlcnlDb25kaXRpb25bJ2lzTGlnaHQnXSA9ICcocHJlZmVycy1jb2xvci1zY2hlbWU6IGxpZ2h0KSc7XG5cbiAgcmV0dXJuIG1lZGlhUXVlcnlDb25kaXRpb247XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBmblxuICovXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnKSB7XG4gICAgZm4oKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUxpc3R9IHRhcmdldFxuICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAqL1xuZnVuY3Rpb24gZmlyc3ROb2RlKHRhcmdldCkge1xuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICB9IGVsc2UgaWYgKE5vZGVMaXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKHRhcmdldCkpIHtcbiAgICBpZiAodGFyZ2V0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldFswXTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICByZXR1cm4gdGFyZ2V0WzBdO1xuICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUxpc3R9IHRhcmdldFxuICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAqL1xuZnVuY3Rpb24gbGFzdE5vZGUodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRhcmdldClbZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YXJnZXQpLmxlbmd0aCAtIDFdO1xuICB9IGVsc2UgaWYgKE5vZGVMaXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKHRhcmdldCkpIHtcbiAgICBpZiAodGFyZ2V0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldFt0YXJnZXQubGVuZ3RoIC0gMV07XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIHRhcmdldFt0YXJnZXQubGVuZ3RoIC0gMV07XG4gIH1cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHN0clxuICogQHJldHVybnMgeypbXX1cbiAqL1xuZnVuY3Rpb24gcGFyc2VIVE1MKHN0cikge1xuICBjb25zdCB0bXAgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJycpO1xuICB0bXAuYm9keS5pbm5lckhUTUwgPSBzdHI7XG4gIHJldHVybiBbLi4udG1wLmJvZHkuY2hpbGROb2Rlc107XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gc2V0dXBMZW5pcygpIHtcbiAgY29uc3QgbGVuaXMgPSBuZXcgTGVuaXMoZXRVSS5jb25maWcubGVuaXMub3B0aW9ucyB8fCB7fSk7XG5cbiAgbGVuaXMub24oJ3Njcm9sbCcsIChlKSA9PiB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gIH0pO1xuXG4gIGxlbmlzLm9uKCdzY3JvbGwnLCBTY3JvbGxUcmlnZ2VyLnVwZGF0ZSk7XG5cbiAgZ3NhcC50aWNrZXIuYWRkKCh0aW1lKSA9PiB7XG4gICAgbGVuaXMucmFmKHRpbWUgKiBldFVJLmNvbmZpZy5sZW5pcy5zcGVlZCB8fCAxMDAwKTtcbiAgfSk7XG5cbiAgZ3NhcC50aWNrZXIubGFnU21vb3RoaW5nKGV0VUkuY29uZmlnLmxlbmlzLmxhZ1Ntb290aGluZyk7XG5cbiAgZXRVSS5sZW5pcyA9IGxlbmlzO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gc2VsZWN0b3IgIHtzdHJpbmd8SFRNTEVsZW1lbnR9XG4gKiBAcmV0dXJucyB7RWxlbWVudHwqfVxuICovXG5mdW5jdGlvbiBzZWxlY3RvclN0cmluZ1RvRWxlbWVudChzZWxlY3Rvcikge1xuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn1cblxuLyoqXG4gKiDtjpjsnbTsp4DsnZgg66qo65OgIOyalOyGjOulvCDtg5Dsg4ntlZjsl6wg6rOg7KCV65CcIOyalOyGjOuTpOydmCDrhpLsnbTrpbwg6rOE7IKw7ZWp64uI64ukLlxuICog7IaN7ISxIOqwkuydtCBmaXhlZCwgc3RpY2t57J246rK97JygIO2BtOuemOyKpCDstpTqsIDtlaDsp4Ag7ZiR7J2Y7ZW07JW87ZWp64uI64ukLlxuICog7YWM7Iqk7Yq47KSRXG4gKiBAcmV0dXJucyB7bnVtYmVyfSDqs6DsoJXrkJwg7JqU7IaM65Ok7J2YIOy0nSDrhpLsnbRcbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlRml4ZWRFbGVtZW50c0hlaWdodCgpIHtcbiAgY29uc3QgZml4ZWRFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maXhlZCwgLnN0aWNreScpO1xuICBsZXQgdG90YWxGaXhlZEhlaWdodCA9IDA7XG5cbiAgZml4ZWRFbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbiAgICBpZiAoc3R5bGUucG9zaXRpb24gPT09ICdmaXhlZCcgfHwgc3R5bGUucG9zaXRpb24gPT09ICdzdGlja3knKSB7XG4gICAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlLmhlaWdodCkgfHwgMDtcbiAgICAgIGNvbnN0IHRvcCA9IHBhcnNlRmxvYXQoc3R5bGUudG9wKSB8fCAwO1xuICAgICAgdG90YWxGaXhlZEhlaWdodCArPSBoZWlnaHQgKyB0b3A7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdG90YWxGaXhlZEhlaWdodDtcbn1cblxuLyoqXG4gKiDtirnsoJUg7JqU7IaMIOuYkOuKlCDsnITsuZjroZwg67aA65Oc65+96rKMIOyKpO2BrOuhpO2VqeuLiOuLpC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8bnVtYmVyfSB0YXJnZXQgLSDsiqTtgazroaTtlaAg66qp7ZGcIOyalOyGjCDrmJDripQg7JyE7LmYLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSDsiqTtgazroaQg7Ji17IWYIOqwneyytC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5vZmZzZXQ9MF0gLSDstpTqsIAg7Jik7ZSE7IWLIOqwki5cbiAqL1xuZnVuY3Rpb24gc2Nyb2xsVG9Qb3NpdGlvbih0YXJnZXQsIHsgb2Zmc2V0ID0gMCB9ID0ge30pIHtcbiAgY29uc3QgdG90YWxGaXhlZEhlaWdodCA9IGNhbGN1bGF0ZUZpeGVkRWxlbWVudHNIZWlnaHQoKTtcbiAgY29uc3QgdG90YWxPZmZzZXQgPSB0b3RhbEZpeGVkSGVpZ2h0ICsgb2Zmc2V0O1xuXG4gIGNvbnN0IHRhcmdldFBvc2l0aW9uID1cbiAgICB0eXBlb2YgdGFyZ2V0ID09PSAnbnVtYmVyJ1xuICAgICAgPyB0YXJnZXQgLSB0b3RhbE9mZnNldFxuICAgICAgOiB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICAgICAgICA/IHRhcmdldC5vZmZzZXRUb3AgLSB0b3RhbE9mZnNldFxuICAgICAgICA6ICgoKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RhcmdldCBtdXN0IGJlIGFuIEhUTUxFbGVtZW50IG9yIGEgbnVtYmVyJyk7XG4gICAgICAgICAgfSkoKTtcblxuICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IHRhcmdldFBvc2l0aW9uLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG59XG4iLCJmdW5jdGlvbiBkZWJvdW5jZShjYWxsYmFjaywgZGVsYXkgPSAyNTApIHtcbiAgbGV0IHRpbWVvdXRJZDtcblxuICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGhyb3R0bGUoY2FsbGJhY2ssIGRlbGF5ID0gMjUwKSB7XG4gIGxldCBpc1Rocm90dGxlZCA9IGZhbHNlO1xuICBsZXQgYXJncztcbiAgbGV0IGNvbnRleHQ7XG5cbiAgZnVuY3Rpb24gd3JhcHBlciguLi53cmFwcGVyQXJncykge1xuICAgIGlmIChpc1Rocm90dGxlZCkge1xuICAgICAgYXJncyA9IHdyYXBwZXJBcmdzO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaXNUaHJvdHRsZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIHdyYXBwZXJBcmdzKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlzVGhyb3R0bGVkID0gZmFsc2U7XG4gICAgICBpZiAoYXJncykge1xuICAgICAgICB3cmFwcGVyLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBhcmdzID0gY29udGV4dCA9IG51bGw7XG4gICAgICB9XG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbmZ1bmN0aW9uIGlzTWFya2VyUVMoKSB7XG4gIHJldHVybiBsb2NhdGlvbi5zZWFyY2guaW5jbHVkZXMoJ21hcmtlcjEyMTIxMicpO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyRXZlbnQoZWwsIGV2ZW50VHlwZSkge1xuICBpZiAodHlwZW9mIGV2ZW50VHlwZSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGVsW2V2ZW50VHlwZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICBlbFtldmVudFR5cGVdKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZXZlbnQgPSB0eXBlb2YgZXZlbnRUeXBlID09PSAnc3RyaW5nJyA/IG5ldyBFdmVudChldmVudFR5cGUsIHsgYnViYmxlczogdHJ1ZSB9KSA6IGV2ZW50VHlwZTtcbiAgICBlbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxufVxuIiwiLy8g7Jew7IKwIOq0gOugqCAo7J6Q66OM7ZiVTnVtYmVyICsgbnVtYmVyKVxuZnVuY3Rpb24gZ2V0QmxlbmRPcGFjaXR5KG9wYWNpdHksIGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIG9wYWNpdHk7XG4gIH1cblxuICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSBvcGFjaXR5LCAxIC8gbGVuZ3RoKTtcbn1cbiIsIi8vIG9iamVjdCDqtIDroKgg6riw64qlXG5cbi8qKlxuICogY29tcGFyZSBvYmpcbiAqIEBwYXJhbSB7IE9iamVjdCB9IG9iajFcbiAqIEBwYXJhbSB7IE9iamVjdCB9IG9iajJcbiAqIEByZXR1cm5zIEJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gc2hhbGxvd0NvbXBhcmUob2JqMSwgb2JqMikge1xuICBjb25zdCBrZXlzID0gWy4uLk9iamVjdC5rZXlzKG9iajEpLCBPYmplY3Qua2V5cyhvYmoyKV07XG5cbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgIGlmICh0eXBlb2Ygb2JqMVtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqMltrZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKCFldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKG9iajFba2V5XSwgb2JqMltrZXldKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJvbGUgPSAhb2JqMltrZXldIHx8IHR5cGVvZiBvYmoxW2tleV0gPT09ICdmdW5jdGlvbic7XG4gICAgICBpZiAoIXJvbGUgJiYgb2JqMVtrZXldICE9PSBvYmoyW2tleV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNEZWVwRXF1YWwob2JqZWN0MSwgb2JqZWN0Mikge1xuICBjb25zdCBvYmpLZXlzMSA9IE9iamVjdC5rZXlzKG9iamVjdDEpO1xuICBjb25zdCBvYmpLZXlzMiA9IE9iamVjdC5rZXlzKG9iamVjdDIpO1xuXG4gIGlmIChvYmpLZXlzMS5sZW5ndGggIT09IG9iaktleXMyLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gIGZvciAodmFyIGtleSBvZiBvYmpLZXlzMSkge1xuICAgIGNvbnN0IHZhbHVlMSA9IG9iamVjdDFba2V5XTtcbiAgICBjb25zdCB2YWx1ZTIgPSBvYmplY3QyW2tleV07XG5cbiAgICBjb25zdCBpc09iamVjdHMgPSBpc09iamVjdCh2YWx1ZTEpICYmIGlzT2JqZWN0KHZhbHVlMik7XG5cbiAgICBpZiAoKGlzT2JqZWN0cyAmJiAhaXNEZWVwRXF1YWwodmFsdWUxLCB2YWx1ZTIpKSB8fCAoIWlzT2JqZWN0cyAmJiB2YWx1ZTEgIT09IHZhbHVlMikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvYmpcbiAqIEBwYXJhbSBrZXlcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21OZXN0ZWRPYmplY3Qob2JqLCBrZXkpIHtcbiAgY29uc3Qga2V5cyA9IGtleS5zcGxpdCgnLicpO1xuXG4gIHJldHVybiBrZXlzLnJlZHVjZSgoYWNjLCBjdXJyS2V5KSA9PiB7XG4gICAgcmV0dXJuIGFjYyAmJiBhY2NbY3VycktleV0gIT09IHVuZGVmaW5lZCA/IGFjY1tjdXJyS2V5XSA6IHVuZGVmaW5lZDtcbiAgfSwgb2JqKTtcbn1cbiIsIi8qKlxuICogUmV2ZXJzZSBhIHN0cmluZ1xuICogQHBhcmFtIHN0ciB7c3RyaW5nfVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcmV2ZXJzZVN0cmluZyhzdHIpIHtcbiAgcmV0dXJuIHN0ci5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpO1xufVxuXG4vKipcbiAqIEdldCBhIHJhbmRvbSBpZFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0UmFuZG9tSWQoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMik7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBwcmVmaXhcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldFJhbmRvbVVJSUQocHJlZml4ID0gJ3VpJykge1xuICByZXR1cm4gYCR7cHJlZml4fS0ke2dldFJhbmRvbUlkKCl9YDtcbn1cblxuLyoqXG4gKiDssqvquIDsnpDrp4wg64yA66y47J6Q66GcIOuzgO2ZmFxuICogQHBhcmFtIHdvcmRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGNhcGl0YWxpemUod29yZCkge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSlcbn1cblxuLyoqXG4gKiDssqvquIDsnpDrp4wg7IaM66y47J6Q66GcIOuzgO2ZmFxuICogQHBhcmFtIHdvcmRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHVuY2FwaXRhbGl6ZSh3b3JkKSB7XG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgd29yZC5zbGljZSgxKVxufVxuXG5mdW5jdGlvbiBhZGRQcmVmaXhDYW1lbFN0cmluZyhzdHIsIHByZWZpeCl7XG4gIC8vIGRpbW1DbGljayA9PiBwcm9wc0RpbW1DbGlja1xuICByZXR1cm4gcHJlZml4ICsgZXRVSS51dGlscy5jYXBpdGFsaXplKHN0cilcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcoc3RyLCBwcmVmaXgpe1xuICBjb25zdCByZWdFeHAgPSBuZXcgUmVnRXhwKGBeJHtwcmVmaXh9YCwgJ2cnKVxuICByZXR1cm4gZXRVSS51dGlscy51bmNhcGl0YWxpemUoc3RyLnJlcGxhY2VBbGwocmVnRXhwLCAnJykpXG5cbn1cblxuZnVuY3Rpb24gY291bnRDaGFyYWN0ZXJzKHN0cikge1xuICBsZXQgY291bnQgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIENoZWNrIGlmIHRoZSBjaGFyYWN0ZXIgaXMgRW5nbGlzaFxuICAgIGlmICgvW2EtekEtWl0vLnRlc3Qoc3RyW2ldKSkge1xuICAgICAgY291bnQgKz0gMTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNoYXJhY3RlciBpcyBLb3JlYW4gb3Igb3RoZXIgMi1ieXRlIGNoYXJhY3RlclxuICAgIGVsc2UgaWYgKHN0ci5jaGFyQ29kZUF0KGkpID4gMTI3KSB7XG4gICAgICBjb3VudCArPSAyO1xuICAgIH1cbiAgICAvLyBTcGVjaWFsIGNoYXJhY3RlcnNcbiAgICBlbHNlIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3VudDtcbn1cbiIsIlxuZXRVSS51dGlscyA9IHtcbmlzQXJyYXksXG5hbGxDbGVhbnVwcyxcbnNldFByb3BlcnR5LFxuZ2V0UHJvcGVydHksXG5zZXRTdHlsZSxcbnNwbGl0VGV4dE1hc2ssXG5zcGxpdFRleHRNYXNrQmxvY2ssXG53cmFwTWFzayxcbnNldERvY0hlaWdodCxcbmdldE1lZGlhUXVlcnlDb25kaXRpb24sXG5yZWFkeSxcbmZpcnN0Tm9kZSxcbmxhc3ROb2RlLFxucGFyc2VIVE1MLFxuc2V0dXBMZW5pcyxcbnNlbGVjdG9yU3RyaW5nVG9FbGVtZW50LFxuY2FsY3VsYXRlRml4ZWRFbGVtZW50c0hlaWdodCxcbnNjcm9sbFRvUG9zaXRpb24sXG5kZWJvdW5jZSxcbnRocm90dGxlLFxuaXNNYXJrZXJRUyxcbnRyaWdnZXJFdmVudCxcbmdldEJsZW5kT3BhY2l0eSxcbnNoYWxsb3dDb21wYXJlLFxuaXNEZWVwRXF1YWwsXG5pc09iamVjdCxcbmdldFZhbHVlRnJvbU5lc3RlZE9iamVjdCxcbnJldmVyc2VTdHJpbmcsXG5nZXRSYW5kb21JZCxcbmdldFJhbmRvbVVJSUQsXG5jYXBpdGFsaXplLFxudW5jYXBpdGFsaXplLFxuYWRkUHJlZml4Q2FtZWxTdHJpbmcsXG5yZW1vdmVQcmVmaXhDYW1lbFN0cmluZyxcbmNvdW50Q2hhcmFjdGVyc1xufVxuICAgICAgICAgICAgICAiLCJmdW5jdGlvbiB1c2VBMTF5S2V5RXZlbnQoKSB7XG4gIGZ1bmN0aW9uIGZpcnN0Tm9kZUZvY3VzT3V0KHRhcmdldCwgaGFuZGxlcikge1xuICAgIHJldHVybiBldFVJLmhvb2tzLnVzZUV2ZW50TGlzdGVuZXIodGFyZ2V0LCAna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdUYWInICYmIGUuc2hpZnRLZXkpIHtcbiAgICAgICAgaGFuZGxlcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGFzdE5vZGVGb2N1c091dCh0YXJnZXQsIGhhbmRsZXIpIHtcbiAgICByZXR1cm4gZXRVSS5ob29rcy51c2VFdmVudExpc3RlbmVyKHRhcmdldCwgJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnVGFiJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgICBoYW5kbGVyKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZpcnN0Tm9kZUZvY3VzT3V0LFxuICAgIGxhc3ROb2RlRm9jdXNPdXQsXG4gIH07XG59XG4iLCIvKipcbiAqIHRhcmdldCnsnZgg7Jm467aA66W8IO2BtOumre2WiOydhCDrlYwg7L2c67CxIO2VqOyImOulvCDsi6TtlolcbiAqIOyYiOyZuOyggeycvOuhnCDtgbTrpq3snYQg7ZeI7Jqp7ZWgIOyalOyGjOuTpOydmCDshKDtg53snpDrpbwg7Y+s7ZWo7ZWY64qUIOuwsOyXtOydhCDsmLXshZjsnLzroZwg67Cb7J2EIOyImCDsnojsirXri4jri6QuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXQgLSDtgbTrpq0g7J2067Kk7Yq47J2YIOyZuOu2gCDtgbTrpq0g6rCQ7KeA66W8IOyImO2Wie2VoCDrjIDsg4EgRE9NIOyalOyGjOyeheuLiOuLpC4o7ZWE7IiYKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSDsmbjrtoAg7YG066at7J20IOqwkOyngOuQmOyXiOydhCDrlYwg7Iuk7ZaJ7ZWgIOy9nOuwsSDtlajsiJjsnoXri4jri6QuKO2VhOyImClcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZXhjZXB0aW9ucyAtIOyZuOu2gCDtgbTrpq0g6rCQ7KeA7JeQ7IScIOyYiOyZuCDsspjrpqztlaAg7JqU7IaM65Ok7J2YIOyEoO2DneyekOulvCDtj6ztlajtlZjripQg67Cw7Je07J6F64uI64ukLijsmLXshZgpXG4gKi9cbmZ1bmN0aW9uIHVzZUNsaWNrT3V0c2lkZSh0YXJnZXQsIGNhbGxiYWNrLCBleGNlcHRpb25zID0gW10pIHtcbiAgcmV0dXJuIGV0VUkuaG9va3MudXNlRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgaXNDbGlja0luc2lkZUV4Y2VwdGlvbiA9IGV4Y2VwdGlvbnMuc29tZSgoc2VsZWN0b3IpID0+IHtcbiAgICAgIGNvbnN0IGV4Y2VwdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIHJldHVybiBleGNlcHRpb25FbGVtZW50ICYmIGV4Y2VwdGlvbkVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIGlmICghdGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiYgIWlzQ2xpY2tJbnNpZGVFeGNlcHRpb24pIHtcbiAgICAgIGNhbGxiYWNrKHRhcmdldCk7XG4gICAgfVxuICB9KTtcbn1cbiIsImZ1bmN0aW9uIHVzZUNvcmUoXG4gIGluaXRpYWxQcm9wcyA9IHt9LFxuICBpbml0aWFsU3RhdGUgPSB7fSxcbiAgcmVuZGVyLFxuICBvcHRpb25zID0ge1xuICAgIGRhdGFzZXQ6IHRydWUsXG4gIH0sXG4pIHtcbiAgY29uc3QgYWN0aW9ucyA9IHt9O1xuICBsZXQgJHRhcmdldDtcbiAgY29uc3QgY2xlYW51cHMgPSBbXTtcbiAgY29uc3QgTk9fQlVCQkxJTkdfRVZFTlRTID0gWydibHVyJywgJ2ZvY3VzJywgJ2ZvY3VzaW4nLCAnZm9jdXNvdXQnLCAncG9pbnRlcmxlYXZlJ107XG4gIGNvbnN0IG9uU3RhdGVDaGFuZ2UgPSAoKSA9PiB7fTtcbiAgbGV0IHN0YXRlQ2FsbGJhY2s7XG4gIGNvbnN0IHByb3BzID0gbmV3IFByb3h5KGluaXRpYWxQcm9wcywge1xuICAgIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHN0YXRlID0gbmV3IFByb3h5KGluaXRpYWxTdGF0ZSwge1xuICAgIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHNldFRhcmdldChfJHRhcmdldCwgeyBzdGF0ZUNhbGxiYWNrOiBfc3RhdGVDYWxsYmFjayB9ID0ge30pIHtcbiAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgaWYgKF9zdGF0ZUNhbGxiYWNrKSB7XG4gICAgICBzdGF0ZUNhbGxiYWNrID0gX3N0YXRlQ2FsbGJhY2s7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YXNldCkge1xuICAgICAgY29uc3QgeyBnZXRQcm9wc0Zyb21EYXRhc2V0LCBnZXRWYXJzRnJvbURhdGFzZXQgfSA9IGV0VUkuaG9va3MudXNlRGF0YXNldCgkdGFyZ2V0KTtcbiAgICAgIGNvbnN0IGRhdGFzZXRQcm9wcyA9IGdldFByb3BzRnJvbURhdGFzZXQoKTtcbiAgICAgIGNvbnN0IGRhdGFzZXRWYXJzID0gZ2V0VmFyc0Zyb21EYXRhc2V0KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLmRhdGFzZXRQcm9wcyB9KTtcbiAgICAgIHNldFN0YXRlKHsgLi4uc3RhdGUsIC4uLmRhdGFzZXRWYXJzIH0sIHsgc2lsZW50OiB0cnVlLCBpbW1lZGlhdGU6IHRydWUgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0UHJvcHMobmV3UHJvcHMpIHtcbiAgICBPYmplY3Qua2V5cyhuZXdQcm9wcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBwcm9wc1trZXldID0gbmV3UHJvcHNba2V5XTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0YXRlKG5ld1N0YXRlLCB7IHNpbGVudCA9IGZhbHNlLCBpbW1lZGlhdGUgPSBmYWxzZSB9ID0ge30pIHtcbiAgICBpZiAoZXRVSS51dGlscy5pc0RlZXBFcXVhbChzdGF0ZSwgbmV3U3RhdGUpKSByZXR1cm47XG5cbiAgICBPYmplY3Qua2V5cyhuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzdGF0ZVtrZXldID0gbmV3U3RhdGVba2V5XTtcbiAgICB9KTtcbiAgICBpZiAoIXNpbGVudCAmJiByZW5kZXIgIT09IHVuZGVmaW5lZCAmJiByZW5kZXIgIT09IG51bGwgJiYgdHlwZW9mIHJlbmRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVuZGVyKGltbWVkaWF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YXNldCkge1xuICAgICAgY29uc3QgeyBzZXRWYXJzRnJvbURhdGFzZXQgfSA9IGV0VUkuaG9va3MudXNlRGF0YXNldCgkdGFyZ2V0KTtcbiAgICAgIHNldFZhcnNGcm9tRGF0YXNldChzdGF0ZSk7XG4gICAgfVxuXG4gICAgc3RhdGVDYWxsYmFjayAmJiBzdGF0ZUNhbGxiYWNrKHN0YXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEV2ZW50KGV2ZW50VHlwZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgJGV2ZW50VGFyZ2V0ID0gc2VsZWN0b3IgPyAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogJHRhcmdldDtcblxuICAgIGlmIChOT19CVUJCTElOR19FVkVOVFMuaW5jbHVkZXMoZXZlbnRUeXBlKSkge1xuICAgICAgY29uc3QgY2xlYW51cCA9IGV0VUkuaG9va3MudXNlRXZlbnRMaXN0ZW5lcigkZXZlbnRUYXJnZXQsIGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuICAgICAgcmV0dXJuIGNsZWFudXBzLnB1c2goY2xlYW51cCk7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnRIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBsZXQgJGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xuXG4gICAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICAgICRldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCRldmVudFRhcmdldCkge1xuICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50SGFuZGxlcik7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+ICR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50SGFuZGxlcik7XG4gICAgY2xlYW51cHMucHVzaChjbGVhbnVwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUV2ZW50KCkge1xuICAgIGV0VUkudXRpbHMuYWxsQ2xlYW51cHMoY2xlYW51cHMpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjbGVhbnVwcyxcbiAgICBzZXRUYXJnZXQsXG4gICAgYWN0aW9ucyxcbiAgICBzdGF0ZSxcbiAgICBwcm9wcyxcbiAgICBzZXRTdGF0ZSxcbiAgICBzZXRQcm9wcyxcbiAgICBhZGRFdmVudCxcbiAgICByZW1vdmVFdmVudCxcbiAgfTtcbn1cbiIsIi8qKlxuICogdXNlRGF0YXNldFxuICogQHBhcmFtICR0YXJnZXQge0hUTUxFbGVtZW50fVxuICovXG5mdW5jdGlvbiB1c2VEYXRhc2V0KCR0YXJnZXQpIHtcbiAgbGV0IGRhdGFzZXRQcm9wcyA9IHt9LFxuICAgIGRhdGFzZXRWYXJzID0ge307XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YXNldEJ5UHJlZml4KHByZWZpeCkge1xuICAgIGNvbnN0IGRhdGFzZXQgPSB7fTtcbiAgICBPYmplY3Qua2V5cygkdGFyZ2V0LmRhdGFzZXQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gJHRhcmdldC5kYXRhc2V0W2tleV07XG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5pbmNsdWRlcygneycpKXtcbiAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZighaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmKGtleS5zdGFydHNXaXRoKHByZWZpeCkpe1xuICAgICAgICBkYXRhc2V0W2V0VUkudXRpbHMucmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcoa2V5LCBwcmVmaXgpXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXREYXRhc2V0RXhjZXB0UHJlZml4KHByZWZpeCkge1xuICAgIGNvbnN0IGRhdGFzZXQgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKCR0YXJnZXQuZGF0YXNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSAkdGFyZ2V0LmRhdGFzZXRba2V5XTtcblxuICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZigha2V5LnN0YXJ0c1dpdGgocHJlZml4KSl7XG4gICAgICAgIGRhdGFzZXRbZXRVSS51dGlscy5yZW1vdmVQcmVmaXhDYW1lbFN0cmluZyhrZXksIHByZWZpeCldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldERhdGFzZXRCeVByZWZpeChkYXRhLCBwcmVmaXgpIHtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmKHByZWZpeCl7XG4gICAgICAgICR0YXJnZXQuZGF0YXNldFtgJHtwcmVmaXh9JHtldFVJLnV0aWxzLmNhcGl0YWxpemUoa2V5KX1gXSA9IGRhdGFba2V5XTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkdGFyZ2V0LmRhdGFzZXRba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByb3BzRnJvbURhdGFzZXQoKSB7XG4gICAgZGF0YXNldFByb3BzID0gZ2V0RGF0YXNldEJ5UHJlZml4KCdwcm9wcycpO1xuICAgIHJldHVybiBkYXRhc2V0UHJvcHM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWYXJzRnJvbURhdGFzZXQoKSB7XG4gICAgZGF0YXNldFZhcnMgPSBnZXREYXRhc2V0RXhjZXB0UHJlZml4KCdwcm9wcycpO1xuICAgIHJldHVybiBkYXRhc2V0VmFycztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFByb3BzRnJvbURhdGFzZXQocHJvcHMpIHtcbiAgICBzZXREYXRhc2V0QnlQcmVmaXgocHJvcHMsICdwcm9wcycpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0VmFyc0Zyb21EYXRhc2V0KHZhcnMpIHtcbiAgICBzZXREYXRhc2V0QnlQcmVmaXgodmFycywgJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RyaW5nVG9PYmplY3QocHJvcHMpIHtcbiAgICAvLyBkYXRhc2V07JeQ7IScIOqwneyytCDtmJXtg5zsnbgg7Iqk7Yq466eB6rCSIO2DgOyehSDqsJ3ssrTroZwg67CU6r+U7KSMXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMpIHtcbiAgICAgIGlmICghKHR5cGVvZiBwcm9wc1trZXldID09PSAnYm9vbGVhbicpICYmIHByb3BzW2tleV0uaW5jbHVkZXMoJ3snKSkge1xuICAgICAgICBwcm9wc1trZXldID0gSlNPTi5wYXJzZShwcm9wc1trZXldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldFByb3BzRnJvbURhdGFzZXQsXG4gICAgc2V0UHJvcHNGcm9tRGF0YXNldCxcbiAgICBnZXRWYXJzRnJvbURhdGFzZXQsXG4gICAgc2V0VmFyc0Zyb21EYXRhc2V0LFxuICAgIHNldFN0cmluZ1RvT2JqZWN0LFxuICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlRGlhbG9nKCkge1xuICBsZXQgJGxheWVyV3JhcEJveDtcblxuICBmdW5jdGlvbiBjcmVhdGVMYXllcldyYXAoKSB7XG4gICAgJGxheWVyV3JhcEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICRsYXllcldyYXBCb3guY2xhc3NMaXN0LmFkZCgnbGF5ZXItd3JhcCcpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoJGxheWVyV3JhcEJveCk7XG4gIH1cblxuICBjb25zdCBhbGVydCA9ICguLi5vcHRzKSA9PiB7XG4gICAgbGV0ICRsYXllcldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpO1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBldFVJLmNvbXBvbmVudHMuRGlhbG9nKCk7XG5cbiAgICBpZiAoISRsYXllcldyYXApIHtcbiAgICAgIGNyZWF0ZUxheWVyV3JhcCgpO1xuICAgICAgJGxheWVyV3JhcCA9ICRsYXllcldyYXBCb3g7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdhbGVydCcsIG1lc3NhZ2U6IG9wdHNbMF0sIGNhbGxiYWNrOiBvcHRzWzFdIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2FsZXJ0JywgLi4ub3B0c1swXSB9KTtcbiAgICB9XG5cbiAgICBkaWFsb2cub3BlbigpO1xuICB9O1xuXG4gIGNvbnN0IGNvbmZpcm0gPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgZXRVSS5jb21wb25lbnRzLkRpYWxvZygpO1xuXG4gICAgaWYgKCEkbGF5ZXJXcmFwKSB7XG4gICAgICBjcmVhdGVMYXllcldyYXAoKTtcbiAgICAgICRsYXllcldyYXAgPSAkbGF5ZXJXcmFwQm94O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0c1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAnY29uZmlybScsIG1lc3NhZ2U6IG9wdHNbMF0sIHBvc2l0aXZlQ2FsbGJhY2s6IG9wdHNbMV0gfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0c1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAnY29uZmlybScsIC4uLm9wdHNbMF0gfSk7XG4gICAgfVxuXG4gICAgZGlhbG9nLm9wZW4oKTtcbiAgfTtcblxuICBjb25zdCBwcmV2aWV3SW1hZ2UgPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgZXRVSS5jb21wb25lbnRzLkRpYWxvZygpO1xuXG4gICAgaWYgKCEkbGF5ZXJXcmFwKSB7XG4gICAgICBjcmVhdGVMYXllcldyYXAoKTtcbiAgICAgICRsYXllcldyYXAgPSAkbGF5ZXJXcmFwQm94O1xuICAgIH1cblxuICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAncHJldmlld0ltYWdlJywgLi4ub3B0c1swXSB9KTtcblxuICAgIGRpYWxvZy5vcGVuKCk7XG4gIH07XG5cbiAgY29uc3QgdG9hc3RCYXNpYyA9ICguLi5vcHRzKSA9PiB7XG4gICAgbGV0ICR0b2FzdFdyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9hc3Qtd3JhcCcpXG4gICAgY29uc3QgdG9hc3QgPSBuZXcgZXRVSS5jb21wb25lbnRzLlRvYXN0KCk7XG5cbiAgICBpZiAoISR0b2FzdFdyYXApIHJldHVybjtcblxuICAgIHRvYXN0LmNvcmUuaW5pdCgkdG9hc3RXcmFwLCB7dHlwZTogJ2Jhc2ljJywgLi4ub3B0c1swXX0pO1xuICAgIHRvYXN0Lm9wZW4oKTtcbiAgfVxuXG4gIGNvbnN0IHRvYXN0Q2xvc2VCdG4gPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkdG9hc3RXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvYXN0LXdyYXAnKVxuICAgIGNvbnN0IHRvYXN0ID0gbmV3IGV0VUkuY29tcG9uZW50cy5Ub2FzdCgpO1xuXG4gICAgaWYgKCEkdG9hc3RXcmFwKSByZXR1cm47XG5cbiAgICB0b2FzdC5jb3JlLmluaXQoJHRvYXN0V3JhcCwge3R5cGU6ICdjbG9zZScsIC4uLm9wdHNbMF19KTtcbiAgICB0b2FzdC5vcGVuKCk7XG4gIH1cblxuICBjb25zdCB0b2FzdExpbmtCdG4gPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkdG9hc3RXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvYXN0LXdyYXAnKVxuICAgIGNvbnN0IHRvYXN0ID0gbmV3IGV0VUkuY29tcG9uZW50cy5Ub2FzdCgpO1xuXG4gICAgaWYgKCEkdG9hc3RXcmFwKSByZXR1cm47XG5cbiAgICB0b2FzdC5jb3JlLmluaXQoJHRvYXN0V3JhcCwge3R5cGU6ICdsaW5rJywgLi4ub3B0c1swXX0pO1xuICAgIHRvYXN0Lm9wZW4oKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYWxlcnQsXG4gICAgY29uZmlybSxcbiAgICBwcmV2aWV3SW1hZ2UsXG4gICAgdG9hc3RCYXNpYyxcbiAgICB0b2FzdENsb3NlQnRuLFxuICAgIHRvYXN0TGlua0J0bixcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIGRpYWxvZ1RtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSAoeyBkaWFsb2dUeXBlLCB0eXBlLCB0aXRsZSwgbWVzc2FnZSwgcG9zaXRpdmVUZXh0LCBuZWdhdGl2ZVRleHQgfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1kaWFsb2dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1kaW1tXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZnJhbWVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgJHt0aXRsZSA/IGA8aDMgY2xhc3M9XCJkaWFsb2ctdGl0XCI+JHt0aXRsZX08L2gzPmAgOiAnJ31cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyA/IGA8c3BhbiBjbGFzcz1cIiR7dHlwZX1cIj5pY29uPC9zcGFuPmAgOiAnJ31cblxuICAgICAgICAgICAgICA8cCBjbGFzcz1cImRpYWxvZy1pbmZvXCI+JHttZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdjb25maXJtJyA/IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3F1YXJlIGJ0bi13aGl0ZSBkaWFsb2ctbmVnYXRpdmVcIj4ke25lZ2F0aXZlVGV4dH08L2J1dHRvbj5gIDogJyd9XG4gICAgICAgICAgICAgICR7cG9zaXRpdmVUZXh0ID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGRpYWxvZy1wb3NpdGl2ZSBidG4tcHJpbWFyeVwiPiR7cG9zaXRpdmVUZXh0fTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdhbGVydCcgPyBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJkaWFsb2ctY2xvc2VcIj48c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+7Yyd7JeFIOuLq+q4sDwvc3Bhbj48L2J1dHRvbj5gIDogJyd9XG5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gIGNvbnN0ICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUwgPSAoeyBkaWFsb2dUeXBlLCBpbWFnZXMsIHRpdGxlIH0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtZGlhbG9nIGRpYWxvZy1wcmV2aWV3LWltYWdlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZGltbVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWZyYW1lXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgICAgICAgICAgICR7dGl0bGUgPyBgPGgzIGNsYXNzPVwiZGlhbG9nLXRpdFwiPiR7dGl0bGV9PC9oMz5gIDogJyd9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LXN3aXBlclwiPlxuICAgICAgICAgICAgICAgIDwhLS0gQWRkaXRpb25hbCByZXF1aXJlZCB3cmFwcGVyIC0tPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgJHtpbWFnZXNcbiAgICAgICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAoaW1hZ2UpID0+IGBcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1zbGlkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtpbWFnZS5zcmN9XCIgYWx0PVwiJHtpbWFnZS5hbHR9XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBgLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcnKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zcXVhcmUgYnRuLXdoaXRlIGRpYWxvZy1uZWdhdGl2ZVwiPuuLq+q4sDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlSFRNTCxcbiAgICAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MLFxuICB9O1xufVxuIiwiLyoqXG4gKiB1c2VFdmVudExpc3RlbmVyXG4gKiBAcGFyYW0gdGFyZ2V0ICB7SFRNTEVsZW1lbnR8SFRNTEVsZW1lbnRbXX1cbiAqIEBwYXJhbSB0eXBlICB7c3RyaW5nfVxuICogQHBhcmFtIGxpc3RlbmVyICB7ZnVuY3Rpb259XG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fVxuICogQHJldHVybnMge2Z1bmN0aW9uKCk6ICp9XG4gKi9cbmZ1bmN0aW9uIHVzZUV2ZW50TGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChOb2RlTGlzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZih0YXJnZXQpKSB7XG4gICAgdGFyZ2V0LmZvckVhY2goKGVsZW1lbnQpID0+IGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucykpO1xuICAgIHJldHVybiAoKSA9PiB0YXJnZXQuZm9yRWFjaCgoZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKSk7XG4gIH1cblxuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG59XG4iLCIvKipcbiAqIGdldEJvdW5kaW5nQ2xpZW50UmVjdFxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxuICogQHBhcmFtIHsgU3RyaW5nIH0gc2VsZWN0b3JcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHVzZUdldENsaWVudFJlY3QocGFyZW50LCBzZWxlY3Rvcikge1xuICBjb25zdCByZWN0ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgaWYgKCFyZWN0KSByZXR1cm4ge307XG4gIGVsc2VcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgIGJvdHRvbTogcmVjdC5ib3R0b20sXG4gICAgICBsZWZ0OiByZWN0LmxlZnQsXG4gICAgICByaWdodDogcmVjdC5yaWdodCxcbiAgICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlTGF5ZXIodHlwZSA9ICdtb2RhbCcpIHtcbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZUxheWVyKCkge1xuICAgIGNvbnN0ICRsYXllckNvbXBvbmVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYXllci13cmFwJykuY2hpbGRyZW4pLmZpbHRlcigoJGVsKSA9PiB7XG4gICAgICBjb25zdCBpc01vZGFsQ29tcG9uZW50ID0gJGVsLmNsYXNzTGlzdC5jb250YWlucygnY29tcG9uZW50LW1vZGFsJyk7XG4gICAgICBjb25zdCBpc0RpYWxvZ0NvbXBvbmVudCA9ICRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbXBvbmVudC1kaWFsb2cnKTtcblxuICAgICAgcmV0dXJuIGlzTW9kYWxDb21wb25lbnQgfHwgaXNEaWFsb2dDb21wb25lbnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJGxheWVyQ29tcG9uZW50cy5maWx0ZXIoKCRlbCkgPT4ge1xuICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSgkZWwpO1xuICAgICAgcmV0dXJuIHN0eWxlLmRpc3BsYXkgIT09ICdub25lJztcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRvcERlcHRoKCkge1xuICAgIGNvbnN0ICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzID0gZ2V0VmlzaWJsZUxheWVyKCk7XG4gICAgcmV0dXJuIDEwMCArICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzLmxlbmd0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldExheWVyT3BhY2l0eShkZWZhdWx0T3BhY2l0eSA9IDAuNSkge1xuICAgIGNvbnN0ICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzID0gZ2V0VmlzaWJsZUxheWVyKCk7XG4gICAgJHZpc2libGVMYXllckNvbXBvbmVudHMuZm9yRWFjaCgoJGVsLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgb3BhY2l0eSA9IGV0VUkudXRpbHMuZ2V0QmxlbmRPcGFjaXR5KGRlZmF1bHRPcGFjaXR5LCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cy5sZW5ndGgpO1xuXG4gICAgICBpZiAoJGVsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kaW1tJykpIHtcbiAgICAgICAgJGVsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kaW1tJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYmEoMCwgMCwgMCwgJHtvcGFjaXR5fSlgO1xuICAgICAgfVxuXG4gICAgICBpZiAoJGVsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctZGltbScpKSB7XG4gICAgICAgICRlbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWRpbW0nKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgwLCAwLCAwLCAke29wYWNpdHl9KWA7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBtb2RhbCDrlrTsnYTrlYwg642c7Lu56rGw66as64qUIOqxsCDsl4bslaDripQgdGVzdCDspJFcbiAgZnVuY3Rpb24gZW5hYmxlU2Nyb2xsTG9jaygpIHtcbiAgICBjb25zdCBzY3JvbGxCYXJXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWRlcicpLnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke3Njcm9sbEJhcldpZHRofXB4YDtcbiAgICAvLyBjb25zdCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XG4gICAgLy8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gYC0ke3Njcm9sbFl9cHhgO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNhYmxlU2Nyb2xsTG9jaygpIHtcbiAgICBjb25zdCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cyA9IGdldFZpc2libGVMYXllcigpO1xuICAgIC8vIGNvbnNvbGUubG9nKCckdmlzaWJsZUxheWVyQ29tcG9uZW50cycsICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzKTtcbiAgICAvLyBpZiAoJHZpc2libGVMYXllckNvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBudWxsO1xuICAgIC8vIH1cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jykuc3R5bGUub3ZlcmZsb3cgPSBudWxsO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWRlcicpLnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnO1xuXG4gICAgLy8gY29uc3Qgc2Nyb2xsWSA9IHBhcnNlSW50KGRvY3VtZW50LmJvZHkuc3R5bGUudG9wIHx8ICcwJykgKiAtMTtcbiAgICAvLyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gJyc7XG4gICAgLy8gZG9jdW1lbnQuYm9keS5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gJyc7XG4gICAgLy8gZG9jdW1lbnQuYm9keS5zdHlsZS53aWR0aCA9ICcnO1xuICAgIC8vIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGxZKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0VmlzaWJsZUxheWVyLFxuICAgIGdldFRvcERlcHRoLFxuICAgIHNldExheWVyT3BhY2l0eSxcbiAgICBlbmFibGVTY3JvbGxMb2NrLFxuICAgIGRpc2FibGVTY3JvbGxMb2NrLFxuICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpe1xuICBmdW5jdGlvbiBtZWRpYVF1ZXJ5QWN0aW9uKC4uLmFyZ3Mpe1xuICAgIGNvbnN0IGdzYXBNZWRpYVF1ZXJ5ID0gZ3NhcC5tYXRjaE1lZGlhKCk7XG5cbiAgICBpZiAoZ3NhcE1lZGlhUXVlcnkpIHtcbiAgICAgIGdzYXBNZWRpYVF1ZXJ5LmtpbGwoKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZWRpYVF1ZXJ5Q29uZGl0aW9uID0gZXRVSS51dGlscy5nZXRNZWRpYVF1ZXJ5Q29uZGl0aW9uKGV0VUkuY29uZmlnLm1lZGlhLm5hbWVzLCBldFVJLmNvbmZpZy5tZWRpYS5wb2ludHMpXG5cbiAgICBnc2FwTWVkaWFRdWVyeS5hZGQobWVkaWFRdWVyeUNvbmRpdGlvbiwgLi4uYXJncyk7XG5cbiAgICByZXR1cm4gZ3NhcE1lZGlhUXVlcnk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG1lZGlhUXVlcnlBY3Rpb24sXG4gIH1cbn1cbiIsImZ1bmN0aW9uIHVzZU11dGF0aW9uU3RhdGUoKXtcbiAgbGV0ICR0YXJnZXQsICRyZWYgPSB7XG4gICAgJHN0YXRlOiB7fVxuICB9LCBtdXRhdGlvbk9ic2VydmVyLCByZW5kZXI7XG5cbiAgZnVuY3Rpb24gaW5pdE11dGF0aW9uU3RhdGUoXyR0YXJnZXQsIF9yZW5kZXIpe1xuICAgICR0YXJnZXQgPSBfJHRhcmdldFxuICAgIHJlbmRlciA9IF9yZW5kZXI7XG5cbiAgICBzZXRNdXRhdGlvbk9ic2VydmVyKClcbiAgICBzZXRTdGF0ZUJ5RGF0YXNldCgpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZUJ5RGF0YXNldCgpe1xuICAgIGNvbnN0IGZpbHRlcmVkRGF0YXNldCA9IHt9O1xuICAgIGNvbnN0IGRhdGFzZXQgPSAkdGFyZ2V0LmRhdGFzZXQ7XG5cbiAgICBPYmplY3Qua2V5cyhkYXRhc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmKGtleS5zdGFydHNXaXRoKCd2YXJzJykpe1xuICAgICAgICBmaWx0ZXJlZERhdGFzZXRba2V5LnJlcGxhY2UoJ3ZhcnMnLCAnJykudG9Mb3dlckNhc2UoKV0gPSBkYXRhc2V0W2tleV07XG4gICAgICB9XG4gICAgfSlcblxuICAgIHNldFN0YXRlKGZpbHRlcmVkRGF0YXNldClcbiAgICByZW5kZXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldE11dGF0aW9uT2JzZXJ2ZXIoKXtcbiAgICBjb25zdCBjb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XG5cbiAgICBjb25zdCBjYWxsYmFjayA9IChtdXRhdGlvbkxpc3QsIG9ic2VydmVyKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9uTGlzdCkge1xuICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnXG4gICAgICAgICAgJiYgbXV0YXRpb24uYXR0cmlidXRlTmFtZSAhPT0gJ3N0eWxlJ1xuICAgICAgICAgICYmIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcydcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0U3RhdGVCeURhdGFzZXQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKCR0YXJnZXQsIGNvbmZpZyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZShuZXdTdGF0ZSl7XG4gICAgJHJlZi4kc3RhdGUgPSB7IC4uLiRyZWYuJHN0YXRlLCAuLi5uZXdTdGF0ZSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RGF0YVN0YXRlKG5ld1N0YXRlKSB7XG4gICAgY29uc3QgJG5ld1N0YXRlID0geyAuLi4kcmVmLiRzdGF0ZSwgLi4ubmV3U3RhdGUgfTtcblxuICAgIE9iamVjdC5rZXlzKCRuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAkdGFyZ2V0LmRhdGFzZXRbYHZhcnMke2V0VUkudXRpbHMuY2FwaXRhbGl6ZShrZXkpfWBdID0gJG5ld1N0YXRlW2tleV07XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJHJlZixcbiAgICBzZXRTdGF0ZSxcbiAgICBzZXREYXRhU3RhdGUsXG4gICAgaW5pdE11dGF0aW9uU3RhdGVcbiAgfVxufVxuIiwiZnVuY3Rpb24gdXNlU2VsZWN0Qm94VGVtcCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlQ3VzdG9tSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiY29tYm8xXCIgY2xhc3M9XCJzZWxlY3QtYm94XCIgcm9sZT1cImNvbWJvYm94XCIgYXJpYS1jb250cm9scz1cImxpc3Rib3gxXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgYXJpYS1hY3RpdmVkZXNjZW5kYW50PVwiXCI+XG4gICAgICAgIDxzcGFuIHN0eWxlPVwicG9pbnRlci1ldmVudHM6IG5vbmU7XCI+JHt0ZXh0fTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zV3JhcChpdGVtc0hUTUwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDx1bCBpZD1cImxpc3Rib3gxXCIgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uc1wiIHJvbGU9XCJsaXN0Ym94XCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICR7aXRlbXNIVE1MfVxuICAgICAgICA8L3VsPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxsaSByb2xlPVwib3B0aW9uXCIgY2xhc3M9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPVwiJHtzZWxlY3RlZH1cIiBkYXRhLXZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiPlxuICAgICAgICAgICR7aXRlbS50ZXh0fVxuICAgICAgICA8L2xpPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0ICR0ZW1wbGF0ZUJhc2ljSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkIGRpc2FibGVkIGhpZGRlbj4ke3RleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXNXcmFwKGl0ZW1zSFRNTCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPHNlbGVjdCBjbGFzcz1cInNlbGVjdC1saXN0XCIgcmVxdWlyZWQ+XG4gICAgICAgICAgJHtpdGVtc0hUTUx9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCIke2l0ZW0udmFsdWV9XCI+JHtpdGVtLnRleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVDdXN0b21IVE1MLFxuICAgICR0ZW1wbGF0ZUJhc2ljSFRNTCxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZVN0YXRlKGluaXRpYWxWYWx1ZSA9IHt9LCBjYWxsYmFjaykge1xuICBjb25zdCBzdGF0ZSA9IG5ldyBQcm94eShpbml0aWFsVmFsdWUsIHtcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcbiAgICAgIHRhcmdldFtrZXldID0gdmFsdWU7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayh0YXJnZXQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3Qgc2V0U3RhdGUgPSAobmV3U3RhdGUpID0+IHtcbiAgICBPYmplY3Qua2V5cyhuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzdGF0ZVtrZXldID0gbmV3U3RhdGVba2V5XTtcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIFtzdGF0ZSwgc2V0U3RhdGVdO1xufVxuIiwiZnVuY3Rpb24gdXNlU3dpcGVyVG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9IHtcbiAgICBuYXZpZ2F0aW9uKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLXByZXZcIj7snbTsoIQ8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLW5leHRcIj7ri6TsnYw8L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBwYWdpbmF0aW9uKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1wYWdpbmF0aW9uXCI+PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgYXV0b3BsYXkoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYXV0b3BsYXkgcGxheVwiPjwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlSFRNTCxcbiAgfTtcbn1cbiIsIi8qKlxuICogdGVtcCB0aW1lbGluZVxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gdXNlVHJhbnNpdGlvbigpIHtcbiAgLy8gc2VsZWN0XG4gIGNvbnN0IHVzZVNlbGVjdFNob3cgPSAodGFyZ2V0LCB0eXBlLCBvcHRpb24pID0+IHtcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICAgIGNvbnN0IHRpbWVsaW5lID0gZ3NhcC50aW1lbGluZSh7IHBhdXNlZDogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IG9wdGlvbkxpc3QgPSB7XG4gICAgICBmYXN0OiB7IGR1cmF0aW9uOiAwLjE1IH0sXG4gICAgICBub3JtYWw6IHsgZHVyYXRpb246IDAuMyB9LFxuICAgICAgc2xvdzogeyBkdXJhdGlvbjogMC43IH0sXG4gICAgfTtcbiAgICBjb25zdCBnc2FwT3B0aW9uID0geyAuLi5vcHRpb25MaXN0W3R5cGVdLCAuLi5vcHRpb24gfTtcblxuICAgIHRpbWVsaW5lLnRvKHRhcmdldCwge1xuICAgICAgYWxwaGE6IDAsXG4gICAgICBlYXNlOiAnbGluZWFyJyxcbiAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfSxcbiAgICAgIC4uLmdzYXBPcHRpb24sXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGltZWxpbmVFbDogdGltZWxpbmUuX3JlY2VudC52YXJzLFxuICAgICAgdGltZWxpbmU6IChzdGF0ZSkgPT4ge1xuICAgICAgICBzdGF0ZVxuICAgICAgICAgID8gZ3NhcC50byh0YXJnZXQsIHtcbiAgICAgICAgICAgICAgb25TdGFydDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZWFzZTogJ2xpbmVhcicsXG4gICAgICAgICAgICAgIGFscGhhOiAxLFxuICAgICAgICAgICAgICAuLi5nc2FwT3B0aW9uLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICA6IGdzYXAudG8odGFyZ2V0LCB7XG4gICAgICAgICAgICAgIGFscGhhOiAwLFxuICAgICAgICAgICAgICBlYXNlOiAnbGluZWFyJyxcbiAgICAgICAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xvc2VzdCgnLmNvbXBvbmVudC1zZWxlY3QnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoJy5jb21wb25lbnQtc2VsZWN0JykuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAuLi5nc2FwT3B0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH07XG5cbiAgY29uc3Qgc2VsZWN0RGltbVNob3cgPSAodGFyZ2V0KSA9PiB7XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcblxuICAgIGdzYXAudG8odGFyZ2V0LCB7XG4gICAgICBvblN0YXJ0OiAoKSA9PiB7XG4gICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0sXG4gICAgICBlYXNlOiAnbGluZWFyJyxcbiAgICAgIGFscGhhOiAwLjYsXG4gICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBzZWxlY3REaW1tQ2xvc2UgPSAodGFyZ2V0KSA9PiB7XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcblxuICAgIGdzYXAudG8odGFyZ2V0LCB7XG4gICAgICBhbHBoYTogMCxcbiAgICAgIGVhc2U6ICdsaW5lYXInLFxuICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHVzZVNlbGVjdFNob3csXG4gICAgc2VsZWN0RGltbVNob3csXG4gICAgc2VsZWN0RGltbUNsb3NlXG4gIH07XG59XG4iLCJcbmV0VUkuaG9va3MgPSB7XG51c2VBMTF5S2V5RXZlbnQsXG51c2VDbGlja091dHNpZGUsXG51c2VDb3JlLFxudXNlRGF0YXNldCxcbnVzZURpYWxvZyxcbmRpYWxvZ1RtcGwsXG51c2VFdmVudExpc3RlbmVyLFxudXNlR2V0Q2xpZW50UmVjdCxcbnVzZUxheWVyLFxudXNlTWVkaWFRdWVyeSxcbnVzZU11dGF0aW9uU3RhdGUsXG51c2VTZWxlY3RCb3hUZW1wLFxudXNlU3RhdGUsXG51c2VTd2lwZXJUbXBsLFxudXNlVHJhbnNpdGlvblxufVxuICAgICAgICAgICAgICAiLCIvKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFByb3BzQ29uZmlnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGRpc2FibGVkIC0g7JqU7IaM6rCAIOu5hO2ZnOyEse2ZlCDsg4Htg5zsnbjsp4Drpbwg64KY7YOA64OF64uI64ukLlxuICogQHByb3BlcnR5IHtib29sZWFufSBvbmNlIC0g7J2067Kk7Yq464KYIOyVoeyFmOydhCDtlZwg67KI66eMIOyLpO2Wie2VoOyngCDsl6zrtoDrpbwg6rKw7KCV7ZWp64uI64ukLlxuICogQHByb3BlcnR5IHtmYWxzZSB8IG51bWJlcn0gZHVyYXRpb24gLSDslaDri4jrqZTsnbTshZgg65iQ64qUIOydtOuypO2KuCDsp4Dsho0g7Iuc6rCE7J2EIOuwgOumrOy0iCDri6jsnITroZwg7ISk7KCV7ZWp64uI64ukLiAnZmFsc2Un7J28IOqyveyasCDsp4Dsho0g7Iuc6rCE7J2EIOustOyLnO2VqeuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBvcmlnaW4gLSDsm5DsoJAg65iQ64qUIOyLnOyekSDsp4DsoJDsnYQg64KY7YOA64K064qUIOqwneyytOyeheuLiOuLpC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN0YXRlQ29uZmlnXG4gKiBAcHJvcGVydHkgeydjbG9zZScgfCAnb3Blbid9IHN0YXRlIC0g7JWE7L2U65SU7Ja47J2YIOyDge2DnOqwki4gY2xvc2UsIG9wZW4g65GYIOykkeyXkCDtlZjrgpjsnoXri4jri6QuXG4gKi9cblxuLyoqIEB0eXBlIHtQcm9wc0NvbmZpZ30gKi9cbi8qKiBAdHlwZSB7U3RhdGVDb25maWd9ICovXG5cbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvL3Byb3BzXG4gICAgICBpbmRleDogLTEsXG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgICAgZWFzaW5nOiAncG93ZXI0Lm91dCcsXG4gICAgICB9LFxuICAgICAgdHlwZTogJ211bHRpcGxlJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vc3RhdGVcbiAgICAgIGluZGV4OiAtMSxcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyBjb25zdGFudFxuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnYWNjb3JkaW9uJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgYWNjb3JkaW9uSXRlbTtcbiAgbGV0ICR0YXJnZXQsICRhY2NvcmRpb25JdGVtLCAkYWNjb3JkaW9uSXRlbXM7XG5cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCwgeyBzdGF0ZUNhbGxiYWNrOiBfcHJvcHM/LnN0YXRlQ2FsbGJhY2sgfSk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBzdGF0ZVxuICAgIHJlbmRlcih0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIHNlbGVjdG9yXG4gICAgYWNjb3JkaW9uSXRlbSA9ICcuYWNjb3JkaW9uLWl0ZW0nO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRhY2NvcmRpb25JdGVtID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKGFjY29yZGlvbkl0ZW0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgICRhY2NvcmRpb25JdGVtcyA9IEFycmF5LmZyb20oJGFjY29yZGlvbkl0ZW0pO1xuICAgIGNvbnN0IGl0ZW1zID0gJGFjY29yZGlvbkl0ZW1zLm1hcCgoJGNvbGxhcHNlLCBpKSA9PiB7XG4gICAgICBjb25zdCBjb2xsYXBzZSA9IGV0VUkuY29tcG9uZW50cy5Db2xsYXBzZSgpO1xuICAgICAgY29sbGFwc2UuY29yZS5pbml0KCRjb2xsYXBzZSwge1xuICAgICAgICBhZnRlck9wZW46IHByb3BzLmFmdGVyT3BlbixcbiAgICAgICAgYWZ0ZXJDbG9zZTogcHJvcHMuYWZ0ZXJDbG9zZSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbGxhcHNlO1xuICAgIH0pO1xuXG4gICAgLy8g7LSI6riwIOyXtOumtCBpbmRleCDqsrDsoJVcbiAgICBsZXQgaW5pdGlhbEluZGV4ID0gLTE7XG4gICAgY29uc3QgZGF0YUluZGV4ID0gJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnKTtcbiAgICBpZiAoZGF0YUluZGV4ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCB0YXJnZXRJbmRleCA9IHBhcnNlSW50KGRhdGFJbmRleCwgMTApO1xuICAgICAgaWYgKHRhcmdldEluZGV4ID49IDAgJiYgdGFyZ2V0SW5kZXggPCAkYWNjb3JkaW9uSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIGluaXRpYWxJbmRleCA9IHRhcmdldEluZGV4O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJvcHMudHlwZSA9PT0gJ3NlcGFyYXRlJyB8fCBwcm9wcy50eXBlID09PSAnc2luZ2xlJykge1xuICAgICAgICAkYWNjb3JkaW9uSXRlbXMuZm9yRWFjaCgoJGNvbGxhcHNlLCBpKSA9PiB7XG4gICAgICAgICAgaWYgKCRjb2xsYXBzZS5kYXRhc2V0LnN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgIGluaXRpYWxJbmRleCA9IGk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAqKuyXrOq4sOyEnCDtlZwg67KI66eMIG9wZW4qKlxuICAgIGlmIChpbml0aWFsSW5kZXggPiAtMSkge1xuICAgICAgc2V0U3RhdGUoeyBpbmRleDogaW5pdGlhbEluZGV4IH0sIHsgaW1tZWRpYXRlOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7fTtcblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7fTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsIGFjY29yZGlvbkl0ZW0sICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICBpZiAocHJvcHMudHlwZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgY29uc3QgY29sbGFwc2UgPSB0YXJnZXQuY2xvc2VzdChhY2NvcmRpb25JdGVtKTtcbiAgICAgICAgY29uc3QgX3N0YXRlID0gY29sbGFwc2UudWkuY29yZS5zdGF0ZS5zdGF0ZTtcblxuICAgICAgICBpZiAoX3N0YXRlID09PSAnb3BlbicpIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9ICRhY2NvcmRpb25JdGVtcy5pbmRleE9mKGNvbGxhcHNlKTtcbiAgICAgICAgICBzZXRTdGF0ZSh7IGluZGV4IH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoaW1tZWRpYXRlID0gZmFsc2UpIHtcbiAgICBvcGVuKHN0YXRlLmluZGV4LCBpbW1lZGlhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gb3BlbihpbmRleCwgaW1tZWRpYXRlKSB7XG4gICAgaW5kZXggPSAraW5kZXg7XG4gICAgaWYgKHByb3BzLnR5cGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAkYWNjb3JkaW9uSXRlbXMuZm9yRWFjaCgoJGl0ZW0sIGkpID0+IHtcbiAgICAgICAgaWYgKCEkaXRlbSB8fCAhJGl0ZW0udWkpIHJldHVybjtcbiAgICAgICAgaWYgKGkgIT09IGluZGV4KSB7XG4gICAgICAgICAgaWYgKCRpdGVtLnVpLmNvcmUgJiYgJGl0ZW0udWkuY29yZS5zdGF0ZSAmJiAkaXRlbS51aS5jb3JlLnN0YXRlLnN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgICRpdGVtLnVpLmNsb3NlKGltbWVkaWF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIOydtOuvuCDsl7TroKTsnojsnLzrqbQgcmV0dXJuXG4gICAgICAgICAgaWYgKCRpdGVtLnVpLmNvcmUuc3RhdGUuc3RhdGUgPT09ICdvcGVuJykgcmV0dXJuO1xuICAgICAgICAgICRpdGVtLnVpLm9wZW4oaW1tZWRpYXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEgJiYgJGFjY29yZGlvbkl0ZW1zW2luZGV4XSAmJiAkYWNjb3JkaW9uSXRlbXNbaW5kZXhdLnVpKSB7XG4gICAgICAgIGlmICgkYWNjb3JkaW9uSXRlbXNbaW5kZXhdLnVpLmNvcmUuc3RhdGUuc3RhdGUgPT09ICdvcGVuJykgcmV0dXJuO1xuICAgICAgICAkYWNjb3JkaW9uSXRlbXNbaW5kZXhdLnVpLm9wZW4oaW1tZWRpYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZShpbmRleCwgaW1tZWRpYXRlKSB7XG4gICAgaWYgKGluZGV4ID49IDAgJiYgJGFjY29yZGlvbkl0ZW1zW2luZGV4XSAmJiAkYWNjb3JkaW9uSXRlbXNbaW5kZXhdLnVpKSB7XG4gICAgICAkYWNjb3JkaW9uSXRlbXNbaW5kZXhdLnVpLmNsb3NlKGltbWVkaWF0ZSk7XG4gICAgfSBlbHNlIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0Nhbm5vdCBjbG9zZSBhY2NvcmRpb24gaXRlbTogVUkgbm90IGluaXRpYWxpemVkIGZvciBpbmRleDonLCBpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufSIsIi8qKlxuICogQ29sbGFwc2VcbiAqL1xuZnVuY3Rpb24gQ29sbGFwc2UoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50LCBjbGVhbnVwcyB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIC8vIHByb3BzXG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgICAgZWFzaW5nOiAncG93ZXIyLm91dCcsXG4gICAgICB9LFxuXG4gICAgICBjbGlja091dHNpZGU6IGZhbHNlLFxuICAgICAgYTExeVRhYjogZmFsc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBzdGF0ZVxuICAgIH0sXG4gICAgcmVuZGVyLFxuICApO1xuXG4gIC8vIGNvbnN0YW50XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdjb2xsYXBzZSc7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0IGNvbGxhcHNlVHJpZ2dlciwgY29sbGFwc2VDb250ZW50LCBjbG9zZVRpbWVsaW5lLCBjbGlja091dHNpZGVDbGVhbnVwO1xuICBsZXQgJHRhcmdldCwgJGNvbGxhcHNlVHJpZ2dlciwgJGNvbGxhcHNlQ29udGVudDtcblxuICAvLyBob29rc1xuICBjb25zdCB7IGZpcnN0Tm9kZUZvY3VzT3V0LCBsYXN0Tm9kZUZvY3VzT3V0IH0gPSBldFVJLmhvb2tzLnVzZUExMXlLZXlFdmVudCgpO1xuXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHNldFRhcmdldCgkdGFyZ2V0LCB7IHN0YXRlQ2FsbGJhY2s6IF9wcm9wcz8uc3RhdGVDYWxsYmFjayB9KTtcbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICAgIHNldHVwKCk7XG4gICAgICBzZXRFdmVudCgpO1xuXG4gICAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW5pdGlhbGl6aW5nIENvbGxhcHNlIGNvbXBvbmVudDonLCBlcnJvcik7XG4gICAgICAvLyDsmKTrpZjqsIAg67Cc7IOd7ZW064+EIOq4sOuzuOyggeyduCBVSSDsg4Htg5zripQg7ISk7KCVXG4gICAgICBpZiAoISR0YXJnZXQudWkpIHtcbiAgICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gc3RhdGVcbiAgICAvLyBzZXRTdGF0ZSh7IHNldHRpbmc6ICdjdXN0b20nIH0pO1xuICAgIHJlbmRlcih0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge31cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIHNlbGVjdG9yXG4gICAgY29sbGFwc2VUcmlnZ2VyID0gJy5jb2xsYXBzZS10aXQnO1xuICAgIGNvbGxhcHNlQ29udGVudCA9ICcuY29sbGFwc2UtY29udGVudCc7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJGNvbGxhcHNlVHJpZ2dlciA9ICR0YXJnZXQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZVRyaWdnZXIpO1xuICAgICRjb2xsYXBzZUNvbnRlbnQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoY29sbGFwc2VDb250ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21JZCgpO1xuXG4gICAgY29uc3QgY29sbGFwc2VJZCA9IGBpZC1jb2xsYXBzZS0ke2lkfWA7XG4gICAgY29uc3QgY29sbGFwc2VUcmlnZ2VySWQgPSBgaWQtY29sbGFwc2UtdGl0bGUtJHtpZH1gO1xuICAgIGNvbnN0IGNvbGxhcHNlQ29udGVudElkID0gYGlkLWNvbGxhcHNlLWNvbnRlbnQtJHtpZH1gO1xuXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2lkJywgY29sbGFwc2VJZCk7XG4gICAgJGNvbGxhcHNlVHJpZ2dlci5zZXRBdHRyaWJ1dGUoJ2NvbnRyb2xzJywgY29sbGFwc2VDb250ZW50SWQpO1xuICAgICRjb2xsYXBzZVRyaWdnZXIuc2V0QXR0cmlidXRlKCdpZCcsIGNvbGxhcHNlVHJpZ2dlcklkKTtcbiAgICAkY29sbGFwc2VDb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAkY29sbGFwc2VDb250ZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdyZWdpb24nKTtcbiAgICAkY29sbGFwc2VDb250ZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBjb2xsYXBzZUNvbnRlbnRJZCk7XG4gICAgJGNvbGxhcHNlQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsIGNvbGxhcHNlVHJpZ2dlcklkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBjb25zdCB7IGR1cmF0aW9uLCBlYXNpbmcgfSA9IHByb3BzLmFuaW1hdGlvbjtcblxuICAgIGNvbnN0IGExMXlDbGVhbnVwID0gW107XG5cbiAgICBhY3Rpb25zLm9wZW4gPSAoaW1tZWRpYXRlID0gZmFsc2UpID0+IHtcbiAgICAgICRjb2xsYXBzZVRyaWdnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSk7XG4gICAgICAkY29sbGFwc2VDb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG5cbiAgICAgIGlmIChjbG9zZVRpbWVsaW5lKSB7XG4gICAgICAgIGNsb3NlVGltZWxpbmUua2lsbCgpO1xuICAgICAgfVxuXG4gICAgICBnc2FwLnNldCgkY29sbGFwc2VDb250ZW50LCB7IGhlaWdodDogJ2F1dG8nLCBkaXNwbGF5OiAnYmxvY2snLCBwYWRkaW5nVG9wOiBudWxsLCBwYWRkaW5nQm90dG9tOiBudWxsIH0pO1xuICAgICAgZ3NhcC50aW1lbGluZSgpLmZyb20oJGNvbGxhcHNlQ29udGVudCwge1xuICAgICAgICBkdXJhdGlvbjogaW1tZWRpYXRlID8gMCA6IGR1cmF0aW9uLFxuICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgcGFkZGluZ1RvcDogMCxcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogMCxcbiAgICAgICAgb3ZlcndyaXRlOiB0cnVlLFxuICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgIGlmIChwcm9wcy5zY3JvbGxUbykge1xuICAgICAgICAgICAgZ3NhcC50byh3aW5kb3csIHtcbiAgICAgICAgICAgICAgc2Nyb2xsVG86IHtcbiAgICAgICAgICAgICAgICB5OiAkdGFyZ2V0LFxuICAgICAgICAgICAgICAgIG9mZnNldFk6IDIgKiAoJGNvbGxhcHNlQ29udGVudC5vZmZzZXRUb3AgLSAkY29sbGFwc2VUcmlnZ2VyLm9mZnNldFRvcCksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocHJvcHMuYTExeVRhYikge1xuICAgICAgICAgICAgYTExeUNsZWFudXAucHVzaChcbiAgICAgICAgICAgICAgbGFzdE5vZGVGb2N1c091dChldFVJLnV0aWxzLmxhc3ROb2RlKHRhYmJhYmxlLnRhYmJhYmxlKCRjb2xsYXBzZUNvbnRlbnQpKSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSk7XG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHByb3BzLmFmdGVyT3Blbikge1xuICAgICAgICAgICAgcHJvcHMuYWZ0ZXJPcGVuKHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiAkdGFyZ2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChwcm9wcy5jbGlja091dHNpZGUpIHtcbiAgICAgICAgY2xpY2tPdXRzaWRlQ2xlYW51cCA9IHVzZUNsaWNrT3V0c2lkZSgkdGFyZ2V0LCAoKSA9PiB7XG4gICAgICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoaW1tZWRpYXRlID0gZmFsc2UpID0+IHtcbiAgICAgIGlmIChjbGlja091dHNpZGVDbGVhbnVwKSB7XG4gICAgICAgIGNsaWNrT3V0c2lkZUNsZWFudXAoKTtcbiAgICAgIH1cblxuICAgICAgJGNvbGxhcHNlVHJpZ2dlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG4gICAgICAkY29sbGFwc2VDb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICAgICAgY2xvc2VUaW1lbGluZSA9IGdzYXAudGltZWxpbmUoKS50bygkY29sbGFwc2VDb250ZW50LCB7XG4gICAgICAgIGR1cmF0aW9uOiBpbW1lZGlhdGUgPyAwIDogZHVyYXRpb24sXG4gICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICBwYWRkaW5nVG9wOiAwLFxuICAgICAgICBwYWRkaW5nQm90dG9tOiAwLFxuICAgICAgICBvdmVyd3JpdGU6IHRydWUsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJGNvbGxhcHNlQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgIGV0VUkudXRpbHMuYWxsQ2xlYW51cHMoYTExeUNsZWFudXApO1xuICAgICAgICAgIGlmIChwcm9wcy5hZnRlckNsb3NlKSB7XG4gICAgICAgICAgICBwcm9wcy5hZnRlckNsb3NlKHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiAkdGFyZ2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsIGNvbGxhcHNlVHJpZ2dlciwgKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nKSB7XG4gICAgICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGhhbmRsaW5nIGNvbGxhcHNlIGNsaWNrIGV2ZW50OicsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5hMTF5VGFiKSB7XG4gICAgICBmaXJzdE5vZGVGb2N1c091dCgkY29sbGFwc2VUcmlnZ2VyLCAoKSA9PiB7XG4gICAgICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoaW1tZWRpYXRlID0gZmFsc2UpIHtcbiAgICBjb25zdCBpc1Nob3cgPSBzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nO1xuICAgIGlzU2hvdyA/IGFjdGlvbnMub3BlbihpbW1lZGlhdGUpIDogYWN0aW9ucy5jbG9zZShpbW1lZGlhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gb3BlbihpbW1lZGlhdGUgPSBmYWxzZSkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdvcGVuJyB9LCB7IGltbWVkaWF0ZSB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKGltbWVkaWF0ZSA9IGZhbHNlKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9LCB7IGltbWVkaWF0ZSB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsImZ1bmN0aW9uIERhdGVwaWNrZXJDb21wKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIC8vIHByb3BzXG4gICAgICBsYW5ndWFnZTogJ2tvJyxcbiAgICAgIGRheXNPZldlZWtIaWdobGlnaHRlZDogWzAsIDZdLFxuICAgICAgYXV0b2hpZGU6IHRydWUsXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBzdGF0ZVxuICAgIH0sXG4gICAgcmVuZGVyLFxuICApO1xuXG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnZGF0ZXBpY2tlcic7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCwgJGRhdGVwaWNrZXIsICRkYXRlcGlja2VyVHJpZ2dlciwgJHNlbGVjdExhYmVsLCAkcmFuZ2VTdGFydCwgJHJhbmdlRW5kO1xuICBsZXQgcmFuZ2VTdGFydCwgcmFuZ2VFbmQsIGRhdGVwaWNrZXJUcmlnZ2VyO1xuXG4gIERhdGVwaWNrZXIubG9jYWxlcy5rbyA9IHtcbiAgICBkYXlzOiBbJ+ydvOyalOydvCcsICfsm5TsmpTsnbwnLCAn7ZmU7JqU7J28JywgJ+yImOyalOydvCcsICfrqqnsmpTsnbwnLCAn6riI7JqU7J28JywgJ+2GoOyalOydvCddLFxuICAgIGRheXNTaG9ydDogWyfsnbwnLCAn7JuUJywgJ+2ZlCcsICfsiJgnLCAn66qpJywgJ+q4iCcsICfthqAnXSxcbiAgICBkYXlzTWluOiBbJ+ydvCcsICfsm5QnLCAn7ZmUJywgJ+yImCcsICfrqqknLCAn6riIJywgJ+2GoCddLFxuICAgIG1vbnRoczogWycx7JuUJywgJzLsm5QnLCAnM+yblCcsICc07JuUJywgJzXsm5QnLCAnNuyblCcsICc37JuUJywgJzjsm5QnLCAnOeyblCcsICcxMOyblCcsICcxMeyblCcsICcxMuyblCddLFxuICAgIG1vbnRoc1Nob3J0OiBbJzHsm5QnLCAnMuyblCcsICcz7JuUJywgJzTsm5QnLCAnNeyblCcsICc27JuUJywgJzfsm5QnLCAnOOyblCcsICc57JuUJywgJzEw7JuUJywgJzEx7JuUJywgJzEy7JuUJ10sXG4gICAgdG9kYXk6ICfsmKTripgnLFxuICAgIGNsZWFyOiAn7IKt7KCcJyxcbiAgICBmb3JtYXQ6ICd5eXl5LW1tLWRkJyxcbiAgICB0aXRsZUZvcm1hdDogJ3nrhYQgbeyblCcsXG4gICAgd2Vla1N0YXJ0OiAwLFxuICB9O1xuXG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBfJHRhcmdldFxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcignVGFyZ2V0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAocHJvcHMudHlwZSA9PT0gJ3JhbmdlJykgJHRhcmdldCA9ICR0YXJnZXQuY2xvc2VzdCgnLmNvbXBvbmVudC1yYW5nZXBpY2tlcicpO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gc3RhdGVcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgZGF0ZXBpY2tlclRyaWdnZXIgPSAnLmRhdGVwaWNrZXItYnRuLXRyaWdnZXInO1xuICAgIHJhbmdlU3RhcnQgPSAncmFuZ2Utc3RhcnQnO1xuICAgIHJhbmdlRW5kID0gJ3JhbmdlLWVuZCc7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgY29uc3QgeyB0eXBlIH0gPSBwcm9wcztcbiAgICAvLyBpZFxuICAgIGNvbnN0IGxhYmVsSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG5cbiAgICAvLyBhMTF5XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAkc2VsZWN0TGFiZWwsICdpZCcsIGxhYmVsSWQpO1xuXG4gICAgaWYgKHByb3BzLnR5cGUgPT09ICdyYW5nZScpIHtcbiAgICAgICRyYW5nZVN0YXJ0ID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGBbbmFtZT1cIiR7cmFuZ2VTdGFydH1cIl1gKTtcbiAgICAgICRyYW5nZUVuZCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihgW25hbWU9XCIke3JhbmdlRW5kfVwiXWApO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZGF0ZXBpY2tlclRyaWdnZXIgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoZGF0ZXBpY2tlclRyaWdnZXIpO1xuICAgIH1cblxuICAgIC8vICRkYXRlcGlja2VyIOygleydmFxuICAgIGlmICh0eXBlID09PSAncmFuZ2UnKSB7XG4gICAgICAkZGF0ZXBpY2tlciA9IG5ldyBEYXRlUmFuZ2VQaWNrZXIoJHRhcmdldCwgeyAuLi5wcm9wcyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGRhdGVwaWNrZXIgPSBuZXcgRGF0ZXBpY2tlcigkZGF0ZXBpY2tlclRyaWdnZXIsIHsgLi4ucHJvcHMgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHt9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHt9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKCkge31cblxuICBmdW5jdGlvbiBjbG9zZSgpIHt9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICAvLyBjYWxsYWJsZVxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICAgIGdldERhdGVwaWNrZXJJbnN0YW5jZSgpIHtcbiAgICAgIHJldHVybiAkZGF0ZXBpY2tlcjtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqICBNb2RhbFxuICovXG5mdW5jdGlvbiBEaWFsb2coKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy8gcHJvcHNcbiAgICAgIGRpbW1DbGljazogdHJ1ZSxcbiAgICAgIGVzYzogdHJ1ZSxcbiAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgbWVzc2FnZTogJycsXG4gICAgICB0eXBlOiAnYWxlcnQnLFxuICAgICAgcG9zaXRpdmVUZXh0OiBldFVJLiR0KCdkaWFsb2cucG9zaXRpdmUnLCAn7ZmV7J24JyksXG4gICAgICBuZWdhdGl2ZVRleHQ6IGV0VUkuJHQoJ2RpYWxvZy5uZWdhdGl2ZScsICfst6jshownKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHN0YXRlOiAnY2xvc2UnLFxuICAgICAgdHJpZ2dlcjogbnVsbCxcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgICB7XG4gICAgICBkYXRhc2V0OiBmYWxzZSxcbiAgICB9LFxuICApO1xuXG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IERJTU1fT1BBQ0lUWSA9IGV0VUkuY29uZmlnLmxheWVyLmRpbW1PcGFjaXR5O1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnZGlhbG9nJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICBsZXQgbW9kYWxEaW1tU2VsZWN0b3IsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciwgbW9kYWxCdG5Qb3NpdGl2ZSwgbW9kYWxCdG5OZWdhdGl2ZTtcbiAgbGV0ICR0YXJnZXQsICRtb2RhbCwgJG1vZGFsVGl0bGUsICRtb2RhbENvbnRhaW5lciwgJG1vZGFsRGltbSwgJG1vZGFsQnRuUG9zaXRpdmUsICRtb2RhbEJ0bk5lZ2F0aXZlLCBmb2N1c1RyYXBJbnN0YW5jZSwgY2FsbGJhY2s7XG5cbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCd0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCwgeyBzdGF0ZUNhbGxiYWNrOiBfcHJvcHM/LnN0YXRlQ2FsbGJhY2sgfSk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgLy8gJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gZm9jdXMgdHJhcFxuICAgIGZvY3VzVHJhcEluc3RhbmNlID0gZm9jdXNUcmFwLmNyZWF0ZUZvY3VzVHJhcCgkbW9kYWwsIHtcbiAgICAgIGVzY2FwZURlYWN0aXZhdGVzOiBwcm9wcy5lc2MsXG4gICAgICBvbkFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzQWN0aXZhdGUsXG4gICAgICBvbkRlYWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlLFxuICAgIH0pO1xuXG4gICAgLy8gc3RhdGVcbiAgICAvLyBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHsgJHRlbXBsYXRlSFRNTCwgJHRlbXBsYXRlUHJldmlld0ltYWdlSFRNTCB9ID0gZXRVSS50ZW1wbGF0ZXMuZGlhbG9nVG1wbCgpO1xuXG4gICAgaWYgKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdhbGVydCcgfHwgcHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2NvbmZpcm0nKSB7XG4gICAgICAkdGFyZ2V0Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgJHRlbXBsYXRlSFRNTChwcm9wcykpO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ3ByZXZpZXdJbWFnZScpIHtcbiAgICAgICR0YXJnZXQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MKHByb3BzKSk7XG4gICAgfVxuXG4gICAgJG1vZGFsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuY29tcG9uZW50LWRpYWxvZycpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciA9ICcuZGlhbG9nLWNsb3NlJztcbiAgICBtb2RhbERpbW1TZWxlY3RvciA9ICcuZGlhbG9nLWRpbW0nO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRtb2RhbFRpdGxlID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctdGl0Jyk7XG4gICAgJG1vZGFsRGltbSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKG1vZGFsRGltbVNlbGVjdG9yKTtcbiAgICAkbW9kYWxDb250YWluZXIgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1jb250YWluZXInKTtcblxuICAgIG1vZGFsQnRuUG9zaXRpdmUgPSAnLmRpYWxvZy1wb3NpdGl2ZSc7XG4gICAgbW9kYWxCdG5OZWdhdGl2ZSA9ICcuZGlhbG9nLW5lZ2F0aXZlJztcbiAgICAkbW9kYWxCdG5Qb3NpdGl2ZSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLXBvc2l0aXZlJyk7XG4gICAgJG1vZGFsQnRuTmVnYXRpdmUgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1uZWdhdGl2ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG4gICAgLy8gLy8gYTExeVxuXG4gICAgaWYgKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdhbGVydCcgfHwgcHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2NvbmZpcm0nKSB7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3JvbGUnLCAnYWxlcnRkaWFsb2cnKTtcbiAgICB9IGVsc2UgaWYgKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdwcmV2aWV3SW1hZ2UnKSB7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3JvbGUnLCAnZGlhbG9nJyk7XG5cbiAgICAgIGNvbnN0ICRzd2lwZXIgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmNvbXBvbmVudC1zd2lwZXInKTtcbiAgICAgIGNvbnN0IHN3aXBlciA9IG5ldyBldFVJLmNvbXBvbmVudHMuU3dpcGVyQ29tcCgpO1xuICAgICAgc3dpcGVyLmNvcmUuaW5pdCgkc3dpcGVyLCB7XG4gICAgICAgIG5hdmlnYXRpb246IHRydWUsXG4gICAgICAgIHBhZ2luYXRpb246IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ2FyaWEtbW9kYWwnLCAndHJ1ZScpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAnaWQnLCBpZCk7XG4gICAgaWYgKCRtb2RhbFRpdGxlKSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbFRpdGxlLCAnaWQnLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ2FyaWEtbGFiZWxsZWRieScsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAndGFiaW5kZXgnLCAnLTEnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBjb25zdCB7IGdldFRvcERlcHRoLCBzZXRMYXllck9wYWNpdHksIGVuYWJsZVNjcm9sbExvY2ssIGRpc2FibGVTY3JvbGxMb2NrIH0gPSBldFVJLmhvb2tzLnVzZUxheWVyKCk7XG5cbiAgICBhY3Rpb25zLmZvY3VzQWN0aXZhdGUgPSAoKSA9PiB7fTtcblxuICAgIGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKCFzdGF0ZS50cmlnZ2VyKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvcHMubmVnYXRpdmVDYWxsYmFjaztcbiAgICAgIH1cbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgekluZGV4ID0gZ2V0VG9wRGVwdGgoKTtcblxuICAgICAgJG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgJG1vZGFsLnN0eWxlLnpJbmRleCA9IHpJbmRleDtcblxuICAgICAgLy8gaWYgKHByb3BzLmRpYWxvZ1R5cGUgPT09ICd5b3V0dWJlJykge1xuICAgICAgLy8gfVxuICAgICAgZW5hYmxlU2Nyb2xsTG9jaygpO1xuXG4gICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHsgZHVyYXRpb246IDAsIGRpc3BsYXk6ICdibG9jaycsIG9wYWNpdHk6IDAgfSkudG8oJG1vZGFsRGltbSwge1xuICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgIH0pO1xuXG4gICAgICBnc2FwXG4gICAgICAgIC50aW1lbGluZSgpXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgICBkdXJhdGlvbjogMCxcbiAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgc2NhbGU6IDAuOTUsXG4gICAgICAgICAgeVBlcmNlbnQ6IDIsXG4gICAgICAgIH0pXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHsgZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDEsIHNjYWxlOiAxLCB5UGVyY2VudDogMCwgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyB9KTtcblxuICAgICAgLy8g7Iqk7YGs66GkIOychOy5mCDsoIDsnqUg67CPIOyKpO2BrOuhpCDsnqDquIhcbiAgICAgIC8vIGNvbXBvbmVudC5zY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XG4gICAgICAvLyBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ25vLXNjcm9sbCcpO1xuICAgICAgLy8gZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSBgLSR7Y29tcG9uZW50LnNjcm9sbFl9cHhgO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge1xuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHtcbiAgICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJG1vZGFsRGltbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIHNjYWxlOiAwLjk1LFxuICAgICAgICB5UGVyY2VudDogMixcbiAgICAgICAgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyxcbiAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAkbW9kYWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAkbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAkbW9kYWwuc3R5bGUuekluZGV4ID0gbnVsbDtcblxuICAgICAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xuXG4gICAgICAgICAgZGVzdHJveSgpO1xuXG4gICAgICAgICAgJHRhcmdldC5yZW1vdmVDaGlsZCgkbW9kYWwpO1xuXG4gICAgICAgICAgLy8g7Iqk7YGs66GkIOyeoOq4iCDtlbTsoJwg67CPIOychOy5mCDrs7Xsm5BcbiAgICAgICAgICAvLyBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXNjcm9sbCcpO1xuICAgICAgICAgIC8vIHdpbmRvdy5zY3JvbGxUbygwLCBjb21wb25lbnQuc2Nyb2xsWSk7XG4gICAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5zdHlsZS50b3AgPSAnJztcblxuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZGlzYWJsZVNjcm9sbExvY2soKTtcblxuXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciwgKCkgPT4ge1xuICAgICAgY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5kaW1tQ2xpY2spIHtcbiAgICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsRGltbVNlbGVjdG9yLCBjbG9zZSk7XG4gICAgfVxuXG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxCdG5Qb3NpdGl2ZSwgKCkgPT4ge1xuICAgICAgaWYgKHByb3BzLmNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvcHMuY2FsbGJhY2s7XG4gICAgICB9IGVsc2UgaWYgKHByb3BzLnBvc2l0aXZlQ2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5wb3NpdGl2ZUNhbGxiYWNrO1xuICAgICAgfVxuXG4gICAgICBjbG9zZSgnYnRuUG9zaXRpdmUnKTtcbiAgICB9KTtcbiAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbEJ0bk5lZ2F0aXZlLCAoKSA9PiB7XG4gICAgICBjYWxsYmFjayA9IHByb3BzLm5lZ2F0aXZlQ2FsbGJhY2s7XG5cbiAgICAgIGNsb3NlKCdidG5OZWdhdGl2ZScpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzT3BlbmVkID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcblxuICAgIGlmIChpc09wZW5lZCkge1xuICAgICAgYWN0aW9ucy5vcGVuKCk7XG5cbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmFjdGl2YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmRlYWN0aXZhdGUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdvcGVuJyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKHRyaWdnZXIpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnLCB0cmlnZ2VyIH0pO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG5cbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiBJbnB1dFxuICovXG5mdW5jdGlvbiBJbnB1dCgpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvLyBwcm9wc1xuICAgIH0sXG4gICAge1xuICAgICAgLy8gc3RhdGVcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBNQVJHSU4gPSAyMDtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ2lucHV0JztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICBsZXQgY29tcG9uZW50ID0ge307XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCAkdGFyZ2V0LCAkaW5wdXRUYXJnZXQsICRjaGVja2JveHMsICRjaGVja2JveExlbmd0aDtcbiAgbGV0IGlucHV0VHlwZSwgY2hlY2tib3hzO1xuXG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBfJHRhcmdldFxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcignVGFyZ2V0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIC8vIHRlbXBsYXRlLCBzZWxlY3RvciwgZWxlbWVudCwgYWN0aW9uc1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cFRlbXBsYXRlKCk7IC8vIGVsZW1lbnTsl5DshJwg7JqU7IaM66W8IOyytO2BrO2VtOyEnCDthZztlIzrpr/sl5Ag65Ok7Ja06rCA66+A66GcIOyInOyEnOqwgCDrsJTrgJxcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIHN0YXRlXG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MIH0gPSBldFVJLnRlbXBsYXRlcy5pbnB1dFRtcGwoKTtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICAgIC8vIGV0VUkubG9jYWxlc1tldFVJLmNvbmZpZy5sb2NhbGUuZGVmYXVsdF1cbiAgICBpZiAocHJvcHMuY2xlYXIpIHtcbiAgICAgICRpbnB1dFRhcmdldC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyZW5kJywgJHRlbXBsYXRlSFRNTC5jbGVhckJ1dHRvbigpKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLnRvZ2dsZVBhc3N3b3JkKSB7XG4gICAgICAkaW5wdXRUYXJnZXQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmVuZCcsICR0ZW1wbGF0ZUhUTUwudG9nZ2xlUGFzc3dvcmQoKSk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5sb2FkaW5nKSB7XG4gICAgICAkaW5wdXRUYXJnZXQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmVuZCcsICR0ZW1wbGF0ZUhUTUwubG9hZGluZygpKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLnNlYXJjaEJveCkge1xuICAgICAgJGlucHV0VGFyZ2V0Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJlbmQnLCAkdGVtcGxhdGVIVE1MLnNlYXJjaEJveCgpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpKSB7XG4gICAgICBjaGVja2JveHMgPSAnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcbiAgICBjb25zdCBsYWJlbElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuXG4gICAgLy8gYTExeVxuICAgIC8vIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJHNlbGVjdExhYmVsLCAnaWQnLCBsYWJlbElkKTtcblxuICAgICRpbnB1dFRhcmdldCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignaW5wdXQnKTtcblxuICAgIC8vIGlmICghJGlucHV0VGFyZ2V0KSByZXR1cm47XG5cbiAgICBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiZmlsZVwiXScpKSB7XG4gICAgICBpbnB1dFR5cGUgPSAnZmlsZSc7XG4gICAgfSBlbHNlIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpKSB7XG4gICAgICBpbnB1dFR5cGUgPSAnY2hlY2tib3gnO1xuICAgIH0gZWxzZSBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKSkge1xuICAgICAgaW5wdXRUeXBlID0gJ3JhZGlvJztcbiAgICB9IGVsc2UgaWYgKCR0YXJnZXQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdJykpIHtcbiAgICAgIGlucHV0VHlwZSA9ICdwYXNzd29yZCc7XG4gICAgfSBlbHNlIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJykpIHtcbiAgICAgIGlucHV0VHlwZSA9ICd0ZXh0YXJlYSc7XG4gICAgICAkaW5wdXRUYXJnZXQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ3RleHRhcmVhJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0VHlwZSA9ICd0ZXh0JztcbiAgICB9XG5cbiAgICAvLyBjb21wb25lbnQgY3VzdG9tIGVsZW1lbnRcbiAgICBpZiAocHJvcHMuY291bnQpIHtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnRleHRhcmVhLWNvdW50LXRvdGFsJykudGV4dENvbnRlbnQgPSBwcm9wcy5jb3VudDtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnRleHRhcmVhLWNvdW50Jykuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgfVxuICAgIGlmIChwcm9wcy5hbGxDaGVjaykge1xuICAgICAgJGNoZWNrYm94TGVuZ3RoID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCcuYWdyZWUtYXJlYSBpbnB1dCcpLmxlbmd0aDtcbiAgICAgICRjaGVja2JveHMgPSBbLi4uJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKV07XG4gICAgfVxuICAgIGlmICgkaW5wdXRUYXJnZXQuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSB7XG4gICAgICAkdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0LWRpc2FibGVkJylcbiAgICB9XG4gICAgaWYgKCRpbnB1dFRhcmdldC5oYXNBdHRyaWJ1dGUoJ3JlYWRvbmx5JykpIHtcbiAgICAgICR0YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXQtcmVhZG9ubHknKVxuICAgIH1cbiAgfVxuXG4gIGxldCB2ID0gJyc7XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHt9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHt9O1xuXG4gICAgYWN0aW9ucy5jaGVja0J5dGVzID0gKGUpID0+IHtcbiAgICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSBlO1xuICAgICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgICBpZiAocHJvcHMubXVsdGlieXRlKSB7XG4gICAgICAgIGxlbmd0aCA9IGV0VUkudXRpbHMuY291bnRDaGFyYWN0ZXJzKHRhcmdldC52YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZW5ndGggPSB0YXJnZXQudmFsdWUubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHMuY291bnRMaW1pdCkge1xuICAgICAgICBpZiAobGVuZ3RoID4gcHJvcHMuY291bnQpIHtcbiAgICAgICAgICB0YXJnZXQudmFsdWUgPSB2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHYgPSB0YXJnZXQudmFsdWU7XG4gICAgICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcudGV4dGFyZWEtY291bnQtbnVtJykudGV4dENvbnRlbnQgPSBsZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnRleHRhcmVhLWNvdW50LW51bScpLnRleHRDb250ZW50ID0gbGVuZ3RoO1xuXG4gICAgICAgIGlmIChsZW5ndGggPiBwcm9wcy5jb3VudCkge1xuICAgICAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnRleHRhcmVhLWNvdW50LW51bScpLmNsYXNzTGlzdC5hZGQoJ292ZXInKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYS1jb3VudC1udW0nKS5jbGFzc0xpc3QucmVtb3ZlKCdvdmVyJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5zaG93Q2xlYXJCdXR0b24gPSAoZSkgPT4ge1xuICAgICAgaWYgKCRpbnB1dFRhcmdldC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmlucHV0LWZpZWxkLWJ0bi5jbGVhcicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtZmllbGQtYnRuLmNsZWFyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8g7J6Q64+Z6rKA7IOJIOyYgeyXrVxuICAgIGFjdGlvbnMuc2VhcmNoQm94ID0gKGUpID0+IHtcbiAgICAgIGlmICghJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWJhci1ib3gnKSkgcmV0dXJuO1xuXG4gICAgICBpZiAoJGlucHV0VGFyZ2V0LnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWJhci1ib3gnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnNlYXJjaC1iYXItYm94Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhY3Rpb25zLmNsZWFyVGV4dCA9ICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICAkaW5wdXRUYXJnZXQudmFsdWUgPSAnJztcbiAgICAgICRpbnB1dFRhcmdldC5mb2N1cygpO1xuICAgICAgYWN0aW9ucy5zaG93Q2xlYXJCdXR0b24oKTtcbiAgICAgIGFjdGlvbnMuc2VhcmNoQm94KCk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMudG9nZ2xlUGFzc3dvcmQgPSAoeyBjdXJyZW50VGFyZ2V0IH0pID0+IHtcbiAgICAgIGlmICgkaW5wdXRUYXJnZXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAkaW5wdXRUYXJnZXQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgY3VycmVudFRhcmdldC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtc3RhdGUnKS5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkaW5wdXRUYXJnZXQudHlwZSA9ICdwYXNzd29yZCc7XG4gICAgICAgIGN1cnJlbnRUYXJnZXQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLXN0YXRlJykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyDsoITssrQg7LK07YGsIOuyhO2KvFxuICAgIGFjdGlvbnMuYWxsQ2hlY2sgPSAoe3RhcmdldH0pID0+IHtcbiAgICAgIGNvbnN0IGFsbENoZWNrQnRuID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCcuYWxsLWFncmVlLWl0ZW0gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJylbMF07XG4gICAgICBsZXQgY2hlY2tib3hFbHMgPSB0YXJnZXQgPT09IGFsbENoZWNrQnRuID8gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuYWdyZWUtYXJlYScpIDogdGFyZ2V0LmNsb3Nlc3QoJy5hZ3JlZS1pdGVtJykucXVlcnlTZWxlY3RvcignLnN1Yi1hZ3JlZS1pdGVtJyk7XG4gICAgICBjaGVja2JveEVscy5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5mb3JFYWNoKCRjaGVja2JveCA9PiAkY2hlY2tib3guY2hlY2tlZCA9IHRhcmdldC5jaGVja2VkKTtcbiAgICB9XG5cbiAgICAvLyDsoITssrQgY2hlY2tib3jsnZggY2hlY2tlZCDtmZXsnbhcbiAgICBhY3Rpb25zLmNoZWNrQWxsQWdyZWUgPSAoKSA9PiB7XG4gICAgICBjb25zdCBhbGxDaGVja0J0biA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmFsbC1hZ3JlZS1pdGVtIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpO1xuICAgICAgY29uc3QgY2hlY2tib3hMaXN0ID0gWy4uLiR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnLmFncmVlLWFyZWEgaW5wdXQnKV07XG5cbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGFsbENoZWNrQnRuLmNoZWNrZWQgPSBjaGVja2JveExpc3QuZXZlcnkoKGl0ZW0pID0+IGl0ZW0uY2hlY2tlZCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8g7ISc67iMIGNoZWNrYm947J2YIGNoZWNrZWQg7ZmV7J24XG4gICAgYWN0aW9ucy5jaGVja0FsbFN1YkFncmVlID0gKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgIGNvbnN0IGFncmVlSXRlbSA9IHRhcmdldC5jbG9zZXN0KCcuYWdyZWUtaXRlbScpO1xuICAgICAgaWYgKCFhZ3JlZUl0ZW0pIHJldHVybjtcblxuICAgICAgY29uc3Qgc3ViQWxsQ2hlY2tCdG4gPSBhZ3JlZUl0ZW0ucXVlcnlTZWxlY3RvcignLnN1Yi1hbGwtYWdyZWUgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG4gICAgICBjb25zdCBzdWJDaGVja2JveExpc3QgPSBbLi4uYWdyZWVJdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdWItYWdyZWUtaXRlbSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKV07XG5cbiAgICAgIGlmICghc3ViQWxsQ2hlY2tCdG4pIHJldHVybjtcblxuICAgICAgaWYgKHRhcmdldCA9PT0gc3ViQWxsQ2hlY2tCdG4pIHtcbiAgICAgICAgc3ViQ2hlY2tib3hMaXN0LmZvckVhY2goKGNoZWNrYm94KSA9PiB7XG4gICAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHN1YkFsbENoZWNrQnRuLmNoZWNrZWQ7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViQWxsQ2hlY2tCdG4uY2hlY2tlZCA9IHN1YkNoZWNrYm94TGlzdC5ldmVyeSgoY2hlY2tib3gpID0+IGNoZWNrYm94LmNoZWNrZWQpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBjb25zdCB7IGFsbENoZWNrLCBzdWJDaGVjayB9ID0gcHJvcHM7XG5cbiAgICBpZiAocHJvcHMuY2xlYXIpIHtcbiAgICAgIGFkZEV2ZW50KCdpbnB1dCcsICdpbnB1dCcsIGFjdGlvbnMuc2hvd0NsZWFyQnV0dG9uKTtcbiAgICAgIGFkZEV2ZW50KCdpbnB1dCcsICd0ZXh0YXJlYScsIGFjdGlvbnMuc2hvd0NsZWFyQnV0dG9uKTtcbiAgICAgIGFkZEV2ZW50KCdjbGljaycsICcuaW5wdXQtZmllbGQtYnRuLmNsZWFyJywgYWN0aW9ucy5jbGVhclRleHQpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5zZWFyY2gpIHtcbiAgICAgIGFkZEV2ZW50KCdpbnB1dCcsICdpbnB1dCcsIGFjdGlvbnMuc2VhcmNoQm94KTtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRUeXBlID09PSAndGV4dGFyZWEnKSB7XG4gICAgICBpZiAocHJvcHMuY291bnQpIGFkZEV2ZW50KCdpbnB1dCcsICd0ZXh0YXJlYScsIGFjdGlvbnMuY2hlY2tCeXRlcyk7XG4gICAgfSBlbHNlIGlmIChpbnB1dFR5cGUgPT09ICd0ZXh0Jykge1xuICAgIH0gZWxzZSBpZiAoaW5wdXRUeXBlID09PSAncGFzc3dvcmQnKSB7XG4gICAgICBpZiAocHJvcHMudG9nZ2xlUGFzc3dvcmQpIHtcbiAgICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgJy5pbnB1dC1maWVsZC1idG4ucGFzc3dvcmQtc3RhdGUnLCBhY3Rpb25zLnRvZ2dsZVBhc3N3b3JkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlucHV0VHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgaWYgKGFsbENoZWNrKSB7XG4gICAgICAgIGFkZEV2ZW50KCdjaGFuZ2UnLCAnLmFsbC1hZ3JlZS1pdGVtIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGFjdGlvbnMuYWxsQ2hlY2spO1xuICAgICAgICBhZGRFdmVudCgnY2hhbmdlJywgJy5hZ3JlZS1hcmVhIGlucHV0JywgYWN0aW9ucy5jaGVja0FsbEFncmVlKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdWJDaGVjaykge1xuICAgICAgICBhZGRFdmVudCgnY2hhbmdlJywgJy5zdWItYWdyZWUtaXRlbSBpbnB1dCcsIGFjdGlvbnMuY2hlY2tBbGxTdWJBZ3JlZSk7XG4gICAgICAgIGFkZEV2ZW50KCdjaGFuZ2UnLCAnLnN1Yi1hbGwtYWdyZWUgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgYWN0aW9ucy5jaGVja0FsbFN1YkFncmVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gcmVuZGVyXG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZW5ndGgoKSB7XG4gICAgaWYgKGlucHV0VHlwZS5tYXRjaCgvdGV4dHx0ZXh0YXJlYXxwYXNzd29yZC9nKSkge1xuICAgICAgcmV0dXJuICRpbnB1dFRhcmdldC52YWx1ZS5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Qnl0ZUxlbmd0aCgpIHtcbiAgICBpZiAoaW5wdXRUeXBlLm1hdGNoKC90ZXh0fHRleHRhcmVhfHBhc3N3b3JkL2cpKSB7XG4gICAgICByZXR1cm4gZXRVSS51dGlscy5jb3VudENoYXJhY3RlcnMoJGlucHV0VGFyZ2V0LnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVDbGVhckJ1dHRvbigpIHtcbiAgICBldFVJLnV0aWxzLnRyaWdnZXJFdmVudCgkaW5wdXRUYXJnZXQsICdpbnB1dCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd0xvYWRpbmcoYm9vbCA9IHRydWUpIHtcbiAgICBpZiAoYm9vbCkge1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtZmllbGQtaWNvLnNwaW5uZXInKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtZmllbGQtaWNvLnNwaW5uZXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgLy8gY2FsbGFibGVcbiAgICB1cGRhdGUsXG4gICAgZ2V0TGVuZ3RoLFxuICAgIGdldEJ5dGVMZW5ndGgsXG4gICAgdXBkYXRlQ2xlYXJCdXR0b24sXG4gICAgc2hvd0xvYWRpbmcsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogbG90dGllXG4gKi9cbmZ1bmN0aW9uIExvdHRpZSgpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICBsb29wOiB0cnVlLFxuICAgICAgYXV0b3BsYXk6IHRydWUsXG4gICAgICBzY3JvbGw6IGZhbHNlLFxuICAgICAgLy8gcHJvcHNcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0YXRlXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdsb3R0aWUnO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQ7XG4gIGxldCBsb3R0aWVJbnN0YW5jZTtcblxuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAvLyB0ZW1wbGF0ZSwgc2VsZWN0b3IsIGVsZW1lbnQsIGFjdGlvbnNcbiAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gc3RhdGVcbiAgICAvLyBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHt9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIGxvdHRpZUluc3RhbmNlID0gbG90dGllLmxvYWRBbmltYXRpb24oe1xuICAgICAgY29udGFpbmVyOiAkdGFyZ2V0LCAvLyB0aGUgZG9tIGVsZW1lbnQgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGFuaW1hdGlvblxuICAgICAgcmVuZGVyZXI6ICdzdmcnLFxuICAgICAgbG9vcDogcHJvcHMubG9vcCxcbiAgICAgIGF1dG9wbGF5OiBwcm9wcy5zY3JvbGwgPyBmYWxzZSA6IHByb3BzLmF1dG9wbGF5LFxuICAgICAgcGF0aDogYCR7ZXRVSS5jb25maWcubG90dGllLmJhc2VQYXRofS8ke3Byb3BzLm5hbWV9Lmpzb25gLCAvLyB0aGUgcGF0aCB0byB0aGUgYW5pbWF0aW9uIGpzb25cbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5zY3JvbGwpIHtcbiAgICAgIFNjcm9sbFRyaWdnZXIuY3JlYXRlKHtcbiAgICAgICAgdHJpZ2dlcjogJHRhcmdldCxcbiAgICAgICAgc3RhcnQ6ICd0b3AgYm90dG9tJyxcbiAgICAgICAgZW5kOiAnYm90dG9tIHRvcCcsXG4gICAgICAgIG1hcmtlcnM6IHRydWUsXG4gICAgICAgIG9uRW50ZXI6ICgpID0+IHtcbiAgICAgICAgICBsb3R0aWVJbnN0YW5jZS5wbGF5KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRW50ZXJCYWNrOiAoKSA9PiB7XG4gICAgICAgICAgbG90dGllSW5zdGFuY2UucGxheSgpO1xuICAgICAgICB9LFxuICAgICAgICBvbkxlYXZlOiAoKSA9PiB7XG4gICAgICAgICAgbG90dGllSW5zdGFuY2UucGF1c2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25MZWF2ZUJhY2s6ICgpID0+IHtcbiAgICAgICAgICBsb3R0aWVJbnN0YW5jZS5wYXVzZSgpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge31cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHt9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIC8vIHJlbmRlclxuICB9XG5cbiAgZnVuY3Rpb24gcGxheSgpIHtcbiAgICBsb3R0aWVJbnN0YW5jZS5wbGF5KCk7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wKCkge1xuICAgIGxvdHRpZUluc3RhbmNlLnN0b3AoKTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgLy8gY2FsbGFibGVcbiAgICB1cGRhdGUsXG4gICAgcGxheSxcbiAgICBzdG9wLFxuICAgIGdldExvdHRpZUluc3RhbmNlOiAoKSA9PiBsb3R0aWVJbnN0YW5jZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiAgTW9kYWxcbiAqL1xuZnVuY3Rpb24gTW9kYWwoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy8gcHJvcHNcbiAgICAgIGRpbW1DbGljazogdHJ1ZSxcbiAgICAgIGNsaWNrT3V0c2lkZTogZmFsc2UsXG4gICAgICBlc2M6IHRydWUsXG4gICAgICB0eXBlOiAnZGVmYXVsdCcsXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBzdGF0ZVxuICAgIH0sXG4gICAgcmVuZGVyLC8vXG4gICk7XG5cbiAgY29uc3QgeyBtZWRpYVF1ZXJ5QWN0aW9uIH0gPSBldFVJLmhvb2tzLnVzZU1lZGlhUXVlcnkoKTtcbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgRElNTV9PUEFDSVRZID0gZXRVSS5jb25maWcubGF5ZXIuZGltbU9wYWNpdHk7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdtb2RhbCc7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcblxuICBsZXQgZm9jdXNUcmFwSW5zdGFuY2UsIG1vZGFsRGltbVNlbGVjdG9yLCBtb2RhbENsb3NlQnRuU2VsZWN0b3IsIGNsaWNrT3V0c2lkZUNsZWFudXA7XG4gIGxldCAkdGFyZ2V0LCAkbW9kYWxUaXRsZSwgJG1vZGFsQ29udGFpbmVyLCAkbW9kYWxEaW1tLCAkbW9kYWxDb250ZW50O1xuICBsZXQgX2NhbGxiYWNrO1xuXG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBfJHRhcmdldFxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcignVGFyZ2V0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBmb2N1cyB0cmFwXG4gICAgaWYgKCEkdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2VhcmNoJykpIHtcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlID0gZm9jdXNUcmFwLmNyZWF0ZUZvY3VzVHJhcCgkdGFyZ2V0LCB7XG4gICAgICAgIGVzY2FwZURlYWN0aXZhdGVzOiBwcm9wcy5lc2MsXG4gICAgICAgIG9uQWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSxcbiAgICAgICAgb25EZWFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSxcbiAgICAgICAgYWxsb3dPdXRzaWRlQ2xpY2s6IHByb3BzLmNsaWNrT3V0c2lkZSA/IHRydWUgOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gc3RhdGVcbiAgICAvLyBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcblxuICAgIGlmIChzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nKSB7XG4gICAgICBhY3Rpb25zLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgLy8gJHRhcmdldC5pbm5lckhUTUwgPSBgYDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gc2VsZWN0b3JcbiAgICBtb2RhbENsb3NlQnRuU2VsZWN0b3IgPSAnLm1vZGFsLWNsb3NlJztcbiAgICBtb2RhbERpbW1TZWxlY3RvciA9ICcubW9kYWwtZGltbSc7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJG1vZGFsVGl0bGUgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC10aXQnKTtcbiAgICAkbW9kYWxEaW1tID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKG1vZGFsRGltbVNlbGVjdG9yKTtcbiAgICAkbW9kYWxDb250YWluZXIgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1jb250YWluZXInKTtcbiAgICAkbW9kYWxDb250ZW50ID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY29udGVudCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG5cbiAgICAvLyBhMTF5XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAncm9sZScsICdkaWFsb2cnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdpZCcsIGlkKTtcbiAgICBpZiAoJG1vZGFsVGl0bGUpIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsVGl0bGUsICdpZCcsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ2FyaWEtbGFiZWxsZWRieScsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ3RhYmluZGV4JywgJy0xJyk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBjb25zdCB7IGdldFRvcERlcHRoLCBzZXRMYXllck9wYWNpdHksIGVuYWJsZVNjcm9sbExvY2ssIGRpc2FibGVTY3JvbGxMb2NrIH0gPSBldFVJLmhvb2tzLnVzZUxheWVyKCk7XG5cbiAgICBhY3Rpb25zLmZvY3VzQWN0aXZhdGUgPSAoKSA9PiB7IH07XG5cbiAgICBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgICAgIGNsb3NlKCk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgICR0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cbiAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xuICAgICAgZW5hYmxlU2Nyb2xsTG9jaygpO1xuXG4gICAgICBpZiAoJG1vZGFsRGltbSkgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHsgZHVyYXRpb246IDAsIGRpc3BsYXk6ICdibG9jaycsIG9wYWNpdHk6IDAgfSkudG8oJG1vZGFsRGltbSwgeyBkdXJhdGlvbjogMC4xNSwgb3BhY2l0eTogMSB9KTtcblxuICAgICAgZ3NhcFxuICAgICAgICAudGltZWxpbmUoKVxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7IGR1cmF0aW9uOiAwLCBkaXNwbGF5OiAnZmxleCcgfSlcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwge1xuICAgICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyxcbiAgICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICAgY29uc3QgY2xpZW50SGVpZ2h0ID0gJG1vZGFsQ29udGVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxIZWlnaHQgPSAkbW9kYWxDb250ZW50LnNjcm9sbEhlaWdodDtcblxuICAgICAgICAgICAgLy8gYTExeTog7Iqk7YGs66Gk7ZWgIOy7qO2FkOy4oOqwgCDsnojsnYQg6rK97JqwIHRhYmluZGV4IOy2lOqwgFxuICAgICAgICAgICAgaWYgKGNsaWVudEhlaWdodCA8IHNjcm9sbEhlaWdodCkge1xuICAgICAgICAgICAgICAkbW9kYWxDb250ZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJG1vZGFsQ29udGVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChfY2FsbGJhY2spIHtcbiAgICAgICAgX2NhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy5jbGlja091dHNpZGUpIHtcbiAgICAgICAgY2xpY2tPdXRzaWRlQ2xlYW51cCA9IHVzZUNsaWNrT3V0c2lkZSgkdGFyZ2V0LCAoKSA9PiB7XG4gICAgICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgICAgICAgfSwgW3Byb3BzLnRyaWdnZXJCdG5dKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGlmIChjbGlja091dHNpZGVDbGVhbnVwKSB7XG4gICAgICAgIGNsaWNrT3V0c2lkZUNsZWFudXAoKTtcbiAgICAgIH1cblxuICAgICAgLy8gaW5wdXQg7J6I7J2EIOuVjCB2YWx1ZeqwkiDstIjquLDtmZRcbiAgICAgIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykpIHtcbiAgICAgICAgY29uc3QgaW5wdXRzID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuICAgICAgICBpbnB1dHMuZm9yRWFjaCgkaW5wdXQgPT4ge1xuICAgICAgICAgICRpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoJG1vZGFsRGltbSkge1xuICAgICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsRGltbSwge1xuICAgICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAgICRtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbENvbnRhaW5lciwge1xuICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyxcbiAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAkbW9kYWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAkdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAgICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcbiAgICAgICAgICBkaXNhYmxlU2Nyb2xsTG9jaygpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciwgY2xvc2UpO1xuXG4gICAgaWYgKHByb3BzLmRpbW1DbGljaykge1xuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxEaW1tU2VsZWN0b3IsIGNsb3NlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgbGV0IGlzT3BlbmVkID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcbiAgICBjb25zdCB7IHR5cGUgfSA9IHByb3BzO1xuXG4gICAgaWYgKGlzT3BlbmVkKSB7XG4gICAgICBhY3Rpb25zLm9wZW4oKTtcbiAgICAgIGlmIChmb2N1c1RyYXBJbnN0YW5jZSkgZm9jdXNUcmFwSW5zdGFuY2UuYWN0aXZhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9ucy5jbG9zZSgpO1xuICAgICAgaWYgKGZvY3VzVHJhcEluc3RhbmNlKSBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbihjYWxsYmFjaykge1xuICAgIF9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdvcGVuJyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcblxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCJmdW5jdGlvbiBTZWxlY3RCb3goKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgdHlwZTogJ2N1c3RvbScsXG4gICAgICBsYWJlbDogJycsXG4gICAgICBkZWZhdWx0OiAnJyxcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIHNlbGVjdGVkSW5kZXg6IDAsXG4gICAgICB0cmFuc2l0aW9uOiAnZmFzdCcsXG4gICAgICBzY3JvbGxUbzogZmFsc2UsXG4gICAgICBnc2FwT3B0aW9uOiB7fSxcbiAgICAgIHN0YXRlOiAnY2xvc2UnLFxuICAgIH0sXG4gICAge30sXG4gICAgcmVuZGVyLFxuICApO1xuICBjb25zdCB7ICR0ZW1wbGF0ZUN1c3RvbUhUTUwsICR0ZW1wbGF0ZUJhc2ljSFRNTCB9ID0gZXRVSS50ZW1wbGF0ZXMuc2VsZWN0Qm94VG1wbCgpO1xuICBjb25zdCB7IHVzZVNlbGVjdFNob3csIHNlbGVjdERpbW1TaG93LCBzZWxlY3REaW1tQ2xvc2UgfSA9IGV0VUkuaG9va3MudXNlVHJhbnNpdGlvbigpO1xuXG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnc2VsZWN0JztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICBsZXQgY29tcG9uZW50ID0ge307XG4gIGxldCAkdGFyZ2V0LFxuICAgIC8vIOyalOyGjOq0gOugqCDrs4DsiJjrk6RcbiAgICBzZWxlY3RMYWJlbCxcbiAgICBzZWxlY3RDb21ib0JveCxcbiAgICBzZWxlY3RMaXN0Qm94LFxuICAgIHNlbGVjdE9wdGlvbixcbiAgICB0aW1lbGluZSxcbiAgICBzZWxlY3RDbG9zZSxcbiAgICBzZWxlY3REaW1tO1xuXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQucXVlcnlTZWxlY3RvcignLnNlbGVjdC1saXN0JykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gICAgc2V0dXBUZW1wbGF0ZSgpO1xuXG4gICAgaWYgKHByb3BzLnR5cGUgPT09ICdiYXNpYycpIHJldHVybjtcblxuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIGVmZmVjdFxuICAgIHRpbWVsaW5lID0gdXNlU2VsZWN0U2hvdygkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0TGlzdEJveCksIHByb3BzLnRyYW5zaXRpb24sIHByb3BzLmdzYXBPcHRpb24pLnRpbWVsaW5lO1xuXG4gICAgLy8gc3RhdGVcbiAgICBhY3Rpb25zW3Byb3BzLnN0YXRlIHx8IHN0YXRlLnN0YXRlXT8uKCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcblxuICAgIGRlc3Ryb3koKTtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgaWYgKHByb3BzLnR5cGUgPT09ICdib3R0b21TaGVldCcpIHtcbiAgICAgICR0YXJnZXQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgPGRpdiBjbGFzcz1cInNlbGVjdC1kaW1tXCI+PC9kaXY+YClcbiAgICB9XG5cbiAgICAvLyBvcHRpb25z6rCSIHNjcmlwdOuhnCDrhKPsnYQg65WMXG4gICAgaWYgKHByb3BzLml0ZW1zLmxlbmd0aCA8IDEpIHJldHVybjtcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gJ2N1c3RvbScpIHtcbiAgICAgIGNvbnN0IHsgc2VsZWN0ZWRJbmRleCB9ID0gcHJvcHM7XG4gICAgICBjb25zdCBpdGVtTGlzdFRlbXAgPSBwcm9wcy5pdGVtcy5tYXAoKGl0ZW0pID0+ICR0ZW1wbGF0ZUN1c3RvbUhUTUwuaXRlbXMoaXRlbSkpLmpvaW4oJycpO1xuXG4gICAgICAkdGFyZ2V0LmlubmVySFRNTCA9IGBcbiAgICAgICAgJHtwcm9wcy5sYWJlbCAmJiAkdGVtcGxhdGVDdXN0b21IVE1MLmxhYmVsKHByb3BzLmxhYmVsKX1cbiAgICAgICAgJHtwcm9wcy5kZWZhdWx0ID8gJHRlbXBsYXRlQ3VzdG9tSFRNTC5zZWxlY3RCdG4ocHJvcHMuZGVmYXVsdCkgOiAkdGVtcGxhdGVDdXN0b21IVE1MLnNlbGVjdEJ0bihwcm9wcy5pdGVtcy5maW5kKChpdGVtKSA9PiBpdGVtLnZhbHVlID09IHByb3BzLml0ZW1zW3NlbGVjdGVkSW5kZXhdLnZhbHVlKS50ZXh0KX1cbiAgICAgICAgJHtwcm9wcy5pdGVtcyAmJiAkdGVtcGxhdGVDdXN0b21IVE1MLml0ZW1zV3JhcChpdGVtTGlzdFRlbXApfVxuICAgICAgYDtcbiAgICB9ICBlbHNlIHtcbiAgICAgIGNvbnN0IHNlbGVjdEJ0blRlbXAgPSAkdGVtcGxhdGVCYXNpY0hUTUwuc2VsZWN0QnRuKHByb3BzLmRlZmF1bHQpO1xuICAgICAgY29uc3QgaXRlbUxpc3RUZW1wID0gcHJvcHMuaXRlbXMubWFwKChpdGVtKSA9PiAkdGVtcGxhdGVCYXNpY0hUTUwuaXRlbXMoaXRlbSkpLmpvaW4oJycpO1xuXG4gICAgICAkdGFyZ2V0LmlubmVySFRNTCA9IGBcbiAgICAgICAgJHtwcm9wcy5sYWJlbCAmJiAkdGVtcGxhdGVCYXNpY0hUTUwubGFiZWwocHJvcHMubGFiZWwpfVxuICAgICAgICAke3Byb3BzLml0ZW1zICYmICR0ZW1wbGF0ZUJhc2ljSFRNTC5pdGVtc1dyYXAoc2VsZWN0QnRuVGVtcCArIGl0ZW1MaXN0VGVtcCl9XG4gICAgICBgO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIHNlbGVjdExhYmVsID0gJy5jb21iby1sYWJlbCc7XG4gICAgc2VsZWN0Q29tYm9Cb3ggPSAnLnNlbGVjdC1ib3gnO1xuICAgIHNlbGVjdExpc3RCb3ggPSAnLnNlbGVjdC1vcHRpb25zJztcbiAgICBzZWxlY3RPcHRpb24gPSAnLm9wdGlvbic7XG4gICAgc2VsZWN0RGltbSA9ICcuc2VsZWN0LWRpbW0nO1xuICAgIHNlbGVjdENsb3NlID0gJy5zZWxlY3QtY2xvc2UnO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgY29uc3QgbGFiZWxJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcbiAgICBjb25zdCBjb21ib0JveElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKCdjb21ib2JveCcpO1xuICAgIGNvbnN0IGxpc3RCb3hJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRCgnbGlzdGJveCcpO1xuXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGFiZWwsICdpZCcsIGxhYmVsSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsICdpZCcsIGNvbWJvQm94SWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsICdyb2xlJywgJ2NvbWJvYm94Jyk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgJ2FyaWEtbGFiZWxsZWRieScsIGxhYmVsSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsICdhcmlhLWNvbnRyb2xzJywgbGlzdEJveElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsICdpZCcsIGxpc3RCb3hJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCAncm9sZScsICdsaXN0Ym94Jyk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCAnYXJpYS1sYWJlbGxlZGJ5JywgbGFiZWxJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCAndGFiaW5kZXgnLCAtMSk7XG5cbiAgICAvLyBzZWxlY3QgcHJvcGVydHlcbiAgICBjb25zdCBvcHRpb25zID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdE9wdGlvbik7XG4gICAgb3B0aW9ucy5mb3JFYWNoKChlbCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbklkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKCdvcHRpb24nKTtcblxuICAgICAgJHRhcmdldFtpbmRleF0gPSBlbDtcbiAgICAgIGVsWydpbmRleCddID0gaW5kZXg7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2lkJywgb3B0aW9uSWQpO1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ29wdGlvbicpO1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuXG4gICAgICBwcm9wcy5pdGVtc1tpbmRleF0/LmRpc2FibGVkICYmIGVsLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnJyk7XG5cbiAgICAgIGlmICghJHRhcmdldFsnb3B0aW9ucyddKSAkdGFyZ2V0WydvcHRpb25zJ10gPSBbXTtcbiAgICAgICR0YXJnZXRbJ29wdGlvbnMnXVtpbmRleF0gPSBlbDtcbiAgICB9KTtcblxuICAgICFwcm9wcy5kZWZhdWx0ICYmIHNlbGVjdEl0ZW0ob3B0aW9uc1twcm9wcy5zZWxlY3RlZEluZGV4XSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgbGV0IHNlbGVjdEluZGV4ID0gaXNOYU4oJHRhcmdldC5zZWxlY3RlZEluZGV4KSA/IC0xIDogJHRhcmdldC5zZWxlY3RlZEluZGV4O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlSW5kZXgoc3RhdGUpIHtcbiAgICAgIGlmICghc3RhdGUpIHJldHVybjtcbiAgICAgIHNlbGVjdEluZGV4ID0gaXNOYU4oJHRhcmdldC5zZWxlY3RlZEluZGV4KSA/IC0xIDogJHRhcmdldC5zZWxlY3RlZEluZGV4O1xuICAgICAgdXBkYXRlQ3VycmVudENsYXNzKCR0YXJnZXRbc2VsZWN0SW5kZXhdKTtcbiAgICB9XG4gICAgZnVuY3Rpb24ga2V5RXZlbnRDYWxsYmFjaygpIHtcbiAgICAgIHVwZGF0ZUN1cnJlbnRDbGFzcygkdGFyZ2V0W3NlbGVjdEluZGV4XSk7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCAnYXJpYS1hY3RpdmVkZXNjZW5kYW50JywgJHRhcmdldFtzZWxlY3RJbmRleF0uaWQpO1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3NlbGVjdENvbWJvQm94fSA6bGFzdC1jaGlsZGApLnRleHRDb250ZW50ID0gJHRhcmdldFtzZWxlY3RJbmRleF0udGV4dENvbnRlbnQ7XG4gICAgfVxuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3RDb21ib0JveCk/LmZvY3VzKCk7XG4gICAgICBvcGVuU3RhdGUoKTtcbiAgICAgIHVwZGF0ZUluZGV4KHRydWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtzZWxlY3RDb21ib0JveH0gOmxhc3QtY2hpbGRgKS50ZXh0Q29udGVudCA9ICR0YXJnZXRbJ29wdGlvbnMnXVskdGFyZ2V0LnNlbGVjdGVkSW5kZXhdPy50ZXh0Q29udGVudCA/PyBwcm9wcy5kZWZhdWx0O1xuICAgICAgY2xvc2VTdGF0ZSgpO1xuICAgIH07XG4gICAgYWN0aW9ucy5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50Jyk7XG4gICAgICBzZWxlY3RJdGVtKGN1cnJlbnRFbCk7XG4gICAgICBjbG9zZVN0YXRlKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmZpcnN0ID0gKCkgPT4ge1xuICAgICAgc2VsZWN0SW5kZXggPSAwO1xuICAgICAga2V5RXZlbnRDYWxsYmFjaygpO1xuICAgIH07XG4gICAgYWN0aW9ucy5sYXN0ID0gKCkgPT4ge1xuICAgICAgc2VsZWN0SW5kZXggPSAkdGFyZ2V0WydvcHRpb25zJ10ubGVuZ3RoIC0gMTtcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcbiAgICB9O1xuICAgIGFjdGlvbnMudXAgPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9IE1hdGgubWF4KC0tc2VsZWN0SW5kZXgsIDApO1xuICAgICAga2V5RXZlbnRDYWxsYmFjaygpO1xuICAgIH07XG4gICAgYWN0aW9ucy5kb3duID0gKCkgPT4ge1xuICAgICAgc2VsZWN0SW5kZXggPSBNYXRoLm1pbigrK3NlbGVjdEluZGV4LCAkdGFyZ2V0WydvcHRpb25zJ10ubGVuZ3RoIC0gMSk7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcblxuICAgIGNvbXBvbmVudC5vcGVuID0gYWN0aW9ucy5vcGVuO1xuICAgIGNvbXBvbmVudC5jbG9zZSA9IGFjdGlvbnMuY2xvc2U7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gJ2Jhc2ljJyB8fCAkdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0LWRpc2FibGVkJykpIHJldHVybjtcblxuICAgIC8vIGExMXlcbiAgICBjb25zdCBhY3Rpb25MaXN0ID0ge1xuICAgICAgdXA6IFsnQXJyb3dVcCddLFxuICAgICAgZG93bjogWydBcnJvd0Rvd24nXSxcbiAgICAgIGZpcnN0OiBbJ0hvbWUnLCAnUGFnZVVwJ10sXG4gICAgICBsYXN0OiBbJ0VuZCcsICdQYWdlRG93biddLFxuICAgICAgY2xvc2U6IFsnRXNjYXBlJ10sXG4gICAgICBzZWxlY3Q6IFsnRW50ZXInLCAnICddLFxuICAgIH07XG5cbiAgICBhZGRFdmVudCgnYmx1cicsIHNlbGVjdENvbWJvQm94LCAoZSkgPT4ge1xuICAgICAgaWYgKGUucmVsYXRlZFRhcmdldD8ucm9sZSA9PT0gJ2xpc3Rib3gnKSByZXR1cm47XG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBhZGRFdmVudCgnY2xpY2snLCBzZWxlY3RDb21ib0JveCwgKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgIGNvbnN0IHRvZ2dsZVN0YXRlID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJyA/ICdjbG9zZScgOiAnb3Blbic7XG4gICAgICBhY3Rpb25zW3RvZ2dsZVN0YXRlXT8uKCk7XG4gICAgfSk7XG5cbiAgICAvLyBhMTF5XG4gICAgYWRkRXZlbnQoJ2tleWRvd24nLCBzZWxlY3RDb21ib0JveCwgKGUpID0+IHtcbiAgICAgIGlmIChzdGF0ZS5zdGF0ZSA9PT0gJ2Nsb3NlJykgcmV0dXJuO1xuXG4gICAgICBjb25zdCB7IGtleSB9ID0gZTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5lbnRyaWVzKGFjdGlvbkxpc3QpLmZpbmQoKFtfLCBrZXlzXSkgPT4ga2V5cy5pbmNsdWRlcyhrZXkpKTtcblxuICAgICAgaWYgKGFjdGlvbikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IFthY3Rpb25OYW1lXSA9IGFjdGlvbjtcbiAgICAgICAgYWN0aW9uc1thY3Rpb25OYW1lXT8uKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRFdmVudCgnY2xpY2snLCBzZWxlY3RMaXN0Qm94LCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgaWYgKHRhcmdldC5yb2xlICE9PSAnb3B0aW9uJykgcmV0dXJuO1xuICAgICAgdXBkYXRlQ3VycmVudENsYXNzKHRhcmdldCk7XG4gICAgICBhY3Rpb25zLnNlbGVjdCgpO1xuICAgIH0pO1xuXG4gICAgLy8g67CU7YWAIOyLnO2KuCDtg4DsnoXsnbzrlYwgZGltbSwgY2xvc2Ug67KE7Yq8IOuIjOuggOydhCDrlYwg64ur7Z6YXG4gICAgaWYgKHByb3BzLnR5cGUgPT09ICdib3R0b21TaGVldCcpIHtcbiAgICAgIGFkZEV2ZW50KCdjbGljaycsIHNlbGVjdERpbW0sIGFjdGlvbnMuY2xvc2UpXG4gICAgICBhZGRFdmVudCgnY2xpY2snLCBzZWxlY3RDbG9zZSwgYWN0aW9ucy5jbG9zZSlcbiAgICB9XG5cbiAgICBldFVJLmhvb2tzLnVzZUV2ZW50TGlzdGVuZXIod2luZG93LCAncmVzaXplJywgKCkgPT4ge1xuICAgICAgYWN0aW9ucy5jbG9zZSgpO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNPcGVuZWQgPSBzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nO1xuICAgIHByb3BzLnRyYW5zaXRpb24gJiYgdGltZWxpbmUoaXNPcGVuZWQpO1xuICAgIGNoZWNrT3BlbkRpcihpc09wZW5lZCk7XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCAnYXJpYS1leHBhbmRlZCcsIGlzT3BlbmVkKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkRWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpO1xuICAgIGlmIChpc09wZW5lZCkgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsIHNlbGVjdGVkRWw/LmlkID8/ICcnKTtcbiAgICBlbHNlIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCAnJyk7XG4gIH1cblxuICAvLyBjdXN0b21cbiAgZnVuY3Rpb24gY2hlY2tPcGVuRGlyKHN0YXRlKSB7XG4gICAgaWYgKCFzdGF0ZSB8fCBwcm9wcy5zY3JvbGxUbykgcmV0dXJuOyAvLyBmYWxzZeydtOqxsOuCmCBzY3JvbGxUbyDquLDriqUg7J6I7J2EIOuVjCAtIOyVhOuemOuhnCDsl7TrprxcblxuICAgIGNvbnN0IHsgaGVpZ2h0OiBsaXN0SGVpZ2h0IH0gPSBldFVJLmhvb2tzLnVzZUdldENsaWVudFJlY3QoJHRhcmdldCwgc2VsZWN0TGlzdEJveCk7XG4gICAgY29uc3QgeyBoZWlnaHQ6IGNvbWJvSGVpZ2h0LCBib3R0b206IGNvbWJvQm90dG9tIH0gPSBldFVJLmhvb2tzLnVzZUdldENsaWVudFJlY3QoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gpO1xuICAgIGNvbnN0IHJvbGUgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBNQVJHSU4gPCBjb21ib0JvdHRvbSArIGxpc3RIZWlnaHQ7XG5cbiAgICBldFVJLnV0aWxzLnNldFN0eWxlKCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsICdib3R0b20nLCByb2xlID8gY29tYm9IZWlnaHQgKyAncHgnIDogJycpO1xuICB9XG5cbiAgLy8gdXBkYXRlIC5jdXJyZW50IGNsYXNzXG4gIGZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnRDbGFzcyhhZGRDbGFzc0VsKSB7XG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudCcpPy5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50Jyk7XG4gICAgYWRkQ2xhc3NFbD8uY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpO1xuICB9XG5cbiAgLy8gc2VsZWN0IGl0ZW1cbiAgZnVuY3Rpb24gc2VsZWN0SXRlbSh0YXJnZXQpIHtcbiAgICBjb25zdCB0YXJnZXRPcHRpb24gPSB0YXJnZXQ/LmNsb3Nlc3Qoc2VsZWN0T3B0aW9uKTtcblxuICAgIGlmICghdGFyZ2V0T3B0aW9uKSByZXR1cm47XG5cbiAgICAkdGFyZ2V0LnNlbGVjdGVkSW5kZXggPSB0YXJnZXRPcHRpb25bJ2luZGV4J107XG4gICAgJHRhcmdldC52YWx1ZSA9IHRhcmdldE9wdGlvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKTtcblxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScsICdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgIHRhcmdldE9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKTtcblxuICAgIHVwZGF0ZUN1cnJlbnRDbGFzcygkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpKTtcbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7c2VsZWN0Q29tYm9Cb3h9IDpsYXN0LWNoaWxkYCkudGV4dENvbnRlbnQgPSB0YXJnZXRPcHRpb24udGV4dENvbnRlbnQ7XG4gIH1cblxuICAvLyBzZWxlY3Qgc3RhdGVcbiAgZnVuY3Rpb24gb3BlblN0YXRlKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdvcGVuJyB9KTtcbiAgICBwcm9wcy50eXBlID09PSAnYm90dG9tU2hlZXQnICYmIHNlbGVjdERpbW1TaG93KCR0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3REaW1tKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZVN0YXRlKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gbnVsbDtcbiAgICBwcm9wcy50eXBlID09PSAnYm90dG9tU2hlZXQnICYmIHNlbGVjdERpbW1DbG9zZSgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0RGltbSkpO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG5cbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICAgIHNlbGVjdEl0ZW0sXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogU3dpcGVyQ29tcFxuICovXG5mdW5jdGlvbiBTd2lwZXJDb21wKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0U3RhdGUsIHNldFByb3BzLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgb2JzZXJ2ZXI6IHRydWUsXG4gICAgICAvLyB1cGRhdGVPbldpbmRvd1Jlc2l6ZTogZmFsc2UsXG4gICAgICBvbjoge1xuICAgICAgICBzbGlkZUNoYW5nZVRyYW5zaXRpb25FbmQoKSB7XG4gICAgICAgICAgc2V0U3RhdGUoeyBhY3RpdmVJbmRleDogdGhpcy5yZWFsSW5kZXggKyAxIH0pO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHN0YXRlOiAnJyxcbiAgICAgIHJ1bm5pbmc6ICcnLFxuICAgICAgYWN0aXZlSW5kZXg6IDAsXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLyoqXG4gICAqIGRhdGEtcHJvcHMg66as7Iqk7Yq4XG4gICAqL1xuXG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnc3dpcGVyJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9LFxuICAgIGNsYXNzTmFtZSA9ICcnO1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCwgJHN3aXBlciwgJHN3aXBlck5hdmlnYXRpb24sICRzd2llcHJQcm9ncmVzcztcbiAgbGV0IHN3aXBlckJ1dHRvblByZXYsIHN3aXBlckJ1dHRvbk5leHQsIHN3aXBlclBhZ2luYXRpb24sIHN3aXBlckF1dG9wbGF5LCAkc3dpcGVyU2xpZGVUb0J1dHRvbjtcbiAgbGV0IGV4Y2VwdGlvbkNsYXNzTmFtZSwgc3dpcGVyTGVuZ3RoLCBzd2lwZXJQZXJWaWV3O1xuXG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBfJHRhcmdldFxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcignVGFyZ2V0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIC8vIHRlbXBsYXRlLCBzZWxlY3RvciwgZWxlbWVudCwgYWN0aW9uc1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBzdGF0ZVxuICAgIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZVxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKHByb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgY29uc3QgeyBuYXZpZ2F0aW9uLCBwYWdpbmF0aW9uLCBwYWdpbmF0aW9uVHlwZSwgcGFnaW5hdGlvbkNsYXNzLCBuYXZpZ2F0aW9uQ2xhc3MgLGF1dG9wbGF5LCBmcmVlTW9kZSwgaW5kaWNhdG9yVGV4dHMgfSA9IHByb3BzOyAvLyBBZGQgaW5kaWNhdG9yVGV4dHMgaGVyZVxuICAgIGNvbnN0IHsgJHRlbXBsYXRlSFRNTCB9ID0gZXRVSS50ZW1wbGF0ZXMuc3dpcGVyVG1wbCgpO1xuICAgIGxldCBzd2lwZXJDb250cm9scztcblxuICAgIGNvbnN0ICRzd2lwZXJDb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICRzd2lwZXJDb250cm9scy5jbGFzc0xpc3QuYWRkKCdzd2lwZXItY29udHJvbHMnKTtcblxuICAgIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItY29udHJvbHMnKSkge1xuICAgICAgc3dpcGVyQ29udHJvbHMgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItY29udHJvbHMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpcGVyQ29udHJvbHMgPSAkc3dpcGVyQ29udHJvbHM7XG4gICAgICAkdGFyZ2V0LmFwcGVuZENoaWxkKHN3aXBlckNvbnRyb2xzKTtcbiAgICB9XG5cbiAgICBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyLXNsaWRlJykubGVuZ3RoIDwgMiAmJiAhJHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zsb3cnKSkge1xuICAgICAgc3dpcGVyQ29udHJvbHMuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICBzd2lwZXJDb250cm9scy5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5hdmlnYXRpb24pIHtcbiAgICAgIHN3aXBlckNvbnRyb2xzLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgJHRlbXBsYXRlSFRNTC5uYXZpZ2F0aW9uKG5hdmlnYXRpb25DbGFzcykpO1xuICAgICAgLy8gaWYgKHR5cGVvZiBuYXZpZ2F0aW9uID09PSAnYm9vbGVhbicgJiYgISR0YXJnZXQucXVlcnlTZWxlY3Rvcihzd2lwZXJCdXR0b25QcmV2KSAmJiAhJHRhcmdldC5xdWVyeVNlbGVjdG9yKHN3aXBlckJ1dHRvbk5leHQpKSB7XG4gICAgICAvLyAgIHN3aXBlckNvbnRyb2xzLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgJHRlbXBsYXRlSFRNTC5uYXZpZ2F0aW9uKG5hdmlnYXRpb25DbGFzcykpO1xuICAgICAgLy8gfVxuXG4gICAgICAvLyBpZiAobmF2aWdhdGlvbiA9PT0gJ2V4Y2VwdGlvbicpIHtcbiAgICAgIC8vICAgY29uc3QgZXhjZXB0aW9uQ29udHJvbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZXhjZXB0aW9uQ2xhc3NOYW1lKTtcbiAgICAgIC8vICAgc2V0UHJvcHMoe1xuICAgICAgLy8gICAgIG5hdmlnYXRpb246IHtcbiAgICAgIC8vICAgICAgIHByZXZFbDogZXhjZXB0aW9uQ29udHJvbC5xdWVyeVNlbGVjdG9yKHN3aXBlckJ1dHRvblByZXYpLFxuICAgICAgLy8gICAgICAgbmV4dEVsOiBleGNlcHRpb25Db250cm9sLnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyQnV0dG9uTmV4dCksXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8gICBzZXRQcm9wcyh7XG4gICAgICAvLyAgICAgbmF2aWdhdGlvbjoge1xuICAgICAgLy8gICAgICAgcHJldkVsOiAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyQnV0dG9uUHJldiksXG4gICAgICAvLyAgICAgICBuZXh0RWw6ICR0YXJnZXQucXVlcnlTZWxlY3Rvcihzd2lwZXJCdXR0b25OZXh0KSxcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICB9KTtcbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBpZiAoZnJlZU1vZGUpIHtcbiAgICAgIHNldFByb3BzKHtcbiAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHBhZ2luYXRpb24pIHtcbiAgICAgICEkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyUGFnaW5hdGlvbikgJiYgc3dpcGVyQ29udHJvbHMuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCAkdGVtcGxhdGVIVE1MLnBhZ2luYXRpb24ocGFnaW5hdGlvbkNsYXNzKSk7XG4gICAgICBzZXRQcm9wcyh7XG4gICAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgICBlbDogJHRhcmdldC5xdWVyeVNlbGVjdG9yKHN3aXBlclBhZ2luYXRpb24pLFxuICAgICAgICAgIHR5cGU6IHBhZ2luYXRpb25UeXBlID8gcGFnaW5hdGlvblR5cGUgOiAnZnJhY3Rpb24nLFxuICAgICAgICAgIGNsaWNrYWJsZTogcGFnaW5hdGlvblR5cGUgPT09ICdidWxsZXRzJyA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhdXRvcGxheSkge1xuICAgICAgISR0YXJnZXQucXVlcnlTZWxlY3Rvcihzd2lwZXJBdXRvcGxheSkgJiYgc3dpcGVyQ29udHJvbHMuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCAkdGVtcGxhdGVIVE1MLmF1dG9wbGF5KCkpO1xuICAgIH1cblxuICAgIGlmIChpbmRpY2F0b3JUZXh0cyAmJiBpbmRpY2F0b3JUZXh0cy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBBZGQgaW5kaWNhdG9ycyBzZXR1cCBoZXJlXG4gICAgICBjb25zdCBpbmRpY2F0b3JUZXh0cyA9IEpTT04ucGFyc2UoJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvcHMtaW5kaWNhdG9yLXRleHRzJykgfHwgJ1tdJyk7XG4gICAgICBjb25zdCBpbmRpY2F0b3JzSFRNTCA9IGA8ZGl2IGNsYXNzPVwic3dpcGVyLWluZGljYXRvcnNcIj48L2Rpdj5gO1xuICAgICAgJHRhcmdldC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGluZGljYXRvcnNIVE1MKTtcbiAgICAgIGNvbnN0IGluZGljYXRvcnNFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnN3aXBlci1pbmRpY2F0b3JzJyk7XG4gICAgICBzZXRQcm9wcyh7XG4gICAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgICBlbDogaW5kaWNhdG9yc0VsLFxuICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgICByZW5kZXJCdWxsZXQ6IGZ1bmN0aW9uIChpbmRleCwgY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwiJyArIGNsYXNzTmFtZSArICdcIj4nICsgaW5kaWNhdG9yVGV4dHNbaW5kZXhdICsgJzwvc3Bhbj4nO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBicmVha3BvaW50c1xuICAgIGlmIChwcm9wcy5icmVha3BvaW50cykge1xuICAgICAgY29uc3QgJGJyZWFrcG9pbnRzID0gT2JqZWN0LnZhbHVlcyhwcm9wcy5icmVha3BvaW50cylbMF07XG4gICAgICBjb25zdCAka2V5ID0gT2JqZWN0LmtleXMoJGJyZWFrcG9pbnRzKTtcbiAgICAgIGNvbnN0ICR2YWx1ZSA9IE9iamVjdC52YWx1ZXMoJGJyZWFrcG9pbnRzKTtcblxuICAgICAgY29uc3QgbmV3QnJlYWtwb2ludHMgPSB7fTtcblxuICAgICAgJGtleS5mb3JFYWNoKChfa2V5LCBpZHgpID0+IHtcbiAgICAgICAgaWYgKCFpc05hTihOdW1iZXIoJHZhbHVlW2lkeF0pKSkge1xuICAgICAgICAgIG5ld0JyZWFrcG9pbnRzW19rZXldID0gTnVtYmVyKCR2YWx1ZVtpZHhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdCcmVha3BvaW50c1tfa2V5XSA9ICR2YWx1ZVtpZHhdO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2V0UHJvcHMoe1xuICAgICAgICBicmVha3BvaW50czoge1xuICAgICAgICAgIDEwMjQ6IHsgLi4ubmV3QnJlYWtwb2ludHMgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgc3dpcGVyUGFnaW5hdGlvbiA9ICcuc3dpcGVyLXBhZ2luYXRpb24nO1xuICAgIHN3aXBlckJ1dHRvblByZXYgPSAnLnN3aXBlci1idXR0b24tcHJldic7XG4gICAgc3dpcGVyQnV0dG9uTmV4dCA9ICcuc3dpcGVyLWJ1dHRvbi1uZXh0JztcbiAgICBzd2lwZXJBdXRvcGxheSA9ICcuc3dpcGVyLWF1dG9wbGF5JztcbiAgICBleGNlcHRpb25DbGFzc05hbWUgPSAkdGFyZ2V0Py5kYXRhc2V0Py5leGNlcHRpb25DbGFzcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuXG4gICAgLy8gYTExeVxuXG4gICAgLy8gbmV3IFN3aXBlciDsg53shLFcbiAgICAkc3dpcGVyID0gbmV3IFN3aXBlcigkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItY29udGFpbmVyJyksIHsgLi4ucHJvcHMgfSk7XG5cbiAgICAkc3dpcGVyTmF2aWdhdGlvbiA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnN3aXBlci1uYXZpZ2F0aW9uJyk7XG4gICAgJHN3aWVwclByb2dyZXNzID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXByb2dyZXNzJyk7XG5cbiAgICBzd2lwZXJMZW5ndGggPSAkc3dpcGVyLnNsaWRlcy5sZW5ndGg7XG4gICAgc3dpcGVyUGVyVmlldyA9ICRzd2lwZXIucGFyYW1zLnNsaWRlc1BlclZpZXc7XG5cbiAgICBpZiAoc3dpcGVyTGVuZ3RoIDw9IHN3aXBlclBlclZpZXcpIHtcbiAgICAgIGlmICgkc3dpcGVyTmF2aWdhdGlvbikgJHN3aXBlck5hdmlnYXRpb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGlmICgkc3dpZXByUHJvZ3Jlc3MpICRzd2llcHJQcm9ncmVzcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICAvLyBhY3Rpb25zLnN0YXJ0ID0gKCkgPT4ge1xuICAgIC8vICAgcGxheSgpO1xuICAgIC8vIH07XG4gICAgLy9cbiAgICAvLyBhY3Rpb25zLnN0b3AgPSAoKSA9PiB7XG4gICAgLy8gICBzdG9wKCk7XG4gICAgLy8gfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIC8vIGF1dG9wbGF5IOuyhO2KvFxuICAgIGlmIChwcm9wcy5hdXRvcGxheSkge1xuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgc3dpcGVyQXV0b3BsYXksIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCAkZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdChzd2lwZXJBdXRvcGxheSk7XG4gICAgICAgIGhhbmRsZUF1dG9wbGF5KCRldmVudFRhcmdldCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gcmVuZGVyXG4gIH1cblxuICAvLyBhdXRvcGxheSDqtIDroKgg7Luk7Iqk7YWAIO2VqOyImFxuICBmdW5jdGlvbiBoYW5kbGVBdXRvcGxheSgkdGFyZ2V0KSB7XG4gICAgJHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdwbGF5Jyk7XG4gICAgJHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdzdG9wJyk7XG5cbiAgICBpZiAoJHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3N0b3AnKSkge1xuICAgICAgc3RvcCgpO1xuICAgIH0gZWxzZSBpZiAoJHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3BsYXknKSkge1xuICAgICAgcGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgJHN3aXBlci5hdXRvcGxheS5zdGFydCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAkc3dpcGVyLmF1dG9wbGF5LnN0b3AoKTtcbiAgfVxuXG4gIC8vIO2KueyglSDsiqzrnbzsnbTrk5zroZwg7J2064+ZXG4gIC8vIGZ1bmN0aW9uIG1vdmVUb1NsaWRlKGluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzKSB7XG4gIC8vICAgaWYgKHByb3BzLmxvb3ApIHtcbiAgLy8gICAgICRzd2lwZXIuc2xpZGVUb0xvb3AoaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MpO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICAkc3dpcGVyLnNsaWRlVG8oaW5kZXgpO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuICAgIC8vIGNhbGxhYmxlXG4gICAgdXBkYXRlLFxuICAgIHBsYXksXG4gICAgc3RvcCxcbiAgICBoYW5kbGVBdXRvcGxheSxcbiAgICBnZXRTd2lwZXJJbnN0YW5jZSgpIHtcbiAgICAgIHJldHVybiAkc3dpcGVyOyAvLyAkc3dpcGVyIOyduOyKpO2EtOyKpCDrsJjtmZhcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqIFRhYlxuICovXG5mdW5jdGlvbiBUYWIoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy8gcHJvcHNcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0YXRlXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICd0YWInO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQsIHRhYkhlYWQsICR0YWJIZWFkRWwsIHRhYkJ0biwgJHRhYkJ0bkVsLCB0YWJDb250ZW50LCAkdGFiQ29udGVudEVsO1xuXG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBfJHRhcmdldFxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcignVGFyZ2V0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBlZmZlY3RcbiAgICBwcm9wcy5zdGlja3kgJiYgc3RpY2t5VGFiKCk7XG5cbiAgICAvLyBzdGF0ZVxuICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IHN0YXRlLmFjdGl2ZSA/PyAkdGFiQnRuRWxbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLXRhYi12YWx1ZScpIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZVxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIHNlbGVjdG9yXG4gICAgdGFiSGVhZCA9ICcudGFiLWhlYWQnO1xuICAgIHRhYkJ0biA9ICcudGFiLWxhYmVsJztcbiAgICB0YWJDb250ZW50ID0gJy50YWItY29udGVudCc7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJHRhYkhlYWRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3Rvcih0YWJIZWFkKTtcbiAgICAkdGFiQnRuRWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwodGFiQnRuKTtcbiAgICAkdGFiQ29udGVudEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHRhYkNvbnRlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgdGFiSGVhZCwgJ3JvbGUnLCAndGFibGlzdCcpO1xuXG4gICAgLy8gY29tcG9uZW50IGN1c3RvbSBlbGVtZW50XG4gICAgJHRhYkhlYWRFbC5zdHlsZS50b3VjaEFjdGlvbiA9ICdub25lJztcbiAgICAkdGFiQnRuRWwuZm9yRWFjaCgodGFiLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgdGFiQnRuSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgICBjb25zdCB0YWJDb250ZW50SWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoJ3RhYnBhbmVsJyk7XG5cbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGFiQnRuSWQpO1xuICAgICAgdGFiLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKTtcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG5cbiAgICAgIGlmICgkdGFiQ29udGVudEVsW2luZGV4XSkge1xuICAgICAgICAkdGFiQ29udGVudEVsW2luZGV4XS5zZXRBdHRyaWJ1dGUoJ2lkJywgdGFiQ29udGVudElkKTtcbiAgICAgICAgJHRhYkNvbnRlbnRFbFtpbmRleF0uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG5cbiAgICAgICAgY29uc3QgdGFiQ29udGVudFZhbHVlID0gJHRhYkNvbnRlbnRFbFtpbmRleF0uZ2V0QXR0cmlidXRlKCdkYXRhLXRhYi12YWx1ZScpO1xuICAgICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkJ0bn1bZGF0YS10YWItdmFsdWU9XCIke3RhYkNvbnRlbnRWYWx1ZX1cIl1gLCAnYXJpYS1jb250cm9scycsICR0YWJDb250ZW50RWxbaW5kZXhdLmlkKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFiVmFsdWUgPSB0YWIuZ2V0QXR0cmlidXRlKCdkYXRhLXRhYi12YWx1ZScpO1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBgJHt0YWJDb250ZW50fVtkYXRhLXRhYi12YWx1ZT1cIiR7dGFiVmFsdWV9XCJdYCwgJ2FyaWEtbGFiZWxsZWRieScsIHRhYi5pZCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgbGV0IHN0YXJ0WCA9IDA7XG4gICAgbGV0IGVuZFggPSAwO1xuICAgIGxldCBtb3ZlWCA9IDA7XG4gICAgbGV0IHNjcm9sbExlZnQgPSAwO1xuICAgIGxldCBpc1JlYWR5TW92ZSA9IGZhbHNlO1xuICAgIGxldCBjbGlja2FibGUgPSB0cnVlO1xuXG4gICAgYWN0aW9ucy5zZWxlY3QgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IHRhcmdldEJ0biA9IGUudGFyZ2V0LmNsb3Nlc3QodGFiQnRuKTtcbiAgICAgIGlmICghdGFyZ2V0QnRuKSByZXR1cm47XG4gICAgICBpZiAoIWNsaWNrYWJsZSkgcmV0dXJuO1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogdGFyZ2V0QnRuLmdldEF0dHJpYnV0ZSgnZGF0YS10YWItdmFsdWUnKSB9KTtcbiAgICAgIGdzYXAudG8oJHRhYkhlYWRFbCwge1xuICAgICAgICBkdXJhdGlvbjogMC41LFxuICAgICAgICBzY3JvbGxMZWZ0OiB0YXJnZXRCdG4ub2Zmc2V0TGVmdCAtIDI0LFxuICAgICAgICBvdmVyd3JpdGU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5kcmFnU3RhcnQgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmIChpc1JlYWR5TW92ZSkgcmV0dXJuO1xuICAgICAgaXNSZWFkeU1vdmUgPSB0cnVlO1xuICAgICAgc3RhcnRYID0gZS54O1xuICAgICAgc2Nyb2xsTGVmdCA9ICR0YWJIZWFkRWwuc2Nyb2xsTGVmdDtcbiAgICB9O1xuICAgIGFjdGlvbnMuZHJhZ01vdmUgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmICghaXNSZWFkeU1vdmUpIHJldHVybjtcbiAgICAgIG1vdmVYID0gZS54O1xuICAgICAgJHRhYkhlYWRFbC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdCArIChzdGFydFggLSBtb3ZlWCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRyYWdFbmQgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmICghaXNSZWFkeU1vdmUpIHJldHVybjtcbiAgICAgIGVuZFggPSBlLng7XG4gICAgICBpZiAoTWF0aC5hYnMoc3RhcnRYIC0gZW5kWCkgPCAxMCkgY2xpY2thYmxlID0gdHJ1ZTtcbiAgICAgIGVsc2UgY2xpY2thYmxlID0gZmFsc2U7XG4gICAgICBpc1JlYWR5TW92ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgYWN0aW9ucy5kcmFnTGVhdmUgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmICghaXNSZWFkeU1vdmUpIHJldHVybjtcblxuICAgICAgLy8gZ3NhcC50bygkdGFiSGVhZEVsLCB7XG4gICAgICAvLyAgIHNjcm9sbExlZnQ6ICR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykub2Zmc2V0TGVmdCxcbiAgICAgIC8vICAgb3ZlcndyaXRlOiB0cnVlLFxuICAgICAgLy8gfSk7XG5cbiAgICAgIGNsaWNrYWJsZSA9IHRydWU7XG4gICAgICBpc1JlYWR5TW92ZSA9IGZhbHNlO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLnVwID0gKGUpID0+IHtcbiAgICAgIGlmICghZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZykgcmV0dXJuO1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiLXZhbHVlJykgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5kb3duID0gKGUpID0+IHtcbiAgICAgIGlmICghZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nKSByZXR1cm47XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcuZ2V0QXR0cmlidXRlKCdkYXRhLXRhYi12YWx1ZScpIH0pO1xuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZmlyc3QgPSAoKSA9PiB7XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiAkdGFiQnRuRWxbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLXRhYi12YWx1ZScpIH0pO1xuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcbiAgICB9O1xuICAgIGFjdGlvbnMubGFzdCA9ICgpID0+IHtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6ICR0YWJCdG5FbFskdGFiQnRuRWwubGVuZ3RoIC0gMV0uZ2V0QXR0cmlidXRlKCdkYXRhLXRhYi12YWx1ZScpIH0pO1xuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZm9jdXNUYXJnZXRWYWx1ZShlbCwgdmFsdWUpIHtcbiAgICAgIGNvbnN0IGZvY3VzVGFyZ2V0ID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke2VsfVtkYXRhLXRhYi12YWx1ZT1cIiR7dmFsdWV9XCJdYCk7XG4gICAgICBmb2N1c1RhcmdldD8uZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBjb25zdCBhY3Rpb25MaXN0ID0ge1xuICAgICAgdXA6IFsnQXJyb3dMZWZ0J10sXG4gICAgICBkb3duOiBbJ0Fycm93UmlnaHQnXSxcbiAgICAgIGZpcnN0OiBbJ0hvbWUnXSxcbiAgICAgIGxhc3Q6IFsnRW5kJ10sXG4gICAgICBzZWxlY3Q6IFsnRW50ZXInLCAnICddLFxuICAgIH07XG5cbiAgICBhZGRFdmVudCgnY2xpY2snLCB0YWJIZWFkLCBhY3Rpb25zLnNlbGVjdCk7XG4gICAgYWRkRXZlbnQoJ3BvaW50ZXJkb3duJywgdGFiSGVhZCwgYWN0aW9ucy5kcmFnU3RhcnQpO1xuICAgIGFkZEV2ZW50KCdwb2ludGVybW92ZScsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ01vdmUpO1xuICAgIGFkZEV2ZW50KCdwb2ludGVydXAnLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdFbmQpO1xuICAgIGFkZEV2ZW50KCdwb2ludGVybGVhdmUnLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdMZWF2ZSk7XG5cbiAgICBhZGRFdmVudCgna2V5ZG93bicsIHRhYkhlYWQsIChlKSA9PiB7XG4gICAgICBjb25zdCB7IGtleSB9ID0gZTtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IE9iamVjdC5lbnRyaWVzKGFjdGlvbkxpc3QpLmZpbmQoKFtfLCBrZXlzXSkgPT4ga2V5cy5pbmNsdWRlcyhrZXkpKTtcblxuICAgICAgaWYgKGFjdGlvbikge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IFthY3Rpb25OYW1lXSA9IGFjdGlvbjtcbiAgICAgICAgYWN0aW9uc1thY3Rpb25OYW1lXT8uKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IGdldElkID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3RhYkJ0bn1bYXJpYS1zZWxlY3RlZD1cInRydWVcIl1gKT8uaWQ7XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nLCAnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkJ0bn1bZGF0YS10YWItdmFsdWU9XCIke3N0YXRlLmFjdGl2ZVZhbHVlfVwiXWAsICdhcmlhLXNlbGVjdGVkJywgdHJ1ZSk7XG5cbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7dGFiQ29udGVudH1bYXJpYS1sYWJlbGxlZGJ5PVwiJHtnZXRJZH1cIl1gKT8uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHt0YWJDb250ZW50fVtkYXRhLXRhYi12YWx1ZT1cIiR7c3RhdGUuYWN0aXZlVmFsdWV9XCJdYCk/LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgfVxuXG4gIC8vIGN1c3RvbVxuICBmdW5jdGlvbiBzdGlja3lUYWIoKSB7XG4gICAgY29uc3QgeyBib3R0b20gfSA9IGV0VUkuaG9va3MudXNlR2V0Q2xpZW50UmVjdChkb2N1bWVudCwgcHJvcHMuc3RpY2t5KTtcblxuICAgICR0YXJnZXQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICR0YWJIZWFkRWwuc3R5bGUucG9zaXRpb24gPSAnc3RpY2t5JztcbiAgICBpZiAoIWJvdHRvbSkgJHRhYkhlYWRFbC5zdHlsZS50b3AgPSAwICsgJ3B4JztcbiAgICBlbHNlICR0YWJIZWFkRWwuc3R5bGUudG9wID0gYm90dG9tICsgJ3B4JztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldE9mZnNldExlZnQoKSB7XG4gICAgY29uc3QgdGFyZ2V0QnRuID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKTtcbiAgICBpZiAoIXRhcmdldEJ0bikgcmV0dXJuO1xuXG4gICAgZ3NhcC5zZXQoJHRhYkhlYWRFbCwge1xuICAgICAgc2Nyb2xsTGVmdDogdGFyZ2V0QnRuLm9mZnNldExlZnQgLSAyNCxcbiAgICAgIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuICAgIHNldE9mZnNldExlZnQsXG4gICAgdXBkYXRlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCJmdW5jdGlvbiBUb2FzdCgpIHtcbiAgY29uc3Qge1xuICAgIGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCxcbiAgfSA9IGV0VUkuaG9va3MudXNlQ29yZSh7XG4gICAgLy8gcHJvcHNcbiAgICB0eXBlOiAnYmFzaWMnLFxuICAgIG1lc3NhZ2U6ICfrqZTshLjsp4Drpbwg7KeA7KCV7ZW0IOyjvOyEuOyalC4nLFxuICB9LCB7XG4gICAgLy8gc3RhdGVcblxuICB9LCByZW5kZXIpO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAndG9hc3QnO1xuICBsZXQgY29tcG9uZW50ID0ge307XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCAkdGFyZ2V0LCAkdG9hc3Q7XG4gIGxldCB0b2FzdFRyaWdnZXJCdG4sIHRvYXN0Q2xvc2VCdG47XG5cbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpe1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpXG4gICAgfWVsc2V7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYoISR0YXJnZXQpe1xuICAgICAgdGhyb3cgRXJyb3IoJ3RhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLicpO1xuICAgIH1cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0ICk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgLy8gJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAvLyBzZXR1cFRlbXBsYXRlKCk7XG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcblxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3Rvcigpe1xuICAgIHRvYXN0VHJpZ2dlckJ0biA9ICcudG9hc3QtdHJpZ2dlci1idG4nO1xuICAgIHRvYXN0Q2xvc2VCdG4gPSAnLnRvYXN0LWNsb3NlLWJ0bic7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gc2V0IGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgLy8gY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgJy10aXQnKTtcblxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRvYXN0LCAnaWQnLCBpZCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRBbmltYXRpb24gKG5ld1RvYXN0LCBpbm5lclRvYXN0KSB7XG4gICAgLy8g6rCc67OEIO2DgOyehOudvOyduCDsg53shLFcbiAgICBjb25zdCB0bCA9IGdzYXAudGltZWxpbmUoKTtcblxuICAgIHRsLmZyb21UbyhuZXdUb2FzdCwge1xuICAgICAgb3BhY2l0eTogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIG1hcmdpbkJvdHRvbTogMCxcbiAgICB9LCB7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgIGhlaWdodDogaW5uZXJUb2FzdC5jbGllbnRIZWlnaHQsXG4gICAgICBtYXJnaW5Cb3R0b206ICcwLjhyZW0nLFxuICAgIH0pXG4gICAgLnRvKG5ld1RvYXN0LCB7XG4gICAgICBkZWxheTogMyxcbiAgICAgIGR1cmF0aW9uOiAwLjUsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICBuZXdUb2FzdC5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCl7XG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MLCAkdGVtcGxhdENsb3NlSFRNTCwgJHRlbXBsYXRlTGlua0hUTUwgfSA9IGV0VUkudGVtcGxhdGVzLnRvYXN0VG1wbCgpO1xuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NvbXBvbmVudC10b2FzdCcpXG5cbiAgICAgIGlmIChwcm9wcy50eXBlID09PSAnYmFzaWMnKSB7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAkdGVtcGxhdGVIVE1MKHByb3BzKVxuICAgICAgfSBlbHNlIGlmIChwcm9wcy50eXBlID09PSAnY2xvc2UnKSB7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAkdGVtcGxhdENsb3NlSFRNTChwcm9wcylcbiAgICAgIH0gZWxzZSBpZiAocHJvcHMudHlwZSA9PT0gJ2xpbmsnKSB7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAkdGVtcGxhdGVMaW5rSFRNTChwcm9wcylcbiAgICAgIH1cbiAgICAgICR0YXJnZXQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICR0b2FzdCA9IGNvbnRhaW5lcjtcblxuICAgICAgc2V0QW5pbWF0aW9uICgkdG9hc3QsICR0b2FzdC5xdWVyeVNlbGVjdG9yKCcudG9hc3QtY29udGFpbmVyJykpO1xuICAgIH1cblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoe3RhcmdldH0pID0+IHtcbiAgICAgIHRhcmdldC5jbG9zZXN0KCcuY29tcG9uZW50LXRvYXN0JykucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgdG9hc3RDbG9zZUJ0biwgYWN0aW9ucy5jbG9zZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyByZW5kZXJcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG4gICAgYWN0aW9ucy5vcGVuKCk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBhY3Rpb25zLmNsb3NlKCk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIC8vIGNhbGxhYmxlXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH1cblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiBUb29sdGlwXG4gKi9cbmZ1bmN0aW9uIFRvb2x0aXAoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgdHlwZTogJ2RlZmF1bHQnLFxuICAgICAgZHVyYXRpb246IDAuMixcbiAgICAgIGhlaWdodDogJ2F1dG8nLFxuICAgICAgdHJhbnNmb3JtOiB7XG4gICAgICAgIHNjYWxlOiB7XG4gICAgICAgICAgeDogMSxcbiAgICAgICAgICB5OiAxLFxuICAgICAgICB9LFxuICAgICAgICB0cmFuc2xhdGU6IHtcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIHk6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIGRlbGF5OiAwLFxuICAgICAgICBlYXNpbmc6ICdwb3dlcjQub3V0JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBzdGF0ZTogJ2Nsb3NlJyxcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcbiAgY29uc3QgeyBmaXJzdE5vZGVGb2N1c091dCwgbGFzdE5vZGVGb2N1c091dCB9ID0gZXRVSS5ob29rcy51c2VBMTF5S2V5RXZlbnQoKTtcbiAgY29uc3QgeyBtZWRpYVF1ZXJ5QWN0aW9uIH0gPSBldFVJLmhvb2tzLnVzZU1lZGlhUXVlcnkoKTtcblxuICAvLyBzdGF0ZSDrs4Dqsr0g7IucIOuenOuNlCDsnqztmLjstpxcbiAgY29uc3QgbmFtZSA9ICd0b29sdGlwJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICBsZXQgY2xlYW51cHMgPSBbXTtcblxuICAvLyDsmpTshozqtIDroKgg67OA7IiY65OkXG4gIGxldCAkdGFyZ2V0LCAkdG9vbHRpcENvbnRhaW5lciwgJG9wZW5CdG4sICRjbG9zZUJ0biwgJG9wZW5kaW0sICR0b29sdGlwRGltO1xuICBsZXQgdG9vbHRpcENsb3NlQnRuLCB0b29sdGlwVHJpZ2dlckJ0biwgdG9vbHRpcERpbTtcbiAgbGV0IGZvY3VzVHJhcEluc3RhbmNlO1xuICBsZXQgdG9vbHRpcENvbnRhaW5lclg7XG4gIGxldCBib2R5V2lkdGg7XG5cbiAgLy8g67CY7J2R7ZiVXG4gIGxldCBpc01vYmlsZSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcobWF4LXdpZHRoOiAxMDI0cHgpJykubWF0Y2hlcztcblxuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gZm9jdXMgdHJhcFxuICAgIGZvY3VzVHJhcEluc3RhbmNlID0gZm9jdXNUcmFwLmNyZWF0ZUZvY3VzVHJhcCgkdGFyZ2V0LCB7XG4gICAgICBlc2NhcGVEZWFjdGl2YXRlczogcHJvcHMuZXNjLFxuICAgICAgb25BY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0FjdGl2YXRlLFxuICAgICAgb25EZWFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgZXRVSS51dGlscy5hbGxDbGVhbnVwcyhjbGVhbnVwcyk7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHt9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBlbGVtZW50XG4gICAgJHRvb2x0aXBDb250YWluZXIgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy50b29sdGlwLWNvbnRhaW5lcicpO1xuICAgIC8vIHNlbGVjb3RyXG4gICAgdG9vbHRpcFRyaWdnZXJCdG4gPSAnLnRvb2x0aXAtYnRuLXRyaWdnZXInO1xuICAgIHRvb2x0aXBDbG9zZUJ0biA9ICcudG9vbHRpcC1idG4tY2xvc2UnO1xuICAgICR0b29sdGlwRGltID0gJy5kaW0nO1xuICAgIHRvb2x0aXBEaW0gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5kaW0nKTsgLy8gMDYxNiBkaW0gdHlwZSDstpTqsIBcbiAgICAkb3BlbkJ0biA9ICR0YXJnZXQucXVlcnlTZWxlY3Rvcih0b29sdGlwVHJpZ2dlckJ0bik7XG4gICAgJGNsb3NlQnRuID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKHRvb2x0aXBDbG9zZUJ0bik7XG4gICAgJG9wZW5kaW0gPSB0b29sdGlwRGltOyAvLyAwNjE2IGRpbSB0eXBlIHRvb2x0aXBEaW0g67OA7IiY7JeQIOyngeygkSDtlaDri7lcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBzZXQgaWRcbiAgICBjb25zdCBpZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcbiAgICBjb25zdCB0aXRsZUlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUgKyAnLXRpdCcpO1xuXG4gICAgLy8gYTExeVxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGl0bGVJZCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgaWYgKGlzTW9iaWxlICYmIHRvb2x0aXBEaW0pIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2hlY2tPdmVyZmxvdyA9ICgpID0+IHtcbiAgICAgICAgYm9keVdpZHRoID0gJHRvb2x0aXBDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSAzMDtcbiAgICAgICAgdG9vbHRpcENvbnRhaW5lclggPSAkdG9vbHRpcENvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54O1xuICAgICAgICBpZiAodG9vbHRpcENvbnRhaW5lclggPCAwKSB7XG4gICAgICAgICAgJHRvb2x0aXBDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnb3ZlcmZsb3ctbGVmdCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHRvb2x0aXBDb250YWluZXJYID4gYm9keVdpZHRoKSB7XG4gICAgICAgICAgJHRvb2x0aXBDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnb3ZlcmZsb3ctcmlnaHQnKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3Qgc2V0QW5pbWF0aW9uID0geyBkdXJhdGlvbjogMCwgZGlzcGxheTogJ25vbmUnLCBvcGFjaXR5OiAwIH07XG4gICAgICBpZiAocHJvcHMudHlwZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgIGdzYXBcbiAgICAgICAgICAudGltZWxpbmUoKVxuICAgICAgICAgIC50bygkdG9vbHRpcENvbnRhaW5lciwgc2V0QW5pbWF0aW9uKVxuICAgICAgICAgIC50bygkdG9vbHRpcENvbnRhaW5lciwge1xuICAgICAgICAgICAgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLFxuICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICBvblVwZGF0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICBjaGVja092ZXJmbG93KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHMudHlwZSA9PT0gJ2N1c3RvbScpIHtcbiAgICAgICAgZ3NhcFxuICAgICAgICAgIC50aW1lbGluZSgpXG4gICAgICAgICAgLnRvKCR0b29sdGlwQ29udGFpbmVyLCBzZXRBbmltYXRpb24pXG4gICAgICAgICAgLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sXG4gICAgICAgICAgICBzY2FsZTogMSxcbiAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgb25VcGRhdGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgY2hlY2tPdmVyZmxvdygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgJGNsb3NlQnRuICYmICRjbG9zZUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgJHRvb2x0aXBDb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICBpZiAoJGNsb3NlQnRuKSB7XG4gICAgICAgICRjbG9zZUJ0bi5mb2N1cygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyQ2xhc3MgPSAkdG9vbHRpcENvbnRhaW5lci5jbGFzc0xpc3RcbiAgICAgIGNvbnN0IHNjYWxlID0gcHJvcHMudHJhbnNmb3JtLnNjYWxlLng7XG4gICAgICBjb25zdCB7IHR5cGUgfSA9IHByb3BzXG5cbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBudWxsO1xuXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHtcbiAgICAgICAgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLFxuICAgICAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICBjb250YWluZXJDbGFzcy5jb250YWlucygnb3ZlcmZsb3ctbGVmdCcpICYmIGNvbnRhaW5lckNsYXNzLnJlbW92ZSgnb3ZlcmZsb3ctbGVmdCcpO1xuICAgICAgICAgIGNvbnRhaW5lckNsYXNzLmNvbnRhaW5zKCdvdmVyZmxvdy1yaWdodCcpICYmIGNvbnRhaW5lckNsYXNzLnJlbW92ZSgnb3ZlcmZsb3ctcmlnaHQnKTtcblxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJGNsb3NlQnRuICYmICRjbG9zZUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICR0b29sdGlwQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgdHlwZSA9PT0gJ2N1c3RvbScgJiYgZ3NhcC50aW1lbGluZSgpLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7IGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbiwgc2NhbGU6IHNjYWxlLCBkaXNwbGF5OiAnbm9uZScsIG9wYWNpdHk6IDAgfSk7XG4gICAgICB0eXBlID09PSAnZGVmYXVsdCcgJiYgZ3NhcC50aW1lbGluZSgpLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7IGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbiwgZGlzcGxheTogJ25vbmUnLCBvcGFjaXR5OiAwIH0pO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLmZvY3VzQWN0aXZhdGUgPSAoKSA9PiB7fTtcblxuICAgIGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlID0gKCkgPT4ge1xuICAgICAgaWYgKCFzdGF0ZS50cmlnZ2VyKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvcHMubmVnYXRpdmVDYWxsYmFjaztcbiAgICAgIH1cbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmRlYWN0aXZhdGUoKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgZXRVSS5ob29rcy51c2VFdmVudExpc3RlbmVyKHdpbmRvdywgJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIGlzTW9iaWxlID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtYXgtd2lkdGg6IDEwMjRweCknKS5tYXRjaGVzO1xuICAgIH0pO1xuXG4gICAgZXRVSS5ob29rcy51c2VFdmVudExpc3RlbmVyKGRvY3VtZW50LmJvZHksICdjbGljaycsIChlKSA9PiB7XG4gICAgICBpZiAoc3RhdGUuc3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgICBjb25zdCB7IHRhcmdldCB9ID0gZTtcblxuICAgICAgICBpZiAodGFyZ2V0ID09PSAkdG9vbHRpcENvbnRhaW5lciB8fCB0YXJnZXQgPT09ICRvcGVuQnRuKSByZXR1cm47XG4gICAgICAgIGlmICh0b29sdGlwRGltKSB0b29sdGlwRGltLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICAgICAgJG9wZW5CdG4uY2xhc3NMaXN0LnJlbW92ZSgnb24nKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZEV2ZW50KCd0b3VjaG1vdmUnLCAkdG9vbHRpcERpbSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIGFkZEV2ZW50KCdjbGljaycsIHRvb2x0aXBUcmlnZ2VyQnRuLCBmdW5jdGlvbiAoKSB7XG4gICAgICBhY3Rpb25zLm9wZW4oKTtcblxuICAgICAgJG9wZW5CdG4uY2xhc3NMaXN0LmFkZCgnb24nKTtcbiAgICAgIC8vIDA2MTYgZGltIHR5cGUg7LaU6rCAXG4gICAgICBpZiAodG9vbHRpcERpbSkge1xuICAgICAgICB0b29sdGlwRGltLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCRjbG9zZUJ0bikge1xuICAgICAgY2xlYW51cHMucHVzaChmaXJzdE5vZGVGb2N1c091dCgkY2xvc2VCdG4sIGFjdGlvbnMuY2xvc2UpKTtcbiAgICAgIGNsZWFudXBzLnB1c2gobGFzdE5vZGVGb2N1c091dCgkY2xvc2VCdG4sIGFjdGlvbnMuY2xvc2UpKTtcbiAgICAgIGFkZEV2ZW50KCdjbGljaycsIHRvb2x0aXBDbG9zZUJ0biwgZnVuY3Rpb24gKCkge1xuICAgICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgICAgIGlmICh0b29sdGlwRGltKSB7XG4gICAgICAgICAgdG9vbHRpcERpbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsZWFudXBzLnB1c2goZmlyc3ROb2RlRm9jdXNPdXQoJG9wZW5CdG4sIGFjdGlvbnMub3BlbikpO1xuICAgICAgY2xlYW51cHMucHVzaChsYXN0Tm9kZUZvY3VzT3V0KCRvcGVuQnRuLCBhY3Rpb25zLmNsb3NlKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzU2hvdyA9IHN0YXRlLnN0YXRlID09PSAnb3Blbic7XG4gICAgY29uc3QgZXhwYW5kZWQgPSAkdG9vbHRpcENvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnO1xuICAgICR0b29sdGlwQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICFleHBhbmRlZCk7XG4gICAgJHRvb2x0aXBDb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGV4cGFuZGVkKTtcblxuICAgIGlmIChpc1Nob3cpIHtcbiAgICAgIGFjdGlvbnMub3BlbigpO1xuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UuYWN0aXZhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UuZGVhY3RpdmF0ZSgpO1xuICAgIH1cblxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0pO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIGluaXQsXG4gICAgICBkZXN0cm95LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgfSxcblxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCJcbmV0VUkuY29tcG9uZW50cyA9IHtcbkFjY29yZGlvbixcbkNvbGxhcHNlLFxuRGF0ZXBpY2tlckNvbXAsXG5EaWFsb2csXG5JbnB1dCxcbkxvdHRpZSxcbk1vZGFsLFxuU2VsZWN0Qm94LFxuU3dpcGVyQ29tcCxcblRhYixcblRvYXN0LFxuVG9vbHRpcFxufVxuICAgICAgICAgICAgICAiLCIvLyBpbml0IGpzXG5mdW5jdGlvbiBpbml0VUkoKSB7XG4gIGNvbnN0IHsgbWVkaWFRdWVyeUFjdGlvbiB9ID0gZXRVSS5ob29rcy51c2VNZWRpYVF1ZXJ5KCk7XG4gIGNvbnN0IGNvbXBvbmVudExpc3QgPSBbXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICcuY29tcG9uZW50LWlucHV0JyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuSW5wdXQsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5jb21wb25lbnQtbW9kYWwnLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5Nb2RhbCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnLmNvbXBvbmVudC1jb2xsYXBzZScsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLkNvbGxhcHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICcuY29tcG9uZW50LWFjY29yZGlvbicsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLkFjY29yZGlvbixcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnLmNvbXBvbmVudC10b29sdGlwJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuVG9vbHRpcCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnLmNvbXBvbmVudC10YWInLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5UYWIsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5jb21wb25lbnQtc2VsZWN0JyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuU2VsZWN0Qm94LFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICcuY29tcG9uZW50LXN3aXBlcicsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlN3aXBlckNvbXAsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5jb21wb25lbnQtZGF0ZXBpY2tlcicsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLkRhdGVwaWNrZXJDb21wLFxuICAgIH0sXG4gIF07XG5cbiAgbWVkaWFRdWVyeUFjdGlvbigoY29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHsgaXNEZXNrdG9wLCBpc01vYmlsZSB9ID0gY29udGV4dC5jb25kaXRpb25zO1xuXG4gICAgY29tcG9uZW50TGlzdC5mb3JFYWNoKCh7IHNlbGVjdG9yLCBmbiB9KSA9PiB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBjb25zdCB7IGRlc2t0b3BPbmx5LCBtb2JpbGVPbmx5IH0gPSBlbC5kYXRhc2V0O1xuICAgICAgICBpZiAobW9iaWxlT25seSB8fCBkZXNrdG9wT25seSkge1xuICAgICAgICAgIGNvbnN0IHNob3VsZEluaXQgPSAobW9iaWxlT25seSAmJiBpc01vYmlsZSkgfHwgKGRlc2t0b3BPbmx5ICYmIGlzRGVza3RvcCk7XG5cbiAgICAgICAgICBpZiAoc2hvdWxkSW5pdCkge1xuICAgICAgICAgICAgaW5pdFN3aXBlcihlbCwgc2VsZWN0b3IsIGZuKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsLnVpKSB7XG4gICAgICAgICAgICBkZXN0cm95U3dpcGVyKGVsKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWwuZGF0YXNldC5pbml0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBmbigpO1xuICAgICAgICAgIGRvY3VtZW50LmZvbnRzLnJlYWR5LnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudCAmJiBjb21wb25lbnQuY29yZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb3JlLmluaXQoZWwsIHt9LCBzZWxlY3Rvcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb21wb25lbnQgaW5pdGlhbGl6YXRpb24gZmFpbGVkOiBjb21wb25lbnQgb3IgY29tcG9uZW50LmNvcmUgaXMgdW5kZWZpbmVkJywgc2VsZWN0b3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbml0aWFsaXppbmcgY29tcG9uZW50OicsIHNlbGVjdG9yLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYXRpbmcgY29tcG9uZW50IGluc3RhbmNlOicsIHNlbGVjdG9yLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBldFVJLmRpYWxvZyA9IGV0VUkuaG9va3MudXNlRGlhbG9nKCk7XG59XG5cbmV0VUkuaW5pdFVJID0gaW5pdFVJO1xuXG4oZnVuY3Rpb24gYXV0b0luaXQoKSB7XG4gIGNvbnN0ICRzY3JpcHRCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1pbml0XVwiKTtcbiAgaWYgKCRzY3JpcHRCbG9jaykge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGluaXRVSSgpO1xuICAgIH0pO1xuICB9XG59KSgpO1xuIiwiZnVuY3Rpb24gZGlhbG9nVG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9ICh7IGRpYWxvZ1R5cGUsIHR5cGUsIHRpdGxlLCBtZXNzYWdlLCBwb3NpdGl2ZVRleHQsIG5lZ2F0aXZlVGV4dCB9KSA9PiBgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWRpYWxvZ1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWRpbW1cIj48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1mcmFtZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPlxuICAgICAgICAgICAgICAke3RpdGxlID8gYDxoMyBjbGFzcz1cImRpYWxvZy10aXRcIj4ke3RpdGxlfTwvaDM+YCA6ICcnfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgJHtkaWFsb2dUeXBlID09PSAnYWxlcnQnID8gYDxzcGFuIGNsYXNzPVwiJHt0eXBlfVwiPmljb248L3NwYW4+YCA6ICcnfVxuXG4gICAgICAgICAgICAgIDxwIGNsYXNzPVwiZGlhbG9nLWluZm9cIj4ke21lc3NhZ2UucmVwbGFjZSgvXFxuL2csICc8YnI+Jyl9PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2NvbmZpcm0nID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zcXVhcmUgYnRuLXdoaXRlIGRpYWxvZy1uZWdhdGl2ZVwiPiR7bmVnYXRpdmVUZXh0fTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgICAgJHtwb3NpdGl2ZVRleHQgPyBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gZGlhbG9nLXBvc2l0aXZlIGJ0bi1wcmltYXJ5XCI+JHtwb3NpdGl2ZVRleHR9PC9idXR0b24+YCA6ICcnfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyA/IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImRpYWxvZy1jbG9zZVwiPjxzcGFuIGNsYXNzPVwiaGlkZS10eHRcIj7tjJ3sl4Ug64ur6riwPC9zcGFuPjwvYnV0dG9uPmAgOiAnJ31cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgY29uc3QgJHRlbXBsYXRlUHJldmlld0ltYWdlSFRNTCA9ICh7IGRpYWxvZ1R5cGUsIGltYWdlcywgdGl0bGUgfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1kaWFsb2cgZGlhbG9nLXByZXZpZXctaW1hZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1kaW1tXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZnJhbWVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgJHt0aXRsZSA/IGA8aDMgY2xhc3M9XCJkaWFsb2ctdGl0XCI+JHt0aXRsZX08L2gzPmAgOiAnJ31cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtc3dpcGVyXCIgZGF0YS1jb21wb25lbnQ9XCJzd2lwZXJcIj5cbiAgICAgICAgICAgICAgICA8IS0tIEFkZGl0aW9uYWwgcmVxdWlyZWQgd3JhcHBlciAtLT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgICR7aW1hZ2VzXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgKGltYWdlKSA9PiBgXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItc2xpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7aW1hZ2Uuc3JjfVwiIGFsdD1cIiR7aW1hZ2UuYWx0fVwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgYCxcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAuam9pbignJyl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImRpYWxvZy1jbG9zZVwiPjxzcGFuIGNsYXNzPVwiaGlkZS10eHRcIj7tjJ3sl4Ug64ur6riwPC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVIVE1MLFxuICAgICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUxcbiAgfTtcbn1cbiIsIlxuZXRVSS50ZW1wbGF0ZXMgPSB7XG5kaWFsb2dUbXBsLFxuaW5wdXRUbXBsLFxuc2VsZWN0Qm94VG1wbCxcbnN3aXBlclRtcGwsXG50b2FzdFRtcGxcbn1cbiAgICAgICAgICAgICAgIiwiZnVuY3Rpb24gaW5wdXRUbXBsKCkge1xuICBjb25zdCAkdGVtcGxhdGVIVE1MID0ge1xuICAgIHRvZ2dsZVBhc3N3b3JkKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJpbnB1dC1maWVsZC1idG4gcGFzc3dvcmQtc3RhdGVcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImhpZGUtdHh0IGhpZGVcIj4ke2V0VUkuJHQoJ2lucHV0LnBhc3N3b3JkX2hpZGUnLCAn67mE67CA67KI7Zi4IOyIqOq4sOq4sCcpfTwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImhpZGUtdHh0IHNob3dcIj4ke2V0VUkuJHQoJ2lucHV0LnBhc3N3b3JkX3Nob3cnLCAn67mE67CA67KI7Zi4IO2RnOyLnCcpfTwvc3Bhbj5cbiAgICAgICAgICA8aSBjbGFzcz1cImljby1wYXNzd29yZC1zdGF0ZSBpY28tbm9ybWFsXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBjbGVhckJ1dHRvbigpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiaW5wdXQtZmllbGQtYnRuIGNsZWFyXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPiR7ZXRVSS4kdCgnaW5wdXQuY2xlYXInLCAn64K07JqpIOyngOyasOq4sCcpfTwvc3Bhbj5cbiAgICAgICAgICA8aSBjbGFzcz1cImljby1jbGVhciBpY28tbm9ybWFsXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBsb2FkaW5nKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGkgY2xhc3M9XCJpbnB1dC1maWVsZC1pY28gc3Bpbm5lclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgIGA7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4ge1xuICAgICR0ZW1wbGF0ZUhUTUwsXG4gIH07XG59XG4iLCIvKipcbiAqIOqwnOyduOygleuztOyymOumrOuwqey5qCDthZztlIzrpr8g6rSA66asXG4gKiDri6jstpXtgqQ6XG4gKiAtIEFsdCArIFA6IO2MneyXhSDsl7TquLBcbiAqIC0gQWx0ICsgRzog7L2U65OcIOyDneyEsVxuICogLSBBbHQgKyBDOiDtla3rqqkg7IKt7KCcXG4gKi9cbi8qIGdsb2JhbCB3aW5kb3csIGRvY3VtZW50LCBhbGVydCwgRXZlbnQgKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyDrqqjri6wgSFRNTCDqtazsobAg7IOd7ISxXG4gIGZ1bmN0aW9uIGNyZWF0ZVByaXZhY3lQb2xpY3lNb2RhbCgpIHtcbiAgICBjb25zdCBtb2RhbEhUTUwgPSBgXG4gICAgICA8c3R5bGU+XG4gICAgICAgIC8qIOumrOyKpO2KuCDsiqTtg4DsnbwgKi9cbiAgICAgICAgLnBvbGljeS1saXN0IHtcbiAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAvKiDrtojrpr8g66as7Iqk7Yq4ICovXG4gICAgICAgIHVsLnBvbGljeS1saXN0Om5vdCguaHlwaGVuLWxpc3QpIGxpIHtcbiAgICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IGRpc2M7XG4gICAgICAgIH1cblxuICAgICAgICAvKiDrsojtmLgg66as7Iqk7Yq4ICovXG4gICAgICAgIG9sLnBvbGljeS1saXN0IGxpIHtcbiAgICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IGRlY2ltYWw7XG4gICAgICAgIH1cblxuICAgICAgICAvKiDtlZjsnbTtlIgg66as7Iqk7Yq4ICovXG4gICAgICAgIC5oeXBoZW4tbGlzdCBsaSB7XG4gICAgICAgICAgbGlzdC1zdHlsZS10eXBlOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgIHBhZGRpbmctbGVmdDogMTVweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5oeXBoZW4tbGlzdCBsaTpiZWZvcmUge1xuICAgICAgICAgIGNvbnRlbnQ6ICctJztcbiAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIOuwleyKpCDsiqTtg4DsnbwgKi9cbiAgICAgICAgLmJveC1zdHlsZSB7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjhmODtcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZTBlMGUwO1xuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xuICAgICAgICAgIG1hcmdpbi10b3A6IDVweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIOyEnOyLnSDtiLTrsJQg7Iqk7YOA7J28ICovXG4gICAgICAgIC5mb3JtYXR0aW5nLXRvb2xiYXIge1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgZ2FwOiA1cHg7XG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgICAgICAgIHBhZGRpbmc6IDVweDtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1O1xuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmZvcm1hdHRpbmctdG9vbGJhciBidXR0b24ge1xuICAgICAgICAgIHBhZGRpbmc6IDNweCA4cHg7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmZvcm1hdHRpbmctdG9vbGJhciBidXR0b246aG92ZXIge1xuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmMGYwZjA7XG4gICAgICAgIH1cblxuICAgICAgICAuZm9ybWF0dGluZy10b29sYmFyIGJ1dHRvbi5hY3RpdmUge1xuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlMGUwZTA7XG4gICAgICAgIH1cblxuICAgICAgICAvKiDsmpTshowg7LaU6rCAIOyEueyFmCDsiqTtg4DsnbwgKi9cbiAgICAgICAgLmVsZW1lbnRzLXNlY3Rpb24ge1xuICAgICAgICAgIG1hcmdpbi1ib3R0b20gOiAyMHB4O1xuICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZjlmOTtcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5lbGVtZW50cy1zZWN0aW9uIGg0IHtcbiAgICAgICAgICBtYXJnaW46IDAgMCAxMHB4IDA7XG4gICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICB9XG5cbiAgICAgICAgLmVsZW1lbnRzLWJ1dHRvbnMge1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgZ2FwOiAxMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmVsZW1lbnQtZGlhbG9nIHtcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5lbGVtZW50LWRpYWxvZyBsYWJlbCB7XG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgICAgICB9XG5cbiAgICAgICAgLmVsZW1lbnQtZGlhbG9nIGlucHV0IHtcbiAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICAgICAgfVxuICAgICAgPC9zdHlsZT5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtbW9kYWwgcHJpdmFjeS1wb2xpY3ktbW9kYWxcIiBpZD1cInByaXZhY3lQb2xpY3lNb2RhbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGltbVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGFpbmVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxuICAgICAgICAgICAgPGgyIGNsYXNzPVwibW9kYWwtdGl0XCI+6rCc7J247KCV67O07LKY66as67Cp7LmoIO2FnO2UjOumvzwvaDI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZW1wbGF0ZS1jb250cm9sc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGVtcGxhdGUtdHlwZVwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbD7thZztlIzrpr8g7Jyg7ZiVOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1zZWxlY3RcIj5cbiAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJ0ZW1wbGF0ZVR5cGVcIiBjbGFzcz1cInNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ0aXRsZVwiPu2DgOydtO2LgDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibGlzdFwiPuumrOyKpO2KuDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYm94XCI+67CV7IqkPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJsaXN0VHlwZUNvbnRhaW5lclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTsgbWFyZ2luLWJvdHRvbTogMTBweDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGVtcGxhdGUtdHlwZVwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsPuumrOyKpO2KuCDsnKDtmJU6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtc2VsZWN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJsaXN0VHlwZVwiIGNsYXNzPVwic2VsZWN0LWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwidWxcIj7rtojrpr8g66as7Iqk7Yq4PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm9sXCI+67KI7Zi4IOumrOyKpO2KuDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJoeXBoZW5cIj7tlZjsnbTtlIgg66as7Iqk7Yq4PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGVtcGxhdGUtaW5wdXRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpdGVtVGl0bGVcIj7soJzrqqk6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRcIiBkYXRhLXByb3BzLWNsZWFyPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cIml0ZW1UaXRsZVwiIHBsYWNlaG9sZGVyPVwi7KCc66qp7J2EIOyeheugpe2VmOyEuOyalFwiPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIml0ZW1Db250ZW50XCI+64K07JqpOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybWF0dGluZy10b29sYmFyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiYm9sZEJ0blwiIHRpdGxlPVwi6rW16rKMXCI+PHN0cm9uZz5CPC9zdHJvbmc+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiaXRhbGljQnRuXCIgdGl0bGU9XCLquLDsmrjsnoRcIj48ZW0+STwvZW0+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwidW5kZXJsaW5lQnRuXCIgdGl0bGU9XCLrsJHspIRcIj48dT5VPC91PjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cIml0ZW1Db250ZW50XCIgcGxhY2Vob2xkZXI9XCLrgrTsmqnsnYQg7J6F66Cl7ZWY7IS47JqUXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZW1wbGF0ZS1idXR0b25zXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImFkZEl0ZW1cIiBjbGFzcz1cImJ0blwiPuuvuOumrCDrs7TquLA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiZGVsZXRlSXRlbVwiIGNsYXNzPVwiYnRuIGJ0bi1jbG9zZVwiPuy0iOq4sO2ZlDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRlbXBsYXRlLXByZXZpZXdcIj5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cInByZXZpZXdDb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVsZW1lbnRzLXNlY3Rpb25cIj5cbiAgICAgICAgICAgICAgPGg0PuyalOyGjCDstpTqsIA8L2g0PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZWxlbWVudHMtYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiYWRkQnV0dG9uRWxlbWVudFwiIGNsYXNzPVwiYnRuIGJ0bi1zbVwiPuuyhO2KvCDstpTqsIA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImFkZExpbmtFbGVtZW50XCIgY2xhc3M9XCJidG4gYnRuLXNtXCI+66eB7YGsIOy2lOqwgDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImJ1dHRvbkVsZW1lbnREaWFsb2dcIiBjbGFzcz1cImVsZW1lbnQtZGlhbG9nXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJidXR0b25UZXh0XCI+67KE7Yq8IO2FjeyKpO2KuDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiYnV0dG9uVGV4dFwiIHBsYWNlaG9sZGVyPVwi67KE7Yq87JeQIO2RnOyLnO2VoCDthY3siqTtirhcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYnV0dG9uQ2xhc3NcIj7rsoTtirwg7YG0656Y7IqkICjshKDtg53sgqztla0pOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJidXR0b25DbGFzc1wiIHBsYWNlaG9sZGVyPVwi7JiIOiBidG4gYnRuLXByaW1hcnlcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibG9jYXRpb24tY2hlY2tib3hlc1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveC1pbm5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cImFkZFRvTGlzdFwiIG5hbWU9XCJhZGRUb0xpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZWNrYm94LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hlY2tib3gtdHh0XCI+TGlzdCDsmpTshozsl5Ag7LaU6rCAPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveC1pbm5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cImFkZFRvQ29udGVudFwiIG5hbWU9XCJhZGRUb0NvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZWNrYm94LWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hlY2tib3gtdHh0XCI+Q29udGVudCDsmpTshozsl5Ag7LaU6rCAPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJpbnNlcnRCdXR0b25FbGVtZW50XCIgY2xhc3M9XCJidG4gYnRuLXNtXCI+7LaU6rCAPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImNhbmNlbEJ1dHRvbkVsZW1lbnRcIiBjbGFzcz1cImJ0biBidG4tc20gYnRuLWNsb3NlXCI+7Leo7IaMPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwibGlua0VsZW1lbnREaWFsb2dcIiBjbGFzcz1cImVsZW1lbnQtZGlhbG9nXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJsaW5rVGV4dFwiPuunge2BrCDthY3siqTtirg6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImxpbmtUZXh0XCIgcGxhY2Vob2xkZXI9XCLrp4Htgazsl5Ag7ZGc7Iuc7ZWgIO2FjeyKpO2KuFwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJsaW5rVXJsXCI+66eB7YGsIFVSTDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwibGlua1VybFwiIHBsYWNlaG9sZGVyPVwi7JiIOiBodHRwczovL2V4YW1wbGUuY29tXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1idXR0b25zXCI+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImluc2VydExpbmtFbGVtZW50XCIgY2xhc3M9XCJidG4gYnRuLXNtXCI+7LaU6rCAPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImNhbmNlbExpbmtFbGVtZW50XCIgY2xhc3M9XCJidG4gYnRuLXNtIGJ0bi1jbG9zZVwiPuy3qOyGjDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRlbXBsYXRlLWNvZGVcIj5cbiAgICAgICAgICAgICAgPGgzPuyDneyEseuQnCDsvZTrk5w8L2gzPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJnZW5lcmF0ZWRDb2RlXCIgcmVhZG9ubHk+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJhZGRDb2RlXCIgY2xhc3M9XCJidG5cIj7svZTrk5wg7IOd7ISxPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1jbG9zZSBtb2RhbC1jbG9zZS1idG5cIj7ri6vquLA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gY29weS1jb2RlLWJ0blwiPuy9lOuTnCDrs7Xsgqw8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm1vZGFsLWNsb3NlXCI+PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIC8vIOuqqOuLrCBIVE1M7J2EIGJvZHnsl5Ag7LaU6rCAXG4gICAgZG9jdW1lbnQuYm9keS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIG1vZGFsSFRNTCk7XG4gIH1cblxuICAvLyDrqqjri6wg7LSI6riw7ZmUIOuwjyDsnbTrsqTtirgg67CU7J2465SpXG4gIGZ1bmN0aW9uIGluaXRQcml2YWN5UG9saWN5TW9kYWwoKSB7XG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJpdmFjeVBvbGljeU1vZGFsJyk7XG4gICAgaWYgKCFtb2RhbCkge1xuICAgICAgY3JlYXRlUHJpdmFjeVBvbGljeU1vZGFsKCk7XG4gICAgICBiaW5kTW9kYWxFdmVudHMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBIVE1MIO2DnOq3uOulvCDqt7jrjIDroZwg7Jyg7KeA7ZWY64qUIO2VqOyImCAo7J207KCE7J2YIOuniO2BrOuLpOyatCDrs4DtmZgg7ZWo7IiYIOuMgOyytClcbiAgZnVuY3Rpb24gcHJlc2VydmVIVE1MVGFncyh0ZXh0KSB7XG4gICAgaWYgKCF0ZXh0KSByZXR1cm4gdGV4dDtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIC8vIOyEnOyLnSDsmLXshZgg67KE7Yq8IOydtOuypO2KuCDsspjrpqxcbiAgZnVuY3Rpb24gc2V0dXBGb3JtYXR0aW5nVG9vbGJhcigpIHtcbiAgICBjb25zdCBib2xkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvbGRCdG4nKTtcbiAgICBjb25zdCBpdGFsaWNCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRhbGljQnRuJyk7XG4gICAgY29uc3QgdW5kZXJsaW5lQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VuZGVybGluZUJ0bicpO1xuICAgIGNvbnN0IGNvbnRlbnRUZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtQ29udGVudCcpO1xuXG4gICAgaWYgKCFib2xkQnRuIHx8ICFpdGFsaWNCdG4gfHwgIXVuZGVybGluZUJ0biB8fCAhY29udGVudFRleHRhcmVhKSByZXR1cm47XG5cbiAgICAvLyDqtbXqsowg67KE7Yq8IO2BtOumrSDsnbTrsqTtirhcbiAgICBib2xkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgYXBwbHlGb3JtYXR0aW5nKCdib2xkJyk7XG4gICAgfSk7XG5cbiAgICAvLyDquLDsmrjsnoQg67KE7Yq8IO2BtOumrSDsnbTrsqTtirhcbiAgICBpdGFsaWNCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBhcHBseUZvcm1hdHRpbmcoJ2l0YWxpYycpO1xuICAgIH0pO1xuXG4gICAgLy8g67CR7KSEIOuyhO2KvCDtgbTrpq0g7J2067Kk7Yq4XG4gICAgdW5kZXJsaW5lQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgYXBwbHlGb3JtYXR0aW5nKCd1bmRlcmxpbmUnKTtcbiAgICB9KTtcblxuICAgIC8vIOyalOyGjCDstpTqsIAg67KE7Yq8IOydtOuypO2KuCDsspjrpqxcbiAgICBzZXR1cEVsZW1lbnRzQnV0dG9ucygpO1xuXG4gICAgLy8g7ISc7IudIOyggeyaqSDtlajsiJhcbiAgICBmdW5jdGlvbiBhcHBseUZvcm1hdHRpbmcoZm9ybWF0KSB7XG4gICAgICBjb25zdCB0ZXh0YXJlYSA9IGNvbnRlbnRUZXh0YXJlYTtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGV4dGFyZWEuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICBjb25zdCBlbmQgPSB0ZXh0YXJlYS5zZWxlY3Rpb25FbmQ7XG4gICAgICBjb25zdCBzZWxlY3RlZFRleHQgPSB0ZXh0YXJlYS52YWx1ZS5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgICBsZXQgZm9ybWF0dGVkVGV4dCA9ICcnO1xuXG4gICAgICBpZiAoc2VsZWN0ZWRUZXh0KSB7XG4gICAgICAgIHN3aXRjaChmb3JtYXQpIHtcbiAgICAgICAgY2FzZSAnYm9sZCc6XG4gICAgICAgICAgZm9ybWF0dGVkVGV4dCA9IGA8c3Ryb25nIGNsYXNzPVwic3Ryb25nXCI+JHtzZWxlY3RlZFRleHR9PC9zdHJvbmc+YDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnaXRhbGljJzpcbiAgICAgICAgICBmb3JtYXR0ZWRUZXh0ID0gYDxlbSBjbGFzcz1cIml0YWxpY1wiPiR7c2VsZWN0ZWRUZXh0fTwvZW0+YDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndW5kZXJsaW5lJzpcbiAgICAgICAgICBmb3JtYXR0ZWRUZXh0ID0gYDx1IGNsYXNzPVwidW5kZXJsaW5lXCI+JHtzZWxlY3RlZFRleHR9PC91PmA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDshKDtg53tlZwg7YWN7Iqk7Yq466W8IOyEnOyLneydtCDsoIHsmqnrkJwg7YWN7Iqk7Yq466GcIOq1kOyytFxuICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9IHRleHRhcmVhLnZhbHVlLnN1YnN0cmluZygwLCBzdGFydCkgKyBmb3JtYXR0ZWRUZXh0ICsgdGV4dGFyZWEudmFsdWUuc3Vic3RyaW5nKGVuZCk7XG5cbiAgICAgICAgLy8g7Luk7IScIOychOy5mCDsnqzshKTsoJVcbiAgICAgICAgdGV4dGFyZWEuZm9jdXMoKTtcbiAgICAgICAgdGV4dGFyZWEuc2VsZWN0aW9uU3RhcnQgPSBzdGFydCArIGZvcm1hdHRlZFRleHQubGVuZ3RoO1xuICAgICAgICB0ZXh0YXJlYS5zZWxlY3Rpb25FbmQgPSBzdGFydCArIGZvcm1hdHRlZFRleHQubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIOyalOyGjCDstpTqsIAg67KE7Yq8IOydtOuypO2KuCDsspjrpqxcbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50c0J1dHRvbnMoKSB7XG4gICAgY29uc3QgY29udGVudFRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1Db250ZW50Jyk7XG4gICAgY29uc3QgYWRkQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRCdXR0b25FbGVtZW50Jyk7XG4gICAgY29uc3QgYWRkTGlua0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkTGlua0VsZW1lbnQnKTtcbiAgICBjb25zdCBidXR0b25FbGVtZW50RGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbkVsZW1lbnREaWFsb2cnKTtcbiAgICBjb25zdCBsaW5rRWxlbWVudERpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rRWxlbWVudERpYWxvZycpO1xuICAgIGNvbnN0IGluc2VydEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zZXJ0QnV0dG9uRWxlbWVudCcpO1xuICAgIGNvbnN0IGNhbmNlbEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FuY2VsQnV0dG9uRWxlbWVudCcpO1xuICAgIGNvbnN0IGluc2VydExpbmtFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydExpbmtFbGVtZW50Jyk7XG4gICAgY29uc3QgY2FuY2VsTGlua0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FuY2VsTGlua0VsZW1lbnQnKTtcblxuICAgIC8vIOuyhO2KvCDstpTqsIAg64yA7ZmU7IOB7J6QIOyXtOq4sFxuICAgIGFkZEJ1dHRvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBidXR0b25FbGVtZW50RGlhbG9nLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgbGlua0VsZW1lbnREaWFsb2cuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b25UZXh0JykuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIC8vIOunge2BrCDstpTqsIAg64yA7ZmU7IOB7J6QIOyXtOq4sFxuICAgIGFkZExpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbGlua0VsZW1lbnREaWFsb2cuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBidXR0b25FbGVtZW50RGlhbG9nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1RleHQnKS5mb2N1cygpO1xuICAgIH0pO1xuXG4gICAgLy8g67KE7Yq8IOy2lOqwgCDsspjrpqxcbiAgICBpbnNlcnRCdXR0b25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgYnV0dG9uVGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b25UZXh0JykudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgYnV0dG9uQ2xhc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uQ2xhc3MnKS52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBhZGRUb0xpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkVG9MaXN0JykuY2hlY2tlZDtcbiAgICAgIGNvbnN0IGFkZFRvQ29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRUb0NvbnRlbnQnKS5jaGVja2VkO1xuXG4gICAgICBpZiAoIWJ1dHRvblRleHQpIHtcbiAgICAgICAgYWxlcnQoJ+uyhO2KvCDthY3siqTtirjrpbwg7J6F66Cl7ZW07KO87IS47JqULicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJ1dHRvbkhUTUwgPSBidXR0b25DbGFzc1xuICAgICAgICA/IGA8YnV0dG9uIGNsYXNzPVwiJHtidXR0b25DbGFzc31cIj4ke2J1dHRvblRleHR9PC9idXR0b24+YFxuICAgICAgICA6IGA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+JHtidXR0b25UZXh0fTwvYnV0dG9uPmA7XG5cbiAgICAgIGlmIChhZGRUb0xpc3QpIHtcbiAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvbGljeS1saXN0JykpIHtcbiAgICAgICAgICAvLyBwb2xpY3ktbGlzdOyXkCDstpTqsIDtlZjripQg66Gc7KeBXG4gICAgICAgICAgY29uc3QgbGlzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgIGxpc3RFbGVtZW50LmlubmVySFRNTCA9IGJ1dHRvbkhUTUw7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvbGljeS1saXN0JykuYXBwZW5kQ2hpbGQobGlzdEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGFkZFRvQ29udGVudCkge1xuICAgICAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9saWN5LWNvbnRlbnQnKSkge1xuICAgICAgICAgIC8vIHBvbGljeS1jb250ZW50IOyekOyLnSDsmpTshozroZwg7LaU6rCA7ZWY64qUIOuhnOyngVxuICAgICAgICAgIGNvbnN0IGJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBidXR0b25FbGVtZW50LmlubmVySFRNTCA9IGJ1dHRvbkhUTUw7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvbGljeS1jb250ZW50JykuYXBwZW5kQ2hpbGQoYnV0dG9uRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHBvbGljeS1pdGVtIOyekOyLnSDsmpTshozroZwg7LaU6rCA7ZWY64qUIOuhnOyngVxuICAgICAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9saWN5LWl0ZW0nKSkge1xuICAgICAgICAgIGNvbnN0IGJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBidXR0b25FbGVtZW50LmlubmVySFRNTCA9IGJ1dHRvbkhUTUw7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvbGljeS1pdGVtJykuYXBwZW5kQ2hpbGQoYnV0dG9uRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRlbXBsYXRlSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBsYXN0SXRlbSA9IHRlbXBsYXRlSXRlbXNbdGVtcGxhdGVJdGVtcy5sZW5ndGggLSAxXTtcblxuICAgICAgICBpZiAoYWRkVG9MaXN0IHx8IGFkZFRvQ29udGVudCkge1xuICAgICAgICAgIC8vIOumrOyKpO2KuCDsmpTshozsl5Ag7LaU6rCAXG4gICAgICAgICAgaWYgKGxhc3RJdGVtLnR5cGUgPT09ICdsaXN0JyB8fCBsYXN0SXRlbS50eXBlID09PSAnYm94Jykge1xuICAgICAgICAgICAgLy8g7J2066+4IOyeiOuKlCDrpqzsiqTtirgg64K07Jqp7JeQIOyDiCDrpqzsiqTtirgg7JWE7J207YWcIOuYkOuKlCDrgrTsmqnsl5Ag7LaU6rCAXG4gICAgICAgICAgICBsYXN0SXRlbS5jb250ZW50ICs9ICdcXG4nICsgYnV0dG9uSFRNTDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8g6riw67O4IOychOy5mOyXkCDstpTqsIAgKOyytO2BrOuwleyKpCDshKDtg50g7JeG7J2EIOuVjClcbiAgICAgICAgICBpZiAoIWxhc3RJdGVtLmJ1dHRvbkhUTUwpIHtcbiAgICAgICAgICAgIGxhc3RJdGVtLmJ1dHRvbkhUTUwgPSBidXR0b25IVE1MO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXN0SXRlbS5idXR0b25IVE1MICs9ICdcXG4nICsgYnV0dG9uSFRNTDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnV0dG9uRWxlbWVudERpYWxvZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvblRleHQnKS52YWx1ZSA9ICcnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbkNsYXNzJykudmFsdWUgPSAnJztcbiAgICB9KTtcblxuICAgIC8vIOunge2BrCDstpTqsIAg7LKY66asIO2VqOyImCDsiJjsoJVcbiAgICBpbnNlcnRMaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGxpbmtUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtUZXh0JykudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgbGlua1VybCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVXJsJykudmFsdWUudHJpbSgpO1xuXG4gICAgICBpZiAoIWxpbmtUZXh0KSB7XG4gICAgICAgIGFsZXJ0KCfrp4Htgawg7YWN7Iqk7Yq466W8IOyeheugpe2VtOyjvOyEuOyalC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxpbmtVcmwpIHtcbiAgICAgICAgYWxlcnQoJ+unge2BrCBVUkzsnYQg7J6F66Cl7ZW07KO87IS47JqULicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpbmtIVE1MID0gYDxhIGhyZWY9XCIke2xpbmtVcmx9XCI+JHtsaW5rVGV4dH08L2E+YDtcblxuICAgICAgaW5zZXJ0QXRDdXJzb3IoY29udGVudFRleHRhcmVhLCBsaW5rSFRNTCk7XG5cbiAgICAgIC8vIHRlbXBsYXRlSXRlbXMg67Cw7Je0IOyXheuNsOydtO2KuCAtIHRleHRhcmVh7J2YIOyDiCDqsJLsnLzroZwg7JeF642w7J207Yq4XG4gICAgICBpZiAodGVtcGxhdGVJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIO2YhOyerCDshKDtg53rkJwg7ZWt66qp7J20IOyXhuycvOuptCDqsIDsnqUg7LWc6re8IO2VreuqqSDsl4XrjbDsnbTtirhcbiAgICAgICAgY29uc3QgbGFzdEl0ZW0gPSB0ZW1wbGF0ZUl0ZW1zW3RlbXBsYXRlSXRlbXMubGVuZ3RoIC0gMV07XG4gICAgICAgIGxhc3RJdGVtLmNvbnRlbnQgPSBjb250ZW50VGV4dGFyZWEudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGxpbmtFbGVtZW50RGlhbG9nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1RleHQnKS52YWx1ZSA9ICcnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtVcmwnKS52YWx1ZSA9ICcnO1xuICAgIH0pO1xuXG4gICAgLy8g67KE7Yq8IOy2lOqwgCDst6jshoxcbiAgICBjYW5jZWxCdXR0b25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgYnV0dG9uRWxlbWVudERpYWxvZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvblRleHQnKS52YWx1ZSA9ICcnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbkNsYXNzJykudmFsdWUgPSAnJztcbiAgICB9KTtcblxuICAgIC8vIOunge2BrCDstpTqsIAg7LKY66asXG4gICAgaW5zZXJ0TGlua0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBsaW5rVGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVGV4dCcpLnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IGxpbmtVcmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1VybCcpLnZhbHVlLnRyaW0oKTtcblxuICAgICAgaWYgKCFsaW5rVGV4dCkge1xuICAgICAgICBhbGVydCgn66eB7YGsIO2FjeyKpO2KuOulvCDsnoXroKXtlbTso7zshLjsmpQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsaW5rVXJsKSB7XG4gICAgICAgIGFsZXJ0KCfrp4HtgawgVVJM7J2EIOyeheugpe2VtOyjvOyEuOyalC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsaW5rSFRNTCA9IGA8YSBocmVmPVwiJHtsaW5rVXJsfVwiPiR7bGlua1RleHR9PC9hPmA7XG5cbiAgICAgIGluc2VydEF0Q3Vyc29yKGNvbnRlbnRUZXh0YXJlYSwgbGlua0hUTUwpO1xuICAgICAgbGlua0VsZW1lbnREaWFsb2cuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVGV4dCcpLnZhbHVlID0gJyc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1VybCcpLnZhbHVlID0gJyc7XG4gICAgfSk7XG5cbiAgICAvLyDrp4Htgawg7LaU6rCAIOy3qOyGjFxuICAgIGNhbmNlbExpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgbGlua0VsZW1lbnREaWFsb2cuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVGV4dCcpLnZhbHVlID0gJyc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1VybCcpLnZhbHVlID0gJyc7XG4gICAgfSk7XG5cbiAgICAvLyDsu6TshJwg7JyE7LmY7JeQIO2FjeyKpO2KuCDsgr3snoVcbiAgICBmdW5jdGlvbiBpbnNlcnRBdEN1cnNvcih0ZXh0YXJlYSwgdGV4dCkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydDtcbiAgICAgIGNvbnN0IGVuZCA9IHRleHRhcmVhLnNlbGVjdGlvbkVuZDtcblxuICAgICAgdGV4dGFyZWEudmFsdWUgPSB0ZXh0YXJlYS52YWx1ZS5zdWJzdHJpbmcoMCwgc3RhcnQpICsgdGV4dCArIHRleHRhcmVhLnZhbHVlLnN1YnN0cmluZyhlbmQpO1xuXG4gICAgICAvLyDsu6TshJwg7JyE7LmYIOyerOyEpOyglVxuICAgICAgdGV4dGFyZWEuZm9jdXMoKTtcbiAgICAgIHRleHRhcmVhLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQgKyB0ZXh0Lmxlbmd0aDtcbiAgICAgIHRleHRhcmVhLnNlbGVjdGlvbkVuZCA9IHN0YXJ0ICsgdGV4dC5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgLy8g66qo64usIOydtOuypO2KuCDrsJTsnbjrlKlcbiAgZnVuY3Rpb24gYmluZE1vZGFsRXZlbnRzKCkge1xuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByaXZhY3lQb2xpY3lNb2RhbCcpO1xuICAgIGNvbnN0IG1vZGFsRGltbSA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kaW1tJyk7XG4gICAgY29uc3QgbW9kYWxDb250YWluZXIgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY29udGFpbmVyJyk7XG4gICAgY29uc3QgY2xvc2VCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2xvc2UnKTtcbiAgICBjb25zdCBjbG9zZUJ0bkZvb3RlciA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1jbG9zZS1idG4nKTtcbiAgICBjb25zdCBhZGRJdGVtQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZEl0ZW0nKTtcbiAgICBjb25zdCBhZGRDb2RlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZENvZGUnKTtcbiAgICBjb25zdCBkZWxldGVJdGVtQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZUl0ZW0nKTtcbiAgICBjb25zdCBjb3B5Q29kZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5jb3B5LWNvZGUtYnRuJyk7XG4gICAgY29uc3QgdGVtcGxhdGVUeXBlU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlbXBsYXRlVHlwZScpO1xuXG4gICAgLy8g7YWc7ZSM66a/IO2VreuqqSDrjbDsnbTthLBcbiAgICAvLyBjb25zdCB0ZW1wbGF0ZUl0ZW1zID0gW107XG5cbiAgICAvLyDrqqjri6wg64ur6riwIO2VqOyImFxuICAgIGNvbnN0IGNsb3NlTW9kYWwgPSAoKSA9PiB7XG4gICAgICBtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH07XG5cbiAgICAvLyDrqqjri6wg7Je06riwIO2VqOyImFxuICAgIGNvbnN0IG9wZW5Nb2RhbCA9ICgpID0+IHtcbiAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgbW9kYWxEaW1tLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgbW9kYWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICB9O1xuXG4gICAgLy8g64ur6riwIOuyhO2KvCDsnbTrsqTtirhcbiAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xuICAgIGNsb3NlQnRuRm9vdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7XG4gICAgbW9kYWxEaW1tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7XG5cbiAgICAvLyDthZztlIzrpr8g7Jyg7ZiVIOuzgOqyvSDsnbTrsqTtirhcbiAgICB0ZW1wbGF0ZVR5cGVTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgLy8g7YWc7ZSM66a/IOycoO2YlSDrs4Dqsr0g7IucIOuqqOuToCDsnoXroKUg7ZWE65OcIOy0iOq4sO2ZlFxuICAgICAgLy8gMS4g7J6F66ClIO2VhOuTnCDstIjquLDtmZRcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtVGl0bGUnKS52YWx1ZSA9ICcnOyAvLyDsoJzrqqkg7LSI6riw7ZmUXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbUNvbnRlbnQnKS52YWx1ZSA9ICcnOyAvLyDrgrTsmqkg7LSI6riw7ZmUXG5cbiAgICAgIC8vIDIuIO2FnO2UjOumvyDtla3rqqkg642w7J207YSwIOy0iOq4sO2ZlFxuICAgICAgdGVtcGxhdGVJdGVtcy5sZW5ndGggPSAwO1xuXG4gICAgICAvLyAzLiDrr7jrpqzrs7TquLAg7LSI6riw7ZmUXG4gICAgICB1cGRhdGVQcmV2aWV3KCk7XG5cbiAgICAgIC8vIDQuIOyDneyEseuQnCDsvZTrk5wg7LSI6riw7ZmUXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2VuZXJhdGVkQ29kZScpLnZhbHVlID0gJyc7XG5cbiAgICAgIC8vIDUuIOyYiOyLnCDsl4XrjbDsnbTtirggKO2FnO2UjOumvyDsnKDtmJXsl5Ag65Sw6528IOyYiOyLnCDrs4Dqsr0pXG4gICAgICBjb25zdCB0aXRsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1UaXRsZScpO1xuICAgICAgY29uc3QgY29udGVudElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1Db250ZW50Jyk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZVR5cGUgPSB0ZW1wbGF0ZVR5cGVTZWxlY3QudmFsdWU7XG4gICAgICBjb25zdCBsaXN0VHlwZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0VHlwZUNvbnRhaW5lcicpO1xuXG4gICAgICAvLyDrpqzsiqTtirgg7Jyg7ZiVIOyEoO2DnSDsmLXshZgg7ZGc7IucL+yIqOq5gFxuICAgICAgaWYodGVtcGxhdGVUeXBlID09PSAndGl0bGUnKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbGVtZW50cy1zZWN0aW9uJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH0gZWxzZSBpZiAodGVtcGxhdGVUeXBlID09PSAnbGlzdCcpIHtcbiAgICAgICAgbGlzdFR5cGVDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbGVtZW50cy1zZWN0aW9uJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRUb0xpc3QnKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRUb0NvbnRlbnQnKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3RUeXBlQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbGVtZW50cy1zZWN0aW9uJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRUb0xpc3QnKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZFRvQ29udGVudCcpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH1cblxuICAgICAgc3dpdGNoKHRlbXBsYXRlVHlwZSkge1xuICAgICAgY2FzZSAndGl0bGUnOlxuICAgICAgICB0aXRsZUlucHV0LnBsYWNlaG9sZGVyID0gJ+2DgOydtO2LgCc7XG4gICAgICAgIGNvbnRlbnRJbnB1dC5wbGFjZWhvbGRlciA9ICfrgrTsmqkg7JeG7J2MJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgdGl0bGVJbnB1dC5wbGFjZWhvbGRlciA9ICftg4DsnbTti4AnO1xuICAgICAgICBjb250ZW50SW5wdXQucGxhY2Vob2xkZXIgPSAn64K07JqpJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3gnOlxuICAgICAgICB0aXRsZUlucHV0LnBsYWNlaG9sZGVyID0gJ+2DgOydtO2LgCc7XG4gICAgICAgIGNvbnRlbnRJbnB1dC5wbGFjZWhvbGRlciA9ICfrgrTsmqknO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIOuvuOumrCDrs7TquLAg67CPIOy9lOuTnCDsg53shLEg67KE7Yq8IOydtOuypO2KuFxuICAgIGFkZEl0ZW1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBhZGRUZW1wbGF0ZUl0ZW0oKTtcbiAgICAgIC8vIGdlbmVyYXRlVGVtcGxhdGVDb2RlKCk7XG4gICAgfSk7XG5cbiAgICAvLyDrr7jrpqwg67O06riwIOuwjyDsvZTrk5wg7IOd7ISxIOuyhO2KvCDsnbTrsqTtirhcbiAgICBhZGRDb2RlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgLy8gYWRkVGVtcGxhdGVJdGVtKCk7XG4gICAgICBnZW5lcmF0ZVRlbXBsYXRlQ29kZSgpO1xuICAgIH0pO1xuXG4gICAgLy8g7LSI6riw7ZmUIOuyhO2KvCDsnbTrsqTtirhcbiAgICBkZWxldGVJdGVtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgcmVzZXRUZW1wbGF0ZUl0ZW1zKCk7XG4gICAgfSk7XG5cbiAgICAvLyDsvZTrk5wg67O17IKsIOuyhO2KvCDsnbTrsqTtirhcbiAgICBjb3B5Q29kZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZENvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2VuZXJhdGVkQ29kZScpO1xuICAgICAgZ2VuZXJhdGVkQ29kZS5zZWxlY3QoKTtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gICAgICBhbGVydCgn7L2U65Oc6rCAIO2BtOumveuztOuTnOyXkCDrs7XsgqzrkJjsl4jsirXri4jri6QuJyk7XG4gICAgfSk7XG5cbiAgICAvLyDthZztlIzrpr8g7ZWt66qpIOy2lOqwgCDtlajsiJhcbiAgICBmdW5jdGlvbiBhZGRUZW1wbGF0ZUl0ZW0oKSB7XG4gICAgICBjb25zdCB0aXRsZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1UaXRsZScpO1xuICAgICAgY29uc3QgY29udGVudElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1Db250ZW50Jyk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZVR5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVtcGxhdGVUeXBlJykudmFsdWU7XG4gICAgICBjb25zdCB0aXRsZSA9IHRpdGxlSW5wdXQudmFsdWUudHJpbSgpO1xuICAgICAgbGV0IGNvbnRlbnQgPSBjb250ZW50SW5wdXQudmFsdWUudHJpbSgpO1xuICAgICAgbGV0IGxpc3RUeXBlID0gbnVsbDtcblxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2xpc3QnKSB7XG4gICAgICAgIC8vIOumrOyKpO2KuCDsnKDtmJXsnbwg6rK97JqwIOumrOyKpO2KuCDsnKDtmJUg6rCA7KC47Jik6riwXG4gICAgICAgIGxpc3RUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RUeXBlJykudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICd0aXRsZScpIHtcbiAgICAgICAgLy8g7YOA7J207YuAIOycoO2YleydvCDqsr3smrAg64K07JqpIO2VhOuTnCDqsoDsgqwg7IOd6561XG4gICAgICAgIGlmICghdGl0bGUpIHtcbiAgICAgICAgICBhbGVydCgn7KCc66qp7J2EIOyeheugpe2VtOyjvOyEuOyalC4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8g7YOA7J207YuA7J2AIOuCtOyaqeydtCDsl4bslrTrj4Qg65CoXG4gICAgICAgIGNvbnRlbnQgPSBjb250ZW50IHx8ICfrgrTsmqkg7JeG7J2MJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIOuLpOuluCDsnKDtmJXsnbwg6rK97JqwIOygnOuqqeqzvCDrgrTsmqkg66qo65GQIO2VhOyalFxuICAgICAgICBpZiAoIXRpdGxlIHx8ICFjb250ZW50KSB7XG4gICAgICAgICAgYWxlcnQoJ+ygnOuqqeqzvCDrgrTsmqnsnYQg66qo65GQIOyeheugpe2VtOyjvOyEuOyalC4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGVtcGxhdGVJdGVtcy5wdXNoKHtcbiAgICAgICAgdHlwZTogdGVtcGxhdGVUeXBlLFxuICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnQsXG4gICAgICAgIGxpc3RUeXBlOiBsaXN0VHlwZSxcbiAgICAgICAgYnV0dG9uSFRNTDogJycsXG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZVByZXZpZXcoKTtcblxuICAgICAgLy8g7J6F66ClIO2VhOuTnCDstIjquLDtmZRcbiAgICAgIHRpdGxlSW5wdXQudmFsdWUgPSAnJztcbiAgICAgIGNvbnRlbnRJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgdGl0bGVJbnB1dC5mb2N1cygpO1xuICAgIH1cblxuICAgIC8vIO2FnO2UjOumvyDtla3rqqkg7LSI6riw7ZmUIO2VqOyImFxuICAgIGZ1bmN0aW9uIHJlc2V0VGVtcGxhdGVJdGVtcygpIHtcbiAgICAgIGlmICh0ZW1wbGF0ZUl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGVtcGxhdGVJdGVtcy5sZW5ndGggPSAwO1xuICAgICAgICB1cGRhdGVQcmV2aWV3KCk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmF0ZWRDb2RlJykudmFsdWUgPSAnJztcbiAgICAgICAgYWxlcnQoJ+uqqOuToCDtla3rqqnsnbQg7LSI6riw7ZmU65CY7JeI7Iq164uI64ukLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoJ+y0iOq4sO2ZlO2VoCDtla3rqqnsnbQg7JeG7Iq164uI64ukLicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOuvuOumrOuztOq4sCDsl4XrjbDsnbTtirgg7ZWo7IiYXG4gICAgZnVuY3Rpb24gdXBkYXRlUHJldmlldygpIHtcbiAgICAgIGNvbnN0IHByZXZpZXdDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJldmlld0NvbnRhaW5lcicpO1xuICAgICAgY29uc3QgdGVtcGxhdGVUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlbXBsYXRlVHlwZScpLnZhbHVlO1xuXG4gICAgICBsZXQgcHJldmlld0hUTUwgPSAnJztcblxuICAgICAgaWYgKHRlbXBsYXRlSXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHByZXZpZXdDb250YWluZXIuaW5uZXJIVE1MID0gJzxwPuuvuOumrOuztOq4sCDsmIHsl608L3A+JztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKHRlbXBsYXRlVHlwZSkge1xuICAgICAgY2FzZSAndGl0bGUnOlxuICAgICAgICBwcmV2aWV3SFRNTCA9IGdlbmVyYXRlRnVsbFRpdGxlUHJldmlldygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICBwcmV2aWV3SFRNTCA9IGdlbmVyYXRlTGlzdFByZXZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3gnOlxuICAgICAgICBwcmV2aWV3SFRNTCA9IGdlbmVyYXRlQm94UHJldmlldygpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcHJldmlld0NvbnRhaW5lci5pbm5lckhUTUwgPSBwcmV2aWV3SFRNTDtcbiAgICB9XG5cbiAgICAvLyDtg4DsnbTti4Ag66+466as67O06riwIOyDneyEsVxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlRnVsbFRpdGxlUHJldmlldygpIHtcbiAgICAgIGxldCBodG1sID0gJyc7XG5cbiAgICAgIHRlbXBsYXRlSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cInBvbGljeS1pdGVtXCI+JztcbiAgICAgICAgaHRtbCArPSAnPHNwYW4gY2xhc3M9XCJwb2xpY3ktdGl0bGVcIj4nICsgaXRlbS50aXRsZSArICc8L3NwYW4+JztcblxuICAgICAgICAvLyDrgrTsmqnsnbQgJ+uCtOyaqSDsl4bsnYwn7J20IOyVhOuLjCDqsr3smrDsl5Drp4wgcG9saWN5LWNvbnRlbnQg7LaU6rCAXG4gICAgICAgIGlmIChpdGVtLmNvbnRlbnQgJiYgaXRlbS5jb250ZW50ICE9PSAn64K07JqpIOyXhuydjCcpIHtcbiAgICAgICAgICBodG1sICs9ICc8ZGl2IGNsYXNzPVwicG9saWN5LWNvbnRlbnRcIj4nICsgaXRlbS5jb250ZW50ICsgJzwvZGl2Pic7XG4gICAgICAgIH1cbiAgICAgICAgaHRtbCArPSAnPC9kaXY+JztcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICAvLyDrr7jrpqzrs7TquLAg7IOd7ISxXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVMaXN0UHJldmlldygpIHtcbiAgICAgIGxldCBodG1sID0gJyc7XG5cbiAgICAgIHRlbXBsYXRlSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cInBvbGljeS1pdGVtXCI+JztcbiAgICAgICAgaHRtbCArPSAnPHNwYW4gY2xhc3M9XCJwb2xpY3ktdGl0bGVcIj4nICsgaXRlbS50aXRsZSArICc8L3NwYW4+JztcblxuICAgICAgICAvLyDrgrTsmqnsnbQg7J6I64qUIOqyveyasOyXkOunjCBwb2xpY3ktbGlzdCDstpTqsIBcbiAgICAgICAgaWYgKGl0ZW0uY29udGVudCAmJiBpdGVtLmNvbnRlbnQudHJpbSgpKSB7XG4gICAgICAgICAgY29uc3QgbGlzdFR5cGUgPSBpdGVtLmxpc3RUeXBlIHx8ICd1bCc7XG5cbiAgICAgICAgICBpZiAobGlzdFR5cGUgPT09ICdoeXBoZW4nKSB7XG4gICAgICAgICAgICBodG1sICs9ICc8dWwgY2xhc3M9XCJwb2xpY3ktbGlzdCBoeXBoZW4tbGlzdFwiPic7XG4gICAgICAgICAgfSBlbHNlIGlmIChsaXN0VHlwZSA9PT0gJ29sJykge1xuICAgICAgICAgICAgaHRtbCArPSAnPG9sIGNsYXNzPVwicG9saWN5LWxpc3RcIj4nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodG1sICs9ICc8dWwgY2xhc3M9XCJwb2xpY3ktbGlzdFwiPic7ICAvLyDquLDrs7jqsJLsnYAgdWxcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyDspJHssqkg66as7Iqk7Yq4IOyymOumrFxuICAgICAgICAgIGNvbnN0IHByb2Nlc3NOZXN0ZWRMaXN0ID0gKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSAnJztcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgbGluZSA9IGxpbmVzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgICAgaWYgKCFsaW5lKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAvLyDrk6Tsl6zsk7DquLDqsIAg7J6I64qU7KeAIO2ZleyduCAo7YOtIOuYkOuKlCDqs7XrsLEgMuqwnCDsnbTsg4EpXG4gICAgICAgICAgICAgIGNvbnN0IGluZGVudGF0aW9uID0gbGluZXNbaV0ubWF0Y2goL14oXFxzKykvKTtcblxuICAgICAgICAgICAgICBpZiAoaW5kZW50YXRpb24gJiYgKGluZGVudGF0aW9uWzFdLmxlbmd0aCA+PSAyIHx8IGluZGVudGF0aW9uWzFdLmluY2x1ZGVzKCdcXHQnKSkpIHtcbiAgICAgICAgICAgICAgICAvLyDsnbTsoIQg7KSE7J20IOumrOyKpO2KuCDslYTsnbTthZzsnbTrqbQg7KSR7LKpIOumrOyKpO2KuCDsi5zsnpFcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDAgJiYgcmVzdWx0LmVuZHNXaXRoKCc8L2xpPicpKSB7XG4gICAgICAgICAgICAgICAgICAvLyDrp4jsp4Drp4kgPC9saT4g7KCc6rGwXG4gICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuc3Vic3RyaW5nKDAsIHJlc3VsdC5sZW5ndGggLSA1KTtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnPHVsIGNsYXNzPVwibmVzdGVkLWxpc3RcIj4nO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICc8bGk+JyArIHByZXNlcnZlSFRNTFRhZ3MobGluZSkgKyAnPC9saT4nO1xuXG4gICAgICAgICAgICAgICAgICAvLyDri6TsnYwg7KSE64+EIOuTpOyXrOyTsOq4sOqwgCDsnojripTsp4Ag7ZmV7J24XG4gICAgICAgICAgICAgICAgICBsZXQgaiA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPCBsaW5lcy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tqXS50cmltKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tqXS5tYXRjaCgvXihcXHMrKS8pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGxpbmVzW2pdLm1hdGNoKC9eKFxccyspLylbMV0ubGVuZ3RoID49IDIgfHwgbGluZXNbal0ubWF0Y2goL14oXFxzKykvKVsxXS5pbmNsdWRlcygnXFx0JykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnPGxpPicgKyBwcmVzZXJ2ZUhUTUxUYWdzKGxpbmVzW2pdLnRyaW0oKSkgKyAnPC9saT4nO1xuICAgICAgICAgICAgICAgICAgICBqKys7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnPC91bD48L2xpPic7XG4gICAgICAgICAgICAgICAgICBpID0gaiAtIDE7IC8vIOuLpOydjCDrsJjrs7Xsl5DshJwg7LKY66as7ZWgIOyduOuNseyKpCDsobDsoJVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICc8bGk+JyArIHByZXNlcnZlSFRNTFRhZ3MobGluZSkgKyAnPC9saT4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gJzxsaT4nICsgbGluZSArICc8L2xpPic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaHRtbCArPSBwcm9jZXNzTmVzdGVkTGlzdChpdGVtLmNvbnRlbnQpO1xuICAgICAgICAgIGlmIChsaXN0VHlwZSA9PT0gJ29sJykge1xuICAgICAgICAgICAgaHRtbCArPSAnPC9vbD4nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodG1sICs9ICc8L3VsPic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGh0bWwgKz0gJzwvZGl2Pic7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgLy8g66+466as67O06riwIOyDneyEsVxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlQm94UHJldmlldygpIHtcbiAgICAgIGxldCBodG1sID0gJyc7XG5cbiAgICAgIHRlbXBsYXRlSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cInBvbGljeS1pdGVtXCI+JztcbiAgICAgICAgaHRtbCArPSAnPHNwYW4gY2xhc3M9XCJwb2xpY3ktdGl0bGVcIj4nICsgaXRlbS50aXRsZSArICc8L3NwYW4+JztcblxuICAgICAgICAvLyDrgrTsmqnsnbQg7J6I64qUIOqyveyasOyXkOunjCBwb2xpY3ktY29udGVudCDstpTqsIBcbiAgICAgICAgaWYgKGl0ZW0uY29udGVudCAmJiBpdGVtLmNvbnRlbnQudHJpbSgpKSB7XG4gICAgICAgICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cInBvbGljeS1jb250ZW50IGJveC1zdHlsZVwiPicgKyBpdGVtLmNvbnRlbnQgKyAnPC9kaXY+JztcbiAgICAgICAgfVxuICAgICAgICBodG1sICs9ICc8L2Rpdj4nO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIC8vIOy9lOuTnCDsg53shLEg7ZWo7IiYXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVUZW1wbGF0ZUNvZGUoKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZVR5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVtcGxhdGVUeXBlJykudmFsdWU7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRDb2RlRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmF0ZWRDb2RlJyk7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZUl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhbGVydCgn7IOd7ISx7ZWgIO2VreuqqeydtCDsl4bsirXri4jri6QuIO2VreuqqeydhCDrqLzsoIAg7LaU6rCA7ZW07KO87IS47JqULicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBnZW5lcmF0ZWRIVE1MID0gJyc7XG5cbiAgICAgIHN3aXRjaCAodGVtcGxhdGVUeXBlKSB7XG4gICAgICBjYXNlICd0aXRsZSc6XG4gICAgICAgIGdlbmVyYXRlZEhUTUwgPSBnZW5lcmF0ZUZ1bGxUaXRsZUhUTUwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgZ2VuZXJhdGVkSFRNTCA9IGdlbmVyYXRlTGlzdEhUTUwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3gnOlxuICAgICAgICBnZW5lcmF0ZWRIVE1MID0gZ2VuZXJhdGVCb3hIVE1MKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBnZW5lcmF0ZWRDb2RlRWxlbS52YWx1ZSA9IGdlbmVyYXRlZEhUTUw7XG4gICAgfVxuXG4gICAgLy8g7YOA7J207YuAIEhUTUwg7IOd7ISxXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVGdWxsVGl0bGVIVE1MKCkge1xuICAgICAgbGV0IGh0bWwgPSAnJztcblxuICAgICAgdGVtcGxhdGVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBodG1sICs9ICcgIDxkaXYgY2xhc3M9XCJwb2xpY3ktaXRlbVwiPlxcbic7XG4gICAgICAgIGh0bWwgKz0gJyAgICA8c3BhbiBjbGFzcz1cInBvbGljeS10aXRsZVwiPicgKyBpdGVtLnRpdGxlICsgJzwvc3Bhbj5cXG4nO1xuXG4gICAgICAgIC8vIOuCtOyaqeydtCAn64K07JqpIOyXhuydjCfsnbQg7JWE64uMIOqyveyasOyXkOunjCBwb2xpY3ktY29udGVudCDstpTqsIBcbiAgICAgICAgaWYgKGl0ZW0uY29udGVudCAmJiBpdGVtLmNvbnRlbnQgIT09ICfrgrTsmqkg7JeG7J2MJykge1xuICAgICAgICAgIGh0bWwgKz0gJyAgICA8ZGl2IGNsYXNzPVwicG9saWN5LWNvbnRlbnRcIj4nICsgaXRlbS5jb250ZW50ICsgJzwvZGl2Plxcbic7XG4gICAgICAgIH1cblxuICAgICAgICBodG1sICs9ICcgIDwvZGl2Plxcbic7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgLy8gSFRNTCDsg53shLFcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUxpc3RIVE1MKCkge1xuICAgICAgbGV0IGh0bWwgPSAnJztcblxuICAgICAgdGVtcGxhdGVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBodG1sICs9ICcgIDxkaXYgY2xhc3M9XCJwb2xpY3ktaXRlbVwiPlxcbic7XG4gICAgICAgIGh0bWwgKz0gJyAgICA8c3BhbiBjbGFzcz1cInBvbGljeS10aXRsZVwiPicgKyBpdGVtLnRpdGxlICsgJzwvc3Bhbj5cXG4nO1xuXG4gICAgICAgIC8vIOuCtOyaqeydtCDsnojripQg6rK97Jqw7JeQ66eMIHBvbGljeS1saXN0IOy2lOqwgFxuICAgICAgICBpZiAoaXRlbS5jb250ZW50ICYmIGl0ZW0uY29udGVudC50cmltKCkpIHtcbiAgICAgICAgICBjb25zdCBsaXN0VHlwZSA9IGl0ZW0ubGlzdFR5cGUgfHwgJ3VsJztcblxuICAgICAgICAgIGlmIChsaXN0VHlwZSA9PT0gJ2h5cGhlbicpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJyAgICA8dWwgY2xhc3M9XCJwb2xpY3ktbGlzdCBoeXBoZW4tbGlzdFwiPlxcbic7XG4gICAgICAgICAgfSBlbHNlIGlmIChsaXN0VHlwZSA9PT0gJ29sJykge1xuICAgICAgICAgICAgaHRtbCArPSAnICAgIDxvbCBjbGFzcz1cInBvbGljeS1saXN0XCI+XFxuJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHRtbCArPSAnICAgIDx1bCBjbGFzcz1cInBvbGljeS1saXN0XCI+XFxuJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyDspJHssqkg66as7Iqk7Yq4IOyymOumrFxuICAgICAgICAgIGNvbnN0IHByb2Nlc3NOZXN0ZWRMaXN0ID0gKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSAnJztcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgbGluZSA9IGxpbmVzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgICAgaWYgKCFsaW5lKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAvLyDrk6Tsl6zsk7DquLDqsIAg7J6I64qU7KeAIO2ZleyduCAo7YOtIOuYkOuKlCDqs7XrsLEgMuqwnCDsnbTsg4EpXG4gICAgICAgICAgICAgIGNvbnN0IGluZGVudGF0aW9uID0gbGluZXNbaV0ubWF0Y2goL14oXFxzKykvKTtcblxuICAgICAgICAgICAgICBpZiAoaW5kZW50YXRpb24gJiYgKGluZGVudGF0aW9uWzFdLmxlbmd0aCA+PSAyIHx8IGluZGVudGF0aW9uWzFdLmluY2x1ZGVzKCdcXHQnKSkpIHtcbiAgICAgICAgICAgICAgICAvLyDsnbTsoIQg7KSE7J20IOumrOyKpO2KuCDslYTsnbTthZzsnbTrqbQg7KSR7LKpIOumrOyKpO2KuCDsi5zsnpFcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDAgJiYgcmVzdWx0LmVuZHNXaXRoKCc8L2xpPlxcbicpKSB7XG4gICAgICAgICAgICAgICAgICAvLyDrp4jsp4Drp4kgPC9saT4g7KCc6rGwXG4gICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuc3Vic3RyaW5nKDAsIHJlc3VsdC5sZW5ndGggLSA2KTtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnXFxuICAgICAgICA8dWwgY2xhc3M9XCJuZXN0ZWQtbGlzdFwiPlxcbic7XG4gICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJyAgICAgICAgICA8bGk+JyArIHByZXNlcnZlSFRNTFRhZ3MobGluZSkgKyAnPC9saT5cXG4nO1xuXG4gICAgICAgICAgICAgICAgICAvLyDri6TsnYwg7KSE64+EIOuTpOyXrOyTsOq4sOqwgCDsnojripTsp4Ag7ZmV7J24XG4gICAgICAgICAgICAgICAgICBsZXQgaiA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPCBsaW5lcy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tqXS50cmltKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tqXS5tYXRjaCgvXihcXHMrKS8pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGxpbmVzW2pdLm1hdGNoKC9eKFxccyspLylbMV0ubGVuZ3RoID49IDIgfHwgbGluZXNbal0ubWF0Y2goL14oXFxzKykvKVsxXS5pbmNsdWRlcygnXFx0JykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnICAgICAgICAgIDxsaT4nICsgcHJlc2VydmVIVE1MVGFncyhsaW5lc1tqXS50cmltKCkpICsgJzwvbGk+XFxuJztcbiAgICAgICAgICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJyAgICAgICAgPC91bD5cXG4gICAgICA8L2xpPlxcbic7XG4gICAgICAgICAgICAgICAgICBpID0gaiAtIDE7IC8vIOuLpOydjCDrsJjrs7Xsl5DshJwg7LKY66as7ZWgIOyduOuNseyKpCDsobDsoJVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgICAgICA8bGk+JyArIGxpbmUgKyAnPC9saT5cXG4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gJyAgICAgIDxsaT4nICsgbGluZSArICc8L2xpPlxcbic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaHRtbCArPSBwcm9jZXNzTmVzdGVkTGlzdChpdGVtLmNvbnRlbnQpO1xuICAgICAgICAgIGlmIChsaXN0VHlwZSA9PT0gJ29sJykge1xuICAgICAgICAgICAgaHRtbCArPSAnICAgIDwvb2w+XFxuJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHRtbCArPSAnICAgIDwvdWw+XFxuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5idXR0b25IVE1MKSB7XG4gICAgICAgICAgaHRtbCArPSAnICAgICcgKyBpdGVtLmJ1dHRvbkhUTUwgKyAnXFxuJztcbiAgICAgICAgfVxuXG4gICAgICAgIGh0bWwgKz0gJyAgPC9kaXY+XFxuJztcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICAvLyBIVE1MIOyDneyEsVxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlQm94SFRNTCgpIHtcbiAgICAgIGxldCBodG1sID0gJyc7XG5cbiAgICAgIHRlbXBsYXRlSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaHRtbCArPSAnICA8ZGl2IGNsYXNzPVwicG9saWN5LWl0ZW1cIj5cXG4nO1xuICAgICAgICBodG1sICs9ICcgICAgPHNwYW4gY2xhc3M9XCJwb2xpY3ktdGl0bGVcIj4nICsgaXRlbS50aXRsZSArICc8L3NwYW4+XFxuJztcblxuICAgICAgICAvLyDrgrTsmqnsnbQg7J6I64qUIOqyveyasOyXkOunjCBwb2xpY3ktY29udGVudCDstpTqsIBcbiAgICAgICAgaWYgKGl0ZW0uY29udGVudCAmJiBpdGVtLmNvbnRlbnQudHJpbSgpKSB7XG4gICAgICAgICAgaHRtbCArPSAnICAgIDxkaXYgY2xhc3M9XCJwb2xpY3ktY29udGVudCBib3gtc3R5bGVcIj4nICsgaXRlbS5jb250ZW50ICsgJzwvZGl2Plxcbic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5idXR0b25IVE1MKSB7XG4gICAgICAgICAgaHRtbCArPSAnICAgICcgKyBpdGVtLmJ1dHRvbkhUTUwgKyAnXFxuJztcbiAgICAgICAgfVxuXG4gICAgICAgIGh0bWwgKz0gJyAgPC9kaXY+XFxuJztcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICAvLyDtg4DsnoUg67OA6rK9IOydtOuypO2KuFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wbGF0ZVR5cGUnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlVHlwZSA9IHRoaXMudmFsdWU7XG4gICAgICBjb25zdCBjb250ZW50R3JvdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtZ3JvdXA6bnRoLWNoaWxkKDIpJyk7XG5cbiAgICAgIC8vIO2DgOydtO2LgCDsnKDtmJXsnbwg6rK97JqwIOuCtOyaqSDsnoXroKXrnoAg7Iio6riw6riwXG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAndGl0bGUnKSB7XG4gICAgICAgIGNvbnRlbnRHcm91cC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGVudEdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGVQcmV2aWV3KCk7XG4gICAgfSk7XG5cbiAgICAvLyDri6jstpXtgqQg7J2067Kk7Yq4IOumrOyKpOuEiOuKlCDsoITsl63snLzroZwg7J2064+Z7ZaI7Jy864uIIOyXrOq4sOyEnOuKlCDsgq3soJxcbiAgfVxuXG4gIC8vIO2FnO2UjOumvyDsnKDtmJXrs4Qg7JiI7IucIOy2lOqwgFxuICBmdW5jdGlvbiBhZGRUZW1wbGF0ZUV4YW1wbGVzKCkge1xuICAgIGNvbnN0IHRlbXBsYXRlVHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wbGF0ZVR5cGUnKTtcblxuICAgIC8vIOy0iOq4sCDsmIjsi5wg7ISk7KCVICjquLDrs7gg7YOA7J207YuAKVxuICAgIHRlbXBsYXRlVHlwZS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xuICB9XG5cbiAgLy8g7KCE7JetIOuzgOyImOuhnCDrqqjri6wg7KCR6re87ZWgIOyImCDsnojrj4TroZ0g7ISk7KCVXG4gIGxldCBwcml2YWN5UG9saWN5TW9kYWw7XG4gIGxldCB0ZW1wbGF0ZUl0ZW1zID0gW107XG5cbiAgLy8g66qo64usIOyXtOq4sCDtlajsiJggLSDsoITsl60g7Iqk7L2U7ZSE66GcIOydtOuPmVxuICBmdW5jdGlvbiBvcGVuUHJpdmFjeVBvbGljeU1vZGFsKCkge1xuICAgIGlmICghcHJpdmFjeVBvbGljeU1vZGFsKSB7XG4gICAgICBpbml0UHJpdmFjeVBvbGljeU1vZGFsKCk7XG4gICAgICBwcml2YWN5UG9saWN5TW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJpdmFjeVBvbGljeU1vZGFsJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kYWxEaW1tID0gcHJpdmFjeVBvbGljeU1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kaW1tJyk7XG4gICAgY29uc3QgbW9kYWxDb250YWluZXIgPSBwcml2YWN5UG9saWN5TW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWNvbnRhaW5lcicpO1xuXG4gICAgcHJpdmFjeVBvbGljeU1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIG1vZGFsRGltbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICB9XG5cbiAgLy8g64uo7LaV7YKkIOydtOuypO2KuCDrpqzsiqTrhIggLSDsoITsl60g7Iqk7L2U7ZSE66GcIOydtOuPmVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAvLyBBbHQgKyBQOiDtjJ3sl4Ug7Je06riwXG4gICAgaWYgKGUuYWx0S2V5ICYmIGUua2V5ID09PSAncCcpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG9wZW5Qcml2YWN5UG9saWN5TW9kYWwoKTtcbiAgICB9XG5cbiAgICAvLyDrqqjri6zsnbQg7Je066Ck7J6I7J2EIOuVjOunjCDri6Trpbgg64uo7LaV7YKkIO2ZnOyEse2ZlFxuICAgIGlmIChwcml2YWN5UG9saWN5TW9kYWwgJiYgcHJpdmFjeVBvbGljeU1vZGFsLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jaycpIHtcbiAgICAgIC8vIEFsdCArIEc6IOuvuOumrCDrs7TquLAg67CPIOy9lOuTnCDsg53shLFcbiAgICAgIGlmIChlLmFsdEtleSAmJiBlLmtleSA9PT0gJ2cnKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgYWRkSXRlbUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRJdGVtJyk7XG4gICAgICAgIGlmIChhZGRJdGVtQnRuKSBhZGRJdGVtQnRuLmNsaWNrKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFsdCArIEM6IOy0iOq4sO2ZlFxuICAgICAgaWYgKGUuYWx0S2V5ICYmIGUua2V5ID09PSAnYycpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBkZWxldGVJdGVtQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZUl0ZW0nKTtcbiAgICAgICAgaWYgKGRlbGV0ZUl0ZW1CdG4pIGRlbGV0ZUl0ZW1CdG4uY2xpY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIERPTeydtCDroZzrk5zrkJwg7ZuEIOy0iOq4sO2ZlFxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgaW5pdFByaXZhY3lQb2xpY3lNb2RhbCgpO1xuICAgIGFkZFRlbXBsYXRlRXhhbXBsZXMoKTtcbiAgICBwcml2YWN5UG9saWN5TW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJpdmFjeVBvbGljeU1vZGFsJyk7XG4gICAgc2V0dXBGb3JtYXR0aW5nVG9vbGJhcigpOyAvLyDshJzsi50g7Yi067CUIOy0iOq4sO2ZlFxuICB9KTtcbn0pKCk7XG4iLCJmdW5jdGlvbiBzZWxlY3RCb3hUbXBsKCkge1xuICBjb25zdCAkdGVtcGxhdGVDdXN0b21IVE1MID0ge1xuICAgIGxhYmVsKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgaWQ9XCJjb21ibzEtbGFiZWxcIiBjbGFzcz1cImNvbWJvLWxhYmVsXCI+JHt0ZXh0fTwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIHNlbGVjdEJ0bih0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJjb21ibzFcIiBjbGFzcz1cInNlbGVjdC1ib3hcIiByb2xlPVwiY29tYm9ib3hcIiBhcmlhLWNvbnRyb2xzPVwibGlzdGJveDFcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWxhYmVsbGVkYnk9XCJjb21ibzEtbGFiZWxcIiBhcmlhLWFjdGl2ZWRlc2NlbmRhbnQ9XCJcIj5cbiAgICAgICAgPHNwYW4gc3R5bGU9XCJwb2ludGVyLWV2ZW50czogbm9uZTtcIj4ke3RleHR9PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXNXcmFwKGl0ZW1zSFRNTCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPHVsIGlkPVwibGlzdGJveDFcIiBjbGFzcz1cInNlbGVjdC1vcHRpb25zXCIgcm9sZT1cImxpc3Rib3hcIiBhcmlhLWxhYmVsbGVkYnk9XCJjb21ibzEtbGFiZWxcIiB0YWJpbmRleD1cIi0xXCI+XG4gICAgICAgICAgJHtpdGVtc0hUTUx9XG4gICAgICAgIDwvdWw+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXMoaXRlbSwgc2VsZWN0ZWQgPSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGxpIHJvbGU9XCJvcHRpb25cIiBjbGFzcz1cIm9wdGlvblwiIGFyaWEtc2VsZWN0ZWQ9XCIke3NlbGVjdGVkfVwiIGRhdGEtdmFsdWU9XCIke2l0ZW0udmFsdWV9XCI+XG4gICAgICAgICAgJHtpdGVtLnRleHR9XG4gICAgICAgIDwvbGk+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgJHRlbXBsYXRlQmFzaWNIVE1MID0ge1xuICAgIGxhYmVsKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgaWQ9XCJjb21ibzEtbGFiZWxcIiBjbGFzcz1cImNvbWJvLWxhYmVsXCI+JHt0ZXh0fTwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIHNlbGVjdEJ0bih0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCIgc2VsZWN0ZWQgZGlzYWJsZWQgaGlkZGVuPiR7dGV4dH08L29wdGlvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtc1dyYXAoaXRlbXNIVE1MKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8c2VsZWN0IGNsYXNzPVwic2VsZWN0LWxpc3RcIiByZXF1aXJlZD5cbiAgICAgICAgICAke2l0ZW1zSFRNTH1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXMoaXRlbSwgc2VsZWN0ZWQgPSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIiR7aXRlbS52YWx1ZX1cIj4ke2l0ZW0udGV4dH08L29wdGlvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4ge1xuICAgICR0ZW1wbGF0ZUN1c3RvbUhUTUwsXG4gICAgJHRlbXBsYXRlQmFzaWNIVE1MLFxuICB9O1xufVxuIiwiZnVuY3Rpb24gc3dpcGVyVG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9IHtcbiAgICBuYXZpZ2F0aW9uKGNsYXNzTmFtZSA9ICcnKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLW5hdmlnYXRpb24gJHtjbGFzc05hbWV9XCI+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLXByZXZcIj48c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+JHtldFVJLiR0KCdzd2lwZXIubmF2aWdhdGlvbi5wcmV2JywgJ+ydtOyghCDsiqzrnbzsnbTrk5wnKX08L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLW5leHRcIj48c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+JHtldFVJLiR0KCdzd2lwZXIubmF2aWdhdGlvbi5uZXh0JywgJ+uLpOydjCDsiqzrnbzsnbTrk5wnKX08L3NwYW4+PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIHBhZ2luYXRpb24oY2xhc3NOYW1lID0gJycpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItcGFnaW5hdGlvbiAke2NsYXNzTmFtZX1cIj48L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBhdXRvcGxheSgpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItYXV0b3BsYXktd3JhcFwiPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWF1dG9wbGF5IHBsYXlcIj48c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+JHtldFVJLiR0KCdzd2lwZXIuYXV0b3BsYXkuc3RvcCcsICfsoJXsp4AnKX08L3NwYW4+PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIHN3aXBlckNvbnRyb2xzKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1jb250cm9sc1wiPjwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIHByZXZFbChjbGFzc05hbWUgPSBudWxsKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1uYXZpZ2F0aW9uICR7Y2xhc3NOYW1lfVwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInN3aXBlci1idXR0b24tcHJldlwiPjxzcGFuIGNsYXNzPVwiaGlkZS10eHRcIj4ke2V0VUkuJHQoJ3N3aXBlci5uYXZpZ2F0aW9uLnByZXYnLCAn7J207KCEIOyKrOudvOydtOuTnCcpfTwvc3Bhbj48L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIG5leHRFbChjbGFzc05hbWUgPSBudWxsKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1uYXZpZ2F0aW9uICR7Y2xhc3NOYW1lfVwiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInN3aXBlci1idXR0b24tbmV4dFwiPjxzcGFuIGNsYXNzPVwiaGlkZS10eHRcIj4ke2V0VUkuJHQoJ3N3aXBlci5uYXZpZ2F0aW9uLm5leHQnLCAn64uk7J2MIOyKrOudvOydtOuTnCcpfTwvc3Bhbj48L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlSFRNTCxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHRvYXN0VG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9ICh7IG1lc3NhZ2UgfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9hc3QtY29udGVudFwiPlxuICAgICAgICAgIDxwIGNsYXNzPVwidG9hc3QtdHh0XCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuICBjb25zdCAkdGVtcGxhdENsb3NlSFRNTCA9ICh7IG1lc3NhZ2UsIGNsb3NlVGV4dCB9KSA9PiBgXG4gICAgICA8ZGl2IGNsYXNzPVwidG9hc3QtY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdC1jb250ZW50XCI+XG4gICAgICAgICAgPHAgY2xhc3M9XCJ0b2FzdC10eHRcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJ0b2FzdC1jbG9zZS1idG5cIj4ke2Nsb3NlVGV4dH08c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+7Yyd7JeFIOuLq+q4sDwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gIGNvbnN0ICR0ZW1wbGF0ZUxpbmtIVE1MID0gKHsgbWVzc2FnZSwgbGluayB9KSA9PiBgXG4gICAgICA8ZGl2IGNsYXNzPVwidG9hc3QtY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdC1jb250ZW50XCI+XG4gICAgICAgICAgPHAgY2xhc3M9XCJ0b2FzdC10eHRcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICAgIDxhIGhyZWY9XCIke2xpbmt9XCIgY2xhc3M9XCJ0b2FzdC1saW5rLWJ0blwiPuunge2BrDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlSFRNTCxcbiAgICAkdGVtcGxhdENsb3NlSFRNTCxcbiAgICAkdGVtcGxhdGVMaW5rSFRNTFxuICB9O1xufVxuIl19
