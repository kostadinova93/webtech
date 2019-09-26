import React, { Component } from 'react'
import Cookies from './Helper/Cookies'
import ValidateForm from './Helper/ValidateForm'

class Userlogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };

        // This binding is necessary to make `this` work in the callback
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);

        this.registerError = "";
        this.loginError = "";

    }




    register() {
        var formUrlCollect = ValidateForm.collectAndValidate("url", "register");
        if (formUrlCollect.valid == false) {
            alert("Error in form: \n" + JSON.stringify(formUrlCollect.result));
            return;
        }

        var url = 'https://api.merik.now.sh/api/adduser?' +formUrlCollect.result;
        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    response.text().then(x => {
                        if (x == "success") {
                            Cookies.setCookie("username", formUrlCollect.fields["name"], 99999);
                            Cookies.setCookie("password",  formUrlCollect.fields["password"], 99999);
                            this.props.changeSiteview("start");

                        } else {
                            this.registerError = x;
                            Cookies.setCookie()
                            this.forceUpdate()
                        }
                    });
                }
            });

    }


    login() {
        var formUrlCollect = ValidateForm.collectAndValidate("url", "login");
        if (formUrlCollect.valid == false) {
            alert("Error in form: \n" + JSON.stringify(formUrlCollect.result));
            return;
        }

        var url = 'https://api.merik.now.sh/api/login?' +formUrlCollect.result;

        fetch(url, {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {

                    response.text().then(x => {
                        if (x == "success") {
                            Cookies.setCookie("username", formUrlCollect.fields["username"], 99999);
                            Cookies.setCookie("password", formUrlCollect.fields["userpassword"], 99999);
                            this.props.changeSiteview("start");
                        } else {
                            this.loginError = x;
                            this.forceUpdate()
                        }
                    });
                }
            });

    }

    componentDidMount() {
        if(Cookies.isLoggedIn()) {
            this.props.changeSiteview("start");

        }
    }

    render() {

        return (
            <div className="centerbox">
                <div className="center">
                    Benutzerkonten sind nur für Administratoren um Inhalte hinzuzufügen und zu ändern.
                    </div>
                <br />
                <h2 className="center"> Register:

                </h2>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Name:
                    </td>
                            <td>
                                <input className="formField" fieldType="any" allowEmpty="false" minLength="3" placeholder="" id="register_name" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Passwort (Unsicher ;) ):
                    </td>
                            <td>
                                <input className="formField" fieldType="any" allowEmpty="false" minLength="3" placeholder="" id="register_password" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Mail:
                    </td>
                            <td>
                                <input className="formField" fieldType="mail" allowEmpty="false" placeholder="" id="register_mail" />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Invite code:
                    </td>
                            <td>
                                <input className="formField" fieldType="any" allowEmpty="false" id="register_invitecode" />
                            </td>
                        </tr>


                        <tr>
                            <td></td>
                            <td>
                                <button onClick={this.register}>
                                    Register!
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="center">
                    {this.registerError}
                </div>

                <br />
                <br />
                <h2 className="center"> Login: </h2>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Name:
                    </td>
                            <td>
                                <input className="formField" fieldType="any" allowEmpty="false" minLength="3" placeholder="" id="login_username" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Passwort (Unsicher ;) ):
                    </td>
                            <td>
                                <input className="formField" fieldType="any" allowEmpty="false" minLength="3" placeholder="" id="login_userpassword" />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button onClick={this.login}>
                                    Login!
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="center">
                    {this.loginError}
                </div>
            </div>
        );
    }
}


export default Userlogin;