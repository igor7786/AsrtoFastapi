(() => {
  try {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme =
      savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : prefersDark ? 'dark' : 'light';

    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Watch for class changes and persist
    const observer = new MutationObserver(() => {
      try {
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch (e) {
        console.warn('Failed to save theme to localStorage:', e);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  } catch (e) {
    console.warn('Theme initialization failed:', e);
  }
})();
