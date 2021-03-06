import React from 'react'
import "./NavBar.css"
import { Navbar,Nav } from 'react-bootstrap'
import {Redirect} from "react-router-dom";
import axios from "axios";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaUser,FaUserMd } from 'react-icons/fa'
import 'bootstrap/dist/css/bootstrap.css'
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import PatientData from "./PatientData";
import Button from "react-bootstrap/Button";

class NavBar extends React.Component {
    constructor(){
        super();
        this.state = {
            showPopup: false,
            userInfo: false,
            pass: "",
            pass2: "",
            diff: false,
            isLogOut: false,
            isMessage: false,
            isPatientInfo: false,
            isInstructions: false,
            isExercises: false,
            isEdit: false,
        };
        this.logout = this.logout.bind(this);
        this.change = this.change.bind(this);
        this.privateInfoShow = this.privateInfoShow.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeToEdit = this.changeToEdit.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    goToMessages() {
        this.setState({
            isPatientInfo: false,
            isInstructions: false,
            isMessage: true,
            isQuestionnaires: false,
            isExercises: false
        })
    }

    goToExercises() {
        this.setState({
            isPatientInfo: false,
            isInstructions: false,
            isMessage: false,
            isExercises: true,
            isQuestionnaires: false
        })
    }

    goToSearch() {
        this.setState({
            isPatientInfo: true,
            isMessage:false,
            isQuestionnaires: false,
            isInstructions: false,
            isExercises: false
        })
    }

    goToQuestionnaires() {
        this.setState({
            isPatientInfo: false,
            isMessage: false,
            isInstructions: false,
            isQuestionnaires: true,
            isExercises: false
        })
    }

    goToInstructions() {
        this.setState({
            isPatientInfo: false,
            isMessage: false,
            isInstructions: true,
            isQuestionnaires: false,
            isExercises: false
        })
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    toggleUserInfo() {
        this.setState({
            userInfo: !this.state.userInfo
        });
    }

    async handleSubmit(event){
        event.preventDefault();
        if(this.state.pass !== this.state.pass2){
            this.setState({
                diff: true
            });
        }
        else{
            let url = '  https://rps.ise.bgu.ac.il/njsw18auth/usersAll/askChangePassword';
            var token;
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }
            );
            token = response.data.data;
            url = '  https://rps.ise.bgu.ac.il/njsw18users/passwordChangeCheck/changePassword';
            const responsec = await axios.post(
                url,
                {
                    "NewPassword":this.state.pass
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                }
            );
            if(responsec.data.message){
                window.alert("???????????? ?????????? ????????????");
                this.togglePopup();
            }
        }
    }

    componentDidMount() {
        this.getInfo()
    }

