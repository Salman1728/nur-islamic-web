import { notFound } from 'next/navigation';
import { LESSONS } from '@/lib/content';
import LessonView from './lesson-view';

export const dynamicParams = false;

export function generateStaticParams() {
  return LESSONS.map(l => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = LESSONS.find(l => l.slug === slug);
  return { title: lesson ? `${lesson.title} — Nur` : 'Lesson — Nur' };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!LESSONS.some(l => l.slug === slug)) notFound();
  return <LessonView slug={slug} />;
}
