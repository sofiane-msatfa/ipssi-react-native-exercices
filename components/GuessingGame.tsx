import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

function generateSecretNumber() {
  return Math.floor(Math.random() * 100);
}

export function GuessingGame() {
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [feedback, setFeedback] = useState<string>("");
  const [guess, setGuess] = useState<string>("");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [secretNumber, setSecretNumber] = useState<number>(
    generateSecretNumber()
  );

  const handleTimer = () => {
    if (timeLeft === 0) {
      setIsGameOver(true);
      setFeedback("Temps écoulé!");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  };

  useEffect(handleTimer, [timeLeft]);

  const handlePlayAgain = () => {
    setTimeLeft(30);
    setFeedback("");
    setGuess("");
    setIsGameOver(false);
    setSecretNumber(generateSecretNumber());
  };

  const checkNumber = () => {
    if (isGameOver) {
      return;
    }

    const parsedNumber = parseInt(guess);
    if (parsedNumber === secretNumber) {
      setFeedback("Vous avez gagné!");
      setIsGameOver(true);
      return;
    }

    if (parsedNumber > secretNumber) {
      setFeedback("Trop grand!");
    } else {
      setFeedback("Trop petit!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guess the Number</Text>
      {!isGameOver ? (
        <>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={guess}
            onChangeText={setGuess}
            placeholder="Enter your guess"
          />
          <Button title="Submit Guess" onPress={checkNumber} />
          <Text style={styles.feedback}>{feedback}</Text>
          <Text style={styles.timer}>Time left: {timeLeft} seconds</Text>
        </>
      ) : (
        <>
          <Text style={styles.feedback}>{feedback}</Text>
          <Button title="Play Again" onPress={handlePlayAgain} />
        </>
      )}
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "80%",
    textAlign: "center",
  },
  feedback: {
    marginVertical: 20,
    fontSize: 18,
  },
  timer: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
});
