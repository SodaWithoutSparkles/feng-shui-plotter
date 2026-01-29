import { useStore } from './store/useStore';
import { MainLayout } from './components/layout/MainLayout';
import { WelcomeScreen } from './components/WelcomeScreen';

function App() {
    const mode = useStore((state) => state.mode);

    return (
        <>
            {mode === 'welcome' && <WelcomeScreen />}
            {mode === 'edit' && <MainLayout />}
        </>
    );
}

export default App;
