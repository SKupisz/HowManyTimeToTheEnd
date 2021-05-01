import React from "react";
import {View, Text, Pressable} from "react-native";

export default class BuiltIn extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            currentTimeLeft: 0,
            currentDateToCheck: -1 // 1 - end of the schoolyear
        };

        this.setNewTime = this.setNewTime.bind(this);
        this.checkHowManyLeft = this.checkHowManyLeft.bind(this);

        this.datesToAnalyze = require("./dates.json");
    }
    setNewTime(newMode){
        if(newMode !== this.state.currentDateToCheck){
            this.setState({
                currentDateToCheck: newMode
            }, () => {this.checkHowManyLeft()});
        }
        else{
            this.setState({
                currentDateToCheck: -1
            }, () => {});
        }
        
    }
    checkHowManyLeft(){
        if(this.state.currentDateToCheck !== -1){
            let helper = this.datesToAnalyze["dates"][this.state.currentDateToCheck];
            let operand = new Date(), operand2 = new Date(helper[2],helper[1] - 1, helper[0]);
            //console.log(operand2.getTime(), operand.getTime(), operand2.toDateString(), operand.getTime() - operand2.getTime());
            operand = operand2.getTime()-operand.getTime();
            if(operand <= 0){
                this.setState({
                    currentTimeLeft: -1
                }, () => {});
            }
            else{
                this.setState({
                    currentTimeLeft: operand
                }, () => {
                    setTimeout(() => {this.checkHowManyLeft();},100);
                });
            }
        }

    }
    render(){
        return <View>
            <View style = {this.props.styles["main"]}>
                {this.state.currentDateToCheck === -1 ? this.datesToAnalyze["names"].map((name,ind) => {
                return <Pressable key = {name} onPress ={() => {this.setNewTime(ind)}} style = {this.props.styles["choosingBtn"]}>
                <Text style = {this.props.styles["choosingBtnText"]}>{name}</Text>
            </Pressable>;
                }) : <Pressable style = {this.props.styles["choosingBtn"]} onPress = {() => {this.setNewTime(this.state.currentDateToCheck)}}>
                <Text style = {this.props.styles["choosingBtnText"]}>Menu</Text>
            </Pressable>}

            </View>
            <View style = {this.props.styles["content"]}>
                <Text>
                    {this.state.currentDateToCheck === -1 ? <Text></Text>: this.state.currentTimeLeft === -1 ? <Text style = {this.props.styles["passedAway"]}>Już jest</Text> : 
                    <View style = {this.props.styles["timeStamps"]}>
                        <Text style = {this.props.styles["eventName"]}>{this.datesToAnalyze["names"][this.state.currentDateToCheck]}</Text>
                        <Text style = {this.props.styles["passedAway"]}>Zostało</Text>
                    <Text style = {this.props.styles["timeDiff"]}>{Math.floor((this.state.currentTimeLeft)/(1000*60*60*24*7))+" tygodni"}</Text>
                    <Text style = {this.props.styles["timeDiff"]}>{Math.floor((this.state.currentTimeLeft)/(1000*60*60*24))+" dni"}</Text>
                    <Text style = {this.props.styles["timeDiff"]}>{Math.floor((this.state.currentTimeLeft)/(1000*60*60))+" godzin"}</Text>
                    <Text style = {this.props.styles["timeDiff"]}>{Math.floor((this.state.currentTimeLeft)/(1000*60))+" minut"}</Text>
                    <Text style = {this.props.styles["timeDiff"]}>{Math.floor((this.state.currentTimeLeft)/(1000))+" sekund"}</Text>
                    </View>}
                </Text>
            </View>
        </View>;
    }
}