import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { Barometer } from "barometer";

// Banner visibility toggle - on by default
let bannerVisible = true;

// Get UI elements
const timeLabel = document.getElementById("timeLabel");
const dateLabel = document.getElementById("dateLabel");
const heartRateLabel = document.getElementById("heartRateLabel");
const bannerLabel = document.getElementById("bannerLabel");
const bannerClickArea = document.getElementById("bannerClickArea");
const clickOverlay = document.getElementById("clickOverlay");
const background = document.getElementById("background");

// Initialize barometer
let barometer = null;
let barometerInitialized = false;

function initializeBarometer() {
    if (barometer) {
        barometer.stop();
        barometer = null;
    }

    if (!bannerVisible || !bannerLabel) return;

    barometerInitialized = false;
    // Start at 100 Hz (max) for fast initial reading
    barometer = new Barometer({ frequency: 100 });
    barometer.onreading = () => {
        if (bannerVisible && bannerLabel && barometer.pressure) {
            bannerLabel.text = `${(barometer.pressure / 100).toFixed(0)} hPa`;

            // After first reading, reduce to 1 Hz to save battery
            if (!barometerInitialized) {
                barometerInitialized = true;
                barometer.stop();
                barometer = new Barometer({ frequency: 1 });
                barometer.onreading = () => {
                    if (bannerVisible && bannerLabel && barometer.pressure) {
                        bannerLabel.text = `${(barometer.pressure / 100).toFixed(0)} hPa`;
                    }
                };
                barometer.onerror = () => {
                    if (bannerLabel) bannerLabel.text = "Error";
                };
                barometer.start();
            }
        }
    };
    barometer.onerror = () => {
        if (bannerLabel) bannerLabel.text = "Error";
    };
    barometer.start();
}

// Toggle banner visibility when watchface is tapped
const toggleBarometer = function (evt) {
    bannerVisible = !bannerVisible;

    if (bannerVisible) {
        initializeBarometer();
    } else {
        if (bannerLabel) bannerLabel.text = "";
        if (barometer) {
            barometer.stop();
            barometer = null;
        }
    }
};

// Make the entire watchface clickable
if (clickOverlay) clickOverlay.onclick = toggleBarometer;
if (background) background.onclick = toggleBarometer;
if (bannerClickArea) bannerClickArea.onclick = toggleBarometer;
if (timeLabel) timeLabel.onclick = toggleBarometer;
if (dateLabel) dateLabel.onclick = toggleBarometer;

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

// Initialize barometer on startup (banner visible by default)
initializeBarometer();

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
