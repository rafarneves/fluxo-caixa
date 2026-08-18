import Badge from '@/components/ui/Badge';

export default function StatusBadge({ status }: { status: string }) {
    return <Badge color={status === 'Pago' ? 'green' : status === 'Atrasado' ? 'red' : 'yellow'}>{status}</Badge>;
}
