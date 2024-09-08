import React from "react";
import { useNavigate as useNavigateOriginal } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";

type RouterUtilsContextType = {
  navigateRef: React.MutableRefObject<NavigateFunction> | null;
};
const RouterUtilsContext = React.createContext<RouterUtilsContextType>({
  navigateRef: null,
});

export const RouterUtils: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigateOriginal();

  // useRef retains object reference between re-renders
  const navigateRef = React.useRef(navigate);

  navigateRef.current = navigate;

  // contextValue never changes between re-renders since refs don't change between re-renders
  const contextValue = React.useMemo(() => {
    return { navigateRef };
  }, [navigateRef]);

  // since contextValue never changes between re-renders, components/hooks using this context
  // won't re-render when router context updates
  return (
    <RouterUtilsContext.Provider value={contextValue}>
      {children}
    </RouterUtilsContext.Provider>
  );
};

export const useNavigateNoUpdates = () => {
  const { navigateRef } = React.useContext(RouterUtilsContext);
  if (navigateRef === null) {
    throw new Error(
      "RouterUtils context should be added to the React tree right below BrowserRouter for useNavigateNoUpdates hook to work. If you need router in tests or stories, please use WrappedMemoryRouter utility."
    );
  }
  return navigateRef.current;
};
