# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Past dates are inactive >> past date slots are all marked as "Занято"
- Location: e2e/booking.spec.ts:156:8

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('button').filter({ hasText: 'Свободно' })
Expected: 0
Received: 16
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByRole('button').filter({ hasText: 'Свободно' })
    9 × locator resolved to 16 elements
      - unexpected value "16"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5] [cursor=pointer]:
      - paragraph [ref=e6]: 📅
      - paragraph [ref=e7]: Calendar
    - generic [ref=e8]:
      - button "Записаться" [ref=e9] [cursor=pointer]:
        - generic [ref=e11]: Записаться
      - button "Предстоящие события" [ref=e12] [cursor=pointer]:
        - generic [ref=e14]: Предстоящие события
  - separator [ref=e15]
  - generic [ref=e16]:
    - heading "Запись на звонок" [level=2] [ref=e17]
    - generic [ref=e19]:
      - generic [ref=e21]:
        - heading "Информация" [level=4] [ref=e22]
        - generic [ref=e23]:
          - paragraph [ref=e24]: Выбранная дата
          - paragraph [ref=e25]: воскресенье, 15 марта
        - generic [ref=e26]:
          - paragraph [ref=e27]: Выбранное время
          - paragraph [ref=e28]: Время не выбрано
        - generic [ref=e29]:
          - paragraph [ref=e30]: Свободно
          - paragraph [ref=e31]: "16"
        - generic [ref=e32]:
          - paragraph [ref=e33]: Длительность в дне
          - paragraph [ref=e34]: 30 мин
      - generic [ref=e37]:
        - generic [ref=e38]:
          - heading "Календарь" [level=4] [ref=e39]
          - generic [ref=e40]:
            - button "←" [ref=e41] [cursor=pointer]:
              - generic [ref=e43]: ←
            - button "→" [ref=e44] [cursor=pointer]:
              - generic [ref=e46]: →
        - paragraph [ref=e47]: март 2026 г.
        - generic [ref=e48]:
          - paragraph [ref=e50]: Пн
          - paragraph [ref=e52]: Вт
          - paragraph [ref=e54]: Ср
          - paragraph [ref=e56]: Чт
          - paragraph [ref=e58]: Пт
          - paragraph [ref=e60]: Сб
          - paragraph [ref=e62]: Вс
          - button "23" [ref=e63] [cursor=pointer]:
            - paragraph [ref=e64]: "23"
          - button "24" [ref=e65] [cursor=pointer]:
            - paragraph [ref=e66]: "24"
          - button "25" [ref=e67] [cursor=pointer]:
            - paragraph [ref=e68]: "25"
          - button "26" [ref=e69] [cursor=pointer]:
            - paragraph [ref=e70]: "26"
          - button "27" [ref=e71] [cursor=pointer]:
            - paragraph [ref=e72]: "27"
          - button "28" [ref=e73] [cursor=pointer]:
            - paragraph [ref=e74]: "28"
          - button "1" [ref=e75] [cursor=pointer]:
            - paragraph [ref=e76]: "1"
          - button "2" [ref=e77] [cursor=pointer]:
            - paragraph [ref=e78]: "2"
          - button "3" [ref=e79] [cursor=pointer]:
            - paragraph [ref=e80]: "3"
          - button "4" [ref=e81] [cursor=pointer]:
            - paragraph [ref=e82]: "4"
          - button "5" [ref=e83] [cursor=pointer]:
            - paragraph [ref=e84]: "5"
          - button "6" [ref=e85] [cursor=pointer]:
            - paragraph [ref=e86]: "6"
          - button "7" [ref=e87] [cursor=pointer]:
            - paragraph [ref=e88]: "7"
          - button "8" [ref=e89] [cursor=pointer]:
            - paragraph [ref=e90]: "8"
          - button "9" [ref=e91] [cursor=pointer]:
            - paragraph [ref=e92]: "9"
          - button "10" [ref=e93] [cursor=pointer]:
            - paragraph [ref=e94]: "10"
          - button "11" [ref=e95] [cursor=pointer]:
            - paragraph [ref=e96]: "11"
          - button "12" [ref=e97] [cursor=pointer]:
            - paragraph [ref=e98]: "12"
          - button "13" [ref=e99] [cursor=pointer]:
            - paragraph [ref=e100]: "13"
          - button "14" [ref=e101] [cursor=pointer]:
            - paragraph [ref=e102]: "14"
          - button "15" [active] [ref=e103] [cursor=pointer]:
            - paragraph [ref=e104]: "15"
          - button "16" [ref=e105] [cursor=pointer]:
            - paragraph [ref=e106]: "16"
          - button "17" [ref=e107] [cursor=pointer]:
            - paragraph [ref=e108]: "17"
          - button "18" [ref=e109] [cursor=pointer]:
            - paragraph [ref=e110]: "18"
          - button "19" [ref=e111] [cursor=pointer]:
            - paragraph [ref=e112]: "19"
          - button "20" [ref=e113] [cursor=pointer]:
            - paragraph [ref=e114]: "20"
          - button "21" [ref=e115] [cursor=pointer]:
            - paragraph [ref=e116]: "21"
          - button "22" [ref=e117] [cursor=pointer]:
            - paragraph [ref=e118]: "22"
          - button "23" [ref=e119] [cursor=pointer]:
            - paragraph [ref=e120]: "23"
          - button "24" [ref=e121] [cursor=pointer]:
            - paragraph [ref=e122]: "24"
          - button "25" [ref=e123] [cursor=pointer]:
            - paragraph [ref=e124]: "25"
          - button "26" [ref=e125] [cursor=pointer]:
            - paragraph [ref=e126]: "26"
          - button "27" [ref=e127] [cursor=pointer]:
            - paragraph [ref=e128]: "27"
          - button "28" [ref=e129] [cursor=pointer]:
            - paragraph [ref=e130]: "28"
          - button "29" [ref=e131] [cursor=pointer]:
            - paragraph [ref=e132]: "29"
          - button "30" [ref=e133] [cursor=pointer]:
            - paragraph [ref=e134]: "30"
          - button "31" [ref=e135] [cursor=pointer]:
            - paragraph [ref=e136]: "31"
          - button "1" [ref=e137] [cursor=pointer]:
            - paragraph [ref=e138]: "1"
          - button "2" [ref=e139] [cursor=pointer]:
            - paragraph [ref=e140]: "2"
          - button "3" [ref=e141] [cursor=pointer]:
            - paragraph [ref=e142]: "3"
          - button "4" [ref=e143] [cursor=pointer]:
            - paragraph [ref=e144]: "4"
          - button "5" [ref=e145] [cursor=pointer]:
            - paragraph [ref=e146]: "5"
      - generic [ref=e149]:
        - heading "Статус слотов" [level=4] [ref=e150]
        - button "09:00 - 09:30 Свободно" [ref=e151] [cursor=pointer]:
          - paragraph [ref=e152]: 09:00 - 09:30
          - generic [ref=e154]: Свободно
        - button "09:30 - 10:00 Свободно" [ref=e155] [cursor=pointer]:
          - paragraph [ref=e156]: 09:30 - 10:00
          - generic [ref=e158]: Свободно
        - button "10:00 - 10:30 Свободно" [ref=e159] [cursor=pointer]:
          - paragraph [ref=e160]: 10:00 - 10:30
          - generic [ref=e162]: Свободно
        - button "10:30 - 11:00 Свободно" [ref=e163] [cursor=pointer]:
          - paragraph [ref=e164]: 10:30 - 11:00
          - generic [ref=e166]: Свободно
        - button "11:00 - 11:30 Свободно" [ref=e167] [cursor=pointer]:
          - paragraph [ref=e168]: 11:00 - 11:30
          - generic [ref=e170]: Свободно
        - button "11:30 - 12:00 Свободно" [ref=e171] [cursor=pointer]:
          - paragraph [ref=e172]: 11:30 - 12:00
          - generic [ref=e174]: Свободно
        - button "12:00 - 12:30 Свободно" [ref=e175] [cursor=pointer]:
          - paragraph [ref=e176]: 12:00 - 12:30
          - generic [ref=e178]: Свободно
        - button "12:30 - 13:00 Свободно" [ref=e179] [cursor=pointer]:
          - paragraph [ref=e180]: 12:30 - 13:00
          - generic [ref=e182]: Свободно
        - button "13:00 - 13:30 Свободно" [ref=e183] [cursor=pointer]:
          - paragraph [ref=e184]: 13:00 - 13:30
          - generic [ref=e186]: Свободно
        - button "13:30 - 14:00 Свободно" [ref=e187] [cursor=pointer]:
          - paragraph [ref=e188]: 13:30 - 14:00
          - generic [ref=e190]: Свободно
        - button "14:00 - 14:30 Свободно" [ref=e191] [cursor=pointer]:
          - paragraph [ref=e192]: 14:00 - 14:30
          - generic [ref=e194]: Свободно
        - button "14:30 - 15:00 Свободно" [ref=e195] [cursor=pointer]:
          - paragraph [ref=e196]: 14:30 - 15:00
          - generic [ref=e198]: Свободно
        - button "15:00 - 15:30 Свободно" [ref=e199] [cursor=pointer]:
          - paragraph [ref=e200]: 15:00 - 15:30
          - generic [ref=e202]: Свободно
        - button "15:30 - 16:00 Свободно" [ref=e203] [cursor=pointer]:
          - paragraph [ref=e204]: 15:30 - 16:00
          - generic [ref=e206]: Свободно
        - button "16:00 - 16:30 Свободно" [ref=e207] [cursor=pointer]:
          - paragraph [ref=e208]: 16:00 - 16:30
          - generic [ref=e210]: Свободно
        - button "16:30 - 17:00 Свободно" [ref=e211] [cursor=pointer]:
          - paragraph [ref=e212]: 16:30 - 17:00
          - generic [ref=e214]: Свободно
        - generic [ref=e215]:
          - button "Назад" [ref=e216] [cursor=pointer]:
            - generic [ref=e218]: Назад
          - button "Продолжить" [disabled] [ref=e219]:
            - generic [ref=e221]: Продолжить
