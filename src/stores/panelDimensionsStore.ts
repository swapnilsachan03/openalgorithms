import { create } from "zustand";

interface PanelRatiosState {
  detailsRatio: number;
  editorRatio: number;
  outputRatio: number;
  actions: {
    setDetailsRatio: (detailsRatio: number) => void;
    setEditorRatio: (editorRatio: number) => void;
    setOutputRatio: (outputRatio: number) => void;
  };
}

const usePanelRatiosStore = create<PanelRatiosState>()(set => ({
  detailsRatio: 1 / 3,
  editorRatio: 1 / 3,
  outputRatio: 1 / 3,
  actions: {
    setDetailsRatio: detailsRatio => set({ detailsRatio }),
    setEditorRatio: editorRatio => set({ editorRatio }),
    setOutputRatio: outputRatio => set({ outputRatio }),
  },
}));

export const useDetailsRatio = () =>
  usePanelRatiosStore(state => state.detailsRatio);

export const useEditorRatio = () =>
  usePanelRatiosStore(state => state.editorRatio);

export const useOutputRatio = () =>
  usePanelRatiosStore(state => state.outputRatio);

export const usePanelRatiosActions = () =>
  usePanelRatiosStore(state => state.actions);
