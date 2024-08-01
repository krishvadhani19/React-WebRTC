import { SocketContext } from "@/contexts/SocketContext";
import { memo, ReactNode, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContextProvider = (props: { children: ReactNode }) => {
  const socket = useMemo(() => {
    console.log("New connection");
    return io("localhost:8000");
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props?.children}
    </SocketContext.Provider>
  );
};

export default memo(SocketContextProvider);
