import { Component, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating implements FormValueControl<number> {
  protected readonly stars = [1, 2, 3, 4, 5];

  readonly value = model(0);
  readonly touch = output<void>();

  protected setRating(rating: number): void {
    this.value.set(rating);
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget;
    const nextTarget = event.relatedTarget;

    if (host instanceof HTMLElement && !(nextTarget instanceof Node && host.contains(nextTarget))) {
      this.touch.emit();
    }
  }
}
