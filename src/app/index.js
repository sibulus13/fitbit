import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";

// Get UI elements
const timeLabel = document.getElementById("timeLabel");
const dateLabel = document.getElementById("dateLabel");
const heartRateLabel = document.getElementById("heartRateLabel");
const batteryDot = document.getElementById("batteryDot");

// Update clock every minute
clock.granularity = "minutes";

// Format time
function formatTime(date) {
    let hours = date.getHours();
    let mins = date.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    mins = mins < 10 ? "0" + mins : mins;
    return `${hours}:${mins}`;
}

// Format date
function formatDate(date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
}

// Update time and date
clock.ontick = (evt) => {
    const today = evt.date;
    timeLabel.text = formatTime(today);
    dateLabel.text = formatDate(today);
};

// Heart rate sensor
const hrm = new HeartRateSensor();
hrm.onreading = () => {
    heartRateLabel.text = `${hrm.heartRate} bpm`;
};
hrm.start();

// Battery indicator - Battery API not available in SDK 4.0.0-pre.4
// Set to green by default (battery API requires newer SDK or companion component)
if (batteryDot) {
    batteryDot.className = "batteryDot batteryGreen";
}
