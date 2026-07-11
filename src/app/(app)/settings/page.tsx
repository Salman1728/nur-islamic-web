import { Settings } from 'lucide-react';
import StubPage from '../_components/StubPage';

export const metadata = { title: 'Settings — Nur' };

export default function Page() {
 return <StubPage icon={Settings} title="Settings"
  description="Personalise Nur — your location, calculation method and appearance."
  points={['Location and timezone', 'Calculation method', 'Notification preferences']}/>;
}
