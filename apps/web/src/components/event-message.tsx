import { CheckCircle, Info, MessageSquare } from "lucide-react";

export function EventMessage({
  title,
  message,
  type = "info",
}: {
  title: string;
  message: string;
  type?: "success" | "info" | "comment";
}) {
  const icon =
    type === "success" ? (
      <CheckCircle className="text-emerald-500" size={20} />
    ) : type === "comment" ? (
      <MessageSquare className="text-blue-500" size={20} />
    ) : (
      <Info className="text-indigo-500" size={20} />
    );

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div className="flex flex-col">
        <h4 className="text-sm font-semibold text-foreground leading-tight">
          {title}
        </h4>
        <p className="text-xs text-muted-foreground leading-snug mt-0.5">
          {message}
        </p>
      </div>
    </div>
  );
}
