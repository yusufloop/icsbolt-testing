import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}