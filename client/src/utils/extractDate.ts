const extractMonthAndYear = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[month];
  const year = date.getFullYear();
  return { monthName, year };
};

export default extractMonthAndYear;
