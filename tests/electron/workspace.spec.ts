import { _electron as electron, expect, test } from '@playwright/test';

test('Executive opens to the permanent Chief of Staff workspace', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    cwd: process.cwd(),
  });

  try {
    const window = await electronApp.firstWindow();
    const navigation = window.getByRole('navigation', {
      name: 'Workspace views',
    });
    const workStreams = window.getByRole('region', { name: 'Work streams' });
    const conversation = window.getByRole('main', {
      name: 'Chief of Staff conversation',
    });

    for (const view of [
      'All chats',
      'Needs you',
      'Working',
      'Finance',
      'Customers',
    ]) {
      await expect(navigation).toContainText(view);
    }
    await expect(workStreams).toContainText('Chief of Staff');
    await expect(workStreams).toContainText('Invoice reconciliation');
    await expect(conversation).toContainText('Permanent · Built in');
    await expect(conversation).toContainText(
      'Three work streams are active. One needs your attention.',
    );
    await expect(window.getByText('Your workspace is ready.')).toHaveCount(0);
  } finally {
    await electronApp.close();
  }
});
