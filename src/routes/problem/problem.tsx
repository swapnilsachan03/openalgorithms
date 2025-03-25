import { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./problem.scss";

import { useWindowSize } from "@/hooks/useWindowSize";
import {
  useDetailsRatio,
  useEditorRatio,
  useOutputRatio,
  usePanelRatiosActions,
} from "@/stores/panelDimensionsStore";

type Props = {};

const Problem = (props: Props) => {
  const { slug } = useParams();
  const { width } = useWindowSize();

  const containerRef = useRef<HTMLDivElement>(null);

  const parentWidth = containerRef.current?.offsetWidth ?? width;

  const detailsRatio = useDetailsRatio();
  const editorRatio = useEditorRatio();
  const outputRatio = useOutputRatio();

  const { setDetailsRatio, setEditorRatio, setOutputRatio } =
    usePanelRatiosActions();

  const detailsWidth = detailsRatio * parentWidth;
  const editorWidth = editorRatio * parentWidth;
  const outputWidth = outputRatio * parentWidth;

  const [isDragging, setIsDragging] = useState<number | null>(null);

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
          parentWidth - newDetailsWidth - outputWidth
        );

        setDetailsRatio(newDetailsWidth / parentWidth);
        setEditorRatio(newEditorWidth / parentWidth);
      } else if (isDragging === 2) {
        const newEditorWidth = Math.max(
          400,
          Math.min(x - detailsWidth, parentWidth - detailsWidth - 400)
        );
        const newoutputWidth = parentWidth - detailsWidth - newEditorWidth;

        setEditorRatio(newEditorWidth / parentWidth);
        setOutputRatio(newoutputWidth / parentWidth);
      }
    },
    [isDragging, parentWidth, detailsWidth, outputWidth]
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
