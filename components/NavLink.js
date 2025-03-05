export default function NavLink({ href, children }) {
    return (
        <a href={href} className="text-gray-800 hover:text-gray-600">
            {children}
        </a>
    );
}