import { GraduationCap } from 'lucide-react';
import StubPage from '../_components/StubPage';

export const metadata = { title: 'Learn Salah — Nur' };

export default function Page() {
 return <StubPage icon={GraduationCap} title="Learn Salah"
  description="A step-by-step guide to performing salah with confidence."
  points={['Illustrated positions', 'Recitations with audio', 'Common mistakes explained']}/>;
}
