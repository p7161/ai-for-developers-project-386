import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Stack,
  Button,
  Group,
  TextInput,
  Badge,
  Loader,
  Center,
  Alert,
  UnstyledButton,
  SimpleGrid,
  Box,
} from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { api, Slot, DayAvailability, Booking } from '../api/client';

dayjs.locale('ru');

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function BookingPage() {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingCal, setLoadingCal] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // Step: 'calendar' | 'form'
  const [step, setStep] = useState<'calendar' | 'form' | 'done'>('calendar');

  const fetchCalendar = useCallback(async (month: dayjs.Dayjs) => {
    setLoadingCal(true);
    try {
      const data = await api.getCalendar(month.format('YYYY-MM'));
      setAvailability(data);
    } catch {
      setAvailability([]);
    } finally {
      setLoadingCal(false);
    }
  }, []);

  const fetchSlots = useCallback(async (date: dayjs.Dayjs) => {
    setLoadingSlots(true);
    try {
      const data = await api.getSlots(date.format('YYYY-MM-DD'));
      setSlots(data);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendar(currentMonth);
  }, [currentMonth, fetchCalendar]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
      setSelectedSlot(null);
    }
  }, [selectedDate, fetchSlots]);

  const getFreeSlotsForDate = (date: string) => {
    const entry = availability.find((a) => a.date === date);
    return entry?.freeSlots ?? 0;
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !guestName || !guestEmail) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await api.createBooking({
        guestName,
        guestEmail,
        startTime: selectedSlot.startTime,
      });
      setBooking(result);
      setStep('done');
    } catch (err: any) {
      setError(err.message || 'Ошибка бронирования');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (selectedSlot) {
      setStep('form');
    }
  };

  const handleBack = () => {
    setStep('calendar');
    setSelectedSlot(null);
  };

  const handleBookAnother = () => {
    setBooking(null);
    setStep('calendar');
    setSelectedSlot(null);
    setGuestName('');
    setGuestEmail('');
    if (selectedDate) fetchSlots(selectedDate);
    fetchCalendar(currentMonth);
  };

  const freeCount = slots.filter((s) => s.available).length;
  const durationMinutes = 30;

  // Build calendar grid
  const renderCalendar = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1; // Monday-based
    const daysInMonth = currentMonth.daysInMonth();

    // Include days from prev month to fill grid, and next month
    const cells: { date: dayjs.Dayjs; inMonth: boolean }[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      cells.push({ date: startOfMonth.subtract(i + 1, 'day'), inMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ date: currentMonth.date(i), inMonth: true });
    }
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        cells.push({ date: endOfMonth.add(i, 'day'), inMonth: false });
      }
    }

    const rows: { date: dayjs.Dayjs; inMonth: boolean }[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }

    return (
      <Stack gap="xs">
        <Group justify="space-between" mb="xs">
          <Title order={4}>Календарь</Title>
          <Group gap={4}>
            <Button
              variant="default"
              size="compact-sm"
              onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
            >
              ←
            </Button>
            <Button
              variant="default"
              size="compact-sm"
              onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
            >
              →
            </Button>
          </Group>
        </Group>
        <Text size="sm" c="dimmed">
          {currentMonth.format('MMMM YYYY г.')}
        </Text>
        <SimpleGrid cols={7} spacing={0}>
          {WEEKDAYS.map((d) => (
            <Center key={d} py={4}>
              <Text size="xs" fw={600}>
                {d}
              </Text>
            </Center>
          ))}
          {rows.flat().map((cell, idx) => {
            const dateStr = cell.date.format('YYYY-MM-DD');
            const free = getFreeSlotsForDate(dateStr);
            const isSelected =
              selectedDate && selectedDate.format('YYYY-MM-DD') === dateStr;
            const isToday = dayjs().format('YYYY-MM-DD') === dateStr;

            return (
              <UnstyledButton
                key={idx}
                onClick={() => {
                  if (cell.inMonth) setSelectedDate(cell.date);
                }}
                style={{
                  padding: '6px 2px',
                  textAlign: 'center',
                  borderRadius: 6,
                  border: isSelected
                    ? '2px solid #fd7e14'
                    : '2px solid transparent',
                  opacity: cell.inMonth ? 1 : 0.3,
                  background: isSelected ? '#fff4e6' : 'transparent',
                }}
              >
                <Text
                  size="sm"
                  fw={isToday ? 700 : 400}
                >
                  {cell.date.date()}
                </Text>
                {cell.inMonth && free > 0 && (
                  <Text size="xs" c="orange">
                    {free} св.
                  </Text>
                )}
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
      </Stack>
    );
  };

  const renderSlots = () => {
    if (!selectedDate) {
      return (
        <Text c="dimmed" ta="center">
          Выберите дату в календаре
        </Text>
      );
    }
    if (loadingSlots) {
      return (
        <Center>
          <Loader />
        </Center>
      );
    }
    const now = dayjs();
    const allPast = slots.length > 0 && slots.every((s) => dayjs(s.startTime).isBefore(now));

    if (allPast) {
      return (
        <Text c="dimmed" ta="center">
          Выберите актуальную время и дату
        </Text>
      );
    }

    return (
      <Stack gap="xs">
        <Title order={4}>Статус слотов</Title>
        {slots.map((slot) => {
          const start = dayjs(slot.startTime).format('HH:mm');
          const end = dayjs(slot.endTime).format('HH:mm');
          const isSelected = selectedSlot?.startTime === slot.startTime;
          const isPast = dayjs(slot.startTime).isBefore(now);
          return (
            <UnstyledButton
              key={slot.startTime}
              onClick={() => {
                if (isPast) return;
                if (slot.available) setSelectedSlot(slot);
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                borderRadius: 8,
                border: isSelected
                  ? '2px solid #fd7e14'
                  : '1px solid #dee2e6',
                background: isSelected ? '#fff4e6' : 'white',
                cursor: slot.available && !isPast ? 'pointer' : 'default',
                opacity: isPast ? 0.5 : slot.available ? 1 : 0.7,
              }}
            >
              <Text size="sm">
                {start} - {end}
              </Text>
              {!isPast && (
                <Badge
                  color={slot.available ? 'gray' : 'red'}
                  variant="light"
                >
                  {slot.available ? 'Свободно' : 'Занято'}
                </Badge>
              )}
            </UnstyledButton>
          );
        })}
        <Group justify="space-between" mt="md">
          <Button variant="default" onClick={handleBack}>
            Назад
          </Button>
          <Button
            color="orange"
            disabled={!selectedSlot}
            onClick={handleContinue}
          >
            Продолжить
          </Button>
        </Group>
      </Stack>
    );
  };

  const renderInfo = () => (
    <Stack gap="md">
      <Title order={4}>Информация</Title>
      <Card withBorder bg="#f0f4ff" radius="md" padding="sm">
        <Text size="xs" c="dimmed">
          Выбранная дата
        </Text>
        <Text size="sm" fw={500}>
          {selectedDate
            ? selectedDate.format('dddd, D MMMM')
            : 'Дата не выбрана'}
        </Text>
      </Card>
      <Card withBorder bg="#f0f4ff" radius="md" padding="sm">
        <Text size="xs" c="dimmed">
          Выбранное время
        </Text>
        <Text size="sm" fw={500}>
          {selectedSlot
            ? `${dayjs(selectedSlot.startTime).format('HH:mm')} - ${dayjs(selectedSlot.endTime).format('HH:mm')}`
            : 'Время не выбрано'}
        </Text>
      </Card>
      <Card withBorder bg="#f0f4ff" radius="md" padding="sm">
        <Text size="xs" c="dimmed">
          Свободно
        </Text>
        <Text size="sm" fw={500}>
          {selectedDate ? freeCount : '—'}
        </Text>
      </Card>
      <Card withBorder bg="#f0f4ff" radius="md" padding="sm">
        <Text size="xs" c="dimmed">
          Длительность в дне
        </Text>
        <Text size="sm" fw={500}>
          {durationMinutes} мин
        </Text>
      </Card>
    </Stack>
  );

  if (step === 'done' && booking) {
    return (
      <Container size="lg" py="xl">
        <Title order={2} mb="xl">
          Запись на звонок
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 5 }}>{renderInfo()}</Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card withBorder radius="md" padding="xl" bg="#f8f9fa">
              <Stack align="center" gap="lg">
                <Title order={3} ta="center">
                  Бронь подтверждена. До встречи!
                </Title>
                <Button
                  color="orange"
                  size="lg"
                  fullWidth
                  onClick={handleBookAnother}
                >
                  Забронировать еще
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (step === 'form') {
    return (
      <Container size="lg" py="xl">
        <Title order={2} mb="xl">
          Запись на звонок
        </Title>
        <Grid>
          <Grid.Col span={{ base: 12, md: 5 }}>{renderInfo()}</Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card withBorder radius="md" padding="xl" bg="#f8f9fa">
              <Stack gap="md">
                <Title order={4}>Ваши данные</Title>
                <TextInput
                  label="Имя"
                  placeholder="Введите ваше имя"
                  value={guestName}
                  onChange={(e) => setGuestName(e.currentTarget.value)}
                  required
                />
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.currentTarget.value)}
                  required
                />
                {error && (
                  <Alert color="red" title="Ошибка">
                    {error}
                  </Alert>
                )}
                <Group justify="space-between">
                  <Button variant="default" onClick={handleBack}>
                    Назад
                  </Button>
                  <Button
                    color="orange"
                    loading={submitting}
                    disabled={!guestName || !guestEmail}
                    onClick={handleSubmit}
                  >
                    Забронировать
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">
        Запись на звонок
      </Title>
      {loadingCal && (
        <Center mb="md">
          <Loader />
        </Center>
      )}
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>{renderInfo()}</Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder radius="md" padding="md">
            {renderCalendar()}
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" padding="md">
            {renderSlots()}
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