```

# Test source

```ts
  72  | 
  73  |     // Navigate to events page
  74  |     await page.getByRole('button', { name: 'Предстоящие события' }).click();
  75  | 
  76  |     // Verify booking is listed
  77  |     await expect(page.getByText(uniqueName).first()).toBeVisible();
  78  |     await expect(page.getByText(uniqueEmail).first()).toBeVisible();
  79  |   });
  80  | });
  81  | 
  82  | // ─── Scenario 3: Booked slot becomes unavailable ─────────────────────
  83  | 
  84  | test.describe('Slot becomes occupied after booking', () => {
  85  |   test('booked slot shows as "Занято"', async ({ page }) => {
  86  |     await page.goto('/');
  87  |     await pickAvailableDay(page);
  88  | 
  89  |     // Remember which slot we're booking — get the time text from the first free slot
  90  |     const freeSlot = page.getByRole('button').filter({ hasText: 'Свободно' }).first();
  91  |     const slotTimeText = await freeSlot.textContent();
  92  |     // Extract time range like "09:00 - 09:30"
  93  |     const timeMatch = slotTimeText?.match(/\d{2}:\d{2} - \d{2}:\d{2}/);
  94  |     await freeSlot.click();
  95  | 
  96  |     await page.getByRole('button', { name: 'Продолжить' }).click();
  97  |     await fillFormAndSubmit(page, 'Тест Занято', 'busy@example.com');
  98  |     await expect(page.getByText('Бронь подтверждена')).toBeVisible();
  99  | 
  100 |     // Go back to book another
  101 |     await page.getByRole('button', { name: 'Забронировать еще' }).click();
  102 | 
  103 |     // Pick the same day again
  104 |     await pickAvailableDay(page);
  105 | 
  106 |     // The slot with the same time should now be "Занято"
  107 |     if (timeMatch) {
  108 |       const bookedSlot = page.getByRole('button').filter({ hasText: timeMatch[0] });
  109 |       await expect(bookedSlot.getByText('Занято')).toBeVisible();
  110 |     }
  111 |   });
  112 | });
  113 | 
  114 | // ─── Scenario 4: Calendar navigation ─────────────────────────────────
  115 | 
  116 | test.describe('Calendar navigation', () => {
  117 |   test('user can switch months forward and back', async ({ page }) => {
  118 |     await page.goto('/');
  119 |     await expect(page.getByText('Запись на звонок')).toBeVisible();
  120 | 
  121 |     // Get current month label
  122 |     const monthLabel = page.locator('text=/[а-яА-Я]+ \\d{4} г\\./');
  123 |     const initialMonth = await monthLabel.textContent();
  124 | 
  125 |     // Navigate forward
  126 |     await page.getByRole('button', { name: '→' }).click();
  127 |     await expect(monthLabel).not.toHaveText(initialMonth!);
  128 | 
  129 |     // Navigate back
  130 |     await page.getByRole('button', { name: '←' }).click();
  131 |     await expect(monthLabel).toHaveText(initialMonth!);
  132 |   });
  133 | });
  134 | 
  135 | // ─── Scenario 5: Past dates have no free slots ──────────────────────
  136 | 
  137 | test.describe('Past dates are inactive', () => {
  138 |   test('previous month has zero free-slot badges', async ({ page }) => {
  139 |     await page.goto('/');
  140 |     await expect(page.getByText('Календарь')).toBeVisible();
  141 | 
  142 |     // Navigate to the previous month — it's entirely in the past
  143 |     await page.getByRole('button', { name: '←' }).click();
  144 | 
  145 |     // Wait for calendar to re-render
  146 |     const monthLabel = page.locator('text=/[а-яА-Я]+ \\d{4} г\\./');
  147 |     await expect(monthLabel).toBeVisible();
  148 | 
  149 |     // No day in a past month should have a "св." badge
  150 |     const badgesInPastMonth = page.getByRole('button').filter({ hasText: /\d+ св\./ });
  151 |     await expect(badgesInPastMonth).toHaveCount(0);
  152 |   });
  153 | 
  154 |   // BUG: backend /api/public/slots does not check if date is in the past,
  155 |   // returns available: true for past slots. Fix needed in backend/src/routes/public.js
  156 |   test.fail('past date slots are all marked as "Занято"', async ({ page }) => {
  157 |     await page.goto('/');
  158 |     await expect(page.getByText('Календарь')).toBeVisible();
  159 | 
  160 |     // Navigate to previous month
  161 |     await page.getByRole('button', { name: '←' }).click();
  162 | 
  163 |     // Click on day 15 of the past month (guaranteed to be in-month, likely a weekday)
  164 |     const dayCell = page.getByRole('button', { name: '15', exact: true });
  165 |     await dayCell.click();
  166 | 
  167 |     // Slots panel should appear
  168 |     await expect(page.getByText('Статус слотов')).toBeVisible();
  169 | 
  170 |     // All slots for a past date must be "Занято", none should be "Свободно"
  171 |     const freeSlots = page.getByRole('button').filter({ hasText: 'Свободно' });
> 172 |     await expect(freeSlots).toHaveCount(0);
      |                             ^ Error: expect(locator).toHaveCount(expected) failed
  173 |   });
  174 | });
  175 | 
  176 | // ─── Scenario 6: Form validation ────────────────────────────────────
  177 | 
  178 | test.describe('Form validation', () => {
  179 |   test('submit button is disabled when name or email is empty', async ({ page }) => {
  180 |     await page.goto('/');
  181 |     await pickAvailableDay(page);
  182 |     await pickFreeSlotAndContinue(page);
  183 | 
  184 |     const submitBtn = page.getByRole('button', { name: 'Забронировать' });
  185 | 
  186 |     // Both fields empty — button should be disabled
  187 |     await expect(submitBtn).toBeDisabled();
  188 | 
  189 |     // Only name filled
  190 |     await page.getByLabel('Имя').fill('Test');
  191 |     await expect(submitBtn).toBeDisabled();
  192 | 
  193 |     // Both filled — button enabled
  194 |     await page.getByLabel('Email').fill('test@example.com');
  195 |     await expect(submitBtn).toBeEnabled();
  196 |   });
  197 | });
  198 | 
```