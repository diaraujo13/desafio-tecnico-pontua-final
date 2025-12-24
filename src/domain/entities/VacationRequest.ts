import { Entity } from '../shared/Entity';
import { VacationStatus } from '../enums/VacationStatus';
import { DateRange } from '../value-objects/DateRange';
import { InvalidStatusTransitionError } from '../errors/InvalidStatusTransitionError';
import { RejectionReasonRequiredError } from '../errors/RejectionReasonRequiredError';

/**
 * VacationRequest Entity
 * Represents a vacation request with rich domain behavior
 */
export class VacationRequest extends Entity<VacationRequest> {
  private readonly _requesterId: string;
  private _reviewerId: string | null;
  private readonly _startDate: Date;
  private readonly _endDate: Date;
  private readonly _observation: string | null;
  private _status: VacationStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _reviewedAt: Date | null;
  private _rejectionReason: string | null;

  private constructor(
    id: string,
    requesterId: string,
    startDate: Date,
    endDate: Date,
    observation: string | null,
    status: VacationStatus,
    createdAt: Date,
    updatedAt: Date,
    reviewerId: string | null = null,
    reviewedAt: Date | null = null,
    rejectionReason: string | null = null,
  ) {
    super(id);
    this._requesterId = requesterId;
    this._reviewerId = reviewerId;
    this._startDate = new Date(startDate);
    this._endDate = new Date(endDate);
    this._observation = observation;
    this._status = status;
    this._createdAt = new Date(createdAt);
    this._updatedAt = new Date(updatedAt);
    this._reviewedAt = reviewedAt ? new Date(reviewedAt) : null;
    this._rejectionReason = rejectionReason;

    this.validate();
  }

