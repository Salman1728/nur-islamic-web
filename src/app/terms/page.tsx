import { Suspense } from 'react';
import { ContentPage } from '@/components/content-page';
import Glossary from './glossary';

export const metadata = { title: 'Glossary — Nur' };

export default function Terms() {
  return (
    <ContentPage eyebrow="Learn the language" title="Glossary" description="Simple explanations of words you will hear while learning about Islam.">
      <Suspense fallback={null}><Glossary /></Suspense>
    </ContentPage>
  );
}
