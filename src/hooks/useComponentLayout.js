import { useState, useCallback } from "react";

const useComponentLayout = () => {
  const [layout, setLayout] = useState(null);

  const onLayout = useCallback((event) => {
    const layout = event.nativeEvent.layout;
    setLayout(layout);
  }, []);

  return [layout, onLayout];
};

export default useComponentLayout;
// const Component = () => {
//   const [{ height, width, x, y }, onLayout] = useComponentLayout();
//   return <View onLayout={onLayout} />;
// };
