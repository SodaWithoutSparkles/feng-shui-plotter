import { Suspense, lazy, useEffect } from 'react';
import { useStore } from './store/useStore';

const MainLayout = lazy(() => import('./components/layout/MainLayout').then((m) => ({ default: m.MainLayout })));
const WelcomeScreen = lazy(() => import('./components/WelcomeScreen').then((m) => ({ default: m.WelcomeScreen })));
const ViewModeLayout = lazy(() => import('./components/layout/ViewModeLayout').then((m) => ({ default: m.ViewModeLayout })));

function App() {
    const mode = useStore((state) => state.mode);
    const setMode = useStore((state) => state.setMode);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('mode') === 'view') {
            setMode('view');
        }
    }, [setMode]);

    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-gray-600">Loading...</div>}>
            {mode === 'welcome' && <WelcomeScreen />}
            {mode === 'edit' && <MainLayout />}
            {mode === 'view' && <ViewModeLayout />}
        </Suspense>
    );
}

export default App;
