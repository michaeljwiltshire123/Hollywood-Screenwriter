import { useState } from 'react';
import { LoglineData } from '../../../types';
import { SprintApplyResult, SprintVaultItem } from '../idea_sprint/ideaSprintTypes';

export function useLoglineSprint(
  onApplyField: (field: keyof Omit<LoglineData, 'order' | 'text'>, text: string) => void,
  onSaveVaultItem?: (item: SprintVaultItem) => void,
) {
  const [sprintField, setSprintField] = useState<keyof Omit<LoglineData, 'order' | 'text'> | null>(null);
  const [sprintQuestion, setSprintQuestion] = useState<string | null>(null);

  const startSprint = (field: keyof Omit<LoglineData, 'order' | 'text'>, label: string) => {
    setSprintField(field);
    setSprintQuestion(`Brainstorm ideas: ${label}`);
  };

  const handleApply = (res: SprintApplyResult) => {
    if (sprintField && res.primaryIdea) {
      onApplyField(sprintField, res.primaryIdea);
    }
    if (res.saveToVault && res.vaultItem && onSaveVaultItem) {
      onSaveVaultItem(res.vaultItem);
    }
    setSprintField(null);
    setSprintQuestion(null);
  };

  const cancelSprint = () => {
    setSprintField(null);
    setSprintQuestion(null);
  };

  return { sprintQuestion, startSprint, handleApply, cancelSprint };
}
