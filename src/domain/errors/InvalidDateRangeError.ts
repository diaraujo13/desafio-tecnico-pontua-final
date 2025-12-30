import { DomainError } from './DomainError';

/**
 * Error thrown when a date range is invalid (start date >= end date)
 */
export class InvalidDateRangeError extends DomainError {
  constructor(startDate?: Date, endDate?: Date) {
    let message =
      'Intervalo de datas inválido: a data de início deve ser anterior à data de término';

    if (startDate && endDate) {
      const startStr = isNaN(startDate.getTime()) ? 'Data inválida' : startDate.toISOString();
      const endStr = isNaN(endDate.getTime()) ? 'Data inválida' : endDate.toISOString();
      message = `Intervalo de datas inválido: a data de início (${startStr}) deve ser anterior à data de término (${endStr})`;
    } else if (startDate && isNaN(startDate.getTime())) {
      message = 'Intervalo de datas inválido: a data de início é inválida';
    } else if (endDate && isNaN(endDate.getTime())) {
      message = 'Intervalo de datas inválido: a data de término é inválida';
    }

    super(message);
  }
}
