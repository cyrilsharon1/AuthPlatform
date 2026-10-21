import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}
export function PrimaryButton({
  loading = false,
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      className="primary-button"
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle className="spin" size={18} />}
      <span>{loading ? "One moment…" : children}</span>
    </button>
  );
}
