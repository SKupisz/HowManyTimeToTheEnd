import React from "react";
import {View, Text, Pressable, TextInput} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {openDatabase} from "expo-sqlite";

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

        this.data = openDatabase("db");
        this.proccessDatabaseData = this.proccessDatabaseData.bind(this);
        this.newDate = this.newDate.bind(this);
        this.changeDateState = this.changeDateState.bind(this);
        this.setTheDate = this.setTheDate.bind(this);
        this.runNewUserDate = this.runNewUserDate.bind(this);
        this.checkHowManyLeft = this.checkHowManyLeft.bind(this);
        this.deleteCurrentDate = this.deleteCurrentDate.bind(this);
    }
    proccessDatabaseData(gottenData){
        let helper = gottenData.map(elem => {return [elem["dateName"],elem["time"], elem["id"]];});
        let operand = this.state.currentOwnList;
        operand = operand.concat(helper);
        this.setState({
            currentOwnList: operand
        }, () => {});
    }
    newDate(event,dateValue){
        if(event.type === "dismissed"){
            this.changeDateState(0);
        }
        else{
            let operand = dateValue.getTime();
        let helper = this.state.currentOwnList;
        let newDateId = -1;
        this.data.transaction(tx => {
            let query = "insert into UserDates values (null, '"+this.state.newDateName+"', "+operand+");"
            tx.executeSql(
                query,
                [],
                () => {console.log("success")},
                (err) => console.log("error",err)
            );
            tx.executeSql(
                "select id from UserDates where dateName='"+this.state.newDateName+"' and time = "+operand+";",
                [],
                (_,{rows: {_array}}) => {
                    newDateId = _array[0]["id"]; 
                    helper.push([this.state.newDateName,operand, newDateId]);
                    this.setState({
                        currentOwnList: helper,
                        newDateState: 0
                    }, () => {});
                },
                () => console.log("error: no ID for this date found")
            );
        });
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
    deleteCurrentDate(){
        if(this.state.currentIndex !== -1){
            let helper = this.state.currentOwnList;
            let getTheDeletedRow = helper.filter((elem,index) => {
                return index === this.state.currentIndex;
            });
            helper = helper.filter((elem,index) => {
                return index !== this.state.currentIndex;
            });
            this.data.transaction(tx => {
                let query = "delete from UserDates where id = "+getTheDeletedRow[0][2]+";"
                tx.executeSql(
                    query,
                    [],
                    () => {console.log("deleting success")},
                    () => {console.log(query, "error while deleting a row")}
                );
            });
            this.setState({
                currentIndex: -1,
                currentOwnList: helper
            }, () => {});
        }
    }
    componentDidMount(){
        //this.atTheBeginning();
        this.data.transaction(tx => {
            tx.executeSql(
                "create table if not exists UserDates (id integer primary key not null, dateName text, time int);",
                [],
                () => {console.log("success with creating database")},
                () => console.log("database creating error")
            );
            tx.executeSql(
                "select * from UserDates",
                [],
                (_, {rows: {_array}}) => this.proccessDatabaseData(_array),
                () => console.log("error")
            );
        });
    }
    render(){
        return <View>
            <View style = {this.props.styles["mainMenuOfUser"]}>
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
                {this.state.currentOwnList.length !== 0 && this.state.currentIndex === -1 ? this.state.currentOwnList.map((name,ind) => {
                return <Pressable key = {"keyNR"+ind} onPress ={() => {this.runNewUserDate(ind)}} style = {this.props.styles["choosingBtn"]}>
                <Text style = {this.props.styles["choosingBtnText"]}>{name[0]}</Text>
            </Pressable>;
                }) : this.state.currentOwnList.length !== 0 ? <View>
            <Pressable style = {this.props.styles["choosingBtn"]} onPress = {() => {this.runNewUserDate(this.state.currentIndex)}}>
                <Text style = {this.props.styles["choosingBtnText"]}>Wszystkie daty</Text>
            </Pressable>
            <Pressable style = {this.props.styles["choosingBtn"]} onPress = {() => {this.deleteCurrentDate()}}>
                <Text style = {this.props.styles["choosingBtnText"]}>Usuń datę</Text>
            </Pressable>
            </View> : <Text></Text>}

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