import { BookOpen } from 'lucide-react';
import StubPage from '../_components/StubPage';

export const metadata = { title: 'Qur’an — Nur' };

export default function Page() {
 return <StubPage icon={BookOpen} title="Qur’an"
  description="Read, listen and reflect on the Qur’an with translations and tafsir."
  points={['Full mushaf with translations', 'Audio recitation', 'Bookmarks and reflections']}/>;
}
