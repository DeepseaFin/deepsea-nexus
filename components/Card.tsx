import { ReactNode } from "react";
import UICard from "@/components/ui/Card";

type CardProps = {
  children: ReactNode;
};

export default function Card({ children }: CardProps) {
  return <UICard interactive className="p-8">{children}</UICard>;
}