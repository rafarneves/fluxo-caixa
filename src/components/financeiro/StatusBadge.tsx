interface StatusBadgeProps {
    status: string;
  }
  
  export default function StatusBadge({
    status,
  }: StatusBadgeProps) {
    const classe =
      status === "Pago"
        ? "bg-green-500/20 text-green-400"
        : status === "Atrasado"
        ? "bg-red-500/20 text-red-400"
        : "bg-yellow-500/20 text-yellow-400";
  
    return (
      <span className={`${classe} px-3 py-1 rounded-full`}>
        {status}
      </span>
    );
  }