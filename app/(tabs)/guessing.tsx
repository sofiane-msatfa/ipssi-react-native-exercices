import { GuessingGame } from "@/components/GuessingGame";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalculatorScreen() {
  return (
    <SafeAreaView>
      <GuessingGame />
    </SafeAreaView>
  );
}
