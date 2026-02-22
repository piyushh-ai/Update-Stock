import React, { useState } from 'react'
import Header from '../header/Header'
import MobileMenu from '../menu/MobileMenu'
import { Outlet } from 'react-router'

const Menuhook = () => {
    const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div>
        <Header setMenuOpen={setMenuOpen} />
        <MobileMenu open={menuOpen} setOpen={setMenuOpen} />
        <Outlet/>
    </div>
  )
}

export default Menuhook