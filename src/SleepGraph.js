import React, {Component} from "react"
//import LineChart from 'react-linechart';
import {LineChart} from 'react-chartkick'
import 'chart.js'

class SleepGraph extends Component {
    constructor(props) {
        super()
        this.handleChange = this.handleChange.bind(this)
        this.sort_by_key = function(array, key)
        {
         return array.sort(function(a, b)
         {
          var x = a[key]; var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
         });
        }

    }

    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState({[name]: checked }) : this.setState({ [name]: value })
    }
    



    render() {
        if(this.props.ready){
            var noData = false;
            if(this.props.data && this.props.data.length > 0){
                var data = this.sort_by_key(this.props.data, "ValidTime")
                var pointsD = {}, pointsL = {}, pointsT = {};
                var oDay = new Date(this.props.date);
                var lineD = {}, lineL = {}, lineT = {};
                var table = {};
                var dates = [];
                var dateO, dateOStr, week = false;
                if(this.props.weekly){
                    dateO = new Date(this.props.date);
                    var day = dateO.getDay();
                    var sun = new Date(this.props.date - day * 86400000);
                    var sat = new Date(sun.getTime() + 518400000);
                    dateOStr = sun.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + sat.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
                }
                if(this.props.monthly){
                    dateO = new Date(this.props.date);
                    dateOStr = dateO.toLocaleDateString('en-GB', {month: 'short'});
                }
                var avgO = {};
                avgO["before"] = {light: {}, deep: {}, total: {}};
                avgO["after"] = {light: {}, deep: {}, total: {}};
                avgO["before"]["light"] = {sum: 0, counter: 0};
                avgO["before"]["deep"] = {sum: 0, counter: 0};
                avgO["before"]["total"] = {sum: 0, counter: 0};
                avgO["after"]["total"] = {sum: 0, counter: 0};
                avgO["after"]["deep"] = {sum: 0, counter: 0};
                avgO["after"]["light"] = {sum: 0, counter: 0};
                for(var i = 0; i < data.length; i++){
                    var date = new Date(data[i].ValidTime);
                    var deep = 0, light = 0, total = 0, firstTime;
                    for(var k = 0; k < data[i]["Data"].length; k++){
                        if(k === 0){
                            firstTime = data[i]["Data"][k]["StartTime"];
                        }
                        else if( firstTime === data[i]["Data"][k]["StartTime"]){
                            break;
                        }
                        var time = data[i]["Data"][k]["EndTime"] - data[i]["Data"][k]["StartTime"];
                        time = time / 3600000;
                        if(data[i]["Data"][k]["State"] === "Light sleep"){
                            light = light + time;
                        }
                        else{
                            deep = deep + time;
                        }
                        total = total + time;
                    }
                    if(this.props.showDaily){
                        var dateStr = date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}).replace(/ /g, '-');
                        if(date <= oDay || oDay.valueOf() == 0 ||oDay.valueOf() == null){
                            pointsD[dateStr] = deep.toFixed(2);
                            pointsL[dateStr] = light.toFixed(2);
                            pointsT[dateStr] = total.toFixed(2);
                        }
                        if(date >= oDay && oDay.valueOf() != 0){
                            lineD[dateStr] = deep.toFixed(2);
                            lineL[dateStr] = light.toFixed(2);
                            lineT[dateStr] = total.toFixed(2);
                        }
                    }
                    else if(this.props.weekly){
                        date = new Date(data[i].ValidTime);
                        var dayOfWeek = date.getDay();
                        var sunday = new Date(data[i].ValidTime - dayOfWeek * 86400000);
                        var saturday = new Date(sunday.getTime() + 518400000);
                        dateStr = sunday.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + saturday.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
                        if(dateOStr === dateStr){
                            if(data[i].ValidTime < this.props.date){
                                avgO["before"]["light"]["counter"]++;
                                avgO["before"]["light"]["sum"] += light;
                                avgO["before"]["deep"]["counter"]++;
                                avgO["before"]["deep"]["sum"] += deep;
                                avgO["before"]["total"]["counter"]++;
                                avgO["before"]["total"]["sum"] += total;
                            }
                            else{
                                avgO["after"]["light"]["counter"]++;
                                avgO["after"]["light"]["sum"] += light;
                                avgO["after"]["deep"]["counter"]++;
                                avgO["after"]["deep"]["sum"] += deep;
                                avgO["after"]["total"]["counter"]++;
                                avgO["after"]["total"]["sum"] += total;
                            }
                            if(!week){
                                week = true;
                                dates.push(data[i].ValidTime);
                            }
                        }
                        else{
                            if(table[dateStr] == null){
                                table[dateStr] = {};
                                table[dateStr]["light"] = {};
                                table[dateStr]["deep"] = {};
                                table[dateStr]["total"] = {};
                                table[dateStr]["light"]["counter"] = 0;
                                table[dateStr]["light"]["sum"] = 0;
                                table[dateStr]["deep"]["counter"] = 0;
                                table[dateStr]["deep"]["sum"] = 0;
                                table[dateStr]["total"]["counter"] = 0;
                                table[dateStr]["total"]["sum"] = 0;
                                dates.push(data[i].ValidTime);
                            }
                            table[dateStr]["light"]["counter"]++;
                            table[dateStr]["light"]["sum"] += light;
                            table[dateStr]["deep"]["counter"]++;
                            table[dateStr]["deep"]["sum"] += deep;
                            table[dateStr]["total"]["counter"]++;
                            table[dateStr]["total"]["sum"] += total;
                        }
                    }
                    else if(this.props.monthly){
                        date = new Date(data[i].ValidTime);;
                        dateStr = date.toLocaleDateString('en-GB', {month: 'short'});
                        if(dateOStr === dateStr){
                            if(data[i].ValidTime < this.props.date){
                                avgO["before"]["light"]["counter"]++;
                                avgO["before"]["light"]["sum"] += light;
                                avgO["before"]["deep"]["counter"]++;
                                avgO["before"]["deep"]["sum"] += deep;
                                avgO["before"]["total"]["counter"]++;
                                avgO["before"]["total"]["sum"] += total;
                            }
                            else{
                                avgO["after"]["light"]["counter"]++;
                                avgO["after"]["light"]["sum"] += light;
                                avgO["after"]["deep"]["counter"]++;
                                avgO["after"]["deep"]["sum"] += deep;
                                avgO["after"]["total"]["counter"]++;
                                avgO["after"]["total"]["sum"] += total;
                            }
                            if(!week){
                                week = true;
                                dates.push(data[i].ValidTime);
                            }
                        }
                        else{
                            if(table[dateStr] == null){
                                table[dateStr] = {};
                                table[dateStr]["light"] = {};
                                table[dateStr]["deep"] = {};
                                table[dateStr]["total"] = {};
                                table[dateStr]["light"]["counter"] = 0;
                                table[dateStr]["light"]["sum"] = 0;
                                table[dateStr]["deep"]["counter"] = 0;
                                table[dateStr]["deep"]["sum"] = 0;
                                table[dateStr]["total"]["counter"] = 0;
                                table[dateStr]["total"]["sum"] = 0;
                                dates.push(data[i].ValidTime);
                            }
                            table[dateStr]["light"]["counter"]++;
                            table[dateStr]["light"]["sum"] += light;
                            table[dateStr]["deep"]["counter"]++;
                            table[dateStr]["deep"]["sum"] += deep;
                            table[dateStr]["total"]["counter"]++;
                            table[dateStr]["total"]["sum"] += total;
                        }
                    }
                }
                dates = dates.sort();
                if(this.props.weekly || this.props.monthly){
                    for (i = 0; i < dates.length; i++) {
                        date = new Date(dates[i]);
                        if(this.props.weekly){
                            dayOfWeek = date.getDay();
                            sunday = new Date(date.getTime() - dayOfWeek * 86400000);
                            saturday = new Date(sunday.getTime() + 518400000);
                            dateStr = sunday.toLocaleDateString('en-GB', {day: 'numeric'}) + " - " + saturday.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
                        }
                        else{
                            dateStr = date.toLocaleDateString('en-GB', {month: 'short'});
                        }
                        if(dateStr === dateOStr){
                            pointsD[dateStr] = (avgO["before"]["deep"]["sum"] /  avgO["before"]["deep"]["counter"]).toFixed(2);
                            pointsL[dateStr] = (avgO["before"]["light"]["sum"] /  avgO["before"]["light"]["counter"]).toFixed(2);
                            pointsT[dateStr] = (avgO["before"]["total"]["sum"] /  avgO["before"]["total"]["counter"]).toFixed(2);
                            lineD[dateStr] = (avgO["after"]["deep"]["sum"] /  avgO["after"]["deep"]["counter"]).toFixed(2);
                            lineL[dateStr] = (avgO["after"]["light"]["sum"] /  avgO["after"]["light"]["counter"]).toFixed(2);
                            lineT[dateStr] = (avgO["after"]["total"]["sum"] /  avgO["after"]["total"]["counter"]).toFixed(2);
                            continue;
                        }
                        if(date <= oDay || oDay.valueOf() == 0 ||oDay.valueOf() == null){
                            pointsD[dateStr] = (table[dateStr]["deep"]["sum"] /  table[dateStr]["deep"]["counter"]).toFixed(2);
                            pointsL[dateStr] = (table[dateStr]["light"]["sum"] /  table[dateStr]["light"]["counter"]).toFixed(2);
                            pointsT[dateStr] = (table[dateStr]["total"]["sum"] /  table[dateStr]["total"]["counter"]).toFixed(2);
                        }
                        if(date >= oDay && oDay.valueOf() != 0){
                            lineD[dateStr] = (table[dateStr]["deep"]["sum"] /  table[dateStr]["deep"]["counter"]).toFixed(2);
                            lineL[dateStr] = (table[dateStr]["light"]["sum"] /  table[dateStr]["light"]["counter"]).toFixed(2);
                            lineT[dateStr] =(table[dateStr]["total"]["sum"] /  table[dateStr]["total"]["counter"]).toFixed(2);
                        }
                    }
                }
                var dataX = [
                    {"name": "???????? ???????? ?????? ???????? ????????????", "data": pointsL},
                    {"name": "???????? ???????? ?????????? ???????? ????????????", "data": pointsD},
                    {"name": "???? ???? ???????? ?????????? ???????? ????????????", "data": pointsT},
                    {"name": "???????? ???????? ?????? ???????? ????????????", "data": lineL},
                    {"name": "???????? ???????? ?????????? ???????? ????????????", "data": lineD},
                    {"name": "???? ???? ???????? ?????????? ???????? ????????????", "data": lineT},
                ];
            }
            else{
                noData = true;
            }
        }
		return (
            <div>
                {this.props.ready ? <div>
                    <div className="App">
                        <h1>{this.props.name}</h1>
                        {noData ? <h4>???? ???????? ???????? ???? ????????????</h4> : <LineChart download={true} data={dataX} colors={["#010C6B", "#7C0000", "#0D4E00", "#77CCEE" ,"#F78989", "#B5FFA2"]} min={0}/>}
                    </div>	
                </div> : null}
            </div>
        )
    }
}

export default SleepGraph