import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getFirestore, increment, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAHOv64OFwobOVReOdO7I0FDn14ALio4Sk",
    authDomain: "salamkami-website.firebaseapp.com",
    projectId: "salamkami-website",
    storageBucket: "salamkami-website.appspot.com",
    messagingSenderId: "710379476608",
    appId: "1:710379476608:web:9463f2d56ca7690f0eb865"
};

const formatDate = (dateData) => {
    const day = dateData.toDate().getDate();
    const month = dateData.toDate().toLocaleString('default', { month: 'long' });
    const year = dateData.toDate().getFullYear();

    return `${month} ${day}, ${year}`;
};

Defer(() => {
    initializeApp(firebaseConfig);

    const firestoreDatabase = getFirestore();
    const urls = window.location.href.split('?')[0];

    const subsViews = onSnapshot(doc(firestoreDatabase, `web/${urls.split('/').pop()}`), (doc) => {
        const docData = doc.data();

        const elementViews = document.getElementById('views');
        elementViews.querySelector('.view_eye').innerHTML = docData.views
        elementViews.classList.remove('invisible');

        !doc.metadata.hasPendingWrites && subsViews();
    })

    const buttonSwipe = document.getElementById('button_swipe');
    buttonSwipe && buttonSwipe.addEventListener('click', () => {
        setDoc(doc(firestoreDatabase, 'web', urls.split('/').pop()), {
            views: increment(1)
        }, {
            merge: true
        });


        const subsMessages = onSnapshot(query(collection(firestoreDatabase, `web/${urls.split('/').pop()}/messages`), orderBy('message_date', 'desc')), (coll) => {
            let templates = '';
            coll.docs.forEach((colls) => {
                const collsData = colls.data();
                const msgName = collsData.message_name;
                const msgContent = collsData.message_contant;
                const msgDate = formatDate(collsData.message_date);

                templates += `<div class='animate_animated animate_fadeInUp animate_slower bg-colorBackground relative mb-3 flex w-full flex-col items-start justify-center border border-colorMain p-3 rounded-md last:mb-0'><div class='mb-1'><strong>${msgName}</strong> - <em class='text-sm'>${msgDate}</em> </div>
                <div>${msgContent}</div></div>`
            });

            document.getElementById('all_message').innerHTML += templates;

            !coll.metadata.hasPendingWrites && subsMessages();
        })
    });

    const buttonAddMessage = document.getElementById('button_add_message');
    const forms = document.getElementById('form_rsvp');
    buttonAddMessage.addEventListener('click', (event) => {
        event.preventDefault();

        forms.classList.remove('hidden');
        buttonAddMessage.classList.add('hidden');
    })

    let formClicker = 0;
    forms && forms.addEventListener('submit', function (event) {
        event.preventDefault();

        ++formClicker;
        if (formClicker == 1) {
            addDoc(collection(firestoreDatabase, `web/${urls.split('/').pop()}/messages`), {
                message_name: this.input_rsvp_name.value,
                message_contant: decodeURI(this.input_rsvp_message.value),
                message_date: serverTimestamp(),
            }).then(() => {
                forms.remove()
                document.querySelector('.alert_message.hidden').classList.remove('hidden');
            });
        };
    })
})