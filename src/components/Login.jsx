/*Компонент Login предназначен для авторизации пользователей. Для авторизации используется технология Firebase. 
Функция handleLogin авторизации.Метод signInWithEmailAndPassword из firebase осуществляющая авторизацию в приложении При правильном логине и пароле, производится get запрос на получение задач пользователя из bitrix24. 
Данные пользователя (логин, токен авторизации, id и данные полученные из bitrix24 с помощью dispatch записываюся в store, auth хранит состояние (пользователь авторизован или нет).
Авторизация прошла успешна, происходит переход на страницу с задачами. При некорректных заполнениях полей возникают ошибки и переход на страницу с задачами не происходит.*/
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Form from "./Form";
import { setUser } from "store/slices/userSlice";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorDescription, setErrorDescription] = useState(""); // состояние для хранения текста ошибки
  const [spinner, setSpinner] = useState(null); // состояние для работы спинера(вкл/выкл)

  const handleLogin = (email, password) => {
    const auth = getAuth();
   
        signInWithEmailAndPassword(auth, email, password)
          .then(({ user }) => {
            dispatch(
              setUser({
                email: user.email,
                id: user.uid,
                token: user.accessToken,
              })
            );
            navigate("/tasks");
          })
          // блок для отработки различных ошибок при авторизации
          .catch((error) => {
            if (error.message == "Firebase: Error (auth/user-not-found).") {
              setErrorDescription(
                "The user was not found. Check that your username and correct!"
              );
              setSpinner(!spinner);
            }
            if (error.message == "Firebase: Error (auth/internal-error).") {
              setErrorDescription("Fill in the password field!");
              setSpinner(!spinner);
            }
            if (error.message == "Firebase: Error (auth/invalid-email).") {
              setErrorDescription("Invalid email value!");
              setSpinner(!spinner);
            }
            if (error.message == "Firebase: Error (auth/wrong-password).") {
              setErrorDescription("Wrong password!");
              setSpinner(!spinner);
            }
          });
  };

  return (
    <Form
      header="Log In"
      title="sign in"
      text="Don't have an account?"
      path="/register"
      action="Register"
      error={errorDescription}
      spinner={spinner}
      handleClick={handleLogin}
    />
  );
};

export { Login };
