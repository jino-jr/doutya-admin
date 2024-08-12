import React from 'react'

function layout({children}) {
  return (
    <div>
      
      <main>
      {/* <h1> THis a Layout </h1> */}
        {children}
      </main>
    </div>
  )
}

export default layout
