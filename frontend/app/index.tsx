import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, Easing, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const [buttonScale] = useState(new Animated.Value(1));
  
  // Animation values for each brick
  const brick1Animation = useRef(new Animated.Value(0)).current;
  const brick2Animation = useRef(new Animated.Value(0)).current;
  const brick3Animation = useRef(new Animated.Value(0)).current;
  
  // Animation for background studs
  const studAnimations = useRef([...Array(12)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Create animations for each brick with different timing
    const animateBrick = (animValue, duration, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
            delay: delay
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease)
          })
        ])
      ).start();
    };

    // Start animations with different durations and delays
    animateBrick(brick1Animation, 3000, 0);
    animateBrick(brick2Animation, 3500, 500);
    animateBrick(brick3Animation, 2800, 1000);
    
    // Animate background studs
    studAnimations.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500 + Math.random() * 1000,
            delay: i * 200,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease)
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1500 + Math.random() * 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease)
          })
        ])
      ).start();
    });

    return () => {
      // Clean up animations when component unmounts
      [brick1Animation, brick2Animation, brick3Animation, ...studAnimations].forEach(anim => {
        anim.stopAnimation();
      });
    };
  }, []);

  const handleGetStarted = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease)
      })
    ]).start(() => {
      router.push('/Login');
    });
  };

  // Create transform styles for each brick
  const brick1Style = {
    transform: [
      {
        rotateY: brick1Animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
        })
      },
      {
        translateY: brick1Animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -15, 0]
        })
      }
    ]
  };

  const brick2Style = {
    transform: [
      {
        rotateY: brick2Animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-360deg']
        })
      },
      {
        translateY: brick2Animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -20, 0]
        })
      }
    ]
  };

  const brick3Style = {
    transform: [
      {
        rotateX: brick3Animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
        })
      },
      {
        translateY: brick3Animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -10, 0]
        })
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFE500" barStyle="dark-content" />
      
      <View style={styles.backgroundPattern}>
        {studAnimations.map((anim, index) => (
          <Animated.View 
            key={index}
            style={[
              styles.backgroundStud,
              {
                top: `${10 + (index * 15) % 85}%`,
                left: `${5 + (index * 23) % 90}%`,
                opacity: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.15, 0.3]
                }),
                transform: [{
                  scale: anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.15, 1]
                  })
                }]
              }
            ]}
          />
        ))}
      </View>
      
      <LinearGradient
        colors={['#FFF170', '#FFE500', '#FFD500']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="toy-brick" size={90} color="#00000" />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>BRCKD</Text>
          </View>
        </View>
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Build Your Journey</Text>
          <Text style={styles.subtitle}>Brick by brick, create something amazing</Text>
        </View>
        
        <View style={styles.bricksContainer}>
          <Animated.View style={[styles.brick, { backgroundColor: '#DA291C' }, brick1Style]}>
            <View style={styles.brickStud}></View>
            <View style={styles.brickStud}></View>
          </Animated.View>
          
          <Animated.View style={[styles.brick, { backgroundColor: '#0C0A00' }, brick2Style]}>
            <View style={styles.brickStud}></View>
            <View style={styles.brickStud}></View>
          </Animated.View>
          
          <Animated.View style={[styles.brick, { backgroundColor: '#0055A4' }, brick3Style]}>
            <View style={styles.brickStud}></View>
            <View style={styles.brickStud}></View>
          </Animated.View>
        </View>
        
        <Animated.View style={{transform: [{ scale: buttonScale }]}}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleGetStarted}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FF3A2F', '#DA291C', '#B01B10']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>GET STARTED</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE500',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundStud: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0C0A00',
    opacity: 0.15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoTextContainer: {
    marginLeft: 15,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0C0A00',
  },
  logoSubtext: {
    fontSize: 16,
    color: '#0C0A00',
    opacity: 0.7,
    letterSpacing: 1,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0C0A00',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#0C0A00',
    marginBottom: 10,
    textAlign: 'center',
    opacity: 0.8,
    maxWidth: '80%',
  },
  bricksContainer: {
    flexDirection: 'row',
    marginVertical: 40,
    height: 90,
    alignItems: 'center',
    width: width * 0.9,
    justifyContent: 'center',
  },
  brick: {
    width: 70,
    height: 35,
    marginHorizontal: 15,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 4,
    // Add shadow for more 3D effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 8,
    // Add perspective for 3D effect
    backfaceVisibility: 'visible',
  },
  brickStud: {
    width: 16,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomPattern: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  stud: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFE500',
    borderWidth: 2,
    borderColor: '#0C0A00',
    margin: 6,
  }
});