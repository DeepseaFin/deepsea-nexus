import { memo, type ReactNode } from "react";
import Card from "@/components/customer/shared/Card";

export interface SectionCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
}

function SectionCard({ title, subtitle, actions, children }: SectionCardProps) {
  return (
    <Card title={title} subtitle={subtitle} actions={actions}>
      {children}
    </Card>
  );
}

const MemoizedSectionCard = memo(SectionCard);
MemoizedSectionCard.displayName = "SectionCard";

export default MemoizedSectionCard;
