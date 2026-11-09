import { TourStep, ProductionTab } from './tourTypes';
import { CALLSHEET_TOUR_STEPS } from './callsheetTourBlueprint';

export const RISK_TOUR_STEPS: TourStep[] = [
  {
    id: 'risk-summary',
    targetSelector: '#tour-risk-summary',
    title: 'Safety Risk Assessment',
    whatItIs: 'This reviews hazards, location risks, and emergency procedures for your shoot.',
    howToUseIt: 'Read through the safety checklist and add emergency contacts before going on set.',
    description: 'This reviews hazards, location risks, and emergency procedures for your shoot. Read through the safety checklist and add emergency contacts before going on set.',
    placement: 'bottom',
  },
  {
    id: 'risk-table',
    targetSelector: '#tour-risk-table',
    title: 'Hazard Evaluation Matrix',
    whatItIs: 'This table tracks specific scene dangers and what controls keep your crew safe.',
    howToUseIt: 'Click any hazard row to update risk severity and note safety precautions.',
    description: 'This table tracks specific scene dangers and what controls keep your crew safe. Click any hazard row to update risk severity and note safety precautions.',
    placement: 'top',
  },
];

export const RELEASES_TOUR_STEPS: TourStep[] = [
  {
    id: 'releases-selector',
    targetSelector: '#tour-releases-selector',
    title: 'Consent & Release Forms',
    whatItIs: 'These are legal consent agreements for your actors, location owners, and crew.',
    howToUseIt: 'Select a form template from the menu to fill in details and print paper copies.',
    description: 'These are legal consent agreements for your actors, location owners, and crew. Select a form template from the menu to fill in details and print paper copies.',
    placement: 'bottom',
  },
];

export function getTourStepsForTab(tab: ProductionTab): TourStep[] {
  switch (tab) {
    case 'CALLSHEET':
      return CALLSHEET_TOUR_STEPS;
    case 'RISK':
      return RISK_TOUR_STEPS;
    case 'RELEASES':
      return RELEASES_TOUR_STEPS;
    default:
      return CALLSHEET_TOUR_STEPS;
  }
}
