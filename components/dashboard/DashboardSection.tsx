"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionCard from "@/components/ui/SectionCard";
import { designTokens } from "@/lib/design/tokens";

export interface DashboardSectionProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly actions?: React.ReactNode;
  readonly children: React.ReactNode;
}

export default function DashboardSection({ title, subtitle, actions, children }: DashboardSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: designTokens.duration.standard / 1000 }}
    >
      <SectionCard title={title} subtitle={subtitle} actions={actions}>
        {children}
      </SectionCard>
    </motion.div>
  );
}
