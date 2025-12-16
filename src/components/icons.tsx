import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

const IconContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-4 w-4", className)}
  >
    {children}
  </svg>
);

export const NIonIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconContainer {...props}>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">N</text>
  </IconContainer>
);

export const PIonIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconContainer {...props}>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">P</text>
  </IconContainer>
);

export const KIonIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconContainer {...props}>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">K</text>
  </IconContainer>
);

export const PHIcon = (props: SVGProps<SVGSVGElement>) => (
    <IconContainer {...props}>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">pH</text>
    </IconContainer>
  );
