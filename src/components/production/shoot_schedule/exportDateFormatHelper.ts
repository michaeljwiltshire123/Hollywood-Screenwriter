export function formatTruncatedDate(dateInput: string): string {
  if (!dateInput) return '';
  const parts = dateInput.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
      return `${day}-${monthNames[monthIdx]}-${year}`;
    }
  }

  const d = new Date(dateInput);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${day}-${monthNames[d.getMonth()]}-${d.getFullYear()}`;
  }

  return dateInput;
}
