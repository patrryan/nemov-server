export default function setTimeToLocal({ startDate, endDate }) {
  const startLocal = new Date(startDate.setHours(startDate.getHours() + 9));
  const endLocal = new Date(endDate.setHours(endDate.getHours() + 33));

  return { startLocal, endLocal };
}
