import toast from "react-hot-toast";

class ToastManager {
  success(message: string) {
    toast.success(message, {
      duration: 3000,
      position: "bottom-left",
    });
  }

  error(message: string) {
    toast.error(message, {
      duration: 4000,
      position: "bottom-left",
    });
  }

  info(message: string) {
    toast(message, {
      duration: 3000,
      position: "bottom-left",
      icon: "ℹ️",
    });
  }

  warning(message: string) {
    toast(message, {
      duration: 3000,
      position: "bottom-left",
      icon: "⚠️",
      style: {
        backgroundColor: "#fffcefff",
        color: "#92400e",
      },
    });
  }
}

export const Toast = new ToastManager();
