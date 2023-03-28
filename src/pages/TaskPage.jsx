/*Компонет TaskPage предназначен для отрисовки таблицы с задачами.*/
import { useState, useEffect, useCallback } from "react";
import { removeUser } from "store/slices/userSlice"; // сброс данных пользователя, обнуление авторизации и выход из учетной записи
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useAuth } from "hooks/use-auth";
import debounce from "lodash.debounce";
import axios from "axios";
import Tasks from "../components/Task";
import styles from "./TaskPage.module.css";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { MdAddBox } from "react-icons/md";

const TaskPage = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);

  const [tagi, setTags] = useState([]);
  const [TAGS, setTAGS] = useState([]);
  const [textNote, setTextNote] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [click, setClick] = useState(false);
  const [idNote, setIdNote] = useState(false);

  let tags = [];
  let allTags = [];

  const [getResponce, setGetResponce] = useState(false);

  useEffect(() => {
    console.log("get запрос");
    axios
      .get(`https://62960f8b810c00c1cb6e4645.mockapi.io/notes`)
      .then((res) => {
        setData(res.data);
      });
  }, [getResponce]);

  useEffect(() => {
    localStorage.clear();
    setTags(
      data.map((item) => {
        return item.tags;
      })
    );
    console.log(tagi);
    let key = 0;
    tagi.forEach((item, ind) =>
      item.forEach((element, index) => {
        localStorage.setItem(key, element);
        console.log(element, key);
        key += 1;
      })
    );
    for (let i = 0; i < localStorage.length; i++) {
      console.log(localStorage.getItem(i));
      allTags.push(
        <Dropdown.Item
          onClick={() => {
            setSearchValue(localStorage.getItem(i));
          }}
        >
          {localStorage.getItem(i)}
        </Dropdown.Item>
      );
    }
    setTAGS(allTags);
    setGetResponce(false);
  }, [data]);

  useEffect(() => {
    if (textNote.lenght !== 0) {
      var re = /\s*\s\s*/;
      let nameList = textNote.split(re);
      nameList.map((item) => {
        if (item.includes("#")) {
          tags.push(item);
        }
      });
    }
    if (click !== false && textNote.length !== 0) {
      const article = {
        textNote: textNote.replace(/\s*\#\s*/, " "),
        tags: tags,
      };
      axios
        .post("https://62960f8b810c00c1cb6e4645.mockapi.io/notes", article)
        .finally(() => setGetResponce(true));
      console.log("post", click);
    }
    setClick(false);
    localStorage.clear();
    setTextNote("");
  }, [click]);

  useEffect(() => {
    if (idNote !== false) {
      console.log("удаление");
      axios
        .delete(`https://62960f8b810c00c1cb6e4645.mockapi.io/notes/${idNote}`)
        .finally(setGetResponce(true));
      localStorage.clear();
    }
    setIdNote(false);
  }, [idNote]);

  useEffect(() => {
    const search = searchValue ? `search=${searchValue.slice(1)}` : "";
    console.log(searchValue);
    axios
      .get(`https://62960f8b810c00c1cb6e4645.mockapi.io/notes?${search}`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      });
  }, [searchValue]);

  const updateSearchInput = useCallback(
    debounce((str) => {
      setSearchValue(str);
    }, 200),
    []
  );

  const onChangeInput = (str) => {
    updateSearchInput(str);
  };

  useEffect(() => {
    setItems(
      data.map((item) => {
        return (
          <Tasks
            key={item.id}
            id={item.id}
            title={item.textNote}
            tags={item.tags}
            getId={(id) => setIdNote(id)}
            getResponce={() => setGetResponce}
          />
        );
      })
    );
    console.log(data);
  }, [data]);

  const { isAuth } = useAuth();

  // isAuth хранит состояние авторизации пользователя, если isAuth=true, отрисовываются таблица задач,если isAuth=false происходит переход на страницу авторизации
  return isAuth ? (
    <div class="page-content page-container" id="page-content">
      <div class="padding">
        <Container>
          <Row className={styles.top}>
            <Col>
              <h4 className={styles.header}>Notes</h4>
            </Col>
            <Col>
              <button
                className={styles.button}
                onClick={() => dispatch(removeUser())}
              >
                Exit
              </button>
            </Col>
          </Row>
        </Container>

        <div class="row container d-flex justify-content-center">
          <div class="col-md-12">
            <div class="card px-3">
              <div class="card-body">
                <div className={styles.tasks}>
                  <Container className={styles.block}>
                    <Col>
                      <input
                        className={styles.inputAddNote}
                        placeholder="write notes"
                        value={textNote}
                        onChange={(event) => setTextNote(event.target.value)}
                      />
                    </Col>
                    <Col>
                      <button onClick={() => setClick(true)}>
                        <MdAddBox className={styles.icon} />
                      </button>
                    </Col>
                    <Col>
                      <input
                        className={styles.inputSearchNote}
                        placeholder="search notes "
                        onChange={(event) => onChangeInput(event.target.value)}
                      />
                    </Col>
                  </Container>

                  <ul class="d-flex flex-column-reverse todo-list">{items}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default TaskPage;
