import { Group, Text, Button, Container, Divider } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Container size="lg" py="md">
        <Group justify="space-between">
          <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Text fw={700} size="xl" c="orange">
              📅
            </Text>
            <Text fw={700} size="lg">
              Calendar
            </Text>
          </Group>
          <Group>
            <Button
              variant={location.pathname === '/' ? 'filled' : 'subtle'}
              color="dark"
              onClick={() => navigate('/')}
            >
              Записаться
            </Button>
            <Button
              variant={location.pathname === '/events' ? 'outline' : 'subtle'}
              color="dark"
              onClick={() => navigate('/events')}
            >
              Предстоящие события
            </Button>
          </Group>
        </Group>
      </Container>
      <Divider />
    </>
  );
}
