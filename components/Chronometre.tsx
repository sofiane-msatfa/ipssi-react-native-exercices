import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export function Chronometre() {
  const [time, setTime] = useState<string>("00:00:00");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const formatTime = (time: number) => {
    return String(time).padStart(2, "0");
  };

  const start = () => {
    if (!timer) {
      const newTimer = setInterval(() => {
        // set new time
        setTime((prevTime) => {
          const [hours, minutes, seconds] = prevTime.split(":").map(Number);
          let newSeconds = seconds + 1;
          let newMinutes = minutes;
          let newHours = hours;
          if (newSeconds === 60) {
            newSeconds = 0;
            newMinutes++;
          }
          if (newMinutes === 60) {
            newMinutes = 0;
            newHours++;
          }
          return `${formatTime(newHours)}:${formatTime(
            newMinutes
          )}:${formatTime(newSeconds)}`;
        });
      }, 1000);
      setTimer(newTimer);
    }
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const reset = () => {
    stop();
    setTime("00:00:00");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={!!timer ? stop : start}
        >
          <Text style={styles.buttonText}>{!!timer ? "Stop" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    fontSize: 48,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: "lightblue",
  },
  buttonText: {
    fontSize: 24,
  },
});
