'use client';

import { useActionState } from 'react';
import LockRounded from '@mui/icons-material/LockRounded';
import LoginRounded from '@mui/icons-material/LoginRounded';
import MailRounded from '@mui/icons-material/MailRounded';
import { Alert, Button, CircularProgress, InputAdornment, Stack, TextField } from '@mui/material';

import { login, type LoginState } from './actions';

const initialState: LoginState = {};

export default function LoginForm() {
    const [state, formAction, pending] = useActionState(login, initialState);
    return (
        <Stack component="form" action={formAction} spacing={2.25} sx={{ mt: 4 }}>
            <TextField name="email" type="email" label="E-mail" autoComplete="email" required autoFocus fullWidth placeholder="admin@empresa.com" slotProps={{ input: { startAdornment: <InputAdornment position="start"><MailRounded fontSize="small" /></InputAdornment> } }} />
            <TextField name="password" type="password" label="Senha" autoComplete="current-password" required fullWidth placeholder="Sua senha" slotProps={{ htmlInput: { minLength: 6 }, input: { startAdornment: <InputAdornment position="start"><LockRounded fontSize="small" /></InputAdornment> } }} />
            {state.error && <Alert severity="error" variant="outlined">{state.error}</Alert>}
            <Button type="submit" disabled={pending} fullWidth size="large" startIcon={pending ? <CircularProgress size={17} color="inherit" /> : <LoginRounded />}>{pending ? 'Entrando...' : 'Entrar no sistema'}</Button>
        </Stack>
    );
}
