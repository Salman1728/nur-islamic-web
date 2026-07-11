import { HandHeart } from 'lucide-react';
import StubPage from '../_components/StubPage';

export const metadata = { title: 'Duas & Adhkar — Nur' };

export default function Page() {
 return <StubPage icon={HandHeart} title="Duas & Adhkar"
  description="Essential duas and daily adhkar with meanings for every moment of your day."
  points={['Morning and evening adhkar', 'Duas for daily moments', 'Arabic, transliteration and meaning']}/>;
}
