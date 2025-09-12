type ToastVariant = "neutral" | "success" | "error";

type ToastProps = {
  variant: ToastVariant;
  title?: string;
  body?: string;
};

type VariantConfig = {
  className: string;
  title: string;
  body: string;
};

const VARIANT_MAP: Record<Exclude<ToastVariant, "neutral">, VariantConfig> = {
  success: {
    className:
      "bg-[var(--succes-color)] border-2 border-[#d9f99d] px-4 py-3 rounded-lg w-[320px] shadow-xl",
    title: "Vos spécifications ont été enregistrées avec succès.",
    body: "Elles s'appliqueront dès à présent.",
  },
  error: {
    className:
      "bg-[var(--error-color)] border-2 border-[#fecaca] px-4 py-3 rounded-lg w-[320px] shadow-xl",
    title: "Une erreur s'est produite lors de l'enregistrement.",
    body: "Veuillez réessayer plus tard.",
  },
};

function ToastContainer({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

function ToastTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-title font-medium">{children}</p>;
}

function ToastBody({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-text mt-1">{children}</p>;
}

export default function Toast({
  variant = "neutral",
  title,
  body,
}: ToastProps) {
  if (variant === "neutral") {
    if (!title && !body) return null;

    return (
      <ToastContainer className="bg-slate-50 border-2 border-slate-100 px-4 py-3 rounded-lg w-[320px] shadow-lg">
        {title && <ToastTitle>{title}</ToastTitle>}
        {body && <ToastBody>{body}</ToastBody>}
      </ToastContainer>
    );
  }

  const {
    className,
    title: defaultTitle,
    body: defaultBody,
  } = VARIANT_MAP[variant];

  return (
    <ToastContainer className={className}>
      <ToastTitle>{defaultTitle}</ToastTitle>
      <ToastBody>{defaultBody}</ToastBody>
    </ToastContainer>
  );
}
