// Runner minimalista — sin dependencias externas
const TestRunner = (() => {
    "use strict";

    const results = [];

    function assert(description, actual, expected) {
        const pass = actual === expected;
        results.push({ description, actual, expected, pass });
    }

    function makeWeatherData(condition, dt, sunrise, sunset) {
        return {
            weather: [{ main: condition }],
            dt,
            sys: { sunrise, sunset },
        };
    }

    function runAll() {

        // ── toF ──────────────────────────────────────────────────────────────
        assert("toF: punto de congelación del agua (0 °C → 32 °F)",
            WeatherUtils.toF(0), 32);
        assert("toF: punto de ebullición del agua (100 °C → 212 °F)",
            WeatherUtils.toF(100), 212);
        assert("toF: temperatura corporal (37 °C → 99 °F)",
            WeatherUtils.toF(37), 99);
        assert("toF: valor negativo (-10 °C → 14 °F)",
            WeatherUtils.toF(-10), 14);
        assert("toF: punto isómero (-40 °C = -40 °F)",
            WeatherUtils.toF(-40), -40);

        // ── formatTemp ───────────────────────────────────────────────────────
        assert("formatTemp: entero en Celsius",
            WeatherUtils.formatTemp(20, "C"), "20 °C");
        assert("formatTemp: decimal se redondea en Celsius (25.7 → 26 °C)",
            WeatherUtils.formatTemp(25.7, "C"), "26 °C");
        assert("formatTemp: negativo en Celsius",
            WeatherUtils.formatTemp(-5, "C"), "-5 °C");
        assert("formatTemp: cero en Fahrenheit (0 °C → 32 °F)",
            WeatherUtils.formatTemp(0, "F"), "32 °F");
        assert("formatTemp: decimal se redondea en Fahrenheit (25.7 °C → 78 °F)",
            WeatherUtils.formatTemp(25.7, "F"), "78 °F");

        // ── getWeatherIcon ───────────────────────────────────────────────────
        // dt=1000, sunrise=500, sunset=1500 → de día
        // dt=200,  sunrise=500, sunset=1500 → de noche
        assert("getWeatherIcon: Clear de día → day.svg",
            WeatherUtils.getWeatherIcon(makeWeatherData("Clear", 1000, 500, 1500)),
            "animated/day.svg");
        assert("getWeatherIcon: Clear de noche → night.svg",
            WeatherUtils.getWeatherIcon(makeWeatherData("Clear", 200, 500, 1500)),
            "animated/night.svg");
        assert("getWeatherIcon: Clouds de día → cloudy-day-1.svg",
            WeatherUtils.getWeatherIcon(makeWeatherData("Clouds", 1000, 500, 1500)),
            "animated/cloudy-day-1.svg");
        assert("getWeatherIcon: Clouds de noche → cloudy-night-1.svg",
            WeatherUtils.getWeatherIcon(makeWeatherData("Clouds", 200, 500, 1500)),
            "animated/cloudy-night-1.svg");
        assert("getWeatherIcon: Thunderstorm → thunder.svg",
            WeatherUtils.getWeatherIcon(makeWeatherData("Thunderstorm", 1000, 500, 1500)),
            "animated/thunder.svg");
        assert("getWeatherIcon: Rain → rainy-7.svg",
            WeatherUtils.getWeatherIcon(makeWeatherData("Rain", 1000, 500, 1500)),
            "animated/rainy-7.svg");
        assert("getWeatherIcon: Snow → snowy-6.svg",
            WeatherUtils.getWeatherIcon(makeWeatherData("Snow", 1000, 500, 1500)),
            "animated/snowy-6.svg");
        assert("getWeatherIcon: condición desconocida → weather.svg (fallback)",
            WeatherUtils.getWeatherIcon(makeWeatherData("Tornado", 1000, 500, 1500)),
            "animated/weather.svg");

        // ── degreesToCompass ─────────────────────────────────────────────────
        assert("degreesToCompass: 0° → N",
            WeatherUtils.degreesToCompass(0), "N");
        assert("degreesToCompass: 90° → E",
            WeatherUtils.degreesToCompass(90), "E");
        assert("degreesToCompass: 180° → S",
            WeatherUtils.degreesToCompass(180), "S");
        assert("degreesToCompass: 270° → O",
            WeatherUtils.degreesToCompass(270), "O");
        assert("degreesToCompass: 45° → NE",
            WeatherUtils.degreesToCompass(45), "NE");
        assert("degreesToCompass: 225° → SO",
            WeatherUtils.degreesToCompass(225), "SO");
        assert("degreesToCompass: 360° → N (equivale a 0°)",
            WeatherUtils.degreesToCompass(360), "N");

        // ── formatVisibility ─────────────────────────────────────────────────
        assert("formatVisibility: menos de 1 km → metros",
            WeatherUtils.formatVisibility(500), "500 m");
        assert("formatVisibility: exactamente 1 km",
            WeatherUtils.formatVisibility(1000), "1.0 km");
        assert("formatVisibility: 1.5 km",
            WeatherUtils.formatVisibility(1500), "1.5 km");
        assert("formatVisibility: máximo de la API (10 km)",
            WeatherUtils.formatVisibility(10000), "10.0 km");

        // ── unixToLocalTime ──────────────────────────────────────────────────
        // Unix 0 = 1970-01-01 00:00:00 UTC
        assert("unixToLocalTime: UTC 00:00 sin offset → 00:00",
            WeatherUtils.unixToLocalTime(0, 0), "00:00");
        assert("unixToLocalTime: UTC 00:00 con offset +3h (Buenos Aires) → 03:00",
            WeatherUtils.unixToLocalTime(0, 10800), "03:00");
        assert("unixToLocalTime: UTC 12:00 con offset -3h → 09:00",
            WeatherUtils.unixToLocalTime(43200, -10800), "09:00");
        assert("unixToLocalTime: padding de minutos (01 → 01)",
            WeatherUtils.unixToLocalTime(60, 0), "00:01");

        return results;
    }

    return { runAll };
})();
