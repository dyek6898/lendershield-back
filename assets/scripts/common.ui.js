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
    document.documentElement.style.overflow = 'hidden';
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
    document.documentElement.style.overflow = null;

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

      if (props.type === 'separate' || props.type === 'single') {
        if ($collapse.dataset.state === 'open') {
          // 안전하게 open 함수 호출
          try {
            open(i);
          } catch (error) {
            console.warn('Failed to open accordion item:', error);
          }
        }
      }

      return collapse;
    });

    if (state.index > -1) {
      setState({ index: state.index }, { immediate: true });
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
        if (!$item || !$item.ui) {
          console.warn('Accordion item or UI not initialized:', i);
          return;
        }
        
        if (i !== index) {
          if ($item.ui.core && $item.ui.core.state && $item.ui.core.state.state === 'open') {
            $item.ui.close(immediate);
          }
        } else {
          $item.ui.open(immediate);
        }
      });
    } else {
      if (index !== -1 && $accordionItems[index] && $accordionItems[index].ui) {
        $accordionItems[index].ui.open(immediate);
      } else if (index !== -1) {
        console.warn('Accordion item or UI not initialized for index:', index);
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
}
;


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
    focusTrapInstance = focusTrap.createFocusTrap($target, {
      escapeDeactivates: props.esc,
      onActivate: actions.focusActivate,
      onDeactivate: actions.focusDeactivate,
      allowOutsideClick: props.clickOutside ? true : false,
    });

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

    actions.focusActivate = () => {};

    actions.focusDeactivate = () => {
      close();
    };

    actions.open = () => {
      $target.style.display = 'block';

      setLayerOpacity(DIMM_OPACITY);
      enableScrollLock();

      if ($modalDimm) gsap.timeline().to($modalDimm, {duration: 0, display: 'block', opacity: 0}).to($modalDimm, { duration: 0.15, opacity: 1 });

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
      focusTrapInstance.activate();
    } else {
      actions.close();
      focusTrapInstance.deactivate();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwidXRpbHMvYXJyYXkuanMiLCJ1dGlscy9ib29sZWFuLmpzIiwidXRpbHMvZGF0ZS5qcyIsInV0aWxzL2RvbS5qcyIsInV0aWxzL2ZuLmpzIiwidXRpbHMvbWF0aC5qcyIsInV0aWxzL29iamVjdC5qcyIsInV0aWxzL3N0cmluZy5qcyIsInV0aWxzL2luZGV4LmNqcyIsImhvb2tzL3VzZUExMXlLZXlFdmVudC5qcyIsImhvb2tzL3VzZUNsaWNrT3V0c2lkZS5qcyIsImhvb2tzL3VzZUNvcmUuanMiLCJob29rcy91c2VEYXRhc2V0LmpzIiwiaG9va3MvdXNlRGlhbG9nLmpzIiwiaG9va3MvdXNlRGlhbG9nVG1wbC5qcyIsImhvb2tzL3VzZUV2ZW50TGlzdGVuZXIuanMiLCJob29rcy91c2VHZXRDbGllbnRSZWN0LmpzIiwiaG9va3MvdXNlTGF5ZXIuanMiLCJob29rcy91c2VNZWRpYVF1ZXJ5LmpzIiwiaG9va3MvdXNlTXV0YXRpb25TdGF0ZS5qcyIsImhvb2tzL3VzZVNlbGVjdEJveFRtcGwuanMiLCJob29rcy91c2VTdGF0ZS5qcyIsImhvb2tzL3VzZVN3aXBlclRtcGwuanMiLCJob29rcy91c2VUcmFuc2l0aW9uLmpzIiwiaG9va3MvaW5kZXguY2pzIiwiY29tcG9uZW50cy9BY2NvcmRpb24uanMiLCJjb21wb25lbnRzL0NvbGxhcHNlLmpzIiwiY29tcG9uZW50cy9EYXRlcGlja2VyQ29tcC5qcyIsImNvbXBvbmVudHMvRGlhbG9nLmpzIiwiY29tcG9uZW50cy9JbnB1dC5qcyIsImNvbXBvbmVudHMvTG90dGllLmpzIiwiY29tcG9uZW50cy9Nb2RhbC5qcyIsImNvbXBvbmVudHMvU2VsZWN0Ym94LmpzIiwiY29tcG9uZW50cy9Td2lwZXIuanMiLCJjb21wb25lbnRzL1RhYi5qcyIsImNvbXBvbmVudHMvVG9hc3QuanMiLCJjb21wb25lbnRzL1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL2luZGV4LmNqcyIsImluaXQuanMiLCJ0ZW1wbGF0ZXMvZGlhbG9nVG1wbC5qcyIsInRlbXBsYXRlcy9pbmRleC5janMiLCJ0ZW1wbGF0ZXMvaW5wdXRUbXBsLmpzIiwidGVtcGxhdGVzL3ByaXZhY3lfcG9saWN5X3RlbXBsYXRlLmpzIiwidGVtcGxhdGVzL3NlbGVjdEJveFRtcGwuanMiLCJ0ZW1wbGF0ZXMvc3dpcGVyVG1wbC5qcyIsInRlbXBsYXRlcy90b2FzdFRtcGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakJBO0FBQ0E7OztBQ0RBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDL1VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxZ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFzc2V0cy9zY3JpcHRzL2NvbW1vbi51aS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGV0VUkgPSB7fTtcbi8vIGNvbmZpZ1xuZXRVSS5jb25maWcgPSB7XG4gIG1lZGlhOiB7XG4gICAgbmFtZXM6IFsnaXNNb2JpbGUnLCAnaXNEZXNrdG9wJ10sXG4gICAgcG9pbnRzOiBbMTAyM10sXG4gIH0sXG4gIGFuaW1hdGlvbjoge1xuICAgIGR1cmF0aW9uOiAwLjQsXG4gICAgc3RhZ2dlcjogMC4xLFxuICAgIGVhc2luZzogJ1Bvd2VyMi5lYXNlT3V0JyxcbiAgfSxcbiAgbGF5ZXI6IHtcbiAgICBkaW1tT3BhY2l0eTogMC42LFxuICB9LFxuICBpbml0RGVmYXVsdCgpIHtcbiAgICBnc2FwLmRlZmF1bHRzKHtcbiAgICAgIGVhc2U6IHRoaXMuYW5pbWF0aW9uLmVhc2luZyxcbiAgICAgIGR1cmF0aW9uOiB0aGlzLmFuaW1hdGlvbi5kdXJhdGlvbixcbiAgICB9KTtcbiAgfSxcbiAgbGVuaXM6IHtcbiAgICBlbmFibGU6IGZhbHNlLFxuICAgIG9wdGlvbnM6IHt9LFxuICAgIHNwZWVkOiAyMDAwLFxuICAgIGxhZ1Ntb290aGluZzogMCxcbiAgfSxcbiAgbG9jYWxlOiB7XG4gICAgZGVmYXVsdDogJ2tvJyxcbiAgfSxcbiAgbG90dGllOiB7XG4gICAgYmFzZVBhdGg6IGxvY2F0aW9uLnBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9wLycpID8gJy9wL2Fzc2V0cy9pbWFnZXMvbG90dGllJyA6ICcvYXNzZXRzL2ltYWdlcy9sb3R0aWUnLFxuICB9LFxufTtcbmV0VUkuY29uZmlnLmluaXREZWZhdWx0KCk7XG5cbi8vIHBhZ2VzXG5ldFVJLnBhZ2VzID0ge307XG5cbmV0VUkubG9jYWxlcyA9IHt9O1xuZXRVSS5sb2NhbGVzLmtvID0ge1xuICBpbnB1dDoge1xuICAgIHBhc3N3b3JkX2hpZGU6ICfruYTrsIDrsojtmLgg7Iio6riw6riwJyxcbiAgICBwYXNzd29yZF9zaG93OiAn67mE67CA67KI7Zi4IO2RnOyLnCcsXG4gICAgY2xlYXI6ICfrgrTsmqkg7KeA7Jqw6riwJyxcbiAgfSxcbiAgc3dpcGVyOiB7XG4gICAgbmF2aWdhdGlvbjoge1xuICAgICAgcHJldjogJ+ydtOyghCDsiqzrnbzsnbTrk5wnLFxuICAgICAgbmV4dDogJ+uLpOydjCDsiqzrnbzsnbTrk5wnLFxuICAgIH0sXG4gICAgcGFnaW5hdGlvbjoge1xuICAgICAgcGFnZTogJ+2OmOydtOyngCcsXG4gICAgfSxcbiAgICBhdXRvcGxheToge1xuICAgICAgcGxheTogJ+yerOyDnScsXG4gICAgICBwYXVzZTogJ+ygleyngCcsXG4gICAgfSxcbiAgfSxcbiAgZGlhbG9nOiB7XG4gICAgcG9zaXRpdmU6ICftmZXsnbgnLFxuICAgIG5lZ2F0aXZlOiAn7Leo7IaMJyxcbiAgfSxcbn07XG5cbmV0VUkuJHQgPSBmdW5jdGlvbiAoa2V5LCBkZWZhdWx0VGV4dCA9ICcnKSB7XG4gIGNvbnN0IGxvY2FsZSA9IGV0VUkubG9jYWxlc1tldFVJLmNvbmZpZy5sb2NhbGUuZGVmYXVsdF07XG4gIHJldHVybiBldFVJLnV0aWxzLmdldFZhbHVlRnJvbU5lc3RlZE9iamVjdChsb2NhbGUsIGtleSkgfHwgZGVmYXVsdFRleHQ7XG59O1xuXG53aW5kb3cuZXRVSSA9IGV0VUk7XG4iLCIvKipcbiAqIENoZWNrIGlmIHRoZSB2YWx1ZSBpcyBhbiBhcnJheVxuICogQHBhcmFtIHZhbHVlIHthbnl9XG4gKiBAcmV0dXJucyB7YXJnIGlzIGFueVtdfVxuICovXG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cblxuXG4vKipcbiAqIOyEpOuqhVxuICogQHBhcmFtIGNsZWFudXBzICB7ZnVuY3Rpb25bXX1cbiAqL1xuZnVuY3Rpb24gYWxsQ2xlYW51cHMoY2xlYW51cHMpIHtcbiAgY2xlYW51cHMuZm9yRWFjaCgoY2xlYW51cCkgPT4gY2xlYW51cCgpKTtcbn1cbiIsIi8vIGJvb2xlYW4g6rSA66CoIOq4sOuKpVxuIiwiLy8g64Kg7KecIOq0gOugqCDquLDriqVcbiIsIi8qKlxuICogc2V0IGF0dHJpYnV0ZVxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxuICogQHBhcmFtIG9wdHNcbiAqL1xuZnVuY3Rpb24gc2V0UHJvcGVydHkocGFyZW50LCAuLi5vcHRzKSB7XG4gIGlmIChvcHRzLmxlbmd0aCA9PT0gMikge1xuICAgIGNvbnN0IFtwcm9wZXJ0eSwgdmFsdWVdID0gb3B0cztcblxuICAgIHBhcmVudD8uc2V0QXR0cmlidXRlKHByb3BlcnR5LCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAob3B0cy5sZW5ndGggPT09IDMpIHtcbiAgICBjb25zdCBbc2VsZWN0b3IsIHByb3BlcnR5LCB2YWx1ZV0gPSBvcHRzO1xuXG4gICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5zZXRBdHRyaWJ1dGUocHJvcGVydHksIHZhbHVlKTtcbiAgfVxufVxuXG4vKipcbiAqIGdldCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7IEVsZW1lbnQgfSBwYXJlbnRcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBwcm9wZXJ0eVxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eShwYXJlbnQsIHNlbGVjdG9yLCBwcm9wZXJ0eSkge1xuICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik/LmdldEF0dHJpYnV0ZShwcm9wZXJ0eSk7XG59XG5cbi8qKlxuICogc2V0IHN0eWxlXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XG4gKiBAcGFyYW0geyBTdHJpbmcgfSBzZWxlY3RvclxuICogQHBhcmFtIHsgU3RyaW5nIH0gcHJvcGVydHlcbiAqIEBwYXJhbSB7IGFueSB9IHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHNldFN0eWxlKHBhcmVudCwgc2VsZWN0b3IsIHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAocGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLnN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICB9XG59XG5cbi8qKlxuICogZ3NhcOydmCBTcGxpdFRleHTrpbwg7Zmc7Jqp7ZWY7JesIOusuOyekOulvCDrtoTrpqztlZjsl6wg66eI7Iqk7YGsIOqwgOuKpe2VmOqyjCDtlbTspIDri6QuXG4gKiBAcGFyYW0gc2VsZWN0b3IgIHtzdHJpbmd9XG4gKiBAcGFyYW0gdHlwZSAgeydsaW5lcyd8J3dvcmRzJ3wnY2hhcnMnfVxuICogQHJldHVybnMgW0hUTUxFbGVtZW50W10sIEhUTUxFbGVtZW50W11dXG4gKi9cbmZ1bmN0aW9uIHNwbGl0VGV4dE1hc2soc2VsZWN0b3IsIHR5cGUgPSAnbGluZXMnLCBpc092ZXJmbG93ID0gdHJ1ZSkge1xuICBsZXQgJHF1b3RlO1xuXG4gIGZ1bmN0aW9uIHdyYXAoZWwsIHdyYXBwZXIpIHtcbiAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBlbCk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XG4gIH1cblxuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSBTdHJpbmcpIHtcbiAgICAkcXVvdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICAkcXVvdGUgPSBzZWxlY3RvcjtcbiAgfVxuICAvLyBjb25zdCAkcXVvdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSxcblxuICBjb25zdCBteVNwbGl0VGV4dCA9IG5ldyBTcGxpdFRleHQoJHF1b3RlLCB7IHR5cGUgfSk7XG5cbiAgY29uc3QgJHNwbGl0dGVkID0gbXlTcGxpdFRleHRbdHlwZV07XG4gIGNvbnN0ICRsaW5lV3JhcCA9IFtdO1xuICAkc3BsaXR0ZWQuZm9yRWFjaCgoJGVsLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0ICRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpZiAoaXNPdmVyZmxvdykge1xuICAgICAgJGRpdi5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIH1cbiAgICAkZGl2LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAvLyAkZGl2LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICRkaXYuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgICRkaXYuY2xhc3NMaXN0LmFkZCgnc3BsaXQtdGV4dC13cmFwJyk7XG4gICAgd3JhcCgkZWwsICRkaXYpO1xuICAgICRsaW5lV3JhcC5wdXNoKCRkaXYpO1xuICB9KTtcblxuICByZXR1cm4gWyRzcGxpdHRlZCwgJGxpbmVXcmFwXTtcbn1cblxuZnVuY3Rpb24gc3BsaXRUZXh0TWFza0Jsb2NrKHNlbGVjdG9yLCB0eXBlID0gJ2xpbmVzJywgaXNPdmVyZmxvdyA9IHRydWUpIHtcbiAgbGV0ICRxdW90ZTtcblxuICBmdW5jdGlvbiB3cmFwKGVsLCB3cmFwcGVyKSB7XG4gICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUod3JhcHBlciwgZWwpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZWwpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycpIHtcbiAgICAkcXVvdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICAkcXVvdGUgPSBzZWxlY3RvcjtcbiAgfVxuICAvLyBjb25zdCAkcXVvdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSxcbiAgaWYgKFsuLi4kcXVvdGUuY2hpbGRyZW5dLnNvbWUoKGVsKSA9PiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ3NwbGl0LXRleHQtd3JhcCcpKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG15U3BsaXRUZXh0ID0gbmV3IFNwbGl0VGV4dCgkcXVvdGUsIHsgdHlwZSB9KTtcblxuICBjb25zdCAkc3BsaXR0ZWQgPSBteVNwbGl0VGV4dFt0eXBlXTtcbiAgY29uc3QgJGxpbmVXcmFwID0gW107XG4gICRzcGxpdHRlZC5mb3JFYWNoKCgkZWwsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgJGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGlmIChpc092ZXJmbG93KSB7XG4gICAgICAkZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgfVxuICAgICRkaXYuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICRkaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgJGRpdi5jbGFzc0xpc3QuYWRkKCdzcGxpdC10ZXh0LXdyYXAnKTtcbiAgICB3cmFwKCRlbCwgJGRpdik7XG4gICAgJGxpbmVXcmFwLnB1c2goJGRpdik7XG4gIH0pO1xuXG4gIHJldHVybiBbJHNwbGl0dGVkLCAkbGluZVdyYXBdO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gZWwgIHtzdHJpbmd8SFRNTEVsZW1lbnR9XG4gKiBAcmV0dXJucyB7Tm9kZX1cbiAqL1xuZnVuY3Rpb24gd3JhcE1hc2soZWwpIHtcbiAgY29uc3QgJGVsID0gZXRVSS51dGlscy5zZWxlY3RvclN0cmluZ1RvRWxlbWVudChlbCk7XG4gIGlmICgkZWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3VpLW1hc2snKSkge1xuICAgIHJldHVybiAkZWwucGFyZW50Tm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAoZWwsIHdyYXBwZXIpIHtcbiAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBlbCk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XG4gIH1cblxuICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCRlbCk7XG4gIGNvbnN0ICRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgJGRpdi5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAkZGl2LnN0eWxlLnBvc2l0aW9uID0gc3R5bGUucG9zaXRpb24gfHwgbnVsbDtcbiAgaWYgKHN0eWxlLnBvc2l0aW9uID09PSAnYWJzb2x1dGUnIHx8IHN0eWxlLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgJGRpdi5zdHlsZS50b3AgPSBzdHlsZS50b3A7XG4gICAgJGRpdi5zdHlsZS5sZWZ0ID0gc3R5bGUubGVmdDtcbiAgICAkZGl2LnN0eWxlLnJpZ2h0ID0gc3R5bGUucmlnaHQ7XG4gICAgJGRpdi5zdHlsZS5ib3R0b20gPSBzdHlsZS5ib3R0b207XG5cbiAgICAkZWwuc3R5bGUudG9wID0gMDtcbiAgICAkZWwuc3R5bGUubGVmdCA9IDA7XG4gICAgJGVsLnN0eWxlLnJpZ2h0ID0gMDtcbiAgICAkZWwuc3R5bGUuYm90dG9tID0gMDtcbiAgfVxuICAkZGl2LnN0eWxlLmRpc3BsYXkgPSBzdHlsZS5kaXNwbGF5IHx8IG51bGw7XG4gICRkaXYuY2xhc3NMaXN0LmFkZCgndWktbWFzaycpO1xuICB3cmFwKCRlbCwgJGRpdik7XG5cbiAgcmV0dXJuICRkaXY7XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gc2V0RG9jSGVpZ2h0KCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jykuc3R5bGUuc2V0UHJvcGVydHkoJy0tZG9jLWhlaWdodCcsIHdpbmRvdy5pbm5lckhlaWdodCArICdweCcpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykuZGF0YXNldC5kb2NIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBhcnJCcmVha1BvaW50TmFtZVxuICogQHBhcmFtIGFyckJyZWFrUG9pbnRcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZnVuY3Rpb24gZ2V0TWVkaWFRdWVyeUNvbmRpdGlvbihhcnJCcmVha1BvaW50TmFtZSwgYXJyQnJlYWtQb2ludCkge1xuICBpZiAoYXJyQnJlYWtQb2ludE5hbWUubGVuZ3RoICE9PSBhcnJCcmVha1BvaW50Lmxlbmd0aCArIDEpIHtcbiAgICBjb25zb2xlLmVycm9yKCdhcnJCcmVha1BvaW50TmFtZS5sZW5ndGggIT09IGFyckJyZWFrUG9pbnQubGVuZ3RoICsgMScpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG1lZGlhUXVlcnlDb25kaXRpb24gPSB7fTtcblxuICBjb25zdCBhcnIgPSBbXSxcbiAgICBsZW5ndGggPSBhcnJCcmVha1BvaW50Lmxlbmd0aDtcbiAgYXJyLnB1c2goYChtYXgtd2lkdGg6ICR7YXJyQnJlYWtQb2ludFswXSAtIDF9cHgpYCk7XG5cbiAgbmV3IEFycmF5KGxlbmd0aCAtIDEpLmZpbGwoMCkuZm9yRWFjaCgoXywgaW5kZXgpID0+IHtcbiAgICBhcnIucHVzaChgKG1pbi13aWR0aDogJHthcnJCcmVha1BvaW50W2luZGV4XX1weCkgYW5kIChtYXgtd2lkdGg6ICR7YXJyQnJlYWtQb2ludFtpbmRleCArIDFdIC0gMX1weClgKTtcbiAgfSk7XG5cbiAgYXJyLnB1c2goYChtaW4td2lkdGg6ICR7YXJyQnJlYWtQb2ludFtsZW5ndGggLSAxXX1weClgKTtcblxuICBhcnJCcmVha1BvaW50TmFtZS5mb3JFYWNoKChuYW1lLCBpbmRleCkgPT4ge1xuICAgIG1lZGlhUXVlcnlDb25kaXRpb25bbmFtZV0gPSBhcnJbaW5kZXhdO1xuICB9KTtcblxuICBtZWRpYVF1ZXJ5Q29uZGl0aW9uWydyZWR1Y2VNb3Rpb24nXSA9ICcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKSc7XG4gIG1lZGlhUXVlcnlDb25kaXRpb25bJ2lzRGFyayddID0gJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknO1xuICBtZWRpYVF1ZXJ5Q29uZGl0aW9uWydpc0xpZ2h0J10gPSAnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodCknO1xuXG4gIHJldHVybiBtZWRpYVF1ZXJ5Q29uZGl0aW9uO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gZm5cbiAqL1xuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJykge1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IE5vZGVMaXN0fSB0YXJnZXRcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gKi9cbmZ1bmN0aW9uIGZpcnN0Tm9kZSh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcbiAgfSBlbHNlIGlmIChOb2RlTGlzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZih0YXJnZXQpKSB7XG4gICAgaWYgKHRhcmdldC5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXRbMF07XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIHRhcmdldFswXTtcbiAgfVxufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZyB8IE5vZGVMaXN0fSB0YXJnZXRcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gKi9cbmZ1bmN0aW9uIGxhc3ROb2RlKHRhcmdldCkge1xuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YXJnZXQpW2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGFyZ2V0KS5sZW5ndGggLSAxXTtcbiAgfSBlbHNlIGlmIChOb2RlTGlzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZih0YXJnZXQpKSB7XG4gICAgaWYgKHRhcmdldC5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXRbdGFyZ2V0Lmxlbmd0aCAtIDFdO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgIHJldHVybiB0YXJnZXRbdGFyZ2V0Lmxlbmd0aCAtIDFdO1xuICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBzdHJcbiAqIEByZXR1cm5zIHsqW119XG4gKi9cbmZ1bmN0aW9uIHBhcnNlSFRNTChzdHIpIHtcbiAgY29uc3QgdG1wID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCcnKTtcbiAgdG1wLmJvZHkuaW5uZXJIVE1MID0gc3RyO1xuICByZXR1cm4gWy4uLnRtcC5ib2R5LmNoaWxkTm9kZXNdO1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHNldHVwTGVuaXMoKSB7XG4gIGNvbnN0IGxlbmlzID0gbmV3IExlbmlzKGV0VUkuY29uZmlnLmxlbmlzLm9wdGlvbnMgfHwge30pO1xuXG4gIGxlbmlzLm9uKCdzY3JvbGwnLCAoZSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICB9KTtcblxuICBsZW5pcy5vbignc2Nyb2xsJywgU2Nyb2xsVHJpZ2dlci51cGRhdGUpO1xuXG4gIGdzYXAudGlja2VyLmFkZCgodGltZSkgPT4ge1xuICAgIGxlbmlzLnJhZih0aW1lICogZXRVSS5jb25maWcubGVuaXMuc3BlZWQgfHwgMTAwMCk7XG4gIH0pO1xuXG4gIGdzYXAudGlja2VyLmxhZ1Ntb290aGluZyhldFVJLmNvbmZpZy5sZW5pcy5sYWdTbW9vdGhpbmcpO1xuXG4gIGV0VUkubGVuaXMgPSBsZW5pcztcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHNlbGVjdG9yICB7c3RyaW5nfEhUTUxFbGVtZW50fVxuICogQHJldHVybnMge0VsZW1lbnR8Kn1cbiAqL1xuZnVuY3Rpb24gc2VsZWN0b3JTdHJpbmdUb0VsZW1lbnQoc2VsZWN0b3IpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59XG5cbi8qKlxuICog7Y6Y7J207KeA7J2YIOuqqOuToCDsmpTshozrpbwg7YOQ7IOJ7ZWY7JesIOqzoOygleuQnCDsmpTshozrk6TsnZgg64aS7J2066W8IOqzhOyCsO2VqeuLiOuLpC5cbiAqIOyGjeyEsSDqsJLsnbQgZml4ZWQsIHN0aWNreeyduOqyveycoCDtgbTrnpjsiqQg7LaU6rCA7ZWg7KeAIO2YkeydmO2VtOyVvO2VqeuLiOuLpC5cbiAqIO2FjOyKpO2KuOykkVxuICogQHJldHVybnMge251bWJlcn0g6rOg7KCV65CcIOyalOyGjOuTpOydmCDstJ0g64aS7J20XG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZUZpeGVkRWxlbWVudHNIZWlnaHQoKSB7XG4gIGNvbnN0IGZpeGVkRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZml4ZWQsIC5zdGlja3knKTtcbiAgbGV0IHRvdGFsRml4ZWRIZWlnaHQgPSAwO1xuXG4gIGZpeGVkRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgaWYgKHN0eWxlLnBvc2l0aW9uID09PSAnZml4ZWQnIHx8IHN0eWxlLnBvc2l0aW9uID09PSAnc3RpY2t5Jykge1xuICAgICAgY29uc3QgaGVpZ2h0ID0gcGFyc2VGbG9hdChzdHlsZS5oZWlnaHQpIHx8IDA7XG4gICAgICBjb25zdCB0b3AgPSBwYXJzZUZsb2F0KHN0eWxlLnRvcCkgfHwgMDtcbiAgICAgIHRvdGFsRml4ZWRIZWlnaHQgKz0gaGVpZ2h0ICsgdG9wO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRvdGFsRml4ZWRIZWlnaHQ7XG59XG5cbi8qKlxuICog7Yq57KCVIOyalOyGjCDrmJDripQg7JyE7LmY66GcIOu2gOuTnOufveqyjCDsiqTtgazroaTtlanri4jri6QuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fG51bWJlcn0gdGFyZ2V0IC0g7Iqk7YGs66Gk7ZWgIOuqqe2RnCDsmpTshowg65iQ64qUIOychOy5mC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0g7Iqk7YGs66GkIOyYteyFmCDqsJ3ssrQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMub2Zmc2V0PTBdIC0g7LaU6rCAIOyYpO2UhOyFiyDqsJIuXG4gKi9cbmZ1bmN0aW9uIHNjcm9sbFRvUG9zaXRpb24odGFyZ2V0LCB7IG9mZnNldCA9IDAgfSA9IHt9KSB7XG4gIGNvbnN0IHRvdGFsRml4ZWRIZWlnaHQgPSBjYWxjdWxhdGVGaXhlZEVsZW1lbnRzSGVpZ2h0KCk7XG4gIGNvbnN0IHRvdGFsT2Zmc2V0ID0gdG90YWxGaXhlZEhlaWdodCArIG9mZnNldDtcblxuICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9XG4gICAgdHlwZW9mIHRhcmdldCA9PT0gJ251bWJlcidcbiAgICAgID8gdGFyZ2V0IC0gdG90YWxPZmZzZXRcbiAgICAgIDogdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcbiAgICAgICAgPyB0YXJnZXQub2Zmc2V0VG9wIC0gdG90YWxPZmZzZXRcbiAgICAgICAgOiAoKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0YXJnZXQgbXVzdCBiZSBhbiBIVE1MRWxlbWVudCBvciBhIG51bWJlcicpO1xuICAgICAgICAgIH0pKCk7XG5cbiAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiB0YXJnZXRQb3NpdGlvbiwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xufVxuIiwiZnVuY3Rpb24gZGVib3VuY2UoY2FsbGJhY2ssIGRlbGF5ID0gMjUwKSB7XG4gIGxldCB0aW1lb3V0SWQ7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9LCBkZWxheSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRocm90dGxlKGNhbGxiYWNrLCBkZWxheSA9IDI1MCkge1xuICBsZXQgaXNUaHJvdHRsZWQgPSBmYWxzZTtcbiAgbGV0IGFyZ3M7XG4gIGxldCBjb250ZXh0O1xuXG4gIGZ1bmN0aW9uIHdyYXBwZXIoLi4ud3JhcHBlckFyZ3MpIHtcbiAgICBpZiAoaXNUaHJvdHRsZWQpIHtcbiAgICAgIGFyZ3MgPSB3cmFwcGVyQXJncztcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlzVGhyb3R0bGVkID0gdHJ1ZTtcbiAgICBjYWxsYmFjay5hcHBseSh0aGlzLCB3cmFwcGVyQXJncyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpc1Rocm90dGxlZCA9IGZhbHNlO1xuICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgd3JhcHBlci5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgYXJncyA9IGNvbnRleHQgPSBudWxsO1xuICAgICAgfVxuICAgIH0sIGRlbGF5KTtcbiAgfVxuXG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5mdW5jdGlvbiBpc01hcmtlclFTKCkge1xuICByZXR1cm4gbG9jYXRpb24uc2VhcmNoLmluY2x1ZGVzKCdtYXJrZXIxMjEyMTInKTtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlckV2ZW50KGVsLCBldmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBldmVudFR5cGUgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBlbFtldmVudFR5cGVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZWxbZXZlbnRUeXBlXSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGV2ZW50ID0gdHlwZW9mIGV2ZW50VHlwZSA9PT0gJ3N0cmluZycgPyBuZXcgRXZlbnQoZXZlbnRUeXBlLCB7IGJ1YmJsZXM6IHRydWUgfSkgOiBldmVudFR5cGU7XG4gICAgZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cbn1cbiIsIi8vIOyXsOyCsCDqtIDroKggKOyekOujjO2YlU51bWJlciArIG51bWJlcilcbmZ1bmN0aW9uIGdldEJsZW5kT3BhY2l0eShvcGFjaXR5LCBsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBvcGFjaXR5O1xuICB9XG5cbiAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0gb3BhY2l0eSwgMSAvIGxlbmd0aCk7XG59XG4iLCIvLyBvYmplY3Qg6rSA66CoIOq4sOuKpVxuXG4vKipcbiAqIGNvbXBhcmUgb2JqXG4gKiBAcGFyYW0geyBPYmplY3QgfSBvYmoxXG4gKiBAcGFyYW0geyBPYmplY3QgfSBvYmoyXG4gKiBAcmV0dXJucyBCb29sZWFuXG4gKi9cbmZ1bmN0aW9uIHNoYWxsb3dDb21wYXJlKG9iajEsIG9iajIpIHtcbiAgY29uc3Qga2V5cyA9IFsuLi5PYmplY3Qua2V5cyhvYmoxKSwgT2JqZWN0LmtleXMob2JqMildO1xuXG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICBpZiAodHlwZW9mIG9iajFba2V5XSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iajJba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICghZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShvYmoxW2tleV0sIG9iajJba2V5XSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByb2xlID0gIW9iajJba2V5XSB8fCB0eXBlb2Ygb2JqMVtrZXldID09PSAnZnVuY3Rpb24nO1xuICAgICAgaWYgKCFyb2xlICYmIG9iajFba2V5XSAhPT0gb2JqMltrZXldKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzRGVlcEVxdWFsKG9iamVjdDEsIG9iamVjdDIpIHtcbiAgY29uc3Qgb2JqS2V5czEgPSBPYmplY3Qua2V5cyhvYmplY3QxKTtcbiAgY29uc3Qgb2JqS2V5czIgPSBPYmplY3Qua2V5cyhvYmplY3QyKTtcblxuICBpZiAob2JqS2V5czEubGVuZ3RoICE9PSBvYmpLZXlzMi5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICBmb3IgKHZhciBrZXkgb2Ygb2JqS2V5czEpIHtcbiAgICBjb25zdCB2YWx1ZTEgPSBvYmplY3QxW2tleV07XG4gICAgY29uc3QgdmFsdWUyID0gb2JqZWN0MltrZXldO1xuXG4gICAgY29uc3QgaXNPYmplY3RzID0gaXNPYmplY3QodmFsdWUxKSAmJiBpc09iamVjdCh2YWx1ZTIpO1xuXG4gICAgaWYgKChpc09iamVjdHMgJiYgIWlzRGVlcEVxdWFsKHZhbHVlMSwgdmFsdWUyKSkgfHwgKCFpc09iamVjdHMgJiYgdmFsdWUxICE9PSB2YWx1ZTIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gb2JqXG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWVGcm9tTmVzdGVkT2JqZWN0KG9iaiwga2V5KSB7XG4gIGNvbnN0IGtleXMgPSBrZXkuc3BsaXQoJy4nKTtcblxuICByZXR1cm4ga2V5cy5yZWR1Y2UoKGFjYywgY3VycktleSkgPT4ge1xuICAgIHJldHVybiBhY2MgJiYgYWNjW2N1cnJLZXldICE9PSB1bmRlZmluZWQgPyBhY2NbY3VycktleV0gOiB1bmRlZmluZWQ7XG4gIH0sIG9iaik7XG59XG4iLCIvKipcbiAqIFJldmVyc2UgYSBzdHJpbmdcbiAqIEBwYXJhbSBzdHIge3N0cmluZ31cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHJldmVyc2VTdHJpbmcoc3RyKSB7XG4gIHJldHVybiBzdHIuc3BsaXQoJycpLnJldmVyc2UoKS5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBHZXQgYSByYW5kb20gaWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldFJhbmRvbUlkKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gcHJlZml4XG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRSYW5kb21VSUlEKHByZWZpeCA9ICd1aScpIHtcbiAgcmV0dXJuIGAke3ByZWZpeH0tJHtnZXRSYW5kb21JZCgpfWA7XG59XG5cbi8qKlxuICog7LKr6riA7J6Q66eMIOuMgOusuOyekOuhnCDrs4DtmZhcbiAqIEBwYXJhbSB3b3JkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBjYXBpdGFsaXplKHdvcmQpIHtcbiAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpXG59XG5cbi8qKlxuICog7LKr6riA7J6Q66eMIOyGjOusuOyekOuhnCDrs4DtmZhcbiAqIEBwYXJhbSB3b3JkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiB1bmNhcGl0YWxpemUod29yZCkge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHdvcmQuc2xpY2UoMSlcbn1cblxuZnVuY3Rpb24gYWRkUHJlZml4Q2FtZWxTdHJpbmcoc3RyLCBwcmVmaXgpe1xuICAvLyBkaW1tQ2xpY2sgPT4gcHJvcHNEaW1tQ2xpY2tcbiAgcmV0dXJuIHByZWZpeCArIGV0VUkudXRpbHMuY2FwaXRhbGl6ZShzdHIpXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVByZWZpeENhbWVsU3RyaW5nKHN0ciwgcHJlZml4KXtcbiAgY29uc3QgcmVnRXhwID0gbmV3IFJlZ0V4cChgXiR7cHJlZml4fWAsICdnJylcbiAgcmV0dXJuIGV0VUkudXRpbHMudW5jYXBpdGFsaXplKHN0ci5yZXBsYWNlQWxsKHJlZ0V4cCwgJycpKVxuXG59XG5cbmZ1bmN0aW9uIGNvdW50Q2hhcmFjdGVycyhzdHIpIHtcbiAgbGV0IGNvdW50ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgY2hhcmFjdGVyIGlzIEVuZ2xpc2hcbiAgICBpZiAoL1thLXpBLVpdLy50ZXN0KHN0cltpXSkpIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBjaGFyYWN0ZXIgaXMgS29yZWFuIG9yIG90aGVyIDItYnl0ZSBjaGFyYWN0ZXJcbiAgICBlbHNlIGlmIChzdHIuY2hhckNvZGVBdChpKSA+IDEyNykge1xuICAgICAgY291bnQgKz0gMjtcbiAgICB9XG4gICAgLy8gU3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgZWxzZSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY291bnQ7XG59XG4iLCJcbmV0VUkudXRpbHMgPSB7XG5pc0FycmF5LFxuYWxsQ2xlYW51cHMsXG5zZXRQcm9wZXJ0eSxcbmdldFByb3BlcnR5LFxuc2V0U3R5bGUsXG5zcGxpdFRleHRNYXNrLFxuc3BsaXRUZXh0TWFza0Jsb2NrLFxud3JhcE1hc2ssXG5zZXREb2NIZWlnaHQsXG5nZXRNZWRpYVF1ZXJ5Q29uZGl0aW9uLFxucmVhZHksXG5maXJzdE5vZGUsXG5sYXN0Tm9kZSxcbnBhcnNlSFRNTCxcbnNldHVwTGVuaXMsXG5zZWxlY3RvclN0cmluZ1RvRWxlbWVudCxcbmNhbGN1bGF0ZUZpeGVkRWxlbWVudHNIZWlnaHQsXG5zY3JvbGxUb1Bvc2l0aW9uLFxuZGVib3VuY2UsXG50aHJvdHRsZSxcbmlzTWFya2VyUVMsXG50cmlnZ2VyRXZlbnQsXG5nZXRCbGVuZE9wYWNpdHksXG5zaGFsbG93Q29tcGFyZSxcbmlzRGVlcEVxdWFsLFxuaXNPYmplY3QsXG5nZXRWYWx1ZUZyb21OZXN0ZWRPYmplY3QsXG5yZXZlcnNlU3RyaW5nLFxuZ2V0UmFuZG9tSWQsXG5nZXRSYW5kb21VSUlELFxuY2FwaXRhbGl6ZSxcbnVuY2FwaXRhbGl6ZSxcbmFkZFByZWZpeENhbWVsU3RyaW5nLFxucmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcsXG5jb3VudENoYXJhY3RlcnNcbn1cbiAgICAgICAgICAgICAgIiwiZnVuY3Rpb24gdXNlQTExeUtleUV2ZW50KCkge1xuICBmdW5jdGlvbiBmaXJzdE5vZGVGb2N1c091dCh0YXJnZXQsIGhhbmRsZXIpIHtcbiAgICByZXR1cm4gZXRVSS5ob29rcy51c2VFdmVudExpc3RlbmVyKHRhcmdldCwgJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnVGFiJyAmJiBlLnNoaWZ0S2V5KSB7XG4gICAgICAgIGhhbmRsZXIoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxhc3ROb2RlRm9jdXNPdXQodGFyZ2V0LCBoYW5kbGVyKSB7XG4gICAgcmV0dXJuIGV0VUkuaG9va3MudXNlRXZlbnRMaXN0ZW5lcih0YXJnZXQsICdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gJ1RhYicgJiYgIWUuc2hpZnRLZXkpIHtcbiAgICAgICAgaGFuZGxlcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmaXJzdE5vZGVGb2N1c091dCxcbiAgICBsYXN0Tm9kZUZvY3VzT3V0LFxuICB9O1xufVxuIiwiLyoqXG4gKiB0YXJnZXQp7J2YIOyZuOu2gOulvCDtgbTrpq3tlojsnYQg65WMIOy9nOuwsSDtlajsiJjrpbwg7Iuk7ZaJXG4gKiDsmIjsmbjsoIHsnLzroZwg7YG066at7J2EIO2XiOyaqe2VoCDsmpTshozrk6TsnZgg7ISg7YOd7J6Q66W8IO2PrO2VqO2VmOuKlCDrsLDsl7TsnYQg7Ji17IWY7Jy866GcIOuwm+ydhCDsiJgg7J6I7Iq164uI64ukLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0IC0g7YG066atIOydtOuypO2KuOydmCDsmbjrtoAg7YG066atIOqwkOyngOulvCDsiJjtlontlaAg64yA7IOBIERPTSDsmpTshozsnoXri4jri6QuKO2VhOyImClcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0g7Jm467aAIO2BtOumreydtCDqsJDsp4DrkJjsl4jsnYQg65WMIOyLpO2Wie2VoCDsvZzrsLEg7ZWo7IiY7J6F64uI64ukLijtlYTsiJgpXG4gKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGV4Y2VwdGlvbnMgLSDsmbjrtoAg7YG066atIOqwkOyngOyXkOyEnCDsmIjsmbgg7LKY66as7ZWgIOyalOyGjOuTpOydmCDshKDtg53snpDrpbwg7Y+s7ZWo7ZWY64qUIOuwsOyXtOyeheuLiOuLpC4o7Ji17IWYKVxuICovXG5mdW5jdGlvbiB1c2VDbGlja091dHNpZGUodGFyZ2V0LCBjYWxsYmFjaywgZXhjZXB0aW9ucyA9IFtdKSB7XG4gIHJldHVybiBldFVJLmhvb2tzLnVzZUV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsICdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGlzQ2xpY2tJbnNpZGVFeGNlcHRpb24gPSBleGNlcHRpb25zLnNvbWUoKHNlbGVjdG9yKSA9PiB7XG4gICAgICBjb25zdCBleGNlcHRpb25FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICByZXR1cm4gZXhjZXB0aW9uRWxlbWVudCAmJiBleGNlcHRpb25FbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XG4gICAgfSk7XG5cbiAgICBpZiAoIXRhcmdldC5jb250YWlucyhldmVudC50YXJnZXQpICYmICFpc0NsaWNrSW5zaWRlRXhjZXB0aW9uKSB7XG4gICAgICBjYWxsYmFjayh0YXJnZXQpO1xuICAgIH1cbiAgfSk7XG59XG4iLCJmdW5jdGlvbiB1c2VDb3JlKFxuICBpbml0aWFsUHJvcHMgPSB7fSxcbiAgaW5pdGlhbFN0YXRlID0ge30sXG4gIHJlbmRlcixcbiAgb3B0aW9ucyA9IHtcbiAgICBkYXRhc2V0OiB0cnVlLFxuICB9LFxuKSB7XG4gIGNvbnN0IGFjdGlvbnMgPSB7fTtcbiAgbGV0ICR0YXJnZXQ7XG4gIGNvbnN0IGNsZWFudXBzID0gW107XG4gIGNvbnN0IE5PX0JVQkJMSU5HX0VWRU5UUyA9IFsnYmx1cicsICdmb2N1cycsICdmb2N1c2luJywgJ2ZvY3Vzb3V0JywgJ3BvaW50ZXJsZWF2ZSddO1xuICBjb25zdCBvblN0YXRlQ2hhbmdlID0gKCkgPT4ge307XG4gIGxldCBzdGF0ZUNhbGxiYWNrO1xuICBjb25zdCBwcm9wcyA9IG5ldyBQcm94eShpbml0aWFsUHJvcHMsIHtcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcbiAgICAgIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCBzdGF0ZSA9IG5ldyBQcm94eShpbml0aWFsU3RhdGUsIHtcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcbiAgICAgIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9KTtcblxuICBmdW5jdGlvbiBzZXRUYXJnZXQoXyR0YXJnZXQsIHsgc3RhdGVDYWxsYmFjazogX3N0YXRlQ2FsbGJhY2sgfSA9IHt9KSB7XG4gICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIGlmIChfc3RhdGVDYWxsYmFjaykge1xuICAgICAgc3RhdGVDYWxsYmFjayA9IF9zdGF0ZUNhbGxiYWNrO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmRhdGFzZXQpIHtcbiAgICAgIGNvbnN0IHsgZ2V0UHJvcHNGcm9tRGF0YXNldCwgZ2V0VmFyc0Zyb21EYXRhc2V0IH0gPSBldFVJLmhvb2tzLnVzZURhdGFzZXQoJHRhcmdldCk7XG4gICAgICBjb25zdCBkYXRhc2V0UHJvcHMgPSBnZXRQcm9wc0Zyb21EYXRhc2V0KCk7XG4gICAgICBjb25zdCBkYXRhc2V0VmFycyA9IGdldFZhcnNGcm9tRGF0YXNldCgpO1xuXG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5kYXRhc2V0UHJvcHMgfSk7XG4gICAgICBzZXRTdGF0ZSh7IC4uLnN0YXRlLCAuLi5kYXRhc2V0VmFycyB9LCB7IHNpbGVudDogdHJ1ZSwgaW1tZWRpYXRlOiB0cnVlIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFByb3BzKG5ld1Byb3BzKSB7XG4gICAgT2JqZWN0LmtleXMobmV3UHJvcHMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgcHJvcHNba2V5XSA9IG5ld1Byb3BzW2tleV07XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZShuZXdTdGF0ZSwgeyBzaWxlbnQgPSBmYWxzZSwgaW1tZWRpYXRlID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgaWYgKGV0VUkudXRpbHMuaXNEZWVwRXF1YWwoc3RhdGUsIG5ld1N0YXRlKSkgcmV0dXJuO1xuXG4gICAgT2JqZWN0LmtleXMobmV3U3RhdGUpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgc3RhdGVba2V5XSA9IG5ld1N0YXRlW2tleV07XG4gICAgfSk7XG4gICAgaWYgKCFzaWxlbnQgJiYgcmVuZGVyICE9PSB1bmRlZmluZWQgJiYgcmVuZGVyICE9PSBudWxsICYmIHR5cGVvZiByZW5kZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlbmRlcihpbW1lZGlhdGUpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmRhdGFzZXQpIHtcbiAgICAgIGNvbnN0IHsgc2V0VmFyc0Zyb21EYXRhc2V0IH0gPSBldFVJLmhvb2tzLnVzZURhdGFzZXQoJHRhcmdldCk7XG4gICAgICBzZXRWYXJzRnJvbURhdGFzZXQoc3RhdGUpO1xuICAgIH1cblxuICAgIHN0YXRlQ2FsbGJhY2sgJiYgc3RhdGVDYWxsYmFjayhzdGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRFdmVudChldmVudFR5cGUsIHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgIGNvbnN0ICRldmVudFRhcmdldCA9IHNlbGVjdG9yID8gJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6ICR0YXJnZXQ7XG5cbiAgICBpZiAoTk9fQlVCQkxJTkdfRVZFTlRTLmluY2x1ZGVzKGV2ZW50VHlwZSkpIHtcbiAgICAgIGNvbnN0IGNsZWFudXAgPSBldFVJLmhvb2tzLnVzZUV2ZW50TGlzdGVuZXIoJGV2ZW50VGFyZ2V0LCBldmVudFR5cGUsIGNhbGxiYWNrKTtcbiAgICAgIHJldHVybiBjbGVhbnVwcy5wdXNoKGNsZWFudXApO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50SGFuZGxlciA9IChldmVudCkgPT4ge1xuICAgICAgbGV0ICRldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KHNlbGVjdG9yKTtcblxuICAgICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgICAkZXZlbnRUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIGlmICgkZXZlbnRUYXJnZXQpIHtcbiAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAkdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudEhhbmRsZXIpO1xuICAgIGNvbnN0IGNsZWFudXAgPSAoKSA9PiAkdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudEhhbmRsZXIpO1xuICAgIGNsZWFudXBzLnB1c2goY2xlYW51cCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVFdmVudCgpIHtcbiAgICBldFVJLnV0aWxzLmFsbENsZWFudXBzKGNsZWFudXBzKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xlYW51cHMsXG4gICAgc2V0VGFyZ2V0LFxuICAgIGFjdGlvbnMsXG4gICAgc3RhdGUsXG4gICAgcHJvcHMsXG4gICAgc2V0U3RhdGUsXG4gICAgc2V0UHJvcHMsXG4gICAgYWRkRXZlbnQsXG4gICAgcmVtb3ZlRXZlbnQsXG4gIH07XG59XG4iLCIvKipcbiAqIHVzZURhdGFzZXRcbiAqIEBwYXJhbSAkdGFyZ2V0IHtIVE1MRWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gdXNlRGF0YXNldCgkdGFyZ2V0KSB7XG4gIGxldCBkYXRhc2V0UHJvcHMgPSB7fSxcbiAgICBkYXRhc2V0VmFycyA9IHt9O1xuXG4gIGZ1bmN0aW9uIGdldERhdGFzZXRCeVByZWZpeChwcmVmaXgpIHtcbiAgICBjb25zdCBkYXRhc2V0ID0ge307XG4gICAgT2JqZWN0LmtleXMoJHRhcmdldC5kYXRhc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGxldCB2YWx1ZSA9ICR0YXJnZXQuZGF0YXNldFtrZXldO1xuICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuaW5jbHVkZXMoJ3snKSl7XG4gICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYoIWlzTmFOKHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBpZihrZXkuc3RhcnRzV2l0aChwcmVmaXgpKXtcbiAgICAgICAgZGF0YXNldFtldFVJLnV0aWxzLnJlbW92ZVByZWZpeENhbWVsU3RyaW5nKGtleSwgcHJlZml4KV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkYXRhc2V0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YXNldEV4Y2VwdFByZWZpeChwcmVmaXgpIHtcbiAgICBjb25zdCBkYXRhc2V0ID0ge307XG5cbiAgICBPYmplY3Qua2V5cygkdGFyZ2V0LmRhdGFzZXQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gJHRhcmdldC5kYXRhc2V0W2tleV07XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYoIWtleS5zdGFydHNXaXRoKHByZWZpeCkpe1xuICAgICAgICBkYXRhc2V0W2V0VUkudXRpbHMucmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcoa2V5LCBwcmVmaXgpXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBzZXREYXRhc2V0QnlQcmVmaXgoZGF0YSwgcHJlZml4KSB7XG4gICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZihwcmVmaXgpe1xuICAgICAgICAkdGFyZ2V0LmRhdGFzZXRbYCR7cHJlZml4fSR7ZXRVSS51dGlscy5jYXBpdGFsaXplKGtleSl9YF0gPSBkYXRhW2tleV07XG4gICAgICB9ZWxzZXtcbiAgICAgICAgJHRhcmdldC5kYXRhc2V0W2tleV0gPSBkYXRhW2tleV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQcm9wc0Zyb21EYXRhc2V0KCkge1xuICAgIGRhdGFzZXRQcm9wcyA9IGdldERhdGFzZXRCeVByZWZpeCgncHJvcHMnKTtcbiAgICByZXR1cm4gZGF0YXNldFByb3BzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VmFyc0Zyb21EYXRhc2V0KCkge1xuICAgIGRhdGFzZXRWYXJzID0gZ2V0RGF0YXNldEV4Y2VwdFByZWZpeCgncHJvcHMnKTtcbiAgICByZXR1cm4gZGF0YXNldFZhcnM7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRQcm9wc0Zyb21EYXRhc2V0KHByb3BzKSB7XG4gICAgc2V0RGF0YXNldEJ5UHJlZml4KHByb3BzLCAncHJvcHMnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFZhcnNGcm9tRGF0YXNldCh2YXJzKSB7XG4gICAgc2V0RGF0YXNldEJ5UHJlZml4KHZhcnMsICcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0cmluZ1RvT2JqZWN0KHByb3BzKSB7XG4gICAgLy8gZGF0YXNldOyXkOyEnCDqsJ3ssrQg7ZiV7YOc7J24IOyKpO2KuOungeqwkiDtg4DsnoUg6rCd7LK066GcIOuwlOq/lOykjFxuICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XG4gICAgICBpZiAoISh0eXBlb2YgcHJvcHNba2V5XSA9PT0gJ2Jvb2xlYW4nKSAmJiBwcm9wc1trZXldLmluY2x1ZGVzKCd7JykpIHtcbiAgICAgICAgcHJvcHNba2V5XSA9IEpTT04ucGFyc2UocHJvcHNba2V5XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRQcm9wc0Zyb21EYXRhc2V0LFxuICAgIHNldFByb3BzRnJvbURhdGFzZXQsXG4gICAgZ2V0VmFyc0Zyb21EYXRhc2V0LFxuICAgIHNldFZhcnNGcm9tRGF0YXNldCxcbiAgICBzZXRTdHJpbmdUb09iamVjdCxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZURpYWxvZygpIHtcbiAgbGV0ICRsYXllcldyYXBCb3g7XG5cbiAgZnVuY3Rpb24gY3JlYXRlTGF5ZXJXcmFwKCkge1xuICAgICRsYXllcldyYXBCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAkbGF5ZXJXcmFwQm94LmNsYXNzTGlzdC5hZGQoJ2xheWVyLXdyYXAnKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCRsYXllcldyYXBCb3gpO1xuICB9XG5cbiAgY29uc3QgYWxlcnQgPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgZXRVSS5jb21wb25lbnRzLkRpYWxvZygpO1xuXG4gICAgaWYgKCEkbGF5ZXJXcmFwKSB7XG4gICAgICBjcmVhdGVMYXllcldyYXAoKTtcbiAgICAgICRsYXllcldyYXAgPSAkbGF5ZXJXcmFwQm94O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0c1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAnYWxlcnQnLCBtZXNzYWdlOiBvcHRzWzBdLCBjYWxsYmFjazogb3B0c1sxXSB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRzWzBdID09PSAnb2JqZWN0Jykge1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdhbGVydCcsIC4uLm9wdHNbMF0gfSk7XG4gICAgfVxuXG4gICAgZGlhbG9nLm9wZW4oKTtcbiAgfTtcblxuICBjb25zdCBjb25maXJtID0gKC4uLm9wdHMpID0+IHtcbiAgICBsZXQgJGxheWVyV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYXllci13cmFwJyk7XG4gICAgY29uc3QgZGlhbG9nID0gbmV3IGV0VUkuY29tcG9uZW50cy5EaWFsb2coKTtcblxuICAgIGlmICghJGxheWVyV3JhcCkge1xuICAgICAgY3JlYXRlTGF5ZXJXcmFwKCk7XG4gICAgICAkbGF5ZXJXcmFwID0gJGxheWVyV3JhcEJveDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHNbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2NvbmZpcm0nLCBtZXNzYWdlOiBvcHRzWzBdLCBwb3NpdGl2ZUNhbGxiYWNrOiBvcHRzWzFdIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2NvbmZpcm0nLCAuLi5vcHRzWzBdIH0pO1xuICAgIH1cblxuICAgIGRpYWxvZy5vcGVuKCk7XG4gIH07XG5cbiAgY29uc3QgcHJldmlld0ltYWdlID0gKC4uLm9wdHMpID0+IHtcbiAgICBsZXQgJGxheWVyV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYXllci13cmFwJyk7XG4gICAgY29uc3QgZGlhbG9nID0gbmV3IGV0VUkuY29tcG9uZW50cy5EaWFsb2coKTtcblxuICAgIGlmICghJGxheWVyV3JhcCkge1xuICAgICAgY3JlYXRlTGF5ZXJXcmFwKCk7XG4gICAgICAkbGF5ZXJXcmFwID0gJGxheWVyV3JhcEJveDtcbiAgICB9XG5cbiAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ3ByZXZpZXdJbWFnZScsIC4uLm9wdHNbMF0gfSk7XG5cbiAgICBkaWFsb2cub3BlbigpO1xuICB9O1xuXG4gIGNvbnN0IHRvYXN0QmFzaWMgPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkdG9hc3RXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvYXN0LXdyYXAnKVxuICAgIGNvbnN0IHRvYXN0ID0gbmV3IGV0VUkuY29tcG9uZW50cy5Ub2FzdCgpO1xuXG4gICAgaWYgKCEkdG9hc3RXcmFwKSByZXR1cm47XG5cbiAgICB0b2FzdC5jb3JlLmluaXQoJHRvYXN0V3JhcCwge3R5cGU6ICdiYXNpYycsIC4uLm9wdHNbMF19KTtcbiAgICB0b2FzdC5vcGVuKCk7XG4gIH1cblxuICBjb25zdCB0b2FzdENsb3NlQnRuID0gKC4uLm9wdHMpID0+IHtcbiAgICBsZXQgJHRvYXN0V3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2FzdC13cmFwJylcbiAgICBjb25zdCB0b2FzdCA9IG5ldyBldFVJLmNvbXBvbmVudHMuVG9hc3QoKTtcblxuICAgIGlmICghJHRvYXN0V3JhcCkgcmV0dXJuO1xuXG4gICAgdG9hc3QuY29yZS5pbml0KCR0b2FzdFdyYXAsIHt0eXBlOiAnY2xvc2UnLCAuLi5vcHRzWzBdfSk7XG4gICAgdG9hc3Qub3BlbigpO1xuICB9XG5cbiAgY29uc3QgdG9hc3RMaW5rQnRuID0gKC4uLm9wdHMpID0+IHtcbiAgICBsZXQgJHRvYXN0V3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2FzdC13cmFwJylcbiAgICBjb25zdCB0b2FzdCA9IG5ldyBldFVJLmNvbXBvbmVudHMuVG9hc3QoKTtcblxuICAgIGlmICghJHRvYXN0V3JhcCkgcmV0dXJuO1xuXG4gICAgdG9hc3QuY29yZS5pbml0KCR0b2FzdFdyYXAsIHt0eXBlOiAnbGluaycsIC4uLm9wdHNbMF19KTtcbiAgICB0b2FzdC5vcGVuKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFsZXJ0LFxuICAgIGNvbmZpcm0sXG4gICAgcHJldmlld0ltYWdlLFxuICAgIHRvYXN0QmFzaWMsXG4gICAgdG9hc3RDbG9zZUJ0bixcbiAgICB0b2FzdExpbmtCdG4sXG4gIH07XG59XG4iLCJmdW5jdGlvbiBkaWFsb2dUbXBsKCkge1xuICBjb25zdCAkdGVtcGxhdGVIVE1MID0gKHsgZGlhbG9nVHlwZSwgdHlwZSwgdGl0bGUsIG1lc3NhZ2UsIHBvc2l0aXZlVGV4dCwgbmVnYXRpdmVUZXh0IH0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtZGlhbG9nXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZGltbVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWZyYW1lXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgICAgICAgICAgICR7dGl0bGUgPyBgPGgzIGNsYXNzPVwiZGlhbG9nLXRpdFwiPiR7dGl0bGV9PC9oMz5gIDogJyd9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdhbGVydCcgPyBgPHNwYW4gY2xhc3M9XCIke3R5cGV9XCI+aWNvbjwvc3Bhbj5gIDogJyd9XG5cbiAgICAgICAgICAgICAgPHAgY2xhc3M9XCJkaWFsb2ctaW5mb1wiPiR7bWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgJzxicj4nKX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgJHtkaWFsb2dUeXBlID09PSAnY29uZmlybScgPyBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNxdWFyZSBidG4td2hpdGUgZGlhbG9nLW5lZ2F0aXZlXCI+JHtuZWdhdGl2ZVRleHR9PC9idXR0b24+YCA6ICcnfVxuICAgICAgICAgICAgICAke3Bvc2l0aXZlVGV4dCA/IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBkaWFsb2ctcG9zaXRpdmUgYnRuLXByaW1hcnlcIj4ke3Bvc2l0aXZlVGV4dH08L2J1dHRvbj5gIDogJyd9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgJHtkaWFsb2dUeXBlID09PSAnYWxlcnQnID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZGlhbG9nLWNsb3NlXCI+PHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPu2MneyXhSDri6vquLA8L3NwYW4+PC9idXR0b24+YCA6ICcnfVxuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICBjb25zdCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MID0gKHsgZGlhbG9nVHlwZSwgaW1hZ2VzLCB0aXRsZSB9KSA9PiBgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWRpYWxvZyBkaWFsb2ctcHJldmlldy1pbWFnZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWRpbW1cIj48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1mcmFtZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPlxuICAgICAgICAgICAgICAke3RpdGxlID8gYDxoMyBjbGFzcz1cImRpYWxvZy10aXRcIj4ke3RpdGxlfTwvaDM+YCA6ICcnfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1zd2lwZXJcIj5cbiAgICAgICAgICAgICAgICA8IS0tIEFkZGl0aW9uYWwgcmVxdWlyZWQgd3JhcHBlciAtLT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgICAgICR7aW1hZ2VzXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgKGltYWdlKSA9PiBgXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItc2xpZGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7aW1hZ2Uuc3JjfVwiIGFsdD1cIiR7aW1hZ2UuYWx0fVwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgYCxcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAuam9pbignJyl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3F1YXJlIGJ0bi13aGl0ZSBkaWFsb2ctbmVnYXRpdmVcIj7ri6vquLA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuICByZXR1cm4ge1xuICAgICR0ZW1wbGF0ZUhUTUwsXG4gICAgJHRlbXBsYXRlUHJldmlld0ltYWdlSFRNTCxcbiAgfTtcbn1cbiIsIi8qKlxuICogdXNlRXZlbnRMaXN0ZW5lclxuICogQHBhcmFtIHRhcmdldCAge0hUTUxFbGVtZW50fEhUTUxFbGVtZW50W119XG4gKiBAcGFyYW0gdHlwZSAge3N0cmluZ31cbiAqIEBwYXJhbSBsaXN0ZW5lciAge2Z1bmN0aW9ufVxuICogQHBhcmFtIG9wdGlvbnMge29iamVjdH1cbiAqIEByZXR1cm5zIHtmdW5jdGlvbigpOiAqfVxuICovXG5mdW5jdGlvbiB1c2VFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAoTm9kZUxpc3QucHJvdG90eXBlLmlzUHJvdG90eXBlT2YodGFyZ2V0KSkge1xuICAgIHRhcmdldC5mb3JFYWNoKChlbGVtZW50KSA9PiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpKTtcbiAgICByZXR1cm4gKCkgPT4gdGFyZ2V0LmZvckVhY2goKGVsZW1lbnQpID0+IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucykpO1xuICB9XG5cbiAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuICByZXR1cm4gKCkgPT4gdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xufVxuIiwiLyoqXG4gKiBnZXRCb3VuZGluZ0NsaWVudFJlY3RcbiAqIEBwYXJhbSB7IEVsZW1lbnQgfSBwYXJlbnRcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiB1c2VHZXRDbGllbnRSZWN0KHBhcmVudCwgc2VsZWN0b3IpIHtcbiAgY29uc3QgcmVjdCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKT8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGlmICghcmVjdCkgcmV0dXJuIHt9O1xuICBlbHNlXG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICBib3R0b206IHJlY3QuYm90dG9tLFxuICAgICAgbGVmdDogcmVjdC5sZWZ0LFxuICAgICAgcmlnaHQ6IHJlY3QucmlnaHQsXG4gICAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZUxheWVyKHR5cGUgPSAnbW9kYWwnKSB7XG4gIGZ1bmN0aW9uIGdldFZpc2libGVMYXllcigpIHtcbiAgICBjb25zdCAkbGF5ZXJDb21wb25lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpLmNoaWxkcmVuKS5maWx0ZXIoKCRlbCkgPT4ge1xuICAgICAgY29uc3QgaXNNb2RhbENvbXBvbmVudCA9ICRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbXBvbmVudC1tb2RhbCcpO1xuICAgICAgY29uc3QgaXNEaWFsb2dDb21wb25lbnQgPSAkZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb21wb25lbnQtZGlhbG9nJyk7XG5cbiAgICAgIHJldHVybiBpc01vZGFsQ29tcG9uZW50IHx8IGlzRGlhbG9nQ29tcG9uZW50O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICRsYXllckNvbXBvbmVudHMuZmlsdGVyKCgkZWwpID0+IHtcbiAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoJGVsKTtcbiAgICAgIHJldHVybiBzdHlsZS5kaXNwbGF5ICE9PSAnbm9uZSc7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUb3BEZXB0aCgpIHtcbiAgICBjb25zdCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cyA9IGdldFZpc2libGVMYXllcigpO1xuICAgIHJldHVybiAxMDAgKyAkdmlzaWJsZUxheWVyQ29tcG9uZW50cy5sZW5ndGg7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRMYXllck9wYWNpdHkoZGVmYXVsdE9wYWNpdHkgPSAwLjUpIHtcbiAgICBjb25zdCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cyA9IGdldFZpc2libGVMYXllcigpO1xuICAgICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzLmZvckVhY2goKCRlbCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IG9wYWNpdHkgPSBldFVJLnV0aWxzLmdldEJsZW5kT3BhY2l0eShkZWZhdWx0T3BhY2l0eSwgJHZpc2libGVMYXllckNvbXBvbmVudHMubGVuZ3RoKTtcblxuICAgICAgaWYgKCRlbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtZGltbScpKSB7XG4gICAgICAgICRlbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtZGltbScpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGByZ2JhKDAsIDAsIDAsICR7b3BhY2l0eX0pYDtcbiAgICAgIH1cblxuICAgICAgaWYgKCRlbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWRpbW0nKSkge1xuICAgICAgICAkZWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1kaW1tJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYmEoMCwgMCwgMCwgJHtvcGFjaXR5fSlgO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gbW9kYWwg65a07J2E65WMIOuNnOy7ueqxsOumrOuKlCDqsbAg7JeG7JWg64qUIHRlc3Qg7KSRXG4gIGZ1bmN0aW9uIGVuYWJsZVNjcm9sbExvY2soKSB7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgLy8gY29uc3Qgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xuICAgIC8vIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvd1kgPSAnc2Nyb2xsJztcbiAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IGAtJHtzY3JvbGxZfXB4YDtcbiAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzYWJsZVNjcm9sbExvY2soKSB7XG4gICAgY29uc3QgJHZpc2libGVMYXllckNvbXBvbmVudHMgPSBnZXRWaXNpYmxlTGF5ZXIoKTtcbiAgICAvLyBjb25zb2xlLmxvZygnJHZpc2libGVMYXllckNvbXBvbmVudHMnLCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cyk7XG4gICAgLy8gaWYgKCR2aXNpYmxlTGF5ZXJDb21wb25lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gbnVsbDtcbiAgICAvLyB9XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gbnVsbDtcblxuICAgIC8vIGNvbnN0IHNjcm9sbFkgPSBwYXJzZUludChkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCB8fCAnMCcpICogLTE7XG4gICAgLy8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9ICcnO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUucG9zaXRpb24gPSAnJztcbiAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcnO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUud2lkdGggPSAnJztcbiAgICAvLyB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsWSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldFZpc2libGVMYXllcixcbiAgICBnZXRUb3BEZXB0aCxcbiAgICBzZXRMYXllck9wYWNpdHksXG4gICAgZW5hYmxlU2Nyb2xsTG9jayxcbiAgICBkaXNhYmxlU2Nyb2xsTG9jayxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZU1lZGlhUXVlcnkoKXtcbiAgZnVuY3Rpb24gbWVkaWFRdWVyeUFjdGlvbiguLi5hcmdzKXtcbiAgICBjb25zdCBnc2FwTWVkaWFRdWVyeSA9IGdzYXAubWF0Y2hNZWRpYSgpO1xuXG4gICAgaWYgKGdzYXBNZWRpYVF1ZXJ5KSB7XG4gICAgICBnc2FwTWVkaWFRdWVyeS5raWxsKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWVkaWFRdWVyeUNvbmRpdGlvbiA9IGV0VUkudXRpbHMuZ2V0TWVkaWFRdWVyeUNvbmRpdGlvbihldFVJLmNvbmZpZy5tZWRpYS5uYW1lcywgZXRVSS5jb25maWcubWVkaWEucG9pbnRzKVxuXG4gICAgZ3NhcE1lZGlhUXVlcnkuYWRkKG1lZGlhUXVlcnlDb25kaXRpb24sIC4uLmFyZ3MpO1xuXG4gICAgcmV0dXJuIGdzYXBNZWRpYVF1ZXJ5O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtZWRpYVF1ZXJ5QWN0aW9uLFxuICB9XG59XG4iLCJmdW5jdGlvbiB1c2VNdXRhdGlvblN0YXRlKCl7XG4gIGxldCAkdGFyZ2V0LCAkcmVmID0ge1xuICAgICRzdGF0ZToge31cbiAgfSwgbXV0YXRpb25PYnNlcnZlciwgcmVuZGVyO1xuXG4gIGZ1bmN0aW9uIGluaXRNdXRhdGlvblN0YXRlKF8kdGFyZ2V0LCBfcmVuZGVyKXtcbiAgICAkdGFyZ2V0ID0gXyR0YXJnZXRcbiAgICByZW5kZXIgPSBfcmVuZGVyO1xuXG4gICAgc2V0TXV0YXRpb25PYnNlcnZlcigpXG4gICAgc2V0U3RhdGVCeURhdGFzZXQoKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGVCeURhdGFzZXQoKXtcbiAgICBjb25zdCBmaWx0ZXJlZERhdGFzZXQgPSB7fTtcbiAgICBjb25zdCBkYXRhc2V0ID0gJHRhcmdldC5kYXRhc2V0O1xuXG4gICAgT2JqZWN0LmtleXMoZGF0YXNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBpZihrZXkuc3RhcnRzV2l0aCgndmFycycpKXtcbiAgICAgICAgZmlsdGVyZWREYXRhc2V0W2tleS5yZXBsYWNlKCd2YXJzJywgJycpLnRvTG93ZXJDYXNlKCldID0gZGF0YXNldFtrZXldO1xuICAgICAgfVxuICAgIH0pXG5cbiAgICBzZXRTdGF0ZShmaWx0ZXJlZERhdGFzZXQpXG4gICAgcmVuZGVyKCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRNdXRhdGlvbk9ic2VydmVyKCl7XG4gICAgY29uc3QgY29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBjaGlsZExpc3Q6IGZhbHNlLCBzdWJ0cmVlOiBmYWxzZSB9O1xuXG4gICAgY29uc3QgY2FsbGJhY2sgPSAobXV0YXRpb25MaXN0LCBvYnNlcnZlcikgPT4ge1xuICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbkxpc3QpIHtcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJ1xuICAgICAgICAgICYmIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgIT09ICdzdHlsZSdcbiAgICAgICAgICAmJiBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnXG4gICAgICAgICkge1xuICAgICAgICAgIHNldFN0YXRlQnlEYXRhc2V0KClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZSgkdGFyZ2V0LCBjb25maWcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGUobmV3U3RhdGUpe1xuICAgICRyZWYuJHN0YXRlID0geyAuLi4kcmVmLiRzdGF0ZSwgLi4ubmV3U3RhdGUgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldERhdGFTdGF0ZShuZXdTdGF0ZSkge1xuICAgIGNvbnN0ICRuZXdTdGF0ZSA9IHsgLi4uJHJlZi4kc3RhdGUsIC4uLm5ld1N0YXRlIH07XG5cbiAgICBPYmplY3Qua2V5cygkbmV3U3RhdGUpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgJHRhcmdldC5kYXRhc2V0W2B2YXJzJHtldFVJLnV0aWxzLmNhcGl0YWxpemUoa2V5KX1gXSA9ICRuZXdTdGF0ZVtrZXldO1xuICAgIH0pXG4gIH1cblxuICByZXR1cm4ge1xuICAgICRyZWYsXG4gICAgc2V0U3RhdGUsXG4gICAgc2V0RGF0YVN0YXRlLFxuICAgIGluaXRNdXRhdGlvblN0YXRlXG4gIH1cbn1cbiIsImZ1bmN0aW9uIHVzZVNlbGVjdEJveFRlbXAoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUN1c3RvbUhUTUwgPSB7XG4gICAgbGFiZWwodGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBpZD1cImNvbWJvMS1sYWJlbFwiIGNsYXNzPVwiY29tYm8tbGFiZWxcIj4ke3RleHR9PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgc2VsZWN0QnRuKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImNvbWJvMVwiIGNsYXNzPVwic2VsZWN0LWJveFwiIHJvbGU9XCJjb21ib2JveFwiIGFyaWEtY29udHJvbHM9XCJsaXN0Ym94MVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtbGFiZWxsZWRieT1cImNvbWJvMS1sYWJlbFwiIGFyaWEtYWN0aXZlZGVzY2VuZGFudD1cIlwiPlxuICAgICAgICA8c3BhbiBzdHlsZT1cInBvaW50ZXItZXZlbnRzOiBub25lO1wiPiR7dGV4dH08L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtc1dyYXAoaXRlbXNIVE1MKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8dWwgaWQ9XCJsaXN0Ym94MVwiIGNsYXNzPVwic2VsZWN0LW9wdGlvbnNcIiByb2xlPVwibGlzdGJveFwiIGFyaWEtbGFiZWxsZWRieT1cImNvbWJvMS1sYWJlbFwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgICAke2l0ZW1zSFRNTH1cbiAgICAgICAgPC91bD5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtcyhpdGVtLCBzZWxlY3RlZCA9IGZhbHNlKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8bGkgcm9sZT1cIm9wdGlvblwiIGNsYXNzPVwib3B0aW9uXCIgYXJpYS1zZWxlY3RlZD1cIiR7c2VsZWN0ZWR9XCIgZGF0YS12YWx1ZT1cIiR7aXRlbS52YWx1ZX1cIj5cbiAgICAgICAgICAke2l0ZW0udGV4dH1cbiAgICAgICAgPC9saT5cbiAgICAgIGA7XG4gICAgfSxcbiAgfTtcblxuICBjb25zdCAkdGVtcGxhdGVCYXNpY0hUTUwgPSB7XG4gICAgbGFiZWwodGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBpZD1cImNvbWJvMS1sYWJlbFwiIGNsYXNzPVwiY29tYm8tbGFiZWxcIj4ke3RleHR9PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgc2VsZWN0QnRuKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIiBzZWxlY3RlZCBkaXNhYmxlZCBoaWRkZW4+JHt0ZXh0fTwvb3B0aW9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zV3JhcChpdGVtc0hUTUwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9XCJzZWxlY3QtbGlzdFwiIHJlcXVpcmVkPlxuICAgICAgICAgICR7aXRlbXNIVE1MfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtcyhpdGVtLCBzZWxlY3RlZCA9IGZhbHNlKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiPiR7aXRlbS50ZXh0fTwvb3B0aW9uPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlQ3VzdG9tSFRNTCxcbiAgICAkdGVtcGxhdGVCYXNpY0hUTUwsXG4gIH07XG59XG4iLCJmdW5jdGlvbiB1c2VTdGF0ZShpbml0aWFsVmFsdWUgPSB7fSwgY2FsbGJhY2spIHtcbiAgY29uc3Qgc3RhdGUgPSBuZXcgUHJveHkoaW5pdGlhbFZhbHVlLCB7XG4gICAgc2V0OiAodGFyZ2V0LCBrZXksIHZhbHVlKSA9PiB7XG4gICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sodGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHNldFN0YXRlID0gKG5ld1N0YXRlKSA9PiB7XG4gICAgT2JqZWN0LmtleXMobmV3U3RhdGUpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgc3RhdGVba2V5XSA9IG5ld1N0YXRlW2tleV07XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBbc3RhdGUsIHNldFN0YXRlXTtcbn1cbiIsImZ1bmN0aW9uIHVzZVN3aXBlclRtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSB7XG4gICAgbmF2aWdhdGlvbigpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWJ1dHRvbi1wcmV2XCI+7J207KCEPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWJ1dHRvbi1uZXh0XCI+64uk7J2MPC9idXR0b24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgcGFnaW5hdGlvbigpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItcGFnaW5hdGlvblwiPjwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIGF1dG9wbGF5KCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWF1dG9wbGF5IHBsYXlcIj48L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4ge1xuICAgICR0ZW1wbGF0ZUhUTUwsXG4gIH07XG59XG4iLCIvKipcbiAqIHRlbXAgdGltZWxpbmVcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHVzZVRyYW5zaXRpb24oKSB7XG4gIC8vIHNlbGVjdFxuICBjb25zdCB1c2VTZWxlY3RTaG93ID0gKHRhcmdldCwgdHlwZSwgb3B0aW9uKSA9PiB7XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICBjb25zdCB0aW1lbGluZSA9IGdzYXAudGltZWxpbmUoeyBwYXVzZWQ6IHRydWUgfSk7XG5cbiAgICBjb25zdCBvcHRpb25MaXN0ID0ge1xuICAgICAgZmFzdDogeyBkdXJhdGlvbjogMC4xNSB9LFxuICAgICAgbm9ybWFsOiB7IGR1cmF0aW9uOiAwLjMgfSxcbiAgICAgIHNsb3c6IHsgZHVyYXRpb246IDAuNyB9LFxuICAgIH07XG4gICAgY29uc3QgZ3NhcE9wdGlvbiA9IHsgLi4ub3B0aW9uTGlzdFt0eXBlXSwgLi4ub3B0aW9uIH07XG5cbiAgICB0aW1lbGluZS50byh0YXJnZXQsIHtcbiAgICAgIGFscGhhOiAwLFxuICAgICAgZWFzZTogJ2xpbmVhcicsXG4gICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH0sXG4gICAgICAuLi5nc2FwT3B0aW9uLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRpbWVsaW5lRWw6IHRpbWVsaW5lLl9yZWNlbnQudmFycyxcbiAgICAgIHRpbWVsaW5lOiAoc3RhdGUpID0+IHtcbiAgICAgICAgc3RhdGVcbiAgICAgICAgICA/IGdzYXAudG8odGFyZ2V0LCB7XG4gICAgICAgICAgICAgIG9uU3RhcnQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGVhc2U6ICdsaW5lYXInLFxuICAgICAgICAgICAgICBhbHBoYTogMSxcbiAgICAgICAgICAgICAgLi4uZ3NhcE9wdGlvbixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgOiBnc2FwLnRvKHRhcmdldCwge1xuICAgICAgICAgICAgICBhbHBoYTogMCxcbiAgICAgICAgICAgICAgZWFzZTogJ2xpbmVhcicsXG4gICAgICAgICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoJy5jb21wb25lbnQtc2VsZWN0JykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5jbG9zZXN0KCcuY29tcG9uZW50LXNlbGVjdCcpLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgLi4uZ3NhcE9wdGlvbixcbiAgICAgICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9O1xuXG4gIGNvbnN0IHNlbGVjdERpbW1TaG93ID0gKHRhcmdldCkgPT4ge1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICBnc2FwLnRvKHRhcmdldCwge1xuICAgICAgb25TdGFydDogKCkgPT4ge1xuICAgICAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9LFxuICAgICAgZWFzZTogJ2xpbmVhcicsXG4gICAgICBhbHBoYTogMC42LFxuICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICBvdmVyd3JpdGU6IHRydWVcbiAgICB9KVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0RGltbUNsb3NlID0gKHRhcmdldCkgPT4ge1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICBnc2FwLnRvKHRhcmdldCwge1xuICAgICAgYWxwaGE6IDAsXG4gICAgICBlYXNlOiAnbGluZWFyJyxcbiAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB1c2VTZWxlY3RTaG93LFxuICAgIHNlbGVjdERpbW1TaG93LFxuICAgIHNlbGVjdERpbW1DbG9zZVxuICB9O1xufVxuIiwiXG5ldFVJLmhvb2tzID0ge1xudXNlQTExeUtleUV2ZW50LFxudXNlQ2xpY2tPdXRzaWRlLFxudXNlQ29yZSxcbnVzZURhdGFzZXQsXG51c2VEaWFsb2csXG5kaWFsb2dUbXBsLFxudXNlRXZlbnRMaXN0ZW5lcixcbnVzZUdldENsaWVudFJlY3QsXG51c2VMYXllcixcbnVzZU1lZGlhUXVlcnksXG51c2VNdXRhdGlvblN0YXRlLFxudXNlU2VsZWN0Qm94VGVtcCxcbnVzZVN0YXRlLFxudXNlU3dpcGVyVG1wbCxcbnVzZVRyYW5zaXRpb25cbn1cbiAgICAgICAgICAgICAgIiwiLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBQcm9wc0NvbmZpZ1xuICogQHByb3BlcnR5IHtib29sZWFufSBkaXNhYmxlZCAtIOyalOyGjOqwgCDruYTtmZzshLHtmZQg7IOB7YOc7J247KeA66W8IOuCmO2DgOuDheuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gb25jZSAtIOydtOuypO2KuOuCmCDslaHshZjsnYQg7ZWcIOuyiOunjCDsi6TtlontlaDsp4Ag7Jes67aA66W8IOqysOygle2VqeuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7ZmFsc2UgfCBudW1iZXJ9IGR1cmF0aW9uIC0g7JWg64uI66mU7J207IWYIOuYkOuKlCDsnbTrsqTtirgg7KeA7IaNIOyLnOqwhOydhCDrsIDrpqzstIgg64uo7JyE66GcIOyEpOygle2VqeuLiOuLpC4gJ2ZhbHNlJ+ydvCDqsr3smrAg7KeA7IaNIOyLnOqwhOydhCDrrLTsi5ztlanri4jri6QuXG4gKiBAcHJvcGVydHkge09iamVjdH0gb3JpZ2luIC0g7JuQ7KCQIOuYkOuKlCDsi5zsnpEg7KeA7KCQ7J2EIOuCmO2DgOuCtOuKlCDqsJ3ssrTsnoXri4jri6QuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTdGF0ZUNvbmZpZ1xuICogQHByb3BlcnR5IHsnY2xvc2UnIHwgJ29wZW4nfSBzdGF0ZSAtIOyVhOy9lOuUlOyWuOydmCDsg4Htg5zqsJIuIGNsb3NlLCBvcGVuIOuRmCDspJHsl5Ag7ZWY64KY7J6F64uI64ukLlxuICovXG5cbi8qKiBAdHlwZSB7UHJvcHNDb25maWd9ICovXG4vKiogQHR5cGUge1N0YXRlQ29uZmlnfSAqL1xuXG5mdW5jdGlvbiBBY2NvcmRpb24oKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy9wcm9wc1xuICAgICAgaW5kZXg6IC0xLFxuICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXG4gICAgICAgIGVhc2luZzogJ3Bvd2VyNC5vdXQnLFxuICAgICAgfSxcbiAgICAgIHR5cGU6ICdtdWx0aXBsZScsXG4gICAgfSxcbiAgICB7XG4gICAgICAvL3N0YXRlXG4gICAgICBpbmRleDogLTEsXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ2FjY29yZGlvbic7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0IGFjY29yZGlvbkl0ZW07XG4gIGxldCAkdGFyZ2V0LCAkYWNjb3JkaW9uSXRlbSwgJGFjY29yZGlvbkl0ZW1zO1xuXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQsIHsgc3RhdGVDYWxsYmFjazogX3Byb3BzPy5zdGF0ZUNhbGxiYWNrIH0pO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcblxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gc3RhdGVcbiAgICByZW5kZXIodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIGFjY29yZGlvbkl0ZW0gPSAnLmFjY29yZGlvbi1pdGVtJztcblxuICAgIC8vIGVsZW1lbnRcbiAgICAkYWNjb3JkaW9uSXRlbSA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbChhY2NvcmRpb25JdGVtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAkYWNjb3JkaW9uSXRlbXMgPSBBcnJheS5mcm9tKCRhY2NvcmRpb25JdGVtKTtcbiAgICBjb25zdCBpdGVtcyA9ICRhY2NvcmRpb25JdGVtcy5tYXAoKCRjb2xsYXBzZSwgaSkgPT4ge1xuICAgICAgY29uc3QgY29sbGFwc2UgPSBldFVJLmNvbXBvbmVudHMuQ29sbGFwc2UoKTtcbiAgICAgIGNvbGxhcHNlLmNvcmUuaW5pdCgkY29sbGFwc2UsIHtcbiAgICAgICAgYWZ0ZXJPcGVuOiBwcm9wcy5hZnRlck9wZW4sXG4gICAgICAgIGFmdGVyQ2xvc2U6IHByb3BzLmFmdGVyQ2xvc2UsXG4gICAgICB9KTtcblxuICAgICAgaWYgKHByb3BzLnR5cGUgPT09ICdzZXBhcmF0ZScgfHwgcHJvcHMudHlwZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgaWYgKCRjb2xsYXBzZS5kYXRhc2V0LnN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgICAgICAvLyDslYjsoITtlZjqsowgb3BlbiDtlajsiJgg7Zi47LacXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG9wZW4oaSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIG9wZW4gYWNjb3JkaW9uIGl0ZW06JywgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29sbGFwc2U7XG4gICAgfSk7XG5cbiAgICBpZiAoc3RhdGUuaW5kZXggPiAtMSkge1xuICAgICAgc2V0U3RhdGUoeyBpbmRleDogc3RhdGUuaW5kZXggfSwgeyBpbW1lZGlhdGU6IHRydWUgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHt9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHt9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgYWNjb3JkaW9uSXRlbSwgKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgIGlmIChwcm9wcy50eXBlID09PSAnc2luZ2xlJykge1xuICAgICAgICBjb25zdCBjb2xsYXBzZSA9IHRhcmdldC5jbG9zZXN0KGFjY29yZGlvbkl0ZW0pO1xuICAgICAgICBjb25zdCBfc3RhdGUgPSBjb2xsYXBzZS51aS5jb3JlLnN0YXRlLnN0YXRlO1xuXG4gICAgICAgIGlmIChfc3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gJGFjY29yZGlvbkl0ZW1zLmluZGV4T2YoY29sbGFwc2UpO1xuICAgICAgICAgIHNldFN0YXRlKHsgaW5kZXggfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcihpbW1lZGlhdGUgPSBmYWxzZSkge1xuICAgIG9wZW4oc3RhdGUuaW5kZXgsIGltbWVkaWF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKGluZGV4LCBpbW1lZGlhdGUpIHtcbiAgICBpbmRleCA9ICtpbmRleDtcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICRhY2NvcmRpb25JdGVtcy5mb3JFYWNoKCgkaXRlbSwgaSkgPT4ge1xuICAgICAgICBpZiAoISRpdGVtIHx8ICEkaXRlbS51aSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignQWNjb3JkaW9uIGl0ZW0gb3IgVUkgbm90IGluaXRpYWxpemVkOicsIGkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGkgIT09IGluZGV4KSB7XG4gICAgICAgICAgaWYgKCRpdGVtLnVpLmNvcmUgJiYgJGl0ZW0udWkuY29yZS5zdGF0ZSAmJiAkaXRlbS51aS5jb3JlLnN0YXRlLnN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgICRpdGVtLnVpLmNsb3NlKGltbWVkaWF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRpdGVtLnVpLm9wZW4oaW1tZWRpYXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEgJiYgJGFjY29yZGlvbkl0ZW1zW2luZGV4XSAmJiAkYWNjb3JkaW9uSXRlbXNbaW5kZXhdLnVpKSB7XG4gICAgICAgICRhY2NvcmRpb25JdGVtc1tpbmRleF0udWkub3BlbihpbW1lZGlhdGUpO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdBY2NvcmRpb24gaXRlbSBvciBVSSBub3QgaW5pdGlhbGl6ZWQgZm9yIGluZGV4OicsIGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZShpbmRleCwgaW1tZWRpYXRlKSB7XG4gICAgaWYgKGluZGV4ID49IDAgJiYgJGFjY29yZGlvbkl0ZW1zW2luZGV4XSAmJiAkYWNjb3JkaW9uSXRlbXNbaW5kZXhdLnVpKSB7XG4gICAgICAkYWNjb3JkaW9uSXRlbXNbaW5kZXhdLnVpLmNsb3NlKGltbWVkaWF0ZSk7XG4gICAgfSBlbHNlIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0Nhbm5vdCBjbG9zZSBhY2NvcmRpb24gaXRlbTogVUkgbm90IGluaXRpYWxpemVkIGZvciBpbmRleDonLCBpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiBDb2xsYXBzZVxuICovXG5mdW5jdGlvbiBDb2xsYXBzZSgpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQsIGNsZWFudXBzIH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy8gcHJvcHNcbiAgICAgIGFuaW1hdGlvbjoge1xuICAgICAgICBkdXJhdGlvbjogMC41LFxuICAgICAgICBlYXNpbmc6ICdwb3dlcjIub3V0JyxcbiAgICAgIH0sXG5cbiAgICAgIGNsaWNrT3V0c2lkZTogZmFsc2UsXG4gICAgICBhMTF5VGFiOiBmYWxzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0YXRlXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ2NvbGxhcHNlJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgY29sbGFwc2VUcmlnZ2VyLCBjb2xsYXBzZUNvbnRlbnQsIGNsb3NlVGltZWxpbmUsIGNsaWNrT3V0c2lkZUNsZWFudXA7XG4gIGxldCAkdGFyZ2V0LCAkY29sbGFwc2VUcmlnZ2VyLCAkY29sbGFwc2VDb250ZW50O1xuXG4gIC8vIGhvb2tzXG4gIGNvbnN0IHsgZmlyc3ROb2RlRm9jdXNPdXQsIGxhc3ROb2RlRm9jdXNPdXQgfSA9IGV0VUkuaG9va3MudXNlQTExeUtleUV2ZW50KCk7XG5cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgc2V0VGFyZ2V0KCR0YXJnZXQsIHsgc3RhdGVDYWxsYmFjazogX3Byb3BzPy5zdGF0ZUNhbGxiYWNrIH0pO1xuICAgICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgICAgc2V0dXAoKTtcbiAgICAgIHNldEV2ZW50KCk7XG5cbiAgICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbml0aWFsaXppbmcgQ29sbGFwc2UgY29tcG9uZW50OicsIGVycm9yKTtcbiAgICAgIC8vIOyYpOulmOqwgCDrsJzsg53tlbTrj4Qg6riw67O47KCB7J24IFVJIOyDge2DnOuKlCDshKTsoJVcbiAgICAgIGlmICghJHRhcmdldC51aSkge1xuICAgICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBzdGF0ZVxuICAgIC8vIHNldFN0YXRlKHsgc2V0dGluZzogJ2N1c3RvbScgfSk7XG4gICAgcmVuZGVyKHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZVxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7fVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gc2VsZWN0b3JcbiAgICBjb2xsYXBzZVRyaWdnZXIgPSAnLmNvbGxhcHNlLXRpdCc7XG4gICAgY29sbGFwc2VDb250ZW50ID0gJy5jb2xsYXBzZS1jb250ZW50JztcblxuICAgIC8vIGVsZW1lbnRcbiAgICAkY29sbGFwc2VUcmlnZ2VyID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGNvbGxhcHNlVHJpZ2dlcik7XG4gICAgJGNvbGxhcHNlQ29udGVudCA9ICR0YXJnZXQucXVlcnlTZWxlY3Rvcihjb2xsYXBzZUNvbnRlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbUlkKCk7XG5cbiAgICBjb25zdCBjb2xsYXBzZUlkID0gYGlkLWNvbGxhcHNlLSR7aWR9YDtcbiAgICBjb25zdCBjb2xsYXBzZVRyaWdnZXJJZCA9IGBpZC1jb2xsYXBzZS10aXRsZS0ke2lkfWA7XG4gICAgY29uc3QgY29sbGFwc2VDb250ZW50SWQgPSBgaWQtY29sbGFwc2UtY29udGVudC0ke2lkfWA7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnaWQnLCBjb2xsYXBzZUlkKTtcbiAgICAkY29sbGFwc2VUcmlnZ2VyLnNldEF0dHJpYnV0ZSgnY29udHJvbHMnLCBjb2xsYXBzZUNvbnRlbnRJZCk7XG4gICAgJGNvbGxhcHNlVHJpZ2dlci5zZXRBdHRyaWJ1dGUoJ2lkJywgY29sbGFwc2VUcmlnZ2VySWQpO1xuICAgICRjb2xsYXBzZUNvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICRjb2xsYXBzZUNvbnRlbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3JlZ2lvbicpO1xuICAgICRjb2xsYXBzZUNvbnRlbnQuc2V0QXR0cmlidXRlKCdpZCcsIGNvbGxhcHNlQ29udGVudElkKTtcbiAgICAkY29sbGFwc2VDb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JywgY29sbGFwc2VUcmlnZ2VySWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGNvbnN0IHsgZHVyYXRpb24sIGVhc2luZyB9ID0gcHJvcHMuYW5pbWF0aW9uO1xuXG4gICAgY29uc3QgYTExeUNsZWFudXAgPSBbXTtcblxuICAgIGFjdGlvbnMub3BlbiA9IChpbW1lZGlhdGUgPSBmYWxzZSkgPT4ge1xuICAgICAgJGNvbGxhcHNlVHJpZ2dlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcbiAgICAgICRjb2xsYXBzZUNvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcblxuICAgICAgaWYgKGNsb3NlVGltZWxpbmUpIHtcbiAgICAgICAgY2xvc2VUaW1lbGluZS5raWxsKCk7XG4gICAgICB9XG5cbiAgICAgIGdzYXAuc2V0KCRjb2xsYXBzZUNvbnRlbnQsIHsgaGVpZ2h0OiAnYXV0bycsIGRpc3BsYXk6ICdibG9jaycsIHBhZGRpbmdUb3A6IG51bGwsIHBhZGRpbmdCb3R0b206IG51bGwgfSk7XG4gICAgICBnc2FwLnRpbWVsaW5lKCkuZnJvbSgkY29sbGFwc2VDb250ZW50LCB7XG4gICAgICAgIGR1cmF0aW9uOiBpbW1lZGlhdGUgPyAwIDogZHVyYXRpb24sXG4gICAgICAgIGVhc2U6IGVhc2luZyxcbiAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICBwYWRkaW5nVG9wOiAwLFxuICAgICAgICBwYWRkaW5nQm90dG9tOiAwLFxuICAgICAgICBvdmVyd3JpdGU6IHRydWUsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgaWYgKHByb3BzLnNjcm9sbFRvKSB7XG4gICAgICAgICAgICBnc2FwLnRvKHdpbmRvdywge1xuICAgICAgICAgICAgICBzY3JvbGxUbzoge1xuICAgICAgICAgICAgICAgIHk6ICR0YXJnZXQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0WTogMiAqICgkY29sbGFwc2VDb250ZW50Lm9mZnNldFRvcCAtICRjb2xsYXBzZVRyaWdnZXIub2Zmc2V0VG9wKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwcm9wcy5hMTF5VGFiKSB7XG4gICAgICAgICAgICBhMTF5Q2xlYW51cC5wdXNoKFxuICAgICAgICAgICAgICBsYXN0Tm9kZUZvY3VzT3V0KGV0VUkudXRpbHMubGFzdE5vZGUodGFiYmFibGUudGFiYmFibGUoJGNvbGxhcHNlQ29udGVudCkpLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocHJvcHMuYWZ0ZXJPcGVuKSB7XG4gICAgICAgICAgICBwcm9wcy5hZnRlck9wZW4oe1xuICAgICAgICAgICAgICB0YXJnZXQ6ICR0YXJnZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgaWYgKHByb3BzLmNsaWNrT3V0c2lkZSkge1xuICAgICAgICBjbGlja091dHNpZGVDbGVhbnVwID0gdXNlQ2xpY2tPdXRzaWRlKCR0YXJnZXQsICgpID0+IHtcbiAgICAgICAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9IChpbW1lZGlhdGUgPSBmYWxzZSkgPT4ge1xuICAgICAgaWYgKGNsaWNrT3V0c2lkZUNsZWFudXApIHtcbiAgICAgICAgY2xpY2tPdXRzaWRlQ2xlYW51cCgpO1xuICAgICAgfVxuXG4gICAgICAkY29sbGFwc2VUcmlnZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcbiAgICAgICRjb2xsYXBzZUNvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gICAgICBjbG9zZVRpbWVsaW5lID0gZ3NhcC50aW1lbGluZSgpLnRvKCRjb2xsYXBzZUNvbnRlbnQsIHtcbiAgICAgICAgZHVyYXRpb246IGltbWVkaWF0ZSA/IDAgOiBkdXJhdGlvbixcbiAgICAgICAgZWFzZTogZWFzaW5nLFxuICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgIHBhZGRpbmdUb3A6IDAsXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDAsXG4gICAgICAgIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAkY29sbGFwc2VDb250ZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgZXRVSS51dGlscy5hbGxDbGVhbnVwcyhhMTF5Q2xlYW51cCk7XG4gICAgICAgICAgaWYgKHByb3BzLmFmdGVyQ2xvc2UpIHtcbiAgICAgICAgICAgIHByb3BzLmFmdGVyQ2xvc2Uoe1xuICAgICAgICAgICAgICB0YXJnZXQ6ICR0YXJnZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgY29sbGFwc2VUcmlnZ2VyLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHN0YXRlLnN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgICAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFN0YXRlKHsgc3RhdGU6ICdvcGVuJyB9KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaGFuZGxpbmcgY29sbGFwc2UgY2xpY2sgZXZlbnQ6JywgZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLmExMXlUYWIpIHtcbiAgICAgIGZpcnN0Tm9kZUZvY3VzT3V0KCRjb2xsYXBzZVRyaWdnZXIsICgpID0+IHtcbiAgICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcihpbW1lZGlhdGUgPSBmYWxzZSkge1xuICAgIGNvbnN0IGlzU2hvdyA9IHN0YXRlLnN0YXRlID09PSAnb3Blbic7XG4gICAgaXNTaG93ID8gYWN0aW9ucy5vcGVuKGltbWVkaWF0ZSkgOiBhY3Rpb25zLmNsb3NlKGltbWVkaWF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKGltbWVkaWF0ZSA9IGZhbHNlKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ29wZW4nIH0sIHsgaW1tZWRpYXRlIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UoaW1tZWRpYXRlID0gZmFsc2UpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0sIHsgaW1tZWRpYXRlIH0pO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiZnVuY3Rpb24gRGF0ZXBpY2tlckNvbXAoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy8gcHJvcHNcbiAgICAgIGxhbmd1YWdlOiAna28nLFxuICAgICAgZGF5c09mV2Vla0hpZ2hsaWdodGVkOiBbMCwgNl0sXG4gICAgICBhdXRvaGlkZTogdHJ1ZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0YXRlXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdkYXRlcGlja2VyJztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICBsZXQgY29tcG9uZW50ID0ge307XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCAkdGFyZ2V0LCAkZGF0ZXBpY2tlciwgJGRhdGVwaWNrZXJUcmlnZ2VyLCAkc2VsZWN0TGFiZWwsICRyYW5nZVN0YXJ0LCAkcmFuZ2VFbmQ7XG4gIGxldCByYW5nZVN0YXJ0LCByYW5nZUVuZCwgZGF0ZXBpY2tlclRyaWdnZXI7XG5cbiAgRGF0ZXBpY2tlci5sb2NhbGVzLmtvID0ge1xuICAgIGRheXM6IFsn7J287JqU7J28JywgJ+yblOyalOydvCcsICftmZTsmpTsnbwnLCAn7IiY7JqU7J28JywgJ+uqqeyalOydvCcsICfquIjsmpTsnbwnLCAn7Yag7JqU7J28J10sXG4gICAgZGF5c1Nob3J0OiBbJ+ydvCcsICfsm5QnLCAn7ZmUJywgJ+yImCcsICfrqqknLCAn6riIJywgJ+2GoCddLFxuICAgIGRheXNNaW46IFsn7J28JywgJ+yblCcsICftmZQnLCAn7IiYJywgJ+uqqScsICfquIgnLCAn7YagJ10sXG4gICAgbW9udGhzOiBbJzHsm5QnLCAnMuyblCcsICcz7JuUJywgJzTsm5QnLCAnNeyblCcsICc27JuUJywgJzfsm5QnLCAnOOyblCcsICc57JuUJywgJzEw7JuUJywgJzEx7JuUJywgJzEy7JuUJ10sXG4gICAgbW9udGhzU2hvcnQ6IFsnMeyblCcsICcy7JuUJywgJzPsm5QnLCAnNOyblCcsICc17JuUJywgJzbsm5QnLCAnN+yblCcsICc47JuUJywgJznsm5QnLCAnMTDsm5QnLCAnMTHsm5QnLCAnMTLsm5QnXSxcbiAgICB0b2RheTogJ+yYpOuKmCcsXG4gICAgY2xlYXI6ICfsgq3soJwnLFxuICAgIGZvcm1hdDogJ3l5eXktbW0tZGQnLFxuICAgIHRpdGxlRm9ybWF0OiAneeuFhCBt7JuUJyxcbiAgICB3ZWVrU3RhcnQ6IDAsXG4gIH07XG5cbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmIChwcm9wcy50eXBlID09PSAncmFuZ2UnKSAkdGFyZ2V0ID0gJHRhcmdldC5jbG9zZXN0KCcuY29tcG9uZW50LXJhbmdlcGlja2VyJyk7XG5cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBzdGF0ZVxuICAgIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZVxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICBkYXRlcGlja2VyVHJpZ2dlciA9ICcuZGF0ZXBpY2tlci1idG4tdHJpZ2dlcic7XG4gICAgcmFuZ2VTdGFydCA9ICdyYW5nZS1zdGFydCc7XG4gICAgcmFuZ2VFbmQgPSAncmFuZ2UtZW5kJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICBjb25zdCB7IHR5cGUgfSA9IHByb3BzO1xuICAgIC8vIGlkXG4gICAgY29uc3QgbGFiZWxJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcblxuICAgIC8vIGExMXlcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICRzZWxlY3RMYWJlbCwgJ2lkJywgbGFiZWxJZCk7XG5cbiAgICBpZiAocHJvcHMudHlwZSA9PT0gJ3JhbmdlJykge1xuICAgICAgJHJhbmdlU3RhcnQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtyYW5nZVN0YXJ0fVwiXWApO1xuICAgICAgJHJhbmdlRW5kID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGBbbmFtZT1cIiR7cmFuZ2VFbmR9XCJdYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRkYXRlcGlja2VyVHJpZ2dlciA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihkYXRlcGlja2VyVHJpZ2dlcik7XG4gICAgfVxuXG4gICAgLy8gJGRhdGVwaWNrZXIg7KCV7J2YXG4gICAgaWYgKHR5cGUgPT09ICdyYW5nZScpIHtcbiAgICAgICRkYXRlcGlja2VyID0gbmV3IERhdGVSYW5nZVBpY2tlcigkdGFyZ2V0LCB7IC4uLnByb3BzIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZGF0ZXBpY2tlciA9IG5ldyBEYXRlcGlja2VyKCRkYXRlcGlja2VyVHJpZ2dlciwgeyAuLi5wcm9wcyB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge307XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge307XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7fVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge31cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIC8vIGNhbGxhYmxlXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gICAgZ2V0RGF0ZXBpY2tlckluc3RhbmNlKCkge1xuICAgICAgcmV0dXJuICRkYXRlcGlja2VyO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogIE1vZGFsXG4gKi9cbmZ1bmN0aW9uIERpYWxvZygpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvLyBwcm9wc1xuICAgICAgZGltbUNsaWNrOiB0cnVlLFxuICAgICAgZXNjOiB0cnVlLFxuICAgICAgdGl0bGU6IG51bGwsXG4gICAgICBtZXNzYWdlOiAnJyxcbiAgICAgIHR5cGU6ICdhbGVydCcsXG4gICAgICBwb3NpdGl2ZVRleHQ6IGV0VUkuJHQoJ2RpYWxvZy5wb3NpdGl2ZScsICftmZXsnbgnKSxcbiAgICAgIG5lZ2F0aXZlVGV4dDogZXRVSS4kdCgnZGlhbG9nLm5lZ2F0aXZlJywgJ+y3qOyGjCcpLFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhdGU6ICdjbG9zZScsXG4gICAgICB0cmlnZ2VyOiBudWxsLFxuICAgIH0sXG4gICAgcmVuZGVyLFxuICAgIHtcbiAgICAgIGRhdGFzZXQ6IGZhbHNlLFxuICAgIH0sXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgRElNTV9PUEFDSVRZID0gZXRVSS5jb25maWcubGF5ZXIuZGltbU9wYWNpdHk7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdkaWFsb2cnO1xuICBsZXQgY29tcG9uZW50ID0ge307XG4gIGxldCBtb2RhbERpbW1TZWxlY3RvciwgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCBtb2RhbEJ0blBvc2l0aXZlLCBtb2RhbEJ0bk5lZ2F0aXZlO1xuICBsZXQgJHRhcmdldCwgJG1vZGFsLCAkbW9kYWxUaXRsZSwgJG1vZGFsQ29udGFpbmVyLCAkbW9kYWxEaW1tLCAkbW9kYWxCdG5Qb3NpdGl2ZSwgJG1vZGFsQnRuTmVnYXRpdmUsIGZvY3VzVHJhcEluc3RhbmNlLCBjYWxsYmFjaztcblxuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ3RhcmdldOydtCDsobTsnqztlZjsp4Ag7JWK7Iq164uI64ukLicpO1xuICAgIH1cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0LCB7IHN0YXRlQ2FsbGJhY2s6IF9wcm9wcz8uc3RhdGVDYWxsYmFjayB9KTtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG5cbiAgICAvLyAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBmb2N1cyB0cmFwXG4gICAgZm9jdXNUcmFwSW5zdGFuY2UgPSBmb2N1c1RyYXAuY3JlYXRlRm9jdXNUcmFwKCRtb2RhbCwge1xuICAgICAgZXNjYXBlRGVhY3RpdmF0ZXM6IHByb3BzLmVzYyxcbiAgICAgIG9uQWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSxcbiAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUsXG4gICAgfSk7XG5cbiAgICAvLyBzdGF0ZVxuICAgIC8vIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZVxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MLCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MIH0gPSBldFVJLnRlbXBsYXRlcy5kaWFsb2dUbXBsKCk7XG5cbiAgICBpZiAocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyB8fCBwcm9wcy5kaWFsb2dUeXBlID09PSAnY29uZmlybScpIHtcbiAgICAgICR0YXJnZXQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCAkdGVtcGxhdGVIVE1MKHByb3BzKSk7XG4gICAgfSBlbHNlIGlmIChwcm9wcy5kaWFsb2dUeXBlID09PSAncHJldmlld0ltYWdlJykge1xuICAgICAgJHRhcmdldC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUwocHJvcHMpKTtcbiAgICB9XG5cbiAgICAkbW9kYWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5jb21wb25lbnQtZGlhbG9nJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIHNlbGVjdG9yXG4gICAgbW9kYWxDbG9zZUJ0blNlbGVjdG9yID0gJy5kaWFsb2ctY2xvc2UnO1xuICAgIG1vZGFsRGltbVNlbGVjdG9yID0gJy5kaWFsb2ctZGltbSc7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJG1vZGFsVGl0bGUgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy10aXQnKTtcbiAgICAkbW9kYWxEaW1tID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IobW9kYWxEaW1tU2VsZWN0b3IpO1xuICAgICRtb2RhbENvbnRhaW5lciA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWNvbnRhaW5lcicpO1xuXG4gICAgbW9kYWxCdG5Qb3NpdGl2ZSA9ICcuZGlhbG9nLXBvc2l0aXZlJztcbiAgICBtb2RhbEJ0bk5lZ2F0aXZlID0gJy5kaWFsb2ctbmVnYXRpdmUnO1xuICAgICRtb2RhbEJ0blBvc2l0aXZlID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctcG9zaXRpdmUnKTtcbiAgICAkbW9kYWxCdG5OZWdhdGl2ZSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLW5lZ2F0aXZlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gc2V0IGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgJy10aXQnKTtcbiAgICAvLyAvLyBhMTF5XG5cbiAgICBpZiAocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyB8fCBwcm9wcy5kaWFsb2dUeXBlID09PSAnY29uZmlybScpIHtcbiAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAncm9sZScsICdhbGVydGRpYWxvZycpO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ3ByZXZpZXdJbWFnZScpIHtcbiAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAncm9sZScsICdkaWFsb2cnKTtcblxuICAgICAgY29uc3QgJHN3aXBlciA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuY29tcG9uZW50LXN3aXBlcicpO1xuICAgICAgY29uc3Qgc3dpcGVyID0gbmV3IGV0VUkuY29tcG9uZW50cy5Td2lwZXJDb21wKCk7XG4gICAgICBzd2lwZXIuY29yZS5pbml0KCRzd2lwZXIsIHtcbiAgICAgICAgbmF2aWdhdGlvbjogdHJ1ZSxcbiAgICAgICAgcGFnaW5hdGlvbjogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdpZCcsIGlkKTtcbiAgICBpZiAoJG1vZGFsVGl0bGUpIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsVGl0bGUsICdpZCcsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsLCAnYXJpYS1sYWJlbGxlZGJ5JywgdGl0bGVJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICd0YWJpbmRleCcsICctMScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGNvbnN0IHsgZ2V0VG9wRGVwdGgsIHNldExheWVyT3BhY2l0eSwgZW5hYmxlU2Nyb2xsTG9jaywgZGlzYWJsZVNjcm9sbExvY2sgfSA9IGV0VUkuaG9va3MudXNlTGF5ZXIoKTtcblxuICAgIGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSA9ICgpID0+IHt9O1xuXG4gICAgYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUgPSAoKSA9PiB7XG4gICAgICBpZiAoIXN0YXRlLnRyaWdnZXIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5uZWdhdGl2ZUNhbGxiYWNrO1xuICAgICAgfVxuICAgICAgYWN0aW9ucy5jbG9zZSgpO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCB6SW5kZXggPSBnZXRUb3BEZXB0aCgpO1xuXG4gICAgICAkbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAkbW9kYWwuc3R5bGUuekluZGV4ID0gekluZGV4O1xuXG4gICAgICAvLyBpZiAocHJvcHMuZGlhbG9nVHlwZSA9PT0gJ3lvdXR1YmUnKSB7XG4gICAgICAvLyB9XG4gICAgICBlbmFibGVTY3JvbGxMb2NrKCk7XG5cbiAgICAgIHNldExheWVyT3BhY2l0eShESU1NX09QQUNJVFkpO1xuXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsRGltbSwgeyBkdXJhdGlvbjogMCwgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMCB9KS50bygkbW9kYWxEaW1tLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgfSk7XG5cbiAgICAgIGdzYXBcbiAgICAgICAgLnRpbWVsaW5lKClcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwge1xuICAgICAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICBzY2FsZTogMC45NSxcbiAgICAgICAgICB5UGVyY2VudDogMixcbiAgICAgICAgfSlcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwgeyBkdXJhdGlvbjogMC4xNSwgb3BhY2l0eTogMSwgc2NhbGU6IDEsIHlQZXJjZW50OiAwLCBlYXNlOiAnUG93ZXIyLmVhc2VPdXQnIH0pO1xuXG4gICAgICAvLyDsiqTtgazroaQg7JyE7LmYIOyggOyepSDrsI8g7Iqk7YGs66GkIOyeoOq4iFxuICAgICAgLy8gY29tcG9uZW50LnNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICAgIC8vIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbm8tc2Nyb2xsJyk7XG4gICAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9IGAtJHtjb21wb25lbnQuc2Nyb2xsWX1weGA7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsRGltbSwge1xuICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAkbW9kYWxEaW1tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbENvbnRhaW5lciwge1xuICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgc2NhbGU6IDAuOTUsXG4gICAgICAgIHlQZXJjZW50OiAyLFxuICAgICAgICBlYXNlOiAnUG93ZXIyLmVhc2VPdXQnLFxuICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICRtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICRtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICRtb2RhbC5zdHlsZS56SW5kZXggPSBudWxsO1xuXG4gICAgICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XG5cbiAgICAgICAgICBkZXN0cm95KCk7XG5cbiAgICAgICAgICAkdGFyZ2V0LnJlbW92ZUNoaWxkKCRtb2RhbCk7XG5cbiAgICAgICAgICAvLyDsiqTtgazroaQg7J6g6riIIO2VtOygnCDrsI8g7JyE7LmYIOuzteybkFxuICAgICAgICAgIC8vIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XG4gICAgICAgICAgLy8gd2luZG93LnNjcm9sbFRvKDAsIGNvbXBvbmVudC5zY3JvbGxZKTtcbiAgICAgICAgICAvLyBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcnO1xuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBkaXNhYmxlU2Nyb2xsTG9jaygpO1xuXG5cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCAoKSA9PiB7XG4gICAgICBjbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLmRpbW1DbGljaykge1xuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxEaW1tU2VsZWN0b3IsIGNsb3NlKTtcbiAgICB9XG5cbiAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbEJ0blBvc2l0aXZlLCAoKSA9PiB7XG4gICAgICBpZiAocHJvcHMuY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5jYWxsYmFjaztcbiAgICAgIH0gZWxzZSBpZiAocHJvcHMucG9zaXRpdmVDYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IHByb3BzLnBvc2l0aXZlQ2FsbGJhY2s7XG4gICAgICB9XG5cbiAgICAgIGNsb3NlKCdidG5Qb3NpdGl2ZScpO1xuICAgIH0pO1xuICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsQnRuTmVnYXRpdmUsICgpID0+IHtcbiAgICAgIGNhbGxiYWNrID0gcHJvcHMubmVnYXRpdmVDYWxsYmFjaztcblxuICAgICAgY2xvc2UoJ2J0bk5lZ2F0aXZlJyk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNPcGVuZWQgPSBzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nO1xuXG4gICAgaWYgKGlzT3BlbmVkKSB7XG4gICAgICBhY3Rpb25zLm9wZW4oKTtcblxuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UuYWN0aXZhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UuZGVhY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ29wZW4nIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UodHJpZ2dlcikge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScsIHRyaWdnZXIgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcblxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqIElucHV0XG4gKi9cbmZ1bmN0aW9uIElucHV0KCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIC8vIHByb3BzXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBzdGF0ZVxuICAgIH0sXG4gICAgcmVuZGVyLFxuICApO1xuXG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnaW5wdXQnO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQsICRpbnB1dFRhcmdldCwgJGNoZWNrYm94cywgJGNoZWNrYm94TGVuZ3RoO1xuICBsZXQgaW5wdXRUeXBlLCBjaGVja2JveHM7XG5cbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcblxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgLy8gdGVtcGxhdGUsIHNlbGVjdG9yLCBlbGVtZW50LCBhY3Rpb25zXG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwVGVtcGxhdGUoKTsgLy8gZWxlbWVudOyXkOyEnCDsmpTshozrpbwg7LK07YGs7ZW07IScIO2FnO2UjOumv+yXkCDrk6TslrTqsIDrr4DroZwg7Iic7ISc6rCAIOuwlOuAnFxuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gc3RhdGVcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB7ICR0ZW1wbGF0ZUhUTUwgfSA9IGV0VUkudGVtcGxhdGVzLmlucHV0VG1wbCgpO1xuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XG4gICAgLy8gZXRVSS5sb2NhbGVzW2V0VUkuY29uZmlnLmxvY2FsZS5kZWZhdWx0XVxuICAgIGlmIChwcm9wcy5jbGVhcikge1xuICAgICAgJGlucHV0VGFyZ2V0Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJlbmQnLCAkdGVtcGxhdGVIVE1MLmNsZWFyQnV0dG9uKCkpO1xuICAgIH1cbiAgICBpZiAocHJvcHMudG9nZ2xlUGFzc3dvcmQpIHtcbiAgICAgICRpbnB1dFRhcmdldC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyZW5kJywgJHRlbXBsYXRlSFRNTC50b2dnbGVQYXNzd29yZCgpKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmxvYWRpbmcpIHtcbiAgICAgICRpbnB1dFRhcmdldC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyZW5kJywgJHRlbXBsYXRlSFRNTC5sb2FkaW5nKCkpO1xuICAgIH1cbiAgICBpZiAocHJvcHMuc2VhcmNoQm94KSB7XG4gICAgICAkaW5wdXRUYXJnZXQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmVuZCcsICR0ZW1wbGF0ZUhUTUwuc2VhcmNoQm94KCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgaWYgKCR0YXJnZXQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykpIHtcbiAgICAgIGNoZWNrYm94cyA9ICdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuICAgIGNvbnN0IGxhYmVsSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG5cbiAgICAvLyBhMTF5XG4gICAgLy8gZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAkc2VsZWN0TGFiZWwsICdpZCcsIGxhYmVsSWQpO1xuXG4gICAgJGlucHV0VGFyZ2V0ID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuXG4gICAgLy8gaWYgKCEkaW5wdXRUYXJnZXQpIHJldHVybjtcblxuICAgIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykpIHtcbiAgICAgIGlucHV0VHlwZSA9ICdmaWxlJztcbiAgICB9IGVsc2UgaWYgKCR0YXJnZXQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykpIHtcbiAgICAgIGlucHV0VHlwZSA9ICdjaGVja2JveCc7XG4gICAgfSBlbHNlIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpKSB7XG4gICAgICBpbnB1dFR5cGUgPSAncmFkaW8nO1xuICAgIH0gZWxzZSBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKSkge1xuICAgICAgaW5wdXRUeXBlID0gJ3Bhc3N3b3JkJztcbiAgICB9IGVsc2UgaWYgKCR0YXJnZXQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKSkge1xuICAgICAgaW5wdXRUeXBlID0gJ3RleHRhcmVhJztcbiAgICAgICRpbnB1dFRhcmdldCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXRUeXBlID0gJ3RleHQnO1xuICAgIH1cblxuICAgIC8vIGNvbXBvbmVudCBjdXN0b20gZWxlbWVudFxuICAgIGlmIChwcm9wcy5jb3VudCkge1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcudGV4dGFyZWEtY291bnQtdG90YWwnKS50ZXh0Q29udGVudCA9IHByb3BzLmNvdW50O1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcudGV4dGFyZWEtY291bnQnKS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmFsbENoZWNrKSB7XG4gICAgICAkY2hlY2tib3hMZW5ndGggPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hZ3JlZS1hcmVhIGlucHV0JykubGVuZ3RoO1xuICAgICAgJGNoZWNrYm94cyA9IFsuLi4kdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpXTtcbiAgICB9XG4gICAgaWYgKCRpbnB1dFRhcmdldC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHtcbiAgICAgICR0YXJnZXQuY2xhc3NMaXN0LmFkZCgnaW5wdXQtZGlzYWJsZWQnKVxuICAgIH1cbiAgICBpZiAoJGlucHV0VGFyZ2V0Lmhhc0F0dHJpYnV0ZSgncmVhZG9ubHknKSkge1xuICAgICAgJHRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dC1yZWFkb25seScpXG4gICAgfVxuICB9XG5cbiAgbGV0IHYgPSAnJztcblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge307XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge307XG5cbiAgICBhY3Rpb25zLmNoZWNrQnl0ZXMgPSAoZSkgPT4ge1xuICAgICAgY29uc3QgeyB0YXJnZXQgfSA9IGU7XG4gICAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICAgIGlmIChwcm9wcy5tdWx0aWJ5dGUpIHtcbiAgICAgICAgbGVuZ3RoID0gZXRVSS51dGlscy5jb3VudENoYXJhY3RlcnModGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlbmd0aCA9IHRhcmdldC52YWx1ZS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy5jb3VudExpbWl0KSB7XG4gICAgICAgIGlmIChsZW5ndGggPiBwcm9wcy5jb3VudCkge1xuICAgICAgICAgIHRhcmdldC52YWx1ZSA9IHY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdiA9IHRhcmdldC52YWx1ZTtcbiAgICAgICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYS1jb3VudC1udW0nKS50ZXh0Q29udGVudCA9IGxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcudGV4dGFyZWEtY291bnQtbnVtJykudGV4dENvbnRlbnQgPSBsZW5ndGg7XG5cbiAgICAgICAgaWYgKGxlbmd0aCA+IHByb3BzLmNvdW50KSB7XG4gICAgICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcudGV4dGFyZWEtY291bnQtbnVtJykuY2xhc3NMaXN0LmFkZCgnb3ZlcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnRleHRhcmVhLWNvdW50LW51bScpLmNsYXNzTGlzdC5yZW1vdmUoJ292ZXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBhY3Rpb25zLnNob3dDbGVhckJ1dHRvbiA9IChlKSA9PiB7XG4gICAgICBpZiAoJGlucHV0VGFyZ2V0LnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtZmllbGQtYnRuLmNsZWFyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dC1maWVsZC1idG4uY2xlYXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyDsnpDrj5nqsoDsg4kg7JiB7JetXG4gICAgYWN0aW9ucy5zZWFyY2hCb3ggPSAoZSkgPT4ge1xuICAgICAgaWYgKCEkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtYmFyLWJveCcpKSByZXR1cm47XG5cbiAgICAgIGlmICgkaW5wdXRUYXJnZXQudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtYmFyLWJveCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWJhci1ib3gnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFjdGlvbnMuY2xlYXJUZXh0ID0gKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgICRpbnB1dFRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgJGlucHV0VGFyZ2V0LmZvY3VzKCk7XG4gICAgICBhY3Rpb25zLnNob3dDbGVhckJ1dHRvbigpO1xuICAgICAgYWN0aW9ucy5zZWFyY2hCb3goKTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy50b2dnbGVQYXNzd29yZCA9ICh7IGN1cnJlbnRUYXJnZXQgfSkgPT4ge1xuICAgICAgaWYgKCRpbnB1dFRhcmdldC50eXBlID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICRpbnB1dFRhcmdldC50eXBlID0gJ3RleHQnO1xuICAgICAgICBjdXJyZW50VGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1zdGF0ZScpLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRpbnB1dFRhcmdldC50eXBlID0gJ3Bhc3N3b3JkJztcbiAgICAgICAgY3VycmVudFRhcmdldC5xdWVyeVNlbGVjdG9yKCcucGFzc3dvcmQtc3RhdGUnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIOyghOyytCDssrTtgawg67KE7Yq8XG4gICAgYWN0aW9ucy5hbGxDaGVjayA9ICh7dGFyZ2V0fSkgPT4ge1xuICAgICAgY29uc3QgYWxsQ2hlY2tCdG4gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbGwtYWdyZWUtaXRlbSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKVswXTtcbiAgICAgIGxldCBjaGVja2JveEVscyA9IHRhcmdldCA9PT0gYWxsQ2hlY2tCdG4gPyAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5hZ3JlZS1hcmVhJykgOiB0YXJnZXQuY2xvc2VzdCgnLmFncmVlLWl0ZW0nKS5xdWVyeVNlbGVjdG9yKCcuc3ViLWFncmVlLWl0ZW0nKTtcbiAgICAgIGNoZWNrYm94RWxzLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLmZvckVhY2goJGNoZWNrYm94ID0+ICRjaGVja2JveC5jaGVja2VkID0gdGFyZ2V0LmNoZWNrZWQpO1xuICAgIH1cblxuICAgIC8vIOyghOyytCBjaGVja2JveOydmCBjaGVja2VkIO2ZleyduFxuICAgIGFjdGlvbnMuY2hlY2tBbGxBZ3JlZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGFsbENoZWNrQnRuID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuYWxsLWFncmVlLWl0ZW0gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG4gICAgICBjb25zdCBjaGVja2JveExpc3QgPSBbLi4uJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCcuYWdyZWUtYXJlYSBpbnB1dCcpXTtcblxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgYWxsQ2hlY2tCdG4uY2hlY2tlZCA9IGNoZWNrYm94TGlzdC5ldmVyeSgoaXRlbSkgPT4gaXRlbS5jaGVja2VkKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyDshJzruIwgY2hlY2tib3jsnZggY2hlY2tlZCDtmZXsnbhcbiAgICBhY3Rpb25zLmNoZWNrQWxsU3ViQWdyZWUgPSAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgY29uc3QgYWdyZWVJdGVtID0gdGFyZ2V0LmNsb3Nlc3QoJy5hZ3JlZS1pdGVtJyk7XG4gICAgICBpZiAoIWFncmVlSXRlbSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBzdWJBbGxDaGVja0J0biA9IGFncmVlSXRlbS5xdWVyeVNlbGVjdG9yKCcuc3ViLWFsbC1hZ3JlZSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbiAgICAgIGNvbnN0IHN1YkNoZWNrYm94TGlzdCA9IFsuLi5hZ3JlZUl0ZW0ucXVlcnlTZWxlY3RvckFsbCgnLnN1Yi1hZ3JlZS1pdGVtIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpXTtcblxuICAgICAgaWYgKCFzdWJBbGxDaGVja0J0bikgcmV0dXJuO1xuXG4gICAgICBpZiAodGFyZ2V0ID09PSBzdWJBbGxDaGVja0J0bikge1xuICAgICAgICBzdWJDaGVja2JveExpc3QuZm9yRWFjaCgoY2hlY2tib3gpID0+IHtcbiAgICAgICAgICBjaGVja2JveC5jaGVja2VkID0gc3ViQWxsQ2hlY2tCdG4uY2hlY2tlZDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJBbGxDaGVja0J0bi5jaGVja2VkID0gc3ViQ2hlY2tib3hMaXN0LmV2ZXJ5KChjaGVja2JveCkgPT4gY2hlY2tib3guY2hlY2tlZCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGNvbnN0IHsgYWxsQ2hlY2ssIHN1YkNoZWNrIH0gPSBwcm9wcztcblxuICAgIGlmIChwcm9wcy5jbGVhcikge1xuICAgICAgYWRkRXZlbnQoJ2lucHV0JywgJ2lucHV0JywgYWN0aW9ucy5zaG93Q2xlYXJCdXR0b24pO1xuICAgICAgYWRkRXZlbnQoJ2lucHV0JywgJ3RleHRhcmVhJywgYWN0aW9ucy5zaG93Q2xlYXJCdXR0b24pO1xuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgJy5pbnB1dC1maWVsZC1idG4uY2xlYXInLCBhY3Rpb25zLmNsZWFyVGV4dCk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnNlYXJjaCkge1xuICAgICAgYWRkRXZlbnQoJ2lucHV0JywgJ2lucHV0JywgYWN0aW9ucy5zZWFyY2hCb3gpO1xuICAgIH1cblxuICAgIGlmIChpbnB1dFR5cGUgPT09ICd0ZXh0YXJlYScpIHtcbiAgICAgIGlmIChwcm9wcy5jb3VudCkgYWRkRXZlbnQoJ2lucHV0JywgJ3RleHRhcmVhJywgYWN0aW9ucy5jaGVja0J5dGVzKTtcbiAgICB9IGVsc2UgaWYgKGlucHV0VHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgfSBlbHNlIGlmIChpbnB1dFR5cGUgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgIGlmIChwcm9wcy50b2dnbGVQYXNzd29yZCkge1xuICAgICAgICBhZGRFdmVudCgnY2xpY2snLCAnLmlucHV0LWZpZWxkLWJ0bi5wYXNzd29yZC1zdGF0ZScsIGFjdGlvbnMudG9nZ2xlUGFzc3dvcmQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaW5wdXRUeXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICBpZiAoYWxsQ2hlY2spIHtcbiAgICAgICAgYWRkRXZlbnQoJ2NoYW5nZScsICcuYWxsLWFncmVlLWl0ZW0gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgYWN0aW9ucy5hbGxDaGVjayk7XG4gICAgICAgIGFkZEV2ZW50KCdjaGFuZ2UnLCAnLmFncmVlLWFyZWEgaW5wdXQnLCBhY3Rpb25zLmNoZWNrQWxsQWdyZWUpO1xuICAgICAgfVxuICAgICAgaWYgKHN1YkNoZWNrKSB7XG4gICAgICAgIGFkZEV2ZW50KCdjaGFuZ2UnLCAnLnN1Yi1hZ3JlZS1pdGVtIGlucHV0JywgYWN0aW9ucy5jaGVja0FsbFN1YkFncmVlKTtcbiAgICAgICAgYWRkRXZlbnQoJ2NoYW5nZScsICcuc3ViLWFsbC1hZ3JlZSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBhY3Rpb25zLmNoZWNrQWxsU3ViQWdyZWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyByZW5kZXJcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlbmd0aCgpIHtcbiAgICBpZiAoaW5wdXRUeXBlLm1hdGNoKC90ZXh0fHRleHRhcmVhfHBhc3N3b3JkL2cpKSB7XG4gICAgICByZXR1cm4gJGlucHV0VGFyZ2V0LnZhbHVlLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRCeXRlTGVuZ3RoKCkge1xuICAgIGlmIChpbnB1dFR5cGUubWF0Y2goL3RleHR8dGV4dGFyZWF8cGFzc3dvcmQvZykpIHtcbiAgICAgIHJldHVybiBldFVJLnV0aWxzLmNvdW50Q2hhcmFjdGVycygkaW5wdXRUYXJnZXQudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUNsZWFyQnV0dG9uKCkge1xuICAgIGV0VUkudXRpbHMudHJpZ2dlckV2ZW50KCRpbnB1dFRhcmdldCwgJ2lucHV0Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG93TG9hZGluZyhib29sID0gdHJ1ZSkge1xuICAgIGlmIChib29sKSB7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dC1maWVsZC1pY28uc3Bpbm5lcicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dC1maWVsZC1pY28uc3Bpbm5lcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICAvLyBjYWxsYWJsZVxuICAgIHVwZGF0ZSxcbiAgICBnZXRMZW5ndGgsXG4gICAgZ2V0Qnl0ZUxlbmd0aCxcbiAgICB1cGRhdGVDbGVhckJ1dHRvbixcbiAgICBzaG93TG9hZGluZyxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiBsb3R0aWVcbiAqL1xuZnVuY3Rpb24gTG90dGllKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIGxvb3A6IHRydWUsXG4gICAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgIHNjcm9sbDogZmFsc2UsXG4gICAgICAvLyBwcm9wc1xuICAgIH0sXG4gICAge1xuICAgICAgLy8gc3RhdGVcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBNQVJHSU4gPSAyMDtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ2xvdHRpZSc7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldDtcbiAgbGV0IGxvdHRpZUluc3RhbmNlO1xuXG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBfJHRhcmdldFxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcignVGFyZ2V0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIC8vIHRlbXBsYXRlLCBzZWxlY3RvciwgZWxlbWVudCwgYWN0aW9uc1xuICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBzdGF0ZVxuICAgIC8vIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZVxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge31cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgbG90dGllSW5zdGFuY2UgPSBsb3R0aWUubG9hZEFuaW1hdGlvbih7XG4gICAgICBjb250YWluZXI6ICR0YXJnZXQsIC8vIHRoZSBkb20gZWxlbWVudCB0aGF0IHdpbGwgY29udGFpbiB0aGUgYW5pbWF0aW9uXG4gICAgICByZW5kZXJlcjogJ3N2ZycsXG4gICAgICBsb29wOiBwcm9wcy5sb29wLFxuICAgICAgYXV0b3BsYXk6IHByb3BzLnNjcm9sbCA/IGZhbHNlIDogcHJvcHMuYXV0b3BsYXksXG4gICAgICBwYXRoOiBgJHtldFVJLmNvbmZpZy5sb3R0aWUuYmFzZVBhdGh9LyR7cHJvcHMubmFtZX0uanNvbmAsIC8vIHRoZSBwYXRoIHRvIHRoZSBhbmltYXRpb24ganNvblxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLnNjcm9sbCkge1xuICAgICAgU2Nyb2xsVHJpZ2dlci5jcmVhdGUoe1xuICAgICAgICB0cmlnZ2VyOiAkdGFyZ2V0LFxuICAgICAgICBzdGFydDogJ3RvcCBib3R0b20nLFxuICAgICAgICBlbmQ6ICdib3R0b20gdG9wJyxcbiAgICAgICAgbWFya2VyczogdHJ1ZSxcbiAgICAgICAgb25FbnRlcjogKCkgPT4ge1xuICAgICAgICAgIGxvdHRpZUluc3RhbmNlLnBsYXkoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25FbnRlckJhY2s6ICgpID0+IHtcbiAgICAgICAgICBsb3R0aWVJbnN0YW5jZS5wbGF5KCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTGVhdmU6ICgpID0+IHtcbiAgICAgICAgICBsb3R0aWVJbnN0YW5jZS5wYXVzZSgpO1xuICAgICAgICB9LFxuICAgICAgICBvbkxlYXZlQmFjazogKCkgPT4ge1xuICAgICAgICAgIGxvdHRpZUluc3RhbmNlLnBhdXNlKCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7fVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge31cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gcmVuZGVyXG4gIH1cblxuICBmdW5jdGlvbiBwbGF5KCkge1xuICAgIGxvdHRpZUluc3RhbmNlLnBsYXkoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgbG90dGllSW5zdGFuY2Uuc3RvcCgpO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICAvLyBjYWxsYWJsZVxuICAgIHVwZGF0ZSxcbiAgICBwbGF5LFxuICAgIHN0b3AsXG4gICAgZ2V0TG90dGllSW5zdGFuY2U6ICgpID0+IGxvdHRpZUluc3RhbmNlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqICBNb2RhbFxuICovXG5mdW5jdGlvbiBNb2RhbCgpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvLyBwcm9wc1xuICAgICAgZGltbUNsaWNrOiB0cnVlLFxuICAgICAgY2xpY2tPdXRzaWRlOiBmYWxzZSxcbiAgICAgIGVzYzogdHJ1ZSxcbiAgICAgIHR5cGU6ICdkZWZhdWx0JyxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0YXRlXG4gICAgfSxcbiAgICByZW5kZXIsLy9cbiAgKTtcblxuICBjb25zdCB7IG1lZGlhUXVlcnlBY3Rpb24gfSA9IGV0VUkuaG9va3MudXNlTWVkaWFRdWVyeSgpO1xuICAvLyBjb25zdGFudFxuICBjb25zdCBESU1NX09QQUNJVFkgPSBldFVJLmNvbmZpZy5sYXllci5kaW1tT3BhY2l0eTtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ21vZGFsJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuXG4gIGxldCBmb2N1c1RyYXBJbnN0YW5jZSwgbW9kYWxEaW1tU2VsZWN0b3IsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciwgY2xpY2tPdXRzaWRlQ2xlYW51cDtcbiAgbGV0ICR0YXJnZXQsICRtb2RhbFRpdGxlLCAkbW9kYWxDb250YWluZXIsICRtb2RhbERpbW0sICRtb2RhbENvbnRlbnQ7XG4gIGxldCBfY2FsbGJhY2s7XG5cbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcblxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIGZvY3VzIHRyYXBcbiAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xuICAgICAgZXNjYXBlRGVhY3RpdmF0ZXM6IHByb3BzLmVzYyxcbiAgICAgIG9uQWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSxcbiAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUsXG4gICAgICBhbGxvd091dHNpZGVDbGljazogcHJvcHMuY2xpY2tPdXRzaWRlID8gdHJ1ZSA6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gc3RhdGVcbiAgICAvLyBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcblxuICAgIGlmIChzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nKSB7XG4gICAgICBhY3Rpb25zLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgLy8gJHRhcmdldC5pbm5lckhUTUwgPSBgYDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gc2VsZWN0b3JcbiAgICBtb2RhbENsb3NlQnRuU2VsZWN0b3IgPSAnLm1vZGFsLWNsb3NlJztcbiAgICBtb2RhbERpbW1TZWxlY3RvciA9ICcubW9kYWwtZGltbSc7XG5cbiAgICAvLyBlbGVtZW50XG4gICAgJG1vZGFsVGl0bGUgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC10aXQnKTtcbiAgICAkbW9kYWxEaW1tID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKG1vZGFsRGltbVNlbGVjdG9yKTtcbiAgICAkbW9kYWxDb250YWluZXIgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1jb250YWluZXInKTtcbiAgICAkbW9kYWxDb250ZW50ID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY29udGVudCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG5cbiAgICAvLyBhMTF5XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAncm9sZScsICdkaWFsb2cnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdpZCcsIGlkKTtcbiAgICBpZiAoJG1vZGFsVGl0bGUpIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJG1vZGFsVGl0bGUsICdpZCcsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ2FyaWEtbGFiZWxsZWRieScsIHRpdGxlSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ3RhYmluZGV4JywgJy0xJyk7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBjb25zdCB7IGdldFRvcERlcHRoLCBzZXRMYXllck9wYWNpdHksIGVuYWJsZVNjcm9sbExvY2ssIGRpc2FibGVTY3JvbGxMb2NrIH0gPSBldFVJLmhvb2tzLnVzZUxheWVyKCk7XG5cbiAgICBhY3Rpb25zLmZvY3VzQWN0aXZhdGUgPSAoKSA9PiB7fTtcblxuICAgIGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlID0gKCkgPT4ge1xuICAgICAgY2xvc2UoKTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgJHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XG4gICAgICBlbmFibGVTY3JvbGxMb2NrKCk7XG5cbiAgICAgIGlmICgkbW9kYWxEaW1tKSBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsRGltbSwge2R1cmF0aW9uOiAwLCBkaXNwbGF5OiAnYmxvY2snLCBvcGFjaXR5OiAwfSkudG8oJG1vZGFsRGltbSwgeyBkdXJhdGlvbjogMC4xNSwgb3BhY2l0eTogMSB9KTtcblxuICAgICAgZ3NhcFxuICAgICAgICAudGltZWxpbmUoKVxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7IGR1cmF0aW9uOiAwLCBkaXNwbGF5OiAnZmxleCcgfSlcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwge1xuICAgICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyxcbiAgICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICAgY29uc3QgY2xpZW50SGVpZ2h0ID0gJG1vZGFsQ29udGVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxIZWlnaHQgPSAkbW9kYWxDb250ZW50LnNjcm9sbEhlaWdodDtcblxuICAgICAgICAgICAgLy8gYTExeTog7Iqk7YGs66Gk7ZWgIOy7qO2FkOy4oOqwgCDsnojsnYQg6rK97JqwIHRhYmluZGV4IOy2lOqwgFxuICAgICAgICAgICAgaWYgKGNsaWVudEhlaWdodCA8IHNjcm9sbEhlaWdodCkge1xuICAgICAgICAgICAgICAkbW9kYWxDb250ZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJG1vZGFsQ29udGVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChfY2FsbGJhY2spIHtcbiAgICAgICAgX2NhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy5jbGlja091dHNpZGUpIHtcbiAgICAgICAgY2xpY2tPdXRzaWRlQ2xlYW51cCA9IHVzZUNsaWNrT3V0c2lkZSgkdGFyZ2V0LCAoKSA9PiB7XG4gICAgICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgICAgICAgfSwgW3Byb3BzLnRyaWdnZXJCdG5dKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGlmIChjbGlja091dHNpZGVDbGVhbnVwKSB7XG4gICAgICAgIGNsaWNrT3V0c2lkZUNsZWFudXAoKTtcbiAgICAgIH1cblxuICAgICAgLy8gaW5wdXQg7J6I7J2EIOuVjCB2YWx1ZeqwkiDstIjquLDtmZRcbiAgICAgIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykpIHtcbiAgICAgICAgY29uc3QgaW5wdXRzID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuICAgICAgICBpbnB1dHMuZm9yRWFjaCgkaW5wdXQgPT4ge1xuICAgICAgICAgICRpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoJG1vZGFsRGltbSkge1xuICAgICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsRGltbSwge1xuICAgICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAgICRtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbENvbnRhaW5lciwge1xuICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgZWFzZTogJ1Bvd2VyMi5lYXNlT3V0JyxcbiAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAkbW9kYWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAkdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAgICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcbiAgICAgICAgICBkaXNhYmxlU2Nyb2xsTG9jaygpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsQ2xvc2VCdG5TZWxlY3RvciwgY2xvc2UpO1xuXG4gICAgaWYgKHByb3BzLmRpbW1DbGljaykge1xuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxEaW1tU2VsZWN0b3IsIGNsb3NlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgbGV0IGlzT3BlbmVkID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcbiAgICBjb25zdCB7IHR5cGUgfSA9IHByb3BzO1xuXG4gICAgaWYgKGlzT3BlbmVkKSB7XG4gICAgICBhY3Rpb25zLm9wZW4oKTtcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmFjdGl2YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmRlYWN0aXZhdGUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKGNhbGxiYWNrKSB7XG4gICAgX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ29wZW4nIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsImZ1bmN0aW9uIFNlbGVjdEJveCgpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICB0eXBlOiAnY3VzdG9tJyxcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgaXRlbXM6IFtdLFxuICAgICAgc2VsZWN0ZWRJbmRleDogMCxcbiAgICAgIHRyYW5zaXRpb246ICdmYXN0JyxcbiAgICAgIHNjcm9sbFRvOiBmYWxzZSxcbiAgICAgIGdzYXBPcHRpb246IHt9LFxuICAgICAgc3RhdGU6ICdjbG9zZScsXG4gICAgfSxcbiAgICB7fSxcbiAgICByZW5kZXIsXG4gICk7XG4gIGNvbnN0IHsgJHRlbXBsYXRlQ3VzdG9tSFRNTCwgJHRlbXBsYXRlQmFzaWNIVE1MIH0gPSBldFVJLnRlbXBsYXRlcy5zZWxlY3RCb3hUbXBsKCk7XG4gIGNvbnN0IHsgdXNlU2VsZWN0U2hvdywgc2VsZWN0RGltbVNob3csIHNlbGVjdERpbW1DbG9zZSB9ID0gZXRVSS5ob29rcy51c2VUcmFuc2l0aW9uKCk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdzZWxlY3QnO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgbGV0ICR0YXJnZXQsXG4gICAgLy8g7JqU7IaM6rSA66CoIOuzgOyImOuTpFxuICAgIHNlbGVjdExhYmVsLFxuICAgIHNlbGVjdENvbWJvQm94LFxuICAgIHNlbGVjdExpc3RCb3gsXG4gICAgc2VsZWN0T3B0aW9uLFxuICAgIHRpbWVsaW5lLFxuICAgIHNlbGVjdENsb3NlLFxuICAgIHNlbGVjdERpbW07XG5cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0LWxpc3QnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgICBzZXR1cFRlbXBsYXRlKCk7XG5cbiAgICBpZiAocHJvcHMudHlwZSA9PT0gJ2Jhc2ljJykgcmV0dXJuO1xuXG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gZWZmZWN0XG4gICAgdGltZWxpbmUgPSB1c2VTZWxlY3RTaG93KCR0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3RMaXN0Qm94KSwgcHJvcHMudHJhbnNpdGlvbiwgcHJvcHMuZ3NhcE9wdGlvbikudGltZWxpbmU7XG5cbiAgICAvLyBzdGF0ZVxuICAgIGFjdGlvbnNbcHJvcHMuc3RhdGUgfHwgc3RhdGUuc3RhdGVdPy4oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuXG4gICAgZGVzdHJveSgpO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gJ2JvdHRvbVNoZWV0Jykge1xuICAgICAgJHRhcmdldC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGA8ZGl2IGNsYXNzPVwic2VsZWN0LWRpbW1cIj48L2Rpdj5gKVxuICAgIH1cblxuICAgIC8vIG9wdGlvbnPqsJIgc2NyaXB066GcIOuEo+ydhCDrlYxcbiAgICBpZiAocHJvcHMuaXRlbXMubGVuZ3RoIDwgMSkgcmV0dXJuO1xuICAgIGlmIChwcm9wcy50eXBlID09PSAnY3VzdG9tJykge1xuICAgICAgY29uc3QgeyBzZWxlY3RlZEluZGV4IH0gPSBwcm9wcztcbiAgICAgIGNvbnN0IGl0ZW1MaXN0VGVtcCA9IHByb3BzLml0ZW1zLm1hcCgoaXRlbSkgPT4gJHRlbXBsYXRlQ3VzdG9tSFRNTC5pdGVtcyhpdGVtKSkuam9pbignJyk7XG5cbiAgICAgICR0YXJnZXQuaW5uZXJIVE1MID0gYFxuICAgICAgICAke3Byb3BzLmxhYmVsICYmICR0ZW1wbGF0ZUN1c3RvbUhUTUwubGFiZWwocHJvcHMubGFiZWwpfVxuICAgICAgICAke3Byb3BzLmRlZmF1bHQgPyAkdGVtcGxhdGVDdXN0b21IVE1MLnNlbGVjdEJ0bihwcm9wcy5kZWZhdWx0KSA6ICR0ZW1wbGF0ZUN1c3RvbUhUTUwuc2VsZWN0QnRuKHByb3BzLml0ZW1zLmZpbmQoKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT0gcHJvcHMuaXRlbXNbc2VsZWN0ZWRJbmRleF0udmFsdWUpLnRleHQpfVxuICAgICAgICAke3Byb3BzLml0ZW1zICYmICR0ZW1wbGF0ZUN1c3RvbUhUTUwuaXRlbXNXcmFwKGl0ZW1MaXN0VGVtcCl9XG4gICAgICBgO1xuICAgIH0gIGVsc2Uge1xuICAgICAgY29uc3Qgc2VsZWN0QnRuVGVtcCA9ICR0ZW1wbGF0ZUJhc2ljSFRNTC5zZWxlY3RCdG4ocHJvcHMuZGVmYXVsdCk7XG4gICAgICBjb25zdCBpdGVtTGlzdFRlbXAgPSBwcm9wcy5pdGVtcy5tYXAoKGl0ZW0pID0+ICR0ZW1wbGF0ZUJhc2ljSFRNTC5pdGVtcyhpdGVtKSkuam9pbignJyk7XG5cbiAgICAgICR0YXJnZXQuaW5uZXJIVE1MID0gYFxuICAgICAgICAke3Byb3BzLmxhYmVsICYmICR0ZW1wbGF0ZUJhc2ljSFRNTC5sYWJlbChwcm9wcy5sYWJlbCl9XG4gICAgICAgICR7cHJvcHMuaXRlbXMgJiYgJHRlbXBsYXRlQmFzaWNIVE1MLml0ZW1zV3JhcChzZWxlY3RCdG5UZW1wICsgaXRlbUxpc3RUZW1wKX1cbiAgICAgIGA7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgc2VsZWN0TGFiZWwgPSAnLmNvbWJvLWxhYmVsJztcbiAgICBzZWxlY3RDb21ib0JveCA9ICcuc2VsZWN0LWJveCc7XG4gICAgc2VsZWN0TGlzdEJveCA9ICcuc2VsZWN0LW9wdGlvbnMnO1xuICAgIHNlbGVjdE9wdGlvbiA9ICcub3B0aW9uJztcbiAgICBzZWxlY3REaW1tID0gJy5zZWxlY3QtZGltbSc7XG4gICAgc2VsZWN0Q2xvc2UgPSAnLnNlbGVjdC1jbG9zZSc7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcbiAgICBjb25zdCBsYWJlbElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IGNvbWJvQm94SWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoJ2NvbWJvYm94Jyk7XG4gICAgY29uc3QgbGlzdEJveElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKCdsaXN0Ym94Jyk7XG5cbiAgICAvLyBhMTF5XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMYWJlbCwgJ2lkJywgbGFiZWxJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgJ2lkJywgY29tYm9Cb3hJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgJ3JvbGUnLCAnY29tYm9ib3gnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCAnYXJpYS1sYWJlbGxlZGJ5JywgbGFiZWxJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgJ2FyaWEtY29udHJvbHMnLCBsaXN0Qm94SWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgJ2lkJywgbGlzdEJveElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsICdyb2xlJywgJ2xpc3Rib3gnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsICdhcmlhLWxhYmVsbGVkYnknLCBsYWJlbElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gsICd0YWJpbmRleCcsIC0xKTtcblxuICAgIC8vIHNlbGVjdCBwcm9wZXJ0eVxuICAgIGNvbnN0IG9wdGlvbnMgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0T3B0aW9uKTtcbiAgICBvcHRpb25zLmZvckVhY2goKGVsLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9uSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoJ29wdGlvbicpO1xuXG4gICAgICAkdGFyZ2V0W2luZGV4XSA9IGVsO1xuICAgICAgZWxbJ2luZGV4J10gPSBpbmRleDtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnaWQnLCBvcHRpb25JZCk7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnb3B0aW9uJyk7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG5cbiAgICAgIHByb3BzLml0ZW1zW2luZGV4XT8uZGlzYWJsZWQgJiYgZWwuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTtcblxuICAgICAgaWYgKCEkdGFyZ2V0WydvcHRpb25zJ10pICR0YXJnZXRbJ29wdGlvbnMnXSA9IFtdO1xuICAgICAgJHRhcmdldFsnb3B0aW9ucyddW2luZGV4XSA9IGVsO1xuICAgIH0pO1xuXG4gICAgIXByb3BzLmRlZmF1bHQgJiYgc2VsZWN0SXRlbShvcHRpb25zW3Byb3BzLnNlbGVjdGVkSW5kZXhdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBsZXQgc2VsZWN0SW5kZXggPSBpc05hTigkdGFyZ2V0LnNlbGVjdGVkSW5kZXgpID8gLTEgOiAkdGFyZ2V0LnNlbGVjdGVkSW5kZXg7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVJbmRleChzdGF0ZSkge1xuICAgICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xuICAgICAgc2VsZWN0SW5kZXggPSBpc05hTigkdGFyZ2V0LnNlbGVjdGVkSW5kZXgpID8gLTEgOiAkdGFyZ2V0LnNlbGVjdGVkSW5kZXg7XG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3MoJHRhcmdldFtzZWxlY3RJbmRleF0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBrZXlFdmVudENhbGxiYWNrKCkge1xuICAgICAgdXBkYXRlQ3VycmVudENsYXNzKCR0YXJnZXRbc2VsZWN0SW5kZXhdKTtcbiAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCAkdGFyZ2V0W3NlbGVjdEluZGV4XS5pZCk7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7c2VsZWN0Q29tYm9Cb3h9IDpsYXN0LWNoaWxkYCkudGV4dENvbnRlbnQgPSAkdGFyZ2V0W3NlbGVjdEluZGV4XS50ZXh0Q29udGVudDtcbiAgICB9XG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdENvbWJvQm94KT8uZm9jdXMoKTtcbiAgICAgIG9wZW5TdGF0ZSgpO1xuICAgICAgdXBkYXRlSW5kZXgodHJ1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge1xuICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3NlbGVjdENvbWJvQm94fSA6bGFzdC1jaGlsZGApLnRleHRDb250ZW50ID0gJHRhcmdldFsnb3B0aW9ucyddWyR0YXJnZXQuc2VsZWN0ZWRJbmRleF0/LnRleHRDb250ZW50ID8/IHByb3BzLmRlZmF1bHQ7XG4gICAgICBjbG9zZVN0YXRlKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmN1cnJlbnQnKTtcbiAgICAgIHNlbGVjdEl0ZW0oY3VycmVudEVsKTtcbiAgICAgIGNsb3NlU3RhdGUoKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZmlyc3QgPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9IDA7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmxhc3QgPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9ICR0YXJnZXRbJ29wdGlvbnMnXS5sZW5ndGggLSAxO1xuICAgICAga2V5RXZlbnRDYWxsYmFjaygpO1xuICAgIH07XG4gICAgYWN0aW9ucy51cCA9ICgpID0+IHtcbiAgICAgIHNlbGVjdEluZGV4ID0gTWF0aC5tYXgoLS1zZWxlY3RJbmRleCwgMCk7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRvd24gPSAoKSA9PiB7XG4gICAgICBzZWxlY3RJbmRleCA9IE1hdGgubWluKCsrc2VsZWN0SW5kZXgsICR0YXJnZXRbJ29wdGlvbnMnXS5sZW5ndGggLSAxKTtcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcbiAgICB9O1xuXG4gICAgY29tcG9uZW50Lm9wZW4gPSBhY3Rpb25zLm9wZW47XG4gICAgY29tcG9uZW50LmNsb3NlID0gYWN0aW9ucy5jbG9zZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGlmIChwcm9wcy50eXBlID09PSAnYmFzaWMnIHx8ICR0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3QtZGlzYWJsZWQnKSkgcmV0dXJuO1xuXG4gICAgLy8gYTExeVxuICAgIGNvbnN0IGFjdGlvbkxpc3QgPSB7XG4gICAgICB1cDogWydBcnJvd1VwJ10sXG4gICAgICBkb3duOiBbJ0Fycm93RG93biddLFxuICAgICAgZmlyc3Q6IFsnSG9tZScsICdQYWdlVXAnXSxcbiAgICAgIGxhc3Q6IFsnRW5kJywgJ1BhZ2VEb3duJ10sXG4gICAgICBjbG9zZTogWydFc2NhcGUnXSxcbiAgICAgIHNlbGVjdDogWydFbnRlcicsICcgJ10sXG4gICAgfTtcblxuICAgIGFkZEV2ZW50KCdibHVyJywgc2VsZWN0Q29tYm9Cb3gsIChlKSA9PiB7XG4gICAgICBpZiAoZS5yZWxhdGVkVGFyZ2V0Py5yb2xlID09PSAnbGlzdGJveCcpIHJldHVybjtcbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGFkZEV2ZW50KCdjbGljaycsIHNlbGVjdENvbWJvQm94LCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgY29uc3QgdG9nZ2xlU3RhdGUgPSBzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nID8gJ2Nsb3NlJyA6ICdvcGVuJztcbiAgICAgIGFjdGlvbnNbdG9nZ2xlU3RhdGVdPy4oKTtcbiAgICB9KTtcblxuICAgIC8vIGExMXlcbiAgICBhZGRFdmVudCgna2V5ZG93bicsIHNlbGVjdENvbWJvQm94LCAoZSkgPT4ge1xuICAgICAgaWYgKHN0YXRlLnN0YXRlID09PSAnY2xvc2UnKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHsga2V5IH0gPSBlO1xuICAgICAgY29uc3QgYWN0aW9uID0gT2JqZWN0LmVudHJpZXMoYWN0aW9uTGlzdCkuZmluZCgoW18sIGtleXNdKSA9PiBrZXlzLmluY2x1ZGVzKGtleSkpO1xuXG4gICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgW2FjdGlvbk5hbWVdID0gYWN0aW9uO1xuICAgICAgICBhY3Rpb25zW2FjdGlvbk5hbWVdPy4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZEV2ZW50KCdjbGljaycsIHNlbGVjdExpc3RCb3gsICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICBpZiAodGFyZ2V0LnJvbGUgIT09ICdvcHRpb24nKSByZXR1cm47XG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3ModGFyZ2V0KTtcbiAgICAgIGFjdGlvbnMuc2VsZWN0KCk7XG4gICAgfSk7XG5cbiAgICAvLyDrsJTthYAg7Iuc7Yq4IO2DgOyeheydvOuVjCBkaW1tLCBjbG9zZSDrsoTtirwg64iM66CA7J2EIOuVjCDri6vtnphcbiAgICBpZiAocHJvcHMudHlwZSA9PT0gJ2JvdHRvbVNoZWV0Jykge1xuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgc2VsZWN0RGltbSwgYWN0aW9ucy5jbG9zZSlcbiAgICAgIGFkZEV2ZW50KCdjbGljaycsIHNlbGVjdENsb3NlLCBhY3Rpb25zLmNsb3NlKVxuICAgIH1cblxuICAgIGV0VUkuaG9va3MudXNlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdyZXNpemUnLCAoKSA9PiB7XG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc09wZW5lZCA9IHN0YXRlLnN0YXRlID09PSAnb3Blbic7XG4gICAgcHJvcHMudHJhbnNpdGlvbiAmJiB0aW1lbGluZShpc09wZW5lZCk7XG4gICAgY2hlY2tPcGVuRGlyKGlzT3BlbmVkKTtcblxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsICdhcmlhLWV4cGFuZGVkJywgaXNPcGVuZWQpO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJyk7XG4gICAgaWYgKGlzT3BlbmVkKSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCAnYXJpYS1hY3RpdmVkZXNjZW5kYW50Jywgc2VsZWN0ZWRFbD8uaWQgPz8gJycpO1xuICAgIGVsc2UgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsICcnKTtcbiAgfVxuXG4gIC8vIGN1c3RvbVxuICBmdW5jdGlvbiBjaGVja09wZW5EaXIoc3RhdGUpIHtcbiAgICBpZiAoIXN0YXRlIHx8IHByb3BzLnNjcm9sbFRvKSByZXR1cm47IC8vIGZhbHNl7J206rGw64KYIHNjcm9sbFRvIOq4sOuKpSDsnojsnYQg65WMIC0g7JWE656Y66GcIOyXtOumvFxuXG4gICAgY29uc3QgeyBoZWlnaHQ6IGxpc3RIZWlnaHQgfSA9IGV0VUkuaG9va3MudXNlR2V0Q2xpZW50UmVjdCgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94KTtcbiAgICBjb25zdCB7IGhlaWdodDogY29tYm9IZWlnaHQsIGJvdHRvbTogY29tYm9Cb3R0b20gfSA9IGV0VUkuaG9va3MudXNlR2V0Q2xpZW50UmVjdCgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCk7XG4gICAgY29uc3Qgcm9sZSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIE1BUkdJTiA8IGNvbWJvQm90dG9tICsgbGlzdEhlaWdodDtcblxuICAgIGV0VUkudXRpbHMuc2V0U3R5bGUoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgJ2JvdHRvbScsIHJvbGUgPyBjb21ib0hlaWdodCArICdweCcgOiAnJyk7XG4gIH1cblxuICAvLyB1cGRhdGUgLmN1cnJlbnQgY2xhc3NcbiAgZnVuY3Rpb24gdXBkYXRlQ3VycmVudENsYXNzKGFkZENsYXNzRWwpIHtcbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50Jyk/LmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQnKTtcbiAgICBhZGRDbGFzc0VsPy5jbGFzc0xpc3QuYWRkKCdjdXJyZW50Jyk7XG4gIH1cblxuICAvLyBzZWxlY3QgaXRlbVxuICBmdW5jdGlvbiBzZWxlY3RJdGVtKHRhcmdldCkge1xuICAgIGNvbnN0IHRhcmdldE9wdGlvbiA9IHRhcmdldD8uY2xvc2VzdChzZWxlY3RPcHRpb24pO1xuXG4gICAgaWYgKCF0YXJnZXRPcHRpb24pIHJldHVybjtcblxuICAgICR0YXJnZXQuc2VsZWN0ZWRJbmRleCA9IHRhcmdldE9wdGlvblsnaW5kZXgnXTtcbiAgICAkdGFyZ2V0LnZhbHVlID0gdGFyZ2V0T3B0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpO1xuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJywgJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgdGFyZ2V0T3B0aW9uLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRydWUpO1xuXG4gICAgdXBkYXRlQ3VycmVudENsYXNzKCR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykpO1xuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtzZWxlY3RDb21ib0JveH0gOmxhc3QtY2hpbGRgKS50ZXh0Q29udGVudCA9IHRhcmdldE9wdGlvbi50ZXh0Q29udGVudDtcbiAgfVxuXG4gIC8vIHNlbGVjdCBzdGF0ZVxuICBmdW5jdGlvbiBvcGVuU3RhdGUoKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ29wZW4nIH0pO1xuICAgIHByb3BzLnR5cGUgPT09ICdib3R0b21TaGVldCcgJiYgc2VsZWN0RGltbVNob3coJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdERpbW0pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlU3RhdGUoKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBudWxsO1xuICAgIHByb3BzLnR5cGUgPT09ICdib3R0b21TaGVldCcgJiYgc2VsZWN0RGltbUNsb3NlKCR0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3REaW1tKSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcblxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gICAgc2VsZWN0SXRlbSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiBTd2lwZXJDb21wXG4gKi9cbmZ1bmN0aW9uIFN3aXBlckNvbXAoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRTdGF0ZSwgc2V0UHJvcHMsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgbG9vcDogZmFsc2UsXG4gICAgICBvYnNlcnZlcjogdHJ1ZSxcbiAgICAgIC8vIHVwZGF0ZU9uV2luZG93UmVzaXplOiBmYWxzZSxcbiAgICAgIG9uOiB7XG4gICAgICAgIHNsaWRlQ2hhbmdlVHJhbnNpdGlvbkVuZCgpIHtcbiAgICAgICAgICBzZXRTdGF0ZSh7IGFjdGl2ZUluZGV4OiB0aGlzLnJlYWxJbmRleCArIDEgfSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhdGU6ICcnLFxuICAgICAgcnVubmluZzogJycsXG4gICAgICBhY3RpdmVJbmRleDogMCxcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvKipcbiAgICogZGF0YS1wcm9wcyDrpqzsiqTtirhcbiAgICovXG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdzd2lwZXInO1xuICBsZXQgY29tcG9uZW50ID0ge30sXG4gICAgY2xhc3NOYW1lID0gJyc7XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCAkdGFyZ2V0LCAkc3dpcGVyLCAkc3dpcGVyTmF2aWdhdGlvbiwgJHN3aWVwclByb2dyZXNzO1xuICBsZXQgc3dpcGVyQnV0dG9uUHJldiwgc3dpcGVyQnV0dG9uTmV4dCwgc3dpcGVyUGFnaW5hdGlvbiwgc3dpcGVyQXV0b3BsYXksICRzd2lwZXJTbGlkZVRvQnV0dG9uO1xuICBsZXQgZXhjZXB0aW9uQ2xhc3NOYW1lLCBzd2lwZXJMZW5ndGgsIHN3aXBlclBlclZpZXc7XG5cbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgLy8gdGVtcGxhdGUsIHNlbGVjdG9yLCBlbGVtZW50LCBhY3Rpb25zXG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIHN0YXRlXG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAocHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB7IG5hdmlnYXRpb24sIHBhZ2luYXRpb24sIHBhZ2luYXRpb25UeXBlLCBwYWdpbmF0aW9uQ2xhc3MsIG5hdmlnYXRpb25DbGFzcyAsYXV0b3BsYXksIGZyZWVNb2RlLCBpbmRpY2F0b3JUZXh0cyB9ID0gcHJvcHM7IC8vIEFkZCBpbmRpY2F0b3JUZXh0cyBoZXJlXG4gICAgY29uc3QgeyAkdGVtcGxhdGVIVE1MIH0gPSBldFVJLnRlbXBsYXRlcy5zd2lwZXJUbXBsKCk7XG4gICAgbGV0IHN3aXBlckNvbnRyb2xzO1xuXG4gICAgY29uc3QgJHN3aXBlckNvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgJHN3aXBlckNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ3N3aXBlci1jb250cm9scycpO1xuXG4gICAgaWYgKCR0YXJnZXQucXVlcnlTZWxlY3RvcignLnN3aXBlci1jb250cm9scycpKSB7XG4gICAgICBzd2lwZXJDb250cm9scyA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnN3aXBlci1jb250cm9scycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2lwZXJDb250cm9scyA9ICRzd2lwZXJDb250cm9scztcbiAgICAgICR0YXJnZXQuYXBwZW5kQ2hpbGQoc3dpcGVyQ29udHJvbHMpO1xuICAgIH1cblxuICAgIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItc2xpZGUnKS5sZW5ndGggPCAyICYmICEkdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZmxvdycpKSB7XG4gICAgICBzd2lwZXJDb250cm9scy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIHN3aXBlckNvbnRyb2xzLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmF2aWdhdGlvbikge1xuICAgICAgc3dpcGVyQ29udHJvbHMuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCAkdGVtcGxhdGVIVE1MLm5hdmlnYXRpb24obmF2aWdhdGlvbkNsYXNzKSk7XG4gICAgICAvLyBpZiAodHlwZW9mIG5hdmlnYXRpb24gPT09ICdib29sZWFuJyAmJiAhJHRhcmdldC5xdWVyeVNlbGVjdG9yKHN3aXBlckJ1dHRvblByZXYpICYmICEkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyQnV0dG9uTmV4dCkpIHtcbiAgICAgIC8vICAgc3dpcGVyQ29udHJvbHMuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCAkdGVtcGxhdGVIVE1MLm5hdmlnYXRpb24obmF2aWdhdGlvbkNsYXNzKSk7XG4gICAgICAvLyB9XG5cbiAgICAgIC8vIGlmIChuYXZpZ2F0aW9uID09PSAnZXhjZXB0aW9uJykge1xuICAgICAgLy8gICBjb25zdCBleGNlcHRpb25Db250cm9sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihleGNlcHRpb25DbGFzc05hbWUpO1xuICAgICAgLy8gICBzZXRQcm9wcyh7XG4gICAgICAvLyAgICAgbmF2aWdhdGlvbjoge1xuICAgICAgLy8gICAgICAgcHJldkVsOiBleGNlcHRpb25Db250cm9sLnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyQnV0dG9uUHJldiksXG4gICAgICAvLyAgICAgICBuZXh0RWw6IGV4Y2VwdGlvbkNvbnRyb2wucXVlcnlTZWxlY3Rvcihzd2lwZXJCdXR0b25OZXh0KSxcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICB9KTtcbiAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyAgIHNldFByb3BzKHtcbiAgICAgIC8vICAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICAvLyAgICAgICBwcmV2RWw6ICR0YXJnZXQucXVlcnlTZWxlY3Rvcihzd2lwZXJCdXR0b25QcmV2KSxcbiAgICAgIC8vICAgICAgIG5leHRFbDogJHRhcmdldC5xdWVyeVNlbGVjdG9yKHN3aXBlckJ1dHRvbk5leHQpLFxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gfVxuICAgIH1cblxuICAgIGlmIChmcmVlTW9kZSkge1xuICAgICAgc2V0UHJvcHMoe1xuICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocGFnaW5hdGlvbikge1xuICAgICAgISR0YXJnZXQucXVlcnlTZWxlY3Rvcihzd2lwZXJQYWdpbmF0aW9uKSAmJiBzd2lwZXJDb250cm9scy5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICR0ZW1wbGF0ZUhUTUwucGFnaW5hdGlvbihwYWdpbmF0aW9uQ2xhc3MpKTtcbiAgICAgIHNldFByb3BzKHtcbiAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgIGVsOiAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyUGFnaW5hdGlvbiksXG4gICAgICAgICAgdHlwZTogcGFnaW5hdGlvblR5cGUgPyBwYWdpbmF0aW9uVHlwZSA6ICdmcmFjdGlvbicsXG4gICAgICAgICAgY2xpY2thYmxlOiBwYWdpbmF0aW9uVHlwZSA9PT0gJ2J1bGxldHMnID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGF1dG9wbGF5KSB7XG4gICAgICAhJHRhcmdldC5xdWVyeVNlbGVjdG9yKHN3aXBlckF1dG9wbGF5KSAmJiBzd2lwZXJDb250cm9scy5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICR0ZW1wbGF0ZUhUTUwuYXV0b3BsYXkoKSk7XG4gICAgfVxuXG4gICAgaWYgKGluZGljYXRvclRleHRzICYmIGluZGljYXRvclRleHRzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIEFkZCBpbmRpY2F0b3JzIHNldHVwIGhlcmVcbiAgICAgIGNvbnN0IGluZGljYXRvclRleHRzID0gSlNPTi5wYXJzZSgkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wcm9wcy1pbmRpY2F0b3ItdGV4dHMnKSB8fCAnW10nKTtcbiAgICAgIGNvbnN0IGluZGljYXRvcnNIVE1MID0gYDxkaXYgY2xhc3M9XCJzd2lwZXItaW5kaWNhdG9yc1wiPjwvZGl2PmA7XG4gICAgICAkdGFyZ2V0Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgaW5kaWNhdG9yc0hUTUwpO1xuICAgICAgY29uc3QgaW5kaWNhdG9yc0VsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLWluZGljYXRvcnMnKTtcbiAgICAgIHNldFByb3BzKHtcbiAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgIGVsOiBpbmRpY2F0b3JzRWwsXG4gICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIHJlbmRlckJ1bGxldDogZnVuY3Rpb24gKGluZGV4LCBjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCInICsgY2xhc3NOYW1lICsgJ1wiPicgKyBpbmRpY2F0b3JUZXh0c1tpbmRleF0gKyAnPC9zcGFuPic7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGJyZWFrcG9pbnRzXG4gICAgaWYgKHByb3BzLmJyZWFrcG9pbnRzKSB7XG4gICAgICBjb25zdCAkYnJlYWtwb2ludHMgPSBPYmplY3QudmFsdWVzKHByb3BzLmJyZWFrcG9pbnRzKVswXTtcbiAgICAgIGNvbnN0ICRrZXkgPSBPYmplY3Qua2V5cygkYnJlYWtwb2ludHMpO1xuICAgICAgY29uc3QgJHZhbHVlID0gT2JqZWN0LnZhbHVlcygkYnJlYWtwb2ludHMpO1xuXG4gICAgICBjb25zdCBuZXdCcmVha3BvaW50cyA9IHt9O1xuXG4gICAgICAka2V5LmZvckVhY2goKF9rZXksIGlkeCkgPT4ge1xuICAgICAgICBpZiAoIWlzTmFOKE51bWJlcigkdmFsdWVbaWR4XSkpKSB7XG4gICAgICAgICAgbmV3QnJlYWtwb2ludHNbX2tleV0gPSBOdW1iZXIoJHZhbHVlW2lkeF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0JyZWFrcG9pbnRzW19rZXldID0gJHZhbHVlW2lkeF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBzZXRQcm9wcyh7XG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICAgICAgMTAyNDogeyAuLi5uZXdCcmVha3BvaW50cyB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICBzd2lwZXJQYWdpbmF0aW9uID0gJy5zd2lwZXItcGFnaW5hdGlvbic7XG4gICAgc3dpcGVyQnV0dG9uUHJldiA9ICcuc3dpcGVyLWJ1dHRvbi1wcmV2JztcbiAgICBzd2lwZXJCdXR0b25OZXh0ID0gJy5zd2lwZXItYnV0dG9uLW5leHQnO1xuICAgIHN3aXBlckF1dG9wbGF5ID0gJy5zd2lwZXItYXV0b3BsYXknO1xuICAgIGV4Y2VwdGlvbkNsYXNzTmFtZSA9ICR0YXJnZXQ/LmRhdGFzZXQ/LmV4Y2VwdGlvbkNsYXNzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG5cbiAgICAvLyBhMTF5XG5cbiAgICAvLyBuZXcgU3dpcGVyIOyDneyEsVxuICAgICRzd2lwZXIgPSBuZXcgU3dpcGVyKCR0YXJnZXQucXVlcnlTZWxlY3RvcignLnN3aXBlci1jb250YWluZXInKSwgeyAuLi5wcm9wcyB9KTtcblxuICAgICRzd2lwZXJOYXZpZ2F0aW9uID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLW5hdmlnYXRpb24nKTtcbiAgICAkc3dpZXByUHJvZ3Jlc3MgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItcHJvZ3Jlc3MnKTtcblxuICAgIHN3aXBlckxlbmd0aCA9ICRzd2lwZXIuc2xpZGVzLmxlbmd0aDtcbiAgICBzd2lwZXJQZXJWaWV3ID0gJHN3aXBlci5wYXJhbXMuc2xpZGVzUGVyVmlldztcblxuICAgIGlmIChzd2lwZXJMZW5ndGggPD0gc3dpcGVyUGVyVmlldykge1xuICAgICAgaWYgKCRzd2lwZXJOYXZpZ2F0aW9uKSAkc3dpcGVyTmF2aWdhdGlvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgaWYgKCRzd2llcHJQcm9ncmVzcykgJHN3aWVwclByb2dyZXNzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIC8vIGFjdGlvbnMuc3RhcnQgPSAoKSA9PiB7XG4gICAgLy8gICBwbGF5KCk7XG4gICAgLy8gfTtcbiAgICAvL1xuICAgIC8vIGFjdGlvbnMuc3RvcCA9ICgpID0+IHtcbiAgICAvLyAgIHN0b3AoKTtcbiAgICAvLyB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgLy8gYXV0b3BsYXkg67KE7Yq8XG4gICAgaWYgKHByb3BzLmF1dG9wbGF5KSB7XG4gICAgICBhZGRFdmVudCgnY2xpY2snLCBzd2lwZXJBdXRvcGxheSwgKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0ICRldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KHN3aXBlckF1dG9wbGF5KTtcbiAgICAgICAgaGFuZGxlQXV0b3BsYXkoJGV2ZW50VGFyZ2V0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyByZW5kZXJcbiAgfVxuXG4gIC8vIGF1dG9wbGF5IOq0gOugqCDsu6TsiqTthYAg7ZWo7IiYXG4gIGZ1bmN0aW9uIGhhbmRsZUF1dG9wbGF5KCR0YXJnZXQpIHtcbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ3BsYXknKTtcbiAgICAkdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ3N0b3AnKTtcblxuICAgIGlmICgkdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc3RvcCcpKSB7XG4gICAgICBzdG9wKCk7XG4gICAgfSBlbHNlIGlmICgkdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncGxheScpKSB7XG4gICAgICBwbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGxheSgpIHtcbiAgICAkc3dpcGVyLmF1dG9wbGF5LnN0YXJ0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wKCkge1xuICAgICRzd2lwZXIuYXV0b3BsYXkuc3RvcCgpO1xuICB9XG5cbiAgLy8g7Yq57KCVIOyKrOudvOydtOuTnOuhnCDsnbTrj5lcbiAgLy8gZnVuY3Rpb24gbW92ZVRvU2xpZGUoaW5kZXgsIHNwZWVkLCBydW5DYWxsYmFja3MpIHtcbiAgLy8gICBpZiAocHJvcHMubG9vcCkge1xuICAvLyAgICAgJHN3aXBlci5zbGlkZVRvTG9vcChpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcyk7XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgICRzd2lwZXIuc2xpZGVUbyhpbmRleCk7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgLy8gY2FsbGFibGVcbiAgICB1cGRhdGUsXG4gICAgcGxheSxcbiAgICBzdG9wLFxuICAgIGhhbmRsZUF1dG9wbGF5LFxuICAgIGdldFN3aXBlckluc3RhbmNlKCkge1xuICAgICAgcmV0dXJuICRzd2lwZXI7IC8vICRzd2lwZXIg7J247Iqk7YS07IqkIOuwmO2ZmFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogVGFiXG4gKi9cbmZ1bmN0aW9uIFRhYigpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvLyBwcm9wc1xuICAgIH0sXG4gICAge1xuICAgICAgLy8gc3RhdGVcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ3RhYic7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCwgdGFiSGVhZCwgJHRhYkhlYWRFbCwgdGFiQnRuLCAkdGFiQnRuRWwsIHRhYkNvbnRlbnQsICR0YWJDb250ZW50RWw7XG5cbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcblxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIGVmZmVjdFxuICAgIHByb3BzLnN0aWNreSAmJiBzdGlja3lUYWIoKTtcblxuICAgIC8vIHN0YXRlXG4gICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogc3RhdGUuYWN0aXZlID8/ICR0YWJCdG5FbFswXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiLXZhbHVlJykgfSk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgLy8gJHRhcmdldC5pbm5lckhUTUwgPSBgYDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gc2VsZWN0b3JcbiAgICB0YWJIZWFkID0gJy50YWItaGVhZCc7XG4gICAgdGFiQnRuID0gJy50YWItbGFiZWwnO1xuICAgIHRhYkNvbnRlbnQgPSAnLnRhYi1jb250ZW50JztcblxuICAgIC8vIGVsZW1lbnRcbiAgICAkdGFiSGVhZEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKHRhYkhlYWQpO1xuICAgICR0YWJCdG5FbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCh0YWJCdG4pO1xuICAgICR0YWJDb250ZW50RWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwodGFiQ29udGVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcbiAgICAvLyBhMTF5XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCB0YWJIZWFkLCAncm9sZScsICd0YWJsaXN0Jyk7XG5cbiAgICAvLyBjb21wb25lbnQgY3VzdG9tIGVsZW1lbnRcbiAgICAkdGFiSGVhZEVsLnN0eWxlLnRvdWNoQWN0aW9uID0gJ25vbmUnO1xuICAgICR0YWJCdG5FbC5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCB0YWJCdG5JZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcbiAgICAgIGNvbnN0IHRhYkNvbnRlbnRJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRCgndGFicGFuZWwnKTtcblxuICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnaWQnLCB0YWJCdG5JZCk7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xuICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcblxuICAgICAgaWYgKCR0YWJDb250ZW50RWxbaW5kZXhdKSB7XG4gICAgICAgICR0YWJDb250ZW50RWxbaW5kZXhdLnNldEF0dHJpYnV0ZSgnaWQnLCB0YWJDb250ZW50SWQpO1xuICAgICAgICAkdGFiQ29udGVudEVsW2luZGV4XS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcblxuICAgICAgICBjb25zdCB0YWJDb250ZW50VmFsdWUgPSAkdGFiQ29udGVudEVsW2luZGV4XS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiLXZhbHVlJyk7XG4gICAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYCR7dGFiQnRufVtkYXRhLXRhYi12YWx1ZT1cIiR7dGFiQ29udGVudFZhbHVlfVwiXWAsICdhcmlhLWNvbnRyb2xzJywgJHRhYkNvbnRlbnRFbFtpbmRleF0uaWQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0YWJWYWx1ZSA9IHRhYi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiLXZhbHVlJyk7XG4gICAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIGAke3RhYkNvbnRlbnR9W2RhdGEtdGFiLXZhbHVlPVwiJHt0YWJWYWx1ZX1cIl1gLCAnYXJpYS1sYWJlbGxlZGJ5JywgdGFiLmlkKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBsZXQgc3RhcnRYID0gMDtcbiAgICBsZXQgZW5kWCA9IDA7XG4gICAgbGV0IG1vdmVYID0gMDtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IDA7XG4gICAgbGV0IGlzUmVhZHlNb3ZlID0gZmFsc2U7XG4gICAgbGV0IGNsaWNrYWJsZSA9IHRydWU7XG5cbiAgICBhY3Rpb25zLnNlbGVjdCA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY29uc3QgdGFyZ2V0QnRuID0gZS50YXJnZXQuY2xvc2VzdCh0YWJCdG4pO1xuICAgICAgaWYgKCF0YXJnZXRCdG4pIHJldHVybjtcbiAgICAgIGlmICghY2xpY2thYmxlKSByZXR1cm47XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiB0YXJnZXRCdG4uZ2V0QXR0cmlidXRlKCdkYXRhLXRhYi12YWx1ZScpIH0pO1xuICAgICAgZ3NhcC50bygkdGFiSGVhZEVsLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXG4gICAgICAgIHNjcm9sbExlZnQ6IHRhcmdldEJ0bi5vZmZzZXRMZWZ0IC0gMjQsXG4gICAgICAgIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLmRyYWdTdGFydCA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKGlzUmVhZHlNb3ZlKSByZXR1cm47XG4gICAgICBpc1JlYWR5TW92ZSA9IHRydWU7XG4gICAgICBzdGFydFggPSBlLng7XG4gICAgICBzY3JvbGxMZWZ0ID0gJHRhYkhlYWRFbC5zY3JvbGxMZWZ0O1xuICAgIH07XG4gICAgYWN0aW9ucy5kcmFnTW92ZSA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKCFpc1JlYWR5TW92ZSkgcmV0dXJuO1xuICAgICAgbW92ZVggPSBlLng7XG4gICAgICAkdGFiSGVhZEVsLnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0ICsgKHN0YXJ0WCAtIG1vdmVYKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZHJhZ0VuZCA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKCFpc1JlYWR5TW92ZSkgcmV0dXJuO1xuICAgICAgZW5kWCA9IGUueDtcbiAgICAgIGlmIChNYXRoLmFicyhzdGFydFggLSBlbmRYKSA8IDEwKSBjbGlja2FibGUgPSB0cnVlO1xuICAgICAgZWxzZSBjbGlja2FibGUgPSBmYWxzZTtcbiAgICAgIGlzUmVhZHlNb3ZlID0gZmFsc2U7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRyYWdMZWF2ZSA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKCFpc1JlYWR5TW92ZSkgcmV0dXJuO1xuXG4gICAgICAvLyBnc2FwLnRvKCR0YWJIZWFkRWwsIHtcbiAgICAgIC8vICAgc2Nyb2xsTGVmdDogJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKS5vZmZzZXRMZWZ0LFxuICAgICAgLy8gICBvdmVyd3JpdGU6IHRydWUsXG4gICAgICAvLyB9KTtcblxuICAgICAgY2xpY2thYmxlID0gdHJ1ZTtcbiAgICAgIGlzUmVhZHlNb3ZlID0gZmFsc2U7XG4gICAgfTtcblxuICAgIGFjdGlvbnMudXAgPSAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSByZXR1cm47XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmdldEF0dHJpYnV0ZSgnZGF0YS10YWItdmFsdWUnKSB9KTtcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRvd24gPSAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcpIHJldHVybjtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiLXZhbHVlJykgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5maXJzdCA9ICgpID0+IHtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6ICR0YWJCdG5FbFswXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiLXZhbHVlJykgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG4gICAgYWN0aW9ucy5sYXN0ID0gKCkgPT4ge1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogJHRhYkJ0bkVsWyR0YWJCdG5FbC5sZW5ndGggLSAxXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiLXZhbHVlJykgfSk7XG4gICAgICBmb2N1c1RhcmdldFZhbHVlKHRhYkJ0biwgc3RhdGUuYWN0aXZlVmFsdWUpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBmb2N1c1RhcmdldFZhbHVlKGVsLCB2YWx1ZSkge1xuICAgICAgY29uc3QgZm9jdXNUYXJnZXQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7ZWx9W2RhdGEtdGFiLXZhbHVlPVwiJHt2YWx1ZX1cIl1gKTtcbiAgICAgIGZvY3VzVGFyZ2V0Py5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGNvbnN0IGFjdGlvbkxpc3QgPSB7XG4gICAgICB1cDogWydBcnJvd0xlZnQnXSxcbiAgICAgIGRvd246IFsnQXJyb3dSaWdodCddLFxuICAgICAgZmlyc3Q6IFsnSG9tZSddLFxuICAgICAgbGFzdDogWydFbmQnXSxcbiAgICAgIHNlbGVjdDogWydFbnRlcicsICcgJ10sXG4gICAgfTtcblxuICAgIGFkZEV2ZW50KCdjbGljaycsIHRhYkhlYWQsIGFjdGlvbnMuc2VsZWN0KTtcbiAgICBhZGRFdmVudCgncG9pbnRlcmRvd24nLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdTdGFydCk7XG4gICAgYWRkRXZlbnQoJ3BvaW50ZXJtb3ZlJywgdGFiSGVhZCwgYWN0aW9ucy5kcmFnTW92ZSk7XG4gICAgYWRkRXZlbnQoJ3BvaW50ZXJ1cCcsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ0VuZCk7XG4gICAgYWRkRXZlbnQoJ3BvaW50ZXJsZWF2ZScsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ0xlYXZlKTtcblxuICAgIGFkZEV2ZW50KCdrZXlkb3duJywgdGFiSGVhZCwgKGUpID0+IHtcbiAgICAgIGNvbnN0IHsga2V5IH0gPSBlO1xuICAgICAgY29uc3QgYWN0aW9uID0gT2JqZWN0LmVudHJpZXMoYWN0aW9uTGlzdCkuZmluZCgoW18sIGtleXNdKSA9PiBrZXlzLmluY2x1ZGVzKGtleSkpO1xuXG4gICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgY29uc3QgW2FjdGlvbk5hbWVdID0gYWN0aW9uO1xuICAgICAgICBhY3Rpb25zW2FjdGlvbk5hbWVdPy4oZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgZ2V0SWQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7dGFiQnRufVthcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXWApPy5pZDtcblxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScsICdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYCR7dGFiQnRufVtkYXRhLXRhYi12YWx1ZT1cIiR7c3RhdGUuYWN0aXZlVmFsdWV9XCJdYCwgJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKTtcblxuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHt0YWJDb250ZW50fVthcmlhLWxhYmVsbGVkYnk9XCIke2dldElkfVwiXWApPy5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3RhYkNvbnRlbnR9W2RhdGEtdGFiLXZhbHVlPVwiJHtzdGF0ZS5hY3RpdmVWYWx1ZX1cIl1gKT8uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICB9XG5cbiAgLy8gY3VzdG9tXG4gIGZ1bmN0aW9uIHN0aWNreVRhYigpIHtcbiAgICBjb25zdCB7IGJvdHRvbSB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KGRvY3VtZW50LCBwcm9wcy5zdGlja3kpO1xuXG4gICAgJHRhcmdldC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgJHRhYkhlYWRFbC5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knO1xuICAgIGlmICghYm90dG9tKSAkdGFiSGVhZEVsLnN0eWxlLnRvcCA9IDAgKyAncHgnO1xuICAgIGVsc2UgJHRhYkhlYWRFbC5zdHlsZS50b3AgPSBib3R0b20gKyAncHgnO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0T2Zmc2V0TGVmdCgpIHtcbiAgICBjb25zdCB0YXJnZXRCdG4gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpO1xuICAgIGlmICghdGFyZ2V0QnRuKSByZXR1cm47XG5cbiAgICBnc2FwLnNldCgkdGFiSGVhZEVsLCB7XG4gICAgICBzY3JvbGxMZWZ0OiB0YXJnZXRCdG4ub2Zmc2V0TGVmdCAtIDI0LFxuICAgICAgb3ZlcndyaXRlOiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgc2V0T2Zmc2V0TGVmdCxcbiAgICB1cGRhdGUsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsImZ1bmN0aW9uIFRvYXN0KCkge1xuICBjb25zdCB7XG4gICAgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50LFxuICB9ID0gZXRVSS5ob29rcy51c2VDb3JlKHtcbiAgICAvLyBwcm9wc1xuICAgIHR5cGU6ICdiYXNpYycsXG4gICAgbWVzc2FnZTogJ+uplOyEuOyngOulvCDsp4DsoJXtlbQg7KO87IS47JqULicsXG4gIH0sIHtcbiAgICAvLyBzdGF0ZVxuXG4gIH0sIHJlbmRlcik7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICd0b2FzdCc7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQsICR0b2FzdDtcbiAgbGV0IHRvYXN0VHJpZ2dlckJ0biwgdG9hc3RDbG9zZUJ0bjtcblxuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJyl7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldClcbiAgICB9ZWxzZXtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZighJHRhcmdldCl7XG4gICAgICB0aHJvdyBFcnJvcigndGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQgKTtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG5cbiAgICAvLyAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIC8vIHNldHVwVGVtcGxhdGUoKTtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuXG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCl7XG4gICAgdG9hc3RUcmlnZ2VyQnRuID0gJy50b2FzdC10cmlnZ2VyLWJ0bic7XG4gICAgdG9hc3RDbG9zZUJ0biA9ICcudG9hc3QtY2xvc2UtYnRuJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBzZXQgaWRcbiAgICBjb25zdCBpZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcbiAgICAvLyBjb25zdCB0aXRsZUlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUgKyAnLXRpdCcpO1xuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdG9hc3QsICdpZCcsIGlkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEFuaW1hdGlvbiAobmV3VG9hc3QsIGlubmVyVG9hc3QpIHtcbiAgICAvLyDqsJzrs4Qg7YOA7J6E65287J24IOyDneyEsVxuICAgIGNvbnN0IHRsID0gZ3NhcC50aW1lbGluZSgpO1xuXG4gICAgdGwuZnJvbVRvKG5ld1RvYXN0LCB7XG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgICAgbWFyZ2luQm90dG9tOiAwLFxuICAgIH0sIHtcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBkdXJhdGlvbjogMC41LFxuICAgICAgaGVpZ2h0OiBpbm5lclRvYXN0LmNsaWVudEhlaWdodCxcbiAgICAgIG1hcmdpbkJvdHRvbTogJzAuOHJlbScsXG4gICAgfSlcbiAgICAudG8obmV3VG9hc3QsIHtcbiAgICAgIGRlbGF5OiAzLFxuICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgIG5ld1RvYXN0LnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKXtcbiAgICBjb25zdCB7ICR0ZW1wbGF0ZUhUTUwsICR0ZW1wbGF0Q2xvc2VIVE1MLCAkdGVtcGxhdGVMaW5rSFRNTCB9ID0gZXRVSS50ZW1wbGF0ZXMudG9hc3RUbXBsKCk7XG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29tcG9uZW50LXRvYXN0JylcblxuICAgICAgaWYgKHByb3BzLnR5cGUgPT09ICdiYXNpYycpIHtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICR0ZW1wbGF0ZUhUTUwocHJvcHMpXG4gICAgICB9IGVsc2UgaWYgKHByb3BzLnR5cGUgPT09ICdjbG9zZScpIHtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICR0ZW1wbGF0Q2xvc2VIVE1MKHByb3BzKVxuICAgICAgfSBlbHNlIGlmIChwcm9wcy50eXBlID09PSAnbGluaycpIHtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICR0ZW1wbGF0ZUxpbmtIVE1MKHByb3BzKVxuICAgICAgfVxuICAgICAgJHRhcmdldC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgJHRvYXN0ID0gY29udGFpbmVyO1xuXG4gICAgICBzZXRBbmltYXRpb24gKCR0b2FzdCwgJHRvYXN0LnF1ZXJ5U2VsZWN0b3IoJy50b2FzdC1jb250YWluZXInKSk7XG4gICAgfVxuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICh7dGFyZ2V0fSkgPT4ge1xuICAgICAgdGFyZ2V0LmNsb3Nlc3QoJy5jb21wb25lbnQtdG9hc3QnKS5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCB0b2FzdENsb3NlQnRuLCBhY3Rpb25zLmNsb3NlKVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIC8vIHJlbmRlclxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBzZXR1cEFjdGlvbnMoKTtcbiAgICBhY3Rpb25zLm9wZW4oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgLy8gY2FsbGFibGVcbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfVxuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqIFRvb2x0aXBcbiAqL1xuZnVuY3Rpb24gVG9vbHRpcCgpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICB0eXBlOiAnZGVmYXVsdCcsXG4gICAgICBkdXJhdGlvbjogMC4yLFxuICAgICAgaGVpZ2h0OiAnYXV0bycsXG4gICAgICB0cmFuc2Zvcm06IHtcbiAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICB4OiAxLFxuICAgICAgICAgIHk6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zbGF0ZToge1xuICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgeTogMCxcbiAgICAgICAgfSxcbiAgICAgICAgZGVsYXk6IDAsXG4gICAgICAgIGVhc2luZzogJ3Bvd2VyNC5vdXQnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHN0YXRlOiAnY2xvc2UnLFxuICAgIH0sXG4gICAgcmVuZGVyLFxuICApO1xuICBjb25zdCB7IGZpcnN0Tm9kZUZvY3VzT3V0LCBsYXN0Tm9kZUZvY3VzT3V0IH0gPSBldFVJLmhvb2tzLnVzZUExMXlLZXlFdmVudCgpO1xuICBjb25zdCB7IG1lZGlhUXVlcnlBY3Rpb24gfSA9IGV0VUkuaG9va3MudXNlTWVkaWFRdWVyeSgpO1xuXG4gIC8vIHN0YXRlIOuzgOqyvSDsi5wg656c642UIOyerO2YuOy2nFxuICBjb25zdCBuYW1lID0gJ3Rvb2x0aXAnO1xuICBsZXQgY29tcG9uZW50ID0ge307XG4gIGxldCBjbGVhbnVwcyA9IFtdO1xuXG4gIC8vIOyalOyGjOq0gOugqCDrs4DsiJjrk6RcbiAgbGV0ICR0YXJnZXQsICR0b29sdGlwQ29udGFpbmVyLCAkb3BlbkJ0biwgJGNsb3NlQnRuLCAkb3BlbmRpbSwgJHRvb2x0aXBEaW07XG4gIGxldCB0b29sdGlwQ2xvc2VCdG4sIHRvb2x0aXBUcmlnZ2VyQnRuLCB0b29sdGlwRGltO1xuICBsZXQgZm9jdXNUcmFwSW5zdGFuY2U7XG4gIGxldCB0b29sdGlwQ29udGFpbmVyWDtcbiAgbGV0IGJvZHlXaWR0aDtcblxuICAvLyDrsJjsnZHtmJVcbiAgbGV0IGlzTW9iaWxlID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtYXgtd2lkdGg6IDEwMjRweCknKS5tYXRjaGVzO1xuXG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBfJHRhcmdldFxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcignVGFyZ2V0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIHNldFRhcmdldCgkdGFyZ2V0KTtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG5cbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGF0YS1pbml0JywgJ3RydWUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBmb2N1cyB0cmFwXG4gICAgZm9jdXNUcmFwSW5zdGFuY2UgPSBmb2N1c1RyYXAuY3JlYXRlRm9jdXNUcmFwKCR0YXJnZXQsIHtcbiAgICAgIGVzY2FwZURlYWN0aXZhdGVzOiBwcm9wcy5lc2MsXG4gICAgICBvbkFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzQWN0aXZhdGUsXG4gICAgICBvbkRlYWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNEZWFjdGl2YXRlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZVxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBldFVJLnV0aWxzLmFsbENsZWFudXBzKGNsZWFudXBzKTtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge31cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIGVsZW1lbnRcbiAgICAkdG9vbHRpcENvbnRhaW5lciA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnRvb2x0aXAtY29udGFpbmVyJyk7XG4gICAgLy8gc2VsZWNvdHJcbiAgICB0b29sdGlwVHJpZ2dlckJ0biA9ICcudG9vbHRpcC1idG4tdHJpZ2dlcic7XG4gICAgdG9vbHRpcENsb3NlQnRuID0gJy50b29sdGlwLWJ0bi1jbG9zZSc7XG4gICAgJHRvb2x0aXBEaW0gPSAnLmRpbSc7XG4gICAgdG9vbHRpcERpbSA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmRpbScpOyAvLyAwNjE2IGRpbSB0eXBlIOy2lOqwgFxuICAgICRvcGVuQnRuID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKHRvb2x0aXBUcmlnZ2VyQnRuKTtcbiAgICAkY2xvc2VCdG4gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IodG9vbHRpcENsb3NlQnRuKTtcbiAgICAkb3BlbmRpbSA9IHRvb2x0aXBEaW07IC8vIDA2MTYgZGltIHR5cGUgdG9vbHRpcERpbSDrs4DsiJjsl5Ag7KeB7KCRIO2VoOuLuVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG5cbiAgICAvLyBhMTF5XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCB0aXRsZUlkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XG4gICAgICBpZiAoaXNNb2JpbGUgJiYgdG9vbHRpcERpbSkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGVja092ZXJmbG93ID0gKCkgPT4ge1xuICAgICAgICBib2R5V2lkdGggPSAkdG9vbHRpcENvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIDMwO1xuICAgICAgICB0b29sdGlwQ29udGFpbmVyWCA9ICR0b29sdGlwQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLng7XG4gICAgICAgIGlmICh0b29sdGlwQ29udGFpbmVyWCA8IDApIHtcbiAgICAgICAgICAkdG9vbHRpcENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdy1sZWZ0Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAodG9vbHRpcENvbnRhaW5lclggPiBib2R5V2lkdGgpIHtcbiAgICAgICAgICAkdG9vbHRpcENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdy1yaWdodCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBzZXRBbmltYXRpb24gPSB7IGR1cmF0aW9uOiAwLCBkaXNwbGF5OiAnbm9uZScsIG9wYWNpdHk6IDAgfTtcbiAgICAgIGlmIChwcm9wcy50eXBlID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgZ3NhcFxuICAgICAgICAgIC50aW1lbGluZSgpXG4gICAgICAgICAgLnRvKCR0b29sdGlwQ29udGFpbmVyLCBzZXRBbmltYXRpb24pXG4gICAgICAgICAgLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sXG4gICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIG9uVXBkYXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGNoZWNrT3ZlcmZsb3coKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy50eXBlID09PSAnY3VzdG9tJykge1xuICAgICAgICBnc2FwXG4gICAgICAgICAgLnRpbWVsaW5lKClcbiAgICAgICAgICAudG8oJHRvb2x0aXBDb250YWluZXIsIHNldEFuaW1hdGlvbilcbiAgICAgICAgICAudG8oJHRvb2x0aXBDb250YWluZXIsIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbixcbiAgICAgICAgICAgIHNjYWxlOiAxLFxuICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICBvblVwZGF0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICBjaGVja092ZXJmbG93KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkY2xvc2VCdG4gJiYgJGNsb3NlQnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgIGlmICgkY2xvc2VCdG4pIHtcbiAgICAgICAgJGNsb3NlQnRuLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXJDbGFzcyA9ICR0b29sdGlwQ29udGFpbmVyLmNsYXNzTGlzdFxuICAgICAgY29uc3Qgc2NhbGUgPSBwcm9wcy50cmFuc2Zvcm0uc2NhbGUueDtcbiAgICAgIGNvbnN0IHsgdHlwZSB9ID0gcHJvcHNcblxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IG51bGw7XG5cbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkdG9vbHRpcENvbnRhaW5lciwge1xuICAgICAgICBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sXG4gICAgICAgIGRpc3BsYXk6ICdub25lJyxcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgIGNvbnRhaW5lckNsYXNzLmNvbnRhaW5zKCdvdmVyZmxvdy1sZWZ0JykgJiYgY29udGFpbmVyQ2xhc3MucmVtb3ZlKCdvdmVyZmxvdy1sZWZ0Jyk7XG4gICAgICAgICAgY29udGFpbmVyQ2xhc3MuY29udGFpbnMoJ292ZXJmbG93LXJpZ2h0JykgJiYgY29udGFpbmVyQ2xhc3MucmVtb3ZlKCdvdmVyZmxvdy1yaWdodCcpO1xuXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkY2xvc2VCdG4gJiYgJGNsb3NlQnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgJHRvb2x0aXBDb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICB0eXBlID09PSAnY3VzdG9tJyAmJiBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBzY2FsZTogc2NhbGUsIGRpc3BsYXk6ICdub25lJywgb3BhY2l0eTogMCB9KTtcbiAgICAgIHR5cGUgPT09ICdkZWZhdWx0JyAmJiBnc2FwLnRpbWVsaW5lKCkudG8oJHRvb2x0aXBDb250YWluZXIsIHsgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLCBkaXNwbGF5OiAnbm9uZScsIG9wYWNpdHk6IDAgfSk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSA9ICgpID0+IHt9O1xuXG4gICAgYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUgPSAoKSA9PiB7XG4gICAgICBpZiAoIXN0YXRlLnRyaWdnZXIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBwcm9wcy5uZWdhdGl2ZUNhbGxiYWNrO1xuICAgICAgfVxuICAgICAgYWN0aW9ucy5jbG9zZSgpO1xuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UuZGVhY3RpdmF0ZSgpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBldFVJLmhvb2tzLnVzZUV2ZW50TGlzdGVuZXIod2luZG93LCAncmVzaXplJywgKCkgPT4ge1xuICAgICAgaXNNb2JpbGUgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogMTAyNHB4KScpLm1hdGNoZXM7XG4gICAgfSk7XG5cbiAgICBldFVJLmhvb2tzLnVzZUV2ZW50TGlzdGVuZXIoZG9jdW1lbnQuYm9keSwgJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGlmIChzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nKSB7XG4gICAgICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSBlO1xuXG4gICAgICAgIGlmICh0YXJnZXQgPT09ICR0b29sdGlwQ29udGFpbmVyIHx8IHRhcmdldCA9PT0gJG9wZW5CdG4pIHJldHVybjtcbiAgICAgICAgaWYgKHRvb2x0aXBEaW0pIHRvb2x0aXBEaW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgYWN0aW9ucy5jbG9zZSgpO1xuICAgICAgICAkb3BlbkJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdvbicpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkRXZlbnQoJ3RvdWNobW92ZScsICR0b29sdGlwRGltLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgdG9vbHRpcFRyaWdnZXJCdG4sIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFjdGlvbnMub3BlbigpO1xuXG4gICAgICAkb3BlbkJ0bi5jbGFzc0xpc3QuYWRkKCdvbicpO1xuICAgICAgLy8gMDYxNiBkaW0gdHlwZSDstpTqsIBcbiAgICAgIGlmICh0b29sdGlwRGltKSB7XG4gICAgICAgIHRvb2x0aXBEaW0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoJGNsb3NlQnRuKSB7XG4gICAgICBjbGVhbnVwcy5wdXNoKGZpcnN0Tm9kZUZvY3VzT3V0KCRjbG9zZUJ0biwgYWN0aW9ucy5jbG9zZSkpO1xuICAgICAgY2xlYW51cHMucHVzaChsYXN0Tm9kZUZvY3VzT3V0KCRjbG9zZUJ0biwgYWN0aW9ucy5jbG9zZSkpO1xuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgdG9vbHRpcENsb3NlQnRuLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICAgICAgaWYgKHRvb2x0aXBEaW0pIHtcbiAgICAgICAgICB0b29sdGlwRGltLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xlYW51cHMucHVzaChmaXJzdE5vZGVGb2N1c091dCgkb3BlbkJ0biwgYWN0aW9ucy5vcGVuKSk7XG4gICAgICBjbGVhbnVwcy5wdXNoKGxhc3ROb2RlRm9jdXNPdXQoJG9wZW5CdG4sIGFjdGlvbnMuY2xvc2UpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY29uc3QgaXNTaG93ID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcbiAgICBjb25zdCBleHBhbmRlZCA9ICR0b29sdGlwQ29udGFpbmVyLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZSc7XG4gICAgJHRvb2x0aXBDb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgIWV4cGFuZGVkKTtcbiAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZXhwYW5kZWQpO1xuXG4gICAgaWYgKGlzU2hvdykge1xuICAgICAgYWN0aW9ucy5vcGVuKCk7XG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gICAgfVxuXG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdvcGVuJyB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgaW5pdCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgICByZW1vdmVFdmVudCxcbiAgICB9LFxuXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIlxuZXRVSS5jb21wb25lbnRzID0ge1xuQWNjb3JkaW9uLFxuQ29sbGFwc2UsXG5EYXRlcGlja2VyQ29tcCxcbkRpYWxvZyxcbklucHV0LFxuTG90dGllLFxuTW9kYWwsXG5TZWxlY3RCb3gsXG5Td2lwZXJDb21wLFxuVGFiLFxuVG9hc3QsXG5Ub29sdGlwXG59XG4gICAgICAgICAgICAgICIsIi8vIGluaXQganNcbmZ1bmN0aW9uIGluaXRVSSgpIHtcbiAgY29uc3QgeyBtZWRpYVF1ZXJ5QWN0aW9uIH0gPSBldFVJLmhvb2tzLnVzZU1lZGlhUXVlcnkoKTtcbiAgY29uc3QgY29tcG9uZW50TGlzdCA9IFtcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5jb21wb25lbnQtaW5wdXQnLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5JbnB1dCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnLmNvbXBvbmVudC1tb2RhbCcsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLk1vZGFsLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICcuY29tcG9uZW50LWNvbGxhcHNlJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuQ29sbGFwc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5jb21wb25lbnQtYWNjb3JkaW9uJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuQWNjb3JkaW9uLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICcuY29tcG9uZW50LXRvb2x0aXAnLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5Ub29sdGlwLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICcuY29tcG9uZW50LXRhYicsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlRhYixcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnLmNvbXBvbmVudC1zZWxlY3QnLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5TZWxlY3RCb3gsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5jb21wb25lbnQtc3dpcGVyJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuU3dpcGVyQ29tcCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnLmNvbXBvbmVudC1kYXRlcGlja2VyJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuRGF0ZXBpY2tlckNvbXAsXG4gICAgfSxcbiAgXTtcblxuICBtZWRpYVF1ZXJ5QWN0aW9uKChjb250ZXh0KSA9PiB7XG4gICAgY29uc3QgeyBpc0Rlc2t0b3AsIGlzTW9iaWxlIH0gPSBjb250ZXh0LmNvbmRpdGlvbnM7XG5cbiAgICBjb21wb25lbnRMaXN0LmZvckVhY2goKHsgc2VsZWN0b3IsIGZuIH0pID0+IHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgZGVza3RvcE9ubHksIG1vYmlsZU9ubHkgfSA9IGVsLmRhdGFzZXQ7XG4gICAgICAgIGlmIChtb2JpbGVPbmx5IHx8IGRlc2t0b3BPbmx5KSB7XG4gICAgICAgICAgY29uc3Qgc2hvdWxkSW5pdCA9IChtb2JpbGVPbmx5ICYmIGlzTW9iaWxlKSB8fCAoZGVza3RvcE9ubHkgJiYgaXNEZXNrdG9wKTtcblxuICAgICAgICAgIGlmIChzaG91bGRJbml0KSB7XG4gICAgICAgICAgICBpbml0U3dpcGVyKGVsLCBzZWxlY3RvciwgZm4pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWwudWkpIHtcbiAgICAgICAgICAgIGRlc3Ryb3lTd2lwZXIoZWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbC5kYXRhc2V0LmluaXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGZuKCk7XG4gICAgICAgICAgZG9jdW1lbnQuZm9udHMucmVhZHkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoY29tcG9uZW50ICYmIGNvbXBvbmVudC5jb3JlKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvcmUuaW5pdChlbCwge30sIHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCBpbml0aWFsaXphdGlvbiBmYWlsZWQ6IGNvbXBvbmVudCBvciBjb21wb25lbnQuY29yZSBpcyB1bmRlZmluZWQnLCBzZWxlY3Rvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluaXRpYWxpemluZyBjb21wb25lbnQ6Jywgc2VsZWN0b3IsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjcmVhdGluZyBjb21wb25lbnQgaW5zdGFuY2U6Jywgc2VsZWN0b3IsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGV0VUkuZGlhbG9nID0gZXRVSS5ob29rcy51c2VEaWFsb2coKTtcbn1cblxuZXRVSS5pbml0VUkgPSBpbml0VUk7XG5cbihmdW5jdGlvbiBhdXRvSW5pdCgpIHtcbiAgY29uc3QgJHNjcmlwdEJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLWluaXRdXCIpO1xuICBpZiAoJHNjcmlwdEJsb2NrKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgaW5pdFVJKCk7XG4gICAgfSk7XG4gIH1cbn0pKCk7XG4iLCJmdW5jdGlvbiBkaWFsb2dUbXBsKCkge1xuICBjb25zdCAkdGVtcGxhdGVIVE1MID0gKHsgZGlhbG9nVHlwZSwgdHlwZSwgdGl0bGUsIG1lc3NhZ2UsIHBvc2l0aXZlVGV4dCwgbmVnYXRpdmVUZXh0IH0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtZGlhbG9nXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZGltbVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWZyYW1lXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgICAgICAgICAgICR7dGl0bGUgPyBgPGgzIGNsYXNzPVwiZGlhbG9nLXRpdFwiPiR7dGl0bGV9PC9oMz5gIDogJyd9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdhbGVydCcgPyBgPHNwYW4gY2xhc3M9XCIke3R5cGV9XCI+aWNvbjwvc3Bhbj5gIDogJyd9XG5cbiAgICAgICAgICAgICAgPHAgY2xhc3M9XCJkaWFsb2ctaW5mb1wiPiR7bWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgJzxicj4nKX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgJHtkaWFsb2dUeXBlID09PSAnY29uZmlybScgPyBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNxdWFyZSBidG4td2hpdGUgZGlhbG9nLW5lZ2F0aXZlXCI+JHtuZWdhdGl2ZVRleHR9PC9idXR0b24+YCA6ICcnfVxuICAgICAgICAgICAgICAke3Bvc2l0aXZlVGV4dCA/IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBkaWFsb2ctcG9zaXRpdmUgYnRuLXByaW1hcnlcIj4ke3Bvc2l0aXZlVGV4dH08L2J1dHRvbj5gIDogJyd9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgJHtkaWFsb2dUeXBlID09PSAnYWxlcnQnID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZGlhbG9nLWNsb3NlXCI+PHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPu2MneyXhSDri6vquLA8L3NwYW4+PC9idXR0b24+YCA6ICcnfVxuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICBjb25zdCAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MID0gKHsgZGlhbG9nVHlwZSwgaW1hZ2VzLCB0aXRsZSB9KSA9PiBgXG4gICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWRpYWxvZyBkaWFsb2ctcHJldmlldy1pbWFnZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWRpbW1cIj48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1mcmFtZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWhlYWRlclwiPlxuICAgICAgICAgICAgICAke3RpdGxlID8gYDxoMyBjbGFzcz1cImRpYWxvZy10aXRcIj4ke3RpdGxlfTwvaDM+YCA6ICcnfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1zd2lwZXJcIiBkYXRhLWNvbXBvbmVudD1cInN3aXBlclwiPlxuICAgICAgICAgICAgICAgIDwhLS0gQWRkaXRpb25hbCByZXF1aXJlZCB3cmFwcGVyIC0tPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgJHtpbWFnZXNcbiAgICAgICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAoaW1hZ2UpID0+IGBcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1zbGlkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtpbWFnZS5zcmN9XCIgYWx0PVwiJHtpbWFnZS5hbHR9XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBgLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcnKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZGlhbG9nLWNsb3NlXCI+PHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPu2MneyXhSDri6vquLA8L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICByZXR1cm4ge1xuICAgICR0ZW1wbGF0ZUhUTUwsXG4gICAgJHRlbXBsYXRlUHJldmlld0ltYWdlSFRNTFxuICB9O1xufVxuIiwiXG5ldFVJLnRlbXBsYXRlcyA9IHtcbmRpYWxvZ1RtcGwsXG5pbnB1dFRtcGwsXG5zZWxlY3RCb3hUbXBsLFxuc3dpcGVyVG1wbCxcbnRvYXN0VG1wbFxufVxuICAgICAgICAgICAgICAiLCJmdW5jdGlvbiBpbnB1dFRtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSB7XG4gICAgdG9nZ2xlUGFzc3dvcmQoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImlucHV0LWZpZWxkLWJ0biBwYXNzd29yZC1zdGF0ZVwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaGlkZS10eHQgaGlkZVwiPiR7ZXRVSS4kdCgnaW5wdXQucGFzc3dvcmRfaGlkZScsICfruYTrsIDrsojtmLgg7Iio6riw6riwJyl9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaGlkZS10eHQgc2hvd1wiPiR7ZXRVSS4kdCgnaW5wdXQucGFzc3dvcmRfc2hvdycsICfruYTrsIDrsojtmLgg7ZGc7IucJyl9PC9zcGFuPlxuICAgICAgICAgIDxpIGNsYXNzPVwiaWNvLXBhc3N3b3JkLXN0YXRlIGljby1ub3JtYWxcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGNsZWFyQnV0dG9uKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJpbnB1dC1maWVsZC1idG4gY2xlYXJcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+JHtldFVJLiR0KCdpbnB1dC5jbGVhcicsICfrgrTsmqkg7KeA7Jqw6riwJyl9PC9zcGFuPlxuICAgICAgICAgIDxpIGNsYXNzPVwiaWNvLWNsZWFyIGljby1ub3JtYWxcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGxvYWRpbmcoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8aSBjbGFzcz1cImlucHV0LWZpZWxkLWljbyBzcGlubmVyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlSFRNTCxcbiAgfTtcbn1cbiIsIi8qKlxuICog6rCc7J247KCV67O07LKY66as67Cp7LmoIO2FnO2UjOumvyDqtIDrpqxcbiAqIOuLqOy2le2CpDpcbiAqIC0gQWx0ICsgUDog7Yyd7JeFIOyXtOq4sFxuICogLSBBbHQgKyBHOiDsvZTrk5wg7IOd7ISxXG4gKiAtIEFsdCArIEM6IO2VreuqqSDsgq3soJxcbiAqL1xuLyogZ2xvYmFsIHdpbmRvdywgZG9jdW1lbnQsIGFsZXJ0LCBFdmVudCAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIOuqqOuLrCBIVE1MIOq1rOyhsCDsg53shLFcbiAgZnVuY3Rpb24gY3JlYXRlUHJpdmFjeVBvbGljeU1vZGFsKCkge1xuICAgIGNvbnN0IG1vZGFsSFRNTCA9IGBcbiAgICAgIDxzdHlsZT5cbiAgICAgICAgLyog66as7Iqk7Yq4IOyKpO2DgOydvCAqL1xuICAgICAgICAucG9saWN5LWxpc3Qge1xuICAgICAgICAgIHBhZGRpbmctbGVmdDogMjBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIOu2iOumvyDrpqzsiqTtirggKi9cbiAgICAgICAgdWwucG9saWN5LWxpc3Q6bm90KC5oeXBoZW4tbGlzdCkgbGkge1xuICAgICAgICAgIGxpc3Qtc3R5bGUtdHlwZTogZGlzYztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIOuyiO2YuCDrpqzsiqTtirggKi9cbiAgICAgICAgb2wucG9saWN5LWxpc3QgbGkge1xuICAgICAgICAgIGxpc3Qtc3R5bGUtdHlwZTogZGVjaW1hbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIO2VmOydtO2UiCDrpqzsiqTtirggKi9cbiAgICAgICAgLmh5cGhlbi1saXN0IGxpIHtcbiAgICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgcGFkZGluZy1sZWZ0OiAxNXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmh5cGhlbi1saXN0IGxpOmJlZm9yZSB7XG4gICAgICAgICAgY29udGVudDogJy0nO1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLyog67CV7IqkIOyKpO2DgOydvCAqL1xuICAgICAgICAuYm94LXN0eWxlIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOGY4O1xuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlMGUwZTA7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgICAgbWFyZ2luLXRvcDogNXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLyog7ISc7IudIO2ItOuwlCDsiqTtg4DsnbwgKi9cbiAgICAgICAgLmZvcm1hdHRpbmctdG9vbGJhciB7XG4gICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICBnYXA6IDVweDtcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgICAgICAgcGFkZGluZzogNXB4O1xuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuZm9ybWF0dGluZy10b29sYmFyIGJ1dHRvbiB7XG4gICAgICAgICAgcGFkZGluZzogM3B4IDhweDtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuZm9ybWF0dGluZy10b29sYmFyIGJ1dHRvbjpob3ZlciB7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2YwZjBmMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5mb3JtYXR0aW5nLXRvb2xiYXIgYnV0dG9uLmFjdGl2ZSB7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2UwZTBlMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIOyalOyGjCDstpTqsIAg7IS57IWYIOyKpO2DgOydvCAqL1xuICAgICAgICAuZWxlbWVudHMtc2VjdGlvbiB7XG4gICAgICAgICAgbWFyZ2luLWJvdHRvbSA6IDIwcHg7XG4gICAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmOWY5O1xuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmVsZW1lbnRzLXNlY3Rpb24gaDQge1xuICAgICAgICAgIG1hcmdpbjogMCAwIDEwcHggMDtcbiAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgICAgIH1cblxuICAgICAgICAuZWxlbWVudHMtYnV0dG9ucyB7XG4gICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICBnYXA6IDEwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAuZWxlbWVudC1kaWFsb2cge1xuICAgICAgICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gICAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmVsZW1lbnQtZGlhbG9nIGxhYmVsIHtcbiAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiA1cHg7XG4gICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgICAgIH1cblxuICAgICAgICAuZWxlbWVudC1kaWFsb2cgaW5wdXQge1xuICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgIHBhZGRpbmc6IDVweDtcbiAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgICAgICB9XG4gICAgICA8L3N0eWxlPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1tb2RhbCBwcml2YWN5LXBvbGljeS1tb2RhbFwiIGlkPVwicHJpdmFjeVBvbGljeU1vZGFsXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaW1tXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+XG4gICAgICAgICAgICA8aDIgY2xhc3M9XCJtb2RhbC10aXRcIj7qsJzsnbjsoJXrs7TsspjrpqzrsKnsuagg7YWc7ZSM66a/PC9oMj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRlbXBsYXRlLWNvbnRyb2xzXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZW1wbGF0ZS10eXBlXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsPu2FnO2UjOumvyDsnKDtmJU6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInRlbXBsYXRlVHlwZVwiIGNsYXNzPVwic2VsZWN0LWxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInRpdGxlXCI+7YOA7J207YuAPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJsaXN0XCI+66as7Iqk7Yq4PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJib3hcIj7rsJXsiqQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImxpc3RUeXBlQ29udGFpbmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lOyBtYXJnaW4tYm90dG9tOiAxMHB4O1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZW1wbGF0ZS10eXBlXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+66as7Iqk7Yq4IOycoO2YlTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1zZWxlY3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImxpc3RUeXBlXCIgY2xhc3M9XCJzZWxlY3QtbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ1bFwiPuu2iOumvyDrpqzsiqTtirg8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwib2xcIj7rsojtmLgg66as7Iqk7Yq4PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImh5cGhlblwiPu2VmOydtO2UiCDrpqzsiqTtirg8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZW1wbGF0ZS1pbnB1dFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIml0ZW1UaXRsZVwiPuygnOuqqTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dFwiIGRhdGEtcHJvcHMtY2xlYXI9XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiaXRlbVRpdGxlXCIgcGxhY2Vob2xkZXI9XCLsoJzrqqnsnYQg7J6F66Cl7ZWY7IS47JqUXCI+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaXRlbUNvbnRlbnRcIj7rgrTsmqk6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtYXR0aW5nLXRvb2xiYXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJib2xkQnRuXCIgdGl0bGU9XCLqtbXqsoxcIj48c3Ryb25nPkI8L3N0cm9uZz48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJpdGFsaWNCdG5cIiB0aXRsZT1cIuq4sOyauOyehFwiPjxlbT5JPC9lbT48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJ1bmRlcmxpbmVCdG5cIiB0aXRsZT1cIuuwkeykhFwiPjx1PlU8L3U+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiaXRlbUNvbnRlbnRcIiBwbGFjZWhvbGRlcj1cIuuCtOyaqeydhCDsnoXroKXtlZjshLjsmpRcIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRlbXBsYXRlLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYWRkSXRlbVwiIGNsYXNzPVwiYnRuXCI+66+466asIOuztOq4sDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJkZWxldGVJdGVtXCIgY2xhc3M9XCJidG4gYnRuLWNsb3NlXCI+7LSI6riw7ZmUPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGVtcGxhdGUtcHJldmlld1wiPlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwicHJldmlld0NvbnRhaW5lclwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZWxlbWVudHMtc2VjdGlvblwiPlxuICAgICAgICAgICAgICA8aDQ+7JqU7IaMIOy2lOqwgDwvaDQ+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlbGVtZW50cy1idXR0b25zXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJhZGRCdXR0b25FbGVtZW50XCIgY2xhc3M9XCJidG4gYnRuLXNtXCI+67KE7Yq8IOy2lOqwgDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiYWRkTGlua0VsZW1lbnRcIiBjbGFzcz1cImJ0biBidG4tc21cIj7rp4Htgawg7LaU6rCAPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwiYnV0dG9uRWxlbWVudERpYWxvZ1wiIGNsYXNzPVwiZWxlbWVudC1kaWFsb2dcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImJ1dHRvblRleHRcIj7rsoTtirwg7YWN7Iqk7Yq4OjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJidXR0b25UZXh0XCIgcGxhY2Vob2xkZXI9XCLrsoTtirzsl5Ag7ZGc7Iuc7ZWgIO2FjeyKpO2KuFwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJidXR0b25DbGFzc1wiPuuyhO2KvCDtgbTrnpjsiqQgKOyEoO2DneyCrO2VrSk6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImJ1dHRvbkNsYXNzXCIgcGxhY2Vob2xkZXI9XCLsmIg6IGJ0biBidG4tcHJpbWFyeVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsb2NhdGlvbi1jaGVja2JveGVzXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94LWlubmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiYWRkVG9MaXN0XCIgbmFtZT1cImFkZFRvTGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hlY2tib3gtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGVja2JveC10eHRcIj5MaXN0IOyalOyGjOyXkCDstpTqsIA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94LWlubmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiYWRkVG9Db250ZW50XCIgbmFtZT1cImFkZFRvQ29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hlY2tib3gtaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGVja2JveC10eHRcIj5Db250ZW50IOyalOyGjOyXkCDstpTqsIA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1idXR0b25zXCI+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImluc2VydEJ1dHRvbkVsZW1lbnRcIiBjbGFzcz1cImJ0biBidG4tc21cIj7stpTqsIA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiY2FuY2VsQnV0dG9uRWxlbWVudFwiIGNsYXNzPVwiYnRuIGJ0bi1zbSBidG4tY2xvc2VcIj7st6jshow8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJsaW5rRWxlbWVudERpYWxvZ1wiIGNsYXNzPVwiZWxlbWVudC1kaWFsb2dcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxpbmtUZXh0XCI+66eB7YGsIO2FjeyKpO2KuDo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwibGlua1RleHRcIiBwbGFjZWhvbGRlcj1cIuunge2BrOyXkCDtkZzsi5ztlaAg7YWN7Iqk7Yq4XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxpbmtVcmxcIj7rp4HtgawgVVJMOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJsaW5rVXJsXCIgcGxhY2Vob2xkZXI9XCLsmIg6IGh0dHBzOi8vZXhhbXBsZS5jb21cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiaW5zZXJ0TGlua0VsZW1lbnRcIiBjbGFzcz1cImJ0biBidG4tc21cIj7stpTqsIA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiY2FuY2VsTGlua0VsZW1lbnRcIiBjbGFzcz1cImJ0biBidG4tc20gYnRuLWNsb3NlXCI+7Leo7IaMPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGVtcGxhdGUtY29kZVwiPlxuICAgICAgICAgICAgICA8aDM+7IOd7ISx65CcIOy9lOuTnDwvaDM+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cImdlbmVyYXRlZENvZGVcIiByZWFkb25seT48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImFkZENvZGVcIiBjbGFzcz1cImJ0blwiPuy9lOuTnCDsg53shLE8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWNsb3NlIG1vZGFsLWNsb3NlLWJ0blwiPuuLq+q4sDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBjb3B5LWNvZGUtYnRuXCI+7L2U65OcIOuzteyCrDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibW9kYWwtY2xvc2VcIj48L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgLy8g66qo64usIEhUTUzsnYQgYm9keeyXkCDstpTqsIBcbiAgICBkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgbW9kYWxIVE1MKTtcbiAgfVxuXG4gIC8vIOuqqOuLrCDstIjquLDtmZQg67CPIOydtOuypO2KuCDrsJTsnbjrlKlcbiAgZnVuY3Rpb24gaW5pdFByaXZhY3lQb2xpY3lNb2RhbCgpIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcml2YWN5UG9saWN5TW9kYWwnKTtcbiAgICBpZiAoIW1vZGFsKSB7XG4gICAgICBjcmVhdGVQcml2YWN5UG9saWN5TW9kYWwoKTtcbiAgICAgIGJpbmRNb2RhbEV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEhUTUwg7YOc6re466W8IOq3uOuMgOuhnCDsnKDsp4DtlZjripQg7ZWo7IiYICjsnbTsoITsnZgg66eI7YGs64uk7Jq0IOuzgO2ZmCDtlajsiJgg64yA7LK0KVxuICBmdW5jdGlvbiBwcmVzZXJ2ZUhUTUxUYWdzKHRleHQpIHtcbiAgICBpZiAoIXRleHQpIHJldHVybiB0ZXh0O1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgLy8g7ISc7IudIOyYteyFmCDrsoTtirwg7J2067Kk7Yq4IOyymOumrFxuICBmdW5jdGlvbiBzZXR1cEZvcm1hdHRpbmdUb29sYmFyKCkge1xuICAgIGNvbnN0IGJvbGRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9sZEJ0bicpO1xuICAgIGNvbnN0IGl0YWxpY0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGFsaWNCdG4nKTtcbiAgICBjb25zdCB1bmRlcmxpbmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndW5kZXJsaW5lQnRuJyk7XG4gICAgY29uc3QgY29udGVudFRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1Db250ZW50Jyk7XG5cbiAgICBpZiAoIWJvbGRCdG4gfHwgIWl0YWxpY0J0biB8fCAhdW5kZXJsaW5lQnRuIHx8ICFjb250ZW50VGV4dGFyZWEpIHJldHVybjtcblxuICAgIC8vIOq1teqyjCDrsoTtirwg7YG066atIOydtOuypO2KuFxuICAgIGJvbGRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBhcHBseUZvcm1hdHRpbmcoJ2JvbGQnKTtcbiAgICB9KTtcblxuICAgIC8vIOq4sOyauOyehCDrsoTtirwg7YG066atIOydtOuypO2KuFxuICAgIGl0YWxpY0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGFwcGx5Rm9ybWF0dGluZygnaXRhbGljJyk7XG4gICAgfSk7XG5cbiAgICAvLyDrsJHspIQg67KE7Yq8IO2BtOumrSDsnbTrsqTtirhcbiAgICB1bmRlcmxpbmVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBhcHBseUZvcm1hdHRpbmcoJ3VuZGVybGluZScpO1xuICAgIH0pO1xuXG4gICAgLy8g7JqU7IaMIOy2lOqwgCDrsoTtirwg7J2067Kk7Yq4IOyymOumrFxuICAgIHNldHVwRWxlbWVudHNCdXR0b25zKCk7XG5cbiAgICAvLyDshJzsi50g7KCB7JqpIO2VqOyImFxuICAgIGZ1bmN0aW9uIGFwcGx5Rm9ybWF0dGluZyhmb3JtYXQpIHtcbiAgICAgIGNvbnN0IHRleHRhcmVhID0gY29udGVudFRleHRhcmVhO1xuICAgICAgY29uc3Qgc3RhcnQgPSB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydDtcbiAgICAgIGNvbnN0IGVuZCA9IHRleHRhcmVhLnNlbGVjdGlvbkVuZDtcbiAgICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IHRleHRhcmVhLnZhbHVlLnN1YnN0cmluZyhzdGFydCwgZW5kKTtcbiAgICAgIGxldCBmb3JtYXR0ZWRUZXh0ID0gJyc7XG5cbiAgICAgIGlmIChzZWxlY3RlZFRleHQpIHtcbiAgICAgICAgc3dpdGNoKGZvcm1hdCkge1xuICAgICAgICBjYXNlICdib2xkJzpcbiAgICAgICAgICBmb3JtYXR0ZWRUZXh0ID0gYDxzdHJvbmcgY2xhc3M9XCJzdHJvbmdcIj4ke3NlbGVjdGVkVGV4dH08L3N0cm9uZz5gO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdpdGFsaWMnOlxuICAgICAgICAgIGZvcm1hdHRlZFRleHQgPSBgPGVtIGNsYXNzPVwiaXRhbGljXCI+JHtzZWxlY3RlZFRleHR9PC9lbT5gO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1bmRlcmxpbmUnOlxuICAgICAgICAgIGZvcm1hdHRlZFRleHQgPSBgPHUgY2xhc3M9XCJ1bmRlcmxpbmVcIj4ke3NlbGVjdGVkVGV4dH08L3U+YDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOyEoO2Dne2VnCDthY3siqTtirjrpbwg7ISc7Iud7J20IOyggeyaqeuQnCDthY3siqTtirjroZwg6rWQ7LK0XG4gICAgICAgIHRleHRhcmVhLnZhbHVlID0gdGV4dGFyZWEudmFsdWUuc3Vic3RyaW5nKDAsIHN0YXJ0KSArIGZvcm1hdHRlZFRleHQgKyB0ZXh0YXJlYS52YWx1ZS5zdWJzdHJpbmcoZW5kKTtcblxuICAgICAgICAvLyDsu6TshJwg7JyE7LmYIOyerOyEpOyglVxuICAgICAgICB0ZXh0YXJlYS5mb2N1cygpO1xuICAgICAgICB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0ICsgZm9ybWF0dGVkVGV4dC5sZW5ndGg7XG4gICAgICAgIHRleHRhcmVhLnNlbGVjdGlvbkVuZCA9IHN0YXJ0ICsgZm9ybWF0dGVkVGV4dC5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8g7JqU7IaMIOy2lOqwgCDrsoTtirwg7J2067Kk7Yq4IOyymOumrFxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnRzQnV0dG9ucygpIHtcbiAgICBjb25zdCBjb250ZW50VGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbUNvbnRlbnQnKTtcbiAgICBjb25zdCBhZGRCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZEJ1dHRvbkVsZW1lbnQnKTtcbiAgICBjb25zdCBhZGRMaW5rRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRMaW5rRWxlbWVudCcpO1xuICAgIGNvbnN0IGJ1dHRvbkVsZW1lbnREaWFsb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uRWxlbWVudERpYWxvZycpO1xuICAgIGNvbnN0IGxpbmtFbGVtZW50RGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtFbGVtZW50RGlhbG9nJyk7XG4gICAgY29uc3QgaW5zZXJ0QnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnRCdXR0b25FbGVtZW50Jyk7XG4gICAgY29uc3QgY2FuY2VsQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW5jZWxCdXR0b25FbGVtZW50Jyk7XG4gICAgY29uc3QgaW5zZXJ0TGlua0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5zZXJ0TGlua0VsZW1lbnQnKTtcbiAgICBjb25zdCBjYW5jZWxMaW5rRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW5jZWxMaW5rRWxlbWVudCcpO1xuXG4gICAgLy8g67KE7Yq8IOy2lOqwgCDrjIDtmZTsg4HsnpAg7Je06riwXG4gICAgYWRkQnV0dG9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGJ1dHRvbkVsZW1lbnREaWFsb2cuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBsaW5rRWxlbWVudERpYWxvZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvblRleHQnKS5mb2N1cygpO1xuICAgIH0pO1xuXG4gICAgLy8g66eB7YGsIOy2lOqwgCDrjIDtmZTsg4HsnpAg7Je06riwXG4gICAgYWRkTGlua0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBsaW5rRWxlbWVudERpYWxvZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIGJ1dHRvbkVsZW1lbnREaWFsb2cuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVGV4dCcpLmZvY3VzKCk7XG4gICAgfSk7XG5cbiAgICAvLyDrsoTtirwg7LaU6rCAIOyymOumrFxuICAgIGluc2VydEJ1dHRvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBidXR0b25UZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvblRleHQnKS52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBidXR0b25DbGFzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b25DbGFzcycpLnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IGFkZFRvTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRUb0xpc3QnKS5jaGVja2VkO1xuICAgICAgY29uc3QgYWRkVG9Db250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZFRvQ29udGVudCcpLmNoZWNrZWQ7XG5cbiAgICAgIGlmICghYnV0dG9uVGV4dCkge1xuICAgICAgICBhbGVydCgn67KE7Yq8IO2FjeyKpO2KuOulvCDsnoXroKXtlbTso7zshLjsmpQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYnV0dG9uSFRNTCA9IGJ1dHRvbkNsYXNzXG4gICAgICAgID8gYDxidXR0b24gY2xhc3M9XCIke2J1dHRvbkNsYXNzfVwiPiR7YnV0dG9uVGV4dH08L2J1dHRvbj5gXG4gICAgICAgIDogYDxidXR0b24gY2xhc3M9XCJidG5cIj4ke2J1dHRvblRleHR9PC9idXR0b24+YDtcblxuICAgICAgaWYgKGFkZFRvTGlzdCkge1xuICAgICAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9saWN5LWxpc3QnKSkge1xuICAgICAgICAgIC8vIHBvbGljeS1saXN07JeQIOy2lOqwgO2VmOuKlCDroZzsp4FcbiAgICAgICAgICBjb25zdCBsaXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgbGlzdEVsZW1lbnQuaW5uZXJIVE1MID0gYnV0dG9uSFRNTDtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9saWN5LWxpc3QnKS5hcHBlbmRDaGlsZChsaXN0RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoYWRkVG9Db250ZW50KSB7XG4gICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb2xpY3ktY29udGVudCcpKSB7XG4gICAgICAgICAgLy8gcG9saWN5LWNvbnRlbnQg7J6Q7IudIOyalOyGjOuhnCDstpTqsIDtlZjripQg66Gc7KeBXG4gICAgICAgICAgY29uc3QgYnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIGJ1dHRvbkVsZW1lbnQuaW5uZXJIVE1MID0gYnV0dG9uSFRNTDtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9saWN5LWNvbnRlbnQnKS5hcHBlbmRDaGlsZChidXR0b25FbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcG9saWN5LWl0ZW0g7J6Q7IudIOyalOyGjOuhnCDstpTqsIDtlZjripQg66Gc7KeBXG4gICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb2xpY3ktaXRlbScpKSB7XG4gICAgICAgICAgY29uc3QgYnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIGJ1dHRvbkVsZW1lbnQuaW5uZXJIVE1MID0gYnV0dG9uSFRNTDtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucG9saWN5LWl0ZW0nKS5hcHBlbmRDaGlsZChidXR0b25FbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGVtcGxhdGVJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGxhc3RJdGVtID0gdGVtcGxhdGVJdGVtc1t0ZW1wbGF0ZUl0ZW1zLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGlmIChhZGRUb0xpc3QgfHwgYWRkVG9Db250ZW50KSB7XG4gICAgICAgICAgLy8g66as7Iqk7Yq4IOyalOyGjOyXkCDstpTqsIBcbiAgICAgICAgICBpZiAobGFzdEl0ZW0udHlwZSA9PT0gJ2xpc3QnIHx8IGxhc3RJdGVtLnR5cGUgPT09ICdib3gnKSB7XG4gICAgICAgICAgICAvLyDsnbTrr7gg7J6I64qUIOumrOyKpO2KuCDrgrTsmqnsl5Ag7IOIIOumrOyKpO2KuCDslYTsnbTthZwg65iQ64qUIOuCtOyaqeyXkCDstpTqsIBcbiAgICAgICAgICAgIGxhc3RJdGVtLmNvbnRlbnQgKz0gJ1xcbicgKyBidXR0b25IVE1MO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyDquLDrs7gg7JyE7LmY7JeQIOy2lOqwgCAo7LK07YGs67CV7IqkIOyEoO2DnSDsl4bsnYQg65WMKVxuICAgICAgICAgIGlmICghbGFzdEl0ZW0uYnV0dG9uSFRNTCkge1xuICAgICAgICAgICAgbGFzdEl0ZW0uYnV0dG9uSFRNTCA9IGJ1dHRvbkhUTUw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxhc3RJdGVtLmJ1dHRvbkhUTUwgKz0gJ1xcbicgKyBidXR0b25IVE1MO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBidXR0b25FbGVtZW50RGlhbG9nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uVGV4dCcpLnZhbHVlID0gJyc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uQ2xhc3MnKS52YWx1ZSA9ICcnO1xuICAgIH0pO1xuXG4gICAgLy8g66eB7YGsIOy2lOqwgCDsspjrpqwg7ZWo7IiYIOyImOyglVxuICAgIGluc2VydExpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgbGlua1RleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1RleHQnKS52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBsaW5rVXJsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtVcmwnKS52YWx1ZS50cmltKCk7XG5cbiAgICAgIGlmICghbGlua1RleHQpIHtcbiAgICAgICAgYWxlcnQoJ+unge2BrCDthY3siqTtirjrpbwg7J6F66Cl7ZW07KO87IS47JqULicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghbGlua1VybCkge1xuICAgICAgICBhbGVydCgn66eB7YGsIFVSTOydhCDsnoXroKXtlbTso7zshLjsmpQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGlua0hUTUwgPSBgPGEgaHJlZj1cIiR7bGlua1VybH1cIj4ke2xpbmtUZXh0fTwvYT5gO1xuXG4gICAgICBpbnNlcnRBdEN1cnNvcihjb250ZW50VGV4dGFyZWEsIGxpbmtIVE1MKTtcblxuICAgICAgLy8gdGVtcGxhdGVJdGVtcyDrsLDsl7Qg7JeF642w7J207Yq4IC0gdGV4dGFyZWHsnZgg7IOIIOqwkuycvOuhnCDsl4XrjbDsnbTtirhcbiAgICAgIGlmICh0ZW1wbGF0ZUl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8g7ZiE7J6sIOyEoO2DneuQnCDtla3rqqnsnbQg7JeG7Jy866m0IOqwgOyepSDstZzqt7wg7ZWt66qpIOyXheuNsOydtO2KuFxuICAgICAgICBjb25zdCBsYXN0SXRlbSA9IHRlbXBsYXRlSXRlbXNbdGVtcGxhdGVJdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgbGFzdEl0ZW0uY29udGVudCA9IGNvbnRlbnRUZXh0YXJlYS52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgbGlua0VsZW1lbnREaWFsb2cuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVGV4dCcpLnZhbHVlID0gJyc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1VybCcpLnZhbHVlID0gJyc7XG4gICAgfSk7XG5cbiAgICAvLyDrsoTtirwg7LaU6rCAIOy3qOyGjFxuICAgIGNhbmNlbEJ1dHRvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBidXR0b25FbGVtZW50RGlhbG9nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uVGV4dCcpLnZhbHVlID0gJyc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uQ2xhc3MnKS52YWx1ZSA9ICcnO1xuICAgIH0pO1xuXG4gICAgLy8g66eB7YGsIOy2lOqwgCDsspjrpqxcbiAgICBpbnNlcnRMaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGxpbmtUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtUZXh0JykudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgbGlua1VybCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVXJsJykudmFsdWUudHJpbSgpO1xuXG4gICAgICBpZiAoIWxpbmtUZXh0KSB7XG4gICAgICAgIGFsZXJ0KCfrp4Htgawg7YWN7Iqk7Yq466W8IOyeheugpe2VtOyjvOyEuOyalC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxpbmtVcmwpIHtcbiAgICAgICAgYWxlcnQoJ+unge2BrCBVUkzsnYQg7J6F66Cl7ZW07KO87IS47JqULicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpbmtIVE1MID0gYDxhIGhyZWY9XCIke2xpbmtVcmx9XCI+JHtsaW5rVGV4dH08L2E+YDtcblxuICAgICAgaW5zZXJ0QXRDdXJzb3IoY29udGVudFRleHRhcmVhLCBsaW5rSFRNTCk7XG4gICAgICBsaW5rRWxlbWVudERpYWxvZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtUZXh0JykudmFsdWUgPSAnJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVXJsJykudmFsdWUgPSAnJztcbiAgICB9KTtcblxuICAgIC8vIOunge2BrCDstpTqsIAg7Leo7IaMXG4gICAgY2FuY2VsTGlua0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBsaW5rRWxlbWVudERpYWxvZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtUZXh0JykudmFsdWUgPSAnJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVXJsJykudmFsdWUgPSAnJztcbiAgICB9KTtcblxuICAgIC8vIOy7pOyEnCDsnITsuZjsl5Ag7YWN7Iqk7Yq4IOyCveyehVxuICAgIGZ1bmN0aW9uIGluc2VydEF0Q3Vyc29yKHRleHRhcmVhLCB0ZXh0KSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRleHRhcmVhLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgY29uc3QgZW5kID0gdGV4dGFyZWEuc2VsZWN0aW9uRW5kO1xuXG4gICAgICB0ZXh0YXJlYS52YWx1ZSA9IHRleHRhcmVhLnZhbHVlLnN1YnN0cmluZygwLCBzdGFydCkgKyB0ZXh0ICsgdGV4dGFyZWEudmFsdWUuc3Vic3RyaW5nKGVuZCk7XG5cbiAgICAgIC8vIOy7pOyEnCDsnITsuZgg7J6s7ISk7KCVXG4gICAgICB0ZXh0YXJlYS5mb2N1cygpO1xuICAgICAgdGV4dGFyZWEuc2VsZWN0aW9uU3RhcnQgPSBzdGFydCArIHRleHQubGVuZ3RoO1xuICAgICAgdGV4dGFyZWEuc2VsZWN0aW9uRW5kID0gc3RhcnQgKyB0ZXh0Lmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICAvLyDrqqjri6wg7J2067Kk7Yq4IOuwlOyduOuUqVxuICBmdW5jdGlvbiBiaW5kTW9kYWxFdmVudHMoKSB7XG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJpdmFjeVBvbGljeU1vZGFsJyk7XG4gICAgY29uc3QgbW9kYWxEaW1tID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWRpbW0nKTtcbiAgICBjb25zdCBtb2RhbENvbnRhaW5lciA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1jb250YWluZXInKTtcbiAgICBjb25zdCBjbG9zZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1jbG9zZScpO1xuICAgIGNvbnN0IGNsb3NlQnRuRm9vdGVyID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWNsb3NlLWJ0bicpO1xuICAgIGNvbnN0IGFkZEl0ZW1CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkSXRlbScpO1xuICAgIGNvbnN0IGFkZENvZGVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkQ29kZScpO1xuICAgIGNvbnN0IGRlbGV0ZUl0ZW1CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVsZXRlSXRlbScpO1xuICAgIGNvbnN0IGNvcHlDb2RlQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLmNvcHktY29kZS1idG4nKTtcbiAgICBjb25zdCB0ZW1wbGF0ZVR5cGVTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVtcGxhdGVUeXBlJyk7XG5cbiAgICAvLyDthZztlIzrpr8g7ZWt66qpIOuNsOydtO2EsFxuICAgIC8vIGNvbnN0IHRlbXBsYXRlSXRlbXMgPSBbXTtcblxuICAgIC8vIOuqqOuLrCDri6vquLAg7ZWo7IiYXG4gICAgY29uc3QgY2xvc2VNb2RhbCA9ICgpID0+IHtcbiAgICAgIG1vZGFsRGltbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgbW9kYWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfTtcblxuICAgIC8vIOuqqOuLrCDsl7TquLAg7ZWo7IiYXG4gICAgY29uc3Qgb3Blbk1vZGFsID0gKCkgPT4ge1xuICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIH07XG5cbiAgICAvLyDri6vquLAg67KE7Yq8IOydtOuypO2KuFxuICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7XG4gICAgY2xvc2VCdG5Gb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsKTtcbiAgICBtb2RhbERpbW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsKTtcblxuICAgIC8vIO2FnO2UjOumvyDsnKDtmJUg67OA6rK9IOydtOuypO2KuFxuICAgIHRlbXBsYXRlVHlwZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyDthZztlIzrpr8g7Jyg7ZiVIOuzgOqyvSDsi5wg66qo65OgIOyeheugpSDtlYTrk5wg7LSI6riw7ZmUXG4gICAgICAvLyAxLiDsnoXroKUg7ZWE65OcIOy0iOq4sO2ZlFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1UaXRsZScpLnZhbHVlID0gJyc7IC8vIOygnOuqqSDstIjquLDtmZRcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtQ29udGVudCcpLnZhbHVlID0gJyc7IC8vIOuCtOyaqSDstIjquLDtmZRcblxuICAgICAgLy8gMi4g7YWc7ZSM66a/IO2VreuqqSDrjbDsnbTthLAg7LSI6riw7ZmUXG4gICAgICB0ZW1wbGF0ZUl0ZW1zLmxlbmd0aCA9IDA7XG5cbiAgICAgIC8vIDMuIOuvuOumrOuztOq4sCDstIjquLDtmZRcbiAgICAgIHVwZGF0ZVByZXZpZXcoKTtcblxuICAgICAgLy8gNC4g7IOd7ISx65CcIOy9lOuTnCDstIjquLDtmZRcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmF0ZWRDb2RlJykudmFsdWUgPSAnJztcblxuICAgICAgLy8gNS4g7JiI7IucIOyXheuNsOydtO2KuCAo7YWc7ZSM66a/IOycoO2YleyXkCDrlLDrnbwg7JiI7IucIOuzgOqyvSlcbiAgICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbVRpdGxlJyk7XG4gICAgICBjb25zdCBjb250ZW50SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbUNvbnRlbnQnKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlVHlwZSA9IHRlbXBsYXRlVHlwZVNlbGVjdC52YWx1ZTtcbiAgICAgIGNvbnN0IGxpc3RUeXBlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3RUeXBlQ29udGFpbmVyJyk7XG5cbiAgICAgIC8vIOumrOyKpO2KuCDsnKDtmJUg7ISg7YOdIOyYteyFmCDtkZzsi5wv7Iio6rmAXG4gICAgICBpZih0ZW1wbGF0ZVR5cGUgPT09ICd0aXRsZScpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVsZW1lbnRzLXNlY3Rpb24nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfSBlbHNlIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdsaXN0Jykge1xuICAgICAgICBsaXN0VHlwZUNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVsZW1lbnRzLXNlY3Rpb24nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZFRvTGlzdCcpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZFRvQ29udGVudCcpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdFR5cGVDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVsZW1lbnRzLXNlY3Rpb24nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZFRvTGlzdCcpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkVG9Db250ZW50JykucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2godGVtcGxhdGVUeXBlKSB7XG4gICAgICBjYXNlICd0aXRsZSc6XG4gICAgICAgIHRpdGxlSW5wdXQucGxhY2Vob2xkZXIgPSAn7YOA7J207YuAJztcbiAgICAgICAgY29udGVudElucHV0LnBsYWNlaG9sZGVyID0gJ+uCtOyaqSDsl4bsnYwnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICB0aXRsZUlucHV0LnBsYWNlaG9sZGVyID0gJ+2DgOydtO2LgCc7XG4gICAgICAgIGNvbnRlbnRJbnB1dC5wbGFjZWhvbGRlciA9ICfrgrTsmqknO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JveCc6XG4gICAgICAgIHRpdGxlSW5wdXQucGxhY2Vob2xkZXIgPSAn7YOA7J207YuAJztcbiAgICAgICAgY29udGVudElucHV0LnBsYWNlaG9sZGVyID0gJ+uCtOyaqSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g66+466asIOuztOq4sCDrsI8g7L2U65OcIOyDneyEsSDrsoTtirwg7J2067Kk7Yq4XG4gICAgYWRkSXRlbUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGFkZFRlbXBsYXRlSXRlbSgpO1xuICAgICAgLy8gZ2VuZXJhdGVUZW1wbGF0ZUNvZGUoKTtcbiAgICB9KTtcblxuICAgIC8vIOuvuOumrCDrs7TquLAg67CPIOy9lOuTnCDsg53shLEg67KE7Yq8IOydtOuypO2KuFxuICAgIGFkZENvZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyBhZGRUZW1wbGF0ZUl0ZW0oKTtcbiAgICAgIGdlbmVyYXRlVGVtcGxhdGVDb2RlKCk7XG4gICAgfSk7XG5cbiAgICAvLyDstIjquLDtmZQg67KE7Yq8IOydtOuypO2KuFxuICAgIGRlbGV0ZUl0ZW1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICByZXNldFRlbXBsYXRlSXRlbXMoKTtcbiAgICB9KTtcblxuICAgIC8vIOy9lOuTnCDrs7Xsgqwg67KE7Yq8IOydtOuypO2KuFxuICAgIGNvcHlDb2RlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgZ2VuZXJhdGVkQ29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmF0ZWRDb2RlJyk7XG4gICAgICBnZW5lcmF0ZWRDb2RlLnNlbGVjdCgpO1xuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgICAgIGFsZXJ0KCfsvZTrk5zqsIAg7YG066a967O065Oc7JeQIOuzteyCrOuQmOyXiOyKteuLiOuLpC4nKTtcbiAgICB9KTtcblxuICAgIC8vIO2FnO2UjOumvyDtla3rqqkg7LaU6rCAIO2VqOyImFxuICAgIGZ1bmN0aW9uIGFkZFRlbXBsYXRlSXRlbSgpIHtcbiAgICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbVRpdGxlJyk7XG4gICAgICBjb25zdCBjb250ZW50SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbUNvbnRlbnQnKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlVHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wbGF0ZVR5cGUnKS52YWx1ZTtcbiAgICAgIGNvbnN0IHRpdGxlID0gdGl0bGVJbnB1dC52YWx1ZS50cmltKCk7XG4gICAgICBsZXQgY29udGVudCA9IGNvbnRlbnRJbnB1dC52YWx1ZS50cmltKCk7XG4gICAgICBsZXQgbGlzdFR5cGUgPSBudWxsO1xuXG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnbGlzdCcpIHtcbiAgICAgICAgLy8g66as7Iqk7Yq4IOycoO2YleydvCDqsr3smrAg66as7Iqk7Yq4IOycoO2YlSDqsIDsoLjsmKTquLBcbiAgICAgICAgbGlzdFR5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFR5cGUnKS52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ3RpdGxlJykge1xuICAgICAgICAvLyDtg4DsnbTti4Ag7Jyg7ZiV7J28IOqyveyasCDrgrTsmqkg7ZWE65OcIOqygOyCrCDsg53rnrVcbiAgICAgICAgaWYgKCF0aXRsZSkge1xuICAgICAgICAgIGFsZXJ0KCfsoJzrqqnsnYQg7J6F66Cl7ZW07KO87IS47JqULicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyDtg4DsnbTti4DsnYAg64K07Jqp7J20IOyXhuyWtOuPhCDrkKhcbiAgICAgICAgY29udGVudCA9IGNvbnRlbnQgfHwgJ+uCtOyaqSDsl4bsnYwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8g64uk66W4IOycoO2YleydvCDqsr3smrAg7KCc66qp6rO8IOuCtOyaqSDrqqjrkZAg7ZWE7JqUXG4gICAgICAgIGlmICghdGl0bGUgfHwgIWNvbnRlbnQpIHtcbiAgICAgICAgICBhbGVydCgn7KCc66qp6rO8IOuCtOyaqeydhCDrqqjrkZAg7J6F66Cl7ZW07KO87IS47JqULicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0ZW1wbGF0ZUl0ZW1zLnB1c2goe1xuICAgICAgICB0eXBlOiB0ZW1wbGF0ZVR5cGUsXG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgY29udGVudDogY29udGVudCxcbiAgICAgICAgbGlzdFR5cGU6IGxpc3RUeXBlLFxuICAgICAgICBidXR0b25IVE1MOiAnJyxcbiAgICAgIH0pO1xuICAgICAgdXBkYXRlUHJldmlldygpO1xuXG4gICAgICAvLyDsnoXroKUg7ZWE65OcIOy0iOq4sO2ZlFxuICAgICAgdGl0bGVJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgY29udGVudElucHV0LnZhbHVlID0gJyc7XG4gICAgICB0aXRsZUlucHV0LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgLy8g7YWc7ZSM66a/IO2VreuqqSDstIjquLDtmZQg7ZWo7IiYXG4gICAgZnVuY3Rpb24gcmVzZXRUZW1wbGF0ZUl0ZW1zKCkge1xuICAgICAgaWYgKHRlbXBsYXRlSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0ZW1wbGF0ZUl0ZW1zLmxlbmd0aCA9IDA7XG4gICAgICAgIHVwZGF0ZVByZXZpZXcoKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dlbmVyYXRlZENvZGUnKS52YWx1ZSA9ICcnO1xuICAgICAgICBhbGVydCgn66qo65OgIO2VreuqqeydtCDstIjquLDtmZTrkJjsl4jsirXri4jri6QuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCgn7LSI6riw7ZmU7ZWgIO2VreuqqeydtCDsl4bsirXri4jri6QuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g66+466as67O06riwIOyXheuNsOydtO2KuCDtlajsiJhcbiAgICBmdW5jdGlvbiB1cGRhdGVQcmV2aWV3KCkge1xuICAgICAgY29uc3QgcHJldmlld0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcmV2aWV3Q29udGFpbmVyJyk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZVR5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVtcGxhdGVUeXBlJykudmFsdWU7XG5cbiAgICAgIGxldCBwcmV2aWV3SFRNTCA9ICcnO1xuXG4gICAgICBpZiAodGVtcGxhdGVJdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcHJldmlld0NvbnRhaW5lci5pbm5lckhUTUwgPSAnPHA+66+466as67O06riwIOyYgeyXrTwvcD4nO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAodGVtcGxhdGVUeXBlKSB7XG4gICAgICBjYXNlICd0aXRsZSc6XG4gICAgICAgIHByZXZpZXdIVE1MID0gZ2VuZXJhdGVGdWxsVGl0bGVQcmV2aWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgIHByZXZpZXdIVE1MID0gZ2VuZXJhdGVMaXN0UHJldmlldygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JveCc6XG4gICAgICAgIHByZXZpZXdIVE1MID0gZ2VuZXJhdGVCb3hQcmV2aWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBwcmV2aWV3Q29udGFpbmVyLmlubmVySFRNTCA9IHByZXZpZXdIVE1MO1xuICAgIH1cblxuICAgIC8vIO2DgOydtO2LgCDrr7jrpqzrs7TquLAg7IOd7ISxXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVGdWxsVGl0bGVQcmV2aWV3KCkge1xuICAgICAgbGV0IGh0bWwgPSAnJztcblxuICAgICAgdGVtcGxhdGVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBodG1sICs9ICc8ZGl2IGNsYXNzPVwicG9saWN5LWl0ZW1cIj4nO1xuICAgICAgICBodG1sICs9ICc8c3BhbiBjbGFzcz1cInBvbGljeS10aXRsZVwiPicgKyBpdGVtLnRpdGxlICsgJzwvc3Bhbj4nO1xuXG4gICAgICAgIC8vIOuCtOyaqeydtCAn64K07JqpIOyXhuydjCfsnbQg7JWE64uMIOqyveyasOyXkOunjCBwb2xpY3ktY29udGVudCDstpTqsIBcbiAgICAgICAgaWYgKGl0ZW0uY29udGVudCAmJiBpdGVtLmNvbnRlbnQgIT09ICfrgrTsmqkg7JeG7J2MJykge1xuICAgICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJwb2xpY3ktY29udGVudFwiPicgKyBpdGVtLmNvbnRlbnQgKyAnPC9kaXY+JztcbiAgICAgICAgfVxuICAgICAgICBodG1sICs9ICc8L2Rpdj4nO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIC8vIOuvuOumrOuztOq4sCDsg53shLFcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUxpc3RQcmV2aWV3KCkge1xuICAgICAgbGV0IGh0bWwgPSAnJztcblxuICAgICAgdGVtcGxhdGVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBodG1sICs9ICc8ZGl2IGNsYXNzPVwicG9saWN5LWl0ZW1cIj4nO1xuICAgICAgICBodG1sICs9ICc8c3BhbiBjbGFzcz1cInBvbGljeS10aXRsZVwiPicgKyBpdGVtLnRpdGxlICsgJzwvc3Bhbj4nO1xuXG4gICAgICAgIC8vIOuCtOyaqeydtCDsnojripQg6rK97Jqw7JeQ66eMIHBvbGljeS1saXN0IOy2lOqwgFxuICAgICAgICBpZiAoaXRlbS5jb250ZW50ICYmIGl0ZW0uY29udGVudC50cmltKCkpIHtcbiAgICAgICAgICBjb25zdCBsaXN0VHlwZSA9IGl0ZW0ubGlzdFR5cGUgfHwgJ3VsJztcblxuICAgICAgICAgIGlmIChsaXN0VHlwZSA9PT0gJ2h5cGhlbicpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJzx1bCBjbGFzcz1cInBvbGljeS1saXN0IGh5cGhlbi1saXN0XCI+JztcbiAgICAgICAgICB9IGVsc2UgaWYgKGxpc3RUeXBlID09PSAnb2wnKSB7XG4gICAgICAgICAgICBodG1sICs9ICc8b2wgY2xhc3M9XCJwb2xpY3ktbGlzdFwiPic7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJzx1bCBjbGFzcz1cInBvbGljeS1saXN0XCI+JzsgIC8vIOq4sOuzuOqwkuydgCB1bFxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIOykkeyyqSDrpqzsiqTtirgg7LKY66asXG4gICAgICAgICAgY29uc3QgcHJvY2Vzc05lc3RlZExpc3QgPSAoY29udGVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCBsaW5lID0gbGluZXNbaV0udHJpbSgpO1xuICAgICAgICAgICAgICBpZiAoIWxpbmUpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgIC8vIOuTpOyXrOyTsOq4sOqwgCDsnojripTsp4Ag7ZmV7J24ICjtg60g65iQ64qUIOqzteuwsSAy6rCcIOydtOyDgSlcbiAgICAgICAgICAgICAgY29uc3QgaW5kZW50YXRpb24gPSBsaW5lc1tpXS5tYXRjaCgvXihcXHMrKS8pO1xuXG4gICAgICAgICAgICAgIGlmIChpbmRlbnRhdGlvbiAmJiAoaW5kZW50YXRpb25bMV0ubGVuZ3RoID49IDIgfHwgaW5kZW50YXRpb25bMV0uaW5jbHVkZXMoJ1xcdCcpKSkge1xuICAgICAgICAgICAgICAgIC8vIOydtOyghCDspITsnbQg66as7Iqk7Yq4IOyVhOydtO2FnOydtOuptCDspJHssqkg66as7Iqk7Yq4IOyLnOyekVxuICAgICAgICAgICAgICAgIGlmIChpID4gMCAmJiByZXN1bHQuZW5kc1dpdGgoJzwvbGk+JykpIHtcbiAgICAgICAgICAgICAgICAgIC8vIOuniOyngOuniSA8L2xpPiDsoJzqsbBcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcoMCwgcmVzdWx0Lmxlbmd0aCAtIDUpO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICc8dWwgY2xhc3M9XCJuZXN0ZWQtbGlzdFwiPic7XG4gICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJzxsaT4nICsgcHJlc2VydmVIVE1MVGFncyhsaW5lKSArICc8L2xpPic7XG5cbiAgICAgICAgICAgICAgICAgIC8vIOuLpOydjCDspITrj4Qg65Ok7Jes7JOw6riw6rCAIOyeiOuKlOyngCDtmZXsnbhcbiAgICAgICAgICAgICAgICAgIGxldCBqID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IGxpbmVzLmxlbmd0aCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2pdLnRyaW0oKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2pdLm1hdGNoKC9eKFxccyspLykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAobGluZXNbal0ubWF0Y2goL14oXFxzKykvKVsxXS5sZW5ndGggPj0gMiB8fCBsaW5lc1tqXS5tYXRjaCgvXihcXHMrKS8pWzFdLmluY2x1ZGVzKCdcXHQnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICc8bGk+JyArIHByZXNlcnZlSFRNTFRhZ3MobGluZXNbal0udHJpbSgpKSArICc8L2xpPic7XG4gICAgICAgICAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICc8L3VsPjwvbGk+JztcbiAgICAgICAgICAgICAgICAgIGkgPSBqIC0gMTsgLy8g64uk7J2MIOuwmOuzteyXkOyEnCDsspjrpqztlaAg7J24642x7IqkIOyhsOyglVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJzxsaT4nICsgcHJlc2VydmVIVE1MVGFncyhsaW5lKSArICc8L2xpPic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnPGxpPicgKyBsaW5lICsgJzwvbGk+JztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBodG1sICs9IHByb2Nlc3NOZXN0ZWRMaXN0KGl0ZW0uY29udGVudCk7XG4gICAgICAgICAgaWYgKGxpc3RUeXBlID09PSAnb2wnKSB7XG4gICAgICAgICAgICBodG1sICs9ICc8L29sPic7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJzwvdWw+JztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaHRtbCArPSAnPC9kaXY+JztcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICAvLyDrr7jrpqzrs7TquLAg7IOd7ISxXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVCb3hQcmV2aWV3KCkge1xuICAgICAgbGV0IGh0bWwgPSAnJztcblxuICAgICAgdGVtcGxhdGVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBodG1sICs9ICc8ZGl2IGNsYXNzPVwicG9saWN5LWl0ZW1cIj4nO1xuICAgICAgICBodG1sICs9ICc8c3BhbiBjbGFzcz1cInBvbGljeS10aXRsZVwiPicgKyBpdGVtLnRpdGxlICsgJzwvc3Bhbj4nO1xuXG4gICAgICAgIC8vIOuCtOyaqeydtCDsnojripQg6rK97Jqw7JeQ66eMIHBvbGljeS1jb250ZW50IOy2lOqwgFxuICAgICAgICBpZiAoaXRlbS5jb250ZW50ICYmIGl0ZW0uY29udGVudC50cmltKCkpIHtcbiAgICAgICAgICBodG1sICs9ICc8ZGl2IGNsYXNzPVwicG9saWN5LWNvbnRlbnQgYm94LXN0eWxlXCI+JyArIGl0ZW0uY29udGVudCArICc8L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIGh0bWwgKz0gJzwvZGl2Pic7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgLy8g7L2U65OcIOyDneyEsSDtlajsiJhcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVRlbXBsYXRlQ29kZSgpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlVHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wbGF0ZVR5cGUnKS52YWx1ZTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZENvZGVFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dlbmVyYXRlZENvZGUnKTtcblxuICAgICAgaWYgKHRlbXBsYXRlSXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGFsZXJ0KCfsg53shLHtlaAg7ZWt66qp7J20IOyXhuyKteuLiOuLpC4g7ZWt66qp7J2EIOuovOyggCDstpTqsIDtlbTso7zshLjsmpQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGdlbmVyYXRlZEhUTUwgPSAnJztcblxuICAgICAgc3dpdGNoICh0ZW1wbGF0ZVR5cGUpIHtcbiAgICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgICAgZ2VuZXJhdGVkSFRNTCA9IGdlbmVyYXRlRnVsbFRpdGxlSFRNTCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICBnZW5lcmF0ZWRIVE1MID0gZ2VuZXJhdGVMaXN0SFRNTCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JveCc6XG4gICAgICAgIGdlbmVyYXRlZEhUTUwgPSBnZW5lcmF0ZUJveEhUTUwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGdlbmVyYXRlZENvZGVFbGVtLnZhbHVlID0gZ2VuZXJhdGVkSFRNTDtcbiAgICB9XG5cbiAgICAvLyDtg4DsnbTti4AgSFRNTCDsg53shLFcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUZ1bGxUaXRsZUhUTUwoKSB7XG4gICAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgICB0ZW1wbGF0ZUl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGh0bWwgKz0gJyAgPGRpdiBjbGFzcz1cInBvbGljeS1pdGVtXCI+XFxuJztcbiAgICAgICAgaHRtbCArPSAnICAgIDxzcGFuIGNsYXNzPVwicG9saWN5LXRpdGxlXCI+JyArIGl0ZW0udGl0bGUgKyAnPC9zcGFuPlxcbic7XG5cbiAgICAgICAgLy8g64K07Jqp7J20ICfrgrTsmqkg7JeG7J2MJ+ydtCDslYTri4wg6rK97Jqw7JeQ66eMIHBvbGljeS1jb250ZW50IOy2lOqwgFxuICAgICAgICBpZiAoaXRlbS5jb250ZW50ICYmIGl0ZW0uY29udGVudCAhPT0gJ+uCtOyaqSDsl4bsnYwnKSB7XG4gICAgICAgICAgaHRtbCArPSAnICAgIDxkaXYgY2xhc3M9XCJwb2xpY3ktY29udGVudFwiPicgKyBpdGVtLmNvbnRlbnQgKyAnPC9kaXY+XFxuJztcbiAgICAgICAgfVxuXG4gICAgICAgIGh0bWwgKz0gJyAgPC9kaXY+XFxuJztcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICAvLyBIVE1MIOyDneyEsVxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlTGlzdEhUTUwoKSB7XG4gICAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgICB0ZW1wbGF0ZUl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGh0bWwgKz0gJyAgPGRpdiBjbGFzcz1cInBvbGljeS1pdGVtXCI+XFxuJztcbiAgICAgICAgaHRtbCArPSAnICAgIDxzcGFuIGNsYXNzPVwicG9saWN5LXRpdGxlXCI+JyArIGl0ZW0udGl0bGUgKyAnPC9zcGFuPlxcbic7XG5cbiAgICAgICAgLy8g64K07Jqp7J20IOyeiOuKlCDqsr3smrDsl5Drp4wgcG9saWN5LWxpc3Qg7LaU6rCAXG4gICAgICAgIGlmIChpdGVtLmNvbnRlbnQgJiYgaXRlbS5jb250ZW50LnRyaW0oKSkge1xuICAgICAgICAgIGNvbnN0IGxpc3RUeXBlID0gaXRlbS5saXN0VHlwZSB8fCAndWwnO1xuXG4gICAgICAgICAgaWYgKGxpc3RUeXBlID09PSAnaHlwaGVuJykge1xuICAgICAgICAgICAgaHRtbCArPSAnICAgIDx1bCBjbGFzcz1cInBvbGljeS1saXN0IGh5cGhlbi1saXN0XCI+XFxuJztcbiAgICAgICAgICB9IGVsc2UgaWYgKGxpc3RUeXBlID09PSAnb2wnKSB7XG4gICAgICAgICAgICBodG1sICs9ICcgICAgPG9sIGNsYXNzPVwicG9saWN5LWxpc3RcIj5cXG4nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodG1sICs9ICcgICAgPHVsIGNsYXNzPVwicG9saWN5LWxpc3RcIj5cXG4nO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIOykkeyyqSDrpqzsiqTtirgg7LKY66asXG4gICAgICAgICAgY29uc3QgcHJvY2Vzc05lc3RlZExpc3QgPSAoY29udGVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCBsaW5lID0gbGluZXNbaV0udHJpbSgpO1xuICAgICAgICAgICAgICBpZiAoIWxpbmUpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgIC8vIOuTpOyXrOyTsOq4sOqwgCDsnojripTsp4Ag7ZmV7J24ICjtg60g65iQ64qUIOqzteuwsSAy6rCcIOydtOyDgSlcbiAgICAgICAgICAgICAgY29uc3QgaW5kZW50YXRpb24gPSBsaW5lc1tpXS5tYXRjaCgvXihcXHMrKS8pO1xuXG4gICAgICAgICAgICAgIGlmIChpbmRlbnRhdGlvbiAmJiAoaW5kZW50YXRpb25bMV0ubGVuZ3RoID49IDIgfHwgaW5kZW50YXRpb25bMV0uaW5jbHVkZXMoJ1xcdCcpKSkge1xuICAgICAgICAgICAgICAgIC8vIOydtOyghCDspITsnbQg66as7Iqk7Yq4IOyVhOydtO2FnOydtOuptCDspJHssqkg66as7Iqk7Yq4IOyLnOyekVxuICAgICAgICAgICAgICAgIGlmIChpID4gMCAmJiByZXN1bHQuZW5kc1dpdGgoJzwvbGk+XFxuJykpIHtcbiAgICAgICAgICAgICAgICAgIC8vIOuniOyngOuniSA8L2xpPiDsoJzqsbBcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcoMCwgcmVzdWx0Lmxlbmd0aCAtIDYpO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICdcXG4gICAgICAgIDx1bCBjbGFzcz1cIm5lc3RlZC1saXN0XCI+XFxuJztcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnICAgICAgICAgIDxsaT4nICsgcHJlc2VydmVIVE1MVGFncyhsaW5lKSArICc8L2xpPlxcbic7XG5cbiAgICAgICAgICAgICAgICAgIC8vIOuLpOydjCDspITrj4Qg65Ok7Jes7JOw6riw6rCAIOyeiOuKlOyngCDtmZXsnbhcbiAgICAgICAgICAgICAgICAgIGxldCBqID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IGxpbmVzLmxlbmd0aCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2pdLnRyaW0oKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzW2pdLm1hdGNoKC9eKFxccyspLykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAobGluZXNbal0ubWF0Y2goL14oXFxzKykvKVsxXS5sZW5ndGggPj0gMiB8fCBsaW5lc1tqXS5tYXRjaCgvXihcXHMrKS8pWzFdLmluY2x1ZGVzKCdcXHQnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgICAgICAgICAgPGxpPicgKyBwcmVzZXJ2ZUhUTUxUYWdzKGxpbmVzW2pdLnRyaW0oKSkgKyAnPC9saT5cXG4nO1xuICAgICAgICAgICAgICAgICAgICBqKys7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnICAgICAgICA8L3VsPlxcbiAgICAgIDwvbGk+XFxuJztcbiAgICAgICAgICAgICAgICAgIGkgPSBqIC0gMTsgLy8g64uk7J2MIOuwmOuzteyXkOyEnCDsspjrpqztlaAg7J24642x7IqkIOyhsOyglVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJyAgICAgIDxsaT4nICsgbGluZSArICc8L2xpPlxcbic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnICAgICAgPGxpPicgKyBsaW5lICsgJzwvbGk+XFxuJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBodG1sICs9IHByb2Nlc3NOZXN0ZWRMaXN0KGl0ZW0uY29udGVudCk7XG4gICAgICAgICAgaWYgKGxpc3RUeXBlID09PSAnb2wnKSB7XG4gICAgICAgICAgICBodG1sICs9ICcgICAgPC9vbD5cXG4nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodG1sICs9ICcgICAgPC91bD5cXG4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLmJ1dHRvbkhUTUwpIHtcbiAgICAgICAgICBodG1sICs9ICcgICAgJyArIGl0ZW0uYnV0dG9uSFRNTCArICdcXG4nO1xuICAgICAgICB9XG5cbiAgICAgICAgaHRtbCArPSAnICA8L2Rpdj5cXG4nO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIC8vIEhUTUwg7IOd7ISxXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVCb3hIVE1MKCkge1xuICAgICAgbGV0IGh0bWwgPSAnJztcblxuICAgICAgdGVtcGxhdGVJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBodG1sICs9ICcgIDxkaXYgY2xhc3M9XCJwb2xpY3ktaXRlbVwiPlxcbic7XG4gICAgICAgIGh0bWwgKz0gJyAgICA8c3BhbiBjbGFzcz1cInBvbGljeS10aXRsZVwiPicgKyBpdGVtLnRpdGxlICsgJzwvc3Bhbj5cXG4nO1xuXG4gICAgICAgIC8vIOuCtOyaqeydtCDsnojripQg6rK97Jqw7JeQ66eMIHBvbGljeS1jb250ZW50IOy2lOqwgFxuICAgICAgICBpZiAoaXRlbS5jb250ZW50ICYmIGl0ZW0uY29udGVudC50cmltKCkpIHtcbiAgICAgICAgICBodG1sICs9ICcgICAgPGRpdiBjbGFzcz1cInBvbGljeS1jb250ZW50IGJveC1zdHlsZVwiPicgKyBpdGVtLmNvbnRlbnQgKyAnPC9kaXY+XFxuJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLmJ1dHRvbkhUTUwpIHtcbiAgICAgICAgICBodG1sICs9ICcgICAgJyArIGl0ZW0uYnV0dG9uSFRNTCArICdcXG4nO1xuICAgICAgICB9XG5cbiAgICAgICAgaHRtbCArPSAnICA8L2Rpdj5cXG4nO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIC8vIO2DgOyehSDrs4Dqsr0g7J2067Kk7Yq4XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlbXBsYXRlVHlwZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdGVtcGxhdGVUeXBlID0gdGhpcy52YWx1ZTtcbiAgICAgIGNvbnN0IGNvbnRlbnRHcm91cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dC1ncm91cDpudGgtY2hpbGQoMiknKTtcblxuICAgICAgLy8g7YOA7J207YuAIOycoO2YleydvCDqsr3smrAg64K07JqpIOyeheugpeuegCDsiKjquLDquLBcbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICd0aXRsZScpIHtcbiAgICAgICAgY29udGVudEdyb3VwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250ZW50R3JvdXAuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZVByZXZpZXcoKTtcbiAgICB9KTtcblxuICAgIC8vIOuLqOy2le2CpCDsnbTrsqTtirgg66as7Iqk64SI64qUIOyghOyXreycvOuhnCDsnbTrj5ntlojsnLzri4gg7Jes6riw7ISc64qUIOyCreygnFxuICB9XG5cbiAgLy8g7YWc7ZSM66a/IOycoO2YleuzhCDsmIjsi5wg7LaU6rCAXG4gIGZ1bmN0aW9uIGFkZFRlbXBsYXRlRXhhbXBsZXMoKSB7XG4gICAgY29uc3QgdGVtcGxhdGVUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlbXBsYXRlVHlwZScpO1xuXG4gICAgLy8g7LSI6riwIOyYiOyLnCDshKTsoJUgKOq4sOuzuCDtg4DsnbTti4ApXG4gICAgdGVtcGxhdGVUeXBlLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSk7XG4gIH1cblxuICAvLyDsoITsl60g67OA7IiY66GcIOuqqOuLrCDsoJHqt7ztlaAg7IiYIOyeiOuPhOuhnSDshKTsoJVcbiAgbGV0IHByaXZhY3lQb2xpY3lNb2RhbDtcbiAgbGV0IHRlbXBsYXRlSXRlbXMgPSBbXTtcblxuICAvLyDrqqjri6wg7Je06riwIO2VqOyImCAtIOyghOyXrSDsiqTsvZTtlITroZwg7J2064+ZXG4gIGZ1bmN0aW9uIG9wZW5Qcml2YWN5UG9saWN5TW9kYWwoKSB7XG4gICAgaWYgKCFwcml2YWN5UG9saWN5TW9kYWwpIHtcbiAgICAgIGluaXRQcml2YWN5UG9saWN5TW9kYWwoKTtcbiAgICAgIHByaXZhY3lQb2xpY3lNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcml2YWN5UG9saWN5TW9kYWwnKTtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RhbERpbW0gPSBwcml2YWN5UG9saWN5TW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWRpbW0nKTtcbiAgICBjb25zdCBtb2RhbENvbnRhaW5lciA9IHByaXZhY3lQb2xpY3lNb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY29udGFpbmVyJyk7XG5cbiAgICBwcml2YWN5UG9saWN5TW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgbW9kYWxEaW1tLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gIH1cblxuICAvLyDri6jstpXtgqQg7J2067Kk7Yq4IOumrOyKpOuEiCAtIOyghOyXrSDsiqTsvZTtlITroZwg7J2064+ZXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgIC8vIEFsdCArIFA6IO2MneyXhSDsl7TquLBcbiAgICBpZiAoZS5hbHRLZXkgJiYgZS5rZXkgPT09ICdwJykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgb3BlblByaXZhY3lQb2xpY3lNb2RhbCgpO1xuICAgIH1cblxuICAgIC8vIOuqqOuLrOydtCDsl7TroKTsnojsnYQg65WM66eMIOuLpOuluCDri6jstpXtgqQg7Zmc7ISx7ZmUXG4gICAgaWYgKHByaXZhY3lQb2xpY3lNb2RhbCAmJiBwcml2YWN5UG9saWN5TW9kYWwuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJykge1xuICAgICAgLy8gQWx0ICsgRzog66+466asIOuztOq4sCDrsI8g7L2U65OcIOyDneyEsVxuICAgICAgaWYgKGUuYWx0S2V5ICYmIGUua2V5ID09PSAnZycpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBhZGRJdGVtQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZEl0ZW0nKTtcbiAgICAgICAgaWYgKGFkZEl0ZW1CdG4pIGFkZEl0ZW1CdG4uY2xpY2soKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWx0ICsgQzog7LSI6riw7ZmUXG4gICAgICBpZiAoZS5hbHRLZXkgJiYgZS5rZXkgPT09ICdjJykge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGRlbGV0ZUl0ZW1CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVsZXRlSXRlbScpO1xuICAgICAgICBpZiAoZGVsZXRlSXRlbUJ0bikgZGVsZXRlSXRlbUJ0bi5jbGljaygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gRE9N7J20IOuhnOuTnOuQnCDtm4Qg7LSI6riw7ZmUXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICBpbml0UHJpdmFjeVBvbGljeU1vZGFsKCk7XG4gICAgYWRkVGVtcGxhdGVFeGFtcGxlcygpO1xuICAgIHByaXZhY3lQb2xpY3lNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcml2YWN5UG9saWN5TW9kYWwnKTtcbiAgICBzZXR1cEZvcm1hdHRpbmdUb29sYmFyKCk7IC8vIOyEnOyLnSDtiLTrsJQg7LSI6riw7ZmUXG4gIH0pO1xufSkoKTtcbiIsImZ1bmN0aW9uIHNlbGVjdEJveFRtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUN1c3RvbUhUTUwgPSB7XG4gICAgbGFiZWwodGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBpZD1cImNvbWJvMS1sYWJlbFwiIGNsYXNzPVwiY29tYm8tbGFiZWxcIj4ke3RleHR9PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgc2VsZWN0QnRuKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImNvbWJvMVwiIGNsYXNzPVwic2VsZWN0LWJveFwiIHJvbGU9XCJjb21ib2JveFwiIGFyaWEtY29udHJvbHM9XCJsaXN0Ym94MVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGFyaWEtbGFiZWxsZWRieT1cImNvbWJvMS1sYWJlbFwiIGFyaWEtYWN0aXZlZGVzY2VuZGFudD1cIlwiPlxuICAgICAgICA8c3BhbiBzdHlsZT1cInBvaW50ZXItZXZlbnRzOiBub25lO1wiPiR7dGV4dH08L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtc1dyYXAoaXRlbXNIVE1MKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8dWwgaWQ9XCJsaXN0Ym94MVwiIGNsYXNzPVwic2VsZWN0LW9wdGlvbnNcIiByb2xlPVwibGlzdGJveFwiIGFyaWEtbGFiZWxsZWRieT1cImNvbWJvMS1sYWJlbFwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgICAke2l0ZW1zSFRNTH1cbiAgICAgICAgPC91bD5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtcyhpdGVtLCBzZWxlY3RlZCA9IGZhbHNlKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8bGkgcm9sZT1cIm9wdGlvblwiIGNsYXNzPVwib3B0aW9uXCIgYXJpYS1zZWxlY3RlZD1cIiR7c2VsZWN0ZWR9XCIgZGF0YS12YWx1ZT1cIiR7aXRlbS52YWx1ZX1cIj5cbiAgICAgICAgICAke2l0ZW0udGV4dH1cbiAgICAgICAgPC9saT5cbiAgICAgIGA7XG4gICAgfSxcbiAgfTtcblxuICBjb25zdCAkdGVtcGxhdGVCYXNpY0hUTUwgPSB7XG4gICAgbGFiZWwodGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBpZD1cImNvbWJvMS1sYWJlbFwiIGNsYXNzPVwiY29tYm8tbGFiZWxcIj4ke3RleHR9PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgc2VsZWN0QnRuKHRleHQpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIiBzZWxlY3RlZCBkaXNhYmxlZCBoaWRkZW4+JHt0ZXh0fTwvb3B0aW9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zV3JhcChpdGVtc0hUTUwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9XCJzZWxlY3QtbGlzdFwiIHJlcXVpcmVkPlxuICAgICAgICAgICR7aXRlbXNIVE1MfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBpdGVtcyhpdGVtLCBzZWxlY3RlZCA9IGZhbHNlKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiPiR7aXRlbS50ZXh0fTwvb3B0aW9uPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlQ3VzdG9tSFRNTCxcbiAgICAkdGVtcGxhdGVCYXNpY0hUTUwsXG4gIH07XG59XG4iLCJmdW5jdGlvbiBzd2lwZXJUbXBsKCkge1xuICBjb25zdCAkdGVtcGxhdGVIVE1MID0ge1xuICAgIG5hdmlnYXRpb24oY2xhc3NOYW1lID0gJycpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItbmF2aWdhdGlvbiAke2NsYXNzTmFtZX1cIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInN3aXBlci1idXR0b24tcHJldlwiPjxzcGFuIGNsYXNzPVwiaGlkZS10eHRcIj4ke2V0VUkuJHQoJ3N3aXBlci5uYXZpZ2F0aW9uLnByZXYnLCAn7J207KCEIOyKrOudvOydtOuTnCcpfTwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInN3aXBlci1idXR0b24tbmV4dFwiPjxzcGFuIGNsYXNzPVwiaGlkZS10eHRcIj4ke2V0VUkuJHQoJ3N3aXBlci5uYXZpZ2F0aW9uLm5leHQnLCAn64uk7J2MIOyKrOudvOydtOuTnCcpfTwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgcGFnaW5hdGlvbihjbGFzc05hbWUgPSAnJykge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1wYWdpbmF0aW9uICR7Y2xhc3NOYW1lfVwiPjwvZGl2PlxuICAgICAgYDtcbiAgICB9LFxuICAgIGF1dG9wbGF5KCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1hdXRvcGxheS13cmFwXCI+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYXV0b3BsYXkgcGxheVwiPjxzcGFuIGNsYXNzPVwiaGlkZS10eHRcIj4ke2V0VUkuJHQoJ3N3aXBlci5hdXRvcGxheS5zdG9wJywgJ+ygleyngCcpfTwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgc3dpcGVyQ29udHJvbHMoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLWNvbnRyb2xzXCI+PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgcHJldkVsKGNsYXNzTmFtZSA9IG51bGwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLW5hdmlnYXRpb24gJHtjbGFzc05hbWV9XCI+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWJ1dHRvbi1wcmV2XCI+PHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPiR7ZXRVSS4kdCgnc3dpcGVyLm5hdmlnYXRpb24ucHJldicsICfsnbTsoIQg7Iqs65287J2065OcJyl9PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgbmV4dEVsKGNsYXNzTmFtZSA9IG51bGwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLW5hdmlnYXRpb24gJHtjbGFzc05hbWV9XCI+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWJ1dHRvbi1uZXh0XCI+PHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPiR7ZXRVSS4kdCgnc3dpcGVyLm5hdmlnYXRpb24ubmV4dCcsICfri6TsnYwg7Iqs65287J2065OcJyl9PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVIVE1MLFxuICB9O1xufVxuIiwiZnVuY3Rpb24gdG9hc3RUbXBsKCkge1xuICBjb25zdCAkdGVtcGxhdGVIVE1MID0gKHsgbWVzc2FnZSB9KSA9PiBgXG4gICAgICA8ZGl2IGNsYXNzPVwidG9hc3QtY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdC1jb250ZW50XCI+XG4gICAgICAgICAgPHAgY2xhc3M9XCJ0b2FzdC10eHRcIj4ke21lc3NhZ2V9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG4gIGNvbnN0ICR0ZW1wbGF0Q2xvc2VIVE1MID0gKHsgbWVzc2FnZSwgY2xvc2VUZXh0IH0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdC1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbnRlbnRcIj5cbiAgICAgICAgICA8cCBjbGFzcz1cInRvYXN0LXR4dFwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInRvYXN0LWNsb3NlLWJ0blwiPiR7Y2xvc2VUZXh0fTxzcGFuIGNsYXNzPVwiaGlkZS10eHRcIj7tjJ3sl4Ug64ur6riwPC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgY29uc3QgJHRlbXBsYXRlTGlua0hUTUwgPSAoeyBtZXNzYWdlLCBsaW5rIH0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdC1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbnRlbnRcIj5cbiAgICAgICAgICA8cCBjbGFzcz1cInRvYXN0LXR4dFwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgICAgPGEgaHJlZj1cIiR7bGlua31cIiBjbGFzcz1cInRvYXN0LWxpbmstYnRuXCI+66eB7YGsPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVIVE1MLFxuICAgICR0ZW1wbGF0Q2xvc2VIVE1MLFxuICAgICR0ZW1wbGF0ZUxpbmtIVE1MXG4gIH07XG59XG4iXX0=
