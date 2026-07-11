import { useState, useCallback } from 'react';
import { useLanguage } from '../LanguageContext';

export interface RegistrationErrorState {
  error: string;
  hasError: boolean;
}

export function useRegistrationErrorHandler() {
  const [errorState, setErrorState] = useState<RegistrationErrorState>({
    error: '',
    hasError: false,
  });
  const { language } = useLanguage();
  const isDe = language === 'de';

  const clearError = useCallback(() => {
    setErrorState({ error: '', hasError: false });
  }, []);

  const setError = useCallback((message: string) => {
    setErrorState({ error: message, hasError: !!message });
  }, []);

  const handleApiError = useCallback(async (errorOrResponse: Response | any, fallbackMessage?: string) => {
    let errorMessage = '';
    
    if (errorOrResponse && typeof errorOrResponse.json === 'function') {
      try {
        const data = await errorOrResponse.json();
        if (data && data.error) {
          errorMessage = data.error;
        }
      } catch (e) {
        if (errorOrResponse.status === 409) {
          errorMessage = isDe
            ? 'Diese E-Mail-Adresse wird bereits verwendet.'
            : 'This email address is already in use.';
        } else if (errorOrResponse.status === 400) {
          errorMessage = isDe
            ? 'Bitte füllen Sie alle erforderlichen Felder aus.'
            : 'Please fill out all required fields.';
        }
      }
    } else if (errorOrResponse && typeof errorOrResponse === 'object') {
      if (errorOrResponse.error) {
        errorMessage = errorOrResponse.error;
      } else if (errorOrResponse.status === 409) {
        errorMessage = isDe
          ? 'Diese E-Mail-Adresse wird bereits verwendet.'
          : 'This email address is already in use.';
      } else if (errorOrResponse.status === 400) {
        errorMessage = isDe
          ? 'Bitte füllen Sie alle erforderlichen Felder aus.'
          : 'Please fill out all required fields.';
      }
    }

    if (!errorMessage) {
      errorMessage = fallbackMessage || (isDe
        ? 'Registrierung fehlgeschlagen. Bitte versuchen Sie es später noch einmal.'
        : 'Registration failed. Please try again later.');
    }

    setErrorState({ error: errorMessage, hasError: true });
    return errorMessage;
  }, [isDe]);

  const handleNetworkError = useCallback((err: any) => {
    console.error('[Registration Hook] Network Error details:', err);
    const message = isDe
      ? 'Netzwerkfehler bei der Registrierung. Bitte überprüfen Sie Ihre Internetverbindung.'
      : 'Network error during registration. Please check your internet connection.';
    setErrorState({ error: message, hasError: true });
    return message;
  }, [isDe]);

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    setError,
    clearError,
    handleApiError,
    handleNetworkError,
  };
}
