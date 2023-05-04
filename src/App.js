import logo from "./logo.svg";
import BarChartAgeAvRide from './BarChartAgeAvRide'
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

const App = ({ signOut, user }) => {
    return (<div>
                <View className="App">
                    <Card>
                    <Heading level={1}>Hello {user.username}! You are Authenticated!</Heading>
                    </Card>
                    <Button onClick={signOut}>Sign Out</Button>
                </View>
                <BarChartAgeAvRide /> 
            </div> )
}
export default withAuthenticator(App);
