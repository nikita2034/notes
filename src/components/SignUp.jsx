/*Компонент SignUp предназначен для регистации пользователей. Для регистрации используется технолония Firebase. 
Функция handleRegister регистрации, при корректных значения логина и пароля производит регистрацию. 
Метод createUserWithEmailAndPassword из firebase создает учетную запись пользователя.
При успешной регистрации производится get запрос на получение задач пользователя из bitrix24. 
С помощью dispatch данные(задачи, логин, токен авторизации и id) сохраняются в store. 
Успешная регистрация происходит при вводе электронной почты корректного формата и пароля. 
После успешной регистрации происходи переход на страницу с задачами. 
В качестве пароля необходимо использовать значение из входящего вебхука созданного в bitrix24. 
Для создания входящего вебхука необходимо перейти во вкладку приложения ->разработчикам->другое->входящий вебхук. 
В генераторе запросов выбрать метод: task.items.getlist. В настройке прав выбрать Задачи(task) и tasks. 
Из полученного url взять в значение находящееся в + https://b24-6sj73u.bitrix24.by/rest/1/++++++++++++++++/task.items.getlist.json и использовать в качетсве пароля для регистрации
При некорректном заполнении полей возникают ошибки переход на страницу с задачами не происходит*/
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Form from "./Form";
import { setUser } from "store/slices/userSlice";
import { useState } from "react";
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorDescription, setErrorDescription] = useState(""); // состояние для хранения текста ошибки
  const [spinner, setSpinner] = useState(null); // состояние для работы спинера(вкл/выкл)
  const auth = getAuth();

  const handleRegister = (email, password) => {
          createUserWithEmailAndPassword(auth, email, password)
            .then(({ user }) => {
              dispatch(
                setUser({
                  email: user.email,
                  id: user.id,
                  token: user.accessToken,
                })
              );
              navigate("/tasks");
            })
            // блок для отработки различных ошибок при регистрации
            .catch((error) => {
              if (error.message == "Firebase: Error (auth/missing-email).") {
                setErrorDescription("Fill in the email field!");
                setSpinner(!spinner);
              }
              if (
                error.message == "Firebase: Error (auth/email-already-in-use)."
              ) {
                setErrorDescription("The user already exists!");
                setSpinner(!spinner);
              }
              if (error.message == "Firebase: Error (auth/invalid-email).") {
                setErrorDescription("Invalid email!");
                setSpinner(!spinner);
              }
              if (error.message == "Firebase: Error (auth/internal-error).") {
                setErrorDescription("Fill in the password field!");
                setSpinner(!spinner);
              }
            });
    
  };
  return (
    <Form
      header="Register"
      title="register"
      text="You have an account."
      path="/"
      action="Log In "
      handleClick={handleRegister}
      error={errorDescription}
      spinner={spinner}
    />
  );
};
export default SignUp;
