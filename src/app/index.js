import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { Barometer } from "barometer";

// Constants
const BAROMETER_FREQ_HIGH = 100; // Hz - for fast initial reading
const BAROMETER_FREQ_LOW = 1; // Hz - for battery efficiency
const PRESSURE_CONVERSION = 100; // Pascals to hectopascals
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// State
let bannerVisible = true;
let barometer = null;
let barometerInitialized = false;

// UI elements
const timeLabel = document.getElementById("timeLabel");
const dateLabel = document.getElementById("dateLabel");
const heartRateLabel = document.getElementById("heartRateLabel");
const bannerLabel = document.getElementById("bannerLabel");
const clickOverlay = document.getElementById("clickOverlay");

// Helper: Update banner with pressure value
function updatePressureDisplay(pressure) {
    if (bannerVisible && bannerLabel && pressure) {
        bannerLabel.text = `${(pressure / PRESSURE_CONVERSION).toFixed(0)} hPa`;
    }
}

// Sensor management helpers
function createBarometer(frequency) {
    const sensor = new Barometer({ frequency });
    sensor.onreading = () => updatePressureDisplay(sensor.pressure);
    sensor.onerror = () => {
        if (bannerLabel) bannerLabel.text = "Error";
    };
    return sensor;
}

function stopBarometer() {
    if (barometer) {
        barometer.stop();
        barometer = null;
    }
}

function startBarometer(frequency) {
    stopBarometer();
    barometer = createBarometer(frequency);
    barometer.start();
    return barometer;
}

// Initialize barometer with adaptive frequency
function initializeBarometer() {
    if (!bannerVisible || !bannerLabel) return;

    barometerInitialized = false;

    // Start at high frequency for fast initial reading
    const highFreqBarometer = startBarometer(BAROMETER_FREQ_HIGH);

    // Override onreading to handle frequency transition after first reading
    highFreqBarometer.onreading = () => {
        updatePressureDisplay(highFreqBarometer.pressure);

        // After first reading, reduce to low frequency to save battery
        if (!barometerInitialized && highFreqBarometer.pressure) {
            barometerInitialized = true;
            startBarometer(BAROMETER_FREQ_LOW);
        }
    };
}

// Toggle banner visibility
function toggleBarometer() {
    bannerVisible = !bannerVisible;

    if (bannerVisible) {
        initializeBarometer();
    } else {
        if (bannerLabel) bannerLabel.text = "";
        stopBarometer();
    }
}

// Make entire watchface clickable
if (clickOverlay) clickOverlay.onclick = toggleBarometer;

// Update clock every minute
clock.granularity = "minutes";

// Format helpers
function padZero(num) {
    return num < 10 ? `0${num}` : String(num);
}

function formatTime(date) {
    return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}

function formatDate(date) {
    return `${DAYS[date.getDay()]} ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

// Initialize barometer on startup (banner visible by default)
initializeBarometer();

// Update time and date
clock.ontick = (evt) => {
    const date = evt.date;
    if (timeLabel) timeLabel.text = formatTime(date);
    if (dateLabel) dateLabel.text = formatDate(date);
};

// Initialize heart rate sensor
const hrm = new HeartRateSensor();
hrm.onreading = () => {
    if (heartRateLabel && hrm.heartRate) {
        heartRateLabel.text = `${hrm.heartRate} bpm`;
    }
};
hrm.start();
