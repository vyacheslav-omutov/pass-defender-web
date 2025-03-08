import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matWarningAmber } from "@ng-icons/material-icons/baseline";
import { ApiException } from '../../../api/api-client';
import { ApiExceptionResponse } from '../../data/api-exception.response';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    NgIcon
  ],
  template: `
    <div class="flex flex-col gap-3">
      @for (message of messages; track $index) {
        <div class="flex flex-row gap-2 text-carnation-100 text-sm p-2 bg-carnation-300 bg-opacity-10 border border-carnation-300 rounded-[10px]">
          <div class="flex h-full">
            <ng-icon name="matWarningAmber" class="text-xl text-carnation-400"></ng-icon>
          </div>
          <span>{{ message }}</span>
        </div>
      }
    </div>
  `,
  viewProviders: [provideIcons({ matWarningAmber })],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {
  private _messages: string[] = [];

  @Input()
  set exception(exception: ApiException) {
    if (!exception) {
      return;
    }

    this._messages = [];
    const isRelevantStatus =
      exception.status === HttpStatusCode.Unauthorized ||
      exception.status === HttpStatusCode.BadRequest;

    if (!isRelevantStatus) {
      this._messages = [exception.message];
      return;
    }

    const parsedMessages = this.parseApiErrorResponse(exception.response);
    this._messages = parsedMessages.length > 0 ? parsedMessages : [exception.message];
  }

  get messages(): string[] {
    return this._messages;
  }

  private parseApiErrorResponse(response: string): string[] {
    try {
      const parsedData: ApiExceptionResponse = JSON.parse(response);
      const messages: string[] = [];

      for (const [_, value] of Object.entries(parsedData)) {
        if (Array.isArray(value)) {
          messages.push(...value);
        } else {
          messages.push(value);
        }
      }
      return messages;

    } catch (error) {
      console.error('Failed to parse API error response:', error);
      return [];
    }
  }
}
