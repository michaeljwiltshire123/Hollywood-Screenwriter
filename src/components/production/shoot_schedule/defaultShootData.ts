import { ScheduleRowItem, ScreenplayDocument, CallSheetData, ShootScheduleDaySheet } from '../../../types';
import { deriveScheduleRowsFromScript } from './scheduleRowGenerator';
import { calculateDateRangeDays } from './multiDayOps';

export function getDefaultCallSheetData(script: ScreenplayDocument): CallSheetData {
  const extractedRows = deriveScheduleRowsFromScript(script, []);
  const initialRows = extractedRows.length > 0 ? extractedRows : [];

  const initialDays: ShootScheduleDaySheet[] = [
    {
      dayNumber: 1,
      dateStr: '2026-11-05',
      title: 'Day 1',
      isRestDay: false,
      rows: initialRows,
    },
  ];

  return {
    shootDate: '2026-11-05',
    dateFrom: '2026-11-05',
    dateTo: '2026-11-05',
    activeDayNumber: 1,
    days: initialDays,
    isHighlightModeActive: false,
    activeFilter: 'ALL',
    rows: initialRows,
    directorName: script.author || 'Director',
    producerName: 'Producer',
    dopName: 'Director of Photography',
    generalCallTime: '07:30',
    breakfastTime: '06:00',
    estimatedWrapTime: '16:00',
    locationName: 'Production Studio / Location',
    locationAddress: 'Main Stage Lot',
    nearestHospital: 'City General Emergency Hospital',
    weatherForecast: 'Clear & Mild',
    sunriseTime: '06:15 AM',
    sunsetTime: '07:45 PM',
    wardrobeLocation: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    additionalContacts: [],
    generalNotes: '',
    characters: [],
  };
}
