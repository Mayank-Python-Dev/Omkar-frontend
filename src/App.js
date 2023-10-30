import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./404";
import CompanyCategory from "./companyCategory";
import MyLayout from "./components/layout/DashLayout";
import Contract_with_farmers from "./contract/contract_with_farmers";
import Contract_with_investors from "./contract/contract_with_investors";
import Contract_with_rental from "./contract/contract_with_rental";
import Dashboard from "./dashboard";
import Developers from "./developers";
import DeveloperInvestorDetails from "./developers/owner-investor-contract-detail/[developersId]";
import DeveloperRentalDetails from "./developers/owner-rental-contract-detail/[rentalId]";
import AddFarmers from "./farmers/addFarmers";
import FarmersList from "./farmers/farmers_list";
import Farmers_property from "./farmers/farmers_property";
import FarmerDetails from "./farmers/farmers_property/[farmerId]";
import FarmerDetailForm from "./farmers/farmers_property/[farmerId]/contract_detail/[detailId]";
import GalaFreeAreaDetails from "./ghraphCharts/GalaFreeAreaDetails";
import AddInvestors from "./investors/addInvestors";
import Investors_list from "./investors/investors_list";
import InvestorGalaDetails from "./investors/investors_list/gala_details/[galaId]";
import InvestorRentalDetails from "./investors/investors_list/rental_details/[detailId]";
import Investors_property from "./investors/investors_property";
import InvestorDetails from "./investors/investors_property/[investorId]";
import InvestorDetailForm from "./investors/investors_property/[investorId]/contract_detail/[detailId]";
import LeaveAndLicense from "./leaveAndLicense";
import LeaveAndLicenceDetails from "./leaveAndLicense/[licenseId]";
import LeaveRequest from "./leaveRequests/LeaveRequest";
import Login from "./login";
import Main from "./Main";
import Notifications from "./notifications/Notifications";
import Profile from "./profile";
import Add_gala from "./property/add_gala";
import Add_warehouse from "./property/add_warehouse";
import All_property from "./property/all_property";
import AllPropertyDetail from "./property/all_property/[propertyId]";
import Total_galas from "./property/Total_galas";
import Total_ramaining_galas from "./property/Total_ramaining_galas";
import RenewContract from "./renewContract/RenewContract";
import ResetPassword from "./resetpassword/ResetPassword";
import CleaningPage from "./services/cleaning";
import ElectricityPage from "./services/electricity";
import RepairPage from "./services/repair";
import SecurityPage from "./services/security";
import ServiceDetails from "./services/serviceDetails";
import WaterSupplyPage from "./services/water_supply";
import CustomPaginationActionsTable from "./tenants";
import TenantsDetails from "./tenants/[tenantId]";
import TenantFormDetail from "./tenants/[tenantId]/contract_detail/[detailId]";


