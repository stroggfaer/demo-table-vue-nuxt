import moment from "moment";


export function headerDays(currentDate = null)  {
   let date = currentDate ? currentDate : moment();

  const m = moment(date, "YYYY-MM").daysInMonth();

  //moment("2012-02", "YYYY-MM").daysInMonth() // 29
  const result  = []
  for (let i = 1; i <= m; ++i) {
    result.push(i);
  }
  return result;
}
