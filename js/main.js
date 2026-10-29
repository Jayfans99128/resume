/* ============================================================
   罗卓聪 · 个人主页 交互脚本
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 导航栏滚动状态 ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  const closeMenu = () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  // 点击菜单内链接后收起菜单（移动端）
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  /* ---------- 滚动高亮当前区块（scroll spy） ---------- */
  const navAnchors = [...links.querySelectorAll('a[href^="#"]')];
  const sections = navAnchors
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = () => {
    const pos = window.scrollY + 140;
    let current = sections[0];
    for (const s of sections) if (s.offsetTop <= pos) current = s;
    navAnchors.forEach((a) =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + (current && current.id))
    );
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---------- 滚动入场动画 ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Toast 提示 ---------- */
  const toast = document.getElementById('toast');
  let toastTimer = null;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  /* ---------- 点击复制（复制芯片 .copy-chip 时使用） ---------- */
  document.querySelectorAll('.copy-chip').forEach((el) => {
    el.addEventListener('click', async () => {
      const text = el.dataset.copy || '';
      try {
        await navigator.clipboard.writeText(text);
        showToast('✅ 已复制：' + text);
      } catch {
        // 兜底：execCommand 方案（file:// 或非安全上下文）
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showToast('✅ 已复制：' + text);
        } catch {
          showToast('复制失败，请手动复制：' + text);
        }
        ta.remove();
      }
    });
  });

  /* ---------- 平滑滚动时预留固定导航高度 ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: 'smooth' });
      try { history.replaceState(null, '', id); } catch (_) { /* file:// 下部分浏览器禁止 */ }
    });
  });
})();
