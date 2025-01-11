import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const ModalPlaylist = ({ targetRef, isOpen, onClose, children }) => {
  const popoverRef = useRef(null);
  const [tooltip, setTooltip] = useState({ tooltipX: null, tooltipY: null });
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !targetRef.current.contains(event.target)
      ) {
        if (
          document
            .querySelector(".ant-modal-content")
            ?.contains(event.target) ||
          document.querySelector(".ant-modal-wrap")?.contains(event.target)
        ) {
          return null;
        }
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, targetRef, onClose]);
  useLayoutEffect(() => {
    if (isOpen && popoverRef.current) {
      const { height, width } = popoverRef.current.getBoundingClientRect();
      let tooltipX = 0;
      let tooltipY = 0;
      const targetRect = targetRef.current.getBoundingClientRect();
      tooltipX = window.innerWidth - targetRect.left;
      tooltipY = targetRect.bottom;
      setTooltip({ tooltipX: tooltipX, tooltipY: tooltipY });
    }
  }, [isOpen]);

  if (!isOpen || !targetRef.current) return null;
  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: tooltip.tooltipY, // Below the target
        right: tooltip.tooltipX, // Aligned with target
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "4px",
        zIndex: 999,
        // overflow: "hidden",
      }}
      className="primary-bg"
    >
      {children}
    </div>,
    document.body
  );
};

export default ModalPlaylist;
