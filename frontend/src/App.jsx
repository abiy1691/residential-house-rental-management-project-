
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './layout/Layout';
import ForgetPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import StepperForm from './owner/CreateHouses';
import UpgradeToOwner from './pages/UpgradeToOwner';
import { ProtectedRoutes } from './components/ProtectedRoutes';
import EditOwner from './pages/EditOwner';
import { Houses } from './owner/Houses';
import { SingleHouse } from './owner/House';
import AllHouses from './pages/Showmore';
import DetailsHouses from './pages/DetailsHouses';
import CreateTenants from './owner/CreateTenants';
import ShowTenant from './owner/ShowTenant';
import { EditHouse } from './owner/EditHouse';
import { EditImages } from './owner/EditImages';
import { EditHouseAddress } from './owner/EditAddress';
import { EditBankAccounts } from './owner/EditBankAccount';
import { TenantProfile } from './tenant/TenantProfile';
import { Maintenance } from './tenant/Maintenance';
import { useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo } from 'react';
import { OwnerMaintenance } from './owner/Maintenance';
import Tenant from './owner/Tenant';
import { DetailHouse2 } from './pages/DetailPage2';
import OwnerProfile from './tenant/OwnerProfile';
import MyRequests from './pages/MyRequests';
import { VisitorRequests } from './owner/VisitorRequests';
import PayRent from './tenant/PayRent'
import PaymentHistory from './tenant/PaymentHistory';
import OwnerPaymentHistory from './owner/PaymentHistory'
import Contact from './pages/static-pages/Contact';
import Service from './pages/static-pages/Service';
import About from './pages/static-pages/About';


// The default 404 should be done for the route
function App() {
  const queryClient = new QueryClient();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <>

      <ToastContainer className='top-[75px]' />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/signup" element={<Signup />} />

              <Route path="/login" element={<Login />} />
              <Route path="/forget" element={<ForgetPassword />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />

              <Route path='/owner/' element={<ProtectedRoutes role='owner' />}>
                <Route index element={<Houses />} />
                <Route path="create-house" element={<StepperForm />} />
                <Route path="show-tenant" element={<ShowTenant />} />

              <Route path='edit' element={<EditOwner />} />
              <Route path='maintenance' element={<OwnerMaintenance />} />
              <Route path='visitors' element={<VisitorRequests />} />
              <Route path='payments' element={<OwnerPaymentHistory />} />
              <Route path=':houseid' element={<SingleHouse />} />
              <Route path=':houseid/create-tenants' element={<CreateTenants />} />
              <Route path=':houseid/edit/general' element={<EditHouse />} />
              <Route path=':houseid/edit/images' element={<EditImages />} />
              <Route path=':houseid/edit/address' element={<EditHouseAddress />} />
              <Route path=':houseid/edit/bank' element={<EditBankAccounts />} />
              <Route path='tenant/:tenantid' element={<Tenant />} />
            </Route>


              <Route path="/" element={<Layout />}>
                {/* payment routes */}
                {/* <Route path="/payment-options" element={<paymentOpi/>} /> */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/service" element={<Service />} />
                <Route path="/about" element={<About/>} />



                <Route index element={<Home />} />
                <Route path="/houses" element={<AllHouses />} />
                <Route path="/houses/:houseid" element={<DetailHouse2 />} />
                <Route path="/details" element={<DetailsHouses />} />
                <Route path='user/:id' element={<Profile />} />

                <Route path='profile/' element={<ProtectedRoutes />}>
                  <Route index element={<Profile />} />
                  <Route path='edit' element={<EditProfile />} />
                  <Route path='upgrade' element={<UpgradeToOwner />} />
                  <Route path='requests' element={<MyRequests />} />
                </Route>

              <Route path='tenant/' element={<ProtectedRoutes role='tenant'/>}>
                <Route index element={<TenantProfile />}/>
                <Route path='edit' element={<CreateTenants edit={true} />}/>
                <Route path='maintenance' element={<Maintenance />}/>
                <Route path='owner' element={<OwnerProfile />}/>
                <Route path='payrent' element={<PayRent />}/>
                <Route path='history' element={<PaymentHistory />}/>
              </Route>
            </Route>

            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
      {/* </UserProvider> */}
    </>
  );
}

export default App;
