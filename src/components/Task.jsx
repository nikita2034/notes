/*Компонент Task предназначен для отризовки конкретной задачи с её свойствами(название,описание, дата и время создания задачи, 
автор задачи, дедлайн, ответственный за выполнение задачи. onClick передает название и описание в функцию по открытию модального окна 
для просмотра описания задачи*/
import React, { useState, useCallback ,useEffect} from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./Task.module.css";
import { BiPencil } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineCancel} from "react-icons/md";
import {FiCheck} from "react-icons/fi";



const Tasks = ({ id, title, tags, getId,getResponce }) => {
  const [valueNote, setValueNote] = useState(title);
  const [tagsNote, setTagsNote] = useState(tags);
  const [show, setShow] = useState(false);
  const [changeRequest,setChangeRequest]=useState(false);
  console.log(tags);

  function editNote(){
    setShow(!show);
  };

  function onSendingData(){
    setChangeRequest(true);
    setShow(!show);
  }

  function undoChanges(){
    setValueNote(title);
    setShow(!show);
  }

  function onChangeNote(event){
    setValueNote(event.target.value);
  };

  useEffect(()=>{
    var reg = /\s*\s\s*/;
    let nameList = valueNote.split(reg);
    nameList.map((item) => {
      if (item.includes("#")) {
       setTagsNote(tagsNote.push(`${item}  `));
      }
    });
    if(changeRequest!==false){
      setValueNote(valueNote.replace(/\s*\#\s*/, ' '));
      const article = { textNote: valueNote.replace(/\s*\#\s*/, ' '), tags: tagsNote };

      axios.put(
        `https://62960f8b810c00c1cb6e4645.mockapi.io/notes/${id}`,
        article
      ).finally(getResponce(true));
    }
    setChangeRequest(false);
  },[changeRequest])

  return (
    <li>
      <Container>
        <Row className={styles.tasks}>
          <Col className={styles.task}>
            <div className={styles.note}>
              {!show && <label>{valueNote} </label>}
              {show && (
                <input
                  className={styles.inputEdit}
                  onChange={(event) => onChangeNote(event)}
                  value={valueNote}
                />
              )}
              <label className={styles.tags}>{tags}</label>
            </div>
          </Col>
          <Col className={styles.task}>
            {!show && (
              <>
                <button onClick={() => editNote()}>
                  <BiPencil className={styles.iconEdit} />
                </button>
                <button onClick={() => getId(id)}>
                  <RiDeleteBinLine className={styles.iconDelete} />
                </button>
              </>
            )}

            {show && (
              <>   
               <button onClick={()=>onSendingData()}><FiCheck className={styles.iconCancel}/> </button>
               <button onClick={()=>undoChanges()} ><MdOutlineCancel className={styles.iconConfirmation}/></button> 
              </>
            )}
          </Col>
        </Row>
      </Container>
    </li>
  );
};

export default Tasks;
