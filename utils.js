const WeatherUtils = (() => {
    "use strict";

    const CONDITION_ICONS = {
        Clear:        "animated/day.svg",
        Clouds:       "animated/cloudy-day-1.svg",
        Thunderstorm: "animated/thunder.svg",
        Drizzle:      "animated/rainy-2.svg",
        Rain:         "animated/rainy-7.svg",
        Snow:         "animated/snowy-6.svg",
        Atmosphere:   "animated/weather.svg",
    };

    // ── Temperatura ──────────────────────────────────────────────────────────

    function toF(celsius) {
        return Math.round((celsius * 9) / 5 + 32);
    }

    function formatTemp(celsius, unit) {
        if (unit === "F") return `${toF(celsius)} °F`;
        return `${Math.round(celsius)} °C`;
    }

    // ── Íconos ───────────────────────────────────────────────────────────────

    // Para el pronóstico: ícono sin distinción día/noche
    function getConditionIcon(condition) {
        return CONDITION_ICONS[condition] ?? "animated/weather.svg";
    }

    // Para el clima actual: usa sunrise/sunset de la API para detectar si es de día
    function getWeatherIcon(data) {
        const condition = data.weather[0].main;
        const isDaytime = data.dt >= data.sys.sunrise && data.dt <= data.sys.sunset;

        if (condition === "Clear")  return isDaytime ? "animated/day.svg"          : "animated/night.svg";
        if (condition === "Clouds") return isDaytime ? "animated/cloudy-day-1.svg" : "animated/cloudy-night-1.svg";
        return CONDITION_ICONS[condition] ?? "animated/weather.svg";
    }

    // ── Viento ───────────────────────────────────────────────────────────────

    function degreesToCompass(degrees) {
        const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
        return dirs[Math.round(degrees / 22.5) % 16];
    }

    // ── Visibilidad ──────────────────────────────────────────────────────────

    function formatVisibility(meters) {
        if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
        return `${meters} m`;
    }

    // ── Hora local de la ciudad consultada ───────────────────────────────────
    // La API devuelve sunrise/sunset en UTC y timezone como offset en segundos.
    // Sumamos el offset al timestamp UTC para obtener la hora local sin depender
    // del timezone del navegador (que puede ser diferente al de la ciudad buscada).
    function unixToLocalTime(unixTimestamp, timezoneOffsetSeconds) {
        const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
        const h = date.getUTCHours().toString().padStart(2, "0");
        const m = date.getUTCMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
    }

    // ── Pronóstico ───────────────────────────────────────────────────────────

    function getDayName(dateString) {
        // dateString viene como "YYYY-MM-DD" del campo dt_txt de la API
        const date = new Date(dateString + "T12:00:00");
        return date.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "");
    }

    // Agrupa las 40 entradas de 3 horas en días, calcula max/min real del día
    // y elige la entrada de mediodía como representante visual.
    function processForecast(forecastData) {
        const byDay = {};
        for (const item of forecastData.list) {
            const date = item.dt_txt.split(" ")[0];
            if (!byDay[date]) byDay[date] = [];
            byDay[date].push(item);
        }
        return Object.entries(byDay).slice(1, 6).map(([date, items]) => {
            const rep = items.find(i => i.dt_txt.includes("12:00:00")) ?? items[Math.floor(items.length / 2)];
            return {
                date,
                condition:  rep.weather[0].main,
                description:rep.weather[0].description,
                tempMax: Math.max(...items.map(i => i.main.temp_max)),
                tempMin: Math.min(...items.map(i => i.main.temp_min)),
            };
        });
    }

    return {
        toF,
        formatTemp,
        getConditionIcon,
        getWeatherIcon,
        degreesToCompass,
        formatVisibility,
        unixToLocalTime,
        getDayName,
        processForecast,
    };
})();
