(function () {
  var lastMermaidDark = null;
  var isApplyingTheme = false;

  function isDarkTheme() {
    var root = document.documentElement;
    var dt = root.getAttribute('data-theme');
    if (dt === 'dark') return true;
    if (dt === 'light') return false;
    return root.classList.contains('dark');
  }

  function applyTheme(theme) {
    isApplyingTheme = true;
    try {
      var root = document.documentElement;
      root.setAttribute('data-theme', theme);
      root.classList.toggle('dark', theme === 'dark');
      try {
        localStorage.setItem('zola-benchmark-theme', theme);
      } catch (_) {}
      updateToggleLabel();
    } finally {
      isApplyingTheme = false;
    }
  }

  function updateToggleLabel() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.textContent = isDarkTheme() ? '浅色模式' : '深色模式';
  }

  function prepareMermaidBlocks() {
    var codes = document.querySelectorAll(
      'pre > code[data-lang="mermaid"], pre > code.language-mermaid, pre[data-lang="mermaid"]'
    );
    codes.forEach(function (el) {
      var pre = el.tagName === 'PRE' ? el : el.closest('pre');
      if (!pre || pre.dataset.mermaidPrepared === '1') return;
      var raw = (el.textContent || '').trim();
      if (!raw) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'zola-mermaid';
      wrapper.setAttribute('data-mermaid-src', raw);
      pre.replaceWith(wrapper);
    });
  }

  async function renderMermaid(force) {
    if (!window.mermaid) return;
    prepareMermaidBlocks();
    var nodes = document.querySelectorAll('.zola-mermaid[data-mermaid-src]');
    if (!nodes.length) return;

    var dark = isDarkTheme();
    if (!force && lastMermaidDark === dark && nodes[0].querySelector('svg')) {
      return;
    }
    lastMermaidDark = dark;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: dark ? 'dark' : 'default',
      securityLevel: 'loose'
    });

    for (var i = 0; i < nodes.length; i++) {
      var container = nodes[i];
      var src = container.getAttribute('data-mermaid-src');
      if (!src) continue;
      var id = 'zola-mermaid-' + Date.now() + '-' + i;
      try {
        var out = await window.mermaid.render(id, src);
        container.innerHTML = out.svg;
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    }
  }

  function renderMath() {
    if (typeof window.renderMathInElement !== 'function') return;
    var main = document.querySelector('.prose') || document.body;
    window.renderMathInElement(main, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      throwOnError: false
    });
    var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.indexOf('\\$') !== -1) {
        var parent = node.parentElement;
        if (parent && !parent.closest('code, pre, script, style, .katex')) {
          node.nodeValue = node.nodeValue.replace(/\\\$/g, '$');
        }
      }
    }
  }

  function init() {
    var root = document.documentElement;
    if (!root.getAttribute('data-theme')) {
      var saved = null;
      try {
        saved = localStorage.getItem('zola-benchmark-theme');
      } catch (_) {}
      applyTheme(saved === 'dark' ? 'dark' : 'light');
    } else {
      updateToggleLabel();
    }

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = isDarkTheme() ? 'light' : 'dark';
        applyTheme(next);
        void renderMermaid(true);
      });
    }

    renderMath();
    void renderMermaid(true);

    var observer = new MutationObserver(function () {
      if (isApplyingTheme) return;
      updateToggleLabel();
      void renderMermaid(false);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
