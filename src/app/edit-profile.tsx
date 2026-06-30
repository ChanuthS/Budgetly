import { COLORS } from "@/constants/colors";
import {
    getProfile,
    Profile,
    updateProfile,
    uploadAvatar,
} from "@/services/profileService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  if (email) return email.slice(0, 2).toUpperCase();

  return "U";
}

export default function EditProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getProfile();

      setProfile(data);
      setFullName(data.full_name || "");
      setUsername(data.username || "");
      setPhone(data.phone || "");
      setAvatarUrl(data.avatar_url || null);
    } catch (error: any) {
      Alert.alert("Profile error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function pickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to choose a profile photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLocalAvatarUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!fullName.trim()) {
      Alert.alert("Missing name", "Please enter your full name.");
      return;
    }

    try {
      setSaving(true);

      let finalAvatarUrl = avatarUrl;

      if (localAvatarUri) {
        finalAvatarUrl = await uploadAvatar(localAvatarUri);
      }

      await updateProfile({
        fullName,
        username,
        phone,
        avatarUrl: finalAvatarUrl,
      });

      Alert.alert("Profile updated", "Your profile changes have been saved.");
      router.back();
    } catch (error: any) {
      Alert.alert("Update failed", error.message);
    } finally {
      setSaving(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const initials = getInitials(fullName, profile?.email);
  const displayedAvatar = localAvatarUri || avatarUrl;

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Edit Profile</Text>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.disabledButton]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar}>
            {displayedAvatar ? (
              <Image source={{ uri: displayedAvatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}

            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.avatarHint}>Tap to change profile photo</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your name"
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="username"
            placeholderTextColor={COLORS.muted}
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <View style={styles.disabledInput}>
            <Text style={styles.disabledInputText}>
              {profile?.email || "No email available"}
            </Text>
            <Ionicons name="lock-closed-outline" size={17} color={COLORS.muted} />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="(562) 000-0000"
            placeholderTextColor={COLORS.muted}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <Text style={styles.note}>
          Email is managed by your login account. You can update your display name,
          username, phone number, and profile photo here.
        </Text>

        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  saveText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 22,
  },
  avatarWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
    position: "relative",
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarFallback: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  cameraBadge: {
    position: "absolute",
    right: 2,
    bottom: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  avatarHint: {
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 10,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
  },
  label: {
    color: COLORS.muted,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "700",
  },
  disabledInput: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  disabledInputText: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  note: {
    color: COLORS.muted,
    lineHeight: 20,
    marginTop: 14,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 120,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.6,
  },
});