import React, { useState, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { query, orderBy } from "firebase/firestore";  

import Tile from "./Tile";
import Header from "./Header";

const firebaseConfig = {
  apiKey: "AIzaSyCO07XNCMrDguc8Ge2t9S1WOvxB6CkBhO4",
  authDomain: "the-lists-public.firebaseapp.com",
  projectId: "the-lists-public",
  storageBucket: "the-lists-public.appspot.com",
  messagingSenderId: "174877152974",
  appId: "1:174877152974:web:15e6cc27ce72fee94aa29f",
  measurementId: "G-C60L5DLF0D"
};

function App() {
  // initialize firebase
  initializeApp(firebaseConfig)

  // initialize firestore
  const db = getFirestore()
 
  // state to hold all items
  const [items, setItems] = useState([]); 
  // state to hold all item ids
  const [itemIds, setItemIds] = useState([]);
  // state for toggle (to execute add/remove tiles)
  const [toggle, setToggle] = useState(false);

  // state for current list
  const [currentList, setCurrentList] = useState('shopping list');
  // state for all lists
  const [lists, setLists] = useState(['shopping list', 'to do list', 'samaya']);

  // template for a new item
  const newItem = {
    contents: '',
    important: false,
    unimportant: false,
    comments: '',
    date: Math.floor(new Date() / 100),
    queryPreference: Math.floor(new Date() / 100) // this number will increse/decrease based on important/unimportant
  };

  // array of objects from firestore
  let firestoreList = [];                                       
    // array of ids from firestore
    let firestoreIds = [];                           
  
    useEffect(() => {
      const getData = () => {                                       // get data from firestore to app
       
        const q = query(collection(db, `lists/my lists/${currentList}`), orderBy('queryPreference'));
    
        onSnapshot(q, (snapshot) => {
          firestoreList = [];                                       // reset firestoreList after every change to avoid copies in items array
          firestoreIds = [];
          snapshot.docs.forEach((doc) => {
            firestoreList.push({ ...doc.data(), id: doc.id });
            firestoreIds.every(id => id !== doc.id) && firestoreIds.push(doc.id);
            
          });
          if (firestoreList.length === 0) {
            setItems(items.concat(newItem));
          } else {
            setItemIds(firestoreIds);
            setItems(firestoreList);
          }
        }); 
      }
  
      getData();
    }, [currentList]);
  
    const addToFirestore = async (tile) => {
      const docRef = doc(db, `lists/my lists/${currentList}`, tile.contents);
      if (itemIds.every(id => id !== tile.contents)) {                    // add item to collection only if item with same contents doesn't exist
        try {
            await setDoc(docRef, tile);
            console.log("Entire Document has been added successfully.");
            setToggle(!toggle);
        } catch(ex) {
            console.log(ex); 
        }
      } 
    }
  
    const updateFirestoreDoc = async (tile) => {
        // update doc in firestore
        const docRef = doc(db, `lists/my lists/${currentList}`, tile.id);
        try {
            await updateDoc(docRef, tile);
            console.log("Entire Document has been updated successfully.");
            setToggle(!toggle);
        } catch(ex) {
            console.log(ex); 
        }
      }
      
    // remove doc from firestore
    const removeFromFirestore = async (id) => {
      const docRef = doc(db, `lists/my lists/${currentList}`, id);
      try {
        await deleteDoc(docRef)
        console.log("Entire Document has been deleted successfully.");
        setToggle(!toggle);
      } catch(ex) {
        console.log(ex); 
      }
    }

    let key = -1;

  return (
    <>
    <Header currentList={currentList}
            setCurrentList={setCurrentList}
            lists={lists}/>
    <main>
      {items.map(tile => {
        key++;
        return <Tile
          key={key}
          tile={tile}
          items={items}
          itemIds={itemIds}
          setItems={setItems}
          removeFromFirestore={removeFromFirestore}
          toggle={toggle}
          setToggle={setToggle}
          newItem={newItem}
          addToFirestore={addToFirestore}
          updateFirestoreDoc={updateFirestoreDoc}
        />
        }
      )}
    </main>
    </>
  );
}

export default App;