// Plausible Analytics event tracking
// See: https://plausible.io/docs/custom-event-goals
export function trackEvent(eventName, props = {}) {
  if (window.plausible) {
    window.plausible(eventName, { props });
  }
}

// Pre-defined events
export const Events = {
  SIGNUP_STARTED: 'Signup Started',
  SIGNUP_COMPLETED: 'Signup Completed',
  LOGIN: 'Login',
  PROPERTY_VIEW: 'Property View',
  CTA_CLICK: 'CTA Click',
  LANGUAGE_TOGGLE: 'Language Toggle',
  THEME_TOGGLE: 'Theme Toggle',
};
