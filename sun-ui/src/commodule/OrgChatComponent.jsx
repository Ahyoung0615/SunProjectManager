import React, { useEffect, useState, useRef, useCallback } from 'react';
import $ from 'jquery';
import 'jstree';
import axios from 'axios';
import ModalComponent from './ModalComponent';
import 'jstree/dist/themes/default/style.min.css';
import styles from '../css/OrgChartComponent.module.css';

const OrgChatComponent = (props) => {
    const [jsonData, setJsonData] = useState([]);
    const [choiceArr, setChoiceArr] = useState([]);  // 선택된 노드 텍스트
    const [serverDataArr, setServerDataArr] = useState([]);  // 선택된 노드 ID
    const [show, setShow] = useState(false);
    const treeRef = useRef(null);

    const serverUrl = "http://localhost:8787/api/";

    useEffect(() => {
        const jsTreeData = async () => {
            try {
                const jsonData = await axios.get(`${serverUrl}jsTree`);
                setJsonData(jsonData.data);
                console.log("json data: ", jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        jsTreeData();
    }, []);

    useEffect(() => {
        if (show && treeRef.current && jsonData.length > 0) {
            $(treeRef.current).jstree({
                plugins: ["search", "themes", "types", "dnd"],
                core: {
                    data: jsonData,
                    themes: { dots: false },
                    check_callback: true
                }
            });

            $(treeRef.current).on("select_node.jstree", function (e, data) {
                console.log("tree text: ", data.node.original.text);
                if (data.node.original.parent !== "#") {
                    const selectedText = data.node.original.text;
                    const selectedId = data.node.original.id;
                    setChoiceArr((prevChoices) => {
                        if (props.maxSelection && prevChoices.length >= props.maxSelection) {
                            alert(`최대 ${props.maxSelection}명까지 선택할 수 있습니다.`);
                            return prevChoices;
                        }
                        if (!prevChoices.includes(selectedText)) {
                            return [...prevChoices, selectedText];
                        }
                        return prevChoices;
                    });
                    setServerDataArr((prevServerData) => {
                        if (props.maxSelection && prevServerData.length >= props.maxSelection) {
                            return prevServerData;
                        }
                        if (!prevServerData.includes(selectedId)) {
                            return [...prevServerData, selectedId];
                        }
                        return prevServerData;
                    });
                }
            });

            return () => {
                $(treeRef.current).jstree("destroy").off("select_node.jstree");
            };
        }
    }, [jsonData, show, props.maxSelection]);

    const handleSearch = () => {
        const searchValue = $("#schName").val();
        console.log(searchValue);
        $(treeRef.current).jstree(true).search(searchValue);
    };

    const deleteChoice = (index) => {
        const deletedItem = choiceArr[index];
        setChoiceArr((prevChoices) => prevChoices.filter((_, i) => i !== index));
        setServerDataArr((prevServerData) => {
            const deletedId = jsonData.find(node => node.text === deletedItem)?.id;
            return prevServerData.filter(id => id !== deletedId);
        });
    };

    const sendDataToServer = useCallback(async () => {
        // sessionStorage에서 저장된 ID를 가져오기
        const sessionData = window.sessionStorage.getItem('user');
        let sessionId = null;
        if (sessionData) {
            const parsedSessionData = JSON.parse(sessionData);
            sessionId = parsedSessionData.empcode; // 필요한 ID 필드
        }
        
        // sessionId가 존재하고, serverDataArr에 포함되어 있지 않으면 추가
        const finalDataArr = sessionId && !serverDataArr.includes(sessionId) 
        ? [...serverDataArr, sessionId] 
        : serverDataArr;
        console.log(finalDataArr);
        
        if (finalDataArr.length > 1) {
            try {
                const res = await axios.post(`${serverUrl}${props.mappingUrl}`, finalDataArr, {
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log("server ok: ", res.data);
                setChoiceArr([]);
                setServerDataArr([]);
                closeModal();
                if (props.onChatRoomCreated) {
                    props.onChatRoomCreated(); // 채팅방 생성 후 콜백 호출
                }
            } catch (error) {
                alert('채팅방이 이미 존재합니다.');
            }
        } else {
            console.log("빈 요소");
            alert("최소 한 명 이상 선택해 주세요");
        }
    }, [serverDataArr, props.mappingUrl, props.onChatRoomCreated]);

    const openModal = () => {
        setShow(true);
    };

    const closeModal = () => {
        setShow(false);
    };

    return (
        <div>
            <button  className="btn btn-info" style={{ margin: '3px'}} onClick={openModal}>{props.buttonName}</button>
            <ModalComponent
                open={show}
                close={closeModal}
                title="조직도"
                body={
                    <>
                        <input type="text" id="schName" placeholder="검색" />
                        <button onClick={handleSearch}>검색</button>
                        <div className={styles.treeBox}>
                            <div className={styles['tree-container']} ref={treeRef}></div>
                            <div className={styles.child}>
                                <ul className={styles.selectedItems}>
                                    {choiceArr.map((choice, index) => (
                                        <li key={index}>
                                            {choice}
                                            <button onClick={() => deleteChoice(index)}>x</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={styles.confirmButtonContainer}>
                            <button className={styles.confirmButton} onClick={sendDataToServer}>확인</button>
                        </div>
                    </>
                }
            />
        </div>
    );
};

export default OrgChatComponent;
