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

//дате ранге;
export function headerRangeDays(startDate, endDate, type)  {
  let fromDate = moment(startDate)
  let toDate = moment(endDate)
  let diff = toDate.diff(fromDate, type)

  let range = []
  for (let i = 0; i <= diff; i++) {
      const date = moment(startDate).add(i, type).format('YYYY-MM-DD');
      range.push({
        day: Number(moment(date, "YYYY-MM-DD").format('D')),
        date: date
      })
    }
  return range
}
// Min
export function  isMinMaxRangeDays(startDate, endDate,min= 14, max= 112)  {
  let fromDate = moment(startDate)
  let toDate = moment(endDate)
  let diff = toDate.diff(fromDate, 'days');
  const days = diff + 1;
  // console.log(days);
  return days >= min &&  days <= max;
}

export function arrMounts(mount = null) {
  const mounts = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  return mount ? mounts[mount - 1] : mounts;
}
