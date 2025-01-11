import React from 'react'
import icons from '../utils/icons'
import Link from 'antd/es/typography/Link'
const Header = ({title, url}) => {
  return (
    <div className='flex items-center justify-between mt-[48px]'>
      <h3 className="text-[20px] font-bold  primary-text mb-5">
          {title}
        </h3>
        <Link to={url} className=" flex items-center secondary-text view-all">
            <span className="   text-[12px] font-medium uppercase text-inherit">
            tất cả
            </span>
            <icons.arrowRight className="text-inherit text-[16px] ml-1"></icons.arrowRight>
        </Link>
    </div>
  )
}

export default Header
