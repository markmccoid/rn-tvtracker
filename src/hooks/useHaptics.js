import * as Haptics from "expo-haptics";

export const useHaptics = () => {
  return {
    hapticSuccess: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    hapticWarning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    hapticError: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    hapticLight: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    hapticMedium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    hapticHeavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  };
};
