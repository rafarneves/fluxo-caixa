'use client';

import { useState } from 'react';
import AddRounded from '@mui/icons-material/AddRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { criarRecebimento } from '@/actions/recebimentos';

export default function NovoRecebimentoModal({ contratoId }: { contratoId: string }) {
    const [aberto, setAberto] = useState(false);
    return (
        <>
            <Button onClick={() => setAberto(true)} startIcon={<AddRounded />}>
                Novo Recebimento
            </Button>
            <Dialog open={aberto} onClose={() => setAberto(false)} fullWidth maxWidth="sm">
                <form
                    action={async (formData) => {
                        await criarRecebimento({
                            contrato_id: contratoId,
                            competencia: String(formData.get('competencia')),
                            valor: Number(formData.get('valor')),
                            vencimento: String(formData.get('vencimento')),
                        });
                        setAberto(false);
                    }}
                >
                    <DialogTitle sx={{ pr: 6, fontWeight: 800 }}>Novo Recebimento</DialogTitle>
                    <IconButton
                        onClick={() => setAberto(false)}
                        aria-label="Fechar"
                        sx={{ position: 'absolute', top: 12, right: 12 }}
                    >
                        <CloseRounded />
                    </IconButton>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField name="competencia" label="Competência" required fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    name="valor"
                                    label="Valor"
                                    type="number"
                                    required
                                    fullWidth
                                    slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    name="vencimento"
                                    label="Vencimento"
                                    type="date"
                                    required
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button type="button" variant="outlined" color="inherit" onClick={() => setAberto(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Salvar</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
