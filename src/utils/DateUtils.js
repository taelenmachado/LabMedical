export function getFormattedDate() {
    const currentDate = new Date().toLocaleDateString("en-CA");
    return currentDate;
}

export function getFormattedTime() {
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours().toString().padStart(2, "0");
    const minutes = currentDateTime.getMinutes().toString().padStart(2, "0");
  
    return `${hours}:${minutes}`;
  }