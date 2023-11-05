export enum BookingErrorType {
  appt = 'appt',
  user = 'user',
  submit = 'submit',
}

export const appt_types = [
  'Emergency',
  'Cleaning',
  'Dental Implant',
  'Treatment',
  'Dental Exam',
];

export type ApptType =
  | 'Emergency'
  | 'Cleaning'
  | 'Dental Implant'
  | 'Treatment'
  | 'Dental Exam';

export const apptTypeAndDuration = {
  Emergency: 1.5,
  Cleaning: 1,
  'Dental Implant': 1.5,
  Treatment: 1,
  'Dental Exam': 1,
};

export interface TimeArrayItem {
  start: string; // 10:30
  end: string;
}
