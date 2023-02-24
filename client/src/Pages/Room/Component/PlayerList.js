import React, { useState, useEffect } from 'react';

/**
 * 
https://github.com/SortableJS/Sortable#options
https://github.com/SortableJS/react-sortablejs

 */
// import { ReactSortable } from "react-sortablejs";


const PlayerList = ({room, onSortable}) => {

    const [list, setList] = useState([]);

    useEffect(() => {

        if(Object.keys(room).length !== 0){
            let newList = [];
            
            Object.entries(room.playerList).map((player, index) => {
                let newListItem = {};
                newListItem["id"] = index;
                newListItem["name"] = player[1].playerName;
                newListItem["ready"] = player[1].ready;
                newList.push(newListItem);
            })

            setList(newList);
        }
    }, [room]);

    return(

        <section id="player_list_wrapper" className="nes-container with-title list-group">
            <h3 className="title">PLAYER LIST</h3>
            {/* <ReactSortable 
                id="player_list" 
                list={list} 
                setList={setList}
                onStart={onSortable}
            > */}
            <div id="player_list" >
                {

                    list.map((player) => (
                        <div key={player.id} className={`nes-container nes-input ${player.ready ? "is-success" : ""}`}>
                            <p>{player.name}</p>
                        </div>

                    ))
                }
            </div>
        </section>

    )

}

export default PlayerList;