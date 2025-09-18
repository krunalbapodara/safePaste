import {
  setupPasteInterceptor,
  setupEnterInterceptor,
  setupClickInterceptor
} from './interceptors';

(async () => {
  // Add logic here to only execute these on specific domain only.
  setupPasteInterceptor();
  setupEnterInterceptor();
  setupClickInterceptor();
})();
