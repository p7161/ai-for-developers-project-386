import { test, expect, Page } from '@playwright/test';

/**
 * Helper: wait for calendar to load and click the first day that has free slots.
 */
async function pickAvailableDay(page: Page) {
  // Wait for at least one badge with free slots to appear
  const freeDay = page.getByRole('button').filter({ hasText: /\d+ св\./ }).first();
  await expect(freeDay).toBeVisible({ timeout: 10_000 });
  await freeDay.click();

  // Wait for slots panel to appear
  await expect(page.getByText('Статус слотов')).toBeVisible();
}

/**
 * Helper: select the first available (free) slot and proceed to the form.
 */
async function pickFreeSlotAndContinue(page: Page) {
  const freeSlot = page.getByRole('button').filter({ hasText: 'Свободно' }).first();
  await freeSlot.click();

  await page.getByRole('button', { name: 'Продолжить' }).click();
  await expect(page.getByText('Ваши данные')).toBeVisible();
}

/**
 * Helper: fill the booking form and submit.
 */
async function fillFormAndSubmit(page: Page, name: string, email: string) {
  await page.getByLabel('Имя').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByRole('button', { name: 'Забронировать' }).click();
}

// ─── Scenario 1: Full happy-path booking ─────────────────────────────

test.describe('Booking happy path', () => {
  test('user books a free slot end-to-end', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Запись на звонок')).toBeVisible();

    // Step 1 — pick a day with free slots
    await pickAvailableDay(page);

    // Step 2 — pick a free slot and go to form
    await pickFreeSlotAndContinue(page);

    // Step 3 — fill form and submit
    await fillFormAndSubmit(page, 'Иван Петров', 'ivan@example.com');

    // Step 4 — confirmation
    await expect(page.getByText('Бронь подтверждена. До встречи!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Забронировать еще' })).toBeVisible();
  });
});

// ─── Scenario 2: Booking appears on the events page ──────────────────

test.describe('Booking visible to owner', () => {
  test('created booking shows on /events page', async ({ page }) => {
    // Use a unique name to avoid conflicts with other test runs
    const uniqueName = `Тест ${Date.now()}`;
    const uniqueEmail = `test-${Date.now()}@example.com`;

    // Create a booking first
    await page.goto('/');
    await pickAvailableDay(page);
    await pickFreeSlotAndContinue(page);
    await fillFormAndSubmit(page, uniqueName, uniqueEmail);
    await expect(page.getByText('Бронь подтверждена')).toBeVisible();

    // Navigate to events page
    await page.getByRole('button', { name: 'Предстоящие события' }).click();

    // Verify booking is listed
    await expect(page.getByText(uniqueName).first()).toBeVisible();
    await expect(page.getByText(uniqueEmail).first()).toBeVisible();
  });
});

// ─── Scenario 3: Booked slot becomes unavailable ─────────────────────

test.describe('Slot becomes occupied after booking', () => {
  test('booked slot shows as "Занято"', async ({ page }) => {
    await page.goto('/');
    await pickAvailableDay(page);

    // Remember which slot we're booking — get the time text from the first free slot
    const freeSlot = page.getByRole('button').filter({ hasText: 'Свободно' }).first();
    const slotTimeText = await freeSlot.textContent();
    // Extract time range like "09:00 - 09:30"
    const timeMatch = slotTimeText?.match(/\d{2}:\d{2} - \d{2}:\d{2}/);
    await freeSlot.click();

    await page.getByRole('button', { name: 'Продолжить' }).click();
    await fillFormAndSubmit(page, 'Тест Занято', 'busy@example.com');
    await expect(page.getByText('Бронь подтверждена')).toBeVisible();

    // Go back to book another
    await page.getByRole('button', { name: 'Забронировать еще' }).click();

    // Pick the same day again
    await pickAvailableDay(page);

    // The slot with the same time should now be "Занято"
    if (timeMatch) {
      const bookedSlot = page.getByRole('button').filter({ hasText: timeMatch[0] });
      await expect(bookedSlot.getByText('Занято')).toBeVisible();
    }
  });
});

// ─── Scenario 4: Calendar navigation ─────────────────────────────────

test.describe('Calendar navigation', () => {
  test('user can switch months forward and back', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Запись на звонок')).toBeVisible();

    // Get current month label
    const monthLabel = page.locator('text=/[а-яА-Я]+ \\d{4} г\\./');
    const initialMonth = await monthLabel.textContent();

    // Navigate forward
    await page.getByRole('button', { name: '→' }).click();
    await expect(monthLabel).not.toHaveText(initialMonth!);

    // Navigate back
    await page.getByRole('button', { name: '←' }).click();
    await expect(monthLabel).toHaveText(initialMonth!);
  });
});

// ─── Scenario 5: Past dates have no free slots ──────────────────────

test.describe('Past dates are inactive', () => {
  test('previous month has zero free-slot badges', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Календарь')).toBeVisible();

    // Navigate to the previous month — it's entirely in the past
    await page.getByRole('button', { name: '←' }).click();

    // Wait for calendar to re-render
    const monthLabel = page.locator('text=/[а-яА-Я]+ \\d{4} г\\./');
    await expect(monthLabel).toBeVisible();

    // No day in a past month should have a "св." badge
    const badgesInPastMonth = page.getByRole('button').filter({ hasText: /\d+ св\./ });
    await expect(badgesInPastMonth).toHaveCount(0);
  });

  test('past date shows message to pick a valid date instead of slots', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Календарь')).toBeVisible();

    // Navigate to previous month
    await page.getByRole('button', { name: '←' }).click();

    // Click on day 15 of the past month
    const dayCell = page.getByRole('button', { name: '15', exact: true });
    await dayCell.click();

    // Frontend should show a message instead of slot list
    await expect(page.getByText('Выберите актуальную время и дату')).toBeVisible();

    // No free slots should be shown
    const freeSlots = page.getByRole('button').filter({ hasText: 'Свободно' });
    await expect(freeSlots).toHaveCount(0);
  });
});

// ─── Scenario 6: Form validation ────────────────────────────────────

test.describe('Form validation', () => {
  test('submit button is disabled when name or email is empty', async ({ page }) => {
    await page.goto('/');
    await pickAvailableDay(page);
    await pickFreeSlotAndContinue(page);

    const submitBtn = page.getByRole('button', { name: 'Забронировать' });

    // Both fields empty — button should be disabled
    await expect(submitBtn).toBeDisabled();

    // Only name filled
    await page.getByLabel('Имя').fill('Test');
    await expect(submitBtn).toBeDisabled();

    // Both filled — button enabled
    await page.getByLabel('Email').fill('test@example.com');
    await expect(submitBtn).toBeEnabled();
  });
});
