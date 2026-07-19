/*==========================================================
 StudyWithOm CMS
 File : firebase.js
 Version : 1.0
==========================================================*/

/*==========================================================
 FIREBASE IMPORTS
==========================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



/*==========================================================
 FIREBASE CONFIG
==========================================================*/

const firebaseConfig = {

    apiKey: "AIzaSyDwlHpTGv1NP93DxTNbMx09Nnz3YIFEAm8",

    authDomain: "studywithom.firebaseapp.com",

    projectId:  "studywithom",

    storageBucket: "studywithom.firebasestorage.app",

    messagingSenderId: "745374680590",

    appId: "1:745374680590:web:cba7fe263951045f881e5f",

};



/*==========================================================
 INITIALIZE FIREBASE
==========================================================*/

const app = initializeApp(firebaseConfig);



/*==========================================================
 SERVICES
==========================================================*/

const db = getFirestore(app);

const auth = getAuth(app);



/*==========================================================
 CLOUDINARY CONFIG
==========================================================*/

const cloudinary = {

    cloudName: "abzhlo3h",

    uploadPreset: "studywithom"

};



/*==========================================================
 EXPORTS
==========================================================*/

export {

    app,

    db,

    auth,

    cloudinary

};
/*==========================================================
 FIRESTORE IMPORTS
==========================================================*/

