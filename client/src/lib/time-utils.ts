export function generateTimeOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const h24 = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      const value = `${h24}:${m}`;
      
      const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const label = `${h12}:${m} ${ampm}`;
      
      options.push({ value, label });
    }
  }
  
  return options;
}

export function formatTime(time24: string | null | undefined): string {
  if (!time24) return '';
  
  const [hourStr, minute] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  
  if (isNaN(hour)) return time24;
  
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  
  return `${h12}:${minute} ${ampm}`;
}

export const TIME_OPTIONS = generateTimeOptions();
