

import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./app";


export default function Index() {
  return (
    <SafeAreaProvider >
      {/* <DataProvider> */}
        <App />
      {/* </DataProvider> */}
    </SafeAreaProvider>
   
  );
}