import React, { Component } from "react";
import axios from 'axios';
import {Redirect} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Select from 'react-select';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import {FcInfo} from "react-icons/fc";
import Tooltip from "@material-ui/core/Tooltip";


const initialState = {
    userName: "",
    fName: "",
    lName: "",
    password: "",
    bday: new Date(),
    questionsID: [],
    questionsText: [],
    questions :[],
    answerUserQuestion: "",
    quesionChosen: 0,
    code: "",
    type: '',
    questionnairesID:[],
    questionnairesText:[],
    gender: "",
    smoke: "",
    dateOfSurgery:"",
    surgeryType: "",
    education: "",
    height: "",
    weight: "",
    bmi:"",
    // questionnaires: [],
    questionnairesChosen:0,
};

class AddUserAfterResearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            fName: "",
            lName: "",
            password: "",
            bday: new Date(),
            phone: "",
            questionsID: [],
            questionsText: [],
            questions :[],
            answerUserQuestion: "",
            code: "",
            questionnaires: [],
            questionnairesID:[],
            questionnairesText:[],
            questionnairesChosen:0,
            quesionChosen: 0,
            gender: "",
            smoke: "",
            dateOfSurgery:"",
            surgeryType: "",
            education: "",
            height: "",
            weight: "",
            bmi:"",
            surgeryDateDisplay: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.onSelectQuesionChosen = this.onSelectQuesionChosen.bind(this);
        this.onSelectGender = this.onSelectGender.bind(this);
        this.onSelectSmoke = this.onSelectSmoke.bind(this);
        this.onSelectSurgeryType = this.onSelectSurgeryType.bind(this);
        this.onSelectEducation = this.onSelectEducation.bind(this);
        this.onSelectQuestionnairesChosen = this.onSelectQuestionnairesChosen.bind(this);
    }

    onSelectQuesionChosen(event) {
        const selectedIndex = event.target.options.selectedIndex;
        this.setState({
            quesionChosen: selectedIndex
        });
    }
    onSelectGender(event) {
        const selectedIndex = event.target.options.selectedIndex;
        this.setState({
            gender: selectedIndex
        });
    }
    onSelectSmoke(event) {
        const selectedIndex = event.target.options.selectedIndex;
        this.setState({
            smoke: selectedIndex
        });
    }
    onSelectEducation(event) {
        const selectedIndex = event.target.options.selectedIndex;
        this.setState({
            education: selectedIndex
        });
    }

    onSelectSurgeryType(event) {
        const selectedIndex = event.target.options.selectedIndex;
        console.log(selectedIndex)
        this.setState({
            surgeryType: selectedIndex
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
    onSelectQuestionnairesChosen(selected) {
        console.log(selected)
        // const selectedIndex = event.target.options.selectedIndex;
        let chosen = [];
        let questionnaires = this.state.questionnaires;
        selected.forEach(selectQuestionnaire => {
            questionnaires.forEach(questionnaire => {
                if(selectQuestionnaire == questionnaire.QuestionnaireText){
                    chosen.push(questionnaire)
                }
            })
        });
        this.setState({
            questionnairesChosen: Array.from(new Set(chosen))
        });
    }

    componentDidMount() {
        let initialQuestions = [];
        let initQuestionsID = [];
        let initQuestionsText = [];

        fetch('  https://rps.ise.bgu.ac.il/njsw18users/getVerifications')
            .then(response => {
                return response.json();
            }).then(results => {

            initialQuestions = results.data;

            for(var i = 0; i < initialQuestions.length; i++) {
                var obj = initialQuestions[i];
                initQuestionsID.push(obj.QuestionID);
                initQuestionsText.push(obj.QuestionText);

            }

            this.setState({
                questionsID: initQuestionsID,
                questionsText: initQuestionsText,
                questions: initialQuestions,
            });
        });
        // if(this.state.type === "patient"){
        let initQuestionnairesID = [];
        let initQuestionnairesText = [];
        let initQuestionnaires = [];
        fetch('  https://rps.ise.bgu.ac.il/njsw18questionnaires/all')
            .then(response => {
                return response.json();
            }).then(results => {

            initQuestionnaires = results.data;

            for(var i = 0; i < initQuestionnaires.length; i++) {
                var obj = initQuestionnaires[i];
                if(obj.QuestionnaireID !== 0 && obj.QuestionnaireID !==6 && obj.QuestionnaireID !== 5) {
                    initQuestionnairesID.push(obj.QuestionnaireID);
                    initQuestionnairesText.push(obj.QuestionnaireText);
                }
            }
            this.setState({
                questionnaires: initQuestionnaires,
                questionnairesID: initQuestionnairesID,
                questionnairesText: initQuestionnairesText
            });
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        var bDay = new Date(this.state.bday);
        var now = new Date();
        // var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        // if(!regex.test(this.state.password)){
        //     window.alert('???????????? ?????????? ?????????? ?????????? 8 ??????????,?????? ???????????? ????????, ?????? ???????????? ?????????? ??????????')
        //     return
        // }
        if(this.state.type === 'doctor') {
            axios.post('  https://rps.ise.bgu.ac.il/njsw18users/doctorRegister', {
                UserID: this.state.userName,
                Password: this.state.password,
                First_Name: this.state.fName,
                Last_Name: this.state.lName,
                Phone_Number: this.state.phone,
                BirthDate: bDay.getTime(),
                Code: this.state.code,
                VerificationQuestion: this.state.quesionChosen,
                VerificationAnswer: this.state.answerUserQuestion,
                ValidTime: now.getTime()
            }).then(res => {
                if (res.data.message === "Wrong Code") {
                    window.alert("?????? ???????????? ???????? ????????");
                } else if (res.data.message === "Taken Email") {
                    window.alert("?????????? ?????????? ?????? ?????????? ????????????");
                } else {
                    window.alert("???????????? ?????????? ???????????? ???? ???????? ??????????????");
                    window.location.reload(false);
                }
            })
        }
        if(this.state.type === 'patient') {
            var dateOfSurgery = new Date(this.state.dateOfSurgery);
            let gender;
            if (this.state.gender == 1) {
                gender = "????????"
            } else if (this.state.gender == 2) {
                gender = "??????"
            }
            let smoke;
            if (this.state.smoke == 1) {
                smoke = "????????"
            } else if (this.state.smoke == 2) {
                smoke = "???? ????????"
            }
            let sType;
            if (this.state.surgeryType ==1) {
                sType = "?????????? ????????"
            }else if (this.state.surgeryType == 2)
            {
                sType = "?????????? ????????????"

            }else if (this.state.surgeryType == 3) {
                sType = "?????? ??????????"
            }
            let education;
            let educationOptions = {1 :"?????????? ??????????????", 2: "?????????? ??????????????", 3:"10-12 ???????? ??????????", 4: "6-9 ???????? ??????????", 5: "5 ???????? ?????????? ???? ????????", 6:"???? ?????????????? ??????????"};
            for (var key in educationOptions) {
                if(key == this.state.education){
                    education = educationOptions[key]
                }
            }
            let height_double = Number(this.state.height / 100);
            let bmi = String((Number(this.state.weight)/Math.pow(height_double,2)));
            axios.post('  https://rps.ise.bgu.ac.il/njsw18users/patientRegister', {
                UserID: this.state.userName,
                Password: this.state.password,
                First_Name: this.state.fName,
                Last_Name: this.state.lName,
                Phone_Number: this.state.phone,
                Gender:gender,
                Smoke: smoke,
                DateOfSurgery: dateOfSurgery.getTime(),
                SurgeryType: sType,
                Education: education,
                Height: this.state.height,
                Weight: this.state.weight,
                BMI: bmi,
                BirthDate: bDay.getTime(),
                Code: this.state.code,
                Questionnaires: this.state.questionnairesChosen,
                VerificationQuestion: this.state.quesionChosen,
                VerificationAnswer: this.state.answerUserQuestion,
                ValidTime: now.getTime()
            }).then(res => {
                if (res.data.message === "Wrong Code") {
                    window.alert("?????? ???????????? ???????? ????????");
                } else if (res.data.message === "Taken Email") {
                    window.alert("?????????? ?????????? ?????? ?????????? ????????????");
                } else {
                    window.alert("???????????? ?????????? ???????????? ???? ???????? ??????????????");
                    window.location.reload(false);
                }
            })
        }
    }

    handleReset(event) {
        this.setState (initialState);
        let initialQuestions = [];
        let initQuestionsID = [];
        let initQuestionsText = [];
        fetch('  https://rps.ise.bgu.ac.il/njsw18users/getVerifications')
            .then(response => {
                return response.json();
            }).then(results => {

            initialQuestions = results.data;
            console.log(initialQuestions);

            for(var i = 0; i < initialQuestions.length; i++) {
                var obj = initialQuestions[i];

                initQuestionsID.push(obj.QuestionID);
                initQuestionsText.push(obj.QuestionText);
            }

            this.setState({
                questionsID: initQuestionsID,
                questionsText: initQuestionsText,
                questions: initialQuestions
            });
        });

        let initQuestionnairesID = [];
        let initQuestionnairesText = [];
        let initQuestionnaires = [];
        fetch('  https://rps.ise.bgu.ac.il/njsw18questionnaires/all')
            .then(response => {
                return response.json();
            }).then(results => {

            initQuestionnaires = results.data;

            for(var i = 0; i < initQuestionnaires.length; i++) {
                var obj = initQuestionnaires[i];

                initQuestionnairesID.push(obj.QuestionnaireID);
                initQuestionnairesText.push(obj.QuestionnaireText);
            }
            this.setState({
                questionnaires: initQuestionnaires,
                questionnairesID: initQuestionnairesID,
                questionnairesText: initQuestionnairesText
            });
        });

    }

    isDoctor(){
        this.setState({type: 'doctor'})
    }
    isPatient(){
        this.setState({type: 'patient'})
    }
    render() {
        require("./AddUser.css");
        let quesions = this.state.questionsText;
        let optionItems = quesions.map((question) =>
            <option key={question} >{question}</option>
        );
        let questionnaires = this.state.questionnairesText;
        if (questionnaires.length === 0){
            this.componentDidMount();
            questionnaires = this.state.questionnairesText;
        }
        // let questionnairesOption = questionnaires.map((questionnaire) =>
        //     <option key={questionnaire} >{questionnaire}</option>
        // );
        let questionnairesOption =[];
        questionnaires.forEach(questionnaire => {
            questionnairesOption.push(questionnaire)
            // questionnairesOption.push({value: questionnaire, label: questionnaire})
        });
        // let questionnairesOption = questionnaires.map((questionnaire) => {value: {questionnaire}, label: {questionnaire}});
        let genderOptions = [<option></option>,<option>????????</option>,<option>??????</option>];
        let surgeryOptions = [<option/>,<option>?????????? ????????</option>,<option>?????????? ????????????</option>,<option>?????? ??????????</option>];
        let smokeOptions = [<option/>,<option>????????</option>,<option>???? ????????</option>];
        let educationOptions = [<option/>,<option>?????????? ??????????????</option>,<option>?????????? ??????????????</option>,<option>10-12 ???????? ??????????</option>,<option>6-9 ???????? ??????????</option>,<option>5 ???????? ?????????? ???? ????????</option>,<option>???? ?????????????? ??????????</option>];
        var today = (new Date()).toISOString().split("T")[0];
        return (
            <div>
                <label className="buttonsChoose">
                    <Button style={{width: 150, floatButtom:'auto'}} className="docbutton" variant="info" onClick={() => this.isDoctor()}> ???????????? </Button>
                    {'                                                                '}
                    <Button style={{width: 150}} className="docbutton" variant="info" onClick={() => this.isPatient()}> ?????????? </Button>
                </label>
                {this.state.type === 'doctor' ?
                    <form onSubmit={this.handleSubmit} onReset={this.handleReset} id="new_user_form">
                        <div className="divs_in_add">
                            <label for= "email" className="labels_in_add_user">?????????? ??????"??</label>
                            <input className="inputs_in_add_user" name="userName" type="email"
                                   value={this.state.userName} onChange={e => this.handleChange(e)} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???? ????????</label>
                            <input className="inputs_in_add_user" name="fName" type="text" value={this.state.fName}
                                   minLength="2" maxLength="20" onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???? ?????????? </label>
                            <input className="inputs_in_add_user" name="lName" type="text" value={this.state.lName}
                                   minLength="2" maxLength="20" onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????????? </label>
                            <input className="inputs_in_add_user" name="password" type="password" minlength="8"
                                   maxLength="12" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$" value={this.state.password} onChange={this.handleChange} message={"???????????? ?????????? ?????????? ?????????? 8 ??????????, ?????????? ???? ?????? ???????? ???????????? ????????, ???? ?????? ???????? ???????????? ?????? ???????????? ?????????? ?????? ?????? ??????????."} required/>
                            <Tooltip title="???????????? ?????????? ?????????? ?????????? 8 ??????????,?????? ???????????? ????????, ?????? ???????????? ?????????? ??????????">
                                <IconButton >
                                    <FcInfo></FcInfo>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???????? ??????????</label>
                            <input className="inputs_in_add_user" name="phone" type="tel" id="phone" pattern="[0-9]{10}"
                                   value={this.state.phone} onChange={this.handleChange} required/>
                            <Tooltip title="???????? ?????????? ?????????? ???????????? ????????">
                                <IconButton >
                                    <FcInfo></FcInfo>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????????? ????????</label>
                            <input className="inputs_in_add_user" name="bday" type="date" max={today}
                                   value={this.state.bday} onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????? ?????????? </label>
                            <input className="inputs_in_add_user" name="code" type="text" value={this.state.code}
                                   onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???????? ?????????? </label>
                            <select className="select_in_add_user" onChange={this.onSelectQuesionChosen}>
                                {optionItems}
                            </select>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????????? </label>
                            <input className="inputs_in_add_user" name="answerUserQuestion" type="text"
                                   value={this.state.answerUserQuestion} onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <input type="submit" value="??????????" className="submit_and_reset_buttons"/>
                        </div>
                        <br/>
                        <br/>
                    </form>
                    : null}
                {this.state.type === 'patient' ?
                    <form onSubmit={this.handleSubmit} onReset={this.handleReset} id="new_user_form">
                        <div className="divs_in_add">
                            <label for="email" className="labels_in_add_user">?????????? ??????"??</label>
                            <input className="inputs_in_add_user" name="userName" type="email"
                                   value={this.state.userName} onChange={e => this.handleChange(e)} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???? ????????</label>
                            <input className="inputs_in_add_user" name="fName" type="text" value={this.state.fName}  minLength="2" maxLength="20"
                                   onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???? ?????????? </label>
                            <input className="inputs_in_add_user" name="lName" type="text" value={this.state.lName}  minLength="2" maxLength="20"
                                   onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????????? </label>
                            <input className="inputs_in_add_user" name="password" type="password" minlength="8"
                                   maxLength="12" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
                                   value={this.state.password} onChange={this.handleChange} required/>
                            <Tooltip title="???????????? ?????????? ?????????? ?????????? 8 ??????????,?????? ???????????? ????????, ?????? ???????????? ?????????? ??????????">
                                <IconButton >
                                    <FcInfo></FcInfo>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???????? ??????????</label>
                            <input className="inputs_in_add_user" name="phone" type="tel" id="phone" pattern="[0-9]{10}"
                                   value={this.state.phone} onChange={this.handleChange} required/>
                            <Tooltip title="???????? ?????????? ?????????? ???????????? ????????">
                                <IconButton >
                                    <FcInfo></FcInfo>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????????? ????????</label>
                            <input className="inputs_in_add_user" name="bday" type="date" max={today}
                                   value={this.state.bday} onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???????? (??"??) </label>
                            <input className="inputs_in_add_user" name="weight" type="number" value={this.state.weight}
                                   onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???????? (??"??) </label>
                            <input className="inputs_in_add_user" name="height" type="number" minLength="3" value={this.state.height}
                                   onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????? </label>
                            <select className="select_in_add_user" onChange={this.onSelectGender}>
                                {genderOptions}
                            </select>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???????? </label>
                            <select className="select_in_add_user" onChange={this.onSelectSmoke}>
                                {smokeOptions}
                            </select>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????????? </label>
                            <select className="select_in_add_user" onChange={this.onSelectEducation}>
                                {educationOptions}
                            </select>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????? ?????????? </label>
                            <select className="select_in_add_user" onChange={this.onSelectSurgeryType}>
                                {surgeryOptions}
                            </select>
                        </div>{this.state.surgeryDateDisplay &&
                    <div className="divs_in_add">
                        <label className="labels_in_add_user">?????????? ??????????</label>
                        <input className="inputs_in_add_user" name="dateOfSurgery" type="date"
                               value={this.state.DateOfSurgery} onChange={this.handleChange} required/>
                    </div>}
                        <div className="divs_in_add_drop">
                            <label className="labels_in_add_user">?????????????? ?????????????? </label>
                            <DropdownMultiselect options={questionnairesOption} handleOnChange={(selected) => {
                                this.onSelectQuestionnairesChosen(selected)
                            }} name="questionnaires" placeholder="???? ???????? ??????????"  style={{borderColor: 'black', width:80}}/>
                        </div>
                        <div className="divs_in_add">
                            <br/>
                            <br/>
                            <br/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????? ?????????? </label>
                            <input className="inputs_in_add_user" name="code" type="text" value={this.state.code}
                                   onChange={this.handleChange} required/>
                            <Tooltip title="?????? ???????????? ???????????? ???????? ???????????? ??????????">
                                <IconButton >
                                    <FcInfo></FcInfo>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">???????? ?????????? </label>
                            <select className="select_in_add_user" onChange={this.onSelectQuesionChosen}>
                                {optionItems}
                            </select>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">?????????? </label>
                            <input className="inputs_in_add_user" name="answerUserQuestion" type="text"
                                   value={this.state.answerUserQuestion} onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <input type="submit" value="??????????" className="submit_and_reset_buttons"/>
                        </div>
                        <br/>
                        <br/>
                    </form>
                    : null}
            </div>
        );
    }
}

export default AddUserAfterResearch;