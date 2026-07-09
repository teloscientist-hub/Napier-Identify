import React, { ReactNode } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { tabs } from "../app/tabs";
import { styles } from "../styles/styles";
import { AppTab } from "../types";

export function AppChrome({
  activeTab,
  children,
  onSelectTab,
}: {
  activeTab: AppTab;
  children: ReactNode;
  onSelectTab: (tab: AppTab) => void;
}) {
  const insets = useSafeAreaInsets();
  const activeLabel = tabs.find((item) => item.id === activeTab)?.label;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Napier Visual Reference</Text>
            <Text style={styles.title}>{activeLabel}</Text>
          </View>
          <TouchableOpacity style={styles.headerSettingsButton} onPress={() => onSelectTab("settings")}>
            <Text style={styles.headerSettingsText}>Settings</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 96, 132) }]}>
          {children}
        </ScrollView>
        <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom + 20, 44) }]}>
          {tabs.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.tabButton, activeTab === item.id && styles.tabButtonActive]}
              onPress={() => onSelectTab(item.id)}
            >
              <Text style={[styles.tabText, activeTab === item.id && styles.tabTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
