export interface ICalendarEvent {
  start: Date;
  end: Date;
  title: string;
  resource?: {
    id: string;
    title: string;
    status: string;
    phone_number: string;
    email: string;
    family_name: string;
    given_name: string;
  };
}
