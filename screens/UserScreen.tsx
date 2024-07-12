import { StyleSheet, Dimensions } from 'react-native';
import { View, Image, Text, Button, H4, ScrollView } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import IconButton from '../components/IconButton';
import * as WebBrowser from 'expo-web-browser';
import {
  ArrowLeft,
  Bell,
  Heart,
  HelpCircle,
  Languages,
  Menu,
  MessageSquare,
  Receipt,
  X,
} from 'lucide-react-native';
import useNavigation from '../hooks/useNavigation';
import useTranslation from '../hooks/useTranslation';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LineItemWithIcon from '../components/LineItemWithIcon';
import { User } from 'lucide-react-native';
import { useContext, useState } from 'react';
import FullScreenModal from '../components/FullScreenModal';
import { signOut } from 'firebase/auth';
import { auth } from '../config';
import { AuthenticatedUserContext } from '../providers';
import { LANGUAGES } from '../providers/AuthenticatedUserProvider';

const { width } = Dimensions.get('window');

/**
 * [ ]
 */

const UserScreen: React.FC<{}> = ({}) => {
  const { goBack, canGoBack, navigate } = useNavigation();
  const { t } = useTranslation();
  const { changeLanguage, language } = useContext(AuthenticatedUserContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const [view, setView] = useState<null | 'languages' | 'notifications'>(null);

  const safeArea = useSafeAreaInsets();

  const offset = useSharedValue<number>(-(width * 0.9));

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const toggleMenu = () => {
    if (menuOpen) {
      offset.value = withTiming(-(width * 0.9));
      setTimeout(() => {
        setMenuOpen(false);
      }, 400);
    } else {
      setMenuOpen(true);
      offset.value = withTiming(0);
    }
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };

  return (
    <View style={styles.container}>
      {view === 'languages' && (
        <FullScreenModal
          open
          title={t('Languages')}
          onClose={() => setView(null)}
        >
          <ScrollView style={{ padding: 10 }}>
            {LANGUAGES.map((lang) => (
              <View
                key={lang.id}
                style={[
                  {
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 10,
                    gap: 10,
                  },
                  lang.id === language
                    ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    : {},
                ]}
                onPress={() => changeLanguage(lang.id)}
              >
                <Text color="#ffffff" fontSize="$5">
                  {lang.flag}
                </Text>
                <Text color="#ffffff" fontSize="$5">
                  {lang.label}
                </Text>
              </View>
            ))}
          </ScrollView>
        </FullScreenModal>
      )}
      {view === 'notifications' && (
        <FullScreenModal
          open
          title={t('Notifications')}
          onClose={() => setView(null)}
        >
          <></>
        </FullScreenModal>
      )}
      {menuOpen && (
        <BlurView intensity={10} style={styles.backdrop}>
          <Animated.View
            style={[
              styles.drawer,
              animatedStyles,
              { bottom: safeArea.bottom + 64 },
            ]}
          >
            <BlurView intensity={20} style={styles.drawerInner}>
              <View
                style={[
                  styles.header,
                  { top: safeArea.top - 20, paddingRight: 12 },
                ]}
              >
                <H4 color="#ffffff" style={{ flex: 1 }} fontWeight="bold">
                  {t('Menu')}
                </H4>
                <IconButton
                  onPress={() => toggleMenu()}
                  icon={<X size="24px" color="#ffffff" />}
                />
              </View>
              {/* Gamification */}
              <View
                style={{
                  marginTop: safeArea.top + 40,
                  gap: 10,
                  paddingBottom: safeArea.bottom,
                }}
              >
                <LineItemWithIcon
                  icon={User}
                  label={t('Edit Profile')}
                  onPress={() =>
                    WebBrowser.openBrowserAsync('https://google.com')
                  }
                />

                <LineItemWithIcon
                  icon={Receipt}
                  label={t('Edit Subscription')}
                  onPress={() =>
                    navigate({ route: 'Subscription', params: {} })
                  }
                />

                <LineItemWithIcon
                  icon={Languages}
                  label={t('Language')}
                  onPress={() => setView('languages')}
                />
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ gap: 10 }}>
                <LineItemWithIcon
                  icon={HelpCircle}
                  label={t('Tutorials')}
                  onPress={() =>
                    WebBrowser.openBrowserAsync('https://google.com')
                  }
                />

                <LineItemWithIcon
                  icon={MessageSquare}
                  label={t('Support')}
                  onPress={() =>
                    WebBrowser.openBrowserAsync('https://google.com')
                  }
                />

                <View style={{ padding: 20 }}>
                  <Button
                    onPress={handleLogout}
                    // backgroundColor={'rgba(35, 35, 35, 1)'}
                    backgroundColor="$color12"
                    color="$color1"
                  >
                    {t('Logout')}
                  </Button>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </BlurView>
      )}
      <LinearGradient
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        style={[styles.header, { top: safeArea.top - 20, paddingLeft: 8 }]}
      >
        <IconButton
          onPress={() => toggleMenu()}
          icon={<Menu size="24px" color="#ffffff" />}
        />
        <H4 color="#ffffff" style={{ flex: 1 }} fontWeight="bold">
          {t('Your Experience')}
        </H4>
        <IconButton
          onPress={() => setView('notifications')}
          icon={<Bell size="24px" color="#ffffff" />}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 100,
    width: width * 0.9,

    zIndex: 200,
  },
  drawerInner: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    // paddingVertical: 20,
  },
});

export default UserScreen;
