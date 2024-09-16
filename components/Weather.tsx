import * as Location from "expo-location";
import axios from "axios";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Hourly,
  HourlyForecastResponse,
  WeatherResponse,
} from "@/types/weather";

const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access location was denied");
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

const fetchCurrentWeather = async (latitude: number, longitude: number) => {
  const API_KEY = "4f00ecf06e4c683909c7e2fc27f0b957";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

  const response = await axios.get<WeatherResponse>(url);
  return response.data;
};

const fetchHourlyForecast = async (latitude: number, longitude: number) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&timezone=auto`;

  const response = await axios.get<HourlyForecastResponse>(url);
  return response.data.hourly;
};

export function Weather() {
  const [currentWeather, setCurrentWeather] = useState<WeatherResponse | null>(
    null
  );
  const [hourlyForecast, setHourlyForecast] = useState<Hourly | null>(null);

  const getWeatherData = async () => {
    const location = await getLocation();
    if (location) {
      const weatherData = await fetchCurrentWeather(
        location.latitude,
        location.longitude
      );
      setCurrentWeather(weatherData);

      const hourlyData = await fetchHourlyForecast(
        location.latitude,
        location.longitude
      );
      setHourlyForecast(hourlyData);
    }
  };

  useEffect(() => {
    getWeatherData();
  }, []);

  if (!currentWeather || !hourlyForecast) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Température actuelle: {currentWeather.main.temp}°C</Text>
      <Text>Température ressentie: {currentWeather.main.feels_like}°C</Text>
      <Text>Humidité: {currentWeather.main.humidity}%</Text>
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`,
        }}
        style={styles.weatherIcon}
      />

      <FlatList
        data={hourlyForecast.time.slice(0, 24)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.forecastItem}>
            <Text>{new Date(hourlyForecast.time[index]).getHours()}:00</Text>
            <Text>{hourlyForecast.temperature_2m[index]}°C</Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${hourlyForecast.weathercode[index]}@2x.png`,
              }}
              style={styles.weatherIcon}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
});
