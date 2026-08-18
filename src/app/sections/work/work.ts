import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProcessStepsComponent } from '../../shared/process-steps/process-steps';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { InfoModalComponent } from '../../shared/info-modal/info-modal';
import { SectionDividerComponent } from '../../shared/section-divider/section-divider';

interface ProjectCard {
  readonly id: string;
  readonly titleKey: string;
  readonly textKey: string;
  readonly screenshotSrc: string | null;
  readonly stepKeys: readonly string[];
  readonly stepAriaLabelKey: string;
  readonly link: string;
  readonly hasCmsInfo: boolean;
  readonly hasPdfReport: boolean;
}

const PROJECTS: readonly ProjectCard[] = [
  {
    id: 'shm',
    titleKey: 'WORK.SHM_TITLE',
    textKey: 'WORK.SHM_TEXT',
    screenshotSrc: 'img/site-second-hand-manager.webp',
    stepKeys: ['WORK.SHM_DEMO_STEP_1', 'WORK.SHM_DEMO_STEP_2', 'WORK.SHM_DEMO_STEP_3'],
    stepAriaLabelKey: 'WORK.SHM_DEMO_LABEL',
    link: 'https://second-hand-manager.com',
    hasCmsInfo: false,
    hasPdfReport: false
  },
  {
    id: 'dune',
    titleKey: 'WORK.DUNE_TITLE',
    textKey: 'WORK.DUNE_TEXT',
    screenshotSrc: 'img/site-dune-main-a-lautre-ch.webp',
    stepKeys: ['WORK.DUNE_DEMO_STEP_1', 'WORK.DUNE_DEMO_STEP_2', 'WORK.DUNE_DEMO_STEP_3'],
    stepAriaLabelKey: 'WORK.DUNE_DEMO_LABEL',
    link: 'https://dune-main-a-lautre.ch',
    hasCmsInfo: true,
    hasPdfReport: true
  },
  {
    id: 'scribe',
    titleKey: 'WORK.SCRIBE_TITLE',
    textKey: 'WORK.SCRIBE_TEXT',
    screenshotSrc: 'img/site-la-scribe-du-nil-com.webp',
    stepKeys: ['WORK.SCRIBE_FEATURE_1', 'WORK.SCRIBE_FEATURE_2', 'WORK.SCRIBE_FEATURE_3', 'WORK.SCRIBE_FEATURE_4'],
    stepAriaLabelKey: 'WORK.SCRIBE_FEATURES_LABEL',
    link: 'https://la-scribe-du-nil.com',
    hasCmsInfo: false,
    hasPdfReport: true
  },
  {
    id: 'safety',
    titleKey: 'WORK.SAFETY_TITLE',
    textKey: 'WORK.SAFETY_TEXT',
    screenshotSrc: 'img/site-safety-concept-ch.webp',
    stepKeys: ['WORK.SAFETY_FEATURE_1', 'WORK.SAFETY_FEATURE_2', 'WORK.SAFETY_FEATURE_3'],
    stepAriaLabelKey: 'WORK.SAFETY_FEATURES_LABEL',
    link: 'https://safety-concept.ch',
    hasCmsInfo: false,
    hasPdfReport: true
  }
];

const PORTFOLIO_STEP_KEYS = [
  'PORTFOLIO_CTA.DEMO_STEP_1',
  'PORTFOLIO_CTA.DEMO_STEP_2',
  'PORTFOLIO_CTA.DEMO_STEP_3'
] as const;

/** Work section: real client projects shown as a card grid, with a closing portfolio link card. */
@Component({
  selector: 'app-work',
  imports: [TranslatePipe, ProcessStepsComponent, MagneticDirective, InfoModalComponent, SectionDividerComponent],
  templateUrl: './work.html',
  styleUrl: './work.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkComponent {
  protected readonly projects = PROJECTS;
  protected readonly portfolioStepKeys = PORTFOLIO_STEP_KEYS;
  protected readonly isCmsModalOpen = signal(false);

  private readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly scene = viewChild<ElementRef<HTMLElement>>('scene');
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  /** Opens the explainer modal for how a content management system works. */
  protected openCmsModal(): void {
    this.isCmsModalOpen.set(true);
  }

  /** Closes the CMS explainer modal. */
  protected closeCmsModal(): void {
    this.isCmsModalOpen.set(false);
  }

  /** Pans the card track horizontally based on where the cursor sits over the scene. */
  protected onSceneMouseMove(event: MouseEvent): void {
    if (this.prefersReducedMotion) {
      return;
    }
    const scene = this.scene()?.nativeElement;
    const track = this.track()?.nativeElement;
    if (!scene || !track) {
      return;
    }
    const overflow = track.scrollWidth - scene.clientWidth;
    if (overflow <= 0) {
      return;
    }
    const ratio = (event.clientX - scene.getBoundingClientRect().left) / scene.clientWidth;
    const clampedRatio = Math.min(1, Math.max(0, ratio));
    track.style.transform = `translateX(-${clampedRatio * overflow}px)`;
  }

  /** Resets the card track to its resting position once the cursor leaves the scene. */
  protected onSceneMouseLeave(): void {
    const track = this.track()?.nativeElement;
    if (track) {
      track.style.transform = 'translateX(0)';
    }
  }
}