    async getInfo(){
        let url = '  https://rps.ise.bgu.ac.il/njsw18auth/usersAll/userInfo';
        var token;
        const response = await axios.get(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }
        );
        this.setState({currUser: response.data.data})
    }


    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value })
    }

    logout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("type");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("doctor");
        sessionStorage.removeItem("patient");
        sessionStorage.removeItem("patientUserId");
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        localStorage.removeItem("name");
        localStorage.removeItem("doctor");
        localStorage.removeItem("patient");
        this.setState({
            isLogOut: true
        })
    }

    change(){
        this.togglePopup();
    }

    privateInfoShow(){
        this.toggleUserInfo()
    }

    isDoctor(){
        return sessionStorage.getItem('doctor')
    }

    changeToEdit(){
        this.setState({
            isEdit: !this.state.isEdit
        });
    }

    updateUser(user){
        this.setState({currUser: user})
    }

    render() {
        var path = window.location.pathname;
        require("./NavBar.css");
        var iconType;
        if (this.isDoctor()) {
            iconType = <FaUserMd class="userIcon" style={{color: 'white'}} size={25}/>
        }else{
            iconType =  <FaUser class="userIcon" style={{color: 'white'}} size={25}/>
        }
        return (
            <div>
                <Navbar class="navbar navbar-fixed-top" bg="dark" variant="dark" fixed="top">
                    <div id="buttons">
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToSearch()}>?????????? ????????????</button>
                        <span>{'    '}            </span>
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToQuestionnaires()}>??????????????</button>
                        <span>{'              '}</span>
                        <button id="change" class="btn btn-dark" type="button"  onClick={() => this.goToMessages()}>?????? ????????????</button>
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToExercises()}>?????????????? ??????????????</button>
                        <button id="change" class="btn btn-dark" type="button" onClick={()=> this.goToInstructions()}>???????????? ??????????</button>
                        {this.state.isMessage ? <Redirect to="/messages" /> : null}
                        {this.state.isPatientInfo ? <Redirect to="/search" /> : null}
                        {this.state.isQuestionnaires ? <Redirect to="/questionnaires" /> : null}
                        {this.state.isQuestionnaires ? this.setState({isQuestionnaires: false}) : null}
                        {this.state.isInstructions ? <Redirect to="/instructions" /> : null}
                        {this.state.isExercises ? <Redirect to="/exercises" /> : null}
                        {this.state.isLogOut ? <Redirect to="/" /> : null}
                        {this.state.showPopup ?
                            <Popup
                                change={this.handleChange.bind(this)}
                                closePopup={this.togglePopup.bind(this)}
                                handleSubmit={this.handleSubmit.bind(this)}
                                diff={this.state.diff}
                            /> : null
                        }
                        {this.state.userInfo && sessionStorage.getItem('patient') ?
                            <UserInfo
                                user = {this.state.currUser}
                                isEdit = {this.state.isEdit}
                                closePopup={this.toggleUserInfo.bind(this)}
                                changeToEdit = {this.changeToEdit}
                                updateUser = {this.updateUser}
                            /> : null
                        }
                        {this.state.userInfo && sessionStorage.getItem('doctor') ?
                            <DoctorInfo
                                user = {this.state.currUser}
                                isEdit = {this.state.isEdit}
                                closePopup={this.toggleUserInfo.bind(this)}
                                changeToEdit = {this.changeToEdit}
                                updateUser = {this.updateUser}
                            /> : null
                        }
                    </div>
                    <NavDropdown  id="dropdown-item-button" style={{color : 'white'}} title = {sessionStorage.getItem("name")}>
                        <NavDropdown.Item as="button" onClick={() => this.change()}>?????? ??????????</NavDropdown.Item>
                        <NavDropdown.Item as="button" onClick={() => this.logout()}>??????????</NavDropdown.Item>
                        <NavDropdown.Item as="button" onClick={() => this.privateInfoShow()}>?????????? ????????????</NavDropdown.Item>
                    </NavDropdown>
                    {iconType}
                    <Navbar.Brand>
                        <img
                            alt=""
                            src={require("./first_logo.png")}
                            width="70"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                </Navbar>
                <br/>
                <br/>
            </div>
        )
    }
}

export default NavBar;

