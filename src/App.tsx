import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoutes from './components/shared/ProtectedRoutes';
import { AuthPage } from './pages/AuthPage';
import MaterialRequests from './pages/MaterialRequest';
import PublicRoutes from './components/shared/PublicRoutes';
import useAuthStore from './store/useAuthStore';
import { useEffect } from 'react';

function App() {

	const initAuth = useAuthStore((s) => s.initAuth)
	useEffect(() => {
		initAuth();
	}, [initAuth]);

	return (
		<>
			<Routes>
				<Route path="/" element={
					<ProtectedRoutes>
						<MaterialRequests />
					</ProtectedRoutes>}
				/>
				<Route path="/auth" element={
					<PublicRoutes>
						<AuthPage />
					</PublicRoutes>}
				/>
			</Routes>
		</>
	)
}

export default App
