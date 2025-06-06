export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked. Please allow pop-ups and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/web-storage-unsupported':
      return 'Web storage is not supported. Please enable cookies and try again.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Sign-in not supported in this browser. Please try a different browser.';
    default:
      return 'An error occurred during sign-in. Please try again.';
  }
}; 