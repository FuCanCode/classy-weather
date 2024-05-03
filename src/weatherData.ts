function getWeatherIcon(wmoCode: number) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤️"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦️"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧️"],
    [[71, 73, 75, 77, 85, 86], "🌨️"],
    [[95], "🌩️"],
    [[96, 99], "⛈️"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));

  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function formatDay(dateStr: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

function convertToFlag(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char: string) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

export async function getWeather(location: string) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
    );

    if (!geoRes.ok) throw new Error("Error on fetching data!");

    const geoData = await geoRes.json();
    console.log(geoData);

    if (!geoData.results) throw new Error("Place not found!");

    const { latitude, longitude, timezone, name, country_code } =
      geoData.results.at(0);

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
    );
    const weatherData = await weatherRes.json();

    const {
      temperature_2m_max: maxTemps,
      temperature_2m_min: minTemps,
      time,
      weathercode,
    } = weatherData.daily;

    const icons = weathercode.map((c: number) => getWeatherIcon(c));
    const weekdays = time.map((t: string) => formatDay(t));

    return {
      flag: convertToFlag(country_code),
      name,
      weekdays,
      maxTemps,
      minTemps,
      icons,
    };
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    } else {
      console.error(error);
    }
  }
}
