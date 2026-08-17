import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ImprintComponent } from './sections/imprint/imprint';
import { PrivacyPolicyComponent } from './sections/privacy-policy/privacy-policy';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'impressum', component: ImprintComponent },
  { path: 'datenschutz', component: PrivacyPolicyComponent }
];