class Popup extends React.Component {
    render() {
        // require("./NavBar.css");
        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <button onClick={this.props.closePopup} id="x">x</button>
                    <h3 id="h3">?????????? ??????????</h3>
                    <form onSubmit={this.props.handleSubmit}>
                        <div className="lineC">
                            <label>
                                ?????????? ????????:
                            </label>
                        </div>
                        <div className="lineC">
                            <input type="password" name="pass" id="pass" onChange={this.props.change} required/>
                        </div>
                        <div className="lineC">
                            <label>
                                ???????? ???? ???????????? ????????:
                            </label>
                        </div>
                        <div className="lineC">
                            <input type="password" name="pass2" id="pass2" onChange={this.props.change} required/>
                        </div>
                        <div className="lineC">
                            {this.props.diff ? <label id="diffPass">???????????????? ??????????</label> : null}
                        </div>
                        <div className="lineC">
                            <input type="submit" value="??????"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
class DoctorInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            fName: this.props.user.First_Name,
            lName: this.props.user.Last_Name,
            bday: new Date(this.props.user.BirthDate),
            phone: this.props.user.Phone_Number
        };
        this.handleChangeInfo = this.handleChangeInfo.bind(this);
        this.handleSubmitInfo = this.handleSubmitInfo.bind(this);
    }
    handleChangeInfo(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async handleSubmitInfo(event) {
        event.preventDefault();
        var bDay = new Date(this.state.bday);
        var now = new Date();
        var dateOfSurgery = new Date(this.state.dateOfSurgery);
        let height_double = Number(this.state.height / 100);
        let bmi = String((Number(this.state.weight)/Math.pow(height_double,2)));
        const response = await axios.put('  https://rps.ise.bgu.ac.il/njsw18auth/usersAll/doctorUpdate', {
                // UserID: this.state.userName,
                First_Name: this.state.fName,
                Last_Name: this.state.lName,
                Phone_Number: this.state.phone,
                BirthDate: bDay.getTime(),
                ValidTime: now.getTime()
            },
            {headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }})
        this.props.changeToEdit()
        this.props.updateUser(response.data.data)
    }
    render() {
        require("./NavBar.css");
        let bDate = new Date(this.state.bday).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        var today = new Date();
        var birthday = new Date(this.props.user["BirthDate"]);
        var age = Math.floor((today.getTime() - birthday.getTime())/ 31536000000)
        var today = (new Date()).toISOString().split("T")[0];
        var date = new Date(this.state.bday).toISOString().substr(0,10);
        return (
            <div className='popup'>
                <div className='popup_inner_info'>
                    <button onClick={this.props.closePopup} id="x">x</button>
                    {!this.props.isEdit ?
                        <Card class="cardInfo">
                            <Card.Header><b>{this.props.user.First_Name}{' '}{this.props.user.Last_Name}</b></Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item className={"listItem"} > ?????????? ????????: {bDate} </ListGroup.Item>
                                <ListGroup.Item className={"listItem"}> ??????: {age}</ListGroup.Item>
                                {/*<ListGroup.Item className={"listItem"}> ??????: {this.props.user.Gender} </ListGroup.Item>*/}
                                <ListGroup.Item className={"listItem"}> ??????????: {this.props.user.Phone_Number} </ListGroup.Item>
                            </ListGroup>
                        </Card> : null }
                    {this.props.isEdit ?
                        <form onSubmit={this.handleSubmitInfo} onReset={this.handleReset} id="new_user_form">
                            <br/>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">???? ????????</label>
                                <input className="inputs_in_add_user" name="fName" type="text" value={this.state.fName} maxLength="20"
                                       onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">???? ?????????? </label>
                                <input className="inputs_in_add_user" name="lName" type="text" value={this.state.lName} maxLength="20"
                                       onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">???????? ??????????</label>
                                <input className="inputs_in_add_user" name="phone" type="tel" id="phone" pattern="[0-9]{10}"
                                       value={this.state.phone} onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">?????????? ????????</label>
                                <input className="inputs_in_add_user" name="bday" type="date" max={today}
                                       value={date} onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <input style={{width: 150}} variant="info" type="submit" value="????????" className="submit_and_reset_buttons"/>
                            </div>
                        </form> : null}
                    {!this.props.isEdit ?
                        <button style={{width: 150, float:'left',position:'relative'}} variant="info" onClick={this.props.changeToEdit}> ??????????/???????? ?????????? </button> : null}
                </div>
            </div>
        );
    }
}


