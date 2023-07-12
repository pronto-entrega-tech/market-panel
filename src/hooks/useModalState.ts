import { useCallback, useState } from 'react';

export type ModalState<T = unknown> = {
  isVisible: boolean;
  onDismiss: () => void;
  modalData: T | undefined;
};

export const useModalState = <T>() => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<T>();

  const state: ModalState<T> = {
    isVisible: isModalOpen,
    onDismiss: () => setModalOpen(false),
    modalData,
  };

  return [
    state,
    useCallback((modalData: T) => {
      setModalData(modalData);
      setModalOpen(true);
    }, []),
    useCallback(() => setModalOpen(false), []),
  ] as const;
};
