import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const SLIDER_INTERVAL_MS = 2400;
const SLIDER_IMAGE_COUNT = 5;
const CAROUSEL_RADIUS_PX = 420;
const AUTO_ROTATE_DEG_PER_FRAME = 0.12;
const DRAG_SENSITIVITY = 0.5;
const FRICTION = 0.94;
const IDLE_VELOCITY_THRESHOLD = 0.01;

type ServiceIllustration = 'websites-slider' | 'redesign' | 'tools' | 'privacy' | 'seo';

interface ServiceItem {
  readonly titleKey: string;
  readonly textKey: string;
  readonly detailKey: string;
  readonly illustration: ServiceIllustration;
}

const SERVICE_ITEMS: readonly ServiceItem[] = [
  { titleKey: 'SERVICES.ITEM_1_TITLE', textKey: 'SERVICES.ITEM_1_TEXT', detailKey: 'SERVICES.ITEM_1_DETAIL', illustration: 'websites-slider' },
  { titleKey: 'SERVICES.ITEM_2_TITLE', textKey: 'SERVICES.ITEM_2_TEXT', detailKey: 'SERVICES.ITEM_2_DETAIL', illustration: 'redesign' },
  { titleKey: 'SERVICES.ITEM_3_TITLE', textKey: 'SERVICES.ITEM_3_TEXT', detailKey: 'SERVICES.ITEM_3_DETAIL', illustration: 'tools' },
  { titleKey: 'SERVICES.ITEM_4_TITLE', textKey: 'SERVICES.ITEM_4_TEXT', detailKey: 'SERVICES.ITEM_4_DETAIL', illustration: 'privacy' },
  { titleKey: 'SERVICES.ITEM_5_TITLE', textKey: 'SERVICES.ITEM_5_TEXT', detailKey: 'SERVICES.ITEM_5_DETAIL', illustration: 'seo' }
];

/**
 * Services section listing the offered business services as cards, arranged
 * on a real 3D cylinder that can be dragged to spin, auto-rotates when idle,
 * and keeps spinning briefly on release like a physical carousel.
 */
@Component({
  selector: 'app-services',
  imports: [TranslatePipe],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  protected readonly items = SERVICE_ITEMS;
  protected readonly sliderImages = Array.from({ length: SLIDER_IMAGE_COUNT }, (_, i) => i);
  protected readonly sliderIndex = signal(0);
  protected readonly isDragging = signal(false);
  protected readonly isAutoRotating = signal(true);
  protected readonly angleStep = 360 / this.items.length;
  protected readonly radius = CAROUSEL_RADIUS_PX;

  private readonly carousel = viewChild<ElementRef<HTMLElement>>('carousel');
  private rotation = 0;
  private velocity = 0;
  private autoRotate = true;
  private isDragActive = false;
  private dragStartX = 0;
  private dragStartRotation = 0;
  private lastPointerX = 0;
  private lastPointerTime = 0;
  private animationFrameId: number | null = null;

  constructor() {
    if (this.prefersReducedMotion) {
      return;
    }
    const intervalId = setInterval(() => this.advanceSlider(), SLIDER_INTERVAL_MS);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }

  ngAfterViewInit(): void {
    if (this.prefersReducedMotion) {
      return;
    }
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.destroyRef.onDestroy(() => {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
      }
    });
  }

  /** Advances the placeholder slider on the first service card to the next image. */
  private advanceSlider(): void {
    this.sliderIndex.update((index) => (index + 1) % SLIDER_IMAGE_COUNT);
  }

  /** Drives the carousel's per-frame rotation: auto-spin, momentum, or held drag position. */
  private animate(): void {
    if (!this.isDragActive) {
      if (this.autoRotate) {
        this.rotation += AUTO_ROTATE_DEG_PER_FRAME;
      } else if (Math.abs(this.velocity) > IDLE_VELOCITY_THRESHOLD) {
        this.rotation += this.velocity;
        this.velocity *= FRICTION;
      }
    }
    this.applyRotation();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private applyRotation(): void {
    this.carousel()?.nativeElement.style.setProperty('--carousel-rotation', `${this.rotation}deg`);
  }

  protected onDragStart(event: PointerEvent): void {
    if (this.prefersReducedMotion) {
      return;
    }
    this.isDragActive = true;
    this.isDragging.set(true);
    this.autoRotate = false;
    this.isAutoRotating.set(false);
    this.dragStartX = event.clientX;
    this.dragStartRotation = this.rotation;
    this.lastPointerX = event.clientX;
    this.lastPointerTime = performance.now();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onDragMove(event: PointerEvent): void {
    if (!this.isDragActive) {
      return;
    }
    const deltaX = event.clientX - this.dragStartX;
    this.rotation = this.dragStartRotation + deltaX * DRAG_SENSITIVITY;

    const now = performance.now();
    const dt = now - this.lastPointerTime;
    if (dt > 0) {
      this.velocity = ((event.clientX - this.lastPointerX) * DRAG_SENSITIVITY) / Math.max(dt, 8) * 16;
    }
    this.lastPointerX = event.clientX;
    this.lastPointerTime = now;
  }

  protected onDragEnd(): void {
    this.isDragActive = false;
    this.isDragging.set(false);
  }

  /** Snaps the carousel forward or backward by exactly one card. */
  protected step(direction: 1 | -1): void {
    this.autoRotate = false;
    this.isAutoRotating.set(false);
    this.velocity = 0;
    this.rotation += direction * this.angleStep;
  }

  /** Toggles the idle auto-rotation of the carousel on and off. */
  protected toggleAutoRotate(): void {
    this.autoRotate = !this.autoRotate;
    this.isAutoRotating.set(this.autoRotate);
    this.velocity = 0;
  }

  /** Computes the static per-card placement angle around the cylinder. */
  protected itemAngle(index: number): number {
    return index * this.angleStep;
  }
}
