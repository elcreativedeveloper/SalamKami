import { initializeApp } from "firebase/app";
import { addDoc, doc, getFirestore, increment, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAHOv64OFwobOVReOdO7I0FDn14ALio4Sk",
    authDomain: "salamkami-website.firebaseapp.com",
    projectId: "salamkami-website",
    storageBucket: "salamkami-website.appspot.com",
    messagingSenderId: "710379476608",
    appId: "1:710379476608:web:9463f2d56ca7690f0eb865"
};

initializeApp(firebaseConfig);

const firestoreDatabase = getFirestore();
const urls = window.location.href.split('?')[0];
setDoc(doc(firestoreDatabase, 'web', urls.split('/').pop()), {
    views: increment(1)
}, {
    merge: true
});

const buttonSwipe = document.getElementById('button_swipe');
buttonSwipe && buttonSwipe.addEventListener('click', () => {
    
})

console.log('asu')