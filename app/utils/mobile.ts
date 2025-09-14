export function isMobile() {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for touch capability and screen size
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;
  
  // Check user agent for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(navigator.userAgent);

  return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
}

export function isTablet() {
  if (typeof window === 'undefined') {
    return false;
  }

  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1024;
  
  return hasTouchScreen && isTabletSize;
}

export function isTouchDevice() {
  if (typeof window === 'undefined') {
    return false;
  }

  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}