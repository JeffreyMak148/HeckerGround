import React, { useEffect, useRef } from "react";
import "./ResizeableDiv.css";

interface ResizeableDivProps {
  children: React.ReactNode;
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
  minHeight?: number;
  maxHeight?: number;
  setCurHeight: React.Dispatch<React.SetStateAction<number>>;
}

const ResizeableDiv = ({children, left, right, top, bottom, minHeight, maxHeight, setCurHeight}: ResizeableDivProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const refLeft = useRef<HTMLDivElement>(null);
  const refTop = useRef<HTMLDivElement>(null);
  const refRight = useRef<HTMLDivElement>(null);
  const refBottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeableEle = ref.current as HTMLDivElement;
    const styles = window.getComputedStyle(resizeableEle);
    let width = parseInt(styles.width, 10);
    let height = parseInt(styles.height, 10);
    let x = 0;
    let y = 0;

    // Right resize
    const onMouseMoveRightResize = (event: MouseEvent) => {
      const dx = event.clientX - x;
      x = event.clientX;
      width = width + dx;
      resizeableEle.style.width = `${width}px`;
    };

    const onMouseUpRightResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveRightResize);
      document.removeEventListener("pointermove", onMouseMoveRightResize);
    };

    const onMouseDownRightResize = (event: MouseEvent) => {
      x = event.clientX;
      resizeableEle.style.left = styles.left;
      resizeableEle.style.right = "";
      document.addEventListener("mousemove", onMouseMoveRightResize);
      document.addEventListener("mouseup", onMouseUpRightResize);
      document.addEventListener("pointermove", onMouseMoveRightResize);
      document.addEventListener("pointerup", onMouseUpRightResize);
    };

    // Top resize
    const onMouseMoveTopResize = (event: MouseEvent) => {
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

    const onMouseUpTopResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveTopResize);
      document.removeEventListener("pointermove", onMouseMoveTopResize);
    };

    const onMouseDownTopResize = (event: MouseEvent) => {
      y = event.clientY;
      const styles = window.getComputedStyle(resizeableEle);
      resizeableEle.style.bottom = styles.bottom;
      resizeableEle.style.top = "";
      document.addEventListener("mousemove", onMouseMoveTopResize);
      document.addEventListener("mouseup", onMouseUpTopResize);
      document.addEventListener("pointermove", onMouseMoveTopResize);
      document.addEventListener("pointerup", onMouseUpTopResize);
    };

    // Bottom resize
    const onMouseMoveBottomResize = (event: MouseEvent) => {
      const dy = event.clientY - y;
      height = height + dy;
      y = event.clientY;
      resizeableEle.style.height = `${height}px`;
    };

    const onMouseUpBottomResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveBottomResize);
      document.removeEventListener("pointermove", onMouseMoveBottomResize);
    };

    const onMouseDownBottomResize = (event: MouseEvent) => {
      y = event.clientY;
      const styles = window.getComputedStyle(resizeableEle);
      resizeableEle.style.top = styles.top;
      resizeableEle.style.bottom = "";
      document.addEventListener("mousemove", onMouseMoveBottomResize);
      document.addEventListener("mouseup", onMouseUpBottomResize);
      document.addEventListener("pointermove", onMouseMoveBottomResize);
      document.addEventListener("pointerup", onMouseUpBottomResize);
    };

    // Left resize
    const onMouseMoveLeftResize = (event: MouseEvent) => {
      const dx = event.clientX - x;
      x = event.clientX;
      width = width - dx;
      resizeableEle.style.width = `${width}px`;
    };

    const onMouseUpLeftResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveLeftResize);
      document.removeEventListener("pointermove", onMouseMoveLeftResize);
    };

    const onMouseDownLeftResize = (event: MouseEvent) => {
      x = event.clientX;
      resizeableEle.style.right = styles.right;
      resizeableEle.style.left = "";
      document.addEventListener("mousemove", onMouseMoveLeftResize);
      document.addEventListener("mouseup", onMouseUpLeftResize);
      document.addEventListener("pointermove", onMouseMoveLeftResize);
      document.addEventListener("pointerup", onMouseUpLeftResize);
    };

    // Add mouse down event listener
    const resizerRight = refRight.current;
    if(resizerRight !== null) {
      resizerRight.addEventListener("mousedown", onMouseDownRightResize);
      resizerRight.addEventListener("pointerdown", onMouseDownRightResize);
    }
    const resizerTop = refTop.current;
    if(resizerTop !== null) {
      resizerTop.addEventListener("mousedown", onMouseDownTopResize);
      resizerTop.addEventListener("pointerdown", onMouseDownTopResize);
    }
    const resizerBottom = refBottom.current;
    if(resizerBottom !== null) {
      resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
      resizerBottom.addEventListener("pointerdown", onMouseDownBottomResize);
    }
    const resizerLeft = refLeft.current;
    if(resizerLeft !== null) {
      resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);
      resizerLeft.addEventListener("pointerdown", onMouseDownLeftResize);
    }

    return () => {
      if(resizerRight !== null) {
        resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
        resizerRight.removeEventListener("pointerdown", onMouseDownRightResize);
      }
      
      if(resizerTop !== null) {
        resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
        resizerTop.removeEventListener("pointerdown", onMouseDownTopResize);
      }
      
      if(resizerBottom !== null) {
        resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
        resizerBottom.removeEventListener("pointerdown", onMouseDownBottomResize);
      }
      
      if(resizerLeft !== null) {
        resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
        resizerLeft.removeEventListener("pointerdown", onMouseDownLeftResize);
      }
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