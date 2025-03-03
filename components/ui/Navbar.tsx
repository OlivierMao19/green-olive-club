
import { signIn, signOut, auth } from '@/auth'
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    return (
        <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
            <nav className="flex justify-between items-center">
                <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={144} height={30} />
                </Link>
                <div className="flex itms-center gap-5 text-black">
                    <Link href="/login">
                        <span className="cursor-pointer">Login</span>
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default Navbar