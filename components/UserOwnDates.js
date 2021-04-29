import React from "react";
import {View, Text, Pressable} from "react-native";

export default class UserOwnDates extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        };

        this.data = require("./dates.json");
    }
    render(){
        return <View>
            <Text>W budowie</Text>
        </View>;
    }
}