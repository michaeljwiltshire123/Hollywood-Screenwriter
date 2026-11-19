import { TourStep, ProductionTab } from './tourTypes';
import { CALLSHEET_TOUR_STEPS } from './callsheetTourBlueprint';

export const RISK_TOUR_STEPS: TourStep[] = [
  {
    id: 'risk-summary',
    targetSelector: '#tour-risk-summary',
    title: 'On-Set Health & Safety (H&S) Suite',
    whatItIs: 'This area scans your script for set hazards and gives you editable templates and printable posters.',
    howToUseIt: 'Use the buttons in the top-right to Print or save your Full Pack as PDF or Word (.docx).',
    description: 'This area scans your script for set hazards and gives you editable templates and printable posters. Use the buttons in the top-right to Print or save your Full Pack as PDF or Word (.docx).',
    placement: 'bottom',
  },
  {
    id: 'hs-templates',
    targetSelector: '#tour-hs-templates',
    title: 'Editable Templates & Forms',
    whatItIs: 'Switch between Hazard Checklist, Daily Safety Briefing, Incident Log, Emergency Contacts, and Safety Signs Bank.',
    howToUseIt: 'Click any template tab to fill in crew names, hospital numbers, and incident notes on screen—exports include blank lines for set.',
    description: 'Switch between Hazard Checklist, Daily Safety Briefing, Incident Log, Emergency Contacts, and Safety Signs Bank. Click any template tab to fill in crew names, hospital numbers, and incident notes on screen—exports include blank lines for set.',
    placement: 'bottom',
  },
  {
    id: 'risk-table',
    targetSelector: '#tour-hs-workspace',
    title: 'Edit Rows & Add Custom Entries',
    whatItIs: 'Every field inside the active checklist or template can be edited directly.',
    howToUseIt: 'Type straight into any box, or use Add Hazard, Add Row, or Log Incident to insert your own entries.',
    description: 'Every field inside the active checklist or template can be edited directly. Type straight into any box, or use Add Hazard, Add Row, or Log Incident to insert your own entries.',
    placement: 'top',
  },
  {
    id: 'hs-posters',
    targetSelector: '#tour-hs-signs-tab',
    title: 'Printable Safety Warning Posters',
    whatItIs: 'The Safety Signs Bank contains 12 landscape posters for stunts, high voltage, quiet on set, first aid, and fire points.',
    howToUseIt: 'Click Safety Signs Bank here, then click Print Poster on any sign to print full-page notices for set doors and generators.',
    description: 'The Safety Signs Bank contains 12 landscape posters for stunts, high voltage, quiet on set, first aid, and fire points. Click Safety Signs Bank here, then click Print Poster on any sign to print full-page notices for set doors and generators.',
    placement: 'bottom',
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
