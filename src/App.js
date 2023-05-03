import logo from "./logo.svg";
import BarChart from './BarChart'
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
                <BarChart /> 
            </div> )
}
export default withAuthenticator(App);
