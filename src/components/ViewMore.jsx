import React ,{useRef, useState, useEffect}from 'react'
import icons from '../utils/icons'
import Modal from './Modals/Modal';
const ViewMore = ({content}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const buttonRef = useRef();
    return (
      <div className='relative'>
        <button  ref={buttonRef} onClick={() => setModalOpen(true)}>Open Modal</button>
        {/* <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} targetRef={buttonRef}>
          <h1>Modal Content ${content}</h1>
          <p>This is content inside the modal!</p>
        </Modal> */}
      </div>
    );
}

export default ViewMore
