export function getTodayDate() {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; 
    const year = today.getFullYear();

    // Format day and month with leading zeros if needed
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return `${year}-${month}-${day}`;
}