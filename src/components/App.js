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
  // init firebase
  initializeApp(firebaseConfig)

  // init services
  const db = getFirestore()
 
  const [items, setItems] = useState([]); 
  const [itemIds, setItemIds] = useState([]);
  const [toggle, setToggle] = useState(false);                  // listener to execute add/remove tiles

  const [currentList, setCurrentList] = useState('shopping list');
  const [lists, setLists] = useState(['shopping list', 'to do list']);

  const newItem = {
    contents: '',
    important: false,
    unimportant: false,
    comments: '',
    date: Math.floor(new Date() / 100),
    queryPreference: Math.floor(new Date() / 100)              // this number will increse/decrease based on important/unimportant
  };

  let firestoreList = [];                                       // array of objects from firestore
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
    //console.log('get data test')
  }, [currentList]);

  const addToFirestore = async (tile) => {
    console.log('add ids', itemIds, 'cont', tile.contents);
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
    const docRef = doc(db, `lists/my lists/${currentList}`, tile.id);
      try {
        await updateDoc(docRef, tile);
        console.log("Document has been updated successfully.");
        setToggle(!toggle);
      } catch(ex) {
        console.log(ex);
      }
  }

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
