export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  whatItIs?: string;
  howToUseIt?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  actionGate?: boolean;
}

export type ProductionTab = 'CALLSHEET' | 'RISK' | 'RELEASES';
