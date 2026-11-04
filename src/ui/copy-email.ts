export function initCopyEmail(): void {
  const copyMail = document.getElementById('copyMail');
  if (!copyMail) return;

  const mailLink = document.querySelector<HTMLAnchorElement>('.mail[data-email]');
  const email = mailLink?.getAttribute('data-email') ?? mailLink?.textContent?.trim() ?? '';
  const defaultLabel =
    copyMail.getAttribute('data-copy-label') ?? copyMail.textContent?.trim() ?? 'Copy';

  copyMail.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      btn.textContent = 'Copied';
      window.setTimeout(() => {
        btn.textContent = defaultLabel;
      }, 1800);
    } catch {
      btn.textContent = 'Press Ctrl+C';
    }
  });
}
