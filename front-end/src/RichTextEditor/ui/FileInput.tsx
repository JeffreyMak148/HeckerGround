import { useCallback, useEffect, useRef, useState } from 'react';
import './Input.css';

type Props = Readonly<{
  'data-test-id'?: string;
  accept?: string;
  label: string;
  onChange: (files: FileList | null) => void;
  labelClassName?: string
  inputClassName?: string
  inputImage?: string | null
}>;

export default function FileInput({
  accept,
  label,
  onChange,
  'data-test-id': dataTestId,
  labelClassName,
  inputClassName,
  inputImage
}: Props): JSX.Element {

  const inputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const showInput = () => {
    if(!!inputRef) {
      inputRef.current?.click();
    }
  }
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
  }, []);

  const onDragDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if(event.dataTransfer !== null) {
      onChange(event.dataTransfer.files);
    }
  }, []);

  // const 

  useEffect(() => {
    const dragArea = dragAreaRef.current;
    if(dragArea !== null) {
      dragArea.addEventListener("dragover", onDragOver);
      dragArea.addEventListener("dragleave", onDragLeave);
      dragArea.addEventListener("drop", onDragDrop);
      return () => {
        dragArea.removeEventListener("dragover", onDragOver);
        dragArea.removeEventListener("dragleave", onDragLeave);
        dragArea.removeEventListener("drop", onDragDrop);
      }
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