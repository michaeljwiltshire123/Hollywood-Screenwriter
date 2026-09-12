import React, { useState, useEffect } from 'react';
import { TitlePage } from '../../types';

interface UseTitlePageModalStateProps {
  isOpen: boolean;
  titlePage: TitlePage;
  onSave: (updated: TitlePage) => void;
  onStartNewScript: (customTitlePage?: TitlePage) => void;
  onClose: () => void;
  mode?: 'startup' | 'form';
}

export const useTitlePageModalState = ({
  isOpen,
  titlePage,
  onSave,
  onStartNewScript,
  onClose,
  mode = 'form',
}: UseTitlePageModalStateProps) => {
  const [showTitleForm, setShowTitleForm] = useState(mode === 'form');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [form, setForm] = useState<TitlePage>({
    title: 'UNTITLED SCREENPLAY',
    credit: 'Written by',
    author: 'J. Onionfist',
    source: '',
    contact: '',
    date: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    draftColor: 'White Draft',
  });

  useEffect(() => {
    if (isOpen) {
      setShowTitleForm(mode === 'form');
      setIsCreatingNew(false);
      setForm({
        title: titlePage.title || 'UNTITLED SCREENPLAY',
        credit: titlePage.credit || 'Written by',
        author: titlePage.author || 'J. Onionfist',
        source: titlePage.source || '',
        contact: titlePage.contact || '',
        date: titlePage.date || new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
        draftColor: titlePage.draftColor || 'White Draft',
      });
    }
  }, [titlePage, isOpen, mode]);

  const handleStartNewClick = () => {
    setIsCreatingNew(true);
    setForm({ title: '', credit: '', author: '', source: '', contact: '', date: '', draftColor: '' });
    setShowTitleForm(true);
  };

  const handleEditCurrentClick = () => {
    setIsCreatingNew(false);
    setForm({
      title: titlePage.title || '',
      credit: titlePage.credit || 'Written by',
      author: titlePage.author || '',
      source: titlePage.source || '',
      contact: titlePage.contact || '',
      date: titlePage.date || new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      draftColor: titlePage.draftColor || 'White Draft',
    });
    setShowTitleForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const processedForm: TitlePage = {
      title: form.title.trim() || 'UNTITLED SCREENPLAY',
      credit: form.credit.trim() || 'Written by',
      author: form.author.trim() || (isCreatingNew ? '' : (titlePage.author || '')),
      source: form.source.trim(),
      contact: form.contact.trim(),
      date: form.date.trim() || currentDate,
      draftColor: form.draftColor?.trim() || 'White Draft',
    };
    if (isCreatingNew) onStartNewScript(processedForm);
    else onSave(processedForm);
    onClose();
  };

  return {
    showTitleForm,
    setShowTitleForm,
    isCreatingNew,
    form,
    setForm,
    handleStartNewClick,
    handleEditCurrentClick,
    handleSubmit,
  };
};
