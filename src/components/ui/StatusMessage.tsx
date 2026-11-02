interface StatusMessageProps {
  message?: string | null;
  type?: "error" | "info";
}

export default function StatusMessage({ message, type = "error" }: StatusMessageProps) {
  if (!message) return null;
  const color = type === "error" ? "text-red-600" : "text-gray-500";
  return (
    <p role={type === "error" ? "alert" : "status"} className={`text-sm ${color}`}>
      {message}
    </p>
  );
}
