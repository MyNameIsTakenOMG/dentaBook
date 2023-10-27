import {
  NumberArrayItem,
  SlotTypes,
  TimeArrayItem,
  appointmentArrayConvertor,
  appointmentArrayReverseConvertor,
  mergeSort,
  timeslotsFinder,
} from '../timeslotsFinder';

describe('timeslotsFinder', () => {
  // convertors
  it('should convert time strings to the according numbers', () => {
    // console.log('hello world');
    const time_arr = [
      {
        start: '10:30',
        end: '13:00',
      },
    ];
    const num_arr = appointmentArrayConvertor(time_arr);
    expect(num_arr.length).toEqual(1);
    expect(num_arr[0]).toStrictEqual({ start: 10.5, end: 13 });
  });
  it('should convert numbers to the according time strings', () => {
    const num_arr = [
      {
        start: 10.5,
        end: 13,
      },
    ];
    const time_arr = appointmentArrayReverseConvertor(num_arr);
    expect(time_arr.length).toEqual(1);
    expect(time_arr[0]).toStrictEqual({ start: '10:30', end: '13:00' });
  });
  // merge sorting
  it('should merge sort the appointment number array correctly', () => {
    const original_arr: NumberArrayItem[] = [
      {
        start: 15.5,
        end: 16.5,
      },
      {
        start: 9.5,
        end: 11,
      },
      {
        start: 11.5,
        end: 13,
      },
    ];
    const sorted_arr = mergeSort(original_arr);
    expect(sorted_arr.length).toEqual(3);
    expect(sorted_arr[0]).toStrictEqual({ start: 9.5, end: 11 });
    expect(sorted_arr[1]).toStrictEqual({ start: 11.5, end: 13 });
    expect(sorted_arr[2]).toStrictEqual({ start: 15.5, end: 16.5 });
  });
  // time slots finder
  it('should find all available slots correctly', () => {
    const original_arr: TimeArrayItem[] = [
      {
        start: '11:30',
        end: '13:00',
      },
      {
        start: '15:30',
        end: '16:30',
      },
      {
        start: '9:30',
        end: '11:00',
      },
    ];
    const available_arr: TimeArrayItem[] = timeslotsFinder(
      [9, 13],
      [14, 18],
      0.5,
      original_arr,
      SlotTypes.normal
    );
    console.log('available slots: ', available_arr);
    expect(available_arr[0]).toStrictEqual({ start: '14:00', end: '15:00' });
    expect(available_arr.length).toBe(4);
  });
  it('should find all available slots when there is no existing slots', () => {
    const available_arr: TimeArrayItem[] = timeslotsFinder(
      [9, 13],
      [14, 18],
      0.5,
      undefined,
      SlotTypes.long
    );
    console.log('available slots: ', available_arr);
    expect(available_arr.length).toBe(12);
    expect(available_arr[0]).toStrictEqual({ start: '9:00', end: '10:30' });
    expect(available_arr[available_arr.length - 1]).toStrictEqual({
      start: '16:30',
      end: '18:00',
    });
  });
});
