import type { Metadata } from 'next';
import NotificationCenter from '@/components/workspace/NotificationCenter';

export const metadata: Metadata = {
  title: 'Notification Center v2 | Deepsea Nexus',
  description: 'Institutional notification center for alerts, approvals and operational events.',
};

export default function NotificationsV2Page() {
  return <NotificationCenter />;
}
