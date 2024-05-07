import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppModule } from './app/app.module';
import { application } from 'express';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// export const appConfig: ApplicationConfig = {
//   providers: [provideHttpClient(withFetch()), provideRouter(routes), provideClientHydration()]
// };