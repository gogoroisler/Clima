// pedido de geolocalizacion
window.addEventListener("load", () => {
    // Definimos variables longitud y latitud
    let lon
    let lat

    let tempValue = document.getElementById("temp-value")
    let tempDesc = document.getElementById("temp-desc")
    
    let location = document.getElementById("location")
    let animatedIcon = document.getElementById("animated-icon")

    let wind = document.getElementById("wind")

    let tempMin = document.getElementById("temp-min")
    let tempMax = document.getElementById("temp-max")

    let hum = document.getElementById("humidity")
    let tempFeel = document.getElementById("temp-feel")

    //Usamos geolocation para obtener los valores de lon y lat
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition( position =>{
            lon = position.coords.longitude
            lat = position.coords.latitude

            // ubicacion actual
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&APPID=3843a52b90e77eb47c64162c69a032a8`

            // ubicacion por ciudad
            //const url = `https://api.openweathermap.org/data/2.5/weather?q=Madrid&lang=es&unit=metric&APPID=3843a52b90e77eb47c64162c69a032a8`

            //console.log(url)
            
            fetch(url)
            .then( response => {return response.json() })
            .then( data => {
                console.log(data)

                let temp = Math.round(data.main.temp)
                tempValue.textContent = `${temp} °C`

                let desc = data.weather[0].description
                tempDesc.textContent = desc.toUpperCase()

                location.textContent = data.name + ", " + data.sys.country

                wind.textContent = `${data.wind.speed} m/s`

                switch(data.weather[0].main){
                    case "Clear":
                        animatedIcon.src = "animated/day.svg"
                    console.log("DESPEJADO")    
                    break;
                    case "Clouds":
                        animatedIcon.src = "animated/cloudy-day-1.svg"
                    console.log("NUBLADO")    
                    break;
                    case "Thunderstorm":
                        animatedIcon.src = "animated/thunder.svg"
                    console.log("TORMENTA")    
                    break;
                    case "Drizzle":
                        animatedIcon.src = "animated/rainy-2.svg"
                    console.log("LLOVIZNA")    
                    break;
                    case "Rain":
                        animatedIcon.src = "animated/rainy-7.svg"
                    console.log("LLUVIA")    
                    break;
                    case "Snow":
                        animatedIcon.src = "animated/snowy-6.svg"
                    console.log("NIEVE")    
                    break;
                    case "Atmosphere":
                        animatedIcon.src = "animated/weather.svg"
                    console.log("ATMOSFERA")    
                    break;
                    default:
                }
                let min = Math.round(data.main.temp_min)
                tempMin.textContent = `${min} °C`

                let max = Math.round(data.main.temp_max)
                tempMax.textContent = `${max} °C`

                let feel = Math.round(data.main.feels_like)
                tempFeel.textContent = `${feel} °C`

                let humm = Math.round(data.main.humidity)
                hum.textContent = `${humm} %`

            })
            .catch( error =>{
                console.log(error)
            })
        })
    }
})