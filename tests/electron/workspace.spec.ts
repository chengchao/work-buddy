import { _electron as electron, expect, test } from '@playwright/test';

test('Executive opens to the permanent Chief of Staff workspace', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    cwd: process.cwd(),
  });

  try {
    const window = await electronApp.firstWindow();

    await expect(
      window.getByRole('navigation', { name: 'Workspace views' }),
    ).toContainText('All chats');
    await expect(
      window.getByRole('navigation', { name: 'Workspace views' }),
    ).toContainText('Needs you');
    await expect(
      window.getByRole('navigation', { name: 'Workspace views' }),
    ).toContainText('Working');
    await expect(
      window.getByRole('navigation', { name: 'Workspace views' }),
    ).toContainText('Finance');
    await expect(
      window.getByRole('navigation', { name: 'Workspace views' }),
    ).toContainText('Customers');
    await expect(
      window.getByRole('region', { name: 'Work streams' }),
    ).toContainText('Chief of Staff');
    await expect(
      window.getByRole('region', { name: 'Work streams' }),
    ).toContainText('Invoice reconciliation');
    await expect(
      window.getByRole('main', { name: 'Chief of Staff conversation' }),
    ).toContainText('Permanent · Built in');
    await expect(
      window.getByRole('main', { name: 'Chief of Staff conversation' }),
    ).toContainText('Three work streams are active. One needs your attention.');
    await expect(window.getByText('Your workspace is ready.')).toHaveCount(0);
  } finally {
    await electronApp.close();
  }
});
