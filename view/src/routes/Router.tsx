import {Routes, Route} from "react-router-dom"
import Coin from "../pages/CoinDetails"
import Dashboard from "../pages/Dashboard"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import Profile from "../pages/Profile"
import Account from "../pages/Account"
import Portfolio from "../pages/Portfolio"
import Orders from "../pages/Orders"
import WalletTransactions from "../pages/Transactions"
import Landing from "../pages/Landing"
import PublicOnlyRoutes from "./PublicOnlyRoutes"
import ProtectedRoutes from "./ProtectedRoutes"
import PaperDepositPage from "../pages/PaperDeposit"
import RealDeposit from "../pages/RealDeposit"
import Settings from "../pages/Setting"
import VerifyAccount from "../pages/AccountVerify"

function Router(){
    return(
        <Routes>
            <Route path="/" element= {<Landing/>} />
            <Route path='/market' element={<Dashboard />} />
            <Route path= "/coin/:coinSymbol" element = {<Coin />} />
            <Route path="/login" element={<PublicOnlyRoutes><Login /></PublicOnlyRoutes>} />
            <Route path= "/signup" element={<PublicOnlyRoutes><Signup /></PublicOnlyRoutes>} />
            <Route path='/profile' element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
            <Route path='/account' element={<ProtectedRoutes><Account /></ProtectedRoutes>} />
            <Route path='/portfolio/:accountType' element={<ProtectedRoutes><Portfolio /></ProtectedRoutes>} />
            <Route path='/orders' element={<ProtectedRoutes><Orders /></ProtectedRoutes>} />
            <Route path='/history' element={<ProtectedRoutes><WalletTransactions /></ProtectedRoutes>} />
            <Route path='/deposit/PAPER' element={<ProtectedRoutes><PaperDepositPage /></ProtectedRoutes>}></Route>
            <Route path='/deposit/REAL' element={<ProtectedRoutes><RealDeposit /></ProtectedRoutes>}></Route>
            {/* <Route path='/setting' element={<ProtectedRoutes><Settings /></ProtectedRoutes>} /> */}
            <Route path="/verify" element={ <ProtectedRoutes><VerifyAccount /></ProtectedRoutes>} />
        </Routes>
    )
}

export default Router