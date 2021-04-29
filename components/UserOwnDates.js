import React from "react";
import {View, Text, Pressable, TextInput} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class UserOwnDates extends React.Component{
    constructor(props){
        super(props);

        this.newDateNameRef = React.createRef();

        this.state = {
            newDateState: 0,
            newDateName: "",
            currentTimeLeft: 0,
            currentIndex: -1,
            currentOwnList: []
        };

        this.data = require("./dates.json");
        this.atTheBeginning = this.atTheBeginning.bind(this);
        this.newDate = this.newDate.bind(this);
        this.changeDateState = this.changeDateState.bind(this);
        this.setTheDate = this.setTheDate.bind(this);
        this.insertTheData = this.insertTheData.bind(this);
        this.runNewUserDate = this.runNewUserDate.bind(this);
        this.checkHowManyLeft = this.checkHowManyLeft.bind(this);
    }
    async atTheBeginning(){
        const getTheDates = await AsyncStorage.getItem("@currentValues");
        if(getTheDates !== null){
            this.setState({
                currentOwnList: getTheDates
            }, () => {});
        }
    }
    newDate(event,dateValue){
        let operand = dateValue.getTime();
        let helper = this.state.currentOwnList;
        helper.push([this.state.newDateName,operand]);
        this.setState({
            currentOwnList: helper,
            newDateState: 0
        }, () => {console.log(this.state.currentOwnList)});
        //this.insertTheData(this.state.newDateName,operand);
    }
    async insertTheData(name,time){
        let value = await AsyncStorage.getItem("@currentValues");
        if(value === null){
            let newTable = [[name,time]];
            await AsyncStorage.setItem("@currentValues",newTable);
            this.setState({
                currentOwnList: newTable
            }, () => {this.changeDateState(0)});
        }
        else{
            value.push([name,time]);
            await AsyncStorage.setItem("@currentValues",value);
            this.setState({
                currentOwnList: value
            }, () => {this.changeDateState(0)});
        }
    }
    setTheDate(text){
        this.setState({
            newDateName: text
        }, () => {});
    }
    changeDateState(arg){
        this.setState({
            newDateState: arg
        }, () => {});
    }
    runNewUserDate(index){
        if(this.state.currentIndex !== index){
            this.setState({
                currentIndex: index
            }, () => {this.checkHowManyLeft()});
        }
        else{
            this.setState({
                currentIndex: -1
            }, () => {this.checkHowManyLeft()});
        }
    }
    checkHowManyLeft(){
        if(this.state.currentIndex !== -1){
            let helper = this.state.currentOwnList[this.state.currentIndex][1];
            let operand = new Date();
            operand = helper-operand.getTime();
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
    componentDidMount(){
        //this.atTheBeginning();
    }
    render(){
        return <View>
            <View>
                {this.state.newDateState === 0 ?                 
                <Pressable style = {this.props.styles["choosingBtn"]} onPress = {() => {this.changeDateState(1)}}>
                    <Text style = {this.props.styles["choosingBtnText"]}>Nowa data</Text>
                </Pressable> : this.state.newDateState === 1 ? <View>
                    <TextInput style = {this.props.styles["dateNameInput"]} ref = {this.newDateNameRef} onChangeText = {text => this.setTheDate(text)}/>
                    <View style = {this.props.styles["insertingNewDateMenu"]}>
                        <Text style = {this.props.styles["insertingDataWrapper"]}>
                            <Pressable style = {this.props.styles["insertingMenuBtn"]} onPress = {() => {this.changeDateState(0)}}>
                                <Text style = {this.props.styles["insertingMenuBtnText"]}>Przerwij</Text>
                            </Pressable>
                        </Text>
                        <Text style = {this.props.styles["insertingDataWrapper"]}>
                            <Pressable style = {this.props.styles["insertingMenuBtn"]} onPress = {() => {this.changeDateState(2)}}>
                                <Text style = {this.props.styles["insertingMenuBtnText"]}>Wybierz i dodaj datę</Text>
                            </Pressable>
                        </Text>
                    </View>
                </View> : 
                <DateTimePicker display = "default" is24hour={true} value = {new Date()} onChange = {(event,dateValue) => {this.newDate(event,dateValue)}}/>}
            </View>
            <View style = {this.props.styles["main"]}>
                {this.state.currentOwnList.length !== 0 ? this.state.currentOwnList.map((name,ind) => {
                return <Pressable key = {"keyNR"+ind} onPress ={() => {this.runNewUserDate(ind)}} style = {this.props.styles["choosingBtn"]}>
                <Text style = {this.props.styles["choosingBtnText"]}>{name[0]}</Text>
            </Pressable>;
                }) : <Text></Text>}

            </View>
            <View style = {this.props.styles["content"]}>
                <Text>
                    {this.state.currentTimeLeft === -1 ? <Text style = {this.props.styles["passedAway"]}>Już jest</Text>: this.state.currentIndex === -1 ? <Text></Text> : 
                    <View style = {this.props.styles["timeStamps"]}>
                        <Text style = {this.props.styles["eventName"]}>{this.state.currentOwnList[this.state.currentIndex][0]}</Text>
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