class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            fName: this.props.user.First_Name,
            lName: this.props.user.Last_Name,
            bday: new Date(this.props.user.BirthDate),
            phone: this.props.user.Phone_Number,
            gender: this.props.user.Gender,
            smoke: this.props.user.Smoke,
            dateOfSurgery:new Date(this.props.user.DateOfSurgery),
            surgeryType: this.props.user.SurgeryType,
            education: this.props.user.Education,
            height: this.props.user.Height,
            weight: this.props.user.Weight,
            bmi:this.props.user.BMI,
        }
        this.handleChangeInfo = this.handleChangeInfo.bind(this);
        this.handleSubmitInfo = this.handleSubmitInfo.bind(this);
        this.onSelectGender = this.onSelectGender.bind(this);
        this.onSelectSmoke = this.onSelectSmoke.bind(this);
        this.onSelectSurgeryType = this.onSelectSurgeryType.bind(this);
        this.onSelectEducation = this.onSelectEducation.bind(this);
    }
    handleChangeInfo(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async handleSubmitInfo(event) {
        event.preventDefault();
        var bDay = new Date(this.state.bday);
        var now = new Date();
        var dateOfSurgery = new Date(this.state.dateOfSurgery);
        let height_double = Number(this.state.height / 100);
        let bmi = String((Number(this.state.weight)/Math.pow(height_double,2)));
        const response = await axios.put('  https://rps.ise.bgu.ac.il/njsw18auth/usersAll/patientUpdate', {
                // UserID: this.state.userName,
                First_Name: this.state.fName,
                Last_Name: this.state.lName,
                Phone_Number: this.state.phone,
                Gender:this.state.gender,
                Smoke: this.state.smoke,
                DateOfSurgery: dateOfSurgery.getTime(),
                SurgeryType: this.state.surgeryType,
                Education: this.state.education,
                Height: this.state.height,
                Weight: this.state.weight,
                BMI: bmi,
                BirthDate: bDay.getTime(),
                ValidTime: now.getTime()
            },
            {headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }})
        this.props.changeToEdit()
        this.props.updateUser(response.data.data)

    }
    onSelectGender(event) {
        let gender;
        const selectedIndex = event.target.options.selectedIndex;
        if (selectedIndex == 1) {
            gender = "????????"
        } else if (selectedIndex == 2) {
            gender = "??????"
        }
        this.setState({
            gender: gender
        });
    }
    onSelectSmoke(event) {
        const selectedIndex = event.target.options.selectedIndex;
        let smoke;
        if (selectedIndex == 1) {
            smoke = "????????"
        } else if (selectedIndex == 2) {
            smoke = "???? ????????"
        }
        this.setState({
            smoke: smoke
        });
    }
    onSelectEducation(event) {
        const selectedIndex = event.target.options.selectedIndex;
        let educationOptions = {1 :"?????????? ??????????????", 2: "?????????? ??????????????", 3:"10-12 ???????? ??????????", 4: "6-9 ???????? ??????????", 5: "5 ???????? ?????????? ???? ????????", 6:"???? ?????????????? ??????????"};
        this.setState({
            education: educationOptions[selectedIndex]
        });
    }

    onSelectSurgeryType(event) {
        const selectedIndex = event.target.options.selectedIndex;
        let sType;
        if (selectedIndex == 1) {
            sType = "?????????? ????????"
        }else if (selectedIndex == 2)
        {
            sType = "?????????? ????????????"

        }else if (selectedIndex == 3) {
            sType = "?????? ??????????"
        }
        this.setState({
            surgeryType: sType
        });
        if( selectedIndex !== 3 && selectedIndex !==0){
            this.setState({
                surgeryDateDisplay: true
            });
        }else{
            this.setState({
                surgeryDateDisplay: false
            });
        }
    }
    render() {
        require("./NavBar.css");
        let bDate = new Date(this.state.bday).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        var today = new Date();
        var birthday = new Date(this.props.user["BirthDate"]);
        var age = Math.floor((today.getTime() - birthday.getTime())/ 31536000000)
        let sDate = (new Date(this.state.dateOfSurgery)).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        let bmi = parseFloat(this.props.user["BMI"]).toFixed(1);
        let patientListItems;
        if(sessionStorage.getItem("patient")){
            patientListItems =  <div>
                <ListGroup.Item className={"listItem"}> ????????: {this.props.user.Height}</ListGroup.Item>
                <ListGroup.Item className={"listItem"}> ????????: {this.props.user.Weight}</ListGroup.Item>
                <ListGroup.Item className={"listItem"}> BMI:{bmi}</ListGroup.Item>
                <ListGroup.Item className={"listItem"}> ?????????? ??????????: {sDate} </ListGroup.Item>
                <ListGroup.Item className={"listItem"}> ?????? ??????????: {this.props.user.SurgeryType} </ListGroup.Item>
                <ListGroup.Item className={"listItem"}> ??????????: {this.props.user.Education} </ListGroup.Item>
            </div>
        }
        let genderOptions = [<option></option>,<option>????????</option>,<option>??????</option>];
        let surgeryOptions = [<option/>,<option>?????????? ????????</option>,<option>?????????? ????????????</option>,<option>?????? ??????????</option>];
        let smokeOptions = [<option/>,<option>????????</option>,<option>???? ????????</option>];
        let educationOptions = [<option/>,<option>?????????? ??????????????</option>,<option>?????????? ??????????????</option>,<option>10-12 ???????? ??????????</option>,<option>6-9 ???????? ??????????</option>,<option>5 ???????? ?????????? ???? ????????</option>,<option>???? ?????????????? ??????????</option>];
        var today = (new Date()).toISOString().split("T")[0];
        var date = new Date(this.state.bday).toISOString().substr(0,10);
        var surgeryDate = new Date(this.state.dateOfSurgery).toISOString().substr(0,10);
        return (
            <div className='popup'>
                <div className='popup_inner_info'>
                    <button onClick={this.props.closePopup} id="x">x</button>
                    {!this.props.isEdit ?
                        <Card class="cardInfo">
                            <Card.Header><b>{this.props.user.First_Name}{' '}{this.props.user.Last_Name}</b></Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item className={"listItem"} > ?????????? ????????: {bDate} </ListGroup.Item>
                                <ListGroup.Item className={"listItem"}> ??????: {age}</ListGroup.Item>
                                <ListGroup.Item className={"listItem"}> ??????: {this.props.user.Gender} </ListGroup.Item>
                                <ListGroup.Item className={"listItem"}> ??????????: {this.props.user.Phone_Number} </ListGroup.Item>
                                {patientListItems}
                            </ListGroup>
                        </Card> : null }
                    {this.props.isEdit ?
                        <form onSubmit={this.handleSubmitInfo} onReset={this.handleReset} id="new_user_form">
                            <br/>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">???? ????????</label>
                                <input className="inputs_in_add_user" name="fName" type="text" value={this.state.fName} maxLength="20"
                                       onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">???? ?????????? </label>
                                <input className="inputs_in_add_user" name="lName" type="text" value={this.state.lName} maxLength="20"
                                       onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">???????? ??????????</label>
                                <input className="inputs_in_add_user" name="phone" type="tel" id="phone" pattern="[0-9]{10}"
                                       value={this.state.phone} onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">?????????? ????????</label>
                                <input className="inputs_in_add_user" name="bday" type="date" max={today}
                                       value={date} onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">???????? (??"??) </label>
                                <input className="inputs_in_add_user" name="weight" type="number" value={this.state.weight}
                                       onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">???????? (??"??) </label>
                                <input className="inputs_in_add_user" name="height" type="number" value={this.state.height}
                                       onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">?????? </label>
                                <select value={this.state.gender} className="select_in_add_user" onChange={this.onSelectGender}>
                                    {genderOptions}
                                </select>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">???????? </label>
                                <select value={this.state.smoke} className="select_in_add_user" onChange={this.onSelectSmoke}>
                                    {smokeOptions}
                                </select>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">?????????? </label>
                                <select value={this.state.education} className="select_in_add_user" onChange={this.onSelectEducation}>
                                    {educationOptions}
                                </select>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">?????? ?????????? </label>
                                <select value={this.state.surgeryType} className="select_in_add_user" onChange={this.onSelectSurgeryType}>
                                    {surgeryOptions}
                                </select>
                            </div>
                            <div className="divs_in_add">
                                <label className="labels_in_add_user">?????????? ??????????</label>
                                <input className="inputs_in_add_user" name="dateOfSurgery" type="date"
                                       value={surgeryDate} onChange={this.handleChangeInfo} required/>
                            </div>
                            <div className="divs_in_add">
                                <input style={{width: 150}} variant="info" type="submit" value="????????" className="submit_and_reset_buttons"/>
                            </div>
                        </form> : null}
                    {!this.props.isEdit ?
                        <button style={{width: 150, float:'left',position:'relative'}} variant="info" onClick={this.props.changeToEdit}> ??????????/???????? ?????????? </button> : null}
                </div>
            </div>
        );
    }
}