export interface JourneyScreenProps {
  readonly children: React.ReactNode;
}

export default function JourneyScreen({ children }: JourneyScreenProps) {
  return <section className="animate-fade-up space-y-4 sm:space-y-5">{children}</section>;
}
