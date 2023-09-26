export function distance(lat1, lat2, lon1, lon2) {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  let result = Number((c * r).toFixed(2));
  if (result < 0) {
    return " " + result + " " + "m";
  }
  return " " + result + " " + "km";
}
export function checkStoreTimes() {
  let dayOfTheWeek = new Date().getDay();
  let time = new Date().toLocaleTimeString();
  if (dayOfTheWeek >= 1 && dayOfTheWeek <= 4) {
    return time >= "10:00 AM" && time <= "19:30 PM";
  } else if (dayOfTheWeek === 5) {
    return (
      (time >= "10:00 AM" && time <= "12:00 PM") ||
      (time >= "13:30 PM" && time <= "20:00 PM")
    );
  } else if (dayOfTheWeek === 6) {
    return time >= "9:30 AM" && time <= "20:00 PM";
  } else if (dayOfTheWeek === 0) {
    return time >= "10:00 AM" && time <= "19:00 PM";
  }
}
