import React from "react";

const Buttons = React.forwardRef (({ tile,
    items,
    colorPicker,
    isAddDisabled,
    isRemoveDisabled,
    isActionDisabled,
    isComments,
    setIsAddDisabled,
    setIsRemoveDisabled,
    setIsActionDisabled,
    setIsComments,
    itemIds,
    addToFirestore,
    updateFirestoreDoc,
    removeFromFirestore,}, ref) => {
    
        return (
        <>
            <button id="action"
                    className={colorPicker()}
                    disabled={isActionDisabled}
                    onClick={(e) => {
                        e.preventDefault();
                        console.log('action clicked')
                        ref.current.focus();                // puts input field in focus
                        setIsActionDisabled(true);
                        setIsAddDisabled(true);
                        setIsRemoveDisabled(false);
                    }}><i className="fi fi-sr-settings"></i></button>
            <button id="up" 
                    disabled={!isActionDisabled || tile.contents === ''}
                    className={colorPicker()}
                    onMouseDown={() => {
                        const i = items.indexOf(tile);
                        if (i !== 0 && 
                           (items[i].queryPreference - items[i - 1].queryPreference < 9000000000)) {                 
                            const temp = tile.queryPreference;                          
                            tile.queryPreference = items[i - 1].queryPreference;                        
                            items[i - 1].queryPreference = temp;
                            updateFirestoreDoc(items[i - 1]);                         
                        } }}><i className="fi fi-rr-arrow-circle-up"></i></button>
            <button id="down" 
                    disabled={!isActionDisabled || tile.contents === ''}
                    className={colorPicker()}
                    onMouseDown={() => {                       
                        const i = items.indexOf(tile);
                        if (i !== items.length - 2 && 
                        (items[i + 1].queryPreference - tile.queryPreference < 9000000000)) {                           
                            const temp = tile.queryPreference;                    
                            tile.queryPreference = items[i + 1].queryPreference;
                            items[i + 1].queryPreference = temp;
                            updateFirestoreDoc(items[i + 1]);
                        } }}><i className="fi fi-rr-arrow-circle-down"></i></button>
            <button id="important"
                    disabled={!isActionDisabled || tile.contents === ''}
                    className={colorPicker()}
                    onMouseDown={() => {                    // onMouseDown instead of onClick, to execute before item updates by blurring input field
                        tile.important = !tile.important;
                        tile.unimportant = false;
                        tile.important ? tile.queryPreference = tile.date - 10000000000
                                       : tile.queryPreference = tile.date;
                    }}><i className="fi fi-rr-exclamation"></i></button>
            <button id="unimportant"
                    disabled={!isActionDisabled || tile.contents === ''}
                    className={colorPicker()}
                    onMouseDown={() => {                    // onMouseDown instead of onClick, to execute before item updates by blurring input field
                        tile.unimportant = !tile.unimportant;
                        tile.important = false;
                        tile.unimportant ? tile.queryPreference = tile.date + 10000000000
                                         : tile.queryPreference = tile.date;
                    }}><i className="fi fi-rr-interrogation"></i></button>
            <button id="comments"
                    disabled={!isActionDisabled || tile.contents === ''}
                    className={colorPicker()}
                    onMouseDown={() => setIsComments(!isComments)}><i className="fi fi-rr-comment"></i></button> 
            <button id="add"
                    className={colorPicker()}
                    disabled={isAddDisabled}
                    onClick={() => {
                        itemIds.some(id => id === tile.contents) ? updateFirestoreDoc(tile) : addToFirestore(tile);
                    }}><i className="fi fi-br-plus"></i></button>
            <button id="remove"
                    className={colorPicker()}
                    disabled={isRemoveDisabled}
                    onClick={(e) => {
                        e.preventDefault();
                        removeFromFirestore(tile.id);
                      } 
                    }><i className="fi fi-br-cross"></i></button>
        </>
        )
    }
        
        
    
)
 
export default Buttons;
