import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./signUp.css";
import Alert from "react-bootstrap/Alert";

// letterValidationRegex - only letters
const letterValidationRegex = /^[a-zA-ZĄČĘĖĮŠŲŪąčęėįšųū]+$/;

//emailValidationRegex - example@example.lt - two letters after .
const emailRegex = /[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

//passValidationRegex - at least 8 characters, one capital, one regular letter and numebr
const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      repeatPassword: "",
      formErrors: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        repeatPassword: ""
      },
      errorMessage: ""
    };
  }

  handleChange = e => {
    e.preventDefault();
    let { name, value } = e.target;

    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "firstname":
        formErrors.firstname = letterValidationRegex.test(value)
          ? ""
          : "The first name can only consist of letters";
        break;
      case "lastname":
        formErrors.lastname = letterValidationRegex.test(value)
          ? ""
          : "The last name can only consist of letters";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "email email format is not appropriate (pavyzdys@paštas.lt)";
        break;
      case "password":
        formErrors.password = passwordRegex.test(value)
          ? ""
          : "Password does not meet the requirements (at least 8 characters, including at least one uppercase letter, one lowercase letter and a number)";
        break;
      case "repeatPassword":
        formErrors.repeatPassword =
          value === this.state.password ? "" : "Passwords do not match";
        break;
      default:
        break;
    }

    this.setState({
      formErrors,
      [name]: value
    });
  };

  handleSubmitSignUp = event => {
    event.preventDefault();
    this.emptyfields();
    this.validateForm();
    this.fetchUserToDb();
  };

  validateForm() {
    const { firstname, lastname, email, password, repeatPassword } = this.state;
    return (
      this.lettersValidate(firstname) &&
      this.lettersValidate(lastname) &&
      this.emailValidate(email) &&
      this.passwordValidate(password) &&
      this.passwordValidate(repeatPassword) &&
      this.passwordsMatch(password, repeatPassword)
    );
  }

  // or maybe String.matches() i dont remember now.
  passwordsMatch(passOne, passTwo) {
    return passOne === passTwo;
  }

  lettersValidate(name) {
    return letterValidationRegex.test(name) && name !== "";
  }

  emailValidate(email) {
    return emailRegex.test(email) && email !== "";
  }

  passwordValidate(password) {
    return passwordRegex.test(password) && password !== "";
  }

  emptyfields() {
    const { firstname, lastname, email, password, repeatPassword } = this.state;

    return (
      firstname !== "" &&
      lastname !== "" &&
      email !== "" &&
      password !== "" &&
      repeatPassword !== ""
    );
  }

  fetchUserToDb = async () => {
    try {
      const userData = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.lastname + " " + this.state.firstname,
          username: this.state.email,
          email: this.state.email,
          password: this.state.repeatPassword
        })
      });
      const data = await userData.json();
      const res = await userData.status;

      console.log(data);
      if (res >= 201 && res < 300) {
        this.props.history.push("/login");
      } else {
        this.setState({
          errorMessage: "User with such e-mail mail address already exists"
        });
        console.log(userData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let {
      firstname,
      lastname,
      email,
      password,
      repeatPassword,
      formErrors
    } = this.state;
    return (
      <div className="containerSignUp">
        <form className="signUpForm" onSubmit={this.handleSubmitSignUp}>
          <h1>Create an account</h1>
          {this.state.errorMessage.length > 0 && (
            <Alert variant="danger">{this.state.errorMessage}</Alert>
          )}
          <div>
            <label htmlFor="firstName">Name</label>
            <input
              type="text"
              className="firstname"
              placeholder="FirstName"
              name="firstname"
              pattern="^[a-zA-ZĄČĘĖĮŠŲŪąčęėįšųū]+$"
              title="Your name can only consist of letters"
              value={firstname}
              onChange={this.handleChange}
              maxLength="30"
              minLength="2"
              required
            />
            {formErrors.firstname.length > 0 && (
              <span className="errorMessage">{formErrors.firstname}</span>
            )}
          </div>
          <div>
            <label htmlFor="lastName">Surname</label>
            <input
              type="text"
              className="lastname"
              placeholder="Lastname"
              name="lastname"
              pattern="^[A-Za-zĄČĘĖĮŠŲŪąčęėįšųū]+$"
              title="Your last name can only consist of letters"
              maxLength="30"
              minLength="2"
              value={lastname}
              onChange={this.handleChange}
              required
            />
            {formErrors.lastname.length > 0 && (
              <span className="errorMessage">{formErrors.lastname}</span>
            )}
          </div>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              className="email"
              placeholder="email"
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="The e-mail format is example@paštas.lt"
              maxLength="40"
              minLength="4"
              value={email}
              onChange={this.handleChange}
              required
            />
            {formErrors.email.length > 0 && (
              <span className="errorMessage">{formErrors.email}</span>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="password"
              placeholder="password"
              name="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              maxLength="30"
              minLength="8"
              title="The password must consist of at least 8 characters, including at least one uppercase letter, one lowercase letter and a number"
              value={password}
              onChange={this.handleChange}
              required
            />
            {formErrors.password.length > 0 && (
              <span className="errorMessage">{formErrors.password}</span>
            )}
          </div>
          <div>
            <label htmlFor="password">Repeat the password</label>
            <input
              type="password"
              className="repeatPassword"
              placeholder="repeat password"
              name="repeatPassword"
              maxLength="30"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="repeat the password"
              value={repeatPassword}
              onChange={this.handleChange}
              required
            />
            {formErrors.repeatPassword.length > 0 && (
              <span className="errorMessage">{formErrors.repeatPassword}</span>
            )}
          </div>
          <button type="submit" className="registrationButton">
            Register
          </button>
          <Link to="/login">
            <small>Already a member? Log in</small>
          </Link>
        </form>
      </div>
    );
  }
}

export default withRouter(SignUp);
