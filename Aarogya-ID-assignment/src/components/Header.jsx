import React from 'react'

const Header = () => {
  return (
    <div className="h-10vh bg-white flex justify-start items-center z-50 text-white sticky px-24">
        <img src="/National_Health_Authority.svg" alt="National Health Authority" width="150px"/> {/* Added w-auto class */}
        <img src='./tree.svg'></img>
    </div>
  )
}

export default Header
