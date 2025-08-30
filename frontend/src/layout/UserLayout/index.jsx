import React from 'react'
import NavbarComponent from '@/components/navbar';

function UserLayout({ children }) {
    return (
        <div>
            <NavbarComponent />
            {children}
        </div>
    )
}

export default UserLayout;