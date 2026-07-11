import { MoonStar } from 'lucide-react';
import StubPage from '../_components/StubPage';

export const metadata = { title: 'Prayer Times — Nur' };

export default function Page() {
 return <StubPage icon={MoonStar} title="Prayer Times"
  description="Accurate daily prayer times for your location, with a clear next-prayer countdown and a monthly view."
  points={['Location-based calculation', 'Multiple calculation methods', 'Adhan notifications']}/>;
}
