import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';

const AdminLoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle admin login
    const handleAdminLogin = () => {
        if (email === 'admin@gmail.com' && password === 'admin123') {
            Alert.alert('Success', 'Welcome, Admin!');
            navigation.navigate('AdminNav'); // Replace with your Admin Dashboard screen
        } else {
            Alert.alert('Error', 'Invalid email or password.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Image with Proper Scaling */}
            <Image source={require('../assets/ck.jpg')} style={styles.backgroundImage} />

            <View style={styles.overlay}>
                {/* Logo Image */}
                <Image source={require('../assets/sm.jpg')} style={styles.logo} />
                <Text style={styles.title}>Admin Login</Text>

                <View style={styles.formContainer}>
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
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleAdminLogin} disabled={loading}>
                        <Text style={styles.buttonText}>
                            {loading ? 'Logging In...' : 'Login'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Back to User Login */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.signUpLink}>Back to User Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.6,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    logo: {
        width: 200,
        height: 120,
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    formContainer: {
        width: '90%',
        padding: 20,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        width: '200',
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#ff0d4f',
        paddingVertical: 15,
        borderRadius: 30,
        width: '200',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpLink: {
        marginTop: 20,
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default AdminLoginScreen;
