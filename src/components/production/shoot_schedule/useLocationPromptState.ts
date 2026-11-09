import { useState } from 'react';
import { ShootScheduleDaySheet, CallSheetData } from '../../../types';

export function useLocationPromptState(
  days: ShootScheduleDaySheet[],
  update: (updated: Partial<CallSheetData>) => void
) {
  const [locationPromptTarget, setLocationPromptTarget] = useState<{
    sceneSetting: string;
    sceneNumber: string;
    filmingLocation: string;
  } | null>(null);

  const handleAssignToAllMatchingSettings = () => {
    if (!locationPromptTarget) return;
    const { sceneSetting, filmingLocation } = locationPromptTarget;
    const nextDays = days.map((d) => ({
      ...d,
      rows: (d.rows || []).map((r) =>
        r.location?.trim().toUpperCase() === sceneSetting.trim().toUpperCase()
          ? { ...r, description: filmingLocation }
          : r
      ),
    }));
    update({ days: nextDays });
    setLocationPromptTarget(null);
  };

  return {
    locationPromptTarget,
    setLocationPromptTarget,
    handleLocationChangePrompt: (sceneSetting: string, sceneNumber: string, locationVal: string) => {
      if (sceneSetting && locationVal) {
        setLocationPromptTarget({ sceneSetting, sceneNumber, filmingLocation: locationVal });
      }
    },
    handleAssignToAllMatchingSettings,
  };
}
