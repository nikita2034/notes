/*Компонент Form выполняет отрисовку форм входа и регистрации. Link to осуществляет переход на страницу регистрации, если нет аккаунта или входа, если аккаунт есть. */
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import s from "./Form.module.css";
import todolist from "../todolist4.jpg";

import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

function Form({
  title,
  header,
  handleClick,
  path,
  text,
  action,
  error,
  spinner,
}) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showSpinner, setShowSpinner] = useState(<div>{title}</div>); //состояние хранит заголовок кнопки, если кнопка не нажата или Spinner при нажатии для отправки данных
  const [click, setClick] = useState(0);

  //Производится остановка Spinner при появлении ошибки ввода
  useEffect(() => {
    console.log(spinner);
    setShowSpinner(<div>{title}</div>);
  }, [spinner]);

  //Производится включение Spinner при отправки данных
  useEffect(() => {
    if (click !== 0) {
      setShowSpinner(
        <MDBSpinner
          color="light"
          style={{ width: "1.11rem", height: "1.11rem" }}
        />
      );
      handleClick(email, pass);
    }
  }, [click]);
  return (
    <MDBContainer className="my-5">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6 ">
            <MDBCardImage src={todolist} alt="login form" className={s.img} />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row mt-2">
                <MDBIcon
                  fas
                  icon="tasks fa-3x me-3"
                  style={{ color: "rgb(62,128,204)" }}
                />
                <span className="h1 fw-bold mb-0">Notes</span>
              </div>

              <h5
                className="fw-normal my-4 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                {header}
              </h5>

              <MDBInput
                onChange={(e) => setEmail(e.target.value)}
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
              />
              <MDBInput
                onChange={(e) => setPass(e.target.value)}
                wrapperClass="mb-4"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
              />
              <span className={s.wrong}>{error}</span>
              <MDBBtn
                onClick={() => setClick(click + 1)}
                className="mb-4 px-5"
                color="dark"
                size="lg"
              >
                {showSpinner}
              </MDBBtn>
              <a className="small text-muted" href="#!">
                Forgot password?
              </a>
              <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                {text}
                <Link to={path} style={{ color: "#393f81" }}>
                  {action}
                </Link>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Form;
