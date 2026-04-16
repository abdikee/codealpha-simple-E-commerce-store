import { Toaster as Sonner, toast } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      position="top-right"
      expand={false}
      duration={3000}
      offset={16}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        }
      }
      toastOptions={{
        className: "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
      }}
      {...props}
    />
  );
};

// Toast helper functions for consistent messaging
export const showToast = {
  success: (message, description) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  },
  error: (message, description) => {
    toast.error(message, {
      description,
      duration: 4000,
    });
  },
  info: (message, description) => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  },
  warning: (message, description) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },
  loading: (message) => {
    return toast.loading(message);
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  update: (toastId, options) => {
    toast.update(toastId, options);
  },
};

export { Toaster, toast };
