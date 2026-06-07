import { Loader } from "lucide-react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
    changeCurrentPassword,
    commonLogin,
    currentUser,
    loggedOutUser,
    registerAdmin,
    updateUserAvatar,
    updateUserProfile,
} from "../api/index";

import { LocalStorage } from "../utils";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// For testing purposes
export { AuthContext };

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // =========================
    // STATE
    // =========================
    const [user, setUser] = useState(() => LocalStorage.get("user") || null);
    const [role, setRole] = useState(() => LocalStorage.get("user")?.role || "");
    const [loadingStates, setLoadingStates] = useState({
        login: false,
        register: false,
        logout: false,
        updateProfile: false,
        changePassword: false,
        updateAvatar: false,
    });
    const [isInitializing, setIsInitializing] = useState(true);
    const initializedRef = useRef(false);
    const isMountedRef = useRef(true);

    const isAuthenticated = !!user;

    // Helper to set individual loading states
    const setLoading = useCallback((key, value) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
    }, []);

    // Combined loading state for backward compatibility
    const loading = useMemo(() => {
        return Object.values(loadingStates).some(state => state === true);
    }, [loadingStates]);

    // =========================
    // SAVE USER
    // =========================
    const persistUser = useCallback((userData) => {
        if (!userData || !isMountedRef.current) return;

        setUser(prev => {
            if (JSON.stringify(prev) === JSON.stringify(userData)) return prev;
            return userData;
        });

        setRole(userData.role || null);
        LocalStorage.set("user", userData);
    }, []);

    // =========================
    // CLEAR AUTH
    // =========================
    const clearAuth = useCallback(() => {
        if (!isMountedRef.current) return;

        LocalStorage.remove("user");
        setUser(null);
        setRole(null);
    }, []);

    // =========================
    // HANDLE UNAUTHORIZED
    // =========================
    const handleUnauthorized = useCallback(() => {
        clearAuth();
        navigate("/login", { replace: true });
    }, [clearAuth, navigate]);

    // =========================
    // FETCH USER
    // =========================
    const fetchCurrentUser = useCallback(async () => {
        try {
            const res = await currentUser();

            if (!isMountedRef.current) return null;

            const userData = res?.data?.data || res?.data || null;

            if (userData) {
                persistUser(userData);
                return userData;
            }

            clearAuth();
            return null;
        } catch (error) {
            console.error("Failed to fetch current user:", error);

            // Handle token expiry or unauthorized
            if (error?.response?.status === 401 && isMountedRef.current) {
                handleUnauthorized();
            } else if (isMountedRef.current) {
                clearAuth();
            }

            return null;
        }
    }, [persistUser, clearAuth, handleUnauthorized]);

    // =========================
    // UPDATE LOCAL USER (NO API CALL)
    // =========================
    const updateLocalUser = useCallback(async (updatedUserData) => {
        if (!user) {
            return { success: false, error: "No user logged in" };
        }

        try {
            const newUserData = { ...user, ...updatedUserData };
            persistUser(newUserData);
            return { success: true, data: newUserData };
        } catch (error) {
            console.error("Failed to update local user:", error);
            return { success: false, error: error.message };
        }
    }, [user, persistUser]);

    // =========================
    // CHECK SESSION EXPIRY
    // =========================
    const checkSessionExpiry = useCallback(() => {
        const storedUser = LocalStorage.get("user");
        if (storedUser?.expiry && Date.now() > storedUser.expiry) {
            handleUnauthorized();
            return true;
        }
        return false;
    }, [handleUnauthorized]);

    // =========================
    // INIT (RUN ONLY ONCE)
    // =========================
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        isMountedRef.current = true;

        const init = async () => {
            try {
                const storedUser = LocalStorage.get("user");

                // Check session expiry before initialization
                if (storedUser?.expiry && Date.now() > storedUser.expiry) {
                    clearAuth();
                    return;
                }

                if (storedUser) {
                    await fetchCurrentUser();
                }
            } catch (error) {
                console.error("Initialization error:", error);
                clearAuth();
            } finally {
                if (isMountedRef.current) {
                    setIsInitializing(false);
                }
            }
        };

        init();

        // Set up periodic session check (every 5 minutes)
        const intervalId = setInterval(() => {
            checkSessionExpiry();
        }, 5 * 60 * 1000);

        return () => {
            isMountedRef.current = false;
            clearInterval(intervalId);
        };
    }, [fetchCurrentUser, clearAuth, checkSessionExpiry]);

    // =========================
    // LOGIN
    // =========================
    const login = useCallback(async (payload) => {
        setLoading("login", true);

        // Clear any existing auth data before login
        clearAuth();

        try {
            const loginResponse = await commonLogin(payload);
                        console.log(loginResponse)


            // Extract user data from login response
            const userData = loginResponse?.data?.data?.user || loginResponse?.data;
            console.log(userData)

            setUser(userData)
            LocalStorage.set(user)
            if (userData) {
                persistUser(userData);
                return { success: true, data: userData };
            }

            // Fallback: fetch user data
            const fetchedUser = await fetchCurrentUser();
            if (fetchedUser) {
                return { success: true, data: fetchedUser };
            }

            throw new Error("No user data received");
        } catch (error) {
            console.error("Login error:", error);
            clearAuth();
            return {
                success: false,
                error: error?.response?.data?.message || error.message || "Login failed"
            };
        } finally {
            setLoading("login", false);
        }
    }, [fetchCurrentUser, persistUser, clearAuth]);

    // =========================
    // REGISTER
    // =========================
    const register = useCallback(async (payload) => {
        setLoading("register", true);

        try {
          console.log(payload)
            const res = await registerAdmin(payload);

            if (!isMountedRef.current) {
                return { success: false, error: "Component unmounted" };
            }

            return { success: true, data: res.data };
        } catch (error) {
            console.error("Registration error:", error);
            return {
                success: false,
                error: error?.response?.data?.message || "Registration failed"
            };
        } finally {
            setLoading("register", false);
        }
    }, []);

    // =========================
    // LOGOUT
    // =========================
    const logout = useCallback(async () => {
        setLoading("logout", true);

        try {
            await loggedOutUser();
        } catch (error) {
            console.error("Logout API error:", error);
            // Continue with local logout even if API fails
        } finally {
            clearAuth();
            if (isMountedRef.current) {
                navigate("/login", { replace: true });
            }
            setLoading("logout", false);
        }
    }, [clearAuth, navigate]);

    // =========================
    // UPDATE PROFILE API INTEGRATION
    // =========================
    const updateProfile = useCallback(async (profileData) => {
        setLoading("updateProfile", true);

        try {
            const response = await updateUserProfile(profileData);

            if (!isMountedRef.current) {
                return { success: false, error: "Component unmounted" };
            }

            const updatedUser = response?.data?.data || response?.data;

            if (updatedUser) {
                persistUser(updatedUser);
                return { success: true, data: updatedUser };
            }

            return { success: false, error: "Failed to update profile" };
        } catch (error) {
            console.error("Failed to update profile:", error);

            if (error?.response?.status === 401) {
                handleUnauthorized();
            }

            return {
                success: false,
                error: error?.response?.data?.message || "Failed to update profile"
            };
        } finally {
            setLoading("updateProfile", false);
        }
    }, [persistUser, handleUnauthorized]);

    // =========================
    // CHANGE PASSWORD API INTEGRATION
    // =========================
    const changePassword = useCallback(async (passwordData) => {
        setLoading("changePassword", true);

        try {
            const response = await changeCurrentPassword(passwordData);

            if (!isMountedRef.current) {
                return { success: false, error: "Component unmounted" };
            }

            return { success: true, data: response?.data };
        } catch (error) {
            console.error("Failed to change password:", error);

            if (error?.response?.status === 401) {
                handleUnauthorized();
            }

            return {
                success: false,
                error: error?.response?.data?.message || "Failed to change password"
            };
        } finally {
            setLoading("changePassword", false);
        }
    }, [handleUnauthorized]);

    // =========================
    // UPDATE AVATAR API INTEGRATION
    // =========================
    const updateAvatar = useCallback(async (avatarFile) => {
        if (!avatarFile) {
            return { success: false, error: "No file provided" };
        }

        setLoading("updateAvatar", true);

        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await updateUserAvatar(formData);

            if (!isMountedRef.current) {
                return { success: false, error: "Component unmounted" };
            }

            const updatedUser = response?.data?.data || response?.data;

            if (updatedUser) {
                persistUser(updatedUser);
                return { success: true, data: updatedUser };
            }

            return { success: false, error: "Failed to update avatar" };
        } catch (error) {
            console.error("Failed to update avatar:", error);

            if (error?.response?.status === 401) {
                handleUnauthorized();
            }

            return {
                success: false,
                error: error?.response?.data?.message || "Failed to update avatar"
            };
        } finally {
            setLoading("updateAvatar", false);
        }
    }, [persistUser, handleUnauthorized]);

    // =========================
    // REFRESH USER DATA
    // =========================
    const refreshUser = useCallback(async () => {
        if (!isAuthenticated) {
            return { success: false, error: "Not authenticated" };
        }

        setLoading("updateProfile", true);

        try {
            const userData = await fetchCurrentUser();
            console.log(userData)
            return { success: !!userData, data: userData };
        } finally {
            setLoading("updateProfile", false);
        }
    }, [isAuthenticated, fetchCurrentUser]);

    // =========================
    // MEMO VALUE
    // =========================
    const value = useMemo(() => ({
        user,
        role,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        setUser: updateLocalUser,
        updateProfile,
        changePassword,
        updateAvatar,
        refreshUser,
        // Individual loading states for granular control
        isLoadingLogin: loadingStates.login,
        isLoadingRegister: loadingStates.register,
        isLoadingLogout: loadingStates.logout,
        isLoadingUpdateProfile: loadingStates.updateProfile,
        isLoadingChangePassword: loadingStates.changePassword,
        isLoadingUpdateAvatar: loadingStates.updateAvatar,
    }), [
        user,
        role,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateLocalUser,
        updateProfile,
        changePassword,
        updateAvatar,
        refreshUser,
        loadingStates
    ]);

    // =========================
    // LOADING SCREEN
    // =========================
    if (isInitializing) {
        return (
            <div className="flex h-screen justify-center items-center">
                <Loader className="animate-spin w-10 h-10 text-blue-600" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
