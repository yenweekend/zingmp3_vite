import React from 'react'
import icons from '../utils/icons'
import { Link } from 'react-router-dom'
const ViewAllLink = ({url}) => {
  return (
    <Link to={url} className=" flex items-center secondary-text view-all">
        <span className="   text-[12px] font-medium uppercase text-inherit">
        tất cả
        </span>
    <icons.arrowRight className="  text-inherit text-[16px] ml-1"></icons.arrowRight>
  </Link>
  )
}

export default ViewAllLink
