# Vital

A minimalist digital watchface for Fitbit Versa 2 featuring essential time, date, and health metrics in a clean, modern design.

## Description

Vital is a sleek, minimal watchface designed for the Fitbit Versa 2. It displays essential information with a focus on readability and simplicity. The watchface features a black background with carefully chosen typography and color accents for optimal visibility and battery efficiency.

<div align="center">

![Vital Watchface](src/static/watch%20face.png)

</div>

## Features

### Core Display

- **Large Digital Time** - Bold white time display (HH:MM format) for easy reading
- **Date Display** - Current date shown in abbreviated format (e.g., "Mon Jan 14")
- **Visual Separator** - Subtle gray divider line between date and metrics
- **Barometric Pressure** - Atmospheric pressure display in the top banner (tappable to toggle on/off)

### Health Metrics

- **Heart Rate Monitor** - Real-time heart rate display in beats per minute (bpm)
  - Updates automatically from the device's heart rate sensor
  - Displayed in red for visibility

### Design Features

- **Minimalist Layout** - Clean, uncluttered interface
- **High Contrast** - Black background with white/gray text for optimal readability
- **Optimized Typography** - System fonts with carefully chosen sizes and weights

## Technical Details

- **Device**: Fitbit Versa 2
- **SDK Version**: 4.0.0-pre.4
- **Build Target**: mira
- **Permissions**: access_heart_rate
- **Interactive**: Tap anywhere on the watchface to toggle barometric pressure display

## Installation

For personal use, sideload the watchface using the Fitbit CLI:

```bash
cd src
npx fitbit-build
npx fitbit
# Then in the Fitbit CLI:
fitbit$ bi
```

## Development

See `_doc/DESIGN.md` for development guidelines and styling information.

## License

UNLICENSED - Private project
