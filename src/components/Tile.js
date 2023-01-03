import { useState, useEffect, useRef } from "react";
import Buttons from "./Buttons";
import Comments from "./Comments";

const Tile = ({ tile, 
                items, 
                setItems, 
                itemIds, 
                toggle, 
                setToggle, 
                newItem, 
                addToFirestore, 
                updateFirestoreDoc, 
                removeFromFirestore,
            }) => { 

    // 3 state variables to toggle visibility and disabled status of functional buttons
    const [isAddDisabled, setIsAddDisabled] = useState(true);
    const [isRemoveDisabled, setIsRemoveDisabled] = useState(false);
    const [isActionDisabled, setIsActionDisabled] = useState(false);
    const [isComments, setIsComments] = useState(false);

    const ref = useRef(null);
    
    useEffect(() => {                           // execute every time user types into any input field
        addRemoveTiles();
    }, [toggle]);

    const handleChange = (value) => { 
        // update contents of tile and toggle component to update firestore
        tile.contents = value.toLowerCase();
        if (tile.contents === '') {
            removeFromFirestore(tile.id);
        }
        setToggle(!toggle);
    }

    const handleChangeComments = (value) => {
        // update comments of tile and toggle component to update firestore
        tile.comments = value;
        itemIds.some(id => id === tile.contents) ? updateFirestoreDoc(tile) : addToFirestore(tile);
        setToggle(!toggle);
    }

    const colorPicker = () => {
        // pick color based on tile index and importance
        if (items.indexOf(tile) % 2 === 0) {
           if (tile.important) {
                return 'even-important';
           } else if (tile.unimportant) {
                return 'even-unimportant';
           } else return 'even';
        } else {
            if (tile.important) {
                return 'odd-important';
           } else if (tile.unimportant) {
                return 'odd-unimportant';
           } else return 'odd';
        }
    }

    const colorPickerOpposite = () => {
        // pick opposite color based on colorPicker() output
        switch (colorPicker()) {
            case 'even':
                return 'odd';
            case 'odd':
                return 'even';
            case 'even-important':
                return 'odd-important';
            case 'odd-important':
                return 'even-important';
            case 'even-unimportant':
                return 'odd-unimportant';
            case 'odd-unimportant':
                return 'even-unimportant';
            default:
                break;
        }
    }

    const addRemoveTiles = () => {
        if (items.every(item => item.contents !== '')) {            // create new empty tile every time user adds new item
            setItems((items.concat(newItem)));
        } else if (tile.contents === '') {
            setIsRemoveDisabled(true);
            setIsAddDisabled(true);
            setIsActionDisabled(true);
        } 
    }

    return (
        <div className={colorPickerOpposite()}>
        <form>
            <input type="text"
                    className={colorPicker()}
                    value={tile.contents}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="add item"
                    ref={ref}                                   // listener to be set in focus by clicking on action button
                    onInput={() => {
                        setIsAddDisabled(false);
                        setIsRemoveDisabled(true);
                        setIsActionDisabled(true);
                    }}
                    onBlur={() => {
                        setIsAddDisabled(true);
                        tile.contents !== '' && setIsRemoveDisabled(false);
                        tile.contents !== '' && setIsActionDisabled(false);
                        console.log('ids', itemIds);
                        setIsActionDisabled(false);
                        console.log('blurred');
                        itemIds.some(id => id === tile.id) ? updateFirestoreDoc(tile) : addToFirestore(tile);
                    }}
                    onFocus={() => {
                        addRemoveTiles();
                        setIsAddDisabled(false);
                        setIsRemoveDisabled(false);
                        tile.contents !== '' && setIsActionDisabled(false);   // disables action button while enabling specific action buttons (important, unimportant, comments)
                    }}
                 />
            <Buttons tile={tile}
                     items={items}
                     colorPicker={colorPicker}
                     isAddDisabled={isAddDisabled}
                     isRemoveDisabled={isRemoveDisabled}
                     isActionDisabled={isActionDisabled}
                     isComments={isComments}
                  
                     setIsAddDisabled={setIsAddDisabled}
                     setIsRemoveDisabled={setIsRemoveDisabled}
                     setIsActionDisabled={setIsActionDisabled}
                     setIsComments={setIsComments}
                     
                     itemIds={itemIds}
                     ref={ref}
                     addToFirestore={addToFirestore}
                     updateFirestoreDoc={updateFirestoreDoc}
                     removeFromFirestore={removeFromFirestore} />   
        </form>  
        {(tile.comments || isComments) && <Comments colorPicker={colorPicker}
                                 handleChangeComments={handleChangeComments}
                                 tile={tile}
                                 />}
        </div>    
    );
}
 
export default Tile;
