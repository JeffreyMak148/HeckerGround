import { useCallback, useEffect, useRef, useState } from 'react';
import './Input.css';

export default function FileInput({
  accept,
  label,
  onChange,
  'data-test-id': dataTestId,
  labelClassName,
  inputClassName,
  inputImage
}) {

  const inputRef = useRef(null);
  const dragAreaRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const showInput = () => {
    if(!!inputRef) {
      inputRef.current.click();
    }
  }
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((event) => {
    event.preventDefault();
    setDragging(false);
  }, []);

  const onDragDrop = useCallback((event) => {
    event.preventDefault();
    setDragging(false);
    onChange(event.dataTransfer.files);
  }, []);

  // const 

  useEffect(() => {
    const dragArea = dragAreaRef.current;
    dragArea.addEventListener("dragover", onDragOver);
    dragArea.addEventListener("dragleave", onDragLeave);
    dragArea.addEventListener("drop", onDragDrop);
    return () => {
      dragArea.removeEventListener("dragover", onDragOver);
      dragArea.removeEventListener("dragleave", onDragLeave);
      dragArea.removeEventListener("drop", onDragDrop);
    }
  }, [onDragOver, onDragLeave, onDragDrop]);

  return (
    <div className="Input__wrapper">
      <label className={`Input__label ${labelClassName || ""}`}>{label}</label>
      <div 
        className={`Input__field ${inputClassName || ""} ${dragging ? "active" : ""}`}
        ref={dragAreaRef}
        onClick={showInput}>
        {
          !!inputImage ? 
            <img className="Input__img" src={inputImage} />
          :
            <span>Upload or Drag and Drop</span>
        }
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className={`Input__file__input`}
        onChange={(e) => onChange(e.target.files)}
        data-test-id={dataTestId}
      />
    </div>
  );
}