export function followSystemTheme() {
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const applyColorScheme = () => {
    document.documentElement.classList.toggle('dark', colorScheme.matches);
  };

  applyColorScheme();
  colorScheme.addEventListener('change', applyColorScheme);
}
