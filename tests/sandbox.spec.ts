import { expect, test } from '@playwright/test';

test.describe('Code & STEM Sandbox E2E', () => {
  test('renders Code Playground, executes A* simulation, saves script, and navigates all views', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Autonomous Rover Navigation' }),
    ).toBeVisible();
    await expect(page.getByText('6.40 units')).toBeVisible();
    await expect(page.getByText('h(n) = 1.25')).toBeVisible();
    await expect(page.getByText('STATUS: 0 ERRORS - SUCCESS')).toBeVisible();

    // Run code & verify XP increment
    await page.getByRole('button', { name: /Run Code/i }).click();
    await expect(page.getByText('1,400 XP')).toBeVisible({ timeout: 5000 });

    // Restart & Step Forward
    await page.getByRole('button', { name: /Restart Sim/i }).click();
    await page.getByRole('button', { name: /Step \(dt=0\.1s\)/i }).click();
    await expect(page.getByText(/Single Step \(dt=0\.1s\)/)).toBeVisible();

    // Save script & inspect My Projects
    await page.getByRole('button', { name: /^Save$/i }).click();
    await page.getByRole('button', { name: /My Projects/i }).click();
    await expect(page.getByRole('heading', { name: 'My Projects' })).toBeVisible();
    await expect(page.getByText(/Autonomous Rover Navigation/)).toBeVisible();

    // Verify all remaining navigation views
    const navChecks = [
      { btn: 'Dashboard', heading: 'Welcome back to Code & STEM Sandbox' },
      { btn: 'Robotics Lab', heading: 'Robotics Lab: Search & Heuristic Benchmarking' },
      {
        btn: 'Physics & Math',
        heading: 'Physics & Math: Projectile Vector & Trajectory Lab',
      },
      { btn: 'Challenges', heading: 'STEM Robotics Challenges' },
      { btn: 'Docs & API', heading: 'Docs & API Reference' },
      { btn: 'Settings', heading: 'Workspace Settings' },
    ];

    for (const item of navChecks) {
      await page.getByRole('button', { name: item.btn }).click();
      await expect(page.getByRole('heading', { name: item.heading })).toBeVisible();
    }

    expect(errors).toEqual([]);
  });
});
