import { Compass } from 'lucide-react';
import StubPage from '../_components/StubPage';

export const metadata = { title: 'Qibla Finder — Nur' };

export default function Page() {
 return <StubPage icon={Compass} title="Qibla Finder"
  description="Find the direction to the Kaaba from wherever you are."
  points={['Compass-based direction', 'Designed for mobile', 'Distance to Makkah']}/>;
}
