// src/utils/formatTime.js

export const formatDisplayDate = (date) => {
    if (!date) {
      return 'N/A';
    }
  
    let dateObj;
  
    if (date instanceof Date) {
      dateObj = date;
    } else {
      // Attempt to parse the date string
      dateObj = new Date(date);
      if (isNaN(dateObj)) {
        return 'Invalid Date';
      }
    }
  
    return dateObj.toLocaleDateString();
  };
  
  export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };
  
  // Utility to convert mm:ss to total seconds
  export const convertToSeconds = (timeStr) => {
    const [mins, secs] = timeStr.split(':').map(Number);
    if (
      isNaN(mins) ||
      isNaN(secs) ||
      mins < 0 ||
      secs < 0 ||
      secs >= 60
    ) {
      return 0;
    }
    return mins * 60 + secs;
  };
  