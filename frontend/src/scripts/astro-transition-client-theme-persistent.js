function applyTheme() {
  const stored = localStorage.getItem('settings:theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

document.addEventListener('astro:after-swap', applyTheme);
applyTheme();
