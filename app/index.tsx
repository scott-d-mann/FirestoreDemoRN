import React, { useRef, useState, useEffect } from 'react';
import { Text, TextInput, Button, View, StyleSheet, FlatList } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const App = () => {
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const ageRef = useRef(null);
    const [users, setUsers] = useState([]);

    // Fetch users from Firestore
    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="First Name"
                ref={firstNameRef}
                style={styles.input}
            />
            <TextInput
                placeholder="Last Name"
                ref={lastNameRef}
                style={styles.input}
            />
            <TextInput
                placeholder="Age"
                keyboardType="numeric"
                ref={ageRef}
                style={styles.input}
            />

            <Button
                title="Submit"
                onPress={() => {
                    const firstName = firstNameRef.current?.value || '';
                    const lastName = lastNameRef.current?.value || '';
                    const age = ageRef.current?.value || '';

                    addDoc(collection(db, "users"), {
                        first: firstName,
                        last: lastName,
                        age: parseInt(age, 10)
                    })
                        .then((docRef) => {
                            console.log("Document written with ID: ", docRef.id);
                            // refetch users after adding a new
                            fetchUsers();
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                        });
                }}
            />

            <Text style={styles.title}>Users List</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.first}</Text>
                        <Text style={styles.cell}>{item.last}</Text>
                        <Text style={styles.cell}>{item.age}</Text>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <Text style={styles.headerCell}>First Name</Text>
                        <Text style={styles.headerCell}>Last Name</Text>
                        <Text style={styles.headerCell}>Age</Text>
                    </View>
                )}
            />
        </View>
    );
};

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzhQQYaWMdUH66gbL0l6j8b3ArwpdwwB0",
    authDomain: "fbdemomad-9c6ab.firebaseapp.com",
    projectId: "fbdemomad-9c6ab",
    storageBucket: "fbdemomad-9c6ab.firebasestorage.app",
    messagingSenderId: "1056532854983",
    appId: "1:1056532854983:web:01eafb677c74a9949c66e2",
    measurementId: "G-N7QW7FCXB2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
});

export default App;