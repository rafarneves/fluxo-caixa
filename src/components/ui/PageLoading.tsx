import { Box, Card, Grid, Skeleton, Stack } from '@mui/material';

export default function PageLoading() {
    return (
        <Box component="main" aria-busy="true" aria-label="Carregando página">
            <Stack spacing={1.25} sx={{ mb: 4 }}>
                <Skeleton variant="rounded" width={256} height={42} />
                <Skeleton variant="rounded" width="min(384px, 100%)" height={20} />
            </Stack>
            <Grid container spacing={2.5}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <Grid key={index} size={{ xs: 12, md: 6, xl: 3 }}>
                        <Card>
                            <Skeleton variant="rectangular" height={172} />
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Card sx={{ mt: 3 }}>
                <Skeleton variant="rectangular" height={288} />
            </Card>
        </Box>
    );
}
