import { useEffect, useCallback, useState } from 'react';
import { useWaterQualityStore } from '../store/useWaterQualityStore';
import { useUserStore } from '../store/useUserStore';

export const useWaterQualityForm = () => {
  const { user } = useUserStore();
  const {
    form,
    setFormData,
    resetForm,
    validateForm,
    submitForm,
    clearFormMessages,
  } = useWaterQualityStore();

  const { formData, isSubmitting, validation, submitError, submitSuccess } = form;
  const [showDraftSaved, setShowDraftSaved] = useState(false);

  // Auto-save draft to localStorage
  useEffect(() => {
    const saveDraft = () => {
      if (user && (formData.temperature !== '' || formData.ph !== '' || formData.notes !== '')) {
        localStorage.setItem(`waterQualityDraft_${user.uid}`, JSON.stringify(formData));
        setShowDraftSaved(true);
        setTimeout(() => setShowDraftSaved(false), 2000);
      }
    };

    const timeoutId = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, user]);

  // Load draft on mount
  useEffect(() => {
    if (user) {
      const savedDraft = localStorage.getItem(`waterQualityDraft_${user.uid}`);
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          const draftDate = new Date(draftData.date);
          const today = new Date();
          if (draftDate.toDateString() === today.toDateString()) {
            setFormData(draftData);
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }
  }, [user, setFormData]);

  const handleInputChange = useCallback((field: string, value: string | number) => {
    setFormData({ [field]: value });
    if (submitError || submitSuccess) {
      clearFormMessages();
    }
  }, [setFormData, submitError, submitSuccess, clearFormMessages]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    validateForm();
    await submitForm(user.uid);
    
    if (user) {
      localStorage.removeItem(`waterQualityDraft_${user.uid}`);
    }
  }, [user, validateForm, submitForm]);

  const handleReset = useCallback(() => {
    resetForm();
    if (user) {
      localStorage.removeItem(`waterQualityDraft_${user.uid}`);
    }
  }, [resetForm, user]);

  return {
    // State
    formData,
    isSubmitting,
    validation,
    submitError,
    submitSuccess,
    showDraftSaved,
    
    // Actions
    handleInputChange,
    handleSubmit,
    handleReset,
    clearFormMessages,
  };
}; 