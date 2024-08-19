import React, { useEffect, useState, useRef, useCallback } from 'react';
import $ from 'jquery';
import 'jstree';
import axios from 'axios';
import ModalComponent from './ModalComponent';
import 'jstree/dist/themes/default/style.min.css';
import styles from '../css/OrgChartComponent.module.css';

const OrgChartComponent = (props) => {
    const [jsonData, setJsonData] = useState([]);
    const [choiceArr, setChoiceArr] = useState([]);
    const [show, setShow] = useState(false);
    const treeRef = useRef(null);

    const serverUrl = "http://localhost:8787/api/";

    useEffect(() => {
        const jsTreeData = async () => {
            try {
                const jsonData = await axios.get("http://localhost:8787/api/jsTree");
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
        setChoiceArr((prevChoices) => prevChoices.filter((_, i) => i !== index));
    };

    const sendDataToServer = useCallback(async () => {
        if (choiceArr.length > 0) {
            try {
                const res = await axios.post(`${serverUrl}${props.mappingUrl}`, choiceArr, {
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log("server ok: ", res.data);
                setChoiceArr([]);
                closeModal();
            } catch (error) {
                console.log("error", error.message);
            }
        } else {
            console.log("빈 요소");
            alert("최소 한 명 이상 선택해 주세요");
        }
    }, [choiceArr]);

    const openModal = () => {
        setShow(true);
    };

    const closeModal = () => {
        setShow(false);
    };

    return (
        <div>
            <button onClick={openModal}>{props.buttonName}</button>
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

export default OrgChartComponent;
