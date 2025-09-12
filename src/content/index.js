import { getActiveDomains } from "./matcher";
import {
  setupPasteInterceptor,
  setupEnterInterceptor,
  setupClickInterceptor
} from './interceptors';

(async () => {
  const activeDomains = await getActiveDomains();
  if (activeDomains.includes(window.location.hostname)) {
    setupPasteInterceptor();
    setupEnterInterceptor();
    setupClickInterceptor();
  }
})();
