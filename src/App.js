import logo from "./logo.svg";
import BarChartAgeAvRide from './BarChartAgeAvRide'
import BarChart from './BarChart'
import PieChart from './PieChart'
import "@aws-amplify/ui-react/styles.css";
import "./App.css"
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import PieChartGenderAvAge from "./PieChartGenderAvAge";
import LineChartYearTrips from "./LineChartYearTrips";

const App = ({ signOut, user }) => {
    return (<div>
                <View className="App">
                    <Card>
                    <Heading level={5}>Welcome {user.username}! You are Authenticated!</Heading>
                    </Card>
                    <Button onClick={signOut}>Sign Out</Button>
                </View>
                <Heading level={3}>Pedaling into the Future: Analysis of Divvy Bike Trips</Heading>
                <div className="wrapper">
                <div id="chart1" className="item"><BarChartAgeAvRide /></div>
                <div id="chart2"className="item"><PieChart /> </div>
                <div id="chart3" className="item"><PieChartGenderAvAge /> </div>
                <div id="chart4" className="item"><LineChartYearTrips /></div>
                </div>
            </div> )
}
export default withAuthenticator(App);
