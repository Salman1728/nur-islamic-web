import { CalendarDays } from 'lucide-react';
import StubPage from '../_components/StubPage';

export const metadata = { title: 'Islamic Calendar — Nur' };

export default function Page() {
 return <StubPage icon={CalendarDays} title="Islamic Calendar"
  description="Hijri dates and important Islamic events at a glance."
  points={['Hijri–Gregorian conversion', 'Key dates and reminders', 'Ramadan and Eid countdowns']}/>;
}