import {

    collection,

    doc,

    addDoc,

    setDoc,

    updateDoc,

    deleteDoc,

    getDoc,

    getDocs,

    query,

    where,

    orderBy,

    limit,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/*==========================================================
 COLLECTIONS
==========================================================*/

const COLLECTIONS = {

    CONTENT: "content",

    MATERIALS: "materials",

    MEDIA: "media",

    SETTINGS: "settings",

    USERS: "users"

};


/*==========================================================
 GET COLLECTION
==========================================================*/

function getCollection(name){

    return collection(db, name);

}


/*==========================================================
 DOCUMENT REFERENCE
==========================================================*/

function getDocument(collectionName, id){

    return doc(db, collectionName, id);

}


/*==========================================================
 SERVER TIME
==========================================================*/

function now(){

    return serverTimestamp();

}


/*==========================================================
 EXPORT
==========================================================*/

export {

    collection,

    doc,

    addDoc,

    setDoc,

    updateDoc,

    deleteDoc,

    getDoc,

    getDocs,

    query,

    where,

    orderBy,

    limit,

    serverTimestamp,

    COLLECTIONS,

    getCollection,

    getDocument,

    now

};
/*==========================================================
 FIRESTORE CRUD FUNCTIONS
==========================================================*/

/**
 * Add New Document
 */

async function createDocument(collectionName, data){

    try{

        const docRef = await addDoc(
            collection(db, collectionName),
            {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }
        );

        return {
            success: true,
            id: docRef.id
        };

    }catch(error){

        console.error("Create Error :", error);

        return {
            success: false,
            error
        };

    }

}



/**
 * Update Document
 */

async function updateDocument(collectionName, id, data){

    try{

        await updateDoc(

            doc(db, collectionName, id),

            {
                ...data,
                updatedAt: serverTimestamp()
            }

        );

        return true;

    }catch(error){

        console.error("Update Error :", error);

        return false;

    }

}



/**
 * Delete Document
 */

async function removeDocument(collectionName, id){

    try{

        await deleteDoc(

            doc(db, collectionName, id)

        );

        return true;

    }catch(error){

        console.error("Delete Error :", error);

        return false;

    }

}



/**
 * Get One Document
 */

async function getDocumentById(collectionName, id){

    try{

        const snapshot = await getDoc(

            doc(db, collectionName, id)

        );

        if(snapshot.exists()){

            return {

                id: snapshot.id,

                ...snapshot.data()

            };

        }

        return null;

    }catch(error){

        console.error(error);

        return null;

    }

}



/*==========================================================
 EXPORT CRUD
==========================================================*/

export{

    createDocument,

    updateDocument,

    removeDocument,

    getDocumentById

};
/*==========================================================
 StudyWithOm CMS
 File : firebase.js
 Part : 4
 Firebase SDK : 12.16.0
==========================================================*/

/*==========================================================
 REALTIME IMPORT
==========================================================*/

import {

    onSnapshot

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


/*==========================================================
 GET ALL DOCUMENTS
==========================================================*/

async function getAllDocuments(collectionName){

    try{

        const snapshot = await getDocs(

            query(

                collection(db, collectionName),

                orderBy("order","asc")

            )

        );

        const data = [];

        snapshot.forEach(docItem=>{

            data.push({

                id:docItem.id,

                ...docItem.data()

            });

        });

        return data;

    }

    catch(error){

        console.error("Get All Documents :",error);

        return [];

    }

}



/*==========================================================
 GET DOCUMENTS BY PARENT
==========================================================*/

async function getDocumentsByParent(parentId){

    try{

        const snapshot = await getDocs(

            query(

                collection(db,COLLECTIONS.CONTENT),

                where("parent","==",parentId),

                orderBy("order","asc")

            )

        );

        const data=[];

        snapshot.forEach(item=>{

            data.push({

                id:item.id,

                ...item.data()

            });

        });

        return data;

    }

    catch(error){

        console.error(error);

        return [];

    }

}



/*==========================================================
 GET DOCUMENTS BY TYPE
==========================================================*/

async function getDocumentsByType(type){

    try{

        const snapshot=await getDocs(

            query(

                collection(db,COLLECTIONS.CONTENT),

                where("type","==",type),

                orderBy("order","asc")

            )

        );

        const result=[];

        snapshot.forEach(item=>{

            result.push({

                id:item.id,

                ...item.data()

            });

        });

        return result;

    }

    catch(error){

        console.error(error);

        return [];

    }

}



/*==========================================================
 SEARCH CONTENT
==========================================================*/

async function searchContent(keyword){

    try{

        const allData=await getAllDocuments(

            COLLECTIONS.CONTENT

        );

        return allData.filter(item=>{

            return (

                item.name?.toLowerCase()

                .includes(

                    keyword.toLowerCase()

                )

            );

        });

    }

    catch(error){

        console.error(error);

        return [];

    }

}



/*==========================================================
 REALTIME LISTENER
==========================================================*/

function listenCollection(

    collectionName,

    callback

){

    return onSnapshot(

        query(

            collection(db,collectionName),

            orderBy("order","asc")

        ),

        snapshot=>{

            const data=[];

            snapshot.forEach(item=>{

                data.push({

                    id:item.id,

                    ...item.data()

                });

            });

            callback(data);

        }

    );

}



/*==========================================================
 EXPORT
==========================================================*/

export{

    getAllDocuments,

    getDocumentsByParent,

    getDocumentsByType,

    searchContent,

    listenCollection

};
/*==========================================================
 StudyWithOm CMS
 File : firebase.js
 Part : 5
 Firebase SDK : 12.16.0
==========================================================*/

/*==========================================================
 GET COLLECTION COUNT
==========================================================*/

async function getCollectionCount(collectionName){

    try{

        const snapshot = await getDocs(

            collection(db, collectionName)

        );

        return snapshot.size;

    }

    catch(error){

        console.error("Collection Count Error :", error);

        return 0;

    }

}



/*==========================================================
 DASHBOARD STATISTICS
==========================================================*/

async function getDashboardStatistics(){

    try{

        const [

            totalContent,

            totalMaterials,

            totalMedia,

            totalUsers

        ] = await Promise.all([

            getCollectionCount(COLLECTIONS.CONTENT),

            getCollectionCount(COLLECTIONS.MATERIALS),

            getCollectionCount(COLLECTIONS.MEDIA),

            getCollectionCount(COLLECTIONS.USERS)

        ]);

        return{

            totalContent,

            totalMaterials,

            totalMedia,

            totalUsers

        };

    }

    catch(error){

        console.error(error);

        return{

            totalContent:0,

            totalMaterials:0,

            totalMedia:0,

            totalUsers:0

        };

    }

}



/*==========================================================
 DATABASE HEALTH CHECK
==========================================================*/

async function checkDatabaseConnection(){

    try{

        await getDocs(

            query(

                collection(db, COLLECTIONS.CONTENT),

                limit(1)

            )

        );

        return true;

    }

    catch(error){

        console.error("Database Error :", error);

        return false;

    }

}



/*==========================================================
 GET MATERIALS BY CHAPTER
==========================================================*/

async function getMaterialsByChapter(chapterId){

    try{

        const snapshot = await getDocs(

            query(

                collection(db, COLLECTIONS.MATERIALS),

                where("chapterId","==",chapterId),

                orderBy("createdAt","desc")

            )

        );

        const data=[];

        snapshot.forEach(item=>{

            data.push({

                id:item.id,

                ...item.data()

            });

        });

        return data;

    }

    catch(error){

        console.error(error);

        return [];

    }

}



/*==========================================================
 GET ACTIVE CONTENT
==========================================================*/

async function getActiveContent(){

    try{

        const snapshot = await getDocs(

            query(

                collection(db, COLLECTIONS.CONTENT),

                where("status","==","Active"),

                orderBy("order","asc")

            )

        );

        const result=[];

        snapshot.forEach(item=>{

            result.push({

                id:item.id,

                ...item.data()

            });

        });

        return result;

    }

    catch(error){

        console.error(error);

        return [];

    }

}



/*==========================================================
 EXPORT
==========================================================*/

export{

    getCollectionCount,

    getDashboardStatistics,

    checkDatabaseConnection,

    getMaterialsByChapter,

    getActiveContent

};
/*==========================================================
 StudyWithOm CMS
 File : firebase.js
 Part : 6
 Firebase SDK : 12.16.0
==========================================================*/

/*==========================================================
 IMPORTS
==========================================================*/

import {

    writeBatch,

    runTransaction

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


/*==========================================================
 BULK DELETE
==========================================================*/

async function bulkDelete(collectionName, ids){

    try{

        const batch = writeBatch(db);

        ids.forEach(id=>{

            batch.delete(

                doc(db, collectionName, id)

            );

        });

        await batch.commit();

        return true;

    }

    catch(error){

        console.error("Bulk Delete Error :", error);

        return false;

    }

}



/*==========================================================
 BULK UPDATE
==========================================================*/

async function bulkUpdate(collectionName, items){

    try{

        const batch = writeBatch(db);

        items.forEach(item=>{

            const ref = doc(

                db,

                collectionName,

                item.id

            );

            batch.update(ref,{

                ...item.data,

                updatedAt:serverTimestamp()

            });

        });

        await batch.commit();

        return true;

    }

    catch(error){

        console.error("Bulk Update Error :", error);

        return false;

    }

}



/*==========================================================
 CHANGE DISPLAY ORDER
==========================================================*/

async function updateDisplayOrder(

    collectionName,

    orderedItems

){

    try{

        const batch = writeBatch(db);

        orderedItems.forEach((item,index)=>{

            batch.update(

                doc(

                    db,

                    collectionName,

                    item.id

                ),

                {

                    order:index+1,

                    updatedAt:serverTimestamp()

                }

            );

        });

        await batch.commit();

        return true;

    }

    catch(error){

        console.error(error);

        return false;

    }

}



/*==========================================================
 TRANSACTION
==========================================================*/

async function safeTransaction(

    collectionName,

    documentId,

    callback

){

    try{

        return await runTransaction(

            db,

            async(transaction)=>{

                const ref = doc(

                    db,

                    collectionName,

                    documentId

                );

                const snap = await transaction.get(ref);

                return callback(

                    transaction,

                    ref,

                    snap

                );

            }

        );

    }

    catch(error){

        console.error(

            "Transaction Error :",

            error

        );

        return null;

    }

}



/*==========================================================
 EXPORT
==========================================================*/

export{

    bulkDelete,

    bulkUpdate,

    updateDisplayOrder,

    safeTransaction

};/*==========================================================
 StudyWithOm CMS
 File : firebase.js
 Part : 7
 Firebase SDK : 12.16.0
==========================================================*/

/*==========================================================
 REALTIME DASHBOARD LISTENERS
==========================================================*/

function listenDashboard(callback){

    const unsubscribers = [];

    Object.values(COLLECTIONS).forEach(collectionName=>{

        const unsubscribe = onSnapshot(

            collection(db, collectionName),

            ()=>{

                callback();

            }

        );

        unsubscribers.push(unsubscribe);

    });

    return ()=>{

        unsubscribers.forEach(fn=>fn());

    };

}



/*==========================================================
 LIVE MATERIALS
==========================================================*/

function listenMaterials(callback){

    return onSnapshot(

        query(

            collection(db, COLLECTIONS.MATERIALS),

            orderBy("createdAt","desc")

        ),

        snapshot=>{

            const materials=[];

            snapshot.forEach(item=>{

                materials.push({

                    id:item.id,

                    ...item.data()

                });

            });

            callback(materials);

        }

    );

}



/*==========================================================
 LIVE CONTENT TREE
==========================================================*/

function listenContentTree(callback){

    return onSnapshot(

        query(

            collection(db, COLLECTIONS.CONTENT),

            orderBy("order","asc")

        ),

        snapshot=>{

            const tree=[];

            snapshot.forEach(item=>{

                tree.push({

                    id:item.id,

                    ...item.data()

                });

            });

            callback(tree);

        }

    );

}



/*==========================================================
 LIVE SETTINGS
==========================================================*/

function listenSettings(callback){

    return onSnapshot(

        collection(db,COLLECTIONS.SETTINGS),

        snapshot=>{

            const settings=[];

            snapshot.forEach(item=>{

                settings.push({

                    id:item.id,

                    ...item.data()

                });

            });

            callback(settings);

        }

    );

}



/*==========================================================
 LIVE MEDIA
==========================================================*/

function listenMedia(callback){

    return onSnapshot(

        query(

            collection(db,COLLECTIONS.MEDIA),

            orderBy("createdAt","desc")

        ),

        snapshot=>{

            const media=[];

            snapshot.forEach(item=>{

                media.push({

                    id:item.id,

                    ...item.data()

                });

            });

            callback(media);

        }

    );

}



/*==========================================================
 LIVE USERS
==========================================================*/

function listenUsers(callback){

    return onSnapshot(

        collection(db,COLLECTIONS.USERS),

        snapshot=>{

            const users=[];

            snapshot.forEach(item=>{

                users.push({

                    id:item.id,

                    ...item.data()

                });

            });

            callback(users);

        }

    );

}



/*==========================================================
 EXPORT
==========================================================*/

export{

    listenDashboard,

    listenMaterials,

    listenContentTree,

    listenSettings,

    listenMedia,

    listenUsers

};