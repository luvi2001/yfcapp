import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [division, setDivision] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        if (!name || !email || !phone || !division || !username || !password) {
            Alert.alert('Error', 'Please fill in all the fields.');
            return;
        }

        const userData = {
            name,
            email,
            phone,
            division,
            username,
            password,
        };

        try {
            const response = await fetch('https://yfcapp.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', data.message);
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            Alert.alert('Error', 'Network error. Please try again later.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Image source={require('../assets/ck.jpg')} style={styles.backgroundImage} />

                <View style={styles.overlay}>
                    <Image source={require('../assets/sm.jpg')} style={styles.logo} />
                    <Text style={styles.title}>Create an Account</Text>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor="#999"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Area"
                            placeholderTextColor="#999"
                            value={division}
                            onChangeText={setDivision}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor="#999"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.signUpLink}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: height,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        opacity: 0.6,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.04,  // Dynamic padding
    },
    logo: {
        width: width * 0.5,
        height: height * 0.18,  // Adjusted for better responsiveness
        marginBottom: height * 0.03,
    },
    title: {
        fontSize: width * 0.07,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: height * 0.02,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    formContainer: {
        width: '90%',
        padding: width * 0.05,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    input: {
        width: '100%',
        padding: height * 0.015,
        marginBottom: height * 0.015,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#ff0d4f',
        paddingVertical: height * 0.015,
        borderRadius: 30,
        width: '70%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    buttonText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#fff',
    },
    signUpLink: {
        marginTop: height * 0.02,
        fontSize: width * 0.038,
        color: '#fff',
        textDecorationLine: 'underline',
    },
});
export default SignUpScreen;