// src/utils/getConcurrentTasks.js
import { parseISO, eachDayOfInterval, format, isBefore, isAfter, isEqual } from 'date-fns';

const getConcurrentTasks = (tasks, startDate, endDate) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const allDays = eachDayOfInterval({ start, end });

  const data = allDays.map((day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    const count = tasks.reduce((acc, task) => {
      const createdAtStr = task.importantDates?.createdAt;
      const completedAtStr = task.importantDates?.completedAt;

      if (!createdAtStr) {
        console.error(`Task ID ${task.id} is missing 'createdAt' date.`);
        return acc;
      }

      let createdAt, completedAt;

      try {
        createdAt = parseISO(createdAtStr);
      } catch (error) {
        console.error(`Invalid 'createdAt' format for Task ID ${task.id}: ${createdAtStr}`);
        return acc;
      }

      if (completedAtStr) {
        try {
          completedAt = parseISO(completedAtStr);
        } catch (error) {
          console.error(`Invalid 'completedAt' format for Task ID ${task.id}: ${completedAtStr}`);
          completedAt = null;
        }
      } else {
        completedAt = null;
      }

      const isActive =
        (isBefore(createdAt, day) || isEqual(createdAt, day)) &&
        (completedAt === null || isAfter(completedAt, day) || isEqual(completedAt, day));

      return isActive ? acc + 1 : acc;
    }, 0);

    return { date: formattedDate, count };
  });

  return data;
};

export default getConcurrentTasks;
