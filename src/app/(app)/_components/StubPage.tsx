import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';

interface StubPageProps {
 icon: LucideIcon;
 title: string;
 description: string;
 points?: string[];
}

export default function StubPage({ icon: Icon, title, description, points }: StubPageProps) {
 return <div className="dashboard-content">
  <section className="stub-page">
   <span className="stub-icon"><Icon aria-hidden="true"/></span>
   <span className="eyebrow">Coming soon</span>
   <h1>{title}</h1>
   <p>{description}</p>
   {points?.length ? <ul className="stub-points">{points.map(p => <li key={p}>{p}</li>)}</ul> : null}
   <Link href="/dashboard" className="primary-button small">Back to Dashboard</Link>
  </section>
 </div>;
}
