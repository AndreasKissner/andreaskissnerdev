import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProcessStepsComponent } from '../../shared/process-steps/process-steps';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { InfoModalComponent } from '../../shared/info-modal/info-modal';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';
import { TiltDirective } from '../../shared/tilt.directive';

/** A downloadable third-party audit report (Lighthouse, accessibility scan, etc.). */
interface AdditionalReport {
  readonly labelKey: string;
  readonly fileName: string;
}

interface ProjectCard {
  readonly id: string;
  readonly kindKey: string;
  readonly titleKey: string;
  readonly textKey: string;
  readonly screenshotSrc: string | null;
  readonly stepKeys: readonly string[];
  readonly stepAriaLabelKey: string;
  readonly link: string;
  readonly hasCmsInfo: boolean;
  readonly additionalReports: readonly AdditionalReport[];
}

const PROJECTS: readonly ProjectCard[] = [
  {
    id: 'shm',
    kindKey: 'WORK.KIND_WEBAPP',
    titleKey: 'WORK.SHM_TITLE',
    textKey: 'WORK.SHM_TEXT',
    screenshotSrc: 'img/site-second-hand-manager.webp',
    stepKeys: ['WORK.SHM_DEMO_STEP_1', 'WORK.SHM_DEMO_STEP_2', 'WORK.SHM_DEMO_STEP_3'],
    stepAriaLabelKey: 'WORK.SHM_DEMO_LABEL',
    link: 'https://second-hand-manager.com',
    hasCmsInfo: false,
    additionalReports: [
      { labelKey: 'WORK.REPORT_LIGHTHOUSE', fileName: 'second-hand-manager-lighthouse-report.pdf' },
      { labelKey: 'WORK.REPORT_ACCESSIBILITY', fileName: 'second-hand-manager-accessibility-scan.pdf' }
    ]
  },
  {
    id: 'dune',
    kindKey: 'WORK.KIND_WEBSITE',
    titleKey: 'WORK.DUNE_TITLE',
    textKey: 'WORK.DUNE_TEXT',
    screenshotSrc: 'img/site-dune-main-a-lautre-ch.webp',
    stepKeys: ['WORK.DUNE_DEMO_STEP_1', 'WORK.DUNE_DEMO_STEP_2', 'WORK.DUNE_DEMO_STEP_3'],
    stepAriaLabelKey: 'WORK.DUNE_DEMO_LABEL',
    link: 'https://dune-main-a-lautre.ch',
    hasCmsInfo: true,
    additionalReports: [
      { labelKey: 'WORK.REPORT_LIGHTHOUSE', fileName: 'dune-main-a-lautre-lighthouse-report.pdf' },
      { labelKey: 'WORK.REPORT_ACCESSIBILITY', fileName: 'dune-main-a-lautre-accessibility-scan.pdf' }
    ]
  },
  {
    id: 'restaurant',
    kindKey: 'WORK.KIND_DEMO',
    titleKey: 'WORK.RESTAURANT_TITLE',
    textKey: 'WORK.RESTAURANT_TEXT',
    screenshotSrc: 'img/presentationdemoimg.webp',
    stepKeys: ['WORK.RESTAURANT_FEATURE_1', 'WORK.RESTAURANT_FEATURE_2', 'WORK.RESTAURANT_FEATURE_3'],
    stepAriaLabelKey: 'WORK.RESTAURANT_FEATURES_LABEL',
    link: 'https://restaurantdemo.andreaskissner.dev/',
    hasCmsInfo: false,
    additionalReports: []
  },
  {
    id: 'safety',
    kindKey: 'WORK.KIND_WEBSITE',
    titleKey: 'WORK.SAFETY_TITLE',
    textKey: 'WORK.SAFETY_TEXT',
    screenshotSrc: 'img/site-safety-concept-ch.webp',
    stepKeys: ['WORK.SAFETY_FEATURE_1', 'WORK.SAFETY_FEATURE_2', 'WORK.SAFETY_FEATURE_3'],
    stepAriaLabelKey: 'WORK.SAFETY_FEATURES_LABEL',
    link: 'https://safety-concept.ch',
    hasCmsInfo: false,
    additionalReports: [
      { labelKey: 'WORK.REPORT_LIGHTHOUSE', fileName: 'safety-concept-lighthouse-report.pdf' },
      { labelKey: 'WORK.REPORT_ACCESSIBILITY', fileName: 'safety-concept-accessibility-scan.pdf' }
    ]
  }
];

/** A single client testimonial card. */
interface Testimonial {
  readonly id: string;
  readonly quoteKey: string;
  readonly nameKey: string | null;
  readonly roleKey: string;
  readonly companyKey: string;
  readonly companyLink: string;
  readonly avatarInitial: string;
}

const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'safety',
    quoteKey: 'WORK.TESTIMONIAL_1_QUOTE',
    nameKey: 'WORK.TESTIMONIAL_1_NAME',
    roleKey: 'WORK.TESTIMONIAL_1_ROLE',
    companyKey: 'WORK.TESTIMONIAL_1_COMPANY',
    companyLink: 'https://safety-concept.ch',
    avatarInitial: 'A'
  },
  {
    id: 'dune',
    quoteKey: 'WORK.TESTIMONIAL_2_QUOTE',
    nameKey: 'WORK.TESTIMONIAL_2_NAME',
    roleKey: 'WORK.TESTIMONIAL_2_ROLE',
    companyKey: 'WORK.TESTIMONIAL_2_COMPANY',
    companyLink: 'https://dune-main-a-lautre.ch',
    avatarInitial: 'J'
  }
];

const PORTFOLIO_STEP_KEYS = [
  'PORTFOLIO_CTA.DEMO_STEP_1',
  'PORTFOLIO_CTA.DEMO_STEP_2',
  'PORTFOLIO_CTA.DEMO_STEP_3'
] as const;

/** Work section: real client projects as a compact card grid with a detail modal and a closing portfolio link card. */
@Component({
  selector: 'app-work',
  imports: [
    TranslatePipe,
    ProcessStepsComponent,
    MagneticDirective,
    InfoModalComponent,
    SectionDividerComponent,
    TiltDirective
  ],
  templateUrl: './work.html',
  styleUrl: './work.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkComponent {
  protected readonly projects = PROJECTS;
  protected readonly testimonials = TESTIMONIALS;
  protected readonly portfolioStepKeys = PORTFOLIO_STEP_KEYS;
  protected readonly isCmsModalOpen = signal(false);
  protected readonly selectedProject = signal<ProjectCard | null>(null);

  /** Opens the detail modal for the given project. */
  protected openDetails(project: ProjectCard): void {
    this.selectedProject.set(project);
  }

  /** Closes the project detail modal. */
  protected closeDetails(): void {
    this.selectedProject.set(null);
  }

  /** Opens the explainer modal for how a content management system works. */
  protected openCmsModal(): void {
    this.isCmsModalOpen.set(true);
  }

  /** Closes the CMS explainer modal. */
  protected closeCmsModal(): void {
    this.isCmsModalOpen.set(false);
  }
}
