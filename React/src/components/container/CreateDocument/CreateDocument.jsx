import React, { Component } from "react";
import "./createDocument.css";
import Picky from "react-picky";
import "react-picky/dist/picky.css";
import RichTextEditor from "../../richTextEditor/RichTextEditor";
import { hasRole } from "../../Auth";

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // docTypes: [
      //   {
      //     id: "1",
      //     docName: "Prašymas dėl kasmetinių atostogų"
      //   },
      //   {
      //     id: "2",
      //     docName: "Prašymas dėl komandiruotės"
      //   },
      //   {
      //     id: "3",
      //     docName: "Prašymas dėl vaiko priežiūros atostogų"
      //   },
      //   {
      //     id: "4",
      //     docName: "Prašymas dėl darbo laiko nustatymo"
      //   },
      //   {
      //     id: "5",
      //     docName: "Prašymas dėl atleidimo iš pareigų"
      //   },
      //   {
      //     id: "6",
      //     docName: "Prašymas laisva forma"
      //   }
      // ],
      docTypes: [],
      docSelected: "",
      displayEditor: false,
      errorMessage: "",
      canCreateDoc: false,
      displayEmptyEditor: false
    };
  }

  getDocument = async () => {
    const token = localStorage.getItem("token");
    console.log(token)
    const getDoc = await fetch(
      "http://localhost:8080/api/templates/all",
      {
        method: "GET",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "authorization": "Bearer " + token
        }
      }
    );
    const data = await getDoc.json();
    console.log(data)
    this.setState({
      docTypes: data
    })
    console.log(data)
  };

  selectOption = value => {
    this.setState({ docSelected: value });
    localStorage.setItem('doc', value.text)
  };

  settingUserRole = () => {
    const userRole = localStorage.getItem('role')
    if (userRole === "ROLE_ADMIN") {
      this.setState({
        canCreateDoc: true
      })
    } else if (userRole === "ROLE_USER") {
      this.setState({
        canCreateDoc: false
      })
    }
  }

  componentDidMount = () => {
    this.settingUserRole();
    this.getDocument();
  }

  handleDocsSubmit = e => {
    e.preventDefault();
    if (this.state.docSelected) {
      this.setState({ displayEditor: true, errorMessage: "", displayEmptyEditor: false });
    } else {
      this.setState({ errorMessage: "Select a document template" })
    }
  };

  createDocType = e => {
    this.setState({ displayEditor: false, errorMessage: "", displayEmptyEditor: true, docSelected: "" });
    localStorage.setItem('doc', "")
  }

  render() {

    return (
      <div className="containerDocumentCreation">
        <form className="documentCreationForm" onSubmit={this.handleDocsSubmit}>
          <h1>Select a document template</h1>
          <div>
            <label htmlFor="email">Select a document</label>
            <Picky
              options={this.state.docTypes}
              value={this.state.docSelected}
              onChange={this.selectOption}
              open={false}
              valueKey="id"
              labelKey="title"
              multiple={false}
              includeFilter={true}
            />
            {this.state.errorMessage.length > 0 && (
              <span className="errorMessage">{this.state.errorMessage}</span>
            )}
          </div>
          {this.state.canCreateDoc && (
            <button className="creationButton" onClick={this.createDocType}>
              Create a new document template
            </button>
          )}
          <button type="submit" className="creationButton">
            Fill out the document
          </button>
        </form>
        {this.state.displayEditor && (
          <RichTextEditor style={{ float: "right", width: "60%" }} documentType={this.state.docSelected} />
        )}
        {this.state.displayEmptyEditor && (
          <RichTextEditor style={{ float: "right", width: "60%" }} documentType={this.state.docSelected} />
        )}
      </div>
    );
  }
}

export default CreateGroup;