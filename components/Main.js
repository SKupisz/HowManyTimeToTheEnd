import React from "react";
import {ScrollView, View, Text, Pressable} from "react-native";
import {StatusBar} from "react-native";

import BuiltIn from "./BuiltIn.js";
import UserOwnDates from "./UserOwnDates.js";

export default class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            numberOfCurrentPart: 0
        }
    }
    changeTheCurrentPart(nextPart){
        this.setState({
            numberOfCurrentPart: nextPart
        }, () => {});
    }
    render(){
        return <ScrollView>
            {this.state.numberOfCurrentPart === 0 ?             
            <View style = {this.props.styles["menuContainer"]}>
                <Pressable style = {this.props.styles["menuBtn"]} onPress = {() => {this.changeTheCurrentPart(1)}}>
                    <Text style = {this.props.styles["menuBtnText"]}>Daty wbudowane</Text>
                </Pressable>
                <Pressable style = {this.props.styles["menuBtn"]} onPress = {() => {this.changeTheCurrentPart(2)}}>
                    <Text style = {this.props.styles["menuBtnText"]}>Twoje daty</Text>
                </Pressable>
            </View>: <View style = {this.props.styles["menuContainer"]}>
            <Pressable style = {this.props.styles["menuBtn"]} onPress = {() => {this.changeTheCurrentPart(0)}}>
                    <Text style = {this.props.styles["menuBtnText"]}>Menu główne</Text>
                </Pressable>
                </View>}
            {this.state.numberOfCurrentPart === 0 ? <Text></Text> : this.state.numberOfCurrentPart === 1 ? 
            <View>
                <BuiltIn styles = {this.props.styles}/>
            </View>
            : this.state.numberOfCurrentPart === 2 ? 
            <View>
                <UserOwnDates styles = {this.props.styles}/>
            </View>: <Text></Text>}
            
            <StatusBar style="auto" />
        </ScrollView>;
    }
}