export default function setEndToLocal({ endDate }) {
  const endLocal = new Date(endDate.setHours(endDate.getHours() + 24));

  return { endLocal };
}
