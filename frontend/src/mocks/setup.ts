// Initialize MSW in development environment
if (process.env.NODE_ENV === 'development') {
  // Use dynamic import to avoid loading MSW in production
  const initMocks = async () => {
    const { worker } = await import('./browser');
    worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    });
    console.log('🔶 Mock Service Worker initialized');
  };

  initMocks().catch(error => {
    console.error('Failed to initialize MSW:', error);
  });
} 