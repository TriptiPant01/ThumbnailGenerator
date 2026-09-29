import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link,  useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";

export default function Navbar() {
    const { isLoggedIn, user,logout  } = UseAuth()
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()

    console.log({isLoggedIn, user})
    return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to='/'>
                  <img className="h-8.5 w-auto" src="/assets/logo.svg" alt="logo" width={130} height={34} />

                </Link>

                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    <Link to='/' className="hover:text-pink-500 transition">Home</Link>
                    <Link to='/generate' className="hover:text-pink-500 transition">Generate</Link>
                    <Link to='/my-generations' className="hover:text-pink-500 transition">My Generations</Link>
                    <Link to='#' className="hover:text-pink-500 transition">My Contact</Link>
                </div>

                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <div className="relative group">
                            <button className="rounded-full size-8 bg-white/20 border-2 border-white/10">
                                { user?.name.charAt(0).toUpperCase()}
                            </button>
                            <div className="absolute hidden group-hover:block top-6 right-0 pt-4">
                                <button onClick={()=> logout()} className="bg-white/20 border-2 border-white/10 px-5 py-1.5">Logout</button>
                            </div>
                    </div>
                    ) :
                        <button onClick={() => navigate('/login')} className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full">Get Started</button>}

                </div>
       
                <button onClick={() => setIsOpen(true)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </motion.nav>

            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Link onClick={() => setIsOpen(false)} to='/'>Home</Link>
                <Link onClick={() => setIsOpen(false)} to='/generate'>Generate</Link>
                <Link>
                    {  isLoggedIn ?
                          <Link onClick={() => setIsOpen(false)} to='/my-generations'>My Generations</Link> : <Link onClick={() => setIsOpen(false)} to='/#'>About</Link>
                    }
                </Link>
                <Link onClick={() => setIsOpen(false)} to='#'>Contact Us</Link>
                {isLoggedIn ? <button onClick={() => { setIsOpen(false); logout()}}>Logout</button> : <Link onClick={() => setIsOpen(false)} to='/'>Login</Link>}
               
                <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}