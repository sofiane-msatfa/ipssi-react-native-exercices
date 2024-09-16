import { Weather } from "@/components/Weather";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalculatorScreen() {
  return (
    <SafeAreaView>
      <Weather />
    </SafeAreaView>
  );
}
