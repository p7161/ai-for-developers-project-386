import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { BookingPage } from './pages/BookingPage';
import { EventsPage } from './pages/EventsPage';

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>
    </>
  );
}
