// Format tanggal ke format Indonesia
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return d.toLocaleDateString('id-ID', options);
};

// Format tanggal ke format YYYY-MM-DD
export const formatDateInput = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Get tanggal hari ini
export const getToday = () => {
  return formatDateInput(new Date());
};

// Get tanggal kemarin
export const getYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateInput(yesterday);
};

// Get tanggal minggu ini (Senin - Minggu)
export const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Minggu, 1 = Senin, dst
  const monday = new Date(today);
  
  // Set ke hari Senin
  monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(formatDateInput(date));
  }
  
  return weekDates;
};

// Get nama hari dalam bahasa Indonesia
export const getDayName = (date) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const d = new Date(date);
  return days[d.getDay()];
};

// Cek apakah tanggal adalah hari ini
export const isToday = (date) => {
  return formatDateInput(new Date()) === formatDateInput(date);
};

// Cek apakah tanggal adalah hari libur (Sabtu/Minggu)
export const isWeekend = (date) => {
  const d = new Date(date);
  return d.getDay() === 0 || d.getDay() === 6;
}; 