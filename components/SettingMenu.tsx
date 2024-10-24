import { scaledPixels } from "@/hooks/useScale";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, StyleSheet, Image, Platform, Text } from "react-native";
import { DefaultFocus, SpatialNavigationFocusableView, SpatialNavigationRoot } from "react-tv-space-navigation";
import { useRouter } from "expo-router";
import { useMenuContext } from "@/components/MenuContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SettingMenu(props: any) {
  const router = useRouter();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const styles = useDrawerStyles();

  return (
      <SpatialNavigationFocusableView key={4} onSelect={() => {toggleMenu(false); router.push('settings'); }}>
        {({ isFocused }: { isFocused: boolean }) => (
           <View style={[styles.menuItem, isFocused && styles.menuItemFocused]}>
            <Icon name="cog" size={30} color="#000" style={[styles.cogIcon, isFocused && styles.menuTextFocused]} />
            <Text style={[styles.footerText, isFocused && styles.menuTextFocused]}>Settings</Text>
          </View>
        )}
      </SpatialNavigationFocusableView>
  );
}

const useDrawerStyles = function () {
  return StyleSheet.create({
    icon: {
      width: scaledPixels(24),
      height: scaledPixels(24),
      marginRight: scaledPixels(16),
    },
    menuText: {
      color: 'white',
      fontSize: scaledPixels(32),
    },
    menuTextFocused: {
      color: 'black',
    },
    contentBottom: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: scaledPixels(16),
      paddingBottom: scaledPixels(8),
      paddingStart: scaledPixels(32),
      fontSize: scaledPixels(16),
    },
    footerText: {
      color: '#FFF',
      fontSize: scaledPixels(20),
    },
    cogIcon: {
      paddingRight: scaledPixels(6),
      color: '#FFF',
      fontSize: scaledPixels(20),
    },
  });
};