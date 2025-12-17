import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Login';
import DanhSachCLB from './pages/DanhSachCLB';
import ChiTietCLB from './pages/ChiTietCLB';
import ThemCLB from './pages/ThemCLB';
import SuaCLB from './pages/SuaCLB';
import ThongKeCLB from './pages/ThongKeCLB';
import DemoTransaction from './pages/DemoTransaction';
import ThemDoiNhom from './pages/ThemDoiNhom';
import ThemDoiNhomStandalone from './pages/ThemDoiNhomStandalone';
import SuaDoiNhom from './pages/SuaDoiNhom';
import DanhSachDoiNhom from './pages/DanhSachDoiNhom';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public route - Login */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB', 'HoTro', 'ThongKe']}>
                      <DanhSachCLB />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/clb/:MaCLB" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB', 'HoTro', 'ThongKe']}>
                      <ChiTietCLB />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/clb/them" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB', 'HoTro']}>
                      <ThemCLB />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/clb/sua/:MaCLB" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB', 'HoTro']}>
                      <SuaCLB />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/clb/thongke" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB', 'HoTro', 'ThongKe']}>
                      <ThongKeCLB />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/clb/demo-transaction" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB']}>
                      <DemoTransaction />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              {/* Đội Nhóm Routes */}
              <Route 
                path="/doinhom" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB', 'HoTro', 'ThongKe']}>
                      <DanhSachDoiNhom />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/doinhom/them" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB', 'HoTro']}>
                      <ThemDoiNhomStandalone />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/clb/:MaCLB/doinhom/them" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB', 'HoTro']}>
                      <ThemDoiNhom />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/doinhom/sua/:MaDoi" 
                element={
                  <PrivateRoute>
                    <ProtectedRoute allowedRoles={['Admin', 'QLCLB', 'HoTro']}>
                      <SuaDoiNhom />
                    </ProtectedRoute>
                  </PrivateRoute>
                } 
              />
              
              {/* Redirect unknown paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

