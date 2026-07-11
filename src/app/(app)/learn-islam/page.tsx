import { Sparkles } from 'lucide-react';
import StubPage from '../_components/StubPage';

export const metadata = { title: 'Learn Islam — Nur' };

export default function Page() {
 return <StubPage icon={Sparkles} title="Learn Islam"
  description="Short, gentle lessons on the foundations of Islam — made for reverts and new learners."
  points={['Structured learning paths', 'Bite-size lessons', 'Progress tracking']}/>;
}
