(function () {
  const btn = document.getElementById('get');
  const img = document.getElementById('result');
  const code = document.getElementById('code');
  const langSelect = document.getElementById('lang_select');
  const requiredNameMessage = (__global_data && __global_data.messages && __global_data.messages.requiredName) || 'Please input counter name.';

  const elements = {
    name: document.getElementById('name'),
    theme: document.getElementById('theme'),
    padding: document.getElementById('padding'),
    offset: document.getElementById('offset'),
    align: document.getElementById('align'),
    scale: document.getElementById('scale'),
    pixelated: document.getElementById('pixelated'),
    darkmode: document.getElementById('darkmode'),
    num: document.getElementById('num'),
    prefix: document.getElementById('prefix')
  };

  if (langSelect) {
    langSelect.addEventListener('change', handleLanguageChange);
  }

  if (!btn || !img || !code) {
    return;
  }

  hideResult({ clearSrc: true });

  btn.addEventListener('click', throttle(handleButtonClick, 500));
  code.addEventListener('click', selectCodeText);

  const mainTitle = document.querySelector('#main_title i');
  const themes = document.querySelector('#themes');
  const moreTheme = document.querySelector('#more_theme');

  mainTitle.addEventListener('click', throttle(() => party.sparkles(document.documentElement, { count: party.variation.range(40, 100) }), 1000));
  moreTheme.addEventListener('click', scrollToThemes);

  function handleButtonClick() {
    const { name, theme, padding, offset, align, scale, pixelated, darkmode, num, prefix } = elements;
    const nameValue = name.value.trim();

    if (!nameValue) {
      alert(requiredNameMessage);
      return;
    }

    const params = {
      name: nameValue,
      theme: theme.value || 'moebooru',
      padding: padding.value || '7',
      offset: offset.value || '0',
      align: align.value || 'top',
      scale: scale.value || '1',
      pixelated: pixelated.checked ? '1' : '0',
      darkmode: darkmode.value || 'auto'
    };

    if (num.value > 0) {
      params.num = num.value;
    }
    if (prefix.value !== '') {
      params.prefix = prefix.value;
    }

    const query = new URLSearchParams(params).toString();
    const imgSrc = `${__global_data.site}/@${nameValue}?${query}`;

    hideResult();
    img.src = `${imgSrc}&_=${Math.random()}`;
    btn.setAttribute('disabled', '');

    img.onload = () => {
      img.style.display = 'block';
      img.scrollIntoView({ block: 'start', behavior: 'smooth' });
      code.textContent = imgSrc;
      code.style.visibility = 'visible';
      party.confetti(btn, { count: party.variation.range(20, 40) });
      btn.removeAttribute('disabled');
    };

    img.onerror = async () => {
      try {
        const res = await fetch(img.src);
        if (!res.ok) {
          const { message } = await res.json();
          alert(message);
        }
      } finally {
        hideResult();
        btn.removeAttribute('disabled');
      }
    };
  }

  function hideResult({ clearSrc = false } = {}) {
    img.style.display = 'none';
    code.style.visibility = 'hidden';
    code.textContent = '';
    if (clearSrc) {
      img.removeAttribute('src');
    }
  }

  function selectCodeText(e) {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function scrollToThemes() {
    if (!themes.hasAttribute('open')) {
      party.sparkles(moreTheme.querySelector('h3'), { count: party.variation.range(20, 40) });
      themes.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  function handleLanguageChange(event) {
    const nextLang = event.target.value === 'zh' ? 'zh' : 'en';
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('lang', nextLang);
    window.location.assign(nextUrl.toString());
  }

  function throttle(fn, threshold = 250) {
    let last, deferTimer;
    return function (...args) {
      const now = Date.now();
      if (last && now < last + threshold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(() => {
          last = now;
          fn.apply(this, args);
        }, threshold);
      } else {
        last = now;
        fn.apply(this, args);
      }
    };
  }
})();

// Lazy Load
(() => {
  function lazyLoad(options = {}) {
    const { selector = 'img[data-src]:not([src])', loading = '', failed = '', rootMargin = '200px', threshold = 0.01 } = options;

    const images = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          observer.unobserve(img);

          img.onerror = failed ? () => { img.src = failed; img.setAttribute('data-failed', ''); } : null;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-loading');
        }
      });
    }, { rootMargin, threshold });

    images.forEach(img => {
      if (loading) {
        img.src = loading;
        img.setAttribute('data-loading', '');
      }
      observer.observe(img);
    });
  }

  const lazyLoadOptions = {
    selector: 'img[data-src]:not([src])',
    loading: `${__global_data.site}/assets/img/loading.svg`,
    failed: `${__global_data.site}/assets/img/failed.svg`,
    rootMargin: '200px',
    threshold: 0.01
  };

  document.readyState === 'loading'
    ? document.addEventListener("DOMContentLoaded", () => lazyLoad(lazyLoadOptions))
    : lazyLoad(lazyLoadOptions);
})();

// Back to top
(() => {
  let isShow = false, lock = false;
  const btn = document.querySelector('.back-to-top');

  const handleScroll = () => {
    if (lock) return;
    if (document.body.scrollTop >= 1000) {
      if (!isShow) {
        btn.classList.add('load');
        isShow = true;
      }
    } else if (isShow) {
      btn.classList.remove('load');
      isShow = false;
    }
  };

  const handleClick = () => {
    lock = true;
    btn.classList.add('ani-leave');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      btn.classList.remove('ani-leave');
      btn.classList.add('leaved');
    }, 390);

    setTimeout(() => btn.classList.add('ending'), 120);
    setTimeout(() => btn.classList.remove('load'), 1500);

    setTimeout(() => {
      lock = false;
      isShow = false;
      btn.classList.remove('leaved', 'ending');
    }, 2000);
  };

  window.addEventListener('scroll', handleScroll);
  btn.addEventListener('click', handleClick);
})();

// Prevent safari gesture
(() => {
  document.addEventListener('gesturestart', e => e.preventDefault());
})();
