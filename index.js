const myModule = (() => {
    "use strict";

    let lastData     = null;
    let lastForecast = null;
    let currentUnit  = "C";

    const el = {
        container:       document.getElementById("container"),
        statusMsg:       document.getElementById("status-message"),
        tempValue:       document.getElementById("temp-value"),
        tempDesc:        document.getElementById("temp-desc"),
        locationEl:      document.getElementById("location"),
        animatedIcon:    document.getElementById("animated-icon"),
        windDir:         document.getElementById("wind-dir"),
        wind:            document.getElementById("wind"),
        tempMin:         document.getElementById("temp-min"),
        tempMax:         document.getElementById("temp-max"),
        humidity:        document.getElementById("humidity"),
        tempFeel:        document.getElementById("temp-feel"),
        visibility:      document.getElementById("visibility"),
        cloudiness:      document.getElementById("cloudiness"),
        sunrise:         document.getElementById("sunrise"),
        sunset:          document.getElementById("sunset"),
        unitToggle:      document.getElementById("unit-toggle"),
        searchForm:      document.getElementById("search-form"),
        cityInput:       document.getElementById("city-input"),
        lastUpdated:     document.getElementById("last-updated"),
        forecastSection: document.getElementById("forecast-section"),
        forecastCards:   document.getElementById("forecast-cards"),
    };

    // ── Estado ───────────────────────────────────────────────────────────────

    function showStatus(message, isError = false) {
        el.statusMsg.textContent = message;
        el.statusMsg.className = isError ? "status-message status-error" : "status-message";
        el.container.classList.add("hidden");
        el.lastUpdated.classList.add("hidden");
        el.forecastSection.classList.add("hidden");
    }

    function showWeather() {
        el.statusMsg.textContent = "";
        el.container.classList.remove("hidden", "fade-in");
        void el.container.offsetWidth; // reinicia la animación CSS
        el.container.classList.add("fade-in");
        el.lastUpdated.classList.remove("hidden");
    }

    // ── Render ───────────────────────────────────────────────────────────────

    function renderTemperatures() {
        if (!lastData) return;
        const d = lastData;
        el.tempValue.textContent  = WeatherUtils.formatTemp(d.main.temp, currentUnit);
        el.tempMax.textContent    = `↑ ${WeatherUtils.formatTemp(d.main.temp_max, currentUnit)}`;
        el.tempMin.textContent    = `↓ ${WeatherUtils.formatTemp(d.main.temp_min, currentUnit)}`;
        el.tempFeel.textContent   = WeatherUtils.formatTemp(d.main.feels_like, currentUnit);
        el.unitToggle.textContent = currentUnit === "C" ? "Cambiar a °F" : "Cambiar a °C";
    }

    function renderData(data) {
        lastData = data;

        el.tempDesc.textContent   = data.weather[0].description.toUpperCase();
        el.locationEl.textContent = `${data.name}, ${data.sys.country}`;
        el.animatedIcon.src       = WeatherUtils.getWeatherIcon(data);

        el.windDir.textContent    = WeatherUtils.degreesToCompass(data.wind.deg);
        el.wind.textContent       = `${data.wind.speed} m/s`;

        el.humidity.textContent   = `${data.main.humidity} %`;
        el.visibility.textContent = WeatherUtils.formatVisibility(data.visibility);
        el.cloudiness.textContent = `${data.clouds.all} %`;

        el.sunrise.textContent    = `☀ ${WeatherUtils.unixToLocalTime(data.sys.sunrise, data.timezone)}`;
        el.sunset.textContent     = `☽ ${WeatherUtils.unixToLocalTime(data.sys.sunset, data.timezone)}`;

        const hora = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
        el.lastUpdated.textContent = `Actualizado a las ${hora}`;

        renderTemperatures();
    }

    function renderForecast(days, unit) {
        lastForecast = days;
        if (!days || days.length === 0) {
            el.forecastSection.classList.add("hidden");
            return;
        }

        el.forecastCards.innerHTML = days.map(day => `
            <div class="forecast-card">
                <p class="forecast-day">${WeatherUtils.getDayName(day.date)}</p>
                <img class="forecast-icon" src="${WeatherUtils.getConditionIcon(day.condition)}"
                     alt="${day.description}" width="48">
                <p class="forecast-max">↑ ${WeatherUtils.formatTemp(day.tempMax, unit)}</p>
                <p class="forecast-min">↓ ${WeatherUtils.formatTemp(day.tempMin, unit)}</p>
            </div>
        `).join("");

        el.forecastSection.classList.remove("hidden");
    }

    // ── Fetch ────────────────────────────────────────────────────────────────

    async function fetchWeather(queryParams) {
        const url = `https://api.openweathermap.org/data/2.5/weather?${queryParams}&lang=es&units=metric&APPID=${API_KEY}`;
        const response = await fetch(url);
        if (response.status === 404) throw new Error("ciudad_no_encontrada");
        if (!response.ok) throw new Error(`api_error_${response.status}`);
        return response.json();
    }

    async function fetchForecast(queryParams) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?${queryParams}&lang=es&units=metric&APPID=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        return response.json();
    }

    // ── Carga de datos ───────────────────────────────────────────────────────

    async function loadWeather(queryParams) {
        try {
            // Fetch paralelo: el pronóstico no bloquea si falla
            const [data, forecastData] = await Promise.all([
                fetchWeather(queryParams),
                fetchForecast(queryParams).catch(() => null),
            ]);
            renderData(data);
            renderForecast(forecastData ? WeatherUtils.processForecast(forecastData) : null, currentUnit);
            showWeather();
        } catch (error) {
            if (error.message === "ciudad_no_encontrada") {
                const city = new URLSearchParams(queryParams).get("q") ?? "la ciudad";
                showStatus(`No se encontró "${city}". Revisá la ortografía e intentá de nuevo.`, true);
            } else {
                showStatus("No se pudo obtener el clima. Verificá tu conexión e intentá de nuevo.", true);
            }
        }
    }

    // ── Eventos ──────────────────────────────────────────────────────────────

    el.unitToggle.addEventListener("click", () => {
        currentUnit = currentUnit === "C" ? "F" : "C";
        renderTemperatures();
        if (lastForecast) renderForecast(lastForecast, currentUnit);
    });

    el.searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const city = el.cityInput.value.trim();
        if (!city) return;
        showStatus(`Buscando "${city}"...`);
        loadWeather(`q=${encodeURIComponent(city)}`);
        el.cityInput.value = "";
    });

    // ── Inicio ───────────────────────────────────────────────────────────────

    if (!navigator.geolocation) {
        showStatus("Tu navegador no soporta geolocalización. Podés buscar una ciudad usando el buscador.", true);
    } else {
        showStatus("Obteniendo tu ubicación...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                showStatus("Cargando datos del clima...");
                loadWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            },
            () => showStatus("Permiso de ubicación denegado. Podés buscar una ciudad usando el buscador.", true)
        );
    }
})();