function App() {
  
 
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/" element={<Main />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/companyCategory" element={<CompanyCategory />} />
          <Route path="/profile" element={
            <MyLayout>
              <Profile />
            </MyLayout>
          }
          />
          <Route path="/dashboard" element={
            <MyLayout>
              <Dashboard />
            </MyLayout>
          } />
          <Route path="/tenants" element={
            <MyLayout>
              <CustomPaginationActionsTable />
            </MyLayout>
          }
          />
          <Route path="/tenants/:slug" element={
            <MyLayout>
              <TenantsDetails />
            </MyLayout>
          }
          />
          <Route path="/tenants/:slug/contract_detail/:id" element={
            <MyLayout>
              <TenantFormDetail />
            </MyLayout>
          }
          />
          <Route path="/leaveAndLicense" element={
            <MyLayout>
              <LeaveAndLicense />
            </MyLayout>
          }
          />
          <Route path="/leaveAndLicense/:slug" element={
            <MyLayout>
              <LeaveAndLicenceDetails/>
            </MyLayout>
          }
          />
          <Route path="/investors/addInvestors" element={
            <MyLayout>
              <AddInvestors />
            </MyLayout>
          }
          />
          <Route path="/investors/investors_list" element={
            <MyLayout>
              <Investors_list />
            </MyLayout>
          }
          />
          <Route path="/investors/investors_list/rental_details/:slug" element={
            <MyLayout>
              <InvestorRentalDetails />
            </MyLayout>
          }
          />
          <Route path="/investors/investors_list/gala_details/:slug" element={
            <MyLayout>
              <InvestorGalaDetails/>
            </MyLayout>
          }
          />
          <Route path="/investors/investors_property" element={
            <MyLayout>
              <Investors_property />
            </MyLayout>
          }
          />
           <Route path="/investors/investors_property/:slug" element={
            <MyLayout>
              <InvestorDetails />
            </MyLayout>
          }
          />
           <Route path="/investors/investors_property/:slug/contract_detail/:id" element={
            <MyLayout>
              <InvestorDetailForm />
            </MyLayout>
          }
          />
           <Route path="/farmers/addFarmers" element={
            <MyLayout>
              <AddFarmers/>
            </MyLayout>
          }
          />
          <Route path="/farmers/farmers_list" element={
            <MyLayout>
              <FarmersList/>
            </MyLayout>
          }
          />
          <Route path="/farmers/farmers_property" element={
            <MyLayout>
              <Farmers_property />
            </MyLayout>
          }
          />
          <Route path="/farmers/farmers_property/:slug/:id" element={
            <MyLayout>
          
              <FarmerDetails />
            </MyLayout>
          }
          />
          <Route path="/farmers/farmers_property/:slug/contract_detail/:id" element={
            <MyLayout>
                 <FarmerDetailForm />
            </MyLayout>
          }
          />
          <Route path="/developers" element={
            <MyLayout>
              <Developers />
            </MyLayout>
          }
          />
          <Route path="/developers/owner-investor-contract-detail/:slug" element={
            <MyLayout>
              <DeveloperInvestorDetails />
            </MyLayout>
          }
          />
          <Route path="/developers/owner-rental-contract-detail/:slug" element={
            <MyLayout>
              <DeveloperRentalDetails />
            </MyLayout>
          }
          />
          <Route path="/property/add_warehouse" element={
            <MyLayout>
              <Add_warehouse />
            </MyLayout>
          }
          />
          <Route path="/property/add_gala" element={
            <MyLayout>
              <Add_gala />
            </MyLayout>
          }
          />
          <Route path="/property/all_property" element={
            <MyLayout>
              <All_property />
            </MyLayout>
          }
          />
           <Route path="/property/all_property/:slug" element={
            <MyLayout>
              <AllPropertyDetail/>
            </MyLayout>
          }
          />
          <Route path="/services/electricity" element={
            <MyLayout>
              <ElectricityPage />
            </MyLayout>
          }
          />
           <Route path="/services/electricity/:slug" element={
            <MyLayout>
              <ServiceDetails/>
            </MyLayout>
          }
          />
           <Route path="/services/cleaning" element={
            <MyLayout>
              <CleaningPage />
            </MyLayout>
          }
          />
          <Route path="/services/cleaning/:slug" element={
            <MyLayout>
              <ServiceDetails/>
            </MyLayout>
          }
          />
         <Route path="/services/security" element={
            <MyLayout>
              <SecurityPage />
            </MyLayout>
          }
          />
          <Route path="/services/security/:slug" element={
            <MyLayout>
               <ServiceDetails/>
            </MyLayout>
          }
          />
          <Route path="/services/water_supply" element={
            <MyLayout>
              <WaterSupplyPage />
            </MyLayout>
          }
          />
          <Route path="/services/water_supply/:slug" element={
            <MyLayout>
                <ServiceDetails/>
            </MyLayout>
          }
          />
          <Route path="/services/repair" element={
            <MyLayout>
              <RepairPage />
            </MyLayout>
          }
          />
             <Route path="/services/repair/:slug" element={
            <MyLayout>
                <ServiceDetails/>
            </MyLayout>
          }
          />
          <Route path="/contract/contract_with_investors" element={
            <MyLayout>
              <Contract_with_investors />
            </MyLayout>
          }
          />
          <Route path="/contract/contract_with_farmers" element={
            <MyLayout>
              <Contract_with_farmers />
            </MyLayout>
          }
          />
          <Route path="/contract/contract_with_rental" element={
            <MyLayout>
              <Contract_with_rental />
            </MyLayout>
          }
          />
           <Route path="/notifications" element={
            <MyLayout>
              <Notifications/>
            </MyLayout>
          }
          />
          <Route path="/leave_request" element={
            <MyLayout>
              <LeaveRequest/>
            </MyLayout>
          }
          />
           <Route path="/renew_contract" element={
            <MyLayout>
              <RenewContract/>
            </MyLayout>
          }
          />
           <Route path="/total_galas" element={
            <MyLayout>
              <Total_galas/>
            </MyLayout>
          }
          />
           <Route path="/total_remaining_galas" element={
            <MyLayout>
              <Total_ramaining_galas/>
            </MyLayout>
          }
          />
          <Route path="/gala_area_details/:slug1/:slug2" element={
            <MyLayout>
              <GalaFreeAreaDetails/>
            </MyLayout>
          }
          />
           <Route path="/reset_password/:slug1/:slug2" element={<ResetPassword/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;





