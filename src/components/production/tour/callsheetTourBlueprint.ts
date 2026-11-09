import { TourStep } from './tourTypes';
import { CALLSHEET_STEPS_PART1 } from './callsheetTourBlueprintPart1';
import { CALLSHEET_STEPS_PART2 } from './callsheetTourBlueprintPart2';

export const CALLSHEET_TOUR_STEPS: TourStep[] = [
  ...CALLSHEET_STEPS_PART1,
  ...CALLSHEET_STEPS_PART2,
];

