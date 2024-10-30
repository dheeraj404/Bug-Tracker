// src/utils/getDailyProgress.js
import { parseISO, eachDayOfInterval, format, isBefore, isAfter, isEqual } from 'date-fns';

const getDailyProgress = (tasks, startDate, endDate) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const allDays = eachDayOfInterval({ start, end });

  const data = allDays.map((day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');

    const activeTasks = tasks.filter((task) => {
      const createdAtStr = task.importantDates?.createdAt;
      const dueDateStr = task.importantDates?.dueDate;
      const completedAtStr = task.importantDates?.completedAt;

      if (!createdAtStr || !dueDateStr) {
        console.error(`Task ID ${task.id} is missing 'createdAt' or 'dueDate'.`);
        return false;
      }

      let createdAt, dueDate, completedAt;

      try {
        createdAt = parseISO(createdAtStr);
        dueDate = parseISO(dueDateStr);
      } catch (error) {
        console.error(`Invalid date format for Task ID ${task.id}.`);
        return false;
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
        (isAfter(dueDate, day) || isEqual(dueDate, day)) &&
        (completedAt === null || isAfter(completedAt, day) || isEqual(completedAt, day));

      return isActive;
    });

    const totalCompletion = activeTasks.reduce((acc, task) => acc + (task.completionPercentage || 0), 0);
    const averageCompletion = activeTasks.length > 0 ? Math.round(totalCompletion / activeTasks.length) : 0;

    return { date: formattedDate, averageCompletion };
  });

  return data;
};

export default getDailyProgress;
