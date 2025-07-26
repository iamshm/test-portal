import type {
  DayOfWeek,
  TimeSlot,
  DaySchedule,
  WeekSchedule,
  TimetableWithCourse,
} from "../types/timetable";

export const generateTimeSlots = (startHour = 8, endHour = 18): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return slots;
};

export const createEmptyWeekSchedule = (
  timeSlots: string[] = generateTimeSlots()
): WeekSchedule => {
  const days: DaySchedule[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ].map((day) => ({
    day: day as DayOfWeek,
    slots: timeSlots.map((time) => ({
      time,
      isBooked: false,
    })),
  }));

  return { days };
};

export const populateWeekSchedule = (
  schedule: WeekSchedule,
  timetables: TimetableWithCourse[]
): WeekSchedule => {
  const newSchedule = JSON.parse(JSON.stringify(schedule)) as WeekSchedule;

  timetables.forEach((timetable) => {
    const daySchedule = newSchedule.days.find(
      (day) => day.day === timetable.dayOfWeek
    );
    if (!daySchedule) return;

    const startHour = parseInt(timetable.startTime.split(":")[0]);
    const endHour = parseInt(timetable.endTime.split(":")[0]);

    daySchedule.slots.forEach((slot) => {
      const slotHour = parseInt(slot.time.split(":")[0]);
      if (slotHour >= startHour && slotHour < endHour) {
        slot.isBooked = true;
        slot.timetable = timetable;
      }
    });
  });

  return newSchedule;
};

export const formatTime = (time: string): string => {
  const hour = parseInt(time.split(":")[0]);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${suffix}`;
};

export const checkTimeSlotConflict = (
  startTime: string,
  endTime: string,
  existingStart: string,
  existingEnd: string
): boolean => {
  const start = parseInt(startTime.split(":")[0]);
  const end = parseInt(endTime.split(":")[0]);
  const existingStartHour = parseInt(existingStart.split(":")[0]);
  const existingEndHour = parseInt(existingEnd.split(":")[0]);

  return (
    (start >= existingStartHour && start < existingEndHour) ||
    (end > existingStartHour && end <= existingEndHour) ||
    (start <= existingStartHour && end >= existingEndHour)
  );
};
