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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIiwidXRpbHMvYXJyYXkuanMiLCJ1dGlscy9ib29sZWFuLmpzIiwidXRpbHMvZGF0ZS5qcyIsInV0aWxzL2RvbS5qcyIsInV0aWxzL2ZuLmpzIiwidXRpbHMvbWF0aC5qcyIsInV0aWxzL29iamVjdC5qcyIsInV0aWxzL3N0cmluZy5qcyIsInV0aWxzL2luZGV4LmNqcyIsImhvb2tzL3VzZUExMXlLZXlFdmVudC5qcyIsImhvb2tzL3VzZUNsaWNrT3V0c2lkZS5qcyIsImhvb2tzL3VzZUNvcmUuanMiLCJob29rcy91c2VEYXRhc2V0LmpzIiwiaG9va3MvdXNlRGlhbG9nLmpzIiwiaG9va3MvdXNlRGlhbG9nVG1wbC5qcyIsImhvb2tzL3VzZUV2ZW50TGlzdGVuZXIuanMiLCJob29rcy91c2VHZXRDbGllbnRSZWN0LmpzIiwiaG9va3MvdXNlTGF5ZXIuanMiLCJob29rcy91c2VNZWRpYVF1ZXJ5LmpzIiwiaG9va3MvdXNlTXV0YXRpb25TdGF0ZS5qcyIsImhvb2tzL3VzZVNlbGVjdEJveFRtcGwuanMiLCJob29rcy91c2VTdGF0ZS5qcyIsImhvb2tzL3VzZVN3aXBlclRtcGwuanMiLCJob29rcy91c2VUcmFuc2l0aW9uLmpzIiwiaG9va3MvaW5kZXguY2pzIiwiY29tcG9uZW50cy9BY2NvcmRpb24uanMiLCJjb21wb25lbnRzL0NvbGxhcHNlLmpzIiwiY29tcG9uZW50cy9EYXRlcGlja2VyQ29tcC5qcyIsImNvbXBvbmVudHMvRGlhbG9nLmpzIiwiY29tcG9uZW50cy9JbnB1dC5qcyIsImNvbXBvbmVudHMvTG90dGllLmpzIiwiY29tcG9uZW50cy9Nb2RhbC5qcyIsImNvbXBvbmVudHMvU2VsZWN0Ym94LmpzIiwiY29tcG9uZW50cy9Td2lwZXIuanMiLCJjb21wb25lbnRzL1RhYi5qcyIsImNvbXBvbmVudHMvVG9hc3QuanMiLCJjb21wb25lbnRzL1Rvb2x0aXAuanMiLCJjb21wb25lbnRzL2luZGV4LmNqcyIsImluaXQuanMiLCJ0ZW1wbGF0ZXMvZGlhbG9nVG1wbC5qcyIsInRlbXBsYXRlcy9pbmRleC5janMiLCJ0ZW1wbGF0ZXMvaW5wdXRUbXBsLmpzIiwidGVtcGxhdGVzL3ByaXZhY3lfcG9saWN5X3RlbXBsYXRlLmpzIiwidGVtcGxhdGVzL3NlbGVjdEJveFRtcGwuanMiLCJ0ZW1wbGF0ZXMvc3dpcGVyVG1wbC5qcyIsInRlbXBsYXRlcy90b2FzdFRtcGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakJBO0FBQ0E7OztBQ0RBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDL1VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDclRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzFnQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXNzZXRzL3NjcmlwdHMvY29tbW9uLnVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZXRVSSA9IHt9O1xuLy8gY29uZmlnXG5ldFVJLmNvbmZpZyA9IHtcbiAgbWVkaWE6IHtcbiAgICBuYW1lczogWydpc01vYmlsZScsICdpc0Rlc2t0b3AnXSxcbiAgICBwb2ludHM6IFsxMDIzXSxcbiAgfSxcbiAgYW5pbWF0aW9uOiB7XG4gICAgZHVyYXRpb246IDAuNCxcbiAgICBzdGFnZ2VyOiAwLjEsXG4gICAgZWFzaW5nOiAnUG93ZXIyLmVhc2VPdXQnLFxuICB9LFxuICBsYXllcjoge1xuICAgIGRpbW1PcGFjaXR5OiAwLjYsXG4gIH0sXG4gIGluaXREZWZhdWx0KCkge1xuICAgIGdzYXAuZGVmYXVsdHMoe1xuICAgICAgZWFzZTogdGhpcy5hbmltYXRpb24uZWFzaW5nLFxuICAgICAgZHVyYXRpb246IHRoaXMuYW5pbWF0aW9uLmR1cmF0aW9uLFxuICAgIH0pO1xuICB9LFxuICBsZW5pczoge1xuICAgIGVuYWJsZTogZmFsc2UsXG4gICAgb3B0aW9uczoge30sXG4gICAgc3BlZWQ6IDIwMDAsXG4gICAgbGFnU21vb3RoaW5nOiAwLFxuICB9LFxuICBsb2NhbGU6IHtcbiAgICBkZWZhdWx0OiAna28nLFxuICB9LFxuICBsb3R0aWU6IHtcbiAgICBiYXNlUGF0aDogbG9jYXRpb24ucGF0aG5hbWUuc3RhcnRzV2l0aCgnL3AvJykgPyAnL3AvYXNzZXRzL2ltYWdlcy9sb3R0aWUnIDogJy9hc3NldHMvaW1hZ2VzL2xvdHRpZScsXG4gIH0sXG59O1xuZXRVSS5jb25maWcuaW5pdERlZmF1bHQoKTtcblxuLy8gcGFnZXNcbmV0VUkucGFnZXMgPSB7fTtcblxuZXRVSS5sb2NhbGVzID0ge307XG5ldFVJLmxvY2FsZXMua28gPSB7XG4gIGlucHV0OiB7XG4gICAgcGFzc3dvcmRfaGlkZTogJ+u5hOuwgOuyiO2YuCDsiKjquLDquLAnLFxuICAgIHBhc3N3b3JkX3Nob3c6ICfruYTrsIDrsojtmLgg7ZGc7IucJyxcbiAgICBjbGVhcjogJ+uCtOyaqSDsp4DsmrDquLAnLFxuICB9LFxuICBzd2lwZXI6IHtcbiAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICBwcmV2OiAn7J207KCEIOyKrOudvOydtOuTnCcsXG4gICAgICBuZXh0OiAn64uk7J2MIOyKrOudvOydtOuTnCcsXG4gICAgfSxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICBwYWdlOiAn7Y6Y7J207KeAJyxcbiAgICB9LFxuICAgIGF1dG9wbGF5OiB7XG4gICAgICBwbGF5OiAn7J6s7IOdJyxcbiAgICAgIHBhdXNlOiAn7KCV7KeAJyxcbiAgICB9LFxuICB9LFxuICBkaWFsb2c6IHtcbiAgICBwb3NpdGl2ZTogJ+2ZleyduCcsXG4gICAgbmVnYXRpdmU6ICfst6jshownLFxuICB9LFxufTtcblxuZXRVSS4kdCA9IGZ1bmN0aW9uIChrZXksIGRlZmF1bHRUZXh0ID0gJycpIHtcbiAgY29uc3QgbG9jYWxlID0gZXRVSS5sb2NhbGVzW2V0VUkuY29uZmlnLmxvY2FsZS5kZWZhdWx0XTtcbiAgcmV0dXJuIGV0VUkudXRpbHMuZ2V0VmFsdWVGcm9tTmVzdGVkT2JqZWN0KGxvY2FsZSwga2V5KSB8fCBkZWZhdWx0VGV4dDtcbn07XG5cbndpbmRvdy5ldFVJID0gZXRVSTtcbiIsIi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIGlzIGFuIGFycmF5XG4gKiBAcGFyYW0gdmFsdWUge2FueX1cbiAqIEByZXR1cm5zIHthcmcgaXMgYW55W119XG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxuXG5cbi8qKlxuICog7ISk66qFXG4gKiBAcGFyYW0gY2xlYW51cHMgIHtmdW5jdGlvbltdfVxuICovXG5mdW5jdGlvbiBhbGxDbGVhbnVwcyhjbGVhbnVwcykge1xuICBjbGVhbnVwcy5mb3JFYWNoKChjbGVhbnVwKSA9PiBjbGVhbnVwKCkpO1xufVxuIiwiLy8gYm9vbGVhbiDqtIDroKgg6riw64qlXG4iLCIvLyDrgqDsp5wg6rSA66CoIOq4sOuKpVxuIiwiLyoqXG4gKiBzZXQgYXR0cmlidXRlXG4gKiBAcGFyYW0geyBFbGVtZW50IH0gcGFyZW50XG4gKiBAcGFyYW0gb3B0c1xuICovXG5mdW5jdGlvbiBzZXRQcm9wZXJ0eShwYXJlbnQsIC4uLm9wdHMpIHtcbiAgaWYgKG9wdHMubGVuZ3RoID09PSAyKSB7XG4gICAgY29uc3QgW3Byb3BlcnR5LCB2YWx1ZV0gPSBvcHRzO1xuXG4gICAgcGFyZW50Py5zZXRBdHRyaWJ1dGUocHJvcGVydHksIHZhbHVlKTtcbiAgfSBlbHNlIGlmIChvcHRzLmxlbmd0aCA9PT0gMykge1xuICAgIGNvbnN0IFtzZWxlY3RvciwgcHJvcGVydHksIHZhbHVlXSA9IG9wdHM7XG5cbiAgICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik/LnNldEF0dHJpYnV0ZShwcm9wZXJ0eSwgdmFsdWUpO1xuICB9XG59XG5cbi8qKlxuICogZ2V0IGF0dHJpYnV0ZVxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxuICogQHBhcmFtIHsgU3RyaW5nIH0gc2VsZWN0b3JcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHByb3BlcnR5XG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5KHBhcmVudCwgc2VsZWN0b3IsIHByb3BlcnR5KSB7XG4gIHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKT8uZ2V0QXR0cmlidXRlKHByb3BlcnR5KTtcbn1cblxuLyoqXG4gKiBzZXQgc3R5bGVcbiAqIEBwYXJhbSB7IEVsZW1lbnQgfSBwYXJlbnRcbiAqIEBwYXJhbSB7IFN0cmluZyB9IHNlbGVjdG9yXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBwcm9wZXJ0eVxuICogQHBhcmFtIHsgYW55IH0gdmFsdWVcbiAqL1xuZnVuY3Rpb24gc2V0U3R5bGUocGFyZW50LCBzZWxlY3RvciwgcHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpIHtcbiAgICBwYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcikuc3R5bGVbcHJvcGVydHldID0gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBnc2Fw7J2YIFNwbGl0VGV4dOulvCDtmZzsmqntlZjsl6wg66y47J6Q66W8IOu2hOumrO2VmOyXrCDrp4jsiqTtgawg6rCA64ql7ZWY6rKMIO2VtOykgOuLpC5cbiAqIEBwYXJhbSBzZWxlY3RvciAge3N0cmluZ31cbiAqIEBwYXJhbSB0eXBlICB7J2xpbmVzJ3wnd29yZHMnfCdjaGFycyd9XG4gKiBAcmV0dXJucyBbSFRNTEVsZW1lbnRbXSwgSFRNTEVsZW1lbnRbXV1cbiAqL1xuZnVuY3Rpb24gc3BsaXRUZXh0TWFzayhzZWxlY3RvciwgdHlwZSA9ICdsaW5lcycsIGlzT3ZlcmZsb3cgPSB0cnVlKSB7XG4gIGxldCAkcXVvdGU7XG5cbiAgZnVuY3Rpb24gd3JhcChlbCwgd3JhcHBlcikge1xuICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIGVsKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09IFN0cmluZykge1xuICAgICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICB9IGVsc2Uge1xuICAgICRxdW90ZSA9IHNlbGVjdG9yO1xuICB9XG4gIC8vIGNvbnN0ICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLFxuXG4gIGNvbnN0IG15U3BsaXRUZXh0ID0gbmV3IFNwbGl0VGV4dCgkcXVvdGUsIHsgdHlwZSB9KTtcblxuICBjb25zdCAkc3BsaXR0ZWQgPSBteVNwbGl0VGV4dFt0eXBlXTtcbiAgY29uc3QgJGxpbmVXcmFwID0gW107XG4gICRzcGxpdHRlZC5mb3JFYWNoKCgkZWwsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgJGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGlmIChpc092ZXJmbG93KSB7XG4gICAgICAkZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgfVxuICAgICRkaXYuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIC8vICRkaXYuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgJGRpdi5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgJGRpdi5jbGFzc0xpc3QuYWRkKCdzcGxpdC10ZXh0LXdyYXAnKTtcbiAgICB3cmFwKCRlbCwgJGRpdik7XG4gICAgJGxpbmVXcmFwLnB1c2goJGRpdik7XG4gIH0pO1xuXG4gIHJldHVybiBbJHNwbGl0dGVkLCAkbGluZVdyYXBdO1xufVxuXG5mdW5jdGlvbiBzcGxpdFRleHRNYXNrQmxvY2soc2VsZWN0b3IsIHR5cGUgPSAnbGluZXMnLCBpc092ZXJmbG93ID0gdHJ1ZSkge1xuICBsZXQgJHF1b3RlO1xuXG4gIGZ1bmN0aW9uIHdyYXAoZWwsIHdyYXBwZXIpIHtcbiAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBlbCk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChlbCk7XG4gIH1cblxuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICB9IGVsc2Uge1xuICAgICRxdW90ZSA9IHNlbGVjdG9yO1xuICB9XG4gIC8vIGNvbnN0ICRxdW90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLFxuICBpZiAoWy4uLiRxdW90ZS5jaGlsZHJlbl0uc29tZSgoZWwpID0+IGVsLmNsYXNzTGlzdC5jb250YWlucygnc3BsaXQtdGV4dC13cmFwJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbXlTcGxpdFRleHQgPSBuZXcgU3BsaXRUZXh0KCRxdW90ZSwgeyB0eXBlIH0pO1xuXG4gIGNvbnN0ICRzcGxpdHRlZCA9IG15U3BsaXRUZXh0W3R5cGVdO1xuICBjb25zdCAkbGluZVdyYXAgPSBbXTtcbiAgJHNwbGl0dGVkLmZvckVhY2goKCRlbCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCAkZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaWYgKGlzT3ZlcmZsb3cpIHtcbiAgICAgICRkaXYuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICB9XG4gICAgJGRpdi5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgJGRpdi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAkZGl2LmNsYXNzTGlzdC5hZGQoJ3NwbGl0LXRleHQtd3JhcCcpO1xuICAgIHdyYXAoJGVsLCAkZGl2KTtcbiAgICAkbGluZVdyYXAucHVzaCgkZGl2KTtcbiAgfSk7XG5cbiAgcmV0dXJuIFskc3BsaXR0ZWQsICRsaW5lV3JhcF07XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBlbCAge3N0cmluZ3xIVE1MRWxlbWVudH1cbiAqIEByZXR1cm5zIHtOb2RlfVxuICovXG5mdW5jdGlvbiB3cmFwTWFzayhlbCkge1xuICBjb25zdCAkZWwgPSBldFVJLnV0aWxzLnNlbGVjdG9yU3RyaW5nVG9FbGVtZW50KGVsKTtcbiAgaWYgKCRlbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndWktbWFzaycpKSB7XG4gICAgcmV0dXJuICRlbC5wYXJlbnROb2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcChlbCwgd3JhcHBlcikge1xuICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHdyYXBwZXIsIGVsKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVsKTtcbiAgfVxuXG4gIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoJGVsKTtcbiAgY29uc3QgJGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAkZGl2LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICRkaXYuc3R5bGUucG9zaXRpb24gPSBzdHlsZS5wb3NpdGlvbiB8fCBudWxsO1xuICBpZiAoc3R5bGUucG9zaXRpb24gPT09ICdhYnNvbHV0ZScgfHwgc3R5bGUucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAkZGl2LnN0eWxlLnRvcCA9IHN0eWxlLnRvcDtcbiAgICAkZGl2LnN0eWxlLmxlZnQgPSBzdHlsZS5sZWZ0O1xuICAgICRkaXYuc3R5bGUucmlnaHQgPSBzdHlsZS5yaWdodDtcbiAgICAkZGl2LnN0eWxlLmJvdHRvbSA9IHN0eWxlLmJvdHRvbTtcblxuICAgICRlbC5zdHlsZS50b3AgPSAwO1xuICAgICRlbC5zdHlsZS5sZWZ0ID0gMDtcbiAgICAkZWwuc3R5bGUucmlnaHQgPSAwO1xuICAgICRlbC5zdHlsZS5ib3R0b20gPSAwO1xuICB9XG4gICRkaXYuc3R5bGUuZGlzcGxheSA9IHN0eWxlLmRpc3BsYXkgfHwgbnVsbDtcbiAgJGRpdi5jbGFzc0xpc3QuYWRkKCd1aS1tYXNrJyk7XG4gIHdyYXAoJGVsLCAkZGl2KTtcblxuICByZXR1cm4gJGRpdjtcbn1cblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiBzZXREb2NIZWlnaHQoKSB7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1kb2MtaGVpZ2h0Jywgd2luZG93LmlubmVySGVpZ2h0ICsgJ3B4Jyk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5kYXRhc2V0LmRvY0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGFyckJyZWFrUG9pbnROYW1lXG4gKiBAcGFyYW0gYXJyQnJlYWtQb2ludFxuICogQHJldHVybnMge3t9fVxuICovXG5mdW5jdGlvbiBnZXRNZWRpYVF1ZXJ5Q29uZGl0aW9uKGFyckJyZWFrUG9pbnROYW1lLCBhcnJCcmVha1BvaW50KSB7XG4gIGlmIChhcnJCcmVha1BvaW50TmFtZS5sZW5ndGggIT09IGFyckJyZWFrUG9pbnQubGVuZ3RoICsgMSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ2FyckJyZWFrUG9pbnROYW1lLmxlbmd0aCAhPT0gYXJyQnJlYWtQb2ludC5sZW5ndGggKyAxJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbWVkaWFRdWVyeUNvbmRpdGlvbiA9IHt9O1xuXG4gIGNvbnN0IGFyciA9IFtdLFxuICAgIGxlbmd0aCA9IGFyckJyZWFrUG9pbnQubGVuZ3RoO1xuICBhcnIucHVzaChgKG1heC13aWR0aDogJHthcnJCcmVha1BvaW50WzBdIC0gMX1weClgKTtcblxuICBuZXcgQXJyYXkobGVuZ3RoIC0gMSkuZmlsbCgwKS5mb3JFYWNoKChfLCBpbmRleCkgPT4ge1xuICAgIGFyci5wdXNoKGAobWluLXdpZHRoOiAke2FyckJyZWFrUG9pbnRbaW5kZXhdfXB4KSBhbmQgKG1heC13aWR0aDogJHthcnJCcmVha1BvaW50W2luZGV4ICsgMV0gLSAxfXB4KWApO1xuICB9KTtcblxuICBhcnIucHVzaChgKG1pbi13aWR0aDogJHthcnJCcmVha1BvaW50W2xlbmd0aCAtIDFdfXB4KWApO1xuXG4gIGFyckJyZWFrUG9pbnROYW1lLmZvckVhY2goKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgbWVkaWFRdWVyeUNvbmRpdGlvbltuYW1lXSA9IGFycltpbmRleF07XG4gIH0pO1xuXG4gIG1lZGlhUXVlcnlDb25kaXRpb25bJ3JlZHVjZU1vdGlvbiddID0gJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJztcbiAgbWVkaWFRdWVyeUNvbmRpdGlvblsnaXNEYXJrJ10gPSAnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKSc7XG4gIG1lZGlhUXVlcnlDb25kaXRpb25bJ2lzTGlnaHQnXSA9ICcocHJlZmVycy1jb2xvci1zY2hlbWU6IGxpZ2h0KSc7XG5cbiAgcmV0dXJuIG1lZGlhUXVlcnlDb25kaXRpb247XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBmblxuICovXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gJ2xvYWRpbmcnKSB7XG4gICAgZm4oKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUxpc3R9IHRhcmdldFxuICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAqL1xuZnVuY3Rpb24gZmlyc3ROb2RlKHRhcmdldCkge1xuICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICB9IGVsc2UgaWYgKE5vZGVMaXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKHRhcmdldCkpIHtcbiAgICBpZiAodGFyZ2V0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldFswXTtcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICByZXR1cm4gdGFyZ2V0WzBdO1xuICB9XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nIHwgTm9kZUxpc3R9IHRhcmdldFxuICogQHJldHVybnMge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAqL1xuZnVuY3Rpb24gbGFzdE5vZGUodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRhcmdldClbZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YXJnZXQpLmxlbmd0aCAtIDFdO1xuICB9IGVsc2UgaWYgKE5vZGVMaXN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKHRhcmdldCkpIHtcbiAgICBpZiAodGFyZ2V0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldFt0YXJnZXQubGVuZ3RoIC0gMV07XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIHRhcmdldFt0YXJnZXQubGVuZ3RoIC0gMV07XG4gIH1cbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHN0clxuICogQHJldHVybnMgeypbXX1cbiAqL1xuZnVuY3Rpb24gcGFyc2VIVE1MKHN0cikge1xuICBjb25zdCB0bXAgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJycpO1xuICB0bXAuYm9keS5pbm5lckhUTUwgPSBzdHI7XG4gIHJldHVybiBbLi4udG1wLmJvZHkuY2hpbGROb2Rlc107XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gc2V0dXBMZW5pcygpIHtcbiAgY29uc3QgbGVuaXMgPSBuZXcgTGVuaXMoZXRVSS5jb25maWcubGVuaXMub3B0aW9ucyB8fCB7fSk7XG5cbiAgbGVuaXMub24oJ3Njcm9sbCcsIChlKSA9PiB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gIH0pO1xuXG4gIGxlbmlzLm9uKCdzY3JvbGwnLCBTY3JvbGxUcmlnZ2VyLnVwZGF0ZSk7XG5cbiAgZ3NhcC50aWNrZXIuYWRkKCh0aW1lKSA9PiB7XG4gICAgbGVuaXMucmFmKHRpbWUgKiBldFVJLmNvbmZpZy5sZW5pcy5zcGVlZCB8fCAxMDAwKTtcbiAgfSk7XG5cbiAgZ3NhcC50aWNrZXIubGFnU21vb3RoaW5nKGV0VUkuY29uZmlnLmxlbmlzLmxhZ1Ntb290aGluZyk7XG5cbiAgZXRVSS5sZW5pcyA9IGxlbmlzO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gc2VsZWN0b3IgIHtzdHJpbmd8SFRNTEVsZW1lbnR9XG4gKiBAcmV0dXJucyB7RWxlbWVudHwqfVxuICovXG5mdW5jdGlvbiBzZWxlY3RvclN0cmluZ1RvRWxlbWVudChzZWxlY3Rvcikge1xuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn1cblxuLyoqXG4gKiDtjpjsnbTsp4DsnZgg66qo65OgIOyalOyGjOulvCDtg5Dsg4ntlZjsl6wg6rOg7KCV65CcIOyalOyGjOuTpOydmCDrhpLsnbTrpbwg6rOE7IKw7ZWp64uI64ukLlxuICog7IaN7ISxIOqwkuydtCBmaXhlZCwgc3RpY2t57J246rK97JygIO2BtOuemOyKpCDstpTqsIDtlaDsp4Ag7ZiR7J2Y7ZW07JW87ZWp64uI64ukLlxuICog7YWM7Iqk7Yq47KSRXG4gKiBAcmV0dXJucyB7bnVtYmVyfSDqs6DsoJXrkJwg7JqU7IaM65Ok7J2YIOy0nSDrhpLsnbRcbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlRml4ZWRFbGVtZW50c0hlaWdodCgpIHtcbiAgY29uc3QgZml4ZWRFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maXhlZCwgLnN0aWNreScpO1xuICBsZXQgdG90YWxGaXhlZEhlaWdodCA9IDA7XG5cbiAgZml4ZWRFbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbiAgICBpZiAoc3R5bGUucG9zaXRpb24gPT09ICdmaXhlZCcgfHwgc3R5bGUucG9zaXRpb24gPT09ICdzdGlja3knKSB7XG4gICAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlLmhlaWdodCkgfHwgMDtcbiAgICAgIGNvbnN0IHRvcCA9IHBhcnNlRmxvYXQoc3R5bGUudG9wKSB8fCAwO1xuICAgICAgdG90YWxGaXhlZEhlaWdodCArPSBoZWlnaHQgKyB0b3A7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdG90YWxGaXhlZEhlaWdodDtcbn1cblxuLyoqXG4gKiDtirnsoJUg7JqU7IaMIOuYkOuKlCDsnITsuZjroZwg67aA65Oc65+96rKMIOyKpO2BrOuhpO2VqeuLiOuLpC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8bnVtYmVyfSB0YXJnZXQgLSDsiqTtgazroaTtlaAg66qp7ZGcIOyalOyGjCDrmJDripQg7JyE7LmYLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSDsiqTtgazroaQg7Ji17IWYIOqwneyytC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5vZmZzZXQ9MF0gLSDstpTqsIAg7Jik7ZSE7IWLIOqwki5cbiAqL1xuZnVuY3Rpb24gc2Nyb2xsVG9Qb3NpdGlvbih0YXJnZXQsIHsgb2Zmc2V0ID0gMCB9ID0ge30pIHtcbiAgY29uc3QgdG90YWxGaXhlZEhlaWdodCA9IGNhbGN1bGF0ZUZpeGVkRWxlbWVudHNIZWlnaHQoKTtcbiAgY29uc3QgdG90YWxPZmZzZXQgPSB0b3RhbEZpeGVkSGVpZ2h0ICsgb2Zmc2V0O1xuXG4gIGNvbnN0IHRhcmdldFBvc2l0aW9uID1cbiAgICB0eXBlb2YgdGFyZ2V0ID09PSAnbnVtYmVyJ1xuICAgICAgPyB0YXJnZXQgLSB0b3RhbE9mZnNldFxuICAgICAgOiB0YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICAgICAgICA/IHRhcmdldC5vZmZzZXRUb3AgLSB0b3RhbE9mZnNldFxuICAgICAgICA6ICgoKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RhcmdldCBtdXN0IGJlIGFuIEhUTUxFbGVtZW50IG9yIGEgbnVtYmVyJyk7XG4gICAgICAgICAgfSkoKTtcblxuICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IHRhcmdldFBvc2l0aW9uLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG59XG4iLCJmdW5jdGlvbiBkZWJvdW5jZShjYWxsYmFjaywgZGVsYXkgPSAyNTApIHtcbiAgbGV0IHRpbWVvdXRJZDtcblxuICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGhyb3R0bGUoY2FsbGJhY2ssIGRlbGF5ID0gMjUwKSB7XG4gIGxldCBpc1Rocm90dGxlZCA9IGZhbHNlO1xuICBsZXQgYXJncztcbiAgbGV0IGNvbnRleHQ7XG5cbiAgZnVuY3Rpb24gd3JhcHBlciguLi53cmFwcGVyQXJncykge1xuICAgIGlmIChpc1Rocm90dGxlZCkge1xuICAgICAgYXJncyA9IHdyYXBwZXJBcmdzO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaXNUaHJvdHRsZWQgPSB0cnVlO1xuICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIHdyYXBwZXJBcmdzKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlzVGhyb3R0bGVkID0gZmFsc2U7XG4gICAgICBpZiAoYXJncykge1xuICAgICAgICB3cmFwcGVyLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBhcmdzID0gY29udGV4dCA9IG51bGw7XG4gICAgICB9XG4gICAgfSwgZGVsYXkpO1xuICB9XG5cbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbmZ1bmN0aW9uIGlzTWFya2VyUVMoKSB7XG4gIHJldHVybiBsb2NhdGlvbi5zZWFyY2guaW5jbHVkZXMoJ21hcmtlcjEyMTIxMicpO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyRXZlbnQoZWwsIGV2ZW50VHlwZSkge1xuICBpZiAodHlwZW9mIGV2ZW50VHlwZSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGVsW2V2ZW50VHlwZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICBlbFtldmVudFR5cGVdKCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZXZlbnQgPSB0eXBlb2YgZXZlbnRUeXBlID09PSAnc3RyaW5nJyA/IG5ldyBFdmVudChldmVudFR5cGUsIHsgYnViYmxlczogdHJ1ZSB9KSA6IGV2ZW50VHlwZTtcbiAgICBlbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxufVxuIiwiLy8g7Jew7IKwIOq0gOugqCAo7J6Q66OM7ZiVTnVtYmVyICsgbnVtYmVyKVxuZnVuY3Rpb24gZ2V0QmxlbmRPcGFjaXR5KG9wYWNpdHksIGxlbmd0aCkge1xuICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIG9wYWNpdHk7XG4gIH1cblxuICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSBvcGFjaXR5LCAxIC8gbGVuZ3RoKTtcbn1cbiIsIi8vIG9iamVjdCDqtIDroKgg6riw64qlXG5cbi8qKlxuICogY29tcGFyZSBvYmpcbiAqIEBwYXJhbSB7IE9iamVjdCB9IG9iajFcbiAqIEBwYXJhbSB7IE9iamVjdCB9IG9iajJcbiAqIEByZXR1cm5zIEJvb2xlYW5cbiAqL1xuZnVuY3Rpb24gc2hhbGxvd0NvbXBhcmUob2JqMSwgb2JqMikge1xuICBjb25zdCBrZXlzID0gWy4uLk9iamVjdC5rZXlzKG9iajEpLCBPYmplY3Qua2V5cyhvYmoyKV07XG5cbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgIGlmICh0eXBlb2Ygb2JqMVtrZXldID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqMltrZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKCFldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKG9iajFba2V5XSwgb2JqMltrZXldKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJvbGUgPSAhb2JqMltrZXldIHx8IHR5cGVvZiBvYmoxW2tleV0gPT09ICdmdW5jdGlvbic7XG4gICAgICBpZiAoIXJvbGUgJiYgb2JqMVtrZXldICE9PSBvYmoyW2tleV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNEZWVwRXF1YWwob2JqZWN0MSwgb2JqZWN0Mikge1xuICBjb25zdCBvYmpLZXlzMSA9IE9iamVjdC5rZXlzKG9iamVjdDEpO1xuICBjb25zdCBvYmpLZXlzMiA9IE9iamVjdC5rZXlzKG9iamVjdDIpO1xuXG4gIGlmIChvYmpLZXlzMS5sZW5ndGggIT09IG9iaktleXMyLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gIGZvciAodmFyIGtleSBvZiBvYmpLZXlzMSkge1xuICAgIGNvbnN0IHZhbHVlMSA9IG9iamVjdDFba2V5XTtcbiAgICBjb25zdCB2YWx1ZTIgPSBvYmplY3QyW2tleV07XG5cbiAgICBjb25zdCBpc09iamVjdHMgPSBpc09iamVjdCh2YWx1ZTEpICYmIGlzT2JqZWN0KHZhbHVlMik7XG5cbiAgICBpZiAoKGlzT2JqZWN0cyAmJiAhaXNEZWVwRXF1YWwodmFsdWUxLCB2YWx1ZTIpKSB8fCAoIWlzT2JqZWN0cyAmJiB2YWx1ZTEgIT09IHZhbHVlMikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBvYmpcbiAqIEBwYXJhbSBrZXlcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21OZXN0ZWRPYmplY3Qob2JqLCBrZXkpIHtcbiAgY29uc3Qga2V5cyA9IGtleS5zcGxpdCgnLicpO1xuXG4gIHJldHVybiBrZXlzLnJlZHVjZSgoYWNjLCBjdXJyS2V5KSA9PiB7XG4gICAgcmV0dXJuIGFjYyAmJiBhY2NbY3VycktleV0gIT09IHVuZGVmaW5lZCA/IGFjY1tjdXJyS2V5XSA6IHVuZGVmaW5lZDtcbiAgfSwgb2JqKTtcbn1cbiIsIi8qKlxuICogUmV2ZXJzZSBhIHN0cmluZ1xuICogQHBhcmFtIHN0ciB7c3RyaW5nfVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcmV2ZXJzZVN0cmluZyhzdHIpIHtcbiAgcmV0dXJuIHN0ci5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpO1xufVxuXG4vKipcbiAqIEdldCBhIHJhbmRvbSBpZFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0UmFuZG9tSWQoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMik7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBwcmVmaXhcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldFJhbmRvbVVJSUQocHJlZml4ID0gJ3VpJykge1xuICByZXR1cm4gYCR7cHJlZml4fS0ke2dldFJhbmRvbUlkKCl9YDtcbn1cblxuLyoqXG4gKiDssqvquIDsnpDrp4wg64yA66y47J6Q66GcIOuzgO2ZmFxuICogQHBhcmFtIHdvcmRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGNhcGl0YWxpemUod29yZCkge1xuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSlcbn1cblxuLyoqXG4gKiDssqvquIDsnpDrp4wg7IaM66y47J6Q66GcIOuzgO2ZmFxuICogQHBhcmFtIHdvcmRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHVuY2FwaXRhbGl6ZSh3b3JkKSB7XG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgd29yZC5zbGljZSgxKVxufVxuXG5mdW5jdGlvbiBhZGRQcmVmaXhDYW1lbFN0cmluZyhzdHIsIHByZWZpeCl7XG4gIC8vIGRpbW1DbGljayA9PiBwcm9wc0RpbW1DbGlja1xuICByZXR1cm4gcHJlZml4ICsgZXRVSS51dGlscy5jYXBpdGFsaXplKHN0cilcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcoc3RyLCBwcmVmaXgpe1xuICBjb25zdCByZWdFeHAgPSBuZXcgUmVnRXhwKGBeJHtwcmVmaXh9YCwgJ2cnKVxuICByZXR1cm4gZXRVSS51dGlscy51bmNhcGl0YWxpemUoc3RyLnJlcGxhY2VBbGwocmVnRXhwLCAnJykpXG5cbn1cblxuZnVuY3Rpb24gY291bnRDaGFyYWN0ZXJzKHN0cikge1xuICBsZXQgY291bnQgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIENoZWNrIGlmIHRoZSBjaGFyYWN0ZXIgaXMgRW5nbGlzaFxuICAgIGlmICgvW2EtekEtWl0vLnRlc3Qoc3RyW2ldKSkge1xuICAgICAgY291bnQgKz0gMTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNoYXJhY3RlciBpcyBLb3JlYW4gb3Igb3RoZXIgMi1ieXRlIGNoYXJhY3RlclxuICAgIGVsc2UgaWYgKHN0ci5jaGFyQ29kZUF0KGkpID4gMTI3KSB7XG4gICAgICBjb3VudCArPSAyO1xuICAgIH1cbiAgICAvLyBTcGVjaWFsIGNoYXJhY3RlcnNcbiAgICBlbHNlIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3VudDtcbn1cbiIsIlxuZXRVSS51dGlscyA9IHtcbmlzQXJyYXksXG5hbGxDbGVhbnVwcyxcbnNldFByb3BlcnR5LFxuZ2V0UHJvcGVydHksXG5zZXRTdHlsZSxcbnNwbGl0VGV4dE1hc2ssXG5zcGxpdFRleHRNYXNrQmxvY2ssXG53cmFwTWFzayxcbnNldERvY0hlaWdodCxcbmdldE1lZGlhUXVlcnlDb25kaXRpb24sXG5yZWFkeSxcbmZpcnN0Tm9kZSxcbmxhc3ROb2RlLFxucGFyc2VIVE1MLFxuc2V0dXBMZW5pcyxcbnNlbGVjdG9yU3RyaW5nVG9FbGVtZW50LFxuY2FsY3VsYXRlRml4ZWRFbGVtZW50c0hlaWdodCxcbnNjcm9sbFRvUG9zaXRpb24sXG5kZWJvdW5jZSxcbnRocm90dGxlLFxuaXNNYXJrZXJRUyxcbnRyaWdnZXJFdmVudCxcbmdldEJsZW5kT3BhY2l0eSxcbnNoYWxsb3dDb21wYXJlLFxuaXNEZWVwRXF1YWwsXG5pc09iamVjdCxcbmdldFZhbHVlRnJvbU5lc3RlZE9iamVjdCxcbnJldmVyc2VTdHJpbmcsXG5nZXRSYW5kb21JZCxcbmdldFJhbmRvbVVJSUQsXG5jYXBpdGFsaXplLFxudW5jYXBpdGFsaXplLFxuYWRkUHJlZml4Q2FtZWxTdHJpbmcsXG5yZW1vdmVQcmVmaXhDYW1lbFN0cmluZyxcbmNvdW50Q2hhcmFjdGVyc1xufVxuICAgICAgICAgICAgICAiLCJmdW5jdGlvbiB1c2VBMTF5S2V5RXZlbnQoKSB7XG4gIGZ1bmN0aW9uIGZpcnN0Tm9kZUZvY3VzT3V0KHRhcmdldCwgaGFuZGxlcikge1xuICAgIHJldHVybiBldFVJLmhvb2tzLnVzZUV2ZW50TGlzdGVuZXIodGFyZ2V0LCAna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdUYWInICYmIGUuc2hpZnRLZXkpIHtcbiAgICAgICAgaGFuZGxlcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGFzdE5vZGVGb2N1c091dCh0YXJnZXQsIGhhbmRsZXIpIHtcbiAgICByZXR1cm4gZXRVSS5ob29rcy51c2VFdmVudExpc3RlbmVyKHRhcmdldCwgJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnVGFiJyAmJiAhZS5zaGlmdEtleSkge1xuICAgICAgICBoYW5kbGVyKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZpcnN0Tm9kZUZvY3VzT3V0LFxuICAgIGxhc3ROb2RlRm9jdXNPdXQsXG4gIH07XG59XG4iLCIvKipcbiAqIHRhcmdldCnsnZgg7Jm467aA66W8IO2BtOumre2WiOydhCDrlYwg7L2c67CxIO2VqOyImOulvCDsi6TtlolcbiAqIOyYiOyZuOyggeycvOuhnCDtgbTrpq3snYQg7ZeI7Jqp7ZWgIOyalOyGjOuTpOydmCDshKDtg53snpDrpbwg7Y+s7ZWo7ZWY64qUIOuwsOyXtOydhCDsmLXshZjsnLzroZwg67Cb7J2EIOyImCDsnojsirXri4jri6QuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXQgLSDtgbTrpq0g7J2067Kk7Yq47J2YIOyZuOu2gCDtgbTrpq0g6rCQ7KeA66W8IOyImO2Wie2VoCDrjIDsg4EgRE9NIOyalOyGjOyeheuLiOuLpC4o7ZWE7IiYKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSDsmbjrtoAg7YG066at7J20IOqwkOyngOuQmOyXiOydhCDrlYwg7Iuk7ZaJ7ZWgIOy9nOuwsSDtlajsiJjsnoXri4jri6QuKO2VhOyImClcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZXhjZXB0aW9ucyAtIOyZuOu2gCDtgbTrpq0g6rCQ7KeA7JeQ7IScIOyYiOyZuCDsspjrpqztlaAg7JqU7IaM65Ok7J2YIOyEoO2DneyekOulvCDtj6ztlajtlZjripQg67Cw7Je07J6F64uI64ukLijsmLXshZgpXG4gKi9cbmZ1bmN0aW9uIHVzZUNsaWNrT3V0c2lkZSh0YXJnZXQsIGNhbGxiYWNrLCBleGNlcHRpb25zID0gW10pIHtcbiAgcmV0dXJuIGV0VUkuaG9va3MudXNlRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgaXNDbGlja0luc2lkZUV4Y2VwdGlvbiA9IGV4Y2VwdGlvbnMuc29tZSgoc2VsZWN0b3IpID0+IHtcbiAgICAgIGNvbnN0IGV4Y2VwdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIHJldHVybiBleGNlcHRpb25FbGVtZW50ICYmIGV4Y2VwdGlvbkVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIGlmICghdGFyZ2V0LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiYgIWlzQ2xpY2tJbnNpZGVFeGNlcHRpb24pIHtcbiAgICAgIGNhbGxiYWNrKHRhcmdldCk7XG4gICAgfVxuICB9KTtcbn1cbiIsImZ1bmN0aW9uIHVzZUNvcmUoXG4gIGluaXRpYWxQcm9wcyA9IHt9LFxuICBpbml0aWFsU3RhdGUgPSB7fSxcbiAgcmVuZGVyLFxuICBvcHRpb25zID0ge1xuICAgIGRhdGFzZXQ6IHRydWUsXG4gIH0sXG4pIHtcbiAgY29uc3QgYWN0aW9ucyA9IHt9O1xuICBsZXQgJHRhcmdldDtcbiAgY29uc3QgY2xlYW51cHMgPSBbXTtcbiAgY29uc3QgTk9fQlVCQkxJTkdfRVZFTlRTID0gWydibHVyJywgJ2ZvY3VzJywgJ2ZvY3VzaW4nLCAnZm9jdXNvdXQnLCAncG9pbnRlcmxlYXZlJ107XG4gIGNvbnN0IG9uU3RhdGVDaGFuZ2UgPSAoKSA9PiB7fTtcbiAgbGV0IHN0YXRlQ2FsbGJhY2s7XG4gIGNvbnN0IHByb3BzID0gbmV3IFByb3h5KGluaXRpYWxQcm9wcywge1xuICAgIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHN0YXRlID0gbmV3IFByb3h5KGluaXRpYWxTdGF0ZSwge1xuICAgIHNldDogKHRhcmdldCwga2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHNldFRhcmdldChfJHRhcmdldCwgeyBzdGF0ZUNhbGxiYWNrOiBfc3RhdGVDYWxsYmFjayB9ID0ge30pIHtcbiAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgaWYgKF9zdGF0ZUNhbGxiYWNrKSB7XG4gICAgICBzdGF0ZUNhbGxiYWNrID0gX3N0YXRlQ2FsbGJhY2s7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YXNldCkge1xuICAgICAgY29uc3QgeyBnZXRQcm9wc0Zyb21EYXRhc2V0LCBnZXRWYXJzRnJvbURhdGFzZXQgfSA9IGV0VUkuaG9va3MudXNlRGF0YXNldCgkdGFyZ2V0KTtcbiAgICAgIGNvbnN0IGRhdGFzZXRQcm9wcyA9IGdldFByb3BzRnJvbURhdGFzZXQoKTtcbiAgICAgIGNvbnN0IGRhdGFzZXRWYXJzID0gZ2V0VmFyc0Zyb21EYXRhc2V0KCk7XG5cbiAgICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLmRhdGFzZXRQcm9wcyB9KTtcbiAgICAgIHNldFN0YXRlKHsgLi4uc3RhdGUsIC4uLmRhdGFzZXRWYXJzIH0sIHsgc2lsZW50OiB0cnVlLCBpbW1lZGlhdGU6IHRydWUgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0UHJvcHMobmV3UHJvcHMpIHtcbiAgICBPYmplY3Qua2V5cyhuZXdQcm9wcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBwcm9wc1trZXldID0gbmV3UHJvcHNba2V5XTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0YXRlKG5ld1N0YXRlLCB7IHNpbGVudCA9IGZhbHNlLCBpbW1lZGlhdGUgPSBmYWxzZSB9ID0ge30pIHtcbiAgICBpZiAoZXRVSS51dGlscy5pc0RlZXBFcXVhbChzdGF0ZSwgbmV3U3RhdGUpKSByZXR1cm47XG5cbiAgICBPYmplY3Qua2V5cyhuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzdGF0ZVtrZXldID0gbmV3U3RhdGVba2V5XTtcbiAgICB9KTtcbiAgICBpZiAoIXNpbGVudCAmJiByZW5kZXIgIT09IHVuZGVmaW5lZCAmJiByZW5kZXIgIT09IG51bGwgJiYgdHlwZW9mIHJlbmRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVuZGVyKGltbWVkaWF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGF0YXNldCkge1xuICAgICAgY29uc3QgeyBzZXRWYXJzRnJvbURhdGFzZXQgfSA9IGV0VUkuaG9va3MudXNlRGF0YXNldCgkdGFyZ2V0KTtcbiAgICAgIHNldFZhcnNGcm9tRGF0YXNldChzdGF0ZSk7XG4gICAgfVxuXG4gICAgc3RhdGVDYWxsYmFjayAmJiBzdGF0ZUNhbGxiYWNrKHN0YXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEV2ZW50KGV2ZW50VHlwZSwgc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgJGV2ZW50VGFyZ2V0ID0gc2VsZWN0b3IgPyAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogJHRhcmdldDtcblxuICAgIGlmIChOT19CVUJCTElOR19FVkVOVFMuaW5jbHVkZXMoZXZlbnRUeXBlKSkge1xuICAgICAgY29uc3QgY2xlYW51cCA9IGV0VUkuaG9va3MudXNlRXZlbnRMaXN0ZW5lcigkZXZlbnRUYXJnZXQsIGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuICAgICAgcmV0dXJuIGNsZWFudXBzLnB1c2goY2xlYW51cCk7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnRIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICBsZXQgJGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xuXG4gICAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICAgICRldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKCRldmVudFRhcmdldCkge1xuICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50SGFuZGxlcik7XG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+ICR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50SGFuZGxlcik7XG4gICAgY2xlYW51cHMucHVzaChjbGVhbnVwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUV2ZW50KCkge1xuICAgIGV0VUkudXRpbHMuYWxsQ2xlYW51cHMoY2xlYW51cHMpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjbGVhbnVwcyxcbiAgICBzZXRUYXJnZXQsXG4gICAgYWN0aW9ucyxcbiAgICBzdGF0ZSxcbiAgICBwcm9wcyxcbiAgICBzZXRTdGF0ZSxcbiAgICBzZXRQcm9wcyxcbiAgICBhZGRFdmVudCxcbiAgICByZW1vdmVFdmVudCxcbiAgfTtcbn1cbiIsIi8qKlxuICogdXNlRGF0YXNldFxuICogQHBhcmFtICR0YXJnZXQge0hUTUxFbGVtZW50fVxuICovXG5mdW5jdGlvbiB1c2VEYXRhc2V0KCR0YXJnZXQpIHtcbiAgbGV0IGRhdGFzZXRQcm9wcyA9IHt9LFxuICAgIGRhdGFzZXRWYXJzID0ge307XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YXNldEJ5UHJlZml4KHByZWZpeCkge1xuICAgIGNvbnN0IGRhdGFzZXQgPSB7fTtcbiAgICBPYmplY3Qua2V5cygkdGFyZ2V0LmRhdGFzZXQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gJHRhcmdldC5kYXRhc2V0W2tleV07XG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5pbmNsdWRlcygneycpKXtcbiAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZighaXNOYU4odmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmKGtleS5zdGFydHNXaXRoKHByZWZpeCkpe1xuICAgICAgICBkYXRhc2V0W2V0VUkudXRpbHMucmVtb3ZlUHJlZml4Q2FtZWxTdHJpbmcoa2V5LCBwcmVmaXgpXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXREYXRhc2V0RXhjZXB0UHJlZml4KHByZWZpeCkge1xuICAgIGNvbnN0IGRhdGFzZXQgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKCR0YXJnZXQuZGF0YXNldCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBsZXQgdmFsdWUgPSAkdGFyZ2V0LmRhdGFzZXRba2V5XTtcblxuICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZigha2V5LnN0YXJ0c1dpdGgocHJlZml4KSl7XG4gICAgICAgIGRhdGFzZXRbZXRVSS51dGlscy5yZW1vdmVQcmVmaXhDYW1lbFN0cmluZyhrZXksIHByZWZpeCldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldERhdGFzZXRCeVByZWZpeChkYXRhLCBwcmVmaXgpIHtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmKHByZWZpeCl7XG4gICAgICAgICR0YXJnZXQuZGF0YXNldFtgJHtwcmVmaXh9JHtldFVJLnV0aWxzLmNhcGl0YWxpemUoa2V5KX1gXSA9IGRhdGFba2V5XTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkdGFyZ2V0LmRhdGFzZXRba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByb3BzRnJvbURhdGFzZXQoKSB7XG4gICAgZGF0YXNldFByb3BzID0gZ2V0RGF0YXNldEJ5UHJlZml4KCdwcm9wcycpO1xuICAgIHJldHVybiBkYXRhc2V0UHJvcHM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRWYXJzRnJvbURhdGFzZXQoKSB7XG4gICAgZGF0YXNldFZhcnMgPSBnZXREYXRhc2V0RXhjZXB0UHJlZml4KCdwcm9wcycpO1xuICAgIHJldHVybiBkYXRhc2V0VmFycztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFByb3BzRnJvbURhdGFzZXQocHJvcHMpIHtcbiAgICBzZXREYXRhc2V0QnlQcmVmaXgocHJvcHMsICdwcm9wcycpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0VmFyc0Zyb21EYXRhc2V0KHZhcnMpIHtcbiAgICBzZXREYXRhc2V0QnlQcmVmaXgodmFycywgJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RyaW5nVG9PYmplY3QocHJvcHMpIHtcbiAgICAvLyBkYXRhc2V07JeQ7IScIOqwneyytCDtmJXtg5zsnbgg7Iqk7Yq466eB6rCSIO2DgOyehSDqsJ3ssrTroZwg67CU6r+U7KSMXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMpIHtcbiAgICAgIGlmICghKHR5cGVvZiBwcm9wc1trZXldID09PSAnYm9vbGVhbicpICYmIHByb3BzW2tleV0uaW5jbHVkZXMoJ3snKSkge1xuICAgICAgICBwcm9wc1trZXldID0gSlNPTi5wYXJzZShwcm9wc1trZXldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldFByb3BzRnJvbURhdGFzZXQsXG4gICAgc2V0UHJvcHNGcm9tRGF0YXNldCxcbiAgICBnZXRWYXJzRnJvbURhdGFzZXQsXG4gICAgc2V0VmFyc0Zyb21EYXRhc2V0LFxuICAgIHNldFN0cmluZ1RvT2JqZWN0LFxuICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlRGlhbG9nKCkge1xuICBsZXQgJGxheWVyV3JhcEJveDtcblxuICBmdW5jdGlvbiBjcmVhdGVMYXllcldyYXAoKSB7XG4gICAgJGxheWVyV3JhcEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICRsYXllcldyYXBCb3guY2xhc3NMaXN0LmFkZCgnbGF5ZXItd3JhcCcpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoJGxheWVyV3JhcEJveCk7XG4gIH1cblxuICBjb25zdCBhbGVydCA9ICguLi5vcHRzKSA9PiB7XG4gICAgbGV0ICRsYXllcldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGF5ZXItd3JhcCcpO1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBldFVJLmNvbXBvbmVudHMuRGlhbG9nKCk7XG5cbiAgICBpZiAoISRsYXllcldyYXApIHtcbiAgICAgIGNyZWF0ZUxheWVyV3JhcCgpO1xuICAgICAgJGxheWVyV3JhcCA9ICRsYXllcldyYXBCb3g7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgZGlhbG9nLmNvcmUuaW5pdCgkbGF5ZXJXcmFwLCB7IGRpYWxvZ1R5cGU6ICdhbGVydCcsIG1lc3NhZ2U6IG9wdHNbMF0sIGNhbGxiYWNrOiBvcHRzWzFdIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdHNbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICBkaWFsb2cuY29yZS5pbml0KCRsYXllcldyYXAsIHsgZGlhbG9nVHlwZTogJ2FsZXJ0JywgLi4ub3B0c1swXSB9KTtcbiAgICB9XG5cbiAgICBkaWFsb2cub3BlbigpO1xuICB9O1xuXG4gIGNvbnN0IGNvbmZpcm0gPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgZXRVSS5jb21wb25lbnRzLkRpYWxvZygpO1xuXG4gICAgaWYgKCEkbGF5ZXJXcmFwKSB7XG4gICAgICBjcmVhdGVMYXllcldyYXAoKTtcbiAgICAgICRsYXllcldyYXAgPSAkbGF5ZXJXcmFwQm94O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0c1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAnY29uZmlybScsIG1lc3NhZ2U6IG9wdHNbMF0sIHBvc2l0aXZlQ2FsbGJhY2s6IG9wdHNbMV0gfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0c1swXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAnY29uZmlybScsIC4uLm9wdHNbMF0gfSk7XG4gICAgfVxuXG4gICAgZGlhbG9nLm9wZW4oKTtcbiAgfTtcblxuICBjb25zdCBwcmV2aWV3SW1hZ2UgPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkbGF5ZXJXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxheWVyLXdyYXAnKTtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgZXRVSS5jb21wb25lbnRzLkRpYWxvZygpO1xuXG4gICAgaWYgKCEkbGF5ZXJXcmFwKSB7XG4gICAgICBjcmVhdGVMYXllcldyYXAoKTtcbiAgICAgICRsYXllcldyYXAgPSAkbGF5ZXJXcmFwQm94O1xuICAgIH1cblxuICAgIGRpYWxvZy5jb3JlLmluaXQoJGxheWVyV3JhcCwgeyBkaWFsb2dUeXBlOiAncHJldmlld0ltYWdlJywgLi4ub3B0c1swXSB9KTtcblxuICAgIGRpYWxvZy5vcGVuKCk7XG4gIH07XG5cbiAgY29uc3QgdG9hc3RCYXNpYyA9ICguLi5vcHRzKSA9PiB7XG4gICAgbGV0ICR0b2FzdFdyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9hc3Qtd3JhcCcpXG4gICAgY29uc3QgdG9hc3QgPSBuZXcgZXRVSS5jb21wb25lbnRzLlRvYXN0KCk7XG5cbiAgICBpZiAoISR0b2FzdFdyYXApIHJldHVybjtcblxuICAgIHRvYXN0LmNvcmUuaW5pdCgkdG9hc3RXcmFwLCB7dHlwZTogJ2Jhc2ljJywgLi4ub3B0c1swXX0pO1xuICAgIHRvYXN0Lm9wZW4oKTtcbiAgfVxuXG4gIGNvbnN0IHRvYXN0Q2xvc2VCdG4gPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkdG9hc3RXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvYXN0LXdyYXAnKVxuICAgIGNvbnN0IHRvYXN0ID0gbmV3IGV0VUkuY29tcG9uZW50cy5Ub2FzdCgpO1xuXG4gICAgaWYgKCEkdG9hc3RXcmFwKSByZXR1cm47XG5cbiAgICB0b2FzdC5jb3JlLmluaXQoJHRvYXN0V3JhcCwge3R5cGU6ICdjbG9zZScsIC4uLm9wdHNbMF19KTtcbiAgICB0b2FzdC5vcGVuKCk7XG4gIH1cblxuICBjb25zdCB0b2FzdExpbmtCdG4gPSAoLi4ub3B0cykgPT4ge1xuICAgIGxldCAkdG9hc3RXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvYXN0LXdyYXAnKVxuICAgIGNvbnN0IHRvYXN0ID0gbmV3IGV0VUkuY29tcG9uZW50cy5Ub2FzdCgpO1xuXG4gICAgaWYgKCEkdG9hc3RXcmFwKSByZXR1cm47XG5cbiAgICB0b2FzdC5jb3JlLmluaXQoJHRvYXN0V3JhcCwge3R5cGU6ICdsaW5rJywgLi4ub3B0c1swXX0pO1xuICAgIHRvYXN0Lm9wZW4oKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYWxlcnQsXG4gICAgY29uZmlybSxcbiAgICBwcmV2aWV3SW1hZ2UsXG4gICAgdG9hc3RCYXNpYyxcbiAgICB0b2FzdENsb3NlQnRuLFxuICAgIHRvYXN0TGlua0J0bixcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIGRpYWxvZ1RtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSAoeyBkaWFsb2dUeXBlLCB0eXBlLCB0aXRsZSwgbWVzc2FnZSwgcG9zaXRpdmVUZXh0LCBuZWdhdGl2ZVRleHQgfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1kaWFsb2dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1kaW1tXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZnJhbWVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgJHt0aXRsZSA/IGA8aDMgY2xhc3M9XCJkaWFsb2ctdGl0XCI+JHt0aXRsZX08L2gzPmAgOiAnJ31cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyA/IGA8c3BhbiBjbGFzcz1cIiR7dHlwZX1cIj5pY29uPC9zcGFuPmAgOiAnJ31cblxuICAgICAgICAgICAgICA8cCBjbGFzcz1cImRpYWxvZy1pbmZvXCI+JHttZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdjb25maXJtJyA/IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3F1YXJlIGJ0bi13aGl0ZSBkaWFsb2ctbmVnYXRpdmVcIj4ke25lZ2F0aXZlVGV4dH08L2J1dHRvbj5gIDogJyd9XG4gICAgICAgICAgICAgICR7cG9zaXRpdmVUZXh0ID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGRpYWxvZy1wb3NpdGl2ZSBidG4tcHJpbWFyeVwiPiR7cG9zaXRpdmVUZXh0fTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdhbGVydCcgPyBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJkaWFsb2ctY2xvc2VcIj48c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+7Yyd7JeFIOuLq+q4sDwvc3Bhbj48L2J1dHRvbj5gIDogJyd9XG5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gIGNvbnN0ICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUwgPSAoeyBkaWFsb2dUeXBlLCBpbWFnZXMsIHRpdGxlIH0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtZGlhbG9nIGRpYWxvZy1wcmV2aWV3LWltYWdlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZGltbVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWZyYW1lXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgICAgICAgICAgICR7dGl0bGUgPyBgPGgzIGNsYXNzPVwiZGlhbG9nLXRpdFwiPiR7dGl0bGV9PC9oMz5gIDogJyd9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LXN3aXBlclwiPlxuICAgICAgICAgICAgICAgIDwhLS0gQWRkaXRpb25hbCByZXF1aXJlZCB3cmFwcGVyIC0tPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgJHtpbWFnZXNcbiAgICAgICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAoaW1hZ2UpID0+IGBcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1zbGlkZVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtpbWFnZS5zcmN9XCIgYWx0PVwiJHtpbWFnZS5hbHR9XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICBgLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcnKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zcXVhcmUgYnRuLXdoaXRlIGRpYWxvZy1uZWdhdGl2ZVwiPuuLq+q4sDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlSFRNTCxcbiAgICAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MLFxuICB9O1xufVxuIiwiLyoqXG4gKiB1c2VFdmVudExpc3RlbmVyXG4gKiBAcGFyYW0gdGFyZ2V0ICB7SFRNTEVsZW1lbnR8SFRNTEVsZW1lbnRbXX1cbiAqIEBwYXJhbSB0eXBlICB7c3RyaW5nfVxuICogQHBhcmFtIGxpc3RlbmVyICB7ZnVuY3Rpb259XG4gKiBAcGFyYW0gb3B0aW9ucyB7b2JqZWN0fVxuICogQHJldHVybnMge2Z1bmN0aW9uKCk6ICp9XG4gKi9cbmZ1bmN0aW9uIHVzZUV2ZW50TGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChOb2RlTGlzdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZih0YXJnZXQpKSB7XG4gICAgdGFyZ2V0LmZvckVhY2goKGVsZW1lbnQpID0+IGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucykpO1xuICAgIHJldHVybiAoKSA9PiB0YXJnZXQuZm9yRWFjaCgoZWxlbWVudCkgPT4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKSk7XG4gIH1cblxuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG59XG4iLCIvKipcbiAqIGdldEJvdW5kaW5nQ2xpZW50UmVjdFxuICogQHBhcmFtIHsgRWxlbWVudCB9IHBhcmVudFxuICogQHBhcmFtIHsgU3RyaW5nIH0gc2VsZWN0b3JcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIHVzZUdldENsaWVudFJlY3QocGFyZW50LCBzZWxlY3Rvcikge1xuICBjb25zdCByZWN0ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpPy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgaWYgKCFyZWN0KSByZXR1cm4ge307XG4gIGVsc2VcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0LFxuICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgIGJvdHRvbTogcmVjdC5ib3R0b20sXG4gICAgICBsZWZ0OiByZWN0LmxlZnQsXG4gICAgICByaWdodDogcmVjdC5yaWdodCxcbiAgICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlTGF5ZXIodHlwZSA9ICdtb2RhbCcpIHtcbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZUxheWVyKCkge1xuICAgIGNvbnN0ICRsYXllckNvbXBvbmVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYXllci13cmFwJykuY2hpbGRyZW4pLmZpbHRlcigoJGVsKSA9PiB7XG4gICAgICBjb25zdCBpc01vZGFsQ29tcG9uZW50ID0gJGVsLmNsYXNzTGlzdC5jb250YWlucygnY29tcG9uZW50LW1vZGFsJyk7XG4gICAgICBjb25zdCBpc0RpYWxvZ0NvbXBvbmVudCA9ICRlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbXBvbmVudC1kaWFsb2cnKTtcblxuICAgICAgcmV0dXJuIGlzTW9kYWxDb21wb25lbnQgfHwgaXNEaWFsb2dDb21wb25lbnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJGxheWVyQ29tcG9uZW50cy5maWx0ZXIoKCRlbCkgPT4ge1xuICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSgkZWwpO1xuICAgICAgcmV0dXJuIHN0eWxlLmRpc3BsYXkgIT09ICdub25lJztcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRvcERlcHRoKCkge1xuICAgIGNvbnN0ICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzID0gZ2V0VmlzaWJsZUxheWVyKCk7XG4gICAgcmV0dXJuIDEwMCArICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzLmxlbmd0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldExheWVyT3BhY2l0eShkZWZhdWx0T3BhY2l0eSA9IDAuNSkge1xuICAgIGNvbnN0ICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzID0gZ2V0VmlzaWJsZUxheWVyKCk7XG4gICAgJHZpc2libGVMYXllckNvbXBvbmVudHMuZm9yRWFjaCgoJGVsLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgb3BhY2l0eSA9IGV0VUkudXRpbHMuZ2V0QmxlbmRPcGFjaXR5KGRlZmF1bHRPcGFjaXR5LCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cy5sZW5ndGgpO1xuXG4gICAgICBpZiAoJGVsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kaW1tJykpIHtcbiAgICAgICAgJGVsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kaW1tJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYmEoMCwgMCwgMCwgJHtvcGFjaXR5fSlgO1xuICAgICAgfVxuXG4gICAgICBpZiAoJGVsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctZGltbScpKSB7XG4gICAgICAgICRlbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLWRpbW0nKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiYSgwLCAwLCAwLCAke29wYWNpdHl9KWA7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBtb2RhbCDrlrTsnYTrlYwg642c7Lu56rGw66as64qUIOqxsCDsl4bslaDripQgdGVzdCDspJFcbiAgZnVuY3Rpb24gZW5hYmxlU2Nyb2xsTG9jaygpIHtcbiAgICBjb25zdCBzY3JvbGxCYXJXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWRlcicpLnN0eWxlLnBhZGRpbmdSaWdodCA9IGAke3Njcm9sbEJhcldpZHRofXB4YDtcbiAgICAvLyBjb25zdCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XG4gICAgLy8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gYC0ke3Njcm9sbFl9cHhgO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNhYmxlU2Nyb2xsTG9jaygpIHtcbiAgICBjb25zdCAkdmlzaWJsZUxheWVyQ29tcG9uZW50cyA9IGdldFZpc2libGVMYXllcigpO1xuICAgIC8vIGNvbnNvbGUubG9nKCckdmlzaWJsZUxheWVyQ29tcG9uZW50cycsICR2aXNpYmxlTGF5ZXJDb21wb25lbnRzKTtcbiAgICAvLyBpZiAoJHZpc2libGVMYXllckNvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBudWxsO1xuICAgIC8vIH1cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jykuc3R5bGUub3ZlcmZsb3cgPSBudWxsO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWRlcicpLnN0eWxlLnBhZGRpbmdSaWdodCA9ICcnO1xuXG4gICAgLy8gY29uc3Qgc2Nyb2xsWSA9IHBhcnNlSW50KGRvY3VtZW50LmJvZHkuc3R5bGUudG9wIHx8ICcwJykgKiAtMTtcbiAgICAvLyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3dZID0gJyc7XG4gICAgLy8gZG9jdW1lbnQuYm9keS5zdHlsZS5wb3NpdGlvbiA9ICcnO1xuICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gJyc7XG4gICAgLy8gZG9jdW1lbnQuYm9keS5zdHlsZS53aWR0aCA9ICcnO1xuICAgIC8vIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGxZKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0VmlzaWJsZUxheWVyLFxuICAgIGdldFRvcERlcHRoLFxuICAgIHNldExheWVyT3BhY2l0eSxcbiAgICBlbmFibGVTY3JvbGxMb2NrLFxuICAgIGRpc2FibGVTY3JvbGxMb2NrLFxuICB9O1xufVxuIiwiZnVuY3Rpb24gdXNlTWVkaWFRdWVyeSgpe1xuICBmdW5jdGlvbiBtZWRpYVF1ZXJ5QWN0aW9uKC4uLmFyZ3Mpe1xuICAgIGNvbnN0IGdzYXBNZWRpYVF1ZXJ5ID0gZ3NhcC5tYXRjaE1lZGlhKCk7XG5cbiAgICBpZiAoZ3NhcE1lZGlhUXVlcnkpIHtcbiAgICAgIGdzYXBNZWRpYVF1ZXJ5LmtpbGwoKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZWRpYVF1ZXJ5Q29uZGl0aW9uID0gZXRVSS51dGlscy5nZXRNZWRpYVF1ZXJ5Q29uZGl0aW9uKGV0VUkuY29uZmlnLm1lZGlhLm5hbWVzLCBldFVJLmNvbmZpZy5tZWRpYS5wb2ludHMpXG5cbiAgICBnc2FwTWVkaWFRdWVyeS5hZGQobWVkaWFRdWVyeUNvbmRpdGlvbiwgLi4uYXJncyk7XG5cbiAgICByZXR1cm4gZ3NhcE1lZGlhUXVlcnk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG1lZGlhUXVlcnlBY3Rpb24sXG4gIH1cbn1cbiIsImZ1bmN0aW9uIHVzZU11dGF0aW9uU3RhdGUoKXtcbiAgbGV0ICR0YXJnZXQsICRyZWYgPSB7XG4gICAgJHN0YXRlOiB7fVxuICB9LCBtdXRhdGlvbk9ic2VydmVyLCByZW5kZXI7XG5cbiAgZnVuY3Rpb24gaW5pdE11dGF0aW9uU3RhdGUoXyR0YXJnZXQsIF9yZW5kZXIpe1xuICAgICR0YXJnZXQgPSBfJHRhcmdldFxuICAgIHJlbmRlciA9IF9yZW5kZXI7XG5cbiAgICBzZXRNdXRhdGlvbk9ic2VydmVyKClcbiAgICBzZXRTdGF0ZUJ5RGF0YXNldCgpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZUJ5RGF0YXNldCgpe1xuICAgIGNvbnN0IGZpbHRlcmVkRGF0YXNldCA9IHt9O1xuICAgIGNvbnN0IGRhdGFzZXQgPSAkdGFyZ2V0LmRhdGFzZXQ7XG5cbiAgICBPYmplY3Qua2V5cyhkYXRhc2V0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmKGtleS5zdGFydHNXaXRoKCd2YXJzJykpe1xuICAgICAgICBmaWx0ZXJlZERhdGFzZXRba2V5LnJlcGxhY2UoJ3ZhcnMnLCAnJykudG9Mb3dlckNhc2UoKV0gPSBkYXRhc2V0W2tleV07XG4gICAgICB9XG4gICAgfSlcblxuICAgIHNldFN0YXRlKGZpbHRlcmVkRGF0YXNldClcbiAgICByZW5kZXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldE11dGF0aW9uT2JzZXJ2ZXIoKXtcbiAgICBjb25zdCBjb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGNoaWxkTGlzdDogZmFsc2UsIHN1YnRyZWU6IGZhbHNlIH07XG5cbiAgICBjb25zdCBjYWxsYmFjayA9IChtdXRhdGlvbkxpc3QsIG9ic2VydmVyKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9uTGlzdCkge1xuICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnXG4gICAgICAgICAgJiYgbXV0YXRpb24uYXR0cmlidXRlTmFtZSAhPT0gJ3N0eWxlJ1xuICAgICAgICAgICYmIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcydcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0U3RhdGVCeURhdGFzZXQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKCR0YXJnZXQsIGNvbmZpZyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZShuZXdTdGF0ZSl7XG4gICAgJHJlZi4kc3RhdGUgPSB7IC4uLiRyZWYuJHN0YXRlLCAuLi5uZXdTdGF0ZSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RGF0YVN0YXRlKG5ld1N0YXRlKSB7XG4gICAgY29uc3QgJG5ld1N0YXRlID0geyAuLi4kcmVmLiRzdGF0ZSwgLi4ubmV3U3RhdGUgfTtcblxuICAgIE9iamVjdC5rZXlzKCRuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAkdGFyZ2V0LmRhdGFzZXRbYHZhcnMke2V0VUkudXRpbHMuY2FwaXRhbGl6ZShrZXkpfWBdID0gJG5ld1N0YXRlW2tleV07XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJHJlZixcbiAgICBzZXRTdGF0ZSxcbiAgICBzZXREYXRhU3RhdGUsXG4gICAgaW5pdE11dGF0aW9uU3RhdGVcbiAgfVxufVxuIiwiZnVuY3Rpb24gdXNlU2VsZWN0Qm94VGVtcCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlQ3VzdG9tSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiY29tYm8xXCIgY2xhc3M9XCJzZWxlY3QtYm94XCIgcm9sZT1cImNvbWJvYm94XCIgYXJpYS1jb250cm9scz1cImxpc3Rib3gxXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgYXJpYS1hY3RpdmVkZXNjZW5kYW50PVwiXCI+XG4gICAgICAgIDxzcGFuIHN0eWxlPVwicG9pbnRlci1ldmVudHM6IG5vbmU7XCI+JHt0ZXh0fTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zV3JhcChpdGVtc0hUTUwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDx1bCBpZD1cImxpc3Rib3gxXCIgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uc1wiIHJvbGU9XCJsaXN0Ym94XCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICR7aXRlbXNIVE1MfVxuICAgICAgICA8L3VsPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxsaSByb2xlPVwib3B0aW9uXCIgY2xhc3M9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPVwiJHtzZWxlY3RlZH1cIiBkYXRhLXZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiPlxuICAgICAgICAgICR7aXRlbS50ZXh0fVxuICAgICAgICA8L2xpPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0ICR0ZW1wbGF0ZUJhc2ljSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkIGRpc2FibGVkIGhpZGRlbj4ke3RleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXNXcmFwKGl0ZW1zSFRNTCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPHNlbGVjdCBjbGFzcz1cInNlbGVjdC1saXN0XCIgcmVxdWlyZWQ+XG4gICAgICAgICAgJHtpdGVtc0hUTUx9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCIke2l0ZW0udmFsdWV9XCI+JHtpdGVtLnRleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVDdXN0b21IVE1MLFxuICAgICR0ZW1wbGF0ZUJhc2ljSFRNTCxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVzZVN0YXRlKGluaXRpYWxWYWx1ZSA9IHt9LCBjYWxsYmFjaykge1xuICBjb25zdCBzdGF0ZSA9IG5ldyBQcm94eShpbml0aWFsVmFsdWUsIHtcbiAgICBzZXQ6ICh0YXJnZXQsIGtleSwgdmFsdWUpID0+IHtcbiAgICAgIHRhcmdldFtrZXldID0gdmFsdWU7XG5cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayh0YXJnZXQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3Qgc2V0U3RhdGUgPSAobmV3U3RhdGUpID0+IHtcbiAgICBPYmplY3Qua2V5cyhuZXdTdGF0ZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzdGF0ZVtrZXldID0gbmV3U3RhdGVba2V5XTtcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIFtzdGF0ZSwgc2V0U3RhdGVdO1xufVxuIiwiZnVuY3Rpb24gdXNlU3dpcGVyVG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9IHtcbiAgICBuYXZpZ2F0aW9uKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLXByZXZcIj7snbTsoIQ8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLW5leHRcIj7ri6TsnYw8L2J1dHRvbj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBwYWdpbmF0aW9uKCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1wYWdpbmF0aW9uXCI+PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgYXV0b3BsYXkoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYXV0b3BsYXkgcGxheVwiPjwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlSFRNTCxcbiAgfTtcbn1cbiIsIi8qKlxuICogdGVtcCB0aW1lbGluZVxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gdXNlVHJhbnNpdGlvbigpIHtcbiAgLy8gc2VsZWN0XG4gIGNvbnN0IHVzZVNlbGVjdFNob3cgPSAodGFyZ2V0LCB0eXBlLCBvcHRpb24pID0+IHtcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICAgIGNvbnN0IHRpbWVsaW5lID0gZ3NhcC50aW1lbGluZSh7IHBhdXNlZDogdHJ1ZSB9KTtcblxuICAgIGNvbnN0IG9wdGlvbkxpc3QgPSB7XG4gICAgICBmYXN0OiB7IGR1cmF0aW9uOiAwLjE1IH0sXG4gICAgICBub3JtYWw6IHsgZHVyYXRpb246IDAuMyB9LFxuICAgICAgc2xvdzogeyBkdXJhdGlvbjogMC43IH0sXG4gICAgfTtcbiAgICBjb25zdCBnc2FwT3B0aW9uID0geyAuLi5vcHRpb25MaXN0W3R5cGVdLCAuLi5vcHRpb24gfTtcblxuICAgIHRpbWVsaW5lLnRvKHRhcmdldCwge1xuICAgICAgYWxwaGE6IDAsXG4gICAgICBlYXNlOiAnbGluZWFyJyxcbiAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfSxcbiAgICAgIC4uLmdzYXBPcHRpb24sXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGltZWxpbmVFbDogdGltZWxpbmUuX3JlY2VudC52YXJzLFxuICAgICAgdGltZWxpbmU6IChzdGF0ZSkgPT4ge1xuICAgICAgICBzdGF0ZVxuICAgICAgICAgID8gZ3NhcC50byh0YXJnZXQsIHtcbiAgICAgICAgICAgICAgb25TdGFydDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZWFzZTogJ2xpbmVhcicsXG4gICAgICAgICAgICAgIGFscGhhOiAxLFxuICAgICAgICAgICAgICAuLi5nc2FwT3B0aW9uLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICA6IGdzYXAudG8odGFyZ2V0LCB7XG4gICAgICAgICAgICAgIGFscGhhOiAwLFxuICAgICAgICAgICAgICBlYXNlOiAnbGluZWFyJyxcbiAgICAgICAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xvc2VzdCgnLmNvbXBvbmVudC1zZWxlY3QnKS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoJy5jb21wb25lbnQtc2VsZWN0JykuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAuLi5nc2FwT3B0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH07XG5cbiAgY29uc3Qgc2VsZWN0RGltbVNob3cgPSAodGFyZ2V0KSA9PiB7XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcblxuICAgIGdzYXAudG8odGFyZ2V0LCB7XG4gICAgICBvblN0YXJ0OiAoKSA9PiB7XG4gICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0sXG4gICAgICBlYXNlOiAnbGluZWFyJyxcbiAgICAgIGFscGhhOiAwLjYsXG4gICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBzZWxlY3REaW1tQ2xvc2UgPSAodGFyZ2V0KSA9PiB7XG4gICAgaWYgKCF0YXJnZXQpIHJldHVybjtcblxuICAgIGdzYXAudG8odGFyZ2V0LCB7XG4gICAgICBhbHBoYTogMCxcbiAgICAgIGVhc2U6ICdsaW5lYXInLFxuICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHVzZVNlbGVjdFNob3csXG4gICAgc2VsZWN0RGltbVNob3csXG4gICAgc2VsZWN0RGltbUNsb3NlXG4gIH07XG59XG4iLCJcbmV0VUkuaG9va3MgPSB7XG51c2VBMTF5S2V5RXZlbnQsXG51c2VDbGlja091dHNpZGUsXG51c2VDb3JlLFxudXNlRGF0YXNldCxcbnVzZURpYWxvZyxcbmRpYWxvZ1RtcGwsXG51c2VFdmVudExpc3RlbmVyLFxudXNlR2V0Q2xpZW50UmVjdCxcbnVzZUxheWVyLFxudXNlTWVkaWFRdWVyeSxcbnVzZU11dGF0aW9uU3RhdGUsXG51c2VTZWxlY3RCb3hUZW1wLFxudXNlU3RhdGUsXG51c2VTd2lwZXJUbXBsLFxudXNlVHJhbnNpdGlvblxufVxuICAgICAgICAgICAgICAiLCIvKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFByb3BzQ29uZmlnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGRpc2FibGVkIC0g7JqU7IaM6rCAIOu5hO2ZnOyEse2ZlCDsg4Htg5zsnbjsp4Drpbwg64KY7YOA64OF64uI64ukLlxuICogQHByb3BlcnR5IHtib29sZWFufSBvbmNlIC0g7J2067Kk7Yq464KYIOyVoeyFmOydhCDtlZwg67KI66eMIOyLpO2Wie2VoOyngCDsl6zrtoDrpbwg6rKw7KCV7ZWp64uI64ukLlxuICogQHByb3BlcnR5IHtmYWxzZSB8IG51bWJlcn0gZHVyYXRpb24gLSDslaDri4jrqZTsnbTshZgg65iQ64qUIOydtOuypO2KuCDsp4Dsho0g7Iuc6rCE7J2EIOuwgOumrOy0iCDri6jsnITroZwg7ISk7KCV7ZWp64uI64ukLiAnZmFsc2Un7J28IOqyveyasCDsp4Dsho0g7Iuc6rCE7J2EIOustOyLnO2VqeuLiOuLpC5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBvcmlnaW4gLSDsm5DsoJAg65iQ64qUIOyLnOyekSDsp4DsoJDsnYQg64KY7YOA64K064qUIOqwneyytOyeheuLiOuLpC5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN0YXRlQ29uZmlnXG4gKiBAcHJvcGVydHkgeydjbG9zZScgfCAnb3Blbid9IHN0YXRlIC0g7JWE7L2U65SU7Ja47J2YIOyDge2DnOqwki4gY2xvc2UsIG9wZW4g65GYIOykkeyXkCDtlZjrgpjsnoXri4jri6QuXG4gKi9cblxuLyoqIEB0eXBlIHtQcm9wc0NvbmZpZ30gKi9cbi8qKiBAdHlwZSB7U3RhdGVDb25maWd9ICovXG5cbmZ1bmN0aW9uIEFjY29yZGlvbigpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvL3Byb3BzXG4gICAgICBpbmRleDogLTEsXG4gICAgICBhbmltYXRpb246IHtcbiAgICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgICAgZWFzaW5nOiAncG93ZXI0Lm91dCcsXG4gICAgICB9LFxuICAgICAgdHlwZTogJ211bHRpcGxlJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vc3RhdGVcbiAgICAgIGluZGV4OiAtMSxcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyBjb25zdGFudFxuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnYWNjb3JkaW9uJztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgYWNjb3JkaW9uSXRlbTtcbiAgbGV0ICR0YXJnZXQsICRhY2NvcmRpb25JdGVtLCAkYWNjb3JkaW9uSXRlbXM7XG5cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCwgeyBzdGF0ZUNhbGxiYWNrOiBfcHJvcHM/LnN0YXRlQ2FsbGJhY2sgfSk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBzdGF0ZVxuICAgIHJlbmRlcih0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIHNlbGVjdG9yXG4gICAgYWNjb3JkaW9uSXRlbSA9ICcuYWNjb3JkaW9uLWl0ZW0nO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRhY2NvcmRpb25JdGVtID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKGFjY29yZGlvbkl0ZW0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgICRhY2NvcmRpb25JdGVtcyA9IEFycmF5LmZyb20oJGFjY29yZGlvbkl0ZW0pO1xuICAgIGNvbnN0IGl0ZW1zID0gJGFjY29yZGlvbkl0ZW1zLm1hcCgoJGNvbGxhcHNlLCBpKSA9PiB7XG4gICAgICBjb25zdCBjb2xsYXBzZSA9IGV0VUkuY29tcG9uZW50cy5Db2xsYXBzZSgpO1xuICAgICAgY29sbGFwc2UuY29yZS5pbml0KCRjb2xsYXBzZSwge1xuICAgICAgICBhZnRlck9wZW46IHByb3BzLmFmdGVyT3BlbixcbiAgICAgICAgYWZ0ZXJDbG9zZTogcHJvcHMuYWZ0ZXJDbG9zZSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocHJvcHMudHlwZSA9PT0gJ3NlcGFyYXRlJyB8fCBwcm9wcy50eXBlID09PSAnc2luZ2xlJykge1xuICAgICAgICBpZiAoJGNvbGxhcHNlLmRhdGFzZXQuc3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgICAgIC8vIOyViOyghO2VmOqyjCBvcGVuIO2VqOyImCDtmLjstpxcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgb3BlbihpKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdGYWlsZWQgdG8gb3BlbiBhY2NvcmRpb24gaXRlbTonLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb2xsYXBzZTtcbiAgICB9KTtcblxuICAgIGlmIChzdGF0ZS5pbmRleCA+IC0xKSB7XG4gICAgICBzZXRTdGF0ZSh7IGluZGV4OiBzdGF0ZS5pbmRleCB9LCB7IGltbWVkaWF0ZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgYWN0aW9ucy5vcGVuID0gKCkgPT4ge307XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKCkgPT4ge307XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCBhY2NvcmRpb25JdGVtLCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgaWYgKHByb3BzLnR5cGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgIGNvbnN0IGNvbGxhcHNlID0gdGFyZ2V0LmNsb3Nlc3QoYWNjb3JkaW9uSXRlbSk7XG4gICAgICAgIGNvbnN0IF9zdGF0ZSA9IGNvbGxhcHNlLnVpLmNvcmUuc3RhdGUuc3RhdGU7XG5cbiAgICAgICAgaWYgKF9zdGF0ZSA9PT0gJ29wZW4nKSB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSAkYWNjb3JkaW9uSXRlbXMuaW5kZXhPZihjb2xsYXBzZSk7XG4gICAgICAgICAgc2V0U3RhdGUoeyBpbmRleCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKGltbWVkaWF0ZSA9IGZhbHNlKSB7XG4gICAgb3BlbihzdGF0ZS5pbmRleCwgaW1tZWRpYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oaW5kZXgsIGltbWVkaWF0ZSkge1xuICAgIGluZGV4ID0gK2luZGV4O1xuICAgIGlmIChwcm9wcy50eXBlID09PSAnc2luZ2xlJykge1xuICAgICAgJGFjY29yZGlvbkl0ZW1zLmZvckVhY2goKCRpdGVtLCBpKSA9PiB7XG4gICAgICAgIGlmICghJGl0ZW0gfHwgISRpdGVtLnVpKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdBY2NvcmRpb24gaXRlbSBvciBVSSBub3QgaW5pdGlhbGl6ZWQ6JywgaSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoaSAhPT0gaW5kZXgpIHtcbiAgICAgICAgICBpZiAoJGl0ZW0udWkuY29yZSAmJiAkaXRlbS51aS5jb3JlLnN0YXRlICYmICRpdGVtLnVpLmNvcmUuc3RhdGUuc3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgICAgICAgJGl0ZW0udWkuY2xvc2UoaW1tZWRpYXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJGl0ZW0udWkub3BlbihpbW1lZGlhdGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSAmJiAkYWNjb3JkaW9uSXRlbXNbaW5kZXhdICYmICRhY2NvcmRpb25JdGVtc1tpbmRleF0udWkpIHtcbiAgICAgICAgJGFjY29yZGlvbkl0ZW1zW2luZGV4XS51aS5vcGVuKGltbWVkaWF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0FjY29yZGlvbiBpdGVtIG9yIFVJIG5vdCBpbml0aWFsaXplZCBmb3IgaW5kZXg6JywgaW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlKGluZGV4LCBpbW1lZGlhdGUpIHtcbiAgICBpZiAoaW5kZXggPj0gMCAmJiAkYWNjb3JkaW9uSXRlbXNbaW5kZXhdICYmICRhY2NvcmRpb25JdGVtc1tpbmRleF0udWkpIHtcbiAgICAgICRhY2NvcmRpb25JdGVtc1tpbmRleF0udWkuY2xvc2UoaW1tZWRpYXRlKTtcbiAgICB9IGVsc2UgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGNvbnNvbGUud2FybignQ2Fubm90IGNsb3NlIGFjY29yZGlvbiBpdGVtOiBVSSBub3QgaW5pdGlhbGl6ZWQgZm9yIGluZGV4OicsIGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqIENvbGxhcHNlXG4gKi9cbmZ1bmN0aW9uIENvbGxhcHNlKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCwgY2xlYW51cHMgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvLyBwcm9wc1xuICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjUsXG4gICAgICAgIGVhc2luZzogJ3Bvd2VyMi5vdXQnLFxuICAgICAgfSxcblxuICAgICAgY2xpY2tPdXRzaWRlOiBmYWxzZSxcbiAgICAgIGExMXlUYWI6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gc3RhdGVcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyBjb25zdGFudFxuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnY29sbGFwc2UnO1xuICBsZXQgY29tcG9uZW50ID0ge307XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCBjb2xsYXBzZVRyaWdnZXIsIGNvbGxhcHNlQ29udGVudCwgY2xvc2VUaW1lbGluZSwgY2xpY2tPdXRzaWRlQ2xlYW51cDtcbiAgbGV0ICR0YXJnZXQsICRjb2xsYXBzZVRyaWdnZXIsICRjb2xsYXBzZUNvbnRlbnQ7XG5cbiAgLy8gaG9va3NcbiAgY29uc3QgeyBmaXJzdE5vZGVGb2N1c091dCwgbGFzdE5vZGVGb2N1c091dCB9ID0gZXRVSS5ob29rcy51c2VBMTF5S2V5RXZlbnQoKTtcblxuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcignVGFyZ2V0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBzZXRUYXJnZXQoJHRhcmdldCwgeyBzdGF0ZUNhbGxiYWNrOiBfcHJvcHM/LnN0YXRlQ2FsbGJhY2sgfSk7XG4gICAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgICBzZXR1cCgpO1xuICAgICAgc2V0RXZlbnQoKTtcblxuICAgICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluaXRpYWxpemluZyBDb2xsYXBzZSBjb21wb25lbnQ6JywgZXJyb3IpO1xuICAgICAgLy8g7Jik66WY6rCAIOuwnOyDne2VtOuPhCDquLDrs7jsoIHsnbggVUkg7IOB7YOc64qUIOyEpOyglVxuICAgICAgaWYgKCEkdGFyZ2V0LnVpKSB7XG4gICAgICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIHN0YXRlXG4gICAgLy8gc2V0U3RhdGUoeyBzZXR0aW5nOiAnY3VzdG9tJyB9KTtcbiAgICByZW5kZXIodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHt9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIGNvbGxhcHNlVHJpZ2dlciA9ICcuY29sbGFwc2UtdGl0JztcbiAgICBjb2xsYXBzZUNvbnRlbnQgPSAnLmNvbGxhcHNlLWNvbnRlbnQnO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRjb2xsYXBzZVRyaWdnZXIgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoY29sbGFwc2VUcmlnZ2VyKTtcbiAgICAkY29sbGFwc2VDb250ZW50ID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGNvbGxhcHNlQ29udGVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcbiAgICBjb25zdCBpZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tSWQoKTtcblxuICAgIGNvbnN0IGNvbGxhcHNlSWQgPSBgaWQtY29sbGFwc2UtJHtpZH1gO1xuICAgIGNvbnN0IGNvbGxhcHNlVHJpZ2dlcklkID0gYGlkLWNvbGxhcHNlLXRpdGxlLSR7aWR9YDtcbiAgICBjb25zdCBjb2xsYXBzZUNvbnRlbnRJZCA9IGBpZC1jb2xsYXBzZS1jb250ZW50LSR7aWR9YDtcblxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdpZCcsIGNvbGxhcHNlSWQpO1xuICAgICRjb2xsYXBzZVRyaWdnZXIuc2V0QXR0cmlidXRlKCdjb250cm9scycsIGNvbGxhcHNlQ29udGVudElkKTtcbiAgICAkY29sbGFwc2VUcmlnZ2VyLnNldEF0dHJpYnV0ZSgnaWQnLCBjb2xsYXBzZVRyaWdnZXJJZCk7XG4gICAgJGNvbGxhcHNlQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgJGNvbGxhcHNlQ29udGVudC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncmVnaW9uJyk7XG4gICAgJGNvbGxhcHNlQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgY29sbGFwc2VDb250ZW50SWQpO1xuICAgICRjb2xsYXBzZUNvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCBjb2xsYXBzZVRyaWdnZXJJZCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgY29uc3QgeyBkdXJhdGlvbiwgZWFzaW5nIH0gPSBwcm9wcy5hbmltYXRpb247XG5cbiAgICBjb25zdCBhMTF5Q2xlYW51cCA9IFtdO1xuXG4gICAgYWN0aW9ucy5vcGVuID0gKGltbWVkaWF0ZSA9IGZhbHNlKSA9PiB7XG4gICAgICAkY29sbGFwc2VUcmlnZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpO1xuICAgICAgJGNvbGxhcHNlQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuXG4gICAgICBpZiAoY2xvc2VUaW1lbGluZSkge1xuICAgICAgICBjbG9zZVRpbWVsaW5lLmtpbGwoKTtcbiAgICAgIH1cblxuICAgICAgZ3NhcC5zZXQoJGNvbGxhcHNlQ29udGVudCwgeyBoZWlnaHQ6ICdhdXRvJywgZGlzcGxheTogJ2Jsb2NrJywgcGFkZGluZ1RvcDogbnVsbCwgcGFkZGluZ0JvdHRvbTogbnVsbCB9KTtcbiAgICAgIGdzYXAudGltZWxpbmUoKS5mcm9tKCRjb2xsYXBzZUNvbnRlbnQsIHtcbiAgICAgICAgZHVyYXRpb246IGltbWVkaWF0ZSA/IDAgOiBkdXJhdGlvbixcbiAgICAgICAgZWFzZTogZWFzaW5nLFxuICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgIHBhZGRpbmdUb3A6IDAsXG4gICAgICAgIHBhZGRpbmdCb3R0b206IDAsXG4gICAgICAgIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICBpZiAocHJvcHMuc2Nyb2xsVG8pIHtcbiAgICAgICAgICAgIGdzYXAudG8od2luZG93LCB7XG4gICAgICAgICAgICAgIHNjcm9sbFRvOiB7XG4gICAgICAgICAgICAgICAgeTogJHRhcmdldCxcbiAgICAgICAgICAgICAgICBvZmZzZXRZOiAyICogKCRjb2xsYXBzZUNvbnRlbnQub2Zmc2V0VG9wIC0gJGNvbGxhcHNlVHJpZ2dlci5vZmZzZXRUb3ApLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHByb3BzLmExMXlUYWIpIHtcbiAgICAgICAgICAgIGExMXlDbGVhbnVwLnB1c2goXG4gICAgICAgICAgICAgIGxhc3ROb2RlRm9jdXNPdXQoZXRVSS51dGlscy5sYXN0Tm9kZSh0YWJiYWJsZS50YWJiYWJsZSgkY29sbGFwc2VDb250ZW50KSksICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0pO1xuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwcm9wcy5hZnRlck9wZW4pIHtcbiAgICAgICAgICAgIHByb3BzLmFmdGVyT3Blbih7XG4gICAgICAgICAgICAgIHRhcmdldDogJHRhcmdldCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocHJvcHMuY2xpY2tPdXRzaWRlKSB7XG4gICAgICAgIGNsaWNrT3V0c2lkZUNsZWFudXAgPSB1c2VDbGlja091dHNpZGUoJHRhcmdldCwgKCkgPT4ge1xuICAgICAgICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKGltbWVkaWF0ZSA9IGZhbHNlKSA9PiB7XG4gICAgICBpZiAoY2xpY2tPdXRzaWRlQ2xlYW51cCkge1xuICAgICAgICBjbGlja091dHNpZGVDbGVhbnVwKCk7XG4gICAgICB9XG5cbiAgICAgICRjb2xsYXBzZVRyaWdnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuICAgICAgJGNvbGxhcHNlQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgICAgIGNsb3NlVGltZWxpbmUgPSBnc2FwLnRpbWVsaW5lKCkudG8oJGNvbGxhcHNlQ29udGVudCwge1xuICAgICAgICBkdXJhdGlvbjogaW1tZWRpYXRlID8gMCA6IGR1cmF0aW9uLFxuICAgICAgICBlYXNlOiBlYXNpbmcsXG4gICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgcGFkZGluZ1RvcDogMCxcbiAgICAgICAgcGFkZGluZ0JvdHRvbTogMCxcbiAgICAgICAgb3ZlcndyaXRlOiB0cnVlLFxuICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICRjb2xsYXBzZUNvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICBldFVJLnV0aWxzLmFsbENsZWFudXBzKGExMXlDbGVhbnVwKTtcbiAgICAgICAgICBpZiAocHJvcHMuYWZ0ZXJDbG9zZSkge1xuICAgICAgICAgICAgcHJvcHMuYWZ0ZXJDbG9zZSh7XG4gICAgICAgICAgICAgIHRhcmdldDogJHRhcmdldCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCBjb2xsYXBzZVRyaWdnZXIsICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoc3RhdGUuc3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0U3RhdGUoeyBzdGF0ZTogJ29wZW4nIH0pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBoYW5kbGluZyBjb2xsYXBzZSBjbGljayBldmVudDonLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuYTExeVRhYikge1xuICAgICAgZmlyc3ROb2RlRm9jdXNPdXQoJGNvbGxhcHNlVHJpZ2dlciwgKCkgPT4ge1xuICAgICAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKGltbWVkaWF0ZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgaXNTaG93ID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcbiAgICBpc1Nob3cgPyBhY3Rpb25zLm9wZW4oaW1tZWRpYXRlKSA6IGFjdGlvbnMuY2xvc2UoaW1tZWRpYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oaW1tZWRpYXRlID0gZmFsc2UpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSwgeyBpbW1lZGlhdGUgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZShpbW1lZGlhdGUgPSBmYWxzZSkge1xuICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSwgeyBpbW1lZGlhdGUgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCJmdW5jdGlvbiBEYXRlcGlja2VyQ29tcCgpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICAvLyBwcm9wc1xuICAgICAgbGFuZ3VhZ2U6ICdrbycsXG4gICAgICBkYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQ6IFswLCA2XSxcbiAgICAgIGF1dG9oaWRlOiB0cnVlLFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gc3RhdGVcbiAgICB9LFxuICAgIHJlbmRlcixcbiAgKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBNQVJHSU4gPSAyMDtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ2RhdGVwaWNrZXInO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQsICRkYXRlcGlja2VyLCAkZGF0ZXBpY2tlclRyaWdnZXIsICRzZWxlY3RMYWJlbCwgJHJhbmdlU3RhcnQsICRyYW5nZUVuZDtcbiAgbGV0IHJhbmdlU3RhcnQsIHJhbmdlRW5kLCBkYXRlcGlja2VyVHJpZ2dlcjtcblxuICBEYXRlcGlja2VyLmxvY2FsZXMua28gPSB7XG4gICAgZGF5czogWyfsnbzsmpTsnbwnLCAn7JuU7JqU7J28JywgJ+2ZlOyalOydvCcsICfsiJjsmpTsnbwnLCAn66qp7JqU7J28JywgJ+q4iOyalOydvCcsICfthqDsmpTsnbwnXSxcbiAgICBkYXlzU2hvcnQ6IFsn7J28JywgJ+yblCcsICftmZQnLCAn7IiYJywgJ+uqqScsICfquIgnLCAn7YagJ10sXG4gICAgZGF5c01pbjogWyfsnbwnLCAn7JuUJywgJ+2ZlCcsICfsiJgnLCAn66qpJywgJ+q4iCcsICfthqAnXSxcbiAgICBtb250aHM6IFsnMeyblCcsICcy7JuUJywgJzPsm5QnLCAnNOyblCcsICc17JuUJywgJzbsm5QnLCAnN+yblCcsICc47JuUJywgJznsm5QnLCAnMTDsm5QnLCAnMTHsm5QnLCAnMTLsm5QnXSxcbiAgICBtb250aHNTaG9ydDogWycx7JuUJywgJzLsm5QnLCAnM+yblCcsICc07JuUJywgJzXsm5QnLCAnNuyblCcsICc37JuUJywgJzjsm5QnLCAnOeyblCcsICcxMOyblCcsICcxMeyblCcsICcxMuyblCddLFxuICAgIHRvZGF5OiAn7Jik64qYJyxcbiAgICBjbGVhcjogJ+yCreygnCcsXG4gICAgZm9ybWF0OiAneXl5eS1tbS1kZCcsXG4gICAgdGl0bGVGb3JtYXQ6ICd564WEIG3sm5QnLFxuICAgIHdlZWtTdGFydDogMCxcbiAgfTtcblxuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKHByb3BzLnR5cGUgPT09ICdyYW5nZScpICR0YXJnZXQgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5jb21wb25lbnQtcmFuZ2VwaWNrZXInKTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcblxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwVGVtcGxhdGUoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIHN0YXRlXG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIGRhdGVwaWNrZXJUcmlnZ2VyID0gJy5kYXRlcGlja2VyLWJ0bi10cmlnZ2VyJztcbiAgICByYW5nZVN0YXJ0ID0gJ3JhbmdlLXN0YXJ0JztcbiAgICByYW5nZUVuZCA9ICdyYW5nZS1lbmQnO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gcHJvcHM7XG4gICAgLy8gaWRcbiAgICBjb25zdCBsYWJlbElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJHNlbGVjdExhYmVsLCAnaWQnLCBsYWJlbElkKTtcblxuICAgIGlmIChwcm9wcy50eXBlID09PSAncmFuZ2UnKSB7XG4gICAgICAkcmFuZ2VTdGFydCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihgW25hbWU9XCIke3JhbmdlU3RhcnR9XCJdYCk7XG4gICAgICAkcmFuZ2VFbmQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtyYW5nZUVuZH1cIl1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGRhdGVwaWNrZXJUcmlnZ2VyID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKGRhdGVwaWNrZXJUcmlnZ2VyKTtcbiAgICB9XG5cbiAgICAvLyAkZGF0ZXBpY2tlciDsoJXsnZhcbiAgICBpZiAodHlwZSA9PT0gJ3JhbmdlJykge1xuICAgICAgJGRhdGVwaWNrZXIgPSBuZXcgRGF0ZVJhbmdlUGlja2VyKCR0YXJnZXQsIHsgLi4ucHJvcHMgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRkYXRlcGlja2VyID0gbmV3IERhdGVwaWNrZXIoJGRhdGVwaWNrZXJUcmlnZ2VyLCB7IC4uLnByb3BzIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7fTtcblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7fTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHt9XG5cbiAgZnVuY3Rpb24gY2xvc2UoKSB7fVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuICAgICAgaW5pdCxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgICAgZGVzdHJveSxcbiAgICB9LFxuXG4gICAgLy8gY2FsbGFibGVcbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgICBnZXREYXRlcGlja2VySW5zdGFuY2UoKSB7XG4gICAgICByZXR1cm4gJGRhdGVwaWNrZXI7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiAgTW9kYWxcbiAqL1xuZnVuY3Rpb24gRGlhbG9nKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIC8vIHByb3BzXG4gICAgICBkaW1tQ2xpY2s6IHRydWUsXG4gICAgICBlc2M6IHRydWUsXG4gICAgICB0aXRsZTogbnVsbCxcbiAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgdHlwZTogJ2FsZXJ0JyxcbiAgICAgIHBvc2l0aXZlVGV4dDogZXRVSS4kdCgnZGlhbG9nLnBvc2l0aXZlJywgJ+2ZleyduCcpLFxuICAgICAgbmVnYXRpdmVUZXh0OiBldFVJLiR0KCdkaWFsb2cubmVnYXRpdmUnLCAn7Leo7IaMJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBzdGF0ZTogJ2Nsb3NlJyxcbiAgICAgIHRyaWdnZXI6IG51bGwsXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICAge1xuICAgICAgZGF0YXNldDogZmFsc2UsXG4gICAgfSxcbiAgKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBESU1NX09QQUNJVFkgPSBldFVJLmNvbmZpZy5sYXllci5kaW1tT3BhY2l0eTtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ2RpYWxvZyc7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgbGV0IG1vZGFsRGltbVNlbGVjdG9yLCBtb2RhbENsb3NlQnRuU2VsZWN0b3IsIG1vZGFsQnRuUG9zaXRpdmUsIG1vZGFsQnRuTmVnYXRpdmU7XG4gIGxldCAkdGFyZ2V0LCAkbW9kYWwsICRtb2RhbFRpdGxlLCAkbW9kYWxDb250YWluZXIsICRtb2RhbERpbW0sICRtb2RhbEJ0blBvc2l0aXZlLCAkbW9kYWxCdG5OZWdhdGl2ZSwgZm9jdXNUcmFwSW5zdGFuY2UsIGNhbGxiYWNrO1xuXG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBfJHRhcmdldFxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcigndGFyZ2V07J20IOyhtOyerO2VmOyngCDslYrsirXri4jri6QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQsIHsgc3RhdGVDYWxsYmFjazogX3Byb3BzPy5zdGF0ZUNhbGxiYWNrIH0pO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcblxuICAgIC8vICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIGZvY3VzIHRyYXBcbiAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJG1vZGFsLCB7XG4gICAgICBlc2NhcGVEZWFjdGl2YXRlczogcHJvcHMuZXNjLFxuICAgICAgb25BY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0FjdGl2YXRlLFxuICAgICAgb25EZWFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSxcbiAgICB9KTtcblxuICAgIC8vIHN0YXRlXG4gICAgLy8gc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB7ICR0ZW1wbGF0ZUhUTUwsICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUwgfSA9IGV0VUkudGVtcGxhdGVzLmRpYWxvZ1RtcGwoKTtcblxuICAgIGlmIChwcm9wcy5kaWFsb2dUeXBlID09PSAnYWxlcnQnIHx8IHByb3BzLmRpYWxvZ1R5cGUgPT09ICdjb25maXJtJykge1xuICAgICAgJHRhcmdldC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICR0ZW1wbGF0ZUhUTUwocHJvcHMpKTtcbiAgICB9IGVsc2UgaWYgKHByb3BzLmRpYWxvZ1R5cGUgPT09ICdwcmV2aWV3SW1hZ2UnKSB7XG4gICAgICAkdGFyZ2V0Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgJHRlbXBsYXRlUHJldmlld0ltYWdlSFRNTChwcm9wcykpO1xuICAgIH1cblxuICAgICRtb2RhbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmNvbXBvbmVudC1kaWFsb2cnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gc2VsZWN0b3JcbiAgICBtb2RhbENsb3NlQnRuU2VsZWN0b3IgPSAnLmRpYWxvZy1jbG9zZSc7XG4gICAgbW9kYWxEaW1tU2VsZWN0b3IgPSAnLmRpYWxvZy1kaW1tJztcblxuICAgIC8vIGVsZW1lbnRcbiAgICAkbW9kYWxUaXRsZSA9ICRtb2RhbC5xdWVyeVNlbGVjdG9yKCcuZGlhbG9nLXRpdCcpO1xuICAgICRtb2RhbERpbW0gPSAkbW9kYWwucXVlcnlTZWxlY3Rvcihtb2RhbERpbW1TZWxlY3Rvcik7XG4gICAgJG1vZGFsQ29udGFpbmVyID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctY29udGFpbmVyJyk7XG5cbiAgICBtb2RhbEJ0blBvc2l0aXZlID0gJy5kaWFsb2ctcG9zaXRpdmUnO1xuICAgIG1vZGFsQnRuTmVnYXRpdmUgPSAnLmRpYWxvZy1uZWdhdGl2ZSc7XG4gICAgJG1vZGFsQnRuUG9zaXRpdmUgPSAkbW9kYWwucXVlcnlTZWxlY3RvcignLmRpYWxvZy1wb3NpdGl2ZScpO1xuICAgICRtb2RhbEJ0bk5lZ2F0aXZlID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5kaWFsb2ctbmVnYXRpdmUnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBzZXQgaWRcbiAgICBjb25zdCBpZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcbiAgICBjb25zdCB0aXRsZUlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUgKyAnLXRpdCcpO1xuICAgIC8vIC8vIGExMXlcblxuICAgIGlmIChwcm9wcy5kaWFsb2dUeXBlID09PSAnYWxlcnQnIHx8IHByb3BzLmRpYWxvZ1R5cGUgPT09ICdjb25maXJtJykge1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdyb2xlJywgJ2FsZXJ0ZGlhbG9nJyk7XG4gICAgfSBlbHNlIGlmIChwcm9wcy5kaWFsb2dUeXBlID09PSAncHJldmlld0ltYWdlJykge1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdyb2xlJywgJ2RpYWxvZycpO1xuXG4gICAgICBjb25zdCAkc3dpcGVyID0gJG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5jb21wb25lbnQtc3dpcGVyJyk7XG4gICAgICBjb25zdCBzd2lwZXIgPSBuZXcgZXRVSS5jb21wb25lbnRzLlN3aXBlckNvbXAoKTtcbiAgICAgIHN3aXBlci5jb3JlLmluaXQoJHN3aXBlciwge1xuICAgICAgICBuYXZpZ2F0aW9uOiB0cnVlLFxuICAgICAgICBwYWdpbmF0aW9uOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ2lkJywgaWQpO1xuICAgIGlmICgkbW9kYWxUaXRsZSkgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWxUaXRsZSwgJ2lkJywgdGl0bGVJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkbW9kYWwsICdhcmlhLWxhYmVsbGVkYnknLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbCwgJ3RhYmluZGV4JywgJy0xJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgY29uc3QgeyBnZXRUb3BEZXB0aCwgc2V0TGF5ZXJPcGFjaXR5LCBlbmFibGVTY3JvbGxMb2NrLCBkaXNhYmxlU2Nyb2xsTG9jayB9ID0gZXRVSS5ob29rcy51c2VMYXllcigpO1xuXG4gICAgYWN0aW9ucy5mb2N1c0FjdGl2YXRlID0gKCkgPT4ge307XG5cbiAgICBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgICAgIGlmICghc3RhdGUudHJpZ2dlcikge1xuICAgICAgICBjYWxsYmFjayA9IHByb3BzLm5lZ2F0aXZlQ2FsbGJhY2s7XG4gICAgICB9XG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHpJbmRleCA9IGdldFRvcERlcHRoKCk7XG5cbiAgICAgICRtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICRtb2RhbC5zdHlsZS56SW5kZXggPSB6SW5kZXg7XG5cbiAgICAgIC8vIGlmIChwcm9wcy5kaWFsb2dUeXBlID09PSAneW91dHViZScpIHtcbiAgICAgIC8vIH1cbiAgICAgIGVuYWJsZVNjcm9sbExvY2soKTtcblxuICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XG5cbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxEaW1tLCB7IGR1cmF0aW9uOiAwLCBkaXNwbGF5OiAnYmxvY2snLCBvcGFjaXR5OiAwIH0pLnRvKCRtb2RhbERpbW0sIHtcbiAgICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICB9KTtcblxuICAgICAgZ3NhcFxuICAgICAgICAudGltZWxpbmUoKVxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7XG4gICAgICAgICAgZHVyYXRpb246IDAsXG4gICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgIHNjYWxlOiAwLjk1LFxuICAgICAgICAgIHlQZXJjZW50OiAyLFxuICAgICAgICB9KVxuICAgICAgICAudG8oJG1vZGFsQ29udGFpbmVyLCB7IGR1cmF0aW9uOiAwLjE1LCBvcGFjaXR5OiAxLCBzY2FsZTogMSwgeVBlcmNlbnQ6IDAsIGVhc2U6ICdQb3dlcjIuZWFzZU91dCcgfSk7XG5cbiAgICAgIC8vIOyKpO2BrOuhpCDsnITsuZgg7KCA7J6lIOuwjyDsiqTtgazroaQg7J6g6riIXG4gICAgICAvLyBjb21wb25lbnQuc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xuICAgICAgLy8gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCduby1zY3JvbGwnKTtcbiAgICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gYC0ke2NvbXBvbmVudC5zY3JvbGxZfXB4YDtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxEaW1tLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBvbkNvbXBsZXRlKCkge1xuICAgICAgICAgICRtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBnc2FwLnRpbWVsaW5lKCkudG8oJG1vZGFsQ29udGFpbmVyLCB7XG4gICAgICAgIGR1cmF0aW9uOiAwLjE1LFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBzY2FsZTogMC45NSxcbiAgICAgICAgeVBlcmNlbnQ6IDIsXG4gICAgICAgIGVhc2U6ICdQb3dlcjIuZWFzZU91dCcsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgJG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgJG1vZGFsLnN0eWxlLnpJbmRleCA9IG51bGw7XG5cbiAgICAgICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcblxuICAgICAgICAgIGRlc3Ryb3koKTtcblxuICAgICAgICAgICR0YXJnZXQucmVtb3ZlQ2hpbGQoJG1vZGFsKTtcblxuICAgICAgICAgIC8vIOyKpO2BrOuhpCDsnqDquIgg7ZW07KCcIOuwjyDsnITsuZgg67O17JuQXG4gICAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCduby1zY3JvbGwnKTtcbiAgICAgICAgICAvLyB3aW5kb3cuc2Nyb2xsVG8oMCwgY29tcG9uZW50LnNjcm9sbFkpO1xuICAgICAgICAgIC8vIGRvY3VtZW50LmJvZHkuc3R5bGUudG9wID0gJyc7XG5cbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGRpc2FibGVTY3JvbGxMb2NrKCk7XG5cblxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbENsb3NlQnRuU2VsZWN0b3IsICgpID0+IHtcbiAgICAgIGNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuZGltbUNsaWNrKSB7XG4gICAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbERpbW1TZWxlY3RvciwgY2xvc2UpO1xuICAgIH1cblxuICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsQnRuUG9zaXRpdmUsICgpID0+IHtcbiAgICAgIGlmIChwcm9wcy5jYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IHByb3BzLmNhbGxiYWNrO1xuICAgICAgfSBlbHNlIGlmIChwcm9wcy5wb3NpdGl2ZUNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvcHMucG9zaXRpdmVDYWxsYmFjaztcbiAgICAgIH1cblxuICAgICAgY2xvc2UoJ2J0blBvc2l0aXZlJyk7XG4gICAgfSk7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgbW9kYWxCdG5OZWdhdGl2ZSwgKCkgPT4ge1xuICAgICAgY2FsbGJhY2sgPSBwcm9wcy5uZWdhdGl2ZUNhbGxiYWNrO1xuXG4gICAgICBjbG9zZSgnYnRuTmVnYXRpdmUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc09wZW5lZCA9IHN0YXRlLnN0YXRlID09PSAnb3Blbic7XG5cbiAgICBpZiAoaXNPcGVuZWQpIHtcbiAgICAgIGFjdGlvbnMub3BlbigpO1xuXG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSh0cmlnZ2VyKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJywgdHJpZ2dlciB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG4gICAgdXBkYXRlLFxuICAgIG9wZW4sXG4gICAgY2xvc2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogSW5wdXRcbiAqL1xuZnVuY3Rpb24gSW5wdXQoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgLy8gcHJvcHNcbiAgICB9LFxuICAgIHtcbiAgICAgIC8vIHN0YXRlXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG5cbiAgLy8gY29uc3RhbnRcbiAgY29uc3QgTUFSR0lOID0gMjA7XG5cbiAgLy8gdmFyaWFibGVcbiAgY29uc3QgbmFtZSA9ICdpbnB1dCc7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCwgJGlucHV0VGFyZ2V0LCAkY2hlY2tib3hzLCAkY2hlY2tib3hMZW5ndGg7XG4gIGxldCBpbnB1dFR5cGUsIGNoZWNrYm94cztcblxuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAvLyB0ZW1wbGF0ZSwgc2VsZWN0b3IsIGVsZW1lbnQsIGFjdGlvbnNcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBUZW1wbGF0ZSgpOyAvLyBlbGVtZW507JeQ7IScIOyalOyGjOulvCDssrTtgaztlbTshJwg7YWc7ZSM66a/7JeQIOuTpOyWtOqwgOuvgOuhnCDsiJzshJzqsIAg67CU64CcXG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBzdGF0ZVxuICAgIHNldFN0YXRlKHsgc3RhdGU6IHByb3BzLnN0YXRlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZVxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHsgJHRlbXBsYXRlSFRNTCB9ID0gZXRVSS50ZW1wbGF0ZXMuaW5wdXRUbXBsKCk7XG4gICAgLy8gJHRhcmdldC5pbm5lckhUTUwgPSBgYDtcbiAgICAvLyBldFVJLmxvY2FsZXNbZXRVSS5jb25maWcubG9jYWxlLmRlZmF1bHRdXG4gICAgaWYgKHByb3BzLmNsZWFyKSB7XG4gICAgICAkaW5wdXRUYXJnZXQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmVuZCcsICR0ZW1wbGF0ZUhUTUwuY2xlYXJCdXR0b24oKSk7XG4gICAgfVxuICAgIGlmIChwcm9wcy50b2dnbGVQYXNzd29yZCkge1xuICAgICAgJGlucHV0VGFyZ2V0Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJlbmQnLCAkdGVtcGxhdGVIVE1MLnRvZ2dsZVBhc3N3b3JkKCkpO1xuICAgIH1cbiAgICBpZiAocHJvcHMubG9hZGluZykge1xuICAgICAgJGlucHV0VGFyZ2V0Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJlbmQnLCAkdGVtcGxhdGVIVE1MLmxvYWRpbmcoKSk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5zZWFyY2hCb3gpIHtcbiAgICAgICRpbnB1dFRhcmdldC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyZW5kJywgJHRlbXBsYXRlSFRNTC5zZWFyY2hCb3goKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSkge1xuICAgICAgY2hlY2tib3hzID0gJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXSc7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIGlkXG4gICAgY29uc3QgbGFiZWxJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcblxuICAgIC8vIGExMXlcbiAgICAvLyBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICRzZWxlY3RMYWJlbCwgJ2lkJywgbGFiZWxJZCk7XG5cbiAgICAkaW5wdXRUYXJnZXQgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG5cbiAgICAvLyBpZiAoISRpbnB1dFRhcmdldCkgcmV0dXJuO1xuXG4gICAgaWYgKCR0YXJnZXQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImZpbGVcIl0nKSkge1xuICAgICAgaW5wdXRUeXBlID0gJ2ZpbGUnO1xuICAgIH0gZWxzZSBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSkge1xuICAgICAgaW5wdXRUeXBlID0gJ2NoZWNrYm94JztcbiAgICB9IGVsc2UgaWYgKCR0YXJnZXQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInJhZGlvXCJdJykpIHtcbiAgICAgIGlucHV0VHlwZSA9ICdyYWRpbyc7XG4gICAgfSBlbHNlIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXScpKSB7XG4gICAgICBpbnB1dFR5cGUgPSAncGFzc3dvcmQnO1xuICAgIH0gZWxzZSBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpKSB7XG4gICAgICBpbnB1dFR5cGUgPSAndGV4dGFyZWEnO1xuICAgICAgJGlucHV0VGFyZ2V0ID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dFR5cGUgPSAndGV4dCc7XG4gICAgfVxuXG4gICAgLy8gY29tcG9uZW50IGN1c3RvbSBlbGVtZW50XG4gICAgaWYgKHByb3BzLmNvdW50KSB7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYS1jb3VudC10b3RhbCcpLnRleHRDb250ZW50ID0gcHJvcHMuY291bnQ7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYS1jb3VudCcpLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH1cbiAgICBpZiAocHJvcHMuYWxsQ2hlY2spIHtcbiAgICAgICRjaGVja2JveExlbmd0aCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnLmFncmVlLWFyZWEgaW5wdXQnKS5sZW5ndGg7XG4gICAgICAkY2hlY2tib3hzID0gWy4uLiR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyldO1xuICAgIH1cbiAgICBpZiAoJGlucHV0VGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xuICAgICAgJHRhcmdldC5jbGFzc0xpc3QuYWRkKCdpbnB1dC1kaXNhYmxlZCcpXG4gICAgfVxuICAgIGlmICgkaW5wdXRUYXJnZXQuaGFzQXR0cmlidXRlKCdyZWFkb25seScpKSB7XG4gICAgICAkdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2lucHV0LXJlYWRvbmx5JylcbiAgICB9XG4gIH1cblxuICBsZXQgdiA9ICcnO1xuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHtcbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7fTtcblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7fTtcblxuICAgIGFjdGlvbnMuY2hlY2tCeXRlcyA9IChlKSA9PiB7XG4gICAgICBjb25zdCB7IHRhcmdldCB9ID0gZTtcbiAgICAgIGxldCBsZW5ndGggPSAwO1xuICAgICAgaWYgKHByb3BzLm11bHRpYnl0ZSkge1xuICAgICAgICBsZW5ndGggPSBldFVJLnV0aWxzLmNvdW50Q2hhcmFjdGVycyh0YXJnZXQudmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVuZ3RoID0gdGFyZ2V0LnZhbHVlLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzLmNvdW50TGltaXQpIHtcbiAgICAgICAgaWYgKGxlbmd0aCA+IHByb3BzLmNvdW50KSB7XG4gICAgICAgICAgdGFyZ2V0LnZhbHVlID0gdjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2ID0gdGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnRleHRhcmVhLWNvdW50LW51bScpLnRleHRDb250ZW50ID0gbGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYS1jb3VudC1udW0nKS50ZXh0Q29udGVudCA9IGxlbmd0aDtcblxuICAgICAgICBpZiAobGVuZ3RoID4gcHJvcHMuY291bnQpIHtcbiAgICAgICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy50ZXh0YXJlYS1jb3VudC1udW0nKS5jbGFzc0xpc3QuYWRkKCdvdmVyJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcudGV4dGFyZWEtY291bnQtbnVtJykuY2xhc3NMaXN0LnJlbW92ZSgnb3ZlcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFjdGlvbnMuc2hvd0NsZWFyQnV0dG9uID0gKGUpID0+IHtcbiAgICAgIGlmICgkaW5wdXRUYXJnZXQudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dC1maWVsZC1idG4uY2xlYXInKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmlucHV0LWZpZWxkLWJ0bi5jbGVhcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIOyekOuPmeqygOyDiSDsmIHsl61cbiAgICBhY3Rpb25zLnNlYXJjaEJveCA9IChlKSA9PiB7XG4gICAgICBpZiAoISR0YXJnZXQucXVlcnlTZWxlY3RvcignLnNlYXJjaC1iYXItYm94JykpIHJldHVybjtcblxuICAgICAgaWYgKCRpbnB1dFRhcmdldC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnNlYXJjaC1iYXItYm94Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtYmFyLWJveCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWN0aW9ucy5jbGVhclRleHQgPSAoeyB0YXJnZXQgfSkgPT4ge1xuICAgICAgJGlucHV0VGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICAkaW5wdXRUYXJnZXQuZm9jdXMoKTtcbiAgICAgIGFjdGlvbnMuc2hvd0NsZWFyQnV0dG9uKCk7XG4gICAgICBhY3Rpb25zLnNlYXJjaEJveCgpO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLnRvZ2dsZVBhc3N3b3JkID0gKHsgY3VycmVudFRhcmdldCB9KSA9PiB7XG4gICAgICBpZiAoJGlucHV0VGFyZ2V0LnR5cGUgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgJGlucHV0VGFyZ2V0LnR5cGUgPSAndGV4dCc7XG4gICAgICAgIGN1cnJlbnRUYXJnZXQucXVlcnlTZWxlY3RvcignLnBhc3N3b3JkLXN0YXRlJykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGlucHV0VGFyZ2V0LnR5cGUgPSAncGFzc3dvcmQnO1xuICAgICAgICBjdXJyZW50VGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wYXNzd29yZC1zdGF0ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8g7KCE7LK0IOyytO2BrCDrsoTtirxcbiAgICBhY3Rpb25zLmFsbENoZWNrID0gKHt0YXJnZXR9KSA9PiB7XG4gICAgICBjb25zdCBhbGxDaGVja0J0biA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnLmFsbC1hZ3JlZS1pdGVtIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpWzBdO1xuICAgICAgbGV0IGNoZWNrYm94RWxzID0gdGFyZ2V0ID09PSBhbGxDaGVja0J0biA/ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmFncmVlLWFyZWEnKSA6IHRhcmdldC5jbG9zZXN0KCcuYWdyZWUtaXRlbScpLnF1ZXJ5U2VsZWN0b3IoJy5zdWItYWdyZWUtaXRlbScpO1xuICAgICAgY2hlY2tib3hFbHMucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuZm9yRWFjaCgkY2hlY2tib3ggPT4gJGNoZWNrYm94LmNoZWNrZWQgPSB0YXJnZXQuY2hlY2tlZCk7XG4gICAgfVxuXG4gICAgLy8g7KCE7LK0IGNoZWNrYm947J2YIGNoZWNrZWQg7ZmV7J24XG4gICAgYWN0aW9ucy5jaGVja0FsbEFncmVlID0gKCkgPT4ge1xuICAgICAgY29uc3QgYWxsQ2hlY2tCdG4gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5hbGwtYWdyZWUtaXRlbSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbiAgICAgIGNvbnN0IGNoZWNrYm94TGlzdCA9IFsuLi4kdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hZ3JlZS1hcmVhIGlucHV0JyldO1xuXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBhbGxDaGVja0J0bi5jaGVja2VkID0gY2hlY2tib3hMaXN0LmV2ZXJ5KChpdGVtKSA9PiBpdGVtLmNoZWNrZWQpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIOyEnOu4jCBjaGVja2JveOydmCBjaGVja2VkIO2ZleyduFxuICAgIGFjdGlvbnMuY2hlY2tBbGxTdWJBZ3JlZSA9ICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICBjb25zdCBhZ3JlZUl0ZW0gPSB0YXJnZXQuY2xvc2VzdCgnLmFncmVlLWl0ZW0nKTtcbiAgICAgIGlmICghYWdyZWVJdGVtKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHN1YkFsbENoZWNrQnRuID0gYWdyZWVJdGVtLnF1ZXJ5U2VsZWN0b3IoJy5zdWItYWxsLWFncmVlIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpO1xuICAgICAgY29uc3Qgc3ViQ2hlY2tib3hMaXN0ID0gWy4uLmFncmVlSXRlbS5xdWVyeVNlbGVjdG9yQWxsKCcuc3ViLWFncmVlLWl0ZW0gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyldO1xuXG4gICAgICBpZiAoIXN1YkFsbENoZWNrQnRuKSByZXR1cm47XG5cbiAgICAgIGlmICh0YXJnZXQgPT09IHN1YkFsbENoZWNrQnRuKSB7XG4gICAgICAgIHN1YkNoZWNrYm94TGlzdC5mb3JFYWNoKChjaGVja2JveCkgPT4ge1xuICAgICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSBzdWJBbGxDaGVja0J0bi5jaGVja2VkO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1YkFsbENoZWNrQnRuLmNoZWNrZWQgPSBzdWJDaGVja2JveExpc3QuZXZlcnkoKGNoZWNrYm94KSA9PiBjaGVja2JveC5jaGVja2VkKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgY29uc3QgeyBhbGxDaGVjaywgc3ViQ2hlY2sgfSA9IHByb3BzO1xuXG4gICAgaWYgKHByb3BzLmNsZWFyKSB7XG4gICAgICBhZGRFdmVudCgnaW5wdXQnLCAnaW5wdXQnLCBhY3Rpb25zLnNob3dDbGVhckJ1dHRvbik7XG4gICAgICBhZGRFdmVudCgnaW5wdXQnLCAndGV4dGFyZWEnLCBhY3Rpb25zLnNob3dDbGVhckJ1dHRvbik7XG4gICAgICBhZGRFdmVudCgnY2xpY2snLCAnLmlucHV0LWZpZWxkLWJ0bi5jbGVhcicsIGFjdGlvbnMuY2xlYXJUZXh0KTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc2VhcmNoKSB7XG4gICAgICBhZGRFdmVudCgnaW5wdXQnLCAnaW5wdXQnLCBhY3Rpb25zLnNlYXJjaEJveCk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0VHlwZSA9PT0gJ3RleHRhcmVhJykge1xuICAgICAgaWYgKHByb3BzLmNvdW50KSBhZGRFdmVudCgnaW5wdXQnLCAndGV4dGFyZWEnLCBhY3Rpb25zLmNoZWNrQnl0ZXMpO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRUeXBlID09PSAndGV4dCcpIHtcbiAgICB9IGVsc2UgaWYgKGlucHV0VHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgaWYgKHByb3BzLnRvZ2dsZVBhc3N3b3JkKSB7XG4gICAgICAgIGFkZEV2ZW50KCdjbGljaycsICcuaW5wdXQtZmllbGQtYnRuLnBhc3N3b3JkLXN0YXRlJywgYWN0aW9ucy50b2dnbGVQYXNzd29yZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpbnB1dFR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgIGlmIChhbGxDaGVjaykge1xuICAgICAgICBhZGRFdmVudCgnY2hhbmdlJywgJy5hbGwtYWdyZWUtaXRlbSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBhY3Rpb25zLmFsbENoZWNrKTtcbiAgICAgICAgYWRkRXZlbnQoJ2NoYW5nZScsICcuYWdyZWUtYXJlYSBpbnB1dCcsIGFjdGlvbnMuY2hlY2tBbGxBZ3JlZSk7XG4gICAgICB9XG4gICAgICBpZiAoc3ViQ2hlY2spIHtcbiAgICAgICAgYWRkRXZlbnQoJ2NoYW5nZScsICcuc3ViLWFncmVlLWl0ZW0gaW5wdXQnLCBhY3Rpb25zLmNoZWNrQWxsU3ViQWdyZWUpO1xuICAgICAgICBhZGRFdmVudCgnY2hhbmdlJywgJy5zdWItYWxsLWFncmVlIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGFjdGlvbnMuY2hlY2tBbGxTdWJBZ3JlZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIC8vIHJlbmRlclxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVuZ3RoKCkge1xuICAgIGlmIChpbnB1dFR5cGUubWF0Y2goL3RleHR8dGV4dGFyZWF8cGFzc3dvcmQvZykpIHtcbiAgICAgIHJldHVybiAkaW5wdXRUYXJnZXQudmFsdWUubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJ5dGVMZW5ndGgoKSB7XG4gICAgaWYgKGlucHV0VHlwZS5tYXRjaCgvdGV4dHx0ZXh0YXJlYXxwYXNzd29yZC9nKSkge1xuICAgICAgcmV0dXJuIGV0VUkudXRpbHMuY291bnRDaGFyYWN0ZXJzKCRpbnB1dFRhcmdldC52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlQ2xlYXJCdXR0b24oKSB7XG4gICAgZXRVSS51dGlscy50cmlnZ2VyRXZlbnQoJGlucHV0VGFyZ2V0LCAnaW5wdXQnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dMb2FkaW5nKGJvb2wgPSB0cnVlKSB7XG4gICAgaWYgKGJvb2wpIHtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmlucHV0LWZpZWxkLWljby5zcGlubmVyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmlucHV0LWZpZWxkLWljby5zcGlubmVyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIC8vIGNhbGxhYmxlXG4gICAgdXBkYXRlLFxuICAgIGdldExlbmd0aCxcbiAgICBnZXRCeXRlTGVuZ3RoLFxuICAgIHVwZGF0ZUNsZWFyQnV0dG9uLFxuICAgIHNob3dMb2FkaW5nLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqIGxvdHRpZVxuICovXG5mdW5jdGlvbiBMb3R0aWUoKSB7XG4gIGNvbnN0IHsgYWN0aW9ucywgcHJvcHMsIHN0YXRlLCBzZXRQcm9wcywgc2V0U3RhdGUsIHNldFRhcmdldCwgYWRkRXZlbnQsIHJlbW92ZUV2ZW50IH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoXG4gICAge1xuICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgICAgc2Nyb2xsOiBmYWxzZSxcbiAgICAgIC8vIHByb3BzXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBzdGF0ZVxuICAgIH0sXG4gICAgcmVuZGVyLFxuICApO1xuXG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IE1BUkdJTiA9IDIwO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnbG90dGllJztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICBsZXQgY29tcG9uZW50ID0ge307XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCAkdGFyZ2V0O1xuICBsZXQgbG90dGllSW5zdGFuY2U7XG5cbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcblxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgLy8gdGVtcGxhdGUsIHNlbGVjdG9yLCBlbGVtZW50LCBhY3Rpb25zXG4gICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIHN0YXRlXG4gICAgLy8gc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG4gICAgLy8gJHRhcmdldC5pbm5lckhUTUwgPSBgYDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7fVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICBsb3R0aWVJbnN0YW5jZSA9IGxvdHRpZS5sb2FkQW5pbWF0aW9uKHtcbiAgICAgIGNvbnRhaW5lcjogJHRhcmdldCwgLy8gdGhlIGRvbSBlbGVtZW50IHRoYXQgd2lsbCBjb250YWluIHRoZSBhbmltYXRpb25cbiAgICAgIHJlbmRlcmVyOiAnc3ZnJyxcbiAgICAgIGxvb3A6IHByb3BzLmxvb3AsXG4gICAgICBhdXRvcGxheTogcHJvcHMuc2Nyb2xsID8gZmFsc2UgOiBwcm9wcy5hdXRvcGxheSxcbiAgICAgIHBhdGg6IGAke2V0VUkuY29uZmlnLmxvdHRpZS5iYXNlUGF0aH0vJHtwcm9wcy5uYW1lfS5qc29uYCwgLy8gdGhlIHBhdGggdG8gdGhlIGFuaW1hdGlvbiBqc29uXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuc2Nyb2xsKSB7XG4gICAgICBTY3JvbGxUcmlnZ2VyLmNyZWF0ZSh7XG4gICAgICAgIHRyaWdnZXI6ICR0YXJnZXQsXG4gICAgICAgIHN0YXJ0OiAndG9wIGJvdHRvbScsXG4gICAgICAgIGVuZDogJ2JvdHRvbSB0b3AnLFxuICAgICAgICBtYXJrZXJzOiB0cnVlLFxuICAgICAgICBvbkVudGVyOiAoKSA9PiB7XG4gICAgICAgICAgbG90dGllSW5zdGFuY2UucGxheSgpO1xuICAgICAgICB9LFxuICAgICAgICBvbkVudGVyQmFjazogKCkgPT4ge1xuICAgICAgICAgIGxvdHRpZUluc3RhbmNlLnBsYXkoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25MZWF2ZTogKCkgPT4ge1xuICAgICAgICAgIGxvdHRpZUluc3RhbmNlLnBhdXNlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTGVhdmVCYWNrOiAoKSA9PiB7XG4gICAgICAgICAgbG90dGllSW5zdGFuY2UucGF1c2UoKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpIHt9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7fVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAvLyByZW5kZXJcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgbG90dGllSW5zdGFuY2UucGxheSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICBsb3R0aWVJbnN0YW5jZS5zdG9wKCk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcblxuICAgIC8vIGNhbGxhYmxlXG4gICAgdXBkYXRlLFxuICAgIHBsYXksXG4gICAgc3RvcCxcbiAgICBnZXRMb3R0aWVJbnN0YW5jZTogKCkgPT4gbG90dGllSW5zdGFuY2UsXG4gIH07XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogIE1vZGFsXG4gKi9cbmZ1bmN0aW9uIE1vZGFsKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIC8vIHByb3BzXG4gICAgICBkaW1tQ2xpY2s6IHRydWUsXG4gICAgICBjbGlja091dHNpZGU6IGZhbHNlLFxuICAgICAgZXNjOiB0cnVlLFxuICAgICAgdHlwZTogJ2RlZmF1bHQnLFxuICAgIH0sXG4gICAge1xuICAgICAgLy8gc3RhdGVcbiAgICB9LFxuICAgIHJlbmRlciwvL1xuICApO1xuXG4gIGNvbnN0IHsgbWVkaWFRdWVyeUFjdGlvbiB9ID0gZXRVSS5ob29rcy51c2VNZWRpYVF1ZXJ5KCk7XG4gIC8vIGNvbnN0YW50XG4gIGNvbnN0IERJTU1fT1BBQ0lUWSA9IGV0VUkuY29uZmlnLmxheWVyLmRpbW1PcGFjaXR5O1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAnbW9kYWwnO1xuICBsZXQgY29tcG9uZW50ID0ge307XG5cbiAgbGV0IGZvY3VzVHJhcEluc3RhbmNlLCBtb2RhbERpbW1TZWxlY3RvciwgbW9kYWxDbG9zZUJ0blNlbGVjdG9yLCBjbGlja091dHNpZGVDbGVhbnVwO1xuICBsZXQgJHRhcmdldCwgJG1vZGFsVGl0bGUsICRtb2RhbENvbnRhaW5lciwgJG1vZGFsRGltbSwgJG1vZGFsQ29udGVudDtcbiAgbGV0IF9jYWxsYmFjaztcblxuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gZm9jdXMgdHJhcFxuICAgIGlmICghJHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlYXJjaCcpKSB7XG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xuICAgICAgICBlc2NhcGVEZWFjdGl2YXRlczogcHJvcHMuZXNjLFxuICAgICAgICBvbkFjdGl2YXRlOiBhY3Rpb25zLmZvY3VzQWN0aXZhdGUsXG4gICAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUsXG4gICAgICAgIGFsbG93T3V0c2lkZUNsaWNrOiBwcm9wcy5jbGlja091dHNpZGUgPyB0cnVlIDogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9jdXNUcmFwSW5zdGFuY2UgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIHN0YXRlXG4gICAgLy8gc2V0U3RhdGUoeyBzdGF0ZTogcHJvcHMuc3RhdGUgfSk7XG5cbiAgICBpZiAoc3RhdGUuc3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgYWN0aW9ucy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVwZGF0ZVxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoX3Byb3BzKSB7XG4gICAgaWYgKF9wcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIC8vICR0YXJnZXQuaW5uZXJIVE1MID0gYGA7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIC8vIHNlbGVjdG9yXG4gICAgbW9kYWxDbG9zZUJ0blNlbGVjdG9yID0gJy5tb2RhbC1jbG9zZSc7XG4gICAgbW9kYWxEaW1tU2VsZWN0b3IgPSAnLm1vZGFsLWRpbW0nO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICRtb2RhbFRpdGxlID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtdGl0Jyk7XG4gICAgJG1vZGFsRGltbSA9ICR0YXJnZXQucXVlcnlTZWxlY3Rvcihtb2RhbERpbW1TZWxlY3Rvcik7XG4gICAgJG1vZGFsQ29udGFpbmVyID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY29udGFpbmVyJyk7XG4gICAgJG1vZGFsQ29udGVudCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsLWNvbnRlbnQnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBzZXQgaWRcbiAgICBjb25zdCBpZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lKTtcbiAgICBjb25zdCB0aXRsZUlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUgKyAnLXRpdCcpO1xuXG4gICAgLy8gYTExeVxuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgJ3JvbGUnLCAnZGlhbG9nJyk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnaWQnLCBpZCk7XG4gICAgaWYgKCRtb2RhbFRpdGxlKSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCRtb2RhbFRpdGxlLCAnaWQnLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdhcmlhLWxhYmVsbGVkYnknLCB0aXRsZUlkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICd0YWJpbmRleCcsICctMScpO1xuXG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgY29uc3QgeyBnZXRUb3BEZXB0aCwgc2V0TGF5ZXJPcGFjaXR5LCBlbmFibGVTY3JvbGxMb2NrLCBkaXNhYmxlU2Nyb2xsTG9jayB9ID0gZXRVSS5ob29rcy51c2VMYXllcigpO1xuXG4gICAgYWN0aW9ucy5mb2N1c0FjdGl2YXRlID0gKCkgPT4geyB9O1xuXG4gICAgYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUgPSAoKSA9PiB7XG4gICAgICBjbG9zZSgpO1xuICAgIH07XG5cbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XG4gICAgICAkdGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgICBzZXRMYXllck9wYWNpdHkoRElNTV9PUEFDSVRZKTtcbiAgICAgIGVuYWJsZVNjcm9sbExvY2soKTtcblxuICAgICAgaWYgKCRtb2RhbERpbW0pIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxEaW1tLCB7IGR1cmF0aW9uOiAwLCBkaXNwbGF5OiAnYmxvY2snLCBvcGFjaXR5OiAwIH0pLnRvKCRtb2RhbERpbW0sIHsgZHVyYXRpb246IDAuMTUsIG9wYWNpdHk6IDEgfSk7XG5cbiAgICAgIGdzYXBcbiAgICAgICAgLnRpbWVsaW5lKClcbiAgICAgICAgLnRvKCRtb2RhbENvbnRhaW5lciwgeyBkdXJhdGlvbjogMCwgZGlzcGxheTogJ2ZsZXgnIH0pXG4gICAgICAgIC50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgIGVhc2U6ICdQb3dlcjIuZWFzZU91dCcsXG4gICAgICAgICAgb25Db21wbGV0ZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudEhlaWdodCA9ICRtb2RhbENvbnRlbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsSGVpZ2h0ID0gJG1vZGFsQ29udGVudC5zY3JvbGxIZWlnaHQ7XG5cbiAgICAgICAgICAgIC8vIGExMXk6IOyKpO2BrOuhpO2VoCDsu6jthZDsuKDqsIAg7J6I7J2EIOqyveyasCB0YWJpbmRleCDstpTqsIBcbiAgICAgICAgICAgIGlmIChjbGllbnRIZWlnaHQgPCBzY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgICAgICAgJG1vZGFsQ29udGVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICRtb2RhbENvbnRlbnQucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICBpZiAoX2NhbGxiYWNrKSB7XG4gICAgICAgIF9jYWxsYmFjaygpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHMuY2xpY2tPdXRzaWRlKSB7XG4gICAgICAgIGNsaWNrT3V0c2lkZUNsZWFudXAgPSB1c2VDbGlja091dHNpZGUoJHRhcmdldCwgKCkgPT4ge1xuICAgICAgICAgIHNldFN0YXRlKHsgc3RhdGU6ICdjbG9zZScgfSk7XG4gICAgICAgIH0sIFtwcm9wcy50cmlnZ2VyQnRuXSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XG4gICAgICBpZiAoY2xpY2tPdXRzaWRlQ2xlYW51cCkge1xuICAgICAgICBjbGlja091dHNpZGVDbGVhbnVwKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGlucHV0IOyeiOydhCDrlYwgdmFsdWXqsJIg7LSI6riw7ZmUXG4gICAgICBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpKSB7XG4gICAgICAgIGNvbnN0IGlucHV0cyA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcbiAgICAgICAgaW5wdXRzLmZvckVhY2goJGlucHV0ID0+IHtcbiAgICAgICAgICAkaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCRtb2RhbERpbW0pIHtcbiAgICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCRtb2RhbERpbW0sIHtcbiAgICAgICAgICBkdXJhdGlvbjogMC4xNSxcbiAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgICAkbW9kYWxEaW1tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGdzYXAudGltZWxpbmUoKS50bygkbW9kYWxDb250YWluZXIsIHtcbiAgICAgICAgZHVyYXRpb246IDAuMTUsXG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIGVhc2U6ICdQb3dlcjIuZWFzZU91dCcsXG4gICAgICAgIG9uQ29tcGxldGUoKSB7XG4gICAgICAgICAgJG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgJHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgICAgc2V0TGF5ZXJPcGFjaXR5KERJTU1fT1BBQ0lUWSk7XG4gICAgICAgICAgZGlzYWJsZVNjcm9sbExvY2soKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCBtb2RhbENsb3NlQnRuU2VsZWN0b3IsIGNsb3NlKTtcblxuICAgIGlmIChwcm9wcy5kaW1tQ2xpY2spIHtcbiAgICAgIGFkZEV2ZW50KCdjbGljaycsIG1vZGFsRGltbVNlbGVjdG9yLCBjbG9zZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGxldCBpc09wZW5lZCA9IHN0YXRlLnN0YXRlID09PSAnb3Blbic7XG4gICAgY29uc3QgeyB0eXBlIH0gPSBwcm9wcztcblxuICAgIGlmIChpc09wZW5lZCkge1xuICAgICAgYWN0aW9ucy5vcGVuKCk7XG4gICAgICBpZiAoZm9jdXNUcmFwSW5zdGFuY2UpIGZvY3VzVHJhcEluc3RhbmNlLmFjdGl2YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICAgIGlmIChmb2N1c1RyYXBJbnN0YW5jZSkgZm9jdXNUcmFwSW5zdGFuY2UuZGVhY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oY2FsbGJhY2spIHtcbiAgICBfY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0pO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG5cbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiZnVuY3Rpb24gU2VsZWN0Qm94KCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIHR5cGU6ICdjdXN0b20nLFxuICAgICAgbGFiZWw6ICcnLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgICBpdGVtczogW10sXG4gICAgICBzZWxlY3RlZEluZGV4OiAwLFxuICAgICAgdHJhbnNpdGlvbjogJ2Zhc3QnLFxuICAgICAgc2Nyb2xsVG86IGZhbHNlLFxuICAgICAgZ3NhcE9wdGlvbjoge30sXG4gICAgICBzdGF0ZTogJ2Nsb3NlJyxcbiAgICB9LFxuICAgIHt9LFxuICAgIHJlbmRlcixcbiAgKTtcbiAgY29uc3QgeyAkdGVtcGxhdGVDdXN0b21IVE1MLCAkdGVtcGxhdGVCYXNpY0hUTUwgfSA9IGV0VUkudGVtcGxhdGVzLnNlbGVjdEJveFRtcGwoKTtcbiAgY29uc3QgeyB1c2VTZWxlY3RTaG93LCBzZWxlY3REaW1tU2hvdywgc2VsZWN0RGltbUNsb3NlIH0gPSBldFVJLmhvb2tzLnVzZVRyYW5zaXRpb24oKTtcblxuICAvLyBjb25zdGFudFxuICBjb25zdCBNQVJHSU4gPSAyMDtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ3NlbGVjdCc7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICBsZXQgJHRhcmdldCxcbiAgICAvLyDsmpTshozqtIDroKgg67OA7IiY65OkXG4gICAgc2VsZWN0TGFiZWwsXG4gICAgc2VsZWN0Q29tYm9Cb3gsXG4gICAgc2VsZWN0TGlzdEJveCxcbiAgICBzZWxlY3RPcHRpb24sXG4gICAgdGltZWxpbmUsXG4gICAgc2VsZWN0Q2xvc2UsXG4gICAgc2VsZWN0RGltbTtcblxuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIF8kdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgJHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXyR0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkdGFyZ2V0ID0gXyR0YXJnZXQ7XG4gICAgfVxuXG4gICAgaWYgKCEkdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBFcnJvcignVGFyZ2V0IGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtbGlzdCcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICAgIHNldHVwVGVtcGxhdGUoKTtcblxuICAgIGlmIChwcm9wcy50eXBlID09PSAnYmFzaWMnKSByZXR1cm47XG5cbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBFbGVtZW50KCk7XG4gICAgc2V0dXBBY3Rpb25zKCk7XG5cbiAgICAvLyBlZmZlY3RcbiAgICB0aW1lbGluZSA9IHVzZVNlbGVjdFNob3coJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdExpc3RCb3gpLCBwcm9wcy50cmFuc2l0aW9uLCBwcm9wcy5nc2FwT3B0aW9uKS50aW1lbGluZTtcblxuICAgIC8vIHN0YXRlXG4gICAgYWN0aW9uc1twcm9wcy5zdGF0ZSB8fCBzdGF0ZS5zdGF0ZV0/LigpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG5cbiAgICBkZXN0cm95KCk7XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIGlmIChwcm9wcy50eXBlID09PSAnYm90dG9tU2hlZXQnKSB7XG4gICAgICAkdGFyZ2V0Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYDxkaXYgY2xhc3M9XCJzZWxlY3QtZGltbVwiPjwvZGl2PmApXG4gICAgfVxuXG4gICAgLy8gb3B0aW9uc+qwkiBzY3JpcHTroZwg64Sj7J2EIOuVjFxuICAgIGlmIChwcm9wcy5pdGVtcy5sZW5ndGggPCAxKSByZXR1cm47XG4gICAgaWYgKHByb3BzLnR5cGUgPT09ICdjdXN0b20nKSB7XG4gICAgICBjb25zdCB7IHNlbGVjdGVkSW5kZXggfSA9IHByb3BzO1xuICAgICAgY29uc3QgaXRlbUxpc3RUZW1wID0gcHJvcHMuaXRlbXMubWFwKChpdGVtKSA9PiAkdGVtcGxhdGVDdXN0b21IVE1MLml0ZW1zKGl0ZW0pKS5qb2luKCcnKTtcblxuICAgICAgJHRhcmdldC5pbm5lckhUTUwgPSBgXG4gICAgICAgICR7cHJvcHMubGFiZWwgJiYgJHRlbXBsYXRlQ3VzdG9tSFRNTC5sYWJlbChwcm9wcy5sYWJlbCl9XG4gICAgICAgICR7cHJvcHMuZGVmYXVsdCA/ICR0ZW1wbGF0ZUN1c3RvbUhUTUwuc2VsZWN0QnRuKHByb3BzLmRlZmF1bHQpIDogJHRlbXBsYXRlQ3VzdG9tSFRNTC5zZWxlY3RCdG4ocHJvcHMuaXRlbXMuZmluZCgoaXRlbSkgPT4gaXRlbS52YWx1ZSA9PSBwcm9wcy5pdGVtc1tzZWxlY3RlZEluZGV4XS52YWx1ZSkudGV4dCl9XG4gICAgICAgICR7cHJvcHMuaXRlbXMgJiYgJHRlbXBsYXRlQ3VzdG9tSFRNTC5pdGVtc1dyYXAoaXRlbUxpc3RUZW1wKX1cbiAgICAgIGA7XG4gICAgfSAgZWxzZSB7XG4gICAgICBjb25zdCBzZWxlY3RCdG5UZW1wID0gJHRlbXBsYXRlQmFzaWNIVE1MLnNlbGVjdEJ0bihwcm9wcy5kZWZhdWx0KTtcbiAgICAgIGNvbnN0IGl0ZW1MaXN0VGVtcCA9IHByb3BzLml0ZW1zLm1hcCgoaXRlbSkgPT4gJHRlbXBsYXRlQmFzaWNIVE1MLml0ZW1zKGl0ZW0pKS5qb2luKCcnKTtcblxuICAgICAgJHRhcmdldC5pbm5lckhUTUwgPSBgXG4gICAgICAgICR7cHJvcHMubGFiZWwgJiYgJHRlbXBsYXRlQmFzaWNIVE1MLmxhYmVsKHByb3BzLmxhYmVsKX1cbiAgICAgICAgJHtwcm9wcy5pdGVtcyAmJiAkdGVtcGxhdGVCYXNpY0hUTUwuaXRlbXNXcmFwKHNlbGVjdEJ0blRlbXAgKyBpdGVtTGlzdFRlbXApfVxuICAgICAgYDtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICBzZWxlY3RMYWJlbCA9ICcuY29tYm8tbGFiZWwnO1xuICAgIHNlbGVjdENvbWJvQm94ID0gJy5zZWxlY3QtYm94JztcbiAgICBzZWxlY3RMaXN0Qm94ID0gJy5zZWxlY3Qtb3B0aW9ucyc7XG4gICAgc2VsZWN0T3B0aW9uID0gJy5vcHRpb24nO1xuICAgIHNlbGVjdERpbW0gPSAnLnNlbGVjdC1kaW1tJztcbiAgICBzZWxlY3RDbG9zZSA9ICcuc2VsZWN0LWNsb3NlJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuICAgIGNvbnN0IGxhYmVsSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgY29tYm9Cb3hJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRCgnY29tYm9ib3gnKTtcbiAgICBjb25zdCBsaXN0Qm94SWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQoJ2xpc3Rib3gnKTtcblxuICAgIC8vIGExMXlcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdExhYmVsLCAnaWQnLCBsYWJlbElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCAnaWQnLCBjb21ib0JveElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCAncm9sZScsICdjb21ib2JveCcpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsICdhcmlhLWxhYmVsbGVkYnknLCBsYWJlbElkKTtcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCAnYXJpYS1jb250cm9scycsIGxpc3RCb3hJZCk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCAnaWQnLCBsaXN0Qm94SWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgJ3JvbGUnLCAnbGlzdGJveCcpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgJ2FyaWEtbGFiZWxsZWRieScsIGxhYmVsSWQpO1xuICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0TGlzdEJveCwgJ3RhYmluZGV4JywgLTEpO1xuXG4gICAgLy8gc2VsZWN0IHByb3BlcnR5XG4gICAgY29uc3Qgb3B0aW9ucyA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RPcHRpb24pO1xuICAgIG9wdGlvbnMuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBvcHRpb25JZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRCgnb3B0aW9uJyk7XG5cbiAgICAgICR0YXJnZXRbaW5kZXhdID0gZWw7XG4gICAgICBlbFsnaW5kZXgnXSA9IGluZGV4O1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdpZCcsIG9wdGlvbklkKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgncm9sZScsICdvcHRpb24nKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcblxuICAgICAgcHJvcHMuaXRlbXNbaW5kZXhdPy5kaXNhYmxlZCAmJiBlbC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJycpO1xuXG4gICAgICBpZiAoISR0YXJnZXRbJ29wdGlvbnMnXSkgJHRhcmdldFsnb3B0aW9ucyddID0gW107XG4gICAgICAkdGFyZ2V0WydvcHRpb25zJ11baW5kZXhdID0gZWw7XG4gICAgfSk7XG5cbiAgICAhcHJvcHMuZGVmYXVsdCAmJiBzZWxlY3RJdGVtKG9wdGlvbnNbcHJvcHMuc2VsZWN0ZWRJbmRleF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGxldCBzZWxlY3RJbmRleCA9IGlzTmFOKCR0YXJnZXQuc2VsZWN0ZWRJbmRleCkgPyAtMSA6ICR0YXJnZXQuc2VsZWN0ZWRJbmRleDtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUluZGV4KHN0YXRlKSB7XG4gICAgICBpZiAoIXN0YXRlKSByZXR1cm47XG4gICAgICBzZWxlY3RJbmRleCA9IGlzTmFOKCR0YXJnZXQuc2VsZWN0ZWRJbmRleCkgPyAtMSA6ICR0YXJnZXQuc2VsZWN0ZWRJbmRleDtcbiAgICAgIHVwZGF0ZUN1cnJlbnRDbGFzcygkdGFyZ2V0W3NlbGVjdEluZGV4XSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGtleUV2ZW50Q2FsbGJhY2soKSB7XG4gICAgICB1cGRhdGVDdXJyZW50Q2xhc3MoJHRhcmdldFtzZWxlY3RJbmRleF0pO1xuICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsICR0YXJnZXRbc2VsZWN0SW5kZXhdLmlkKTtcbiAgICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtzZWxlY3RDb21ib0JveH0gOmxhc3QtY2hpbGRgKS50ZXh0Q29udGVudCA9ICR0YXJnZXRbc2VsZWN0SW5kZXhdLnRleHRDb250ZW50O1xuICAgIH1cbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0Q29tYm9Cb3gpPy5mb2N1cygpO1xuICAgICAgb3BlblN0YXRlKCk7XG4gICAgICB1cGRhdGVJbmRleCh0cnVlKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuY2xvc2UgPSAoKSA9PiB7XG4gICAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7c2VsZWN0Q29tYm9Cb3h9IDpsYXN0LWNoaWxkYCkudGV4dENvbnRlbnQgPSAkdGFyZ2V0WydvcHRpb25zJ11bJHRhcmdldC5zZWxlY3RlZEluZGV4XT8udGV4dENvbnRlbnQgPz8gcHJvcHMuZGVmYXVsdDtcbiAgICAgIGNsb3NlU3RhdGUoKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudCcpO1xuICAgICAgc2VsZWN0SXRlbShjdXJyZW50RWwpO1xuICAgICAgY2xvc2VTdGF0ZSgpO1xuICAgIH07XG4gICAgYWN0aW9ucy5maXJzdCA9ICgpID0+IHtcbiAgICAgIHNlbGVjdEluZGV4ID0gMDtcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcbiAgICB9O1xuICAgIGFjdGlvbnMubGFzdCA9ICgpID0+IHtcbiAgICAgIHNlbGVjdEluZGV4ID0gJHRhcmdldFsnb3B0aW9ucyddLmxlbmd0aCAtIDE7XG4gICAgICBrZXlFdmVudENhbGxiYWNrKCk7XG4gICAgfTtcbiAgICBhY3Rpb25zLnVwID0gKCkgPT4ge1xuICAgICAgc2VsZWN0SW5kZXggPSBNYXRoLm1heCgtLXNlbGVjdEluZGV4LCAwKTtcbiAgICAgIGtleUV2ZW50Q2FsbGJhY2soKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZG93biA9ICgpID0+IHtcbiAgICAgIHNlbGVjdEluZGV4ID0gTWF0aC5taW4oKytzZWxlY3RJbmRleCwgJHRhcmdldFsnb3B0aW9ucyddLmxlbmd0aCAtIDEpO1xuICAgICAga2V5RXZlbnRDYWxsYmFjaygpO1xuICAgIH07XG5cbiAgICBjb21wb25lbnQub3BlbiA9IGFjdGlvbnMub3BlbjtcbiAgICBjb21wb25lbnQuY2xvc2UgPSBhY3Rpb25zLmNsb3NlO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgaWYgKHByb3BzLnR5cGUgPT09ICdiYXNpYycgfHwgJHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3NlbGVjdC1kaXNhYmxlZCcpKSByZXR1cm47XG5cbiAgICAvLyBhMTF5XG4gICAgY29uc3QgYWN0aW9uTGlzdCA9IHtcbiAgICAgIHVwOiBbJ0Fycm93VXAnXSxcbiAgICAgIGRvd246IFsnQXJyb3dEb3duJ10sXG4gICAgICBmaXJzdDogWydIb21lJywgJ1BhZ2VVcCddLFxuICAgICAgbGFzdDogWydFbmQnLCAnUGFnZURvd24nXSxcbiAgICAgIGNsb3NlOiBbJ0VzY2FwZSddLFxuICAgICAgc2VsZWN0OiBbJ0VudGVyJywgJyAnXSxcbiAgICB9O1xuXG4gICAgYWRkRXZlbnQoJ2JsdXInLCBzZWxlY3RDb21ib0JveCwgKGUpID0+IHtcbiAgICAgIGlmIChlLnJlbGF0ZWRUYXJnZXQ/LnJvbGUgPT09ICdsaXN0Ym94JykgcmV0dXJuO1xuICAgICAgYWN0aW9ucy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgc2VsZWN0Q29tYm9Cb3gsICh7IHRhcmdldCB9KSA9PiB7XG4gICAgICBjb25zdCB0b2dnbGVTdGF0ZSA9IHN0YXRlLnN0YXRlID09PSAnb3BlbicgPyAnY2xvc2UnIDogJ29wZW4nO1xuICAgICAgYWN0aW9uc1t0b2dnbGVTdGF0ZV0/LigpO1xuICAgIH0pO1xuXG4gICAgLy8gYTExeVxuICAgIGFkZEV2ZW50KCdrZXlkb3duJywgc2VsZWN0Q29tYm9Cb3gsIChlKSA9PiB7XG4gICAgICBpZiAoc3RhdGUuc3RhdGUgPT09ICdjbG9zZScpIHJldHVybjtcblxuICAgICAgY29uc3QgeyBrZXkgfSA9IGU7XG4gICAgICBjb25zdCBhY3Rpb24gPSBPYmplY3QuZW50cmllcyhhY3Rpb25MaXN0KS5maW5kKChbXywga2V5c10pID0+IGtleXMuaW5jbHVkZXMoa2V5KSk7XG5cbiAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBbYWN0aW9uTmFtZV0gPSBhY3Rpb247XG4gICAgICAgIGFjdGlvbnNbYWN0aW9uTmFtZV0/LigpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgc2VsZWN0TGlzdEJveCwgKHsgdGFyZ2V0IH0pID0+IHtcbiAgICAgIGlmICh0YXJnZXQucm9sZSAhPT0gJ29wdGlvbicpIHJldHVybjtcbiAgICAgIHVwZGF0ZUN1cnJlbnRDbGFzcyh0YXJnZXQpO1xuICAgICAgYWN0aW9ucy5zZWxlY3QoKTtcbiAgICB9KTtcblxuICAgIC8vIOuwlO2FgCDsi5ztirgg7YOA7J6F7J2865WMIGRpbW0sIGNsb3NlIOuyhO2KvCDriIzroIDsnYQg65WMIOuLq+2emFxuICAgIGlmIChwcm9wcy50eXBlID09PSAnYm90dG9tU2hlZXQnKSB7XG4gICAgICBhZGRFdmVudCgnY2xpY2snLCBzZWxlY3REaW1tLCBhY3Rpb25zLmNsb3NlKVxuICAgICAgYWRkRXZlbnQoJ2NsaWNrJywgc2VsZWN0Q2xvc2UsIGFjdGlvbnMuY2xvc2UpXG4gICAgfVxuXG4gICAgZXRVSS5ob29rcy51c2VFdmVudExpc3RlbmVyKHdpbmRvdywgJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIGFjdGlvbnMuY2xvc2UoKTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIGNvbnN0IGlzT3BlbmVkID0gc3RhdGUuc3RhdGUgPT09ICdvcGVuJztcbiAgICBwcm9wcy50cmFuc2l0aW9uICYmIHRpbWVsaW5lKGlzT3BlbmVkKTtcbiAgICBjaGVja09wZW5EaXIoaXNPcGVuZWQpO1xuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBzZWxlY3RDb21ib0JveCwgJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW5lZCk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKTtcbiAgICBpZiAoaXNPcGVuZWQpIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgc2VsZWN0Q29tYm9Cb3gsICdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBzZWxlY3RlZEVsPy5pZCA/PyAnJyk7XG4gICAgZWxzZSBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94LCAnYXJpYS1hY3RpdmVkZXNjZW5kYW50JywgJycpO1xuICB9XG5cbiAgLy8gY3VzdG9tXG4gIGZ1bmN0aW9uIGNoZWNrT3BlbkRpcihzdGF0ZSkge1xuICAgIGlmICghc3RhdGUgfHwgcHJvcHMuc2Nyb2xsVG8pIHJldHVybjsgLy8gZmFsc2XsnbTqsbDrgpggc2Nyb2xsVG8g6riw64qlIOyeiOydhCDrlYwgLSDslYTrnpjroZwg7Je066a8XG5cbiAgICBjb25zdCB7IGhlaWdodDogbGlzdEhlaWdodCB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KCR0YXJnZXQsIHNlbGVjdExpc3RCb3gpO1xuICAgIGNvbnN0IHsgaGVpZ2h0OiBjb21ib0hlaWdodCwgYm90dG9tOiBjb21ib0JvdHRvbSB9ID0gZXRVSS5ob29rcy51c2VHZXRDbGllbnRSZWN0KCR0YXJnZXQsIHNlbGVjdENvbWJvQm94KTtcbiAgICBjb25zdCByb2xlID0gd2luZG93LmlubmVySGVpZ2h0IC0gTUFSR0lOIDwgY29tYm9Cb3R0b20gKyBsaXN0SGVpZ2h0O1xuXG4gICAgZXRVSS51dGlscy5zZXRTdHlsZSgkdGFyZ2V0LCBzZWxlY3RMaXN0Qm94LCAnYm90dG9tJywgcm9sZSA/IGNvbWJvSGVpZ2h0ICsgJ3B4JyA6ICcnKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSAuY3VycmVudCBjbGFzc1xuICBmdW5jdGlvbiB1cGRhdGVDdXJyZW50Q2xhc3MoYWRkQ2xhc3NFbCkge1xuICAgICR0YXJnZXQucXVlcnlTZWxlY3RvcignLmN1cnJlbnQnKT8uY2xhc3NMaXN0LnJlbW92ZSgnY3VycmVudCcpO1xuICAgIGFkZENsYXNzRWw/LmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQnKTtcbiAgfVxuXG4gIC8vIHNlbGVjdCBpdGVtXG4gIGZ1bmN0aW9uIHNlbGVjdEl0ZW0odGFyZ2V0KSB7XG4gICAgY29uc3QgdGFyZ2V0T3B0aW9uID0gdGFyZ2V0Py5jbG9zZXN0KHNlbGVjdE9wdGlvbik7XG5cbiAgICBpZiAoIXRhcmdldE9wdGlvbikgcmV0dXJuO1xuXG4gICAgJHRhcmdldC5zZWxlY3RlZEluZGV4ID0gdGFyZ2V0T3B0aW9uWydpbmRleCddO1xuICAgICR0YXJnZXQudmFsdWUgPSB0YXJnZXRPcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJyk7XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsICdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nLCAnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICB0YXJnZXRPcHRpb24uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSk7XG5cbiAgICB1cGRhdGVDdXJyZW50Q2xhc3MoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKSk7XG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3NlbGVjdENvbWJvQm94fSA6bGFzdC1jaGlsZGApLnRleHRDb250ZW50ID0gdGFyZ2V0T3B0aW9uLnRleHRDb250ZW50O1xuICB9XG5cbiAgLy8gc2VsZWN0IHN0YXRlXG4gIGZ1bmN0aW9uIG9wZW5TdGF0ZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnb3BlbicgfSk7XG4gICAgcHJvcHMudHlwZSA9PT0gJ2JvdHRvbVNoZWV0JyAmJiBzZWxlY3REaW1tU2hvdygkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0RGltbSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VTdGF0ZSgpIHtcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiAnY2xvc2UnIH0pO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IG51bGw7XG4gICAgcHJvcHMudHlwZSA9PT0gJ2JvdHRvbVNoZWV0JyAmJiBzZWxlY3REaW1tQ2xvc2UoJHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdERpbW0pKTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBzdGF0ZSxcbiAgICAgIHByb3BzLFxuXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgICBzZWxlY3RJdGVtLFxuICB9O1xuXG4gIHJldHVybiBjb21wb25lbnQ7XG59XG4iLCIvKipcbiAqIFN3aXBlckNvbXBcbiAqL1xuZnVuY3Rpb24gU3dpcGVyQ29tcCgpIHtcbiAgY29uc3QgeyBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFN0YXRlLCBzZXRQcm9wcywgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQgfSA9IGV0VUkuaG9va3MudXNlQ29yZShcbiAgICB7XG4gICAgICBsb29wOiBmYWxzZSxcbiAgICAgIG9ic2VydmVyOiB0cnVlLFxuICAgICAgLy8gdXBkYXRlT25XaW5kb3dSZXNpemU6IGZhbHNlLFxuICAgICAgb246IHtcbiAgICAgICAgc2xpZGVDaGFuZ2VUcmFuc2l0aW9uRW5kKCkge1xuICAgICAgICAgIHNldFN0YXRlKHsgYWN0aXZlSW5kZXg6IHRoaXMucmVhbEluZGV4ICsgMSB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBzdGF0ZTogJycsXG4gICAgICBydW5uaW5nOiAnJyxcbiAgICAgIGFjdGl2ZUluZGV4OiAwLFxuICAgIH0sXG4gICAgcmVuZGVyLFxuICApO1xuXG4gIC8qKlxuICAgKiBkYXRhLXByb3BzIOumrOyKpO2KuFxuICAgKi9cblxuICAvLyBjb25zdGFudFxuICBjb25zdCBNQVJHSU4gPSAyMDtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ3N3aXBlcic7XG4gIGxldCBjb21wb25lbnQgPSB7fSxcbiAgICBjbGFzc05hbWUgPSAnJztcbiAgLy8gZWxlbWVudCwgc2VsZWN0b3JcbiAgbGV0ICR0YXJnZXQsICRzd2lwZXIsICRzd2lwZXJOYXZpZ2F0aW9uLCAkc3dpZXByUHJvZ3Jlc3M7XG4gIGxldCBzd2lwZXJCdXR0b25QcmV2LCBzd2lwZXJCdXR0b25OZXh0LCBzd2lwZXJQYWdpbmF0aW9uLCBzd2lwZXJBdXRvcGxheSwgJHN3aXBlclNsaWRlVG9CdXR0b247XG4gIGxldCBleGNlcHRpb25DbGFzc05hbWUsIHN3aXBlckxlbmd0aCwgc3dpcGVyUGVyVmlldztcblxuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG5cbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG5cbiAgICBpZiAoJHRhcmdldC51aSkgcmV0dXJuO1xuICAgICR0YXJnZXQudWkgPSBjb21wb25lbnQ7XG5cbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICAvLyB0ZW1wbGF0ZSwgc2VsZWN0b3IsIGVsZW1lbnQsIGFjdGlvbnNcbiAgICBzZXR1cFNlbGVjdG9yKCk7XG4gICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gc3RhdGVcbiAgICBzZXRTdGF0ZSh7IHN0YXRlOiBwcm9wcy5zdGF0ZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChwcm9wcyAmJiBldFVJLnV0aWxzLnNoYWxsb3dDb21wYXJlKHByb3BzLCBfcHJvcHMpICYmICEkdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0JykpIHJldHVybjtcbiAgICBkZXN0cm95KCk7XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcbiAgICBzZXRQcm9wcyh7IC4uLnByb3BzLCAuLi5fcHJvcHMgfSk7XG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVFdmVudCgpO1xuICAgICR0YXJnZXQudWkgPSBudWxsO1xuICAgICR0YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWluaXQnKTtcbiAgfVxuXG4gIC8vIGZyZXF1ZW5jeVxuICBmdW5jdGlvbiBzZXR1cFRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHsgbmF2aWdhdGlvbiwgcGFnaW5hdGlvbiwgcGFnaW5hdGlvblR5cGUsIHBhZ2luYXRpb25DbGFzcywgbmF2aWdhdGlvbkNsYXNzICxhdXRvcGxheSwgZnJlZU1vZGUsIGluZGljYXRvclRleHRzIH0gPSBwcm9wczsgLy8gQWRkIGluZGljYXRvclRleHRzIGhlcmVcbiAgICBjb25zdCB7ICR0ZW1wbGF0ZUhUTUwgfSA9IGV0VUkudGVtcGxhdGVzLnN3aXBlclRtcGwoKTtcbiAgICBsZXQgc3dpcGVyQ29udHJvbHM7XG5cbiAgICBjb25zdCAkc3dpcGVyQ29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAkc3dpcGVyQ29udHJvbHMuY2xhc3NMaXN0LmFkZCgnc3dpcGVyLWNvbnRyb2xzJyk7XG5cbiAgICBpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLWNvbnRyb2xzJykpIHtcbiAgICAgIHN3aXBlckNvbnRyb2xzID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLWNvbnRyb2xzJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXBlckNvbnRyb2xzID0gJHN3aXBlckNvbnRyb2xzO1xuICAgICAgJHRhcmdldC5hcHBlbmRDaGlsZChzd2lwZXJDb250cm9scyk7XG4gICAgfVxuXG4gICAgaWYgKCR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZScpLmxlbmd0aCA8IDIgJiYgISR0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmbG93JykpIHtcbiAgICAgIHN3aXBlckNvbnRyb2xzLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgc3dpcGVyQ29udHJvbHMuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuYXZpZ2F0aW9uKSB7XG4gICAgICBzd2lwZXJDb250cm9scy5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICR0ZW1wbGF0ZUhUTUwubmF2aWdhdGlvbihuYXZpZ2F0aW9uQ2xhc3MpKTtcbiAgICAgIC8vIGlmICh0eXBlb2YgbmF2aWdhdGlvbiA9PT0gJ2Jvb2xlYW4nICYmICEkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyQnV0dG9uUHJldikgJiYgISR0YXJnZXQucXVlcnlTZWxlY3Rvcihzd2lwZXJCdXR0b25OZXh0KSkge1xuICAgICAgLy8gICBzd2lwZXJDb250cm9scy5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICR0ZW1wbGF0ZUhUTUwubmF2aWdhdGlvbihuYXZpZ2F0aW9uQ2xhc3MpKTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gaWYgKG5hdmlnYXRpb24gPT09ICdleGNlcHRpb24nKSB7XG4gICAgICAvLyAgIGNvbnN0IGV4Y2VwdGlvbkNvbnRyb2wgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGV4Y2VwdGlvbkNsYXNzTmFtZSk7XG4gICAgICAvLyAgIHNldFByb3BzKHtcbiAgICAgIC8vICAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICAvLyAgICAgICBwcmV2RWw6IGV4Y2VwdGlvbkNvbnRyb2wucXVlcnlTZWxlY3Rvcihzd2lwZXJCdXR0b25QcmV2KSxcbiAgICAgIC8vICAgICAgIG5leHRFbDogZXhjZXB0aW9uQ29udHJvbC5xdWVyeVNlbGVjdG9yKHN3aXBlckJ1dHRvbk5leHQpLFxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vICAgc2V0UHJvcHMoe1xuICAgICAgLy8gICAgIG5hdmlnYXRpb246IHtcbiAgICAgIC8vICAgICAgIHByZXZFbDogJHRhcmdldC5xdWVyeVNlbGVjdG9yKHN3aXBlckJ1dHRvblByZXYpLFxuICAgICAgLy8gICAgICAgbmV4dEVsOiAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyQnV0dG9uTmV4dCksXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyB9XG4gICAgfVxuXG4gICAgaWYgKGZyZWVNb2RlKSB7XG4gICAgICBzZXRQcm9wcyh7XG4gICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChwYWdpbmF0aW9uKSB7XG4gICAgICAhJHRhcmdldC5xdWVyeVNlbGVjdG9yKHN3aXBlclBhZ2luYXRpb24pICYmIHN3aXBlckNvbnRyb2xzLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgJHRlbXBsYXRlSFRNTC5wYWdpbmF0aW9uKHBhZ2luYXRpb25DbGFzcykpO1xuICAgICAgc2V0UHJvcHMoe1xuICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgZWw6ICR0YXJnZXQucXVlcnlTZWxlY3Rvcihzd2lwZXJQYWdpbmF0aW9uKSxcbiAgICAgICAgICB0eXBlOiBwYWdpbmF0aW9uVHlwZSA/IHBhZ2luYXRpb25UeXBlIDogJ2ZyYWN0aW9uJyxcbiAgICAgICAgICBjbGlja2FibGU6IHBhZ2luYXRpb25UeXBlID09PSAnYnVsbGV0cycgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYXV0b3BsYXkpIHtcbiAgICAgICEkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3Ioc3dpcGVyQXV0b3BsYXkpICYmIHN3aXBlckNvbnRyb2xzLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgJHRlbXBsYXRlSFRNTC5hdXRvcGxheSgpKTtcbiAgICB9XG5cbiAgICBpZiAoaW5kaWNhdG9yVGV4dHMgJiYgaW5kaWNhdG9yVGV4dHMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gQWRkIGluZGljYXRvcnMgc2V0dXAgaGVyZVxuICAgICAgY29uc3QgaW5kaWNhdG9yVGV4dHMgPSBKU09OLnBhcnNlKCR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXByb3BzLWluZGljYXRvci10ZXh0cycpIHx8ICdbXScpO1xuICAgICAgY29uc3QgaW5kaWNhdG9yc0hUTUwgPSBgPGRpdiBjbGFzcz1cInN3aXBlci1pbmRpY2F0b3JzXCI+PC9kaXY+YDtcbiAgICAgICR0YXJnZXQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBpbmRpY2F0b3JzSFRNTCk7XG4gICAgICBjb25zdCBpbmRpY2F0b3JzRWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItaW5kaWNhdG9ycycpO1xuICAgICAgc2V0UHJvcHMoe1xuICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgZWw6IGluZGljYXRvcnNFbCxcbiAgICAgICAgICBjbGlja2FibGU6IHRydWUsXG4gICAgICAgICAgcmVuZGVyQnVsbGV0OiBmdW5jdGlvbiAoaW5kZXgsIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc05hbWUgKyAnXCI+JyArIGluZGljYXRvclRleHRzW2luZGV4XSArICc8L3NwYW4+JztcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYnJlYWtwb2ludHNcbiAgICBpZiAocHJvcHMuYnJlYWtwb2ludHMpIHtcbiAgICAgIGNvbnN0ICRicmVha3BvaW50cyA9IE9iamVjdC52YWx1ZXMocHJvcHMuYnJlYWtwb2ludHMpWzBdO1xuICAgICAgY29uc3QgJGtleSA9IE9iamVjdC5rZXlzKCRicmVha3BvaW50cyk7XG4gICAgICBjb25zdCAkdmFsdWUgPSBPYmplY3QudmFsdWVzKCRicmVha3BvaW50cyk7XG5cbiAgICAgIGNvbnN0IG5ld0JyZWFrcG9pbnRzID0ge307XG5cbiAgICAgICRrZXkuZm9yRWFjaCgoX2tleSwgaWR4KSA9PiB7XG4gICAgICAgIGlmICghaXNOYU4oTnVtYmVyKCR2YWx1ZVtpZHhdKSkpIHtcbiAgICAgICAgICBuZXdCcmVha3BvaW50c1tfa2V5XSA9IE51bWJlcigkdmFsdWVbaWR4XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3QnJlYWtwb2ludHNbX2tleV0gPSAkdmFsdWVbaWR4XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNldFByb3BzKHtcbiAgICAgICAgYnJlYWtwb2ludHM6IHtcbiAgICAgICAgICAxMDI0OiB7IC4uLm5ld0JyZWFrcG9pbnRzIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cFNlbGVjdG9yKCkge1xuICAgIHN3aXBlclBhZ2luYXRpb24gPSAnLnN3aXBlci1wYWdpbmF0aW9uJztcbiAgICBzd2lwZXJCdXR0b25QcmV2ID0gJy5zd2lwZXItYnV0dG9uLXByZXYnO1xuICAgIHN3aXBlckJ1dHRvbk5leHQgPSAnLnN3aXBlci1idXR0b24tbmV4dCc7XG4gICAgc3dpcGVyQXV0b3BsYXkgPSAnLnN3aXBlci1hdXRvcGxheSc7XG4gICAgZXhjZXB0aW9uQ2xhc3NOYW1lID0gJHRhcmdldD8uZGF0YXNldD8uZXhjZXB0aW9uQ2xhc3M7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gaWRcblxuICAgIC8vIGExMXlcblxuICAgIC8vIG5ldyBTd2lwZXIg7IOd7ISxXG4gICAgJHN3aXBlciA9IG5ldyBTd2lwZXIoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLWNvbnRhaW5lcicpLCB7IC4uLnByb3BzIH0pO1xuXG4gICAgJHN3aXBlck5hdmlnYXRpb24gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItbmF2aWdhdGlvbicpO1xuICAgICRzd2llcHJQcm9ncmVzcyA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignLnN3aXBlci1wcm9ncmVzcycpO1xuXG4gICAgc3dpcGVyTGVuZ3RoID0gJHN3aXBlci5zbGlkZXMubGVuZ3RoO1xuICAgIHN3aXBlclBlclZpZXcgPSAkc3dpcGVyLnBhcmFtcy5zbGlkZXNQZXJWaWV3O1xuXG4gICAgaWYgKHN3aXBlckxlbmd0aCA8PSBzd2lwZXJQZXJWaWV3KSB7XG4gICAgICBpZiAoJHN3aXBlck5hdmlnYXRpb24pICRzd2lwZXJOYXZpZ2F0aW9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBpZiAoJHN3aWVwclByb2dyZXNzKSAkc3dpZXByUHJvZ3Jlc3Muc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEFjdGlvbnMoKSB7XG4gICAgLy8gYWN0aW9ucy5zdGFydCA9ICgpID0+IHtcbiAgICAvLyAgIHBsYXkoKTtcbiAgICAvLyB9O1xuICAgIC8vXG4gICAgLy8gYWN0aW9ucy5zdG9wID0gKCkgPT4ge1xuICAgIC8vICAgc3RvcCgpO1xuICAgIC8vIH07XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFdmVudCgpIHtcbiAgICAvLyBhdXRvcGxheSDrsoTtirxcbiAgICBpZiAocHJvcHMuYXV0b3BsYXkpIHtcbiAgICAgIGFkZEV2ZW50KCdjbGljaycsIHN3aXBlckF1dG9wbGF5LCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgJGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc3dpcGVyQXV0b3BsYXkpO1xuICAgICAgICBoYW5kbGVBdXRvcGxheSgkZXZlbnRUYXJnZXQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIC8vIHJlbmRlclxuICB9XG5cbiAgLy8gYXV0b3BsYXkg6rSA66CoIOy7pOyKpO2FgCDtlajsiJhcbiAgZnVuY3Rpb24gaGFuZGxlQXV0b3BsYXkoJHRhcmdldCkge1xuICAgICR0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgncGxheScpO1xuICAgICR0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnc3RvcCcpO1xuXG4gICAgaWYgKCR0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdG9wJykpIHtcbiAgICAgIHN0b3AoKTtcbiAgICB9IGVsc2UgaWYgKCR0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwbGF5JykpIHtcbiAgICAgIHBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5KCkge1xuICAgICRzd2lwZXIuYXV0b3BsYXkuc3RhcnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgJHN3aXBlci5hdXRvcGxheS5zdG9wKCk7XG4gIH1cblxuICAvLyDtirnsoJUg7Iqs65287J2065Oc66GcIOydtOuPmVxuICAvLyBmdW5jdGlvbiBtb3ZlVG9TbGlkZShpbmRleCwgc3BlZWQsIHJ1bkNhbGxiYWNrcykge1xuICAvLyAgIGlmIChwcm9wcy5sb29wKSB7XG4gIC8vICAgICAkc3dpcGVyLnNsaWRlVG9Mb29wKGluZGV4LCBzcGVlZCwgcnVuQ2FsbGJhY2tzKTtcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgJHN3aXBlci5zbGlkZVRvKGluZGV4KTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICAvLyBjYWxsYWJsZVxuICAgIHVwZGF0ZSxcbiAgICBwbGF5LFxuICAgIHN0b3AsXG4gICAgaGFuZGxlQXV0b3BsYXksXG4gICAgZ2V0U3dpcGVySW5zdGFuY2UoKSB7XG4gICAgICByZXR1cm4gJHN3aXBlcjsgLy8gJHN3aXBlciDsnbjsiqTthLTsiqQg67CY7ZmYXG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiLyoqXG4gKiBUYWJcbiAqL1xuZnVuY3Rpb24gVGFiKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIC8vIHByb3BzXG4gICAgfSxcbiAgICB7XG4gICAgICAvLyBzdGF0ZVxuICAgIH0sXG4gICAgcmVuZGVyLFxuICApO1xuXG4gIC8vIHZhcmlhYmxlXG4gIGNvbnN0IG5hbWUgPSAndGFiJztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICBsZXQgY29tcG9uZW50ID0ge307XG4gIC8vIGVsZW1lbnQsIHNlbGVjdG9yXG4gIGxldCAkdGFyZ2V0LCB0YWJIZWFkLCAkdGFiSGVhZEVsLCB0YWJCdG4sICR0YWJCdG5FbCwgdGFiQ29udGVudCwgJHRhYkNvbnRlbnRFbDtcblxuICAvKipcbiAgICogaW5pdFxuICAgKiBAcGFyYW0gXyR0YXJnZXRcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gaW5pdChfJHRhcmdldCwgX3Byb3BzKSB7XG4gICAgaWYgKHR5cGVvZiBfJHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmICghJHRhcmdldCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RhcmdldCBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCk7XG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuXG4gICAgaWYgKCR0YXJnZXQudWkpIHJldHVybjtcbiAgICAkdGFyZ2V0LnVpID0gY29tcG9uZW50O1xuXG4gICAgc2V0dXAoKTtcbiAgICBzZXRFdmVudCgpO1xuXG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcsICd0cnVlJyk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICBzZXR1cFRlbXBsYXRlKCk7XG4gICAgc2V0dXBTZWxlY3RvcigpO1xuICAgIHNldHVwRWxlbWVudCgpO1xuICAgIHNldHVwQWN0aW9ucygpO1xuXG4gICAgLy8gZWZmZWN0XG4gICAgcHJvcHMuc3RpY2t5ICYmIHN0aWNreVRhYigpO1xuXG4gICAgLy8gc3RhdGVcbiAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiBzdGF0ZS5hY3RpdmUgPz8gJHRhYkJ0bkVsWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS10YWItdmFsdWUnKSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGVcbiAgICogQHBhcmFtIF9wcm9wc1xuICAgKi9cbiAgZnVuY3Rpb24gdXBkYXRlKF9wcm9wcykge1xuICAgIGlmIChfcHJvcHMgJiYgZXRVSS51dGlscy5zaGFsbG93Q29tcGFyZShwcm9wcywgX3Byb3BzKSAmJiAhJHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpKSByZXR1cm47XG4gICAgZGVzdHJveSgpO1xuXG4gICAgc2V0UHJvcHMoeyAuLi5wcm9wcywgLi4uX3Byb3BzIH0pO1xuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlRXZlbnQoKTtcbiAgICAkdGFyZ2V0LnVpID0gbnVsbDtcbiAgICAkdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbml0Jyk7XG4gIH1cblxuICAvLyBmcmVxdWVuY3lcbiAgZnVuY3Rpb24gc2V0dXBUZW1wbGF0ZSgpIHtcbiAgICAvLyAkdGFyZ2V0LmlubmVySFRNTCA9IGBgO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBTZWxlY3RvcigpIHtcbiAgICAvLyBzZWxlY3RvclxuICAgIHRhYkhlYWQgPSAnLnRhYi1oZWFkJztcbiAgICB0YWJCdG4gPSAnLnRhYi1sYWJlbCc7XG4gICAgdGFiQ29udGVudCA9ICcudGFiLWNvbnRlbnQnO1xuXG4gICAgLy8gZWxlbWVudFxuICAgICR0YWJIZWFkRWwgPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IodGFiSGVhZCk7XG4gICAgJHRhYkJ0bkVsID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHRhYkJ0bik7XG4gICAgJHRhYkNvbnRlbnRFbCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvckFsbCh0YWJDb250ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudCgpIHtcbiAgICAvLyBpZFxuICAgIC8vIGExMXlcbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0YXJnZXQsIHRhYkhlYWQsICdyb2xlJywgJ3RhYmxpc3QnKTtcblxuICAgIC8vIGNvbXBvbmVudCBjdXN0b20gZWxlbWVudFxuICAgICR0YWJIZWFkRWwuc3R5bGUudG91Y2hBY3Rpb24gPSAnbm9uZSc7XG4gICAgJHRhYkJ0bkVsLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHRhYkJ0bklkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgICAgY29uc3QgdGFiQ29udGVudElkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKCd0YWJwYW5lbCcpO1xuXG4gICAgICB0YWIuc2V0QXR0cmlidXRlKCdpZCcsIHRhYkJ0bklkKTtcbiAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFiJyk7XG4gICAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuXG4gICAgICBpZiAoJHRhYkNvbnRlbnRFbFtpbmRleF0pIHtcbiAgICAgICAgJHRhYkNvbnRlbnRFbFtpbmRleF0uc2V0QXR0cmlidXRlKCdpZCcsIHRhYkNvbnRlbnRJZCk7XG4gICAgICAgICR0YWJDb250ZW50RWxbaW5kZXhdLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJwYW5lbCcpO1xuXG4gICAgICAgIGNvbnN0IHRhYkNvbnRlbnRWYWx1ZSA9ICR0YWJDb250ZW50RWxbaW5kZXhdLmdldEF0dHJpYnV0ZSgnZGF0YS10YWItdmFsdWUnKTtcbiAgICAgICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBgJHt0YWJCdG59W2RhdGEtdGFiLXZhbHVlPVwiJHt0YWJDb250ZW50VmFsdWV9XCJdYCwgJ2FyaWEtY29udHJvbHMnLCAkdGFiQ29udGVudEVsW2luZGV4XS5pZCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRhYlZhbHVlID0gdGFiLmdldEF0dHJpYnV0ZSgnZGF0YS10YWItdmFsdWUnKTtcbiAgICAgIGV0VUkudXRpbHMuc2V0UHJvcGVydHkoJHRhcmdldCwgYCR7dGFiQ29udGVudH1bZGF0YS10YWItdmFsdWU9XCIke3RhYlZhbHVlfVwiXWAsICdhcmlhLWxhYmVsbGVkYnknLCB0YWIuaWQpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGxldCBzdGFydFggPSAwO1xuICAgIGxldCBlbmRYID0gMDtcbiAgICBsZXQgbW92ZVggPSAwO1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gMDtcbiAgICBsZXQgaXNSZWFkeU1vdmUgPSBmYWxzZTtcbiAgICBsZXQgY2xpY2thYmxlID0gdHJ1ZTtcblxuICAgIGFjdGlvbnMuc2VsZWN0ID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCB0YXJnZXRCdG4gPSBlLnRhcmdldC5jbG9zZXN0KHRhYkJ0bik7XG4gICAgICBpZiAoIXRhcmdldEJ0bikgcmV0dXJuO1xuICAgICAgaWYgKCFjbGlja2FibGUpIHJldHVybjtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IHRhcmdldEJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiLXZhbHVlJykgfSk7XG4gICAgICBnc2FwLnRvKCR0YWJIZWFkRWwsIHtcbiAgICAgICAgZHVyYXRpb246IDAuNSxcbiAgICAgICAgc2Nyb2xsTGVmdDogdGFyZ2V0QnRuLm9mZnNldExlZnQgLSAyNCxcbiAgICAgICAgb3ZlcndyaXRlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFjdGlvbnMuZHJhZ1N0YXJ0ID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoaXNSZWFkeU1vdmUpIHJldHVybjtcbiAgICAgIGlzUmVhZHlNb3ZlID0gdHJ1ZTtcbiAgICAgIHN0YXJ0WCA9IGUueDtcbiAgICAgIHNjcm9sbExlZnQgPSAkdGFiSGVhZEVsLnNjcm9sbExlZnQ7XG4gICAgfTtcbiAgICBhY3Rpb25zLmRyYWdNb3ZlID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XG4gICAgICBtb3ZlWCA9IGUueDtcbiAgICAgICR0YWJIZWFkRWwuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQgKyAoc3RhcnRYIC0gbW92ZVgpO1xuICAgIH07XG4gICAgYWN0aW9ucy5kcmFnRW5kID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XG4gICAgICBlbmRYID0gZS54O1xuICAgICAgaWYgKE1hdGguYWJzKHN0YXJ0WCAtIGVuZFgpIDwgMTApIGNsaWNrYWJsZSA9IHRydWU7XG4gICAgICBlbHNlIGNsaWNrYWJsZSA9IGZhbHNlO1xuICAgICAgaXNSZWFkeU1vdmUgPSBmYWxzZTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZHJhZ0xlYXZlID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoIWlzUmVhZHlNb3ZlKSByZXR1cm47XG5cbiAgICAgIC8vIGdzYXAudG8oJHRhYkhlYWRFbCwge1xuICAgICAgLy8gICBzY3JvbGxMZWZ0OiAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpLm9mZnNldExlZnQsXG4gICAgICAvLyAgIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgICAgIC8vIH0pO1xuXG4gICAgICBjbGlja2FibGUgPSB0cnVlO1xuICAgICAgaXNSZWFkeU1vdmUgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy51cCA9IChlKSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHJldHVybjtcbiAgICAgIHNldFN0YXRlKHsgYWN0aXZlVmFsdWU6IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuZ2V0QXR0cmlidXRlKCdkYXRhLXRhYi12YWx1ZScpIH0pO1xuICAgICAgZm9jdXNUYXJnZXRWYWx1ZSh0YWJCdG4sIHN0YXRlLmFjdGl2ZVZhbHVlKTtcbiAgICB9O1xuICAgIGFjdGlvbnMuZG93biA9IChlKSA9PiB7XG4gICAgICBpZiAoIWUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZykgcmV0dXJuO1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLmdldEF0dHJpYnV0ZSgnZGF0YS10YWItdmFsdWUnKSB9KTtcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmZpcnN0ID0gKCkgPT4ge1xuICAgICAgc2V0U3RhdGUoeyBhY3RpdmVWYWx1ZTogJHRhYkJ0bkVsWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS10YWItdmFsdWUnKSB9KTtcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XG4gICAgfTtcbiAgICBhY3Rpb25zLmxhc3QgPSAoKSA9PiB7XG4gICAgICBzZXRTdGF0ZSh7IGFjdGl2ZVZhbHVlOiAkdGFiQnRuRWxbJHRhYkJ0bkVsLmxlbmd0aCAtIDFdLmdldEF0dHJpYnV0ZSgnZGF0YS10YWItdmFsdWUnKSB9KTtcbiAgICAgIGZvY3VzVGFyZ2V0VmFsdWUodGFiQnRuLCBzdGF0ZS5hY3RpdmVWYWx1ZSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGZvY3VzVGFyZ2V0VmFsdWUoZWwsIHZhbHVlKSB7XG4gICAgICBjb25zdCBmb2N1c1RhcmdldCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHtlbH1bZGF0YS10YWItdmFsdWU9XCIke3ZhbHVlfVwiXWApO1xuICAgICAgZm9jdXNUYXJnZXQ/LmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXZlbnQoKSB7XG4gICAgY29uc3QgYWN0aW9uTGlzdCA9IHtcbiAgICAgIHVwOiBbJ0Fycm93TGVmdCddLFxuICAgICAgZG93bjogWydBcnJvd1JpZ2h0J10sXG4gICAgICBmaXJzdDogWydIb21lJ10sXG4gICAgICBsYXN0OiBbJ0VuZCddLFxuICAgICAgc2VsZWN0OiBbJ0VudGVyJywgJyAnXSxcbiAgICB9O1xuXG4gICAgYWRkRXZlbnQoJ2NsaWNrJywgdGFiSGVhZCwgYWN0aW9ucy5zZWxlY3QpO1xuICAgIGFkZEV2ZW50KCdwb2ludGVyZG93bicsIHRhYkhlYWQsIGFjdGlvbnMuZHJhZ1N0YXJ0KTtcbiAgICBhZGRFdmVudCgncG9pbnRlcm1vdmUnLCB0YWJIZWFkLCBhY3Rpb25zLmRyYWdNb3ZlKTtcbiAgICBhZGRFdmVudCgncG9pbnRlcnVwJywgdGFiSGVhZCwgYWN0aW9ucy5kcmFnRW5kKTtcbiAgICBhZGRFdmVudCgncG9pbnRlcmxlYXZlJywgdGFiSGVhZCwgYWN0aW9ucy5kcmFnTGVhdmUpO1xuXG4gICAgYWRkRXZlbnQoJ2tleWRvd24nLCB0YWJIZWFkLCAoZSkgPT4ge1xuICAgICAgY29uc3QgeyBrZXkgfSA9IGU7XG4gICAgICBjb25zdCBhY3Rpb24gPSBPYmplY3QuZW50cmllcyhhY3Rpb25MaXN0KS5maW5kKChbXywga2V5c10pID0+IGtleXMuaW5jbHVkZXMoa2V5KSk7XG5cbiAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBjb25zdCBbYWN0aW9uTmFtZV0gPSBhY3Rpb247XG4gICAgICAgIGFjdGlvbnNbYWN0aW9uTmFtZV0/LihlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBnZXRJZCA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcihgJHt0YWJCdG59W2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdYCk/LmlkO1xuXG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCAnW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJywgJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgZXRVSS51dGlscy5zZXRQcm9wZXJ0eSgkdGFyZ2V0LCBgJHt0YWJCdG59W2RhdGEtdGFiLXZhbHVlPVwiJHtzdGF0ZS5hY3RpdmVWYWx1ZX1cIl1gLCAnYXJpYS1zZWxlY3RlZCcsIHRydWUpO1xuXG4gICAgJHRhcmdldC5xdWVyeVNlbGVjdG9yKGAke3RhYkNvbnRlbnR9W2FyaWEtbGFiZWxsZWRieT1cIiR7Z2V0SWR9XCJdYCk/LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYCR7dGFiQ29udGVudH1bZGF0YS10YWItdmFsdWU9XCIke3N0YXRlLmFjdGl2ZVZhbHVlfVwiXWApPy5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gIH1cblxuICAvLyBjdXN0b21cbiAgZnVuY3Rpb24gc3RpY2t5VGFiKCkge1xuICAgIGNvbnN0IHsgYm90dG9tIH0gPSBldFVJLmhvb2tzLnVzZUdldENsaWVudFJlY3QoZG9jdW1lbnQsIHByb3BzLnN0aWNreSk7XG5cbiAgICAkdGFyZ2V0LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAkdGFiSGVhZEVsLnN0eWxlLnBvc2l0aW9uID0gJ3N0aWNreSc7XG4gICAgaWYgKCFib3R0b20pICR0YWJIZWFkRWwuc3R5bGUudG9wID0gMCArICdweCc7XG4gICAgZWxzZSAkdGFiSGVhZEVsLnN0eWxlLnRvcCA9IGJvdHRvbSArICdweCc7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRPZmZzZXRMZWZ0KCkge1xuICAgIGNvbnN0IHRhcmdldEJ0biA9ICR0YXJnZXQucXVlcnlTZWxlY3RvcignW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJyk7XG4gICAgaWYgKCF0YXJnZXRCdG4pIHJldHVybjtcblxuICAgIGdzYXAuc2V0KCR0YWJIZWFkRWwsIHtcbiAgICAgIHNjcm9sbExlZnQ6IHRhcmdldEJ0bi5vZmZzZXRMZWZ0IC0gMjQsXG4gICAgICBvdmVyd3JpdGU6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICBjb21wb25lbnQgPSB7XG4gICAgY29yZToge1xuICAgICAgc3RhdGUsXG4gICAgICBwcm9wcyxcbiAgICAgIGluaXQsXG4gICAgICByZW1vdmVFdmVudCxcbiAgICAgIGRlc3Ryb3ksXG4gICAgfSxcbiAgICBzZXRPZmZzZXRMZWZ0LFxuICAgIHVwZGF0ZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiZnVuY3Rpb24gVG9hc3QoKSB7XG4gIGNvbnN0IHtcbiAgICBhY3Rpb25zLCBwcm9wcywgc3RhdGUsIHNldFByb3BzLCBzZXRTdGF0ZSwgc2V0VGFyZ2V0LCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQsXG4gIH0gPSBldFVJLmhvb2tzLnVzZUNvcmUoe1xuICAgIC8vIHByb3BzXG4gICAgdHlwZTogJ2Jhc2ljJyxcbiAgICBtZXNzYWdlOiAn66mU7IS47KeA66W8IOyngOygle2VtCDso7zshLjsmpQuJyxcbiAgfSwge1xuICAgIC8vIHN0YXRlXG5cbiAgfSwgcmVuZGVyKTtcblxuICAvLyB2YXJpYWJsZVxuICBjb25zdCBuYW1lID0gJ3RvYXN0JztcbiAgbGV0IGNvbXBvbmVudCA9IHt9O1xuICAvLyBlbGVtZW50LCBzZWxlY3RvclxuICBsZXQgJHRhcmdldCwgJHRvYXN0O1xuICBsZXQgdG9hc3RUcmlnZ2VyQnRuLCB0b2FzdENsb3NlQnRuO1xuXG4gIC8qKlxuICAgKiBpbml0XG4gICAqIEBwYXJhbSBfJHRhcmdldFxuICAgKiBAcGFyYW0gX3Byb3BzXG4gICAqL1xuICBmdW5jdGlvbiBpbml0KF8kdGFyZ2V0LCBfcHJvcHMpIHtcbiAgICBpZih0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICR0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKF8kdGFyZ2V0KVxuICAgIH1lbHNle1xuICAgICAgJHRhcmdldCA9IF8kdGFyZ2V0O1xuICAgIH1cblxuICAgIGlmKCEkdGFyZ2V0KXtcbiAgICAgIHRocm93IEVycm9yKCd0YXJnZXTsnbQg7KG07J6s7ZWY7KeAIOyViuyKteuLiOuLpC4nKTtcbiAgICB9XG5cbiAgICBzZXRUYXJnZXQoJHRhcmdldCApO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcblxuICAgIC8vICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgLy8gc2V0dXBUZW1wbGF0ZSgpO1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKXtcbiAgICB0b2FzdFRyaWdnZXJCdG4gPSAnLnRvYXN0LXRyaWdnZXItYnRuJztcbiAgICB0b2FzdENsb3NlQnRuID0gJy50b2FzdC1jbG9zZS1idG4nO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBFbGVtZW50KCkge1xuICAgIC8vIHNldCBpZFxuICAgIGNvbnN0IGlkID0gZXRVSS51dGlscy5nZXRSYW5kb21VSUlEKG5hbWUpO1xuICAgIC8vIGNvbnN0IHRpdGxlSWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSArICctdGl0Jyk7XG5cbiAgICBldFVJLnV0aWxzLnNldFByb3BlcnR5KCR0b2FzdCwgJ2lkJywgaWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0QW5pbWF0aW9uIChuZXdUb2FzdCwgaW5uZXJUb2FzdCkge1xuICAgIC8vIOqwnOuzhCDtg4DsnoTrnbzsnbgg7IOd7ISxXG4gICAgY29uc3QgdGwgPSBnc2FwLnRpbWVsaW5lKCk7XG5cbiAgICB0bC5mcm9tVG8obmV3VG9hc3QsIHtcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICBtYXJnaW5Cb3R0b206IDAsXG4gICAgfSwge1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGR1cmF0aW9uOiAwLjUsXG4gICAgICBoZWlnaHQ6IGlubmVyVG9hc3QuY2xpZW50SGVpZ2h0LFxuICAgICAgbWFyZ2luQm90dG9tOiAnMC44cmVtJyxcbiAgICB9KVxuICAgIC50byhuZXdUb2FzdCwge1xuICAgICAgZGVsYXk6IDMsXG4gICAgICBkdXJhdGlvbjogMC41LFxuICAgICAgb3BhY2l0eTogMCxcbiAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgbmV3VG9hc3QucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldHVwQWN0aW9ucygpe1xuICAgIGNvbnN0IHsgJHRlbXBsYXRlSFRNTCwgJHRlbXBsYXRDbG9zZUhUTUwsICR0ZW1wbGF0ZUxpbmtIVE1MIH0gPSBldFVJLnRlbXBsYXRlcy50b2FzdFRtcGwoKTtcbiAgICBhY3Rpb25zLm9wZW4gPSAoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjb21wb25lbnQtdG9hc3QnKVxuXG4gICAgICBpZiAocHJvcHMudHlwZSA9PT0gJ2Jhc2ljJykge1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJHRlbXBsYXRlSFRNTChwcm9wcylcbiAgICAgIH0gZWxzZSBpZiAocHJvcHMudHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJHRlbXBsYXRDbG9zZUhUTUwocHJvcHMpXG4gICAgICB9IGVsc2UgaWYgKHByb3BzLnR5cGUgPT09ICdsaW5rJykge1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJHRlbXBsYXRlTGlua0hUTUwocHJvcHMpXG4gICAgICB9XG4gICAgICAkdGFyZ2V0LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAkdG9hc3QgPSBjb250YWluZXI7XG5cbiAgICAgIHNldEFuaW1hdGlvbiAoJHRvYXN0LCAkdG9hc3QucXVlcnlTZWxlY3RvcignLnRvYXN0LWNvbnRhaW5lcicpKTtcbiAgICB9XG5cbiAgICBhY3Rpb25zLmNsb3NlID0gKHt0YXJnZXR9KSA9PiB7XG4gICAgICB0YXJnZXQuY2xvc2VzdCgnLmNvbXBvbmVudC10b2FzdCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGFkZEV2ZW50KCdjbGljaycsIHRvYXN0Q2xvc2VCdG4sIGFjdGlvbnMuY2xvc2UpXG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgLy8gcmVuZGVyXG4gIH1cblxuICBmdW5jdGlvbiBvcGVuKCkge1xuICAgIHNldHVwQWN0aW9ucygpO1xuICAgIGFjdGlvbnMub3BlbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgYWN0aW9ucy5jbG9zZSgpO1xuICB9XG5cbiAgY29tcG9uZW50ID0ge1xuICAgIGNvcmU6IHtcbiAgICAgIHN0YXRlLFxuICAgICAgcHJvcHMsXG4gICAgICBpbml0LFxuICAgICAgcmVtb3ZlRXZlbnQsXG4gICAgICBkZXN0cm95LFxuICAgIH0sXG5cbiAgICAvLyBjYWxsYWJsZVxuICAgIHVwZGF0ZSxcbiAgICBvcGVuLFxuICAgIGNsb3NlLFxuICB9XG5cbiAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbiIsIi8qKlxuICogVG9vbHRpcFxuICovXG5mdW5jdGlvbiBUb29sdGlwKCkge1xuICBjb25zdCB7IGFjdGlvbnMsIHByb3BzLCBzdGF0ZSwgc2V0UHJvcHMsIHNldFN0YXRlLCBzZXRUYXJnZXQsIGFkZEV2ZW50LCByZW1vdmVFdmVudCB9ID0gZXRVSS5ob29rcy51c2VDb3JlKFxuICAgIHtcbiAgICAgIHR5cGU6ICdkZWZhdWx0JyxcbiAgICAgIGR1cmF0aW9uOiAwLjIsXG4gICAgICBoZWlnaHQ6ICdhdXRvJyxcbiAgICAgIHRyYW5zZm9ybToge1xuICAgICAgICBzY2FsZToge1xuICAgICAgICAgIHg6IDEsXG4gICAgICAgICAgeTogMSxcbiAgICAgICAgfSxcbiAgICAgICAgdHJhbnNsYXRlOiB7XG4gICAgICAgICAgeDogMCxcbiAgICAgICAgICB5OiAwLFxuICAgICAgICB9LFxuICAgICAgICBkZWxheTogMCxcbiAgICAgICAgZWFzaW5nOiAncG93ZXI0Lm91dCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhdGU6ICdjbG9zZScsXG4gICAgfSxcbiAgICByZW5kZXIsXG4gICk7XG4gIGNvbnN0IHsgZmlyc3ROb2RlRm9jdXNPdXQsIGxhc3ROb2RlRm9jdXNPdXQgfSA9IGV0VUkuaG9va3MudXNlQTExeUtleUV2ZW50KCk7XG4gIGNvbnN0IHsgbWVkaWFRdWVyeUFjdGlvbiB9ID0gZXRVSS5ob29rcy51c2VNZWRpYVF1ZXJ5KCk7XG5cbiAgLy8gc3RhdGUg67OA6rK9IOyLnCDrnpzrjZQg7J6s7Zi47LacXG4gIGNvbnN0IG5hbWUgPSAndG9vbHRpcCc7XG4gIGxldCBjb21wb25lbnQgPSB7fTtcbiAgbGV0IGNsZWFudXBzID0gW107XG5cbiAgLy8g7JqU7IaM6rSA66CoIOuzgOyImOuTpFxuICBsZXQgJHRhcmdldCwgJHRvb2x0aXBDb250YWluZXIsICRvcGVuQnRuLCAkY2xvc2VCdG4sICRvcGVuZGltLCAkdG9vbHRpcERpbTtcbiAgbGV0IHRvb2x0aXBDbG9zZUJ0biwgdG9vbHRpcFRyaWdnZXJCdG4sIHRvb2x0aXBEaW07XG4gIGxldCBmb2N1c1RyYXBJbnN0YW5jZTtcbiAgbGV0IHRvb2x0aXBDb250YWluZXJYO1xuICBsZXQgYm9keVdpZHRoO1xuXG4gIC8vIOuwmOydke2YlVxuICBsZXQgaXNNb2JpbGUgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogMTAyNHB4KScpLm1hdGNoZXM7XG5cbiAgLyoqXG4gICAqIGluaXRcbiAgICogQHBhcmFtIF8kdGFyZ2V0XG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIGluaXQoXyR0YXJnZXQsIF9wcm9wcykge1xuICAgIGlmICh0eXBlb2YgXyR0YXJnZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAkdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihfJHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICR0YXJnZXQgPSBfJHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoISR0YXJnZXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdUYXJnZXQgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgc2V0VGFyZ2V0KCR0YXJnZXQpO1xuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcblxuICAgIGlmICgkdGFyZ2V0LnVpKSByZXR1cm47XG4gICAgJHRhcmdldC51aSA9IGNvbXBvbmVudDtcblxuICAgIHNldHVwKCk7XG4gICAgc2V0RXZlbnQoKTtcblxuICAgICR0YXJnZXQuc2V0QXR0cmlidXRlKCdkYXRhLWluaXQnLCAndHJ1ZScpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgc2V0dXBUZW1wbGF0ZSgpO1xuICAgIHNldHVwU2VsZWN0b3IoKTtcbiAgICBzZXR1cEVsZW1lbnQoKTtcbiAgICBzZXR1cEFjdGlvbnMoKTtcblxuICAgIC8vIGZvY3VzIHRyYXBcbiAgICBmb2N1c1RyYXBJbnN0YW5jZSA9IGZvY3VzVHJhcC5jcmVhdGVGb2N1c1RyYXAoJHRhcmdldCwge1xuICAgICAgZXNjYXBlRGVhY3RpdmF0ZXM6IHByb3BzLmVzYyxcbiAgICAgIG9uQWN0aXZhdGU6IGFjdGlvbnMuZm9jdXNBY3RpdmF0ZSxcbiAgICAgIG9uRGVhY3RpdmF0ZTogYWN0aW9ucy5mb2N1c0RlYWN0aXZhdGUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogdXBkYXRlXG4gICAqIEBwYXJhbSBfcHJvcHNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZShfcHJvcHMpIHtcbiAgICBpZiAoX3Byb3BzICYmIGV0VUkudXRpbHMuc2hhbGxvd0NvbXBhcmUocHJvcHMsIF9wcm9wcykgJiYgISR0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluaXQnKSkgcmV0dXJuO1xuICAgIGRlc3Ryb3koKTtcblxuICAgIHNldFByb3BzKHsgLi4ucHJvcHMsIC4uLl9wcm9wcyB9KTtcbiAgICBzZXR1cCgpO1xuICAgIHNldEV2ZW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGV0VUkudXRpbHMuYWxsQ2xlYW51cHMoY2xlYW51cHMpO1xuICAgIHJlbW92ZUV2ZW50KCk7XG4gICAgJHRhcmdldC51aSA9IG51bGw7XG4gICAgJHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW5pdCcpO1xuICB9XG5cbiAgLy8gZnJlcXVlbmN5XG4gIGZ1bmN0aW9uIHNldHVwVGVtcGxhdGUoKSB7fVxuXG4gIGZ1bmN0aW9uIHNldHVwU2VsZWN0b3IoKSB7XG4gICAgLy8gZWxlbWVudFxuICAgICR0b29sdGlwQ29udGFpbmVyID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcudG9vbHRpcC1jb250YWluZXInKTtcbiAgICAvLyBzZWxlY290clxuICAgIHRvb2x0aXBUcmlnZ2VyQnRuID0gJy50b29sdGlwLWJ0bi10cmlnZ2VyJztcbiAgICB0b29sdGlwQ2xvc2VCdG4gPSAnLnRvb2x0aXAtYnRuLWNsb3NlJztcbiAgICAkdG9vbHRpcERpbSA9ICcuZGltJztcbiAgICB0b29sdGlwRGltID0gJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZGltJyk7IC8vIDA2MTYgZGltIHR5cGUg7LaU6rCAXG4gICAgJG9wZW5CdG4gPSAkdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IodG9vbHRpcFRyaWdnZXJCdG4pO1xuICAgICRjbG9zZUJ0biA9ICR0YXJnZXQucXVlcnlTZWxlY3Rvcih0b29sdGlwQ2xvc2VCdG4pO1xuICAgICRvcGVuZGltID0gdG9vbHRpcERpbTsgLy8gMDYxNiBkaW0gdHlwZSB0b29sdGlwRGltIOuzgOyImOyXkCDsp4HsoJEg7ZWg64u5XG4gIH1cblxuICBmdW5jdGlvbiBzZXR1cEVsZW1lbnQoKSB7XG4gICAgLy8gc2V0IGlkXG4gICAgY29uc3QgaWQgPSBldFVJLnV0aWxzLmdldFJhbmRvbVVJSUQobmFtZSk7XG4gICAgY29uc3QgdGl0bGVJZCA9IGV0VUkudXRpbHMuZ2V0UmFuZG9tVUlJRChuYW1lICsgJy10aXQnKTtcblxuICAgIC8vIGExMXlcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XG4gICAgJHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAkdGFyZ2V0LnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRpdGxlSWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0dXBBY3Rpb25zKCkge1xuICAgIGFjdGlvbnMub3BlbiA9ICgpID0+IHtcbiAgICAgIGlmIChpc01vYmlsZSAmJiB0b29sdGlwRGltKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoZWNrT3ZlcmZsb3cgPSAoKSA9PiB7XG4gICAgICAgIGJvZHlXaWR0aCA9ICR0b29sdGlwQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gMzA7XG4gICAgICAgIHRvb2x0aXBDb250YWluZXJYID0gJHRvb2x0aXBDb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueDtcbiAgICAgICAgaWYgKHRvb2x0aXBDb250YWluZXJYIDwgMCkge1xuICAgICAgICAgICR0b29sdGlwQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ292ZXJmbG93LWxlZnQnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0b29sdGlwQ29udGFpbmVyWCA+IGJvZHlXaWR0aCkge1xuICAgICAgICAgICR0b29sdGlwQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ292ZXJmbG93LXJpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHNldEFuaW1hdGlvbiA9IHsgZHVyYXRpb246IDAsIGRpc3BsYXk6ICdub25lJywgb3BhY2l0eTogMCB9O1xuICAgICAgaWYgKHByb3BzLnR5cGUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICBnc2FwXG4gICAgICAgICAgLnRpbWVsaW5lKClcbiAgICAgICAgICAudG8oJHRvb2x0aXBDb250YWluZXIsIHNldEFuaW1hdGlvbilcbiAgICAgICAgICAudG8oJHRvb2x0aXBDb250YWluZXIsIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbixcbiAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgb25VcGRhdGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgY2hlY2tPdmVyZmxvdygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzLnR5cGUgPT09ICdjdXN0b20nKSB7XG4gICAgICAgIGdzYXBcbiAgICAgICAgICAudGltZWxpbmUoKVxuICAgICAgICAgIC50bygkdG9vbHRpcENvbnRhaW5lciwgc2V0QW5pbWF0aW9uKVxuICAgICAgICAgIC50bygkdG9vbHRpcENvbnRhaW5lciwge1xuICAgICAgICAgICAgZHVyYXRpb246IHByb3BzLmR1cmF0aW9uLFxuICAgICAgICAgICAgc2NhbGU6IDEsXG4gICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIG9uVXBkYXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGNoZWNrT3ZlcmZsb3coKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICRjbG9zZUJ0biAmJiAkY2xvc2VCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICR0b29sdGlwQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgaWYgKCRjbG9zZUJ0bikge1xuICAgICAgICAkY2xvc2VCdG4uZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYWN0aW9ucy5jbG9zZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lckNsYXNzID0gJHRvb2x0aXBDb250YWluZXIuY2xhc3NMaXN0XG4gICAgICBjb25zdCBzY2FsZSA9IHByb3BzLnRyYW5zZm9ybS5zY2FsZS54O1xuICAgICAgY29uc3QgeyB0eXBlIH0gPSBwcm9wc1xuXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gbnVsbDtcblxuICAgICAgZ3NhcC50aW1lbGluZSgpLnRvKCR0b29sdGlwQ29udGFpbmVyLCB7XG4gICAgICAgIGR1cmF0aW9uOiBwcm9wcy5kdXJhdGlvbixcbiAgICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgY29udGFpbmVyQ2xhc3MuY29udGFpbnMoJ292ZXJmbG93LWxlZnQnKSAmJiBjb250YWluZXJDbGFzcy5yZW1vdmUoJ292ZXJmbG93LWxlZnQnKTtcbiAgICAgICAgICBjb250YWluZXJDbGFzcy5jb250YWlucygnb3ZlcmZsb3ctcmlnaHQnKSAmJiBjb250YWluZXJDbGFzcy5yZW1vdmUoJ292ZXJmbG93LXJpZ2h0Jyk7XG5cbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICRjbG9zZUJ0biAmJiAkY2xvc2VCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIHR5cGUgPT09ICdjdXN0b20nICYmIGdzYXAudGltZWxpbmUoKS50bygkdG9vbHRpcENvbnRhaW5lciwgeyBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sIHNjYWxlOiBzY2FsZSwgZGlzcGxheTogJ25vbmUnLCBvcGFjaXR5OiAwIH0pO1xuICAgICAgdHlwZSA9PT0gJ2RlZmF1bHQnICYmIGdzYXAudGltZWxpbmUoKS50bygkdG9vbHRpcENvbnRhaW5lciwgeyBkdXJhdGlvbjogcHJvcHMuZHVyYXRpb24sIGRpc3BsYXk6ICdub25lJywgb3BhY2l0eTogMCB9KTtcbiAgICB9O1xuXG4gICAgYWN0aW9ucy5mb2N1c0FjdGl2YXRlID0gKCkgPT4ge307XG5cbiAgICBhY3Rpb25zLmZvY3VzRGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgICAgIGlmICghc3RhdGUudHJpZ2dlcikge1xuICAgICAgICBjYWxsYmFjayA9IHByb3BzLm5lZ2F0aXZlQ2FsbGJhY2s7XG4gICAgICB9XG4gICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgICBmb2N1c1RyYXBJbnN0YW5jZS5kZWFjdGl2YXRlKCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEV2ZW50KCkge1xuICAgIGV0VUkuaG9va3MudXNlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdyZXNpemUnLCAoKSA9PiB7XG4gICAgICBpc01vYmlsZSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcobWF4LXdpZHRoOiAxMDI0cHgpJykubWF0Y2hlcztcbiAgICB9KTtcblxuICAgIGV0VUkuaG9va3MudXNlRXZlbnRMaXN0ZW5lcihkb2N1bWVudC5ib2R5LCAnY2xpY2snLCAoZSkgPT4ge1xuICAgICAgaWYgKHN0YXRlLnN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgICAgY29uc3QgeyB0YXJnZXQgfSA9IGU7XG5cbiAgICAgICAgaWYgKHRhcmdldCA9PT0gJHRvb2x0aXBDb250YWluZXIgfHwgdGFyZ2V0ID09PSAkb3BlbkJ0bikgcmV0dXJuO1xuICAgICAgICBpZiAodG9vbHRpcERpbSkgdG9vbHRpcERpbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBhY3Rpb25zLmNsb3NlKCk7XG4gICAgICAgICRvcGVuQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ29uJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRFdmVudCgndG91Y2htb3ZlJywgJHRvb2x0aXBEaW0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICBhZGRFdmVudCgnY2xpY2snLCB0b29sdGlwVHJpZ2dlckJ0biwgZnVuY3Rpb24gKCkge1xuICAgICAgYWN0aW9ucy5vcGVuKCk7XG5cbiAgICAgICRvcGVuQnRuLmNsYXNzTGlzdC5hZGQoJ29uJyk7XG4gICAgICAvLyAwNjE2IGRpbSB0eXBlIOy2lOqwgFxuICAgICAgaWYgKHRvb2x0aXBEaW0pIHtcbiAgICAgICAgdG9vbHRpcERpbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICgkY2xvc2VCdG4pIHtcbiAgICAgIGNsZWFudXBzLnB1c2goZmlyc3ROb2RlRm9jdXNPdXQoJGNsb3NlQnRuLCBhY3Rpb25zLmNsb3NlKSk7XG4gICAgICBjbGVhbnVwcy5wdXNoKGxhc3ROb2RlRm9jdXNPdXQoJGNsb3NlQnRuLCBhY3Rpb25zLmNsb3NlKSk7XG4gICAgICBhZGRFdmVudCgnY2xpY2snLCB0b29sdGlwQ2xvc2VCdG4sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWN0aW9ucy5jbG9zZSgpO1xuICAgICAgICBpZiAodG9vbHRpcERpbSkge1xuICAgICAgICAgIHRvb2x0aXBEaW0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhbnVwcy5wdXNoKGZpcnN0Tm9kZUZvY3VzT3V0KCRvcGVuQnRuLCBhY3Rpb25zLm9wZW4pKTtcbiAgICAgIGNsZWFudXBzLnB1c2gobGFzdE5vZGVGb2N1c091dCgkb3BlbkJ0biwgYWN0aW9ucy5jbG9zZSkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBjb25zdCBpc1Nob3cgPSBzdGF0ZS5zdGF0ZSA9PT0gJ29wZW4nO1xuICAgIGNvbnN0IGV4cGFuZGVkID0gJHRvb2x0aXBDb250YWluZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJztcbiAgICAkdG9vbHRpcENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAhZXhwYW5kZWQpO1xuICAgICR0b29sdGlwQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBleHBhbmRlZCk7XG5cbiAgICBpZiAoaXNTaG93KSB7XG4gICAgICBhY3Rpb25zLm9wZW4oKTtcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmFjdGl2YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvY3VzVHJhcEluc3RhbmNlLmRlYWN0aXZhdGUoKTtcbiAgICB9XG5cbiAgfVxuXG4gIGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ29wZW4nIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgc2V0U3RhdGUoeyBzdGF0ZTogJ2Nsb3NlJyB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudCA9IHtcbiAgICBjb3JlOiB7XG4gICAgICBpbml0LFxuICAgICAgZGVzdHJveSxcbiAgICAgIHJlbW92ZUV2ZW50LFxuICAgIH0sXG5cbiAgICB1cGRhdGUsXG4gICAgb3BlbixcbiAgICBjbG9zZSxcbiAgfTtcblxuICByZXR1cm4gY29tcG9uZW50O1xufVxuIiwiXG5ldFVJLmNvbXBvbmVudHMgPSB7XG5BY2NvcmRpb24sXG5Db2xsYXBzZSxcbkRhdGVwaWNrZXJDb21wLFxuRGlhbG9nLFxuSW5wdXQsXG5Mb3R0aWUsXG5Nb2RhbCxcblNlbGVjdEJveCxcblN3aXBlckNvbXAsXG5UYWIsXG5Ub2FzdCxcblRvb2x0aXBcbn1cbiAgICAgICAgICAgICAgIiwiLy8gaW5pdCBqc1xuZnVuY3Rpb24gaW5pdFVJKCkge1xuICBjb25zdCB7IG1lZGlhUXVlcnlBY3Rpb24gfSA9IGV0VUkuaG9va3MudXNlTWVkaWFRdWVyeSgpO1xuICBjb25zdCBjb21wb25lbnRMaXN0ID0gW1xuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnLmNvbXBvbmVudC1pbnB1dCcsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLklucHV0LFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICcuY29tcG9uZW50LW1vZGFsJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuTW9kYWwsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5jb21wb25lbnQtY29sbGFwc2UnLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5Db2xsYXBzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnLmNvbXBvbmVudC1hY2NvcmRpb24nLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5BY2NvcmRpb24sXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5jb21wb25lbnQtdG9vbHRpcCcsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlRvb2x0aXAsXG4gICAgfSxcbiAgICB7XG4gICAgICBzZWxlY3RvcjogJy5jb21wb25lbnQtdGFiJyxcbiAgICAgIGZuOiBldFVJLmNvbXBvbmVudHMuVGFiLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICcuY29tcG9uZW50LXNlbGVjdCcsXG4gICAgICBmbjogZXRVSS5jb21wb25lbnRzLlNlbGVjdEJveCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNlbGVjdG9yOiAnLmNvbXBvbmVudC1zd2lwZXInLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5Td2lwZXJDb21wLFxuICAgIH0sXG4gICAge1xuICAgICAgc2VsZWN0b3I6ICcuY29tcG9uZW50LWRhdGVwaWNrZXInLFxuICAgICAgZm46IGV0VUkuY29tcG9uZW50cy5EYXRlcGlja2VyQ29tcCxcbiAgICB9LFxuICBdO1xuXG4gIG1lZGlhUXVlcnlBY3Rpb24oKGNvbnRleHQpID0+IHtcbiAgICBjb25zdCB7IGlzRGVza3RvcCwgaXNNb2JpbGUgfSA9IGNvbnRleHQuY29uZGl0aW9ucztcblxuICAgIGNvbXBvbmVudExpc3QuZm9yRWFjaCgoeyBzZWxlY3RvciwgZm4gfSkgPT4ge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgY29uc3QgeyBkZXNrdG9wT25seSwgbW9iaWxlT25seSB9ID0gZWwuZGF0YXNldDtcbiAgICAgICAgaWYgKG1vYmlsZU9ubHkgfHwgZGVza3RvcE9ubHkpIHtcbiAgICAgICAgICBjb25zdCBzaG91bGRJbml0ID0gKG1vYmlsZU9ubHkgJiYgaXNNb2JpbGUpIHx8IChkZXNrdG9wT25seSAmJiBpc0Rlc2t0b3ApO1xuXG4gICAgICAgICAgaWYgKHNob3VsZEluaXQpIHtcbiAgICAgICAgICAgIGluaXRTd2lwZXIoZWwsIHNlbGVjdG9yLCBmbik7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbC51aSkge1xuICAgICAgICAgICAgZGVzdHJveVN3aXBlcihlbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsLmRhdGFzZXQuaW5pdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZm4oKTtcbiAgICAgICAgICBkb2N1bWVudC5mb250cy5yZWFkeS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChjb21wb25lbnQgJiYgY29tcG9uZW50LmNvcmUpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29yZS5pbml0KGVsLCB7fSwgc2VsZWN0b3IpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQ29tcG9uZW50IGluaXRpYWxpemF0aW9uIGZhaWxlZDogY29tcG9uZW50IG9yIGNvbXBvbmVudC5jb3JlIGlzIHVuZGVmaW5lZCcsIHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW5pdGlhbGl6aW5nIGNvbXBvbmVudDonLCBzZWxlY3RvciwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIGNvbXBvbmVudCBpbnN0YW5jZTonLCBzZWxlY3RvciwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZXRVSS5kaWFsb2cgPSBldFVJLmhvb2tzLnVzZURpYWxvZygpO1xufVxuXG5ldFVJLmluaXRVSSA9IGluaXRVSTtcblxuKGZ1bmN0aW9uIGF1dG9Jbml0KCkge1xuICBjb25zdCAkc2NyaXB0QmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtaW5pdF1cIik7XG4gIGlmICgkc2NyaXB0QmxvY2spIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpbml0VUkoKTtcbiAgICB9KTtcbiAgfVxufSkoKTtcbiIsImZ1bmN0aW9uIGRpYWxvZ1RtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSAoeyBkaWFsb2dUeXBlLCB0eXBlLCB0aXRsZSwgbWVzc2FnZSwgcG9zaXRpdmVUZXh0LCBuZWdhdGl2ZVRleHQgfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1kaWFsb2dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1kaW1tXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZnJhbWVcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgJHt0aXRsZSA/IGA8aDMgY2xhc3M9XCJkaWFsb2ctdGl0XCI+JHt0aXRsZX08L2gzPmAgOiAnJ31cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250ZW50XCI+XG4gICAgICAgICAgICAgICR7ZGlhbG9nVHlwZSA9PT0gJ2FsZXJ0JyA/IGA8c3BhbiBjbGFzcz1cIiR7dHlwZX1cIj5pY29uPC9zcGFuPmAgOiAnJ31cblxuICAgICAgICAgICAgICA8cCBjbGFzcz1cImRpYWxvZy1pbmZvXCI+JHttZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdjb25maXJtJyA/IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3F1YXJlIGJ0bi13aGl0ZSBkaWFsb2ctbmVnYXRpdmVcIj4ke25lZ2F0aXZlVGV4dH08L2J1dHRvbj5gIDogJyd9XG4gICAgICAgICAgICAgICR7cG9zaXRpdmVUZXh0ID8gYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGRpYWxvZy1wb3NpdGl2ZSBidG4tcHJpbWFyeVwiPiR7cG9zaXRpdmVUZXh0fTwvYnV0dG9uPmAgOiAnJ31cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAke2RpYWxvZ1R5cGUgPT09ICdhbGVydCcgPyBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJkaWFsb2ctY2xvc2VcIj48c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+7Yyd7JeFIOuLq+q4sDwvc3Bhbj48L2J1dHRvbj5gIDogJyd9XG5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gIGNvbnN0ICR0ZW1wbGF0ZVByZXZpZXdJbWFnZUhUTUwgPSAoeyBkaWFsb2dUeXBlLCBpbWFnZXMsIHRpdGxlIH0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtZGlhbG9nIGRpYWxvZy1wcmV2aWV3LWltYWdlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctZGltbVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWZyYW1lXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctaGVhZGVyXCI+XG4gICAgICAgICAgICAgICR7dGl0bGUgPyBgPGgzIGNsYXNzPVwiZGlhbG9nLXRpdFwiPiR7dGl0bGV9PC9oMz5gIDogJyd9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LXN3aXBlclwiIGRhdGEtY29tcG9uZW50PVwic3dpcGVyXCI+XG4gICAgICAgICAgICAgICAgPCEtLSBBZGRpdGlvbmFsIHJlcXVpcmVkIHdyYXBwZXIgLS0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICAke2ltYWdlc1xuICAgICAgICAgICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAgICAgICAgIChpbWFnZSkgPT4gYFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLXNsaWRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2ltYWdlLnNyY31cIiBhbHQ9XCIke2ltYWdlLmFsdH1cIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIGAsXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJycpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJkaWFsb2ctY2xvc2VcIj48c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+7Yyd7JeFIOuLq+q4sDwvc3Bhbj48L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gIHJldHVybiB7XG4gICAgJHRlbXBsYXRlSFRNTCxcbiAgICAkdGVtcGxhdGVQcmV2aWV3SW1hZ2VIVE1MXG4gIH07XG59XG4iLCJcbmV0VUkudGVtcGxhdGVzID0ge1xuZGlhbG9nVG1wbCxcbmlucHV0VG1wbCxcbnNlbGVjdEJveFRtcGwsXG5zd2lwZXJUbXBsLFxudG9hc3RUbXBsXG59XG4gICAgICAgICAgICAgICIsImZ1bmN0aW9uIGlucHV0VG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlSFRNTCA9IHtcbiAgICB0b2dnbGVQYXNzd29yZCgpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiaW5wdXQtZmllbGQtYnRuIHBhc3N3b3JkLXN0YXRlXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRlLXR4dCBoaWRlXCI+JHtldFVJLiR0KCdpbnB1dC5wYXNzd29yZF9oaWRlJywgJ+u5hOuwgOuyiO2YuCDsiKjquLDquLAnKX08L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaWRlLXR4dCBzaG93XCI+JHtldFVJLiR0KCdpbnB1dC5wYXNzd29yZF9zaG93JywgJ+u5hOuwgOuyiO2YuCDtkZzsi5wnKX08L3NwYW4+XG4gICAgICAgICAgPGkgY2xhc3M9XCJpY28tcGFzc3dvcmQtc3RhdGUgaWNvLW5vcm1hbFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgY2xlYXJCdXR0b24oKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImlucHV0LWZpZWxkLWJ0biBjbGVhclwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaGlkZS10eHRcIj4ke2V0VUkuJHQoJ2lucHV0LmNsZWFyJywgJ+uCtOyaqSDsp4DsmrDquLAnKX08L3NwYW4+XG4gICAgICAgICAgPGkgY2xhc3M9XCJpY28tY2xlYXIgaWNvLW5vcm1hbFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgbG9hZGluZygpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxpIGNsYXNzPVwiaW5wdXQtZmllbGQtaWNvIHNwaW5uZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVIVE1MLFxuICB9O1xufVxuIiwiLyoqXG4gKiDqsJzsnbjsoJXrs7TsspjrpqzrsKnsuagg7YWc7ZSM66a/IOq0gOumrFxuICog64uo7LaV7YKkOlxuICogLSBBbHQgKyBQOiDtjJ3sl4Ug7Je06riwXG4gKiAtIEFsdCArIEc6IOy9lOuTnCDsg53shLFcbiAqIC0gQWx0ICsgQzog7ZWt66qpIOyCreygnFxuICovXG4vKiBnbG9iYWwgd2luZG93LCBkb2N1bWVudCwgYWxlcnQsIEV2ZW50ICovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8g66qo64usIEhUTUwg6rWs7KGwIOyDneyEsVxuICBmdW5jdGlvbiBjcmVhdGVQcml2YWN5UG9saWN5TW9kYWwoKSB7XG4gICAgY29uc3QgbW9kYWxIVE1MID0gYFxuICAgICAgPHN0eWxlPlxuICAgICAgICAvKiDrpqzsiqTtirgg7Iqk7YOA7J28ICovXG4gICAgICAgIC5wb2xpY3ktbGlzdCB7XG4gICAgICAgICAgcGFkZGluZy1sZWZ0OiAyMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLyog67aI66a/IOumrOyKpO2KuCAqL1xuICAgICAgICB1bC5wb2xpY3ktbGlzdDpub3QoLmh5cGhlbi1saXN0KSBsaSB7XG4gICAgICAgICAgbGlzdC1zdHlsZS10eXBlOiBkaXNjO1xuICAgICAgICB9XG5cbiAgICAgICAgLyog67KI7Zi4IOumrOyKpO2KuCAqL1xuICAgICAgICBvbC5wb2xpY3ktbGlzdCBsaSB7XG4gICAgICAgICAgbGlzdC1zdHlsZS10eXBlOiBkZWNpbWFsO1xuICAgICAgICB9XG5cbiAgICAgICAgLyog7ZWY7J207ZSIIOumrOyKpO2KuCAqL1xuICAgICAgICAuaHlwaGVuLWxpc3QgbGkge1xuICAgICAgICAgIGxpc3Qtc3R5bGUtdHlwZTogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDE1cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuaHlwaGVuLWxpc3QgbGk6YmVmb3JlIHtcbiAgICAgICAgICBjb250ZW50OiAnLSc7XG4gICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgIGxlZnQ6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvKiDrsJXsiqQg7Iqk7YOA7J28ICovXG4gICAgICAgIC5ib3gtc3R5bGUge1xuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOGY4Zjg7XG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2UwZTBlMDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgICBtYXJnaW4tdG9wOiA1cHg7XG4gICAgICAgIH1cblxuICAgICAgICAvKiDshJzsi50g7Yi067CUIOyKpO2DgOydvCAqL1xuICAgICAgICAuZm9ybWF0dGluZy10b29sYmFyIHtcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgIGdhcDogNXB4O1xuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICAgICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5mb3JtYXR0aW5nLXRvb2xiYXIgYnV0dG9uIHtcbiAgICAgICAgICBwYWRkaW5nOiAzcHggOHB4O1xuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5mb3JtYXR0aW5nLXRvb2xiYXIgYnV0dG9uOmhvdmVyIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmMGYwO1xuICAgICAgICB9XG5cbiAgICAgICAgLmZvcm1hdHRpbmctdG9vbGJhciBidXR0b24uYWN0aXZlIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTBlMGUwO1xuICAgICAgICB9XG5cbiAgICAgICAgLyog7JqU7IaMIOy2lOqwgCDshLnshZgg7Iqk7YOA7J28ICovXG4gICAgICAgIC5lbGVtZW50cy1zZWN0aW9uIHtcbiAgICAgICAgICBtYXJnaW4tYm90dG9tIDogMjBweDtcbiAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuZWxlbWVudHMtc2VjdGlvbiBoNCB7XG4gICAgICAgICAgbWFyZ2luOiAwIDAgMTBweCAwO1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5lbGVtZW50cy1idXR0b25zIHtcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgIGdhcDogMTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5lbGVtZW50LWRpYWxvZyB7XG4gICAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICAgICAgICBwYWRkaW5nOiAxMHB4O1xuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuZWxlbWVudC1kaWFsb2cgbGFiZWwge1xuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5lbGVtZW50LWRpYWxvZyBpbnB1dCB7XG4gICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgcGFkZGluZzogNXB4O1xuICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgICAgIH1cbiAgICAgIDwvc3R5bGU+XG4gICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LW1vZGFsIHByaXZhY3ktcG9saWN5LW1vZGFsXCIgaWQ9XCJwcml2YWN5UG9saWN5TW9kYWxcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpbW1cIj48L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxoMiBjbGFzcz1cIm1vZGFsLXRpdFwiPuqwnOyduOygleuztOyymOumrOuwqey5qCDthZztlIzrpr88L2gyPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGVtcGxhdGUtY29udHJvbHNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRlbXBsYXRlLXR5cGVcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWw+7YWc7ZSM66a/IOycoO2YlTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtc2VsZWN0XCI+XG4gICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwidGVtcGxhdGVUeXBlXCIgY2xhc3M9XCJzZWxlY3QtbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwidGl0bGVcIj7tg4DsnbTti4A8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxpc3RcIj7rpqzsiqTtirg8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImJveFwiPuuwleyKpDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwibGlzdFR5cGVDb250YWluZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7IG1hcmdpbi1ib3R0b206IDEwcHg7XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRlbXBsYXRlLXR5cGVcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbD7rpqzsiqTtirgg7Jyg7ZiVOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LXNlbGVjdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwibGlzdFR5cGVcIiBjbGFzcz1cInNlbGVjdC1saXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInVsXCI+67aI66a/IOumrOyKpO2KuDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJvbFwiPuuyiO2YuCDrpqzsiqTtirg8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiaHlwaGVuXCI+7ZWY7J207ZSIIOumrOyKpO2KuDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRlbXBsYXRlLWlucHV0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaXRlbVRpdGxlXCI+7KCc66qpOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tcG9uZW50LWlucHV0XCIgZGF0YS1wcm9wcy1jbGVhcj1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJpdGVtVGl0bGVcIiBwbGFjZWhvbGRlcj1cIuygnOuqqeydhCDsnoXroKXtlZjshLjsmpRcIj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpdGVtQ29udGVudFwiPuuCtOyaqTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm1hdHRpbmctdG9vbGJhclwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImJvbGRCdG5cIiB0aXRsZT1cIuq1teqyjFwiPjxzdHJvbmc+Qjwvc3Ryb25nPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cIml0YWxpY0J0blwiIHRpdGxlPVwi6riw7Jq47J6EXCI+PGVtPkk8L2VtPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInVuZGVybGluZUJ0blwiIHRpdGxlPVwi67CR7KSEXCI+PHU+VTwvdT48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZmllbGRcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJpdGVtQ29udGVudFwiIHBsYWNlaG9sZGVyPVwi64K07Jqp7J2EIOyeheugpe2VmOyEuOyalFwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGVtcGxhdGUtYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJhZGRJdGVtXCIgY2xhc3M9XCJidG5cIj7rr7jrpqwg67O06riwPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImRlbGV0ZUl0ZW1cIiBjbGFzcz1cImJ0biBidG4tY2xvc2VcIj7stIjquLDtmZQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZW1wbGF0ZS1wcmV2aWV3XCI+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJwcmV2aWV3Q29udGFpbmVyXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlbGVtZW50cy1zZWN0aW9uXCI+XG4gICAgICAgICAgICAgIDxoND7smpTshowg7LaU6rCAPC9oND5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImVsZW1lbnRzLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cImFkZEJ1dHRvbkVsZW1lbnRcIiBjbGFzcz1cImJ0biBidG4tc21cIj7rsoTtirwg7LaU6rCAPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJhZGRMaW5rRWxlbWVudFwiIGNsYXNzPVwiYnRuIGJ0bi1zbVwiPuunge2BrCDstpTqsIA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJidXR0b25FbGVtZW50RGlhbG9nXCIgY2xhc3M9XCJlbGVtZW50LWRpYWxvZ1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiYnV0dG9uVGV4dFwiPuuyhO2KvCDthY3siqTtirg6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImJ1dHRvblRleHRcIiBwbGFjZWhvbGRlcj1cIuuyhO2KvOyXkCDtkZzsi5ztlaAg7YWN7Iqk7Yq4XCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImJ1dHRvbkNsYXNzXCI+67KE7Yq8IO2BtOuemOyKpCAo7ISg7YOd7IKs7ZWtKTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiYnV0dG9uQ2xhc3NcIiBwbGFjZWhvbGRlcj1cIuyYiDogYnRuIGJ0bi1wcmltYXJ5XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxvY2F0aW9uLWNoZWNrYm94ZXNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2hlY2tib3gtaW5uZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJhZGRUb0xpc3RcIiBuYW1lPVwiYWRkVG9MaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGVja2JveC1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZWNrYm94LXR4dFwiPkxpc3Qg7JqU7IaM7JeQIOy2lOqwgDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21wb25lbnQtaW5wdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY2hlY2tib3gtaW5uZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJhZGRUb0NvbnRlbnRcIiBuYW1lPVwiYWRkVG9Db250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGVja2JveC1pdGVtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZWNrYm94LXR4dFwiPkNvbnRlbnQg7JqU7IaM7JeQIOy2lOqwgDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiaW5zZXJ0QnV0dG9uRWxlbWVudFwiIGNsYXNzPVwiYnRuIGJ0bi1zbVwiPuy2lOqwgDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJjYW5jZWxCdXR0b25FbGVtZW50XCIgY2xhc3M9XCJidG4gYnRuLXNtIGJ0bi1jbG9zZVwiPuy3qOyGjDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBpZD1cImxpbmtFbGVtZW50RGlhbG9nXCIgY2xhc3M9XCJlbGVtZW50LWRpYWxvZ1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibGlua1RleHRcIj7rp4Htgawg7YWN7Iqk7Yq4OjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJsaW5rVGV4dFwiIHBsYWNlaG9sZGVyPVwi66eB7YGs7JeQIO2RnOyLnO2VoCDthY3siqTtirhcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwibGlua1VybFwiPuunge2BrCBVUkw6PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImxpbmtVcmxcIiBwbGFjZWhvbGRlcj1cIuyYiDogaHR0cHM6Ly9leGFtcGxlLmNvbVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJpbnNlcnRMaW5rRWxlbWVudFwiIGNsYXNzPVwiYnRuIGJ0bi1zbVwiPuy2lOqwgDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJjYW5jZWxMaW5rRWxlbWVudFwiIGNsYXNzPVwiYnRuIGJ0bi1zbSBidG4tY2xvc2VcIj7st6jshow8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZW1wbGF0ZS1jb2RlXCI+XG4gICAgICAgICAgICAgIDxoMz7sg53shLHrkJwg7L2U65OcPC9oMz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbXBvbmVudC1pbnB1dFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1maWVsZFwiPlxuICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiZ2VuZXJhdGVkQ29kZVwiIHJlYWRvbmx5PjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYWRkQ29kZVwiIGNsYXNzPVwiYnRuXCI+7L2U65OcIOyDneyEsTwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tY2xvc2UgbW9kYWwtY2xvc2UtYnRuXCI+64ur6riwPC9idXR0b24+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGNvcHktY29kZS1idG5cIj7svZTrk5wg67O17IKsPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJtb2RhbC1jbG9zZVwiPjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICAvLyDrqqjri6wgSFRNTOydhCBib2R57JeQIOy2lOqwgFxuICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBtb2RhbEhUTUwpO1xuICB9XG5cbiAgLy8g66qo64usIOy0iOq4sO2ZlCDrsI8g7J2067Kk7Yq4IOuwlOyduOuUqVxuICBmdW5jdGlvbiBpbml0UHJpdmFjeVBvbGljeU1vZGFsKCkge1xuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByaXZhY3lQb2xpY3lNb2RhbCcpO1xuICAgIGlmICghbW9kYWwpIHtcbiAgICAgIGNyZWF0ZVByaXZhY3lQb2xpY3lNb2RhbCgpO1xuICAgICAgYmluZE1vZGFsRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gSFRNTCDtg5zqt7jrpbwg6re464yA66GcIOycoOyngO2VmOuKlCDtlajsiJggKOydtOyghOydmCDrp4jtgazri6TsmrQg67OA7ZmYIO2VqOyImCDrjIDssrQpXG4gIGZ1bmN0aW9uIHByZXNlcnZlSFRNTFRhZ3ModGV4dCkge1xuICAgIGlmICghdGV4dCkgcmV0dXJuIHRleHQ7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICAvLyDshJzsi50g7Ji17IWYIOuyhO2KvCDsnbTrsqTtirgg7LKY66asXG4gIGZ1bmN0aW9uIHNldHVwRm9ybWF0dGluZ1Rvb2xiYXIoKSB7XG4gICAgY29uc3QgYm9sZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib2xkQnRuJyk7XG4gICAgY29uc3QgaXRhbGljQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0YWxpY0J0bicpO1xuICAgIGNvbnN0IHVuZGVybGluZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bmRlcmxpbmVCdG4nKTtcbiAgICBjb25zdCBjb250ZW50VGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbUNvbnRlbnQnKTtcblxuICAgIGlmICghYm9sZEJ0biB8fCAhaXRhbGljQnRuIHx8ICF1bmRlcmxpbmVCdG4gfHwgIWNvbnRlbnRUZXh0YXJlYSkgcmV0dXJuO1xuXG4gICAgLy8g6rW16rKMIOuyhO2KvCDtgbTrpq0g7J2067Kk7Yq4XG4gICAgYm9sZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGFwcGx5Rm9ybWF0dGluZygnYm9sZCcpO1xuICAgIH0pO1xuXG4gICAgLy8g6riw7Jq47J6EIOuyhO2KvCDtgbTrpq0g7J2067Kk7Yq4XG4gICAgaXRhbGljQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgYXBwbHlGb3JtYXR0aW5nKCdpdGFsaWMnKTtcbiAgICB9KTtcblxuICAgIC8vIOuwkeykhCDrsoTtirwg7YG066atIOydtOuypO2KuFxuICAgIHVuZGVybGluZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGFwcGx5Rm9ybWF0dGluZygndW5kZXJsaW5lJyk7XG4gICAgfSk7XG5cbiAgICAvLyDsmpTshowg7LaU6rCAIOuyhO2KvCDsnbTrsqTtirgg7LKY66asXG4gICAgc2V0dXBFbGVtZW50c0J1dHRvbnMoKTtcblxuICAgIC8vIOyEnOyLnSDsoIHsmqkg7ZWo7IiYXG4gICAgZnVuY3Rpb24gYXBwbHlGb3JtYXR0aW5nKGZvcm1hdCkge1xuICAgICAgY29uc3QgdGV4dGFyZWEgPSBjb250ZW50VGV4dGFyZWE7XG4gICAgICBjb25zdCBzdGFydCA9IHRleHRhcmVhLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgY29uc3QgZW5kID0gdGV4dGFyZWEuc2VsZWN0aW9uRW5kO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gdGV4dGFyZWEudmFsdWUuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xuICAgICAgbGV0IGZvcm1hdHRlZFRleHQgPSAnJztcblxuICAgICAgaWYgKHNlbGVjdGVkVGV4dCkge1xuICAgICAgICBzd2l0Y2goZm9ybWF0KSB7XG4gICAgICAgIGNhc2UgJ2JvbGQnOlxuICAgICAgICAgIGZvcm1hdHRlZFRleHQgPSBgPHN0cm9uZyBjbGFzcz1cInN0cm9uZ1wiPiR7c2VsZWN0ZWRUZXh0fTwvc3Ryb25nPmA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2l0YWxpYyc6XG4gICAgICAgICAgZm9ybWF0dGVkVGV4dCA9IGA8ZW0gY2xhc3M9XCJpdGFsaWNcIj4ke3NlbGVjdGVkVGV4dH08L2VtPmA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VuZGVybGluZSc6XG4gICAgICAgICAgZm9ybWF0dGVkVGV4dCA9IGA8dSBjbGFzcz1cInVuZGVybGluZVwiPiR7c2VsZWN0ZWRUZXh0fTwvdT5gO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g7ISg7YOd7ZWcIO2FjeyKpO2KuOulvCDshJzsi53snbQg7KCB7Jqp65CcIO2FjeyKpO2KuOuhnCDqtZDssrRcbiAgICAgICAgdGV4dGFyZWEudmFsdWUgPSB0ZXh0YXJlYS52YWx1ZS5zdWJzdHJpbmcoMCwgc3RhcnQpICsgZm9ybWF0dGVkVGV4dCArIHRleHRhcmVhLnZhbHVlLnN1YnN0cmluZyhlbmQpO1xuXG4gICAgICAgIC8vIOy7pOyEnCDsnITsuZgg7J6s7ISk7KCVXG4gICAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgICAgIHRleHRhcmVhLnNlbGVjdGlvblN0YXJ0ID0gc3RhcnQgKyBmb3JtYXR0ZWRUZXh0Lmxlbmd0aDtcbiAgICAgICAgdGV4dGFyZWEuc2VsZWN0aW9uRW5kID0gc3RhcnQgKyBmb3JtYXR0ZWRUZXh0Lmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyDsmpTshowg7LaU6rCAIOuyhO2KvCDsnbTrsqTtirgg7LKY66asXG4gIGZ1bmN0aW9uIHNldHVwRWxlbWVudHNCdXR0b25zKCkge1xuICAgIGNvbnN0IGNvbnRlbnRUZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtQ29udGVudCcpO1xuICAgIGNvbnN0IGFkZEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkQnV0dG9uRWxlbWVudCcpO1xuICAgIGNvbnN0IGFkZExpbmtFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZExpbmtFbGVtZW50Jyk7XG4gICAgY29uc3QgYnV0dG9uRWxlbWVudERpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b25FbGVtZW50RGlhbG9nJyk7XG4gICAgY29uc3QgbGlua0VsZW1lbnREaWFsb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua0VsZW1lbnREaWFsb2cnKTtcbiAgICBjb25zdCBpbnNlcnRCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luc2VydEJ1dHRvbkVsZW1lbnQnKTtcbiAgICBjb25zdCBjYW5jZWxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbmNlbEJ1dHRvbkVsZW1lbnQnKTtcbiAgICBjb25zdCBpbnNlcnRMaW5rRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnNlcnRMaW5rRWxlbWVudCcpO1xuICAgIGNvbnN0IGNhbmNlbExpbmtFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbmNlbExpbmtFbGVtZW50Jyk7XG5cbiAgICAvLyDrsoTtirwg7LaU6rCAIOuMgO2ZlOyDgeyekCDsl7TquLBcbiAgICBhZGRCdXR0b25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgYnV0dG9uRWxlbWVudERpYWxvZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIGxpbmtFbGVtZW50RGlhbG9nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uVGV4dCcpLmZvY3VzKCk7XG4gICAgfSk7XG5cbiAgICAvLyDrp4Htgawg7LaU6rCAIOuMgO2ZlOyDgeyekCDsl7TquLBcbiAgICBhZGRMaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGxpbmtFbGVtZW50RGlhbG9nLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgYnV0dG9uRWxlbWVudERpYWxvZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtUZXh0JykuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIC8vIOuyhO2KvCDstpTqsIAg7LKY66asXG4gICAgaW5zZXJ0QnV0dG9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGJ1dHRvblRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uVGV4dCcpLnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IGJ1dHRvbkNsYXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbkNsYXNzJykudmFsdWUudHJpbSgpO1xuICAgICAgY29uc3QgYWRkVG9MaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZFRvTGlzdCcpLmNoZWNrZWQ7XG4gICAgICBjb25zdCBhZGRUb0NvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkVG9Db250ZW50JykuY2hlY2tlZDtcblxuICAgICAgaWYgKCFidXR0b25UZXh0KSB7XG4gICAgICAgIGFsZXJ0KCfrsoTtirwg7YWN7Iqk7Yq466W8IOyeheugpe2VtOyjvOyEuOyalC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBidXR0b25IVE1MID0gYnV0dG9uQ2xhc3NcbiAgICAgICAgPyBgPGJ1dHRvbiBjbGFzcz1cIiR7YnV0dG9uQ2xhc3N9XCI+JHtidXR0b25UZXh0fTwvYnV0dG9uPmBcbiAgICAgICAgOiBgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPiR7YnV0dG9uVGV4dH08L2J1dHRvbj5gO1xuXG4gICAgICBpZiAoYWRkVG9MaXN0KSB7XG4gICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb2xpY3ktbGlzdCcpKSB7XG4gICAgICAgICAgLy8gcG9saWN5LWxpc3Tsl5Ag7LaU6rCA7ZWY64qUIOuhnOyngVxuICAgICAgICAgIGNvbnN0IGxpc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICBsaXN0RWxlbWVudC5pbm5lckhUTUwgPSBidXR0b25IVE1MO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb2xpY3ktbGlzdCcpLmFwcGVuZENoaWxkKGxpc3RFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhZGRUb0NvbnRlbnQpIHtcbiAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvbGljeS1jb250ZW50JykpIHtcbiAgICAgICAgICAvLyBwb2xpY3ktY29udGVudCDsnpDsi50g7JqU7IaM66GcIOy2lOqwgO2VmOuKlCDroZzsp4FcbiAgICAgICAgICBjb25zdCBidXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgYnV0dG9uRWxlbWVudC5pbm5lckhUTUwgPSBidXR0b25IVE1MO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb2xpY3ktY29udGVudCcpLmFwcGVuZENoaWxkKGJ1dHRvbkVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBwb2xpY3ktaXRlbSDsnpDsi50g7JqU7IaM66GcIOy2lOqwgO2VmOuKlCDroZzsp4FcbiAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvbGljeS1pdGVtJykpIHtcbiAgICAgICAgICBjb25zdCBidXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgYnV0dG9uRWxlbWVudC5pbm5lckhUTUwgPSBidXR0b25IVE1MO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb2xpY3ktaXRlbScpLmFwcGVuZENoaWxkKGJ1dHRvbkVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZW1wbGF0ZUl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbGFzdEl0ZW0gPSB0ZW1wbGF0ZUl0ZW1zW3RlbXBsYXRlSXRlbXMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgaWYgKGFkZFRvTGlzdCB8fCBhZGRUb0NvbnRlbnQpIHtcbiAgICAgICAgICAvLyDrpqzsiqTtirgg7JqU7IaM7JeQIOy2lOqwgFxuICAgICAgICAgIGlmIChsYXN0SXRlbS50eXBlID09PSAnbGlzdCcgfHwgbGFzdEl0ZW0udHlwZSA9PT0gJ2JveCcpIHtcbiAgICAgICAgICAgIC8vIOydtOuvuCDsnojripQg66as7Iqk7Yq4IOuCtOyaqeyXkCDsg4gg66as7Iqk7Yq4IOyVhOydtO2FnCDrmJDripQg64K07Jqp7JeQIOy2lOqwgFxuICAgICAgICAgICAgbGFzdEl0ZW0uY29udGVudCArPSAnXFxuJyArIGJ1dHRvbkhUTUw7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIOq4sOuzuCDsnITsuZjsl5Ag7LaU6rCAICjssrTtgazrsJXsiqQg7ISg7YOdIOyXhuydhCDrlYwpXG4gICAgICAgICAgaWYgKCFsYXN0SXRlbS5idXR0b25IVE1MKSB7XG4gICAgICAgICAgICBsYXN0SXRlbS5idXR0b25IVE1MID0gYnV0dG9uSFRNTDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFzdEl0ZW0uYnV0dG9uSFRNTCArPSAnXFxuJyArIGJ1dHRvbkhUTUw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJ1dHRvbkVsZW1lbnREaWFsb2cuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b25UZXh0JykudmFsdWUgPSAnJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b25DbGFzcycpLnZhbHVlID0gJyc7XG4gICAgfSk7XG5cbiAgICAvLyDrp4Htgawg7LaU6rCAIOyymOumrCDtlajsiJgg7IiY7KCVXG4gICAgaW5zZXJ0TGlua0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBsaW5rVGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVGV4dCcpLnZhbHVlLnRyaW0oKTtcbiAgICAgIGNvbnN0IGxpbmtVcmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1VybCcpLnZhbHVlLnRyaW0oKTtcblxuICAgICAgaWYgKCFsaW5rVGV4dCkge1xuICAgICAgICBhbGVydCgn66eB7YGsIO2FjeyKpO2KuOulvCDsnoXroKXtlbTso7zshLjsmpQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsaW5rVXJsKSB7XG4gICAgICAgIGFsZXJ0KCfrp4HtgawgVVJM7J2EIOyeheugpe2VtOyjvOyEuOyalC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsaW5rSFRNTCA9IGA8YSBocmVmPVwiJHtsaW5rVXJsfVwiPiR7bGlua1RleHR9PC9hPmA7XG5cbiAgICAgIGluc2VydEF0Q3Vyc29yKGNvbnRlbnRUZXh0YXJlYSwgbGlua0hUTUwpO1xuXG4gICAgICAvLyB0ZW1wbGF0ZUl0ZW1zIOuwsOyXtCDsl4XrjbDsnbTtirggLSB0ZXh0YXJlYeydmCDsg4gg6rCS7Jy866GcIOyXheuNsOydtO2KuFxuICAgICAgaWYgKHRlbXBsYXRlSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyDtmITsnqwg7ISg7YOd65CcIO2VreuqqeydtCDsl4bsnLzrqbQg6rCA7J6lIOy1nOq3vCDtla3rqqkg7JeF642w7J207Yq4XG4gICAgICAgIGNvbnN0IGxhc3RJdGVtID0gdGVtcGxhdGVJdGVtc1t0ZW1wbGF0ZUl0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICBsYXN0SXRlbS5jb250ZW50ID0gY29udGVudFRleHRhcmVhLnZhbHVlO1xuICAgICAgfVxuXG4gICAgICBsaW5rRWxlbWVudERpYWxvZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtUZXh0JykudmFsdWUgPSAnJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rVXJsJykudmFsdWUgPSAnJztcbiAgICB9KTtcblxuICAgIC8vIOuyhO2KvCDstpTqsIAg7Leo7IaMXG4gICAgY2FuY2VsQnV0dG9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGJ1dHRvbkVsZW1lbnREaWFsb2cuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b25UZXh0JykudmFsdWUgPSAnJztcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b25DbGFzcycpLnZhbHVlID0gJyc7XG4gICAgfSk7XG5cbiAgICAvLyDrp4Htgawg7LaU6rCAIOyymOumrFxuICAgIGluc2VydExpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgbGlua1RleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1RleHQnKS52YWx1ZS50cmltKCk7XG4gICAgICBjb25zdCBsaW5rVXJsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtVcmwnKS52YWx1ZS50cmltKCk7XG5cbiAgICAgIGlmICghbGlua1RleHQpIHtcbiAgICAgICAgYWxlcnQoJ+unge2BrCDthY3siqTtirjrpbwg7J6F66Cl7ZW07KO87IS47JqULicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghbGlua1VybCkge1xuICAgICAgICBhbGVydCgn66eB7YGsIFVSTOydhCDsnoXroKXtlbTso7zshLjsmpQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGlua0hUTUwgPSBgPGEgaHJlZj1cIiR7bGlua1VybH1cIj4ke2xpbmtUZXh0fTwvYT5gO1xuXG4gICAgICBpbnNlcnRBdEN1cnNvcihjb250ZW50VGV4dGFyZWEsIGxpbmtIVE1MKTtcbiAgICAgIGxpbmtFbGVtZW50RGlhbG9nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1RleHQnKS52YWx1ZSA9ICcnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtVcmwnKS52YWx1ZSA9ICcnO1xuICAgIH0pO1xuXG4gICAgLy8g66eB7YGsIOy2lOqwgCDst6jshoxcbiAgICBjYW5jZWxMaW5rRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGxpbmtFbGVtZW50RGlhbG9nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua1RleHQnKS52YWx1ZSA9ICcnO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtVcmwnKS52YWx1ZSA9ICcnO1xuICAgIH0pO1xuXG4gICAgLy8g7Luk7IScIOychOy5mOyXkCDthY3siqTtirgg7IK97J6FXG4gICAgZnVuY3Rpb24gaW5zZXJ0QXRDdXJzb3IodGV4dGFyZWEsIHRleHQpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGV4dGFyZWEuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICBjb25zdCBlbmQgPSB0ZXh0YXJlYS5zZWxlY3Rpb25FbmQ7XG5cbiAgICAgIHRleHRhcmVhLnZhbHVlID0gdGV4dGFyZWEudmFsdWUuc3Vic3RyaW5nKDAsIHN0YXJ0KSArIHRleHQgKyB0ZXh0YXJlYS52YWx1ZS5zdWJzdHJpbmcoZW5kKTtcblxuICAgICAgLy8g7Luk7IScIOychOy5mCDsnqzshKTsoJVcbiAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgICB0ZXh0YXJlYS5zZWxlY3Rpb25TdGFydCA9IHN0YXJ0ICsgdGV4dC5sZW5ndGg7XG4gICAgICB0ZXh0YXJlYS5zZWxlY3Rpb25FbmQgPSBzdGFydCArIHRleHQubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIC8vIOuqqOuLrCDsnbTrsqTtirgg67CU7J2465SpXG4gIGZ1bmN0aW9uIGJpbmRNb2RhbEV2ZW50cygpIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcml2YWN5UG9saWN5TW9kYWwnKTtcbiAgICBjb25zdCBtb2RhbERpbW0gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtZGltbScpO1xuICAgIGNvbnN0IG1vZGFsQ29udGFpbmVyID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWNvbnRhaW5lcicpO1xuICAgIGNvbnN0IGNsb3NlQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsLWNsb3NlJyk7XG4gICAgY29uc3QgY2xvc2VCdG5Gb290ZXIgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2xvc2UtYnRuJyk7XG4gICAgY29uc3QgYWRkSXRlbUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRJdGVtJyk7XG4gICAgY29uc3QgYWRkQ29kZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRDb2RlJyk7XG4gICAgY29uc3QgZGVsZXRlSXRlbUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGVJdGVtJyk7XG4gICAgY29uc3QgY29weUNvZGVCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcuY29weS1jb2RlLWJ0bicpO1xuICAgIGNvbnN0IHRlbXBsYXRlVHlwZVNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wbGF0ZVR5cGUnKTtcblxuICAgIC8vIO2FnO2UjOumvyDtla3rqqkg642w7J207YSwXG4gICAgLy8gY29uc3QgdGVtcGxhdGVJdGVtcyA9IFtdO1xuXG4gICAgLy8g66qo64usIOuLq+q4sCDtlajsiJhcbiAgICBjb25zdCBjbG9zZU1vZGFsID0gKCkgPT4ge1xuICAgICAgbW9kYWxEaW1tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBtb2RhbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9O1xuXG4gICAgLy8g66qo64usIOyXtOq4sCDtlajsiJhcbiAgICBjb25zdCBvcGVuTW9kYWwgPSAoKSA9PiB7XG4gICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIG1vZGFsRGltbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIG1vZGFsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgfTtcblxuICAgIC8vIOuLq+q4sCDrsoTtirwg7J2067Kk7Yq4XG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsKTtcbiAgICBjbG9zZUJ0bkZvb3Rlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xuICAgIG1vZGFsRGltbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xuXG4gICAgLy8g7YWc7ZSM66a/IOycoO2YlSDrs4Dqsr0g7J2067Kk7Yq4XG4gICAgdGVtcGxhdGVUeXBlU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIO2FnO2UjOumvyDsnKDtmJUg67OA6rK9IOyLnCDrqqjrk6Ag7J6F66ClIO2VhOuTnCDstIjquLDtmZRcbiAgICAgIC8vIDEuIOyeheugpSDtlYTrk5wg7LSI6riw7ZmUXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbVRpdGxlJykudmFsdWUgPSAnJzsgLy8g7KCc66qpIOy0iOq4sO2ZlFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l0ZW1Db250ZW50JykudmFsdWUgPSAnJzsgLy8g64K07JqpIOy0iOq4sO2ZlFxuXG4gICAgICAvLyAyLiDthZztlIzrpr8g7ZWt66qpIOuNsOydtO2EsCDstIjquLDtmZRcbiAgICAgIHRlbXBsYXRlSXRlbXMubGVuZ3RoID0gMDtcblxuICAgICAgLy8gMy4g66+466as67O06riwIOy0iOq4sO2ZlFxuICAgICAgdXBkYXRlUHJldmlldygpO1xuXG4gICAgICAvLyA0LiDsg53shLHrkJwg7L2U65OcIOy0iOq4sO2ZlFxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dlbmVyYXRlZENvZGUnKS52YWx1ZSA9ICcnO1xuXG4gICAgICAvLyA1LiDsmIjsi5wg7JeF642w7J207Yq4ICjthZztlIzrpr8g7Jyg7ZiV7JeQIOuUsOudvCDsmIjsi5wg67OA6rK9KVxuICAgICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtVGl0bGUnKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtQ29udGVudCcpO1xuICAgICAgY29uc3QgdGVtcGxhdGVUeXBlID0gdGVtcGxhdGVUeXBlU2VsZWN0LnZhbHVlO1xuICAgICAgY29uc3QgbGlzdFR5cGVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdFR5cGVDb250YWluZXInKTtcblxuICAgICAgLy8g66as7Iqk7Yq4IOycoO2YlSDshKDtg50g7Ji17IWYIO2RnOyLnC/siKjquYBcbiAgICAgIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ3RpdGxlJykge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWxlbWVudHMtc2VjdGlvbicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9IGVsc2UgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2xpc3QnKSB7XG4gICAgICAgIGxpc3RUeXBlQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWxlbWVudHMtc2VjdGlvbicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkVG9MaXN0JykucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkVG9Db250ZW50JykucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0VHlwZUNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWxlbWVudHMtc2VjdGlvbicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkVG9MaXN0JykucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRUb0NvbnRlbnQnKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCh0ZW1wbGF0ZVR5cGUpIHtcbiAgICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgICAgdGl0bGVJbnB1dC5wbGFjZWhvbGRlciA9ICftg4DsnbTti4AnO1xuICAgICAgICBjb250ZW50SW5wdXQucGxhY2Vob2xkZXIgPSAn64K07JqpIOyXhuydjCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgIHRpdGxlSW5wdXQucGxhY2Vob2xkZXIgPSAn7YOA7J207YuAJztcbiAgICAgICAgY29udGVudElucHV0LnBsYWNlaG9sZGVyID0gJ+uCtOyaqSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYm94JzpcbiAgICAgICAgdGl0bGVJbnB1dC5wbGFjZWhvbGRlciA9ICftg4DsnbTti4AnO1xuICAgICAgICBjb250ZW50SW5wdXQucGxhY2Vob2xkZXIgPSAn64K07JqpJztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDrr7jrpqwg67O06riwIOuwjyDsvZTrk5wg7IOd7ISxIOuyhO2KvCDsnbTrsqTtirhcbiAgICBhZGRJdGVtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgYWRkVGVtcGxhdGVJdGVtKCk7XG4gICAgICAvLyBnZW5lcmF0ZVRlbXBsYXRlQ29kZSgpO1xuICAgIH0pO1xuXG4gICAgLy8g66+466asIOuztOq4sCDrsI8g7L2U65OcIOyDneyEsSDrsoTtirwg7J2067Kk7Yq4XG4gICAgYWRkQ29kZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIC8vIGFkZFRlbXBsYXRlSXRlbSgpO1xuICAgICAgZ2VuZXJhdGVUZW1wbGF0ZUNvZGUoKTtcbiAgICB9KTtcblxuICAgIC8vIOy0iOq4sO2ZlCDrsoTtirwg7J2067Kk7Yq4XG4gICAgZGVsZXRlSXRlbUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHJlc2V0VGVtcGxhdGVJdGVtcygpO1xuICAgIH0pO1xuXG4gICAgLy8g7L2U65OcIOuzteyCrCDrsoTtirwg7J2067Kk7Yq4XG4gICAgY29weUNvZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRDb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dlbmVyYXRlZENvZGUnKTtcbiAgICAgIGdlbmVyYXRlZENvZGUuc2VsZWN0KCk7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgICAgYWxlcnQoJ+y9lOuTnOqwgCDtgbTrpr3rs7Trk5zsl5Ag67O17IKs65CY7JeI7Iq164uI64ukLicpO1xuICAgIH0pO1xuXG4gICAgLy8g7YWc7ZSM66a/IO2VreuqqSDstpTqsIAg7ZWo7IiYXG4gICAgZnVuY3Rpb24gYWRkVGVtcGxhdGVJdGVtKCkge1xuICAgICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtVGl0bGUnKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdGVtQ29udGVudCcpO1xuICAgICAgY29uc3QgdGVtcGxhdGVUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlbXBsYXRlVHlwZScpLnZhbHVlO1xuICAgICAgY29uc3QgdGl0bGUgPSB0aXRsZUlucHV0LnZhbHVlLnRyaW0oKTtcbiAgICAgIGxldCBjb250ZW50ID0gY29udGVudElucHV0LnZhbHVlLnRyaW0oKTtcbiAgICAgIGxldCBsaXN0VHlwZSA9IG51bGw7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdsaXN0Jykge1xuICAgICAgICAvLyDrpqzsiqTtirgg7Jyg7ZiV7J28IOqyveyasCDrpqzsiqTtirgg7Jyg7ZiVIOqwgOyguOyYpOq4sFxuICAgICAgICBsaXN0VHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0VHlwZScpLnZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAndGl0bGUnKSB7XG4gICAgICAgIC8vIO2DgOydtO2LgCDsnKDtmJXsnbwg6rK97JqwIOuCtOyaqSDtlYTrk5wg6rKA7IKsIOyDneuetVxuICAgICAgICBpZiAoIXRpdGxlKSB7XG4gICAgICAgICAgYWxlcnQoJ+ygnOuqqeydhCDsnoXroKXtlbTso7zshLjsmpQuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIO2DgOydtO2LgOydgCDrgrTsmqnsnbQg7JeG7Ja064+EIOuQqFxuICAgICAgICBjb250ZW50ID0gY29udGVudCB8fCAn64K07JqpIOyXhuydjCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyDri6Trpbgg7Jyg7ZiV7J28IOqyveyasCDsoJzrqqnqs7wg64K07JqpIOuqqOuRkCDtlYTsmpRcbiAgICAgICAgaWYgKCF0aXRsZSB8fCAhY29udGVudCkge1xuICAgICAgICAgIGFsZXJ0KCfsoJzrqqnqs7wg64K07Jqp7J2EIOuqqOuRkCDsnoXroKXtlbTso7zshLjsmpQuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRlbXBsYXRlSXRlbXMucHVzaCh7XG4gICAgICAgIHR5cGU6IHRlbXBsYXRlVHlwZSxcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICBjb250ZW50OiBjb250ZW50LFxuICAgICAgICBsaXN0VHlwZTogbGlzdFR5cGUsXG4gICAgICAgIGJ1dHRvbkhUTUw6ICcnLFxuICAgICAgfSk7XG4gICAgICB1cGRhdGVQcmV2aWV3KCk7XG5cbiAgICAgIC8vIOyeheugpSDtlYTrk5wg7LSI6riw7ZmUXG4gICAgICB0aXRsZUlucHV0LnZhbHVlID0gJyc7XG4gICAgICBjb250ZW50SW5wdXQudmFsdWUgPSAnJztcbiAgICAgIHRpdGxlSW5wdXQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvLyDthZztlIzrpr8g7ZWt66qpIOy0iOq4sO2ZlCDtlajsiJhcbiAgICBmdW5jdGlvbiByZXNldFRlbXBsYXRlSXRlbXMoKSB7XG4gICAgICBpZiAodGVtcGxhdGVJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRlbXBsYXRlSXRlbXMubGVuZ3RoID0gMDtcbiAgICAgICAgdXBkYXRlUHJldmlldygpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2VuZXJhdGVkQ29kZScpLnZhbHVlID0gJyc7XG4gICAgICAgIGFsZXJ0KCfrqqjrk6Ag7ZWt66qp7J20IOy0iOq4sO2ZlOuQmOyXiOyKteuLiOuLpC4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KCfstIjquLDtmZTtlaAg7ZWt66qp7J20IOyXhuyKteuLiOuLpC4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDrr7jrpqzrs7TquLAg7JeF642w7J207Yq4IO2VqOyImFxuICAgIGZ1bmN0aW9uIHVwZGF0ZVByZXZpZXcoKSB7XG4gICAgICBjb25zdCBwcmV2aWV3Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZXZpZXdDb250YWluZXInKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlVHlwZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wbGF0ZVR5cGUnKS52YWx1ZTtcblxuICAgICAgbGV0IHByZXZpZXdIVE1MID0gJyc7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZUl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBwcmV2aWV3Q29udGFpbmVyLmlubmVySFRNTCA9ICc8cD7rr7jrpqzrs7TquLAg7JiB7JetPC9wPic7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3dpdGNoICh0ZW1wbGF0ZVR5cGUpIHtcbiAgICAgIGNhc2UgJ3RpdGxlJzpcbiAgICAgICAgcHJldmlld0hUTUwgPSBnZW5lcmF0ZUZ1bGxUaXRsZVByZXZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgcHJldmlld0hUTUwgPSBnZW5lcmF0ZUxpc3RQcmV2aWV3KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYm94JzpcbiAgICAgICAgcHJldmlld0hUTUwgPSBnZW5lcmF0ZUJveFByZXZpZXcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHByZXZpZXdDb250YWluZXIuaW5uZXJIVE1MID0gcHJldmlld0hUTUw7XG4gICAgfVxuXG4gICAgLy8g7YOA7J207YuAIOuvuOumrOuztOq4sCDsg53shLFcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUZ1bGxUaXRsZVByZXZpZXcoKSB7XG4gICAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgICB0ZW1wbGF0ZUl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJwb2xpY3ktaXRlbVwiPic7XG4gICAgICAgIGh0bWwgKz0gJzxzcGFuIGNsYXNzPVwicG9saWN5LXRpdGxlXCI+JyArIGl0ZW0udGl0bGUgKyAnPC9zcGFuPic7XG5cbiAgICAgICAgLy8g64K07Jqp7J20ICfrgrTsmqkg7JeG7J2MJ+ydtCDslYTri4wg6rK97Jqw7JeQ66eMIHBvbGljeS1jb250ZW50IOy2lOqwgFxuICAgICAgICBpZiAoaXRlbS5jb250ZW50ICYmIGl0ZW0uY29udGVudCAhPT0gJ+uCtOyaqSDsl4bsnYwnKSB7XG4gICAgICAgICAgaHRtbCArPSAnPGRpdiBjbGFzcz1cInBvbGljeS1jb250ZW50XCI+JyArIGl0ZW0uY29udGVudCArICc8L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIGh0bWwgKz0gJzwvZGl2Pic7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgLy8g66+466as67O06riwIOyDneyEsVxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlTGlzdFByZXZpZXcoKSB7XG4gICAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgICB0ZW1wbGF0ZUl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJwb2xpY3ktaXRlbVwiPic7XG4gICAgICAgIGh0bWwgKz0gJzxzcGFuIGNsYXNzPVwicG9saWN5LXRpdGxlXCI+JyArIGl0ZW0udGl0bGUgKyAnPC9zcGFuPic7XG5cbiAgICAgICAgLy8g64K07Jqp7J20IOyeiOuKlCDqsr3smrDsl5Drp4wgcG9saWN5LWxpc3Qg7LaU6rCAXG4gICAgICAgIGlmIChpdGVtLmNvbnRlbnQgJiYgaXRlbS5jb250ZW50LnRyaW0oKSkge1xuICAgICAgICAgIGNvbnN0IGxpc3RUeXBlID0gaXRlbS5saXN0VHlwZSB8fCAndWwnO1xuXG4gICAgICAgICAgaWYgKGxpc3RUeXBlID09PSAnaHlwaGVuJykge1xuICAgICAgICAgICAgaHRtbCArPSAnPHVsIGNsYXNzPVwicG9saWN5LWxpc3QgaHlwaGVuLWxpc3RcIj4nO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGlzdFR5cGUgPT09ICdvbCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJzxvbCBjbGFzcz1cInBvbGljeS1saXN0XCI+JztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHRtbCArPSAnPHVsIGNsYXNzPVwicG9saWN5LWxpc3RcIj4nOyAgLy8g6riw67O46rCS7J2AIHVsXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8g7KSR7LKpIOumrOyKpO2KuCDsspjrpqxcbiAgICAgICAgICBjb25zdCBwcm9jZXNzTmVzdGVkTGlzdCA9IChjb250ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXS50cmltKCk7XG4gICAgICAgICAgICAgIGlmICghbGluZSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgLy8g65Ok7Jes7JOw6riw6rCAIOyeiOuKlOyngCDtmZXsnbggKO2DrSDrmJDripQg6rO167CxIDLqsJwg7J207IOBKVxuICAgICAgICAgICAgICBjb25zdCBpbmRlbnRhdGlvbiA9IGxpbmVzW2ldLm1hdGNoKC9eKFxccyspLyk7XG5cbiAgICAgICAgICAgICAgaWYgKGluZGVudGF0aW9uICYmIChpbmRlbnRhdGlvblsxXS5sZW5ndGggPj0gMiB8fCBpbmRlbnRhdGlvblsxXS5pbmNsdWRlcygnXFx0JykpKSB7XG4gICAgICAgICAgICAgICAgLy8g7J207KCEIOykhOydtCDrpqzsiqTtirgg7JWE7J207YWc7J2066m0IOykkeyyqSDrpqzsiqTtirgg7Iuc7J6RXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwICYmIHJlc3VsdC5lbmRzV2l0aCgnPC9saT4nKSkge1xuICAgICAgICAgICAgICAgICAgLy8g66eI7KeA66eJIDwvbGk+IOygnOqxsFxuICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZygwLCByZXN1bHQubGVuZ3RoIC0gNSk7XG4gICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJzx1bCBjbGFzcz1cIm5lc3RlZC1saXN0XCI+JztcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnPGxpPicgKyBwcmVzZXJ2ZUhUTUxUYWdzKGxpbmUpICsgJzwvbGk+JztcblxuICAgICAgICAgICAgICAgICAgLy8g64uk7J2MIOykhOuPhCDrk6Tsl6zsk7DquLDqsIAg7J6I64qU7KeAIO2ZleyduFxuICAgICAgICAgICAgICAgICAgbGV0IGogPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgbGluZXMubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbal0udHJpbSgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbal0ubWF0Y2goL14oXFxzKykvKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIChsaW5lc1tqXS5tYXRjaCgvXihcXHMrKS8pWzFdLmxlbmd0aCA+PSAyIHx8IGxpbmVzW2pdLm1hdGNoKC9eKFxccyspLylbMV0uaW5jbHVkZXMoJ1xcdCcpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJzxsaT4nICsgcHJlc2VydmVIVE1MVGFncyhsaW5lc1tqXS50cmltKCkpICsgJzwvbGk+JztcbiAgICAgICAgICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJzwvdWw+PC9saT4nO1xuICAgICAgICAgICAgICAgICAgaSA9IGogLSAxOyAvLyDri6TsnYwg67CY67O17JeQ7IScIOyymOumrO2VoCDsnbjrjbHsiqQg7KGw7KCVXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnPGxpPicgKyBwcmVzZXJ2ZUhUTUxUYWdzKGxpbmUpICsgJzwvbGk+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9ICc8bGk+JyArIGxpbmUgKyAnPC9saT4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGh0bWwgKz0gcHJvY2Vzc05lc3RlZExpc3QoaXRlbS5jb250ZW50KTtcbiAgICAgICAgICBpZiAobGlzdFR5cGUgPT09ICdvbCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJzwvb2w+JztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHRtbCArPSAnPC91bD4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBodG1sICs9ICc8L2Rpdj4nO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIC8vIOuvuOumrOuztOq4sCDsg53shLFcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUJveFByZXZpZXcoKSB7XG4gICAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgICB0ZW1wbGF0ZUl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJwb2xpY3ktaXRlbVwiPic7XG4gICAgICAgIGh0bWwgKz0gJzxzcGFuIGNsYXNzPVwicG9saWN5LXRpdGxlXCI+JyArIGl0ZW0udGl0bGUgKyAnPC9zcGFuPic7XG5cbiAgICAgICAgLy8g64K07Jqp7J20IOyeiOuKlCDqsr3smrDsl5Drp4wgcG9saWN5LWNvbnRlbnQg7LaU6rCAXG4gICAgICAgIGlmIChpdGVtLmNvbnRlbnQgJiYgaXRlbS5jb250ZW50LnRyaW0oKSkge1xuICAgICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJwb2xpY3ktY29udGVudCBib3gtc3R5bGVcIj4nICsgaXRlbS5jb250ZW50ICsgJzwvZGl2Pic7XG4gICAgICAgIH1cbiAgICAgICAgaHRtbCArPSAnPC9kaXY+JztcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG5cbiAgICAvLyDsvZTrk5wg7IOd7ISxIO2VqOyImFxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlVGVtcGxhdGVDb2RlKCkge1xuICAgICAgY29uc3QgdGVtcGxhdGVUeXBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlbXBsYXRlVHlwZScpLnZhbHVlO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkQ29kZUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2VuZXJhdGVkQ29kZScpO1xuXG4gICAgICBpZiAodGVtcGxhdGVJdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYWxlcnQoJ+yDneyEse2VoCDtla3rqqnsnbQg7JeG7Iq164uI64ukLiDtla3rqqnsnYQg66i87KCAIOy2lOqwgO2VtOyjvOyEuOyalC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgZ2VuZXJhdGVkSFRNTCA9ICcnO1xuXG4gICAgICBzd2l0Y2ggKHRlbXBsYXRlVHlwZSkge1xuICAgICAgY2FzZSAndGl0bGUnOlxuICAgICAgICBnZW5lcmF0ZWRIVE1MID0gZ2VuZXJhdGVGdWxsVGl0bGVIVE1MKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgIGdlbmVyYXRlZEhUTUwgPSBnZW5lcmF0ZUxpc3RIVE1MKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYm94JzpcbiAgICAgICAgZ2VuZXJhdGVkSFRNTCA9IGdlbmVyYXRlQm94SFRNTCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgZ2VuZXJhdGVkQ29kZUVsZW0udmFsdWUgPSBnZW5lcmF0ZWRIVE1MO1xuICAgIH1cblxuICAgIC8vIO2DgOydtO2LgCBIVE1MIOyDneyEsVxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlRnVsbFRpdGxlSFRNTCgpIHtcbiAgICAgIGxldCBodG1sID0gJyc7XG5cbiAgICAgIHRlbXBsYXRlSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaHRtbCArPSAnICA8ZGl2IGNsYXNzPVwicG9saWN5LWl0ZW1cIj5cXG4nO1xuICAgICAgICBodG1sICs9ICcgICAgPHNwYW4gY2xhc3M9XCJwb2xpY3ktdGl0bGVcIj4nICsgaXRlbS50aXRsZSArICc8L3NwYW4+XFxuJztcblxuICAgICAgICAvLyDrgrTsmqnsnbQgJ+uCtOyaqSDsl4bsnYwn7J20IOyVhOuLjCDqsr3smrDsl5Drp4wgcG9saWN5LWNvbnRlbnQg7LaU6rCAXG4gICAgICAgIGlmIChpdGVtLmNvbnRlbnQgJiYgaXRlbS5jb250ZW50ICE9PSAn64K07JqpIOyXhuydjCcpIHtcbiAgICAgICAgICBodG1sICs9ICcgICAgPGRpdiBjbGFzcz1cInBvbGljeS1jb250ZW50XCI+JyArIGl0ZW0uY29udGVudCArICc8L2Rpdj5cXG4nO1xuICAgICAgICB9XG5cbiAgICAgICAgaHRtbCArPSAnICA8L2Rpdj5cXG4nO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIC8vIEhUTUwg7IOd7ISxXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVMaXN0SFRNTCgpIHtcbiAgICAgIGxldCBodG1sID0gJyc7XG5cbiAgICAgIHRlbXBsYXRlSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaHRtbCArPSAnICA8ZGl2IGNsYXNzPVwicG9saWN5LWl0ZW1cIj5cXG4nO1xuICAgICAgICBodG1sICs9ICcgICAgPHNwYW4gY2xhc3M9XCJwb2xpY3ktdGl0bGVcIj4nICsgaXRlbS50aXRsZSArICc8L3NwYW4+XFxuJztcblxuICAgICAgICAvLyDrgrTsmqnsnbQg7J6I64qUIOqyveyasOyXkOunjCBwb2xpY3ktbGlzdCDstpTqsIBcbiAgICAgICAgaWYgKGl0ZW0uY29udGVudCAmJiBpdGVtLmNvbnRlbnQudHJpbSgpKSB7XG4gICAgICAgICAgY29uc3QgbGlzdFR5cGUgPSBpdGVtLmxpc3RUeXBlIHx8ICd1bCc7XG5cbiAgICAgICAgICBpZiAobGlzdFR5cGUgPT09ICdoeXBoZW4nKSB7XG4gICAgICAgICAgICBodG1sICs9ICcgICAgPHVsIGNsYXNzPVwicG9saWN5LWxpc3QgaHlwaGVuLWxpc3RcIj5cXG4nO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGlzdFR5cGUgPT09ICdvbCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJyAgICA8b2wgY2xhc3M9XCJwb2xpY3ktbGlzdFwiPlxcbic7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJyAgICA8dWwgY2xhc3M9XCJwb2xpY3ktbGlzdFwiPlxcbic7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8g7KSR7LKpIOumrOyKpO2KuCDsspjrpqxcbiAgICAgICAgICBjb25zdCBwcm9jZXNzTmVzdGVkTGlzdCA9IChjb250ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXS50cmltKCk7XG4gICAgICAgICAgICAgIGlmICghbGluZSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgLy8g65Ok7Jes7JOw6riw6rCAIOyeiOuKlOyngCDtmZXsnbggKO2DrSDrmJDripQg6rO167CxIDLqsJwg7J207IOBKVxuICAgICAgICAgICAgICBjb25zdCBpbmRlbnRhdGlvbiA9IGxpbmVzW2ldLm1hdGNoKC9eKFxccyspLyk7XG5cbiAgICAgICAgICAgICAgaWYgKGluZGVudGF0aW9uICYmIChpbmRlbnRhdGlvblsxXS5sZW5ndGggPj0gMiB8fCBpbmRlbnRhdGlvblsxXS5pbmNsdWRlcygnXFx0JykpKSB7XG4gICAgICAgICAgICAgICAgLy8g7J207KCEIOykhOydtCDrpqzsiqTtirgg7JWE7J207YWc7J2066m0IOykkeyyqSDrpqzsiqTtirgg7Iuc7J6RXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwICYmIHJlc3VsdC5lbmRzV2l0aCgnPC9saT5cXG4nKSkge1xuICAgICAgICAgICAgICAgICAgLy8g66eI7KeA66eJIDwvbGk+IOygnOqxsFxuICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cmluZygwLCByZXN1bHQubGVuZ3RoIC0gNik7XG4gICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJ1xcbiAgICAgICAgPHVsIGNsYXNzPVwibmVzdGVkLWxpc3RcIj5cXG4nO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgICAgICAgICAgPGxpPicgKyBwcmVzZXJ2ZUhUTUxUYWdzKGxpbmUpICsgJzwvbGk+XFxuJztcblxuICAgICAgICAgICAgICAgICAgLy8g64uk7J2MIOykhOuPhCDrk6Tsl6zsk7DquLDqsIAg7J6I64qU7KeAIO2ZleyduFxuICAgICAgICAgICAgICAgICAgbGV0IGogPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgbGluZXMubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbal0udHJpbSgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbal0ubWF0Y2goL14oXFxzKykvKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIChsaW5lc1tqXS5tYXRjaCgvXihcXHMrKS8pWzFdLmxlbmd0aCA+PSAyIHx8IGxpbmVzW2pdLm1hdGNoKC9eKFxccyspLylbMV0uaW5jbHVkZXMoJ1xcdCcpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gJyAgICAgICAgICA8bGk+JyArIHByZXNlcnZlSFRNTFRhZ3MobGluZXNbal0udHJpbSgpKSArICc8L2xpPlxcbic7XG4gICAgICAgICAgICAgICAgICAgIGorKztcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgICAgICAgIDwvdWw+XFxuICAgICAgPC9saT5cXG4nO1xuICAgICAgICAgICAgICAgICAgaSA9IGogLSAxOyAvLyDri6TsnYwg67CY67O17JeQ7IScIOyymOumrO2VoCDsnbjrjbHsiqQg7KGw7KCVXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnICAgICAgPGxpPicgKyBsaW5lICsgJzwvbGk+XFxuJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgICAgICA8bGk+JyArIGxpbmUgKyAnPC9saT5cXG4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGh0bWwgKz0gcHJvY2Vzc05lc3RlZExpc3QoaXRlbS5jb250ZW50KTtcbiAgICAgICAgICBpZiAobGlzdFR5cGUgPT09ICdvbCcpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJyAgICA8L29sPlxcbic7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJyAgICA8L3VsPlxcbic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uYnV0dG9uSFRNTCkge1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAnICsgaXRlbS5idXR0b25IVE1MICsgJ1xcbic7XG4gICAgICAgIH1cblxuICAgICAgICBodG1sICs9ICcgIDwvZGl2Plxcbic7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgLy8gSFRNTCDsg53shLFcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUJveEhUTUwoKSB7XG4gICAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgICB0ZW1wbGF0ZUl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGh0bWwgKz0gJyAgPGRpdiBjbGFzcz1cInBvbGljeS1pdGVtXCI+XFxuJztcbiAgICAgICAgaHRtbCArPSAnICAgIDxzcGFuIGNsYXNzPVwicG9saWN5LXRpdGxlXCI+JyArIGl0ZW0udGl0bGUgKyAnPC9zcGFuPlxcbic7XG5cbiAgICAgICAgLy8g64K07Jqp7J20IOyeiOuKlCDqsr3smrDsl5Drp4wgcG9saWN5LWNvbnRlbnQg7LaU6rCAXG4gICAgICAgIGlmIChpdGVtLmNvbnRlbnQgJiYgaXRlbS5jb250ZW50LnRyaW0oKSkge1xuICAgICAgICAgIGh0bWwgKz0gJyAgICA8ZGl2IGNsYXNzPVwicG9saWN5LWNvbnRlbnQgYm94LXN0eWxlXCI+JyArIGl0ZW0uY29udGVudCArICc8L2Rpdj5cXG4nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uYnV0dG9uSFRNTCkge1xuICAgICAgICAgIGh0bWwgKz0gJyAgICAnICsgaXRlbS5idXR0b25IVE1MICsgJ1xcbic7XG4gICAgICAgIH1cblxuICAgICAgICBodG1sICs9ICcgIDwvZGl2Plxcbic7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuXG4gICAgLy8g7YOA7J6FIOuzgOqyvSDsnbTrsqTtirhcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVtcGxhdGVUeXBlJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZVR5cGUgPSB0aGlzLnZhbHVlO1xuICAgICAgY29uc3QgY29udGVudEdyb3VwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmlucHV0LWdyb3VwOm50aC1jaGlsZCgyKScpO1xuXG4gICAgICAvLyDtg4DsnbTti4Ag7Jyg7ZiV7J28IOqyveyasCDrgrTsmqkg7J6F66Cl656AIOyIqOq4sOq4sFxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ3RpdGxlJykge1xuICAgICAgICBjb250ZW50R3JvdXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRlbnRHcm91cC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH1cblxuICAgICAgdXBkYXRlUHJldmlldygpO1xuICAgIH0pO1xuXG4gICAgLy8g64uo7LaV7YKkIOydtOuypO2KuCDrpqzsiqTrhIjripQg7KCE7Jet7Jy866GcIOydtOuPme2WiOycvOuLiCDsl6zquLDshJzripQg7IKt7KCcXG4gIH1cblxuICAvLyDthZztlIzrpr8g7Jyg7ZiV67OEIOyYiOyLnCDstpTqsIBcbiAgZnVuY3Rpb24gYWRkVGVtcGxhdGVFeGFtcGxlcygpIHtcbiAgICBjb25zdCB0ZW1wbGF0ZVR5cGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVtcGxhdGVUeXBlJyk7XG5cbiAgICAvLyDstIjquLAg7JiI7IucIOyEpOyglSAo6riw67O4IO2DgOydtO2LgClcbiAgICB0ZW1wbGF0ZVR5cGUuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScpKTtcbiAgfVxuXG4gIC8vIOyghOyXrSDrs4DsiJjroZwg66qo64usIOygkeq3vO2VoCDsiJgg7J6I64+E66GdIOyEpOyglVxuICBsZXQgcHJpdmFjeVBvbGljeU1vZGFsO1xuICBsZXQgdGVtcGxhdGVJdGVtcyA9IFtdO1xuXG4gIC8vIOuqqOuLrCDsl7TquLAg7ZWo7IiYIC0g7KCE7JetIOyKpOy9lO2UhOuhnCDsnbTrj5lcbiAgZnVuY3Rpb24gb3BlblByaXZhY3lQb2xpY3lNb2RhbCgpIHtcbiAgICBpZiAoIXByaXZhY3lQb2xpY3lNb2RhbCkge1xuICAgICAgaW5pdFByaXZhY3lQb2xpY3lNb2RhbCgpO1xuICAgICAgcHJpdmFjeVBvbGljeU1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByaXZhY3lQb2xpY3lNb2RhbCcpO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGFsRGltbSA9IHByaXZhY3lQb2xpY3lNb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtZGltbScpO1xuICAgIGNvbnN0IG1vZGFsQ29udGFpbmVyID0gcHJpdmFjeVBvbGljeU1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1jb250YWluZXInKTtcblxuICAgIHByaXZhY3lQb2xpY3lNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBtb2RhbERpbW0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgbW9kYWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgfVxuXG4gIC8vIOuLqOy2le2CpCDsnbTrsqTtirgg66as7Iqk64SIIC0g7KCE7JetIOyKpOy9lO2UhOuhnCDsnbTrj5lcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgLy8gQWx0ICsgUDog7Yyd7JeFIOyXtOq4sFxuICAgIGlmIChlLmFsdEtleSAmJiBlLmtleSA9PT0gJ3AnKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBvcGVuUHJpdmFjeVBvbGljeU1vZGFsKCk7XG4gICAgfVxuXG4gICAgLy8g66qo64us7J20IOyXtOugpOyeiOydhCDrlYzrp4wg64uk66W4IOuLqOy2le2CpCDtmZzshLHtmZRcbiAgICBpZiAocHJpdmFjeVBvbGljeU1vZGFsICYmIHByaXZhY3lQb2xpY3lNb2RhbC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSB7XG4gICAgICAvLyBBbHQgKyBHOiDrr7jrpqwg67O06riwIOuwjyDsvZTrk5wg7IOd7ISxXG4gICAgICBpZiAoZS5hbHRLZXkgJiYgZS5rZXkgPT09ICdnJykge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGFkZEl0ZW1CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkSXRlbScpO1xuICAgICAgICBpZiAoYWRkSXRlbUJ0bikgYWRkSXRlbUJ0bi5jbGljaygpO1xuICAgICAgfVxuXG4gICAgICAvLyBBbHQgKyBDOiDstIjquLDtmZRcbiAgICAgIGlmIChlLmFsdEtleSAmJiBlLmtleSA9PT0gJ2MnKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZGVsZXRlSXRlbUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGVJdGVtJyk7XG4gICAgICAgIGlmIChkZWxldGVJdGVtQnRuKSBkZWxldGVJdGVtQnRuLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBET03snbQg66Gc65Oc65CcIO2bhCDstIjquLDtmZRcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGluaXRQcml2YWN5UG9saWN5TW9kYWwoKTtcbiAgICBhZGRUZW1wbGF0ZUV4YW1wbGVzKCk7XG4gICAgcHJpdmFjeVBvbGljeU1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByaXZhY3lQb2xpY3lNb2RhbCcpO1xuICAgIHNldHVwRm9ybWF0dGluZ1Rvb2xiYXIoKTsgLy8g7ISc7IudIO2ItOuwlCDstIjquLDtmZRcbiAgfSk7XG59KSgpO1xuIiwiZnVuY3Rpb24gc2VsZWN0Qm94VG1wbCgpIHtcbiAgY29uc3QgJHRlbXBsYXRlQ3VzdG9tSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiY29tYm8xXCIgY2xhc3M9XCJzZWxlY3QtYm94XCIgcm9sZT1cImNvbWJvYm94XCIgYXJpYS1jb250cm9scz1cImxpc3Rib3gxXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgYXJpYS1hY3RpdmVkZXNjZW5kYW50PVwiXCI+XG4gICAgICAgIDxzcGFuIHN0eWxlPVwicG9pbnRlci1ldmVudHM6IG5vbmU7XCI+JHt0ZXh0fTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zV3JhcChpdGVtc0hUTUwpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDx1bCBpZD1cImxpc3Rib3gxXCIgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uc1wiIHJvbGU9XCJsaXN0Ym94XCIgYXJpYS1sYWJlbGxlZGJ5PVwiY29tYm8xLWxhYmVsXCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICR7aXRlbXNIVE1MfVxuICAgICAgICA8L3VsPlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxsaSByb2xlPVwib3B0aW9uXCIgY2xhc3M9XCJvcHRpb25cIiBhcmlhLXNlbGVjdGVkPVwiJHtzZWxlY3RlZH1cIiBkYXRhLXZhbHVlPVwiJHtpdGVtLnZhbHVlfVwiPlxuICAgICAgICAgICR7aXRlbS50ZXh0fVxuICAgICAgICA8L2xpPlxuICAgICAgYDtcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0ICR0ZW1wbGF0ZUJhc2ljSFRNTCA9IHtcbiAgICBsYWJlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGlkPVwiY29tYm8xLWxhYmVsXCIgY2xhc3M9XCJjb21iby1sYWJlbFwiPiR7dGV4dH08L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzZWxlY3RCdG4odGV4dCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkIGRpc2FibGVkIGhpZGRlbj4ke3RleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gICAgaXRlbXNXcmFwKGl0ZW1zSFRNTCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPHNlbGVjdCBjbGFzcz1cInNlbGVjdC1saXN0XCIgcmVxdWlyZWQ+XG4gICAgICAgICAgJHtpdGVtc0hUTUx9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgYDtcbiAgICB9LFxuICAgIGl0ZW1zKGl0ZW0sIHNlbGVjdGVkID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCIke2l0ZW0udmFsdWV9XCI+JHtpdGVtLnRleHR9PC9vcHRpb24+XG4gICAgICBgO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAkdGVtcGxhdGVDdXN0b21IVE1MLFxuICAgICR0ZW1wbGF0ZUJhc2ljSFRNTCxcbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHN3aXBlclRtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSB7XG4gICAgbmF2aWdhdGlvbihjbGFzc05hbWUgPSAnJykge1xuICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1uYXZpZ2F0aW9uICR7Y2xhc3NOYW1lfVwiPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWJ1dHRvbi1wcmV2XCI+PHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPiR7ZXRVSS4kdCgnc3dpcGVyLm5hdmlnYXRpb24ucHJldicsICfsnbTsoIQg7Iqs65287J2065OcJyl9PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwic3dpcGVyLWJ1dHRvbi1uZXh0XCI+PHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPiR7ZXRVSS4kdCgnc3dpcGVyLm5hdmlnYXRpb24ubmV4dCcsICfri6TsnYwg7Iqs65287J2065OcJyl9PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBwYWdpbmF0aW9uKGNsYXNzTmFtZSA9ICcnKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLXBhZ2luYXRpb24gJHtjbGFzc05hbWV9XCI+PC9kaXY+XG4gICAgICBgO1xuICAgIH0sXG4gICAgYXV0b3BsYXkoKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLWF1dG9wbGF5LXdyYXBcIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInN3aXBlci1hdXRvcGxheSBwbGF5XCI+PHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPiR7ZXRVSS4kdCgnc3dpcGVyLmF1dG9wbGF5LnN0b3AnLCAn7KCV7KeAJyl9PC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBzd2lwZXJDb250cm9scygpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItY29udHJvbHNcIj48L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBwcmV2RWwoY2xhc3NOYW1lID0gbnVsbCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItbmF2aWdhdGlvbiAke2NsYXNzTmFtZX1cIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLXByZXZcIj48c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+JHtldFVJLiR0KCdzd2lwZXIubmF2aWdhdGlvbi5wcmV2JywgJ+ydtOyghCDsiqzrnbzsnbTrk5wnKX08L3NwYW4+PC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgICBuZXh0RWwoY2xhc3NOYW1lID0gbnVsbCkge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItbmF2aWdhdGlvbiAke2NsYXNzTmFtZX1cIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJzd2lwZXItYnV0dG9uLW5leHRcIj48c3BhbiBjbGFzcz1cImhpZGUtdHh0XCI+JHtldFVJLiR0KCdzd2lwZXIubmF2aWdhdGlvbi5uZXh0JywgJ+uLpOydjCDsiqzrnbzsnbTrk5wnKX08L3NwYW4+PC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIGA7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4ge1xuICAgICR0ZW1wbGF0ZUhUTUwsXG4gIH07XG59XG4iLCJmdW5jdGlvbiB0b2FzdFRtcGwoKSB7XG4gIGNvbnN0ICR0ZW1wbGF0ZUhUTUwgPSAoeyBtZXNzYWdlIH0pID0+IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdC1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbnRlbnRcIj5cbiAgICAgICAgICA8cCBjbGFzcz1cInRvYXN0LXR4dFwiPiR7bWVzc2FnZX08L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcbiAgY29uc3QgJHRlbXBsYXRDbG9zZUhUTUwgPSAoeyBtZXNzYWdlLCBjbG9zZVRleHQgfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9hc3QtY29udGVudFwiPlxuICAgICAgICAgIDxwIGNsYXNzPVwidG9hc3QtdHh0XCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwidG9hc3QtY2xvc2UtYnRuXCI+JHtjbG9zZVRleHR9PHNwYW4gY2xhc3M9XCJoaWRlLXR4dFwiPu2MneyXhSDri6vquLA8L3NwYW4+PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICBjb25zdCAkdGVtcGxhdGVMaW5rSFRNTCA9ICh7IG1lc3NhZ2UsIGxpbmsgfSkgPT4gYFxuICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidG9hc3QtY29udGVudFwiPlxuICAgICAgICAgIDxwIGNsYXNzPVwidG9hc3QtdHh0XCI+JHttZXNzYWdlfTwvcD5cbiAgICAgICAgICA8YSBocmVmPVwiJHtsaW5rfVwiIGNsYXNzPVwidG9hc3QtbGluay1idG5cIj7rp4Htgaw8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYDtcblxuICByZXR1cm4ge1xuICAgICR0ZW1wbGF0ZUhUTUwsXG4gICAgJHRlbXBsYXRDbG9zZUhUTUwsXG4gICAgJHRlbXBsYXRlTGlua0hUTUxcbiAgfTtcbn1cbiJdfQ==
