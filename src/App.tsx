import { Suspense, lazy } from 'react';
import { useStore } from './store/useStore';

const MainLayout = lazy(() => import('./components/layout/MainLayout').then((m) => ({ default: m.MainLayout })));
const WelcomeScreen = lazy(() => import('./components/WelcomeScreen').then((m) => ({ default: m.WelcomeScreen })));

function App() {
    const mode = useStore((state) => state.mode);

    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-gray-600">Loading...</div>}>
            {mode === 'welcome' && <WelcomeScreen />}
            {mode === 'edit' && <MainLayout />}
        </Suspense>
    );
}

export default App;
