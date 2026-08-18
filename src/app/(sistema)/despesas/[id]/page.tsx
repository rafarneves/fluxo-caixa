import Link from 'next/link';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import SaveRounded from '@mui/icons-material/SaveRounded';
import { Alert, Button, Card, CardContent, Divider, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import PageHeader from '@/components/ui/PageHeader';
import { createClient } from '@/lib/supabase/server';
import { editarDespesa } from './actions';

export default async function EditarDespesaPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;
    const { data: despesa } = await supabase.from('despesas').select('*').eq('id', id).single();
    if (!despesa) return <Alert severity="error">Despesa não encontrada.</Alert>;
    return (
        <main>
            <PageHeader
                title="Editar Despesa"
                description="Atualize as informações do custo operacional."
                actions={
                    <Button
                        component={Link}
                        href="/despesas"
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBackRounded />}
                    >
                        Voltar
                    </Button>
                }
            />
            <Card component="section">
                <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                    <Typography component="h2" variant="h5" sx={{ fontWeight: 800 }}>
                        Informações da despesa
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
                        Altere os dados e salve as modificações.
                    </Typography>
                    <Stack component="form" action={editarDespesa.bind(null, despesa.id)} spacing={3}>
                        <Grid container spacing={2.5}>
                            <Grid size={12}>
                                <TextField
                                    name="descricao"
                                    label="Descrição"
                                    defaultValue={despesa.descricao}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    name="categoria"
                                    label="Categoria"
                                    defaultValue={despesa.categoria}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    name="tipo"
                                    label="Tipo da despesa"
                                    defaultValue={despesa.tipo}
                                    fullWidth
                                >
                                    <MenuItem value="Fixa">Fixa</MenuItem>
                                    <MenuItem value="Variável">Variável</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    name="valor"
                                    type="number"
                                    label="Valor"
                                    defaultValue={despesa.valor}
                                    fullWidth
                                    slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    name="dia_vencimento"
                                    type="number"
                                    label="Dia vencimento (fixa)"
                                    defaultValue={despesa.dia_vencimento ?? ''}
                                    fullWidth
                                    slotProps={{ htmlInput: { min: 1, max: 31 } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    name="data"
                                    type="date"
                                    label="Data (variável)"
                                    defaultValue={despesa.data ?? ''}
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                        <Button type="submit" startIcon={<SaveRounded />} sx={{ alignSelf: 'flex-end' }}>
                            Salvar Alterações
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </main>
    );
}
