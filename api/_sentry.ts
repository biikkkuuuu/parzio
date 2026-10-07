export const Sentry = {
  captureException: (err: any) => {
    console.error('Sentry captured error:', err);
  },
  captureMessage: (msg: string) => {
    console.log('Sentry message:', msg);
  }
};