  /**
   * Factory method to create a new VacationRequest
   * @param props - VacationRequest properties
   * @returns A new VacationRequest instance
   */
  static create(props: {
    id: string;
    requesterId: string;
    startDate: Date;
    endDate: Date;
    observation?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): VacationRequest {
    const now = new Date();
    const createdAt = props.createdAt || now;
    const updatedAt = props.updatedAt || now;

    // Validate date range using DateRange Value Object
    DateRange.create(props.startDate, props.endDate);

    return new VacationRequest(
      props.id,
      props.requesterId,
      props.startDate,
      props.endDate,
      props.observation || null,
      VacationStatus.PENDING_APPROVAL,
      createdAt,
      updatedAt,
    );
  }

  /**
   * Factory method to reconstruct an existing VacationRequest from persisted data
   * Used by repositories when loading data from storage
   * @param props - VacationRequest properties including current status
   * @returns A VacationRequest instance with the provided state
   */
  static reconstruct(props: {
    id: string;
    requesterId: string;
    startDate: Date;
    endDate: Date;
    observation?: string | null;
    status: VacationStatus;
    createdAt: Date;
    updatedAt: Date;
    reviewerId?: string | null;
    reviewedAt?: Date | null;
    rejectionReason?: string | null;
  }): VacationRequest {
    // Validate date range using DateRange Value Object
    DateRange.create(props.startDate, props.endDate);

    return new VacationRequest(
      props.id,
      props.requesterId,
      props.startDate,
      props.endDate,
      props.observation || null,
      props.status,
      props.createdAt,
      props.updatedAt,
      props.reviewerId || null,
      props.reviewedAt || null,
      props.rejectionReason || null,
    );
  }

  private validate(): void {
    // DateRange validation is done in create method
    // Additional validations can be added here
    if (!this._requesterId || this._requesterId.trim().length === 0) {
      throw new Error('Requester ID cannot be empty');
    }
  }

  get requesterId(): string {
    return this._requesterId;
  }

  get reviewerId(): string | null {
    return this._reviewerId;
  }

  get startDate(): Date {
    return new Date(this._startDate);
  }

  get endDate(): Date {
    return new Date(this._endDate);
  }

  get observation(): string | null {
    return this._observation;
  }

  get status(): VacationStatus {
    return this._status;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  get reviewedAt(): Date | null {
    return this._reviewedAt ? new Date(this._reviewedAt) : null;
  }

  get rejectionReason(): string | null {
    return this._rejectionReason;
  }

  /**
   * Approves the vacation request
   * @param reviewerId - ID of the manager reviewing the request
   * @throws InvalidStatusTransitionError if request is not pending
   */
  approve(reviewerId: string): void {
    if (this._status !== VacationStatus.PENDING_APPROVAL) {
      throw new InvalidStatusTransitionError(
        this._status,
        VacationStatus.APPROVED,
        this.getTransitionErrorMessage(this._status, VacationStatus.APPROVED),
      );
    }

    this._status = VacationStatus.APPROVED;
    this._reviewerId = reviewerId;
    this._reviewedAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Rejects the vacation request
   * @param reviewerId - ID of the manager reviewing the request
   * @param reason - Reason for rejection (mandatory)
   * @throws InvalidStatusTransitionError if request is not pending
   * @throws RejectionReasonRequiredError if reason is not provided
   */
  reject(reviewerId: string, reason: string): void {
    if (this._status !== VacationStatus.PENDING_APPROVAL) {
      throw new InvalidStatusTransitionError(
        this._status,
        VacationStatus.REJECTED,
        this.getTransitionErrorMessage(this._status, VacationStatus.REJECTED),
      );
    }

    if (!reason || reason.trim().length === 0) {
      throw new RejectionReasonRequiredError();
    }

    this._status = VacationStatus.REJECTED;
    this._reviewerId = reviewerId;
    this._rejectionReason = reason.trim();
    this._reviewedAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Cancels the vacation request
   * @throws InvalidStatusTransitionError if request cannot be cancelled
   */
  cancel(): void {
    if (this._status !== VacationStatus.PENDING_APPROVAL) {
      throw new InvalidStatusTransitionError(
        this._status,
        VacationStatus.CANCELLED,
        'Only pending requests can be cancelled',
      );
    }

    this._status = VacationStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  /**
   * Checks if the request can be approved
   * @returns true if request can be approved, false otherwise
   */
  private canBeApproved(): boolean {
    return this._status === VacationStatus.PENDING_APPROVAL;
  }

  /**
   * Gets error message for invalid status transitions
   */
  private getTransitionErrorMessage(currentStatus: string, targetStatus: string): string {
    const transitions: Record<string, Record<string, string>> = {
      [VacationStatus.CANCELLED]: {
        [VacationStatus.APPROVED]: 'Cannot approve a cancelled request',
        [VacationStatus.REJECTED]: 'Cannot reject a cancelled request',
      },
      [VacationStatus.APPROVED]: {
        [VacationStatus.REJECTED]: 'Cannot reject an approved request',
      },
      [VacationStatus.REJECTED]: {
        [VacationStatus.APPROVED]: 'Cannot approve a rejected request',
        [VacationStatus.CANCELLED]: 'Cannot cancel a rejected request',
      },
    };

    return (
      transitions[currentStatus]?.[targetStatus] ||
      `Cannot transition from ${currentStatus} to ${targetStatus}`
    );
  }

  /**
   * Checks if the request has expired
   * A request expires if today > start date or if it's after the end date
   * @returns true if request has expired, false otherwise
   */
  isExpired(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(this._startDate);
    startDate.setHours(0, 0, 0, 0);

    return today > startDate;
  }

  /**
   * Checks if the request can be edited
   * Only pending requests can be edited
   * @returns true if request can be edited, false otherwise
   */
  canBeEdited(): boolean {
    return this._status === VacationStatus.PENDING_APPROVAL;
  }

  /**
   * Checks if the request can be cancelled
   * Only pending requests can be cancelled
   * @returns true if request can be cancelled, false otherwise
   */
  canBeCancelled(): boolean {
    return this._status === VacationStatus.PENDING_APPROVAL;
  }
}
