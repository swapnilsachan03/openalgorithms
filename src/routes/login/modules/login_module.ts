import { Toast } from "@/lib/toast";

interface ActionsInterface {
  setIsAdmin: (isAdmin: boolean) => void;
  setUserId: (userId: string | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserToken: (token: string | null) => void;
}

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
