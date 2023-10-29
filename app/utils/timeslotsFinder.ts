// types
export interface TimeArrayItem {
  start: string; // 10:30
  end: string;
}

export interface NumberArrayItem {
  start: number; // 10.5
  end: number;
}

export enum SlotTypes {
  normal = 1,
  long = 1.5,
}

// time slots finder
export const timeslotsFinder = (
  first_half: [number, number],
  second_half: [number, number],
  interval: number,
  inputArray: TimeArrayItem[] | undefined,
  type: SlotTypes
): TimeArrayItem[] => {
  let available: NumberArrayItem[] = [];
  const getEndPointer = (start_pointer: number): number => {
    return start_pointer + type;
  };
  // assuming the interval of timeslots is 30mins (or 0.5)
  // if there is no existing timeslot
  if (inputArray === undefined) {
    const slotsFinder = (
      start_time: number,
      end_time: number,
      getEndPointer: (start_point: number) => number
    ) => {
      let s_point = start_time;
      let e_point = getEndPointer(s_point);
      while (e_point <= end_time) {
        available.push({
          start: s_point,
          end: e_point,
        });
        s_point += interval;
        e_point = getEndPointer(s_point);
      }
    };
    // morning & afternoon
    slotsFinder(first_half[0], first_half[1], getEndPointer);
    slotsFinder(second_half[0], second_half[1], getEndPointer);
    // convert back to time slots array
    return appointmentArrayReverseConvertor(available);
  }

  // if there is an existing timeslot at least
  let numArray = appointmentArrayConvertor(inputArray);
  let sortedNumArray = mergeSort(numArray);
  let arrayIndex = 0;

  const slotsFinder = (
    start_time: number,
    end_time: number,
    getEndPointer: (start_point: number) => number
  ) => {
    let s_point = start_time;
    let e_point = getEndPointer(s_point);
    while (e_point <= end_time) {
      // if reach the end of the current slots array
      if (arrayIndex > sortedNumArray.length - 1) {
        // add this available slot
        available.push({
          start: s_point,
          end: e_point,
        });
        // move our timeslot forward by 0.5
        s_point += interval;
        e_point = getEndPointer(s_point);
      } else {
        // if there is an overlapping
        if (
          s_point <= sortedNumArray[arrayIndex].start &&
          sortedNumArray[arrayIndex].start < e_point
        ) {
          // skip the current slot and update the array index
          s_point = sortedNumArray[arrayIndex].end;
          e_point = getEndPointer(s_point);
          arrayIndex++;
        }
        // if there is no overlapping,
        // then it means an available slot has been found
        else if (e_point <= sortedNumArray[arrayIndex].start) {
          // add this available slot
          available.push({
            start: s_point,
            end: e_point,
          });
          // move our timeslot forward by 0.5
          s_point += interval;
          e_point = getEndPointer(s_point);
        }
      }
    }
  };
  // morning  9 - 13
  slotsFinder(first_half[0], first_half[1], getEndPointer);
  // afternoon 14 - 18
  slotsFinder(second_half[0], second_half[1], getEndPointer);

  return appointmentArrayReverseConvertor(available);
};

// convertor and reverse convertor
export const appointmentArrayConvertor = (
  inputArray: TimeArrayItem[]
): NumberArrayItem[] => {
  return inputArray.map((item) => {
    const { start, end } = item;
    let start_num, end_num;
    let arr = start.split(':');
    arr[1] === '00'
      ? (start_num = parseInt(arr[0]))
      : (start_num = Number(arr[0] + '.5'));
    arr = end.split(':');
    arr[1] === '00'
      ? (end_num = parseInt(arr[0]))
      : (end_num = Number(arr[0] + '.5'));
    return {
      start: start_num,
      end: end_num,
    };
  });
};

export const appointmentArrayReverseConvertor = (
  inputArray: NumberArrayItem[]
): TimeArrayItem[] => {
  return inputArray.map((item) => {
    const { start, end } = item;
    let start_time, end_time;
    let arr = start + '';
    arr.includes('.')
      ? (start_time = arr.split('.')[0] + ':30')
      : (start_time = arr + ':00');
    arr = end + '';
    arr.includes('.')
      ? (end_time = arr.split('.')[0] + ':30')
      : (end_time = arr + ':00');
    return {
      start: start_time,
      end: end_time,
    };
  });
};

// merge sorting
export const mergeSort = (inputArray: NumberArrayItem[]): NumberArrayItem[] => {
  if (inputArray.length < 2) {
    return inputArray;
  }
  const mid = Math.floor(inputArray.length / 2);
  const leftArr = inputArray.slice(0, mid);
  const rightArr = inputArray.slice(mid);
  return merge(mergeSort(leftArr), mergeSort(rightArr));
};

const merge = (
  left: NumberArrayItem[],
  right: NumberArrayItem[]
): NumberArrayItem[] => {
  const sortedArr: NumberArrayItem[] = [];
  while (left.length && right.length) {
    if (left[0].start <= right[0].start) {
      sortedArr.push(left.shift()!);
    } else {
      sortedArr.push(right.shift()!);
    }
  }
  return [...sortedArr, ...left, ...right];
};