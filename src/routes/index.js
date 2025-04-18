import { NavigationContainer } from "@react-navigation/native";
import { MainStackRoutes } from "./stack.routes";

export function Routes() {
    return (
        <NavigationContainer>
           <MainStackRoutes />
        </NavigationContainer>
    )
}