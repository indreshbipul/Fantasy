import Router from './routes/Router'
import Navbar from "./components/Navbar"
import Loader from "./components/Loader"
import useAuth from './hooks/useAuth'
import { Toast } from './components/toast'
import SuccessCard from './components/SucessCard'

function App() {  
  const { loading, context_Error, setContext_Error, context_Ok, setContext_Ok } = useAuth(); 

  if(loading){
        return <Loader />
  }

  return (
    <>
      <div className='min-h-screen w-full relative'>
        <Navbar />
        
        <div className='bg-gray-100 pt-20'>
            <Router />
        </div>

        {/* --- Global Toast Notifications Container --- */}
        <div className="min-w-[320px] fixed bottom-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
            
            {/* 1. Global Error Toast */}
            {context_Error && (
                <Toast 
                    title={context_Error.req || "Error"}
                    message={context_Error.message}
                    type={"error"}
                    onClose={() => setContext_Error(null)}
                />
            )}
        </div>
        {/* 2. Global Success Toast */}
            {context_Ok && (
              <SuccessCard
                  isOpen={true}
                  onClose={() => setContext_Ok(null)}
                  title={context_Ok.req || "Success"}
                  message={context_Ok.message}/>
            )}
      </div>
    </>
  )
}

export default App