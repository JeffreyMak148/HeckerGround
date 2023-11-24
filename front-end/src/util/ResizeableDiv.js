import React, { useEffect, useRef } from "react";
import "./ResizeableDiv.css";

const ResizeableDiv = ({children, left, right, top, bottom, minHeight, maxHeight, setCurHeight}) => {
  const ref = useRef(null);
  const refLeft = useRef(null);
  const refTop = useRef(null);
  const refRight = useRef(null);
  const refBottom = useRef(null);

  useEffect(() => {
    const resizeableEle = ref.current;
    const styles = window.getComputedStyle(resizeableEle);
    let width = parseInt(styles.width, 10);
    let height = parseInt(styles.height, 10);
    let x = 0;
    let y = 0;

    // Right resize
    const onMouseMoveRightResize = (event) => {
      const dx = event.clientX - x;
      x = event.clientX;
      width = width + dx;
      resizeableEle.style.width = `${width}px`;
    };

    const onMouseUpRightResize = (event) => {
      document.removeEventListener("mousemove", onMouseMoveRightResize);
      document.removeEventListener("pointermove", onMouseMoveRightResize);
    };

    const onMouseDownRightResize = (event) => {
      x = event.clientX;
      resizeableEle.style.left = styles.left;
      resizeableEle.style.right = null;
      document.addEventListener("mousemove", onMouseMoveRightResize);
      document.addEventListener("mouseup", onMouseUpRightResize);
      document.addEventListener("pointermove", onMouseMoveRightResize);
      document.addEventListener("pointerup", onMouseUpRightResize);
    };

    // Top resize
    const onMouseMoveTopResize = (event) => {
        const dy = event.clientY - y;
        height = height - dy;
        
        y = event.clientY;

        if(!minHeight && !maxHeight) {
            resizeableEle.style.height = `${height}px`;
            setCurHeight(height);
            return;
        }

        if(!!minHeight) {
            if(height < minHeight) {
                height = minHeight;
            } else {
                resizeableEle.style.height = `${height}px`;
                setCurHeight(height);
            }
        }
        
        if(!!maxHeight) {
            if(height > maxHeight) {
                height = maxHeight;
            } else {
                resizeableEle.style.height = `${height}px`;
                setCurHeight(height);
            }
        }
    };

    const onMouseUpTopResize = (event) => {
      document.removeEventListener("mousemove", onMouseMoveTopResize);
      document.removeEventListener("pointermove", onMouseMoveTopResize);
    };

    const onMouseDownTopResize = (event) => {
      y = event.clientY;
      const styles = window.getComputedStyle(resizeableEle);
      resizeableEle.style.bottom = styles.bottom;
      resizeableEle.style.top = null;
      document.addEventListener("mousemove", onMouseMoveTopResize);
      document.addEventListener("mouseup", onMouseUpTopResize);
      document.addEventListener("pointermove", onMouseMoveTopResize);
      document.addEventListener("pointerup", onMouseUpTopResize);
    };

    // Bottom resize
    const onMouseMoveBottomResize = (event) => {
      const dy = event.clientY - y;
      height = height + dy;
      y = event.clientY;
      resizeableEle.style.height = `${height}px`;
    };

    const onMouseUpBottomResize = (event) => {
      document.removeEventListener("mousemove", onMouseMoveBottomResize);
      document.removeEventListener("pointermove", onMouseMoveBottomResize);
    };

    const onMouseDownBottomResize = (event) => {
      y = event.clientY;
      const styles = window.getComputedStyle(resizeableEle);
      resizeableEle.style.top = styles.top;
      resizeableEle.style.bottom = null;
      document.addEventListener("mousemove", onMouseMoveBottomResize);
      document.addEventListener("mouseup", onMouseUpBottomResize);
      document.addEventListener("pointermove", onMouseMoveBottomResize);
      document.addEventListener("pointerup", onMouseUpBottomResize);
    };

    // Left resize
    const onMouseMoveLeftResize = (event) => {
      const dx = event.clientX - x;
      x = event.clientX;
      width = width - dx;
      resizeableEle.style.width = `${width}px`;
    };

    const onMouseUpLeftResize = (event) => {
      document.removeEventListener("mousemove", onMouseMoveLeftResize);
      document.removeEventListener("pointermove", onMouseMoveLeftResize);
    };

    const onMouseDownLeftResize = (event) => {
      x = event.clientX;
      resizeableEle.style.right = styles.right;
      resizeableEle.style.left = null;
      document.addEventListener("mousemove", onMouseMoveLeftResize);
      document.addEventListener("mouseup", onMouseUpLeftResize);
      document.addEventListener("pointermove", onMouseMoveLeftResize);
      document.addEventListener("pointerup", onMouseUpLeftResize);
    };

    // Add mouse down event listener
    const resizerRight = refRight.current;
    resizerRight.addEventListener("mousedown", onMouseDownRightResize);
    resizerRight.addEventListener("pointerdown", onMouseDownRightResize);
    const resizerTop = refTop.current;
    resizerTop.addEventListener("mousedown", onMouseDownTopResize);
    resizerTop.addEventListener("pointerdown", onMouseDownTopResize);
    const resizerBottom = refBottom.current;
    resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
    resizerBottom.addEventListener("pointerdown", onMouseDownBottomResize);
    const resizerLeft = refLeft.current;
    resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);
    resizerLeft.addEventListener("pointerdown", onMouseDownLeftResize);

    return () => {
      resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
      resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
      resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
      resizerRight.removeEventListener("pointerdown", onMouseDownRightResize);
      resizerTop.removeEventListener("pointerdown", onMouseDownTopResize);
      resizerBottom.removeEventListener("pointerdown", onMouseDownBottomResize);
      resizerLeft.removeEventListener("pointerdown", onMouseDownLeftResize);
    };
  }, []);

  return (
    <div className="resizeable-container">
      <div ref={ref} className="resizeable">
        <div ref={refLeft} className={`resizer resizer-l ${left ? "enable" : "hide"}`}></div>
        <div ref={refTop} className={`resizer resizer-t ${top ? "enable" : "hide"}`}></div>
        <div ref={refRight} className={`resizer resizer-r ${right ? "enable" : "hide"}`}></div>
        <div ref={refBottom} className={`resizer resizer-b ${bottom ? "enable" : "hide"}`}></div>
        {children}
      </div>
    </div>
  );
}

export default ResizeableDiv;