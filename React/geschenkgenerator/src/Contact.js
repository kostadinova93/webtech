import React, { Component } from 'react'
import ValidateForm from './Helper/ValidateForm'

class Contact extends React.Component {
  constructor(props) {
    super(props);
  }

  sendMessage() {
    var formUrlCollect = ValidateForm.collectAndValidate("url");
    if (formUrlCollect.valid == false) {
      alert("Error in form: \n" + JSON.stringify(formUrlCollect.result));
      return;
    }

    var url = 'https://api.merik.now.sh/api/contact?=' + formUrlCollect.result;

    fetch(url, {
      method: 'GET',
    })
      .then(response => {
        alert("Gesendet!");
        window.location.reload(false);
      });
  }

  render() {
    return (
      <div className="centerbox center">
        <h2>Impressum</h2>
        Ich, Meri, besitze diese Webseite. :)
        <br />
        <br />
        <h2>
          Kontakt
        </h2>
        <table>
          <tbody>

            <tr>
              <td>
                Deine Mail:
                    </td>
              <td>
                <input className="formField" fieldType="mail" allowEmpty="false" placeholder="" id="mail" />
              </td>
            </tr>
            <tr>
              <td>
                Deine Nachricht:
                    </td>
              <td>
                <textarea rows="5" className="formField" minLength="20" fieldType="text" allowEmpty="false" placeholder="" id="message" />
              </td>
            </tr>

          </tbody>
        </table>

        <div className="center">
          <button onClick={this.sendMessage}>
            Senden!
            </button>
        </div>
      </div>
    );
  }
}


export default Contact;