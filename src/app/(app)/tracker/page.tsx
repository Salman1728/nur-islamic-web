import { CheckCircle2 } from 'lucide-react';
import StubPage from '../_components/StubPage';

export const metadata = { title: 'Prayer Tracker — Nur' };

export default function Page() {
 return <StubPage icon={CheckCircle2} title="Prayer Tracker"
  description="Track your daily prayers and build consistent habits, gently."
  points={['Daily prayer log', 'Streaks and gentle insights', 'Qada tracking']}/>;
}
