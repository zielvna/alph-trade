"use client";

import { useStore } from "../store/store";
import { Snackbar } from "./Snackbar";

export const Snackbars: React.FC = () => {
  const { snackbars } = useStore();

  return (
    <div className="fixed bottom-0 left-0 m-4 flex flex-col gap-2">
      {snackbars.map(({ id, message, txId }) => (
        <Snackbar key={id} id={id} message={message} txId={txId} />
      ))}
    </div>
  );
};
