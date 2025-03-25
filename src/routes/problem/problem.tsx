import { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./problem.scss";

import { getWindowDimensions } from "@/utils/common";

type Props = {};

const Problem = (props: Props) => {
  const { slug } = useParams();
  const { width } = getWindowDimensions();

  const [detailsWidth, setDetailsWidth] = useState(width / 3);
  const [editorWidth, setEditorWidth] = useState(width / 3);
  const [outputWidth, setOutputWidth] = useState(width / 3);

  const [isDragging, setIsDragging] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((index: number) => {
    setIsDragging(index);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging === null || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - containerRect.left;

      if (isDragging === 1) {
        const newDetailsWidth = Math.max(400, x);
        const newEditorWidth = Math.max(
          400,
          width - newDetailsWidth - outputWidth
        );

        setDetailsWidth(newDetailsWidth);
        setEditorWidth(newEditorWidth);
      } else if (isDragging === 2) {
        const newEditorWidth = Math.max(
          400,
          Math.min(x - detailsWidth, width - detailsWidth - 400)
        );
        const newoutputWidth = width - detailsWidth - newEditorWidth;

        setEditorWidth(newEditorWidth);
        setOutputWidth(newoutputWidth);
      }
    },
    [isDragging, width, detailsWidth, outputWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="problem_container" ref={containerRef}>
      <div className="problem_details_pane" style={{ width: detailsWidth }}>
        {slug}
        <div
          className={`resize_handle ${isDragging === 1 ? "dragging" : ""}`}
          onMouseDown={() => handleMouseDown(1)}
        />
      </div>

      <div className="editor_pane" style={{ minWidth: editorWidth }}>
        <div
          className={`resize_handle ${isDragging === 2 ? "dragging" : ""}`}
          onMouseDown={() => handleMouseDown(2)}
        />
      </div>

      <div className="judging_pane" style={{ minWidth: outputWidth }}></div>
    </div>
  );
};

export default Problem;
