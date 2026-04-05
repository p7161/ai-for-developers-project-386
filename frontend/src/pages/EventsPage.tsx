import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Card,
  Text,
  Stack,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import dayjs from 'dayjs';
import { api, Booking } from '../api/client';

export function EventsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getBookings()
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">
        Предстоящие события
      </Title>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      {bookings.length === 0 && !error && (
        <Text c="dimmed">Нет предстоящих событий</Text>
      )}
      <Stack gap="md">
        {bookings.map((b) => (
          <Card key={b.id} withBorder radius="md" padding="lg">
            <Text fw={700} size="lg">
              {b.guestName}
            </Text>
            <Text size="sm" c="dimmed">
              {b.guestEmail}
            </Text>
            <Text size="sm" c="dimmed">
              Слот: {dayjs(b.startTime).format('YYYY-MM-DD HH:mm')}
            </Text>
            <Text size="sm" c="dimmed">
              Создано: {dayjs(b.createdAt).format('DD.MM.YYYY, HH:mm')}
            </Text>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
