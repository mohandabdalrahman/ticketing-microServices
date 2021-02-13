import {
  Publisher,
  ExpirationCompletedEvent,
  Subjects,
} from '@motickets/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
 