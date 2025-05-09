import { Toast } from "@/lib/toast";

interface ActionsInterface {
  setIsAdmin: (isAdmin: boolean) => void;
  setUserId: (userId: string | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserToken: (token: string | null) => void;
}

export const onSignup = async (
  data: {
    name: string;
    email: string;
    password: string;
    image: string;
  },
  actions: ActionsInterface
) => {
  const url = import.meta.env.VITE_SERVER_URL + "/auth/register";
  const { setIsAdmin, setUserId, setIsLoggedIn, setUserToken } = actions;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (response.status != 200) {
      throw new Error(json?.message);
    }

    setUserToken(json.token);
    setIsAdmin(json.user.role === "ADMIN");
    setIsLoggedIn(true);
    setUserId(json.user.id);

    Toast.success("Signed up successfully");

    return true;
  } catch (error: Error | unknown) {
    Toast.error(
      error instanceof Error
        ? error.message
        : "Not able to sign up, please try again later."
    );
  }

  return false;
};

export const onLogin = async (
  email: string,
  password: string,
  actions: ActionsInterface
) => {
  const url = import.meta.env.VITE_SERVER_URL + "/auth/login";

  const { setIsAdmin, setUserId, setIsLoggedIn, setUserToken } = actions;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (response.status != 200) {
      throw new Error(json?.message);
    }

    setUserToken(json.token);
    setIsAdmin(json.user.role === "ADMIN");
    setIsLoggedIn(true);
    setUserId(json.user.id);

    Toast.success("Logged in successfully");

    return true;
  } catch (error: Error | unknown) {
    Toast.error(
      error instanceof Error
        ? error.message
        : "Not able to login, please try again later."
    );
  }

  return false;
};

export const onLogout = async (token: string, actions: ActionsInterface) => {
  const url = import.meta.env.VITE_SERVER_URL + "/auth/logout";

  const { setIsAdmin, setUserId, setIsLoggedIn, setUserToken } = actions;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (response.status != 200) {
      throw new Error("Not able to logout, please try again later.");
    }

    setUserToken(null);
    setIsAdmin(false);
    setIsLoggedIn(false);
    setUserId(null);

    Toast.success("Logged out successfully");

    return true;
  } catch (error: Error | unknown) {
    Toast.error(
      error instanceof Error
        ? error.message
        : "Not able to logout, please try again later."
    );
  }

  return false;
};
